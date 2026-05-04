"use client";

import { useState, useMemo, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import "./cohorts.css";
import {
  mockCohorts,
  getCohortStats,
  type Cohort,
} from "@/lib/admin/mock-cohorts";

// --- Mini retention SVG chart ---
function RetentionMiniChart({ cohort }: { cohort: Cohort }) {
  const pts = cohort.retentionCurve;
  const W = 220;
  const H = 48;
  const pad = 4;

  const maxDay = 90;
  const xs = pts.map((p) => pad + (p.day / maxDay) * (W - pad * 2));
  const ys = pts.map((p) => H - pad - p.rate * (H - pad * 2));

  const pathD = pts
    .map(
      (_, i) => `${i === 0 ? "M" : "L"}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`,
    )
    .join(" ");

  const fillD = `${pathD} L${xs[xs.length - 1].toFixed(1)},${(H - pad).toFixed(1)} L${xs[0].toFixed(1)},${(H - pad).toFixed(1)} Z`;

  return (
    <div style={{ width: "100%", marginTop: 12 }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: H, display: "block" }}
      >
        <defs>
          <linearGradient id={`grad-${cohort.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--accent-blue)"
              stopOpacity="0.12"
            />
            <stop
              offset="100%"
              stopColor="var(--accent-blue)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <path d={fillD} fill={`url(#grad-${cohort.id})`} />
        <path
          d={pathD}
          fill="none"
          stroke="var(--accent-blue)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity={0.7}
        />
        {pts.map((p, i) => (
          <circle
            key={p.day}
            cx={xs[i]}
            cy={ys[i]}
            r="2.5"
            fill="var(--brand-red)"
          />
        ))}
      </svg>
    </div>
  );
}

// --- Cohort card (v11) ---
function CohortCard({ cohort }: { cohort: Cohort }) {
  const statusLabel =
    cohort.status === "active"
      ? "Active"
      : cohort.status === "completed"
        ? "Completed"
        : "Paused";

  return (
    <Link href={`/admin/cohorts/${cohort.id}`} className="cohort-card-v11">
      {/* Header row: name + type badge */}
      <div className="cohort-card-v11__header">
        <span className="cohort-card-v11__name">{cohort.name}</span>
        <span className={`cohort-type-badge cohort-type-badge--${cohort.type}`}>
          {cohort.type}
        </span>
      </div>

      {/* Meta row: status + neighborhood + date */}
      <div className="cohort-card-v11__meta">
        <span
          className={`cohort-status-badge cohort-status-badge--${cohort.status}`}
        >
          <span className="cohort-status-badge__dot" />
          {statusLabel}
        </span>
        <span>{cohort.neighborhood}</span>
        <span>·</span>
        <span>{cohort.startDate}</span>
      </div>

      {/* Metrics row — 4-col grid */}
      <div className="cohort-card-v11__metrics">
        {/* Member count — Darky 40px 800 */}
        <div>
          <div className="cohort-card-v11__member-count">{cohort.size}</div>
          <div className="cohort-metric-label">Members</div>
        </div>
        {/* Performance metric (D30 retention) — Darky 24px 700 */}
        <div>
          <div className="cohort-card-v11__perf">
            {(cohort.retentionD30 * 100).toFixed(0)}%
          </div>
          <div className="cohort-metric-label">D30 Ret.</div>
        </div>
        <div>
          <div className="cohort-metric-value">
            {(cohort.activationRate * 100).toFixed(0)}%
          </div>
          <div className="cohort-metric-label">Activation</div>
        </div>
        <div>
          <div className="cohort-metric-value">
            ${(cohort.ltv / 1000).toFixed(1)}k
          </div>
          <div className="cohort-metric-label">Avg LTV</div>
        </div>
      </div>

      <RetentionMiniChart cohort={cohort} />

      <span className="cohort-card-v11__cta">View detail →</span>
    </Link>
  );
}

// --- Create Cohort Modal ---
function CreateModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    type: "merchant",
    neighborhood: "",
    borough: "Brooklyn",
    startDate: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this would POST to /api/admin/cohorts
    alert(`Cohort "${form.name}" created (mock). Backend integration pending.`);
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="modal-title">New Cohort</h2>
        <p className="modal-subtitle">
          Define filter criteria to group merchants or creators into a new
          cohort.
        </p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="cohort-name">
              Cohort Name
            </label>
            <input
              id="cohort-name"
              className="form-input"
              placeholder='e.g. "Week 5 Flatbush Food"'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="cohort-type">
              Type
            </label>
            <select
              id="cohort-type"
              className="form-select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="merchant">Merchant</option>
              <option value="creator">Creator</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="cohort-hood">
              Neighborhood
            </label>
            <input
              id="cohort-hood"
              className="form-input"
              placeholder="e.g. Flatbush"
              value={form.neighborhood}
              onChange={(e) =>
                setForm({ ...form, neighborhood: e.target.value })
              }
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="cohort-borough">
              Borough
            </label>
            <select
              id="cohort-borough"
              className="form-select"
              value={form.borough}
              onChange={(e) => setForm({ ...form, borough: e.target.value })}
            >
              <option>Brooklyn</option>
              <option>Manhattan</option>
              <option>Queens</option>
              <option>Bronx</option>
              <option>Staten Island</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="cohort-start">
              Start Date
            </label>
            <input
              id="cohort-start"
              type="date"
              className="form-input"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="cohort-notes">
              Notes (optional)
            </label>
            <input
              id="cohort-notes"
              className="form-input"
              placeholder="Experiment hypothesis or context"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-ghost"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Create Cohort
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Liquid-glass Top Cohort highlight card (≤1 per page) ---
function TopCohortCard({ cohort }: { cohort: Cohort }) {
  return (
    <Link
      href={`/admin/cohorts/${cohort.id}`}
      className="cohort-top-card click-shift"
    >
      <div className="cohort-top-card__body">
        <div className="cohort-top-card__label">(TOP COHORT)</div>
        <div className="cohort-top-card__name">{cohort.name}</div>
        <div className="cohort-top-card__meta">
          {cohort.neighborhood} · {cohort.borough} · Started {cohort.startDate}
        </div>
      </div>
      <div className="cohort-top-card__stats">
        {/* Member count — Darky 40px 800 */}
        <div className="cohort-top-card__stat">
          <div className="cohort-top-card__stat-value">{cohort.size}</div>
          <div className="cohort-top-card__stat-label">Members</div>
        </div>
        {/* Performance metric (D30 retention) — Darky 24px 700 */}
        <div className="cohort-top-card__stat">
          <div className="cohort-top-card__stat-perf">
            {(cohort.retentionD30 * 100).toFixed(0)}%
          </div>
          <div className="cohort-top-card__stat-label">D30 Ret.</div>
        </div>
        <div className="cohort-top-card__stat">
          <div className="cohort-top-card__stat-perf">
            ${(cohort.ltv / 1000).toFixed(1)}k
          </div>
          <div className="cohort-top-card__stat-label">Avg LTV</div>
        </div>
      </div>
    </Link>
  );
}

// --- Keyboard-navigable filter pill group ---
function FilterPillGroup({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const groupRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    const btns =
      groupRef.current?.querySelectorAll<HTMLButtonElement>("button");
    if (!btns) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = btns[(idx + 1) % btns.length];
      next.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = btns[(idx - 1 + btns.length) % btns.length];
      prev.focus();
    }
  }

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={label}
      style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
    >
      {options.map((opt, idx) => (
        <button
          key={opt}
          className="btn-pill"
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// --- Main page ---
const BOROUGH_FILTERS = ["All", "Brooklyn", "Manhattan", "Queens", "Bronx"];
const TYPE_FILTERS = ["All", "Merchant", "Creator"];
const STATUS_FILTERS = ["All", "Active", "Completed", "Paused"];

export default function CohortsPage() {
  const stats = getCohortStats();
  const [typeFilter, setTypeFilter] = useState("All");
  const [boroughFilter, setBoroughFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    return mockCohorts.filter((c) => {
      if (typeFilter !== "All" && c.type !== typeFilter.toLowerCase())
        return false;
      if (boroughFilter !== "All" && c.borough !== boroughFilter) return false;
      if (statusFilter !== "All" && c.status !== statusFilter.toLowerCase())
        return false;
      return true;
    });
  }, [typeFilter, boroughFilter, statusFilter]);

  // Top cohort — best D30 retention among active cohorts
  const topCohort = useMemo(() => {
    const active = mockCohorts.filter((c) => c.status === "active");
    return active.sort((a, b) => b.retentionD30 - a.retentionD30)[0] ?? null;
  }, []);

  return (
    <div className="cohorts-page">
      {/* Page header */}
      <div className="cohorts-header">
        <div className="cohorts-eyebrow">
          ADMIN · PUSH INTERNAL · NYC COLD-START GROWTH ANALYSIS
        </div>
        <h1 className="cohorts-title">Cohort analysis</h1>
        <p className="cohorts-subtitle">
          Track activation, retention, and revenue across NYC neighborhood
          cohorts.
        </p>

        {/* KPI strip */}
        <div className="cohorts-kpi-strip">
          {[
            { label: "Total Cohorts", value: stats.total },
            { label: "Active", value: stats.active },
            { label: "Total Members", value: stats.totalMembers },
            {
              label: "Total GMV",
              value: `$${(stats.totalGmv / 1000).toFixed(0)}k`,
            },
          ].map(({ label, value }) => (
            <div key={label} className="cohort-kpi-tile">
              <div className="cohort-kpi-tile__label">{label}</div>
              <div className="cohort-kpi-tile__value">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Liquid-glass Top Cohort card (≤1 per page) */}
      {topCohort && <TopCohortCard cohort={topCohort} />}

      {/* Toolbar */}
      <div className="cohorts-toolbar">
        <div className="cohorts-filter-group">
          <FilterPillGroup
            options={TYPE_FILTERS}
            value={typeFilter}
            onChange={setTypeFilter}
            label="Filter by type"
          />
          <div className="cohorts-filter-divider" aria-hidden />
          <FilterPillGroup
            options={BOROUGH_FILTERS}
            value={boroughFilter}
            onChange={setBoroughFilter}
            label="Filter by borough"
          />
          <div className="cohorts-filter-divider" aria-hidden />
          <FilterPillGroup
            options={STATUS_FILTERS}
            value={statusFilter}
            onChange={setStatusFilter}
            label="Filter by status"
          />
        </div>

        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Cohort
        </button>
      </div>

      {/* Grid */}
      <div className="cohorts-grid-section">
        <div className="cohorts-grid-count">
          {filtered.length} cohort{filtered.length !== 1 ? "s" : ""}
        </div>

        {filtered.length === 0 ? (
          <p className="cohorts-empty">
            No cohorts match the selected filters.
          </p>
        ) : (
          <div className="cohorts-grid">
            {filtered.map((c) => (
              <CohortCard key={c.id} cohort={c} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && <CreateModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
