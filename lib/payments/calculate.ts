// Payment calculation utilities for Push platform
// TODO: wire commission rates to Supabase merchant plan config

// Push platform commission rate per creator tier
export const COMMISSION_RATES: Record<string, number> = {
  seed: 0.0, // Free tier — Push takes 0%
  explorer: 0.1, // 10%
  operator: 0.12, // 12%
  proven: 0.13, // 13%
  closer: 0.14, // 14%
  partner: 0.15, // 15%
};

// Tax withholding placeholder (US 1099 threshold logic)
// TODO: integrate with Stripe Tax / TaxJar
export const TAX_THRESHOLD_USD = 600; // Annual 1099-K threshold
export const BACKUP_WITHHOLDING_RATE = 0.24; // IRS backup withholding

export type MilestoneConfig = {
  label: string;
  releasePercent: number; // % of total payout released at this milestone
};

// Payout milestone schedule — percentages must sum to 100
export const MILESTONE_PAYOUT_SCHEDULE: Record<string, MilestoneConfig> = {
  accepted: { label: "Accepted", releasePercent: 0 },
  visited: { label: "Visit Confirmed", releasePercent: 0 },
  content_posted: { label: "Content Posted", releasePercent: 50 },
  verified: { label: "Verified", releasePercent: 30 },
  paid: { label: "Paid Out", releasePercent: 20 },
};

/**
 * Calculate creator net payout after commission.
 * Commission flows to Push, creator receives base + bonus.
 */
export function calculateCreatorNet(
  basePayout: number,
  tier: string = "operator",
): {
  base: number;
  commission: number;
  net: number;
  commissionRate: number;
} {
  const commissionRate = COMMISSION_RATES[tier] ?? 0.12;
  const commission = parseFloat((basePayout * commissionRate).toFixed(2));
  const net = parseFloat((basePayout + commission).toFixed(2));
  return { base: basePayout, commission, net, commissionRate };
}

/**
 * Calculate how much a merchant pays for a campaign slot.
 * Merchant pays base payout + Push platform fee (15% on top).
 */
export function calculateMerchantCost(basePayout: number): {
  creatorPayout: number;
  platformFee: number;
  total: number;
} {
  const platformFee = parseFloat((basePayout * 0.15).toFixed(2));
  const total = parseFloat((basePayout + platformFee).toFixed(2));
  return { creatorPayout: basePayout, platformFee, total };
}

/**
 * Calculate payout released at a given milestone.
 */
export function calculateMilestoneAmount(
  totalPayout: number,
  milestone: string,
): number {
  const config = MILESTONE_PAYOUT_SCHEDULE[milestone];
  if (!config) return 0;
  return parseFloat(((totalPayout * config.releasePercent) / 100).toFixed(2));
}

/**
 * Determine if a creator is approaching the 1099-K threshold.
 * Returns amount remaining before withholding kicks in.
 */
export function taxThresholdRemaining(ytdEarnings: number): {
  threshold: number;
  remaining: number;
  requiresWithholding: boolean;
  withholdingAmount: number;
} {
  const remaining = Math.max(0, TAX_THRESHOLD_USD - ytdEarnings);
  const requiresWithholding = ytdEarnings >= TAX_THRESHOLD_USD;
  const withholdingAmount = requiresWithholding
    ? parseFloat((ytdEarnings * BACKUP_WITHHOLDING_RATE).toFixed(2))
    : 0;
  return {
    threshold: TAX_THRESHOLD_USD,
    remaining,
    requiresWithholding,
    withholdingAmount,
  };
}

/**
 * Aggregate balance breakdown from transactions.
 */
export function aggregateBalances(
  transactions: Array<{
    status: "pending" | "cleared" | "processing" | "paid";
    netAmount: number;
  }>,
): {
  pending: number;
  cleared: number;
  processing: number;
  paidOut: number;
  total: number;
} {
  const result = { pending: 0, cleared: 0, processing: 0, paidOut: 0 };
  for (const tx of transactions) {
    if (tx.status === "pending") result.pending += tx.netAmount;
    else if (tx.status === "cleared") result.cleared += tx.netAmount;
    else if (tx.status === "processing") result.processing += tx.netAmount;
    else if (tx.status === "paid") result.paidOut += tx.netAmount;
  }
  return {
    ...result,
    pending: parseFloat(result.pending.toFixed(2)),
    cleared: parseFloat(result.cleared.toFixed(2)),
    processing: parseFloat(result.processing.toFixed(2)),
    paidOut: parseFloat(result.paidOut.toFixed(2)),
    total: parseFloat(
      (
        result.pending +
        result.cleared +
        result.processing +
        result.paidOut
      ).toFixed(2),
    ),
  };
}
