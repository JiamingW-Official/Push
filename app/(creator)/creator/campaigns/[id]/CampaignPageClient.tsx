"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
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

/* ── Tier helpers ────────────────────────────────────────── */

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

const CATEGORY_BG: Record<string, string> = {
  "Food & Drink": "#003049",
  Lifestyle: "#780000",
  Beauty: "#c1121f",
  Fashion: "#002035",
  Fitness: "#003049",
  Tech: "#002035",
};

/* ── Milestones ──────────────────────────────────────────── */

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

/* ── Demo data ───────────────────────────────────────────── */

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

/* ── Helpers ─────────────────────────────────────────────── */

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

function getMerchantInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ── Milestone Track ─────────────────────────────────────── */

function MilestoneTrack({ current }: { current: MilestoneStatus }) {
  const currentIdx = MILESTONE_ORDER.indexOf(current);
  return (
    <div className="cp-milestone-track">
      <p className="cp-milestone-header">Campaign Progress</p>
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

/* ── Milestone Action Area ───────────────────────────────── */

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
    <div className="cp-action-area">
      <span className="cp-action-label">{step.label}</span>
      <button type="button" className="cp-action-btn cp-action-btn--primary">
        {step.cta}
      </button>
      {step.secondary && (
        <button
          type="button"
          className="cp-action-btn cp-action-btn--secondary"
        >
          {step.secondary}
        </button>
      )}
    </div>
  );
}

/* ── Requirements Checklist ──────────────────────────────── */

