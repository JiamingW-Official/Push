// Push Platform — Global Type Definitions
// All modules import from here; never duplicate these types elsewhere.

export type DemoRole = "creator" | "merchant";

// ── Campaign ─────────────────────────────────────────────────────────────────

export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type Campaign = {
  id: string;
  merchant_id: string;
  title: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  budget_total: number;
  budget_remaining: number;
  reward_per_visit: number;
  max_creators: number;
  accepted_creators: number;
  status: CampaignStatus;
  start_date: string; // ISO date
  end_date: string;
  image_url?: string;
  tags: string[];
  created_at: string;
};

// ── Creator ───────────────────────────────────────────────────────────────────

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export type Creator = {
  id: string;
  user_id: string;
  name: string;
  instagram_handle: string;
  tiktok_handle?: string;
  location: string;
  lat: number;
  lng: number;
  bio: string;
  avatar_url: string;
  tier: CreatorTier;
  push_score: number;
  campaigns_completed: number;
  campaigns_accepted: number;
  earnings_total: number;
  earnings_pending: number;
  instagram_followers: number;
  tiktok_followers?: number;
  created_at: string;
};

// ── Merchant ──────────────────────────────────────────────────────────────────

export type Merchant = {
  id: string;
  user_id: string;
  business_name: string;
  category: string;
  location: string;
  lat: number;
  lng: number;
  logo_url?: string;
  website?: string;
  total_spent: number;
  active_campaigns: number;
  created_at: string;
};

// ── Application ───────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "withdrawn";

export type Application = {
  id: string;
  campaign_id: string;
  creator_id: string;
  status: ApplicationStatus;
  applied_at: string;
  reviewed_at?: string;
  note?: string;
};

// ── Payment ───────────────────────────────────────────────────────────────────

export type PaymentStatus = "pending" | "processing" | "paid" | "failed";

export type Payment = {
  id: string;
  campaign_id: string;
  creator_id: string;
  merchant_id: string;
  amount: number;
  status: PaymentStatus;
  milestone_id?: string;
  created_at: string;
  paid_at?: string;
};

// ── QR Code / Attribution ─────────────────────────────────────────────────────

export type QRCode = {
  id: string;
  campaign_id: string;
  creator_id: string;
  short_code: string;
  scan_count: number;
  verified_visits: number;
  created_at: string;
};

export type ScanEvent = {
  id: string;
  qr_id: string;
  scanned_at: string;
  ip_hash?: string;
  verified: boolean;
  evidence_url?: string;
};

// ── Milestone ─────────────────────────────────────────────────────────────────

export type MilestoneStatus = "locked" | "in_progress" | "completed" | "paid";

export type Milestone = {
  id: string;
  campaign_id: string;
  creator_id: string;
  label: string;
  target_visits: number;
  current_visits: number;
  reward: number;
  status: MilestoneStatus;
  completed_at?: string;
};

// ── API response wrappers ─────────────────────────────────────────────────────

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiError = { ok: false; error: string; status?: number };
export type ApiResult<T> = ApiSuccess<T> | ApiError;
