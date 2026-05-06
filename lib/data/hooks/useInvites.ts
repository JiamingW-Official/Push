"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/data/fetcher";
import { invitesKey } from "@/lib/data/keys";
import type { Invite } from "@/lib/inbox/seed";

type InvitesOpts = Parameters<typeof invitesKey>[0];

/**
 * Invites list. Default: pending, sorted by matchScore desc. Refreshes
 * on focus and every 30s — invites are time-sensitive (expiry windows
 * tighten by the hour for some campaigns) so we revalidate more often
 * than today/earnings.
 */
export function useInvites(opts?: InvitesOpts) {
  const { data, error, isLoading, mutate } = useSWR<Invite[]>(
    invitesKey(opts),
    fetcher,
    {
      refreshInterval: 30_000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  return { data, error, isLoading, mutate };
}
