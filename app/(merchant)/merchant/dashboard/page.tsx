"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import "./dashboard.css";

/* ── Demo mode ───────────────────────────────────────────── */
function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=merchant");
}

/* ── Types ───────────────────────────────────────────────── */
type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";
type Milestone =
  | "accepted"
  | "scheduled"
  | "visited"
  | "proof_submitted"
  | "content_published"
  | "verified"
  | "settled";

type Merchant = {
  id: string;
  user_id: string;
  business_name: string;
  address: string;
  contact_email: string;
  instagram?: string;
  plan?: "starter" | "growth" | "pro";
};

type Campaign = {
  id: string;
  merchant_id?: string;
  title: string;
  description: string | null;
  category?: string;
  payout: number;
  spots_total: number;
  spots_remaining: number;
  deadline: string | null;
  status: "draft" | "active" | "paused" | "closed";
  created_at: string;
  applications_count?: number;
  budget_total?: number;
  budget_spent?: number;
  qr_scans?: number;
  attributed_revenue?: number;
  tier_required?: CreatorTier;
};

type Application = {
  id: string;
  campaign_id: string;
  campaign_title: string;
  creator_name: string;
  creator_handle: string;
  creator_tier: CreatorTier;
  creator_score: number;
  creator_avatar: string;
  creator_followers: number;
  status: "pending" | "accepted" | "rejected";
  milestone: Milestone;
  proof_url?: string;
  content_url?: string;
  applied_at: string;
  merchant_rating?: number;
};

type Analytics = {
  qr_scans_month: number;
  qr_scans_delta: number;
  new_customers: number;
  active_creators: number;
  total_spend: number;
  estimated_revenue: number;
  roi_multiple: number;
};

type SidebarTab =
  | "campaigns"
  | "applications"
  | "analytics"
  | "payments"
  | "settings";
type AppFilter = "all" | "pending" | "active" | "done";

/* ── Demo data ───────────────────────────────────────────── */
const DEMO_MERCHANT: Merchant = {
  id: "demo-merchant-001",
  user_id: "demo-merchant-user-001",
  business_name: "Blank Street Coffee — SoHo",
  address: "284 W Broadway, New York, NY 10013",
  contact_email: "ops@blankstreetcoffee.com",
  instagram: "@blankstreetcoffee",
  plan: "growth",
};

const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: "mc-001",
    title: "Free Latte for a 30-Second Reel",
    description:
      "Come in, order any latte, and capture a 30-second Reel showing your experience — from ordering to that first sip.",
    category: "Food & Drink",
    payout: 0,
    spots_total: 12,
    spots_remaining: 4,
    deadline: "2026-04-25T23:59:00Z",
    created_at: "2026-04-01T10:00:00Z",
    status: "active",
    applications_count: 8,
    budget_total: 0,
    budget_spent: 0,
    qr_scans: 68,
    attributed_revenue: 920,
    tier_required: "seed",
  },
  {
    id: "mc-002",
    title: "Morning Rush — 7am to 9am",
    description:
      "Capture the Blank Street morning rush. The queue, the baristas, the ritual. Real NYC energy.",
    category: "Food & Drink",
    payout: 65,
    spots_total: 5,
    spots_remaining: 2,
    deadline: "2026-04-28T23:59:00Z",
    created_at: "2026-04-05T08:00:00Z",
    status: "active",
    applications_count: 3,
    budget_total: 325,
    budget_spent: 195,
    qr_scans: 34,
    attributed_revenue: 1420,
    tier_required: "explorer",
  },
  {
    id: "mc-003",
    title: "Spring Seasonal Menu Launch",
    description:
      "We're launching our spring menu — matcha cold brew, lavender latte, and strawberry scones. Be first.",
    category: "Food & Drink",
    payout: 45,
    spots_total: 8,
    spots_remaining: 6,
    deadline: "2026-05-05T23:59:00Z",
    created_at: "2026-04-10T09:00:00Z",
    status: "active",
    applications_count: 2,
    budget_total: 360,
    budget_spent: 90,
    qr_scans: 12,
    attributed_revenue: 340,
    tier_required: "seed",
  },
  {
    id: "mc-004",
    title: "SoHo Flagship — Interior Shoot",
    description:
      "Editorial interior photography of our redesigned SoHo flagship. Aesthetic-forward, brand-aligned content only.",
    category: "Lifestyle",
    payout: 120,
    spots_total: 3,
    spots_remaining: 1,
    deadline: "2026-05-10T23:59:00Z",
    created_at: "2026-04-08T11:00:00Z",
    status: "active",
    applications_count: 6,
    budget_total: 360,
    budget_spent: 240,
    qr_scans: 22,
    attributed_revenue: 2100,
    tier_required: "operator",
  },
  {
    id: "mc-005",
    title: "Loyalty App Feature Series",
    description:
      "Showcase the new Blank Street loyalty app in an authentic how-it-works Reel.",
    category: "Tech",
    payout: 80,
    spots_total: 6,
    spots_remaining: 6,
    deadline: "2026-05-15T23:59:00Z",
    created_at: "2026-04-12T14:00:00Z",
    status: "draft",
    applications_count: 0,
    budget_total: 480,
    budget_spent: 0,
    qr_scans: 0,
    attributed_revenue: 0,
    tier_required: "explorer",
  },
  {
    id: "mc-006",
    title: "Holiday Blend Launch",
    description:
      "Cover our seasonal holiday blend launch — the ritual, the packaging, the first pour.",
    category: "Food & Drink",
    payout: 30,
    spots_total: 8,
    spots_remaining: 0,
    deadline: "2026-03-15T23:59:00Z",
    created_at: "2026-02-28T10:00:00Z",
    status: "closed",
    applications_count: 8,
    budget_total: 240,
    budget_spent: 240,
    qr_scans: 81,
    attributed_revenue: 2640,
    tier_required: "seed",
  },
  {
    id: "mc-007",
    title: "Valentine's Day Campaign",
    description:
      "Limited edition Valentine's drinks — capture the moment, the vibe, the couple-friendly atmosphere.",
    category: "Food & Drink",
    payout: 55,
    spots_total: 10,
    spots_remaining: 0,
    deadline: "2026-02-14T23:59:00Z",
    created_at: "2026-01-28T10:00:00Z",
    status: "closed",
    applications_count: 10,
    budget_total: 550,
    budget_spent: 550,
    qr_scans: 114,
    attributed_revenue: 3800,
    tier_required: "explorer",
  },
  {
    id: "mc-008",
    title: "Barista Spotlight Series",
    description:
      "Behind-the-scenes with our baristas. Their craft, their stories, their morning ritual.",
    category: "Human Interest",
    payout: 35,
    spots_total: 4,
    spots_remaining: 2,
    deadline: "2026-04-30T23:59:00Z",
    created_at: "2026-04-07T10:00:00Z",
    status: "paused",
    applications_count: 2,
    budget_total: 140,
    budget_spent: 70,
    qr_scans: 8,
    attributed_revenue: 320,
    tier_required: "seed",
  },
  {
    id: "mc-009",
    title: "Cold Brew Summer Kickoff",
    description:
      "Summer is here. Show how Blank Street cold brew fits your NYC summer routine.",
    category: "Food & Drink",
    payout: 40,
    spots_total: 15,
    spots_remaining: 15,
    deadline: "2026-06-01T23:59:00Z",
    created_at: "2026-04-14T08:00:00Z",
    status: "draft",
    applications_count: 0,
    budget_total: 600,
    budget_spent: 0,
    qr_scans: 0,
    attributed_revenue: 0,
    tier_required: "seed",
  },
  {
    id: "mc-010",
    title: "NYC Marathon Fuel Partner",
    description:
      "Official content for our NYC Marathon partnership. Athletes, energy, Blank Street on the route.",
    category: "Sports",
    payout: 150,
    spots_total: 4,
    spots_remaining: 4,
    deadline: "2026-11-01T23:59:00Z",
    created_at: "2026-04-13T15:00:00Z",
    status: "draft",
    applications_count: 0,
    budget_total: 600,
    budget_spent: 0,
    qr_scans: 0,
    attributed_revenue: 0,
    tier_required: "proven",
  },
  {
    id: "mc-011",
    title: "Oat Milk Alternative Launch",
    description:
      "Oat milk gets a redesign — new formula, same ritual. Showcase the upgrade.",
    category: "Food & Drink",
    payout: 25,
    spots_total: 10,
    spots_remaining: 0,
    deadline: "2026-03-31T23:59:00Z",
    created_at: "2026-03-10T09:00:00Z",
    status: "closed",
    applications_count: 10,
    budget_total: 250,
    budget_spent: 250,
    qr_scans: 56,
    attributed_revenue: 1480,
    tier_required: "seed",
  },
  {
    id: "mc-012",
    title: "Williamsburg Pop-Up Opening",
    description:
      "We're opening in Williamsburg. Be there for day one. Document the launch.",
    category: "Events",
    payout: 95,
    spots_total: 6,
    spots_remaining: 2,
    deadline: "2026-05-01T23:59:00Z",
    created_at: "2026-04-09T11:00:00Z",
    status: "active",
    applications_count: 4,
    budget_total: 570,
    budget_spent: 285,
    qr_scans: 18,
    attributed_revenue: 890,
    tier_required: "operator",
  },
  {
    id: "mc-013",
    title: "Work From Blank Street",
    description:
      "The laptop-and-latte lifestyle — showcase Blank Street as your remote office for the day.",
    category: "Lifestyle",
    payout: 20,
    spots_total: 20,
    spots_remaining: 12,
    deadline: "2026-05-20T23:59:00Z",
    created_at: "2026-04-11T10:00:00Z",
    status: "active",
    applications_count: 8,
    budget_total: 400,
    budget_spent: 160,
    qr_scans: 29,
    attributed_revenue: 680,
    tier_required: "seed",
  },
  {
    id: "mc-014",
    title: "Sustainable Cup Initiative",
    description:
      "Highlight our reusable cup program. 20% off every visit with your own cup.",
    category: "Sustainability",
    payout: 30,
    spots_total: 8,
    spots_remaining: 5,
    deadline: "2026-05-25T23:59:00Z",
    created_at: "2026-04-13T13:00:00Z",
    status: "active",
    applications_count: 3,
    budget_total: 240,
    budget_spent: 90,
    qr_scans: 14,
    attributed_revenue: 420,
    tier_required: "seed",
  },
  {
    id: "mc-015",
    title: "Partner Creator Collab — Spring",
    description:
      "Top-tier partnership. Co-create a 3-part content series for our Spring 2026 brand refresh.",
    category: "Brand Partnership",
    payout: 350,
    spots_total: 2,
    spots_remaining: 2,
    deadline: "2026-06-15T23:59:00Z",
    created_at: "2026-04-14T16:00:00Z",
    status: "draft",
    applications_count: 0,
    budget_total: 700,
    budget_spent: 0,
    qr_scans: 0,
    attributed_revenue: 0,
    tier_required: "partner",
  },
];

