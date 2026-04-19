"use client";

import Link from "next/link";
import { useState } from "react";
import "./pipeline.css";

/* ── Types ─────────────────────────────────────────────────── */

type PipelineStatus = "applied" | "active" | "pending_review" | "completed";
type ViewMode = "grid" | "list";
type ActiveTab = "all" | "active" | "deadlines" | "completed";
type SortMode = "deadline" | "earn" | "merchant";

type PipelineCampaign = {
  id: string;
  campaignName: string;
  merchantName: string;
  merchantContact?: string;
  category: string;
  categoryColor: string;
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
  bonusTarget?: number;
  attributionNote?: string;
};

type FilterChipOption = {
  label: string;
  value: string;
};

/* ── Mock data ─────────────────────────────────────────────── */

const MOCK_CAMPAIGNS: PipelineCampaign[] = [
  {
    id: "pc-001",
    campaignName: "Morning Coffee Story",
    merchantName: "Blank Street Coffee",
    merchantContact: "/creator/messages?merchant=blank-street",
    category: "Coffee",
    categoryColor: "#c9a96e",
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
    bonusTarget: 10,
    attributionNote:
      "Scan QR at register — show barista your creator code BS-4821.",
  },
  {
    id: "pc-002",
    campaignName: "Lunch Reel Campaign",
    merchantName: "Superiority Burger",
    merchantContact: "/creator/messages?merchant=superiority-burger",
    category: "Food",
    categoryColor: "#c1121f",
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
    bonusTarget: 8,
    attributionNote: "Show SB-7734 code at the counter to log your walk-in.",
  },
  {
    id: "pc-003",
    campaignName: "Afternoon Lifestyle Post",
    merchantName: "Flamingo Estate",
    merchantContact: "/creator/messages?merchant=flamingo-estate",
    category: "Lifestyle",
    categoryColor: "#669bbc",
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
    categoryColor: "#c9a96e",
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
    categoryColor: "#780000",
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
    categoryColor: "#c1121f",
    status: "applied",
    deadline: "May 5",
    daysLeft: 17,
    earnEstimate: "$28",
    earnRaw: 28,
    contentRequired: 2,
    contentSubmitted: 0,
    logoInitials: "ES",
    logoColor: "#4a5568",
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
    categoryColor: "#003049",
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
    categoryColor: "#669bbc",
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
    categoryColor: "#c9a96e",
    status: "completed",
    deadline: "Mar 28",
    daysLeft: -21,
    earnEstimate: "$22",
    earnRaw: 22,
    contentRequired: 2,
    contentSubmitted: 2,
    logoInitials: "MC",
    logoColor: "#4a5568",
    completedDate: "Mar 28",
    brief:
      "2 close-up product shots of the seasonal matcha latte. Warm tones, morning light. No text overlays.",
    walkinCount: 3,
  },
];

const CATEGORY_FILTERS: FilterChipOption[] = [
  { label: "All Categories", value: "all" },
  { label: "Coffee", value: "Coffee" },
  { label: "Food", value: "Food" },
  { label: "Beauty", value: "Beauty" },
  { label: "Retail", value: "Retail" },
  { label: "Fitness", value: "Fitness" },
  { label: "Lifestyle", value: "Lifestyle" },
];

/* ── Helpers ──────────────────────────────────────────────── */

const STATUS_CONFIG: Record<
  PipelineStatus,
  { label: string; color: string; dotColor: string }
> = {
  applied: {
    label: "APPLIED",
    color: "var(--tertiary)",
    dotColor: "#669bbc",
  },
  active: {
    label: "ACTIVE",
    color: "var(--primary)",
    dotColor: "#c1121f",
  },
  pending_review: {
    label: "PENDING REVIEW",
    color: "var(--champagne)",
    dotColor: "#c9a96e",
  },
  completed: {
    label: "COMPLETED",
    color: "var(--graphite)",
    dotColor: "#4a5568",
  },
};

const TAB_ORDER: ActiveTab[] = ["all", "active", "deadlines", "completed"];
const TAB_LABELS: Record<ActiveTab, string> = {
  all: "ALL",
  active: "ACTIVE",
  deadlines: "DEADLINES",
  completed: "COMPLETED",
};

