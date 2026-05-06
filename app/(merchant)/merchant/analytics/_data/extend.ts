/* ─────────────────────────────────────────────────────────────────────
 * Merchant Analytics — derived + mock extension layer
 *
 * The real getAttributionSummary() returns scans / verified / revenue /
 * roi / fraud / by_creator[] / by_location[] / by_day[]. The bento needs
 * additional dimensions (spend decomposition, by-campaign, repeat/decay,
 * confidence distribution, recommendation) — derive what's possible from
 * the existing API, mock the rest until backend ships.
 *
 * P1 backend work (audit §4.5): extend getAttributionSummary to return
 * spend / repeat_customers / by_campaign / decay_dist / confidence_dist
 * directly so this layer collapses to a thin formatter.
 *
 * Williamsburg Tier-0 pilot calibration:
 *   1 location · 2-3 active creators · ~150 verified visits/month
 *   Spend ~$187/mo (sub $19.99 + promo ~$167)
 *   Revenue attributed ~$1124 (~$7.40 avg ticket × 152 verified)
 *   ROI ~6× sober defensible
 * ───────────────────────────────────────────────────────────────────── */

import type { AttributionSummary } from "@/lib/data/api-client";

export type DecayTier = "fresh" | "d50" | "d30" | "d10" | "expired";

export const DECAY_LABEL: Record<DecayTier, string> = {
  fresh: "Fresh 100%", d50: "50% window", d30: "30% window", d10: "10% window", expired: "Expired",
};
export const DECAY_COLOR: Record<DecayTier, string> = {
  fresh: "var(--accent-blue)", d50: "#4ade80", d30: "var(--champagne)", d10: "#f0e6c4", expired: "var(--surface-3)",
};

export type CampaignStatus = "active" | "ended" | "pending";

export type MerchantCampaign = {
  campaign_id: string;
  name: string;
  creator_id: string;
  creator_name: string;
  category: "Food" | "Beauty" | "Lifestyle";
  status: CampaignStatus;
  raw: number;
  verified: number;
  repeat_count: number;
  revenue_cents: number;
  spend_cents: number;
  roi: number;
  startedAt: string;
  endsAt: string;
};

export type MerchantRecommendation = {
  action: "renew" | "expand" | "pause" | "investigate";
  headline: string;
  body: string;
  confidence: "high" | "medium" | "low";
  next_steps: { label: string; href?: string }[];
  rule: string;
};

export type ExtendedSummary = AttributionSummary & {
  // Derived from real data
  spend_cents: number;
  cost_per_verified_cents: number;
  revenue_per_verified_cents: number;
  spend_breakdown: {
    subscription_cents: number;
    promo_cents: number;
    platform_fee_cents: number;
    total_cents: number;
  };

  // Mocked until backend ships (P1)
  repeat_customers: number;
  repeat_share: number;          // 0..1 — repeat / verified
  repeat_revenue_share: number;  // 0..1 — % of revenue from repeat fans

  by_campaign: MerchantCampaign[];

  decay_dist: { tier: DecayTier; share: number; count: number }[];

  confidence_dist: { low: number; medium: number; high: number };

  // 5-stage funnel (push-attribution §2 Five Layers translated to merchant POV)
  funnel: {
    impressions: number;       // estimated
    clicks: number;            // referral page clicks
    scans_raw: number;         // QR scans
    scans_verified: number;    // Layer-1 fulfillment passed
    repeat: number;            // Layer-5 repeat signal
  };

  recommendation: MerchantRecommendation;
};

const TIER_0_FALLBACK = {
  spend_cents: 18700,        // $187 — Williamsburg pilot calibration
  cost_per_verified_cents: 123,
  revenue_per_verified_cents: 740,
  repeat_share: 0.336,
  repeat_revenue_share: 0.51,
};

