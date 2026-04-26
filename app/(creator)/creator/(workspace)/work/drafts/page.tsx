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

/* ── Pipeline stage config ───────────────────────────────── */

const PIPELINE_STAGES: {
  key: DraftStatus;
  label: string;
  countClass: string;
  dot: string;
}[] = [
  {
    key: "in_progress",
    label: "In Progress",
    countClass: "drafts-pipeline-count--in-progress",
    dot: "var(--ink-3)",
  },
  {
    key: "ready",
    label: "Ready to Submit",
    countClass: "drafts-pipeline-count--ready",
    dot: "var(--accent-blue)",
  },
  {
    key: "submitted",
    label: "Submitted",
    countClass: "drafts-pipeline-count--submitted",
    dot: "#bfa170",
  },
  {
    key: "overdue",
    label: "Overdue",
    countClass: "drafts-pipeline-count--overdue",
    dot: "var(--brand-red)",
  },
];

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

function previewBg(hue: number): string {
  return `hsl(${hue}, 28%, 87%)`;
}

function previewAccentBg(hue: number): string {
  return `hsl(${hue}, 44%, 58%)`;
}

/* ── Status badge ──────────────────────────────────────────── */

function StatusBadge({ status }: { status: DraftStatus }) {
  const styles: Record<DraftStatus, { bg: string; color: string }> = {
    in_progress: { bg: "var(--surface-2)", color: "var(--ink-3)" },
    ready: { bg: "var(--accent-blue)", color: "var(--snow)" },
    submitted: { bg: "#bfa170", color: "var(--snow)" },
    overdue: { bg: "var(--brand-red)", color: "var(--snow)" },
  };
  const s = styles[status];
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 4,
        background: s.bg,
        color: s.color,
        fontFamily: "var(--font-body)",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

/* ── Draft card (grid view) ──────────────────────────────── */

function DraftCard({ draft, index }: { draft: DraftItem; index: number }) {
  const dcls = deadlineClass(draft.status, draft.deadlineDate);
  const pct = progressPct(draft.wordCount, draft.wordTarget);
  const isEditable = draft.status !== "submitted";
  const deadlineColor =
    dcls === "overdue"
      ? "var(--brand-red)"
      : dcls === "soon"
        ? "#bfa170"
        : "var(--ink-4)";

  return (
    <div
      style={{
        background: "var(--surface-2)",
        border:
          draft.status === "overdue"
            ? "1px solid var(--brand-red)"
            : "1px solid var(--hairline)",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Preview */}
      <div
        style={{
          position: "relative",
          height: 120,
          background: previewBg(draft.previewHue),
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
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
        {/* Overlay badges */}
        <div
          style={{
            position: "absolute",
            inset: "8px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              padding: "3px 8px",
              borderRadius: 4,
              background: "rgba(255,255,255,0.88)",
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 700,
              color: "var(--ink)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {CONTENT_TYPE_LABELS[draft.contentType]}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <span
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.88)",
                fontFamily: "var(--font-body)",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              {PLATFORM_LABELS[draft.platform]}
            </span>
          </div>
        </div>
        <StatusBadge status={draft.status} />
        {/* Bottom-left status overlay */}
        <div style={{ position: "absolute", bottom: 8, left: 8 }}>
          <StatusBadge status={draft.status} />
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--ink)",
            lineHeight: 1.3,
          }}
        >
          {draft.name}
        </div>

        <div
          style={{
            display: "inline-flex",
            padding: "3px 10px",
            borderRadius: 20,
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink-3)",
            alignSelf: "flex-start",
          }}
        >
          {draft.merchantName}
        </div>

        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-3)",
          }}
        >
          {draft.campaignTitle}
        </div>

        {/* Deadline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: deadlineColor,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: deadlineColor,
              flexShrink: 0,
            }}
          />
          {deadlineLabel(draft.status, draft.deadlineDate)}
        </div>

        {/* Progress */}
        {draft.status !== "submitted" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
              }}
            >
              <span>Draft progress</span>
              <span>
                {draft.wordCount}/{draft.wordTarget} words
              </span>
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: "var(--hairline)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  width: `${pct}%`,
                  background:
                    pct === 100 ? "var(--accent-blue)" : "var(--ink-3)",
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink-4)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {draft.merchantName}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {isEditable && (
            <Link
              href={draft.postUrl}
              className="btn-ghost click-shift"
              style={{ fontSize: 12, padding: "4px 12px" }}
            >
              Edit
            </Link>
          )}
          {draft.status === "ready" && (
            <Link
              href={draft.postUrl}
              className="btn-primary click-shift"
              style={{ fontSize: 12, padding: "4px 12px" }}
            >
              Submit
            </Link>
          )}
          {draft.status === "submitted" && (
            <Link
              href={draft.postUrl}
              className="btn-ghost click-shift"
              style={{ fontSize: 12, padding: "4px 12px" }}
            >
              View →
            </Link>
          )}
          {draft.status === "overdue" && (
            <Link
              href={draft.postUrl}
              className="btn-primary click-shift"
              style={{ fontSize: 12, padding: "4px 12px" }}
            >
              Submit now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Draft list row ──────────────────────────────────────── */

function DraftListRow({ draft, index }: { draft: DraftItem; index: number }) {
  const dcls = deadlineClass(draft.status, draft.deadlineDate);
  const pct = progressPct(draft.wordCount, draft.wordTarget);
  const deadlineColor =
    dcls === "overdue"
      ? "var(--brand-red)"
      : dcls === "soon"
        ? "#bfa170"
        : "var(--ink-4)";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40px 1fr auto auto 160px auto",
        alignItems: "center",
        gap: 16,
        padding: "14px 16px",
        borderRadius: 10,
        border:
          draft.status === "overdue"
            ? "1px solid var(--brand-red)"
            : "1px solid var(--hairline)",
        background: "var(--surface-2)",
        marginBottom: 8,
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* Color swatch */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: previewBg(draft.previewHue),
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
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

      {/* Name + merchant + campaign */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {draft.name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-3)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {draft.merchantName}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink-4)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {draft.campaignTitle}
        </div>
      </div>

      {/* Status */}
      <StatusBadge status={draft.status} />

      {/* Deadline */}
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: deadlineColor,
          whiteSpace: "nowrap",
          fontWeight: dcls !== "ok" ? 700 : 400,
        }}
      >
        {deadlineLabel(draft.status, draft.deadlineDate)}
      </span>

      {/* Progress bar */}
      <div>
        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: "var(--hairline)",
            overflow: "hidden",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              width: `${pct}%`,
              background: pct === 100 ? "var(--accent-blue)" : "var(--ink-3)",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink-4)",
          }}
        >
          {draft.wordCount}/{draft.wordTarget} words
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        {draft.status !== "submitted" && (
          <Link
            href={draft.postUrl}
            className="btn-ghost click-shift"
            style={{ fontSize: 12, padding: "4px 10px" }}
          >
            Edit
          </Link>
        )}
        {(draft.status === "ready" || draft.status === "overdue") && (
          <Link
            href={draft.postUrl}
            className="btn-primary click-shift"
            style={{ fontSize: 12, padding: "4px 10px" }}
          >
            Submit
          </Link>
        )}
        {draft.status === "submitted" && (
          <Link
            href={draft.postUrl}
            className="btn-ghost click-shift"
            style={{ fontSize: 12, padding: "4px 10px" }}
          >
            View →
          </Link>
        )}
      </div>
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────── */

