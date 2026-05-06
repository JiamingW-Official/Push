"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/data/fetcher";
import { earningsKey } from "@/lib/data/keys";
import type { Transaction } from "@/lib/payments/mock-transactions";

type Balances = {
  pending: number;
  cleared: number;
  processing: number;
  paidOut: number;
  total: number;
};

type ActiveMilestone = {
  campaignId: string;
  campaign: string;
  merchant: string;
  totalPayout: number;
  milestones: { key: string; label: string; done: boolean }[];
  currentMilestone: string;
};

export type EarningsPayload = {
  summary: {
    thisMonthEarned: number;
    lastMonthEarned: number;
    delta: number;
    pendingNext: number;
  };
  balances: Balances;
  activeMilestones: ActiveMilestone[];
  transactions: Transaction[];
};

/**
 * Earnings data. Revalidates on focus only (interval polling would be
 * noisy — payouts move on cron, not real-time). The page's CashoutModal
 * still mutates locally; SWR cache will be revalidated on next focus or
 * via explicit mutate() in prompt 5 (optimistic mutations).
 */
export function useEarnings() {
  const { data, error, isLoading, mutate } = useSWR<EarningsPayload>(
    earningsKey(),
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  return { data, error, isLoading, mutate };
}
