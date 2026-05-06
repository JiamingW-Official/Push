"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/data/fetcher";
import { subscribeMessages } from "@/lib/realtime/channels";

type Thread = {
  id: string;
  brand: string;
  brandInitial: string;
  campaign: string;
  lastMessage: string;
  unreadCount: number;
  lastActivityAt: string;
};

/**
 * Inbox thread list with realtime new-message bump. SWR fetches the
 * canonical list; subscribeMessages prepends/bumps the matching thread
 * when a new message lands. Provides a `mutate` for the page to refresh
 * after sending a reply.
 */
export function useInbox(creatorId?: string) {
  const swrKey = "/api/creator/messages";
  const { data, error, isLoading, mutate } = useSWR<Thread[]>(swrKey, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 60_000,
  });

  useEffect(() => {
    if (!creatorId) return;
    const unsub = subscribeMessages(creatorId, (row) => {
      mutate((prev) => {
        if (!prev) return prev;
        const idx = prev.findIndex((t) => t.id === row.thread_id);
        if (idx === -1) return prev;
        const updated = {
          ...prev[idx],
          lastMessage: row.content,
          lastActivityAt: row.created_at,
          unreadCount: prev[idx].unreadCount + 1,
        };
        // Move to top.
        return [updated, ...prev.filter((_, i) => i !== idx)];
      }, false);
    });
    return unsub;
  }, [creatorId, mutate]);

  return { data, error, isLoading, mutate };
}