function RequirementsChecklist({ requirements }: { requirements: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    requirements.map(() => false),
  );

  function toggle(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="cp-requirements">
      {requirements.map((req, i) => (
        <div
          key={i}
          className={`cp-req-item${checked[i] ? " cp-req-item--checked" : ""}`}
          onClick={() => toggle(i)}
          role="checkbox"
          aria-checked={checked[i]}
          tabIndex={0}
          onKeyDown={(e) => e.key === " " && toggle(i)}
        >
          <div className="cp-req-checkbox" aria-hidden="true" />
          <span className="cp-req-number">{i + 1}</span>
          <span className="cp-req-text">{req}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

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
  const [urlInput, setUrlInput] = useState("");

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

  /* ── Loading / Error states ────────────────────────────── */

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

  /* ── Derived values ────────────────────────────────────── */

  const eligible = creator
    ? isEligible(creator.tier, campaign.tier_required)
    : false;
  const creatorTier = creator?.tier ?? "seed";
  const commission = TIER_COMMISSION[creatorTier];
  const spotsFillPct = Math.round(
    ((campaign.spots_total - campaign.spots_remaining) / campaign.spots_total) *
      100,
  );
  const heroBg = CATEGORY_BG[campaign.category] ?? "#003049";
  const noCommission = creatorTier === "seed" || creatorTier === "explorer";
  const campaignsToOperator = Math.max(
    0,
    3 - (creator?.campaigns_completed ?? 0),
  );
  const days = daysRemaining(campaign.deadline);
  const isUrgent = days <= 7;
  const isCritical = days <= 3;

  let btnLabel = "Apply Now";
  let btnClass = "apply-btn apply-btn--default";
  let btnDisabled = false;
  if (applied) {
    btnLabel = "Applied ✓";
    btnClass = "apply-btn apply-btn--applied";
    btnDisabled = true;
  } else if (!eligible) {
    btnLabel = `Unlock at ${TIER_LABELS[campaign.tier_required]} tier`;
    btnClass = "apply-btn apply-btn--locked";
    btnDisabled = true;
  } else if (applying) {
    btnLabel = "Applying…";
    btnDisabled = true;
  }

  const statusLabel = campaign.status === "active" ? "Active" : campaign.status;
  const statusMod =
    campaign.status === "active"
      ? "active"
      : campaign.status === "completed"
        ? "completed"
        : "pending";

  /* ── Render ────────────────────────────────────────────── */

  return (
    <div className="campaign-page">
      <Link href="/creator/dashboard" className="campaign-back">
        ← Back to Campaigns
      </Link>

      {/* ── Campaign Header ─────────────────────────────── */}
      <div className="cp-header">
        <div className="cp-header-inner">
          {/* Top: logo + title + status/payout */}
          <div className="cp-header-top">
            {/* Merchant logo */}
            <div className="cp-merchant-logo" aria-hidden="true">
              {getMerchantInitials(campaign.business_name)}
            </div>

            {/* Title group */}
            <div className="cp-header-title-group">
              <h1 className="cp-title">{campaign.title}</h1>
              <p className="cp-business">
                {campaign.business_name}
                <span className="cp-business-addr">
                  {campaign.business_address}
                </span>
              </p>
              <div className="cp-meta">
                <span className="cp-meta-badge cp-meta-badge--category">
                  {campaign.category}
                </span>
                <TierBadge
                  tier={campaign.tier_required}
                  size="sm"
                  variant="outlined"
                />
                <span className="cp-meta-divider" aria-hidden="true" />
                {campaign.payout === 0 ? (
                  <span className="cp-meta-badge cp-meta-badge--free">
                    Free Product
                  </span>
                ) : (
                  <span className="cp-meta-badge cp-meta-badge--payout">
                    ${campaign.payout} base
                    {commission > 0 && ` + ${commission}% commission`}
                  </span>
                )}
              </div>
            </div>

            {/* Status + expected payout */}
            <div className="cp-header-status-group">
              <div
                className={`cp-status-badge cp-status-badge--${statusMod}`}
                role="status"
              >
                <span className="cp-status-dot" />
                {statusLabel}
              </div>
              <div className="cp-expected-payout">
                {campaign.payout === 0 ? (
                  <span className="cp-payout-number cp-payout-number--free">
                    Free
                  </span>
                ) : (
                  <span className="cp-payout-number">
                    ${campaign.payout}
                    {commission > 0 && (
                      <sup
                        style={{ fontSize: "0.45em", verticalAlign: "super" }}
                      >
                        +{commission}%
                      </sup>
                    )}
                  </span>
                )}
                <span className="cp-payout-sublabel">
                  {campaign.payout === 0 ? "product trade" : "per campaign"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer: countdown + spots */}
          <div className="cp-header-footer">
            <div className="cp-countdown">
              <span
                className={[
                  "cp-countdown-number",
                  isCritical ? "cp-countdown-number--urgent" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {days}
              </span>
              <span className="cp-countdown-label">
                {days === 1 ? "day left" : "days left"} &mdash;{" "}
                {formatDeadline(campaign.deadline)}
                {isUrgent && !isCritical && (
                  <span
                    style={{
                      marginLeft: 8,
                      color: "rgba(201,169,110,0.9)",
                      fontSize: "9px",
                    }}
                  >
                    · CLOSING SOON
                  </span>
                )}
                {isCritical && (
                  <span
                    style={{
                      marginLeft: 8,
                      color: "var(--primary, #c1121f)",
                      fontSize: "9px",
                    }}
                  >
                    · URGENT
                  </span>
                )}
              </span>
            </div>
            <div className="cp-spots-indicator">
              <div className="cp-spots-text">
                <span>Spots Remaining</span>
                <span>
                  {campaign.spots_remaining} / {campaign.spots_total}
                </span>
              </div>
              <div className="cp-spots-bar">
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
      </div>

      {/* ── Milestone Track (applied) ─────────────────────── */}
      {applied && milestone && <MilestoneTrack current={milestone} />}

      {/* ── Hero image (not applied) ──────────────────────── */}
      {!applied && (
        <div className="campaign-hero" style={{ background: heroBg }}>
          {campaign.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={campaign.image}
              alt={campaign.title}
              className="campaign-hero-img"
            />
          ) : (
            <div className="campaign-hero-placeholder" />
          )}
          <div className="campaign-chips">
            <span className="campaign-chip">{campaign.category}</span>
            <span className="campaign-chip campaign-chip--tier">
              {TIER_LABELS[campaign.tier_required]}+
            </span>
          </div>
        </div>
      )}

      {/* ── Body grid: main + sidebar ─────────────────────── */}
      <div className="campaign-body">
        {/* ── Main column ─────────────────────────────────── */}
        <div className="campaign-main">
          {/* Campaign Brief */}
          <div>
            <p className="campaign-section-label">Campaign Brief</p>
            <p className="campaign-desc">{campaign.description}</p>
          </div>

          {/* Requirements checklist */}
          <div>
            <p className="campaign-section-label">Requirements</p>
            <RequirementsChecklist requirements={campaign.requirements} />
          </div>

          {/* Submission area (when applied) */}
          {applied && (
            <div>
              <p className="campaign-section-label">Submit Your Content</p>
              <div className="cp-submit-area">
                <div className="cp-upload-icon" aria-hidden="true" />
                <p className="cp-submit-title">Drop files or paste a URL</p>
                <p className="cp-submit-sub">
                  Upload your content file or link your published post
                </p>
                <div className="cp-url-row">
                  <input
                    type="url"
                    className="cp-url-input"
                    placeholder="https://instagram.com/p/..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    aria-label="Content URL"
                  />
                  <button
                    type="button"
                    className="cp-url-btn"
                    disabled={!urlInput.trim()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Business info */}
          <div className="campaign-biz-info">
            <p className="campaign-section-label">Business Info</p>
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
            <div className="cp-map-placeholder" aria-label="Map placeholder">
              <span aria-hidden="true">&#9679;</span>
              {campaign.business_name}
            </div>
          </div>

          {/* Milestone action area (applied) */}
          {applied && milestone && (
            <MilestoneActionArea milestone={milestone} />
          )}

          {/* QR Attribution note */}
          <div className="campaign-qr-note">
            <span className="campaign-qr-icon" aria-hidden="true">
              &#9632;
            </span>
            <div>
              <strong>QR Attribution</strong>
              <p>
                Push generates a unique QR code for your campaign. When
                customers scan it after seeing your content, it attributes the
                visit to you — that&apos;s how your commission is calculated.
              </p>
            </div>
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────────── */}
        <aside className="campaign-sidebar-card">
          {/* Payout */}
          <div className="cp-sidebar-section">
            <div className="campaign-payout">
              {campaign.payout === 0 ? (
                <>
                  <span className="campaign-payout-amount campaign-payout-amount--free">
                    Free
                  </span>
                  <span className="campaign-payout-label">Product (trade)</span>
                </>
              ) : (
                <>
                  <span className="campaign-payout-amount">
                    ${campaign.payout}
                  </span>
                  <span className="campaign-payout-label">per campaign</span>
                </>
              )}
            </div>
            {commission > 0 && (
              <div className="campaign-commission-row">
                <span>+</span>
                <span className="campaign-commission-pct">{commission}%</span>
                <span>walk-in commission</span>
              </div>
            )}
          </div>

          {/* Spots */}
          <div className="cp-sidebar-section">
            <div className="campaign-spots">
              <div className="campaign-spots-meta">
                <span>Spots Remaining</span>
                <span>
                  {campaign.spots_remaining} / {campaign.spots_total}
                </span>
              </div>
              <div className="campaign-spots-bar">
                <div
                  className="campaign-spots-fill"
                  style={{ width: `${spotsFillPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div className="cp-sidebar-section">
            <div className="campaign-deadline">
              <span className="campaign-deadline-label">Deadline</span>
              <span
                className="campaign-deadline-value"
                style={isCritical ? { color: "var(--primary, #c1121f)" } : {}}
              >
                {isCritical
                  ? `${days} DAYS LEFT`
                  : formatDeadline(campaign.deadline)}
              </span>
            </div>
          </div>

          {/* Tier required */}
          <div className="cp-sidebar-section">
            <div className="campaign-deadline">
              <span className="campaign-deadline-label">Tier Required</span>
              <TierBadge
                tier={campaign.tier_required}
                size="sm"
                variant="subtle"
              />
            </div>
          </div>

          {/* Eligibility */}
          <div className="cp-sidebar-section">
            <div className="campaign-eligibility">
              {eligible ? (
                <>
                  <span
                    className="campaign-elig-icon campaign-elig-icon--ok"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>
                    You qualify ({creator ? TIER_LABELS[creator.tier] : ""}{" "}
                    tier)
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="campaign-elig-icon campaign-elig-icon--lock"
                    aria-hidden="true"
                  >
                    —
                  </span>
                  <span>
                    Requires {TIER_LABELS[campaign.tier_required]} tier
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Apply button */}
          <div className="cp-sidebar-section">
            <button
              className={btnClass}
              disabled={btnDisabled}
              onClick={handleApply}
              aria-label={btnLabel}
              type="button"
            >
              {btnLabel}
            </button>
            {eligible && !applied && (
              <p className="commission-note" style={{ marginTop: 12 }}>
                {noCommission ? (
                  <>
                    No commission at your tier.{" "}
                    {campaignsToOperator > 0
                      ? `Complete ${campaignsToOperator} more campaign${campaignsToOperator !== 1 ? "s" : ""} to reach Operator and unlock 3% commission.`
                      : "Reach Operator tier to unlock 3% commission."}
                  </>
                ) : (
                  <>You earn {commission}% on each walk-in you drive</>
                )}
              </p>
            )}
            {applied && (
              <p className="commission-note" style={{ marginTop: 12 }}>
                Application submitted. The merchant will review and confirm.
              </p>
            )}
          </div>

          {/* Stats when completed */}
          {milestone === "settled" && (
            <div className="cp-stats-grid">
              <div className="cp-stat-cell">
                <span className="cp-stat-value">
                  {campaign.payout > 0 ? `$${campaign.payout}` : "—"}
                </span>
                <span className="cp-stat-label">Earned</span>
                {campaign.payout > 0 && (
                  <span className="cp-stat-compare">+12% vs avg</span>
                )}
              </div>
              <div className="cp-stat-cell">
                <span className="cp-stat-value">—</span>
                <span className="cp-stat-label">Scans</span>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ── Campaign Checklist ───────────────────────────── */}
      {applied && campaign && (
        <div style={{ marginTop: 24 }}>
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
