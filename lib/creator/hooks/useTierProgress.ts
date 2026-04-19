import { TIER_ORDER, TIER_SCORE_THRESHOLDS } from "../constants";
import type { Creator, CreatorTier } from "../types";

interface TierProgress {
  currentTier: CreatorTier;
  nextTier: CreatorTier | null;
  score: number;
  scoreToNext: number | null;
  progressPercent: number;
}

export function useTierProgress(creator: Creator | null): TierProgress | null {
  if (!creator) return null;
  const currentIdx = TIER_ORDER.indexOf(creator.tier);
  const nextTier =
    currentIdx < TIER_ORDER.length - 1 ? TIER_ORDER[currentIdx + 1] : null;
  const currentThreshold = TIER_SCORE_THRESHOLDS[creator.tier];
  const nextThreshold = nextTier ? TIER_SCORE_THRESHOLDS[nextTier] : null;
  const scoreToNext =
    nextThreshold !== null ? nextThreshold - creator.push_score : null;
  const progressPercent =
    nextThreshold !== null
      ? Math.min(
          100,
          Math.round(
            ((creator.push_score - currentThreshold) /
              (nextThreshold - currentThreshold)) *
              100,
          ),
        )
      : 100;
  return {
    currentTier: creator.tier,
    nextTier,
    score: creator.push_score,
    scoreToNext,
    progressPercent,
  };
}
