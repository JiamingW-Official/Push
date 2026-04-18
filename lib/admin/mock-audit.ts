/**
 * Mock audit log data — 500+ entries covering 30 days
 * Covers all action types: KYC, user management, payouts, campaigns, policy
 */

export type AuditSeverity = "info" | "warning" | "critical";

export type AuditAction =
  | "approved_kyc"
  | "rejected_kyc"
  | "suspended_user"
  | "reinstated_user"
  | "deleted_user"
  | "refunded_payout"
  | "overrode_payout"
  | "approved_campaign"
  | "rejected_campaign"
  | "paused_campaign"
  | "closed_campaign"
  | "updated_policy"
  | "exported_data"
  | "accessed_pii"
  | "reset_password"
  | "granted_role"
  | "revoked_role"
  | "flagged_fraud"
  | "cleared_flag"
  | "adjusted_tier"
  | "issued_credit"
  | "overrode_score"
  | "bulk_suspended"
  | "viewed_audit_log";

export type TargetType =
  | "creator"
  | "merchant"
  | "campaign"
  | "payout"
  | "policy"
  | "role"
  | "report";

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    email: string;
    initials: string;
  };
  action: AuditAction;
  actionLabel: string;
  target: {
    type: TargetType;
    id: string;
    label: string;
  };
  severity: AuditSeverity;
  ip: string;
  userAgent: string;
  notes?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  pinned?: boolean;
}

// --- Seeded deterministic random ---
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = seededRng(42);

const ADMINS = [
  {
    id: "adm_001",
    name: "Sarah Chen",
    email: "s.chen@pushnyc.co",
    initials: "SC",
  },
  {
    id: "adm_002",
    name: "Marcus Rivera",
    email: "m.rivera@pushnyc.co",
    initials: "MR",
  },
  {
    id: "adm_003",
    name: "Priya Kapoor",
    email: "p.kapoor@pushnyc.co",
    initials: "PK",
  },
  {
    id: "adm_004",
    name: "Devon Walsh",
    email: "d.walsh@pushnyc.co",
    initials: "DW",
  },
  {
    id: "adm_005",
    name: "Aisha Thompson",
    email: "a.thompson@pushnyc.co",
    initials: "AT",
  },
];

const CREATOR_NAMES = [
  "Jordan Lee",
  "Mia Torres",
  "Tyler Brooks",
  "Zoe Martinez",
  "Kai Johnson",
  "Aaliyah Davis",
  "Luca Romano",
  "Nina Patel",
  "Theo Williams",
  "Sofia Garcia",
  "Marcus Wright",
  "Emma Liu",
  "Damon Scott",
  "Isabella Kim",
  "Noah Carter",
  "Ava Rodriguez",
  "Elijah Brown",
  "Chloe Nguyen",
  "Samuel Jackson",
  "Lily Chen",
];

const MERCHANT_NAMES = [
  "Nolita Espresso",
  "Brooklyn Bao Co.",
  "Tribeca Wellness",
  "Bushwick Ink Studio",
  "SoHo Vintage",
  "Astoria Eats",
  "LES Bakehouse",
  "Chelsea Market Stand",
  "Williamsburg Roast",
  "Park Slope Yoga",
];

const CAMPAIGN_TITLES = [
  "Spring Menu Launch",
  "Grand Opening Weekend",
  "Anniversary Collection",
  "Summer Pop-Up Event",
  "New Location Reveal",
  "Limited Edition Drop",
  "Wellness Week Promo",
  "Happy Hour Campaign",
  "Artist Collaboration",
  "Flash Sale Blitz",
];

const IPS = [
  "198.51.100.12",
  "203.0.113.45",
  "192.0.2.89",
  "198.51.100.67",
  "203.0.113.102",
  "192.0.2.234",
  "198.51.100.178",
  "203.0.113.19",
];

const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/124",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) Safari/617",
  "Mozilla/5.0 (X11; Linux x86_64) Firefox/125",
];

const ACTION_CONFIGS: Record<
  AuditAction,
  {
    label: string;
    severity: AuditSeverity;
    targetType: TargetType;
    weight: number;
  }
