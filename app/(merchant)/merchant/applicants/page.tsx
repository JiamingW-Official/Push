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
  seed: "Clay",
  explorer: "Bronze",
  operator: "Steel",
  proven: "Gold",
  closer: "Ruby",
  partner: "Obsidian",
};

const TIER_FULL_LABEL: Record<CreatorTier, string> = {
  seed: "Clay · Seed",
  explorer: "Bronze · Explorer",
  operator: "Steel · Operator",
  proven: "Gold · Proven",
  closer: "Ruby · Closer",
  partner: "Obsidian · Partner",
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  shortlisted: "Waitlist",
};

type SortOption = "recent" | "score_desc" | "match_desc";
type BulkDecision = "accept" | "decline" | "shortlist";

/* ── Utility ─────────────────────────────────────────────── */

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Deterministic pseudo-score based on creator+dimension, 55–95 range.
function subScore(seed: string, dimension: string): number {
  let h = 0;
  const s = `${seed}::${dimension}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return 55 + (Math.abs(h) % 41);
}

/* ── Tier Badge (Design.md Tier Identity) ────────────────── */

function TierBadge({ tier }: { tier: CreatorTier }) {
  return (
    <span className={`tier-badge tier-badge--${tier}`}>
      {TIER_DISPLAY[tier]}
    </span>
  );
}

/* ── Applicant row (list item) ───────────────────────────── */

function ApplicantRow({
  app,
  selected,
  checked,
  onSelect,
  onToggleCheck,
}: {
  app: MockApplication;
  selected: boolean;
  checked: boolean;
  onSelect: () => void;
  onToggleCheck: (checked: boolean) => void;
}) {
  const score = app.matchScore;

  return (
    <div
      className={[
        "ap-row",
        selected ? "ap-row--selected" : "",
        app.status === "declined" ? "ap-row--declined" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-selected={selected}
    >
      <input
        type="checkbox"
        className="ap-checkbox"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          onToggleCheck(e.target.checked);
        }}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Select ${app.creator.name}`}
      />

      <div className={`ap-avatar-wrap tier--${app.creator.tier}`}>
        <img
          src={app.creator.avatar}
          alt={app.creator.name}
          className="ap-avatar"
          loading="lazy"
        />
      </div>

      <div className="ap-row__body">
        <div className="ap-row__top">
          <div className="ap-row__identity">
            <div className="ap-row__handle">{app.creator.handle}</div>
            <div className="ap-row__name">{app.creator.name}</div>
          </div>
          <TierBadge tier={app.creator.tier} />
        </div>

        <div className="ap-row__stats">
          <div className="ap-row__verified">
            <span className="ap-row__verified-value">
              {app.creator.campaignsCompleted}
            </span>
            <span className="ap-row__verified-label">verified</span>
          </div>

          <div className="ap-row__status-cell">
            <span
              className={`ap-status ap-status--${app.status}`}
              data-status={app.status}
            >
              {STATUS_LABELS[app.status]}
            </span>
          </div>
        </div>
      </div>

      <div className="ap-row__score" title="ConversionOracle™ match score">
        <div className="ap-row__score-value">{score}</div>
        <div className="ap-row__score-label">match</div>
      </div>
    </div>
  );
}

/* ── Sub-score bar ───────────────────────────────────────── */

