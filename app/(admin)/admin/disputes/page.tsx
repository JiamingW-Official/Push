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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Filter state
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AdminDisputesPage() {
  const stats = getDisputeStats();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  // Client-side filter (mirrors API logic for instant UX)
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

  return (
    <div className="adm-shell">
      {/* Nav */}
      <nav className="adm-nav">
        <Link href="/" className="adm-nav__logo">
          Push<span>.</span>
        </Link>
        <div className="adm-nav__sep" />
        <span className="adm-nav__section">Admin</span>
        <div className="adm-nav__spacer" />
        {stats.criticalCount > 0 && (
          <span className="adm-nav__badge">{stats.criticalCount} critical</span>
        )}
      </nav>

      <main className="adm-main">
        {/* Hero */}
        <section className="adm-hero">
          <div className="adm-hero__inner">
            <p className="adm-hero__eyebrow">Dispute Arbitration</p>
            <h1 className="adm-hero__title">
              <em>{stats.openCount}</em>
              <br />
              open disputes
            </h1>
            <div className="adm-hero__stats">
              <div className="adm-hero__stat">
                <span className="adm-hero__stat-num">
                  {stats.avgResolutionHours}h
                </span>
                <span className="adm-hero__stat-label">Avg resolution</span>
              </div>
              <div className="adm-hero__stat">
                <span
                  className={`adm-hero__stat-num${stats.slaBreachCount > 0 ? " adm-hero__stat-num--warn" : ""}`}
                >
                  {stats.slaBreachCount}
                </span>
                <span className="adm-hero__stat-label">SLA breached</span>
              </div>
              <div className="adm-hero__stat">
                <span
                  className={`adm-hero__stat-num${stats.criticalCount > 0 ? " adm-hero__stat-num--crit" : ""}`}
                >
                  {stats.criticalCount}
                </span>
                <span className="adm-hero__stat-label">Critical</span>
              </div>
              <div className="adm-hero__stat">
                <span className="adm-hero__stat-num">
                  {stats.resolvedCount}
                </span>
                <span className="adm-hero__stat-label">Resolved total</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <div className="adm-filters">
          <div className="adm-filters__inner">
            <input
              type="search"
              className="adm-filters__search"
              placeholder="Search creator, merchant, campaign…"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
            />

            <select
              className="adm-filters__select"
              value={filters.status}
              onChange={(e) => setFilter("status", e.target.value)}
            >
              <option value="">All statuses</option>
              {(Object.entries(STATUS_LABEL) as [DisputeStatus, string][]).map(
                ([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ),
              )}
            </select>

            <select
              className="adm-filters__select"
              value={filters.severity}
              onChange={(e) => setFilter("severity", e.target.value)}
            >
              <option value="">All severity</option>
              {(["critical", "high", "medium", "low"] as DisputeSeverity[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ),
              )}
            </select>

            <select
              className="adm-filters__select"
              value={filters.category}
              onChange={(e) => setFilter("category", e.target.value)}
            >
              <option value="">All categories</option>
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>

            <div className="adm-filters__amount">
              <span className="adm-filters__amount-label">$</span>
              <input
                type="number"
                className="adm-filters__amount-input"
                placeholder="Min"
                value={filters.minAmount}
                onChange={(e) => setFilter("minAmount", e.target.value)}
                min={0}
              />
              <span className="adm-filters__amount-label">—</span>
              <input
                type="number"
                className="adm-filters__amount-input"
                placeholder="Max"
                value={filters.maxAmount}
                onChange={(e) => setFilter("maxAmount", e.target.value)}
                min={0}
              />
            </div>

            {hasActiveFilters && (
              <button className="adm-filters__clear" onClick={clearFilters}>
                Clear
              </button>
            )}

            <span className="adm-filters__count">
              {disputes.length} dispute{disputes.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* List */}
        <section className="adm-list">
          <div className="adm-list__inner">
            {disputes.length === 0 ? (
              <div className="adm-list__empty">No disputes match filters.</div>
            ) : (
              disputes.map((d) => <DisputeRow key={d.id} dispute={d} />)
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dispute row component
// ---------------------------------------------------------------------------
function DisputeRow({ dispute: d }: { dispute: Dispute }) {
  const breached = isSlaBreached(d.sla_deadline);
  const isActive = !["resolved", "dismissed"].includes(d.status);

  return (
    <Link
      href={`/admin/disputes/${d.id}`}
      className={`dsp-row dsp-row--${d.severity}${d.status === "escalated" ? " dsp-row--escalated" : ""}`}
    >
      <div className="dsp-row__left">
        <div className="dsp-row__top">
          <span className="dsp-row__id">{d.id}</span>
          <span className="dsp-row__reason">{d.reason}</span>
        </div>

        <div className="dsp-row__parties">
          <div className="dsp-row__party">
            <div className="dsp-row__avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.creator_avatar} alt={d.creator_name} />
            </div>
            <span>{d.creator_name}</span>
            <span style={{ opacity: 0.5, fontSize: "10px" }}>
              {d.creator_handle}
            </span>
          </div>
          <span className="dsp-row__vs">vs</span>
          <div className="dsp-row__party">
            <span>{d.merchant_business}</span>
          </div>
        </div>

        <span className="dsp-row__campaign">{d.campaign_title}</span>
      </div>

      <div className="dsp-row__right">
        <span className="dsp-row__amount">${d.amount}</span>
        <div className="dsp-row__tags">
          <span className={`badge badge--status-${d.status}`}>
            {STATUS_LABEL[d.status]}
          </span>
          <span className={`badge badge--sev-${d.severity}`}>{d.severity}</span>
          {isActive && breached && (
            <span className="badge badge--sla">SLA breached</span>
          )}
          {d.thread_locked && (
            <span className="badge badge--locked">Locked</span>
          )}
          {d.escalated_to_legal && (
            <span className="badge badge--legal">Legal</span>
          )}
        </div>
        <span className="dsp-row__age">{formatAge(d.opened_at)}</span>
      </div>
    </Link>
  );
}
