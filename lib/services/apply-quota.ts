"use client";

/* ============================================================
   apply-quota.ts — tier-based daily apply allowance
   v1 · 2026-05-10

   Push uses a tier-locked daily apply quota for three reasons:
   - anti-spam (merchants don't want shotgun applications)
   - quality control (lazy applicants → low acceptance → bad funnel)
   - tier gamification (upgrades unlock more apply slots = visible
     reward for completing campaigns at high quality)
   - DAU hook (midnight reset = creators come back daily, like
     Hinge's daily likes pattern)

   Cooldown rules (enforced via reject + reapply timestamps in
   the live store):
   - Same campaign rejected → 30-day re-apply lockout
   - Same merchant any rejection → 14-day soft lockout

   Production: this file stays. The data sources (LIVE store /
   DEMO_CREATOR / mock applications) get replaced by the prod
   Supabase service in C2 — function signatures don't change.
   ============================================================ */

import { useSyncExternalStore } from "react";
import type { CreatorTier } from "@/lib/creator/types";
import { useCreatorApplications } from "@/lib/data/hooks/useCreatorApplications";
import type { CreatorApplication } from "@/lib/data/hooks/useCreatorApplications";

/* ── Tier → quota table ──────────────────────────────────── */

export interface TierQuota {
  /** Tier label for display ("T1 Seed"). */
  label: string;
  /** Tier numeric for compare ops (1-6). */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Apps allowed per day. `null` = unlimited. */
  daily: number | null;
  /** Apps allowed per rolling 7-day window. `null` = unlimited. */
  weekly: number | null;
  /** Max simultaneous pending applications. `null` = unlimited. */
  pendingCap: number | null;
  /** Plain-language unlock condition. Shown in upgrade tooltips. */
  unlockCondition: string;
}

const QUOTA_TABLE: Record<CreatorTier, TierQuota> = {
  seed: {
    label: "T1 Seed",
    level: 1,
    daily: 3,
    weekly: 15,
    pendingCap: 5,
    unlockCondition: "Signup",
  },
  explorer: {
    label: "T2 Explorer",
    level: 2,
    daily: 5,
    weekly: 25,
    pendingCap: 8,
    unlockCondition: "Complete 1 campaign with ≥4★",
  },
  operator: {
    label: "T3 Operator",
    level: 3,
    daily: 8,
    weekly: 40,
    pendingCap: 12,
    unlockCondition: "Complete 5 campaigns with ≥4.3★",
  },
  proven: {
    label: "T4 Proven",
    level: 4,
    daily: 12,
    weekly: 60,
    pendingCap: 20,
    unlockCondition: "Complete 15 campaigns with ≥4.5★",
  },
  closer: {
    label: "T5 Closer",
    level: 5,
    daily: 18,
    weekly: 80,
    pendingCap: 20,
    unlockCondition: "Complete 30 campaigns with ≥4.7★",
  },
  partner: {
    label: "T6 Partner",
    level: 6,
    daily: null,
    weekly: null,
    pendingCap: null,
    unlockCondition: "Invite-only · Push leadership",
  },
};

export function quotaForTier(tier: CreatorTier): TierQuota {
  return QUOTA_TABLE[tier];
}

/** The next tier above this one (undefined for partner). */
export function nextTier(tier: CreatorTier): TierQuota | undefined {
  const order: CreatorTier[] = [
    "seed",
    "explorer",
    "operator",
    "proven",
    "closer",
    "partner",
  ];
  const idx = order.indexOf(tier);
  if (idx < 0 || idx === order.length - 1) return undefined;
  const next = order[idx + 1];
  return next ? QUOTA_TABLE[next] : undefined;
}

/* ── Application timestamp parsing ──────────────────────── */

/** Application ids are `app-{campaignId}-{Date.now()}` for live
 *  rows, or `app-{campaignId}` for seed rows. Parse the trailing
 *  numeric segment as the applied-at epoch. Seed rows fall back
 *  to a stable older date so they don't count toward "today". */
function appliedAtMs(app: CreatorApplication): number {
  const m = app.id.match(/-(\d{10,})$/);
  if (m && m[1]) return Number(m[1]);
  // Seed row — pretend applied 7 days ago so it's outside any
  // "today" or "this week" window.
  return Date.now() - 7 * 24 * 60 * 60 * 1000;
}

function isSameLocalDay(a: number, b: number): boolean {
  const ad = new Date(a);
  const bd = new Date(b);
  return (
    ad.getFullYear() === bd.getFullYear() &&
    ad.getMonth() === bd.getMonth() &&
    ad.getDate() === bd.getDate()
  );
}