export function extendMerchantSummary(
  summary: AttributionSummary,
  windowDays: number = 30,
): ExtendedSummary {
  const verified = summary.verified_customers || 0;
  const revenue = summary.revenue_attributed || 0;

  // Derive spend from ROI when both > 0; else fallback to Tier-0 calibration
  const derivedSpendCents =
    summary.roi > 0 && revenue > 0
      ? Math.round(revenue / summary.roi)
      : TIER_0_FALLBACK.spend_cents;

  const subscriptionCents = 1999;  // Push Starter $19.99/mo
  const platformFeeCents = Math.round(derivedSpendCents * 0.05);
  const promoCents = Math.max(0, derivedSpendCents - subscriptionCents - platformFeeCents);

  const repeatCount = Math.round(verified * TIER_0_FALLBACK.repeat_share);
  const costPerVerified =
    verified > 0 ? Math.round(derivedSpendCents / verified) : TIER_0_FALLBACK.cost_per_verified_cents;
  const revenuePerVerified =
    verified > 0 ? Math.round(revenue / verified) : TIER_0_FALLBACK.revenue_per_verified_cents;

  // ── Decay distribution (mocked, derived from repeatCount)
  const decayDist: { tier: DecayTier; share: number; count: number }[] = [
    { tier: "fresh",   share: 0.50, count: Math.round(repeatCount * 0.50) },
    { tier: "d50",     share: 0.22, count: Math.round(repeatCount * 0.22) },
    { tier: "d30",     share: 0.14, count: Math.round(repeatCount * 0.14) },
    { tier: "d10",     share: 0.08, count: Math.round(repeatCount * 0.08) },
    { tier: "expired", share: 0.06, count: Math.round(repeatCount * 0.06) },
  ];

  // ── Confidence distribution (push-attribution §3)
  const confidence_dist = {
    high: Math.round(verified * 0.74),
    medium: Math.round(verified * 0.22),
    low: Math.round(verified * 0.04),
  };

  // ── Funnel (mocked impressions + clicks; verified/repeat from real data)
  const funnel = {
    impressions: Math.round(summary.scans * 18),
    clicks: Math.round(summary.scans * 2.4),
    scans_raw: summary.scans || 0,
    scans_verified: verified,
    repeat: repeatCount,
  };

  // ── By-campaign mock (3 campaigns split from totals — Williamsburg defaults)
  const c1 = { v: Math.round(verified * 0.55), r: Math.round(revenue * 0.55), sp: Math.round(derivedSpendCents * 0.45) };
  const c2 = { v: Math.round(verified * 0.30), r: Math.round(revenue * 0.30), sp: Math.round(derivedSpendCents * 0.30) };
  const c3 = { v: verified - c1.v - c2.v, r: revenue - c1.r - c2.r, sp: derivedSpendCents - c1.sp - c2.sp };

  const by_campaign: MerchantCampaign[] = [
    {
      campaign_id: "cmp_hero_brunch",
      name: "Saturday Brunch · Hero",
      creator_id: summary.by_creator[0]?.creator_id ?? "creator_1",
      creator_name: "@blank.brews",
      category: "Food",
      status: "active",
      raw: Math.round((summary.scans || 600) * 0.55),
      verified: c1.v,
      repeat_count: Math.round(c1.v * 0.40),
      revenue_cents: c1.r,
      spend_cents: c1.sp,
      roi: c1.sp > 0 ? +(c1.r / c1.sp).toFixed(2) : 0,
      startedAt: "2026-04-08",
      endsAt: "2026-05-08",
    },
    {
      campaign_id: "cmp_morning_rush",
      name: "Morning Rush · Tier-2",
      creator_id: summary.by_creator[1]?.creator_id ?? "creator_2",
      creator_name: "@n6.sips",
      category: "Food",
      status: "active",
      raw: Math.round((summary.scans || 600) * 0.30),
      verified: c2.v,
      repeat_count: Math.round(c2.v * 0.32),
      revenue_cents: c2.r,
      spend_cents: c2.sp,
      roi: c2.sp > 0 ? +(c2.r / c2.sp).toFixed(2) : 0,
      startedAt: "2026-04-15",
      endsAt: "2026-05-15",
    },
    {
      campaign_id: "cmp_weekend_sample",
      name: "Weekend Sampling",
      creator_id: summary.by_creator[2]?.creator_id ?? "creator_3",
      creator_name: "@bedford.eats",
      category: "Food",
      status: "ended",
      raw: Math.round((summary.scans || 600) * 0.15),
      verified: Math.max(0, c3.v),
      repeat_count: Math.max(0, Math.round(c3.v * 0.18)),
      revenue_cents: Math.max(0, c3.r),
      spend_cents: Math.max(0, c3.sp),
      roi: c3.sp > 0 ? +(c3.r / c3.sp).toFixed(2) : 0,
      startedAt: "2026-03-20",
      endsAt: "2026-04-15",
    },
  ];

  // ── Recommendation engine (rule-based, transparent)
  const recommendation = computeRecommendation(summary.roi, verified, summary.fraud_flags ?? 0);

  return {
    ...summary,
    spend_cents: derivedSpendCents,
    cost_per_verified_cents: costPerVerified,
    revenue_per_verified_cents: revenuePerVerified,
    spend_breakdown: {
      subscription_cents: subscriptionCents,
      promo_cents: promoCents,
      platform_fee_cents: platformFeeCents,
      total_cents: derivedSpendCents,
    },
    repeat_customers: repeatCount,
    repeat_share: TIER_0_FALLBACK.repeat_share,
    repeat_revenue_share: TIER_0_FALLBACK.repeat_revenue_share,
    by_campaign,
    decay_dist: decayDist,
    confidence_dist,
    funnel,
    recommendation,
  };
}

