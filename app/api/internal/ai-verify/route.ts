/**
 * POST /api/internal/ai-verify
 *
 * Internal endpoint that runs a single customer claim through the
 * AIVerificationService 3-layer pipeline (Vision + OCR + Geo) and returns
 * the decision. If `claim_id` is present, the result is also persisted
 * onto the `verified_customer_claims` row.
 *
 * Request body (all required except claim_id):
 *   {
 *     "merchant_id": "<uuid>",
 *     "creator_id":  "<uuid>",
 *     "customer_name": "<string>",
 *     "photo_url": "<url>",
 *     "receipt_url": "<url>",
 *     "merchant_lat": <number>,
 *     "merchant_lon": <number>,
 *     "customer_lat": <number>,
 *     "customer_lon": <number>,
 *     "claim_id":  "<uuid>"   // optional — when present, saveVerification runs
 *   }
 *
 * Response 200: { status, confidence_score, reasoning }
 * Response 400: missing or wrong-typed fields
 * Response 500: pipeline / DB error (e.g. verified_customer_claims not yet created)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  AIVerificationService,
  type VerifyClaimInput,
} from "@/lib/services/AIVerificationService";
import { serverError } from "@/lib/api/responses";
import { getIP, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Single shared instance — the service is stateless apart from the (currently
// mocked) sub-scorers, so reusing it avoids per-request allocation.
const aiService = new AIVerificationService();

// Required fields and their expected JS types. Numbers are validated with
// `typeof === 'number'` so that lat/lon = 0 (valid coordinate at the
// equator / prime meridian) is not rejected by truthy `if (!x)` checks.
const STRING_FIELDS = [
  "merchant_id",
  "creator_id",
  "customer_name",
  "photo_url",
  "receipt_url",
] as const;

const NUMBER_FIELDS = [
  "merchant_lat",
  "merchant_lon",
  "customer_lat",
  "customer_lon",
] as const;

export async function POST(request: NextRequest) {
  // Rate limit — this endpoint calls downstream AI providers in prod. Even
  // behind the `/api/internal/*` shared-secret middleware, a leaked token
  // or buggy cron job could burn the AI budget in minutes. Cap at 20/min
  // per IP; legitimate callers batch in the low single digits.
  const ip = getIP(request);
  if (!rateLimit(`ai-verify:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate required fields.
  const missing: string[] = [];
  for (const f of STRING_FIELDS) {
    const v = body[f];
    if (typeof v !== "string" || !v.trim()) missing.push(f);
  }
  for (const f of NUMBER_FIELDS) {
    const v = body[f];
    if (typeof v !== "number" || !Number.isFinite(v)) missing.push(f);
  }

  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Missing or invalid fields", fields: missing },
      { status: 400 },
    );
  }

  const claim: VerifyClaimInput = {
    merchant_id: body.merchant_id as string,
    creator_id: body.creator_id as string,
    customer_name: body.customer_name as string,
    photo_url: body.photo_url as string,
    receipt_url: body.receipt_url as string,
    merchant_lat: body.merchant_lat as number,
    merchant_lon: body.merchant_lon as number,
    customer_lat: body.customer_lat as number,
    customer_lon: body.customer_lon as number,
  };

  try {
    const result = await aiService.verifyCustomerClaim(claim);

    if (typeof body.claim_id === "string" && body.claim_id.trim()) {
      await aiService.saveVerification(body.claim_id, result);
    }

    return NextResponse.json(result);
  } catch (err) {
    return serverError("ai-verify", err);
  }
}
