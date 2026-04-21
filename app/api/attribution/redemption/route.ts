// POST /api/attribution/redemption
//
// Writes one push_transactions row (Physical-World Ground Truth Layer).
// The DB trigger `trg_push_transactions_derived` auto-fills:
//   time_to_redeem_sec, hour_of_week, claim_redeem_distance_m.
// Do NOT pass those columns in the insert payload.
//
// Auth: internal service-role only — callers must supply INTERNAL_API_SECRET
// via middleware (see middleware.ts). No per-route re-gating.

import { createHash } from "node:crypto";
import { badRequest, serverError, success } from "@/lib/api/responses";
import { supabase } from "@/lib/db";

// Enums mirrored from the push_transactions CHECK constraints in the migration.
const PRODUCT_CATEGORIES = new Set([
  "coffee",
  "pastry",
  "beverage",
  "meal",
  "retail",
  "service",
  "other",
]);

const DEMO_AGE_BUCKETS = new Set([
  "u18",
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55+",
]);
const DEMO_GENDERS = new Set(["m", "f", "nb", "decline"]);
const CONSENT_TIERS = new Set([1, 2, 3]);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sha256hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function isIsoString(s: unknown): s is string {
  if (typeof s !== "string") return false;
  const d = new Date(s);
  return !isNaN(d.getTime());
}

function isUuid(s: unknown): s is string {
  return typeof s === "string" && UUID_RE.test(s);
}

