// Mock fraud scan events for admin review queue
// 80 suspicious scan events with realistic field distribution

export type DetectionRule =
  | "Impossible velocity"
  | "Duplicate device"
  | "Geo mismatch"
  | "VPN detected"
  | "Repeated IP"
  | "Spoofed GPS"
  | "New device spike"
  | "High frequency scan"
  | "Self-scan pattern"
  | "Blacklisted device";

export type FraudStatus =
  | "pending"
  | "approved"
  | "flagged"
  | "blocked"
  | "escalated";

export interface FraudEvent {
  id: string;
  qrId: string;
  riskScore: number;
  rules: DetectionRule[];
  ip: string;
  device: string;
  loc: { lat: number; lng: number; label: string };
  expectedLoc: { lat: number; lng: number; label: string };
  creatorId: string;
  creatorHandle: string;
  creatorTier:
    | "seed"
    | "explorer"
    | "operator"
    | "proven"
    | "closer"
    | "partner";
  merchantId: string;
  merchantName: string;
  detectedAt: string;
  status: FraudStatus;
  notes?: string;
}

function ip(a: number, b: number, c: number, d: number) {
  return `${a}.${b}.${c}.${d}`;
}

function dev(prefix: string, suffix: string) {
  return `${prefix}-****-${suffix}`;
}

const NYC_LOCS = [
  { lat: 40.758, lng: -73.9855, label: "Times Square, Midtown" },
  { lat: 40.7484, lng: -73.9967, label: "Chelsea, Manhattan" },
  { lat: 40.7282, lng: -73.7949, label: "Jamaica, Queens" },
  { lat: 40.6501, lng: -73.9496, label: "Flatbush, Brooklyn" },
  { lat: 40.8448, lng: -73.8648, label: "Pelham Pkwy, Bronx" },
  { lat: 40.5795, lng: -74.1502, label: "Richmond, Staten Island" },
  { lat: 40.7614, lng: -73.9776, label: "Midtown East" },
  { lat: 40.6892, lng: -74.0445, label: "Red Hook, Brooklyn" },
];

const MERCHANTS = [
  { id: "m-001", name: "Procell NYC" },
  { id: "m-002", name: "The Meatball Shop" },
  { id: "m-003", name: "Levain Bakery" },
  { id: "m-004", name: "Prince Street Pizza" },
  { id: "m-005", name: "Roberta's" },
  { id: "m-006", name: "Joe Coffee" },
  { id: "m-007", name: "Superiority Burger" },
  { id: "m-008", name: "Xi'an Famous Foods" },
];

const CREATORS = [
  { id: "c-001", handle: "@nyc_eats_daily", tier: "explorer" as const },
  { id: "c-002", handle: "@foodie.juniper", tier: "operator" as const },
  { id: "c-003", handle: "@downtown.bites", tier: "seed" as const },
  { id: "c-004", handle: "@nycnight_maria", tier: "proven" as const },
  { id: "c-005", handle: "@streetfood.kai", tier: "closer" as const },
  { id: "c-006", handle: "@boroughbites", tier: "explorer" as const },
  { id: "c-007", handle: "@curiousplate.nyc", tier: "operator" as const },
  { id: "c-008", handle: "@ramen.rosalie", tier: "seed" as const },
];

const ALL_RULES: DetectionRule[] = [
  "Impossible velocity",
  "Duplicate device",
  "Geo mismatch",
  "VPN detected",
  "Repeated IP",
  "Spoofed GPS",
  "New device spike",
  "High frequency scan",
  "Self-scan pattern",
  "Blacklisted device",
];

