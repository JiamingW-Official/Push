/**
 * Push Admin — Mock Ledger Data
 * 200+ transactions spanning 12 months for the finance panel.
 */

export type TransactionType =
  | "subscription"
  | "payout"
  | "refund"
  | "platform_fee"
  | "adjustment";

export type TransactionStatus =
  | "completed"
  | "pending"
  | "failed"
  | "processing"
  | "reversed";

export type LedgerEntry = {
  id: string;
  timestamp: string; // ISO 8601
  type: TransactionType;
  counterparty: string;
  amount: number; // positive = inflow, negative = outflow
  status: TransactionStatus;
  stripe_ref: string;
  campaign_id?: string;
  creator_id?: string;
  merchant_id?: string;
  note?: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function stripeRef(prefix: string, n: number): string {
  const hex = Math.abs(n * 7919 + 31337)
    .toString(16)
    .padStart(16, "0");
  return `${prefix}_${hex}`;
}

function iso(year: number, month: number, day: number, h = 0, m = 0): string {
  return new Date(year, month - 1, day, h, m).toISOString();
}

// ── Static entries that tell the story ────────────────────────────────────────

const NAMED_ENTRIES: LedgerEntry[] = [
  // Apr 2025 — first subscriptions
  {
    id: "txn_001",
    timestamp: iso(2025, 4, 3, 9, 15),
    type: "subscription",
    counterparty: "Blank Street Coffee — SoHo",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 1),
    merchant_id: "mer_bsc",
    note: "Pro plan onboarding",
  },
  {
    id: "txn_002",
    timestamp: iso(2025, 4, 3, 10, 30),
    type: "platform_fee",
    counterparty: "Push Platform",
    amount: -29.85,
    status: "completed",
    stripe_ref: stripeRef("fee", 2),
    note: "15% platform take on sub",
  },
  {
    id: "txn_003",
    timestamp: iso(2025, 4, 5, 14, 0),
    type: "subscription",
    counterparty: "Joe Coffee — Flatiron",
    amount: 69,
    status: "completed",
    stripe_ref: stripeRef("sub", 3),
    merchant_id: "mer_joe",
  },
  {
    id: "txn_004",
    timestamp: iso(2025, 4, 7, 11, 0),
    type: "payout",
    counterparty: "@maya_eats_nyc",
    amount: -40,
    status: "completed",
    stripe_ref: stripeRef("po", 4),
    creator_id: "cre_maya",
    campaign_id: "cmp_bsc_apr",
  },
  {
    id: "txn_005",
    timestamp: iso(2025, 4, 7, 11, 1),
    type: "platform_fee",
    counterparty: "Push Platform",
    amount: 6,
    status: "completed",
    stripe_ref: stripeRef("fee", 5),
    note: "15% take on payout",
  },
  // May 2025
  {
    id: "txn_020",
    timestamp: iso(2025, 5, 1, 9, 0),
    type: "subscription",
    counterparty: "Procell Coffee — NoMad",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 20),
    merchant_id: "mer_procell",
  },
  {
    id: "txn_021",
    timestamp: iso(2025, 5, 3, 16, 45),
    type: "refund",
    counterparty: "Joe Coffee — Flatiron",
    amount: -69,
    status: "completed",
    stripe_ref: stripeRef("re", 21),
    merchant_id: "mer_joe",
    note: "Merchant requested refund — duplicate charge",
  },
  {
    id: "txn_022",
    timestamp: iso(2025, 5, 6, 10, 20),
    type: "payout",
    counterparty: "@streetfoodchris",
    amount: -60,
    status: "completed",
    stripe_ref: stripeRef("po", 22),
    creator_id: "cre_chris",
    campaign_id: "cmp_procell_may",
  },
  {
    id: "txn_023",
    timestamp: iso(2025, 5, 6, 10, 21),
    type: "platform_fee",
    counterparty: "Push Platform",
    amount: 9,
    status: "completed",
    stripe_ref: stripeRef("fee", 23),
  },
  {
    id: "txn_024",
    timestamp: iso(2025, 5, 14, 8, 0),
    type: "payout",
    counterparty: "@nycfoodscout",
    amount: -85,
    status: "failed",
    stripe_ref: stripeRef("po", 24),
    creator_id: "cre_scout",
    note: "Debit card expired — retry pending",
  },
  // Jun 2025
  {
    id: "txn_040",
    timestamp: iso(2025, 6, 2, 9, 0),
    type: "subscription",
    counterparty: "Devoción — Williamsburg",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 40),
    merchant_id: "mer_dev",
  },
  {
    id: "txn_041",
    timestamp: iso(2025, 6, 4, 15, 30),
    type: "payout",
    counterparty: "@lucywanders",
    amount: -50,
    status: "completed",
    stripe_ref: stripeRef("po", 41),
    creator_id: "cre_lucy",
  },
  {
    id: "txn_042",
    timestamp: iso(2025, 6, 4, 15, 31),
    type: "platform_fee",
    counterparty: "Push Platform",
    amount: 7.5,
    status: "completed",
    stripe_ref: stripeRef("fee", 42),
  },
  {
    id: "txn_043",
    timestamp: iso(2025, 6, 10, 12, 0),
    type: "adjustment",
    counterparty: "Push Platform",
    amount: -15,
    status: "completed",
    stripe_ref: stripeRef("adj", 43),
    note: "Admin credit — onboarding SLA miss",
  },
  // Jul 2025
  {
    id: "txn_060",
    timestamp: iso(2025, 7, 1, 9, 0),
    type: "subscription",
    counterparty: "Cha Cha Matcha — SoHo",
    amount: 69,
    status: "completed",
    stripe_ref: stripeRef("sub", 60),
  },
  {
    id: "txn_061",
    timestamp: iso(2025, 7, 1, 9, 0),
    type: "subscription",
    counterparty: "Blank Street Coffee — SoHo",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 61),
    note: "Monthly renewal",
  },
  // Aug 2025
  {
    id: "txn_080",
    timestamp: iso(2025, 8, 5, 11, 0),
    type: "payout",
    counterparty: "@highlineharvey",
    amount: -120,
    status: "completed",
    stripe_ref: stripeRef("po", 80),
    campaign_id: "cmp_chacha_aug",
  },
  {
    id: "txn_081",
    timestamp: iso(2025, 8, 5, 11, 1),
    type: "platform_fee",
    counterparty: "Push Platform",
    amount: 18,
    status: "completed",
    stripe_ref: stripeRef("fee", 81),
  },
  // Dec 2025 — big month
  {
    id: "txn_180",
    timestamp: iso(2025, 12, 1, 9, 0),
    type: "subscription",
    counterparty: "Blue Bottle Coffee — Hudson Yards",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 180),
  },
  {
    id: "txn_181",
    timestamp: iso(2025, 12, 1, 9, 5),
    type: "subscription",
    counterparty: "Birch Coffee — Midtown",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 181),
  },
  {
    id: "txn_182",
    timestamp: iso(2025, 12, 3, 14, 0),
    type: "payout",
    counterparty: "@manhattan_bites",
    amount: -200,
    status: "completed",
    stripe_ref: stripeRef("po", 182),
  },
  {
    id: "txn_183",
    timestamp: iso(2025, 12, 3, 14, 1),
    type: "platform_fee",
    counterparty: "Push Platform",
    amount: 30,
    status: "completed",
    stripe_ref: stripeRef("fee", 183),
  },
  // Apr 2026 — current month (MTD data)
  {
    id: "txn_200",
    timestamp: iso(2026, 4, 1, 9, 0),
    type: "subscription",
    counterparty: "Blue Bottle Coffee — Hudson Yards",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 200),
    merchant_id: "mer_bb",
    note: "Monthly renewal",
  },
  {
    id: "txn_201",
    timestamp: iso(2026, 4, 1, 9, 5),
    type: "subscription",
    counterparty: "Birch Coffee — Midtown",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 201),
    merchant_id: "mer_birch",
    note: "Monthly renewal",
  },
  {
    id: "txn_202",
    timestamp: iso(2026, 4, 2, 10, 0),
    type: "subscription",
    counterparty: "Blank Street Coffee — SoHo",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 202),
    merchant_id: "mer_bsc",
    note: "Monthly renewal",
  },
  {
    id: "txn_203",
    timestamp: iso(2026, 4, 2, 10, 15),
    type: "subscription",
    counterparty: "Procell Coffee — NoMad",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 203),
    merchant_id: "mer_procell",
    note: "Monthly renewal",
  },
  {
    id: "txn_204",
    timestamp: iso(2026, 4, 3, 11, 0),
    type: "subscription",
    counterparty: "Partners Coffee — Williamsburg",
    amount: 69,
    status: "completed",
    stripe_ref: stripeRef("sub", 204),
    merchant_id: "mer_partners",
  },
  {
    id: "txn_205",
    timestamp: iso(2026, 4, 5, 8, 30),
    type: "payout",
    counterparty: "@maya_eats_nyc",
    amount: -80,
    status: "completed",
    stripe_ref: stripeRef("po", 205),
    creator_id: "cre_maya",
    campaign_id: "cmp_bsc_apr26",
  },
  {
    id: "txn_206",
    timestamp: iso(2026, 4, 5, 8, 31),
    type: "platform_fee",
    counterparty: "Push Platform",
    amount: 12,
    status: "completed",
    stripe_ref: stripeRef("fee", 206),
  },
  {
    id: "txn_207",
    timestamp: iso(2026, 4, 6, 9, 0),
    type: "payout",
    counterparty: "@streetfoodchris",
    amount: -60,
    status: "completed",
    stripe_ref: stripeRef("po", 207),
    creator_id: "cre_chris",
  },
  {
    id: "txn_208",
    timestamp: iso(2026, 4, 6, 9, 1),
    type: "platform_fee",
    counterparty: "Push Platform",
    amount: 9,
    status: "completed",
    stripe_ref: stripeRef("fee", 208),
  },
  {
    id: "txn_209",
    timestamp: iso(2026, 4, 8, 14, 0),
    type: "payout",
    counterparty: "@lucywanders",
    amount: -50,
    status: "processing",
    stripe_ref: stripeRef("po", 209),
    creator_id: "cre_lucy",
  },
  {
    id: "txn_210",
    timestamp: iso(2026, 4, 10, 9, 0),
    type: "subscription",
    counterparty: "Cha Cha Matcha — SoHo",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 210),
    merchant_id: "mer_chacha",
    note: "Upgrade: Growth → Pro",
  },
  {
    id: "txn_211",
    timestamp: iso(2026, 4, 10, 16, 30),
    type: "payout",
    counterparty: "@nycfoodscout",
    amount: -95,
    status: "pending",
    stripe_ref: stripeRef("po", 211),
    creator_id: "cre_scout",
  },
  {
    id: "txn_212",
    timestamp: iso(2026, 4, 12, 11, 0),
    type: "refund",
    counterparty: "Joe Coffee — Flatiron",
    amount: -19.99,
    status: "completed",
    stripe_ref: stripeRef("re", 212),
    merchant_id: "mer_joe",
    note: "Prorate refund on cancellation",
  },
  {
    id: "txn_213",
    timestamp: iso(2026, 4, 14, 10, 0),
    type: "payout",
    counterparty: "@highlineharvey",
    amount: -140,
    status: "completed",
    stripe_ref: stripeRef("po", 213),
    creator_id: "cre_harvey",
    campaign_id: "cmp_birch_apr26",
  },
  {
    id: "txn_214",
    timestamp: iso(2026, 4, 14, 10, 1),
    type: "platform_fee",
    counterparty: "Push Platform",
    amount: 21,
    status: "completed",
    stripe_ref: stripeRef("fee", 214),
  },
  {
    id: "txn_215",
    timestamp: iso(2026, 4, 15, 9, 0),
    type: "subscription",
    counterparty: "Devoción — Williamsburg",
    amount: 199,
    status: "completed",
    stripe_ref: stripeRef("sub", 215),
    merchant_id: "mer_dev",
    note: "Monthly renewal",
  },
  {
    id: "txn_216",
    timestamp: iso(2026, 4, 16, 14, 20),
    type: "payout",
    counterparty: "@brooklyn_espresso",
    amount: -75,
    status: "pending",
    stripe_ref: stripeRef("po", 216),
    creator_id: "cre_bklyn",
    campaign_id: "cmp_dev_apr26",
  },
  {
    id: "txn_217",
    timestamp: iso(2026, 4, 17, 8, 45),
    type: "platform_fee",
    counterparty: "Push Platform",
    amount: 11.25,
    status: "pending",
    stripe_ref: stripeRef("fee", 217),
  },
];

