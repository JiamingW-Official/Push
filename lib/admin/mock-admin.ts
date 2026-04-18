// Push Admin — Mock data for operations console
// TODO: wire all values to Supabase aggregation queries

export type EventType =
  | "scan"
  | "verify"
  | "apply"
  | "payment"
  | "dispute"
  | "fraud_flag"
  | "kyc_submit";

export type AlertSeverity = "critical" | "warning" | "info";

export interface LiveEvent {
  id: string;
  type: EventType;
  actor: string; // handle or email
  target: string; // campaign title or merchant name
  location: string;
  amount?: number; // USD, for payment events
  timestamp: string; // ISO
  meta?: string; // short descriptor
}

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  category: "fraud" | "kyc" | "dispute";
  title: string;
  actor: string;
  created_at: string;
}

export interface AdminMetrics {
  // Hero 24h metrics
  last24h: {
    scans: number;
    verifications: number;
    applications: number;
    gmv: number; // USD
  };
  // 4 KPI cards
  kpi: {
    gmv_month: number;
    active_campaigns: number;
    new_users_today: number;
    pending_actions: number; // sum of fraud + verify + dispute queues
  };
  // Alert counts
  alerts: {
    fraud_suspected: number;
    kyc_pending: number;
    disputes_open: number;
  };
  // 7-day trend arrays (oldest → newest, 7 data points)
  trend_7d: {
    scans: number[];
    verifies: number[];
    conversions: number[];
    labels: string[]; // e.g. ["Apr 11", "Apr 12", ...]
  };
}

// ── Mock metrics ──────────────────────────────────────────────

export const MOCK_METRICS: AdminMetrics = {
  last24h: {
    scans: 312,
    verifications: 47,
    applications: 23,
    gmv: 4820,
  },
  kpi: {
    gmv_month: 128_450,
    active_campaigns: 84,
    new_users_today: 19,
    pending_actions: 11, // 4 fraud + 5 kyc + 2 dispute
  },
  alerts: {
    fraud_suspected: 4,
    kyc_pending: 5,
    disputes_open: 2,
  },
  trend_7d: {
    labels: [
      "Apr 11",
      "Apr 12",
      "Apr 13",
      "Apr 14",
      "Apr 15",
      "Apr 16",
      "Apr 17",
    ],
    scans: [244, 278, 301, 289, 315, 342, 312],
    verifies: [31, 38, 42, 37, 44, 51, 47],
    conversions: [18, 22, 27, 24, 31, 38, 34],
  },
};

// ── Mock activity feed (50 events) ───────────────────────────

const MERCHANTS = [
  "Blank Street Coffee SoHo",
  "Joe Coffee Park Slope",
  "Cecconi's Dumbo",
  "Superiority Burger",
  "Russ & Daughters Café",
  "Baar Baar Tribeca",
  "Don Angie",
  "Lilia Williamsburg",
  "The Smile NoLita",
  "Cosme Flatiron",
];

const CREATORS = [
  "@sofiainyc",
  "@jamesliu.eats",
  "@alexchen.nyc",
  "@rachelkimnyc",
  "@tompark.nyc",
  "@mayaj.creates",
  "@jessicawang",
  "@nycfoodie",
  "@brooklynbite",
  "@manhattanmunch",
  "@queenseats",
  "@bronxbites",
];

const CAMPAIGNS = [
  "Free Latte for a 30-Second Reel",
  "Morning Rush Special Reel",
  "Holiday Blend Launch",
  "Brunch Menu Drop",
  "Happy Hour Collab",
  "Tasting Menu Reel",
  "Grand Opening Coverage",
  "Weekend Brunch Series",
];