const DEMO_APPLICATIONS: Application[] = [
  {
    id: "app-001",
    campaign_id: "mc-001",
    campaign_title: "Free Latte for a 30-Second Reel",
    creator_name: "Sofia Martinez",
    creator_handle: "@sofiainyc",
    creator_tier: "explorer",
    creator_score: 47,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=SofiaMartinez",
    creator_followers: 3100,
    status: "accepted",
    milestone: "proof_submitted",
    proof_url: "https://www.instagram.com/reel/demo-proof-1",
    applied_at: "2026-04-08T10:20:00Z",
  },
  {
    id: "app-002",
    campaign_id: "mc-001",
    campaign_title: "Free Latte for a 30-Second Reel",
    creator_name: "James Liu",
    creator_handle: "@jamesliu.eats",
    creator_tier: "operator",
    creator_score: 68,
    creator_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JamesLiu",
    creator_followers: 5800,
    status: "accepted",
    milestone: "settled",
    content_url: "https://www.instagram.com/reel/demo-content-2",
    applied_at: "2026-04-06T14:10:00Z",
    merchant_rating: 5,
  },
  {
    id: "app-003",
    campaign_id: "mc-001",
    campaign_title: "Free Latte for a 30-Second Reel",
    creator_name: "Alex Chen",
    creator_handle: "@alexchen.nyc",
    creator_tier: "operator",
    creator_score: 71,
    creator_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexChen",
    creator_followers: 4200,
    status: "accepted",
    milestone: "accepted",
    applied_at: "2026-04-10T09:15:00Z",
  },
  {
    id: "app-004",
    campaign_id: "mc-001",
    campaign_title: "Free Latte for a 30-Second Reel",
    creator_name: "Tom Park",
    creator_handle: "@tompark.nyc",
    creator_tier: "explorer",
    creator_score: 52,
    creator_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TomPark",
    creator_followers: 2400,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-11T16:45:00Z",
  },
  {
    id: "app-005",
    campaign_id: "mc-002",
    campaign_title: "Morning Rush — 7am to 9am",
    creator_name: "Rachel Kim",
    creator_handle: "@rachelkimnyc",
    creator_tier: "proven",
    creator_score: 79,
    creator_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RachelKim",
    creator_followers: 12400,
    status: "accepted",
    milestone: "content_published",
    content_url: "https://www.instagram.com/reel/demo-content-5",
    applied_at: "2026-04-07T08:30:00Z",
  },
  {
    id: "app-006",
    campaign_id: "mc-002",
    campaign_title: "Morning Rush — 7am to 9am",
    creator_name: "Maya Johnson",
    creator_handle: "@mayaj.creates",
    creator_tier: "seed",
    creator_score: 31,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=MayaJohnson",
    creator_followers: 890,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-11T11:00:00Z",
  },
  {
    id: "app-007",
    campaign_id: "mc-002",
    campaign_title: "Morning Rush — 7am to 9am",
    creator_name: "Lena Okafor",
    creator_handle: "@lena.okafor",
    creator_tier: "operator",
    creator_score: 66,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=LenaOkafor",
    creator_followers: 4700,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-12T09:00:00Z",
  },
  {
    id: "app-008",
    campaign_id: "mc-003",
    campaign_title: "Spring Seasonal Menu Launch",
    creator_name: "Marco Benedetti",
    creator_handle: "@marcoben.nyc",
    creator_tier: "explorer",
    creator_score: 44,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=MarcoBenedetti",
    creator_followers: 2100,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-13T14:30:00Z",
  },
  {
    id: "app-009",
    campaign_id: "mc-004",
    campaign_title: "SoHo Flagship — Interior Shoot",
    creator_name: "Priya Sharma",
    creator_handle: "@priya.creates",
    creator_tier: "proven",
    creator_score: 82,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma",
    creator_followers: 18600,
    status: "accepted",
    milestone: "visited",
    applied_at: "2026-04-09T10:00:00Z",
  },
  {
    id: "app-010",
    campaign_id: "mc-004",
    campaign_title: "SoHo Flagship — Interior Shoot",
    creator_name: "Jordan Reed",
    creator_handle: "@jordanreedphoto",
    creator_tier: "closer",
    creator_score: 91,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=JordanReed",
    creator_followers: 54000,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-10T15:20:00Z",
  },
  {
    id: "app-011",
    campaign_id: "mc-012",
    campaign_title: "Williamsburg Pop-Up Opening",
    creator_name: "Nina Volkov",
    creator_handle: "@ninavolkov",
    creator_tier: "operator",
    creator_score: 73,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=NinaVolkov",
    creator_followers: 6200,
    status: "accepted",
    milestone: "scheduled",
    applied_at: "2026-04-10T13:00:00Z",
  },
  {
    id: "app-012",
    campaign_id: "mc-012",
    campaign_title: "Williamsburg Pop-Up Opening",
    creator_name: "Caleb Torres",
    creator_handle: "@calebtorres.film",
    creator_tier: "proven",
    creator_score: 77,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=CalebTorres",
    creator_followers: 14800,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-11T10:45:00Z",
  },
  {
    id: "app-013",
    campaign_id: "mc-013",
    campaign_title: "Work From Blank Street",
    creator_name: "Aisha Osei",
    creator_handle: "@aishaosei.co",
    creator_tier: "seed",
    creator_score: 28,
    creator_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AishaOsei",
    creator_followers: 740,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-12T16:00:00Z",
  },
  {
    id: "app-014",
    campaign_id: "mc-013",
    campaign_title: "Work From Blank Street",
    creator_name: "Finn Nakamura",
    creator_handle: "@finnnak",
    creator_tier: "explorer",
    creator_score: 50,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=FinnNakamura",
    creator_followers: 3300,
    status: "accepted",
    milestone: "content_published",
    content_url: "https://www.instagram.com/reel/demo-content-14",
    applied_at: "2026-04-11T12:00:00Z",
  },
  {
    id: "app-015",
    campaign_id: "mc-014",
    campaign_title: "Sustainable Cup Initiative",
    creator_name: "Camille Rousseau",
    creator_handle: "@camillerousseau",
    creator_tier: "explorer",
    creator_score: 56,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=CamilleRousseau",
    creator_followers: 4100,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-13T11:30:00Z",
  },
  {
    id: "app-016",
    campaign_id: "mc-014",
    campaign_title: "Sustainable Cup Initiative",
    creator_name: "Dev Patel",
    creator_handle: "@devpatel.nyc",
    creator_tier: "seed",
    creator_score: 38,
    creator_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevPatel",
    creator_followers: 1900,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-13T14:00:00Z",
  },
  {
    id: "app-017",
    campaign_id: "mc-008",
    campaign_title: "Barista Spotlight Series",
    creator_name: "Elise Fontaine",
    creator_handle: "@elise.fontaine",
    creator_tier: "operator",
    creator_score: 69,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=EliseFontaine",
    creator_followers: 5500,
    status: "accepted",
    milestone: "verified",
    applied_at: "2026-04-08T09:00:00Z",
  },
  {
    id: "app-018",
    campaign_id: "mc-008",
    campaign_title: "Barista Spotlight Series",
    creator_name: "Omar Hassan",
    creator_handle: "@omar.has",
    creator_tier: "explorer",
    creator_score: 48,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=OmarHassan",
    creator_followers: 2700,
    status: "accepted",
    milestone: "proof_submitted",
    proof_url: "https://www.instagram.com/reel/demo-proof-18",
    applied_at: "2026-04-09T15:00:00Z",
  },
  {
    id: "app-019",
    campaign_id: "mc-001",
    campaign_title: "Free Latte for a 30-Second Reel",
    creator_name: "Zara Williams",
    creator_handle: "@zarawilliams",
    creator_tier: "seed",
    creator_score: 35,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=ZaraWilliams",
    creator_followers: 1200,
    status: "rejected",
    milestone: "accepted",
    applied_at: "2026-04-09T11:00:00Z",
  },
  {
    id: "app-020",
    campaign_id: "mc-004",
    campaign_title: "SoHo Flagship — Interior Shoot",
    creator_name: "Sam Ortega",
    creator_handle: "@samortega.film",
    creator_tier: "operator",
    creator_score: 74,
    creator_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SamOrtega",
    creator_followers: 7900,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-13T16:30:00Z",
  },
  {
    id: "app-021",
    campaign_id: "mc-003",
    campaign_title: "Spring Seasonal Menu Launch",
    creator_name: "Yuki Tanaka",
    creator_handle: "@yukitanaka.eat",
    creator_tier: "explorer",
    creator_score: 53,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=YukiTanaka",
    creator_followers: 3600,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-14T10:00:00Z",
  },
  {
    id: "app-022",
    campaign_id: "mc-012",
    campaign_title: "Williamsburg Pop-Up Opening",
    creator_name: "Iris Chambers",
    creator_handle: "@irischambers",
    creator_tier: "seed",
    creator_score: 33,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=IrisChambers",
    creator_followers: 1500,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-14T13:15:00Z",
  },
  {
    id: "app-023",
    campaign_id: "mc-013",
    campaign_title: "Work From Blank Street",
    creator_name: "Ray Delacroix",
    creator_handle: "@raydelacroix",
    creator_tier: "operator",
    creator_score: 67,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=RayDelacroix",
    creator_followers: 5200,
    status: "accepted",
    milestone: "scheduled",
    applied_at: "2026-04-12T08:30:00Z",
  },
  {
    id: "app-024",
    campaign_id: "mc-002",
    campaign_title: "Morning Rush — 7am to 9am",
    creator_name: "Bea Montgomery",
    creator_handle: "@beamontgomery",
    creator_tier: "proven",
    creator_score: 81,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=BeaMontgomery",
    creator_followers: 21000,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-14T09:00:00Z",
  },
  {
    id: "app-025",
    campaign_id: "mc-014",
    campaign_title: "Sustainable Cup Initiative",
    creator_name: "Luke Abara",
    creator_handle: "@lukeabara",
    creator_tier: "explorer",
    creator_score: 58,
    creator_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LukeAbara",
    creator_followers: 3900,
    status: "accepted",
    milestone: "accepted",
    applied_at: "2026-04-13T09:30:00Z",
  },
  {
    id: "app-026",
    campaign_id: "mc-001",
    campaign_title: "Free Latte for a 30-Second Reel",
    creator_name: "Nia Roberts",
    creator_handle: "@niaroberts.nyc",
    creator_tier: "explorer",
    creator_score: 45,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=NiaRoberts",
    creator_followers: 2600,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-14T15:00:00Z",
  },
  {
    id: "app-027",
    campaign_id: "mc-013",
    campaign_title: "Work From Blank Street",
    creator_name: "Theo Vasquez",
    creator_handle: "@theovasquez",
    creator_tier: "seed",
    creator_score: 29,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=TheoVasquez",
    creator_followers: 980,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-14T17:00:00Z",
  },
  {
    id: "app-028",
    campaign_id: "mc-004",
    campaign_title: "SoHo Flagship — Interior Shoot",
    creator_name: "Mia Chen",
    creator_handle: "@miachen.creates",
    creator_tier: "proven",
    creator_score: 84,
    creator_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MiaChen",
    creator_followers: 16200,
    status: "accepted",
    milestone: "visited",
    applied_at: "2026-04-09T16:00:00Z",
  },
  {
    id: "app-029",
    campaign_id: "mc-003",
    campaign_title: "Spring Seasonal Menu Launch",
    creator_name: "Leon Baptiste",
    creator_handle: "@leonbaptiste",
    creator_tier: "operator",
    creator_score: 70,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=LeonBaptiste",
    creator_followers: 6800,
    status: "pending",
    milestone: "accepted",
    applied_at: "2026-04-14T11:30:00Z",
  },
  {
    id: "app-030",
    campaign_id: "mc-012",
    campaign_title: "Williamsburg Pop-Up Opening",
    creator_name: "Zoe Ashford",
    creator_handle: "@zoeashford",
    creator_tier: "operator",
    creator_score: 72,
    creator_avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=ZoeAshford",
    creator_followers: 8400,
    status: "accepted",
    milestone: "accepted",
    applied_at: "2026-04-12T14:00:00Z",
  },
];