function EmptyState({ tabLabel }: { tabLabel: string }) {
  return (
    <div
      style={{
        padding: "64px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 10,
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: "var(--ink-4)",
        }}
      >
        ◻
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--ink)",
            marginBottom: 6,
          }}
        >
          No {tabLabel.toLowerCase()} drafts
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-3)",
          }}
        >
          Check your active campaigns to start a new one
        </div>
      </div>
      <Link href="/creator/campaigns" className="btn-primary click-shift">
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

  const tabLabel = STATUS_TABS.find((t) => t.key === activeTab)?.label ?? "All";

  return (
    <div className="cw-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">
            CONTENT STUDIO · {totalDrafts} TOTAL · {inProgressCount} IN PROGRESS
            · {readyCount} READY
            {overdueCount > 0 ? ` · ${overdueCount} OVERDUE` : ""}
          </p>
          <h1 className="cw-title">Drafts</h1>
        </div>
        <div className="cw-header__right">
          <Link href="/creator/campaigns" className="cw-pill cw-pill--urgent">
            + New Draft
          </Link>
        </div>
      </header>

      {/* ── Status Pipeline header ─────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 24px",
          gap: 8,
          overflowX: "auto",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--surface-2)",
        }}
        role="navigation"
        aria-label="Filter by stage"
      >
        {PIPELINE_STAGES.map((stage, i) => {
          const count = counts[stage.key] ?? 0;
          const isActive = activeTab === stage.key;
          return (
            <div key={stage.key} style={{ display: "contents" }}>
              {i > 0 && (
                <span
                  style={{ color: "var(--ink-4)", fontSize: 12, flexShrink: 0 }}
                  aria-hidden
                >
                  ›
                </span>
              )}
              <div
                onClick={() => setActiveTab(stage.key)}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setActiveTab(stage.key);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--hairline)",
                  background: isActive ? "var(--ink)" : "var(--surface)",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 18,
                    color: isActive ? "var(--snow)" : "var(--ink)",
                    lineHeight: 1,
                  }}
                >
                  {count}
                </span>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: stage.dot,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: isActive ? "var(--snow)" : "var(--ink-3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {stage.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* All drafts */}
        <span
          style={{ color: "var(--ink-4)", fontSize: 12, flexShrink: 0 }}
          aria-hidden
        >
          ·
        </span>
        <div
          onClick={() => setActiveTab("all")}
          role="button"
          tabIndex={0}
          aria-pressed={activeTab === "all"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setActiveTab("all");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid var(--hairline)",
            background: activeTab === "all" ? "var(--ink)" : "var(--surface)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 18,
              color: activeTab === "all" ? "var(--snow)" : "var(--ink)",
              lineHeight: 1,
            }}
          >
            {totalDrafts}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              color: activeTab === "all" ? "var(--snow)" : "var(--ink-3)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            All Drafts
          </span>
        </div>
      </div>

      {/* ── Status tabs ───────────────────────────── */}
      <nav
        style={{
          display: "flex",
          gap: 0,
          padding: "0 24px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
        }}
        aria-label="Draft status filter"
      >
        {STATUS_TABS.map((tab) => {
          const count = counts[tab.key] ?? 0;
          const isOverdue = tab.key === "overdue" && count > 0;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              aria-pressed={isActive}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 16px",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? "var(--ink)" : "var(--ink-3)",
                background: "none",
                border: "none",
                borderBottom: isActive
                  ? "2px solid var(--brand-red)"
                  : "2px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {tab.label}
              {count > 0 && (
                <span
                  style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    background: isOverdue
                      ? "var(--brand-red)"
                      : "var(--surface-2)",
                    color: isOverdue ? "var(--snow)" : "var(--ink-3)",
                    border: isOverdue ? "none" : "1px solid var(--hairline)",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Toolbar ──────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Sort
          </span>
          {(["deadline", "campaign", "status"] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "1px solid var(--hairline)",
                background: sort === s ? "var(--ink)" : "var(--surface-2)",
                color: sort === s ? "var(--snow)" : "var(--ink-3)",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {sort === s && <span aria-hidden="true"> ↑</span>}
            </button>
          ))}
        </div>

        <div
          role="group"
          aria-label="View mode"
          style={{ display: "flex", gap: 4 }}
        >
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: "1px solid var(--hairline)",
              background: view === "grid" ? "var(--ink)" : "var(--surface-2)",
              color: view === "grid" ? "var(--snow)" : "var(--ink-3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ⊞
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: "1px solid var(--hairline)",
              background: view === "list" ? "var(--ink)" : "var(--surface-2)",
              color: view === "list" ? "var(--snow)" : "var(--ink-3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* ── Content ──────────────────────────────── */}
      <div style={{ padding: "0 24px 32px" }}>
        {drafts.length === 0 ? (
          <EmptyState tabLabel={tabLabel} />
        ) : view === "grid" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {drafts.map((d, i) => (
              <DraftCard key={d.id} draft={d} index={i} />
            ))}
          </div>
        ) : (
          <div>
            {/* List header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr auto auto 160px auto",
                gap: 16,
                padding: "8px 16px",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              <div />
              <div>Draft</div>
              <div>Status</div>
              <div>Deadline</div>
              <div>Progress</div>
              <div>Actions</div>
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