function computeRecommendation(roi: number, verified: number, fraud: number): MerchantRecommendation {
  // Rules per push-metrics §7 + §8 PMF signal definition
  if (fraud > verified * 0.05) {
    return {
      action: "investigate",
      headline: "Hold renewal · investigate fraud signal",
      body: "Fraud rate exceeds 5% of verified customers. Review flagged transactions before extending budget. Most resolved cases turn out to be timing-pattern false positives but you should see them yourself.",
      confidence: "high",
      next_steps: [
        { label: "Review fraud log", href: "/merchant/analytics/integrity" },
        { label: "Pause new campaigns" },
      ],
      rule: "fraud_flags / verified > 0.05",
    };
  }
  if (roi >= 4) {
    return {
      action: "expand",
      headline: "Renew + expand · ROI is well above platform median",
      body: `At ${roi.toFixed(1)}× ROI you are in the top quartile of pilot merchants. The marginal next dollar at this rate beats most paid-acquisition channels you have access to. Add 1-2 more creators or move to Growth ($69/mo) for 4 concurrent campaigns.`,
      confidence: "high",
      next_steps: [
        { label: "Upgrade to Growth", href: "/merchant/billing" },
        { label: "Spawn next campaign", href: "/merchant/campaigns/new" },
        { label: "Browse top-tier creators", href: "/merchant/creators" },
      ],
      rule: "roi >= 4 && fraud_rate < 5%",
    };
  }
  if (roi >= 2) {
    return {
      action: "renew",
      headline: "Renew · the rail is working",
      body: `${roi.toFixed(1)}× ROI clears the platform breakeven threshold. Hold cadence steady, refine creative, and reassess at the 60-day mark. Consider testing a Tier-2 sustained offer to extend referral tail.`,
      confidence: "medium",
      next_steps: [
        { label: "Renew current plan", href: "/merchant/billing" },
        { label: "Adjust offer mix", href: "/merchant/campaigns/edit" },
      ],
      rule: "2 ≤ roi < 4",
    };
  }
  return {
    action: "pause",
    headline: "Pause + diagnose · ROI below threshold",
    body: `${roi.toFixed(1)}× ROI is below the 2× working threshold. Either creator-fit, offer attractiveness, or attribution window length is misaligned. Pause new spend, run a 14-day diagnostic with one creator, then decide.`,
    confidence: "medium",
    next_steps: [
      { label: "Open diagnostic", href: "/merchant/analytics/funnel" },
      { label: "Review by-creator breakdown", href: "/merchant/analytics/creators" },
    ],
    rule: "roi < 2",
  };
}

