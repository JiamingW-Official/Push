/**
 * GET /api/admin/reports/weekly?limit=N
 *
 * Admin-scoped cross-merchant recent weekly reports. Replaces the admin
 * dashboard's previous call to `/api/merchant/reports/weekly?limit=5` —
 * that merchant route is now session-scoped to a single merchant's own
 * data, so it couldn't serve the cross-merchant roll-up the admin UI
 * expects.
 *
 * Response shape (matches Session 3-4 `useAdminMetrics.ts`):
 *   {
 *     data: Array<{
 *       week_start, merchant_id, merchant_name,
 *       verified_customers, revenue, roi
 *     }>,
 *     count, timestamp
 *   }
 *
 * Auth: admin session required.
 */

import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/api/admin-auth";
import { demoShortCircuit } from "@/lib/api/demo-short-circuit";
import { supabase } from "@/lib/db";
import { serverError, success } from "@/lib/api/responses";

const DEMO_WEEKLY = [
  {
    week_start: "2026-04-14",
    merchant_id: "demo-merch-1",
    merchant_name: "Blank Street Coffee — SoHo",
    verified_customers: 48,
    revenue: 612.5,
    roi: 3.8,
  },
  {
    week_start: "2026-04-14",
    merchant_id: "demo-merch-2",
    merchant_name: "Ess-a-Bagel — 21st",
    verified_customers: 37,
    revenue: 443.25,
    roi: 2.9,
  },
  {
    week_start: "2026-04-07",
    merchant_id: "demo-merch-1",
    merchant_name: "Blank Street Coffee — SoHo",
    verified_customers: 41,
    revenue: 522.5,
    roi: 3.4,
  },
];
import type { MerchantMetricsWeekly } from "@/types/database";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;

type WeeklyRow = {
  week_start: string;
  merchant_id: string;
  merchant_name: string;
  verified_customers: number;
  revenue: number;
  roi: number;
};

function clampLimit(raw: string | null): number {
  if (raw === null) return DEFAULT_LIMIT;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  if (parsed < 1) return 1;
  if (parsed > MAX_LIMIT) return MAX_LIMIT;
  return parsed;
}

export async function GET(request: NextRequest) {
  const demo = await demoShortCircuit("admin", () => DEMO_WEEKLY);
  if (demo) return demo;

  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const limit = clampLimit(request.nextUrl.searchParams.get("limit"));

  try {
    // PostgREST embed syntax: pull the merchant's business_name alongside
    // the weekly row. Relies on the FK merchant_metrics_weekly.merchant_id
    // → merchants.id created in 20260419000000_week3_missing_tables.
    type JoinedRow = Pick<
      MerchantMetricsWeekly,
      | "week_start"
      | "merchant_id"
      | "verified_customers"
      | "total_revenue"
      | "roi"
    > & {
      merchants: { business_name: string | null } | null;
    };

    const { data, error } = await supabase
      .from("merchant_metrics_weekly")
      .select(
        "week_start, merchant_id, verified_customers, total_revenue, roi, merchants(business_name)",
      )
      .order("week_start", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const rows: WeeklyRow[] = ((data ?? []) as unknown as JoinedRow[]).map(
      (r) => ({
        week_start: r.week_start,
        merchant_id: r.merchant_id,
        merchant_name: r.merchants?.business_name ?? "Unknown merchant",
        verified_customers: r.verified_customers,
        revenue: r.total_revenue,
        roi: r.roi,
      }),
    );

    return success(rows, { count: rows.length });
  } catch (err) {
    return serverError("admin-reports-weekly", err);
  }
}
