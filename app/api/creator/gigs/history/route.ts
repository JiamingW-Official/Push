/**
 * GET /api/creator/gigs/history?year=2026
 *
 * Past gigs (status IN ['completed', 'paid', 'declined']) for /creator/gigs/history.
 * Year filter optional. Each row carries the canonical Invite shape plus a
 * synthesized `paidAt` + `finalPayout` so the page renders earnings without
 * a second round-trip.
 *
 * Returns seed-derived data until campaign_applications + payouts are wired.
 */

import { NextRequest } from "next/server";
import { SEED_INVITES } from "@/lib/inbox/seed";
import { success, serverError } from "@/lib/api/responses";

type HistoryRow = {
  id: string;
  brand: string;
  brandInitial: string;
  campaign: string;
  category: string;
  finalPayout: number;
  outcomeTier: "Guaranteed" | "Target" | "Stretch";
  scansAchieved: number;
  status: "paid" | "declined" | "completed";
  paidAt: string;
  reelUrl?: string | null;
};

export async function GET(req: NextRequest) {
  try {
    const yearParam = req.nextUrl.searchParams.get("year");

    /* For demo, treat declined invites as the canonical history seed.
       Synthesize paidAt + payout breakdown deterministically per id. */
    const rows: HistoryRow[] = SEED_INVITES.filter(
      (i) => i.status === "declined" || i.status === "accepted",
    ).map((i, idx) => {
      const paidAt = new Date(
        Date.now() - (idx + 1) * 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const tiers = i.payoutTiers ?? [];
      const outcomeTier = (
        idx % 3 === 0 ? "Stretch" : idx % 3 === 1 ? "Target" : "Guaranteed"
      ) as HistoryRow["outcomeTier"];
      const finalPayout =
        tiers.find((t) => t.label === outcomeTier)?.amount ??
        tiers[0]?.amount ??
        0;
      return {
        id: i.id,
        brand: i.brand,
        brandInitial: i.brandInitial,
        campaign: i.campaign,
        category: i.category,
        finalPayout,
        outcomeTier,
        scansAchieved: 6 + idx,
        status: i.status === "declined" ? "declined" : "paid",
        paidAt,
        reelUrl: null,
      };
    });

    const filtered = yearParam
      ? rows.filter((r) => r.paidAt.startsWith(yearParam))
      : rows;

    return success(filtered, { count: filtered.length });
  } catch (err) {
    return serverError("creator-history", err);
  }
}
