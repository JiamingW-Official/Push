"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

/* ── KPICard — v11 product-register stat card ────────────── */
function KPICard({
  eyebrow,
  value,
  sub,
  accent = false,
}: {
  eyebrow: string;
  value: number | string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: accent ? "var(--char)" : "var(--surface-2)",
        border: `1px solid ${accent ? "transparent" : "var(--hairline)"}`,
        borderTop: `2px solid ${accent ? "var(--brand-red)" : "var(--hairline)"}`,
        borderRadius: "var(--r-md)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: accent ? "rgba(255,255,255,0.48)" : "var(--ink-4)",
        }}
      >
        {eyebrow}
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "clamp(40px,5vw,64px)",
          lineHeight: 1,
          color: accent ? "var(--snow)" : "var(--ink)",
          letterSpacing: "-0.025em",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: accent ? "var(--champagne)" : "var(--ink-3)",
          lineHeight: 1.5,
        }}
      >
        {sub}
      </span>
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
      color: "var(--ink)",
      border: "1.5px dashed var(--hairline)",
    },
    explorer: {
      bg: "var(--tier-explorer)",
      color: "var(--ink)",
      border: "1px solid var(--tier-explorer)",
    },
    operator: {
      bg: "var(--tier-operator)",
      color: "var(--snow)",
      border: "1px solid var(--tier-operator)",
    },
    proven: {
      bg: "var(--tier-proven)",
      color: "var(--snow)",
      border: "1px solid var(--tier-proven)",
    },
    closer: {
      bg: "var(--tier-closer)",
      color: "var(--snow)",
      border: "1px solid var(--tier-closer)",
    },
    partner: {
      bg: "var(--tier-partner)",
      color: "var(--snow)",
      border: "1px solid var(--tier-partner)",
      borderLeft: "3px solid var(--brand-red)",
    },
  };
  const c = CFG[tier];
  return (
    <span
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase" as const,
        letterSpacing: "0.08em",
        padding: "4px 10px",
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

/* ── SectionLabel ────────────────────────────────────────── */
function SectionLabel({
  children,
  count,
}: {
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: "var(--ink-4)",
        }}
      >
        {children}
      </span>
      {count !== undefined && (
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-5)",
          }}
        >
          {count} total
        </span>
      )}
    </div>
  );
}

