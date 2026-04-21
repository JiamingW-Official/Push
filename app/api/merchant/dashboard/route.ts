/**
 * GET /api/merchant/dashboard
 *
 * Returns the authenticated merchant's KPI snapshot for the current ISO
 * week. Previously accepted `?merchant_id=<uuid>` from the URL — an IDOR
 * vector flagged in the Batch A audit — now derives merchant_id from the
 * logged-in Supabase session via `merchants.user_id = auth.uid()`.
 *
 * Reads the pre-aggregated row from `merchant_metrics_weekly`. If no row
 * exists yet for this week (e.g. before the Monday-morning weekly job),
 * falls back to a zeroed payload so the dashboard never blanks out.
 */

import { NextRequest } from "next/server";
import { supabase } from "@/lib/db";
import { createServerSupabaseClient } from "@/lib/db/server";
import { serverError, unauthorized } from "@/lib/api/responses";
import type { MerchantMetricsWeekly } from "@/types/database";

export const dynamic = "force-dynamic";

/** Returns the ISO date (YYYY-MM-DD) of the most recent Monday, UTC. */
function getCurrentWeekStartISO(): string {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sun, 1 = Mon, ...
  const diffToMonday = (day + 6) % 7; // Mon → 0, Tue → 1, ..., Sun → 6
  const monday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - diffToMonday,
    ),
  );
  return monday.toISOString().split("T")[0];
}

export async function GET(_request: NextRequest) {
  try {
    // 1. Session check — anon callers can't reach a specific merchant's KPI.
    const sb = await createServerSupabaseClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return unauthorized();

    // 2. Resolve merchant row via user_id FK — never trust a client-supplied id.
    const { data: merchantRow, error: mErr } = await sb
      .from("merchants")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (mErr) throw mErr;
    if (!merchantRow) return unauthorized("No merchant profile for user");

    const merchantId = merchantRow.id as string;
    const weekStart = getCurrentWeekStartISO();

    // 3. Service-role query for the aggregated row (RLS-free; safe
    //    because we've already authenticated + resolved the merchant_id
    //    from the session).
    const { data, error } = await supabase
      .from("merchant_metrics_weekly")
      .select("*")
      .eq("merchant_id", merchantId)
      .eq("week_start", weekStart)
      .maybeSingle();

    if (error) throw error;

    const metrics = (data as MerchantMetricsWeekly | null) ?? {
      verified_customers: 0,
      total_revenue: 0,
      roi: 0,
      creator_count: 0,
      average_transaction: 0,
    };

    return Response.json({
      merchant_id: merchantId,
      week_start: weekStart,
      current_week: metrics,
      meta: {
        last_updated: new Date().toISOString(),
        source: data ? "merchant_metrics_weekly" : "default_zero",
      },
    });
  } catch (err) {
    return serverError("merchant-dashboard", err);
  }
}
