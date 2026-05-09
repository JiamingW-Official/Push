"use client";

/**
 * Creator-side outbound applications — SWR hook.
 *
 *   const { data, error, isLoading, mutate } = useCreatorApplications();
 *
 * Returns the creator's open applications waiting on merchant decision.
 * Each row carries the campaign data (title, merchant, neighborhood,
 * thumbnail, pay) plus application-specific state (status, applied
 * timestamp, response ETA).
 *
 * Data path:
 *   1. SWR fetches from /api/creator/applications (GET) when the route
 *      ships. Until then, the inline fetcher returns mock data derived
 *      from MOCK_CAMPAIGNS so the new pages work end-to-end.
 *   2. Production swap: replace the inline fetcher with the standard
 *      `fetcher` from "@/lib/data/fetcher" pointed at the real route.
 *      Hook signature stays identical — pages don't need to change.
 *
 * Realtime: not wired in v1. Add subscribeMessages-style polling once
 * the production endpoint exists (decisions arrive via merchant action,
 * so a 60s poll + on-focus revalidate is enough for now).
 */

import useSWR from "swr";

export type ApplicationStatus = "reviewing" | "accepted" | "declined";

export type CreatorApplication = {
  /** Application id (production: app_xxx). Fallback: app-{campaignId}. */
  id: string;
  /** Campaign id the creator applied to. */
  campaignId: string;
  /** Campaign title at apply time. */
  campaignTitle: string;
  /** Merchant display name. */
  merchantName: string;
  /** Neighborhood + city ("Williamsburg, BK"). */
  neighborhood: string;
  /** Cash pay headline figure (per unit). */
  cashPay: number;
  /** Pay unit label (visit / post / reel / etc). */
  payUnit: string;
  /** Hero thumbnail URL. */
  thumbnailUrl: string;
  /** Decision state. */
  status: ApplicationStatus;
  /** Human "applied N ago" — server may compute this. */
  appliedAgo: string;
  /** Expected decision ETA string ("~12h", "—" if resolved). */
  responseEta: string;
};

const SWR_KEY = "/api/creator/applications";

async function mockFetcher(): Promise<CreatorApplication[]> {
  /* Mock fallback while /api/creator/applications GET ships. Derives
     from MOCK_CAMPAIGNS so pages have realistic shapes. Production
     swap to `fetcher(SWR_KEY)` once the endpoint returns this shape. */
  const { MOCK_CAMPAIGNS } = await import("@/lib/mocks/campaigns");
  const STATUSES: ApplicationStatus[] = [
    "reviewing",
    "reviewing",
    "reviewing",
    "accepted",
    "declined",
  ];
  const APPLIED_AGO = ["2 hr ago", "5 hr ago", "1 d ago", "1 d ago", "2 d ago"];
  const RESPONSE_ETA = ["~12 h", "~9 h", "~24 h", "—", "—"];

  return MOCK_CAMPAIGNS.slice(0, 5).map((c, i) => ({
    id: `app-${c.id}`,
    campaignId: c.id,
    campaignTitle: c.title,
    merchantName: c.merchantName,
    neighborhood: c.neighborhood,
    cashPay: c.cashPay,
    payUnit: c.payUnit,
    thumbnailUrl: c.images[0],
    status: STATUSES[i],
    appliedAgo: APPLIED_AGO[i],
    responseEta: RESPONSE_ETA[i],
  }));
}

export function useCreatorApplications() {
  const { data, error, isLoading, mutate } = useSWR<CreatorApplication[]>(
    SWR_KEY,
    mockFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 60_000,
    },
  );

  return {
    data: data ?? [],
    error,
    isLoading,
    mutate,
  };
}
