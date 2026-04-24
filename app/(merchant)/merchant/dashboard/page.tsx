"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/browser";
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
  // v6 4-tier (lite/essentials/pro/advanced) is the default for new signups.
  // Legacy v4 tier names (starter/growth/scale) preserved for grandfathered cohorts.
  plan?:
    | "lite"
    | "essentials"
    | "pro"
    | "advanced"
    | "starter"
    | "growth"
    | "scale";
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
  qr_scans?: number;
  attributed_revenue?: number;
  // gross_attributed_revenue is the un-weighted sum; attributed_revenue is the
  // weight-applied figure that rolls up to billing. When the two differ, the
  // delta is from repeat-customer attribution share decreasing over time
  // (FTC 16 CFR Part 255 — see lib/services/attribution-decay.ts).
  gross_attributed_revenue?: number;
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

type SidebarTab = "campaigns" | "applications" | "analytics" | "settings";
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
    id: "demo-campaign-001",
    title: "Free Latte for a 30-Second Reel",
    description:
      "Come in, order any latte, and capture a 30-second Reel showing your experience — from ordering to that first sip.",
    category: "Food & Drink",
    payout: 0,
    spots_total: 12,
    spots_remaining: 8,
    deadline: "2026-04-20T23:59:00Z",
    created_at: "2026-04-01T10:00:00Z",
    status: "active",
    applications_count: 4,
    qr_scans: 28,
    attributed_revenue: 420,
  },
  {
    id: "demo-campaign-mc-002",
    title: "Morning Rush Special Reel",
    description:
      "Capture the 7:30–9am morning rush at Blank Street — the queue, the baristas, the regulars.",
    category: "Food & Drink",
    payout: 65,
    spots_total: 5,
    spots_remaining: 3,
    deadline: "2026-04-26T23:59:00Z",
    created_at: "2026-04-05T08:00:00Z",
    status: "active",
    applications_count: 2,
    qr_scans: 19,
    attributed_revenue: 820,
  },
  {
    id: "demo-campaign-mc-003",
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
    applications_count: 4,
    qr_scans: 0,
    attributed_revenue: 640,
    gross_attributed_revenue: 720,
  },
];

const DEMO_APPLICATIONS: Application[] = [
  {
    id: "demo-app-m-001",
    campaign_id: "demo-campaign-001",
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
    id: "demo-app-m-002",
    campaign_id: "demo-campaign-001",
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
    id: "demo-app-m-003",
    campaign_id: "demo-campaign-001",
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
    id: "demo-app-m-004",
    campaign_id: "demo-campaign-001",
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
    id: "demo-app-m-005",
    campaign_id: "demo-campaign-mc-002",
    campaign_title: "Morning Rush Special Reel",
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
    id: "demo-app-m-006",
    campaign_id: "demo-campaign-mc-002",
    campaign_title: "Morning Rush Special Reel",
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
];

const DEMO_ANALYTICS: Analytics = {
  qr_scans_month: 47,
  qr_scans_delta: 12,
  new_customers: 34,
  active_creators: 5,
  total_spend: 315,
  estimated_revenue: 1240,
  roi_multiple: 3.9,
};

/* ── Tier config ─────────────────────────────────────────── */
/* Path A: v5.1 material hex mapped to brand-palette tier aliases. */
const TIER_COLORS: Record<CreatorTier, string> = {
  seed: "var(--tier-seed)",
  explorer: "var(--tier-explorer)",
  operator: "var(--tier-operator)",
  proven: "var(--tier-proven)",
  closer: "var(--tier-closer)",
  partner: "var(--tier-partner)",
};

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

const IconLocations = () => (
  <svg
    className="db-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M8 1C5.791 1 4 2.791 4 5c0 3.5 4 9 4 9s4-5.5 4-9c0-2.209-1.791-4-4-4Z" />
    <circle cx="8" cy="5" r="1.5" />
  </svg>
);

const IconGhost = () => (
  <svg
    className="db-empty-state__icon"
    viewBox="0 0 80 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M40 8C24.536 8 12 20.536 12 36v28l8-8 8 8 8-8 8 8 8-8 8 8V36C60 20.536 47.464 8 40 8Z" />
    <circle cx="31" cy="36" r="3" fill="currentColor" />
    <circle cx="49" cy="36" r="3" fill="currentColor" />
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
          </div>
          <div className="db-skeleton-block db-skeleton-table skeleton" />
        </div>
      </div>
    </div>
  );
}

