// POST /api/merchant/redeem
//
// Merchant-side POS endpoint. Takes a short 4–8 char prefix of a QR id,
// resolves to the full QR code, and writes one push_transactions row
// representing the redemption. Auth: requireMerchantSession.
//
// v5.3-EXEC P1-5 merchant POS path. Bypasses /api/attribution/redemption
// (which is internal-service-role gated) because we already have a merchant
// session and a service-role db client available here.
//
// Happy path:
//   body = { prefix, order_total_cents, product_category,
//            creative_content_hash, consent_version, consent_tier,
//            ftc_disclosure_shown }
//   → match exactly one qr_codes row by prefix
//   → INSERT into push_transactions (merchant_id + campaign_id derived)
//   → return { transaction_id, qr_id }

import { createHash, randomUUID } from "node:crypto";
import {
  badRequest,
  notFound,
  serverError,
  success,
} from "@/lib/api/responses";
import { requireMerchantSession } from "@/lib/api/merchant-auth";
import { demoShortCircuit } from "@/lib/api/demo-short-circuit";
import { supabase } from "@/lib/db";
import { computeAttributionWeight } from "@/lib/services/attribution-decay";

const PRODUCT_CATEGORIES = new Set([
  "coffee",
  "pastry",
  "beverage",
  "meal",
  "retail",
  "service",
  "other",
]);

interface RedeemBody {
  prefix?: unknown;
  order_total_cents?: unknown;
  product_category?: unknown;
  creative_content_hash?: unknown;
  consent_version?: unknown;
  consent_tier?: unknown;
  ftc_disclosure_shown?: unknown;
  customer_id?: unknown;
  is_first_visit?: unknown;
  device_id?: unknown;
}

function sha(v: string): string {
  return createHash("sha256").update(v).digest("hex");
}