const SORT_OPTIONS: { label: string; value: SortMode }[] = [
  { label: "Deadline", value: "deadline" },
  { label: "Earnings", value: "earn" },
  { label: "Merchant", value: "merchant" },
];

function getProgressPct(submitted: number, required: number): number {
  if (required === 0) return 0;
  return Math.round((submitted / required) * 100);
}

function getDeadlineUrgency(daysLeft: number, status: PipelineStatus) {
  if (status === "completed") return "done";
  if (daysLeft < 0) return "overdue";
  if (daysLeft < 3) return "critical"; // < 3 days: red pulse
  if (daysLeft <= 7) return "amber"; // 3-7 days: amber
  return "safe"; // > 7 days: green
}

/* ── Deadline Badge ────────────────────────────────────────── */

function DeadlineBadge({
  daysLeft,
  status,
  completedDate,
}: {
  daysLeft: number;
  status: PipelineStatus;
  completedDate?: string;
}) {
  const urgency = getDeadlineUrgency(daysLeft, status);

  if (urgency === "done") {
    return (
      <span className="pl-deadline-badge pl-deadline-done">
        Done {completedDate ?? ""}
      </span>
    );
  }
  if (urgency === "overdue") {
    // Overdue is shown via the card-level stamp, badge shows nothing extra
    return (
      <span className="pl-deadline-badge pl-deadline-overdue">OVERDUE</span>
    );
  }
  if (urgency === "critical") {
    return (
      <span className="pl-deadline-badge pl-deadline-critical">
        {daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
      </span>
    );
  }
  if (urgency === "amber") {
    return (
      <span className="pl-deadline-badge pl-deadline-amber">
        {daysLeft}d left
      </span>
    );
  }
  // safe
  return (
    <span className="pl-deadline-badge pl-deadline-safe">{daysLeft}d left</span>
  );
}

/* ── Status Action Button ──────────────────────────────────── */

function StatusActionButton({ campaign }: { campaign: PipelineCampaign }) {
  if (campaign.status === "active") {
    return (
      <Link
        href={`/creator/campaigns/${campaign.id}`}
        className="pl-action-btn pl-action-primary"
        onClick={(e) => e.stopPropagation()}
      >
        Submit Content ↑
      </Link>
    );
  }
  if (campaign.status === "applied") {
    return (
      <button
        className="pl-action-btn pl-action-ghost"
        onClick={(e) => e.stopPropagation()}
        title="Withdraw application"
      >
        Withdraw
      </button>
    );
  }
  if (campaign.status === "pending_review") {
    return (
      <Link
        href={`/creator/campaigns/${campaign.id}`}
        className="pl-action-btn pl-action-secondary"
        onClick={(e) => e.stopPropagation()}
      >
        Check Status
      </Link>
    );
  }
  if (campaign.status === "completed") {
    return (
      <Link
        href={`/creator/campaigns/${campaign.id}`}
        className="pl-action-btn pl-action-ghost"
        onClick={(e) => e.stopPropagation()}
      >
        View Details
      </Link>
    );
  }
  return null;
}

/* ── Expanded Panel ────────────────────────────────────────── */

function ExpandedPanel({ campaign }: { campaign: PipelineCampaign }) {
  return (
    <div className="pl-expand-panel">
      {/* Brief */}
      {campaign.brief && (
        <div className="pl-expand-section">
          <p className="pl-expand-label">CAMPAIGN BRIEF</p>
          <p className="pl-expand-text">{campaign.brief}</p>
        </div>
      )}

      <div className="pl-expand-row">
        {/* Submission status */}
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

        {/* Attribution */}
        {campaign.attributionNote && (
          <div className="pl-expand-section">
            <p className="pl-expand-label">ATTRIBUTION</p>
            <p className="pl-expand-text">{campaign.attributionNote}</p>
          </div>
        )}

        {/* Contact */}
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
    </div>
  );
}

/* ── Campaign Card ─────────────────────────────────────────── */

function CampaignCard({
  campaign,
  viewMode,
  expanded,
  onToggle,
}: {
  campaign: PipelineCampaign;
  viewMode: ViewMode;
  expanded: boolean;
  onToggle: () => void;
}) {
  const cfg = STATUS_CONFIG[campaign.status];
  const pct = getProgressPct(
    campaign.contentSubmitted,
    campaign.contentRequired,
  );
  const urgency = getDeadlineUrgency(campaign.daysLeft, campaign.status);
  const overdue = urgency === "overdue";
  const critical = urgency === "critical";

  return (
    <div
      className={[
        "pl-card",
        `pl-card-${campaign.status}`,
        overdue ? "pl-card-overdue" : "",
        critical ? "pl-card-critical" : "",
        expanded ? "pl-card-expanded" : "",
        `pl-view-${viewMode}`,
      ]
        .filter(Boolean)
        .join(" ")}
      role="article"
      onClick={onToggle}
      aria-expanded={expanded}
      style={{ cursor: "pointer" }}
    >
      {/* Category color strip */}
      <div
        className="pl-card-category-strip"
        style={{ background: campaign.categoryColor }}
        aria-hidden="true"
      />

      <div className="pl-card-inner">
        {/* Logo */}
        <div
          className="pl-card-logo"
          style={{ background: campaign.logoColor }}
          aria-hidden="true"
        >
          {campaign.logoInitials}
        </div>

        {/* Main info */}
        <div className="pl-card-info">
          <div className="pl-card-header-row">
            <p className="pl-card-campaign">{campaign.campaignName}</p>
            <span
              className="pl-status-dot"
              style={{ background: cfg.dotColor }}
              aria-hidden="true"
            />
          </div>
          <p className="pl-card-merchant">{campaign.merchantName}</p>

          {/* Progress bar — active / pending_review / completed */}
          {(campaign.status === "active" ||
            campaign.status === "pending_review" ||
            campaign.status === "completed") && (
            <div className="pl-progress-wrap">
              <div className="pl-progress-track">
                <div
                  className="pl-progress-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="pl-progress-label">
                {campaign.contentSubmitted}/{campaign.contentRequired} posts
              </span>
            </div>
          )}

          {/* Walk-in count micro-detail */}
          {campaign.status === "active" &&
            campaign.walkinCount !== undefined && (
              <p className="pl-card-walkin">
                {campaign.walkinCount} walk-ins so far
              </p>
            )}

          {/* Bonus tier progress */}
          {campaign.bonusTarget !== undefined &&
            campaign.walkinCount !== undefined &&
            campaign.status === "active" && (
              <p className="pl-card-bonus">
                {campaign.walkinCount}/{campaign.bonusTarget} toward bonus tier
              </p>
            )}
        </div>

        {/* Meta */}
        <div className="pl-card-meta">
          <div className="pl-card-earn">{campaign.earnEstimate}</div>
          <DeadlineBadge
            daysLeft={campaign.daysLeft}
            status={campaign.status}
            completedDate={campaign.completedDate}
          />
          <div className="pl-card-category-label">{campaign.category}</div>
        </div>

        {/* Quick actions — revealed on hover */}
        <div className="pl-card-actions">
          {campaign.status === "active" && (
            <Link
              href={`/creator/campaigns/${campaign.id}/post`}
              className="pl-action-icon pl-action-submit"
              title="Submit content"
              aria-label="Submit content"
              onClick={(e) => e.stopPropagation()}
            >
              ↑
            </Link>
          )}
          <Link
            href={`/creator/campaigns/${campaign.id}`}
            className="pl-action-icon pl-action-view"
            title="View campaign"
            aria-label="View campaign"
            onClick={(e) => e.stopPropagation()}
          >
            ◈
          </Link>
          <Link
            href="/creator/messages"
            className="pl-action-icon pl-action-msg"
            title="Message merchant"
            aria-label="Message merchant"
            onClick={(e) => e.stopPropagation()}
          >
            ◉
          </Link>
        </div>
      </div>

      {/* Status action button */}
      <div className="pl-card-cta" onClick={(e) => e.stopPropagation()}>
        <StatusActionButton campaign={campaign} />
        <span className="pl-expand-toggle" aria-hidden="true">
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Expanded panel */}
      {expanded && <ExpandedPanel campaign={campaign} />}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */

export default function WorkPipelinePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("deadline");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  // Tab-based filtering
  const tabFiltered = MOCK_CAMPAIGNS.filter((c) => {
    if (activeTab === "active")
      return c.status === "active" || c.status === "pending_review";
    if (activeTab === "deadlines")
      return c.daysLeft >= 0 && c.daysLeft <= 7 && c.status !== "completed";
    if (activeTab === "completed") return c.status === "completed";
    return true; // "all"
  });

  // Category filter
  const filtered = tabFiltered.filter((c) => {
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
    return true;
  });

  // Sort
  const sortedFiltered = [...filtered].sort((a, b) => {
    if (sortMode === "earn") return b.earnRaw - a.earnRaw;
    if (sortMode === "merchant")
      return a.merchantName.localeCompare(b.merchantName);
    // deadline (default): overdue first, then ascending daysLeft
    const aOverdue =
      a.daysLeft < 0 && a.status !== "completed" ? -1000 + a.daysLeft : 0;
    const bOverdue =
      b.daysLeft < 0 && b.status !== "completed" ? -1000 + b.daysLeft : 0;
    if (aOverdue !== bOverdue) return aOverdue - bOverdue;
    return a.daysLeft - b.daysLeft;
  });

  // Group by status for column layout
  const grouped: Record<PipelineStatus, PipelineCampaign[]> = {
    applied: sortedFiltered.filter((c) => c.status === "applied"),
    active: sortedFiltered.filter((c) => c.status === "active"),
    pending_review: sortedFiltered.filter((c) => c.status === "pending_review"),
    completed: sortedFiltered.filter((c) => c.status === "completed"),
  };

  // Summary stats
  const totalPotential = MOCK_CAMPAIGNS.filter(
    (c) => c.status !== "completed",
  ).reduce((sum, c) => sum + c.earnRaw, 0);

  const activeCount = MOCK_CAMPAIGNS.filter(
    (c) => c.status === "active",
  ).length;
  const inProgressCount = MOCK_CAMPAIGNS.filter(
    (c) => c.status !== "completed",
  ).length;

  // This-week potential: active + pending_review with deadline <= 7 days
  const thisWeekPotential = MOCK_CAMPAIGNS.filter(
    (c) =>
      (c.status === "active" || c.status === "pending_review") &&
      c.daysLeft >= 0 &&
      c.daysLeft <= 7,
  ).reduce((sum, c) => sum + c.earnRaw, 0);

  // Deadlines this week count
  const deadlinesThisWeek = MOCK_CAMPAIGNS.filter(
    (c) => c.daysLeft >= 0 && c.daysLeft <= 7 && c.status !== "completed",
  ).length;

  // Tab badge counts
  function tabCount(tab: ActiveTab): number {
    if (tab === "all") return MOCK_CAMPAIGNS.length;
    if (tab === "active")
      return MOCK_CAMPAIGNS.filter(
        (c) => c.status === "active" || c.status === "pending_review",
      ).length;
    if (tab === "deadlines")
      return MOCK_CAMPAIGNS.filter(
        (c) => c.daysLeft >= 0 && c.daysLeft <= 7 && c.status !== "completed",
      ).length;
    if (tab === "completed")
      return MOCK_CAMPAIGNS.filter((c) => c.status === "completed").length;
    return 0;
  }

  // Grid column statuses to show
  const GRID_STATUSES: PipelineStatus[] = [
    "applied",
    "active",
    "pending_review",
    "completed",
  ];
  const GRID_STATUS_LABELS: Record<PipelineStatus, string> = {
    applied: "APPLIED",
    active: "ACTIVE",
    pending_review: "PENDING REVIEW",
    completed: "COMPLETED",
  };

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
          <div className="pl-hero-left">
            <p className="pl-eyebrow">
              {activeCount} ACTIVE · {MOCK_CAMPAIGNS.length} TOTAL
            </p>
            <h1 className="pl-headline">PIPELINE</h1>
            <p className="pl-headline-sub">
              {inProgressCount} campaigns in progress
            </p>
            <p className="pl-hero-sub">
              Track every campaign from application to completion
            </p>
          </div>
          <div className="pl-hero-right">
            {/* This-week potential */}
            {thisWeekPotential > 0 && (
              <div className="pl-hero-week-stat">
                <p className="pl-week-label">POTENTIAL THIS WEEK</p>
                <p className="pl-week-value">${thisWeekPotential}</p>
              </div>
            )}

            {/* Deadline warning */}
            {deadlinesThisWeek > 0 && (
              <div className="pl-hero-deadline-warn">
                <span className="pl-warn-dot" aria-hidden="true" />
                {deadlinesThisWeek} deadline{deadlinesThisWeek > 1 ? "s" : ""}{" "}
                this week
              </div>
            )}

            <p className="pl-potential-label">POTENTIAL EARNINGS</p>
            <p className="pl-potential-value">
              ${totalPotential.toLocaleString()}
            </p>
            <p className="pl-potential-sub">across active + applied</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="pl-tabs">
          {TAB_ORDER.map((tab) => {
            const count = tabCount(tab);
            return (
              <button
                key={tab}
                className={`pl-tab${activeTab === tab ? " pl-tab-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab]}
                <span className="pl-tab-count">{count}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="pl-toolbar">
        <div className="pl-filters">
          {/* Category filter chips */}
          <div className="pl-filter-group">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.value}
                className={`pl-chip${categoryFilter === f.value ? " pl-chip-active" : ""}`}
                onClick={() => setCategoryFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="pl-filter-divider" />

          {/* Sort options */}
          <div className="pl-filter-group pl-sort-group">
            <span className="pl-sort-label">SORT</span>
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
        </div>

        {/* View toggle */}
        <div className="pl-view-toggle">
          <button
            className={`pl-view-btn${viewMode === "grid" ? " pl-view-active" : ""}`}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            title="Grid view"
          >
            ▦
          </button>
          <button
            className={`pl-view-btn${viewMode === "list" ? " pl-view-active" : ""}`}
            onClick={() => setViewMode("list")}
            aria-label="List view"
            title="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="pl-empty">
          <p className="pl-empty-ghost" aria-hidden="true">
            EMPTY
          </p>
          <p className="pl-empty-title">
            {activeTab === "active"
              ? "No active campaigns"
              : "No campaigns match your filters"}
          </p>
          <p className="pl-empty-sub">
            {activeTab === "active"
              ? "Head to Discover to find your next campaign"
              : "Try adjusting filters or discover new opportunities"}
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
                  setCategoryFilter("all");
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
      ) : viewMode === "grid" ? (
        /* Grid / Column layout — 4 columns for 4 statuses */
        <div className="pl-columns">
          {GRID_STATUSES.map((status) => {
            const cfg = STATUS_CONFIG[status];
            const cols = grouped[status];
            // In active/deadlines tab, hide applied + completed columns
            if (
              activeTab === "active" &&
              (status === "applied" || status === "completed")
            )
              return null;
            if (
              activeTab === "deadlines" &&
              (status === "applied" || status === "completed")
            )
              return null;
            if (activeTab === "completed" && status !== "completed")
              return null;
            return (
              <div key={status} className={`pl-column pl-col-${status}`}>
                <div className="pl-col-header">
                  <span
                    className="pl-col-dot"
                    style={{ background: cfg.dotColor }}
                  />
                  <span className="pl-col-title" style={{ color: cfg.color }}>
                    {GRID_STATUS_LABELS[status]}
                  </span>
                  <span className="pl-col-count">{cols.length}</span>
                </div>
                <div className="pl-col-cards">
                  {cols.length === 0 ? (
                    <div className="pl-col-empty">
                      {status === "active" ? (
                        <Link
                          href="/creator/explore"
                          className="pl-col-empty-link"
                        >
                          Browse Discover →
                        </Link>
                      ) : (
                        "No campaigns"
                      )}
                    </div>
                  ) : (
                    cols.map((c, i) => (
                      <div
                        key={c.id}
                        style={{ animationDelay: `${i * 55}ms` }}
                        className="pl-card-wrapper"
                      >
                        <CampaignCard
                          campaign={c}
                          viewMode={viewMode}
                          expanded={expandedId === c.id}
                          onToggle={() => toggleExpand(c.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List layout */
        <div className="pl-list">
          <div className="pl-list-header">
            <span>Campaign</span>
            <span>Merchant</span>
            <span>Status</span>
            <span>Deadline</span>
            <span>Earnings</span>
            <span>Actions</span>
          </div>
          {sortedFiltered.map((c, i) => (
            <div
              key={c.id}
              style={{ animationDelay: `${i * 35}ms` }}
              className="pl-card-wrapper"
            >
              <CampaignCard
                campaign={c}
                viewMode={viewMode}
                expanded={expandedId === c.id}
                onToggle={() => toggleExpand(c.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