/* ────────────────────────  Formatters  ──────────────────────── */

export function fmtUsd(cents: number, opts: { decimals?: 0 | 2 } = {}): string {
  const v = cents / 100;
  if (opts.decimals === 2) return `$${v.toFixed(2)}`;
  if (v < 10) return `$${v.toFixed(2)}`;
  return `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}

export function pctDelta(curr: number, prior: number): { sign: "+" | "−" | "±"; abs: number } | null {
  if (!Number.isFinite(prior) || prior === 0) return null;
  const v = ((curr - prior) / prior) * 100;
  return { sign: v > 0 ? "+" : v < 0 ? "−" : "±", abs: Math.abs(v) };
}

export function formatDelta(d: { sign: string; abs: number } | null, suffix = "vs prior 30d"): string {
  if (!d) return `— ${suffix}`;
  return `${d.sign}${d.abs.toFixed(0)}% ${suffix}`;
}

/* ────────────  Baseline mock for sub-page client-only mode  ──────────── */

/* Williamsburg coffee-shop pilot baseline. Sub-pages use this so they can
   render without a server fetch; overview uses real getAttributionSummary
   and so its numbers may differ slightly from sub-pages. P1: server-fetch
   from each sub-page so they all show real data in one go. */
export const BASELINE_SUMMARY: AttributionSummary = {
  scans: 624,
  verified_customers: 152,
  revenue_attributed: 112400,    // $1,124.00 in cents
  roi: 6.0,
  fraud_flags: 0,
  by_creator: [
    { creator_id: "@blank.brews",  scans: 340, verified: 84, revenue: 62200, roi: 7.4 },
    { creator_id: "@n6.sips",      scans: 180, verified: 46, revenue: 33700, roi: 5.6 },
    { creator_id: "@bedford.eats", scans: 104, verified: 22, revenue: 16500, roi: 3.3 },
  ],
  by_location: [
    { location_id: "loc_williamsburg_main", scans: 624, verified: 152, revenue: 112400 },
  ],
  by_day: (() => {
    const days: { date: string; scans: number; verified: number }[] = [];
    const today = new Date("2026-05-06");
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      // Smooth ramp + weekly seasonality (weekends higher)
      const base = 14 + i * 0.4 + (d.getDay() === 0 || d.getDay() === 6 ? 8 : 0);
      const verified = Math.round(Math.max(0, base + (Math.sin(i / 3) * 3)));
      days.push({
        date: d.toISOString().slice(0, 10),
        scans: Math.round(verified * 4.1),
        verified,
      });
    }
    return days;
  })(),
};

export const BASELINE_PRIOR: AttributionSummary = {
  scans: 528,
  verified_customers: 128,
  revenue_attributed: 95000,
  roi: 5.2,
  fraud_flags: 1,
  by_creator: BASELINE_SUMMARY.by_creator.map(c => ({
    ...c,
    scans: Math.round(c.scans * 0.85),
    verified: Math.round(c.verified * 0.85),
    revenue: Math.round(c.revenue * 0.85),
    roi: c.roi * 0.92,
  })),
  by_location: BASELINE_SUMMARY.by_location.map(l => ({
    ...l,
    scans: Math.round(l.scans * 0.85),
    verified: Math.round(l.verified * 0.85),
    revenue: Math.round(l.revenue * 0.85),
  })),
  by_day: [],
};