> = {
  approved_kyc: {
    label: "approved KYC for",
    severity: "info",
    targetType: "creator",
    weight: 18,
  },
  rejected_kyc: {
    label: "rejected KYC for",
    severity: "warning",
    targetType: "creator",
    weight: 8,
  },
  suspended_user: {
    label: "suspended user",
    severity: "critical",
    targetType: "creator",
    weight: 5,
  },
  reinstated_user: {
    label: "reinstated user",
    severity: "warning",
    targetType: "creator",
    weight: 3,
  },
  deleted_user: {
    label: "deleted user",
    severity: "critical",
    targetType: "creator",
    weight: 1,
  },
  refunded_payout: {
    label: "refunded payout",
    severity: "critical",
    targetType: "payout",
    weight: 6,
  },
  overrode_payout: {
    label: "overrode payout",
    severity: "critical",
    targetType: "payout",
    weight: 3,
  },
  approved_campaign: {
    label: "approved campaign",
    severity: "info",
    targetType: "campaign",
    weight: 20,
  },
  rejected_campaign: {
    label: "rejected campaign",
    severity: "warning",
    targetType: "campaign",
    weight: 7,
  },
  paused_campaign: {
    label: "paused campaign",
    severity: "warning",
    targetType: "campaign",
    weight: 6,
  },
  closed_campaign: {
    label: "closed campaign",
    severity: "info",
    targetType: "campaign",
    weight: 10,
  },
  updated_policy: {
    label: "updated policy",
    severity: "critical",
    targetType: "policy",
    weight: 2,
  },
  exported_data: {
    label: "exported data",
    severity: "warning",
    targetType: "report",
    weight: 4,
  },
  accessed_pii: {
    label: "accessed PII for",
    severity: "warning",
    targetType: "creator",
    weight: 8,
  },
  reset_password: {
    label: "reset password for",
    severity: "info",
    targetType: "creator",
    weight: 12,
  },
  granted_role: {
    label: "granted role",
    severity: "critical",
    targetType: "role",
    weight: 2,
  },
  revoked_role: {
    label: "revoked role",
    severity: "critical",
    targetType: "role",
    weight: 1,
  },
  flagged_fraud: {
    label: "flagged fraud for",
    severity: "critical",
    targetType: "creator",
    weight: 4,
  },
  cleared_flag: {
    label: "cleared flag for",
    severity: "warning",
    targetType: "creator",
    weight: 3,
  },
  adjusted_tier: {
    label: "adjusted tier for",
    severity: "info",
    targetType: "creator",
    weight: 9,
  },
  issued_credit: {
    label: "issued credit to",
    severity: "warning",
    targetType: "creator",
    weight: 5,
  },
  overrode_score: {
    label: "overrode score for",
    severity: "warning",
    targetType: "creator",
    weight: 4,
  },
  bulk_suspended: {
    label: "bulk-suspended",
    severity: "critical",
    targetType: "creator",
    weight: 1,
  },
  viewed_audit_log: {
    label: "viewed audit log",
    severity: "info",
    targetType: "report",
    weight: 15,
  },
};

