/**
 * GET /api/creator/gigs/active
 *
 * Returns invites the creator has accepted but not yet completed —
 * the data behind /creator/gigs/active. A gig moves out of this list
 * when it's marked paid or declined-after-accept (which routes it to
 * /gigs/history once that's wired up).
 *
 * For prompt 2 this returns seed-derived rows (status === "accepted").
 * Real DB wire-up (campaign_applications + push_transactions phase
 * derivation) lands when prompts 3-4 give us realtime channels.
 */

import { SEED_INVITES } from "@/lib/inbox/seed";
import { success, serverError } from "@/lib/api/responses";

export async function GET() {
  try {
    const accepted = SEED_INVITES.filter((i) => i.status === "accepted");
    return success(accepted, { count: accepted.length });
  } catch (err) {
    return serverError("creator-gigs-active", err);
  }
}
