"use client";

import { useState, useMemo, useCallback } from "react";
import { merchantMock } from "@/lib/data/api-client";
import {
  MERCHANT_CAMPAIGNS,
  type MockApplication,
  type ApplicationStatus,
  type CreatorTier,
  type ApplicantFilters,
} from "@/lib/data/mock-applications";
import { SegmentBadge } from "@/components/shared/SegmentBadge";

/* ── Constants ───────────────────────────────────────────── */

const ALL_TIERS: CreatorTier[] = [
  "seed",
  "explorer",
  "operator",
  "proven",
  "closer",
  "partner",
];

const TIER_DISPLAY: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

type SortOption = "recent" | "score_desc" | "match_desc";
type BulkDecision = "accept" | "decline" | "shortlist";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  shortlisted: "Shortlisted",
};

/* ── Utility ─────────────────────────────────────────────── */

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* ── Status chip ─────────────────────────────────────────── */

function StatusChip({ status }: { status: ApplicationStatus }) {
  if (status === "pending") return null;
  const colorMap: Record<ApplicationStatus, { bg: string; color: string }> = {
    pending: { bg: "var(--surface-3,#ece9e0)", color: "var(--ink-4)" },
    accepted: { bg: "rgba(0,133,255,0.10)", color: "var(--accent-blue)" },
    declined: { bg: "rgba(193,18,31,0.08)", color: "var(--brand-red)" },
    shortlisted: { bg: "rgba(191,161,112,0.15)", color: "#8a6e3e" },
  };
  const { bg, color } = colorMap[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 6,
        fontSize: 11,
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        letterSpacing: "0.08em",
        background: bg,
        color,
      }}
    >
      {STATUS_LABELS[status].toUpperCase()}
    </span>
  );
}

/* ── Empty states ────────────────────────────────────────── */

function EmptyStateInbox() {
  return (
    <div
      style={{
        padding: "64px 24px",
        textAlign: "center",
        fontFamily: "var(--font-body)",
      }}
    >
      <svg
        style={{
          width: 40,
          height: 40,
          color: "var(--ink-4)",
          margin: "0 auto 16px",
        }}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="8" y="16" width="48" height="36" />
        <polyline points="8,16 32,38 56,16" />
      </svg>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: 8,
        }}
      >
        Inbox zero.
      </div>
      <div style={{ fontSize: 13, color: "var(--ink-4)", lineHeight: 1.6 }}>
        All applications reviewed. Check back when new creators apply.
      </div>
    </div>
  );
}

function EmptyStateFiltered() {
  return (
    <div
      style={{
        padding: "64px 24px",
        textAlign: "center",
        fontFamily: "var(--font-body)",
      }}
    >
      <svg
        style={{
          width: 40,
          height: 40,
          color: "var(--ink-4)",
          margin: "0 auto 16px",
        }}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="28" cy="28" r="18" />
        <line x1="41" y1="41" x2="56" y2="56" />
        <line x1="20" y1="28" x2="36" y2="28" />
      </svg>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: 8,
        }}
      >
        No match.
      </div>
      <div style={{ fontSize: 13, color: "var(--ink-4)", lineHeight: 1.6 }}>
        No applications match these filters. Try adjusting your selection.
      </div>
    </div>
  );
}

/* ── Accordion row ───────────────────────────────────────── */