const DEMO_ANALYTICS: Analytics = {
  qr_scans_month: 185,
  qr_scans_delta: 47,
  new_customers: 112,
  active_creators: 14,
  total_spend: 1130,
  estimated_revenue: 8250,
  roi_multiple: 7.3,
};

/* ── Tier config ─────────────────────────────────────────── */
const TIER_DISPLAY: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

const MILESTONE_LABELS: Record<Milestone, string> = {
  accepted: "Accepted",
  scheduled: "Scheduled",
  visited: "Visited",
  proof_submitted: "Proof Submitted",
  content_published: "Published",
  verified: "Verified",
  settled: "Settled",
};

const MILESTONE_ORDER: Milestone[] = [
  "accepted",
  "scheduled",
  "visited",
  "proof_submitted",
  "content_published",
  "verified",
  "settled",
];

/* ── Analytics chart data ────────────────────────────────── */
const WEEKLY_SCANS = [18, 22, 19, 34, 28, 41, 35];
const WEEKLY_VISITS = [12, 16, 14, 25, 21, 31, 28];
const WEEK_LABELS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];
const CHART_MAX = Math.max(...WEEKLY_SCANS);

/* ── SVG Icons ───────────────────────────────────────────── */
const IconCampaigns = () => (
  <svg
    className="db-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="1" y="2" width="14" height="12" />
    <line x1="1" y1="6" x2="15" y2="6" />
    <line x1="5" y1="10" x2="11" y2="10" />
  </svg>
);

