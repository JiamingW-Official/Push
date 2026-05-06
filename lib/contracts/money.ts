/**
 * MONEY domain contracts. Audit § 6 type-first spec.
 *
 * Every endpoint behind /creator/money/* lands here as a TypeScript
 * type. Implementations swap their inline JSON shape for these
 * imported types as routes mature beyond seed data.
 *
 * Routes that should return these shapes:
 *   - GET  /api/creator/earnings           → EarningsSummary
 *   - GET  /api/creator/milestones         → MilestoneList
 *   - GET  /api/creator/payouts            → PayoutBuckets
 *   - POST /api/creator/cashout            → CashoutResult
 *   - GET  /api/creator/transactions?…     → TransactionPage
 *   - GET  /api/creator/tax/{year}         → TaxSummary
 */

export type Cents = number;

/* ── Hub digest (the bento module shape) ──────────────────── */

export type MoneyHubDigest = {
  thisMonthCents: Cents;
  lastMonthCents: Cents;
  deltaCents: Cents;
  pendingNextCents: Cents;
  lifetimeCents: Cents;
  /** Rough headline status — drives bento dot color. */
  cashoutReady: boolean;
};

/* ── /money/earnings ──────────────────────────────────────── */

export type EarningsSummary = {
  windowStartIso: string;
  windowEndIso: string;
  baseCents: Cents;
  commissionCents: Cents;
  milestoneCents: Cents;
  totalCents: Cents;
  perCampaign: {
    campaignId: string;
    brand: string;
    baseCents: Cents;
    commissionCents: Cents;
    milestoneCents: Cents;
  }[];
};

/* ── /money/milestones ────────────────────────────────────── */

export type Milestone = {
  campaignId: string;
  brand: string;
  totalPayoutCents: Cents;
  steps: { key: string; label: string; done: boolean }[];
  currentStep: string;
  /** When the bonus window resets (ISO). */
  windowResetsAtIso: string | null;
};

export type MilestoneList = {
  active: Milestone[];
  daysToWindowReset: number | null;
};

/* ── /money/pending + /money/methods (PayoutBuckets) ──────── */

export type PayoutMethodKind = "stripe_connect" | "venmo" | "ach" | "manual";

export type PayoutMethod = {
  id: string;
  kind: PayoutMethodKind;
  label: string;
  isPrimary: boolean;
  lastFour?: string;
  /** Linked-at ISO. */
  addedAtIso: string;
};

export type Payout = {
  id: string;
  amountCents: Cents;
  status: "pending" | "scheduled" | "completed" | "failed";
  method: PayoutMethod;
  scheduledForIso: string | null;
  completedAtIso: string | null;
};

export type PayoutBuckets = {
  pending: Payout[];
  scheduled: Payout[];
  completed: Payout[];
  methods: PayoutMethod[];
};

/* ── /money/history ───────────────────────────────────────── */

export type TransactionStatus =
  | "pending"
  | "cleared"
  | "processing"
  | "paid"
  | "failed";

export type Transaction = {
  id: string;
  occurredAtIso: string;
  amountCents: Cents;
  /** Net = amount - fees - tax holdback. */
  netCents: Cents;
  status: TransactionStatus;
  campaignId: string | null;
  brand: string | null;
  description: string;
};

export type TransactionPage = {
  rows: Transaction[];
  hasMore: boolean;
  nextCursor: string | null;
  windowStartIso: string;
  windowEndIso: string;
};

/* ── /money/tax ───────────────────────────────────────────── */

export type TaxSummary = {
  year: number;
  reportedCents: Cents;
  thresholdCents: Cents;
  thresholdReached: boolean;
  monthly: { monthIso: string; cents: Cents }[];
  forms: {
    type: "1099-K" | "W-9";
    available: boolean;
    /** Download URL — nullable until backend generates. */
    href: string | null;
  }[];
};

/* ── Cashout request + result ─────────────────────────────── */

export type CashoutRequest = {
  amountCents: Cents;
  methodId: string;
};

export type CashoutResult = {
  cashoutId: string;
  amountCents: Cents;
  methodId: string;
  status: "processing" | "scheduled" | "completed";
  expectedAtIso: string | null;
};
