/**
 * GET /api/creator/today
 *
 * Aggregates everything the /creator/today page needs in one round-trip:
 * invites · threads · system notifications · attribution events. The page
 * synthesizes the briefing client-side via /lib/today/briefing.ts.
 *
 * Today returns seed data unchanged — the SWR layer (prompt 1 of P0) is
 * about wiring the data flow, not the data source. When campaign_applications,
 * threads, and push_transactions tables are wired in (prompts 3-4), the
 * implementation here swaps without page-level changes.
 *
 * Performance: response is ~30 KB seed payload. SWR caches it for 60s and
 * revalidates on focus, so the page feels instant on tab return.
 */

import {
  SEED_INVITES,
  SEED_THREADS,
  SEED_NOTIFICATIONS,
  seedAttributionEvents,
} from "@/lib/inbox/seed";
import { success, serverError } from "@/lib/api/responses";

export async function GET() {
  try {
    return success({
      invites: SEED_INVITES,
      threads: SEED_THREADS,
      notifications: SEED_NOTIFICATIONS,
      attributionEvents: seedAttributionEvents,
    });
  } catch (err) {
    return serverError("creator-today", err);
  }
}