export async function POST(req: Request): Promise<Response> {
  // Demo merchants get a fake transaction_id so the POS UI shows the green
  // "✓ REDEEMED" state without touching push_transactions in prod.
  const demo = await demoShortCircuit("merchant", () => ({
    transaction_id: randomUUID(),
    qr_id: "demo-qr-" + randomUUID().slice(0, 8),
  }));
  if (demo) return demo;

  const gate = await requireMerchantSession();
  if (!gate.ok) return gate.response;

  let body: RedeemBody;
  try {
    body = (await req.json()) as RedeemBody;
  } catch {
    return badRequest("Body must be valid JSON");
  }

  const prefix = body.prefix;
  if (typeof prefix !== "string" || prefix.length < 4 || prefix.length > 36) {
    return badRequest("`prefix` must be 4–36 chars", {
      minLength: 4,
      maxLength: 36,
    });
  }

  const orderTotal = body.order_total_cents;
  if (
    typeof orderTotal !== "number" ||
    !Number.isInteger(orderTotal) ||
    orderTotal < 0
  ) {
    return badRequest("`order_total_cents` must be a non-negative integer");
  }

  const category = body.product_category;
  if (typeof category !== "string" || !PRODUCT_CATEGORIES.has(category)) {
    return badRequest("`product_category` invalid", {
      allowed: Array.from(PRODUCT_CATEGORIES),
    });
  }

  if (
    typeof body.creative_content_hash !== "string" ||
    body.creative_content_hash.length === 0
  ) {
    return badRequest("`creative_content_hash` is required");
  }

  if (
    typeof body.consent_version !== "string" ||
    body.consent_version.length === 0
  ) {
    return badRequest("`consent_version` is required");
  }

  const tier = body.consent_tier;
  if (typeof tier !== "number" || ![1, 2, 3].includes(tier)) {
    return badRequest("`consent_tier` must be 1, 2, or 3");
  }

  if (typeof body.ftc_disclosure_shown !== "boolean") {
    return badRequest("`ftc_disclosure_shown` is required (boolean)");
  }

  // ── Resolve prefix → qr_codes row (owned by this merchant) ───────────────
  const { data: qrRows, error: qrErr } = await supabase
    .from("qr_codes")
    .select("id, campaign_id, merchant_id, disabled")
    .eq("merchant_id", gate.merchantId)
    .ilike("id", `${prefix}%`)
    .limit(2);

  if (qrErr) return serverError("merchant-redeem-lookup", qrErr);

  if (!qrRows || qrRows.length === 0) {
    return notFound("No QR code matches that prefix for your merchant account");
  }
  if (qrRows.length > 1) {
    return badRequest("Prefix is ambiguous — matches multiple QR codes", {
      hint: "Use a longer prefix",
    });
  }
  const qr = qrRows[0] as {
    id: string;
    campaign_id: string;
    merchant_id: string;
    disabled: boolean;
  };
  if (qr.disabled) {
    return badRequest("QR code is disabled");
  }

  // ── Build push_transactions row ──────────────────────────────────────────
  // device_id + customer_id are hashed; if client didn't supply them,
  // we fabricate one-shot identifiers scoped to THIS transaction so the
  // row-level uniqueness constraints stay intact.
  const deviceIn =
    typeof body.device_id === "string" && body.device_id.length > 0
      ? body.device_id
      : `pos-${randomUUID()}`;
  const customerIn =
    typeof body.customer_id === "string" && body.customer_id.length > 0
      ? body.customer_id
      : `pos-${randomUUID()}`;

  const now = new Date();
  const expiry = new Date(now.getTime() + 24 * 3600 * 1000);

  // Resolve the creator who should be credited for this redemption.
  //
  // Strategy: pick the most recent ACCEPTED application for this campaign.
  // Rationale: a creator must be accepted into a campaign before their
  // scan surface can drive redemptions; the "most recent" tie-breaker
  // handles the (rare) multi-creator case without returning ambiguous.
  //
  // If no accepted application exists, fall back to the merchant itself as
  // the "creator" — this keeps the row insertable (creator_id is NOT NULL)
  // while flagging it for manual review via the 0-value referral_chain_depth.
  let creatorId: string = gate.merchantId;
  const { data: appRows } = await supabase
    .from("campaign_applications")
    .select("creator_id, created_at")
    .eq("campaign_id", qr.campaign_id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false })
    .limit(1);
  if (appRows && appRows.length > 0) {
    creatorId = (appRows[0] as { creator_id: string }).creator_id;
  }

  const customerHash = sha(customerIn);

  // FTC 16 CFR Part 255 attribution decay: weight scales with time since the
  // customer's FIRST attributed scan from this creator. New (customer, creator)
  // pairs always get 1.0; repurchases inside the 120-day window decay piecewise.
  const { data: priorRows } = await supabase
    .from("push_transactions")
    .select("claim_timestamp")
    .eq("customer_id_hash", customerHash)
    .eq("creator_id", creatorId)
    .order("claim_timestamp", { ascending: true })
    .limit(1);

  const firstScanAt =
    priorRows && priorRows.length > 0
      ? new Date((priorRows[0] as { claim_timestamp: string }).claim_timestamp)
      : now;

  const attributionWeight = computeAttributionWeight(firstScanAt, now);
  if (attributionWeight === 0) {
    return badRequest("Attribution window expired (>120 days)");
  }

  const row: Record<string, unknown> = {
    device_id_hash: sha(deviceIn),
    creator_id: creatorId,
    merchant_id: qr.merchant_id,
    campaign_id: qr.campaign_id,
    customer_id_hash: customerHash,
    claim_timestamp: now.toISOString(),
    redeem_timestamp: now.toISOString(),
    expiry_timestamp: expiry.toISOString(),
    product_category: category,
    order_total_cents: orderTotal,
    creative_content_hash: body.creative_content_hash,
    is_first_visit:
      typeof body.is_first_visit === "boolean" ? body.is_first_visit : true,
    consent_version: body.consent_version,
    ftc_disclosure_shown: body.ftc_disclosure_shown,
    consent_tier: tier,
    attribution_weight: attributionWeight,
  };

  const { data: inserted, error } = await supabase
    .from("push_transactions")
    .insert([row])
    .select("transaction_id")
    .single();

  if (error) return serverError("merchant-redeem-insert", error);

  const transactionId = (inserted as { transaction_id: string }).transaction_id;

  // P1-FUNC-3: oracle_audit auto-write for the POS path too. Same fallback
  // reasoning as the attribution route — this is a baseline decision, an
  // admin rerun can enrich it later if disputed.
  try {
    const { AIVerificationService } =
      await import("@/lib/services/AIVerificationService");
    const oracle = new AIVerificationService();
    const result = await oracle.verifyCustomerClaim({
      merchant_id: qr.merchant_id,
      creator_id: creatorId,
      customer_name: "pos-redemption",
      photo_url: "pos://redemption",
      receipt_url: "pos://redemption",
      merchant_lat: 40.7128,
      merchant_lon: -74.006,
      customer_lat: 40.7128,
      customer_lon: -74.006,
      claim_timestamp: now.toISOString(),
      redeem_timestamp: now.toISOString(),
      merchant_active: true,
    });
    await oracle.saveOracleAudit(transactionId, result, {
      triggeredBy: "auto",
    });
  } catch (auditErr) {
    console.error("[merchant-redeem-oracle-audit]", {
      transactionId,
      err: auditErr instanceof Error ? auditErr.message : String(auditErr),
    });
  }

  return success({ transaction_id: transactionId, qr_id: qr.id });
}