export async function POST(req: Request): Promise<Response> {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return badRequest("Request body must be valid JSON");
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return badRequest("Request body must be a JSON object");
    }

    const p = body as Record<string, unknown>;

    // ── Identity ────────────────────────────────────────────────────────────

    if (typeof p.device_id !== "string" || p.device_id.length === 0) {
      return badRequest("`device_id` is required (string)");
    }
    if (!isUuid(p.creator_id)) {
      return badRequest("`creator_id` is required and must be a UUID");
    }
    if (!isUuid(p.merchant_id)) {
      return badRequest("`merchant_id` is required and must be a UUID");
    }
    if (!isUuid(p.campaign_id)) {
      return badRequest("`campaign_id` is required and must be a UUID");
    }
    if (typeof p.customer_id !== "string" || p.customer_id.length === 0) {
      return badRequest("`customer_id` is required (string)");
    }

    // ── Timing ───────────────────────────────────────────────────────────────

    if (!isIsoString(p.claim_timestamp)) {
      return badRequest(
        "`claim_timestamp` is required and must be an ISO date string",
      );
    }
    if (!isIsoString(p.expiry_timestamp)) {
      return badRequest(
        "`expiry_timestamp` is required and must be an ISO date string",
      );
    }
    if (p.redeem_timestamp !== undefined && !isIsoString(p.redeem_timestamp)) {
      return badRequest(
        "`redeem_timestamp` must be an ISO date string when provided",
      );
    }

    // ── Commerce context ─────────────────────────────────────────────────────

    if (
      typeof p.product_category !== "string" ||
      !PRODUCT_CATEGORIES.has(p.product_category)
    ) {
      return badRequest("`product_category` is invalid", {
        allowed: Array.from(PRODUCT_CATEGORIES),
      });
    }
    if (p.product_sku !== undefined && typeof p.product_sku !== "string") {
      return badRequest("`product_sku` must be a string when provided");
    }
    if (
      typeof p.order_total_cents !== "number" ||
      !Number.isInteger(p.order_total_cents) ||
      p.order_total_cents < 0
    ) {
      return badRequest(
        "`order_total_cents` is required and must be a non-negative integer",
      );
    }
    if (
      typeof p.creative_content_hash !== "string" ||
      p.creative_content_hash.length === 0
    ) {
      return badRequest("`creative_content_hash` is required (hex string)");
    }

    // ── Location (all optional) ───────────────────────────────────────────────

    if (p.claim_gps_lat !== undefined && typeof p.claim_gps_lat !== "number") {
      return badRequest("`claim_gps_lat` must be a number when provided");
    }
    if (p.claim_gps_lng !== undefined && typeof p.claim_gps_lng !== "number") {
      return badRequest("`claim_gps_lng` must be a number when provided");
    }
    if (
      p.redeem_gps_lat !== undefined &&
      typeof p.redeem_gps_lat !== "number"
    ) {
      return badRequest("`redeem_gps_lat` must be a number when provided");
    }
    if (
      p.redeem_gps_lng !== undefined &&
      typeof p.redeem_gps_lng !== "number"
    ) {
      return badRequest("`redeem_gps_lng` must be a number when provided");
    }
    if (
      p.merchant_dwell_sec !== undefined &&
      (typeof p.merchant_dwell_sec !== "number" ||
        !Number.isInteger(p.merchant_dwell_sec))
    ) {
      return badRequest(
        "`merchant_dwell_sec` must be an integer when provided",
      );
    }

    // ── Demographics (all optional) ───────────────────────────────────────────

    if (
      p.demo_age_bucket !== undefined &&
      (typeof p.demo_age_bucket !== "string" ||
        !DEMO_AGE_BUCKETS.has(p.demo_age_bucket))
    ) {
      return badRequest("`demo_age_bucket` is invalid", {
        allowed: Array.from(DEMO_AGE_BUCKETS),
      });
    }
    if (
      p.demo_gender !== undefined &&
      (typeof p.demo_gender !== "string" || !DEMO_GENDERS.has(p.demo_gender))
    ) {
      return badRequest("`demo_gender` is invalid", {
        allowed: Array.from(DEMO_GENDERS),
      });
    }
    if (
      p.demo_zip_home !== undefined &&
      (typeof p.demo_zip_home !== "string" || p.demo_zip_home.length > 3)
    ) {
      return badRequest(
        "`demo_zip_home` must be at most 3 characters (ZIP prefix)",
      );
    }
    if (
      p.demo_ethnicity_bucket !== undefined &&
      typeof p.demo_ethnicity_bucket !== "string"
    ) {
      return badRequest(
        "`demo_ethnicity_bucket` must be a string when provided",
      );
    }

    // ── Behavioral ────────────────────────────────────────────────────────────

    if (typeof p.is_first_visit !== "boolean") {
      return badRequest("`is_first_visit` is required (boolean)");
    }
    if (
      p.cross_merchant_count !== undefined &&
      (typeof p.cross_merchant_count !== "number" ||
        !Number.isInteger(p.cross_merchant_count))
    ) {
      return badRequest(
        "`cross_merchant_count` must be an integer when provided",
      );
    }
    if (
      p.referral_chain_depth !== undefined &&
      (typeof p.referral_chain_depth !== "number" ||
        !Number.isInteger(p.referral_chain_depth))
    ) {
      return badRequest(
        "`referral_chain_depth` must be an integer when provided",
      );
    }

    // ── Environment (optional) ────────────────────────────────────────────────

    if (p.weather_code !== undefined && typeof p.weather_code !== "string") {
      return badRequest("`weather_code` must be a string when provided");
    }
    if (
      p.local_event_nearby !== undefined &&
      typeof p.local_event_nearby !== "string"
    ) {
      return badRequest("`local_event_nearby` must be a string when provided");
    }

    // ── Compliance ────────────────────────────────────────────────────────────

    if (
      typeof p.consent_version !== "string" ||
      p.consent_version.length === 0
    ) {
      return badRequest("`consent_version` is required");
    }
    if (typeof p.ftc_disclosure_shown !== "boolean") {
      return badRequest("`ftc_disclosure_shown` is required (boolean)");
    }
    if (
      typeof p.consent_tier !== "number" ||
      !CONSENT_TIERS.has(p.consent_tier)
    ) {
      return badRequest("`consent_tier` is required and must be 1, 2, or 3");
    }

    // ── Build insert row ──────────────────────────────────────────────────────

    const row: Record<string, unknown> = {
      // Identity — hash PII before storage
      device_id_hash: sha256hex(p.device_id as string),
      creator_id: p.creator_id,
      merchant_id: p.merchant_id,
      campaign_id: p.campaign_id,
      customer_id_hash: sha256hex(p.customer_id as string),

      // Timing
      claim_timestamp: p.claim_timestamp,
      expiry_timestamp: p.expiry_timestamp,
      ...(p.redeem_timestamp !== undefined && {
        redeem_timestamp: p.redeem_timestamp,
      }),

      // Commerce
      product_category: p.product_category,
      order_total_cents: p.order_total_cents,
      creative_content_hash: p.creative_content_hash,
      ...(p.product_sku !== undefined && {
        // Hash SKU to avoid leaking merchant catalogue structure.
        product_sku_hash: sha256hex(p.product_sku as string),
      }),

      // Location (optional)
      ...(p.claim_gps_lat !== undefined && { claim_gps_lat: p.claim_gps_lat }),
      ...(p.claim_gps_lng !== undefined && { claim_gps_lng: p.claim_gps_lng }),
      ...(p.redeem_gps_lat !== undefined && {
        redeem_gps_lat: p.redeem_gps_lat,
      }),
      ...(p.redeem_gps_lng !== undefined && {
        redeem_gps_lng: p.redeem_gps_lng,
      }),
      ...(p.merchant_dwell_sec !== undefined && {
        merchant_dwell_sec: p.merchant_dwell_sec,
      }),

      // Demographics (optional)
      ...(p.demo_age_bucket !== undefined && {
        demo_age_bucket: p.demo_age_bucket,
      }),
      ...(p.demo_gender !== undefined && { demo_gender: p.demo_gender }),
      ...(p.demo_zip_home !== undefined && { demo_zip_home: p.demo_zip_home }),
      ...(p.demo_ethnicity_bucket !== undefined && {
        demo_ethnicity_bucket: p.demo_ethnicity_bucket,
      }),

      // Behavioral
      is_first_visit: p.is_first_visit,
      ...(p.cross_merchant_count !== undefined && {
        cross_merchant_count: p.cross_merchant_count,
      }),
      ...(p.referral_chain_depth !== undefined && {
        referral_chain_depth: p.referral_chain_depth,
      }),

      // Environment (optional)
      ...(p.weather_code !== undefined && { weather_code: p.weather_code }),
      ...(p.local_event_nearby !== undefined && {
        local_event_nearby: p.local_event_nearby,
      }),

      // Compliance
      consent_version: p.consent_version,
      ftc_disclosure_shown: p.ftc_disclosure_shown,
      consent_tier: p.consent_tier,
    };

    const { data, error } = await supabase
      .from("push_transactions")
      .insert([row])
      .select("transaction_id")
      .single();

    if (error) {
      return serverError("redemption-insert", error);
    }

    return success({
      transaction_id: (data as { transaction_id: string }).transaction_id,
    });
  } catch (err) {
    return serverError("redemption-insert", err);
  }
}
