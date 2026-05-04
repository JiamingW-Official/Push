/* ─────────────────────────────────────────────────────────────────────
 * Widget helpers — formatters + derived data
 *
 * Repo target: lib/creator/widget-helpers.ts
 * ───────────────────────────────────────────────────────────────────── */

import type {
  Application,
  ActivityEntry,
  Campaign,
  Creator,
  CreatorTier,
  LifecycleStage,
  Milestone,
  Payout,
} from "@/components/creator/dashboard/types";
import { TIERS, type CreatorTier as TierConfigKey } from "@/lib/tier-config";

export const TIER_LABELS: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

/* Bridge: drop's lowercase CreatorTier ↔ tier-config PascalCase keys.
   This keeps widget code clean while still sourcing scores from the SSOT. */
function toConfigKey(tier: CreatorTier): TierConfigKey {
  return TIER_LABELS[tier] as TierConfigKey;
}

/* Tier accent colors — premium palette mapped to tier identity tokens
   (Design.md § Tier Identity System / SaaS premium register). */
export const TIER_COLORS: Record<CreatorTier, string> = {
  seed: "#b8a99a", // Clay
  explorer: "#669bbc", // Sky steel
  operator: "#2d6a4f", // Forest
  proven: "#3a4fd8", // Indigo
  closer: "#c9a96e", // Champagne
  partner: "#c1121f", // Ruby (brand-red)
};

export const PIPELINE: Milestone[] = [
  "accepted",
  "visited",
  "proof_submitted",
  "verified",
  "settled",
];

export const MILESTONE_LABELS: Record<Milestone, string> = {
  accepted: "Accepted",
  scheduled: "Scheduled",
  visited: "Visited",
  proof_submitted: "Proof submitted",
  content_published: "Published",
  verified: "Verified",
  settled: "Settled",
};

/* Category accents — keys normalized lowercase. Use catColor() for safe lookup. */
export const CAT_COLOR: Record<string, string> = {
  coffee: "#3a4fd8",
  food: "#2d6a4f",
  bakery: "#c9a96e",
  bar: "#c1121f",
  fitness: "#669bbc",
  retail: "#b8a99a",
  lifestyle: "#7c5e9b",
  beauty: "#e07a8c",
};

export function catColor(category?: string): string | undefined {
  if (!category) return undefined;
  return CAT_COLOR[category.toLowerCase()];
}

/* ── Greeting based on local hour ───────────────────────────────────── */
export function getGreeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return "GOOD NIGHT";
  if (h < 12) return "GOOD MORNING";
  if (h < 17) return "GOOD AFTERNOON";
  return "GOOD EVENING";
}

/* ── Formatters ─────────────────────────────────────────────────────── */
export function formatCurrency(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return `$${Math.round(n)}`;
}

