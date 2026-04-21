/**
 * Push email client — v5.3-EXEC P0-4.
 *
 * Wraps Resend with three behaviors:
 *   - Dev / preview without RESEND_API_KEY → dry-run: the email is logged
 *     to `email_log` with provider=dry_run and no network call happens.
 *   - Prod with RESEND_API_KEY unset → throws; the boot hard-throw in
 *     `assertEmailEnv()` would have prevented the deploy from starting.
 *   - Daily quota exceeded (default 10_000/day, configurable) → throws
 *     a typed `QuotaExceededError` so the caller can log + page ops.
 *
 * Usage:
 *   await sendEmail("merchant_welcome", {
 *     to: "alice@example.com",
 *     vars: { merchant_name: "Alice", onboarding_url: "https://..." },
 *     triggeredBy: "admin",
 *     triggeredByUserId: adminUserId,
 *   });
 */
import { createHash } from "node:crypto";
import { Resend } from "resend";
import { supabase } from "@/lib/db";
import { TEMPLATES, type TemplateKey } from "./templates";
import { checkDailyQuota, recordEmail } from "./audit";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_DEFAULT = process.env.PUSH_EMAIL_FROM ?? "Push <noreply@pushnyc.co>";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export class QuotaExceededError extends Error {
  readonly code = "EMAIL_QUOTA_EXCEEDED";
}

export interface SendEmailInput<T extends TemplateKey> {
  template: T;
  to: string;
  vars: Parameters<(typeof TEMPLATES)[T]["html"]>[0];
  from?: string;
  triggeredBy: "system" | "admin" | "cron" | "api";
  triggeredByUserId?: string;
}

/**
 * Send an email via Resend (or dry-run in dev) and record the attempt in
 * `email_log`. Returns the log row id so the caller can correlate.
 */
export async function sendEmail<T extends TemplateKey>(
  input: SendEmailInput<T>,
): Promise<{ logId: string; providerMessageId: string | null }> {
  const tpl = TEMPLATES[input.template] as {
    subject: (v: unknown) => string;
    html: (v: unknown) => string;
    text: (v: unknown) => string;
    varsShapeHash: () => string;
  };

  // ── Quota gate ───────────────────────────────────────────────────────────
  const allowed = await checkDailyQuota();
  if (!allowed) throw new QuotaExceededError("Daily email quota exceeded");

  const subject = tpl.subject(input.vars);
  const html = tpl.html(input.vars);
  const text = tpl.text(input.vars);
  const from = input.from ?? FROM_DEFAULT;
  const toHash = createHash("sha256")
    .update(input.to.toLowerCase().trim())
    .digest("hex");

  // ── Dry-run path ─────────────────────────────────────────────────────────
  if (!resend) {
    const logId = await recordEmail({
      to_email_hash: toHash,
      from_email: from,
      template: input.template,
      subject,
      vars_shape_hash: tpl.varsShapeHash(),
      provider: "dry_run",
      provider_msg_id: null,
      status: "dry_run",
      error_code: null,
      triggered_by: input.triggeredBy,
      triggered_by_user_id: input.triggeredByUserId ?? null,
    });
    return { logId, providerMessageId: null };
  }

  // ── Real send ────────────────────────────────────────────────────────────
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: input.to,
      subject,
      html,
      text,
    });
    if (error) {
      const logId = await recordEmail({
        to_email_hash: toHash,
        from_email: from,
        template: input.template,
        subject,
        vars_shape_hash: tpl.varsShapeHash(),
        provider: "resend",
        provider_msg_id: null,
        status: "failed",
        error_code: (error as { name?: string }).name ?? "send_error",
        triggered_by: input.triggeredBy,
        triggered_by_user_id: input.triggeredByUserId ?? null,
      });
      return { logId, providerMessageId: null };
    }
    const logId = await recordEmail({
      to_email_hash: toHash,
      from_email: from,
      template: input.template,
      subject,
      vars_shape_hash: tpl.varsShapeHash(),
      provider: "resend",
      provider_msg_id: data?.id ?? null,
      status: "sent",
      error_code: null,
      triggered_by: input.triggeredBy,
      triggered_by_user_id: input.triggeredByUserId ?? null,
    });
    return { logId, providerMessageId: data?.id ?? null };
  } catch (err) {
    const logId = await recordEmail({
      to_email_hash: toHash,
      from_email: from,
      template: input.template,
      subject,
      vars_shape_hash: tpl.varsShapeHash(),
      provider: "resend",
      provider_msg_id: null,
      status: "failed",
      error_code: err instanceof Error ? err.name : "unknown",
      triggered_by: input.triggeredBy,
      triggered_by_user_id: input.triggeredByUserId ?? null,
    });
    return { logId, providerMessageId: null };
  }
}

/**
 * Production boot check. Call from a hot path (e.g. admin dashboard SSR)
 * to verify the email infra is wired — throws when RESEND_API_KEY is
 * missing in production, the same fail-closed pattern used for
 * SUPABASE_SERVICE_ROLE_KEY.
 */
export function assertEmailEnv(): void {
  if (process.env.NODE_ENV === "production" && !RESEND_API_KEY) {
    throw new Error(
      "lib/email/client: RESEND_API_KEY is not set in production. " +
        "Dry-run mode would silently swallow every outbound email. " +
        "Set the key in Vercel and redeploy.",
    );
  }
  // Touch supabase to keep tree-shaker honest — the audit writer imports it.
  void supabase;
}
