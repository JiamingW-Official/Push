/**
 * POST /api/creator/notifications/read
 * Body: { ids: string[] } — specific IDs to mark read
 *     | { all: true }     — mark every unread for the session creator
 *
 * Returns: { updated: number }
 */

import { NextRequest } from "next/server";
import { requireCreatorSession } from "@/lib/api/creator-auth";
import { markRead, markAllRead } from "@/lib/services/notifications";
import { badRequest, success, serverError } from "@/lib/api/responses";

export async function POST(req: NextRequest) {
  try {
    const gate = await requireCreatorSession();
    if (!gate.ok) {
      // Demo mode — pretend we marked nothing. The UI optimistic update
      // already flipped read_at locally; this is a no-op confirmation.
      return success({ updated: 0, demo: true });
    }

    const body = (await req.json().catch(() => ({}))) as {
      ids?: unknown;
      all?: unknown;
    };

    if (body.all === true) {
      const updated = await markAllRead(gate.creatorId);
      return success({ updated });
    }

    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return badRequest("Body must be { ids: string[] } or { all: true }");
    }
    const ids = body.ids.filter((x): x is string => typeof x === "string");
    if (ids.length === 0) return badRequest("`ids` must contain strings");

    const updated = await markRead(gate.creatorId, ids);
    return success({ updated });
  } catch (err) {
    return serverError("creator-notifications-read", err);
  }
}
