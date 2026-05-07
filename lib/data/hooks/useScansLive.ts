"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/data/fetcher";
import { campaignScansKey } from "@/lib/data/keys";
import { subscribeScans } from "@/lib/realtime/channels";

type ScanCounts = {
  verified: number;
  pending: number;
  total: number;
  /** ISO string of the most recent verified scan, if any. */
  lastEventAt: string | null;
};

/**
 * Per-campaign verified-scan counter combining SWR initial load + Supabase
 * Realtime delta updates. Returns:
 *   - count       — total verified scans
 *   - lastEventAt — ISO of latest scan (null until first arrives)
 *   - isLive      — true if a scan landed in the last 60s (drives the
 *                    pulsing "live" badge on .gav-card scan tickers)
 *
 * Pass `null` for campaignId to skip the subscription entirely (used when
 * no row is selected in the active page detail panel).
 */
export function useScansLive(campaignId: string | null, creatorId?: string) {
  const swrKey = campaignScansKey(campaignId);
  const { data, error, isLoading, mutate } = useSWR<ScanCounts>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  const [lastEventAt, setLastEventAt] = useState<string | null>(
    data?.lastEventAt ?? null,
  );
  const [tick, setTick] = useState(0);

  /* Subscribe to scan inserts when both ids are present. Each event:
       - bumps the verified count via SWR's optimistic mutate (no refetch)
       - records the timestamp for isLive computation
       - bumps `tick` to re-render isLive every 5s without re-subscribing  */
  useEffect(() => {
    if (!campaignId || !creatorId) return;

    const unsub = subscribeScans(creatorId, (row) => {
      if (row.campaign_id !== campaignId) return;
      if (row.status !== "verified") return;

      setLastEventAt(row.occurred_at);
      mutate(
        (prev) => ({
          verified: (prev?.verified ?? 0) + 1,
          pending: prev?.pending ?? 0,
          total: (prev?.total ?? 0) + 1,
          lastEventAt: row.occurred_at,
        }),
        false,
      );
    });

    return unsub;
  }, [campaignId, creatorId, mutate]);

  /* Re-evaluate isLive every 5s — pure UI state, no network. */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const isLive = (() => {
    void tick; // dependency tickle
    if (!lastEventAt) return false;
    const age = Date.now() - new Date(lastEventAt).getTime();
    return age < 60_000;
  })();

  return {
    count: data?.verified ?? 0,
    lastEventAt,
    isLive,
    error,
    isLoading,
  };
}
