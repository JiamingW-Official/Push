import { createServerSupabaseClient } from "@/lib/db/server";
import { forbidden, unauthorized } from "./responses";
import type { NextResponse } from "next/server";

/**
 * Creator route auth gate. Mirrors `requireAdminSession` but scopes by
 * the `creators` row rather than `users.role` — a creator IS a user who
 * has a `public.creators` row pointing at their `auth.uid()`.
 *
 * Usage:
 *   export async function GET() {
 *     const gate = await requireCreatorSession();
 *     if (!gate.ok) return gate.response;
 *     // gate.userId / gate.creatorId / gate.supabase available
 *   }
 *
 * Semantics:
 *   - No session cookie           → 401 unauthorized
 *   - Session but no creators row → 403 forbidden
 *   - Creator session             → { ok, userId, creatorId, supabase }
 */
export type CreatorGate =
  | {
      ok: true;
      userId: string;
      creatorId: string;
      supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
    }
  | { ok: false; response: NextResponse };

export async function requireCreatorSession(): Promise<CreatorGate> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, response: unauthorized() };
  }

  const { data, error } = await supabase
    .from("creators")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, response: forbidden("Creator role required") };
  }

  return {
    ok: true,
    userId: user.id,
    creatorId: (data as { id: string }).id,
    supabase,
  };
}
