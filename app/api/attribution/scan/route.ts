import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import {
  verifyReceipt,
  haversineMeters,
  merchantNameSimilarity,
} from "@/lib/ai/vision";

// POST /api/attribution/scan
// Records a QR-code scan event and, when the merchant's pricing tier
// requires it, runs the three-layer AI verification:
//   1. QR scan (implicit — this very request)
//   2. Claude Vision OCR of the receipt (when receiptImageBase64 present)
//   3. Geo-match: scan coord vs merchant coord within 200m
//
// Body: {
//   qrId, campaignId, creatorId, merchantId, sessionId,
//   receiptImageBase64?, mediaType?, geoLat?, geoLng?,
// }
//
// Architecture:
//   This endpoint is a server-trusted writer. We use the service-role
//   key directly (bypassing RLS) because the API route itself validates
//   the request shape before inserting. The browser never sees this key.
//
//   When ANTHROPIC_API_KEY is not set, verifyReceipt() returns a
//   deterministic mock and the verdict logic runs identically — useful
//   for dev / CI without paid API access.
//
// Schemas:
//   supabase/migrations/20260412000001_creator_extended.sql  (qr_scans)
//   supabase/migrations/20260418000001_add_ai_verifications_and_agent_runs.sql
//     (ai_verifications)

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Verdict thresholds — tunable in P3 once we have production signal
const MERCHANT_NAME_CONFIDENCE_PASS = 0.85;
const GEO_MATCH_PASS_METERS = 200;
const VISION_CONFIDENCE_PASS = 0.75;

function isUuid(s: unknown): s is string {
  return typeof s === "string" && UUID_RE.test(s);
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) return null;
  return createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

type ScanBody = {
  qrId?: string;
  campaignId?: string;
  creatorId?: string;
  merchantId?: string;
  sessionId?: string;
  receiptImageBase64?: string;
  mediaType?: "image/png" | "image/jpeg" | "image/webp";
  geoLat?: number;
  geoLng?: number;
};

