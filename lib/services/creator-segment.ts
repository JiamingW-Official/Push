// v6 Creator Segment mapping.
//
// v6 CANONICAL §8 reports merchant-facing creator counts in 2 segments
// (Community + Studio). Internally we keep the 6-tier scoring system as a
// progression / retention mechanic that creators see in their own dashboard.
//
// Mapping rule (by score, not tier label — score is stable across PascalCase
// vs lowercase tier naming inconsistencies elsewhere in the codebase):
//   Community = seed | explorer | operator   (score 0-64)
//   Studio    = proven | closer  | partner   (score 65+)
//
// Use these helpers any time merchant-facing UI, external API response, or
// VC-facing reporting needs to display tier — never expose 6-tier names to
// merchant or external surfaces. Creator-facing dashboards keep 6-tier
// directly because the progression is part of the retention loop.

export type CreatorSegment = "Community" | "Studio";

// Canonical lowercase tier strings (match lib/demo-data.ts, lib/creator/types.ts,
// and the majority of API payloads). PascalCase inputs are normalized via
// toLowerCase() in tierToSegment() below.
export type CreatorTierLower =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export const SEGMENT_TIERS: Record<CreatorSegment, CreatorTierLower[]> = {
  Community: ["seed", "explorer", "operator"],
  Studio: ["proven", "closer", "partner"],
};

const STUDIO_SET = new Set<string>(SEGMENT_TIERS.Studio);

export function tierToSegment(tier: string): CreatorSegment {
  return STUDIO_SET.has(tier.toLowerCase()) ? "Studio" : "Community";
}

export function scoreToSegment(score: number): CreatorSegment {
  return score >= 65 ? "Studio" : "Community";
}

export const SEGMENT_DESCRIPTIONS: Record<CreatorSegment, string> = {
  Community:
    "Local micro-tastemakers building neighborhood reach. Per-verified-visit payouts via Stripe Connect.",
  Studio:
    "Professional creators with proven attribution track records. Higher per-visit rates, eligible for brand-partner pool.",
};

export const SEGMENT_BADGE_COLORS: Record<
  CreatorSegment,
  { fg: string; bg: string }
> = {
  Community: { fg: "#003049", bg: "#eef5f9" }, // Steel Blue family
  Studio: { fg: "#780000", bg: "#fdf0d5" }, // Molten Lava family
};
