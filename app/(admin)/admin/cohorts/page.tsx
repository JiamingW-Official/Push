"use client";

import { useState, useMemo } from "react";
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

  // Fill area
  const fillD = `${pathD} L${xs[xs.length - 1].toFixed(1)},${(H - pad).toFixed(1)} L${xs[0].toFixed(1)},${(H - pad).toFixed(1)} Z`;

  return (
    <div className="cohort-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${cohort.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#003049" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#003049" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillD} fill={`url(#grad-${cohort.id})`} />
        <path
          d={pathD}
          fill="none"
          stroke="#003049"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {pts.map((p, i) => (
          <circle key={p.day} cx={xs[i]} cy={ys[i]} r="2.5" fill="#c1121f" />
        ))}
      </svg>
    </div>
  );
}

// --- Cohort card ---
function CohortCard({ cohort }: { cohort: Cohort }) {
  const statusLabel =
    cohort.status === "active"
      ? "Active"
      : cohort.status === "completed"
        ? "Completed"
        : "Paused";

  return (
    <Link href={`/admin/cohorts/${cohort.id}`} className="cohort-card">
      <div className="cohort-card__top">
        <span className="cohort-card__name">{cohort.name}</span>
        <span className={`cohort-badge cohort-badge--${cohort.type}`}>
          {cohort.type}
        </span>
      </div>

      <div className="cohort-card__meta">
        <span className="cohort-card__meta-item">
          <span className={`status-dot status-dot--${cohort.status}`} />
          {statusLabel}
        </span>
        <span>{cohort.neighborhood}</span>
        <span>{cohort.startDate}</span>
        <span>{cohort.size} members</span>
      </div>

      <div className="cohort-card__metrics">
        <div className="cohort-metric">
          <div className="cohort-metric__value">
            {(cohort.activationRate * 100).toFixed(0)}%
          </div>
          <div className="cohort-metric__label">Activation</div>
        </div>
        <div className="cohort-metric">
          <div className="cohort-metric__value">
            {(cohort.retentionD7 * 100).toFixed(0)}%
          </div>
          <div className="cohort-metric__label">D7 Ret.</div>
        </div>
        <div className="cohort-metric">
          <div className="cohort-metric__value">
            {(cohort.retentionD30 * 100).toFixed(0)}%
          </div>
          <div className="cohort-metric__label">D30 Ret.</div>
        </div>
        <div className="cohort-metric">
          <div className="cohort-metric__value">
            ${(cohort.ltv / 1000).toFixed(1)}k
          </div>
          <div className="cohort-metric__label">Avg LTV</div>
        </div>
      </div>

      <RetentionMiniChart cohort={cohort} />

      <span className="cohort-card__cta">View detail →</span>
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
        <h2 className="modal-box__title">New Cohort</h2>
        <p className="modal-box__sub">
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
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Cohort
            </button>
          </div>
        </form>
      </div>
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

  return (
    <>
      {/* Hero */}
      <section className="cohort-hero">
        <div className="cohort-hero__inner">
          <div>
            <p className="cohort-hero__eyebrow">
              NYC Cold-Start Growth Analysis
            </p>
            <h1 className="cohort-hero__title">Cohort analysis.</h1>
            <p className="cohort-hero__sub">
              Track activation, retention, and revenue across NYC neighborhood
              cohorts.
            </p>
          </div>
          <div className="cohort-hero__stats">
            <div className="hero-stat">
              <div className="hero-stat__value">{stats.total}</div>
              <div className="hero-stat__label">Total Cohorts</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat__value">{stats.active}</div>
              <div className="hero-stat__label">Active</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat__value">{stats.totalMembers}</div>
              <div className="hero-stat__label">Total Members</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat__value">
                ${(stats.totalGmv / 1000).toFixed(0)}k
              </div>
              <div className="hero-stat__label">Total GMV</div>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="cohort-toolbar">
        <div className="cohort-toolbar__inner">
          <div className="cohort-filter-group">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                className={`cohort-filter-chip${typeFilter === t ? " active" : ""}`}
                onClick={() => setTypeFilter(t)}
              >
                {t}
              </button>
            ))}
            <div
              style={{ width: 1, background: "var(--line)", margin: "0 4px" }}
            />
            {BOROUGH_FILTERS.map((b) => (
              <button
                key={b}
                className={`cohort-filter-chip${boroughFilter === b ? " active" : ""}`}
                onClick={() => setBoroughFilter(b)}
              >
                {b}
              </button>
            ))}
            <div
              style={{ width: 1, background: "var(--line)", margin: "0 4px" }}
            />
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                className={`cohort-filter-chip${statusFilter === s ? " active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            className="cohort-create-btn"
            onClick={() => setShowModal(true)}
          >
            + New Cohort
          </button>
        </div>
      </div>

      {/* Grid */}
      <section className="cohort-grid-section">
        <div className="cohort-grid-inner">
          <div className="cohort-grid-meta">
            <span className="cohort-grid-count">
              {filtered.length} cohort{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="cohort-grid">
            {filtered.map((c) => (
              <CohortCard key={c.id} cohort={c} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--text-muted)",
                fontSize: "var(--text-small)",
                padding: "var(--space-8) 0",
                textAlign: "center",
              }}
            >
              No cohorts match the selected filters.
            </p>
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && <CreateModal onClose={() => setShowModal(false)} />}
    </>
  );
}
