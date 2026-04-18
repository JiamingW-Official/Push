// Push Platform — Merchant Applicants Mock Data
// 80 applications across 15 campaigns for the Blank Street Coffee merchant demo.

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "shortlisted";

export type CreatorProfile = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  tier: CreatorTier;
  pushScore: number;
  followers: number;
  campaignsCompleted: number;
  conversionRate: number; // 0–1
  lastActive: string; // ISO date
};

export type MockApplication = {
  id: string;
  campaignId: string;
  campaignName: string;
  status: ApplicationStatus;
  matchScore: number; // 60–98
  coverLetter: string;
  sampleUrls: string[];
  appliedAt: string;
  creator: CreatorProfile;
};

// ---------------------------------------------------------------------------
// Campaigns reference (first 15 from merchant demo)
// ---------------------------------------------------------------------------

export const MERCHANT_CAMPAIGNS = [
  { id: "camp-001", name: "Free Latte for a 30-Second Reel" },
  { id: "camp-002", name: "Morning Rush Special Reel" },
  { id: "camp-003", name: "Holiday Blend Launch" },
  { id: "camp-004", name: "Saturday Brunch Vibes" },
  { id: "camp-005", name: "Cold Brew Summer Drop" },
  { id: "camp-006", name: "New Menu Taste Test" },
  { id: "camp-007", name: "SoHo Street Photography Series" },
  { id: "camp-008", name: "Barista Behind the Bar" },
  { id: "camp-009", name: "NYC Morning Ritual" },
  { id: "camp-010", name: "Latte Art Challenge" },
  { id: "camp-011", name: "Commuter Coffee Stories" },
  { id: "camp-012", name: "Blank Street x Local Artist" },
  { id: "camp-013", name: "Afternoon Slump Rescue" },
  { id: "camp-014", name: "Loyalty Perks Launch" },
  { id: "camp-015", name: "End-of-Day Wind-Down" },
];

// ---------------------------------------------------------------------------
// Helper seed data
// ---------------------------------------------------------------------------

const BIOS = [
  "NYC food & lifestyle creator. I document the city one block at a time.",
  "Coffee obsessed. Shoot for the gram, stay for the vibes.",
  "Micro-influencer focused on authentic NYC experiences and local gems.",
  "Reels creator. I make the ordinary look cinematic.",
  "Street food + coffee culture. Always hunting the next great shot.",
  "Visual storyteller. Brooklyn native, Manhattan regular.",
  "Lifestyle content creator with a focus on small businesses and community.",
  "Food photographer turned video creator. 60-second reels are my thing.",
  "Morning person. I find the best spots before 9am.",
  "Creator-for-hire. Specialise in authentic UGC for F&B brands.",
];

const COVER_LETTERS = [
  "I love Blank Street — it's my go-to before every shoot. I'd bring my usual cinematic style to this and give you a reel that actually converts.",
  "I've been following your brand for months. My audience is 80% NYC-based which makes this a perfect fit. Let me show you what I can do.",
  "I specialize in short-form coffee content and have worked with three other NYC cafes this quarter. My conversion rate speaks for itself.",
  "Your aesthetic matches my feed perfectly. I can turn this around within 48 hours of my visit and deliver exactly the brief.",
  "Blank Street was literally the setting for two of my top-performing reels last year. I know what your audience responds to.",
  "I focus on authenticity over production value. My audience trusts my recommendations and they click through. That's what you're paying for.",
  "I've built my following entirely in SoHo and the surrounding blocks. My audience literally walks past your door every morning.",
  "Straightforward pitch: I'm reliable, fast, and I know how to make a latte look like art. Let's do this.",
  "My content has been shared by @nycfoodiecentral twice this month. That reach transfers directly to campaigns like this.",
  "I shoot on Sony FX3 and edit same-day. Polished, professional, on-brand. Happy to share a portfolio walk-through.",
];

const SAMPLE_URLS = [
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1572097150138-cd3748a8b79b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1567189022257-bfe4ef7e2e53?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1531147646552-1elicensebce?w=400&h=400&fit=crop",
];