function ApplicantRow({
  app,
  selected,
  onSelect,
  onDecide,
}: {
  app: MockApplication;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onDecide: (id: string, decision: "accept" | "decline") => void;
}) {
  const [open, setOpen] = useState(false);
  const score = app.creator.pushScore;
  const isHigh = score >= 75;

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.closest("button") ||
      target.closest("a")
    )
      return;
    setOpen((v) => !v);
  };

  return (
    <div style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "32px 1fr 72px 160px 72px 80px auto",
          alignItems: "center",
          gap: 16,
          padding: "16px 24px",
          background: selected
            ? "rgba(0,133,255,0.04)"
            : app.status === "declined"
              ? "rgba(193,18,31,0.02)"
              : "transparent",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onClick={handleRowClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen((v) => !v);
        }}
        aria-expanded={open}
      >
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(app.id, e.target.checked);
          }}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select ${app.creator.name}`}
          style={{
            width: 16,
            height: 16,
            cursor: "pointer",
            accentColor: "var(--accent-blue)",
          }}
        />

        {/* Creator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 0,
          }}
        >
          <img
            src={app.creator.avatar}
            alt={app.creator.name}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
            loading="lazy"
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--ink)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {app.creator.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
              }}
            >
              {app.creator.handle}
            </div>
            <SegmentBadge tier={app.creator.tier} />
          </div>
        </div>

        {/* Push Score */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: isHigh ? "var(--accent-blue)" : "var(--ink)",
            textAlign: "center",
          }}
        >
          {score}
        </div>

        {/* Campaign */}
        <a
          href="/merchant/dashboard"
          onClick={(e) => e.stopPropagation()}
          title={app.campaignName}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-3)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
            textDecoration: "none",
          }}
        >
          {app.campaignName}
        </a>

        {/* Match % */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--ink)",
            textAlign: "center",
          }}
        >
          {app.matchScore}%
        </div>

        {/* Last active */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink-4)",
          }}
        >
          {relativeTime(app.creator.lastActive)}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {app.status === "pending" ? (
            <>
              <button
                style={{
                  padding: "6px 12px",
                  fontSize: 11,
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: 6,
                  border: "1px solid var(--hairline)",
                  background: "transparent",
                  color: "var(--ink-4)",
                  transition: "transform 180ms",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(
                    `Navigate to /merchant/messages and pre-select thread for ${app.creator.handle}`,
                  );
                }}
                title="Message creator"
              >
                Msg
              </button>
              <button
                className="btn-primary"
                style={{
                  padding: "6px 14px",
                  fontSize: 11,
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: 8,
                  border: "none",
                  background: "var(--brand-red)",
                  color: "var(--snow)",
                  transition: "transform 180ms",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDecide(app.id, "accept");
                }}
              >
                Accept
              </button>
              <button
                className="btn-ghost"
                style={{
                  padding: "6px 14px",
                  fontSize: 11,
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: 8,
                  border: "1px solid var(--hairline)",
                  background: "transparent",
                  color: "var(--ink)",
                  transition: "transform 180ms",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDecide(app.id, "decline");
                }}
              >
                Decline
              </button>
            </>
          ) : (
            <StatusChip status={app.status} />
          )}
        </div>
      </div>

      {/* Accordion */}
      {open && (
        <div
          style={{
            padding: "24px 24px 24px 72px",
            background: "var(--surface-2)",
            borderTop: "1px solid var(--hairline)",
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Creator Profile
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink-3)",
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                {app.creator.bio}
              </p>
              <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
                {[
                  { value: app.creator.campaignsCompleted, label: "Campaigns" },
                  {
                    value: `${(app.creator.conversionRate * 100).toFixed(1)}%`,
                    label: "Conv. Rate",
                  },
                  {
                    value:
                      app.creator.followers >= 1000
                        ? `${(app.creator.followers / 1000).toFixed(1)}K`
                        : app.creator.followers,
                    label: "Followers",
                  },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 22,
                        fontWeight: 700,
                        color: "var(--ink)",
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="eyebrow"
                      style={{ fontSize: 10, marginTop: 4 }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Sample Posts
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {app.sampleUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Sample ${i + 1}`}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "1px solid var(--hairline)",
                    }}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Application Note
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink-3)",
                  lineHeight: 1.7,
                }}
              >
                {app.coverLetter}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Confirm Modal ───────────────────────────────────────── */

