/* ─────────────────────────────────────────────────────────────────────
 * Push Creator Analytics — shared mock dataset (Williamsburg pilot scale)
 *
 * Single source of truth for the overview + 8 detail pages. Numbers
 * are sober — calibrated to a v6-streamlined Phase 0 Operator running
 * 2-3 concurrent campaigns in Williamsburg. Replace with the real
 * getCreatorAttributionSummary() shape (audit §4.5) once API ships.
 *
 * Authority: push-creator §6-tier · push-attribution §1-4 · push-metrics §3
 * ───────────────────────────────────────────────────────────────────── */

export type Tier =
  | "Seed" | "Explorer" | "Operator" | "Proven" | "Closer" | "Partner";

export const TIER_LADDER: {
  tier: Tier;
  material: string;
  swatch: string;          // hex — Tier identity (Design.md tier system)
  scoreFloor: number;
  basePay: string;
  commission: string;
  milestone: { threshold: number; bonus: number } | null;
  concurrent: number;
  payoutSpeed: string;
  unlocks: string[];
}[] = [
  { tier: "Seed",     material: "Clay",    swatch: "#b8a99a", scoreFloor:  0, basePay: "Free product",   commission: "0%",  milestone: null,                              concurrent: 1, payoutSpeed: "Instant",   unlocks: ["Welcome kit", "First campaign checklist"] },
  { tier: "Explorer", material: "Bronze",  swatch: "#a07b4a", scoreFloor: 40, basePay: "$10–15/campaign", commission: "0%",  milestone: null,                              concurrent: 2, payoutSpeed: "T+3",       unlocks: ["Cash payment", "Referral data dashboard", "Content guide"] },
  { tier: "Operator", material: "Steel",   swatch: "#7d7c78", scoreFloor: 55, basePay: "$15–25/campaign", commission: "3%", milestone: { threshold: 30, bonus: 15 },      concurrent: 3, payoutSpeed: "T+2",       unlocks: ["Milestone bonus +$15 @ 30 txns", "Data literacy tutorial"] },
  { tier: "Proven",   material: "Gold",    swatch: "#bfa170", scoreFloor: 65, basePay: "$25–40/campaign", commission: "5%", milestone: { threshold: 40, bonus: 30 },      concurrent: 4, payoutSpeed: "T+1",       unlocks: ["Premium partnerships", "Merchant tier preference", "1-on-1 review"] },
  { tier: "Closer",   material: "Ruby",    swatch: "#9b1c2e", scoreFloor: 78, basePay: "$40–75/campaign", commission: "7%", milestone: { threshold: 60, bonus: 50 },      concurrent: 6, payoutSpeed: "Same-day",  unlocks: ["Dedicated manager", "Strategy coaching", "Pro-only campaigns"] },
  { tier: "Partner",  material: "Obsidian",swatch: "#1a1a2e", scoreFloor: 88, basePay: "$75–150/campaign",commission: "10%", milestone: { threshold: 80, bonus: 80 },     concurrent: 8, payoutSpeed: "Instant",   unlocks: ["Co-branding", "Advisory access", "Exclusive partnerships"] },
];

/* Williamsburg-pilot Operator — sober numbers per audit §4.3 */
export const SUMMARY = {
  windowDays: 30,
  windowFrom: "2026-04-06",
  windowTo: "2026-05-06",
  refreshedAt: "2026-05-06T09:42:00Z",

  // Volume
  scansRaw: 1640,
  scansVerified: 412,
  verificationRate: 0.251,
  scansRawPrior: 1392,
  scansVerifiedPrior: 348,

  // Money — decomposed
  earnings: { base: 60, commission: 12, milestone: 15, total: 87 },
  earningsPrior: 78,

  // Repeat
  repeatCustomers: 142,
  repeatCustomersPrior: 115,
  repeatShareOfVerified: 0.345,
  repeatRevenueShare: 0.60,

  // Tier
  currentTier: "Operator" as Tier,
  currentScore: 60,
  scoreHistory: [44, 47, 51, 53, 55, 57, 58, 60, 60, 60, 60, 60],   // last 12 weeks

  // Score dimensions (push-creator scoring-model)
  scoreDimensions: [
    { name: "Completion",   value: 92, weight: 30, target: 85 },
    { name: "Reliability",  value: 88, weight: 20, target: 80 },
    { name: "Quality",      value: 64, weight: 25, target: 75 },
    { name: "Satisfaction", value: 78, weight: 15, target: 75 },
    { name: "Engagement",   value: 41, weight: 10, target: 50 },
  ],
} as const;

/* Milestone state */
export const MILESTONE = {
  current: 31,
  threshold: 30,
  bonus: 15,
  hit: true,
  hitDate: "2026-05-04",
  windowResetsAt: "2026-05-31",
  nextTierThreshold: 40,
  nextTierBonus: 30,
};

