"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MOCK_VERIFICATIONS,
  getVerificationStats,
  type KYCVerification,
  type VerificationStage,
  type VerificationStatus,
  type RiskFlag,
} from "@/lib/admin/mock-verifications";
import "./verifications.css";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatHoursAgo(h: number): string {
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ${h % 24}h ago`;
}

function formatRiskFlag(flag: RiskFlag): string {
  return flag.replace(/_/g, " ");
}

function formatSocialCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "IG",
  tiktok: "TK",
  red: "RED",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Avatar({
  initials,
  color,
  size = 36,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      className="vq-avatar"
      style={{
        background: color,
        width: size,
        height: size,
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  );
}

function ChecklistCell({
  checklist,
}: {
  checklist: KYCVerification["checklist"];
}) {
  const ABBR: Record<string, string> = {
    identity: "ID",
    social: "SOC",
    address: "ADR",
  };
  return (
    <div className="vq-checklist">
      {checklist.map((item) => (
        <span key={item.stage} className={`vq-check ${item.status}`}>
          <span className="vq-check-dot" />
          {ABBR[item.stage]}
        </span>
      ))}
    </div>
  );
}

function RiskFlags({ flags }: { flags: RiskFlag[] }) {
  if (flags.length === 0) {
    return <span className="vq-flag-none">—</span>;
  }
  return (
    <div className="vq-flags">
      {flags.map((f) => (
        <span key={f} className="vq-flag">
          {formatRiskFlag(f)}
        </span>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: VerificationStatus }) {
  const labels: Record<VerificationStatus, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    more_info: "More Info",
  };
  if (status === "pending") return null;
  return <span className={`vq-status-badge ${status}`}>{labels[status]}</span>;
}

// ---------------------------------------------------------------------------
// Detail Panel
// ---------------------------------------------------------------------------

function DetailPanel({
  v,
  onClose,
  onDecision,
}: {
  v: KYCVerification;
  onClose: () => void;
  onDecision: (id: string, action: VerificationStatus, note: string) => void;
}) {
  const [note, setNote] = useState(v.internal_note ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function handleDecision(action: VerificationStatus) {
    setSubmitting(true);
    try {
      await fetch(`/api/admin/verifications/${v.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });
      onDecision(v.id, action, note);
    } finally {
      setSubmitting(false);
    }
  }

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const CHECKLIST_LABELS: Record<string, string> = {
    identity: "Identity",
    social: "Social",
    address: "Address",
  };

  return (
    <>
      {/* Overlay */}
      <div className="vq-overlay" onClick={onClose} />

      {/* Panel */}
      <aside
        className="vq-panel"
        role="dialog"
        aria-label="Verification detail"
      >
        {/* Header */}
        <div className="vq-panel-header">
          <Avatar
            initials={v.applicant_initials}
            color={v.avatar_color}
            size={40}
          />
          <div className="vq-panel-title">{v.applicant_display}</div>
          {v.status !== "pending" && <StatusBadge status={v.status} />}
          <button
            className="vq-panel-close"
            onClick={onClose}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="vq-panel-body">
          {/* Risk flags (if any) */}
          {v.risk_flags.length > 0 && (
            <div className="vq-section">
              <div className="vq-section-head">Risk Flags</div>
              <div className="vq-section-body">
                <div className="vq-flags" style={{ gap: "var(--space-1)" }}>
                  {v.risk_flags.map((f) => (
                    <span key={f} className="vq-flag">
                      {formatRiskFlag(f)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Identity — ID card preview + selfie */}
          <div className="vq-section">
            <div className="vq-section-head">Identity Documents</div>
            <div className="vq-section-body">
              <div className="vq-id-compare">
                <div className="vq-id-card">
                  <div className="vq-id-card-label">Government ID</div>
                  <div className="vq-id-placeholder">
                    <span className="vq-id-placeholder-text">ID Redacted</span>
                  </div>
                </div>
                <div className="vq-id-card">
                  <div className="vq-id-card-label">Selfie with ID</div>
                  <div className="vq-id-placeholder">
                    <span className="vq-id-placeholder-text">
                      Photo Redacted
                    </span>
                  </div>
                </div>
              </div>

              {/* Checklist status for identity */}
              <div
                style={{
                  marginTop: "var(--space-2)",
                  display: "flex",
                  gap: "var(--space-3)",
                }}
              >
                {v.checklist.map((item) => (
                  <div
                    key={item.stage}
                    className={`vq-check ${item.status}`}
                    style={{ fontSize: "var(--text-caption)" }}
                  >
                    <span className="vq-check-dot" />
                    {CHECKLIST_LABELS[item.stage]}:{" "}
                    {item.status.replace("_", " ")}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social accounts */}
          <div className="vq-section">
            <div className="vq-section-head">Social Verification</div>
            <div className="vq-section-body">
              {v.social_accounts.length === 0 ? (
                <p className="vq-history-empty">
                  No social accounts submitted.
                </p>
              ) : (
                <div className="vq-social-list">
                  {v.social_accounts.map((s) => (
                    <div
                      key={`${s.platform}-${s.handle}`}
                      className="vq-social-row"
                    >
                      <span className="vq-social-platform">
                        {PLATFORM_LABELS[s.platform] ?? s.platform}
                      </span>
                      <span className="vq-social-handle">{s.handle}</span>
                      <div className="vq-social-meta">
                        <span>{formatSocialCount(s.followers)} followers</span>
                        {s.engagement_rate != null && (
                          <span>{s.engagement_rate.toFixed(1)}% eng.</span>
                        )}
                      </div>
                      <span
                        className={`vq-social-verified ${s.verified ? "yes" : "no"}`}
                      >
                        {s.verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="vq-section">
            <div className="vq-section-head">Address Verification</div>
            <div className="vq-address-map">
              <div className="vq-map-pin" />
            </div>
            <div className="vq-address-info">
              <span className="vq-address-text">
                {v.address_city}, {v.address_state}
              </span>
              <span
                className={`vq-social-verified ${v.address_verified ? "yes" : "no"}`}
              >
                {v.address_verified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>

          {/* SLA info */}
          <div className="vq-section">
            <div className="vq-section-head">SLA</div>
            <div className="vq-section-body">
              <span className={`vq-sla ${v.hours_open > 24 ? "overdue" : ""}`}>
                Opened {formatHoursAgo(v.hours_open)}
                {v.hours_open > 24 ? " — SLA BREACH" : ""}
              </span>
            </div>
          </div>

          {/* Internal note */}
          <div className="vq-section">
            <div className="vq-section-head">Internal Note</div>
            <div className="vq-section-body">
              <div className="vq-panel-note-row">
                <textarea
                  className="vq-note-area"
                  placeholder="Add internal notes visible only to admin team..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Decision history */}
          <div className="vq-section">
            <div className="vq-section-head">Decision History</div>
            <div className="vq-section-body">
              {v.decision_history.length === 0 ? (
                <p className="vq-history-empty">No decisions recorded yet.</p>
              ) : (
                <div className="vq-history">
                  {v.decision_history.map((entry) => (
                    <div
                      key={entry.id}
                      className={`vq-history-entry ${entry.action}`}
                    >
                      <div className="vq-history-meta">
                        <span className="vq-history-action">
                          {entry.action.replace("_", " ")}
                        </span>
                        <span>by {entry.reviewer}</span>
                        <span>
                          {new Date(entry.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="vq-history-note">{entry.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer — decision buttons */}
        {v.status === "pending" || v.status === "more_info" ? (
          <div className="vq-panel-footer">
            <button
              className="vq-btn vq-btn-approve"
              disabled={submitting}
              onClick={() => handleDecision("approved")}
            >
              Approve
            </button>
            <button
              className="vq-btn vq-btn-more"
              disabled={submitting}
              onClick={() => handleDecision("more_info")}
            >
              Request More
            </button>
            <button
              className="vq-btn vq-btn-reject"
              disabled={submitting}
              onClick={() => handleDecision("rejected")}
            >
              Reject
            </button>
          </div>
        ) : (
          <div className="vq-panel-footer">
            <StatusBadge status={v.status} />
          </div>
        )}
      </aside>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Queue Row
// ---------------------------------------------------------------------------

function QueueRow({
  v,
  onOpen,
  onQuickDecision,
}: {
  v: KYCVerification;
  onOpen: (v: KYCVerification) => void;
  onQuickDecision: (id: string, action: VerificationStatus) => void;
}) {
  const isSLABreach = v.hours_open > 24;
  const isHighRisk = v.risk_level === "high";

  return (
    <div
      className={`vq-row ${isSLABreach ? "sla-breach" : ""} ${isHighRisk ? "high-risk" : ""}`}
      onClick={() => onOpen(v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(v)}
      aria-label={`Open verification for ${v.applicant_display}`}
    >
      {/* Applicant */}
      <div className="vq-applicant">
        <Avatar initials={v.applicant_initials} color={v.avatar_color} />
        <div className="vq-applicant-info">
          <div className="vq-applicant-name">{v.applicant_display}</div>
          <div className={`vq-applicant-time ${isSLABreach ? "overdue" : ""}`}>
            {isSLABreach ? "OVERDUE — " : ""}
            {formatHoursAgo(v.hours_open)}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <ChecklistCell checklist={v.checklist} />

      {/* Risk flags */}
      <RiskFlags flags={v.risk_flags} />

      {/* SLA */}
      <span className={`vq-sla ${isSLABreach ? "overdue" : ""}`}>
        {formatHoursAgo(v.hours_open)}
      </span>

      {/* Actions */}
      <div
        className="vq-actions"
        onClick={(e) => e.stopPropagation()} // prevent row click on button interactions
      >
        {v.status === "pending" || v.status === "more_info" ? (
          <>
            <button
              className="vq-btn vq-btn-approve"
              onClick={() => onQuickDecision(v.id, "approved")}
            >
              Approve
            </button>
            <button className="vq-btn vq-btn-more" onClick={() => onOpen(v)}>
              Review
            </button>
            <button
              className="vq-btn vq-btn-reject"
              onClick={() => onQuickDecision(v.id, "rejected")}
            >
              Reject
            </button>
          </>
        ) : (
          <StatusBadge status={v.status} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type Filters = {
  stage: VerificationStage | "all";
  status: VerificationStatus | "all";
  risk: "low" | "medium" | "high" | "all";
};

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<KYCVerification[]>([]);
  const [filters, setFilters] = useState<Filters>({
    stage: "all",
    status: "all",
    risk: "all",
  });
  const [selected, setSelected] = useState<KYCVerification | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams();
        if (filters.stage !== "all") params.set("stage", filters.stage);
        if (filters.status !== "all") params.set("status", filters.status);
        if (filters.risk !== "all") params.set("risk", filters.risk);

        const res = await fetch(`/api/admin/verifications?${params}`);
        const data = await res.json();
        setVerifications(data.verifications ?? []);
      } catch {
        // Fallback to local mock data (handles static export scenarios)
        let results = [...MOCK_VERIFICATIONS];
        if (filters.stage !== "all")
          results = results.filter((v) => v.stage_filter === filters.stage);
        if (filters.status !== "all")
          results = results.filter((v) => v.status === filters.status);
        if (filters.risk !== "all")
          results = results.filter((v) => v.risk_level === filters.risk);
        results.sort((a, b) => {
          const riskOrder = { high: 0, medium: 1, low: 2 };
          const riskDiff = riskOrder[a.risk_level] - riskOrder[b.risk_level];
          if (riskDiff !== 0) return riskDiff;
          return b.hours_open - a.hours_open;
        });
        setVerifications(results);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  const stats = getVerificationStats(MOCK_VERIFICATIONS);

  // Quick decision from row (no note)
  const handleQuickDecision = useCallback(
    async (id: string, action: VerificationStatus) => {
      try {
        await fetch(`/api/admin/verifications/${id}/decision`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, note: "" }),
        });
      } catch {
        // silently continue — mock data
      }
      setVerifications((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: action } : v)),
      );
    },
    [],
  );

  // Decision from panel
  const handlePanelDecision = useCallback(
    (id: string, action: VerificationStatus, note: string) => {
      setVerifications((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                status: action,
                internal_note: note,
                decision_history: [
                  ...v.decision_history,
                  {
                    id: `dec-${Date.now()}`,
                    reviewer: "admin@push.co",
                    action,
                    note,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : v,
        ),
      );
      setSelected(null);
    },
    [],
  );

  function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setLoading(true);
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const STAGE_OPTIONS: Array<{ value: Filters["stage"]; label: string }> = [
    { value: "all", label: "All stages" },
    { value: "identity", label: "Identity" },
    { value: "social", label: "Social" },
    { value: "address", label: "Address" },
  ];

  const STATUS_OPTIONS: Array<{ value: Filters["status"]; label: string }> = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "more_info", label: "More info" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const RISK_OPTIONS: Array<{ value: Filters["risk"]; label: string }> = [
    { value: "all", label: "All risk" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="vq-shell">
      {/* Nav */}
      <nav className="vq-nav">
        <Link href="/" className="vq-nav-logo">
          Push
        </Link>
        <div className="vq-nav-sep" />
        <span className="vq-nav-title">Admin</span>
        <div className="vq-nav-spacer" />
        {stats.pending > 0 && (
          <span className="vq-nav-badge">{stats.pending} pending</span>
        )}
      </nav>

      {/* Hero */}
      <section className="vq-hero">
        <div className="vq-hero-inner">
          <div>
            <p className="vq-hero-eyebrow">KYC Review Queue</p>
            <h1 className="vq-hero-title">
              Identity
              <br />
              verifications.
            </h1>
            <p className="vq-hero-sub">
              Review and action incoming creator KYC submissions. High-risk and
              overdue cases are surfaced first.
            </p>
          </div>
          <div className="vq-hero-stats">
            <div className="vq-hero-stat">
              <div
                className={`vq-hero-stat-num ${stats.pending > 0 ? "urgent" : ""}`}
              >
                {stats.pending}
              </div>
              <div className="vq-hero-stat-label">Pending</div>
            </div>
            <div className="vq-hero-stat">
              <div
                className={`vq-hero-stat-num ${stats.sla_breach > 0 ? "urgent" : ""}`}
              >
                {stats.sla_breach}
              </div>
              <div className="vq-hero-stat-label">SLA breach</div>
            </div>
            <div className="vq-hero-stat">
              <div className="vq-hero-stat-num">{stats.avg_hours}h</div>
              <div className="vq-hero-stat-label">Avg decision</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="vq-filters">
        <div className="vq-filters-inner">
          <span className="vq-filter-label">Stage</span>
          <div className="vq-filter-group">
            {STAGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`vq-chip ${filters.stage === opt.value ? "active" : ""}`}
                onClick={() => setFilter("stage", opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="vq-filter-sep" />

          <span className="vq-filter-label">Status</span>
          <div className="vq-filter-group">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`vq-chip ${filters.status === opt.value ? "active" : ""}`}
                onClick={() => setFilter("status", opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="vq-filter-sep" />

          <span className="vq-filter-label">Risk</span>
          <div className="vq-filter-group">
            {RISK_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`vq-chip ${opt.value !== "all" ? "risk" : ""} ${filters.risk === opt.value ? "active" : ""}`}
                onClick={() => setFilter("risk", opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <span className="vq-count">
            {verifications.length} record{verifications.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Queue */}
      <main className="vq-main">
        <div className="vq-queue">
          {/* Table header */}
          <div className="vq-queue-header">
            <span className="vq-col-label">Applicant</span>
            <span className="vq-col-label">Checklist</span>
            <span className="vq-col-label">Risk flags</span>
            <span className="vq-col-label">Opened</span>
            <span className="vq-col-label right vq-col-actions">Actions</span>
          </div>

          {/* Rows */}
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="vq-skeleton" />
              ))}
            </>
          ) : verifications.length === 0 ? (
            <div className="vq-empty">
              <div className="vq-empty-title">No verifications found.</div>
              <p className="vq-empty-body">
                Adjust filters or check back later.
              </p>
            </div>
          ) : (
            verifications.map((v) => (
              <QueueRow
                key={v.id}
                v={v}
                onOpen={setSelected}
                onQuickDecision={handleQuickDecision}
              />
            ))
          )}
        </div>
      </main>

      {/* Detail panel */}
      {selected && (
        <DetailPanel
          v={selected}
          onClose={() => setSelected(null)}
          onDecision={handlePanelDecision}
        />
      )}
    </div>
  );
}
