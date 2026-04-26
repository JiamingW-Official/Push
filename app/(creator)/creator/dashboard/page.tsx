"use client";

/* ─────────────────────────────────────────────────────────────────────
 * Push — Creator Home (v2 · Lumin)
 *
 * Layout (12-col grid, mockup-aligned):
 *
 *   row 1: BalanceCard 4×5 | TodaysWork or OnboardingHero 8×3
 *   row 2: ……………………… | NewMatches      4×2
 *   row 3: ……………………… | NearbyMap       4×2
 *   row 4: TierRing 4 | PipelineHealth 4 | AnalyticsPeek 4
 *   row 5: ActivityTimeline 8×3 | InboxPeek 4×3
 *
 * State-aware lifecycle branching:
 *   - Day 0–7 OR active.length === 0  → OnboardingHero replaces TodaysWork
 *   - Closer/Partner tier              → PipelineHealth + TierRing swap order
 *
 * Authority: creator_home_mockup_day0_7.html · Lumin refs · Design.md v11
 * ───────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { DEMO_CREATOR } from "@/lib/creator/demo-data";
import {
  buildActivityFeed,
  getLifecycleStage,
  getRecommended,
} from "@/lib/creator/widget-helpers";

import { HomeHeader } from "@/components/creator/dashboard/HomeHeader";
import { BalanceCard } from "@/components/creator/dashboard/widgets/BalanceCard";
import { TodaysWork } from "@/components/creator/dashboard/widgets/TodaysWork";
import { OnboardingHero } from "@/components/creator/dashboard/widgets/OnboardingHero";
import { NewMatches } from "@/components/creator/dashboard/widgets/NewMatches";
import { NearbyMap } from "@/components/creator/dashboard/widgets/NearbyMap";
import { TierRing } from "@/components/creator/dashboard/widgets/TierRing";
import { PipelineHealth } from "@/components/creator/dashboard/widgets/PipelineHealth";
import { AnalyticsPeek } from "@/components/creator/dashboard/widgets/AnalyticsPeek";
import { ActivityTimeline } from "@/components/creator/dashboard/widgets/ActivityTimeline";
import { InboxPeek } from "@/components/creator/dashboard/widgets/InboxPeek";

import type {
  Application,
  Campaign,
  Creator,
  InboxThread,
  Payout,
} from "@/components/creator/dashboard/types";

import "./grid.css";

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

export default function CreatorDashboardPage() {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [threads, setThreads] = useState<InboxThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isDemo = checkDemoMode();
    let cancelled = false;

    async function load() {
      if (isDemo) {
        const demo = await import("@/lib/creator/demo-data");
        if (cancelled) return;
        setCreator(demo.DEMO_CREATOR as Creator);
        setCampaigns(demo.DEMO_CAMPAIGNS as Campaign[]);
        setApplications(demo.DEMO_APPLICATIONS as Application[]);
        setPayouts(demo.DEMO_PAYOUTS as Payout[]);
        setThreads((demo.DEMO_INBOX_THREADS as InboxThread[]) ?? []);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        setLoading(false);
        return;
      }

      const [c, ca, ap, po, th] = await Promise.all([
        supabase
          .from("creators")
          .select("*")
          .eq("id", session.session.user.id)
          .single(),
        supabase.from("campaigns").select("*").eq("status", "active").limit(50),
        supabase
          .from("applications")
          .select("*")
          .eq("creator_id", session.session.user.id),
        supabase
          .from("payouts")
          .select("*")
          .eq("creator_id", session.session.user.id),
        supabase
          .from("inbox_threads")
          .select("*")
          .eq("creator_id", session.session.user.id)
          .limit(10),
      ]);

      if (cancelled) return;
      setCreator(c.data ?? (DEMO_CREATOR as Creator));
      setCampaigns((ca.data ?? []) as Campaign[]);
      setApplications((ap.data ?? []) as Application[]);
      setPayouts((po.data ?? []) as Payout[]);
      setThreads((th.data ?? []) as InboxThread[]);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 32, color: "var(--ink-3)" }}>
        Loading dashboard…
      </div>
    );
  }

  if (!creator) {
    return (
      <div style={{ padding: 32, color: "var(--ink-3)" }}>
        Sign in to view your dashboard.
      </div>
    );
  }

  /* ── Derived data ───────────────────────────────────────────────── */
  const stage = getLifecycleStage(creator);
  const isNew = stage === "day_0_7";
  const isPro = creator.tier === "closer" || creator.tier === "partner";
  const active = applications.filter((a) => a.status === "accepted");
  const recommended = getRecommended(campaigns, applications, creator.tier, 3);
  const activity = buildActivityFeed(applications, payouts, 6);

  return (
    <div className="dh-page">
      <HomeHeader
        creator={creator}
        applications={applications}
        payouts={payouts}
      />

      <div className="dh-grid">
        {/* ── ROW 1: BalanceCard 4 | TodaysWork 8 ── */}
        <BalanceCard
          creator={creator}
          payouts={payouts}
          className="dh-span-4-auto"
        />

        {isNew || active.length === 0 ? (
          <OnboardingHero
            picks={recommended}
            creatorTier={creator.tier}
            className="dh-span-8-auto"
          />
        ) : (
          <TodaysWork
            applications={applications}
            creatorTier={creator.tier}
            className="dh-span-8-auto"
          />
        )}

        {/* ── ROW 2: NewMatches 4 | Map 8 ── */}
        <NewMatches
          recommended={recommended}
          creatorTier={creator.tier}
          className="dh-span-4-auto"
        />

        <NearbyMap campaigns={campaigns} className="dh-span-8-auto" />

        {/* ── ROW 3: TierRing 4 | PipelineHealth 4 | AnalyticsPeek 4 ── */}
        {isPro ? (
          <>
            <PipelineHealth
              applications={applications}
              className="dh-span-4-auto"
            />
            <TierRing creator={creator} className="dh-span-4-auto" />
          </>
        ) : (
          <>
            <TierRing creator={creator} className="dh-span-4-auto" />
            <PipelineHealth
              applications={applications}
              className="dh-span-4-auto"
            />
          </>
        )}

        <AnalyticsPeek
          reach={isNew ? undefined : 3200}
          scans={isNew ? undefined : 28}
          convPct={isNew ? undefined : 12}
          ctrPct={isNew ? undefined : 0.4}
          className="dh-span-4-auto"
        />

        {/* ── ROW 4: ActivityTimeline 8 | InboxPeek 4 ── */}
        <ActivityTimeline entries={activity} className="dh-span-8-auto" />
        <InboxPeek threads={threads} className="dh-span-4-auto" />
      </div>
    </div>
  );
}