// Build weighted action list
const ACTION_POOL: AuditAction[] = [];
for (const [action, cfg] of Object.entries(ACTION_CONFIGS)) {
  for (let i = 0; i < cfg.weight; i++) {
    ACTION_POOL.push(action as AuditAction);
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randomId(prefix: string): string {
  const hex = Math.floor(rng() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
  return `${prefix}_${hex}`;
}

function randomAmount(): number {
  return Math.round((rng() * 290 + 10) * 100) / 100;
}

function buildTarget(type: TargetType): {
  type: TargetType;
  id: string;
  label: string;
} {
  switch (type) {
    case "creator":
      return { type, id: randomId("crt"), label: pick(CREATOR_NAMES) };
    case "merchant":
      return { type, id: randomId("mch"), label: pick(MERCHANT_NAMES) };
    case "campaign":
      return { type, id: randomId("cmp"), label: pick(CAMPAIGN_TITLES) };
    case "payout":
      return { type, id: randomId("pay"), label: `$${randomAmount()} payout` };
    case "policy":
      return {
        type,
        id: randomId("pol"),
        label: pick([
          "Creator TOS v2.4",
          "Payout Policy v1.9",
          "KYC Requirements v3.1",
          "Anti-Fraud Rules v2.0",
        ]),
      };
    case "role":
      return {
        type,
        id: randomId("rol"),
        label: pick(["admin", "support", "finance", "ops"]),
      };
    case "report":
      return {
        type,
        id: randomId("rpt"),
        label: pick([
          "Creator PII export",
          "Payout ledger",
          "KYC submissions",
          "Audit log",
        ]),
      };
  }
}

function buildBeforeAfter(action: AuditAction): {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
} {
  switch (action) {
    case "approved_kyc":
      return {
        before: { kyc_status: "pending" },
        after: {
          kyc_status: "approved",
          verified_at: new Date().toISOString(),
        },
      };
    case "rejected_kyc":
      return {
        before: { kyc_status: "pending" },
        after: { kyc_status: "rejected", rejection_reason: "ID mismatch" },
      };
    case "suspended_user":
      return {
        before: { status: "active" },
        after: {
          status: "suspended",
          suspended_reason: "Policy violation §3.2",
        },
      };
    case "reinstated_user":
      return { before: { status: "suspended" }, after: { status: "active" } };
    case "refunded_payout":
      return {
        before: { payout_status: "settled" },
        after: { payout_status: "refunded", refund_reason: "Merchant dispute" },
      };
    case "adjusted_tier":
      return {
        before: { tier: pick(["seed", "explorer", "operator"]) },
        after: { tier: pick(["operator", "proven", "closer"]) },
      };
    case "overrode_score":
      return {
        before: { push_score: Math.round(rng() * 40 + 40) },
        after: { push_score: Math.round(rng() * 40 + 50) },
      };
    case "issued_credit":
      return {
        before: { balance: Math.round(rng() * 100) },
        after: { balance: Math.round(rng() * 100 + 100) },
      };
    case "paused_campaign":
      return { before: { status: "active" }, after: { status: "paused" } };
    case "granted_role":
      return { before: { role: "support" }, after: { role: "admin" } };
    default:
      return {};
  }
}

function buildNote(action: AuditAction): string | undefined {
  const notes: Partial<Record<AuditAction, string[]>> = {
    rejected_kyc: [
      "ID photo blurry",
      "Name mismatch with SSN",
      "Document expired",
      "Address verification failed",
    ],
    suspended_user: [
      "Multiple fraud reports from merchants",
      "Chargeback abuse",
      "Fake UGC submissions",
      "Policy §3.2 violation: duplicate accounts",
    ],
    refunded_payout: [
      "Merchant requested refund within 48h window",
      "Content not delivered",
      "QR attribution error confirmed",
    ],
    flagged_fraud: [
      "Suspicious IP cluster",
      "Bot-like QR scan pattern",
      "Multiple accounts same device fingerprint",
    ],
    updated_policy: [
      "Legal review completed",
      "Effective 30 days from today",
      "All users notified via email",
    ],
    bulk_suspended: ["Automated fraud sweep — 14 accounts flagged"],
    overrode_payout: ["Finance approved override ref #FIN-2024-0892"],
    issued_credit: ["Goodwill credit for platform downtime 2024-03-12"],
  };
  const pool = notes[action];
  return pool ? pick(pool) : undefined;
}

// Generate 520 entries spread across 30 days
function generateEntries(): AuditEntry[] {
  const entries: AuditEntry[] = [];
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 520; i++) {
    const action = pick(ACTION_POOL);
    const cfg = ACTION_CONFIGS[action];
    const actor = pick(ADMINS);
    const target = buildTarget(cfg.targetType);
    const { before, after } = buildBeforeAfter(action);
    const note = buildNote(action);
    const msAgo = rng() * thirtyDays;
    const ts = new Date(now - msAgo).toISOString();

    entries.push({
      id: randomId("evt"),
      timestamp: ts,
      actor,
      action,
      actionLabel: cfg.label,
      target,
      severity: cfg.severity,
      ip: pick(IPS),
      userAgent: pick(USER_AGENTS),
      notes: note,
      before,
      after,
      pinned: false,
    });
  }

  // Mark important pinned events
  const pinnedActions: AuditAction[] = [
    "suspended_user",
    "bulk_suspended",
    "refunded_payout",
    "updated_policy",
    "deleted_user",
    "granted_role",
  ];
  let pinnedCount = 0;
  for (let i = entries.length - 1; i >= 0 && pinnedCount < 12; i--) {
    if (pinnedActions.includes(entries[i].action)) {
      entries[i].pinned = true;
      pinnedCount++;
    }
  }

  // Sort newest first
  entries.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  return entries;
}

export const MOCK_AUDIT_LOG: AuditEntry[] = generateEntries();

export function getAuditSummary() {
  const total = MOCK_AUDIT_LOG.length;
  const critical = MOCK_AUDIT_LOG.filter(
    (e) => e.severity === "critical",
  ).length;
  const warning = MOCK_AUDIT_LOG.filter((e) => e.severity === "warning").length;
  const info = MOCK_AUDIT_LOG.filter((e) => e.severity === "info").length;
  const pinned = MOCK_AUDIT_LOG.filter((e) => e.pinned).length;
  return { total, critical, warning, info, pinned };
}
