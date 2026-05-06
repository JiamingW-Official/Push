/**
 * TODAY domain contracts. Audit § 6.
 *
 * /today is composite — pulls digests from the other 6 domains. The
 * /api/creator/briefing route should return TodayBriefing, which is
 * just a thin envelope that lets the page render the hero + pulse +
 * action queue + recap without 6 round-trips.
 *
 * Routes:
 *   - GET /api/creator/briefing → TodayBriefing
 */

import type { Invite } from "./discover";
import type { Notification } from "./comms";
import type { Gig } from "./work";
import type { MoneyHubDigest } from "./money";

export type AttributionEvent = {
  id: string;
  campaignId: string;
  brand: string;
  occurredAtIso: string;
  status: "pending" | "verified" | "rejected";
  payoutDeltaCents: number;
};

export type ActionQueueItem = {
  id: string;
  /** What the creator should do next. */
  copy: string;
  /** Tag for routing the click. */
  kind:
    | "accept-invite"
    | "decline-invite"
    | "post-content"
    | "verify-scan"
    | "fix-disclosure"
    | "respond-message";
  /** Where the action button drills to. */
  href: string;
  /** Higher = more urgent. Sort key for the queue. */
  urgency: number;
};

export type YesterdayRecap = {
  scansVerified: number;
  payoutCents: number;
  threadsResponded: number;
  weeklyBonusOnTrack: boolean;
};

export type TodayBriefing = {
  /** ISO datetime of when this briefing was synthesized. */
  generatedAtIso: string;
  /** Composite headline copy for the hero. */
  heroLine: string;
  pulse: {
    openInvites: number;
    activeCampaigns: number;
    weekScans: number;
    urgentInvites: number;
  };
  actionQueue: ActionQueueItem[];
  attributionEvents: AttributionEvent[];
  yesterday: YesterdayRecap;
  upcomingInvites: Invite[];
  unreadNotifications: Notification[];
  activeGigs: Gig[];
  money: MoneyHubDigest;
};