export function formatCurrencyExact(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatDateShort(date = new Date()): string {
  return date
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

export function daysUntil(deadline?: string | null): number | null {
  if (!deadline) return null;
  const d = new Date(deadline).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((d - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function timeAgo(iso: string, now = new Date()): string {
  const ms = now.getTime() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${Math.max(1, m)}M AGO`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}H AGO`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}D AGO`;
  return `${Math.floor(d / 7)}W AGO`;
}

/* ── Tier progression ───────────────────────────────────────────────── */
export function getNextTier(current: CreatorTier): CreatorTier | null {
  const order: CreatorTier[] = [
    "seed",
    "explorer",
    "operator",
    "proven",
    "closer",
    "partner",
  ];
  const i = order.indexOf(current);
  return i >= 0 && i < order.length - 1 ? order[i + 1] : null;
}

export function getTierProgress(
  score: number,
  tier: CreatorTier,
): {
  pct: number; // 0–100
  pointsToNext: number; // 0 if MAX
  nextLabel: string | null;
} {
  const next = getNextTier(tier);
  if (!next) return { pct: 100, pointsToNext: 0, nextLabel: null };

  const currentMin = TIERS[toConfigKey(tier)]?.minScore ?? 0;
  const nextMin = TIERS[toConfigKey(next)]?.minScore ?? currentMin + 100;
  const range = nextMin - currentMin;
  const progress = Math.max(0, score - currentMin);
  const pct = Math.min(100, Math.round((progress / range) * 100));
  return {
    pct,
    pointsToNext: Math.max(0, nextMin - score),
    nextLabel: TIER_LABELS[next].toUpperCase(),
  };
}

/* ── Lifecycle stage detection — drives state-aware widgets ─────────── */
export function getLifecycleStage(c: Creator): LifecycleStage {
  const completed = c.campaigns_completed ?? 0;
  if (completed === 0) return "day_0_7";
  if (completed < 5) return "day_7_30";
  if (completed < 20) return "day_30_90";
  return "day_90_plus";
}

/* ── Recommended campaigns ──────────────────────────────────────────── */
const TIER_RANK: Record<CreatorTier, number> = {
  seed: 0,
  explorer: 1,
  operator: 2,
  proven: 3,
  closer: 4,
  partner: 5,
};

export function getRecommended(
  campaigns: Campaign[],
  applications: Application[],
  creatorTier: CreatorTier,
  limit = 3,
): Campaign[] {
  const appliedIds = new Set(applications.map((a) => a.campaign_id));
  return campaigns
    .filter((c) => !appliedIds.has(c.id))
    .filter((c) => TIER_RANK[c.tier_required] <= TIER_RANK[creatorTier])
    .filter((c) => c.spots_remaining > 0)
    .sort((a, b) => b.payout - a.payout)
    .slice(0, limit);
}

/* ── Pipeline runway: how many days of work do you have left? ───────── */
export function getPipelineRunway(activeApps: Application[]): {
  days: number;
  health: "low" | "medium" | "high";
  hint: string;
} {
  if (activeApps.length === 0) {
    return {
      days: 0,
      health: "low",
      hint: "No active campaigns — apply to 2–3 today to start your week.",
    };
  }
  // crude proxy: each active campaign = 3 days of pace
  const days = activeApps.length * 3;
  const health: "low" | "medium" | "high" =
    days <= 6 ? "low" : days <= 12 ? "medium" : "high";
  const hint =
    health === "low"
      ? `Apply to 2 more this week to maintain pace.`
      : health === "medium"
        ? `Healthy pipeline. Browse Discover for higher-payout matches.`
        : `Strong pipeline. Focus on completing in-flight work first.`;
  return { days, health, hint };
}

/* ── Pulse pill content ─────────────────────────────────────────────── */
export interface PulseData {
  todayCount: number; // deadlines today
  lastSettled: number | null; // $ amount of latest settled payout
  streakDays: number;
  tierLabel: string;
  tierScore: number;
}

export function derivePulseData(
  creator: Creator,
  applications: Application[],
  payouts: Payout[],
): PulseData {
  const todayCount = applications.filter(
    (a) => a.status === "accepted" && daysUntil(a.deadline) === 0,
  ).length;

  const settled = payouts
    .filter((p) => p.status === "completed")
    .sort((a, b) =>
      (b.paid_at ?? b.created_at).localeCompare(a.paid_at ?? a.created_at),
    )[0];

  const streakDays = computeStreak(applications);

  return {
    todayCount,
    lastSettled: settled ? settled.amount : null,
    streakDays,
    tierLabel: TIER_LABELS[creator.tier],
    tierScore: creator.push_score,
  };
}

/* Crude streak proxy: count distinct days in last 30 with at least one
   application milestone change. Replace with real activity table later. */
function computeStreak(applications: Application[]): number {
  const days = new Set<string>();
  const now = Date.now();
  for (const a of applications) {
    const t = new Date(a.created_at).getTime();
    if (now - t > 30 * 86400000) continue;
    days.add(new Date(a.created_at).toDateString());
  }
  return days.size;
}

/* ── Activity feed — merge applications + payouts into one timeline ─ */
export function buildActivityFeed(
  applications: Application[],
  payouts: Payout[],
  limit = 6,
): ActivityEntry[] {
  const entries: ActivityEntry[] = [];

  for (const p of payouts) {
    if (p.status === "completed") {
      entries.push({
        id: `payout-${p.id}`,
        kind: "payout_settled",
        title: `Payout settled · ${formatCurrencyExact(p.amount)}`,
        meta: `${p.merchant_name.toUpperCase()} · ${timeAgo(p.paid_at ?? p.created_at)}`,
        timestamp: p.paid_at ?? p.created_at,
      });
    }
  }

  for (const a of applications) {
    if (a.milestone === "verified" || a.milestone === "content_published") {
      entries.push({
        id: `verify-${a.id}`,
        kind: "proof_verified",
        title: `Proof verified · ${a.campaign_title}`,
        meta: `${a.merchant_name.toUpperCase()} · ${timeAgo(a.created_at)}`,
        timestamp: a.created_at,
      });
    }
    if (a.status === "pending") {
      entries.push({
        id: `invite-${a.id}`,
        kind: "invite_received",
        title: `New invite · ${a.campaign_title}`,
        meta: `${a.merchant_name.toUpperCase()} · ${timeAgo(a.created_at)}`,
        timestamp: a.created_at,
      });
    }
    if (a.milestone === "proof_submitted") {
      entries.push({
        id: `await-${a.id}`,
        kind: "awaiting_verification",
        title: `Awaiting verification · ${a.campaign_title}`,
        meta: `${a.merchant_name.toUpperCase()} · ${timeAgo(a.created_at)}`,
        timestamp: a.created_at,
      });
    }
  }

  return entries
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit);
}

/* ── Sparkline data: weekly earnings for last 8 weeks ───────────────── */
export function buildSparkData(payouts: Payout[], weeks = 8): number[] {
  const now = new Date();
  const buckets = new Array(weeks).fill(0);

  for (const p of payouts) {
    if (p.status !== "completed") continue;
    const t = new Date(p.paid_at ?? p.created_at).getTime();
    const weeksAgo = Math.floor((now.getTime() - t) / (7 * 86400000));
    if (weeksAgo >= 0 && weeksAgo < weeks) {
      buckets[weeks - 1 - weeksAgo] += p.amount;
    }
  }
  return buckets;
}