/* ── TabHeader ───────────────────────────────────────────── */
function TabHeader({
  eyebrow,
  title,
  action,
  badge,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: 32,
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <div>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "var(--ink-4)",
            display: "block",
            marginBottom: 8,
          }}
        >
          {eyebrow}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {badge}
        {action}
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
      <TabHeader
        eyebrow="Campaigns"
        title="Campaigns"
        action={
          <a href="/merchant/campaigns/new" className="btn-primary click-shift">
            + New Campaign
          </a>
        }
      />

      {error && (
        <div
          style={{
            background: "var(--brand-red-tint)",
            border: "1px solid var(--brand-red-focus)",
            borderRadius: "var(--r-sm)",
            padding: "12px 16px",
            color: "var(--brand-red)",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          {error}
        </div>
      )}

      {/* KPI strip — 3 col for campaigns tab */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 24,
          marginBottom: 40,
        }}
      >
        <KPICard
          eyebrow="Active Campaigns"
          value={activeCampaigns}
          sub={`${campaigns.length} total created`}
        />
        <KPICard
          eyebrow="Total Applications"
          value={totalApplications}
          sub={isDemo ? "+2 pending review" : "— no data yet"}
        />
        <KPICard
          eyebrow="QR Scans This Month"
          value={totalQrScans}
          sub={isDemo ? "+12 vs last month" : "— attribution tracking"}
        />
      </div>

      <SectionLabel count={campaigns.length}>All Campaigns</SectionLabel>

      {loading ? (
        <div
          className="skeleton"
          style={{ height: 200, borderRadius: "var(--r-md)" }}
        />
      ) : campaigns.length === 0 ? (
        <div className="db-empty-state">
          <IconGhost />
          <div className="db-empty-state__title">No campaigns yet</div>
          <p className="db-empty-state__sub">
            Create your first campaign to start connecting with creators in your
            area.
          </p>
          <a href="/merchant/campaigns/new" className="btn-primary click-shift">
            Create your first campaign
          </a>
        </div>
      ) : (
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--r-md)",
            overflow: "hidden",
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isDemo
                ? "2fr 96px 80px 80px 72px 72px 96px"
                : "2fr 96px 80px 80px 96px",
              padding: "10px 24px",
              borderBottom: "1px solid var(--hairline)",
              background: "var(--surface)",
              gap: 16,
            }}
          >
            {["Campaign", "Status", "Spots", "Payout"].map((h) => (
              <span
                key={h}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase" as const,
                  color: "var(--ink-4)",
                }}
              >
                {h}
              </span>
            ))}
            {isDemo && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase" as const,
                  color: "var(--ink-4)",
                }}
              >
                QR Scans
              </span>
            )}
            {isDemo && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase" as const,
                  color: "var(--ink-4)",
                }}
              >
                Apps
              </span>
            )}
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase" as const,
                color: "var(--ink-4)",
              }}
            >
              Deadline
            </span>
          </div>

          {/* Table rows */}
          {campaigns.map((campaign, idx) => (
            <div
              key={campaign.id}
              style={{
                display: "grid",
                gridTemplateColumns: isDemo
                  ? "2fr 96px 80px 80px 72px 72px 96px"
                  : "2fr 96px 80px 80px 96px",
                padding: "16px 24px",
                gap: 16,
                borderBottom:
                  idx < campaigns.length - 1
                    ? "1px solid var(--hairline)"
                    : "none",
                alignItems: "center",
                transition: "background 120ms",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--surface-3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Title + description */}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--ink)",
                    marginBottom: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {campaign.title}
                </div>
                {campaign.description && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--ink-4)",
                      fontFamily: "var(--font-body)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {campaign.description}
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <StatusBadge status={campaign.status} />
              </div>

              {/* Spots */}
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--ink)",
                }}
              >
                {campaign.spots_remaining}
                <span style={{ color: "var(--ink-4)" }}>
                  &nbsp;/ {campaign.spots_total}
                </span>
              </div>

              {/* Payout */}
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--brand-red)",
                }}
              >
                {campaign.payout === 0
                  ? "Product"
                  : `$${Number(campaign.payout).toFixed(0)}`}
              </div>

              {/* QR scans (demo only) */}
              {isDemo && (
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  {campaign.qr_scans ?? 0}
                </div>
              )}

              {/* Applicants (demo only) */}
              {isDemo && (
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  {campaign.applications_count ?? 0}
                </div>
              )}

              {/* Deadline */}
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-3)",
                }}
              >
                {campaign.deadline ? (
                  new Date(campaign.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                ) : (
                  <span style={{ color: "var(--ink-5)" }}>—</span>
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
      <TabHeader
        eyebrow="Creator Workflow"
        title="Applications"
        badge={
          pendingCount > 0 || actionCount > 0 ? (
            <span
              style={{
                background: "var(--brand-red)",
                color: "var(--snow)",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                padding: "6px 16px",
                borderRadius: "var(--r-sm)",
                whiteSpace: "nowrap" as const,
              }}
            >
              {pendingCount > 0 && `${pendingCount} pending`}
              {pendingCount > 0 && actionCount > 0 && " · "}
              {actionCount > 0 && `${actionCount} needs review`}
            </span>
          ) : undefined
        }
      />

      {/* Filter row */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}
      >
        {(["all", "pending", "active", "done"] as AppFilter[]).map((f) => (
          <button
            key={f}
            className={`btn-pill click-shift${filter === f ? " btn-pill--active" : ""}`}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            style={
              filter === f
                ? { background: "var(--ink)", color: "var(--snow)" }
                : {}
            }
          >
            {f === "all" && `All (${applications.length})`}
            {f === "pending" && `Pending (${pendingCount})`}
            {f === "active" && `In Progress`}
            {f === "done" && `Completed`}
          </button>
        ))}
      </div>

      {/* Application cards */}
      <div className="app-list">
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              color: "var(--ink-4)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-md)",
            }}
          >
            {filter === "pending"
              ? "No creators waiting for your response."
              : "Nothing in this category yet."}
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app.id}
              style={{
                background:
                  app.status === "rejected"
                    ? "var(--surface)"
                    : "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--r-md)",
                padding: "24px",
                opacity: app.status === "rejected" ? 0.6 : 1,
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {/* Creator identity */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  flex: "1 1 240px",
                  minWidth: 0,
                }}
              >
                <img
                  src={app.creator_avatar}
                  alt={app.creator_name}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--r-full)",
                    flexShrink: 0,
                    border: "1px solid var(--hairline)",
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--ink)",
                      marginBottom: 4,
                    }}
                  >
                    {app.creator_name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--ink-3)",
                      fontFamily: "var(--font-body)",
                      marginBottom: 8,
                    }}
                  >
                    {app.creator_handle} ·{" "}
                    {app.creator_followers >= 1000
                      ? `${(app.creator_followers / 1000).toFixed(1)}K`
                      : app.creator_followers}{" "}
                    followers
                  </div>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <TierBadge tier={app.creator_tier} />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink-4)",
                      }}
                    >
                      Score {app.creator_score}
                    </span>
                  </div>
                </div>
              </div>

              {/* Campaign + milestone */}
              <div style={{ flex: "2 1 280px", minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink-3)",
                    marginBottom: 8,
                  }}
                >
                  {app.campaign_title}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <MilestoneTag milestone={app.milestone} />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--ink-4)",
                    }}
                  >
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
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  flexShrink: 0,
                  flexWrap: "wrap",
                }}
              >
                {app.status === "pending" && (
                  <>
                    <button
                      className="btn-primary click-shift"
                      style={{ padding: "8px 20px", fontSize: 13 }}
                      onClick={() => onAccept(app.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-ghost click-shift"
                      style={{ padding: "8px 20px", fontSize: 13 }}
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
                          className="btn-ghost click-shift"
                          style={{ padding: "8px 20px", fontSize: 13 }}
                        >
                          View Proof
                        </a>
                      )}
                      <button
                        className="btn-secondary click-shift"
                        style={{ padding: "8px 20px", fontSize: 13 }}
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
                      className="btn-ghost click-shift"
                      style={{ padding: "8px 20px", fontSize: 13 }}
                    >
                      View Post
                    </a>
                  )}
                {app.status === "accepted" && app.milestone === "settled" && (
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--success-dark)",
                      fontWeight: 700,
                    }}
                  >
                    Paid out
                    {app.merchant_rating && (
                      <span style={{ color: "var(--ink-4)", fontWeight: 400 }}>
                        {" "}
                        · {app.merchant_rating}/5
                      </span>
                    )}
                  </div>
                )}
                {app.status === "rejected" && (
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--ink-4)",
                    }}
                  >
                    Declined
                  </span>
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
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--r-md)",
        padding: "24px",
        marginBottom: 32,
      }}
    >
      {/* Chart header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          gap: 16,
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              display: "block",
              marginBottom: 8,
            }}
          >
            Analytics
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.015em",
              color: "var(--ink)",
              lineHeight: 1.15,
            }}
          >
            QR Scans &amp; Visits
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {[
            { color: "var(--brand-red)", label: "Scans" },
            { color: "var(--ink-4)", label: "Visits" },
          ].map((l) => (
            <span
              key={l.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-3)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "var(--r-full)",
                  background: l.color,
                  display: "inline-block",
                }}
              />
              {l.label}
            </span>
          ))}
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
              letterSpacing: "0.04em",
            }}
          >
            Apr 2026
          </span>
        </div>
      </div>

      {/* Bars */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          height: 128,
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        {WEEK_LABELS.map((label, i) => (
          <div
            key={label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: 2,
                alignItems: "flex-end",
                flex: 1,
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "var(--brand-red)",
                  borderRadius: "3px 3px 0 0",
                  height: `${(WEEKLY_SCANS[i] / CHART_MAX) * 100}%`,
                  opacity: 0.85,
                  transition: "opacity 120ms",
                }}
              />
              <div
                style={{
                  flex: 1,
                  background: "var(--ink-4)",
                  borderRadius: "3px 3px 0 0",
                  height: `${(WEEKLY_VISITS[i] / CHART_MAX) * 100}%`,
                  opacity: 0.5,
                  transition: "opacity 120ms",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-5)",
                paddingTop: 8,
              }}
            >
              {label}
            </span>
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
        <TabHeader eyebrow="Insights" title="Analytics" />
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--r-md)",
            padding: "64px 48px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              display: "block",
              marginBottom: 16,
            }}
          >
            Coming Soon
          </span>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 28,
              color: "var(--ink)",
              margin: "0 0 12px",
              letterSpacing: "-0.015em",
            }}
          >
            Analytics Dashboard
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "var(--ink-3)",
              maxWidth: 400,
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            QR scan attribution, creator performance, and campaign ROI —
            available after your first campaign completes.
          </p>
        </div>
      </>
    );
  }

  const activeCreators = applications.filter(
    (a) => a.status === "accepted" && a.milestone !== "settled",
  );

  return (
    <>
      <TabHeader
        eyebrow="Insights"
        title="Analytics"
        action={
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
            }}
          >
            Apr 2026
          </span>
        }
      />

      {/* KPI strip — 4 col */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 24,
          marginBottom: 40,
        }}
      >
        <KPICard
          eyebrow="QR Scans"
          value={analytics.qr_scans_month}
          sub={`+${analytics.qr_scans_delta} vs last month`}
        />
        <KPICard
          eyebrow="New Customers"
          value={analytics.new_customers}
          sub="verified via QR scan"
        />
        <KPICard
          eyebrow="Total Spend"
          value={`$${analytics.total_spend}`}
          sub={`${analytics.active_creators} active creators`}
        />
        <KPICard
          eyebrow="Return on Spend"
          value={`${analytics.roi_multiple}×`}
          sub={`$${analytics.estimated_revenue.toLocaleString()} est. revenue`}
          accent
        />
      </div>

      {/* Bar chart */}
      <AnalyticsBarChart />

      {/* Campaign performance table */}
      <SectionLabel>Campaign Performance</SectionLabel>

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--ink-5)",
          marginBottom: 12,
          lineHeight: 1.55,
          maxWidth: 560,
        }}
      >
        Est. revenue weighted by repeat-customer attribution share per FTC 16
        CFR §255.
      </div>

      <div
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--r-md)",
          overflow: "hidden",
          marginBottom: 32,
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 96px 80px 72px 80px 112px",
            padding: "10px 24px",
            gap: 16,
            borderBottom: "1px solid var(--hairline)",
            background: "var(--surface)",
          }}
        >
          {[
            "Campaign",
            "Status",
            "QR Scans",
            "Creators",
            "Spend",
            "Est. Revenue",
          ].map((h) => (
            <span
              key={h}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase" as const,
                color: "var(--ink-4)",
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {campaigns.map((c, idx) => {
          const campApps = applications.filter((a) => a.campaign_id === c.id);
          return (
            <div
              key={c.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 96px 80px 72px 80px 112px",
                padding: "16px 24px",
                gap: 16,
                borderBottom:
                  idx < campaigns.length - 1
                    ? "1px solid var(--hairline)"
                    : "none",
                alignItems: "center",
                transition: "background 120ms",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--surface-3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--ink)",
                    marginBottom: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.title}
                </div>
                {c.category && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--ink-4)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {c.category}
                  </div>
                )}
              </div>

              <div>
                <StatusBadge status={c.status} />
              </div>

              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--ink)",
                }}
              >
                {c.qr_scans ?? 0}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--ink)",
                }}
              >
                {campApps.length}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--ink)",
                }}
              >
                {c.payout === 0
                  ? "—"
                  : `$${(c.payout * (c.spots_total - c.spots_remaining)).toFixed(0)}`}
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--brand-red)",
                  }}
                >
                  {c.attributed_revenue
                    ? `$${c.attributed_revenue.toLocaleString()}`
                    : "—"}
                </div>
                {c.attributed_revenue &&
                  c.gross_attributed_revenue &&
                  c.gross_attributed_revenue > c.attributed_revenue && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-5)",
                        fontFamily: "var(--font-body)",
                        marginTop: 2,
                        cursor: "help",
                      }}
                      title={`Gross: $${c.gross_attributed_revenue.toLocaleString()}. Repeat-customer attribution share decreases over time per FTC 16 CFR §255.`}
                    >
                      $
                      {(
                        c.gross_attributed_revenue - c.attributed_revenue
                      ).toLocaleString()}{" "}
                      repeat
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Creator roster */}
      <SectionLabel count={activeCreators.length}>Active Creators</SectionLabel>

      <div
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--r-md)",
          overflow: "hidden",
        }}
      >
        {activeCreators.length === 0 ? (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: "var(--ink-4)",
              fontSize: 13,
              fontFamily: "var(--font-body)",
            }}
          >
            No active creators right now
          </div>
        ) : (
          activeCreators.map((app, idx) => (
            <div
              key={app.id}
              style={{
                display: "flex",
                gap: 16,
                padding: "16px 24px",
                alignItems: "center",
                borderBottom:
                  idx < activeCreators.length - 1
                    ? "1px solid var(--hairline)"
                    : "none",
                transition: "background 120ms",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--surface-3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <img
                src={app.creator_avatar}
                alt={app.creator_name}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--r-full)",
                  border: "1px solid var(--hairline)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  {app.creator_name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-4)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {app.creator_handle}
                </div>
              </div>
              <TierBadge tier={app.creator_tier} />
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-3)",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "var(--ink-4)", marginRight: 4 }}>
                  Score
                </span>
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                  {app.creator_score}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-3)",
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {app.campaign_title}
              </div>
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
      <TabHeader eyebrow="Account" title="Settings" />

      {merchant && (
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--r-md)",
            padding: "32px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
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
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "var(--ink-4)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {value}
                </span>
                <div
                  style={{
                    height: 1,
                    background: "var(--hairline)",
                    marginTop: 16,
                  }}
                />
              </div>
            ))}
            {merchant.plan && (
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "var(--ink-4)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Current Plan
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    {planNames[merchant.plan]}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--ink-4)",
                    }}
                  >
                    {planPrices[merchant.plan]} / mo
                  </span>
                  <a
                    href="/merchant/billing"
                    className="click-shift"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      color: "var(--accent-blue)",
                      textDecoration: "none",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Upgrade
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--r-md)",
          padding: "40px 32px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "var(--ink-4)",
            display: "block",
            marginBottom: 16,
          }}
        >
          Coming Soon
        </span>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 28,
            color: "var(--ink)",
            margin: "0 0 8px",
            letterSpacing: "-0.015em",
          }}
        >
          Edit Profile &amp; Billing
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            color: "var(--ink-3)",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          Full account management, notification preferences, and plan upgrades.
        </p>
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

  /* ── Business name initial for avatar ───────────────────── */
  const initials = merchant?.business_name
    ? merchant.business_name.slice(0, 2).toUpperCase()
    : "M";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── Product nav — 64px, snow bg, ink text, 8px grid ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "0 48px",
          height: 64,
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        {/* Wordmark */}
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 18,
            color: "var(--ink)",
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          PUSH
        </span>

        {/* Divider */}
        <span
          style={{
            width: 1,
            height: 24,
            background: "var(--hairline-2)",
            flexShrink: 0,
          }}
        />

        {/* Nav links */}
        {[
          { href: "/merchant/dashboard", label: "Dashboard" },
          { href: "/merchant/campaigns/new", label: "New Campaign" },
          { href: "/merchant/qr-codes", label: "QR Codes" },
          { href: "/merchant/redeem", label: "Redeem" },
          { href: "/merchant/locations", label: "Locations" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "var(--graphite)",
              textDecoration: "none",
              transition: "color 0.12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--graphite)")
            }
          >
            {label}
          </Link>
        ))}

        <span style={{ flex: 1 }} />

        {/* Email */}
        {userEmail && (
          <span
            style={{
              fontSize: 12,
              color: "var(--ink-4)",
              fontFamily: "var(--font-body)",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap" as const,
            }}
          >
            {userEmail}
          </span>
        )}

        {/* Avatar monogram */}
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--r-sm)",
            background: "var(--brand-red)",
            color: "var(--snow)",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.04em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {initials}
        </span>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: "var(--graphite)",
            background: "none",
            border: "1px solid var(--hairline-2)",
            borderRadius: "var(--r-sm)",
            cursor: "pointer",
            padding: "6px 12px",
            transition: "color 0.12s, border-color 0.12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--ink)";
            e.currentTarget.style.borderColor = "var(--mist)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--graphite)";
            e.currentTarget.style.borderColor = "var(--hairline-2)";
          }}
        >
          Sign out
        </button>
      </nav>

      {/* ── Tab strip — sticky below nav, 48px tall ────────── */}
      <div
        style={{
          display: "flex",
          gap: 0,
          padding: "0 48px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
          position: "sticky",
          top: 64,
          zIndex: 10,
        }}
      >
        {(
          [
            {
              id: "campaigns" as SidebarTab,
              icon: <IconCampaigns />,
              label: "Campaigns",
            },
            {
              id: "applications" as SidebarTab,
              icon: <IconApplications />,
              label: "Applications",
              badge: pendingCount,
            },
            {
              id: "analytics" as SidebarTab,
              icon: <IconAnalytics />,
              label: "Analytics",
            },
            {
              id: "settings" as SidebarTab,
              icon: <IconSettings />,
              label: "Settings",
            },
          ] as Array<{
            id: SidebarTab;
            icon: React.ReactNode;
            label: string;
            badge?: number;
          }>
        ).map(({ id, icon, label, badge }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 24px",
              height: 48,
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: activeTab === id ? "var(--ink)" : "var(--graphite)",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === id
                  ? "2px solid var(--brand-red)"
                  : "2px solid transparent",
              cursor: "pointer",
              transition: "color 0.12s, border-color 0.12s",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== id) e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              if (activeTab !== id)
                e.currentTarget.style.color = "var(--graphite)";
            }}
          >
            {icon}
            {label}
            {badge != null && badge > 0 && (
              <span
                style={{
                  background: "var(--brand-red)",
                  color: "var(--snow)",
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "var(--r-sm)",
                  lineHeight: 1.4,
                }}
              >
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Page header strip — merchant name + quick links ── */}
      {merchant && (
        <div
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--hairline)",
            padding: "16px 48px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--ink)",
                letterSpacing: "-0.02em",
              }}
            >
              {merchant.business_name}
            </span>
            {merchant.address && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                  marginLeft: 12,
                }}
              >
                {merchant.address}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a href="/merchant/qr-codes" className="btn-pill click-shift">
              QR Codes
            </a>
            <a href="/merchant/redeem" className="btn-pill click-shift">
              Redeem
            </a>
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          padding: "48px 64px 96px",
        }}
      >
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
      </div>
    </div>
  );
}
