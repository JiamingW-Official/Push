/**
 * GET /api/admin/dashboard
 *
 * Aggregated KPI snapshot for the admin overview page. Replaces the
 * pre-Batch-A hack where the admin UI called `merchant/dashboard?merchant_id=admin`
 * — that IDOR-shaped route is now session-scoped to real merchants only.
 *
 * Response shape (matches Session 3-4's `useAdminMetrics` hook):
 *   {
 *     data: {
 *       merchants_count:       number,
 *       creators_count:        number,
 *       weekly_transactions:   number,   // sum verified_customers this week
 *       average_roi:           number    // avg roi % across merchants this week
 *     },
 *     timestamp: string
 *   }
 *
 * Auth: admin session required (see `requireAdminSession`).
 */

import { requireAdminSession } from "@/lib/api/admin-auth";
import { demoShortCircuit } from "@/lib/api/demo-short-circuit";
import { supabase } from "@/lib/db";
import { serverError, success } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

/** ISO date (YYYY-MM-DD) of the most recent Monday, UTC. */
function getCurrentWeekStartISO(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - diffToMonday,
    ),
  );
  return monday.toISOString().split("T")[0];
}

export async function GET() {
  // Demo admins see a realistic snapshot without hitting OLTP.
  const demo = await demoShortCircuit("admin", () => ({
    merchants_count: 12,
    creators_count: 143,
    weekly_transactions: 287,
    average_roi: 3.4,
  }));
  if (demo) return demo;

  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  try {
    const weekStart = getCurrentWeekStartISO();

    // Three parallel COUNT / aggregate queries. `count: "estimated"` uses
    // pg_class.reltuples for O(1) counts — off-by-a-few is acceptable for
    // a dashboard KPI and avoids a full-table seq scan every 30 s poll.
    const [merchantsRes, creatorsRes, weeklyRes] = await Promise.all([
      supabase
        .from("merchants")
        .select("id", { head: true, count: "estimated" }),
      supabase
        .from("creators")
        .select("id", { head: true, count: "estimated" }),
      supabase
        .from("merchant_metrics_weekly")
        .select("verified_customers, roi")
        .eq("week_start", weekStart),
    ]);

    if (merchantsRes.error) throw merchantsRes.error;
    if (creatorsRes.error) throw creatorsRes.error;
    if (weeklyRes.error) throw weeklyRes.error;

    const weeklyRows = (weeklyRes.data ?? []) as Array<{
      verified_customers: number;
      roi: number;
    }>;

    const weeklyTransactions = weeklyRows.reduce(
      (sum, r) => sum + (r.verified_customers ?? 0),
      0,
    );
    const averageRoi =
      weeklyRows.length > 0
        ? weeklyRows.reduce((sum, r) => sum + (r.roi ?? 0), 0) /
          weeklyRows.length
        : 0;

    return success({
      merchants_count: merchantsRes.count ?? 0,
      creators_count: creatorsRes.count ?? 0,
      weekly_transactions: weeklyTransactions,
      average_roi: Number(averageRoi.toFixed(1)),
    });
  } catch (err) {
    return serverError("admin-dashboard", err);
  }
}
