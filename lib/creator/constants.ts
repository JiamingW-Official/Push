import type { CreatorTier, Application, SortKey } from "./types";

export const TIER_LABELS: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

export const TIER_ORDER: CreatorTier[] = [
  "seed",
  "explorer",
  "operator",
  "proven",
  "closer",
  "partner",
];

export const TIER_SCORE_THRESHOLDS: Record<CreatorTier, number> = {
  seed: 0,
  explorer: 40,
  operator: 60,
  proven: 75,
  closer: 88,
  partner: 95,
};

export const MILESTONES: Application["milestone"][] = [
  "accepted",
  "scheduled",
  "visited",
  "proof_submitted",
  "content_published",
  "verified",
  "settled",
];

export const MILESTONE_LABELS: Record<Application["milestone"], string> = {
  accepted: "Accepted",
  scheduled: "Scheduled",
  visited: "Visited",
  proof_submitted: "Proof",
  content_published: "Published",
  verified: "Verified",
  settled: "Settled",
};

export const CATEGORIES = [
  "All",
  "Food",
  "Coffee",
  "Beauty",
  "Retail",
  "Fitness",
  "Lifestyle",
];

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "highest-pay", label: "Pay" },
  { key: "ending-soon", label: "Ending" },
  { key: "most-spots", label: "Spots" },
];
