import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// POST /api/attribution/scan
// Records a QR-code scan event.
//
// Body: { qrId, campaignId, creatorId, merchantId, timestamp?, sessionId }
//
// Behaviour:
//   • If creatorId and campaignId are real UUIDs AND Supabase env is set,
//     insert into public.qr_scans (the existing schema from 20260412000001).
//   • Otherwise — demo scans use string slugs like "demo-creator-001" —
//     return a mock-shaped success so /demo keeps working.
//
// Schema reference: supabase/migrations/20260412000001_creator_extended.sql
//   qr_scans (id, creator_id, campaign_id, scanned_at, scan_source, ip_hash, device_fingerprint)

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(s: unknown): s is string {
  return typeof s === "string" && UUID_RE.test(s);
}

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

  // Degrade to mock when env is unset or when IDs are demo slugs (not UUIDs)
  const envReady =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  const idsReal = isUuid(creatorId) && isUuid(campaignId);

  if (!envReady || !idsReal) {
    return NextResponse.json({
      ok: true,
      scanId: `scan-${Date.now()}`,
      mock: true,
      reason: !envReady ? "env_missing" : "demo_slug_ids",
      qrId,
      recordedAt: new Date().toISOString(),
    });
  }

  // Real path — insert into existing qr_scans table
  const supabase = await createServerSupabaseClient();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const ipHash = ip
    ? createHash("sha256").update(ip).digest("hex").slice(0, 32)
    : null;

  const { data, error } = await supabase
    .from("qr_scans")
    .insert({
      creator_id: creatorId,
      campaign_id: campaignId,
      scan_source: "qr",
      ip_hash: ipHash,
    })
    .select("id, scanned_at")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Insert failed", detail: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    scanId: data.id,
    qrId,
    recordedAt: data.scanned_at,
  });
}
