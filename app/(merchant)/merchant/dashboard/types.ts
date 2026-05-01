export type CreatorTier =
  | 'seed'
  | 'explorer'
  | 'operator'
  | 'proven'
  | 'closer'
  | 'partner';

export type Milestone =
  | 'accepted'
  | 'scheduled'
  | 'visited'
  | 'proof_submitted'
  | 'content_published'
  | 'verified'
  | 'settled';

export type Merchant = {
  id: string;
  user_id: string;
  business_name: string;
  address: string;
  contact_email: string;
  instagram?: string;
  plan?: 'starter' | 'growth' | 'pro';
};

export type Campaign = {
  id: string;
  merchant_id?: string;
  title: string;
  description: string | null;
  category?: string;
  payout: number;
  spots_total: number;
  spots_remaining: number;
  deadline: string | null;
  status: 'draft' | 'active' | 'paused' | 'closed';
  created_at: string;
  applications_count?: number;
  qr_scans?: number;
  attributed_revenue?: number;
};

export type Application = {
  id: string;
  campaign_id: string;
  campaign_title: string;
  creator_name: string;
  creator_handle: string;
  creator_tier: CreatorTier;
  creator_score: number;
  creator_avatar: string;
  creator_followers: number;
  status: 'pending' | 'accepted' | 'rejected';
  milestone: Milestone;
  proof_url?: string;
  content_url?: string;
  applied_at: string;
  merchant_rating?: number;
};

export type Analytics = {
  qr_scans_month: number;
  qr_scans_delta: number;
  new_customers: number;
  active_creators: number;
  total_spend: number;
  estimated_revenue: number;
  roi_multiple: number;
};