const IconApplications = () => (
  <svg
    className="db-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="6" cy="5" r="3" />
    <path d="M1 14c0-3 2.5-5 5-5s5 2 5 5" />
    <line x1="11" y1="7" x2="15" y2="7" />
    <line x1="11" y1="10" x2="15" y2="10" />
  </svg>
);

const IconAnalytics = () => (
  <svg
    className="db-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <polyline points="1,13 5,8 8,11 11,5 15,9" />
    <line x1="1" y1="13" x2="15" y2="13" />
  </svg>
);

const IconPayments = () => (
  <svg
    className="db-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="1" y="4" width="14" height="10" />
    <line x1="1" y1="7" x2="15" y2="7" />
    <line x1="4" y1="11" x2="7" y2="11" />
  </svg>
);

const IconSettings = () => (
  <svg
    className="db-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="8" cy="8" r="2.5" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3" />
  </svg>
);

const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    style={{
      width: 14,
      height: 14,
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 260ms cubic-bezier(0.22,1,0.36,1)",
      flexShrink: 0,
    }}
  >
    <polyline points="3,6 8,11 13,6" />
  </svg>
);

/* ── Skeleton ────────────────────────────────────────────── */
function SkeletonScreen() {
  return (
    <div className="db-skeleton-shell">
      <div className="db-skeleton-nav" />
      <div className="db-skeleton-body">
        <div className="db-skeleton-sidebar" />
        <div className="db-skeleton-main">
          <div className="db-skeleton-block db-skeleton-header skeleton" />
          <div className="db-skeleton-stats">
            <div className="db-skeleton-block db-skeleton-stat skeleton" />
            <div className="db-skeleton-block db-skeleton-stat skeleton" />
            <div className="db-skeleton-block db-skeleton-stat skeleton" />
            <div className="db-skeleton-block db-skeleton-stat skeleton" />
          </div>
          <div className="db-skeleton-block db-skeleton-table skeleton" />
        </div>
      </div>
    </div>
  );
}

/* ── TierBadge ───────────────────────────────────────────── */
function TierBadge({ tier }: { tier: CreatorTier }) {
  type Cfg = { bg: string; color: string; border: string; borderLeft?: string };
  const CFG: Record<CreatorTier, Cfg> = {
    seed: {
      bg: "transparent",
      color: "#003049",
      border: "1.5px dashed rgba(184,169,154,0.65)",
    },
    explorer: { bg: "#8c6239", color: "#fff", border: "1px solid #8c6239" },
    operator: { bg: "#4a5568", color: "#fff", border: "1px solid #4a5568" },
    proven: { bg: "#c9a96e", color: "#003049", border: "1px solid #c9a96e" },
    closer: { bg: "#9b111e", color: "#fff", border: "1px solid #9b111e" },
    partner: {
      bg: "#1a1a2e",
      color: "#fff",
      border: "1px solid #1a1a2e",
      borderLeft: "3px solid #c1121f",
    },
  };
  const c = CFG[tier];
  return (
    <span
      style={{
        fontFamily: "var(--font-body,'CS Genio Mono',monospace)",
        fontSize: "9px",
        fontWeight: 700,
        textTransform: "uppercase" as const,
        letterSpacing: "0.08em",
        padding: "4px 10px",
        borderRadius: 0,
        background: c.bg,
        color: c.color,
        border: c.border,
        borderLeft: c.borderLeft ?? c.border,
        display: "inline-block",
        whiteSpace: "nowrap" as const,
        lineHeight: 1.2,
        flexShrink: 0,
      }}
    >
      {TIER_DISPLAY[tier]}
    </span>
  );
}

/* ── StatusBadge ─────────────────────────────────────────── */
function StatusBadge({ status }: { status: Campaign["status"] }) {
  const labels: Record<Campaign["status"], string> = {
    active: "Active",
    paused: "Paused",
    draft: "Draft",
    closed: "Closed",
  };
  return (
    <span className={`db-badge db-badge--${status}`}>{labels[status]}</span>
  );
}

/* ── MilestoneTag ────────────────────────────────────────── */
function MilestoneTag({ milestone }: { milestone: Milestone }) {
  const isDone = milestone === "settled" || milestone === "verified";
  const isAction = milestone === "proof_submitted";
  return (
    <span
      className={`milestone-tag${isDone ? " milestone-tag--done" : isAction ? " milestone-tag--action" : ""}`}
    >
      {MILESTONE_LABELS[milestone]}
    </span>
  );
}

