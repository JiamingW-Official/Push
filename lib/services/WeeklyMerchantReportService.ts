/**
 * Push v5.2 — Weekly Merchant Report Service
 *
 * Generates the merchant's weekly KPI snapshot (verified customers, revenue,
 * ROI, top creators) and persists it to `merchant_metrics_weekly`. Powers the
 * /api/merchant/reports/weekly POST endpoint and the Monday-morning report
 * email.
 *
 * Week 2 uses mock economic constants (avg price = $12.50, acquisition
 * cost = $150) so the pipeline can be exercised end-to-end without the
 * billing system being live. Week 3+ swaps these for per-merchant pricing
 * and real ad-spend data.
 *
 * Server-side only: uses the service-role Supabase client.
 */

import { db, supabase } from "@/lib/db";
import type { MerchantMetricsWeekly } from "@/types/database";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Per-creator slice of the weekly report's leaderboard. */
export interface TopCreator {
  /** Display name (Week 2: derived from creator UUID; Week 3+: real name). */
  name: string;
  /** Number of loyalty-card referrals attributed to this creator this week. */
  contribution_count: number;
  /** Share of the merchant's verified customers, as a percentage (0..100). */
  contribution_pct: number;
}

/** Full weekly report — superset of the persisted row (adds `top_creators`). */
export interface MerchantWeeklyReport {
  merchant_id: string;
  /** ISO date (YYYY-MM-DD) of the week's start. */
  week_start: string;
  verified_customers: number;
  total_revenue: number;
  roi: number;
  top_creators: TopCreator[];
}

// ---------------------------------------------------------------------------
// Economic constants.
// Defaults apply when the corresponding env var is unset — suitable for
// dev and Week-3 demos. Production overrides via Vercel env:
//   MOCK_AVG_TRANSACTION_USD   — mean ticket size in USD
//   MOCK_ACQUISITION_COST_USD  — cost of acquisition per merchant/week
// Full per-merchant pricing lands in the billing integration.
// ---------------------------------------------------------------------------

function readPositiveNumberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const MOCK_AVG_TRANSACTION_USD = readPositiveNumberEnv(
  "MOCK_AVG_TRANSACTION_USD",
  12.5,
);
const MOCK_ACQUISITION_COST_USD = readPositiveNumberEnv(
  "MOCK_ACQUISITION_COST_USD",
  150,
);
const TOP_CREATORS_LIMIT = 5;

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class WeeklyMerchantReportService {
  /**
   * Build, persist, and return a merchant's weekly report.
   *
   * Steps:
   *   a. Resolve week window [weekStart, weekStart + 7 days)
   *   b. Count approved verified_customer_claims for the merchant in window
   *   c. Revenue  = count × MOCK_AVG_TRANSACTION_USD
   *   d. ROI      = (revenue − MOCK_ACQUISITION_COST_USD) / cost × 100
   *   e. Tally creator contributions from loyalty_cards in the same window
   *   f. Take the top {@link TOP_CREATORS_LIMIT}
   *   g. Insert the row into merchant_metrics_weekly
   *
   * Throws on Postgres errors (e.g. unique_merchant_week violation if a
   * report for this (merchant, week_start) already exists — caller may
   * want to delete-then-regenerate or call {@link getWeeklyReport} first).
   */
  async generateWeeklyReport(
    merchantId: string,
    weekStart: Date,
  ): Promise<MerchantWeeklyReport> {
    // (a) Window: [weekStart, weekStart + 7 days)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // (b) Approved verified-customer claims this week.
    type ClaimRow = { id: string };
    const { data: claimsData, error: claimsErr } = await supabase
      .from("verified_customer_claims")
      .select("id")
      .eq("merchant_id", merchantId)
      .gte("verified_at", weekStart.toISOString())
      .lt("verified_at", weekEnd.toISOString())
      .eq("manual_review_status", "approved");

    if (claimsErr) throw claimsErr;
    const claims = (claimsData ?? []) as ClaimRow[];
    const verifiedCount = claims.length;

    // (c–d) Mock economics.
    const totalRevenue = verifiedCount * MOCK_AVG_TRANSACTION_USD;
    const roi =
      MOCK_ACQUISITION_COST_USD > 0
        ? ((totalRevenue - MOCK_ACQUISITION_COST_USD) /
            MOCK_ACQUISITION_COST_USD) *
          100
        : 0;

    // (e) Creator contributions from loyalty_cards in the same window.
    type CardRow = { creator_id: string };
    const { data: cardsData, error: cardsErr } = await supabase
      .from("loyalty_cards")
      .select("creator_id")
      .eq("merchant_id", merchantId)
      .gte("created_at", weekStart.toISOString())
      .lt("created_at", weekEnd.toISOString());

    if (cardsErr) throw cardsErr;
    const cards = (cardsData ?? []) as CardRow[];

    const creatorCounts = new Map<string, number>();
    for (const card of cards) {
      creatorCounts.set(
        card.creator_id,
        (creatorCounts.get(card.creator_id) ?? 0) + 1,
      );
    }

    // (f) Top N creators by contribution.
    const topCreators: TopCreator[] = Array.from(creatorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_CREATORS_LIMIT)
      .map(([creatorId, count]) => ({
        name: `Creator ${creatorId.slice(0, 8)}`,
        contribution_count: count,
        contribution_pct: verifiedCount > 0 ? (count / verifiedCount) * 100 : 0,
      }));

    // (g) Persist the aggregated row.
    const weekStartStr = toISODate(weekStart);
    const weekEndStr = toISODate(weekEnd);

    await db.insert<MerchantMetricsWeekly>("merchant_metrics_weekly", {
      merchant_id: merchantId,
      week_start: weekStartStr,
      week_end: weekEndStr,
      verified_customers: verifiedCount,
      total_revenue: round2(totalRevenue),
      roi: round2(roi),
      creator_count: creatorCounts.size,
      average_transaction:
        verifiedCount > 0 ? round2(totalRevenue / verifiedCount) : 0,
    });

    return {
      merchant_id: merchantId,
      week_start: weekStartStr,
      verified_customers: verifiedCount,
      total_revenue: round2(totalRevenue),
      roi: round2(roi),
      top_creators: topCreators,
    };
  }

  /**
   * Fetch a previously generated weekly metrics row, or `null` if none.
   * Note: returns the raw DB row (no `top_creators` — that's only computed
   * fresh by {@link generateWeeklyReport}).
   */
  async getWeeklyReport(
    merchantId: string,
    weekStart: string,
  ): Promise<MerchantMetricsWeekly | null> {
    const rows = await db.select<MerchantMetricsWeekly>(
      "merchant_metrics_weekly",
      { merchant_id: merchantId, week_start: weekStart },
    );
    return rows[0] ?? null;
  }

  /**
   * Format a weekly report as a plain-text email body.
   * Reserved for the Week 3 weekly-email job; not called from any route in
   * Week 2 but kept here so the service owns the formatting contract.
   */
  // Reserved for the Week 3 weekly-email job; intentionally unused in Week 2.
  private formatReportEmail(report: MerchantWeeklyReport): string {
    const creatorLines = report.top_creators
      .map(
        (c) =>
          `  - ${c.name}: ${c.contribution_count} referrals (${c.contribution_pct.toFixed(1)}%)`,
      )
      .join("\n");

    return [
      `Week Report — ${report.week_start}`,
      ``,
      `Verified Customers: ${report.verified_customers}`,
      `Revenue: $${report.total_revenue.toFixed(2)}`,
      `ROI: ${report.roi.toFixed(1)}%`,
      ``,
      `Top Creators:`,
      creatorLines || `  (none this week)`,
    ].join("\n");
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a Date as ISO date YYYY-MM-DD (UTC). */
function toISODate(d: Date): string {
  return d.toISOString().split("T")[0];
}

/** Round to 2 decimal places (returns a number, not a string). */
function round2(n: number): number {
  return parseFloat(n.toFixed(2));
}
