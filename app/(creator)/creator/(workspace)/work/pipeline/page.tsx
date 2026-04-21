"use client";

import Link from "next/link";
import { useState } from "react";
import "./pipeline.css";

/* ── Types ─────────────────────────────────────────────────── */

type PipelineStatus = "applied" | "active" | "pending_review" | "completed";
type ActiveTab = "all" | "active" | "pending" | "completed";
type SortMode = "deadline" | "earn" | "merchant";

type PipelineCampaign = {
  id: string;
  campaignName: string;
  merchantName: string;
  merchantContact?: string;
  category: string;
  status: PipelineStatus;
  deadline: string;
  daysLeft: number;
  earnEstimate: string;
  earnRaw: number;
  contentRequired: number;
  contentSubmitted: number;
  logoInitials: string;
  logoColor: string;
  appliedDate?: string;
  completedDate?: string;
  brief?: string;
  walkinCount?: number;
  attributionNote?: string;
};

/* ── Mock data ─────────────────────────────────────────────── */

const MOCK_CAMPAIGNS: PipelineCampaign[] = [
  {
    id: "pc-001",
    campaignName: "Morning Coffee Story",
    merchantName: "Blank Street Coffee",
    merchantContact: "/creator/messages?merchant=blank-street",
    category: "Coffee",
    status: "active",
    deadline: "Apr 20",
    daysLeft: 2,
    earnEstimate: "$18",
    earnRaw: 18,
    contentRequired: 3,
    contentSubmitted: 2,
    logoInitials: "BS",
    logoColor: "#003049",
    appliedDate: "Apr 12",
    brief:
      "Create 3 authentic morning-routine Stories featuring your Blank Street order. Focus on the ritual, not the product. Tag @blankstreetcoffee.",
    walkinCount: 4,
    attributionNote:
      "Scan QR at register — show barista your creator code BS-4821.",
  },
  {
    id: "pc-002",
    campaignName: "Lunch Reel Campaign",
    merchantName: "Superiority Burger",
    merchantContact: "/creator/messages?merchant=superiority-burger",
    category: "Food",
    status: "active",
    deadline: "Apr 22",
    daysLeft: 4,
    earnEstimate: "$32",
    earnRaw: 32,
    contentRequired: 4,
    contentSubmitted: 1,
    logoInitials: "SB",
    logoColor: "#c1121f",
    appliedDate: "Apr 10",
    brief:
      "Film a 30-second Reel showing the full Superiority experience — ordering, unwrapping, first bite reaction. Neighborhood vibe is the hook.",
    walkinCount: 2,
    attributionNote: "Show SB-7734 code at the counter to log your walk-in.",
  },
  {
    id: "pc-003",
    campaignName: "Afternoon Lifestyle Post",
    merchantName: "Flamingo Estate",
    merchantContact: "/creator/messages?merchant=flamingo-estate",
    category: "Lifestyle",
    status: "pending_review",
    deadline: "Apr 25",
    daysLeft: 7,
    earnEstimate: "$44",
    earnRaw: 44,
    contentRequired: 2,
    contentSubmitted: 2,
    logoInitials: "FE",
    logoColor: "#c9a96e",
    appliedDate: "Apr 14",
    brief:
      "Post 2 lifestyle shots featuring Flamingo Estate products in your home or outdoor space. Soft editorial aesthetic, natural light preferred.",
    attributionNote:
      "No walk-in required. Tag @flamingoestate and use #FECreator.",
  },
  {
    id: "pc-004",
    campaignName: "Matcha Bar Content",
    merchantName: "Cha Cha Matcha",
    merchantContact: "/creator/messages?merchant=cha-cha-matcha",
    category: "Coffee",
    status: "applied",
    deadline: "Apr 28",
    daysLeft: 10,
    earnEstimate: "$34",
    earnRaw: 34,
    contentRequired: 3,
    contentSubmitted: 0,
    logoInitials: "CC",
    logoColor: "#669bbc",
    appliedDate: "Apr 16",
    brief:
      "Capture the vibe at Cha Cha Matcha — the space, the drink, the crowd. 3 posts across Feed and Stories. Aesthetic: downtown calm.",
    attributionNote: "Use creator code CC-2291 when ordering to auto-track.",
  },
  {
    id: "pc-005",
    campaignName: "Skin Care Launch",
    merchantName: "Brow Theory",
    merchantContact: "/creator/messages?merchant=brow-theory",
    category: "Beauty",
    status: "applied",
    deadline: "May 1",
    daysLeft: 13,
    earnEstimate: "$55",
    earnRaw: 55,
    contentRequired: 5,
    contentSubmitted: 0,
    logoInitials: "BT",
    logoColor: "#780000",
    appliedDate: "Apr 17",
    brief:
      "Document your Brow Theory treatment experience in 5 content pieces — pre-appointment anticipation, in-chair BTS, and final reveal.",
    attributionNote:
      "Book via creator link BT-creator.com/5512 to link attribution.",
  },
  {
    id: "pc-006",
    campaignName: "Saturday Brunch Series",
    merchantName: "Egg Shop",
    merchantContact: "/creator/messages?merchant=egg-shop",
    category: "Food",
    status: "applied",
    deadline: "May 5",
    daysLeft: 17,
    earnEstimate: "$28",
    earnRaw: 28,
    contentRequired: 2,
    contentSubmitted: 0,
    logoInitials: "ES",
    logoColor: "#003049",
    appliedDate: "Apr 17",
    brief:
      "Cover Saturday brunch at Egg Shop in 2 posts — the wait, the plate, the vibe. Make it feel like the best morning someone almost missed.",
    attributionNote: "Scan QR at host stand when you arrive. Code: ES-8876.",
  },
  {
    id: "pc-007",
    campaignName: "Spring Collection Reel",
    merchantName: "Assembly New York",
    merchantContact: "/creator/messages?merchant=assembly-ny",
    category: "Retail",
    status: "completed",
    deadline: "Apr 10",
    daysLeft: -8,
    earnEstimate: "$48",
    earnRaw: 48,
    contentRequired: 4,
    contentSubmitted: 4,
    logoInitials: "AN",
    logoColor: "#003049",
    completedDate: "Apr 10",
    brief:
      "4-piece Spring collection showcase. Shoot in-store and on Williamsburg streets. Editorial, not commercial.",
    walkinCount: 7,
  },
  {
    id: "pc-008",
    campaignName: "Neighborhood Run Club",
    merchantName: "Asics Williamsburg",
    merchantContact: "/creator/messages?merchant=asics-wburg",
    category: "Fitness",
    status: "completed",
    deadline: "Apr 5",
    daysLeft: -13,
    earnEstimate: "$62",
    earnRaw: 62,
    contentRequired: 3,
    contentSubmitted: 3,
    logoInitials: "AW",
    logoColor: "#669bbc",
    completedDate: "Apr 5",
    brief:
      "Document the Saturday run club starting from the Asics store. Capture energy, community, and the gear in action.",
    walkinCount: 12,
  },
  {
    id: "pc-009",
    campaignName: "Matcha Latte Feature",
    merchantName: "Moto Coffee",
    merchantContact: "/creator/messages?merchant=moto-coffee",
    category: "Coffee",
    status: "completed",
    deadline: "Mar 28",
    daysLeft: -21,
    earnEstimate: "$22",
    earnRaw: 22,
    contentRequired: 2,
    contentSubmitted: 2,
    logoInitials: "MC",
    logoColor: "#003049",
    completedDate: "Mar 28",
    brief:
      "2 close-up product shots of the seasonal matcha latte. Warm tones, morning light. No text overlays.",
    walkinCount: 3,
  },
];

