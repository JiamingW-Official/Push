/**
 * tier-config.ts
 * Single source of truth for Push's 6-Tier Creator System v4.1.
 * Import from here — do NOT hardcode tier data elsewhere.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreatorTier =
  | "Seed"
  | "Explorer"
  | "Operator"
  | "Proven"
  | "Closer"
  | "Partner";

export interface TierConfig {
  /** Display label (same as key, kept for convenience) */
  label: CreatorTier;
  /** Emoji icon used in badges and UI */
  icon: string;
  /** Primary text color (hex) */
  color: string;
  /** Background color (hex) */
  bg: string;
  /** Accent / highlight color (hex) */
  accent: string;
  /** Minimum Push Score to enter this tier (inclusive) */
  minScore: number;
  /** Maximum Push Score for this tier (inclusive; Partner = Infinity) */
  maxScore: number;
  /** Fixed base payment per campaign in USD */
  baseRate: number;
  /** Commission percentage on top of base rate (0–100) */
  commissionPct: number;
  /** Monthly milestone bonus in USD (0 = no bonus) */
  milestoneBonus: number;
  /** Completed transactions per month required to unlock milestone bonus (0 = N/A) */
  milestoneTxnThreshold: number;
  /** Maximum campaigns that can run simultaneously */
  maxConcurrent: number;
  /** Short tier description (2–4 words) */
  description: string;
  /** Key benefits unlocked at this tier */
  benefits: string[];
  /** Actionable hint for reaching the next tier (empty string for Partner) */
  upgradeHint: string;
}

// ─── Tier Order ───────────────────────────────────────────────────────────────

/** Ordered from lowest to highest; use for iteration and rank comparisons. */
export const TIER_ORDER: readonly CreatorTier[] = [
  "Seed",
  "Explorer",
  "Operator",
  "Proven",
  "Closer",
  "Partner",
] as const;

// ─── Tier Definitions ─────────────────────────────────────────────────────────

export const TIERS: Record<CreatorTier, TierConfig> = {
  Seed: {
    label: "Seed",
    icon: "",
    color: "#b8a99a",
    bg: "#f7f5f3",
    accent: "#003049",
    minScore: 0,
    maxScore: 39,
    baseRate: 0,
    commissionPct: 0,
    milestoneBonus: 0,
    milestoneTxnThreshold: 0,
    maxConcurrent: 1,
    description: "Just getting started",
    benefits: [
      "Access to free-product campaigns",
      "1 concurrent campaign",
      "Push Score tracking",
      "Creator dashboard access",
    ],
    upgradeHint:
      "Complete 2 campaigns and reach a Push Score of 40 to unlock Explorer (+$5 cash bonus).",
  },

  Explorer: {
    label: "Explorer",
    icon: "",
    color: "#8c6239",
    bg: "#f5f0eb",
    accent: "#5a3d24",
    minScore: 40,
    maxScore: 54,
    baseRate: 12,
    commissionPct: 0,
    milestoneBonus: 0,
    milestoneTxnThreshold: 0,
    maxConcurrent: 2,
    description: "Building momentum",
    benefits: [
      "$12 base rate per campaign",
      "2 concurrent campaigns",
      "Paid campaign access",
      "Performance analytics",
    ],
    upgradeHint:
      "Reach a Push Score of 55 (and avg merchant rating ≥ 4.0 for Fast Track) to unlock Operator.",
  },

  Operator: {
    label: "Operator",
    icon: "",
    color: "#4a5568",
    bg: "#f2f3f5",
    accent: "#2d3748",
    minScore: 55,
    maxScore: 64,
    baseRate: 20,
    commissionPct: 3,
    milestoneBonus: 15,
    milestoneTxnThreshold: 30,
    maxConcurrent: 3,
    description: "Consistent performer",
    benefits: [
      "$20 base rate per campaign",
      "3% commission on sales",
      "$15 milestone bonus at 30 transactions/month",
      "3 concurrent campaigns",
      "Priority campaign matching",
    ],
    upgradeHint:
      "Reach a Push Score of 65 to unlock Proven and increase your earnings.",
  },

  Proven: {
    label: "Proven",
    icon: "",
    color: "#c9a96e",
    bg: "#faf6f0",
    accent: "#003049",
    minScore: 65,
    maxScore: 77,
    baseRate: 32,
    commissionPct: 5,
    milestoneBonus: 30,
    milestoneTxnThreshold: 40,
    maxConcurrent: 4,
    description: "Track record established",
    benefits: [
      "$32 base rate per campaign",
      "5% commission on sales",
      "$30 milestone bonus at 40 transactions/month",
      "4 concurrent campaigns",
      "Featured creator profile",
    ],
    upgradeHint:
      "Reach a Push Score of 78 to unlock Closer — top-tier compensation awaits.",
  },

  Closer: {
    label: "Closer",
    icon: "",
    color: "#9b111e",
    bg: "#fdf3f3",
    accent: "#6d0c15",
    minScore: 78,
    maxScore: 87,
    baseRate: 55,
    commissionPct: 7,
    milestoneBonus: 50,
    milestoneTxnThreshold: 60,
    maxConcurrent: 5,
    description: "Elite results maker",
    benefits: [
      "$55 base rate per campaign",
      "7% commission on sales",
      "$50 milestone bonus at 60 transactions/month",
      "5 concurrent campaigns",
      "Dedicated campaign manager",
      "Early access to premium brands",
    ],
    upgradeHint:
      "Reach a Push Score of 88 to achieve Partner — the highest tier on Push.",
  },

  Partner: {
    label: "Partner",
    icon: "",
    color: "#1a1a2e",
    bg: "#f2f2f5",
    accent: "#0e0e1a",
    minScore: 88,
    maxScore: Infinity,
    baseRate: 100,
    commissionPct: 10,
    milestoneBonus: 80,
    milestoneTxnThreshold: 80,
    maxConcurrent: 6,
    description: "Top 1% creator",
    benefits: [
      "$100 base rate per campaign",
      "10% commission on sales",
      "$80 milestone bonus at 80 transactions/month",
      "6 concurrent campaigns",
      "Co-branded campaign opportunities",
      "Direct merchant relationships",
      "Partner advisory input",
    ],
    upgradeHint: "",
  },
} as const;