/* ── StatCard ────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  trend,
  accent = false,
  neutral = false,
}: {
  label: string;
  value: number | string;
  trend: string;
  accent?: boolean;
  neutral?: boolean;
}) {
  return (
    <div className={`db-stat-card${accent ? " db-stat-card--accent" : ""}`}>
      <div className="db-stat-card__label">{label}</div>
      <div className="db-stat-card__number">{value}</div>
      <div className={`db-stat-card__trend${neutral ? " neutral" : ""}`}>
        {trend}
      </div>
    </div>
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

/* ── TierBadge ── Design.md spec: "Material · Tier" ─────── */
function TierBadge({ tier }: { tier: CreatorTier }) {
  type Cfg = { bg: string; color: string; border: string; borderLeft?: string };
  /* Path A: v5.1 material hex mapped to brand-palette tier tokens. */
  const CFG: Record<CreatorTier, Cfg> = {
    seed: {
      bg: "transparent",
      color: "var(--dark)",
      border: "1.5px dashed var(--line-strong)",
    },
    explorer: {
      bg: "var(--tier-explorer)",
      color: "var(--dark)",
      border: "1px solid var(--tier-explorer)",
    },
    operator: {
      bg: "var(--tier-operator)",
      color: "#fff",
      border: "1px solid var(--tier-operator)",
    },
    proven: {
      bg: "var(--tier-proven)",
      color: "#fff",
      border: "1px solid var(--tier-proven)",
    },
    closer: {
      bg: "var(--tier-closer)",
      color: "#fff",
      border: "1px solid var(--tier-closer)",
    },
    partner: {
      bg: "var(--tier-partner)",
      color: "#fff",
      border: "1px solid var(--tier-partner)",
      borderLeft: "3px solid var(--primary)",
    },
  };
  const c = CFG[tier];
  return (
    <span
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase" as const,
        letterSpacing: "0.08em",
        padding: "5px 12px",
        borderRadius: "var(--r-sm)",
        background: c.bg,
        color: c.color,
        border: c.border,
        borderLeft: c.borderLeft ?? c.border,
        display: "inline-block",
        whiteSpace: "nowrap" as const,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {TIER_DISPLAY[tier]}
    </span>
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

/* ── CampaignsTab ────────────────────────────────────────── */
function CampaignsTab({
  campaigns,
  applications,
  loading,
  error,
  isDemo,
}: {
  campaigns: Campaign[];
  applications: Application[];
  loading: boolean;
  error: string | null;
  isDemo: boolean;
}) {
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const totalApplications = isDemo ? applications.length : 0;
  const totalQrScans = isDemo
    ? campaigns.reduce((sum, c) => sum + (c.qr_scans ?? 0), 0)
    : 0;

  return (
    <>
      <div className="db-page-header">
        <div className="db-page-header__left">
          <div className="db-page-header__eyebrow">Overview</div>
          <div className="db-page-header__title">Campaigns</div>
        </div>
        <a href="/merchant/campaigns/new" className="btn btn-primary">
          + New Campaign
        </a>
      </div>

      {error && <div className="db-error">{error}</div>}

      <div className="db-stats-row">
        <StatCard
          label="Active Campaigns"
          value={activeCampaigns}
          trend={`${campaigns.length} total created`}
          neutral
        />
        <StatCard
          label="Total Applications"
          value={totalApplications}
          trend={isDemo ? "+2 pending review" : "— no data yet"}
          neutral={!isDemo}
        />
        <StatCard
          label="QR Scans This Month"
          value={totalQrScans}
          trend={isDemo ? "+12 vs last month" : "— attribution tracking"}
          neutral={!isDemo}
        />
      </div>

      <div className="db-section-header">
        <div className="db-section-header__title">All Campaigns</div>
        <span
          style={{
            fontSize: "var(--text-caption)",
            color: "var(--text-muted)",
          }}
        >
          {campaigns.length} total
        </span>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 200 }} />
      ) : campaigns.length === 0 ? (
        <div className="db-empty-state">
          <IconGhost />
          <div className="db-empty-state__title">No campaigns yet</div>
          <div className="db-empty-state__sub">
            Create your first campaign to start connecting with creators in your
            area.
          </div>
          <a href="/merchant/campaigns/new" className="btn btn-primary">
            Create your first campaign
          </a>
        </div>
      ) : (
        <div
          className={`db-campaign-list${isDemo ? " db-campaign-list--demo" : ""}`}
        >
          <div className="db-table-header">
            <div className="db-table-header__cell">Campaign</div>
            <div className="db-table-header__cell">Status</div>
            <div className="db-table-header__cell">Spots</div>
            <div className="db-table-header__cell">Payout</div>
            {isDemo && <div className="db-table-header__cell">QR Scans</div>}
            {isDemo && <div className="db-table-header__cell">Applicants</div>}
            <div className="db-table-header__cell">Deadline</div>
          </div>
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="db-campaign-row">
              <div>
                <div className="db-campaign-row__title">{campaign.title}</div>
                {campaign.description && (
                  <div className="db-campaign-row__desc">
                    {campaign.description}
                  </div>
                )}
              </div>
              <div className="db-campaign-row__cell">
                <StatusBadge status={campaign.status} />
              </div>
              <div className="db-campaign-row__cell">
                {campaign.spots_remaining}
                <span style={{ color: "var(--text-muted)" }}>
                  &nbsp;/ {campaign.spots_total}
                </span>
              </div>
              <div className="db-campaign-row__payout">
                {campaign.payout === 0
                  ? "Product"
                  : `$${Number(campaign.payout).toFixed(0)}`}
              </div>
              {isDemo && (
                <div className="db-campaign-row__cell">
                  <span style={{ fontWeight: 700, color: "var(--dark)" }}>
                    {campaign.qr_scans ?? 0}
                  </span>
                </div>
              )}
              {isDemo && (
                <div className="db-campaign-row__cell">
                  <span style={{ fontWeight: 700, color: "var(--dark)" }}>
                    {campaign.applications_count ?? 0}
                  </span>
                </div>
              )}
              <div className="db-campaign-row__cell">
                {campaign.deadline ? (
                  new Date(campaign.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                )}
              </div>
            </div>
          ))}
        </div>
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
      <div className="db-page-header">
        <div className="db-page-header__left">
          <div className="db-page-header__eyebrow">Creator Workflow</div>
          <div className="db-page-header__title">Applications</div>
        </div>
        {(pendingCount > 0 || actionCount > 0) && (
          <div className="app-attention-badge">
            {pendingCount > 0 && `${pendingCount} pending`}
            {pendingCount > 0 && actionCount > 0 && " · "}
            {actionCount > 0 && `${actionCount} needs review`}
          </div>
        )}
      </div>

      {/* Filter row */}
      <div className="app-filter-row">
        {(["all", "pending", "active", "done"] as AppFilter[]).map((f) => (
          <button
            key={f}
            className={`app-filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" && `All (${applications.length})`}
            {f === "pending" && `Pending (${pendingCount})`}
            {f === "active" && `In Progress`}
            {f === "done" && `Completed`}
          </button>
        ))}
      </div>

      {/* Application list */}
      <div className="app-list">
        {filtered.length === 0 ? (
          <div className="db-empty-state" style={{ minHeight: 240 }}>
            <div
              className="db-empty-state__title"
              style={{ fontSize: "var(--text-h4)" }}
            >
              No applications here
            </div>
            <div className="db-empty-state__sub">
              {filter === "pending"
                ? "No creators waiting for your response."
                : "Nothing in this category yet."}
            </div>
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app.id}
              className={`app-card${app.status === "rejected" ? " app-card--rejected" : ""}`}
            >
              {/* Creator identity */}
              <div className="app-card__creator">
                <img
                  src={app.creator_avatar}
                  alt={app.creator_name}
                  className="app-card__avatar"
                />
                <div className="app-card__creator-info">
                  <div className="app-card__creator-name">
                    {app.creator_name}
                  </div>
                  <div className="app-card__creator-meta">
                    <span className="app-card__handle">
                      {app.creator_handle}
                    </span>
                    <span className="app-card__dot">·</span>
                    <span className="app-card__followers">
                      {app.creator_followers >= 1000
                        ? `${(app.creator_followers / 1000).toFixed(1)}K`
                        : app.creator_followers}{" "}
                      followers
                    </span>
                  </div>
                  <div className="app-card__badges">
                    <TierBadge tier={app.creator_tier} />
                    <span className="app-card__score">
                      Score {app.creator_score}
                    </span>
                  </div>
                </div>
              </div>

              {/* Campaign + milestone */}
              <div className="app-card__middle">
                <div className="app-card__campaign">{app.campaign_title}</div>
                <div className="app-card__milestone-row">
                  <MilestoneTag milestone={app.milestone} />
                  <span className="app-card__date">
                    Applied{" "}
                    {new Date(app.applied_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <MilestoneProgress milestone={app.milestone} />
              </div>

              {/* Actions */}
              <div className="app-card__actions">
                {app.status === "pending" && (
                  <>
                    <button
                      className="app-btn app-btn--accept"
                      onClick={() => onAccept(app.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="app-btn app-btn--reject"
                      onClick={() => onReject(app.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
                {app.status === "accepted" &&
                  app.milestone === "proof_submitted" && (
                    <>
                      {app.proof_url && (
                        <a
                          href={app.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="app-btn app-btn--view"
                        >
                          View Proof
                        </a>
                      )}
                      <button
                        className="app-btn app-btn--approve"
                        onClick={() => onApprove(app.id)}
                      >
                        Approve
                      </button>
                    </>
                  )}
                {app.status === "accepted" &&
                  app.milestone === "content_published" &&
                  app.content_url && (
                    <a
                      href={app.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-btn app-btn--view"
                    >
                      View Post
                    </a>
                  )}
                {app.status === "accepted" && app.milestone === "settled" && (
                  <div className="app-card__done">
                    Paid out
                    {app.merchant_rating && (
                      <span className="app-card__rating">
                        {" "}
                        · {app.merchant_rating}/5
                      </span>
                    )}
                  </div>
                )}
                {app.status === "rejected" && (
                  <div className="app-card__rejected-label">Declined</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

/* ── AnalyticsBarChart ───────────────────────────────────── */
const WEEKLY_SCANS = [4, 7, 6, 12, 9, 14, 11];
const WEEKLY_VISITS = [3, 5, 4, 9, 6, 11, 8];
const WEEK_LABELS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];
const CHART_MAX = Math.max(...WEEKLY_SCANS);

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
              style={{ background: "var(--tertiary)" }}
            />
            Scans
          </span>
          <span>
            <span
              className="analytics-chart__legend-dot"
              style={{ background: "var(--champagne)" }}
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
        <div className="db-page-header">
          <div className="db-page-header__left">
            <div className="db-page-header__eyebrow">Insights</div>
            <div className="db-page-header__title">Analytics</div>
          </div>
        </div>
        <div className="db-placeholder">
          <div className="db-placeholder__label">Coming soon</div>
          <div className="db-placeholder__title">Analytics Dashboard</div>
          <div className="db-placeholder__body">
            QR scan attribution, creator performance, and campaign ROI —
            available after your first campaign completes.
          </div>
        </div>
      </>
    );
  }

  // Active creators from applications
  const activeCreators = applications.filter(
    (a) => a.status === "accepted" && a.milestone !== "settled",
  );

  return (
    <>
      <div className="db-page-header">
        <div className="db-page-header__left">
          <div className="db-page-header__eyebrow">Insights</div>
          <div className="db-page-header__title">Analytics</div>
        </div>
        <div className="db-page-header__period">Apr 2026</div>
      </div>

      {/* ROI strip — editorial three-number treatment */}
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
            {analytics.roi_multiple}×
          </div>
          <div className="analytics-roi-cell__sub">
            ${analytics.total_spend} spend → $
            {analytics.estimated_revenue.toLocaleString()} est.
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <AnalyticsBarChart />

      {/* Campaign performance */}
      <div
        className="db-section-header"
        style={{ marginTop: "var(--space-2)" }}
      >
        <div className="db-section-header__title">Campaign Performance</div>
        <span className="analytics-perf-attribution-note">
          Est. Revenue is weighted by repeat-customer attribution share. First
          scan counts 100%; same customer returning after 30/60/90 days counts
          50% / 30% / 10%. After 120 days, no credit.
        </span>
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
                {c.payout === 0
                  ? "—"
                  : `$${(c.payout * (c.spots_total - c.spots_remaining)).toFixed(0)}`}
              </div>
              <div className="analytics-perf-row__rev">
                {c.attributed_revenue
                  ? `$${c.attributed_revenue.toLocaleString()}`
                  : "—"}
                {c.attributed_revenue &&
                  c.gross_attributed_revenue &&
                  c.gross_attributed_revenue > c.attributed_revenue && (
                    <div
                      className="analytics-perf-row__rev-note"
                      title={`Gross: $${c.gross_attributed_revenue.toLocaleString()}. Repeat-customer attribution share decreases over time per FTC 16 CFR §255.`}
                    >
                      $
                      {(
                        c.gross_attributed_revenue - c.attributed_revenue
                      ).toLocaleString()}{" "}
                      from repeat-visit share
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Creator roster */}
      <div className="db-section-header">
        <div className="db-section-header__title">Active Creators</div>
        <span
          style={{
            fontSize: "var(--text-caption)",
            color: "var(--text-muted)",
          }}
        >
          {activeCreators.length} working now
        </span>
      </div>

      <div className="db-campaign-list">
        {activeCreators.length === 0 ? (
          <div
            style={{
              padding: "var(--space-5)",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "var(--text-small)",
            }}
          >
            No active creators right now
          </div>
        ) : (
          activeCreators.map((app) => (
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
          ))
        )}
      </div>
    </>
  );
}

/* ── SettingsTab ─────────────────────────────────────────── */
function SettingsTab({ merchant }: { merchant: Merchant | null }) {
  const planNames: Record<string, string> = {
    lite: "Lite",
    essentials: "Essentials",
    pro: "Pro",
    advanced: "Advanced",
    // Legacy v5 tier names — keep for grandfathered merchants
    starter: "Essentials",
    growth: "Essentials",
    scale: "Advanced",
  };
  const planPrices: Record<string, string> = {
    lite: "$0",
    essentials: "$99",
    pro: "5%",
    advanced: "$349",
    starter: "$99",
    growth: "$99",
    scale: "$349",
  };

  return (
    <>
      <div className="db-page-header">
        <div className="db-page-header__left">
          <div className="db-page-header__eyebrow">Account</div>
          <div className="db-page-header__title">Settings</div>
        </div>
      </div>

      {merchant && (
        <div
          className="db-campaign-list"
          style={{ padding: "var(--space-4)", marginBottom: "var(--space-4)" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            {[
              { label: "Business Name", value: merchant.business_name },
              { label: "Address", value: merchant.address },
              { label: "Contact Email", value: merchant.contact_email },
              ...(merchant.instagram
                ? [{ label: "Instagram", value: merchant.instagram }]
                : []),
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: "var(--text-caption)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color: "var(--text-muted)",
                    marginBottom: 6,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-body)",
                    fontWeight: 600,
                    color: "var(--dark)",
                  }}
                >
                  {value}
                </div>
                <div
                  className="db-divider"
                  style={{ marginTop: "var(--space-3)", marginBottom: 0 }}
                />
              </div>
            ))}
            {merchant.plan && (
              <div>
                <div
                  style={{
                    fontSize: "var(--text-caption)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color: "var(--text-muted)",
                    marginBottom: 6,
                  }}
                >
                  Current Plan
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      fontSize: "var(--text-body)",
                      fontWeight: 700,
                      color: "var(--dark)",
                    }}
                  >
                    {planNames[merchant.plan]}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-caption)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {planPrices[merchant.plan]} / mo
                  </div>
                  <a
                    href="/merchant/billing"
                    style={{
                      fontSize: "var(--text-caption)",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase" as const,
                      color: "var(--tertiary)",
                      textDecoration: "none",
                    }}
                  >
                    Upgrade →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="db-placeholder">
        <div className="db-placeholder__label">Coming soon</div>
        <div className="db-placeholder__title">Edit Profile &amp; Billing</div>
        <div className="db-placeholder__body">
          Full account management, notification preferences, and plan upgrades.
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

  const pendingCount = applications.filter(
    (a) => a.status === "pending",
  ).length;
  const avatarInitials = merchant?.business_name
    ? merchant.business_name.slice(0, 2).toUpperCase()
    : "M";

  return (
    <div className="db-shell">
      {/* Demo banner */}
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
                <IconCampaigns />
                Campaigns
              </button>
              <button
                className={`db-nav-item${activeTab === "applications" ? " active" : ""}`}
                onClick={() => setActiveTab("applications")}
              >
                <IconApplications />
                Applications
                {pendingCount > 0 && (
                  <span className="db-nav-badge">{pendingCount}</span>
                )}
              </button>
              <button
                className={`db-nav-item${activeTab === "analytics" ? " active" : ""}`}
                onClick={() => setActiveTab("analytics")}
              >
                <IconAnalytics />
                Analytics
              </button>
              <a
                href="/merchant/locations"
                className="db-nav-item"
                style={{ textDecoration: "none" }}
              >
                <IconLocations />
                Locations
              </a>
              <button
                className={`db-nav-item${activeTab === "settings" ? " active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <IconSettings />
                Settings
              </button>
            </div>
          </nav>

          <div className="db-sidebar__footer">
            <div className="db-plan-badge">
              <div className="db-plan-badge__label">Current Plan</div>
              <div className="db-plan-badge__name">
                {merchant?.plan === "advanced"
                  ? "Advanced"
                  : merchant?.plan === "pro"
                    ? "Pro"
                    : merchant?.plan === "essentials" ||
                        merchant?.plan === "growth" ||
                        merchant?.plan === "starter"
                      ? "Essentials"
                      : "Lite"}
              </div>
              <div className="db-plan-badge__price">
                {merchant?.plan === "advanced"
                  ? "$349 / mo"
                  : merchant?.plan === "pro"
                    ? "5% of revenue"
                    : merchant?.plan === "essentials" ||
                        merchant?.plan === "growth" ||
                        merchant?.plan === "starter"
                      ? "$99 / mo"
                      : "$0 / mo"}
              </div>
              <a href="/merchant/billing" className="db-plan-badge__upgrade">
                Upgrade plan →
              </a>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="db-main">
          {activeTab === "campaigns" && (
            <CampaignsTab
              campaigns={campaigns}
              applications={applications}
              loading={campaignsLoading}
              error={error}
              isDemo={isDemo}
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
          {activeTab === "settings" && <SettingsTab merchant={merchant} />}
        </main>
      </div>
    </div>
  );
}
