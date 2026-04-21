// POST /api/internal/email-send
//
// Internal service-to-service endpoint that sends one templated email.
// Auth: INTERNAL_API_SECRET via middleware (see middleware.ts).
// Rate limit: 30 req/min per IP + daily quota checked in lib/email/client.ts.
//
// Body:
//   {
//     "template": "merchant_welcome" | "creator_welcome" | ...,
//     "to": "alice@example.com",
//     "vars": { ...template-specific },
//     "triggered_by": "system" | "admin" | "cron" | "api",
//     "triggered_by_user_id"?: string
//   }
//
// Response 200:   { data: { log_id, provider_message_id } }
// Response 400:   missing / invalid field
// Response 429:   per-IP burst rate limit
// Response 500:   delivery failure (surfaced via server logs)

import { NextResponse } from "next/server";
import { badRequest, serverError, success } from "@/lib/api/responses";
import { checkRateLimit } from "@/lib/observability/rate-limit";
import { getIP } from "@/lib/rate-limit";
import { QuotaExceededError, sendEmail } from "@/lib/email/client";
import type { TemplateKey } from "@/lib/email/templates";

const TEMPLATES: TemplateKey[] = [
  "merchant_welcome",
  "creator_welcome",
  "privacy_request_received",
  "dispute_notify",
  "dsar_response",
];

const TRIGGERED_BY = new Set(["system", "admin", "cron", "api"]);

export async function POST(req: Request): Promise<Response> {
  const ip = getIP(req);
  const ok = await checkRateLimit(`email-send:${ip}`, {
    limit: 30,
    windowSec: 60,
  });
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return badRequest("Body must be valid JSON");
  }

  const template = body.template;
  if (
    typeof template !== "string" ||
    !TEMPLATES.includes(template as TemplateKey)
  ) {
    return badRequest("`template` invalid", { allowed: TEMPLATES });
  }
  const to = body.to;
  if (typeof to !== "string" || !to.includes("@")) {
    return badRequest("`to` must be a valid email address");
  }
  const vars = body.vars;
  if (!vars || typeof vars !== "object" || Array.isArray(vars)) {
    return badRequest("`vars` must be an object");
  }
  const triggered_by = body.triggered_by;
  if (typeof triggered_by !== "string" || !TRIGGERED_BY.has(triggered_by)) {
    return badRequest("`triggered_by` invalid", {
      allowed: Array.from(TRIGGERED_BY),
    });
  }
  const triggered_by_user_id =
    typeof body.triggered_by_user_id === "string"
      ? (body.triggered_by_user_id as string)
      : undefined;

  try {
    const result = await sendEmail({
      template: template as TemplateKey,
      to,
      // The templates keep their own per-shape validation; we pass through.
      vars: vars as never,
      triggeredBy: triggered_by as "system" | "admin" | "cron" | "api",
      triggeredByUserId: triggered_by_user_id,
    });
    return success({
      log_id: result.logId,
      provider_message_id: result.providerMessageId,
    });
  } catch (err) {
    if (err instanceof QuotaExceededError) {
      return NextResponse.json(
        { error: "Daily email quota exceeded", code: err.code },
        { status: 429 },
      );
    }
    return serverError("email-send", err);
  }
}
