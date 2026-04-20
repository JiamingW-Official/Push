/**
 * /api/merchant/reports/weekly
 *
 * GET  ?week_start=YYYY-MM-DD
 *      → Fetch a previously generated weekly report row from
 *        merchant_metrics_weekly for the LOGGED-IN merchant. Returns 404
 *        if no row exists. `merchant_id` is derived from the session —
 *        the URL no longer accepts it (IDOR fix from Batch A audit).
 *
 * POST { week_start }
 *      → Generate a fresh report by aggregating verified_customer_claims
 *        and loyalty_cards in the [week_start, week_start + 7d) window,
 *        persist it via WeeklyMerchantReportService.generateWeeklyReport(),
 *        and return the full MerchantWeeklyReport (includes top_creators).
 *        merchant_id comes from the session; callers cannot supply it.
 */

import { NextRequest } from "next/server";
import { WeeklyMerchantReportService } from "@/lib/services/WeeklyMerchantReportService";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  badRequest,
  notFound,
  serverError,
  success,
  unauthorized,
} from "@/lib/api/responses";

export const dynamic = "force-dynamic";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Stateless aggregation service — single shared instance avoids per-request
// allocation. Same pattern as /api/internal/ai-verify.
const reportService = new WeeklyMerchantReportService();

/**
 * Resolve the session's merchant row. Returns `null` unauthorized.
 * Centralized so both GET and POST use the exact same check.
 */
async function resolveMerchantId(): Promise<string | null> {
  const sb = await createServerSupabaseClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data, error } = await sb
    .from("merchants")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data.id as string;
}

export async function GET(request: NextRequest) {
  const weekStart = request.nextUrl.searchParams.get("week_start");

  if (!weekStart?.trim()) {
    return badRequest("week_start is required");
  }
  if (!ISO_DATE_RE.test(weekStart)) {
    return badRequest("week_start must be ISO date (YYYY-MM-DD)");
  }

  try {
    const merchantId = await resolveMerchantId();
    if (!merchantId) return unauthorized();

    const report = await reportService.getWeeklyReport(merchantId, weekStart);
    if (!report) return notFound("Report not found");

    return success(report);
  } catch (err) {
    return serverError("merchant-reports-weekly GET", err);
  }
}

export async function POST(request: NextRequest) {
  let body: { week_start?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  const { week_start } = body;
  if (!week_start?.trim()) {
    return badRequest("week_start is required");
  }
  if (!ISO_DATE_RE.test(week_start)) {
    return badRequest("week_start must be ISO date (YYYY-MM-DD)");
  }

  // Parse the date as UTC midnight so the [week_start, +7d) window the
  // service computes is timezone-deterministic.
  const weekStartDate = new Date(`${week_start}T00:00:00Z`);
  if (Number.isNaN(weekStartDate.getTime())) {
    return badRequest("week_start is not a valid date");
  }

  try {
    const merchantId = await resolveMerchantId();
    if (!merchantId) return unauthorized();

    const report = await reportService.generateWeeklyReport(
      merchantId,
      weekStartDate,
    );
    return success(report);
  } catch (err) {
    return serverError("merchant-reports-weekly POST", err);
  }
}
