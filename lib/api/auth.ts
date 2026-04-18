import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ApiError } from "@/lib/api/response";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Roles that can be asserted via requireRole(). */
export type AppRole = "creator" | "merchant" | "admin";

/** Return value of requireUser(). */
export interface AuthContext {
  user: User;
  supabase: SupabaseClient;
}

/** Return value of requireRole(). */
export interface RoleContext extends AuthContext {
  role: AppRole;
}

/** Return value of getOptionalUser(). */
export interface OptionalAuthContext {
  user: User | null;
  supabase: SupabaseClient;
}

// ---------------------------------------------------------------------------
// requireUser()
// ---------------------------------------------------------------------------

/**
 * Verifies that the incoming request carries a valid Supabase session.
 *
 * Throws an `ApiError(401)` when:
 *  - No session cookie is present.
 *  - The session is expired or invalid.
 *
 * Use inside a `handle()` wrapper or a try/catch block.
 *
 * @example
 * export const GET = handle(async () => {
 *   const { user, supabase } = await requireUser();
 *   const data = await fetchForUser(supabase, user.id);
 *   return ok(data);
 * });
 */
export async function requireUser(): Promise<AuthContext> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
  }

  return { user, supabase };
}

// ---------------------------------------------------------------------------
// requireRole()
// ---------------------------------------------------------------------------

/**
 * Verifies that the signed-in user holds the given application role.
 *
 * - For `'creator'` and `'merchant'`: checks the `public.users` table which
 *   stores the `role` column set during sign-up.
 * - For `'admin'`: checks `user.app_metadata.role === 'admin'` (set via
 *   Supabase Dashboard / service-role Admin API — never by the user).
 *
 * Throws:
 *  - `ApiError(401)` — no valid session.
 *  - `ApiError(403)` — session exists but the role does not match.
 *
 * @example
 * export const POST = handle(async (req) => {
 *   const { user, supabase } = await requireRole('merchant');
 *   // only merchants reach here
 * });
 */
export async function requireRole(role: AppRole): Promise<RoleContext> {
  const { user, supabase } = await requireUser();

  if (role === "admin") {
    // Admin flag lives in app_metadata (server-controlled, not user-editable)
    const isAdmin =
      (user.app_metadata as Record<string, unknown> | null)?.role === "admin";

    if (!isAdmin) {
      throw new ApiError(403, "Admin access required", "FORBIDDEN");
    }

    return { user, role, supabase };
  }

  // For creator / merchant: look up the profile row in public.users
  const { data: profile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single<{ role: string }>();

  if (error || !profile) {
    throw new ApiError(403, "User profile not found", "PROFILE_MISSING");
  }

  if (profile.role !== role) {
    throw new ApiError(
      403,
      `This action requires the '${role}' role`,
      "FORBIDDEN",
    );
  }

  return { user, role, supabase };
}

// ---------------------------------------------------------------------------
// getOptionalUser()
// ---------------------------------------------------------------------------

/**
 * Returns the current session user if one exists, or `null` — never throws.
 *
 * Useful for routes that serve both authenticated and anonymous visitors with
 * different data (e.g. public campaign listings that include "applied" state
 * when the creator is signed in).
 *
 * @example
 * export const GET = handle(async () => {
 *   const { user, supabase } = await getOptionalUser();
 *   if (user) {
 *     return ok(await fetchPersonalized(supabase, user.id));
 *   }
 *   return ok(await fetchPublic(supabase));
 * });
 */
export async function getOptionalUser(): Promise<OptionalAuthContext> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user: user ?? null, supabase };
}
