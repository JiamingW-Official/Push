"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/db/browser";
import type { Payout } from "../types";
import { DEMO_PAYOUTS } from "../demo-data";

interface UsePayoutsResult {
  payouts: Payout[];
  loading: boolean;
  error: string | null;
}

export function usePayouts(
  isDemo: boolean,
  authUserId?: string,
): UsePayoutsResult {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPayouts = useCallback(async () => {
    if (isDemo) {
      setPayouts(DEMO_PAYOUTS);
      setLoading(false);
      return;
    }
    if (!authUserId) {
      setLoading(false);
      return;
    }
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("payouts")
        .select("*")
        .eq("creator_id", authUserId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }
      if (data) setPayouts(data as Payout[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load payouts");
    } finally {
      setLoading(false);
    }
  }, [isDemo, authUserId]);

  useEffect(() => {
    loadPayouts();
  }, [loadPayouts]);

  return { payouts, loading, error };
}
