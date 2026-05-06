"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/data/fetcher";
import { historyGigsKey } from "@/lib/data/keys";

export type HistoryRow = {
  id: string;
  brand: string;
  brandInitial: string;
  campaign: string;
  category: string;
  finalPayout: number;
  outcomeTier: "Guaranteed" | "Target" | "Stretch";
  scansAchieved: number;
  status: "paid" | "declined" | "completed";
  paidAt: string;
  reelUrl?: string | null;
};

export function useHistory(year?: number) {
  const { data, error, isLoading, mutate } = useSWR<HistoryRow[]>(
    historyGigsKey({ year }),
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  return { data, error, isLoading, mutate };
}