const SORT_OPTIONS: { label: string; value: SortMode }[] = [
  { label: "Deadline", value: "deadline" },
  { label: "Earnings", value: "earn" },
  { label: "Merchant", value: "merchant" },
];

const TAB_ORDER: ActiveTab[] = ["all", "active", "pending", "completed"];
const TAB_LABELS: Record<ActiveTab, string> = {
  all: "All",
  active: "Active",
  pending: "Pending",
  completed: "Done",
};

/* ── Status config ────────────────────────────────────────── */

const STATUS_LABEL: Record<PipelineStatus, string> = {
  active: "ACTIVE",
  pending_review: "PENDING APPROVAL",
  applied: "APPLIED",
  completed: "COMPLETED",
};

/* ── Content type label ───────────────────────────────────── */

function contentTypeLabel(required: number, submitted: number): string {
  if (submitted >= required) return "Done";
  return `${submitted}/${required} posts`;
}

/* ── Expanded Panel ────────────────────────────────────────── */

function ExpandedPanel({ campaign }: { campaign: PipelineCampaign }) {
  return (
    <div className="pl-expand-panel">
      {campaign.brief && (
        <div className="pl-expand-section">
          <p className="pl-expand-label">CAMPAIGN BRIEF</p>
          <p className="pl-expand-text">{campaign.brief}</p>
        </div>
      )}

      <div className="pl-expand-row">
        <div className="pl-expand-section">
          <p className="pl-expand-label">SUBMISSION STATUS</p>
          <p className="pl-expand-stat">
            {campaign.contentSubmitted} of {campaign.contentRequired} posts
            submitted
          </p>
          {campaign.walkinCount !== undefined && (
            <p className="pl-expand-walkin">
              {campaign.walkinCount} walk-ins recorded
            </p>
          )}
        </div>

        {campaign.attributionNote && (
          <div className="pl-expand-section">
            <p className="pl-expand-label">ATTRIBUTION</p>
            <p className="pl-expand-text">{campaign.attributionNote}</p>
          </div>
        )}

        {campaign.merchantContact && (
          <div className="pl-expand-section">
            <p className="pl-expand-label">MERCHANT</p>
            <Link
              href={campaign.merchantContact}
              className="pl-expand-contact"
              onClick={(e) => e.stopPropagation()}
            >
              Message {campaign.merchantName} →
            </Link>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pl-expand-actions">
        {campaign.status === "active" && (
          <Link
            href={`/creator/campaigns/${campaign.id}/post`}
            className="pl-action-btn pl-action-primary"
            onClick={(e) => e.stopPropagation()}
          >
            Submit Content ↑
          </Link>
        )}
        <Link
          href={`/creator/campaigns/${campaign.id}`}
          className="pl-action-btn pl-action-ghost"
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </Link>
        {campaign.status === "pending_review" && (
          <span className="pl-action-status">Under review by merchant</span>
        )}
        {campaign.status === "applied" && (
          <button
            className="pl-action-link"
            onClick={(e) => e.stopPropagation()}
          >
            Withdraw application
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Campaign Row Card ─────────────────────────────────────── */

function CampaignCard({
  campaign,
  expanded,
  onToggle,
}: {
  campaign: PipelineCampaign;
  expanded: boolean;
  onToggle: () => void;
}) {
  const dateInfo =
    campaign.status === "completed"
      ? `Completed ${campaign.completedDate ?? ""}`
      : campaign.daysLeft < 0
        ? `Overdue since ${campaign.deadline}`
        : `Due ${campaign.deadline}`;

  return (
    <div
      className={[
        "pl-card",
        `pl-card-${campaign.status}`,
        expanded ? "pl-card-expanded" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="article"
      onClick={onToggle}
      aria-expanded={expanded}
    >
      <div className="pl-card-inner">
        {/* Logo */}
        <div
          className="pl-card-logo"
          style={{ background: campaign.logoColor }}
          aria-hidden="true"
        >
          {campaign.logoInitials}
        </div>

        {/* Info */}
        <div className="pl-card-info">
          <p className="pl-card-merchant">{campaign.merchantName}</p>
          <p className="pl-card-campaign">{campaign.campaignName}</p>
          <div className="pl-card-status-row">
            <span className={`pl-card-status pl-status-${campaign.status}`}>
              {STATUS_LABEL[campaign.status]}
            </span>
            <span className="pl-card-date">· {dateInfo}</span>
            <span className="pl-card-type">
              {contentTypeLabel(
                campaign.contentRequired,
                campaign.contentSubmitted,
              )}
            </span>
          </div>
        </div>

        {/* Earn */}
        <div>
          <div className="pl-card-earn">{campaign.earnEstimate}</div>
          {campaign.status === "active" && (
            <span className="pl-card-earn-arrow">Submit →</span>
          )}
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && <ExpandedPanel campaign={campaign} />}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */

export default function WorkPipelinePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [sortMode, setSortMode] = useState<SortMode>("deadline");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  // Tab-based filtering
  const tabFiltered = MOCK_CAMPAIGNS.filter((c) => {
    if (activeTab === "active")
      return c.status === "active" || c.status === "pending_review";
    if (activeTab === "pending") return c.status === "applied";
    if (activeTab === "completed") return c.status === "completed";
    return true;
  });

  // Sort
  const sorted = [...tabFiltered].sort((a, b) => {
    if (sortMode === "earn") return b.earnRaw - a.earnRaw;
    if (sortMode === "merchant")
      return a.merchantName.localeCompare(b.merchantName);
    // deadline: overdue first, then ascending
    const aOver =
      a.daysLeft < 0 && a.status !== "completed" ? -1000 + a.daysLeft : 0;
    const bOver =
      b.daysLeft < 0 && b.status !== "completed" ? -1000 + b.daysLeft : 0;
    if (aOver !== bOver) return aOver - bOver;
    return a.daysLeft - b.daysLeft;
  });

  // Summary stats
  const totalPotential = MOCK_CAMPAIGNS.filter(
    (c) => c.status !== "completed",
  ).reduce((sum, c) => sum + c.earnRaw, 0);

  function tabCount(tab: ActiveTab): number {
    if (tab === "all") return MOCK_CAMPAIGNS.length;
    if (tab === "active")
      return MOCK_CAMPAIGNS.filter(
        (c) => c.status === "active" || c.status === "pending_review",
      ).length;
    if (tab === "pending")
      return MOCK_CAMPAIGNS.filter((c) => c.status === "applied").length;
    if (tab === "completed")
      return MOCK_CAMPAIGNS.filter((c) => c.status === "completed").length;
    return 0;
  }

  return (
    <div className="pl-page">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="pl-nav">
        <Link href="/creator/dashboard" className="pl-nav-back">
          ← WORKSPACE
        </Link>
        <span className="pl-nav-sep">|</span>
        <span className="pl-nav-title">PIPELINE</span>
        <div className="pl-nav-right">
          <Link href="/creator/work/today" className="pl-nav-link">
            Today →
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <header className="pl-hero">
        <div className="pl-hero-inner">
          <h1 className="pl-headline">Your Pipeline</h1>
          <p className="pl-hero-sub">
            {MOCK_CAMPAIGNS.filter((c) => c.status !== "completed").length}{" "}
            campaigns · ${totalPotential.toLocaleString()} potential
          </p>
        </div>

        {/* Tabs */}
        <div className="pl-tabs">
          {TAB_ORDER.map((tab) => (
            <button
              key={tab}
              className={`pl-tab${activeTab === tab ? " pl-tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {TAB_LABELS[tab]}
              <span className="pl-tab-count">{tabCount(tab)}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── Sort toolbar ────────────────────────────────────── */}
      <div className="pl-toolbar">
        <span className="pl-sort-label">Sort</span>
        {SORT_OPTIONS.map((s) => (
          <button
            key={s.value}
            className={`pl-chip${sortMode === s.value ? " pl-chip-active" : ""}`}
            onClick={() => setSortMode(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Campaign list ────────────────────────────────────── */}
      {sorted.length === 0 ? (
        <div className="pl-empty">
          <p className="pl-empty-title">
            {activeTab === "active"
              ? "No active campaigns"
              : "No campaigns match"}
          </p>
          <p className="pl-empty-sub">
            {activeTab === "active"
              ? "Head to Discover to find your next campaign"
              : "Try a different filter or discover new opportunities"}
          </p>
          {activeTab === "active" ? (
            <Link
              href="/creator/explore"
              className="pl-empty-discover pl-empty-discover-primary"
            >
              Browse Discover →
            </Link>
          ) : (
            <>
              <button
                className="pl-empty-reset"
                onClick={() => {
                  setActiveTab("all");
                  setSortMode("deadline");
                }}
              >
                Reset filters
              </button>
              <Link href="/creator/explore" className="pl-empty-discover">
                Discover campaigns →
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="pl-list">
          {sorted.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              expanded={expandedId === c.id}
              onToggle={() => toggleExpand(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
