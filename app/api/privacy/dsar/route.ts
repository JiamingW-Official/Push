// POST /api/privacy/dsar
//
// Data Subject Access Request intake endpoint required by CCPA § 1798.130
// (and mirrored by GDPR Art. 15–20 / APRA pre-wiring per
// /spec/consent-privacy-v1.md § 4).
//
// Validates the request, writes a row to `privacy_requests` (service-role),
// and returns the ticket_id + SLA information. The downstream ops artifacts
// (privacy@pushnyc.co inbox, counsel-reviewed response templates, 45-day
// SLA timer) are described in /spec/consent-privacy-v1.md § 10.

import { createHash } from "node:crypto";
import { badRequest, serverError, success } from "@/lib/api/responses";
import { supabase } from "@/lib/db";

const MAX_EMAIL = 254;
const MAX_DETAILS = 4000;

const REQUEST_TYPES = new Set([
  "access",
  "deletion",
  "correction",
  "opt_out_of_sale",
  "portability",
  "restriction",
  "other",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// CCPA 45-day SLA measured from the moment of receipt.
const CCPA_SLA_DAYS = 45;

interface DsarPayload {
  email: string;
  request_type: string;
  jurisdiction?: string;
  details?: string;
  verification_hint?: string;
  consent_ack?: boolean;
}

export async function POST(req: Request): Promise<Response> {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return badRequest("Request body must be valid JSON");
    }

    if (!body || typeof body !== "object") {
      return badRequest("Request body must be a JSON object");
    }

    const payload = body as Partial<DsarPayload>;

    if (typeof payload.email !== "string" || !EMAIL_RE.test(payload.email)) {
      return badRequest("`email` is required and must be a valid email");
    }
    if (payload.email.length > MAX_EMAIL) {
      return badRequest("`email` exceeds maximum length");
    }

    if (
      typeof payload.request_type !== "string" ||
      !REQUEST_TYPES.has(payload.request_type)
    ) {
      return badRequest("`request_type` is invalid", {
        allowed: Array.from(REQUEST_TYPES),
      });
    }

    if (payload.consent_ack !== true) {
      return badRequest(
        "`consent_ack` must be true to acknowledge identity-verification requirement",
      );
    }

    if (
      payload.details !== undefined &&
      (typeof payload.details !== "string" ||
        payload.details.length > MAX_DETAILS)
    ) {
      return badRequest("`details` must be a string up to 4000 characters");
    }

    if (
      payload.jurisdiction !== undefined &&
      (typeof payload.jurisdiction !== "string" ||
        payload.jurisdiction.length > 64)
    ) {
      return badRequest("`jurisdiction` must be a short string");
    }

    if (
      payload.verification_hint !== undefined &&
      (typeof payload.verification_hint !== "string" ||
        payload.verification_hint.length > 256)
    ) {
      return badRequest("`verification_hint` must be a short string");
    }

    const emailLower = payload.email.toLowerCase();
    // SHA256 of the lowercased email — allows future re-lookup without
    // storing the plaintext after it has been deleted per a deletion request.
    const emailHash = createHash("sha256").update(emailLower).digest("hex");

    const receivedAt = new Date();
    const dueAt = new Date(receivedAt);
    dueAt.setDate(dueAt.getDate() + CCPA_SLA_DAYS);

    const { data, error } = await supabase
      .from("privacy_requests")
      .insert([
        {
          email_lower: emailLower,
          email_hash: emailHash,
          request_type: payload.request_type,
          jurisdiction: payload.jurisdiction ?? null,
          details: payload.details ?? null,
          verification_hint: payload.verification_hint ?? null,
          consent_ack: true,
          status: "received",
          received_at: receivedAt.toISOString(),
          due_at: dueAt.toISOString(),
        },
      ])
      .select("ticket_id, received_at")
      .single();

    if (error) {
      return serverError("dsar-intake", error);
    }

    // Structured log — greppable by [dsar-intake]. Emitted after successful
    // write so ticket_id is real. NEVER log the email local-part or details.
    console.error("[dsar-intake]", {
      ticket_id: data.ticket_id,
      received_at: data.received_at,
      email_domain: emailLower.split("@")[1] ?? "",
      request_type: payload.request_type,
      jurisdiction: payload.jurisdiction ?? null,
    });

    return success({
      ticket_id: data.ticket_id,
      received_at: data.received_at,
      sla: "CCPA 45 days; GDPR 30 days",
      next_step:
        "We will email you from privacy@pushnyc.co to verify your identity before actioning the request.",
    });
  } catch (err) {
    return serverError("dsar-intake", err);
  }
}
