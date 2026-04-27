"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/db/browser";
import { CampaignChecklist } from "@/components/creator/CampaignChecklist";
import { TierBadge } from "@/components/creator/TierBadge";
import "./campaign.css";

/* ── Types ───────────────────────────────────────────────── */

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type MilestoneStatus =
  | "accepted"
  | "scheduled"
  | "visited"
  | "proof_submitted"
  | "content_published"
  | "verified"
  | "settled";

type Campaign = {
  id: string;
  title: string;
  description: string;
  business_name: string;
  business_address: string;
  payout: number;
  spots_total: number;
  spots_remaining: number;
  deadline: string;
  status: string;
  category: string;
  image?: string;
  tier_required: CreatorTier;
  requirements: string[];
  lat: number;
  lng: number;
  merchant_id: string;
};

type Creator = {
  id: string;
  tier: CreatorTier;
  push_score: number;
  campaigns_completed: number;
  name: string;
};

/* ── Demo mode ───────────────────────────────────────────── */

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

/* ── Tier order ──────────────────────────────────────────── */

const TIER_ORDER: CreatorTier[] = [
  "seed",
  "explorer",
  "operator",
  "proven",
  "closer",
  "partner",
];

const TIER_LABELS: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

const TIER_COMMISSION: Record<CreatorTier, number> = {
  seed: 0,
  explorer: 0,
  operator: 3,
  proven: 5,
  closer: 7,
  partner: 10,
};

const MILESTONES: { key: MilestoneStatus; label: string }[] = [
  { key: "accepted", label: "Accepted" },
  { key: "scheduled", label: "Scheduled" },
  { key: "visited", label: "Visited" },
  { key: "proof_submitted", label: "Proof" },
  { key: "content_published", label: "Published" },
  { key: "verified", label: "Verified" },
  { key: "settled", label: "Settled" },
];

const MILESTONE_ORDER: MilestoneStatus[] = MILESTONES.map((m) => m.key);