function pickSamples(seed: number): string[] {
  const a = seed % SAMPLE_URLS.length;
  const b = (seed + 3) % SAMPLE_URLS.length;
  const c = (seed + 6) % SAMPLE_URLS.length;
  return [SAMPLE_URLS[a], SAMPLE_URLS[b], SAMPLE_URLS[c]];
}

// ---------------------------------------------------------------------------
// Creator seed pool (25 unique creators, reused across campaigns)
// ---------------------------------------------------------------------------

type CreatorSeed = {
  name: string;
  handle: string;
  tier: CreatorTier;
  pushScore: number;
  followers: number;
  campaignsCompleted: number;
  conversionRate: number;
  lastActive: string;
};

const CREATOR_POOL: CreatorSeed[] = [
  {
    name: "Sofia Martinez",
    handle: "@sofiainyc",
    tier: "explorer",
    pushScore: 47,
    followers: 3100,
    campaignsCompleted: 4,
    conversionRate: 0.062,
    lastActive: "2026-04-15T08:30:00Z",
  },
  {
    name: "James Liu",
    handle: "@jamesliu.eats",
    tier: "operator",
    pushScore: 68,
    followers: 5800,
    campaignsCompleted: 11,
    conversionRate: 0.091,
    lastActive: "2026-04-16T10:00:00Z",
  },
  {
    name: "Alex Chen",
    handle: "@alexchen.nyc",
    tier: "operator",
    pushScore: 71,
    followers: 4200,
    campaignsCompleted: 9,
    conversionRate: 0.085,
    lastActive: "2026-04-14T14:20:00Z",
  },
  {
    name: "Rachel Kim",
    handle: "@rachelkimnyc",
    tier: "proven",
    pushScore: 79,
    followers: 12400,
    campaignsCompleted: 17,
    conversionRate: 0.112,
    lastActive: "2026-04-17T07:45:00Z",
  },
  {
    name: "Maya Johnson",
    handle: "@mayaj.creates",
    tier: "seed",
    pushScore: 31,
    followers: 890,
    campaignsCompleted: 1,
    conversionRate: 0.042,
    lastActive: "2026-04-12T16:00:00Z",
  },
  {
    name: "Tom Park",
    handle: "@tompark.nyc",
    tier: "explorer",
    pushScore: 52,
    followers: 2400,
    campaignsCompleted: 5,
    conversionRate: 0.071,
    lastActive: "2026-04-11T11:30:00Z",
  },
  {
    name: "Priya Nair",
    handle: "@priyacreates",
    tier: "proven",
    pushScore: 83,
    followers: 18900,
    campaignsCompleted: 22,
    conversionRate: 0.128,
    lastActive: "2026-04-17T09:10:00Z",
  },
  {
    name: "Derek Walsh",
    handle: "@derekwalsh.film",
    tier: "closer",
    pushScore: 88,
    followers: 31500,
    campaignsCompleted: 34,
    conversionRate: 0.151,
    lastActive: "2026-04-16T18:00:00Z",
  },
  {
    name: "Aisha Okonkwo",
    handle: "@aishanyc",
    tier: "operator",
    pushScore: 65,
    followers: 7200,
    campaignsCompleted: 12,
    conversionRate: 0.094,
    lastActive: "2026-04-15T20:00:00Z",
  },
  {
    name: "Luca Ferrara",
    handle: "@lucaferrara.co",
    tier: "explorer",
    pushScore: 55,
    followers: 3600,
    campaignsCompleted: 6,
    conversionRate: 0.078,
    lastActive: "2026-04-13T09:00:00Z",
  },
  {
    name: "Nina Brooks",
    handle: "@ninabrooks",
    tier: "seed",
    pushScore: 28,
    followers: 610,
    campaignsCompleted: 0,
    conversionRate: 0.031,
    lastActive: "2026-04-10T12:00:00Z",
  },
  {
    name: "Marcus Reed",
    handle: "@marcusreed.nyc",
    tier: "proven",
    pushScore: 77,
    followers: 14700,
    campaignsCompleted: 19,
    conversionRate: 0.118,
    lastActive: "2026-04-16T06:30:00Z",
  },
  {
    name: "Jasmine Wu",
    handle: "@jasminewu.eats",
    tier: "operator",
    pushScore: 63,
    followers: 6100,
    campaignsCompleted: 10,
    conversionRate: 0.089,
    lastActive: "2026-04-14T17:45:00Z",
  },
  {
    name: "Felix Huang",
    handle: "@felixhuang.vis",
    tier: "closer",
    pushScore: 91,
    followers: 44200,
    campaignsCompleted: 41,
    conversionRate: 0.162,
    lastActive: "2026-04-17T11:00:00Z",
  },
  {
    name: "Camille Dupont",
    handle: "@camillenyc",
    tier: "operator",
    pushScore: 72,
    followers: 8800,
    campaignsCompleted: 13,
    conversionRate: 0.097,
    lastActive: "2026-04-15T15:30:00Z",
  },
  {
    name: "Jordan Bell",
    handle: "@jbell.content",
    tier: "seed",
    pushScore: 36,
    followers: 1200,
    campaignsCompleted: 2,
    conversionRate: 0.048,
    lastActive: "2026-04-09T10:00:00Z",
  },
  {
    name: "Zara Ali",
    handle: "@zaraali.shoots",
    tier: "explorer",
    pushScore: 58,
    followers: 4400,
    campaignsCompleted: 7,
    conversionRate: 0.081,
    lastActive: "2026-04-13T13:00:00Z",
  },
  {
    name: "Ethan Moss",
    handle: "@ethanmoss.nyc",
    tier: "proven",
    pushScore: 80,
    followers: 16200,
    campaignsCompleted: 20,
    conversionRate: 0.122,
    lastActive: "2026-04-17T08:00:00Z",
  },
  {
    name: "Carmen Reyes",
    handle: "@carmenreyes.co",
    tier: "operator",
    pushScore: 67,
    followers: 5500,
    campaignsCompleted: 11,
    conversionRate: 0.092,
    lastActive: "2026-04-14T11:00:00Z",
  },
  {
    name: "Oliver Grant",
    handle: "@olivergrant",
    tier: "seed",
    pushScore: 24,
    followers: 430,
    campaignsCompleted: 0,
    conversionRate: 0.028,
    lastActive: "2026-04-08T14:00:00Z",
  },
  {
    name: "Stella Yoon",
    handle: "@stellayoon.vis",
    tier: "proven",
    pushScore: 82,
    followers: 21000,
    campaignsCompleted: 24,
    conversionRate: 0.134,
    lastActive: "2026-04-16T22:00:00Z",
  },
  {
    name: "Dante Rivers",
    handle: "@danterivers",
    tier: "closer",
    pushScore: 86,
    followers: 28700,
    campaignsCompleted: 31,
    conversionRate: 0.144,
    lastActive: "2026-04-17T07:00:00Z",
  },
  {
    name: "Hannah Lee",
    handle: "@hannahlee.eats",
    tier: "explorer",
    pushScore: 49,
    followers: 2900,
    campaignsCompleted: 5,
    conversionRate: 0.068,
    lastActive: "2026-04-11T16:00:00Z",
  },
  {
    name: "Noah Patel",
    handle: "@noahpatel.film",
    tier: "operator",
    pushScore: 70,
    followers: 9100,
    campaignsCompleted: 14,
    conversionRate: 0.101,
    lastActive: "2026-04-15T19:30:00Z",
  },
  {
    name: "Isabel Torres",
    handle: "@isabeltor.nyc",
    tier: "partner",
    pushScore: 96,
    followers: 87000,
    campaignsCompleted: 58,
    conversionRate: 0.191,
    lastActive: "2026-04-17T10:30:00Z",
  },
];

