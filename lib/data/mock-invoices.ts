// Push Platform — Merchant Billing Demo Data
// Realistic invoices, payment methods, and wallet stats for the merchant
// billing page when no authenticated tenant data is available (demo mode).
//
// Naming follows the rest of lib/data/mock-* — single source for the
// merchant billing playtest fixtures.

import type { Invoice, PaymentMethod } from "@/lib/data/api-client";

// Stable demo identifiers so the page renders the same way every reload.
const DEMO_TENANT_ID = "tenant-demo-001";
const DEMO_MERCHANT_ID = "demo-merchant-001";

function isoDate(year: number, month: number, day: number): string {
  // Months are 1-indexed in our copy; JS Date wants 0-indexed.
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString();
}

// Currency helper: input dollars → cents, integer.
function dollars(amount: number): number {
  return Math.round(amount * 100);
}

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-2026-007",
    tenant_id: DEMO_TENANT_ID,
    merchant_id: DEMO_MERCHANT_ID,
    status: "pending",
    subtotal_cents: dollars(340),
    fees_cents: dollars(10.2),
    total_cents: dollars(350.2),
    issued_at: isoDate(2026, 5, 1),
    due_at: isoDate(2026, 5, 15),
    paid_at: null,
    metadata: {
      campaign_name: "Spring Tasting Menu Launch",
      reason: "campaign_settlement",
    },
    created_at: isoDate(2026, 5, 1),
    updated_at: isoDate(2026, 5, 1),
    line_items: [
      {
        id: "li-007-1",
        invoice_id: "INV-2026-007",
        description: "Spring Tasting Menu Launch — 17 verified scans @ $20",
        quantity: 17,
        unit_amount_cents: dollars(20),
        total_amount_cents: dollars(340),
        metadata: { rate: "per_scan" },
        created_at: isoDate(2026, 5, 1),
      },
    ],
  },
  {
    id: "INV-2026-006",
    tenant_id: DEMO_TENANT_ID,
    merchant_id: DEMO_MERCHANT_ID,
    status: "failed",
    subtotal_cents: dollars(225),
    fees_cents: dollars(6.75),
    total_cents: dollars(231.75),
    issued_at: isoDate(2026, 4, 28),
    due_at: isoDate(2026, 5, 12),
    paid_at: null,
    metadata: {
      campaign_name: "Patio Reopening Stories",
      reason: "campaign_settlement",
      failure_code: "card_declined",
    },
    created_at: isoDate(2026, 4, 28),
    updated_at: isoDate(2026, 5, 4),
    line_items: [
      {
        id: "li-006-1",
        invoice_id: "INV-2026-006",
        description: "Patio Reopening Stories — 9 verified scans @ $25",
        quantity: 9,
        unit_amount_cents: dollars(25),
        total_amount_cents: dollars(225),
        metadata: { rate: "per_scan" },
        created_at: isoDate(2026, 4, 28),
      },
    ],
  },
  {
    id: "INV-2026-005",
    tenant_id: DEMO_TENANT_ID,
    merchant_id: DEMO_MERCHANT_ID,
    status: "paid",
    subtotal_cents: dollars(640),
    fees_cents: dollars(19.2),
    total_cents: dollars(659.2),
    issued_at: isoDate(2026, 4, 12),
    due_at: isoDate(2026, 4, 26),
    paid_at: isoDate(2026, 4, 14),
    metadata: {
      campaign_name: "Easter Brunch Coverage",
      reason: "campaign_settlement",
    },
    created_at: isoDate(2026, 4, 12),
    updated_at: isoDate(2026, 4, 14),
    line_items: [
      {
        id: "li-005-1",
        invoice_id: "INV-2026-005",
        description: "Easter Brunch Coverage — 32 verified scans @ $20",
        quantity: 32,
        unit_amount_cents: dollars(20),
        total_amount_cents: dollars(640),
        metadata: { rate: "per_scan" },
        created_at: isoDate(2026, 4, 12),
      },
    ],
  },
  {
    id: "INV-2026-004",
    tenant_id: DEMO_TENANT_ID,
    merchant_id: DEMO_MERCHANT_ID,
    status: "paid",
    subtotal_cents: dollars(1080),
    fees_cents: dollars(32.4),
    total_cents: dollars(1112.4),
    issued_at: isoDate(2026, 3, 18),
    due_at: isoDate(2026, 4, 1),
    paid_at: isoDate(2026, 3, 21),
    metadata: {
      campaign_name: "Spring Floral Pop-Up",
      reason: "campaign_settlement",
    },
    created_at: isoDate(2026, 3, 18),
    updated_at: isoDate(2026, 3, 21),
    line_items: [
      {
        id: "li-004-1",
        invoice_id: "INV-2026-004",
        description: "Spring Floral Pop-Up — 36 verified scans @ $30",
        quantity: 36,
        unit_amount_cents: dollars(30),
        total_amount_cents: dollars(1080),
        metadata: { rate: "per_scan" },
        created_at: isoDate(2026, 3, 18),
      },
    ],
  },
  {
    id: "INV-2026-003",
    tenant_id: DEMO_TENANT_ID,
    merchant_id: DEMO_MERCHANT_ID,
    status: "paid",
    subtotal_cents: dollars(425),
    fees_cents: dollars(12.75),
    total_cents: dollars(437.75),
    issued_at: isoDate(2026, 2, 26),
    due_at: isoDate(2026, 3, 12),
    paid_at: isoDate(2026, 2, 28),
    metadata: {
      campaign_name: "Valentine's Day Tasting",
      reason: "campaign_settlement",
    },
    created_at: isoDate(2026, 2, 26),
    updated_at: isoDate(2026, 2, 28),
    line_items: [
      {
        id: "li-003-1",
        invoice_id: "INV-2026-003",
        description: "Valentine's Day Tasting — 17 verified scans @ $25",
        quantity: 17,
        unit_amount_cents: dollars(25),
        total_amount_cents: dollars(425),
        metadata: { rate: "per_scan" },
        created_at: isoDate(2026, 2, 26),
      },
    ],
  },
  {
    id: "INV-2026-002",
    tenant_id: DEMO_TENANT_ID,
    merchant_id: DEMO_MERCHANT_ID,
    status: "paid",
    subtotal_cents: dollars(900),
    fees_cents: dollars(27),
    total_cents: dollars(927),
    issued_at: isoDate(2026, 2, 5),
    due_at: isoDate(2026, 2, 19),
    paid_at: isoDate(2026, 2, 7),
    metadata: {
      campaign_name: "Winter Wholesale Push",
      reason: "campaign_settlement",
    },
    created_at: isoDate(2026, 2, 5),
    updated_at: isoDate(2026, 2, 7),
    line_items: [
      {
        id: "li-002-1",
        invoice_id: "INV-2026-002",
        description: "Winter Wholesale Push — 30 verified scans @ $30",
        quantity: 30,
        unit_amount_cents: dollars(30),
        total_amount_cents: dollars(900),
        metadata: { rate: "per_scan" },
        created_at: isoDate(2026, 2, 5),
      },
    ],
  },
  {
    id: "INV-2026-001",
    tenant_id: DEMO_TENANT_ID,
    merchant_id: DEMO_MERCHANT_ID,
    status: "paid",
    subtotal_cents: dollars(560),
    fees_cents: dollars(16.8),
    total_cents: dollars(576.8),
    issued_at: isoDate(2026, 1, 14),
    due_at: isoDate(2026, 1, 28),
    paid_at: isoDate(2026, 1, 16),
    metadata: {
      campaign_name: "New Year Reopening",
      reason: "campaign_settlement",
    },
    created_at: isoDate(2026, 1, 14),
    updated_at: isoDate(2026, 1, 16),
    line_items: [
      {
        id: "li-001-1",
        invoice_id: "INV-2026-001",
        description: "New Year Reopening — 28 verified scans @ $20",
        quantity: 28,
        unit_amount_cents: dollars(20),
        total_amount_cents: dollars(560),
        metadata: { rate: "per_scan" },
        created_at: isoDate(2026, 1, 14),
      },
    ],
  },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-demo-visa",
    merchant_id: DEMO_MERCHANT_ID,
    provider: "stripe",
    provider_ref: "stripe:pm_demo_visa_4242",
    brand: "VISA",
    last4: "4242",
    exp_month: 4,
    exp_year: 2028,
    is_default: true,
    created_at: isoDate(2025, 11, 12),
    updated_at: isoDate(2025, 11, 12),
  },
  {
    id: "pm-demo-mc",
    merchant_id: DEMO_MERCHANT_ID,
    provider: "stripe",
    provider_ref: "stripe:pm_demo_mc_5454",
    brand: "MASTERCARD",
    last4: "5454",
    exp_month: 11,
    exp_year: 2027,
    is_default: false,
    created_at: isoDate(2026, 1, 8),
    updated_at: isoDate(2026, 1, 8),
  },
  {
    id: "pm-demo-amex",
    merchant_id: DEMO_MERCHANT_ID,
    provider: "stripe",
    provider_ref: "stripe:pm_demo_amex_3005",
    brand: "AMEX",
    last4: "3005",
    exp_month: 9,
    exp_year: 2029,
    is_default: false,
    created_at: isoDate(2026, 3, 22),
    updated_at: isoDate(2026, 3, 22),
  },
];

// Aggregate stats — picked to feel realistic against the invoice list above.
// Wallet balance is what the merchant has loaded right now (top-up minus
// month-to-date settlements); lifetime spend across 14 campaigns lines up
// with the 7-invoice slice multiplied by historic activity.
export const MOCK_WALLET_STATS = {
  current_balance_cents: dollars(1820.5),
  month_to_date_spend_cents: dollars(340),
  lifetime_spend_cents: dollars(8240),
  lifetime_campaigns: 14,
};
