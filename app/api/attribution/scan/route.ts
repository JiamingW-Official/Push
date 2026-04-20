import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { serverError } from "@/lib/api/responses";
import { getIP, rateLimit } from "@/lib/rate-limit";

// POST /api/attribution/scan
// Records a QR-code scan event.
//
// Body: { qrId, campaignId, creatorId, merchantId, timestamp?, sessionId }
//
// Architecture:
//   This endpoint is a server-trusted writer. We use the service-role key
//   directly (bypassing RLS) because the API route itself validates the
//   request shape before inserting. The browser never sees this key.
//
//   Anonymous clients COULD write through the anon key with a permissive
//   INSERT policy, but Supabase's new `sb_publishable_*` keys don't appear
//   to map to the `anon` role in PostgREST the same way legacy JWT keys do,
//   and more importantly — server-trusted writes belong on the server.
//
// Schema: supabase/migrations/20260412000001_creator_extended.sql
//   qr_scans (id, creator_id, campaign_id, scanned_at, scan_source, ip_hash, device_fingerprint)

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(s: unknown): s is string {
  return typeof s === "string" && UUID_RE.test(s);
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return null;
  return createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(request: NextRequest) {
  // Rate limit — QR scan events feed creator commission calcs, so a
  // single attacker flooding this endpoint could inflate payouts.
  // 30 scans/min per IP is generous for a real customer in a cafe.
  const clientIp = getIP(request);
  if (!rateLimit(`scan:${clientIp}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

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

  const client = getServiceClient();
  const idsReal = isUuid(creatorId) && isUuid(campaignId);

  // Degrade to mock when service client cannot be built or IDs are demo slugs
  if (!client || !idsReal) {
    return NextResponse.json({
      ok: true,
      scanId: `scan-${Date.now()}`,
      mock: true,
      reason: !client ? "env_missing" : "demo_slug_ids",
      qrId,
      recordedAt: new Date().toISOString(),
    });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const ipHash = ip
    ? createHash("sha256").update(ip).digest("hex").slice(0, 32)
    : null;

  const { data, error } = await client
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
    return serverError("attribution-scan", error);
  }

  return NextResponse.json({
    ok: true,
    scanId: data.id,
    qrId,
    recordedAt: data.scanned_at,
  });
}