/* Time-series — last 6 months */
export const TIME_SERIES: { m: string; raw: number; verified: number; repeat: number }[] = [
  { m: "Dec", raw: 720,  verified: 180, repeat: 50 },
  { m: "Jan", raw: 960,  verified: 240, repeat: 75 },
  { m: "Feb", raw: 1100, verified: 290, repeat: 95 },
  { m: "Mar", raw: 1400, verified: 350, repeat: 115 },
  { m: "Apr", raw: 1500, verified: 380, repeat: 130 },
  { m: "May", raw: 1640, verified: 412, repeat: 142 },
];

/* Campaigns */
export type CampaignStatus = "active" | "ended" | "pending";
export const CAMPAIGNS: {
  id: string;
  name: string;
  merchant: string;
  neighborhood: string;
  category: "Food" | "Beauty" | "Lifestyle";
  verified: number;
  raw: number;
  repeatPct: number;
  perScan: number;
  status: CampaignStatus;
  earnings: number;
  startedAt: string;
  endsAt: string;
}[] = [
  { id: "cmp_blank_street",      name: "Blank Street Coffee",   merchant: "Blank Street",    neighborhood: "Williamsburg",     category: "Food",      verified: 168, raw: 680, repeatPct: 0.38, perScan: 0.07, status: "active",  earnings: 32, startedAt: "2026-04-06", endsAt: "2026-05-06" },
  { id: "cmp_chacha",            name: "Cha Cha Matcha · N6",   merchant: "Cha Cha Matcha",  neighborhood: "Williamsburg",     category: "Food",      verified: 92,  raw: 360, repeatPct: 0.29, perScan: 0.09, status: "active",  earnings: 22, startedAt: "2026-04-12", endsAt: "2026-05-12" },
  { id: "cmp_superiority",       name: "Superiority Burger",    merchant: "Superiority",     neighborhood: "Lower East Side",  category: "Food",      verified: 78,  raw: 280, repeatPct: 0.36, perScan: 0.12, status: "ended",   earnings: 18, startedAt: "2026-03-08", endsAt: "2026-04-08" },
  { id: "cmp_brow_theory",       name: "Brow Theory · Bedford", merchant: "Brow Theory",     neighborhood: "Bedford-Stuy",     category: "Beauty",    verified: 48,  raw: 220, repeatPct: 0.21, perScan: 0.06, status: "pending", earnings: 10, startedAt: "2026-04-22", endsAt: "2026-05-22" },
  { id: "cmp_flamingo",          name: "Flamingo Estate · Pop", merchant: "Flamingo Estate", neighborhood: "Greenpoint",       category: "Lifestyle", verified: 26,  raw: 100, repeatPct: 0.12, perScan: 0.05, status: "ended",   earnings: 5,  startedAt: "2026-03-01", endsAt: "2026-03-22" },
];

/* Anonymized fans — Push signature lens */
export type DecayTier = "fresh" | "d50" | "d30" | "d10" | "expired";
export const DECAY_LABEL: Record<DecayTier, string> = {
  fresh: "Fresh 100%", d50: "50% window", d30: "30% window", d10: "10% window", expired: "Expired",
};
export const DECAY_COLOR: Record<DecayTier, string> = {
  fresh: "var(--accent-blue)", d50: "#4ade80", d30: "var(--champagne)", d10: "#f0e6c4", expired: "var(--surface-3)",
};

export const FANS: {
  id: string;
  visits: number;
  revenue: number;     // attributed merchant revenue (cents → $ here)
  daysSinceLast: number;
  decay: DecayTier;
  campaigns: string[];
  expiresIn: number | null; // days
}[] = [
  { id: "0xa92f3", visits: 6, revenue: 42, daysSinceLast:  3, decay: "fresh",   campaigns: ["Blank Street", "Cha Cha Matcha"],     expiresIn: 27 },
  { id: "0x4b8e1", visits: 4, revenue: 28, daysSinceLast: 14, decay: "d50",     campaigns: ["Blank Street"],                       expiresIn: 16 },
  { id: "0x7c2d9", visits: 4, revenue: 24, daysSinceLast:  6, decay: "fresh",   campaigns: ["Blank Street"],                       expiresIn: 24 },
  { id: "0xe19c7", visits: 3, revenue: 18, daysSinceLast: 21, decay: "d30",     campaigns: ["Cha Cha Matcha", "Superiority"],      expiresIn: 9  },
  { id: "0x3ff05", visits: 3, revenue: 14, daysSinceLast: 26, decay: "d10",     campaigns: ["Superiority"],                        expiresIn: 4  },
  { id: "0x88c11", visits: 2, revenue: 12, daysSinceLast: 28, decay: "d10",     campaigns: ["Cha Cha Matcha"],                     expiresIn: 2  },
  { id: "0x2af90", visits: 2, revenue: 10, daysSinceLast:  9, decay: "fresh",   campaigns: ["Blank Street"],                       expiresIn: 21 },
  { id: "0xcc7e2", visits: 2, revenue: 9,  daysSinceLast: 16, decay: "d50",     campaigns: ["Blank Street"],                       expiresIn: 14 },
];

