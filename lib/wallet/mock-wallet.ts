// Mock wallet data — replace with Supabase + Stripe Connect in production

export type PayoutMethodType = "stripe" | "venmo" | "bank" | "paypal";
export type PayoutMethodStatus = "verified" | "pending" | "disabled";

export interface PayoutMethod {
  id: string;
  type: PayoutMethodType;
  name: string;
  detail: string; // last 4 digits, email, or @handle
  status: PayoutMethodStatus;
  isDefault: boolean;
  fee: string; // display string
  feeRate: number; // as decimal, e.g. 0.0025
  addedAt: string;
}

export type WithdrawalStatus = "processing" | "sent" | "failed";

export interface Withdrawal {
  id: string;
  date: string;
  methodId: string;
  methodType: PayoutMethodType;
  methodDetail: string;
  amount: number;
  fee: number;
  net: number;
  status: WithdrawalStatus;
  failureReason?: string;
}

export interface MonthlyEarning {
  month: string; // "Jan" etc.
  amount: number;
}

export interface TaxSummary {
  year: number;
  totalEarned: number;
  platformFees: number;
  netEarned: number;
  w9Name: string;
  w9Ssn: string; // masked
  w9Address: string;
  monthlyBreakdown: MonthlyEarning[];
  form1099Available: boolean;
  form1099Year: number; // prior year available
}

export interface WalletBalance {
  available: number;
  processing: number;
  thisYear: number;
}

// ── Payout Methods ──────────────────────────────────────────

export const MOCK_PAYOUT_METHODS: PayoutMethod[] = [
  {
    id: "pm-001",
    type: "stripe",
    name: "Stripe Connect",
    detail: "••••4242",
    status: "verified",
    isDefault: true,
    fee: "0.25%",
    feeRate: 0.0025,
    addedAt: "2025-09-14",
  },
  {
    id: "pm-002",
    type: "venmo",
    name: "Venmo",
    detail: "@alexcheneats",
    status: "verified",
    isDefault: false,
    fee: "Free",
    feeRate: 0,
    addedAt: "2025-10-02",
  },
  {
    id: "pm-003",
    type: "bank",
    name: "Chase Bank",
    detail: "••••7891",
    status: "pending",
    isDefault: false,
    fee: "$1.50",
    feeRate: 0,
    addedAt: "2026-01-18",
  },
  {
    id: "pm-004",
    type: "paypal",
    name: "PayPal",
    detail: "alex.chen.old@gmail.com",
    status: "disabled",
    isDefault: false,
    fee: "1.5% + $0.25",
    feeRate: 0.015,
    addedAt: "2024-06-01",
  },
];

// ── Withdrawal History ──────────────────────────────────────

