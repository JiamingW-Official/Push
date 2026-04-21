export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export type Creator = {
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
};

export type Campaign = {
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
};

export type Application = {
  id: string;
  campaign_id: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  milestone:
    | "accepted"
    | "scheduled"
    | "visited"
    | "proof_submitted"
    | "content_published"
    | "verified"
    | "settled";
  payout: number;
  created_at: string;
  campaign_title: string;
  merchant_name: string;
  deadline?: string;
  category?: string;
};

export type Payout = {
  id: string;
  campaign_title: string;
  merchant_name: string;
  amount: number;
  commission_amount: number;
  payout_type: "base" | "commission" | "bonus";
  status: "completed" | "pending" | "processing";
  paid_at: string | null;
  created_at: string;
};

export type DashView = "discover" | "campaigns" | "earnings";

export type SortKey = "newest" | "highest-pay" | "ending-soon" | "most-spots";