// ---------------------------------------------------------------------------
// Status distribution: 55% pending / 20% accepted / 15% declined / 10% shortlisted
// ---------------------------------------------------------------------------

function getStatus(index: number): ApplicationStatus {
  const n = index % 20;
  if (n < 11) return "pending"; // 55%
  if (n < 15) return "accepted"; // 20%
  if (n < 18) return "declined"; // 15%
  return "shortlisted"; // 10%
}

// ---------------------------------------------------------------------------
// Generate 80 applications
// ---------------------------------------------------------------------------

function generateApps(): MockApplication[] {
  const apps: MockApplication[] = [];
  let appIndex = 0;

  // Distribute across 15 campaigns, ~5-6 per campaign
  for (let c = 0; c < MERCHANT_CAMPAIGNS.length; c++) {
    const campaign = MERCHANT_CAMPAIGNS[c];
    const perCampaign = c < 5 ? 7 : 5; // first 5 campaigns get 7 each = 35, rest 5 each = 50 → 85, trim last

    for (let i = 0; i < perCampaign && apps.length < 80; i++) {
      const creatorSeed =
        CREATOR_POOL[(appIndex * 3 + c * 7 + i) % CREATOR_POOL.length];
      const bioIdx = (appIndex + c) % BIOS.length;
      const coverIdx = (appIndex + i) % COVER_LETTERS.length;
      const matchScore = 60 + ((appIndex * 17 + c * 13 + i * 7) % 39);
      const daysAgo = (appIndex * 3 + i + 1) % 14;
      const appliedAt = new Date(Date.now() - daysAgo * 86400000).toISOString();

      apps.push({
        id: `app-${String(appIndex + 1).padStart(3, "0")}`,
        campaignId: campaign.id,
        campaignName: campaign.name,
        status: getStatus(appIndex),
        matchScore,
        coverLetter: COVER_LETTERS[coverIdx],
        sampleUrls: pickSamples(appIndex + c),
        appliedAt,
        creator: {
          id: `creator-${String(((appIndex * 3 + c * 7 + i) % CREATOR_POOL.length) + 1).padStart(3, "0")}`,
          name: creatorSeed.name,
          handle: creatorSeed.handle,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(creatorSeed.name)}`,
          bio: BIOS[bioIdx],
          tier: creatorSeed.tier,
          pushScore: creatorSeed.pushScore,
          followers: creatorSeed.followers,
          campaignsCompleted: creatorSeed.campaignsCompleted,
          conversionRate: creatorSeed.conversionRate,
          lastActive: creatorSeed.lastActive,
        },
      });

      appIndex++;
    }
  }

  return apps;
}

export const MOCK_APPLICATIONS: MockApplication[] = generateApps();

export type ApplicantFilters = {
  campaignId?: string;
  tiers?: CreatorTier[];
  status?: ApplicationStatus[];
  sort?: "recent" | "score_desc" | "match_desc";
  search?: string;
  page?: number;
  limit?: number;
};

export function filterApplications(
  apps: MockApplication[],
  filters: ApplicantFilters,
): { data: MockApplication[]; total: number } {
  let result = [...apps];

  if (filters.campaignId) {
    result = result.filter((a) => a.campaignId === filters.campaignId);
  }
  if (filters.tiers && filters.tiers.length > 0) {
    result = result.filter((a) => filters.tiers!.includes(a.creator.tier));
  }
  if (filters.status && filters.status.length > 0) {
    result = result.filter((a) => filters.status!.includes(a.status));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.creator.name.toLowerCase().includes(q) ||
        a.creator.handle.toLowerCase().includes(q),
    );
  }

  // Sort
  const sort = filters.sort ?? "recent";
  if (sort === "recent") {
    result.sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
    );
  } else if (sort === "score_desc") {
    result.sort((a, b) => b.creator.pushScore - a.creator.pushScore);
  } else if (sort === "match_desc") {
    result.sort((a, b) => b.matchScore - a.matchScore);
  }

  const total = result.length;
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 25;
  result = result.slice((page - 1) * limit, page * limit);

  return { data: result, total };
}
