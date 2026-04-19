"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import "./drafts.css";

/* ── Types ───────────────────────────────────────────────── */

type DraftStatus = "in_progress" | "ready" | "submitted" | "overdue";
type ContentType = "post" | "story" | "reel" | "video" | "carousel";
type Platform = "instagram" | "tiktok" | "xiaohongshu" | "youtube";
type ViewMode = "grid" | "list";
type SortKey = "deadline" | "campaign" | "status";

interface DraftItem {
  id: string;
  name: string;
  campaignId: string;
  campaignTitle: string;
  merchantName: string;
  contentType: ContentType;
  platform: Platform;
  status: DraftStatus;
  deadlineDate: string; // ISO date YYYY-MM-DD
  wordCount: number;
  wordTarget: number;
  /** Preview background: hue degrees (for HSL) */
  previewHue: number;
  postUrl: string;
}

/* ── Mock data ───────────────────────────────────────────── */

const MOCK_DRAFTS: DraftItem[] = [
  {
    id: "dr-001",
    name: "Morning Ritual Story Set",
    campaignId: "camp-001",
    campaignTitle: "Morning Ritual Campaign",
    merchantName: "Blank Street Coffee",
    contentType: "story",
    platform: "instagram",
    status: "in_progress",
    deadlineDate: "2026-04-30",
    wordCount: 180,
    wordTarget: 300,
    previewHue: 28,
    postUrl: "/creator/campaigns/camp-001/post",
  },
  {
    id: "dr-002",
    name: "Best Burger NYC Reel",
    campaignId: "camp-002",
    campaignTitle: "Best Burger in NYC Feature",
    merchantName: "Superiority Burger",
    contentType: "reel",
    platform: "instagram",
    status: "ready",
    deadlineDate: "2026-04-25",
    wordCount: 450,
    wordTarget: 450,
    previewHue: 12,
    postUrl: "/creator/campaigns/camp-002/post",
  },
  {
    id: "dr-003",
    name: "Brow Transformation Before & After",
    campaignId: "camp-004",
    campaignTitle: "Brow Transformation Story",
    merchantName: "Brow Theory",
    contentType: "story",
    platform: "instagram",
    status: "overdue",
    deadlineDate: "2026-04-20",
    wordCount: 90,
    wordTarget: 250,
    previewHue: 335,
    postUrl: "/creator/campaigns/camp-004/post",
  },
  {
    id: "dr-004",
    name: "Le Bec-Fin Pop-Up Review Post",
    campaignId: "camp-006",
    campaignTitle: "Le Bec-Fin Pop-Up Review",
    merchantName: "Le Bec Fin",
    contentType: "post",
    platform: "instagram",
    status: "submitted",
    deadlineDate: "2026-04-22",
    wordCount: 320,
    wordTarget: 300,
    previewHue: 210,
    postUrl: "/creator/campaigns/camp-006/post",
  },
  {
    id: "dr-005",
    name: "Matcha Morning Ritual Stories",
    campaignId: "camp-008",
    campaignTitle: "Matcha Morning Ritual",
    merchantName: "Cha Cha Matcha",
    contentType: "story",
    platform: "instagram",
    status: "in_progress",
    deadlineDate: "2026-04-29",
    wordCount: 210,
    wordTarget: 400,
    previewHue: 155,
    postUrl: "/creator/campaigns/camp-008/post",
  },
  {
    id: "dr-006",
    name: "LA Botanica Aesthetic Shoot",
    campaignId: "camp-003",
    campaignTitle: "LA Botanica Aesthetic Shoot",
    merchantName: "Flamingo Estate",
    contentType: "post",
    platform: "instagram",
    status: "in_progress",
    deadlineDate: "2026-05-05",
    wordCount: 120,
    wordTarget: 500,
    previewHue: 290,
    postUrl: "/creator/campaigns/camp-003/post",
  },
];

/* ── Constants ───────────────────────────────────────────── */

const STATUS_TABS: { key: "all" | DraftStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in_progress", label: "In Progress" },
  { key: "ready", label: "Ready" },
  { key: "submitted", label: "Submitted" },
  { key: "overdue", label: "Overdue" },
];