const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: "demo-campaign-001",
    merchant_id: "demo-merchant-001",
    title: "Free Latte for a 30-Second Reel",
    description:
      "Come in, order any latte, and capture a 30-second Reel showing your experience — from ordering to that first sip. Free product provided; no cash payout.",
    payout: 0,
    spots_total: 12,
    spots_remaining: 8,
    deadline: "2026-04-20T23:59:00Z",
    status: "active",
    lat: 40.7265,
    lng: -74.0044,
    category: "Food & Drink",
    business_name: "Blank Street Coffee",
    business_address: "284 W Broadway, New York, NY 10013",
    requirements: [
      "Post within 48h of visit",
      "Tag @blankstreetcoffee",
      "Min 30 seconds, no cuts",
    ],
    tier_required: "seed",
  },
  {
    id: "demo-campaign-002",
    merchant_id: "demo-merchant-002",
    title: "TikTok Walk-through — Spring Menu",
    description:
      "Walk us through Superiority Burger's newly launched spring menu. Show 3+ items, share your honest thoughts, and make it feel like a friend recommendation.",
    payout: 35,
    spots_total: 5,
    spots_remaining: 3,
    deadline: "2026-04-22T23:59:00Z",
    status: "active",
    lat: 40.7306,
    lng: -73.9879,
    category: "Food & Drink",
    business_name: "Superiority Burger",
    business_address: "119 Avenue A, New York, NY 10009",
    requirements: [
      "Feature at least 3 menu items",
      "Tag @superiorityburger",
      "Post within 72h of visit",
    ],
    tier_required: "explorer",
  },
  {
    id: "demo-campaign-003",
    merchant_id: "demo-merchant-003",
    title: "Instagram Stories — Grand Opening",
    description:
      "Flamingo Estate NYC just opened its first Manhattan outpost. Cover the grand opening with a 5-frame Instagram Stories series — decor, product displays, and the vibe.",
    payout: 75,
    spots_total: 8,
    spots_remaining: 5,
    deadline: "2026-04-17T23:59:00Z",
    status: "active",
    lat: 40.7193,
    lng: -73.9987,
    category: "Lifestyle",
    business_name: "Flamingo Estate NYC",
    business_address: "67 Gansevoort St, New York, NY 10014",
    requirements: [
      "Minimum 5 Story frames",
      "Tag @flamingoestate",
      "Include location sticker",
    ],
    tier_required: "explorer",
  },
  {
    id: "demo-campaign-004",
    merchant_id: "demo-merchant-004",
    title: "Before & After — Brow Lamination",
    description:
      "Show the full brow lamination journey at Brow Theory. We want a clear before shot, in-treatment clips, and the finished result — ideally a Reel or TikTok.",
    payout: 50,
    spots_total: 4,
    spots_remaining: 2,
    deadline: "2026-04-25T23:59:00Z",
    status: "active",
    lat: 40.7219,
    lng: -73.9956,
    category: "Beauty",
    business_name: "Brow Theory",
    business_address: "38 Prince St, New York, NY 10012",
    requirements: [
      "Include clear before & after",
      "Tag @browtheorynyc",
      "Post within 48h of treatment",
    ],
    tier_required: "operator",
  },
  {
    id: "demo-campaign-005",
    merchant_id: "demo-merchant-005",
    title: "GRWM Reel — Morning Routine",
    description:
      "Partner with Glossier Flagship to create a Get Ready With Me Reel featuring products from their Spring 2026 lineup. Show the full routine, from skincare to finish.",
    payout: 120,
    spots_total: 6,
    spots_remaining: 4,
    deadline: "2026-04-17T23:59:00Z",
    status: "active",
    lat: 40.7248,
    lng: -74.0018,
    category: "Beauty",
    business_name: "Glossier Flagship",
    business_address: "123 Lafayette St, New York, NY 10013",
    requirements: [
      "Feature min 3 Glossier products",
      "Tag @glossier",
      "Min 45 seconds, posted within 48h",
    ],
    tier_required: "operator",
  },
  {
    id: "demo-campaign-006",
    merchant_id: "demo-merchant-006",
    title: "Croissant Review — Weekend Special",
    description:
      "Le Bec Fin Bakery wants authentic weekend croissant reviews. Grab the weekend special, film your honest first bite, and share the vibe of the bakery on a Saturday morning.",
    payout: 20,
    spots_total: 10,
    spots_remaining: 6,
    deadline: "2026-04-19T23:59:00Z",
    status: "active",
    lat: 40.7175,
    lng: -74.0012,
    category: "Food & Drink",
    business_name: "Le Bec Fin Bakery",
    business_address: "214 Hudson St, New York, NY 10013",
    requirements: [
      "Must be filmed on a weekend",
      "Tag @lebecfinnyc",
      "Post within 24h",
    ],
    tier_required: "seed",
  },
  {
    id: "demo-campaign-007",
    merchant_id: "demo-merchant-007",
    title: "Unboxing Reel — New Streetwear Drop",
    description:
      "KITH NYC is dropping a limited streetwear collection. We need creators to film an in-store unboxing Reel showcasing the packaging, pieces, and the in-store experience.",
    payout: 199,
    spots_total: 3,
    spots_remaining: 2,
    deadline: "2026-04-30T23:59:00Z",
    status: "active",
    lat: 40.7236,
    lng: -73.9965,
    category: "Fashion",
    business_name: "KITH NYC",
    business_address: "233 Lafayette St, New York, NY 10012",
    requirements: [
      "Feature at least 3 pieces from the drop",
      "Tag @kith",
      "Post within 24h of filming",
    ],
    tier_required: "proven",
  },
  {
    id: "demo-campaign-008",
    merchant_id: "demo-merchant-008",
    title: "Matcha Review + Ambiance Video",
    description:
      "Capture the full Cha Cha Matcha experience — the neon-lit interior, the ceremony of the pour, and your honest matcha review. Perfect for a chill weekday afternoon post.",
    payout: 25,
    spots_total: 12,
    spots_remaining: 10,
    deadline: "2026-04-28T23:59:00Z",
    status: "active",
    lat: 40.7242,
    lng: -74.0051,
    category: "Food & Drink",
    business_name: "Cha Cha Matcha",
    business_address: "373 Broadway, New York, NY 10013",
    requirements: [
      "Include interior ambiance footage",
      "Tag @chachamatcha",
      "Min 15 seconds",
    ],
    tier_required: "seed",
  },
];

