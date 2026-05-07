// Push Platform — Merchant Payments Mock Data
// 12 demo transactions across the 4 filter buckets the page exposes:
// TOP UP / CAMPAIGN CHARGE / REFUND / ADJUSTMENT.
//
// We piggyback the existing Payment type (lib/data/types.ts) and encode the
// transaction kind via `milestone_id` so PaymentsClient.mapPayments can read
// it without inventing a new shape. Amounts are stored in CENTS (matches
// existing convention: PaymentsClient divides by 100 on render). Sign in
// `amount` is preserved end-to-end: top-ups + adjustments are positive, charges
// + refund debits are negative. PaymentsClient interprets the sign for display.

import type { Payment } from "./types";

const MERCHANT_ID = "demo-merchant-001";

// Anchor mock timestamps to a known reference so the past-30-days window is
// stable regardless of when the page renders. Older dates roll into "earlier".
const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;

function iso(daysAgo: number, hourOffset = 0): string {
  return new Date(NOW - daysAgo * DAY + hourOffset * 3_600_000).toISOString();
}

// `milestone_id` is repurposed as a transaction-kind tag. PaymentsClient
// reads this prefix to color/categorize each row; nothing else relies on it
// in the merchant payments code path.
type Kind = "topup" | "campaign-charge" | "refund" | "adjustment";

interface Seed {
  id: string;
  kind: Kind;
  amountCents: number; // signed: + credit, − debit
  campaignId: string;
  description: string; // surfaced via PaymentsClient.mapPayments
  daysAgo: number;
  hour?: number;
  status: Payment["status"];
}

const SEEDS: Seed[] = [
  // ── TOP UP ────────────────────────────────────────────────────
  {
    id: "txn-001",
    kind: "topup",
    amountCents: 200_000,
    campaignId: "wallet",
    description: "Wallet top-up via Mastercard •• 5454",
    daysAgo: 1,
    hour: 9,
    status: "paid",
  },
  {
    id: "txn-002",
    kind: "topup",
    amountCents: 100_000,
    campaignId: "wallet",
    description: "Wallet top-up via Visa •• 4242",
    daysAgo: 8,
    hour: 14,
    status: "paid",
  },
  {
    id: "txn-003",
    kind: "topup",
    amountCents: 50_000,
    campaignId: "wallet",
    description: "Wallet top-up via Visa •• 4242",
    daysAgo: 22,
    hour: 11,
    status: "paid",
  },

  // ── CAMPAIGN CHARGE ───────────────────────────────────────────
  {
    id: "txn-004",
    kind: "campaign-charge",
    amountCents: -34_000,
    campaignId: "camp-006",
    description: "Summer Menu Launch · 17 verified scans",
    daysAgo: 0,
    hour: -2,
    status: "paid",
  },
  {
    id: "txn-005",
    kind: "campaign-charge",
    amountCents: -22_500,
    campaignId: "camp-001",
    description: "Free Latte for a 30-Sec Reel · 9 verified scans",
    daysAgo: 3,
    hour: 16,
    status: "paid",
  },
  {
    id: "txn-006",
    kind: "campaign-charge",
    amountCents: -41_750,
    campaignId: "camp-003",
    description: "Holiday Blend Launch · 23 verified scans",
    daysAgo: 6,
    hour: 10,
    status: "paid",
  },
  {
    id: "txn-007",
    kind: "campaign-charge",
    amountCents: -8_500,
    campaignId: "camp-007",
    description: "SoHo Street Photography Series · 4 verified scans",
    daysAgo: 12,
    hour: 13,
    status: "paid",
  },
  {
    id: "txn-008",
    kind: "campaign-charge",
    amountCents: -19_000,
    campaignId: "camp-002",
    description: "Morning Rush Special Reel · pending settlement",
    daysAgo: 0,
    hour: -5,
    status: "processing",
  },

  // ── REFUND ────────────────────────────────────────────────────
  {
    id: "txn-009",
    kind: "refund",
    amountCents: -4_500,
    campaignId: "camp-003",
    description: "Disputed redemption resolved — refund issued to creator",
    daysAgo: 4,
    hour: 17,
    status: "paid",
  },
  {
    id: "txn-010",
    kind: "refund",
    amountCents: -2_200,
    campaignId: "camp-005",
    description: "Duplicate scan flagged · partial refund",
    daysAgo: 18,
    hour: 9,
    status: "paid",
  },

  // ── ADJUSTMENT ────────────────────────────────────────────────
  {
    id: "txn-011",
    kind: "adjustment",
    amountCents: 15_000,
    campaignId: "wallet",
    description: "Promotional credit applied — Push welcome bonus",
    daysAgo: 14,
    hour: 8,
    status: "paid",
  },
  {
    id: "txn-012",
    kind: "adjustment",
    amountCents: -5_000,
    campaignId: "wallet",
    description: "Service fee adjustment · April attribution audit",
    daysAgo: 26,
    hour: 15,
    status: "paid",
  },
];

// Extra `description` rides on the Payment shape so PaymentsClient can render
// human-readable labels without a separate lookup. The merchant payments code
// path is the only consumer of this file, and PaymentsClient.mapPayments
// reads the field via a typed cast.
export type DemoMerchantPayment = Payment & { description: string };

export const MOCK_MERCHANT_PAYMENTS_HISTORY: DemoMerchantPayment[] = SEEDS.map(
  (seed) => ({
    id: seed.id,
    campaign_id: seed.campaignId,
    creator_id: "merchant-self",
    merchant_id: MERCHANT_ID,
    amount: seed.amountCents,
    status: seed.status,
    // Repurposed as a kind tag, read by PaymentsClient.mapPayments.
    milestone_id: seed.kind,
    description: seed.description,
    created_at: iso(seed.daysAgo, seed.hour ?? 0),
    paid_at:
      seed.status === "paid" ? iso(seed.daysAgo, seed.hour ?? 0) : undefined,
  }),
);