export async function POST(request: NextRequest) {
  let body: ScanBody;
  try {
    body = (await request.json()) as ScanBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    qrId,
    campaignId,
    creatorId,
    merchantId,
    sessionId,
    receiptImageBase64,
    mediaType,
    geoLat,
    geoLng,
  } = body;

  if (!qrId || !campaignId || !creatorId || !merchantId) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: qrId, campaignId, creatorId, merchantId",
      },
      { status: 400 },
    );
  }
  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing required field: sessionId" },
      { status: 400 },
    );
  }

  const client = getServiceClient();
  const idsReal = isUuid(creatorId) && isUuid(campaignId) && isUuid(merchantId);

  // Degrade to mock when service client cannot be built or IDs are demo slugs.
  // In that case we still run the verification layer (mock mode) so the
  // front-end can render the full flow without Supabase.
  if (!client || !idsReal) {
    const mockVerification = receiptImageBase64
      ? await runVerification({
          receiptBase64: receiptImageBase64,
          mediaType: mediaType ?? "image/jpeg",
          expectedMerchantName: "Sey Coffee",
          merchantLat: 40.7178,
          merchantLng: -73.9597,
          scanLat: geoLat,
          scanLng: geoLng,
        })
      : null;

    return NextResponse.json({
      ok: true,
      scanId: `scan-${Date.now()}`,
      mock: true,
      reason: !client ? "env_missing" : "demo_slug_ids",
      qrId,
      recordedAt: new Date().toISOString(),
      verification: mockVerification,
    });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const ipHash = ip
    ? createHash("sha256").update(ip).digest("hex").slice(0, 32)
    : null;

  // Step 1 — record the raw scan first so qr_scans.id exists for FK
  const { data: scanRow, error: scanErr } = await client
    .from("qr_scans")
    .insert({
      creator_id: creatorId,
      campaign_id: campaignId,
      scan_source: "qr",
      ip_hash: ipHash,
    })
    .select("id, scanned_at")
    .single();

  if (scanErr) {
    return NextResponse.json(
      { error: "Insert failed", detail: scanErr.message },
      { status: 500 },
    );
  }

  // Step 2 — if no receipt was uploaded, return early. Scan is recorded,
  // but without a verification row it won't flip to billable.
  if (!receiptImageBase64) {
    return NextResponse.json({
      ok: true,
      scanId: scanRow.id,
      qrId,
      recordedAt: scanRow.scanned_at,
      verification: null,
      note: "Scan logged without receipt. Upload a receipt to verify.",
    });
  }

  // Step 3 — load merchant location for geo-match
  const { data: merchant, error: merchantErr } = await client
    .from("merchants")
    .select("id, business_name, lat, lng")
    .eq("id", merchantId)
    .single();

  if (merchantErr || !merchant) {
    return NextResponse.json(
      { error: "Merchant not found", detail: merchantErr?.message },
      { status: 404 },
    );
  }

  // Step 4 — run the 3-layer verification (Vision + name match + geo)
  const verification = await runVerification({
    receiptBase64: receiptImageBase64,
    mediaType: mediaType ?? "image/jpeg",
    expectedMerchantName: merchant.business_name,
    merchantLat: merchant.lat ?? null,
    merchantLng: merchant.lng ?? null,
    scanLat: geoLat,
    scanLng: geoLng,
  });

  // Step 5 — persist verification row
  const { error: verifyErr } = await client.from("ai_verifications").insert({
    scan_id: scanRow.id,
    merchant_id: merchantId,
    scan_lat: geoLat ?? null,
    scan_lng: geoLng ?? null,
    vision_response: verification.vision,
    vision_model: verification.vision.meta.model,
    vision_latency_ms: verification.vision.meta.latency_ms,
    vision_cost_usd: verification.vision.meta.cost_usd,
    merchant_match_confidence: verification.merchantMatchConfidence,
    amount_extracted: verification.vision.amount_usd,
    geo_distance_meters: verification.geoDistanceMeters,
    verdict: verification.verdict,
    reviewed_by_human: false,
  });

  if (verifyErr) {
    // Verification write failed, but scan is already logged — return 207
    return NextResponse.json(
      {
        ok: false,
        scanId: scanRow.id,
        qrId,
        recordedAt: scanRow.scanned_at,
        verification: null,
        error: "Verification insert failed",
        detail: verifyErr.message,
      },
      { status: 207 },
    );
  }

  return NextResponse.json({
    ok: true,
    scanId: scanRow.id,
    qrId,
    recordedAt: scanRow.scanned_at,
    verification: {
      verdict: verification.verdict,
      merchantMatchConfidence: verification.merchantMatchConfidence,
      geoDistanceMeters: verification.geoDistanceMeters,
      amountUsd: verification.vision.amount_usd,
      model: verification.vision.meta.model,
      mock: verification.vision.meta.mock,
    },
  });
}

type VerificationArgs = {
  receiptBase64: string;
  mediaType: "image/png" | "image/jpeg" | "image/webp";
  expectedMerchantName: string;
  merchantLat: number | null;
  merchantLng: number | null;
  scanLat?: number;
  scanLng?: number;
};

async function runVerification(args: VerificationArgs) {
  const vision = await verifyReceipt({
    receiptBase64: args.receiptBase64,
    mediaType: args.mediaType,
    expectedMerchantName: args.expectedMerchantName,
  });

  const nameScore = merchantNameSimilarity(
    vision.merchant_name,
    args.expectedMerchantName,
  );

  const geoDistance =
    args.scanLat !== undefined &&
    args.scanLng !== undefined &&
    args.merchantLat !== null &&
    args.merchantLng !== null
      ? haversineMeters(
          args.scanLat,
          args.scanLng,
          args.merchantLat,
          args.merchantLng,
        )
      : null;

  const nameOk = nameScore >= MERCHANT_NAME_CONFIDENCE_PASS;
  const geoOk =
    geoDistance === null ? true : geoDistance <= GEO_MATCH_PASS_METERS;
  const confidenceOk = vision.confidence >= VISION_CONFIDENCE_PASS;
  const nameFullyUnmatched = nameScore < 0.35;

  let verdict:
    | "auto_verified"
    | "auto_rejected"
    | "manual_review"
    | "human_approved"
    | "human_rejected";

  if (nameOk && geoOk && confidenceOk) {
    verdict = "auto_verified";
  } else if (nameFullyUnmatched) {
    verdict = "auto_rejected";
  } else {
    verdict = "manual_review";
  }

  return {
    vision,
    merchantMatchConfidence: Number(nameScore.toFixed(2)),
    geoDistanceMeters: geoDistance,
    verdict,
  };
}