function ConfirmModal({
  count,
  decision,
  onConfirm,
  onCancel,
}: {
  count: number;
  decision: BulkDecision;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const label =
    decision === "accept"
      ? "Accept"
      : decision === "decline"
        ? "Decline"
        : "Shortlist";
  const verb =
    decision === "accept"
      ? "accepted"
      : decision === "decline"
        ? "declined"
        : "shortlisted";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.40)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          padding: 32,
          width: 400,
          maxWidth: "calc(100vw - 48px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: 12,
          }}
        >
          {label} {count} creator{count !== 1 ? "s" : ""}?
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-3)",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          {count} application{count !== 1 ? "s" : ""} will be marked as{" "}
          <strong>{verb}</strong>. Creators will be notified.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn-ghost"
            style={{
              flex: 1,
              padding: "12px",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 8,
              border: "1px solid var(--hairline)",
              background: "transparent",
              color: "var(--ink)",
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            style={{
              flex: 1,
              padding: "12px",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 8,
              border: "none",
              background: "var(--brand-red)",
              color: "var(--snow)",
            }}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Bulk Bar ────────────────────────────────────────────── */

function BulkBar({
  count,
  visible,
  onDecision,
  onClear,
}: {
  count: number;
  visible: boolean;
  onDecision: (d: BulkDecision) => void;
  onClear: () => void;
}) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--ink)",
        borderRadius: 10,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        zIndex: 100,
        boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--snow)",
        }}
      >
        {count} selected
      </span>
      <div
        style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }}
      />
      {(["accept", "decline", "shortlist"] as BulkDecision[]).map((d) => (
        <button
          key={d}
          style={{
            padding: "8px 14px",
            fontSize: 12,
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.20)",
            background: d === "accept" ? "var(--brand-red)" : "transparent",
            color: "var(--snow)",
            transition: "opacity 0.15s",
          }}
          onClick={() => onDecision(d)}
        >
          {d === "accept"
            ? "Accept all"
            : d === "decline"
              ? "Decline all"
              : "Shortlist"}
        </button>
      ))}
      <button
        style={{
          padding: "8px 14px",
          fontSize: 12,
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          cursor: "pointer",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.20)",
          background: "transparent",
          color: "var(--snow)",
        }}
        onClick={() =>
          console.log("Open bulk message thread for selected creators")
        }
      >
        Message all
      </button>
      <div
        style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }}
      />
      <button
        style={{
          padding: "4px 8px",
          fontSize: 16,
          fontFamily: "var(--font-body)",
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.60)",
          cursor: "pointer",
        }}
        onClick={onClear}
        aria-label="Clear selection"
      >
        ×
      </button>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function MerchantApplicantsPage() {
  const [campaignId, setCampaignId] = useState<string>("");
  const [selectedTiers, setSelectedTiers] = useState<CreatorTier[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ApplicationStatus[]>(
    [],
  );
  const [sort, setSort] = useState<SortOption>("recent");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingDecision, setPendingDecision] = useState<{
    decision: BulkDecision;
    ids: string[];
  } | null>(null);
  const [, forceRender] = useState(0);

  const filters: ApplicantFilters = {
    campaignId: campaignId || undefined,
    tiers: selectedTiers.length ? selectedTiers : undefined,
    status: selectedStatuses.length ? selectedStatuses : undefined,
    sort,
    search: search || undefined,
    page: 1,
    limit: 80,
  };

  const { data: apps, total } = merchantMock.getApplicants(filters);

  const allApps = merchantMock.getApplicants({ limit: 80 }).data;
  const pendingCount = useMemo(
    () => allApps.filter((a) => a.status === "pending").length,
    [allApps],
  );
  const thisWeekCount = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    return allApps.filter((a) => new Date(a.appliedAt).getTime() > weekAgo)
      .length;
  }, [allApps]);
  const avgResponseTime = "2.4h";

  const toggleTier = useCallback((tier: CreatorTier) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier],
    );
  }, []);

  const toggleStatus = useCallback((status: ApplicationStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  }, []);

  const handleSelect = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleDecide = useCallback(
    (id: string, decision: "accept" | "decline") => {
      merchantMock.decideApplication(id, decision);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      forceRender((n) => n + 1);
    },
    [],
  );

  const handleBulkTrigger = useCallback(
    (decision: BulkDecision) => {
      setPendingDecision({ decision, ids: Array.from(selectedIds) });
    },
    [selectedIds],
  );

  const handleConfirmBulk = useCallback(() => {
    if (!pendingDecision) return;
    merchantMock.batchDecide(pendingDecision.ids, pendingDecision.decision);
    setSelectedIds(new Set());
    setPendingDecision(null);
    forceRender((n) => n + 1);
  }, [pendingDecision]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const hasFilters =
    !!campaignId ||
    selectedTiers.length > 0 ||
    selectedStatuses.length > 0 ||
    !!search;

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--surface)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Page header */}
      <div
        style={{
          padding: "40px 32px 32px",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Merchant Portal
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px,4vw,40px)",
                  fontWeight: 700,
                  color: "var(--ink)",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Creator Applications
                {pendingCount > 0 && (
                  <span
                    style={{
                      marginLeft: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 14,
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      background: "var(--brand-red)",
                      color: "var(--snow)",
                      verticalAlign: "middle",
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
              </h1>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { value: `+${thisWeekCount}`, label: "New this week" },
                { value: avgResponseTime, label: "Avg. response" },
                { value: allApps.length, label: "Total" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "var(--ink)",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="eyebrow"
                    style={{ fontSize: 10, marginTop: 4 }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "var(--surface)",
          borderBottom: "1px solid var(--hairline)",
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "12px 32px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <select
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            aria-label="Filter by campaign"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink)",
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            <option value="">All Campaigns</option>
            {MERCHANT_CAMPAIGNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div
            style={{ width: 1, height: 20, background: "var(--hairline)" }}
          />

          {(
            [
              "pending",
              "accepted",
              "shortlisted",
              "declined",
            ] as ApplicationStatus[]
          ).map((s) => (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              style={{
                padding: "6px 12px",
                fontSize: 11,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 20,
                border: "1px solid var(--hairline)",
                background: selectedStatuses.includes(s)
                  ? "var(--ink)"
                  : "transparent",
                color: selectedStatuses.includes(s)
                  ? "var(--snow)"
                  : "var(--ink-4)",
                transition: "all 0.15s",
              }}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}

          <div
            style={{ width: 1, height: 20, background: "var(--hairline)" }}
          />

          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--ink-4)",
            }}
          >
            Tier
          </span>
          {ALL_TIERS.map((t) => (
            <button
              key={t}
              onClick={() => toggleTier(t)}
              title={TIER_DISPLAY[t]}
              style={{
                padding: "6px 10px",
                fontSize: 11,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 20,
                border: "1px solid var(--hairline)",
                background: selectedTiers.includes(t)
                  ? "var(--accent-blue)"
                  : "transparent",
                color: selectedTiers.includes(t)
                  ? "var(--snow)"
                  : "var(--ink-4)",
                transition: "all 0.15s",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}

          <div
            style={{ width: 1, height: 20, background: "var(--hairline)" }}
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort applications"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink)",
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            <option value="recent">Most Recent</option>
            <option value="score_desc">Score High → Low</option>
            <option value="match_desc">Match High → Low</option>
          </select>

          <input
            type="search"
            placeholder="Search creator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search by creator name or handle"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink)",
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 6,
              padding: "6px 12px",
              outline: "none",
              minWidth: 160,
            }}
          />

          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
            }}
          >
            <strong style={{ color: "var(--ink)" }}>{total}</strong> result
            {total !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px" }}>
        {apps.length === 0 ? (
          hasFilters ? (
            <EmptyStateFiltered />
          ) : (
            <EmptyStateInbox />
          )
        ) : (
          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              marginTop: 24,
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 72px 160px 72px 80px auto",
                alignItems: "center",
                gap: 16,
                padding: "12px 24px",
                borderBottom: "1px solid var(--hairline)",
                background: "var(--surface)",
              }}
            >
              <div />
              {[
                "Creator",
                "Score",
                "Campaign",
                "Match",
                "Last Active",
                "Actions",
              ].map((h) => (
                <div key={h} className="eyebrow" style={{ fontSize: 10 }}>
                  {h}
                </div>
              ))}
            </div>
            {apps.map((app) => (
              <ApplicantRow
                key={app.id}
                app={app}
                selected={selectedIds.has(app.id)}
                onSelect={handleSelect}
                onDecide={handleDecide}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bulk Bar */}
      <BulkBar
        count={selectedIds.size}
        visible={selectedIds.size > 0}
        onDecision={handleBulkTrigger}
        onClear={clearSelection}
      />

      {/* Confirm Modal */}
      {pendingDecision && (
        <ConfirmModal
          count={pendingDecision.ids.length}
          decision={pendingDecision.decision}
          onConfirm={handleConfirmBulk}
          onCancel={() => setPendingDecision(null)}
        />
      )}
    </div>
  );
}
