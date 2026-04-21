// POST /api/privacy/dsar
//
// Data Subject Access Request intake endpoint required by CCPA § 1798.130
// (and mirrored by GDPR Art. 15–20 / APRA pre-wiring per
// /spec/consent-privacy-v1.md § 4).
//
// Intentionally minimal in v5.3: validate -> assign trace_id -> emit a
// structured server log line and return the ticket ID. The downstream
// pieces (privacy@push.nyc inbox, counsel-reviewed response templates,
// `privacy_requests` table, 45-day SLA timer) are manual / ops artifacts
// that Jiaming must stand up before pilot launch — see
// /spec/consent-privacy-v1.md § 10. This route unblocks the CCPA-
// mandated "submit a request" web form without waiting for that.

import { badRequest, serverError, success } from "@/lib/api/responses";

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

    // Ticket ID = trace_id; correlates server log with later ops follow-up.
    const ticketId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const receivedAt = new Date().toISOString();

    // Structured log line — greppable by [dsar-intake]. When the
    // privacy_requests table and email ingest land, this log will be
    // replaced with a DB write + mail send. Until then, ops grepping
    // Vercel runtime logs is the source of truth for the SLA clock.
    console.error("[dsar-intake]", {
      ticket_id: ticketId,
      received_at: receivedAt,
      email_domain: payload.email.split("@")[1] ?? "",
      request_type: payload.request_type,
      jurisdiction: payload.jurisdiction ?? null,
      has_details: Boolean(payload.details && payload.details.length > 0),
    });

    return success({
      ticket_id: ticketId,
      received_at: receivedAt,
      sla: "CCPA 45 days; GDPR 30 days",
      next_step:
        "We will email you from privacy@pushnyc.co to verify your identity before actioning the request.",
    });
  } catch (err) {
    return serverError("dsar-intake", err);
  }
}
