/**
 * Push v5.2 — Service-role database client
 *
 * Server-side Supabase client initialized with the SERVICE_ROLE key.
 * It bypasses Row Level Security (RLS), so:
 *   - NEVER import this module from a Client Component or any code that ships
 *     to the browser. Use `lib/supabase.ts` (browser, anon key) for that.
 *   - Restrict usage to API routes, server actions, cron jobs, and internal
 *     services (AIVerificationService, WeeklyMerchantReportService, etc.).
 *
 * Falls back to the anon key (and placeholder values) when SERVICE_ROLE_KEY
 * is missing so that local builds and demo mode keep working — but real
 * mutations against production data require the service role.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Fail-closed in production — a missing `SUPABASE_SERVICE_ROLE_KEY`
 * would silently downgrade every "service-role" query to the anon key,
 * which combined with RLS-policy gaps would either 1) break the app
 * with misleading "empty result" errors, or 2) (if policies get added
 * permissively) let unauthenticated writes through. Catch the
 * misconfiguration at process boot instead of at query time.
 *
 * In dev/test we keep the anon-key fallback so `npm run build` and
 * offline typecheck don't require a real key.
 */
if (
  process.env.NODE_ENV === "production" &&
  (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === "placeholder-anon-key")
) {
  throw new Error(
    "lib/db: SUPABASE_SERVICE_ROLE_KEY is not set in production — " +
      "service-role queries would silently downgrade to the anon key. " +
      "Set the env var in your deployment and restart.",
  );
}

const SUPABASE_KEY =
  SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "placeholder-anon-key";

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);

// PostgREST "row not found" error code returned by `.single()`.
const PGRST_NO_ROWS = "PGRST116";

/**
 * Generic CRUD helpers around the service-role client.
 *
 * Generic `<T>` is the row shape, e.g. `db.select<LoyaltyCard>('loyalty_cards')`.
 * All methods throw on Supabase error so callers can use try/catch and rely
 * on the resolved value being well-formed.
 */
export const db = {
  /**
   * Select rows with optional equality filters.
   * `filters` is a flat object of column → expected value.
   *
   * @example
   *   const cards = await db.select<LoyaltyCard>('loyalty_cards', { merchant_id });
   */
  async select<T>(
    table: string,
    filters?: Record<string, unknown>,
  ): Promise<T[]> {
    let query = supabase.from(table).select("*");

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value as never);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as T[];
  },

  /**
   * Select a single row by primary key. Returns `null` if no row exists.
   *
   * @example
   *   const card = await db.selectOne<LoyaltyCard>('loyalty_cards', cardId);
   */
  async selectOne<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== PGRST_NO_ROWS) throw error;
    return (data as T | null) ?? null;
  },

  /**
   * Insert a single row and return the inserted record (with DB-defaulted fields).
   *
   * @example
   *   const card = await db.insert<LoyaltyCard>('loyalty_cards', { customer_id, ... });
   */
  async insert<T>(table: string, payload: Record<string, unknown>): Promise<T> {
    const { data, error } = await supabase
      .from(table)
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data as T;
  },

  /**
   * Update a row by id and return the updated record.
   *
   * @example
   *   const card = await db.update<LoyaltyCard>('loyalty_cards', id, { stamp_count: 3 });
   */
  async update<T>(
    table: string,
    id: string,
    payload: Record<string, unknown>,
  ): Promise<T> {
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  },

  /**
   * Delete a row by id. Resolves on success, throws on error.
   *
   * @example
   *   await db.delete('loyalty_cards', cardId);
   */
  async delete(table: string, id: string): Promise<void> {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
  },
};