/* ── MilestoneProgress ───────────────────────────────────── */
function MilestoneProgress({ milestone }: { milestone: Milestone }) {
  const idx = MILESTONE_ORDER.indexOf(milestone);
  const pct = Math.round(((idx + 1) / MILESTONE_ORDER.length) * 100);
  return (
    <div className="milestone-progress">
      <div className="milestone-progress__bar" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ── GreetingHeader ──────────────────────────────────────── */
function GreetingHeader({
  merchant,
  activeCampaigns,
  pendingCount,
}: {
  merchant: Merchant | null;
  activeCampaigns: number;
  pendingCount: number;
}) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const businessName = merchant?.business_name.split(" —")[0] ?? "there";

  return (
    <div className="db-greeting">
      <div className="db-greeting__eyebrow">Merchant Dashboard — Apr 2026</div>
      <h1 className="db-greeting__title">
        {greeting}, {businessName}.
      </h1>
      <p className="db-greeting__sub">
        {activeCampaigns} active campaign{activeCampaigns !== 1 ? "s" : ""}
        {pendingCount > 0 && (
          <>
            {" "}
            &mdash;{" "}
            <span className="db-greeting__alert">
              {pendingCount} applicant{pendingCount !== 1 ? "s" : ""} awaiting
              review
            </span>
          </>
        )}
      </p>
    </div>
  );
}

/* ── KPI Stat Cards (4-grid) ─────────────────────────────── */
function KpiCard({
  label,
  value,
  delta,
  deltaPositive,
  accent = false,
}: {
  label: string;
  value: string | number;
  delta: string;
  deltaPositive?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`kpi-card${accent ? " kpi-card--accent" : ""}`}>
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__value">{value}</div>
      <div
        className={`kpi-card__delta${deltaPositive === false ? " kpi-card__delta--neg" : deltaPositive ? " kpi-card__delta--pos" : " kpi-card__delta--neutral"}`}
      >
        {delta}
      </div>
    </div>
  );
}

