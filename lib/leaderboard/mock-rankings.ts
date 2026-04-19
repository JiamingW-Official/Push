/* ============================================================
   Leaderboard Mock Data — 100 creators, 6 tiers, 3 time windows
   ============================================================ */

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export type TimeWindow = "7d" | "30d" | "all";

export type NeighborhoodKey =
  | "lower-east-side"
  | "williamsburg"
  | "astoria"
  | "harlem"
  | "park-slope"
  | "chelsea"
  | "bushwick"
  | "upper-west-side";

export interface RankEntry {
  rank: number;
  creatorId: string;
  name: string;
  handle: string;
  avatarInitials: string;
  tier: CreatorTier;
  pushScore: number;
  verifiedVisits: number;
  earningsWindow: number; // dollars
  deltaRank: number; // positive = moved up, negative = moved down
  neighborhood: NeighborhoodKey;
  isCurrentUser?: boolean;
}

export interface LeaderboardData {
  window: TimeWindow;
  generatedAt: string;
  totalCreators: number;
  entries: RankEntry[];
}

// ---------------------------------------------------------------------------
// Tier distribution: seed 30, explorer 25, operator 20, proven 13, closer 8, partner 4
// ---------------------------------------------------------------------------

const NAMES_AND_HANDLES: [string, string, string][] = [
  // [name, handle, initials]
  ["Jordan Park", "jordanparkcreates", "JP"],
  ["Mia Reyes", "miareyes.nyc", "MR"],
  ["Sam Okafor", "samokafor", "SO"],
  ["Zara Nguyen", "zaranguyen", "ZN"],
  ["Leo Castillo", "leocastillo", "LC"],
  ["Priya Shah", "priyashah.nyc", "PS"],
  ["Marcus Webb", "marcuswebb", "MW"],
  ["Aiko Tanaka", "aikotanaka", "AT"],
  ["Devon Brooks", "devonbrooks", "DB"],
  ["Chloe Martinez", "chloemartinez", "CM"],
  ["Alex Chen", "alexcheneats", "AC"],
  ["Nina Patel", "ninapatel", "NP"],
  ["Tyrell Jones", "tyrelljones", "TJ"],
  ["Sofia Andersson", "sofiaanderssonnyc", "SA"],
  ["Kai Washington", "kaiwashington", "KW"],
  ["Amara Obi", "amaraobi", "AO"],
  ["Ryo Kimura", "ryokimura", "RK"],
  ["Bianca Torres", "biancatorres", "BT"],
  ["Ethan Murphy", "ethanmurphy", "EM"],
  ["Lily Chen", "lilychenstyle", "LC"],
  ["Omar Hassan", "omarhassan", "OH"],
  ["Jade Williams", "jadewilliams", "JW"],
  ["Carlos Rivera", "carlosrivera", "CR"],
  ["Asha Gupta", "ashagupta", "AG"],
  ["Tyler Reed", "tylerreed", "TR"],
  ["Nadia Kovac", "nadiakovac", "NK"],
  ["Isaiah Powell", "isaiahpowell", "IP"],
  ["Mei Lin", "meilin.nyc", "ML"],
  ["Chase Coleman", "chasecoleman", "CC"],
  ["Fatima Al-Rashid", "fatimaalrashid", "FA"],
  ["Brennan Scott", "brennanscott", "BS"],
  ["Ingrid Larsen", "ingridlarsen", "IL"],
  ["Malik Thompson", "malikthompson", "MT"],
  ["Vera Sokolova", "verasokolova", "VS"],
  ["Elijah Davis", "elijahdavis", "ED"],
  ["Camille Dubois", "camelledubois", "CD"],
  ["Declan O'Brien", "declanobrien", "DO"],
  ["Yuna Kim", "yunakim", "YK"],
  ["Jasper Holland", "jasperholland", "JH"],
  ["Lena Wagner", "lenawagner", "LW"],
  ["Zion Adams", "zionadams", "ZA"],
  ["Hana Yoshida", "hanayoshida", "HY"],
  ["Owen Clark", "owenclark", "OC"],
  ["Simone Baptiste", "simonebaptiste", "SB"],
  ["Rohan Mehta", "rohanmehta", "RM"],
  ["Isla MacLeod", "islamacleod", "IM"],
  ["Dante Russo", "danterusso", "DR"],
  ["Kezia Abara", "keziaabara", "KA"],
  ["Flynn Carter", "flynncarter", "FC"],
  ["Yael Ben-David", "yaelbendavid", "YB"],
  ["Tre Jackson", "trejackson", "TJ"],
  ["Cora Nielsen", "coranielsen", "CN"],
  ["Jaxon Burns", "jaxonburns", "JB"],
  ["Adaeze Okonkwo", "adaezeokonkwo", "AO"],
  ["Rhys Evans", "rhysevans", "RE"],
  ["Lila Fontaine", "lilafontaine", "LF"],
  ["Kwame Asante", "kwameasante", "KA"],
  ["Piper Moore", "pipermoore", "PM"],
  ["Soren Berg", "sorenbereg", "SB"],
  ["Amira Khalil", "amirakhalil", "AK"],
  ["Beau Sinclair", "beausinclairnyc", "BS"],
  ["Tamsin Wolfe", "tamsinwolfe", "TW"],
  ["Nico Moretti", "nicomoretti", "NM"],
  ["Freya Lindqvist", "freyalindqvist", "FL"],
  ["Darius King", "dariusking", "DK"],
  ["Mako Inoue", "makoinoue", "MI"],
  ["Seun Adeyemi", "seunadeyemi", "SA"],
  ["Raven Cross", "ravencross", "RC"],
  ["Luca Ferrari", "lucaferrari", "LF"],
  ["Noa Weiss", "noaweiss", "NW"],
  ["Celeste Dubois", "celestedubois", "CD"],
  ["Amos Fitzgerald", "amosfitzgerald", "AF"],
  ["Yuki Sato", "yukisato", "YS"],
  ["Indira Reddy", "indirareddy", "IR"],
  ["Cyrus Rahimi", "cyrusrahimi", "CR"],
  ["Blanche Moreau", "blanchemoreau", "BM"],
  ["Tobias Gruber", "tobiasgruber", "TG"],
  ["Zuri Mensah", "zurimenshanyc", "ZM"],
  ["Ren Hayashi", "renhayashi", "RH"],
  ["Calypso James", "calypsojames", "CJ"],
  ["Dashiell Fox", "dashiellfox", "DF"],
  ["Asel Nurlanovna", "aselnurlanovna", "AN"],
  ["Cian Murphy", "cianmurphy", "CM"],
  ["Lior Ben-Ami", "liorbenmami", "LB"],
  ["Petra Novak", "petranovak", "PN"],
  ["Kofi Acheampong", "kofiacheampong", "KA"],
  ["Sasha Volkov", "sashavolkov", "SV"],
  ["Maeve O'Sullivan", "maeveosullivan", "MO"],
  ["Enzo Ricci", "enzoricci", "ER"],
  ["Fatoumata Diallo", "fatoumatadiallo", "FD"],
  ["Hugo Bergmann", "hugobergmann", "HB"],
  ["Linh Tran", "linhtran.nyc", "LT"],
  ["Obinna Eze", "obinnaeze", "OE"],
  ["Soraya Moradi", "sorayamoradi", "SM"],
  ["Callum Reid", "callumreid", "CR"],
  ["Xiomara Vega", "xiomaravega", "XV"],
  ["Emeka Osei", "emekaosei", "EO"],
  ["Talia Stern", "taliastern", "TS"],
];

