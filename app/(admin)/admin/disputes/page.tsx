"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import "./disputes.css";
import {
  MOCK_DISPUTES,
  getDisputeStats,
  Dispute,
  DisputeStatus,
  DisputeSeverity,
} from "@/lib/disputes/mock-admin-disputes";

/* ── Helpers ─────────────────────────────────────────────────── */
function formatAge(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function isSlaBreached(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

const STATUS_LABEL: Record<DisputeStatus, string> = {
  open: "Open",
  under_review: "Under Review",
  awaiting_evidence: "Awaiting Evidence",
  escalated: "Escalated",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

const CATEGORY_LABELS: Record<string, string> = {
  food_beverage: "Food & Bev",
  lifestyle: "Lifestyle",
  nightlife: "Nightlife",
  retail: "Retail",
  media: "Media",
  arts: "Arts",
};

/* ── Badge helpers ───────────────────────────────────────────── */
const badgeBase: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  borderRadius: 4,
  padding: "2px 8px",
  display: "inline-block",
  whiteSpace: "nowrap",
};

function statusChip(status: DisputeStatus): { bg: string; color: string } {
  switch (status) {
    case "escalated":
      return { bg: "rgba(193,18,31,0.10)", color: "var(--brand-red)" };
    case "open":
      return { bg: "var(--panel-butter)", color: "var(--ink-3)" };
    case "under_review":
      return { bg: "var(--accent-blue-tint)", color: "var(--accent-blue)" };
    case "awaiting_evidence":
      return { bg: "var(--champagne-tint)", color: "var(--champagne-deep)" };
    case "resolved":
      return { bg: "var(--surface-3)", color: "var(--ink-4)" };
    case "dismissed":
      return { bg: "var(--surface-3)", color: "var(--ink-4)" };
  }
}

function severityChip(sev: string): { bg: string; color: string } {
  switch (sev) {
    case "critical":
      return { bg: "rgba(193,18,31,0.12)", color: "var(--brand-red)" };
    case "high":
      return { bg: "rgba(193,18,31,0.07)", color: "var(--brand-red)" };
    case "medium":
      return { bg: "var(--panel-butter)", color: "var(--ink-3)" };
    default:
      return { bg: "var(--surface-3)", color: "var(--ink-4)" };
  }
}

/* ── Filter state ────────────────────────────────────────────── */
type Filters = {
  search: string;
  status: string;
  severity: string;
  minAmount: string;
  maxAmount: string;
  category: string;
};

const DEFAULT_FILTERS: Filters = {
  search: "",
  status: "",
  severity: "",
  minAmount: "",
  maxAmount: "",
  category: "",
};

/* ── Dispute row ─────────────────────────────────────────────── */
function DisputeRow({ dispute: d }: { dispute: Dispute }) {
  const breached = isSlaBreached(d.sla_deadline);
  const isActive = !["resolved", "dismissed"].includes(d.status);
  const sc = statusChip(d.status);
  const sev = severityChip(d.severity);
  const isEscalated = d.status === "escalated";

  return (
    <Link
      href={`/admin/disputes/${d.id}`}
      className="click-shift"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 24,
        padding: "20px 24px",
        background: isEscalated ? "rgba(193,18,31,0.04)" : "var(--surface-2)",
        border: `1px solid ${isEscalated ? "rgba(193,18,31,0.25)" : "var(--hairline)"}`,
        borderRadius: 10,
        textDecoration: "none",
        color: "inherit",
        alignItems: "start",
      }}
    >
      {/* Left: details */}
      <div style={{ minWidth: 0 }}>
        {/* Reason + ID row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink-5)",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            {d.id}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            {d.reason}
          </span>
        </div>

        {/* Parties */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 8,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.creator_avatar}
              alt={d.creator_name}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink)",
                fontWeight: 600,
              }}
            >
              {d.creator_name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-5)",
              }}
            >
              {d.creator_handle}
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink-5)",
            }}
          >
            vs
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink)",
              fontWeight: 600,
            }}
          >
            {d.merchant_business}
          </span>
        </div>

        {/* Campaign */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-5)",
          }}
        >
          {d.campaign_title}
        </div>
      </div>

      {/* Right: amount + badges + age */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 800,
            color: "var(--ink)",
            lineHeight: 1,
          }}
        >
          ${d.amount}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            justifyContent: "flex-end",
          }}
        >
          <span style={{ ...badgeBase, background: sc.bg, color: sc.color }}>
            {STATUS_LABEL[d.status]}
          </span>
          <span
            style={{
              ...badgeBase,
              background: sev.bg,
              color: sev.color,
              textTransform: "capitalize",
            }}
          >
            {d.severity}
          </span>
          {isActive && breached && (
            <span
              style={{
                ...badgeBase,
                background: "rgba(193,18,31,0.10)",
                color: "var(--brand-red)",
              }}
            >
              SLA Breached
            </span>
          )}
          {d.thread_locked && (
            <span
              style={{
                ...badgeBase,
                background: "var(--surface-3)",
                color: "var(--ink-4)",
              }}
            >
              Locked
            </span>
          )}
          {d.escalated_to_legal && (
            <span
              style={{
                ...badgeBase,
                background: "rgba(193,18,31,0.10)",
                color: "var(--brand-red)",
              }}
            >
              Legal
            </span>
          )}
        </div>

        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink-5)",
          }}
        >
          {formatAge(d.opened_at)}
        </div>
      </div>
    </Link>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function AdminDisputesPage() {
  const stats = getDisputeStats();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  const applyFilters = useCallback(() => {
    const SEVERITY_ORDER: Record<string, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    const STATUS_ORDER: Record<string, number> = {
      escalated: 0,
      open: 1,
      under_review: 2,
      awaiting_evidence: 3,
      resolved: 4,
      dismissed: 5,
    };

    let list = [...MOCK_DISPUTES];
    if (filters.status) list = list.filter((d) => d.status === filters.status);
    if (filters.severity)
      list = list.filter((d) => d.severity === filters.severity);
    if (filters.minAmount)
      list = list.filter((d) => d.amount >= parseFloat(filters.minAmount));
    if (filters.maxAmount)
      list = list.filter((d) => d.amount <= parseFloat(filters.maxAmount));
    if (filters.category)
      list = list.filter((d) => d.campaign_category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (d) =>
          d.creator_name.toLowerCase().includes(q) ||
          d.merchant_business.toLowerCase().includes(q) ||
          d.campaign_title.toLowerCase().includes(q) ||
          d.reason.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      const sd = (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);
      if (sd !== 0) return sd;
      const sevd =
        (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9);
      if (sevd !== 0) return sevd;
      return new Date(b.opened_at).getTime() - new Date(a.opened_at).getTime();
    });
    setDisputes(list);
  }, [filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  function setFilter(key: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink)",
    background: "var(--surface-2)",
    border: "1px solid var(--hairline)",
    borderRadius: 8,
    padding: "8px 12px",
    outline: "none",
    height: 40,
  };

  const criticalCount = disputes.filter(
    (d) =>
      d.severity === "critical" &&
      d.status !== "resolved" &&
      d.status !== "dismissed",
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        paddingBottom: 64,
      }}
    >
      {/* Critical alert bar */}
      {criticalCount > 0 && (
        <div className="adm-alert-bar">
          <span className="adm-alert-bar__label">Critical</span>
          <span>
            {criticalCount} critical dispute{criticalCount !== 1 ? "s" : ""}{" "}
            require immediate attention
          </span>
        </div>
      )}

      {/* Page header */}
      <div style={{ padding: "40px 40px 0" }}>
        <div className="adm-page-eyebrow">PUSH INTERNAL</div>
        <h1 className="adm-page-title" style={{ marginBottom: 32 }}>
          Disputes
        </h1>

        {/* KPI row */}
        <div className="adm-kpi-grid" style={{ marginBottom: 40 }}>
          {[
            {
              label: "Open",
              value: stats.openCount,
              alert: stats.openCount > 0,
            },
            {
              label: "Avg Resolution",
              value: `${stats.avgResolutionHours}h`,
              alert: false,
            },
            {
              label: "SLA Breached",
              value: stats.slaBreachCount,
              alert: stats.slaBreachCount > 0,
            },
            {
              label: "Resolved Total",
              value: stats.resolvedCount,
              alert: false,
            },
          ].map(({ label, value, alert }) => (
            <div
              key={label}
              className={`adm-kpi-card${alert ? " adm-kpi-card--alert" : ""}`}
            >
              <div className="adm-kpi-card__eyebrow">{label}</div>
              <div className="adm-kpi-card__value">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: "0 40px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Filter bar */}
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: "16px 20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div className="adm-search-wrap" style={{ minWidth: 220 }}>
            <svg
              className="adm-search-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="6.5" cy="6.5" r="4.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" />
            </svg>
            <input
              type="search"
              placeholder="Search creator, merchant, campaign…"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
            />
          </div>

          <select
            style={inputStyle}
            value={filters.status}
            onChange={(e) => setFilter("status", e.target.value)}
          >
            <option value="">All Statuses</option>
            {(Object.entries(STATUS_LABEL) as [DisputeStatus, string][]).map(
              ([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ),
            )}
          </select>

          <select
            style={inputStyle}
            value={filters.severity}
            onChange={(e) => setFilter("severity", e.target.value)}
          >
            <option value="">All Severity</option>
            {(["critical", "high", "medium", "low"] as DisputeSeverity[]).map(
              (s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ),
            )}
          </select>

          <select
            style={inputStyle}
            value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-5)",
              }}
            >
              $
            </span>
            <input
              type="number"
              style={{ ...inputStyle, width: 72 }}
              placeholder="Min"
              value={filters.minAmount}
              onChange={(e) => setFilter("minAmount", e.target.value)}
              min={0}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-5)",
              }}
            >
              —
            </span>
            <input
              type="number"
              style={{ ...inputStyle, width: 72 }}
              placeholder="Max"
              value={filters.maxAmount}
              onChange={(e) => setFilter("maxAmount", e.target.value)}
              min={0}
            />
          </div>

          {hasActiveFilters && (
            <button className="btn-ghost click-shift" onClick={clearFilters}>
              Clear
            </button>
          )}

          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-5)",
            }}
          >
            {disputes.length} dispute{disputes.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Disputes list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {disputes.length === 0 ? (
            <div
              style={{
                padding: "56px 0",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                No disputes match filters
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--ink-5)",
                }}
              >
                Try adjusting the status or severity filter.
              </div>
            </div>
          ) : (
            disputes.map((d) => <DisputeRow key={d.id} dispute={d} />)
          )}
        </div>
      </div>
    </div>
  );
}
