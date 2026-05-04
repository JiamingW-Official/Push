// Attribution decay curve for FTC 16 CFR Part 255 compliance.
//
// Each row in push_transactions carries an attribution_weight in [0, 1] that
// scales the creator's commission and the merchant's reported attributed
// revenue. The first attributed scan from a customer is always weight 1.0;
// subsequent repurchases decay piecewise as time since the FIRST scan grows.
//
// The schedule is piecewise (not continuous exponential) so it matches the
// disclosure copy we publish. Future iteration may switch to a smooth curve.

const DAY_MS = 1000 * 60 * 60 * 24;

export const ATTRIBUTION_WINDOW_DAYS = 120;

export function computeAttributionWeight(
  firstScanAt: Date,
  currentScanAt: Date,
): number {
  const daysSince = Math.floor(
    (currentScanAt.getTime() - firstScanAt.getTime()) / DAY_MS,
  );
  if (daysSince < 0) return 1.0;
  if (daysSince < 30) return 1.0;
  if (daysSince < 60) return 0.5;
  if (daysSince < 90) return 0.3;
  if (daysSince < ATTRIBUTION_WINDOW_DAYS) return 0.1;
  return 0;
}

export function isAttributionWindowExpired(weight: number): boolean {
  return weight === 0;
}
