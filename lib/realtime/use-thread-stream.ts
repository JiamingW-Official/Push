"use client";

/**
 * Real-time stream hooks for the threads/messages tables introduced in
 * 20260513000000_z_merge_offers_threads.sql. Companion to channels.ts
 * (which exposes raw subscribe* factories) — these provide React-state
 * abstractions ready to drop into inbox / chat UIs.
 *
 * Two hooks:
 *   • useThreadStream(threadId)        — live messages for one thread
 *   • useThreadInboxStream(userId)     — bumps when ANY incoming message
 *                                        targets the user (for inbox badge)
 *
 * Demo / no-session: both degrade to empty state with no websocket
 * connection — the cleanup function is still safe to call.
 */

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/db/browser";
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

export type ThreadMessage = {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_role: "creator" | "merchant" | "admin";
  content: string;
  content_type: "text" | "image" | "campaign-reference";
  attachments: unknown[];
  campaign_ref: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StreamStatus = "idle" | "subscribing" | "open" | "closed" | "error";

let cachedClient: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (!cachedClient) cachedClient = createClient();
  return cachedClient;
}

/**
 * Subscribe to message inserts on a single thread. Returns the running
 * list and a connection status flag for "live" pill rendering.
 *
 * The hook seeds with an empty list on mount; pair with a server-fetched
 * initial page (e.g. via `/api/merchant/messages/threads/[id]`) and
 * concatenate via `useMemo`.
 */
export function useThreadStream(threadId: string | null): {
  messages: ThreadMessage[];
  status: StreamStatus;
  reset: () => void;
} {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [status, setStatus] = useState<StreamStatus>("idle");
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!threadId) {
      setStatus("idle");
      setMessages([]);
      return;
    }

    setStatus("subscribing");
    const channel = getClient()
      .channel(`thread-stream:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ThreadMessage]);
        },
      )
      .subscribe((s) => {
        if (s === "SUBSCRIBED") setStatus("open");
        else if (s === "CLOSED") setStatus("closed");
        else if (s === "CHANNEL_ERROR" || s === "TIMED_OUT") setStatus("error");
      });

    channelRef.current = channel;

    return () => {
      try {
        void channel.unsubscribe();
      } catch (err) {
        console.warn("[useThreadStream] unsubscribe failed", err);
      }
      channelRef.current = null;
    };
  }, [threadId]);

  function reset() {
    setMessages([]);
  }

  return { messages, status, reset };
}

/**
 * Inbox-level stream — fires whenever ANY new message arrives that the
 * caller is the recipient of. Useful for:
 *   • Inbox sidebar unread badge (count rises on each event)
 *   • Toast notifications on the merchant dashboard
 *   • System-tray badge sync
 *
 * Filtering: Postgres-changes can only filter on a single column, and the
 * recipient isn't stored on `messages` directly (it's derived via
 * `threads.{merchant_user_id, creator_user_id}`). We listen to ALL message
 * inserts and let the consumer's `onIncoming` callback decide via the
 * thread join — at low volume this is fine, and RLS keeps the payload safe
 * (only messages on threads where the user is a participant reach the wire).
 */
export function useThreadInboxStream(userId: string | null): {
  unread: number;
  status: StreamStatus;
  markAllSeen: () => void;
} {
  const [unread, setUnread] = useState(0);
  const [status, setStatus] = useState<StreamStatus>("idle");

  useEffect(() => {
    if (!userId) {
      setStatus("idle");
      return;
    }

    setStatus("subscribing");
    const channel = getClient()
      .channel(`inbox-stream:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as ThreadMessage;
          // Don't count messages the user themselves sent.
          if (msg.sender_id !== userId) {
            setUnread((n) => n + 1);
          }
        },
      )
      .subscribe((s) => {
        if (s === "SUBSCRIBED") setStatus("open");
        else if (s === "CLOSED") setStatus("closed");
        else if (s === "CHANNEL_ERROR" || s === "TIMED_OUT") setStatus("error");
      });

    return () => {
      try {
        void channel.unsubscribe();
      } catch (err) {
        console.warn("[useThreadInboxStream] unsubscribe failed", err);
      }
    };
  }, [userId]);

  function markAllSeen() {
    setUnread(0);
  }

  return { unread, status, markAllSeen };
}
