"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/browser";
import type { Creator } from "../types";
import { DEMO_CREATOR } from "../demo-data";

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

interface UseCreatorProfileResult {
  creator: Creator | null;
  loading: boolean;
  isDemo: boolean;
  error: string | null;
}

export function useCreatorProfile(): UseCreatorProfileResult {
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    const demo = checkDemoMode();
    setIsDemo(demo);
    if (demo) {
      setCreator(DEMO_CREATOR);
      setLoading(false);
      return;
    }
    try {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        router.replace("/creator/signup");
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("creators")
        .select("*")
        .eq("user_id", authUser.id)
        .single();
      if (fetchError) setError(fetchError.message);
      if (data) setCreator(data as Creator);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { creator, loading, isDemo, error };
}