/** Count of applications submitted today (creator's local date). */
export function applicationsTodayCount(
  applications: CreatorApplication[],
): number {
  const now = Date.now();
  return applications.filter((a) => isSameLocalDay(appliedAtMs(a), now)).length;
}

/** Count of currently pending applications (status === reviewing). */
export function pendingApplicationsCount(
  applications: CreatorApplication[],
): number {
  return applications.filter((a) => a.status === "reviewing").length;
}

/* ── Decision helpers ────────────────────────────────────── */

export interface QuotaCheck {
  /** Can the creator apply right now? */
  allowed: boolean;
  /** Why not (when blocked) — display verbatim in tooltip. */
  reason?: string;
  /** Daily slots remaining (or null if unlimited). */
  remainingDaily: number | null;
  /** Pending slots remaining (or null if unlimited). */
  remainingPending: number | null;
  /** The tier in effect for this check. */
  tier: TierQuota;
  /** Local timestamp when the daily window resets ("midnight ET"). */
  resetsAt: string;
}

export function checkApplyQuota(
  tier: CreatorTier,
  applications: CreatorApplication[],
): QuotaCheck {
  const t = QUOTA_TABLE[tier];
  const usedToday = applicationsTodayCount(applications);
  const pending = pendingApplicationsCount(applications);

  const remainingDaily =
    t.daily === null ? null : Math.max(0, t.daily - usedToday);
  const remainingPending =
    t.pendingCap === null ? null : Math.max(0, t.pendingCap - pending);

  let allowed = true;
  let reason: string | undefined;

  if (t.daily !== null && usedToday >= t.daily) {
    allowed = false;
    const next = nextTier(tier);
    reason = next
      ? `${t.label} limit hit (${t.daily}/day). ${next.unlockCondition} to unlock ${next.daily}/day.`
      : `${t.label} limit hit (${t.daily}/day). Resets at midnight ET.`;
  } else if (t.pendingCap !== null && pending >= t.pendingCap) {
    allowed = false;
    reason = `${t.label} pending cap hit (${t.pendingCap} open applications). Wait for a decision before applying again.`;
  }

  return {
    allowed,
    reason,
    remainingDaily,
    remainingPending,
    tier: t,
    resetsAt: nextMidnightET(),
  };
}

function nextMidnightET(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const hours = Math.round((tomorrow.getTime() - now.getTime()) / 3_600_000);
  if (hours < 1) return "less than 1h";
  if (hours === 1) return "1h";
  return `${hours}h`;
}

/* ── React hook ──────────────────────────────────────────── */

/** Hook combining the SWR application list with the quota table.
 *  Re-runs whenever a new application is added (the SWR cache
 *  revalidates via mutate from applyToCampaign). */
export function useApplyQuota(tier: CreatorTier): QuotaCheck {
  const { data: applications } = useCreatorApplications();
  return checkApplyQuota(tier, applications);
}

/* ── Subscribable store fallback ─────────────────────────── */

/** Hook that explicitly subscribes to the LIVE applications store
 *  (skipping SWR) — useful when the campaign page wants the quota
 *  to update the moment a new application lands without waiting
 *  for SWR's revalidation cycle. */
export function useApplyQuotaSync(tier: CreatorTier): QuotaCheck {
  // SSR fallback — assume full quota (creator hasn't applied to
  // anything yet from a fresh server render).
  const apps = useSyncExternalStore(
    subscribeToLive,
    getLiveSnapshot,
    getEmptySnapshot,
  );
  return checkApplyQuota(tier, apps);
}

let liveCache: CreatorApplication[] = [];
const liveSubscribers = new Set<() => void>();

function getLiveSnapshot(): CreatorApplication[] {
  if (typeof window === "undefined") return liveCache;
  // Lazy-load to avoid SSR import cycle.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getLiveApplications } = require("@/lib/data/live-applications") as {
    getLiveApplications: () => CreatorApplication[];
  };
  liveCache = getLiveApplications();
  return liveCache;
}

function getEmptySnapshot(): CreatorApplication[] {
  return [];
}

function subscribeToLive(fn: () => void): () => void {
  liveSubscribers.add(fn);
  // Bridge to the live-applications subscribe — set up an interval
  // because we don't have direct access to its subscribe() (it's
  // private to the module). For demo this works; production swaps
  // in Supabase real-time subscription.
  const id = window.setInterval(() => {
    const snap = getLiveSnapshot();
    if (snap.length !== liveCache.length) fn();
  }, 1000);
  return () => {
    liveSubscribers.delete(fn);
    window.clearInterval(id);
  };
}
