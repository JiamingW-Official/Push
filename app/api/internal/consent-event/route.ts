// POST /api/internal/consent-event
//
// Writes one row to `consent_events` whenever a consumer changes tier,
// acknowledges a disclosure, or exercises a data right. Closes
// P0-SEC-4 from docs/v5.3-optimization-audit-2026-04-21.md.
//
// Auth: internal service-to-service via INTERNAL_API_SECRET (middleware).
// No consumer browser ever hits this directly; the /scan/[qrId] page calls
// a thin proxy route that stamps the secret server-side so the browser
// never sees it.

import { createHash } from "node:crypto";
import { badRequest, serverError, success } from "@/lib/api/responses";
import { supabase } from "@/lib/db";

type EventType =
  | "opt_in"
  | "opt_out"
  | "tier_change"
  | "disclosure_shown"
  | "disclosure_acknowledged"
  | "data_rights_request"
  | "revocation";

type Source =
  | "web"
  | "app"
  | "merchant_portal"
  | "creator_portal"
  | "admin"
  | "api";

const EVENT_TYPES: ReadonlySet<EventType> = new Set([
  "opt_in",
  "opt_out",
  "tier_change",
  "disclosure_shown",
  "disclosure_acknowledged",
  "data_rights_request",
  "revocation",
]);

const SOURCES: ReadonlySet<Source> = new Set([
  "web",
  "app",
  "merchant_portal",
  "creator_portal",
  "admin",
  "api",
]);

function sha(v: string): string {
  return createHash("sha256").update(v).digest("hex");
}

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return badRequest("Body must be valid JSON");
  }

  // ── Identity ──────────────────────────────────────────────────────────
  if (typeof body.device_id !== "string" || body.device_id.length === 0) {
    return badRequest("`device_id` is required");
  }
  const deviceIdHash = sha(body.device_id);
  const customerIdHash =
    typeof body.customer_id === "string" && body.customer_id.length > 0
      ? sha(body.customer_id)
      : null;

  // ── Event classification ──────────────────────────────────────────────
  const eventType = body.event_type;
  if (
    typeof eventType !== "string" ||
    !EVENT_TYPES.has(eventType as EventType)
  ) {
    return badRequest("`event_type` invalid", {
      allowed: Array.from(EVENT_TYPES),
    });
  }

  const priorTier =
    typeof body.prior_tier === "number" &&
    [0, 1, 2, 3].includes(body.prior_tier)
      ? body.prior_tier
      : null;
  const newTier = body.new_tier;
  if (typeof newTier !== "number" || ![0, 1, 2, 3].includes(newTier)) {
    return badRequest("`new_tier` must be 0, 1, 2, or 3");
  }

  if (
    typeof body.consent_version !== "string" ||
    body.consent_version.length === 0
  ) {
    return badRequest("`consent_version` is required");
  }

  const source = body.source;
  if (typeof source !== "string" || !SOURCES.has(source as Source)) {
    return badRequest("`source` invalid", { allowed: Array.from(SOURCES) });
  }

  // ── Request metadata (hash at the edge; never store plaintext) ────────
  const ipAddressHash =
    typeof body.ip_address === "string" && body.ip_address.length > 0
      ? sha(body.ip_address)
      : null;
  const userAgentHash =
    typeof body.user_agent === "string" && body.user_agent.length > 0
      ? sha(body.user_agent.slice(0, 512))
      : null;

  const row = {
    device_id_hash: deviceIdHash,
    customer_id_hash: customerIdHash,
    event_type: eventType,
    prior_tier: priorTier,
    new_tier: newTier,
    consent_version: body.consent_version,
    campaign_id: typeof body.campaign_id === "string" ? body.campaign_id : null,
    creator_id: typeof body.creator_id === "string" ? body.creator_id : null,
    ftc_disclosure_shown:
      typeof body.ftc_disclosure_shown === "boolean"
        ? body.ftc_disclosure_shown
        : null,
    ip_address_hash: ipAddressHash,
    user_agent_hash: userAgentHash,
    source,
  };

  const { data, error } = await supabase
    .from("consent_events")
    .insert([row])
    .select("event_id")
    .single();

  if (error) return serverError("consent-event-insert", error);
  return success({ event_id: (data as { event_id: string }).event_id });
}