const STATUS_LABELS: Record<DraftStatus, string> = {
  in_progress: "In Progress",
  ready: "Ready",
  submitted: "Submitted",
  overdue: "Overdue",
};

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "IG",
  tiktok: "TT",
  xiaohongshu: "XHS",
  youtube: "YT",
};

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  post: "Post",
  story: "Story",
  reel: "Reel",
  video: "Video",
  carousel: "Carousel",
};

/* ── Helpers ─────────────────────────────────────────────── */

const TODAY = new Date("2026-04-18");

function daysDiff(isoDate: string): number {
  const d = new Date(isoDate + "T00:00:00");
  return Math.round((d.getTime() - TODAY.getTime()) / 86_400_000);
}

function deadlineClass(
  status: DraftStatus,
  isoDate: string,
): "ok" | "soon" | "overdue" {
  if (status === "overdue") return "overdue";
  const diff = daysDiff(isoDate);
  if (diff < 0) return "overdue";
  if (diff <= 3) return "soon";
  return "ok";
}

function deadlineLabel(status: DraftStatus, isoDate: string): string {
  if (status === "submitted") return "Submitted";
  const diff = daysDiff(isoDate);
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `Due in ${diff}d`;
}

function progressPct(wordCount: number, wordTarget: number): number {
  return Math.min(100, Math.round((wordCount / wordTarget) * 100));
}

/* Preview colour palette from hue: generates CSS hsl bg */
function previewBg(hue: number): string {
  return `hsl(${hue}, 30%, 88%)`;
}

function previewAccentBg(hue: number): string {
  return `hsl(${hue}, 45%, 60%)`;
}

/* ── Status badge component ──────────────────────────────── */

