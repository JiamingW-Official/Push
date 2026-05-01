"use client";

/* ─────────────────────────────────────────────────────────────────────
 * Push — Creator · Work · Drafts (refinement pass 2026-04-29)
 *
 * Authority: Design.md v11.
 * Register:  Product (Workspace).
 * Visual    photo-card-style cover w/ bottom gradient overlay
 *           (§ 8.7 adapted for product register), one liquid-glass
 *           floating tile highlighting "ready to submit" (§ 8.9.3),
 *           Filled Primary "Submit" CTA (§ 9.1), Ghost edit / icon
 *           delete with two-step confirm.
 * Status    draft / ready / review / returned — colors only from
 *           § 2 closed list. Time uses relative values.
 * Empty     friendly, action-led, points to /creator/discover.
 * ─────────────────────────────────────────────────────────────────── */

import { useMemo, useState } from "react";
import Link from "next/link";
import "./drafts.css";

/* ── Types ───────────────────────────────────────────────── */

type DraftStatus = "draft" | "ready" | "review" | "returned";
type ContentType = "post" | "story" | "reel" | "video" | "carousel";
type Platform = "instagram" | "tiktok" | "xiaohongshu" | "youtube";
type ViewMode = "grid" | "list";
type SortKey = "deadline" | "saved" | "campaign" | "status";

interface DraftItem {
  id: string;
  title: string;
  campaignId: string;
  campaignTitle: string;
  merchantName: string;
  contentType: ContentType;
  platform: Platform;
  status: DraftStatus;
  deadlineDate: string; // ISO YYYY-MM-DD
  lastSavedAt: string; // ISO date-time
  wordCount: number;
  wordTarget: number;
  assetCount: number;
  assetTarget: number;
  /** Procedural cover hue (0-360) — used for HSL placeholder gradient */
  coverHue: number;
  postUrl: string;
  /** Rejection note when status === "returned" */
  returnNote?: string;
}

/* ── Mock data (kept identical in shape; status remapped to v2 set) ── */

const MOCK_DRAFTS: DraftItem[] = [
  {
    id: "dr-001",
    title: "Morning Ritual story set",
    campaignId: "camp-001",
    campaignTitle: "Morning Ritual Campaign",
    merchantName: "Blank Street Coffee",
    contentType: "story",
    platform: "instagram",
    status: "draft",
    deadlineDate: "2026-04-30",
    lastSavedAt: "2026-04-28T20:14:00",
    wordCount: 180,
    wordTarget: 300,
    assetCount: 2,
    assetTarget: 4,
    coverHue: 28,
    postUrl: "/creator/campaigns/camp-001/post",
  },
  {
    id: "dr-002",
    title: "Best burger in NYC reel",
    campaignId: "camp-002",
    campaignTitle: "Best Burger in NYC Feature",
    merchantName: "Superiority Burger",
    contentType: "reel",
    platform: "instagram",
    status: "ready",
    deadlineDate: "2026-04-30",
    lastSavedAt: "2026-04-29T09:02:00",
    wordCount: 450,
    wordTarget: 450,
    assetCount: 5,
    assetTarget: 5,
    coverHue: 12,
    postUrl: "/creator/campaigns/camp-002/post",
  },
  {
    id: "dr-003",
    title: "Brow transformation before & after",
    campaignId: "camp-004",
    campaignTitle: "Brow Transformation Story",
    merchantName: "Brow Theory",
    contentType: "story",
    platform: "instagram",
    status: "returned",
    deadlineDate: "2026-04-30",
    lastSavedAt: "2026-04-26T15:48:00",
    wordCount: 90,
    wordTarget: 250,
    assetCount: 1,
    assetTarget: 3,
    coverHue: 335,
    postUrl: "/creator/campaigns/camp-004/post",
    returnNote: "Add the verified-by-shop disclosure in the closing card.",
  },
  {
    id: "dr-004",
    title: "Le Bec-Fin pop-up review",
    campaignId: "camp-006",
    campaignTitle: "Le Bec-Fin Pop-Up Review",
    merchantName: "Le Bec Fin",
    contentType: "post",
    platform: "instagram",
    status: "review",
    deadlineDate: "2026-04-22",
    lastSavedAt: "2026-04-22T18:30:00",
    wordCount: 320,
    wordTarget: 300,
    assetCount: 4,
    assetTarget: 4,
    coverHue: 210,
    postUrl: "/creator/campaigns/camp-006/post",
  },
  {
    id: "dr-005",
    title: "Matcha morning ritual stories",
    campaignId: "camp-008",
    campaignTitle: "Matcha Morning Ritual",
    merchantName: "Cha Cha Matcha",
    contentType: "story",
    platform: "instagram",
    status: "draft",
    deadlineDate: "2026-04-29",
    lastSavedAt: "2026-04-29T07:11:00",
    wordCount: 210,
    wordTarget: 400,
    assetCount: 3,
    assetTarget: 5,
    coverHue: 155,
    postUrl: "/creator/campaigns/camp-008/post",
  },
  {
    id: "dr-006",
    title: "LA Botanica aesthetic shoot",
    campaignId: "camp-003",
    campaignTitle: "LA Botanica Aesthetic Shoot",
    merchantName: "Flamingo Estate",
    contentType: "post",
    platform: "instagram",
    status: "draft",
    deadlineDate: "2026-05-05",
    lastSavedAt: "2026-04-27T11:00:00",
    wordCount: 120,
    wordTarget: 500,
    assetCount: 1,
    assetTarget: 6,
    coverHue: 290,
    postUrl: "/creator/campaigns/camp-003/post",
  },
];