/* Decay distribution (% of repeat customer base) */
export const DECAY_DIST: { tier: DecayTier; share: number; count: number }[] = [
  { tier: "fresh",   share: 0.50, count: 71 },
  { tier: "d50",     share: 0.22, count: 31 },
  { tier: "d30",     share: 0.14, count: 20 },
  { tier: "d10",     share: 0.08, count: 11 },
  { tier: "expired", share: 0.06, count: 9  },
];

/* Geography */
export const NEIGHBORHOODS: {
  name: string;
  visits: number;
  perScan: number;
  isHome: boolean;
  peerMedianPerScan: number;   // median Operator $/scan in this neighborhood
  openCampaigns: number;
}[] = [
  { name: "Williamsburg",      visits: 248, perScan: 0.06, isHome: true,  peerMedianPerScan: 0.07, openCampaigns: 6 },
  { name: "Lower East Side",   visits: 78,  perScan: 0.12, isHome: false, peerMedianPerScan: 0.12, openCampaigns: 4 },
  { name: "Bedford-Stuy",      visits: 48,  perScan: 0.06, isHome: false, peerMedianPerScan: 0.05, openCampaigns: 2 },
  { name: "Greenpoint",        visits: 26,  perScan: 0.05, isHome: false, peerMedianPerScan: 0.06, openCampaigns: 3 },
  { name: "Park Slope",        visits: 12,  perScan: 0.04, isHome: false, peerMedianPerScan: 0.04, openCampaigns: 1 },
];

/* Suggested moves — rule-based, action-anchored */
export type MoveSeverity = "opportunity" | "risk" | "milestone";
export const MOVES: {
  id: string;
  severity: MoveSeverity;
  numeral: string;
  context: string;
  headline: string;
  body: string;
  cta: string;
  ctaHref: string;
}[] = [
  { id: "mv_decay_lock",
    severity: "risk",
    numeral: "12",
    context: "scans expire in 4 days",
    headline: "Lock in repeat before the window closes",
    body: "12 of your fresh fans hit the 30-day cliff this week. A single follow-up post resets attribution windows and protects $18 of recurring commission.",
    cta: "Draft a follow-up post",
    ctaHref: "/creator/work/drafts" },
  { id: "mv_proven_push",
    severity: "milestone",
    numeral: "5 pts",
    context: "to Proven · 5% commission",
    headline: "One push from your next tier",
    body: "Proven unlocks 5% commission and Growth-merchant access. At your current pace you reach 65 in 3 weeks — one Premium-difficulty campaign accelerates by 7 days.",
    cta: "See what unlocks",
    ctaHref: "/creator/analytics/tier" },
  { id: "mv_les_test",
    severity: "opportunity",
    numeral: "2×",
    context: "$/scan · LES vs Williamsburg",
    headline: "Test a campaign in LES",
    body: "LES creators at your tier earn $0.12/scan vs your $0.06 in Williamsburg. 4 open Food campaigns this week. Your single LES campaign last month closed at the higher rate.",
    cta: "Browse LES campaigns",
    ctaHref: "/creator/discover" },
];

/* ──────────────────────────  Helpers  ────────────────────────── */

export function pctDelta(curr: number, prior: number): { sign: "+" | "−" | "±"; abs: number } | null {
  if (prior === 0) return null;
  const v = ((curr - prior) / prior) * 100;
  return { sign: v > 0 ? "+" : v < 0 ? "−" : "±", abs: Math.abs(v) };
}

export function formatDelta(d: { sign: string; abs: number } | null, suffix = "vs prior 30d"): string {
  if (!d) return `— ${suffix}`;
  return `${d.sign}${d.abs.toFixed(0)}% ${suffix}`;
}

export function tierAt(score: number): Tier {
  let t: Tier = "Seed";
  for (const row of TIER_LADDER) if (score >= row.scoreFloor) t = row.tier;
  return t;
}

export function nextTier(current: Tier): typeof TIER_LADDER[number] | null {
  const idx = TIER_LADDER.findIndex(r => r.tier === current);
  return idx < 0 || idx >= TIER_LADDER.length - 1 ? null : TIER_LADDER[idx + 1];
}

export function tierMeta(t: Tier) {
  return TIER_LADDER.find(r => r.tier === t)!;
}

export function fmtUsd(n: number, opts: { cents?: boolean } = {}): string {
  return opts.cents
    ? `$${n.toFixed(2)}`
    : `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}

/* Per-campaign earning split for the Operator persona this window */
export const PER_CAMPAIGN_EARNINGS = CAMPAIGNS.map(c => {
  const base = c.status === "ended" || c.status === "active" ? Math.round(c.earnings * 0.6) : 0;
  const commission = Math.round(c.earnings * 0.3);
  const milestonePart = Math.max(0, c.earnings - base - commission);
  return { id: c.id, name: c.name, base, commission, milestone: milestonePart, total: c.earnings };
});
