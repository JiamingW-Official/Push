/**
 * Notifications service. All read/write to creator_notifications goes
 * through this module — routes are thin wrappers, mutations elsewhere
 * (acceptInvite, payout cleared, scan verified, brand message) call
 * sendNotification() to fan out.
 *
 * Channel selection:
 *   - In-app: every notification is inserted into creator_notifications
 *   - Web Push: only kinds in PUSH_KINDS (imminent_shoot, payout_received,
 *     brand_message). Other kinds rely on the in-app feed + email digest.
 *   - Email digest: handled by the cron at /api/internal/notifications/digest
 *     which picks unread last-24h.
 */

import { db, supabase } from "@/lib/db";

export type NotificationKind =
  | "imminent_shoot"
  | "payout_received"
  | "payout_cleared"
  | "brand_message"
  | "invite_arrived"
  | "verification_complete"
  | "scan_verified"
  | "system";

export type CreatorNotification = {
  id: string;
  creator_id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href: string | null;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

/** Kinds that trigger Web Push (in addition to in-app feed). */
const PUSH_KINDS: ReadonlySet<NotificationKind> = new Set([
  "imminent_shoot",
  "payout_received",
  "brand_message",
]);

export async function sendNotification(input: {
  creatorId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<CreatorNotification> {
  const row = {
    creator_id: input.creatorId,
    kind: input.kind,
    title: input.title,
    body: input.body,
    href: input.href ?? null,
    metadata: input.metadata ?? {},
  };

  const { data, error } = await supabase
    .from("creator_notifications")
    .insert(row)
    .select("*")
    .single();

  if (error) throw error;

  if (PUSH_KINDS.has(input.kind)) {
    /* Fan out to push subscriptions. Failures logged but don't fail the
       caller — the in-app row is already persisted. */
    void deliverWebPush(input.creatorId, {
      title: input.title,
      body: input.body,
      href: input.href ?? null,
    }).catch((err) => {
      console.warn("[notifications] web push delivery failed", err);
    });
  }

  return data as CreatorNotification;
}

export async function listFeed(
  creatorId: string,
  limit = 20,
): Promise<CreatorNotification[]> {
  const { data, error } = await supabase
    .from("creator_notifications")
    .select("*")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as CreatorNotification[];
}

export async function markRead(
  creatorId: string,
  ids: string[],
): Promise<number> {
  if (ids.length === 0) return 0;
  const { data, error } = await supabase
    .from("creator_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("creator_id", creatorId)
    .in("id", ids)
    .is("read_at", null)
    .select("id");

  if (error) throw error;
  return (data ?? []).length;
}

export async function markAllRead(creatorId: string): Promise<number> {
  const { data, error } = await supabase
    .from("creator_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("creator_id", creatorId)
    .is("read_at", null)
    .select("id");

  if (error) throw error;
  return (data ?? []).length;
}

/** Delivers the same payload to every device the creator has registered.
 *  Keeps the API thin: title, body, href. Decoration (icon, badge, actions)
 *  is added at the service-worker layer. */
async function deliverWebPush(
  creatorId: string,
  payload: { title: string; body: string; href: string | null },
) {
  const { data: subs, error } = await supabase
    .from("creator_push_subscriptions")
    .select("id, endpoint, p256dh, auth_key")
    .eq("creator_id", creatorId);

  if (error) {
    console.warn("[notifications] subscription lookup failed", error);
    return;
  }

  if (!subs || subs.length === 0) return;

  /* The actual web-push library is intentionally NOT imported here —
     this stub records the intent. When `web-push` is added to package.json
     (separate prompt), wire the call here. Keeping it stubbed lets the
     migration + service shape land first without forcing a runtime dep
     that demo mode doesn't need. */
  console.info(
    `[notifications] would push to ${subs.length} device(s) for ${creatorId}: ${payload.title}`,
  );
}

/** Pull unread notifications from the last 24h for a creator — used by
 *  the daily email digest cron. */
export async function listRecentUnread(creatorId: string) {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("creator_notifications")
    .select("*")
    .eq("creator_id", creatorId)
    .is("read_at", null)
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CreatorNotification[];
}

/* Re-export the service-role client for callers that need raw row ops
 * outside this module (e.g. the digest cron iterating all creators). */
export { db };
