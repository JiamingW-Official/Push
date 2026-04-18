/**
 * Supabase-generated Database type stub.
 *
 * Regenerate after running migrations:
 *   supabase gen types typescript --local > lib/supabase/types.ts
 *
 * This stub is hand-maintained until the CLI is wired; it mirrors the v1
 * schema defined in supabase/migrations/20260417000000_schema_v1.sql so
 * that createClient<Database>() gets real type inference for the 6 tables.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "creator" | "merchant" | "admin";

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type ScanEventType = "scan" | "verify" | "conversion";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      creators: {
        Row: {
          id: string;
          profile_id: string;
          slug: string;
          display_name: string;
          bio: string | null;
          location_label: string | null;
          lat: number | null;
          lng: number | null;
          instagram_handle: string | null;
          instagram_followers: number;
          tiktok_handle: string | null;
          tiktok_followers: number;
          tier: CreatorTier;
          push_score: number;
          score_updated_at: string;
          campaigns_completed: number;
          campaigns_accepted: number;
          earnings_total_cents: number;
          earnings_pending_cents: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["creators"]["Row"],
          "id" | "created_at" | "updated_at" | "score_updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          score_updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["creators"]["Insert"]>;
      };

      merchants: {
        Row: {
          id: string;
          profile_id: string;
          slug: string;
          business_name: string;
          category: string;
          business_address: string | null;
          neighborhood: string | null;
          lat: number | null;
          lng: number | null;
          logo_url: string | null;
          website: string | null;
          total_spent_cents: number;
          active_campaigns_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["merchants"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["merchants"]["Insert"]>;
      };

      campaigns: {
        Row: {
          id: string;
          slug: string;
          merchant_id: string;
          title: string;
          description: string | null;
          status: CampaignStatus;
          offer_tier_1: string | null;
          offer_tier_2: string | null;
          hero_slots_total: number;
          hero_slots_used: number;
          budget_total_cents: number;
          budget_remaining_cents: number;
          reward_per_visit_cents: number;
          max_creators: number;
          accepted_creators_count: number;
          tier_required: CreatorTier;
          requirements: Json | null;
          tags: string[];
          lat: number | null;
          lng: number | null;
          image_url: string | null;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["campaigns"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["campaigns"]["Insert"]>;
      };

      qr_codes: {
        Row: {
          id: string;
          short_code: string;
          campaign_id: string;
          creator_id: string;
          scan_count: number;
          verified_count: number;
          conversion_count: number;
          issued_at: string;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["qr_codes"]["Row"],
          "id" | "created_at" | "updated_at" | "issued_at"
        > & {
          id?: string;
          issued_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["qr_codes"]["Insert"]>;
      };

      scans: {
        Row: {
          id: string;
          qr_code_id: string;
          event_type: ScanEventType;
          campaign_id: string;
          creator_id: string;
          session_id: string;
          ip_hash: string | null;
          user_agent: string | null;
          referrer: string | null;
          evidence_type: string | null;
          evidence_url: string | null;
          amount_cents: number | null;
          offer_tier: number | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["scans"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["scans"]["Insert"]>;
      };
    };
    Enums: {
      user_role: UserRole;
      creator_tier: CreatorTier;
      campaign_status: CampaignStatus;
      scan_event_type: ScanEventType;
    };
  };
}
