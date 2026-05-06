/**
 * GET /api/creator/campaigns/[id]/scans
 *
 * Initial scan counts for a campaign. SWR uses this on mount; Supabase
 * Realtime (subscribeScans) handles delta updates after that. Returning
 * a single object (verified/pending/total/lastEventAt) keeps the cache
 * key flat and the optimistic mutate path simple.
 *
 * Demo mode returns synthesized counts derived from seed attribution
 * events — the prompt-3 acceptance criteria don't require DB-real data,
 * just a stable initial-load shape.
 */

import { NextRequest } from "next/server";
import { seedAttributionEvents } from "@/lib/inbox/seed";
import { success, serverError } from "@/lib/api/responses";

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, ctx: { params: Params }) {
  try {
    const { id } = await ctx.params;
    const events = seedAttributionEvents.filter((e) => e.campaignId === id);
    const verified = events.filter((e) => e.status === "verified").length;
    const pending = events.filter((e) => e.status === "pending").length;
    const lastVerified = events
      .filter((e) => e.status === "verified")
      .sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      )[0];

    return success({
      verified,
      pending,
      total: events.length,
      lastEventAt: lastVerified?.occurredAt ?? null,
    });
  } catch (err) {
    return serverError("creator-campaign-scans", err);
  }
}
