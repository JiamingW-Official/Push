/**
 * email_log audit writer + daily-quota guard.
 *
 * Called from `lib/email/client.ts`. Split into its own file so the audit
 * table schema can evolve without forcing the client to re-compile.
 */
import { supabase } from "@/lib/db";

interface EmailLogRow {
  to_email_hash: string;
  from_email: string;
  template: string;
  subject: string;
  vars_shape_hash: string | null;
  provider: "resend" | "sendgrid" | "ses" | "dry_run";
  provider_msg_id: string | null;
  status: "sent" | "failed" | "dry_run";
  error_code: string | null;
  triggered_by: "system" | "admin" | "cron" | "api";
  triggered_by_user_id: string | null;
}

/**
 * Insert one row. Returns the generated id.
 * Non-throwing on DB error — a failed audit write must not block an email
 * that already made it out to Resend. A `console.error` is emitted instead.
 */
export async function recordEmail(row: EmailLogRow): Promise<string> {
  const { data, error } = await supabase
    .from("email_log")
    .insert([row])
    .select("id")
    .single();
  if (error || !data) {
    console.error("[email-audit] insert failed", { code: error?.code });
    return "audit-write-failed";
  }
  return (data as { id: string }).id;
}

const DAILY_QUOTA = Number(process.env.PUSH_EMAIL_DAILY_QUOTA ?? "10000");

/**
 * @returns true when below quota (allowed to send).
 */
export async function checkDailyQuota(): Promise<boolean> {
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count, error } = await supabase
    .from("email_log")
    .select("id", { count: "exact", head: true })
    .gte("sent_at", since)
    .in("status", ["sent", "dry_run"]);
  if (error) {
    // Soft-fail the gate rather than blocking all email on a transient DB
    // error. Sentry picks up the console.error.
    console.error("[email-audit] quota check failed", { code: error.code });
    return true;
  }
  return (count ?? 0) < DAILY_QUOTA;
}
