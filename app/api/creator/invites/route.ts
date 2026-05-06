/**
 * GET /api/creator/invites?status=pending&sort=match
 *
 * Returns the rich Invite[] shape consumed by /creator/gigs/invites.
 * NOTE: distinct from /api/creator/explore — explore returns Campaign rows
 * for the discover surface (geo + tier filters). Invites are gigs that have
 * already been pre-matched to this creator, with payout tiers + accept steps.
 *
 * Query params:
 *   status — pending (default) | accepted | declined | all
 *   sort   — match (default) | newest | expiring
 *
 * Today returns seed data — DB wire-up lands in P1.
 */

import { NextRequest } from "next/server";
import { SEED_INVITES, type Invite } from "@/lib/inbox/seed";
import { success, badRequest, serverError } from "@/lib/api/responses";

const STATUSES = new Set(["pending", "accepted", "declined", "all"]);
const SORTS = new Set(["match", "newest", "expiring"]);

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status") ?? "pending";
    const sort = req.nextUrl.searchParams.get("sort") ?? "match";

    if (!STATUSES.has(status)) {
      return badRequest("`status` must be pending, accepted, declined, or all");
    }
    if (!SORTS.has(sort)) {
      return badRequest("`sort` must be match, newest, or expiring");
    }

    let rows: Invite[] =
      status === "all"
        ? [...SEED_INVITES]
        : SEED_INVITES.filter((i) => i.status === status);

    if (sort === "match") {
      rows.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sort === "newest") {
      rows.sort(
        (a, b) =>
          new Date(b.receivedAt ?? 0).getTime() -
          new Date(a.receivedAt ?? 0).getTime(),
      );
    } else if (sort === "expiring") {
      rows.sort((a, b) => a.expiresAt - b.expiresAt);
    }

    return success(rows, { count: rows.length });
  } catch (err) {
    return serverError("creator-invites", err);
  }
}
