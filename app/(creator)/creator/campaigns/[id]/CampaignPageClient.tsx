"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { TierBadge } from "@/components/creator/TierBadge";
import "./campaign.css";

/* =================================================================
   Creator Campaign Detail — v5.1 Customer Acquisition Engine
   Vertical AI for Local Commerce (Williamsburg Coffee+ beachhead)
   ConversionOracle™ · DisclosureBot · Two-Segment Creator Economics
   ================================================================= */

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type ApplicationStatus = "none" | "pending" | "accepted" | "posted";

type BusinessHours = { day: string; hours: string; busy?: boolean };

type Campaign = {
  id: string;
  merchant_id: string;
  merchant_name: string;
  merchant_rating: number;
  merchant_reviews: number;
  neighborhood: string;
  category: string;
  aov: string;
  title: string;
  eyebrow: string;
  story: string;
  image_url: string;
  spots_total: number;
  spots_remaining: number;
  applications_count: number;
  avg_payout: number;
  tier_mix: { tier: CreatorTier; count: number }[];
  payout_per_customer: number;
  tier_required: CreatorTier;
  min_push_score: number;
  deadline: string;
  capture_checklist: string[];
  disclosure_tags: string[];
  platform_disclosure: Record<string, string>;
  hero_offer: string;
  sustained_offer: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  instagram: string;
  hours: BusinessHours[];
  crowd_heatmap: number[]; // 7 buckets: Early AM / AM / Late AM / Noon / Early PM / PM / Evening
  past_campaigns: number;
  creator_reviews: { creator: string; tier: CreatorTier; text: string }[];
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

// v4.1 Tier Identity colors (from Design.md)
const TIER_COLOR: Record<CreatorTier, string> = {
  seed: "#b8a99a",
  explorer: "#8c6239",
  operator: "#4a5568",
  proven: "#c9a96e",
  closer: "#9b111e",
  partner: "#1a1a2e",
};

/* ── Demo data ─────────────────────────────────────────────
   Williamsburg Coffee+ beachhead — AOV $8-20 realistic data
   ────────────────────────────────────────────────────────── */

const DEMO_CAMPAIGNS: Record<string, Campaign> = {
  "demo-campaign-001": {
    id: "demo-campaign-001",
    merchant_id: "demo-merchant-001",
    merchant_name: "Devoción Williamsburg",
    merchant_rating: 4.7,
    merchant_reviews: 312,
    neighborhood: "Williamsburg",
    category: "Coffee+",
    aov: "$11",
    title: "Saturday Morning Ritual — Single Origin + Pastry",
    eyebrow: "Williamsburg · Coffee+",
    story:
      "Devoción roasts 10-day fresh Colombian beans inside a plant-filled 6,000 sq ft Williamsburg flagship. We are piloting the Customer Acquisition Engine to bring 120 verified new walk-ins across the next 60 days — and we want our brief to feel like a neighbor's Saturday recommendation, not an ad. Capture your barista interaction, the light hitting the atrium, and your honest first sip. The Neighborhood Playbook is built for this exact moment.",
    image_url:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80",
    spots_total: 12,
    spots_remaining: 7,
    applications_count: 19,
    avg_payout: 38,
    tier_mix: [
      { tier: "seed", count: 4 },
      { tier: "explorer", count: 8 },
      { tier: "operator", count: 5 },
      { tier: "proven", count: 2 },
    ],
    payout_per_customer: 42,
    tier_required: "explorer",
    min_push_score: 45,
    deadline: "2026-05-10T23:59:00Z",
    capture_checklist: [
      "Scan the Push QR code at the counter on arrival",
      "Order any drink + one pastry (AOV $11 target)",
      "Photograph your receipt — required for ConversionOracle",
      "Post within 48h with #ad #partnership and platform tags",
    ],
    disclosure_tags: ["#ad", "#partnership", "#devocionwilliamsburg"],
    platform_disclosure: {
      Instagram: "Paid partnership sticker + #ad in caption",
      TikTok: "Branded content toggle ON + #ad",
      "YouTube Shorts": "Includes paid promotion checkbox + #ad",
    },
    hero_offer: "First 10 creators: drink + pastry comped (up to $18)",
    sustained_offer: "20% off for your followers — 30-day window post-publish",
    lat: 40.7191,
    lng: -73.9573,
    address: "69 Grand St, Brooklyn, NY 11249",
    phone: "(718) 285-0405",
    instagram: "@devocionusa",
    hours: [
      { day: "Mon", hours: "7:00 AM – 7:00 PM" },
      { day: "Tue", hours: "7:00 AM – 7:00 PM" },
      { day: "Wed", hours: "7:00 AM – 7:00 PM" },
      { day: "Thu", hours: "7:00 AM – 7:00 PM" },
      { day: "Fri", hours: "7:00 AM – 8:00 PM" },
      { day: "Sat", hours: "8:00 AM – 8:00 PM", busy: true },
      { day: "Sun", hours: "8:00 AM – 7:00 PM", busy: true },
    ],
    crowd_heatmap: [0.2, 0.55, 0.9, 0.75, 0.45, 0.35, 0.25],
    past_campaigns: 4,
    creator_reviews: [
      {
        creator: "Mara K.",
        tier: "operator",
        text: "Brief was specific without being restrictive. Walk-in QR scanned before I ordered — payout hit the next morning.",
      },
      {
        creator: "Jordan P.",
        tier: "explorer",
        text: "Hero offer covered my entire visit. The team knew exactly why I was there.",
      },
    ],
  },
  "demo-campaign-002": {
    id: "demo-campaign-002",
    merchant_id: "demo-merchant-002",
    merchant_name: "Partners Coffee",
    merchant_rating: 4.6,
    merchant_reviews: 478,
    neighborhood: "Williamsburg",
    category: "Coffee+",
    aov: "$9",
    title: "Cortado Routine — Tuesday Off-Peak",
    eyebrow: "Williamsburg · Coffee+",
    story:
      "Partners Coffee is running a Tuesday off-peak push. We need 8 creators to capture an authentic mid-afternoon ritual and drive verified walk-ins through the Customer Acquisition Engine. Tuesday 2–4 PM is our softest window — think study session, laptop corner, unrushed pour-over talk. ConversionOracle™ is live on this location so you will see ground-truth verification within 24h of your post.",
    image_url:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
    spots_total: 8,
    spots_remaining: 5,
    applications_count: 12,
    avg_payout: 28,
    tier_mix: [
      { tier: "seed", count: 3 },
      { tier: "explorer", count: 5 },
      { tier: "operator", count: 3 },
      { tier: "proven", count: 1 },
    ],
    payout_per_customer: 32,
    tier_required: "seed",
    min_push_score: 25,
    deadline: "2026-04-28T23:59:00Z",
    address: "125 N 6th St, Brooklyn, NY 11249",
    phone: "(347) 586-0063",
    instagram: "@partnerscoffee",
    lat: 40.7175,
    lng: -73.9589,
    capture_checklist: [
      "Visit Tuesday 2–4 PM — scan the Push QR at the counter",
      "Order cortado + any pastry",
      "Photograph your receipt for ConversionOracle verification",
      "Post within 48h · #ad #partnership · platform tags auto-added",
    ],
    disclosure_tags: ["#ad", "#partnership", "#partnerscoffee"],
    platform_disclosure: {
      Instagram: "Paid partnership sticker + #ad",
      TikTok: "Branded content toggle ON + #ad",
    },
    hero_offer: "First 10 creators: cortado + pastry comped (up to $14)",
    sustained_offer: "15% off for your followers — Tue/Wed off-peak only",
    hours: [
      { day: "Mon", hours: "7:00 AM – 8:00 PM" },
      { day: "Tue", hours: "7:00 AM – 8:00 PM" },
      { day: "Wed", hours: "7:00 AM – 8:00 PM" },
      { day: "Thu", hours: "7:00 AM – 8:00 PM" },
      { day: "Fri", hours: "7:00 AM – 9:00 PM" },
      { day: "Sat", hours: "8:00 AM – 9:00 PM", busy: true },
      { day: "Sun", hours: "8:00 AM – 8:00 PM" },
    ],
    crowd_heatmap: [0.3, 0.7, 0.85, 0.55, 0.35, 0.45, 0.55],
    past_campaigns: 6,
    creator_reviews: [
      {
        creator: "Eli R.",
        tier: "explorer",
        text: "Off-peak brief felt natural. My followers actually walked in — ConversionOracle confirmed 6 visits.",
      },
    ],
  },
  "demo-campaign-003": {
    id: "demo-campaign-003",
    merchant_id: "demo-merchant-003",
    merchant_name: "Sey Coffee",
    merchant_rating: 4.8,
    merchant_reviews: 253,
    neighborhood: "East Williamsburg",
    category: "Coffee+",
    aov: "$13",
    title: "Natural Wine + Espresso — Evening Pivot",
    eyebrow: "East Williamsburg · Coffee+",
    story:
      "Sey is piloting a natural wine + espresso evening concept Thu–Sat 5–9 PM. We want 6 creators with strong taste-making follower bases to document the vibe and drive verified walk-ins. This is a Two-Segment Creator Economics campaign — T1–T3 get per-customer payout, T4+ earn retainer. Our Neighborhood Playbook has the full evening brief.",
    image_url:
      "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=1600&q=80",
    spots_total: 6,
    spots_remaining: 4,
    applications_count: 9,
    avg_payout: 65,
    tier_mix: [
      { tier: "operator", count: 2 },
      { tier: "proven", count: 4 },
      { tier: "closer", count: 3 },
    ],
    payout_per_customer: 68,
    tier_required: "operator",
    min_push_score: 65,
    deadline: "2026-05-05T23:59:00Z",
    address: "18 Grattan St, Brooklyn, NY 11206",
    phone: "(646) 801-4206",
    instagram: "@seycoffee",
    lat: 40.7089,
    lng: -73.9316,
    capture_checklist: [
      "Visit Thu–Sat 5–9 PM — scan the Push QR",
      "Order espresso + natural wine pairing (AOV $13+)",
      "Photograph your receipt — ConversionOracle cross-checks",
      "Post within 48h · DisclosureBot auto-applies compliance tags",
    ],
    disclosure_tags: ["#ad", "#partnership", "#seycoffee"],
    platform_disclosure: {
      Instagram: "Paid partnership sticker + #ad",
      TikTok: "Branded content toggle + #ad",
    },
    hero_offer: "First 10 creators: espresso + wine comped (up to $22)",
    sustained_offer: "20% off for followers — evening hours only",
    hours: [
      { day: "Mon", hours: "8:00 AM – 6:00 PM" },
      { day: "Tue", hours: "8:00 AM – 6:00 PM" },
      { day: "Wed", hours: "8:00 AM – 6:00 PM" },
      { day: "Thu", hours: "8:00 AM – 9:00 PM", busy: true },
      { day: "Fri", hours: "8:00 AM – 9:00 PM", busy: true },
      { day: "Sat", hours: "9:00 AM – 9:00 PM", busy: true },
      { day: "Sun", hours: "9:00 AM – 6:00 PM" },
    ],
    crowd_heatmap: [0.2, 0.45, 0.6, 0.5, 0.35, 0.65, 0.85],
    past_campaigns: 3,
    creator_reviews: [
      {
        creator: "Priya S.",
        tier: "proven",
        text: "First retainer campaign I've been on. Operator brief was crystal clear. Payout delivered.",
      },
      {
        creator: "Marcus T.",
        tier: "closer",
        text: "Evening concept hooks well. Partners Coffee was my first walk-in from my post within 3 hours.",
      },
    ],
  },
};

function fallbackCampaign(id: string): Campaign {
  const first = Object.values(DEMO_CAMPAIGNS)[0];
  return { ...first, id };
}

const DEMO_CREATOR: Creator = {
  id: "demo-creator-001",
  tier: "operator",
  push_score: 68,
  campaigns_completed: 7,
  name: "Alex Rivera",
};

const DEMO_APP_STATUS: Record<string, ApplicationStatus> = {
  "demo-campaign-001": "none",
  "demo-campaign-002": "accepted",
  "demo-campaign-003": "pending",
};

/* ── Similar campaigns ─────────────────────────────────── */

const SIMILAR_CAMPAIGNS = [
  {
    id: "demo-campaign-002",
    merchant: "Partners Coffee",
    neighborhood: "Williamsburg",
    payout: 32,
    aov: "$9",
    tier: "seed" as CreatorTier,
    spots: 5,
  },
  {
    id: "demo-campaign-003",
    merchant: "Sey Coffee",
    neighborhood: "East Williamsburg",
    payout: 68,
    aov: "$13",
    tier: "operator" as CreatorTier,
    spots: 4,
  },
  {
    id: "demo-campaign-001",
    merchant: "Devoción Williamsburg",
    neighborhood: "Williamsburg",
    payout: 42,
    aov: "$11",
    tier: "explorer" as CreatorTier,
    spots: 7,
  },
];

/* ── Helpers ─────────────────────────────────────────── */

function formatDeadline(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
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

/* ── Tier mix mini-bar ─────────────────────────────────── */

function TierMixBar({ mix }: { mix: { tier: CreatorTier; count: number }[] }) {
  const total = mix.reduce((s, m) => s + m.count, 0);
  if (total === 0) return null;
  return (
    <div className="cp2-tier-mix" role="img" aria-label="Applicant tier mix">
      {mix.map((m) => (
        <div
          key={m.tier}
          className="cp2-tier-mix-seg"
          style={{
            width: `${(m.count / total) * 100}%`,
            background: TIER_COLOR[m.tier],
          }}
          title={`${TIER_LABELS[m.tier]}: ${m.count}`}
        />
      ))}
    </div>
  );
}

/* ── Crowd heatmap mini-chart ─────────────────────────── */

function CrowdHeatmap({ values }: { values: number[] }) {
  const labels = ["7a", "9a", "11a", "1p", "3p", "5p", "7p"];
  return (
    <div className="cp2-heatmap" aria-label="Typical crowd by time of day">
      <div className="cp2-heatmap-bars">
        {values.map((v, i) => (
          <div
            key={i}
            className="cp2-heatmap-bar"
            style={{ height: `${Math.max(8, v * 100)}%` }}
            title={`${labels[i]}: ${Math.round(v * 100)}% capacity`}
          >
            <span
              className="cp2-heatmap-fill"
              style={{
                opacity: 0.35 + v * 0.65,
                background: v > 0.7 ? "#c1121f" : "#003049",
              }}
            />
          </div>
        ))}
      </div>
      <div className="cp2-heatmap-labels">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Map pin SVG ─────────────────────────────────────── */

function MapInline({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) {
  // Tiny static visualization — not interactive
  return (
    <div className="cp2-map" aria-label={`Map of ${label}`}>
      <svg
        viewBox="0 0 320 180"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="cp2-map-svg"
      >
        {/* grid streets */}
        <defs>
          <pattern
            id="streets"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="rgba(0,48,73,0.08)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="320" height="180" fill="#f5f2ec" />
        <rect width="320" height="180" fill="url(#streets)" />
        {/* main avenue */}
        <line
          x1="0"
          y1="90"
          x2="320"
          y2="90"
          stroke="rgba(0,48,73,0.18)"
          strokeWidth="3"
        />
        <line
          x1="160"
          y1="0"
          x2="160"
          y2="180"
          stroke="rgba(0,48,73,0.18)"
          strokeWidth="3"
        />
        {/* waterfront/park splash */}
        <rect
          x="0"
          y="0"
          width="40"
          height="180"
          fill="rgba(102,155,188,0.18)"
        />
        {/* pin */}
        <g transform="translate(160, 90)">
          <circle r="18" fill="rgba(193,18,31,0.18)" />
          <circle r="10" fill="#c1121f" stroke="#780000" strokeWidth="2" />
          <circle r="3" fill="#f5f2ec" />
        </g>
      </svg>
      <div className="cp2-map-coord">
        {lat.toFixed(4)}° N &middot; {Math.abs(lng).toFixed(4)}° W
      </div>
    </div>
  );
}

/* ── Rating stars ─────────────────────────────────── */

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="cp2-stars" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <span
            key={i}
            className={filled ? "cp2-star cp2-star--on" : "cp2-star"}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}

/* ── Apply modal ─────────────────────────────────── */

function ApplyModal({
  campaign,
  creator,
  onClose,
  onSubmit,
  submitting,
}: {
  campaign: Campaign;
  creator: Creator;
  onClose: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const [ack, setAck] = useState(false);
  const eligibleTier = isEligible(creator.tier, campaign.tier_required);
  const eligibleScore = creator.push_score >= campaign.min_push_score;
  const canSubmit = ack && eligibleTier && eligibleScore && !submitting;

  return (
    <div
      className="cp2-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Apply to campaign"
      onClick={onClose}
    >
      <div className="cp2-modal" onClick={(e) => e.stopPropagation()}>
        <header className="cp2-modal-head">
          <p className="cp2-modal-eyebrow">
            Apply · Customer Acquisition Engine
          </p>
          <h2 className="cp2-modal-title">{campaign.merchant_name}</h2>
          <button
            type="button"
            className="cp2-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <section className="cp2-modal-qual">
          <div className="cp2-modal-qual-row">
            <span className="cp2-modal-qual-label">Your tier</span>
            <TierBadge tier={creator.tier} size="sm" variant="filled" />
            <span
              className={
                eligibleTier
                  ? "cp2-modal-check cp2-modal-check--pass"
                  : "cp2-modal-check cp2-modal-check--fail"
              }
            >
              {eligibleTier ? "Qualifies" : "Locked"}
            </span>
          </div>
          <div className="cp2-modal-qual-row">
            <span className="cp2-modal-qual-label">Tier required</span>
            <TierBadge
              tier={campaign.tier_required}
              size="sm"
              variant="outlined"
            />
            <span className="cp2-modal-qual-spacer" />
          </div>
          <div className="cp2-modal-qual-row">
            <span className="cp2-modal-qual-label">Your Push Score</span>
            <span className="cp2-modal-qual-value">{creator.push_score}</span>
            <span
              className={
                eligibleScore
                  ? "cp2-modal-check cp2-modal-check--pass"
                  : "cp2-modal-check cp2-modal-check--fail"
              }
            >
              {eligibleScore
                ? "Meets minimum"
                : `Need ${campaign.min_push_score}`}
            </span>
          </div>
          <div className="cp2-modal-qual-row">
            <span className="cp2-modal-qual-label">Minimum required</span>
            <span className="cp2-modal-qual-value">
              {campaign.min_push_score}
            </span>
            <span className="cp2-modal-qual-spacer" />
          </div>
        </section>

        <section className="cp2-modal-brief">
          <p className="cp2-modal-brief-label">Brief acknowledgement</p>
          <label className="cp2-modal-ack">
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
            />
            <span>
              I have read the Neighborhood Playbook brief and capture checklist.
              I agree to DisclosureBot tag enforcement and ConversionOracle
              verification.
            </span>
          </label>
        </section>

        <footer className="cp2-modal-foot">
          <button
            type="button"
            className="cp2-modal-btn cp2-modal-btn--ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cp2-modal-btn cp2-modal-btn--primary"
            onClick={onSubmit}
            disabled={!canSubmit}
          >
            {submitting ? "Submitting…" : "Submit application"}
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────── */

export default function CampaignDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "demo-campaign-001";

  const [isDemo] = useState<boolean>(() => checkDemoMode());
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [status, setStatus] = useState<ApplicationStatus>("none");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      if (isDemo || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const found = DEMO_CAMPAIGNS[id] ?? fallbackCampaign(id);
        setCampaign(found);
        setCreator(DEMO_CREATOR);
        setStatus(DEMO_APP_STATUS[found.id] ?? "none");
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          // Fall back to demo content gracefully
          const found = DEMO_CAMPAIGNS[id] ?? fallbackCampaign(id);
          setCampaign(found);
          setCreator(DEMO_CREATOR);
          setStatus("none");
          setLoading(false);
          return;
        }
        const found = DEMO_CAMPAIGNS[id] ?? fallbackCampaign(id);
        setCampaign(found);
        setCreator(DEMO_CREATOR);
        setStatus(DEMO_APP_STATUS[found.id] ?? "none");
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isDemo]);

  function handlePrimary() {
    if (!campaign || !creator) return;
    if (status === "none") {
      setModalOpen(true);
    }
  }

  async function submitApplication() {
    if (!campaign || !creator || submitting) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setStatus("pending");
    setSubmitting(false);
    setModalOpen(false);
  }

  function withdraw() {
    setStatus("none");
  }

  if (loading) {
    return (
      <div className="cp2-page">
        <div className="cp2-loading">Loading campaign…</div>
      </div>
    );
  }
  if (error || !campaign || !creator) {
    return (
      <div className="cp2-page">
        <Link href="/creator/explore" className="cp2-back">
          ← Back to Customer Acquisition Engine
        </Link>
        <div className="cp2-error">{error ?? "Campaign not found."}</div>
      </div>
    );
  }

  const eligible = isEligible(creator.tier, campaign.tier_required);
  const days = daysRemaining(campaign.deadline);

  // Primary CTA state machine
  let ctaLabel = "Apply";
  let ctaHref: string | null = null;
  let ctaDisabled = false;
  let ctaClass = "cp2-cta cp2-cta--primary";
  if (status === "pending") {
    ctaLabel = "Application under review";
    ctaDisabled = true;
    ctaClass = "cp2-cta cp2-cta--pending";
  } else if (status === "accepted") {
    ctaLabel = "Continue post";
    ctaHref = `/creator/campaigns/${campaign.id}/post`;
    ctaClass = "cp2-cta cp2-cta--primary";
  } else if (status === "posted") {
    ctaLabel = "View post";
    ctaHref = `/creator/campaigns/${campaign.id}/post`;
    ctaClass = "cp2-cta cp2-cta--secondary";
  } else if (!eligible) {
    ctaLabel = `Unlock at ${TIER_LABELS[campaign.tier_required]}`;
    ctaDisabled = true;
    ctaClass = "cp2-cta cp2-cta--locked";
  }

  return (
    <div className="cp2-page">
      <Link href="/creator/explore" className="cp2-back">
        ← Back to Customer Acquisition Engine
      </Link>

      {/* ─── Above-fold hero ───────────────────────────── */}
      <section className="cp2-hero">
        <div
          className="cp2-hero-img"
          style={{ backgroundImage: `url(${campaign.image_url})` }}
          aria-hidden="true"
        />
        <div className="cp2-hero-overlay" aria-hidden="true" />
        <div className="cp2-hero-overlay-tint" aria-hidden="true" />

        <div className="cp2-hero-inner">
          <p className="cp2-hero-eyebrow">{campaign.eyebrow}</p>
          <h1 className="cp2-hero-title">{campaign.merchant_name}</h1>

          <div className="cp2-hero-meta">
            <div className="cp2-hero-meta-item">
              <span className="cp2-hero-meta-label">AOV</span>
              <span className="cp2-hero-meta-value">{campaign.aov}</span>
            </div>
            <span className="cp2-hero-meta-sep" />
            <div className="cp2-hero-meta-item">
              <span className="cp2-hero-meta-label">Tier required</span>
              <TierBadge
                tier={campaign.tier_required}
                size="sm"
                variant="filled"
              />
            </div>
            <span className="cp2-hero-meta-sep" />
            <div className="cp2-hero-meta-item">
              <span className="cp2-hero-meta-label">Per verified customer</span>
              <span className="cp2-hero-meta-value cp2-hero-meta-value--gold">
                ${campaign.payout_per_customer}
              </span>
            </div>
            <span className="cp2-hero-meta-sep" />
            <div className="cp2-hero-meta-item">
              <span className="cp2-hero-meta-label">Deadline</span>
              <span className="cp2-hero-meta-value">
                {formatDeadline(campaign.deadline)}
                <em className="cp2-hero-meta-em">
                  {days} {days === 1 ? "day" : "days"}
                </em>
              </span>
            </div>
          </div>

          <div className="cp2-hero-cta-row">
            {ctaHref && !ctaDisabled ? (
              <Link href={ctaHref} className={ctaClass} aria-label={ctaLabel}>
                {ctaLabel}
              </Link>
            ) : (
              <button
                type="button"
                className={ctaClass}
                onClick={handlePrimary}
                disabled={ctaDisabled}
                aria-label={ctaLabel}
              >
                {ctaLabel}
              </button>
            )}
            {status === "pending" && (
              <button
                type="button"
                className="cp2-cta cp2-cta--ghost"
                onClick={withdraw}
              >
                Withdraw application
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Stats strip ───────────────────────────────── */}
      <section className="cp2-stats" aria-label="Campaign stats">
        <div className="cp2-stat">
          <span className="cp2-stat-label">Spots available</span>
          <span className="cp2-stat-value">{campaign.spots_remaining}</span>
          <span className="cp2-stat-sub">of {campaign.spots_total}</span>
        </div>
        <div className="cp2-stat">
          <span className="cp2-stat-label">Applications to date</span>
          <span className="cp2-stat-value">{campaign.applications_count}</span>
          <span className="cp2-stat-sub">live · growing</span>
        </div>
        <div className="cp2-stat">
          <span className="cp2-stat-label">Tier mix</span>
          <TierMixBar mix={campaign.tier_mix} />
          <span className="cp2-stat-sub">
            {campaign.tier_mix.map((m) => TIER_LABELS[m.tier]).join(" · ")}
          </span>
        </div>
        <div className="cp2-stat">
          <span className="cp2-stat-label">Avg payout to date</span>
          <span className="cp2-stat-value cp2-stat-value--gold">
            ${campaign.avg_payout}
          </span>
          <span className="cp2-stat-sub">per creator</span>
        </div>
      </section>

      {/* ─── Brief 2-col ──────────────────────────────── */}
      <section className="cp2-brief">
        {/* Left column */}
        <div className="cp2-brief-left">
          <article>
            <p className="cp2-section-label">01 · Campaign story</p>
            <p className="cp2-story">{campaign.story}</p>
          </article>

          <article>
            <p className="cp2-section-label">02 · What to capture</p>
            <ol className="cp2-capture-list">
              {campaign.capture_checklist.map((item, i) => (
                <li key={i} className="cp2-capture-item">
                  <span className="cp2-capture-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="cp2-capture-box" aria-hidden="true" />
                  <span className="cp2-capture-text">{item}</span>
                </li>
              ))}
            </ol>
          </article>

          <article>
            <p className="cp2-section-label">03 · Disclosure requirements</p>
            <div className="cp2-disclosure">
              <header className="cp2-disclosure-head">
                <span className="cp2-disclosure-badge">DisclosureBot</span>
                <span className="cp2-disclosure-sub">
                  Tags auto-added at publish
                </span>
              </header>
              <div className="cp2-disclosure-tags">
                {campaign.disclosure_tags.map((t) => (
                  <span key={t} className="cp2-disclosure-tag">
                    {t}
                  </span>
                ))}
              </div>
              <ul className="cp2-disclosure-platforms">
                {Object.entries(campaign.platform_disclosure).map(([p, v]) => (
                  <li key={p} className="cp2-disclosure-row">
                    <span className="cp2-disclosure-platform">{p}</span>
                    <span className="cp2-disclosure-detail">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article>
            <p className="cp2-section-label">04 · Offers</p>
            <div className="cp2-offers">
              <div className="cp2-offer cp2-offer--hero">
                <p className="cp2-offer-eyebrow">Hero offer · limited</p>
                <p className="cp2-offer-headline">{campaign.hero_offer}</p>
              </div>
              <div className="cp2-offer cp2-offer--sustained">
                <p className="cp2-offer-eyebrow">Sustained offer</p>
                <p className="cp2-offer-headline">{campaign.sustained_offer}</p>
              </div>
            </div>
          </article>
        </div>

        {/* Right column */}
        <aside className="cp2-brief-right">
          <MapInline
            lat={campaign.lat}
            lng={campaign.lng}
            label={campaign.merchant_name}
          />

          <div className="cp2-side-card">
            <p className="cp2-section-label">Business hours</p>
            <ul className="cp2-hours">
              {campaign.hours.map((h) => (
                <li
                  key={h.day}
                  className={`cp2-hours-row ${h.busy ? "cp2-hours-row--busy" : ""}`}
                >
                  <span className="cp2-hours-day">{h.day}</span>
                  <span className="cp2-hours-value">{h.hours}</span>
                  {h.busy && <span className="cp2-hours-flag">busy</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="cp2-side-card">
            <p className="cp2-section-label">Best time to visit</p>
            <CrowdHeatmap values={campaign.crowd_heatmap} />
            <p className="cp2-side-caption">
              Mid-morning and afternoon are slowest — ideal for clean capture.
            </p>
          </div>

          <div className="cp2-side-card">
            <p className="cp2-section-label">Contact</p>
            <ul className="cp2-contact">
              <li>
                <span className="cp2-contact-label">Phone</span>
                <a href={`tel:${campaign.phone.replace(/[^0-9]/g, "")}`}>
                  {campaign.phone}
                </a>
              </li>
              <li>
                <span className="cp2-contact-label">Instagram</span>
                <a
                  href={`https://instagram.com/${campaign.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {campaign.instagram}
                </a>
              </li>
              <li>
                <span className="cp2-contact-label">Address</span>
                <span>{campaign.address}</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>

      {/* ─── Merchant profile excerpt ─────────────────── */}
      <section className="cp2-merchant">
        <div className="cp2-merchant-head">
          <div>
            <p className="cp2-section-label">Merchant profile</p>
            <h3 className="cp2-merchant-name">{campaign.merchant_name}</h3>
          </div>
          <div className="cp2-merchant-rating">
            <StarRating value={campaign.merchant_rating} />
            <span className="cp2-merchant-rating-value">
              {campaign.merchant_rating.toFixed(1)}
            </span>
            <span className="cp2-merchant-rating-count">
              {campaign.merchant_reviews} reviews · {campaign.past_campaigns}{" "}
              past campaigns
            </span>
          </div>
        </div>

        <div className="cp2-merchant-reviews">
          {campaign.creator_reviews.map((r, i) => (
            <blockquote key={i} className="cp2-review">
              <p className="cp2-review-text">"{r.text}"</p>
              <footer className="cp2-review-foot">
                <span className="cp2-review-creator">{r.creator}</span>
                <TierBadge tier={r.tier} size="sm" variant="subtle" />
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ─── Similar campaigns ────────────────────────── */}
      <section className="cp2-similar">
        <p className="cp2-section-label">
          Similar Williamsburg Coffee+ campaigns
        </p>
        <div className="cp2-similar-grid">
          {SIMILAR_CAMPAIGNS.filter((c) => c.id !== campaign.id)
            .slice(0, 3)
            .map((c) => (
              <Link
                key={c.id}
                href={`/creator/campaigns/${c.id}`}
                className="cp2-similar-card"
              >
                <header className="cp2-similar-head">
                  <span className="cp2-similar-neighborhood">
                    {c.neighborhood}
                  </span>
                  <TierBadge tier={c.tier} size="sm" variant="subtle" />
                </header>
                <h4 className="cp2-similar-merchant">{c.merchant}</h4>
                <dl className="cp2-similar-meta">
                  <div>
                    <dt>AOV</dt>
                    <dd>{c.aov}</dd>
                  </div>
                  <div>
                    <dt>Per customer</dt>
                    <dd className="cp2-similar-gold">${c.payout}</dd>
                  </div>
                  <div>
                    <dt>Spots</dt>
                    <dd>{c.spots}</dd>
                  </div>
                </dl>
              </Link>
            ))}
        </div>
      </section>

      {modalOpen && creator && campaign && (
        <ApplyModal
          campaign={campaign}
          creator={creator}
          onClose={() => setModalOpen(false)}
          onSubmit={submitApplication}
          submitting={submitting}
        />
      )}
    </div>
  );
}
