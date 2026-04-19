"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Campaign } from "../types";
import { DEMO_CAMPAIGNS } from "../demo-data";

interface UseCampaignsResult {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
}

export function useCampaigns(isDemo: boolean): UseCampaignsResult {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    if (isDemo) {
      setCampaigns(DEMO_CAMPAIGNS);
      setLoading(false);
      return;
    }
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("campaigns")
        .select(
          `id, title, payout, spots_remaining, spots_total, deadline, lat, lng, category, image, tier_required, description, requirements, merchants(business_name, address)`,
        )
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) {
        setError(fetchError.message);
        return;
      }
      if (data) {
        setCampaigns(
          data.map((c) => ({
            ...c,
            payout: Number(c.payout),
            business_name:
              (c.merchants as unknown as { business_name: string } | null)
                ?.business_name ?? "Local Business",
            business_address: (
              c.merchants as unknown as { address: string } | null
            )?.address,
          })) as Campaign[],
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  return { campaigns, loading, error };
}
