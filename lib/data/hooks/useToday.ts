"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/data/fetcher";
import { todayKey } from "@/lib/data/keys";
import type {
  Invite,
  Thread,
  SystemNotif,
  AttributionEvent,
} from "@/lib/inbox/seed";

export type TodayPayload = {
  invites: Invite[];
  threads: Thread[];
  notifications: SystemNotif[];
  attributionEvents: AttributionEvent[];
};

/**
 * Today briefing data. Refreshes on tab focus and every 60s while the tab
 * is visible. Used by /creator/today to render the hero, action queue,
 * pulse, and yesterday recap.
 */
export function useToday() {
  const { data, error, isLoading, mutate } = useSWR<TodayPayload>(
    todayKey(),
    fetcher,
    {
      refreshInterval: 60_000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  return { data, error, isLoading, mutate };
}
