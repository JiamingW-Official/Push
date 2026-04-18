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

export type Database = {
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
        Update: {
          id?: string;
          role?: UserRole;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
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
        Insert: {
          id?: string;
          profile_id: string;
          slug: string;
          display_name: string;
          bio?: string | null;
          location_label?: string | null;
          lat?: number | null;
          lng?: number | null;
          instagram_handle?: string | null;
          instagram_followers?: number;
          tiktok_handle?: string | null;
          tiktok_followers?: number;
          tier?: CreatorTier;
          push_score?: number;
          score_updated_at?: string;
          campaigns_completed?: number;
          campaigns_accepted?: number;
          earnings_total_cents?: number;
          earnings_pending_cents?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          slug?: string;
          display_name?: string;
          bio?: string | null;
          location_label?: string | null;
          lat?: number | null;
          lng?: number | null;
          instagram_handle?: string | null;
          instagram_followers?: number;
          tiktok_handle?: string | null;
          tiktok_followers?: number;
          tier?: CreatorTier;
          push_score?: number;
          score_updated_at?: string;
          campaigns_completed?: number;
          campaigns_accepted?: number;
          earnings_total_cents?: number;
          earnings_pending_cents?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "creators_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
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
        Insert: {
          id?: string;
          profile_id: string;
          slug: string;
          business_name: string;
          category: string;
          business_address?: string | null;
          neighborhood?: string | null;
          lat?: number | null;
          lng?: number | null;
          logo_url?: string | null;
          website?: string | null;
          total_spent_cents?: number;
          active_campaigns_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          slug?: string;
          business_name?: string;
          category?: string;
          business_address?: string | null;
          neighborhood?: string | null;
          lat?: number | null;
          lng?: number | null;
          logo_url?: string | null;
          website?: string | null;
          total_spent_cents?: number;
          active_campaigns_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "merchants_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
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
        Insert: {
          id?: string;
          slug: string;
          merchant_id: string;
          title: string;
          description?: string | null;
          status?: CampaignStatus;
          offer_tier_1?: string | null;
          offer_tier_2?: string | null;
          hero_slots_total?: number;
          hero_slots_used?: number;
          budget_total_cents?: number;
          budget_remaining_cents?: number;
          reward_per_visit_cents?: number;
          max_creators?: number;
          accepted_creators_count?: number;
          tier_required?: CreatorTier;
          requirements?: Json | null;
          tags?: string[];
          lat?: number | null;
          lng?: number | null;
          image_url?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          merchant_id?: string;
          title?: string;
          description?: string | null;
          status?: CampaignStatus;
          offer_tier_1?: string | null;
          offer_tier_2?: string | null;
          hero_slots_total?: number;
          hero_slots_used?: number;
          budget_total_cents?: number;
          budget_remaining_cents?: number;
          reward_per_visit_cents?: number;
          max_creators?: number;
          accepted_creators_count?: number;
          tier_required?: CreatorTier;
          requirements?: Json | null;
          tags?: string[];
          lat?: number | null;
          lng?: number | null;
          image_url?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaigns_merchant_id_fkey";
            columns: ["merchant_id"];
            isOneToOne: false;
            referencedRelation: "merchants";
            referencedColumns: ["id"];
          },
        ];
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
        Insert: {
          id?: string;
          short_code: string;
          campaign_id: string;
          creator_id: string;
          scan_count?: number;
          verified_count?: number;
          conversion_count?: number;
          issued_at?: string;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          short_code?: string;
          campaign_id?: string;
          creator_id?: string;
          scan_count?: number;
          verified_count?: number;
          conversion_count?: number;
          issued_at?: string;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "qr_codes_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "qr_codes_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "creators";
            referencedColumns: ["id"];
          },
        ];
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
        Insert: {
          id?: string;
          qr_code_id: string;
          event_type: ScanEventType;
          campaign_id: string;
          creator_id: string;
          session_id: string;
          ip_hash?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          evidence_type?: string | null;
          evidence_url?: string | null;
          amount_cents?: number | null;
          offer_tier?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          qr_code_id?: string;
          event_type?: ScanEventType;
          campaign_id?: string;
          creator_id?: string;
          session_id?: string;
          ip_hash?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          evidence_type?: string | null;
          evidence_url?: string | null;
          amount_cents?: number | null;
          offer_tier?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "scans_qr_code_id_fkey";
            columns: ["qr_code_id"];
            isOneToOne: false;
            referencedRelation: "qr_codes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scans_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scans_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "creators";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      is_admin: {
        Args: Record<never, never>;
        Returns: boolean;
      };
      trigger_set_updated_at: {
        Args: Record<never, never>;
        Returns: unknown;
      };
    };
    Enums: {
      user_role: UserRole;
      creator_tier: CreatorTier;
      campaign_status: CampaignStatus;
      scan_event_type: ScanEventType;
    };
    CompositeTypes: Record<never, never>;
  };
};
