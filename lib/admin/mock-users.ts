// Push Admin — Mock User Data (100+ users, mixed roles and statuses)

export type UserRole = "creator" | "merchant" | "admin";
export type UserStatus = "active" | "suspended" | "banned" | "pending";
export type KYCStatus = "verified" | "pending" | "rejected" | "not_submitted";
export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export interface AdminUser {
  id: string;
  name: string;
  handle: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  kyc_status: KYCStatus;
  tier?: CreatorTier; // creators only
  joined_at: string;
  last_active: string;
  // stats
  campaigns_total: number;
  earnings_total: number;
  push_score: number;
  // account
  address?: string;
  business_name?: string; // merchants
  // activity
  activity: ActivityEvent[];
  campaigns: CampaignRef[];
  transactions: Transaction[];
  notes: AdminNote[];
  flags: FlagEvent[];
}

export interface ActivityEvent {
  id: string;
  type:
    | "login"
    | "campaign_apply"
    | "campaign_complete"
    | "payment"
    | "kyc"
    | "profile_update"
    | "suspension"
    | "signup";
  description: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface CampaignRef {
  id: string;
  title: string;
  merchant: string;
  status: "completed" | "active" | "rejected" | "pending";
  payout: number;
  date: string;
}

export interface Transaction {
  id: string;
  type: "payout" | "refund" | "bonus" | "deduction";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export interface AdminNote {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

export interface FlagEvent {
  id: string;
  type: "fraud" | "dispute" | "complaint" | "kyc_fail" | "policy_violation";
  severity: "low" | "medium" | "high";
  description: string;
  status: "open" | "resolved" | "dismissed";
  created_at: string;
}

// Helper to generate dates
function daysAgo(n: number): string {
  const d = new Date("2026-04-17");
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function hoursAgo(n: number): string {
  const d = new Date("2026-04-17T12:00:00Z");
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

// NYC neighborhood names for variety
const neighborhoods = [
  "SoHo",
  "Williamsburg",
  "Chelsea",
  "LES",
  "Astoria",
  "Bushwick",
  "Park Slope",
  "UWS",
  "Harlem",
  "DUMBO",
];

// --- Mock users ---
export const mockUsers: AdminUser[] = [
  {
    id: "usr_001",
    name: "Maya Chen",
    handle: "@mayachen",
    email: "maya@example.com",
    phone: "+1 (917) 555-0101",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "creator",
    status: "active",
    kyc_status: "verified",
    tier: "partner",
    joined_at: daysAgo(320),
    last_active: hoursAgo(2),
    campaigns_total: 48,
    earnings_total: 6240,
    push_score: 94,
    address: "Brooklyn, NY",
    activity: [
      {
        id: "a1",
        type: "campaign_complete",
        description: "Completed campaign: Procell Coffee",
        timestamp: hoursAgo(2),
        metadata: { payout: "$180" },
      },
      {
        id: "a2",
        type: "login",
        description: "Logged in",
        timestamp: hoursAgo(4),
      },
      {
        id: "a3",
        type: "payment",
        description: "Received payout $180",
        timestamp: daysAgo(1),
      },
    ],
    campaigns: [
      {
        id: "c1",
        title: "Procell Coffee Launch",
        merchant: "Procell Coffee",
        status: "completed",
        payout: 180,
        date: daysAgo(3),
      },
      {
        id: "c2",
        title: "Miso Ramen Pop-Up",
        merchant: "Miso Ramen NYC",
        status: "active",
        payout: 120,
        date: daysAgo(10),
      },
    ],
    transactions: [
      {
        id: "t1",
        type: "payout",
        amount: 180,
        description: "Campaign payout: Procell Coffee",
        date: daysAgo(1),
        status: "completed",
      },
      {
        id: "t2",
        type: "bonus",
        amount: 50,
        description: "Partner tier bonus",
        date: daysAgo(30),
        status: "completed",
      },
    ],
    notes: [
      {
        id: "n1",
        author: "Admin Alex",
        content: "Top performer in Q1. Eligible for partner program upgrade.",
        created_at: daysAgo(45),
      },
    ],
    flags: [],
  },
  {
    id: "usr_002",
    name: "Jordan Lee",
    handle: "@jordanlee",
    email: "jordan@example.com",
    phone: "+1 (646) 555-0202",
    avatar: "https://i.pravatar.cc/150?img=2",
    role: "creator",
    status: "active",
    kyc_status: "verified",
    tier: "closer",
    joined_at: daysAgo(210),
    last_active: hoursAgo(8),
    campaigns_total: 32,
    earnings_total: 3840,
    push_score: 87,
    address: "Manhattan, NY",
    activity: [
      {
        id: "a1",
        type: "campaign_apply",
        description: "Applied to: Sakura Ramen",
        timestamp: hoursAgo(8),
      },
      {
        id: "a2",
        type: "login",
        description: "Logged in",
        timestamp: hoursAgo(9),
      },
    ],
    campaigns: [
      {
        id: "c1",
        title: "Sakura Ramen",
        merchant: "Sakura NYC",
        status: "pending",
        payout: 100,
        date: daysAgo(1),
      },
    ],
    transactions: [
      {
        id: "t1",
        type: "payout",
        amount: 240,
        description: "Campaign payout batch",
        date: daysAgo(14),
        status: "completed",
      },
    ],
    notes: [],
    flags: [],
  },
  {
    id: "usr_003",
    name: "Aisha Williams",
    handle: "@aishawnyc",
    email: "aisha@example.com",
    phone: "+1 (718) 555-0303",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "creator",
    status: "suspended",
    kyc_status: "verified",
    tier: "operator",
    joined_at: daysAgo(180),
    last_active: daysAgo(15),
    campaigns_total: 18,
    earnings_total: 1440,
    push_score: 62,
    address: "Queens, NY",
    activity: [
      {
        id: "a1",
        type: "suspension",
        description: "Account suspended: policy violation",
        timestamp: daysAgo(15),
      },
      {
        id: "a2",
        type: "campaign_apply",
        description: "Applied to: Dumbo Coffee",
        timestamp: daysAgo(20),
      },
    ],
    campaigns: [],
    transactions: [
      {
        id: "t1",
        type: "deduction",
        amount: -80,
        description: "Chargeback: unverified visit",
        date: daysAgo(16),
        status: "completed",
      },
    ],
    notes: [
      {
        id: "n1",
        author: "Admin Sam",
        content:
          "Suspended for submitting duplicate proof photos. Review in 30 days.",
        created_at: daysAgo(15),
      },
    ],
    flags: [
      {
        id: "f1",
        type: "fraud",
        severity: "medium",
        description: "Submitted duplicate proof images from another creator",
        status: "open",
        created_at: daysAgo(15),
      },
    ],
  },
  {
    id: "usr_004",
    name: "Mateo Rivera",
    handle: "@mateo_nyc",
    email: "mateo@example.com",
    phone: "+1 (929) 555-0404",
    avatar: "https://i.pravatar.cc/150?img=4",
    role: "merchant",
    status: "active",
    kyc_status: "verified",
    joined_at: daysAgo(400),
    last_active: hoursAgo(6),
    campaigns_total: 12,
    earnings_total: 0,
    push_score: 0,
    business_name: "Mateo's Taqueria",
    address: "East Village, NY",
    activity: [
      {
        id: "a1",
        type: "campaign_complete",
        description: "Campaign completed: Taco Tuesday",
        timestamp: hoursAgo(6),
      },
    ],
    campaigns: [
      {
        id: "c1",
        title: "Taco Tuesday Promo",
        merchant: "Mateo's Taqueria",
        status: "active",
        payout: 80,
        date: daysAgo(5),
      },
    ],
    transactions: [],
    notes: [],
    flags: [],
  },
  {
    id: "usr_005",
    name: "Sarah Kim",
    handle: "@sarahkim",
    email: "sarah@example.com",
    phone: "+1 (212) 555-0505",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "creator",
    status: "active",
    kyc_status: "pending",
    tier: "explorer",
    joined_at: daysAgo(30),
    last_active: hoursAgo(1),
    campaigns_total: 3,
    earnings_total: 180,
    push_score: 55,
    address: "Flushing, NY",
    activity: [
      {
        id: "a1",
        type: "kyc",
        description: "KYC documents submitted",
        timestamp: daysAgo(2),
      },
      {
        id: "a2",
        type: "signup",
        description: "Account created",
        timestamp: daysAgo(30),
      },
    ],
    campaigns: [
      {
        id: "c1",
        title: "Korean BBQ Night",
        merchant: "Kang Ho Dong",
        status: "completed",
        payout: 60,
        date: daysAgo(14),
      },
    ],
    transactions: [
      {
        id: "t1",
        type: "payout",
        amount: 60,
        description: "First campaign payout",
        date: daysAgo(13),
        status: "completed",
      },
    ],
    notes: [],
    flags: [],
  },
  {
    id: "usr_006",
    name: "Admin Alex",
    handle: "@admin_alex",
    email: "alex@pushapp.io",
    phone: "+1 (212) 555-0606",
    avatar: "https://i.pravatar.cc/150?img=6",
    role: "admin",
    status: "active",
    kyc_status: "verified",
    joined_at: daysAgo(500),
    last_active: hoursAgo(1),
    campaigns_total: 0,
    earnings_total: 0,
    push_score: 100,
    activity: [
      {
        id: "a1",
        type: "login",
        description: "Admin login",
        timestamp: hoursAgo(1),
      },
    ],
    campaigns: [],
    transactions: [],
    notes: [],
    flags: [],
  },
];

// Generate 94 more users programmatically
const firstNames = [
  "Liam",
  "Emma",
  "Noah",
  "Olivia",
  "William",
  "Ava",
  "James",
  "Isabella",
  "Oliver",
  "Sophia",
  "Benjamin",
  "Mia",
  "Elijah",
  "Charlotte",
  "Lucas",
  "Amelia",
  "Mason",
  "Harper",
  "Logan",
  "Evelyn",
  "Alexander",
  "Abigail",
  "Ethan",
  "Emily",
  "Daniel",
  "Elizabeth",
  "Aiden",
  "Mila",
  "Henry",
  "Ella",
  "Michael",
  "Avery",
  "Jackson",
  "Sofia",
  "Sebastian",
  "Camila",
  "Jack",
  "Aria",
  "Amir",
  "Scarlett",
  "Owen",
  "Victoria",
  "Samuel",
  "Madison",
  "Dylan",
  "Luna",
  "David",
  "Grace",
  "Joseph",
  "Chloe",
  "Carter",
  "Penelope",
  "Wyatt",
  "Layla",
  "John",
  "Riley",
  "Luke",
  "Zoey",
  "Gabriel",
  "Nora",
  "Anthony",
  "Lily",
  "Isaac",
  "Eleanor",
  "Grayson",
  "Hannah",
  "Julian",
  "Lillian",
  "Levi",
  "Addison",
  "Christopher",
  "Aubrey",
  "Joshua",
  "Ellie",
  "Andrew",
  "Stella",
  "Lincoln",
  "Natalie",
  "Mateo",
  "Zoe",
  "Ryan",
  "Leah",
  "Nathan",
  "Hazel",
  "Aaron",
  "Violet",
  "Isaiah",
  "Aurora",
  "Thomas",
  "Savannah",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Wilson",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Moore",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Green",
  "Adams",
  "Baker",
  "Nelson",
  "Hill",
  "Ramirez",
  "Campbell",
  "Mitchell",
  "Roberts",
  "Carter",
  "Phillips",
  "Evans",
  "Turner",
  "Diaz",
  "Parker",
  "Cruz",
];
const tiers: CreatorTier[] = [
  "seed",
  "explorer",
  "operator",
  "proven",
  "closer",
  "partner",
];
const roles: UserRole[] = [
  "creator",
  "creator",
  "creator",
  "creator",
  "merchant",
  "merchant",
  "creator",
]; // weight toward creators
const statuses: UserStatus[] = [
  "active",
  "active",
  "active",
  "active",
  "active",
  "suspended",
  "pending",
];
const kycStatuses: KYCStatus[] = [
  "verified",
  "verified",
  "verified",
  "pending",
  "rejected",
  "not_submitted",
];

function generateUser(i: number): AdminUser {
  const seed = i * 17 + 3;
  const firstName = firstNames[seed % firstNames.length];
  const lastName = lastNames[(seed + 5) % lastNames.length];
  const name = `${firstName} ${lastName}`;
  const handle = `@${firstName.toLowerCase()}${lastName.toLowerCase().slice(0, 3)}${i}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
  const role = roles[seed % roles.length];
  const status = statuses[seed % statuses.length];
  const kyc = kycStatuses[(seed + 2) % kycStatuses.length];
  const tier = role === "creator" ? tiers[seed % tiers.length] : undefined;
  const daysJoined = 10 + (seed % 400);
  const lastActiveDays = seed % 20;
  const campaignsTotal = seed % 60;
  const earningsTotal = campaignsTotal * (40 + (seed % 120));
  const pushScore = 30 + (seed % 65);
  const neighborhood = neighborhoods[seed % neighborhoods.length];

  return {
    id: `usr_${String(i + 10).padStart(3, "0")}`,
    name,
    handle,
    email,
    phone: `+1 (${900 + (seed % 100)}) 555-${String(1000 + (seed % 9000)).slice(0, 4)}`,
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    role,
    status,
    kyc_status: kyc,
    tier,
    joined_at: daysAgo(daysJoined),
    last_active:
      lastActiveDays === 0 ? hoursAgo(seed % 12) : daysAgo(lastActiveDays),
    campaigns_total: campaignsTotal,
    earnings_total: role === "creator" ? earningsTotal : 0,
    push_score: role === "creator" ? pushScore : 0,
    address: `${neighborhood}, NY`,
    business_name:
      role === "merchant"
        ? `${lastName}'s ${["Cafe", "Bar", "Restaurant", "Kitchen", "Bistro"][seed % 5]}`
        : undefined,
    activity: [
      {
        id: `act_${i}_1`,
        type: "login",
        description: "User login",
        timestamp:
          lastActiveDays === 0 ? hoursAgo(seed % 12) : daysAgo(lastActiveDays),
      },
      ...(campaignsTotal > 0
        ? [
            {
              id: `act_${i}_2`,
              type: "campaign_apply" as const,
              description: `Applied to campaign #${(seed % 20) + 1}`,
              timestamp: daysAgo(lastActiveDays + 3),
            },
          ]
        : []),
    ],
    campaigns:
      campaignsTotal > 0
        ? [
            {
              id: `cmp_${i}`,
              title: `Campaign ${(seed % 30) + 1}`,
              merchant: `Merchant ${(seed % 20) + 1}`,
              status: "completed" as const,
              payout: 40 + (seed % 120),
              date: daysAgo(lastActiveDays + 5),
            },
          ]
        : [],
    transactions:
      earningsTotal > 0
        ? [
            {
              id: `txn_${i}`,
              type: "payout" as const,
              amount: 40 + (seed % 120),
              description: "Campaign payout",
              date: daysAgo(lastActiveDays + 5),
              status: "completed" as const,
            },
          ]
        : [],
    notes: [],
    flags:
      status === "suspended"
        ? [
            {
              id: `flag_${i}`,
              type: "complaint" as const,
              severity: "low" as const,
              description: "Account under review",
              status: "open" as const,
              created_at: daysAgo(lastActiveDays),
            },
          ]
        : [],
  };
}

for (let i = 0; i < 94; i++) {
  mockUsers.push(generateUser(i));
}

// Derived helpers
export function getUsers(filters?: {
  role?: UserRole | "all";
  status?: UserStatus | "all";
  kyc?: KYCStatus | "all";
  search?: string;
  tab?: string;
}): AdminUser[] {
  let users = [...mockUsers];

  if (filters?.tab && filters.tab !== "all") {
    if (filters.tab === "suspended") {
      users = users.filter(
        (u) => u.status === "suspended" || u.status === "banned",
      );
    } else {
      users = users.filter((u) => u.role === filters.tab);
    }
  }

  if (filters?.kyc && filters.kyc !== "all") {
    users = users.filter((u) => u.kyc_status === filters.kyc);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.handle.toLowerCase().includes(q),
    );
  }

  return users;
}

export function getUserById(id: string): AdminUser | undefined {
  return mockUsers.find((u) => u.id === id);
}

export const userStats = {
  total: mockUsers.length,
  todayJoined: mockUsers.filter((u) => {
    const today = new Date("2026-04-17");
    const joined = new Date(u.joined_at);
    return joined.toDateString() === today.toDateString();
  }).length,
  creators: mockUsers.filter((u) => u.role === "creator").length,
  merchants: mockUsers.filter((u) => u.role === "merchant").length,
  admins: mockUsers.filter((u) => u.role === "admin").length,
  suspended: mockUsers.filter(
    (u) => u.status === "suspended" || u.status === "banned",
  ).length,
};