/* ── Campaign Card with progress bar ─────────────────────── */
function CampaignCard({
  campaign,
  applications,
}: {
  campaign: Campaign;
  applications: Application[];
}) {
  const appCount = applications.filter(
    (a) => a.campaign_id === campaign.id,
  ).length;
  const spotsUsed = campaign.spots_total - campaign.spots_remaining;
  const spotsPct = Math.round((spotsUsed / campaign.spots_total) * 100);
  const budgetPct =
    campaign.budget_total && campaign.budget_total > 0
      ? Math.round(((campaign.budget_spent ?? 0) / campaign.budget_total) * 100)
      : 0;

  const daysLeftNum = campaign.deadline
    ? Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / 864e5)
    : null;

  return (
    <div className="campaign-card">
      <div className="campaign-card__top">
        <div className="campaign-card__title-row">
          <div className="campaign-card__title">{campaign.title}</div>
          <StatusBadge status={campaign.status} />
        </div>
        <div className="campaign-card__meta">
          {campaign.tier_required && (
            <TierBadge tier={campaign.tier_required} />
          )}
          {campaign.category && (
            <span className="campaign-card__category">{campaign.category}</span>
          )}
        </div>
      </div>

      {/* Spots progress */}
      <div className="campaign-card__progress-block">
        <div className="campaign-card__progress-label">
          <span>Spots filled</span>
          <span className="campaign-card__progress-nums">
            {spotsUsed} / {campaign.spots_total}
          </span>
        </div>
        <div className="campaign-card__bar-track">
          <div
            className="campaign-card__bar-fill"
            style={{ width: `${spotsPct}%` }}
          />
        </div>
      </div>

      {/* Budget progress (only when there's a budget) */}
      {campaign.budget_total != null && campaign.budget_total > 0 && (
        <div className="campaign-card__progress-block">
          <div className="campaign-card__progress-label">
            <span>Budget spent</span>
            <span className="campaign-card__progress-nums">
              ${campaign.budget_spent ?? 0} / ${campaign.budget_total}
            </span>
          </div>
          <div className="campaign-card__bar-track">
            <div
              className="campaign-card__bar-fill campaign-card__bar-fill--budget"
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="campaign-card__footer">
        <span className="campaign-card__stat">
          <span className="campaign-card__stat-num">{appCount}</span> applicant
          {appCount !== 1 ? "s" : ""}
        </span>
        {daysLeftNum !== null && (
          <span
            className={`campaign-card__deadline${daysLeftNum <= 3 && campaign.status === "active" ? " campaign-card__deadline--urgent" : ""}`}
          >
            {daysLeftNum <= 0 ? "Ended" : `${daysLeftNum}d left`}
          </span>
        )}
        {campaign.payout === 0 ? (
          <span className="campaign-card__payout">Product</span>
        ) : (
          <span className="campaign-card__payout">
            ${campaign.payout} / creator
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Applicant Row (accordion) ───────────────────────────── */
function ApplicantRow({
  app,
  onAccept,
  onReject,
  onApprove,
}: {
  app: Application;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onApprove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`applicant-row${app.status === "rejected" ? " applicant-row--rejected" : ""}`}
    >
      <button
        className="applicant-row__summary"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        <img
          src={app.creator_avatar}
          alt={app.creator_name}
          className="applicant-row__avatar"
        />
        <div className="applicant-row__identity">
          <span className="applicant-row__name">{app.creator_name}</span>
          <span className="applicant-row__handle">{app.creator_handle}</span>
        </div>
        <TierBadge tier={app.creator_tier} />
        <div className="applicant-row__campaign-col">
          <span className="applicant-row__campaign-label">Applied to</span>
          <span className="applicant-row__campaign">{app.campaign_title}</span>
        </div>
        <div className="applicant-row__actions-inline">
          {app.status === "pending" && (
            <>
              <button
                className="app-btn app-btn--accept"
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept(app.id);
                }}
              >
                Accept
              </button>
              <button
                className="app-btn app-btn--reject"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(app.id);
                }}
              >
                Decline
              </button>
            </>
          )}
          {app.status === "accepted" && app.milestone === "proof_submitted" && (
            <button
              className="app-btn app-btn--approve"
              onClick={(e) => {
                e.stopPropagation();
                onApprove(app.id);
              }}
            >
              Approve
            </button>
          )}
          {app.status === "accepted" && app.milestone === "settled" && (
            <span className="app-card__done">Paid out</span>
          )}
          {app.status === "rejected" && (
            <span className="app-card__rejected-label">Declined</span>
          )}
        </div>
        <IconChevron open={expanded} />
      </button>

      {expanded && (
        <div className="applicant-row__detail">
          <div className="applicant-row__detail-grid">
            <div className="applicant-row__detail-item">
              <div className="applicant-row__detail-label">Followers</div>
              <div className="applicant-row__detail-val">
                {app.creator_followers >= 1000
                  ? `${(app.creator_followers / 1000).toFixed(1)}K`
                  : app.creator_followers}
              </div>
            </div>
            <div className="applicant-row__detail-item">
              <div className="applicant-row__detail-label">Push Score</div>
              <div className="applicant-row__detail-val">
                {app.creator_score}
              </div>
            </div>
            <div className="applicant-row__detail-item">
              <div className="applicant-row__detail-label">Status</div>
              <div className="applicant-row__detail-val">
                <MilestoneTag milestone={app.milestone} />
              </div>
            </div>
            <div className="applicant-row__detail-item">
              <div className="applicant-row__detail-label">Applied</div>
              <div className="applicant-row__detail-val">
                {new Date(app.applied_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="applicant-row__detail-progress">
            <MilestoneProgress milestone={app.milestone} />
          </div>

          {app.status === "accepted" &&
            app.milestone === "proof_submitted" &&
            app.proof_url && (
              <a
                href={app.proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="app-btn app-btn--view"
                style={{ marginTop: 8 }}
              >
                View Proof
              </a>
            )}
          {app.status === "accepted" && app.content_url && (
            <a
              href={app.content_url}
              target="_blank"
              rel="noopener noreferrer"
              className="app-btn app-btn--view"
              style={{ marginTop: 8 }}
            >
              View Post
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Analytics Bar Chart ─────────────────────────────────── */
function AnalyticsBarChart() {
  return (
    <div className="analytics-chart">
      <div className="analytics-chart__header">
        <div className="analytics-chart__title">
          QR Scans &amp; Visits — Apr 2026
        </div>
        <div className="analytics-chart__legend">
          <span>
            <span
              className="analytics-chart__legend-dot"
              style={{ background: "var(--primary)" }}
            />
            Scans
          </span>
          <span>
            <span
              className="analytics-chart__legend-dot"
              style={{ background: "var(--dark)" }}
            />
            Visits
          </span>
        </div>
      </div>
      <div className="analytics-bars">
        {WEEK_LABELS.map((label, i) => (
          <div key={label} className="analytics-bar-group">
            <div className="analytics-bar-group__bars">
              <div
                className="analytics-bar analytics-bar--scans"
                style={{ height: `${(WEEKLY_SCANS[i] / CHART_MAX) * 100}%` }}
              />
              <div
                className="analytics-bar analytics-bar--visits"
                style={{ height: `${(WEEKLY_VISITS[i] / CHART_MAX) * 100}%` }}
              />
            </div>
            <div className="analytics-bar-group__label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── CampaignsTab ────────────────────────────────────────── */
function CampaignsTab({
  campaigns,
  applications,
  loading,
  error,
}: {
  campaigns: Campaign[];
  applications: Application[];
  loading: boolean;
  error: string | null;
}) {
  const active = campaigns.filter((c) => c.status === "active");
  const draft = campaigns.filter((c) => c.status === "draft");
  const other = campaigns.filter(
    (c) => c.status === "paused" || c.status === "closed",
  );

  if (loading) {
    return <div className="skeleton" style={{ height: 300 }} />;
  }

  return (
    <>
      {error && <div className="db-error">{error}</div>}

      {campaigns.length === 0 ? (
        <div className="db-empty-state">
          <div className="db-empty-state__oversize">No campaigns yet.</div>
          <div className="db-empty-state__sub">
            Launch your first campaign to start connecting with creators in your
            neighborhood.
          </div>
          <a href="/merchant/campaigns/new" className="db-empty-cta">
            Launch your first &rarr;
          </a>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <>
              <div className="db-section-header">
                <div className="db-section-header__title">Active</div>
                <span className="db-section-header__count">
                  {active.length}
                </span>
              </div>
              <div className="campaign-grid db-animate-parent">
                {active.map((c) => (
                  <CampaignCard
                    key={c.id}
                    campaign={c}
                    applications={applications}
                  />
                ))}
              </div>
            </>
          )}

          {draft.length > 0 && (
            <>
              <div
                className="db-section-header"
                style={{ marginTop: "var(--space-6)" }}
              >
                <div className="db-section-header__title">Drafts</div>
                <span className="db-section-header__count">{draft.length}</span>
              </div>
              <div className="campaign-grid db-animate-parent">
                {draft.map((c) => (
                  <CampaignCard
                    key={c.id}
                    campaign={c}
                    applications={applications}
                  />
                ))}
              </div>
            </>
          )}

          {other.length > 0 && (
            <>
              <div
                className="db-section-header"
                style={{ marginTop: "var(--space-6)" }}
              >
                <div className="db-section-header__title">Past & Paused</div>
                <span className="db-section-header__count">{other.length}</span>
              </div>
              <div className="campaign-grid db-animate-parent">
                {other.map((c) => (
                  <CampaignCard
                    key={c.id}
                    campaign={c}
                    applications={applications}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

/* ── ApplicationsTab ─────────────────────────────────────── */
function ApplicationsTab({
  applications,
  onAccept,
  onReject,
  onApprove,
}: {
  applications: Application[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onApprove: (id: string) => void;
}) {
  const [filter, setFilter] = useState<AppFilter>("all");

  const pendingCount = applications.filter(
    (a) => a.status === "pending",
  ).length;
  const actionCount = applications.filter(
    (a) => a.status === "accepted" && a.milestone === "proof_submitted",
  ).length;

  const filtered = applications.filter((a) => {
    if (filter === "pending") return a.status === "pending";
    if (filter === "active")
      return a.status === "accepted" && a.milestone !== "settled";
    if (filter === "done")
      return a.milestone === "settled" || a.milestone === "verified";
    return true;
  });

  return (
    <>
      <div className="db-tab-header">
        <div>
          <div className="db-tab-header__eyebrow">Creator Workflow</div>
          <div className="db-tab-header__title">Applicants</div>
        </div>
        {(pendingCount > 0 || actionCount > 0) && (
          <div className="app-attention-badge">
            {pendingCount > 0 && `${pendingCount} pending`}
            {pendingCount > 0 && actionCount > 0 && " · "}
            {actionCount > 0 && `${actionCount} needs review`}
          </div>
        )}
      </div>

      <div className="app-filter-row">
        {(["all", "pending", "active", "done"] as AppFilter[]).map((f) => (
          <button
            key={f}
            className={`app-filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" && `All (${applications.length})`}
            {f === "pending" && `Pending (${pendingCount})`}
            {f === "active" && "In Progress"}
            {f === "done" && "Completed"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="db-empty-state" style={{ minHeight: 240 }}>
          <div
            className="db-empty-state__oversize"
            style={{ fontSize: "clamp(32px,4vw,52px)" }}
          >
            No applicants here.
          </div>
          <div className="db-empty-state__sub">
            {filter === "pending"
              ? "No creators waiting for your response."
              : "Nothing in this category yet."}
          </div>
        </div>
      ) : (
        <div className="applicant-list">
          {filtered.map((app) => (
            <ApplicantRow
              key={app.id}
              app={app}
              onAccept={onAccept}
              onReject={onReject}
              onApprove={onApprove}
            />
          ))}
        </div>
      )}
    </>
  );
}

/* ── AnalyticsTab ────────────────────────────────────────── */
function AnalyticsTab({
  campaigns,
  applications,
  analytics,
  isDemo,
}: {
  campaigns: Campaign[];
  applications: Application[];
  analytics: Analytics | null;
  isDemo: boolean;
}) {
  if (!isDemo || !analytics) {
    return (
      <>
        <div className="db-tab-header">
          <div>
            <div className="db-tab-header__eyebrow">Insights</div>
            <div className="db-tab-header__title">Analytics</div>
          </div>
        </div>
        <div className="db-placeholder">
          <div className="db-placeholder__oversize">Coming soon.</div>
          <div className="db-placeholder__body">
            QR scan attribution, creator performance, and campaign ROI —
            available after your first campaign completes.
          </div>
        </div>
      </>
    );
  }

  const activeCreators = applications.filter(
    (a) => a.status === "accepted" && a.milestone !== "settled",
  );

  return (
    <>
      <div className="db-tab-header">
        <div>
          <div className="db-tab-header__eyebrow">Insights</div>
          <div className="db-tab-header__title">Analytics</div>
        </div>
        <div className="db-tab-header__period">Apr 2026</div>
      </div>

      <div className="analytics-roi-strip">
        <div className="analytics-roi-cell">
          <div className="analytics-roi-cell__label">QR Scans This Month</div>
          <div className="analytics-roi-cell__value">
            {analytics.qr_scans_month}
          </div>
          <div className="analytics-roi-cell__sub">
            +{analytics.qr_scans_delta} vs last month
          </div>
        </div>
        <div className="analytics-roi-cell">
          <div className="analytics-roi-cell__label">
            New Customers Attributed
          </div>
          <div className="analytics-roi-cell__value">
            {analytics.new_customers}
          </div>
          <div className="analytics-roi-cell__sub">verified via QR scan</div>
        </div>
        <div className="analytics-roi-cell analytics-roi-cell--dark">
          <div className="analytics-roi-cell__label">Return on Spend</div>
          <div className="analytics-roi-cell__value">
            {analytics.roi_multiple}&times;
          </div>
          <div className="analytics-roi-cell__sub">
            ${analytics.total_spend} spend → $
            {analytics.estimated_revenue.toLocaleString()} est.
          </div>
        </div>
      </div>

      <AnalyticsBarChart />

      <div
        className="db-section-header"
        style={{ marginTop: "var(--space-5)" }}
      >
        <div className="db-section-header__title">Campaign Performance</div>
      </div>

      <div
        className="db-campaign-list"
        style={{ marginBottom: "var(--space-5)" }}
      >
        <div className="analytics-perf-header">
          <div>Campaign</div>
          <div>Status</div>
          <div>QR Scans</div>
          <div>Creators</div>
          <div>Spend</div>
          <div>Est. Revenue</div>
        </div>
        {campaigns.map((c) => {
          const campApps = applications.filter((a) => a.campaign_id === c.id);
          return (
            <div key={c.id} className="analytics-perf-row">
              <div>
                <div className="db-campaign-row__title">{c.title}</div>
                <div className="db-campaign-row__desc">{c.category}</div>
              </div>
              <div>
                <StatusBadge status={c.status} />
              </div>
              <div className="analytics-perf-row__num">{c.qr_scans ?? 0}</div>
              <div className="analytics-perf-row__num">{campApps.length}</div>
              <div className="analytics-perf-row__num">
                {c.budget_spent ? `$${c.budget_spent}` : "—"}
              </div>
              <div className="analytics-perf-row__rev">
                {c.attributed_revenue
                  ? `$${c.attributed_revenue.toLocaleString()}`
                  : "—"}
              </div>
            </div>
          );
        })}
      </div>

      {activeCreators.length > 0 && (
        <>
          <div className="db-section-header">
            <div className="db-section-header__title">Active Creators</div>
            <span className="db-section-header__count">
              {activeCreators.length} working now
            </span>
          </div>
          <div className="db-campaign-list">
            {activeCreators.map((app) => (
              <div key={app.id} className="roster-row">
                <img
                  src={app.creator_avatar}
                  alt={app.creator_name}
                  className="roster-row__avatar"
                />
                <div className="roster-row__info">
                  <div className="roster-row__name">{app.creator_name}</div>
                  <div className="roster-row__handle">{app.creator_handle}</div>
                </div>
                <TierBadge tier={app.creator_tier} />
                <div className="roster-row__score">
                  <span className="roster-row__score-label">Score</span>
                  <span className="roster-row__score-val">
                    {app.creator_score}
                  </span>
                </div>
                <div className="roster-row__campaign">{app.campaign_title}</div>
                <MilestoneTag milestone={app.milestone} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* ── PaymentsTab ─────────────────────────────────────────── */
function PaymentsTab({ isDemo }: { isDemo: boolean }) {
  return (
    <>
      <div className="db-tab-header">
        <div>
          <div className="db-tab-header__eyebrow">Financials</div>
          <div className="db-tab-header__title">Payments</div>
        </div>
      </div>
      <div className="db-placeholder">
        <div className="db-placeholder__oversize">Coming soon.</div>
        <div className="db-placeholder__body">
          Invoice history, payout breakdowns, and spend analytics by campaign.
        </div>
      </div>
    </>
  );
}

/* ── SettingsTab ─────────────────────────────────────────── */
function SettingsTab({ merchant }: { merchant: Merchant | null }) {
  const planNames = { starter: "Starter", growth: "Growth", pro: "Pro" };
  const planPrices = { starter: "$19.99", growth: "$69", pro: "$199" };

  return (
    <>
      <div className="db-tab-header">
        <div>
          <div className="db-tab-header__eyebrow">Account</div>
          <div className="db-tab-header__title">Settings</div>
        </div>
      </div>

      {merchant && (
        <div className="settings-card">
          {[
            { label: "Business Name", value: merchant.business_name },
            { label: "Address", value: merchant.address },
            { label: "Contact Email", value: merchant.contact_email },
            ...(merchant.instagram
              ? [{ label: "Instagram", value: merchant.instagram }]
              : []),
          ].map(({ label, value }) => (
            <div key={label} className="settings-field">
              <div className="settings-field__label">{label}</div>
              <div className="settings-field__value">{value}</div>
            </div>
          ))}
          {merchant.plan && (
            <div className="settings-field">
              <div className="settings-field__label">Current Plan</div>
              <div className="settings-field__plan-row">
                <span className="settings-field__plan-name">
                  {planNames[merchant.plan]}
                </span>
                <span className="settings-field__plan-price">
                  {planPrices[merchant.plan]} / mo
                </span>
                <a href="/merchant/upgrade" className="settings-field__upgrade">
                  Upgrade &rarr;
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="db-placeholder" style={{ marginTop: "var(--space-4)" }}>
        <div
          className="db-placeholder__oversize"
          style={{ fontSize: "clamp(28px,3vw,44px)" }}
        >
          Edit Profile & Billing
        </div>
        <div className="db-placeholder__body">
          Full account management, notification preferences, and plan upgrades —
          coming soon.
        </div>
      </div>
    </>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function MerchantDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const [userEmail, setUserEmail] = useState<string>("");
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>("campaigns");

  /* ── Load data ─────────────────────────────────────────── */
  const loadData = useCallback(async () => {
    const demo = checkDemoMode();
    setIsDemo(demo);

    if (demo) {
      setMerchant(DEMO_MERCHANT);
      setCampaigns(DEMO_CAMPAIGNS);
      setApplications(DEMO_APPLICATIONS);
      setAnalytics(DEMO_ANALYTICS);
      setUserEmail(DEMO_MERCHANT.contact_email);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push("/merchant/login");
        return;
      }
      setUserEmail(user.email ?? "");

      const { data: merchantData, error: merchantError } = await supabase
        .from("merchants")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (merchantError || !merchantData) {
        setError("Merchant profile not found. Please complete onboarding.");
        setLoading(false);
        return;
      }
      setMerchant(merchantData as Merchant);

      setCampaignsLoading(true);
      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("merchant_id", merchantData.id)
        .order("created_at", { ascending: false });
      if (campaignError) {
        setError("Failed to load campaigns: " + campaignError.message);
      } else {
        setCampaigns((campaignData as Campaign[]) ?? []);
      }
    } catch (e: unknown) {
      setError(
        "Unexpected error: " + (e instanceof Error ? e.message : String(e)),
      );
    } finally {
      setLoading(false);
      setCampaignsLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── Demo application actions ──────────────────────────── */
  const handleAccept = (id: string) =>
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "accepted" as const } : a,
      ),
    );
  const handleReject = (id: string) =>
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "rejected" as const } : a,
      ),
    );
  const handleApprove = (id: string) =>
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, milestone: "verified" as const } : a,
      ),
    );

  /* ── Sign out ──────────────────────────────────────────── */
  const handleSignOut = async () => {
    if (isDemo) {
      document.cookie = "push-demo-role=; path=/; max-age=0";
      router.push("/demo");
      return;
    }
    await supabase.auth.signOut();
    router.push("/merchant/login");
  };

  if (loading) return <SkeletonScreen />;

  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const pendingCount = applications.filter(
    (a) => a.status === "pending",
  ).length;
  const thisMonthReach =
    analytics?.qr_scans_month ??
    campaigns.reduce((s, c) => s + (c.qr_scans ?? 0), 0);
  const conversions = analytics?.new_customers ?? 0;
  const avatarInitials = merchant?.business_name
    ? merchant.business_name.slice(0, 2).toUpperCase()
    : "M";

  return (
    <div className="db-shell">
      {isDemo && (
        <div className="db-demo-banner">
          Demo Mode —{" "}
          <a href="/demo" style={{ color: "inherit", fontWeight: 700 }}>
            Switch perspective
          </a>
        </div>
      )}

      {/* Top Nav */}
      <nav className="db-nav" style={isDemo ? { top: 32 } : undefined}>
        <a href="/" className="db-nav__logo">
          Push<span>.</span>
        </a>
        <div className="db-nav__center">
          <span className="db-nav__title">Merchant Dashboard</span>
        </div>
        <div className="db-nav__right">
          {merchant && (
            <span className="db-nav__email">{merchant.business_name}</span>
          )}
          <div className="db-nav__avatar" aria-label={userEmail}>
            {avatarInitials}
          </div>
          <button className="db-nav__signout" onClick={handleSignOut}>
            {isDemo ? "Exit demo" : "Sign out"}
          </button>
        </div>
      </nav>

      {/* Body */}
      <div
        className="db-body"
        style={isDemo ? { marginTop: 60 + 32 } : undefined}
      >
        {/* Sidebar */}
        <aside
          className="db-sidebar"
          style={
            isDemo
              ? { top: 60 + 32, height: `calc(100svh - ${60 + 32}px)` }
              : undefined
          }
        >
          <nav className="db-sidebar__nav">
            <div className="db-nav-section">
              <div className="db-nav-section__label">Menu</div>
              <button
                className={`db-nav-item${activeTab === "campaigns" ? " active" : ""}`}
                onClick={() => setActiveTab("campaigns")}
              >
                <IconCampaigns /> Campaigns
              </button>
              <button
                className={`db-nav-item${activeTab === "applications" ? " active" : ""}`}
                onClick={() => setActiveTab("applications")}
              >
                <IconApplications /> Applicants
                {pendingCount > 0 && (
                  <span className="db-nav-badge">{pendingCount}</span>
                )}
              </button>
              <button
                className={`db-nav-item${activeTab === "analytics" ? " active" : ""}`}
                onClick={() => setActiveTab("analytics")}
              >
                <IconAnalytics /> Analytics
              </button>
              <button
                className={`db-nav-item${activeTab === "payments" ? " active" : ""}`}
                onClick={() => setActiveTab("payments")}
              >
                <IconPayments /> Payments
              </button>
              <button
                className={`db-nav-item${activeTab === "settings" ? " active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <IconSettings /> Settings
              </button>
            </div>
          </nav>

          <div className="db-sidebar__footer">
            <div className="db-plan-badge">
              <div className="db-plan-badge__label">Current Plan</div>
              <div className="db-plan-badge__name">
                {merchant?.plan === "growth"
                  ? "Growth"
                  : merchant?.plan === "pro"
                    ? "Pro"
                    : "Starter"}
              </div>
              <div className="db-plan-badge__price">
                {merchant?.plan === "growth"
                  ? "$69"
                  : merchant?.plan === "pro"
                    ? "$199"
                    : "$19.99"}{" "}
                / mo
              </div>
              <a href="/merchant/upgrade" className="db-plan-badge__upgrade">
                Upgrade plan &rarr;
              </a>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="db-main">
          {/* Editorial greeting — always visible */}
          <GreetingHeader
            merchant={merchant}
            activeCampaigns={activeCampaigns}
            pendingCount={pendingCount}
          />

          {/* KPI 4-grid — always visible */}
          <div className="kpi-grid">
            <KpiCard
              label="Active Campaigns"
              value={activeCampaigns}
              delta={`${campaigns.filter((c) => c.status === "draft").length} drafts in pipeline`}
            />
            <KpiCard
              label="Pending Applicants"
              value={pendingCount}
              delta={pendingCount > 0 ? "Needs your review" : "All up to date"}
              deltaPositive={pendingCount === 0}
            />
            <KpiCard
              label="This Month Reach"
              value={thisMonthReach}
              delta={
                isDemo
                  ? `+${analytics?.qr_scans_delta ?? 0} vs last month`
                  : "— attribution tracking"
              }
              deltaPositive={isDemo}
            />
            <KpiCard
              label="Conversions"
              value={conversions}
              delta={isDemo ? "New customers via QR" : "— coming soon"}
              deltaPositive={isDemo}
              accent
            />
          </div>

          {/* Tab new campaign CTA strip */}
          <div className="db-action-strip">
            <button
              className={`db-strip-tab${activeTab === "campaigns" ? " db-strip-tab--active" : ""}`}
              onClick={() => setActiveTab("campaigns")}
            >
              Campaigns
            </button>
            <button
              className={`db-strip-tab${activeTab === "applications" ? " db-strip-tab--active" : ""}`}
              onClick={() => setActiveTab("applications")}
            >
              Applicants
              {pendingCount > 0 && (
                <span className="db-strip-badge">{pendingCount}</span>
              )}
            </button>
            <button
              className={`db-strip-tab${activeTab === "analytics" ? " db-strip-tab--active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </button>
            <button
              className={`db-strip-tab${activeTab === "payments" ? " db-strip-tab--active" : ""}`}
              onClick={() => setActiveTab("payments")}
            >
              Payments
            </button>
            <button
              className={`db-strip-tab${activeTab === "settings" ? " db-strip-tab--active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
            <div style={{ flex: 1 }} />
            <a href="/merchant/campaigns/new" className="db-new-campaign-btn">
              + New Campaign
            </a>
          </div>

          {/* Tab content */}
          <div className="db-tab-content">
            {activeTab === "campaigns" && (
              <CampaignsTab
                campaigns={campaigns}
                applications={applications}
                loading={campaignsLoading}
                error={error}
              />
            )}
            {activeTab === "applications" && (
              <ApplicationsTab
                applications={applications}
                onAccept={handleAccept}
                onReject={handleReject}
                onApprove={handleApprove}
              />
            )}
            {activeTab === "analytics" && (
              <AnalyticsTab
                campaigns={campaigns}
                applications={applications}
                analytics={analytics}
                isDemo={isDemo}
              />
            )}
            {activeTab === "payments" && <PaymentsTab isDemo={isDemo} />}
            {activeTab === "settings" && <SettingsTab merchant={merchant} />}
          </div>
        </main>
      </div>
    </div>
  );
}
