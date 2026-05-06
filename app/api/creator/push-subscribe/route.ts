/**
 * POST /api/creator/push-subscribe
 * Body: PushSubscriptionJSON (browser-native shape from PushManager.subscribe)
 *
 * Stores the endpoint in creator_push_subscriptions so the notifications
 * service can fan out push messages on imminent_shoot / payout_received /
 * brand_message kinds.
 *
 * Idempotent: re-posting the same endpoint replaces the prior row's keys
 * (browsers rotate p256dh + auth on re-subscribe).
 */

import { NextRequest } from "next/server";
import { requireCreatorSession } from "@/lib/api/creator-auth";
import { supabase } from "@/lib/db";
import { success, badRequest, serverError } from "@/lib/api/responses";

export async function POST(req: NextRequest) {
  try {
    const gate = await requireCreatorSession();
    if (!gate.ok) return gate.response;

    const body = (await req.json().catch(() => null)) as {
      endpoint?: unknown;
      keys?: { p256dh?: unknown; auth?: unknown };
    } | null;

    if (
      !body ||
      typeof body.endpoint !== "string" ||
      !body.keys ||
      typeof body.keys.p256dh !== "string" ||
      typeof body.keys.auth !== "string"
    ) {
      return badRequest(
        "Expected { endpoint: string, keys: { p256dh: string, auth: string } }",
      );
    }

    const userAgent = req.headers.get("user-agent") ?? null;

    const { error } = await supabase.from("creator_push_subscriptions").upsert(
      {
        creator_id: gate.creatorId,
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth_key: body.keys.auth,
        user_agent: userAgent,
        last_used_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" },
    );

    if (error) throw error;
    return success({ subscribed: true });
  } catch (err) {
    return serverError("creator-push-subscribe", err);
  }
}

/**
 * DELETE /api/creator/push-subscribe?endpoint=...
 * Removes a subscription (called from PushManager.unsubscribe handler).
 */
export async function DELETE(req: NextRequest) {
  try {
    const gate = await requireCreatorSession();
    if (!gate.ok) return gate.response;

    const endpoint = req.nextUrl.searchParams.get("endpoint");
    if (!endpoint) return badRequest("?endpoint required");

    const { error } = await supabase
      .from("creator_push_subscriptions")
      .delete()
      .eq("creator_id", gate.creatorId)
      .eq("endpoint", endpoint);

    if (error) throw error;
    return success({ unsubscribed: true });
  } catch (err) {
    return serverError("creator-push-unsubscribe", err);
  }
}
