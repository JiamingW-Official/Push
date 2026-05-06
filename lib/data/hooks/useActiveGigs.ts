"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/data/fetcher";
import { activeGigsKey } from "@/lib/data/keys";
import type { Invite } from "@/lib/inbox/seed";

/**
 * Active gigs (invites the creator accepted that haven't paid out yet).
 * Refreshes every 30s and on focus — phase changes (shoot → post →
 * verify → paid) move quickly enough that 30s feels live without
 * spamming the API. Prompt 3 will replace the polling with Supabase
 * Realtime delta updates.
 */
export function useActiveGigs() {
  const { data, error, isLoading, mutate } = useSWR<Invite[]>(
    activeGigsKey(),
    fetcher,
    {
      refreshInterval: 30_000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  return { data, error, isLoading, mutate };
}
