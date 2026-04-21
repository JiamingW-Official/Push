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
import { supabase } from "@/lib/db";

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

  const row: Record<string, unknown> = {
    device_id_hash: sha(deviceIn),
    creator_id: gate.merchantId, // TODO: resolve real creator via QR → campaign_applications join
    merchant_id: qr.merchant_id,
    campaign_id: qr.campaign_id,
    customer_id_hash: sha(customerIn),
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
  };

  const { data: inserted, error } = await supabase
    .from("push_transactions")
    .insert([row])
    .select("transaction_id")
    .single();

  if (error) return serverError("merchant-redeem-insert", error);

  return success({
    transaction_id: (inserted as { transaction_id: string }).transaction_id,
    qr_id: qr.id,
  });
}