const NEIGHBORHOODS: NeighborhoodKey[] = [
  "lower-east-side",
  "williamsburg",
  "astoria",
  "harlem",
  "park-slope",
  "chelsea",
  "bushwick",
  "upper-west-side",
];

const TIER_SEQUENCE: CreatorTier[] = [
  // 4 partner (rank 1-4)
  "partner",
  "partner",
  "partner",
  "partner",
  // 8 closer (rank 5-12)
  "closer",
  "closer",
  "closer",
  "closer",
  "closer",
  "closer",
  "closer",
  "closer",
  // 13 proven (rank 13-25)
  "proven",
  "proven",
  "proven",
  "proven",
  "proven",
  "proven",
  "proven",
  "proven",
  "proven",
  "proven",
  "proven",
  "proven",
  "proven",
  // 20 operator (rank 26-45)
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  // 25 explorer (rank 46-70)
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  "explorer",
  // 30 seed (rank 71-100)
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
  "seed",
];

function scoreForTier(tier: CreatorTier, rank: number): number {
  const base: Record<CreatorTier, [number, number]> = {
    partner: [95, 100],
    closer: [88, 95],
    proven: [75, 88],
    operator: [60, 75],
    explorer: [40, 60],
    seed: [10, 40],
  };
  const [min, max] = base[tier];
  // Higher rank = higher score within band
  const progress = 1 - (rank - 1) / 100;
  return Math.round(min + (max - min) * progress);
}