/* ── Pinned "today" reference for relative-time math ─────── */

const TODAY = new Date("2026-04-29T10:00:00");

/* ── Constants ───────────────────────────────────────────── */

const STATUS_LABEL: Record<DraftStatus, string> = {
  draft: "Draft",
  ready: "Ready",
  review: "In review",
  returned: "Returned",
};

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: "IG",
  tiktok: "TT",
  xiaohongshu: "XHS",
  youtube: "YT",
};

const TYPE_LABEL: Record<ContentType, string> = {
  post: "Post",
  story: "Story",
  reel: "Reel",
  video: "Video",
  carousel: "Carousel",
};

const STATUS_FILTERS: { key: "all" | DraftStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "ready", label: "Ready" },
  { key: "review", label: "In review" },
  { key: "returned", label: "Returned" },
];

const SORT_LABEL: Record<SortKey, string> = {
  deadline: "Deadline",
  saved: "Last saved",
  campaign: "Campaign",
  status: "Status",
};

/* ── Helpers ─────────────────────────────────────────────── */

function daysUntil(iso: string): number {
  const d = new Date(iso + "T00:00:00");
  return Math.round((d.getTime() - TODAY.getTime()) / 86_400_000);
}

function isLate(d: DraftItem): boolean {
  // overdue = deadline already passed, AND we still owe a deliverable
  return (
    daysUntil(d.deadlineDate) < 0 &&
    d.status !== "review" &&
    d.status !== "ready"
  );
}

function deadlineTone(d: DraftItem): "ok" | "soon" | "late" {
  if (isLate(d)) return "late";
  const k = daysUntil(d.deadlineDate);
  if (k <= 2) return "soon";
  return "ok";
}