function SubScoreBar({
  label,
  value,
  tier,
}: {
  label: string;
  value: number;
  tier: CreatorTier;
}) {
  return (
    <div className="ap-sub">
      <div className="ap-sub__head">
        <span className="ap-sub__label">{label}</span>
        <span className="ap-sub__value">{value}</span>
      </div>
      <div className="ap-sub__track">
        <span
          className={`tier-progress--${tier}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ── Detail Panel ────────────────────────────────────────── */

function DetailPanel({
  app,
  onDecide,
}: {
  app: MockApplication | null;
  onDecide: (id: string, decision: BulkDecision) => void;
}) {
  if (!app) {
    return (
      <div className="ap-detail ap-detail--empty">
        <div className="ap-detail__empty-icon" aria-hidden>
          <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="32" cy="24" r="10" />
            <path d="M12 52c4-10 12-14 20-14s16 4 20 14" />
          </svg>
        </div>
        <div className="ap-detail__empty-title">No applicant selected</div>
        <div className="ap-detail__empty-sub">
          Select a creator from the list to review their ConversionOracle™ match
          and past walk-in performance.
        </div>
      </div>
    );
  }

  const seedId = app.creator.id;
  const scores = {
    consistency: subScore(seedId, "consistency"),
    match: app.matchScore,
    reach: Math.min(
      95,
      Math.round(55 + Math.log10(app.creator.followers + 10) * 9),
    ),
    authenticity: subScore(seedId, "authenticity"),
  };

  return (
    <div className="ap-detail">
      {/* Tier band */}
      <span className={`tier-header--${app.creator.tier}`} aria-hidden />

      {/* Header */}
      <div className="ap-detail__head">
        <div
          className={`ap-avatar-wrap ap-avatar-wrap--lg tier--${app.creator.tier}`}
        >
          <img
            src={app.creator.avatar}
            alt={app.creator.name}
            className="ap-avatar ap-avatar--lg"
          />
        </div>
        <div className="ap-detail__ident">
          <div className="ap-detail__handle">{app.creator.handle}</div>
          <h2 className="ap-detail__name">{app.creator.name}</h2>
          <div className="ap-detail__meta">
            <TierBadge tier={app.creator.tier} />
            <span className="ap-detail__meta-dot" aria-hidden>
              ·
            </span>
            <span className="ap-detail__applied">
              Applied {relativeTime(app.appliedAt)}
            </span>
          </div>
        </div>
        <a
          href={`/merchant/applicants/${app.id}`}
          className="ap-detail__full-link"
        >
          View full profile →
        </a>
      </div>

      {/* ConversionOracle Match score headline */}
      <div className="ap-detail__oracle">
        <div className="ap-detail__oracle-num">{app.matchScore}</div>
        <div className="ap-detail__oracle-right">
          <div className="ap-detail__oracle-label">ConversionOracle™ match</div>
          <div className="ap-detail__oracle-caption">
            Predicted walk-in conversion vs. your Williamsburg Coffee+ beachhead
            baseline.
          </div>
        </div>
      </div>

      {/* Mini portfolio */}
      <div className="ap-detail__section">
        <div className="ap-detail__section-label">Mini-portfolio</div>
        <div className="ap-detail__samples">
          {app.sampleUrls.slice(0, 3).map((url, i) => (
            <div key={i} className="ap-detail__sample">
              <img src={url} alt={`Sample ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {/* Verified customers timeline */}
      <div className="ap-detail__section">
        <div className="ap-detail__section-label">
          Verified customers · last 5 campaigns
        </div>
        <div className="ap-detail__timeline">
          {Array.from({ length: 5 }).map((_, i) => {
            const count = Math.max(
              0,
              Math.round(
                (app.creator.campaignsCompleted || 0) * (0.25 - i * 0.035) +
                  subScore(seedId, `ts${i}`) / 10,
              ),
            );
            return (
              <div key={i} className="ap-detail__ts-bar">
                <div
                  className="ap-detail__ts-fill"
                  style={{ height: `${Math.min(100, count * 2.5)}%` }}
                />
                <div className="ap-detail__ts-count">{count}</div>
              </div>
            );
          })}
        </div>
        <div className="ap-detail__timeline-axis">
          <span>Oldest</span>
          <span>Latest</span>
        </div>
      </div>

      {/* Creator score breakdown */}
      <div className="ap-detail__section">
        <div className="ap-detail__section-label">Creator score breakdown</div>
        <div className="ap-detail__subs">
          <SubScoreBar
            label="Consistency"
            value={scores.consistency}
            tier={app.creator.tier}
          />
          <SubScoreBar
            label="Match"
            value={scores.match}
            tier={app.creator.tier}
          />
          <SubScoreBar
            label="Reach"
            value={scores.reach}
            tier={app.creator.tier}
          />
          <SubScoreBar
            label="Authenticity"
            value={scores.authenticity}
            tier={app.creator.tier}
          />
        </div>
      </div>

      {/* Last campaign notes */}
      <div className="ap-detail__section">
        <div className="ap-detail__section-label">Notes · last campaign</div>
        <blockquote className="ap-detail__notes">
          &ldquo;{app.coverLetter}&rdquo;
        </blockquote>
      </div>

      {/* Primary actions */}
      <div className="ap-detail__actions">
        <button
          className="ap-detail-btn ap-detail-btn--accept"
          onClick={() => onDecide(app.id, "accept")}
          disabled={app.status === "accepted"}
        >
          Approve
        </button>
        <button
          className="ap-detail-btn ap-detail-btn--waitlist"
          onClick={() => onDecide(app.id, "shortlist")}
          disabled={app.status === "shortlisted"}
        >
          Waitlist
        </button>
        <button
          className="ap-detail-btn ap-detail-btn--reject"
          onClick={() => onDecide(app.id, "decline")}
          disabled={app.status === "declined"}
        >
          Reject
        </button>
        <a
          href="/merchant/messages"
          className="ap-detail-btn ap-detail-btn--message"
        >
          Message creator
        </a>
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
      ? "Approve"
      : decision === "decline"
        ? "Reject"
        : "Waitlist";
  const verb =
    decision === "accept"
      ? "approved"
      : decision === "decline"
        ? "rejected"
        : "waitlisted";

  return (
    <div className="ap-modal-overlay" onClick={onCancel}>
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal__title">
          {label} {count} applicant{count !== 1 ? "s" : ""}?
        </div>
        <div className="ap-modal__body">
          {count} application{count !== 1 ? "s" : ""} will be marked as{" "}
          <strong>{verb}</strong>. DisclosureBot will notify creators
          automatically.
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

/* ── Main Page ───────────────────────────────────────────── */

export default function MerchantApplicantsPage() {
  const [campaignId, setCampaignId] = useState<string>("");
  const [selectedTiers, setSelectedTiers] = useState<CreatorTier[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ApplicationStatus[]>(
    [],
  );
  const [sort, setSort] = useState<SortOption>("match_desc");
  const [search, setSearch] = useState("");
  const [minMatch, setMinMatch] = useState<number>(0);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

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

  const { data: allFiltered, total: rawTotal } =
    merchantMock.getApplicants(filters);

  // Apply match-score threshold on top (UI-only filter)
  const apps = useMemo(
    () => allFiltered.filter((a) => a.matchScore >= minMatch),
    [allFiltered, minMatch],
  );
  const total = apps.length;

  // Auto-select first applicant when none selected (or current is filtered out)
  const activeApp = useMemo(() => {
    if (!selectedId) return apps[0] ?? null;
    return apps.find((a) => a.id === selectedId) ?? apps[0] ?? null;
  }, [selectedId, apps]);

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

  const handleToggleCheck = useCallback((id: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleDecide = useCallback((id: string, decision: BulkDecision) => {
    const mapped: "accept" | "decline" | "shortlist" =
      decision === "accept"
        ? "accept"
        : decision === "decline"
          ? "decline"
          : "shortlist";
    // merchantMock.decideApplication supports accept/decline;
    // use batchDecide for shortlist to reuse existing setter logic.
    if (mapped === "shortlist") {
      merchantMock.batchDecide([id], "shortlist");
    } else {
      merchantMock.decideApplication(id, mapped);
    }
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    forceRender((n) => n + 1);
  }, []);

  const handleBulkTrigger = useCallback(
    (decision: BulkDecision) => {
      if (checkedIds.size === 0) return;
      setPendingDecision({ decision, ids: Array.from(checkedIds) });
    },
    [checkedIds],
  );

  const handleConfirmBulk = useCallback(() => {
    if (!pendingDecision) return;
    merchantMock.batchDecide(pendingDecision.ids, pendingDecision.decision);
    setCheckedIds(new Set());
    setPendingDecision(null);
    forceRender((n) => n + 1);
  }, [pendingDecision]);

  const clearChecks = useCallback(() => setCheckedIds(new Set()), []);

  return (
    <div className="ap-shell">
      <div className="ap-content">
        {/* Page header */}
        <header className="ap-page-header">
          <div className="ap-page-header__inner">
            <div className="ap-page-header__eyebrow">
              Customer Acquisition Engine · Vertical AI for Local Commerce
            </div>
            <h1 className="ap-page-header__title">Applicants</h1>
            <p className="ap-page-header__sub">
              Triage creators applying to your campaigns. ConversionOracle™
              ranks by predicted walk-ins against your Williamsburg Coffee+
              beachhead baseline.
            </p>
          </div>
        </header>

        {/* Filter row */}
        <div className="ap-filters">
          <div className="ap-filters__inner">
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
                className={`ap-chip${selectedStatuses.includes(s) ? " ap-chip--active" : ""}`}
                onClick={() => toggleStatus(s)}
                type="button"
              >
                {STATUS_LABELS[s]}
              </button>
            ))}

            <div className="ap-filters__sep" />

            <span className="ap-filters__group-label">Tier</span>
            {ALL_TIERS.map((t) => (
              <button
                key={t}
                className={`ap-chip ap-chip--tier tier-pill--${t}${selectedTiers.includes(t) ? " ap-chip--active" : ""}`}
                onClick={() => toggleTier(t)}
                title={TIER_FULL_LABEL[t]}
                type="button"
              >
                {TIER_DISPLAY[t]}
              </button>
            ))}

            <div className="ap-filters__sep" />

            <label className="ap-match-filter">
              <span className="ap-match-filter__label">Min match</span>
              <input
                type="range"
                min={0}
                max={95}
                step={5}
                value={minMatch}
                onChange={(e) => setMinMatch(Number(e.target.value))}
                className="ap-match-filter__input"
                aria-label="Minimum ConversionOracle match score"
              />
              <span className="ap-match-filter__value">{minMatch}</span>
            </label>

            <select
              className="ap-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sort applicants"
            >
              <option value="match_desc">Match High → Low</option>
              <option value="score_desc">Score High → Low</option>
              <option value="recent">Most Recent</option>
            </select>

            <input
              type="search"
              className="ap-search"
              placeholder="Search creator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search by creator name or handle"
            />

            <div className="ap-filters__count">
              <strong>{total}</strong>
              {rawTotal > total ? (
                <span className="ap-filters__count-muted"> / {rawTotal}</span>
              ) : null}{" "}
              result{total !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Split-pane */}
        <div className="ap-split">
          {/* Left: list */}
          <aside className="ap-list" aria-label="Applicants list">
            {apps.length === 0 ? (
              <div className="ap-empty">
                <div className="ap-empty__title">No match.</div>
                <div className="ap-empty__sub">
                  Adjust filters — or widen your tier range to pull in Seed /
                  Explorer creators.
                </div>
              </div>
            ) : (
              apps.map((app) => (
                <ApplicantRow
                  key={app.id}
                  app={app}
                  selected={activeApp?.id === app.id}
                  checked={checkedIds.has(app.id)}
                  onSelect={() => setSelectedId(app.id)}
                  onToggleCheck={(c) => handleToggleCheck(app.id, c)}
                />
              ))
            )}
          </aside>

          {/* Right: detail panel */}
          <section className="ap-detail-wrap" aria-label="Applicant detail">
            <DetailPanel app={activeApp} onDecide={handleDecide} />
          </section>
        </div>
      </div>

      {/* Batch action bar */}
      <div
        className={`ap-batch-bar${checkedIds.size > 0 ? " ap-batch-bar--visible" : ""}`}
      >
        <span className="ap-batch-bar__count">
          <strong>{checkedIds.size}</strong> selected
        </span>
        <div className="ap-batch-bar__sep" />
        <button
          className="ap-batch-btn ap-batch-btn--accept"
          onClick={() => handleBulkTrigger("accept")}
        >
          Approve {checkedIds.size}
        </button>
        <button
          className="ap-batch-btn ap-batch-btn--waitlist"
          onClick={() => handleBulkTrigger("shortlist")}
        >
          Waitlist {checkedIds.size}
        </button>
        <button
          className="ap-batch-btn ap-batch-btn--reject"
          onClick={() => handleBulkTrigger("decline")}
        >
          Reject {checkedIds.size}
        </button>
        <button
          className="ap-batch-bar__clear"
          onClick={clearChecks}
          aria-label="Clear selection"
        >
          ×
        </button>
      </div>

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
