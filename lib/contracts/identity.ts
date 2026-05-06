/**
 * IDENTITY domain contracts. Audit § 6.
 *
 * Routes:
 *   - GET  /api/creator/profile          → CreatorProfile (private)
 *   - GET  /api/creator/public/{handle}  → CreatorPublicProfile
 *   - PATCH /api/creator/profile         → ProfileUpdate
 *   - GET  /api/creator/tier-progress    → TierProgress
 *   - GET  /api/creator/leaderboard?…    → LeaderboardSnapshot
 *   - GET  /api/creator/portfolio        → PortfolioList
 *   - GET  /api/creator/settings         → CreatorSettings
 *   - PATCH /api/creator/settings/notifications → NotificationPrefs
 */

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export type CreatorProfile = {
  id: string;
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  neighborhood: string;
  niches: string[];
  tier: CreatorTier;
  verifiedKyc: boolean;
  verifiedFtc: boolean;
  publicLinkUrl: string;
  socialLinks: {
    platform: "instagram" | "tiktok" | "spotify" | "threads";
    handle: string;
    followers: number;
  }[];
  joinedAtIso: string;
};

export type CreatorPublicProfile = Omit<
  CreatorProfile,
  "verifiedKyc" | "verifiedFtc"
> & {
  /** Public-facing rollups. */
  campaignsCompleted: number;
  avgPayoutCents: number;
  reachLifetime: number;
  featuredWork: {
    id: string;
    title: string;
    href: string;
    thumbnailUrl: string;
  }[];
};

export type ProfileUpdate = Pick<
  CreatorProfile,
  "displayName" | "bio" | "neighborhood" | "niches"
>;

/* ── Tier progression ─────────────────────────────────────── */

export type TierDimension = {
  key:
    | "completion-rate"
    | "scan-velocity"
    | "fan-repeat"
    | "merchant-rating"
    | "consistency";
  label: string;
  scoreOutOf100: number;
  /** Trend over last 30 days. */
  delta: number;
};

export type TierProgress = {
  currentTier: CreatorTier;
  scoreOutOf100: number;
  pointsToNextTier: number;
  nextTier: CreatorTier | null;
  dimensions: TierDimension[];
  history: { atIso: string; tier: CreatorTier; score: number }[];
};

/* ── Leaderboard ──────────────────────────────────────────── */

export type LeaderboardSnapshot = {
  neighborhood: string;
  periodIso: string;
  yourRank: number;
  cohortSize: number;
  /** Top 10 rows (anonymized except first names). */
  top: {
    rank: number;
    firstName: string;
    tier: CreatorTier;
    scoreOutOf100: number;
    /** True if this row is the requesting creator. */
    isMe: boolean;
  }[];
  /** Comparable peers near your rank. */
  nearby: {
    rank: number;
    firstName: string;
    tier: CreatorTier;
    scoreOutOf100: number;
    isMe: boolean;
  }[];
};

/* ── Portfolio ────────────────────────────────────────────── */

export type PortfolioPiece = {
  id: string;
  title: string;
  thumbnailUrl: string;
  campaignId: string | null;
  brand: string | null;
  publishedAtIso: string;
  reach: number;
  engagementRate: number;
  featured: boolean;
};

export type PortfolioList = {
  rows: PortfolioPiece[];
  featuredOrder: string[];
};

/* ── Settings ─────────────────────────────────────────────── */

export type CreatorSettings = {
  account: {
    email: string;
    emailVerified: boolean;
    phone: string | null;
    locale: string;
    timezone: string;
  };
  notifications: NotificationPrefs;
  privacy: {
    publicProfileVisible: boolean;
    leaderboardVisible: boolean;
    dataExportRequestedAtIso: string | null;
    dataExportReadyHref: string | null;
  };
};

export type NotificationPrefs = {
  emailDigestDaily: boolean;
  emailDigestWeekly: boolean;
  pushImminentShoot: boolean;
  pushPayoutReceived: boolean;
  pushBrandMessage: boolean;
  smsCriticalOnly: boolean;
};