function deadlineCopy(d: DraftItem): string {
  const k = daysUntil(d.deadlineDate);
  if (isLate(d)) return `${Math.abs(k)}d overdue`;
  if (k === 0) return "Due today";
  if (k === 1) return "Due tomorrow";
  if (k <= 7) return `Due in ${k}d`;
  return `Due ${new Date(d.deadlineDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function relativeSaved(iso: string): string {
  const t = new Date(iso).getTime();
  const diffMin = Math.max(0, Math.round((TODAY.getTime() - t) / 60_000));
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay <= 7) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Total completion = avg(words progress, assets progress). */
function progressPct(d: DraftItem): number {
  const w = Math.min(1, d.wordCount / Math.max(1, d.wordTarget));
  const a = Math.min(1, d.assetCount / Math.max(1, d.assetTarget));
  return Math.round(((w + a) / 2) * 100);
}

/** Procedural HSL cover — placeholder until real assets land. */
function coverGradient(hue: number): string {
  const a = `hsl(${hue}, 28%, 86%)`;
  const b = `hsl(${(hue + 30) % 360}, 32%, 72%)`;
  const c = `hsl(${(hue + 200) % 360}, 22%, 54%)`;
  return `linear-gradient(135deg, ${a} 0%, ${b} 55%, ${c} 100%)`;
}

/* ── Status chip ─────────────────────────────────────────── */

function StatusChip({ status }: { status: DraftStatus }) {
  return (
    <span
      className={`dr-status dr-status--${status}`}
      aria-label={`Status: ${STATUS_LABEL[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

/* ── Trash icon (16px, currentColor) ─────────────────────── */

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5.5 6v6m2-6v6m1.5-9V2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V3M3 4h10m-1 0v9.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5V4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Empty-state icon ────────────────────────────────────── */

function EmptyDocIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 4h8.5L22 9.5V23a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M16 4v6h6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M11 15h6m-6 3h4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Action cluster (per-card) ───────────────────────────── */

function CardActions({
  draft,
  onDeleteRequest,
  pendingDelete,
}: {
  draft: DraftItem;
  onDeleteRequest: (id: string) => void;
  pendingDelete: boolean;
}) {
  const showSubmit =
    draft.status === "ready" || (isLate(draft) && draft.status === "draft");

  return (
    <div className="dr-card__actions" onClick={(e) => e.stopPropagation()}>
      {draft.status !== "review" && (
        <Link
          href={draft.postUrl}
          className="dr-act"
          aria-label={`Edit ${draft.title}`}
        >
          {draft.status === "returned" ? "Revise" : "Edit"}
        </Link>
      )}
      {draft.status === "review" && (
        <Link
          href={draft.postUrl}
          className="dr-act"
          aria-label={`View ${draft.title}`}
        >
          View
        </Link>
      )}
      {showSubmit && (
        <Link
          href={draft.postUrl}
          className="dr-act dr-act--primary"
          aria-label={`Submit ${draft.title}`}
        >
          Submit
        </Link>
      )}
      {draft.status !== "review" && (
        <button
          type="button"
          className="dr-act-icon"
          aria-label={
            pendingDelete
              ? `Confirm delete ${draft.title}`
              : `Delete ${draft.title}`
          }
          aria-pressed={pendingDelete}
          data-confirm={pendingDelete ? "1" : undefined}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteRequest(draft.id);
          }}
          title={pendingDelete ? "Click again to confirm" : "Delete draft"}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

/* ── Draft card (grid view) ──────────────────────────────── */

function DraftCard({
  draft,
  index,
  onDeleteRequest,
  pendingDelete,
}: {
  draft: DraftItem;
  index: number;
  onDeleteRequest: (id: string) => void;
  pendingDelete: boolean;
}) {
  const pct = progressPct(draft);
  const tone = deadlineTone(draft);
  const cls = [
    "dr-card",
    isLate(draft) ? "dr-card--late" : "",
    draft.status === "returned" ? "dr-card--returned" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={draft.postUrl}
      className={cls}
      style={
        {
          "--dr-cover": coverGradient(draft.coverHue),
          animationDelay: `${index * 60}ms`,
        } as React.CSSProperties
      }
    >
      <div className="dr-card__cover">
        <div className="dr-card__cover-art" aria-hidden="true" />

        <div className="dr-card__cover-meta">
          <span className="dr-card__chip">{TYPE_LABEL[draft.contentType]}</span>
          <span className="dr-card__chip dr-card__chip--platform">
            {PLATFORM_LABEL[draft.platform]}
          </span>
        </div>

        {isLate(draft) && (
          <span className="dr-card__badge" aria-label="Past deadline">
            Past due
          </span>
        )}

        <div className="dr-card__cover-text">
          <h3 className="dr-card__title">{draft.title}</h3>
          <span className="dr-card__overlay-meta">
            {draft.wordCount}/{draft.wordTarget} words
            <span className="dr-card__overlay-dot" aria-hidden="true" />
            {draft.assetCount}/{draft.assetTarget} assets
          </span>
        </div>
      </div>

      <div className="dr-card__body">
        <span className="dr-card__merchant">{draft.merchantName}</span>
        <span className="dr-card__campaign">{draft.campaignTitle}</span>

        <StatusChip status={draft.status} />

        <span className={`dr-deadline dr-deadline--${tone}`}>
          {deadlineCopy(draft)}
        </span>

        <div className="dr-progress" aria-label={`Completion ${pct}%`}>
          <div className="dr-progress__row">
            <span>Completion</span>
            <strong>{pct}%</strong>
          </div>
          <div
            className="dr-progress__track"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`dr-progress__fill dr-progress__fill--${draft.status}`}
              style={{ "--dr-pct": pct / 100 } as React.CSSProperties}
            />
          </div>
        </div>
      </div>

      <div className="dr-card__footer">
        <span className="dr-saved">
          <strong>Saved</strong> {relativeSaved(draft.lastSavedAt)}
        </span>
        <CardActions
          draft={draft}
          onDeleteRequest={onDeleteRequest}
          pendingDelete={pendingDelete}
        />
      </div>
    </Link>
  );
}

/* ── List row ────────────────────────────────────────────── */

function DraftRow({
  draft,
  index,
  onDeleteRequest,
  pendingDelete,
}: {
  draft: DraftItem;
  index: number;
  onDeleteRequest: (id: string) => void;
  pendingDelete: boolean;
}) {
  const pct = progressPct(draft);
  const tone = deadlineTone(draft);
  const cls = [
    "dr-list__row",
    isLate(draft) ? "dr-list__row--late" : "",
    draft.status === "returned" ? "dr-list__row--returned" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={draft.postUrl}
      className={cls}
      style={
        {
          "--dr-cover": coverGradient(draft.coverHue),
          animationDelay: `${index * 40}ms`,
        } as React.CSSProperties
      }
    >
      <div className="dr-list__swatch" aria-hidden="true" />
      <div className="dr-list__name">
        <span className="dr-list__name-title">{draft.title}</span>
        <span className="dr-list__name-meta">
          {draft.merchantName} · {draft.campaignTitle}
        </span>
      </div>

      <StatusChip status={draft.status} />

      <span className={`dr-deadline dr-deadline--${tone}`}>
        {deadlineCopy(draft)}
      </span>

      <div className="dr-list__progress" aria-label={`Completion ${pct}%`}>
        <div
          className="dr-progress__track"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`dr-progress__fill dr-progress__fill--${draft.status}`}
            style={{ "--dr-pct": pct / 100 } as React.CSSProperties}
          />
        </div>
        <span className="dr-saved">
          {pct}% · {relativeSaved(draft.lastSavedAt)}
        </span>
      </div>

      <div className="dr-list__actions">
        <CardActions
          draft={draft}
          onDeleteRequest={onDeleteRequest}
          pendingDelete={pendingDelete}
        />
      </div>
    </Link>
  );
}

/* ── Empty state ─────────────────────────────────────────── */

function EmptyState({ filterLabel }: { filterLabel: string }) {
  const isAll = filterLabel === "All";
  return (
    <div className="dr-empty">
      <div className="dr-empty__art">
        <EmptyDocIcon />
      </div>
      <h2 className="dr-empty__title">
        {isAll ? "No drafts yet" : `Nothing in ${filterLabel.toLowerCase()}`}
      </h2>
      <p className="dr-empty__body">
        {isAll
          ? "Open a campaign to start a draft. Auto-saved every change — your work is safe even if you close the tab."
          : "Try another filter, or pick up a fresh campaign brief from Discover."}
      </p>
      <Link href="/creator/discover" className="btn-primary dr-empty__cta">
        Browse campaigns
      </Link>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */

export default function DraftsPage() {
  const [filter, setFilter] = useState<"all" | DraftStatus>("all");
  const [sort, setSort] = useState<SortKey>("deadline");
  const [view, setView] = useState<ViewMode>("grid");
  /** Two-step delete confirm: first click flags id → second click would
   *  call the (TODO) DELETE endpoint. Auto-resets after 4s. */
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  /* Counts per status (always derived from the full set) */
  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: MOCK_DRAFTS.length,
      draft: 0,
      ready: 0,
      review: 0,
      returned: 0,
      late: 0,
    };
    for (const d of MOCK_DRAFTS) {
      c[d.status] = (c[d.status] ?? 0) + 1;
      if (isLate(d)) c.late += 1;
    }
    return c;
  }, []);

  /* Filter + sort */
  const drafts = useMemo(() => {
    const list =
      filter === "all"
        ? [...MOCK_DRAFTS]
        : MOCK_DRAFTS.filter((d) => d.status === filter);

    list.sort((a, b) => {
      switch (sort) {
        case "deadline":
          return a.deadlineDate.localeCompare(b.deadlineDate);
        case "saved":
          return b.lastSavedAt.localeCompare(a.lastSavedAt);
        case "campaign":
          return a.campaignTitle.localeCompare(b.campaignTitle);
        case "status":
          return a.status.localeCompare(b.status);
      }
    });
    return list;
  }, [filter, sort]);

  const filterLabel =
    STATUS_FILTERS.find((f) => f.key === filter)?.label ?? "All";

  function handleDeleteRequest(id: string) {
    if (pendingDelete === id) {
      // Confirmed — wire to real API later. For now we just clear.
      // In the meantime, swallow the click so two-step UX is honored.
      setPendingDelete(null);
      // TODO: await fetch(`/api/creator/drafts/${id}`, { method: 'DELETE' })
      return;
    }
    setPendingDelete(id);
    window.setTimeout(
      () => setPendingDelete((cur) => (cur === id ? null : cur)),
      4000,
    );
  }

  return (
    <div className="cw-page dr-scope">
      {/* ── Page chrome (canonical) ── */}
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow">
            LINKS · {counts.all} TOTAL · {counts.ready} READY
            {counts.late > 0 ? ` · ${counts.late} LATE` : ""}
          </p>
          <h1 className="cw-title">Drafts.</h1>
        </div>
        <div className="cw-header__right">
          <Link href="/creator/discover" className="cw-pill cw-pill--urgent">
            + New draft
          </Link>
        </div>
      </header>

      {/* ── Summary: KPI strip + liquid-glass ready tile ── */}
      <section className="dr-summary" aria-label="Drafts summary">
        <div className="dr-strip" role="list">
          <div className="dr-strip__cell" role="listitem">
            <span className="dr-strip__label">
              <span
                className="dr-strip__dot dr-strip__dot--draft"
                aria-hidden="true"
              />
              In progress
            </span>
            <span className="dr-strip__value">{counts.draft ?? 0}</span>
            <span className="dr-strip__sub">Auto-saved</span>
          </div>
          <div className="dr-strip__cell" role="listitem">
            <span className="dr-strip__label">
              <span
                className="dr-strip__dot dr-strip__dot--ready"
                aria-hidden="true"
              />
              Ready
            </span>
            <span className="dr-strip__value">{counts.ready ?? 0}</span>
            <span className="dr-strip__sub">Submit anytime</span>
          </div>
          <div className="dr-strip__cell" role="listitem">
            <span className="dr-strip__label">
              <span
                className="dr-strip__dot dr-strip__dot--review"
                aria-hidden="true"
              />
              In review
            </span>
            <span className="dr-strip__value">{counts.review ?? 0}</span>
            <span className="dr-strip__sub">Awaiting merchant</span>
          </div>
          <div className="dr-strip__cell" role="listitem">
            <span className="dr-strip__label">
              <span
                className="dr-strip__dot dr-strip__dot--late"
                aria-hidden="true"
              />
              Late
            </span>
            <span
              className={`dr-strip__value ${counts.late > 0 ? "dr-strip__value--late" : ""}`}
            >
              {counts.late ?? 0}
            </span>
            <span className="dr-strip__sub">
              {counts.late > 0 ? "Needs attention" : "All on schedule"}
            </span>
          </div>
        </div>

        {counts.ready > 0 && (
          <aside
            className="dr-ready-tile"
            aria-label={`${counts.ready} drafts ready to submit`}
          >
            <span className="dr-ready-tile__eyebrow">
              <span
                className="dr-strip__dot dr-strip__dot--ready"
                aria-hidden="true"
              />
              Ready to submit
            </span>
            <span className="dr-ready-tile__count">{counts.ready}</span>
            <span className="dr-ready-tile__sub">
              Final approvals away from being scheduled.
            </span>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setFilter("ready");
                setView("grid");
              }}
            >
              Review ready
            </button>
          </aside>
        )}
      </section>

      {/* ── Filter pills + sort + view toggle ── */}
      <section className="dr-bar" aria-label="Drafts filters">
        <div className="dr-chips" role="tablist" aria-label="Filter by status">
          <span className="dr-chip-eyebrow">FILTER</span>
          {STATUS_FILTERS.map((f) => {
            const active = filter === f.key;
            const count =
              f.key === "all"
                ? counts.all
                : (counts[f.key as DraftStatus] ?? 0);
            const isLateChip = f.key === "returned" && counts.late > 0;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                className="btn-pill"
                aria-pressed={active}
                aria-selected={active}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span
                  className={`dr-chip-badge ${isLateChip ? "dr-chip-badge--late" : ""}`}
                  aria-hidden="true"
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="dr-bar__right">
          <div className="dr-sort">
            <label className="dr-sort__label" htmlFor="dr-sort-select">
              Sort
            </label>
            <select
              id="dr-sort-select"
              className="dr-sort__select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABEL[k]}
                </option>
              ))}
            </select>
          </div>

          <div className="dr-view" role="group" aria-label="View mode">
            <button
              type="button"
              className="dr-view__btn"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="1"
                  width="5"
                  height="5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <rect
                  x="8"
                  y="1"
                  width="5"
                  height="5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <rect
                  x="1"
                  y="8"
                  width="5"
                  height="5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <rect
                  x="8"
                  y="8"
                  width="5"
                  height="5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </button>
            <button
              type="button"
              className="dr-view__btn"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 3.5h10M2 7h10M2 10.5h10"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      {drafts.length === 0 ? (
        <EmptyState filterLabel={filterLabel} />
      ) : view === "grid" ? (
        <section className="dr-grid" aria-label="Drafts">
          {drafts.map((d, i) => (
            <DraftCard
              key={d.id}
              draft={d}
              index={i}
              onDeleteRequest={handleDeleteRequest}
              pendingDelete={pendingDelete === d.id}
            />
          ))}
        </section>
      ) : (
        <section className="dr-list" aria-label="Drafts">
          <div className="dr-list__head" role="row" aria-hidden="true">
            <span />
            <span>Draft</span>
            <span>Status</span>
            <span>Deadline</span>
            <span>Progress</span>
            <span>Actions</span>
          </div>
          {drafts.map((d, i) => (
            <DraftRow
              key={d.id}
              draft={d}
              index={i}
              onDeleteRequest={handleDeleteRequest}
              pendingDelete={pendingDelete === d.id}
            />
          ))}
        </section>
      )}
    </div>
  );
}
