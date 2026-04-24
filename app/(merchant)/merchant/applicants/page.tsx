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
import "./applicants.css";

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

/* ── Sub-components ──────────────────────────────────────── */

function StatusBadge({ status }: { status: ApplicationStatus }) {
  if (status === "pending") return null;
  return (
    <span className={`ap-status-badge ap-status-badge--${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function EmptyStateInbox() {
  return (
    <div className="ap-empty">
      <svg
        className="ap-empty__icon"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="8" y="16" width="48" height="36" />
        <polyline points="8,16 32,38 56,16" />
      </svg>
      <div className="ap-empty__title">Inbox zero. Nice.</div>
      <div className="ap-empty__sub">
        All applications have been reviewed. Check back when new creators apply.
      </div>
    </div>
  );
}

function EmptyStateFiltered() {
  return (
    <div className="ap-empty">
      <svg
        className="ap-empty__icon"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="28" cy="28" r="18" />
        <line x1="41" y1="41" x2="56" y2="56" />
        <line x1="20" y1="28" x2="36" y2="28" />
      </svg>
      <div className="ap-empty__title">No match.</div>
      <div className="ap-empty__sub">
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
    <div className="ap-row-wrap">
      <div
        className={`ap-row${selected ? " ap-row--selected" : ""}${app.status === "declined" ? " ap-row--declined" : ""}`}
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
          className="ap-checkbox"
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(app.id, e.target.checked);
          }}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select ${app.creator.name}`}
        />

        {/* Creator */}
        <div className="ap-creator">
          <img
            src={app.creator.avatar}
            alt={app.creator.name}
            className="ap-creator__avatar"
            loading="lazy"
          />
          <div className="ap-creator__info">
            <div className="ap-creator__name">{app.creator.name}</div>
            <div className="ap-creator__handle">{app.creator.handle}</div>
            <SegmentBadge tier={app.creator.tier} />
          </div>
        </div>

        {/* Push Score */}
        <div className={`ap-score${isHigh ? " ap-score--high" : ""}`}>
          {score}
        </div>

        {/* Campaign */}
        <a
          href={`/merchant/dashboard`}
          className="ap-campaign"
          onClick={(e) => e.stopPropagation()}
          title={app.campaignName}
        >
          {app.campaignName}
        </a>

        {/* Match % */}
        <div className="ap-match">{app.matchScore}%</div>

        {/* Last active */}
        <div className="ap-active">{relativeTime(app.creator.lastActive)}</div>

        {/* Actions */}
        <div className="ap-actions">
          {app.status === "pending" ? (
            <>
              <button
                className="ap-btn ap-btn--message"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: integrate with messaging once merged
                  console.log(
                    `Navigate to /merchant/messages and pre-select thread for ${app.creator.handle}`,
                  );
                }}
                title="Message creator"
              >
                Msg
              </button>
              <button
                className="ap-btn ap-btn--accept"
                onClick={(e) => {
                  e.stopPropagation();
                  onDecide(app.id, "accept");
                }}
              >
                Accept
              </button>
              <button
                className="ap-btn ap-btn--decline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDecide(app.id, "decline");
                }}
              >
                Decline
              </button>
            </>
          ) : (
            <StatusBadge status={app.status} />
          )}
        </div>
      </div>

      {/* Accordion */}
      <div className={`ap-accordion${open ? " ap-accordion--open" : ""}`}>
        <div className="ap-accordion__inner">
          {/* Left column: bio + stats + samples */}
          <div>
            <div className="ap-accordion__section-label">Creator profile</div>
            <div className="ap-accordion__bio">{app.creator.bio}</div>
            <div className="ap-accordion__stats">
              <div className="ap-accordion__stat">
                <span className="ap-accordion__stat-value">
                  {app.creator.campaignsCompleted}
                </span>
                <span className="ap-accordion__stat-label">
                  Campaigns completed
                </span>
              </div>
              <div className="ap-accordion__stat">
                <span className="ap-accordion__stat-value">
                  {(app.creator.conversionRate * 100).toFixed(1)}%
                </span>
                <span className="ap-accordion__stat-label">
                  Conversion rate
                </span>
              </div>
              <div className="ap-accordion__stat">
                <span className="ap-accordion__stat-value">
                  {app.creator.followers >= 1000
                    ? `${(app.creator.followers / 1000).toFixed(1)}K`
                    : app.creator.followers}
                </span>
                <span className="ap-accordion__stat-label">Followers</span>
              </div>
            </div>
            <div className="ap-accordion__section-label">Sample posts</div>
            <div className="ap-accordion__samples">
              {app.sampleUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Sample ${i + 1}`}
                  className="ap-accordion__sample"
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          {/* Right column: cover letter */}
          <div>
            <div className="ap-accordion__section-label">Application note</div>
            <div className="ap-accordion__cover">{app.coverLetter}</div>
          </div>
        </div>
      </div>
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
    <div className="ap-modal-overlay" onClick={onCancel}>
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal__title">
          {label} {count} creator{count !== 1 ? "s" : ""}?
        </div>
        <div className="ap-modal__body">
          {count} application{count !== 1 ? "s" : ""} will be marked as{" "}
          <strong>{verb}</strong>. Creators will be notified.
        </div>
        <div className="ap-modal__actions">
          <button className="ap-modal__cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="ap-modal__confirm" onClick={onConfirm}>
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
  return (
    <div className={`ap-bulk-bar${visible ? " ap-bulk-bar--visible" : ""}`}>
      <span className="ap-bulk-bar__count">{count} selected</span>
      <div className="ap-bulk-bar__sep" />
      <button
        className="ap-bulk-btn ap-bulk-btn--accept"
        onClick={() => onDecision("accept")}
      >
        Accept all
      </button>
      <button
        className="ap-bulk-btn ap-bulk-btn--decline"
        onClick={() => onDecision("decline")}
      >
        Decline all
      </button>
      <button
        className="ap-bulk-btn ap-bulk-btn--shortlist"
        onClick={() => onDecision("shortlist")}
      >
        Shortlist
      </button>
      <button
        className="ap-bulk-btn ap-bulk-btn--message"
        onClick={() => {
          // TODO: integrate with messaging once merged
          console.log("Open bulk message thread for selected creators");
        }}
      >
        Message all
      </button>
      <div className="ap-bulk-bar__sep" />
      <button
        className="ap-bulk-bar__close"
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
  // Filter state
  const [campaignId, setCampaignId] = useState<string>("");
  const [selectedTiers, setSelectedTiers] = useState<CreatorTier[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ApplicationStatus[]>(
    [],
  );
  const [sort, setSort] = useState<SortOption>("recent");
  const [search, setSearch] = useState("");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal state
  const [pendingDecision, setPendingDecision] = useState<{
    decision: BulkDecision;
    ids: string[];
  } | null>(null);

  // Local application state (mirrors mock store)
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

  // Hero stats
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

  // Avg response time (mock: 2.4h)
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
    <div className="ap-shell">
      {/* Nav */}
      <nav className="ap-nav">
        <a href="/" className="ap-nav__logo">
          Push<span>.</span>
        </a>
        <a href="/merchant/dashboard" className="ap-nav__back">
          ← Dashboard
        </a>
        <div className="ap-nav__center">
          <span className="ap-nav__title">Applicant Inbox</span>
        </div>
        <div className="ap-nav__right" />
      </nav>

      <div className="ap-content">
        {/* Editorial Hero */}
        <section className="ap-hero">
          <div className="ap-hero__inner">
            <div className="ap-hero__eyebrow">Merchant · Applicant Inbox</div>
            <div className="ap-hero__row">
              <div className="ap-hero__stat">
                <div className="ap-hero__number">{pendingCount}</div>
                <div className="ap-hero__label">
                  Applications pending review
                </div>
              </div>
            </div>
            <div className="ap-hero__meta">
              <div className="ap-hero__meta-item">
                <span className="ap-hero__meta-value">+{thisWeekCount}</span>
                <span className="ap-hero__meta-label">New this week</span>
              </div>
              <div className="ap-hero__meta-item">
                <span className="ap-hero__meta-value">{avgResponseTime}</span>
                <span className="ap-hero__meta-label">Avg. response time</span>
              </div>
              <div className="ap-hero__meta-item">
                <span className="ap-hero__meta-value">{allApps.length}</span>
                <span className="ap-hero__meta-label">Total applications</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Filter Bar */}
        <div className="ap-filters">
          <div className="ap-filters__inner">
            {/* Campaign dropdown */}
            <select
              className="ap-select"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              aria-label="Filter by campaign"
            >
              <option value="">All Campaigns</option>
              {MERCHANT_CAMPAIGNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="ap-filters__sep" />

            {/* Status pills */}
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
                className={`ap-pill${selectedStatuses.includes(s) ? " ap-pill--active" : ""}`}
                onClick={() => toggleStatus(s)}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}

            <div className="ap-filters__sep" />

            {/* Tier filter */}
            <span className="ap-filters__group-label">Tier</span>
            {ALL_TIERS.map((t) => (
              <button
                key={t}
                className={`ap-pill ap-pill--tier${selectedTiers.includes(t) ? " ap-pill--active" : ""}`}
                onClick={() => toggleTier(t)}
                title={TIER_DISPLAY[t]}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}

            <div className="ap-filters__sep" />

            {/* Sort */}
            <select
              className="ap-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sort applications"
            >
              <option value="recent">Most Recent</option>
              <option value="score_desc">Score High → Low</option>
              <option value="match_desc">Match High → Low</option>
            </select>

            {/* Search */}
            <input
              type="search"
              className="ap-search"
              placeholder="Search creator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search by creator name or handle"
            />

            {/* Result count */}
            <div className="ap-filters__count">
              <strong>{total}</strong> result{total !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Main List */}
        <div className="ap-main">
          {apps.length === 0 ? (
            hasFilters ? (
              <EmptyStateFiltered />
            ) : (
              <EmptyStateInbox />
            )
          ) : (
            <>
              {/* Table header */}
              <div className="ap-table-header">
                <div />
                <div className="ap-table-header__cell">Creator</div>
                <div className="ap-table-header__cell">Score</div>
                <div className="ap-table-header__cell">Campaign</div>
                <div className="ap-table-header__cell">Match</div>
                <div className="ap-table-header__cell">Last active</div>
                <div
                  className="ap-table-header__cell"
                  style={{ textAlign: "right" }}
                >
                  Actions
                </div>
              </div>

              {/* Rows */}
              {apps.map((app) => (
                <ApplicantRow
                  key={app.id}
                  app={app}
                  selected={selectedIds.has(app.id)}
                  onSelect={handleSelect}
                  onDecide={handleDecide}
                />
              ))}
            </>
          )}
        </div>
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