// ── Auto-generated bulk entries (fill to 200+) ────────────────────────────────

const MERCHANTS = [
  "Blank Street Coffee — SoHo",
  "Procell Coffee — NoMad",
  "Blue Bottle Coffee — Hudson Yards",
  "Birch Coffee — Midtown",
  "Devoción — Williamsburg",
  "Partners Coffee — Williamsburg",
  "Cha Cha Matcha — SoHo",
  "Joe Coffee — Flatiron",
  "Stumptown Coffee — West Village",
  "Intelligentsia — Chelsea",
];

const CREATORS = [
  "@maya_eats_nyc",
  "@streetfoodchris",
  "@lucywanders",
  "@nycfoodscout",
  "@highlineharvey",
  "@brooklyn_espresso",
  "@manhattan_bites",
  "@queens_foodie",
  "@bronx_bites",
  "@uptown_eats",
  "@downtown_diner",
  "@midtown_muncher",
];

function generateBulkEntries(): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  let idCounter = 300;

  const months = [
    [2025, 4],
    [2025, 5],
    [2025, 6],
    [2025, 7],
    [2025, 8],
    [2025, 9],
    [2025, 10],
    [2025, 11],
    [2025, 12],
    [2026, 1],
    [2026, 2],
    [2026, 3],
  ];

  for (const [year, month] of months) {
    const daysInMonth = new Date(year, month, 0).getDate();

    // 4–6 subscriptions per month
    const subCount = 4 + (idCounter % 3);
    for (let i = 0; i < subCount; i++) {
      const day = 1 + ((i * 5) % daysInMonth);
      const merchant = MERCHANTS[idCounter % MERCHANTS.length];
      const plan = idCounter % 3 === 0 ? 199 : idCounter % 3 === 1 ? 69 : 19.99;
      entries.push({
        id: `txn_${idCounter}`,
        timestamp: iso(year, month, day, 9, idCounter % 60),
        type: "subscription",
        counterparty: merchant,
        amount: plan,
        status: "completed",
        stripe_ref: stripeRef("sub", idCounter),
        merchant_id: `mer_${idCounter}`,
      });
      idCounter++;
    }

    // 6–10 payouts per month
    const payoutCount = 6 + (idCounter % 5);
    for (let i = 0; i < payoutCount; i++) {
      const day = 2 + ((i * 3) % daysInMonth);
      const creator = CREATORS[idCounter % CREATORS.length];
      const payoutAmt = -(20 + (idCounter % 9) * 15);
      const statuses: TransactionStatus[] = [
        "completed",
        "completed",
        "completed",
        "pending",
        "failed",
      ];
      const status = statuses[idCounter % statuses.length];

      entries.push({
        id: `txn_${idCounter}`,
        timestamp: iso(year, month, day, 10 + (i % 8), idCounter % 60),
        type: "payout",
        counterparty: creator,
        amount: payoutAmt,
        status,
        stripe_ref: stripeRef("po", idCounter),
        creator_id: `cre_${idCounter}`,
        campaign_id: `cmp_${idCounter}`,
      });
      idCounter++;

      // Paired platform fee for completed payouts
      if (status === "completed") {
        entries.push({
          id: `txn_${idCounter}`,
          timestamp: iso(year, month, day, 10 + (i % 8), (idCounter % 60) + 1),
          type: "platform_fee",
          counterparty: "Push Platform",
          amount: Math.abs(payoutAmt) * 0.15,
          status: "completed",
          stripe_ref: stripeRef("fee", idCounter),
        });
        idCounter++;
      }
    }

    // 0–2 refunds per month
    if (idCounter % 4 === 0) {
      const merchant = MERCHANTS[idCounter % MERCHANTS.length];
      entries.push({
        id: `txn_${idCounter}`,
        timestamp: iso(year, month, 15, 14, 30),
        type: "refund",
        counterparty: merchant,
        amount: -(idCounter % 2 === 0 ? 69 : 199),
        status: "completed",
        stripe_ref: stripeRef("re", idCounter),
        note: "Merchant requested refund",
      });
      idCounter++;
    }
  }

  return entries;
}

