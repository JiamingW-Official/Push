/* ─────────────────────────────────────────────────────────────────────
 * Shared types for the v2 creator Home dashboard
 *
 * Repo target: components/creator/dashboard/types.ts
 * Mirrors the field shape already used in app/(creator)/creator/dashboard/page.tsx
 * (the v3 monolith). When the time comes, prune the v3 page's local copies
 * and import from here.
 * ───────────────────────────────────────────────────────────────────── */

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export interface Creator {
  id: string;
  name: string;
  instagram_handle?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  tier: CreatorTier;
  push_score: number;
  campaigns_completed: number;
  campaigns_accepted: number;
  earnings_total: number;
  earnings_pending: number;
  instagram_followers?: number;
}

export interface Campaign {
  id: string;
  title: string;
  business_name: string;
  business_address?: string;
  payout: number;
  spots_remaining: number;
  spots_total: number;
  deadline?: string | null;
  category?: string;
  image?: string;
  tier_required: CreatorTier;
  description?: string;
  requirements?: string[];
  lat: number;
  lng: number;
}

export type Milestone =
  | "accepted"
  | "scheduled"
  | "visited"
  | "proof_submitted"
  | "content_published"
  | "verified"
  | "settled";

export interface Application {
  id: string;
  campaign_id: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  milestone: Milestone;
  payout: number;
  created_at: string;
  campaign_title: string;
  merchant_name: string;
  deadline?: string;
  category?: string;
}

export interface Payout {
  id: string;
  campaign_title: string;
  merchant_name: string;
  amount: number;
  commission_amount: number;
  payout_type: "base" | "commission" | "bonus";
  status: "completed" | "pending" | "processing";
  paid_at: string | null;
  created_at: string;
}

export interface InboxThread {
  id: string;
  sender_name: string;
  sender_initial: string;
  preview: string;
  unread: boolean;
  created_at: string;
}

/* Activity = unified timeline entry derived from applications + payouts */
export type ActivityKind =
  | "payout_settled"
  | "proof_verified"
  | "invite_received"
  | "awaiting_verification"
  | "tier_nudge"
  | "system";

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  title: string;
  meta: string;        // pre-formatted "MERCHANT · TIME-AGO"
  timestamp: string;   // ISO
}

/* The lifecycle stage drives state-aware widget content */
export type LifecycleStage = "day_0_7" | "day_7_30" | "day_30_90" | "day_90_plus";