function visitsForTier(tier: CreatorTier, window: TimeWindow): number {
  const factor = window === "7d" ? 1 : window === "30d" ? 4.2 : 18;
  const base: Record<CreatorTier, number> = {
    partner: 22,
    closer: 14,
    proven: 9,
    operator: 5,
    explorer: 3,
    seed: 1,
  };
  return Math.round(base[tier] * factor * (0.8 + Math.random() * 0.4));
}

function earningsForTier(tier: CreatorTier, window: TimeWindow): number {
  const factor = window === "7d" ? 1 : window === "30d" ? 4 : 16;
  const base: Record<CreatorTier, number> = {
    partner: 420,
    closer: 210,
    proven: 95,
    operator: 45,
    explorer: 22,
    seed: 0,
  };
  return Math.round(base[tier] * factor * (0.75 + Math.random() * 0.5));
}

function deltaForRank(rank: number): number {
  // Top creators move less; mid-pack is volatile
  const maxDelta = rank <= 10 ? 3 : rank <= 30 ? 12 : 25;
  const sign = Math.random() > 0.45 ? 1 : -1;
  return sign * Math.round(Math.random() * maxDelta);
}

function buildEntries(window: TimeWindow): RankEntry[] {
  return NAMES_AND_HANDLES.map(([name, handle, initials], i) => {
    const rank = i + 1;
    const tier = TIER_SEQUENCE[i];
    const neighborhood = NEIGHBORHOODS[i % NEIGHBORHOODS.length];
    // Entry 10 (index 10) is the current user — Alex Chen
    const isCurrentUser = i === 10;

    return {
      rank,
      creatorId: `creator-${String(rank).padStart(3, "0")}`,
      name,
      handle,
      avatarInitials: initials,
      tier,
      pushScore: scoreForTier(tier, rank),
      verifiedVisits: visitsForTier(tier, window),
      earningsWindow: earningsForTier(tier, window),
      deltaRank: isCurrentUser ? -3 : deltaForRank(rank), // user moved down 3 for demo
      neighborhood,
      isCurrentUser,
    };
  });
}

// Pre-generate for each window (deterministic-ish with seeded Math.random is not possible
// in pure TS without a lib, so we just generate once at import time which is fine for mock)
export const MOCK_7D: LeaderboardData = {
  window: "7d",
  generatedAt: "2026-04-17T00:00:00Z",
  totalCreators: 2340,
  entries: buildEntries("7d"),
};

export const MOCK_30D: LeaderboardData = {
  window: "30d",
  generatedAt: "2026-04-17T00:00:00Z",
  totalCreators: 2340,
  entries: buildEntries("30d"),
};

export const MOCK_ALL: LeaderboardData = {
  window: "all",
  generatedAt: "2026-04-17T00:00:00Z",
  totalCreators: 2340,
  entries: buildEntries("all"),
};

export const MOCK_BY_WINDOW: Record<TimeWindow, LeaderboardData> = {
  "7d": MOCK_7D,
  "30d": MOCK_30D,
  all: MOCK_ALL,
};

export const NEIGHBORHOOD_LABELS: Record<NeighborhoodKey, string> = {
  "lower-east-side": "Lower East Side",
  williamsburg: "Williamsburg",
  astoria: "Astoria",
  harlem: "Harlem",
  "park-slope": "Park Slope",
  chelsea: "Chelsea",
  bushwick: "Bushwick",
  "upper-west-side": "Upper West Side",
};
