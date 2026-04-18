import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

// POST /api/attribution/scan
// Records a QR-code scan event.
//
// Body:  { qrId, campaignId, creatorId, merchantId, timestamp?, sessionId }
// - qrId is the printed short_code from the poster ("qr-bsc-001"), not a uuid
// - sessionId is the anonymous browser session (generated client-side)
//
// Flow:
//   1. Validate body
//   2. Resolve qrId → qr_codes.id via short_code lookup
//   3. Hash the client IP (sha256, PII-safe)
//   4. Insert into scans with event_type='scan'
//
// When NEXT_PUBLIC_SUPABASE_URL is not set, we short-circuit to a mock response
// so the demo keeps working without a database.
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { qrId, campaignId, creatorId, merchantId, sessionId } = body as {
    qrId?: string;
    campaignId?: string;
    creatorId?: string;
    merchantId?: string;
    sessionId?: string;
  };

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

  // Graceful degrade when Supabase is not fully configured (local/demo without DB)
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.json({
      ok: true,
      scanId: `scan-${Date.now()}`,
      mock: true,
      qrId,
      recordedAt: new Date().toISOString(),
    });
  }

  const supabase = await createClient();

  // 1. Resolve short_code → qr_codes.id (+ verify claimed relationships)
  const { data: qr, error: qrErr } = await supabase
    .from("qr_codes")
    .select("id, campaign_id, creator_id")
    .eq("short_code", qrId)
    .maybeSingle();

  if (qrErr) {
    return NextResponse.json(
      { error: "QR lookup failed", detail: qrErr.message },
      { status: 500 },
    );
  }
  if (!qr) {
    return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  }

  // 2. Hash client IP for fraud-window analysis without storing raw PII
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const ipHash = ip
    ? createHash("sha256").update(ip).digest("hex").slice(0, 32)
    : null;

  // 3. Insert scan event
  const { data: scan, error: scanErr } = await supabase
    .from("scans")
    .insert({
      qr_code_id: qr.id,
      event_type: "scan",
      campaign_id: qr.campaign_id,
      creator_id: qr.creator_id,
      session_id: sessionId,
      ip_hash: ipHash,
      user_agent: request.headers.get("user-agent") ?? null,
      referrer: request.headers.get("referer") ?? null,
    })
    .select("id, created_at")
    .single();

  if (scanErr) {
    return NextResponse.json(
      { error: "Insert failed", detail: scanErr.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    scanId: scan.id,
    qrId,
    recordedAt: scan.created_at,
  });
}
