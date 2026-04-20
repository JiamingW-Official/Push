import { createServerSupabaseClient } from "@/lib/supabase-server";
import { forbidden, unauthorized } from "./responses";
import type { NextResponse } from "next/server";

/**
 * Admin route auth gate. Extracted from Batch D of the full backend audit
 * after we removed the IDOR-enabling `?merchant_id=admin` trick — admin
 * surfaces now need a real role check instead of hand-waving.
 *
 * Usage:
 *
 *   export async function GET() {
 *     const gate = await requireAdminSession();
 *     if (!gate.ok) return gate.response;   // 401 or 403
 *     // gate.userId + gate.supabase available here
 *     ...
 *   }
 *
 * Semantics:
 *   - No session cookie  → 401 unauthorized (stale tab, logged out).
 *   - Session but role != "admin"  → 403 forbidden (attempted escalation).
 *   - Admin session → returns `{ ok: true, userId, supabase }`.
 *
 * We read `role` from `public.users` (the row created on auth.signup by
 * the initial_schema trigger). The SSR client's `getUser()` cross-checks
 * the JWT against Supabase, so callers can't forge the role via a tweaked
 * local cookie.
 */
export type AdminGate =
  | {
      ok: true;
      userId: string;
      supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
    }
  | { ok: false; response: NextResponse };

export async function requireAdminSession(): Promise<AdminGate> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, response: unauthorized() };
  }

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data || data.role !== "admin") {
    // Return 403 (not 404) — the caller IS authenticated; we're rejecting
    // their claim to admin privileges specifically.
    return { ok: false, response: forbidden("Admin role required") };
  }

  return { ok: true, userId: user.id, supabase };
}