export const MOCK_WITHDRAWALS: Withdrawal[] = [
  {
    id: "wd-001",
    date: "2026-04-10",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 250,
    fee: 0.63,
    net: 249.37,
    status: "sent",
  },
  {
    id: "wd-002",
    date: "2026-04-03",
    methodId: "pm-002",
    methodType: "venmo",
    methodDetail: "@alexcheneats",
    amount: 85,
    fee: 0,
    net: 85,
    status: "sent",
  },
  {
    id: "wd-003",
    date: "2026-03-28",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 320,
    fee: 0.8,
    net: 319.2,
    status: "sent",
  },
  {
    id: "wd-004",
    date: "2026-03-21",
    methodId: "pm-003",
    methodType: "bank",
    methodDetail: "••••7891",
    amount: 150,
    fee: 1.5,
    net: 148.5,
    status: "failed",
    failureReason:
      "Bank account verification incomplete. Please verify your routing number.",
  },
  {
    id: "wd-005",
    date: "2026-03-15",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 200,
    fee: 0.5,
    net: 199.5,
    status: "sent",
  },
  {
    id: "wd-006",
    date: "2026-03-08",
    methodId: "pm-002",
    methodType: "venmo",
    methodDetail: "@alexcheneats",
    amount: 120,
    fee: 0,
    net: 120,
    status: "sent",
  },
  {
    id: "wd-007",
    date: "2026-03-01",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 175,
    fee: 0.44,
    net: 174.56,
    status: "sent",
  },
  {
    id: "wd-008",
    date: "2026-02-22",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 400,
    fee: 1,
    net: 399,
    status: "sent",
  },
  {
    id: "wd-009",
    date: "2026-02-14",
    methodId: "pm-002",
    methodType: "venmo",
    methodDetail: "@alexcheneats",
    amount: 65,
    fee: 0,
    net: 65,
    status: "sent",
  },
  {
    id: "wd-010",
    date: "2026-02-07",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 220,
    fee: 0.55,
    net: 219.45,
    status: "sent",
  },
  {
    id: "wd-011",
    date: "2026-01-30",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 310,
    fee: 0.78,
    net: 309.22,
    status: "sent",
  },
  {
    id: "wd-012",
    date: "2026-01-22",
    methodId: "pm-002",
    methodType: "venmo",
    methodDetail: "@alexcheneats",
    amount: 95,
    fee: 0,
    net: 95,
    status: "sent",
  },
  {
    id: "wd-013",
    date: "2026-01-15",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 280,
    fee: 0.7,
    net: 279.3,
    status: "processing",
  },
  {
    id: "wd-014",
    date: "2026-01-08",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 180,
    fee: 0.45,
    net: 179.55,
    status: "sent",
  },
  {
    id: "wd-015",
    date: "2025-12-28",
    methodId: "pm-002",
    methodType: "venmo",
    methodDetail: "@alexcheneats",
    amount: 110,
    fee: 0,
    net: 110,
    status: "sent",
  },
  {
    id: "wd-016",
    date: "2025-12-18",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 350,
    fee: 0.88,
    net: 349.12,
    status: "sent",
  },
  {
    id: "wd-017",
    date: "2025-12-05",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 225,
    fee: 0.56,
    net: 224.44,
    status: "sent",
  },
  {
    id: "wd-018",
    date: "2025-11-25",
    methodId: "pm-002",
    methodType: "venmo",
    methodDetail: "@alexcheneats",
    amount: 75,
    fee: 0,
    net: 75,
    status: "sent",
  },
  {
    id: "wd-019",
    date: "2025-11-15",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 190,
    fee: 0.48,
    net: 189.52,
    status: "sent",
  },
  {
    id: "wd-020",
    date: "2025-11-05",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 260,
    fee: 0.65,
    net: 259.35,
    status: "failed",
    failureReason:
      "Payout limit exceeded for this period. Please contact support.",
  },
  {
    id: "wd-021",
    date: "2025-10-28",
    methodId: "pm-002",
    methodType: "venmo",
    methodDetail: "@alexcheneats",
    amount: 90,
    fee: 0,
    net: 90,
    status: "sent",
  },
  {
    id: "wd-022",
    date: "2025-10-18",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 300,
    fee: 0.75,
    net: 299.25,
    status: "sent",
  },
  {
    id: "wd-023",
    date: "2025-10-08",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 145,
    fee: 0.36,
    net: 144.64,
    status: "sent",
  },
  {
    id: "wd-024",
    date: "2025-09-25",
    methodId: "pm-002",
    methodType: "venmo",
    methodDetail: "@alexcheneats",
    amount: 55,
    fee: 0,
    net: 55,
    status: "sent",
  },
  {
    id: "wd-025",
    date: "2025-09-15",
    methodId: "pm-001",
    methodType: "stripe",
    methodDetail: "••••4242",
    amount: 210,
    fee: 0.53,
    net: 209.47,
    status: "sent",
  },
];

// ── Tax Summary ─────────────────────────────────────────────

export const MOCK_TAX_SUMMARY: TaxSummary = {
  year: 2026,
  totalEarned: 3840,
  platformFees: 48.2,
  netEarned: 3791.8,
  w9Name: "Alex Chen",
  w9Ssn: "••• - •• - 4219",
  w9Address: "147 Orchard St, Apt 3B, New York, NY 10002",
  form1099Available: true,
  form1099Year: 2025,
  monthlyBreakdown: [
    { month: "Jan", amount: 785 },
    { month: "Feb", amount: 685 },
    { month: "Mar", amount: 745 },
    { month: "Apr", amount: 335 },
    { month: "May", amount: 0 },
    { month: "Jun", amount: 0 },
    { month: "Jul", amount: 0 },
    { month: "Aug", amount: 0 },
    { month: "Sep", amount: 0 },
    { month: "Oct", amount: 0 },
    { month: "Nov", amount: 0 },
    { month: "Dec", amount: 0 },
  ],
};

// ── Wallet Balance ──────────────────────────────────────────

export const MOCK_WALLET_BALANCE: WalletBalance = {
  available: 1247.5,
  processing: 280.0,
  thisYear: 3840.0,
};
