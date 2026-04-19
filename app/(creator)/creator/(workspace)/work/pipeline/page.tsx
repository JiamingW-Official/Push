"use client";

import Link from "next/link";
import { useState } from "react";
import "./pipeline.css";

/* ── Types ─────────────────────────────────────────────────── */

type PipelineStatus = "applied" | "active" | "completed";
type ViewMode = "grid" | "list";
type ActiveTab = "all" | PipelineStatus;

type PipelineCampaign = {
  id: string;
  campaignName: string;
  merchantName: string;
  category: string;
  status: PipelineStatus;
  deadline: string;
  daysLeft: number;
  earnEstimate: string;
  contentRequired: number;
  contentSubmitted: number;
  logoInitials: string;
  logoColor: string;
  appliedDate?: string;
  completedDate?: string;
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
    category: "Coffee",
    status: "active",
    deadline: "Apr 20",
    daysLeft: 2,
    earnEstimate: "$18",
    contentRequired: 3,
    contentSubmitted: 2,
    logoInitials: "BS",
    logoColor: "#003049",
    appliedDate: "Apr 12",
  },
  {
    id: "pc-002",
    campaignName: "Lunch Reel Campaign",
    merchantName: "Superiority Burger",
    category: "Food",
    status: "active",
    deadline: "Apr 22",
    daysLeft: 4,
    earnEstimate: "$32",
    contentRequired: 4,
    contentSubmitted: 1,
    logoInitials: "SB",
    logoColor: "#c1121f",
    appliedDate: "Apr 10",
  },
  {
    id: "pc-003",
    campaignName: "Afternoon Lifestyle Post",
    merchantName: "Flamingo Estate",
    category: "Lifestyle",
    status: "active",
    deadline: "Apr 25",
    daysLeft: 7,
    earnEstimate: "$44",
    contentRequired: 2,
    contentSubmitted: 0,
    logoInitials: "FE",
    logoColor: "#c9a96e",
    appliedDate: "Apr 14",
  },
  {
    id: "pc-004",
    campaignName: "Matcha Bar Content",
    merchantName: "Cha Cha Matcha",
    category: "Coffee",
    status: "applied",
    deadline: "Apr 28",
    daysLeft: 10,
    earnEstimate: "$34",
    contentRequired: 3,
    contentSubmitted: 0,
    logoInitials: "CC",
    logoColor: "#669bbc",
    appliedDate: "Apr 16",
  },
  {
    id: "pc-005",
    campaignName: "Skin Care Launch",
    merchantName: "Brow Theory",
    category: "Beauty",
    status: "applied",
    deadline: "May 1",
    daysLeft: 13,
    earnEstimate: "$55",
    contentRequired: 5,
    contentSubmitted: 0,
    logoInitials: "BT",
    logoColor: "#780000",
    appliedDate: "Apr 17",
  },
  {
    id: "pc-006",
    campaignName: "Saturday Brunch Series",
    merchantName: "Egg Shop",
    category: "Food",
    status: "applied",
    deadline: "May 5",
    daysLeft: 17,
    earnEstimate: "$28",
    contentRequired: 2,
    contentSubmitted: 0,
    logoInitials: "ES",
    logoColor: "#4a5568",
    appliedDate: "Apr 17",
  },
  {
    id: "pc-007",
    campaignName: "Spring Collection Reel",
    merchantName: "Assembly New York",
    category: "Retail",
    status: "completed",
    deadline: "Apr 10",
    daysLeft: -8,
    earnEstimate: "$48",
    contentRequired: 4,
    contentSubmitted: 4,
    logoInitials: "AN",
    logoColor: "#003049",
    completedDate: "Apr 10",
  },
  {
    id: "pc-008",
    campaignName: "Neighborhood Run Club",
    merchantName: "Asics Williamsburg",
    category: "Fitness",
    status: "completed",
    deadline: "Apr 5",
    daysLeft: -13,
    earnEstimate: "$62",
    contentRequired: 3,
    contentSubmitted: 3,
    logoInitials: "AW",
    logoColor: "#669bbc",
    completedDate: "Apr 5",
  },
  {
    id: "pc-009",
    campaignName: "Matcha Latte Feature",
    merchantName: "Moto Coffee",
    category: "Coffee",
    status: "completed",
    deadline: "Mar 28",
    daysLeft: -21,
    earnEstimate: "$22",
    contentRequired: 2,
    contentSubmitted: 2,
    logoInitials: "MC",
    logoColor: "#4a5568",
    completedDate: "Mar 28",
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

const DEADLINE_FILTERS: FilterChipOption[] = [
  { label: "Any Deadline", value: "all" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
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
  completed: {
    label: "COMPLETED",
    color: "var(--dark)",
    dotColor: "#003049",
  },
};

const TAB_ORDER: ActiveTab[] = ["all", "active", "applied", "completed"];
const TAB_LABELS: Record<ActiveTab, string> = {
  all: "ALL",
  active: "ACTIVE",
  applied: "APPLIED",
  completed: "COMPLETED",
};

function getProgressPct(submitted: number, required: number): number {
  if (required === 0) return 0;
  return Math.round((submitted / required) * 100);
}

/* ── Sub-components ────────────────────────────────────────── */

function CampaignCard({
  campaign,
  viewMode,
}: {
  campaign: PipelineCampaign;
  viewMode: ViewMode;
}) {
  const cfg = STATUS_CONFIG[campaign.status];
  const pct = getProgressPct(
    campaign.contentSubmitted,
    campaign.contentRequired,
  );
  const urgent = campaign.daysLeft >= 0 && campaign.daysLeft <= 3;

  return (
    <div
      className={`pl-card pl-card-${campaign.status} pl-view-${viewMode}`}
      role="article"
    >
      {/* Left status border painted via CSS pseudo-element */}

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
              className={`pl-status-dot`}
              style={{ background: cfg.dotColor }}
              aria-hidden="true"
            />
          </div>
          <p className="pl-card-merchant">{campaign.merchantName}</p>

          {/* Progress bar — only for active */}
          {campaign.status === "active" && (
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
        </div>

        {/* Meta */}
        <div className="pl-card-meta">
          <div className="pl-card-earn">{campaign.earnEstimate}</div>
          <div className={`pl-card-deadline${urgent ? " pl-urgent" : ""}`}>
            {campaign.daysLeft < 0
              ? `Done ${campaign.completedDate ?? ""}`
              : campaign.daysLeft === 0
                ? "Due today"
                : `${campaign.daysLeft}d left`}
          </div>
          <div className="pl-card-category">{campaign.category}</div>
        </div>

        {/* Quick actions */}
        <div className="pl-card-actions">
          {campaign.status === "active" && (
            <Link
              href="/creator/campaigns/demo-campaign-001/post"
              className="pl-action-icon pl-action-submit"
              title="Submit content"
              aria-label="Submit content"
            >
              ↑
            </Link>
          )}
          <Link
            href="/creator/campaigns/demo-campaign-001"
            className="pl-action-icon pl-action-view"
            title="View campaign"
            aria-label="View campaign"
          >
            ◈
          </Link>
          <Link
            href="/creator/messages"
            className="pl-action-icon pl-action-msg"
            title="Message merchant"
            aria-label="Message merchant"
          >
            ◉
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */

export default function WorkPipelinePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deadlineFilter, setDeadlineFilter] = useState("all");

  // Filtering logic
  const filtered = MOCK_CAMPAIGNS.filter((c) => {
    if (activeTab !== "all" && c.status !== activeTab) return false;
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
    if (deadlineFilter === "week" && c.daysLeft > 7) return false;
    if (deadlineFilter === "month" && c.daysLeft > 30) return false;
    return true;
  });

  // Group by status for column layout
  const grouped: Record<PipelineStatus, PipelineCampaign[]> = {
    applied: filtered.filter((c) => c.status === "applied"),
    active: filtered.filter((c) => c.status === "active"),
    completed: filtered.filter((c) => c.status === "completed"),
  };

  const totalPotential = MOCK_CAMPAIGNS.filter(
    (c) => c.status !== "completed",
  ).reduce(
    (sum, c) => sum + parseInt(c.earnEstimate.replace("$", "") || "0"),
    0,
  );
  const activeCount = MOCK_CAMPAIGNS.filter(
    (c) => c.status === "active",
  ).length;

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
            <p className="pl-hero-sub">
              Track every campaign from application to completion
            </p>
          </div>
          <div className="pl-hero-right">
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
            const count =
              tab === "all"
                ? MOCK_CAMPAIGNS.length
                : MOCK_CAMPAIGNS.filter((c) => c.status === tab).length;
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

          {/* Deadline filter chips */}
          <div className="pl-filter-group">
            {DEADLINE_FILTERS.map((f) => (
              <button
                key={f.value}
                className={`pl-chip${deadlineFilter === f.value ? " pl-chip-active" : ""}`}
                onClick={() => setDeadlineFilter(f.value)}
              >
                {f.label}
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
          <p className="pl-empty-title">No campaigns match your filters</p>
          <button
            className="pl-empty-reset"
            onClick={() => {
              setActiveTab("all");
              setCategoryFilter("all");
              setDeadlineFilter("all");
            }}
          >
            Reset filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid / Column layout */
        <div className="pl-columns">
          {(["applied", "active", "completed"] as PipelineStatus[]).map(
            (status) => {
              const cfg = STATUS_CONFIG[status];
              const cols = grouped[status];
              if (activeTab !== "all" && activeTab !== status) return null;
              return (
                <div key={status} className={`pl-column pl-col-${status}`}>
                  <div className="pl-col-header">
                    <span
                      className="pl-col-dot"
                      style={{ background: cfg.dotColor }}
                    />
                    <span className="pl-col-title" style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                    <span className="pl-col-count">{cols.length}</span>
                  </div>
                  <div className="pl-col-cards">
                    {cols.length === 0 ? (
                      <div className="pl-col-empty">No campaigns</div>
                    ) : (
                      cols.map((c, i) => (
                        <div
                          key={c.id}
                          style={{ animationDelay: `${i * 50}ms` }}
                          className="pl-card-wrapper"
                        >
                          <CampaignCard campaign={c} viewMode={viewMode} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            },
          )}
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
          {filtered.map((c, i) => (
            <div
              key={c.id}
              style={{ animationDelay: `${i * 30}ms` }}
              className="pl-card-wrapper"
            >
              <CampaignCard campaign={c} viewMode={viewMode} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
