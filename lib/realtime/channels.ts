"use client";

/**
 * Typed Supabase Realtime channel factories. Each `subscribe*` function:
 *   - Opens one Postgres-changes channel scoped to `creator_id`
 *   - Invokes the callback with the new row on INSERT (and UPDATE for some)
 *   - Returns an unsubscribe fn — callers MUST invoke on unmount
 *
 * Three channels are exposed today:
 *   - subscribeScans        — push_transactions inserts (verified scans)
 *   - subscribeInvites      — campaign_applications inserts (new invites)
 *   - subscribeNotifications — creator_notifications inserts (prompt 4)
 *
 * Demo mode (no real Supabase session) returns a no-op unsubscribe so
 * callers don't have to branch. The websocket simply never opens.
 *
 * Reconnection: Supabase realtime client handles backoff internally.
 * Higher-level UI (e.g. topnav "reconnecting…" pill) reads the channel
 * status via `getStatus()` exposed below.
 */

import { createClient } from "@/lib/db/browser";
import type { RealtimeChannel } from "@supabase/supabase-js";

type Unsubscribe = () => void;

/** Lazy singleton client — instantiated on first subscribe call so SSR
 *  doesn't try to open websockets. */
let cachedClient: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!cachedClient) cachedClient = createClient();
  return cachedClient;
}

type ScanEvent = {
  id: string;
  campaign_id: string;
  creator_id: string;
  occurred_at: string;
  status: "verified" | "fraud" | "pending";
};

export function subscribeScans(
  creatorId: string,
  onScan: (row: ScanEvent) => void,
): Unsubscribe {
  if (!creatorId) return () => {};
  const ch = getClient()
    .channel(`scans:${creatorId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "push_transactions",
        filter: `creator_id=eq.${creatorId}`,
      },
      (payload) => onScan(payload.new as ScanEvent),
    )
    .subscribe();

  return () => unsubscribe(ch);
}

type InviteEvent = {
  id: string;
  campaign_id: string;
  creator_id: string;
  status: string;
  created_at: string;
};

export function subscribeInvites(
  creatorId: string,
  onInvite: (row: InviteEvent) => void,
): Unsubscribe {
  if (!creatorId) return () => {};
  const ch = getClient()
    .channel(`invites:${creatorId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "campaign_applications",
        filter: `creator_id=eq.${creatorId}`,
      },
      (payload) => onInvite(payload.new as InviteEvent),
    )
    .subscribe();

  return () => unsubscribe(ch);
}

type NotificationEvent = {
  id: string;
  creator_id: string;
  kind: string;
  title: string;
  body: string;
  href: string | null;
  created_at: string;
};

export function subscribeNotifications(
  creatorId: string,
  onNotification: (row: NotificationEvent) => void,
): Unsubscribe {
  if (!creatorId) return () => {};
  const ch = getClient()
    .channel(`notifs:${creatorId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "creator_notifications",
        filter: `creator_id=eq.${creatorId}`,
      },
      (payload) => onNotification(payload.new as NotificationEvent),
    )
    .subscribe();

  return () => unsubscribe(ch);
}

type MessageEvent = {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

/**
 * Subscribe to message inserts on threads where the creator is a
 * participant. Used by /creator/inbox to bump threads to the top of the
 * list and animate-in new messages in the active thread.
 *
 * Note: Postgres-changes filter can only target a single column. Threads
 * with multi-participant membership require a server-side filter via a
 * PostgreSQL function or RLS predicate. For demo we listen to ALL message
 * inserts and let the client filter — fine at low volume.
 */
export function subscribeMessages(
  creatorId: string,
  onMessage: (row: MessageEvent) => void,
): Unsubscribe {
  if (!creatorId) return () => {};
  const ch = getClient()
    .channel(`messages:${creatorId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
      (payload) => onMessage(payload.new as MessageEvent),
    )
    .subscribe();

  return () => unsubscribe(ch);
}

function unsubscribe(ch: RealtimeChannel) {
  try {
    void ch.unsubscribe();
  } catch (err) {
    console.warn("[realtime] unsubscribe failed", err);
  }
}

/* ── Connection-status hook ─────────────────────────────────
   Used by the topnav chrome to show a "reconnecting…" pill on
   websocket disconnect. Polls the singleton client's transport
   state every 3s. Exponential-backoff is owned by Supabase client
   internals; we just surface the current state. */

import { useEffect, useState } from "react";

export type RealtimeStatus = "connecting" | "open" | "closed" | "error";

export function useRealtimeStatus(): RealtimeStatus {
  const [status, setStatus] = useState<RealtimeStatus>("connecting");

  useEffect(() => {
    const client = getClient();
    let cancelled = false;

    function tick() {
      if (cancelled) return;
      const transport = client.realtime?.connectionState?.() ?? "closed";
      const next: RealtimeStatus =
        transport === "open"
          ? "open"
          : transport === "connecting"
            ? "connecting"
            : transport === "closed"
              ? "closed"
              : "error";
      setStatus(next);
    }

    tick();
    const id = setInterval(tick, 3000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return status;
}