function pickRules(riskScore: number): DetectionRule[] {
  const count = riskScore > 85 ? 3 : riskScore > 70 ? 2 : 1;
  const shuffled = [...ALL_RULES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return d.toISOString();
}

export const MOCK_FRAUD_EVENTS: FraudEvent[] = Array.from(
  { length: 80 },
  (_, i) => {
    const idx = i + 1;
    const riskScore = 45 + Math.floor(Math.random() * 55); // 45-99
    const creator = CREATORS[i % CREATORS.length];
    const merchant = MERCHANTS[i % MERCHANTS.length];
    const loc = NYC_LOCS[i % NYC_LOCS.length];
    const expectedIdx = (i + 3) % NYC_LOCS.length;
    const expectedLoc = NYC_LOCS[expectedIdx];
    const ipAddr = ip(
      [104, 162, 45, 198, 23, 67][i % 6],
      [20, 33, 128, 10, 5, 99][i % 6],
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    );
    const devSuffix = ["a3b9", "f12c", "9e4d", "3c71", "bb02", "d55e"][i % 6];
    const devPrefix = ["iphone", "android", "pixel", "galaxy", "xiaomi"][i % 5];

    const statuses: FraudStatus[] = [
      "pending",
      "pending",
      "pending",
      "pending",
      "flagged",
      "approved",
    ];
    const status = idx <= 60 ? "pending" : statuses[i % statuses.length];

    return {
      id: `fe-${pad2(Math.floor(idx / 10))}${pad2(idx % 100)}`,
      qrId: `qr-${merchant.id}-${pad2(idx)}`,
      riskScore,
      rules: pickRules(riskScore),
      ip: ipAddr,
      device: dev(devPrefix, devSuffix),
      loc,
      expectedLoc,
      creatorId: creator.id,
      creatorHandle: creator.handle,
      creatorTier: creator.tier,
      merchantId: merchant.id,
      merchantName: merchant.name,
      detectedAt: randomDate(14),
      status,
      notes: undefined,
    };
  },
).sort((a, b) => b.riskScore - a.riskScore);

// Active detection rules (rules engine panel)
export interface ActiveRule {
  id: string;
  name: DetectionRule;
  description: string;
  threshold: string;
  triggeredCount: number;
  enabled: boolean;
}

export const ACTIVE_RULES: ActiveRule[] = [
  {
    id: "r-01",
    name: "Impossible velocity",
    description: "Same creator scanned >2 unique merchants within 15 minutes",
    threshold: ">2 scans / 15 min",
    triggeredCount: 312,
    enabled: true,
  },
  {
    id: "r-02",
    name: "Duplicate device",
    description: "Same device fingerprint used by multiple creator accounts",
    threshold: ">1 creator / device",
    triggeredCount: 187,
    enabled: true,
  },
  {
    id: "r-03",
    name: "Geo mismatch",
    description: "Scan location >0.5 miles from merchant's registered address",
    threshold: ">0.5 miles",
    triggeredCount: 491,
    enabled: true,
  },
  {
    id: "r-04",
    name: "VPN detected",
    description: "IP address resolved to known VPN/proxy exit node",
    threshold: "Confidence >80%",
    triggeredCount: 98,
    enabled: true,
  },
  {
    id: "r-05",
    name: "Repeated IP",
    description: "Same IP scanned >5 different QR codes in 1 hour",
    threshold: ">5 QR / IP / hour",
    triggeredCount: 234,
    enabled: true,
  },
  {
    id: "r-06",
    name: "Spoofed GPS",
    description:
      "Device GPS coordinates inconsistent with cell/wifi triangulation",
    threshold: "Delta >200m",
    triggeredCount: 56,
    enabled: true,
  },
  {
    id: "r-07",
    name: "New device spike",
    description: "Creator's account used on >3 new devices in 7 days",
    threshold: ">3 devices / 7 days",
    triggeredCount: 143,
    enabled: true,
  },
  {
    id: "r-08",
    name: "High frequency scan",
    description: "Single QR code scanned >10 times by same user in 24h",
    threshold: ">10 scans / QR / day",
    triggeredCount: 77,
    enabled: true,
  },
  {
    id: "r-09",
    name: "Self-scan pattern",
    description: "Creator's account matches merchant owner's device ID",
    threshold: "Device ID match",
    triggeredCount: 29,
    enabled: true,
  },
  {
    id: "r-10",
    name: "Blacklisted device",
    description: "Device fingerprint is on the global fraud blocklist",
    threshold: "Blocklist match",
    triggeredCount: 44,
    enabled: true,
  },
];
