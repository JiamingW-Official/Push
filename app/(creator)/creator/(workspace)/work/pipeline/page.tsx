"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import "./pipeline.css";

/* ── Types ─────────────────────────────────────────────────── */

type PipelineStatus = "applied" | "active" | "pending_review" | "completed";
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
    logoColor: "#3a3835",
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
    logoColor: "#0085ff",
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
    logoColor: "#3a3835",
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
    logoColor: "#3a3835",
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
    logoColor: "#0085ff",
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
    logoColor: "#3a3835",
    completedDate: "Mar 28",
    brief:
      "2 close-up product shots of the seasonal matcha latte. Warm tones, morning light. No text overlays.",
    walkinCount: 3,
  },
];

/* ── Kanban columns ───────────────────────────────────────── */

type Column = {
  status: PipelineStatus;
  title: string;
  caption: string;
  emptyTitle: string;
  emptyHint: string;
};

const COLUMNS: Column[] = [
  {
    status: "applied",
    title: "Outreach",
    caption: "Awaiting merchant",
    emptyTitle: "No applications open",
    emptyHint: "Browse Discover to send your next pitch.",
  },
  {
    status: "active",
    title: "Shooting",
    caption: "In production",
    emptyTitle: "Nothing on set",
    emptyHint: "Active campaigns land here once approved.",
  },
  {
    status: "pending_review",
    title: "Submitted",
    caption: "With merchant",
    emptyTitle: "No drafts in review",
    emptyHint: "Submit content from the Shooting column.",
  },
  {
    status: "completed",
    title: "Closed",
    caption: "Settled",
    emptyTitle: "No closed work yet",
    emptyHint: "Wrapped campaigns archive here.",
  },
];

const SORT_OPTIONS: { label: string; value: SortMode }[] = [
  { label: "Deadline", value: "deadline" },
  { label: "Earnings", value: "earn" },
  { label: "Merchant", value: "merchant" },
];

const STATUS_LABEL: Record<PipelineStatus, string> = {
  applied: "Awaiting reply",
  active: "In production",
  pending_review: "In review",
  completed: "Closed",
};

/* ── Helpers ───────────────────────────────────────────────── */

function progressPct(c: PipelineCampaign): number {
  if (c.contentRequired <= 0) return 0;
  return Math.min(
    100,
    Math.round((c.contentSubmitted / c.contentRequired) * 100),
  );
}

function timingCopy(c: PipelineCampaign): string {
  if (c.status === "completed")
    return `Closed ${c.completedDate ?? c.deadline}`;
  if (c.daysLeft < 0) return `Past ${c.deadline}`;
  if (c.daysLeft === 0) return `Due today`;
  if (c.daysLeft === 1) return `Due tomorrow`;
  if (c.daysLeft <= 3) return `${c.daysLeft}d left · ${c.deadline}`;
  return `Due ${c.deadline}`;
}

function urgencyTone(c: PipelineCampaign): "calm" | "soon" | "now" | "past" {
  if (c.status === "completed") return "calm";
  if (c.daysLeft < 0) return "past";
  if (c.daysLeft <= 1) return "now";
  if (c.daysLeft <= 3) return "soon";
  return "calm";
}

/* ── Expanded Panel ────────────────────────────────────────── */

