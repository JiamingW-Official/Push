"use client";

/* ─────────────────────────────────────────────────────────────────────
 * Push — Creator Home (v2)
 *
 * Repo target: app/(creator)/creator/dashboard/page.tsx
 * Replaces the 3,226-line v3 monolith. Goal: ≤ 200 LOC, all rendering
 * delegated to widget components in components/creator/dashboard/widgets/.
 *
 * Authority:
 *   Design.md v11 (§ 8.13 sidebar / § 8.14 KPI grid / § 9 buttons)
 *   CREATOR_PSYCHOLOGY_v1.md (5-zone composition, state-aware widgets)
 *
 * State-aware lifecycle branching:
 *   - Day 0–7:   OnboardingHero replaces TodaysWork
 *   - Day 90+ (Closer/Partner): PipelineHealth replaces TierRing
 *
 * Data:
 *   - Pulls from Supabase via existing pattern; falls back to demo data
 *     when the demo cookie is set or live fetch returns empty.
 *   - All formatters / derived data live in lib/creator/widget-helpers.ts.
 * ───────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { DEMO_CREATOR } from "@/lib/creator/demo-data";
import {
  buildActivityFeed,
  getLifecycleStage,
  getRecommended,
} from "@/lib/creator/widget-helpers";

import { HomeHeader }        from "@/components/creator/dashboard/HomeHeader";
import { TodaysWork }        from "@/components/creator/dashboard/widgets/TodaysWork";
import { OnboardingHero }    from "@/components/creator/dashboard/widgets/OnboardingHero";
import { NewMatches }        from "@/components/creator/dashboard/widgets/NewMatches";
import { NearbyMap }         from "@/components/creator/dashboard/widgets/NearbyMap";
import { EarningsAmbient }   from "@/components/creator/dashboard/widgets/EarningsAmbient";
import { TierRing }          from "@/components/creator/dashboard/widgets/TierRing";
import { PipelineHealth }    from "@/components/creator/dashboard/widgets/PipelineHealth";
import { AnalyticsPeek }     from "@/components/creator/dashboard/widgets/AnalyticsPeek";
import { ActivityTimeline }  from "@/components/creator/dashboard/widgets/ActivityTimeline";
import { InboxPeek }         from "@/components/creator/dashboard/widgets/InboxPeek";

import type {
  Application, Campaign, Creator, InboxThread, Payout,
} from "@/components/creator/dashboard/types";

import "./grid.css";

/* ── Demo cookie detection (kept from v3) ─────────────────────────── */
function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

export default function CreatorDashboardPage() {
  const [creator,      setCreator]      = useState<Creator | null>(null);
  const [campaigns,    setCampaigns]    = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payouts,      setPayouts]      = useState<Payout[]>([]);
  const [threads,      setThreads]      = useState<InboxThread[]>([]);
  const [loading,      setLoading]      = useState(true);

  /* ── Fetch (or fall back to demo data) ──────────────────────────── */
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

      // Fetch in parallel — same queries as v3 page
      const [c, ca, ap, po, th] = await Promise.all([
        supabase.from("creators").select("*").eq("id", session.session.user.id).single(),
        supabase.from("campaigns").select("*").eq("status", "active").limit(50),
        supabase.from("applications").select("*").eq("creator_id", session.session.user.id),
        supabase.from("payouts").select("*").eq("creator_id", session.session.user.id),
        supabase.from("inbox_threads").select("*").eq("creator_id", session.session.user.id).limit(10),
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
    return () => { cancelled = true; };
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
  const stage    = getLifecycleStage(creator);
  const isNew    = stage === "day_0_7";
  const isPro    = creator.tier === "closer" || creator.tier === "partner";
  const active   = applications.filter((a) => a.status === "accepted");
  const recommended = getRecommended(campaigns, applications, creator.tier, 3);
  const activity    = buildActivityFeed(applications, payouts, 6);

  return (
    <div className="dh-page">
      <HomeHeader
        creator={creator}
        applications={applications}
        payouts={payouts}
      />

      <div className="dh-grid">

        {/* ── ACTION ZONE ── */}
        {isNew || active.length === 0 ? (
          <OnboardingHero
            picks={recommended}
            creatorTier={creator.tier}
            className="dh-span-6-3"
          />
        ) : (
          <TodaysWork
            applications={applications}
            creatorTier={creator.tier}
            className="dh-span-6-3"
          />
        )}

        <NewMatches
          recommended={recommended}
          creatorTier={creator.tier}
          className="dh-span-3-3"
        />

        {/* ── DISCOVERY ZONE ── */}
        <NearbyMap
          campaigns={campaigns}
          className="dh-span-6-2"
        />

        <EarningsAmbient
          creator={creator}
          payouts={payouts}
          className="dh-span-3-2"
        />

        {/* ── STATUS ZONE — state-aware: Tier vs Pipeline ── */}
        {isPro ? (
          <PipelineHealth
            applications={applications}
            className="dh-span-3-1"
          />
        ) : (
          <TierRing
            creator={creator}
            className="dh-span-3-1"
          />
        )}

        {/* When pro user, show TierRing too (smaller weight); else PipelineHealth */}
        {isPro ? (
          <TierRing
            creator={creator}
            className="dh-span-3-1"
          />
        ) : (
          <PipelineHealth
            applications={applications}
            className="dh-span-3-1"
          />
        )}

        <AnalyticsPeek
          /* TODO wire to analytics service when available */
          reach={isNew ? undefined : 3200}
          scans={isNew ? undefined : 28}
          convPct={isNew ? undefined : 12}
          ctrPct={isNew ? undefined : 0.4}
          className="dh-span-3-1"
        />

        {/* ── HISTORY ZONE ── */}
        <ActivityTimeline
          entries={activity}
          className="dh-span-6-2"
        />

        <InboxPeek
          threads={threads}
          className="dh-span-3-2"
        />

      </div>
    </div>
  );
}
