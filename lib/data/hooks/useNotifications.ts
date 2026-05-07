"use client";

import useSWR from "swr";
import { useEffect } from "react";
import { fetcher } from "@/lib/data/fetcher";
import { notificationsKey } from "@/lib/data/keys";
import { subscribeNotifications } from "@/lib/realtime/channels";

type Notification = {
  id: string;
  creator_id: string;
  kind: string;
  title: string;
  body: string;
  href: string | null;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

/**
 * Combines SWR initial fetch + realtime delta updates for the
 * notification feed. Used by /creator/notifications and the topnav drawer
 * (prompt 10). Realtime fires `mutate` to prepend the new row without a
 * full revalidation.
 *
 * Pass `creatorId` to enable the realtime channel; without it the hook
 * still serves the SWR cache (used in demo mode where there's no
 * authenticated session).
 */
export function useNotifications(creatorId?: string) {
  const { data, error, isLoading, mutate } = useSWR<Notification[]>(
    notificationsKey(),
    fetcher,
    {
      refreshInterval: 60_000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  useEffect(() => {
    if (!creatorId) return;
    const unsub = subscribeNotifications(creatorId, (row) => {
      mutate(
        (prev) => [
          {
            id: row.id,
            creator_id: row.creator_id,
            kind: row.kind,
            title: row.title,
            body: row.body,
            href: row.href,
            read_at: null,
            metadata: {},
            created_at: row.created_at,
          },
          ...(prev ?? []),
        ],
        false,
      );
    });
    return unsub;
  }, [creatorId, mutate]);

  const unreadCount = (data ?? []).filter((n) => n.read_at == null).length;

  return { data, error, isLoading, mutate, unreadCount };
}