function ExpandedPanel({ campaign }: { campaign: PipelineCampaign }) {
  return (
    <div className="pl-expand">
      {campaign.brief && (
        <div className="pl-expand-block">
          <p className="pl-expand-label">Brief</p>
          <p className="pl-expand-text">{campaign.brief}</p>
        </div>
      )}

      {campaign.attributionNote && (
        <div className="pl-expand-block">
          <p className="pl-expand-label">Attribution</p>
          <p className="pl-expand-text">{campaign.attributionNote}</p>
        </div>
      )}

      {campaign.walkinCount !== undefined && (
        <div className="pl-expand-meta">
          <span>{campaign.walkinCount} walk-ins logged</span>
          {campaign.appliedDate && (
            <span>· Applied {campaign.appliedDate}</span>
          )}
        </div>
      )}

      <div className="pl-expand-actions">
        {campaign.status === "active" && (
          <Link
            href={`/creator/campaigns/${campaign.id}/post`}
            className="pl-action btn-primary click-shift"
            onClick={(e) => e.stopPropagation()}
          >
            Submit Content
          </Link>
        )}
        <Link
          href={`/creator/campaigns/${campaign.id}`}
          className="pl-action btn-ghost click-shift"
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </Link>
        {campaign.merchantContact && (
          <Link
            href={campaign.merchantContact}
            className="pl-action-link"
            onClick={(e) => e.stopPropagation()}
          >
            Message {campaign.merchantName}
          </Link>
        )}
        {campaign.status === "pending_review" && (
          <span className="pl-action-status">Under merchant review</span>
        )}
        {campaign.status === "applied" && (
          <button
            type="button"
            className="pl-action-link"
            onClick={(e) => e.stopPropagation()}
          >
            Withdraw
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Card ─────────────────────────────────────────────────── */

function CampaignCard({
  campaign,
  expanded,
  onToggle,
}: {
  campaign: PipelineCampaign;
  expanded: boolean;
  onToggle: () => void;
}) {
  const tone = urgencyTone(campaign);
  const pct = progressPct(campaign);

  return (
    <article
      className={[
        "pl-card",
        `pl-card--${campaign.status}`,
        `pl-card--${tone}`,
        expanded ? "is-expanded" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <header className="pl-card-head">
        <span
          className="pl-card-logo"
          style={{ background: campaign.logoColor }}
          aria-hidden="true"
        >
          {campaign.logoInitials}
        </span>
        <div className="pl-card-id">
          <p className="pl-card-merchant">{campaign.merchantName}</p>
          <p className="pl-card-name">{campaign.campaignName}</p>
        </div>
        <span className="pl-card-earn">{campaign.earnEstimate}</span>
      </header>

      <div className="pl-card-meta">
        <span className="pl-card-timing">{timingCopy(campaign)}</span>
        <span className="pl-card-dot" aria-hidden="true">
          ·
        </span>
        <span className="pl-card-status">{STATUS_LABEL[campaign.status]}</span>
      </div>

      <div className="pl-card-progress" aria-hidden="true">
        <span className="pl-card-progress-track">
          <span
            className="pl-card-progress-fill"
            style={{ width: `${pct}%` }}
          />
        </span>
        <span className="pl-card-progress-num">
          {campaign.contentSubmitted}/{campaign.contentRequired}
        </span>
      </div>

      {expanded && <ExpandedPanel campaign={campaign} />}
    </article>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */

export default function WorkPipelinePage() {
  const [sortMode, setSortMode] = useState<SortMode>("deadline");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  // Group by column status, then sort within column.
  const grouped = useMemo(() => {
    const map: Record<PipelineStatus, PipelineCampaign[]> = {
      applied: [],
      active: [],
      pending_review: [],
      completed: [],
    };
    for (const c of MOCK_CAMPAIGNS) map[c.status].push(c);

    const sortFn = (a: PipelineCampaign, b: PipelineCampaign) => {
      if (sortMode === "earn") return b.earnRaw - a.earnRaw;
      if (sortMode === "merchant")
        return a.merchantName.localeCompare(b.merchantName);
      const aOver =
        a.daysLeft < 0 && a.status !== "completed" ? -1000 + a.daysLeft : 0;
      const bOver =
        b.daysLeft < 0 && b.status !== "completed" ? -1000 + b.daysLeft : 0;
      if (aOver !== bOver) return aOver - bOver;
      return a.daysLeft - b.daysLeft;
    };
    for (const k of Object.keys(map) as PipelineStatus[]) map[k].sort(sortFn);
    return map;
  }, [sortMode]);

  // Floating tile stats: focus on what needs hands today.
  const liveCount = grouped.active.length + grouped.pending_review.length;
  const dueSoon = MOCK_CAMPAIGNS.filter(
    (c) => c.status !== "completed" && c.daysLeft <= 3 && c.daysLeft >= 0,
  ).length;
  const overdue = MOCK_CAMPAIGNS.filter(
    (c) => c.status !== "completed" && c.daysLeft < 0,
  ).length;
  const totalPotential = MOCK_CAMPAIGNS.filter(
    (c) => c.status !== "completed",
  ).reduce((sum, c) => sum + c.earnRaw, 0);

  return (
    <div className="cw-page pl-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">
            LINKS · PIPELINE · {liveCount} LIVE · $
            {totalPotential.toLocaleString()} POTENTIAL
          </p>
          <h1 className="cw-title">Pipeline</h1>
        </div>
        <div className="cw-header__right">
          <Link href="/creator/work/today" className="cw-pill">
            Today →
          </Link>
          <div className="pl-sort" role="group" aria-label="Sort cards">
            <span className="pl-sort-label">Sort</span>
            {SORT_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                className={
                  "pl-sort-chip" + (sortMode === s.value ? " is-active" : "")
                }
                onClick={() => setSortMode(s.value)}
                aria-pressed={sortMode === s.value}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Floating focus tile — single liquid-glass moment for the page */}
      <aside className="pl-focus" aria-label="Pipeline focus">
        <div className="pl-focus-row">
          <div className="pl-focus-stat">
            <span className="pl-focus-num">{overdue}</span>
            <span className="pl-focus-cap">Past due</span>
          </div>
          <span className="pl-focus-sep" aria-hidden="true" />
          <div className="pl-focus-stat">
            <span className="pl-focus-num">{dueSoon}</span>
            <span className="pl-focus-cap">Due in 3d</span>
          </div>
          <span className="pl-focus-sep" aria-hidden="true" />
          <div className="pl-focus-stat">
            <span className="pl-focus-num">{liveCount}</span>
            <span className="pl-focus-cap">In flight</span>
          </div>
        </div>
        <p className="pl-focus-note">
          Tap a card to expand the brief. Sort controls reorder every column.
        </p>
      </aside>

      {/* Kanban board */}
      <section
        className="pl-board"
        role="region"
        aria-label="Campaign pipeline board"
      >
        {COLUMNS.map((col) => {
          const items = grouped[col.status];
          return (
            <div
              key={col.status}
              className={`pl-col pl-col--${col.status}`}
              role="group"
              aria-label={`${col.title} column`}
            >
              <header className="pl-col-head">
                <span className="pl-col-rail" aria-hidden="true" />
                <div className="pl-col-titles">
                  <p className="pl-col-eyebrow">{col.title}</p>
                  <p className="pl-col-caption">{col.caption}</p>
                </div>
                <span className="pl-col-count">{items.length}</span>
              </header>

              <div className="pl-col-body">
                {items.length === 0 ? (
                  <div className="pl-col-empty">
                    <p className="pl-col-empty-title">{col.emptyTitle}</p>
                    <p className="pl-col-empty-hint">{col.emptyHint}</p>
                    {col.status === "applied" && (
                      <Link
                        href="/creator/explore"
                        className="pl-col-empty-cta btn-ghost click-shift"
                      >
                        Browse Discover
                      </Link>
                    )}
                  </div>
                ) : (
                  items.map((c) => (
                    <CampaignCard
                      key={c.id}
                      campaign={c}
                      expanded={expandedId === c.id}
                      onToggle={() => toggleExpand(c.id)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