const DEMO_CREATOR: Creator = {
  id: "demo-creator-001",
  tier: "operator",
  push_score: 68,
  campaigns_completed: 7,
  name: "Alex Rivera",
};

const DEMO_MILESTONE_BY_CAMPAIGN: Record<string, MilestoneStatus> = {
  "demo-campaign-001": "accepted",
  "demo-campaign-002": "visited",
  "demo-campaign-003": "proof_submitted",
  "demo-campaign-004": "content_published",
  "demo-campaign-005": "accepted",
  "demo-campaign-006": "scheduled",
  "demo-campaign-007": "accepted",
  "demo-campaign-008": "accepted",
};

function formatDeadline(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function daysRemaining(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function isEligible(creatorTier: CreatorTier, required: CreatorTier): boolean {
  return TIER_ORDER.indexOf(creatorTier) >= TIER_ORDER.indexOf(required);
}

/* ── Milestone progress tracker ──────────────────────────── */
function MilestoneTrack({ current }: { current: MilestoneStatus }) {
  const currentIdx = MILESTONE_ORDER.indexOf(current);
  return (
    <div className="cp-milestone-track candy-panel">
      <p
        className="eyebrow"
        style={{ marginBottom: 16, color: "var(--ink-3)" }}
      >
        CAMPAIGN PROGRESS
      </p>
      <div className="cp-milestone-steps">
        {MILESTONES.map((m, i) => {
          const isDone = i < currentIdx;
          const isActive = i === currentIdx;
          return (
            <div key={m.key} className="cp-milestone-step-wrap">
              {i < MILESTONES.length - 1 && (
                <div
                  className={[
                    "cp-milestone-line",
                    isDone
                      ? "cp-milestone-line--done"
                      : "cp-milestone-line--dashed",
                  ].join(" ")}
                />
              )}
              <div
                className={[
                  "cp-milestone-step",
                  isDone ? "cp-milestone-step--done" : "",
                  isActive ? "cp-milestone-step--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
              <span
                className={[
                  "cp-milestone-label",
                  isDone ? "cp-milestone-label--done" : "",
                  isActive ? "cp-milestone-label--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Milestone action area ────────────────────────────────── */
function MilestoneActionArea({ milestone }: { milestone: MilestoneStatus }) {
  const config: Record<
    MilestoneStatus,
    { label: string; cta: string; secondary?: string } | null
  > = {
    accepted: {
      label: "Next Step",
      cta: "Schedule Your Visit",
      secondary: "View Business Info",
    },
    scheduled: {
      label: "Your Visit is Scheduled",
      cta: "Submit Visit Proof",
      secondary: "Reschedule",
    },
    visited: { label: "You Visited — Submit Proof", cta: "Submit Proof" },
    proof_submitted: {
      label: "Proof Under Review — Publish Your Content",
      cta: "Submit Content Link",
    },
    content_published: {
      label: "Content Submitted — Awaiting Verification",
      cta: "View Submission",
      secondary: "Contact Support",
    },
    verified: {
      label: "Verified — Payout Processing",
      cta: "View Payout Status",
    },
    settled: null,
  };
  const step = config[milestone];
  if (!step) return null;
  return (
    <div className="cp-action-area candy-panel">
      <p
        className="eyebrow"
        style={{ marginBottom: 16, color: "var(--ink-3)" }}
      >
        {step.label}
      </p>
      <div className="cp-action-btns">
        <button className="btn-primary click-shift cp-action-btn-full">
          {step.cta}
        </button>
        {step.secondary && (
          <button className="btn-ghost click-shift cp-action-btn-full">
            {step.secondary}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [isDemo] = useState<boolean>(() => checkDemoMode());
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<MilestoneStatus | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      if (isDemo) {
        const found =
          DEMO_CAMPAIGNS.find((c) => c.id === id) ?? DEMO_CAMPAIGNS[0];
        setCampaign(found);
        setCreator(DEMO_CREATOR);
        const demoMilestone = DEMO_MILESTONE_BY_CAMPAIGN[found.id];
        if (demoMilestone) {
          setApplied(true);
          setMilestone(demoMilestone);
        }
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("Please sign in to view this campaign.");
          setLoading(false);
          return;
        }
        const { data: camp, error: campErr } = await supabase
          .from("campaigns")
          .select("*")
          .eq("id", id)
          .single();
        if (campErr || !camp) {
          setError("Campaign not found.");
          setLoading(false);
          return;
        }
        setCampaign(camp as Campaign);
        const { data: creatorData } = await supabase
          .from("creators")
          .select("id, tier, push_score, campaigns_completed, name")
          .eq("user_id", user.id)
          .single();
        if (creatorData) setCreator(creatorData as Creator);
        const { data: existingApp } = await supabase
          .from("campaign_applications")
          .select("id, status")
          .eq("campaign_id", id)
          .eq("creator_id", creatorData?.id ?? "")
          .maybeSingle();
        if (existingApp) {
          setApplied(true);
          if (existingApp.status)
            setMilestone(existingApp.status as MilestoneStatus);
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isDemo]);

  async function handleApply() {
    if (!campaign || !creator || applying || applied) return;
    setApplying(true);
    if (isDemo) {
      await new Promise((r) => setTimeout(r, 600));
      setApplied(true);
      setMilestone("accepted");
      setApplying(false);
      return;
    }
    try {
      const supabase = createClient();
      await supabase.from("campaign_applications").insert({
        campaign_id: campaign.id,
        creator_id: creator.id,
        merchant_id: campaign.merchant_id,
        status: "pending",
        payout: campaign.payout,
      });
      await supabase.from("creator_submissions").insert({
        campaign_id: campaign.id,
        creator_id: creator.id,
        status: "pending",
      });
      setApplied(true);
    } catch {
      setError("Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  }

  /* ── Loading / Error states ─────────────────────────────── */
  if (loading)
    return (
      <div className="campaign-page">
        <div className="campaign-loading">Loading campaign…</div>
      </div>
    );
  if (error || !campaign)
    return (
      <div className="campaign-page">
        <Link href="/creator/dashboard" className="campaign-back">
          ← Back to Campaigns
        </Link>
        <div className="campaign-error">{error ?? "Campaign not found."}</div>
      </div>
    );

  /* ── Derived state ──────────────────────────────────────── */
  const eligible = creator
    ? isEligible(creator.tier, campaign.tier_required)
    : false;
  const creatorTier = creator?.tier ?? "seed";
  const commission = TIER_COMMISSION[creatorTier];
  const spotsFillPct = Math.round(
    ((campaign.spots_total - campaign.spots_remaining) / campaign.spots_total) *
      100,
  );
  const noCommission = creatorTier === "seed" || creatorTier === "explorer";
  const campaignsToOperator = Math.max(
    0,
    3 - (creator?.campaigns_completed ?? 0),
  );
  const days = daysRemaining(campaign.deadline);
  const isUrgent = days <= 3;

  let btnLabel = "Apply Now";
  let btnClass = "btn-primary click-shift cp-apply-btn";
  let btnDisabled = false;
  if (applied) {
    btnLabel = "Applied";
    btnClass = "cp-apply-btn cp-apply-btn--applied";
    btnDisabled = true;
  } else if (!eligible) {
    btnLabel = `Requires ${TIER_LABELS[campaign.tier_required]}`;
    btnClass = "cp-apply-btn cp-apply-btn--locked";
    btnDisabled = true;
  } else if (applying) {
    btnLabel = "Applying…";
    btnDisabled = true;
  }

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="campaign-page">
      {/* ── Back link ──────────────────────────────────────── */}
      <Link href="/creator/dashboard" className="campaign-back click-shift">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Campaigns
      </Link>

      {/* ── Page header card ───────────────────────────────── */}
      <div className="cp-header candy-panel">
        {/* Status badge row */}
        <div className="cp-header-badges">
          <span
            className={[
              "cp-status-badge",
              campaign.status === "active"
                ? "cp-status-badge--active"
                : "cp-status-badge--default",
            ].join(" ")}
          >
            {campaign.status.toUpperCase()}
          </span>
          <span className="cp-category-badge">{campaign.category}</span>
          <TierBadge
            tier={campaign.tier_required}
            size="sm"
            variant="outlined"
          />
        </div>

        {/* Title + business */}
        <h1 className="cp-title">{campaign.title}</h1>
        <p className="cp-business-name">{campaign.business_name}</p>
        <p className="cp-business-addr">{campaign.business_address}</p>

        {/* Stats row */}
        <div className="cp-stats-row">
          {/* Days remaining */}
          <div className="cp-stat-card candy-panel">
            <span className="eyebrow" style={{ color: "var(--ink-3)" }}>
              DAYS REMAINING
            </span>
            <span
              className={[
                "cp-stat-number",
                isUrgent ? "cp-stat-number--urgent" : "",
              ].join(" ")}
            >
              {days}
            </span>
            <span className="cp-stat-sub">
              {formatDeadline(campaign.deadline)}
            </span>
          </div>

          {/* Payout */}
          <div className="cp-stat-card candy-panel">
            <span className="eyebrow" style={{ color: "var(--ink-3)" }}>
              {campaign.payout === 0 ? "REWARD" : "BASE PAYOUT"}
            </span>
            <span className="cp-stat-number cp-stat-number--payout">
              {campaign.payout === 0 ? "Free" : `$${campaign.payout}`}
            </span>
            {commission > 0 && (
              <span className="cp-stat-sub">+{commission}% commission</span>
            )}
          </div>

          {/* Spots */}
          <div className="cp-stat-card candy-panel">
            <span className="eyebrow" style={{ color: "var(--ink-3)" }}>
              SPOTS
            </span>
            <span className="cp-stat-number">
              {campaign.spots_remaining}
              <span className="cp-stat-number-denom">
                /{campaign.spots_total}
              </span>
            </span>
            <div
              className="cp-spots-bar"
              role="progressbar"
              aria-valuenow={spotsFillPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={[
                  "cp-spots-fill",
                  spotsFillPct >= 70
                    ? "cp-spots-fill--low"
                    : "cp-spots-fill--mid",
                ].join(" ")}
                style={{ width: `${spotsFillPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Milestone tracker (if applied) ─────────────────── */}
      {applied && milestone && <MilestoneTrack current={milestone} />}

      {/* ── Body grid ──────────────────────────────────────── */}
      <div className="campaign-body">
        {/* ── Main column ──────────────────────────────────── */}
        <div className="campaign-main">
          {/* About section */}
          <div className="cp-section candy-panel">
            <p className="eyebrow cp-section-eyebrow">ABOUT THIS CAMPAIGN</p>
            <p className="campaign-desc">{campaign.description}</p>
          </div>

          {/* Requirements section */}
          <div className="cp-section candy-panel">
            <p className="eyebrow cp-section-eyebrow">REQUIREMENTS</p>
            <div className="cp-requirements">
              {campaign.requirements.map((req, i) => (
                <div key={i} className="cp-req-item">
                  <span className="cp-req-check" aria-hidden="true">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5L4.5 8.5L11 1"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="cp-req-number">{i + 1}</span>
                  <span className="cp-req-text">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Business info section */}
          <div className="cp-section candy-panel">
            <p className="eyebrow cp-section-eyebrow">BUSINESS INFO</p>
            <dl className="campaign-biz-dl">
              <div className="campaign-biz-row">
                <dt>Address</dt>
                <dd>{campaign.business_address}</dd>
              </div>
              <div className="campaign-biz-row">
                <dt>Category</dt>
                <dd>{campaign.category}</dd>
              </div>
            </dl>
            <div className="cp-map-placeholder" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="7"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 2C5.24 2 3 4.24 3 7c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              {campaign.business_name}
            </div>
          </div>

          {/* QR attribution note */}
          <div className="cp-qr-note candy-panel">
            <div className="cp-qr-icon-wrap" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="11"
                  y="2"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="2"
                  y="11"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect x="13" y="13" width="2" height="2" fill="currentColor" />
                <rect x="11" y="11" width="2" height="2" fill="currentColor" />
                <rect x="15" y="11" width="2" height="2" fill="currentColor" />
                <rect x="11" y="15" width="4" height="2" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p
                className="eyebrow"
                style={{ marginBottom: 4, color: "var(--accent-blue)" }}
              >
                QR ATTRIBUTION
              </p>
              <p className="cp-qr-text">
                Push generates a unique QR code for your campaign. When
                customers scan it after seeing your content, it attributes the
                visit to you — that&apos;s how your commission is calculated.
              </p>
            </div>
          </div>

          {/* Action area for active milestone */}
          {applied && milestone && (
            <MilestoneActionArea milestone={milestone} />
          )}
        </div>

        {/* ── Sidebar ──────────────────────────────────────── */}
        <aside className="campaign-sidebar-card candy-panel">
          {/* Payout display */}
          <div className="cp-sidebar-payout">
            {campaign.payout === 0 ? (
              <>
                <span className="cp-payout-amount cp-payout-amount--free">
                  Free
                </span>
                <span className="cp-payout-label">product (trade)</span>
              </>
            ) : (
              <>
                <span className="cp-payout-amount">${campaign.payout}</span>
                <span className="cp-payout-label">per campaign</span>
              </>
            )}
          </div>

          {commission > 0 && (
            <div className="cp-commission-row">
              <span className="cp-commission-plus">+</span>
              <span className="cp-commission-pct">{commission}%</span>
              <span className="cp-commission-label">walk-in commission</span>
            </div>
          )}

          <div className="cp-sidebar-divider" />

          {/* Spots */}
          <div className="cp-sidebar-row">
            <span className="cp-sidebar-row-label">SPOTS</span>
            <span className="cp-sidebar-row-value">
              {campaign.spots_remaining} / {campaign.spots_total} remaining
            </span>
          </div>

          {/* Deadline */}
          <div className="cp-sidebar-row">
            <span className="cp-sidebar-row-label">DEADLINE</span>
            <span className="cp-sidebar-row-value">
              {formatDeadline(campaign.deadline)}
            </span>
          </div>

          {/* Tier required */}
          <div className="cp-sidebar-row cp-sidebar-row--tier">
            <span className="cp-sidebar-row-label">TIER REQUIRED</span>
            <TierBadge
              tier={campaign.tier_required}
              size="sm"
              variant="subtle"
            />
          </div>

          <div className="cp-sidebar-divider" />

          {/* Eligibility indicator */}
          <div className="cp-eligibility">
            {eligible ? (
              <>
                <span
                  className="cp-elig-dot cp-elig-dot--ok"
                  aria-hidden="true"
                />
                <span className="cp-elig-text">
                  You qualify ({creator ? TIER_LABELS[creator.tier] : ""})
                </span>
              </>
            ) : (
              <>
                <span
                  className="cp-elig-dot cp-elig-dot--lock"
                  aria-hidden="true"
                />
                <span className="cp-elig-text cp-elig-text--muted">
                  Requires {TIER_LABELS[campaign.tier_required]} tier
                </span>
              </>
            )}
          </div>

          {/* Apply button */}
          <button
            className={btnClass}
            disabled={btnDisabled}
            onClick={handleApply}
            aria-label={btnLabel}
          >
            {btnLabel}
          </button>

          {/* Commission / eligibility note */}
          {eligible && !applied && (
            <p className="cp-commission-note">
              {noCommission ? (
                <>
                  No commission at your tier.{" "}
                  {campaignsToOperator > 0
                    ? `Complete ${campaignsToOperator} more campaign${campaignsToOperator !== 1 ? "s" : ""} to reach Operator and unlock 3%.`
                    : "Reach Operator tier to unlock 3% commission."}
                </>
              ) : (
                <>You earn {commission}% on each walk-in you drive.</>
              )}
            </p>
          )}
          {applied && (
            <p className="cp-commission-note">
              Application submitted. The merchant will review and confirm.
            </p>
          )}
        </aside>
      </div>

      {/* ── Campaign checklist (after apply) ───────────────── */}
      {applied && campaign && (
        <div className="cp-checklist-wrap">
          <CampaignChecklist
            campaignTitle={campaign.title}
            merchantName={campaign.business_name}
            category={campaign.category}
            requirements={campaign.requirements}
            onComplete={() => {}}
            isDemo={isDemo}
          />
        </div>
      )}
    </div>
  );
}