const NEIGHBORHOODS = [
  "SoHo, NYC",
  "Park Slope, BK",
  "Dumbo, BK",
  "Tribeca, NYC",
  "Williamsburg, BK",
  "NoLita, NYC",
  "Flatiron, NYC",
  "Chelsea, NYC",
  "West Village, NYC",
  "LES, NYC",
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isoMinutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

// Generate 50 mock events in reverse-chronological order
export const MOCK_EVENTS: LiveEvent[] = (() => {
  const types: EventType[] = [
    "scan",
    "scan",
    "scan",
    "scan", // weighted: scans are most common
    "verify",
    "verify",
    "verify",
    "apply",
    "apply",
    "payment",
    "dispute",
    "fraud_flag",
    "kyc_submit",
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const type = pick(types);
    const minutesAgo = i * randInt(8, 22); // spread across ~7 hours
    const creator = pick(CREATORS);
    const merchant = pick(MERCHANTS);
    const campaign = pick(CAMPAIGNS);

    let actor = creator;
    let target = campaign;
    let meta: string | undefined;
    let amount: number | undefined;

    switch (type) {
      case "scan":
        meta = `QR scan at ${pick(MERCHANTS)}`;
        break;
      case "verify":
        meta = "Content verified by system";
        target = campaign;
        break;
      case "apply":
        meta = `Applied to: ${campaign}`;
        break;
      case "payment":
        amount = pick([25, 40, 65, 75, 100, 150]);
        actor = merchant;
        target = creator;
        meta = `Settled payout`;
        break;
      case "dispute":
        actor = merchant;
        target = creator;
        meta = "Payout disputed";
        break;
      case "fraud_flag":
        meta = "Velocity anomaly detected";
        break;
      case "kyc_submit":
        meta = "KYC documents submitted";
        break;
    }

    return {
      id: `evt-${String(i).padStart(3, "0")}`,
      type,
      actor,
      target,
      location: pick(NEIGHBORHOODS),
      amount,
      timestamp: isoMinutesAgo(minutesAgo),
      meta,
    };
  });
})();

// ── Alert items ───────────────────────────────────────────────

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: "alert-001",
    severity: "critical",
    category: "fraud",
    title: "High-velocity QR scan pattern",
    actor: "@nycfoodie",
    created_at: isoMinutesAgo(12),
  },
  {
    id: "alert-002",
    severity: "critical",
    category: "fraud",
    title: "Duplicate redemption detected",
    actor: "@brooklynbite",
    created_at: isoMinutesAgo(34),
  },
  {
    id: "alert-003",
    severity: "warning",
    category: "fraud",
    title: "Suspicious scan cluster",
    actor: "@queenseats",
    created_at: isoMinutesAgo(71),
  },
  {
    id: "alert-004",
    severity: "warning",
    category: "fraud",
    title: "Proxy IP detected on verification",
    actor: "@bronxbites",
    created_at: isoMinutesAgo(140),
  },
  {
    id: "alert-005",
    severity: "warning",
    category: "kyc",
    title: "KYC review required — new merchant",
    actor: "Cecconi's Dumbo",
    created_at: isoMinutesAgo(25),
  },
  {
    id: "alert-006",
    severity: "info",
    category: "kyc",
    title: "Document resubmission pending",
    actor: "Baar Baar Tribeca",
    created_at: isoMinutesAgo(88),
  },
  {
    id: "alert-007",
    severity: "info",
    category: "kyc",
    title: "Identity verification stalled",
    actor: "@jessicawang",
    created_at: isoMinutesAgo(210),
  },
  {
    id: "alert-008",
    severity: "warning",
    category: "kyc",
    title: "Expired document uploaded",
    actor: "Don Angie",
    created_at: isoMinutesAgo(310),
  },
  {
    id: "alert-009",
    severity: "info",
    category: "kyc",
    title: "Business registration unverified",
    actor: "The Smile NoLita",
    created_at: isoMinutesAgo(420),
  },
  {
    id: "alert-010",
    severity: "warning",
    category: "dispute",
    title: "Creator disputes partial payout",
    actor: "@rachelkimnyc",
    created_at: isoMinutesAgo(55),
  },
  {
    id: "alert-011",
    severity: "critical",
    category: "dispute",
    title: "Merchant requests full refund",
    actor: "Joe Coffee Park Slope",
    created_at: isoMinutesAgo(180),
  },
];
