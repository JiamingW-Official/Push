/**
 * DISCOVER domain contracts. Audit § 6.
 *
 * Routes:
 *   - GET  /api/campaigns/browse?neighborhood&category&tier&page&sort → BrowsePage
 *   - GET  /api/campaigns/trending?tier&period                          → TrendingList
 *   - GET  /api/creator/invites?ranked                                  → InviteFeed
 *   - POST /api/creator/invites/{id}/accept                             → InviteOutcome
 *   - POST /api/creator/invites/{id}/decline                            → InviteOutcome
 *   - GET  /api/creator/wishlist                                         → WishlistList
 *   - POST /api/creator/wishlist                                         → WishlistAdd
 *   - DELETE /api/creator/wishlist/{id}                                  → WishlistRemove
 *   - GET  /api/creator/alerts                                           → AlertList
 *   - POST /api/creator/alerts                                           → AlertCreate
 */

import type { CreatorTier } from "./identity";

export type CampaignCategory =
  | "food-drink"
  | "fitness"
  | "beauty"
  | "wellness"
  | "retail"
  | "lifestyle";

export type CampaignSummary = {
  id: string;
  brand: string;
  brandInitial: string;
  title: string;
  category: CampaignCategory;
  neighborhood: string;
  /** ISO of campaign window end. */
  expiresAtIso: string;
  /** Geographic anchor for the map view. */
  lat: number;
  lng: number;
  /** Min tier required to apply. */
  tierFloor: CreatorTier;
  /** Spots remaining in the campaign cap. */
  spotsRemaining: number;
  /** Per-spot payouts. */
  guaranteedCents: number;
  targetCents: number;
  stretchCents: number;
};

export type BrowsePage = {
  rows: CampaignSummary[];
  hasMore: boolean;
  nextCursor: string | null;
  /** Aggregated counts by category for the filter UI. */
  facetsByCategory: Record<CampaignCategory, number>;
};

export type TrendingList = {
  /** Last 14 days vs the previous 14 days. */
  rising: CampaignSummary[];
  /** Same window — campaigns getting accepted fast. */
  hotInTier: CampaignSummary[];
};

/* ── Invites (inbound) ─────────────────────────────────────── */

export type InviteScore = {
  campaignId: string;
  /** 0-100 match. */
  matchScore: number;
  /** 3 grounding facts behind the score. */
  reasons: string[];
};

export type Invite = {
  id: string;
  campaign: CampaignSummary;
  matchScore: number;
  reasons: string[];
  /** ms timestamp. Page renders countdowns from this. */
  expiresAt: number;
  status: "pending" | "accepted" | "declined";
  receivedAtIso: string;
};

export type InviteFeed = {
  rows: Invite[];
  /** Top-3 ranked by matchScore. */
  topMatches: string[];
};

export type InviteOutcome = {
  inviteId: string;
  status: "accepted" | "declined";
  outcomeAtIso: string;
  /** When acceptance: the queue position into the merchant's review pool. */
  queuePosition: number | null;
};

/* ── Wishlist + Alerts ─────────────────────────────────────── */

export type WishlistEntry = {
  id: string;
  campaignId: string;
  brand: string;
  title: string;
  addedAtIso: string;
};

export type WishlistList = { rows: WishlistEntry[] };

export type WishlistAdd = { entryId: string };

export type WishlistRemove = { entryId: string };

export type CreatorAlert = {
  id: string;
  /** Subscription criteria. */
  criteria: {
    neighborhoods: string[];
    categories: CampaignCategory[];
    minPayoutCents: number;
    tierFloor: CreatorTier | null;
  };
  /** Frequency. */
  cadence: "instant" | "daily" | "weekly";
  /** Last fired ISO. */
  lastFiredAtIso: string | null;
};

export type AlertList = { rows: CreatorAlert[] };

export type AlertCreate = { alertId: string };
