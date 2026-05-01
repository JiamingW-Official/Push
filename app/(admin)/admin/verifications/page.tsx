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
  size = 36,
}: {
  initials: string;
  color?: string; // kept for call-site compat; ignored — use CSS token
  size?: number;
}) {
  return (
    <div className="vq-avatar" style={{ width: size, height: size }}>
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
    <div style={{ display: "flex", gap: 4 }}>
      {checklist.map((item) => {
        const statusClass =
          item.status === "complete"
            ? "complete"
            : item.status === "pending"
              ? "pending"
              : "failed";
        return (
          <span key={item.stage} className={`vq-stage-badge ${statusClass}`}>
            {ABBR[item.stage]}
          </span>
        );
      })}
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
  const colors: Record<string, { bg: string; color: string }> = {
    approved: { bg: "rgba(0,133,255,0.08)", color: "var(--accent-blue)" },
    rejected: { bg: "rgba(193,18,31,0.08)", color: "var(--brand-red)" },
    more_info: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
  };
  const c = colors[status] ?? { bg: "var(--surface-3)", color: "var(--ink-4)" };
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "var(--font-body)",
        background: c.bg,
        color: c.color,
      }}
    >
      {labels[status]}
    </span>
  );
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

  const sectionHead: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    fontFamily: "var(--font-body)",
    color: "var(--ink-4)",
    textTransform: "uppercase",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1px solid var(--hairline)",
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 100,
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(480px, 95vw)",
          height: "100vh",
          background: "var(--surface-2)",
          borderLeft: "1px solid var(--hairline)",
          boxShadow: "var(--shadow-3)",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        role="dialog"
        aria-label="Verification detail"
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "20px 24px",
            borderBottom: "1px solid var(--hairline)",
            flexShrink: 0,
          }}
        >
          <Avatar
            initials={v.applicant_initials}
            color={v.avatar_color}
            size={40}
          />
          <div
            style={{
              flex: 1,
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            {v.applicant_display}
          </div>
          {v.status !== "pending" && <StatusBadge status={v.status} />}
          <button
            style={{
              width: 32,
              height: 32,
              border: "1px solid var(--hairline)",
              borderRadius: 6,
              background: "var(--surface-3)",
              cursor: "pointer",
              fontSize: 14,
              color: "var(--ink-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onClose}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Risk flags */}
          {v.risk_flags.length > 0 && (
            <div>
              <div style={sectionHead}>Risk Flags</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {v.risk_flags.map((f) => (
                  <span
                    key={f}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "var(--font-body)",
                      background: "rgba(193,18,31,0.08)",
                      color: "var(--brand-red)",
                      textTransform: "capitalize",
                    }}
                  >
                    {formatRiskFlag(f)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Identity documents */}
          <div>
            <div style={sectionHead}>Identity Documents</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              {["Government ID", "Selfie with ID"].map((label) => (
                <div
                  key={label}
                  style={{
                    border: "1px solid var(--hairline)",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-4)",
                      padding: "6px 10px",
                      background: "var(--surface-3)",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      height: 64,
                      background: "var(--surface-3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-4)",
                    }}
                  >
                    Redacted
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {v.checklist.map((item) => (
                <div
                  key={item.stage}
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-3)",
                  }}
                >
                  <strong>{CHECKLIST_LABELS[item.stage]}:</strong>{" "}
                  {item.status.replace("_", " ")}
                </div>
              ))}
            </div>
          </div>

          {/* Social accounts */}
          <div>
            <div style={sectionHead}>Social Verification</div>
            {v.social_accounts.length === 0 ? (
              <p
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-4)",
                }}
              >
                No social accounts submitted.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {v.social_accounts.map((s) => (
                  <div
                    key={`${s.platform}-${s.handle}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      background: "var(--surface-3)",
                      borderRadius: 6,
                      border: "1px solid var(--hairline)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: "var(--font-body)",
                        color: "var(--ink-3)",
                        letterSpacing: "0.06em",
                        width: 32,
                        flexShrink: 0,
                      }}
                    >
                      {PLATFORM_LABELS[s.platform] ?? s.platform}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontFamily: "var(--font-body)",
                        color: "var(--ink)",
                        fontWeight: 600,
                      }}
                    >
                      {s.handle}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-body)",
                        color: "var(--ink-4)",
                      }}
                    >
                      {formatSocialCount(s.followers)}
                      {s.engagement_rate != null
                        ? ` · ${s.engagement_rate.toFixed(1)}%`
                        : ""}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--font-body)",
                        color: s.verified
                          ? "var(--accent-blue)"
                          : "var(--ink-4)",
                      }}
                    >
                      {s.verified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <div style={sectionHead}>Address Verification</div>
            <div
              style={{
                height: 64,
                background: "var(--surface-3)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--brand-red)",
                  boxShadow: "0 0 0 4px rgba(193,18,31,0.2)",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  color: "var(--ink)",
                  fontWeight: 600,
                }}
              >
                {v.address_city}, {v.address_state}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  color: v.address_verified
                    ? "var(--accent-blue)"
                    : "var(--ink-4)",
                }}
              >
                {v.address_verified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>

          {/* SLA */}
          <div>
            <div style={sectionHead}>SLA</div>
            <span
              style={{
                fontSize: 13,
                fontFamily: "var(--font-body)",
                color: v.hours_open > 24 ? "var(--brand-red)" : "var(--ink-3)",
                fontWeight: v.hours_open > 24 ? 700 : 400,
              }}
            >
              Opened {formatHoursAgo(v.hours_open)}
              {v.hours_open > 24 ? " — SLA BREACH" : ""}
            </span>
          </div>

          {/* Internal note */}
          <div>
            <div style={sectionHead}>Internal Note</div>
            <textarea
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                background: "var(--surface)",
                color: "var(--ink)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
              rows={3}
              placeholder="Add internal notes visible only to admin team..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Decision history */}
          <div>
            <div style={sectionHead}>Decision History</div>
            {v.decision_history.length === 0 ? (
              <p
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-4)",
                }}
              >
                No decisions recorded yet.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {v.decision_history.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      padding: "10px 12px",
                      background: "var(--surface-3)",
                      borderRadius: 6,
                      border: "1px solid var(--hairline)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginBottom: entry.note ? 6 : 0,
                        fontSize: 11,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--ink)",
                          textTransform: "capitalize",
                        }}
                      >
                        {entry.action.replace("_", " ")}
                      </span>
                      <span style={{ color: "var(--ink-4)" }}>
                        by {entry.reviewer}
                      </span>
                      <span
                        style={{ color: "var(--ink-4)", marginLeft: "auto" }}
                      >
                        {new Date(entry.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {entry.note && (
                      <p
                        style={{
                          fontSize: 12,
                          fontFamily: "var(--font-body)",
                          color: "var(--ink-3)",
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {entry.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer — decision buttons */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--hairline)",
            flexShrink: 0,
          }}
        >
          {v.status === "pending" || v.status === "more_info" ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn-primary click-shift"
                style={{ flex: 1 }}
                disabled={submitting}
                onClick={() => handleDecision("approved")}
              >
                Approve
              </button>
              <button
                className="btn-ghost click-shift"
                style={{ flex: 1 }}
                disabled={submitting}
                onClick={() => handleDecision("more_info")}
              >
                Request More
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  border: "1px solid rgba(193,18,31,0.25)",
                  borderRadius: 8,
                  background: "rgba(193,18,31,0.06)",
                  color: "var(--brand-red)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
                disabled={submitting}
                onClick={() => handleDecision("rejected")}
                className="click-shift"
              >
                Reject
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <StatusBadge status={v.status} />
            </div>
          )}
        </div>
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
      style={{
        display: "grid",
        gridTemplateColumns: "200px 160px 1fr 80px 200px",
        gap: 16,
        alignItems: "center",
        padding: "12px 24px",
        borderBottom: "1px solid var(--hairline)",
        background: isSLABreach
          ? "rgba(193,18,31,0.02)"
          : isHighRisk
            ? "rgba(193,18,31,0.01)"
            : "transparent",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onClick={() => onOpen(v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(v)}
      aria-label={`Open verification for ${v.applicant_display}`}
    >
      {/* Applicant */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar initials={v.applicant_initials} color={v.avatar_color} />
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "var(--font-body)",
              color: "var(--ink)",
              marginBottom: 2,
            }}
          >
            {v.applicant_display}
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "var(--font-body)",
              color: isSLABreach ? "var(--brand-red)" : "var(--ink-4)",
              fontWeight: isSLABreach ? 700 : 400,
            }}
          >
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
      <span
        style={{
          fontSize: 12,
          fontFamily: "var(--font-body)",
          color: isSLABreach ? "var(--brand-red)" : "var(--ink-4)",
          fontWeight: isSLABreach ? 700 : 400,
        }}
      >
        {formatHoursAgo(v.hours_open)}
      </span>

      {/* Actions */}
      <div
        style={{ display: "flex", gap: 6 }}
        onClick={(e) => e.stopPropagation()}
      >
        {v.status === "pending" || v.status === "more_info" ? (
          <>
            <button
              style={{
                padding: "5px 10px",
                border: "1px solid rgba(0,133,255,0.2)",
                borderRadius: 6,
                background: "rgba(0,133,255,0.08)",
                color: "var(--accent-blue)",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={() => onQuickDecision(v.id, "approved")}
            >
              Approve
            </button>
            <button
              style={{
                padding: "5px 10px",
                border: "1px solid var(--hairline)",
                borderRadius: 6,
                background: "var(--surface-3)",
                color: "var(--ink-3)",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={() => onOpen(v)}
            >
              Review
            </button>
            <button
              style={{
                padding: "5px 10px",
                border: "1px solid rgba(193,18,31,0.2)",
                borderRadius: 6,
                background: "rgba(193,18,31,0.06)",
                color: "var(--brand-red)",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
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

  const chipStyle = (
    active: boolean,
    danger?: boolean,
  ): React.CSSProperties => ({
    padding: "6px 14px",
    border: "1px solid var(--hairline)",
    borderRadius: 6,
    background: active
      ? danger
        ? "rgba(193,18,31,0.1)"
        : "var(--ink)"
      : "var(--surface-3)",
    color: active
      ? danger
        ? "var(--brand-red)"
        : "var(--snow)"
      : "var(--ink-3)",
    fontFamily: "var(--font-body)",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.15s",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        paddingBottom: 64,
      }}
    >
      {/* Page header */}
      <div style={{ padding: "40px 40px 32px" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          ADMIN · PUSH INTERNAL · KYC REVIEW QUEUE
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px,4vw,56px)",
            fontWeight: 800,
            color: "var(--ink)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          Identity verifications
        </h1>
        <p
          style={{
            fontSize: 14,
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            marginBottom: 32,
            maxWidth: 520,
          }}
        >
          Review and action incoming creator KYC submissions. High-risk and
          overdue cases are surfaced first.
        </p>

        {/* KPI strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {[
            {
              label: "Pending",
              value: stats.pending,
              urgent: stats.pending > 0,
            },
            {
              label: "SLA breach",
              value: stats.sla_breach,
              urgent: stats.sla_breach > 0,
            },
            {
              label: "Avg decision",
              value: `${stats.avg_hours}h`,
              urgent: false,
            },
          ].map(({ label, value, urgent }) => (
            <div
              key={label}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-4)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px,2.5vw,36px)",
                  fontWeight: 800,
                  color: urgent ? "var(--brand-red)" : "var(--ink)",
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          padding: "12px 40px",
          background: "var(--surface-2)",
          borderTop: "1px solid var(--hairline)",
          borderBottom: "1px solid var(--hairline)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          Stage
        </span>
        {STAGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            style={chipStyle(filters.stage === opt.value)}
            onClick={() => setFilter("stage", opt.value)}
          >
            {opt.label}
          </button>
        ))}

        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--hairline)",
            margin: "0 8px",
          }}
        />

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          Status
        </span>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            style={chipStyle(filters.status === opt.value)}
            onClick={() => setFilter("status", opt.value)}
          >
            {opt.label}
          </button>
        ))}

        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--hairline)",
            margin: "0 8px",
          }}
        />

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          Risk
        </span>
        {RISK_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            style={chipStyle(
              filters.risk === opt.value,
              opt.value === "high" && filters.risk === "high",
            )}
            onClick={() => setFilter("risk", opt.value)}
          >
            {opt.label}
          </button>
        ))}

        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
          }}
        >
          {verifications.length} record{verifications.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Queue */}
      <main style={{ padding: "0 40px 40px" }}>
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 160px 1fr 80px 200px",
            gap: 16,
            padding: "10px 24px",
            borderBottom: "2px solid var(--hairline)",
            marginTop: 8,
          }}
        >
          {["Applicant", "Checklist", "Risk flags", "Opened", "Actions"].map(
            (h, i) => (
              <span
                key={h}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-4)",
                  textTransform: "uppercase",
                  textAlign: i === 4 ? "right" : "left",
                }}
              >
                {h}
              </span>
            ),
          )}
        </div>

        {/* Rows */}
        {loading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 64,
                  background: "var(--surface-3)",
                  borderRadius: 6,
                  margin: "8px 24px",
                  opacity: 1 - i * 0.1,
                  animation: "pulse 1.5s ease infinite",
                }}
              />
            ))}
          </>
        ) : verifications.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              No verifications found.
            </div>
            <p
              style={{
                fontSize: 13,
                fontFamily: "var(--font-body)",
                color: "var(--ink-4)",
              }}
            >
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