// ── Merge and sort ─────────────────────────────────────────────────────────────

const BULK = generateBulkEntries();

export const MOCK_LEDGER: LedgerEntry[] = [...NAMED_ENTRIES, ...BULK].sort(
  (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
);

// ── Computed MTD aggregates (Apr 2026) ────────────────────────────────────────

export function computeMTD(entries: LedgerEntry[]) {
  const now = new Date("2026-04-17");
  const startOfMonth = new Date("2026-04-01");

  const mtd = entries.filter((e) => {
    const d = new Date(e.timestamp);
    return d >= startOfMonth && d <= now;
  });

  const gmv = mtd
    .filter((e) => e.type === "subscription" && e.status === "completed")
    .reduce((s, e) => s + e.amount, 0);

  const payouts = mtd
    .filter((e) => e.type === "payout" && e.status === "completed")
    .reduce((s, e) => s + Math.abs(e.amount), 0);

  const platformFees = mtd
    .filter((e) => e.type === "platform_fee" && e.status === "completed")
    .reduce((s, e) => s + e.amount, 0);

  return { gmv, payouts, platformFees };
}

// ── Monthly P&L bars (last 12 months) ─────────────────────────────────────────

export function computeMonthlyPnL(entries: LedgerEntry[]) {
  const months: {
    label: string;
    revenue: number;
    payouts: number;
    net: number;
  }[] = [];

  const pairs: [number, number][] = [
    [2025, 4],
    [2025, 5],
    [2025, 6],
    [2025, 7],
    [2025, 8],
    [2025, 9],
    [2025, 10],
    [2025, 11],
    [2025, 12],
    [2026, 1],
    [2026, 2],
    [2026, 3],
  ];

  const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (const [year, month] of pairs) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const slice = entries.filter((e) => {
      const d = new Date(e.timestamp);
      return d >= start && d <= end && e.status === "completed";
    });

    const revenue = slice
      .filter((e) => e.type === "subscription")
      .reduce((s, e) => s + e.amount, 0);

    const payoutsAmt = slice
      .filter((e) => e.type === "payout")
      .reduce((s, e) => s + Math.abs(e.amount), 0);

    const fees = slice
      .filter((e) => e.type === "platform_fee")
      .reduce((s, e) => s + e.amount, 0);

    months.push({
      label: `${MONTH_NAMES[month - 1]} '${String(year).slice(2)}`,
      revenue,
      payouts: payoutsAmt,
      net: revenue + fees - payoutsAmt,
    });
  }

  return months;
}
