"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Application } from "../types";
import { DEMO_APPLICATIONS } from "../demo-data";

interface UseApplicationsResult {
  applications: Application[];
  appliedIds: Set<string>;
  loading: boolean;
  error: string | null;
}

export function useApplications(
  isDemo: boolean,
  authUserId?: string,
): UseApplicationsResult {
  const [applications, setApplications] = useState<Application[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    if (isDemo) {
      setApplications(DEMO_APPLICATIONS);
      setAppliedIds(new Set(DEMO_APPLICATIONS.map((a) => a.campaign_id)));
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
        .from("applications")
        .select(
          `id, campaign_id, status, milestone, payout, created_at, campaigns(title, deadline, category, merchants(business_name))`,
        )
        .eq("creator_id", authUserId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }
      if (data) {
        const mapped = data.map((a) => ({
          id: a.id,
          campaign_id: a.campaign_id,
          status: a.status,
          milestone: a.milestone,
          payout: Number(a.payout),
          created_at: a.created_at,
          campaign_title:
            (a.campaigns as unknown as { title: string } | null)?.title ?? "",
          merchant_name:
            (
              a.campaigns as unknown as {
                merchants: { business_name: string };
              } | null
            )?.merchants?.business_name ?? "",
          deadline: (a.campaigns as unknown as { deadline: string } | null)
            ?.deadline,
          category: (a.campaigns as unknown as { category: string } | null)
            ?.category,
        })) as Application[];
        setApplications(mapped);
        setAppliedIds(new Set(data.map((a) => a.campaign_id)));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [isDemo, authUserId]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return { applications, appliedIds, loading, error };
}