// ─── Upgrade & Progression Rules ─────────────────────────────────────────────

/** Seed → Explorer special upgrade rule (v4.0) */
export const SEED_UPGRADE_RULE = {
  campaignsRequired: 2,
  minScore: 40,
  cashBonus: 5,
} as const;

/** Fast Track rule: score ≥ 55 + avg merchant rating ≥ 4.0 → Operator */
export const FAST_TRACK_RULE = {
  minScore: 55,
  minAvgMerchantRating: 4.0,
  targetTier: "Operator" as CreatorTier,
} as const;

/** Demotion policy */
export const DEMOTION_POLICY = {
  gracePeriodDays: 30,
  /** Commission rate drops to the next lower tier's rate during grace period */
  commissionDropsToNextTier: true,
} as const;

/** Campaign difficulty multipliers applied on top of base rate */
export const CAMPAIGN_DIFFICULTY_MULTIPLIERS = {
  Standard: 1.0,
  Premium: 1.3,
  Complex: 1.6,
} as const;

export type CampaignDifficulty = keyof typeof CAMPAIGN_DIFFICULTY_MULTIPLIERS;

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Returns the tier a creator belongs to based on their Push Score.
 * Falls back to "Seed" for any score below 0.
 */
export function getTierForScore(score: number): CreatorTier {
  for (const tierName of [...TIER_ORDER].reverse()) {
    if (score >= TIERS[tierName].minScore) {
      return tierName;
    }
  }
  return "Seed";
}

/**
 * Returns the next tier above the given tier, or null if already at Partner.
 */
export function getNextTier(tier: CreatorTier): CreatorTier | null {
  const index = TIER_ORDER.indexOf(tier);
  if (index === -1 || index === TIER_ORDER.length - 1) return null;
  return TIER_ORDER[index + 1];
}

/**
 * Returns the zero-based index of the tier in TIER_ORDER.
 * Returns -1 if the tier is not found (should not happen with valid input).
 */
export function getTierIndex(tier: CreatorTier): number {
  return TIER_ORDER.indexOf(tier);
}

/**
 * Returns a formatted base rate string, e.g. "$20/campaign" or "Free product only".
 */
export function formatBaseRate(tier: CreatorTier): string {
  const { baseRate } = TIERS[tier];
  if (baseRate === 0) return "Free product only";
  return `$${baseRate}/campaign`;
}

/**
 * Returns a human-readable earnings summary string.
 * Examples: "$20 + 3% commission", "$0 (free product)", "$100 + 10% commission"
 */
export function formatEarnings(tier: CreatorTier): string {
  const { baseRate, commissionPct } = TIERS[tier];
  if (baseRate === 0 && commissionPct === 0) return "$0 (free product)";
  if (commissionPct === 0) return `$${baseRate}/campaign`;
  return `$${baseRate} + ${commissionPct}% commission`;
}
