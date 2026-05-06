/**
 * GET  /api/creator/notifications        — list latest 20 for the session
 * POST /api/creator/notifications/read   — mark IDs as read (this file
 *                                          handles GET only; read POST is
 *                                          in ./read/route.ts)
 *
 * In demo mode (no real creator session) the route returns the seed
 * SystemNotif[] so the UI shell doesn't paint empty.
 */

import { NextRequest } from "next/server";
import { requireCreatorSession } from "@/lib/api/creator-auth";
import { listFeed } from "@/lib/services/notifications";
import { SEED_NOTIFICATIONS } from "@/lib/inbox/seed";
import { success, serverError } from "@/lib/api/responses";

export async function GET(req: NextRequest) {
  try {
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 20);
    const gate = await requireCreatorSession();
    if (!gate.ok) {
      // Demo mode — return seed feed (matches /creator/notifications page's
      // existing fallback).
      return success(SEED_NOTIFICATIONS.slice(0, limit), {
        count: Math.min(SEED_NOTIFICATIONS.length, limit),
        demo: true,
      });
    }
    const rows = await listFeed(gate.creatorId, limit);
    return success(rows, { count: rows.length });
  } catch (err) {
    return serverError("creator-notifications-list", err);
  }
}