function StatusBadge({
  status,
  className = "",
}: {
  status: DraftStatus;
  className?: string;
}) {
  const map: Record<DraftStatus, string> = {
    in_progress: "status--in-progress",
    ready: "status--ready",
    submitted: "status--submitted",
    overdue: "status--overdue",
  };
  return (
    <span className={`draft-list-status ${map[status]} ${className}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

/* ── Draft card (grid) ───────────────────────────────────── */

function DraftCard({ draft, index }: { draft: DraftItem; index: number }) {
  const dcls = deadlineClass(draft.status, draft.deadlineDate);
  const pct = progressPct(draft.wordCount, draft.wordTarget);

  const cardStatusClass =
    draft.status === "overdue" ? "draft-card--overdue" : "";

  const badgeClass: Record<DraftStatus, string> = {
    in_progress: "draft-card-status-badge--in-progress",
    ready: "draft-card-status-badge--ready",
    submitted: "draft-card-status-badge--submitted",
    overdue: "draft-card-status-badge--overdue",
  };

  return (
    <div
      className={`draft-card ${cardStatusClass}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Preview */}
      <div className="draft-card-preview">
        <div
          className="draft-card-preview-bg"
          style={{ background: previewBg(draft.previewHue) }}
        >
          <div className="draft-card-preview-art">
            {/* Geometric shapes as CSS pseudo-elements via inline style */}
            <div
              style={{
                position: "absolute",
                top: "-20%",
                right: "-15%",
                width: "65%",
                height: "120%",
                background: previewAccentBg(draft.previewHue),
                opacity: 0.18,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "35%",
                height: "45%",
                background: previewAccentBg(draft.previewHue),
                opacity: 0.1,
              }}
            />
          </div>
        </div>

        {/* Badges */}
        <span className="draft-card-type-badge">
          {CONTENT_TYPE_LABELS[draft.contentType]}
        </span>
        <span className="draft-card-platform">
          {PLATFORM_LABELS[draft.platform]}
        </span>
        <span className={`draft-card-status-badge ${badgeClass[draft.status]}`}>
          {STATUS_LABELS[draft.status]}
        </span>
      </div>

      {/* Body */}
      <div className="draft-card-body">
        <div className="draft-card-name">{draft.name}</div>
        <div className="draft-card-campaign">{draft.campaignTitle}</div>

        {/* Deadline */}
        <div className={`draft-card-deadline draft-card-deadline--${dcls}`}>
          <span
            className="draft-card-deadline-dot"
            style={{
              background:
                dcls === "overdue"
                  ? "var(--primary)"
                  : dcls === "soon"
                    ? "var(--champagne, #c9a96e)"
                    : "rgba(0,48,73,0.3)",
            }}
          />
          {deadlineLabel(draft.status, draft.deadlineDate)}
        </div>

        {/* Progress */}
        {draft.status !== "submitted" && (
          <>
            <div className="draft-card-progress-label">
              <span>Draft progress</span>
              <span>
                {draft.wordCount}/{draft.wordTarget} words
              </span>
            </div>
            <div className="draft-card-progress-track">
              <div
                className="draft-card-progress-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="draft-card-footer">
        <span className="draft-card-merchant">{draft.merchantName}</span>
        <Link href={draft.postUrl} className="draft-card-cta">
          {draft.status === "submitted" ? "View" : "Continue"}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

/* ── Draft list row ──────────────────────────────────────── */

function DraftListRow({ draft, index }: { draft: DraftItem; index: number }) {
  const dcls = deadlineClass(draft.status, draft.deadlineDate);
  const pct = progressPct(draft.wordCount, draft.wordTarget);
  const overdueCls =
    draft.status === "overdue" ? "draft-list-row--overdue" : "";

  return (
    <div
      className={`draft-list-row ${overdueCls}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Colour swatch */}
      <div
        className="draft-list-swatch"
        style={{ background: previewBg(draft.previewHue) }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: previewAccentBg(draft.previewHue),
            opacity: 0.25,
          }}
        />
      </div>

      {/* Name + campaign */}
      <div className="draft-list-name">
        {draft.name}
        <span className="draft-list-campaign-name">{draft.campaignTitle}</span>
      </div>

      {/* Status */}
      <StatusBadge status={draft.status} />

      {/* Deadline */}
      <span className={`draft-list-deadline draft-list-deadline--${dcls}`}>
        {deadlineLabel(draft.status, draft.deadlineDate)}
      </span>

      {/* Progress bar */}
      <div className="draft-list-progress">
        <div className="draft-list-progress-bar">
          <div
            className="draft-list-progress-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="draft-list-progress-label">
          {draft.wordCount}/{draft.wordTarget} words
        </span>
      </div>

      {/* CTA */}
      <Link href={draft.postUrl} className="draft-list-cta">
        {draft.status === "submitted" ? "View" : "Continue →"}
      </Link>
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────── */

function EmptyState({ tabLabel }: { tabLabel: string }) {
  return (
    <div className="drafts-empty">
      <div className="drafts-empty-art">
        <div className="drafts-empty-inner" />
      </div>
      <div className="drafts-empty-text">
        <div className="drafts-empty-title">
          No {tabLabel.toLowerCase()} drafts
        </div>
        <div className="drafts-empty-sub">
          Start a new one from your active campaigns
        </div>
      </div>
      <Link href="/creator/campaigns" className="drafts-empty-cta">
        <span className="drafts-hero-cta-plus">+</span>
        Browse campaigns
      </Link>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */

export default function DraftsPage() {
  const [activeTab, setActiveTab] = useState<"all" | DraftStatus>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortKey>("deadline");

  /* Tab counts */
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: MOCK_DRAFTS.length };
    for (const d of MOCK_DRAFTS) {
      c[d.status] = (c[d.status] ?? 0) + 1;
    }
    return c;
  }, []);

  /* Hero stats */
  const totalDrafts = MOCK_DRAFTS.length;
  const readyCount = counts["ready"] ?? 0;
  const overdueCount = counts["overdue"] ?? 0;
  const inProgressCount = counts["in_progress"] ?? 0;

  /* Filtered + sorted */
  const drafts = useMemo(() => {
    const filtered =
      activeTab === "all"
        ? [...MOCK_DRAFTS]
        : MOCK_DRAFTS.filter((d) => d.status === activeTab);

    filtered.sort((a, b) => {
      if (sort === "deadline")
        return a.deadlineDate.localeCompare(b.deadlineDate);
      if (sort === "campaign")
        return a.campaignTitle.localeCompare(b.campaignTitle);
      if (sort === "status") return a.status.localeCompare(b.status);
      return 0;
    });

    return filtered;
  }, [activeTab, sort]);

  /* Current tab label for empty state */
  const tabLabel = STATUS_TABS.find((t) => t.key === activeTab)?.label ?? "All";

  return (
    <div className="drafts">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="drafts-hero">
        <p className="drafts-hero-eyebrow">Content Studio</p>
        <h1 className="drafts-hero-title">DRAFTS</h1>
        <div className="drafts-hero-meta">
          <div className="drafts-hero-stats">
            <div className="drafts-hero-stat">
              <span className="drafts-hero-stat-num drafts-hero-stat-num--white">
                {totalDrafts}
              </span>
              <span className="drafts-hero-stat-label">Total Drafts</span>
            </div>
            <div className="drafts-hero-stat">
              <span className="drafts-hero-stat-num drafts-hero-stat-num--blue">
                {inProgressCount}
              </span>
              <span className="drafts-hero-stat-label">In Progress</span>
            </div>
            <div className="drafts-hero-stat">
              <span className="drafts-hero-stat-num drafts-hero-stat-num--gold">
                {readyCount}
              </span>
              <span className="drafts-hero-stat-label">Ready to Submit</span>
            </div>
            {overdueCount > 0 && (
              <div className="drafts-hero-stat">
                <span className="drafts-hero-stat-num drafts-hero-stat-num--primary">
                  {overdueCount}
                </span>
                <span className="drafts-hero-stat-label">Overdue</span>
              </div>
            )}
          </div>

          <Link href="/creator/campaigns" className="drafts-hero-cta">
            <span className="drafts-hero-cta-plus" aria-hidden="true">
              +
            </span>
            New Draft
          </Link>
        </div>
      </section>

      {/* ── Status tabs ───────────────────────────────── */}
      <nav className="drafts-tabs" aria-label="Draft status filter">
        {STATUS_TABS.map((tab) => {
          const count = counts[tab.key] ?? 0;
          const isOverdue = tab.key === "overdue" && count > 0;
          return (
            <button
              key={tab.key}
              className={`drafts-tab${activeTab === tab.key ? " drafts-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              aria-pressed={activeTab === tab.key}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`drafts-tab-badge${isOverdue ? " drafts-tab-badge--overdue" : ""}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Toolbar ───────────────────────────────────── */}
      <div className="drafts-toolbar">
        <div className="drafts-toolbar-left">
          {(["deadline", "campaign", "status"] as SortKey[]).map((s) => (
            <button
              key={s}
              className={`drafts-sort-btn${sort === s ? " drafts-sort-btn--active" : ""}`}
              onClick={() => setSort(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {sort === s && <span aria-hidden="true">↑</span>}
            </button>
          ))}
        </div>

        {/* Grid / List toggle */}
        <div className="drafts-view-toggle" role="group" aria-label="View mode">
          <button
            className={`drafts-view-btn${view === "grid" ? " drafts-view-btn--active" : ""}`}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            ⊞
          </button>
          <button
            className={`drafts-view-btn${view === "list" ? " drafts-view-btn--active" : ""}`}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────── */}
      <div className="drafts-body">
        {drafts.length === 0 ? (
          <EmptyState tabLabel={tabLabel} />
        ) : view === "grid" ? (
          <div className="drafts-grid">
            {drafts.map((d, i) => (
              <DraftCard key={d.id} draft={d} index={i} />
            ))}
          </div>
        ) : (
          <div className="drafts-list">
            <div className="drafts-list-header">
              <div className="drafts-list-header-cell" />
              <div className="drafts-list-header-cell">Draft</div>
              <div className="drafts-list-header-cell">Status</div>
              <div className="drafts-list-header-cell">Deadline</div>
              <div className="drafts-list-header-cell">Progress</div>
              <div className="drafts-list-header-cell" />
            </div>
            {drafts.map((d, i) => (
              <DraftListRow key={d.id} draft={d} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
