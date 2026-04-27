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

// --- Cohort card ---
function CohortCard({ cohort }: { cohort: Cohort }) {
  const statusLabel =
    cohort.status === "active"
      ? "Active"
      : cohort.status === "completed"
        ? "Completed"
        : "Paused";

  const statusColor =
    cohort.status === "active"
      ? { bg: "rgba(0,133,255,0.08)", color: "var(--accent-blue)" }
      : cohort.status === "completed"
        ? { bg: "var(--surface-3)", color: "var(--ink-4)" }
        : { bg: "var(--panel-butter)", color: "var(--ink-3)" };

  const typeColor =
    cohort.type === "merchant"
      ? { bg: "rgba(191,161,112,0.14)", color: "#8a6a2a" }
      : { bg: "rgba(0,133,255,0.08)", color: "var(--accent-blue)" };

  return (
    <Link
      href={`/admin/cohorts/${cohort.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px 24px",
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      className="click-shift"
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--ink)",
            lineHeight: 1.2,
          }}
        >
          {cohort.name}
        </span>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            background: typeColor.bg,
            color: typeColor.color,
            textTransform: "capitalize",
            flexShrink: 0,
          }}
        >
          {cohort.type}
        </span>
      </div>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
          fontSize: 11,
          fontFamily: "var(--font-body)",
          color: "var(--ink-4)",
          alignItems: "center",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "2px 8px",
            borderRadius: 4,
            background: statusColor.bg,
            color: statusColor.color,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: statusColor.color,
              display: "inline-block",
            }}
          />
          {statusLabel}
        </span>
        <span>{cohort.neighborhood}</span>
        <span>·</span>
        <span>{cohort.startDate}</span>
        <span>·</span>
        <span>{cohort.size} members</span>
      </div>

      {/* Metrics row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          marginBottom: 0,
        }}
      >
        {[
          {
            value: `${(cohort.activationRate * 100).toFixed(0)}%`,
            label: "Activation",
          },
          {
            value: `${(cohort.retentionD7 * 100).toFixed(0)}%`,
            label: "D7 Ret.",
          },
          {
            value: `${(cohort.retentionD30 * 100).toFixed(0)}%`,
            label: "D30 Ret.",
          },
          { value: `$${(cohort.ltv / 1000).toFixed(1)}k`, label: "Avg LTV" },
        ].map(({ value, label }) => (
          <div key={label}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 800,
                color: "var(--ink)",
                lineHeight: 1,
                marginBottom: 2,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "var(--font-body)",
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <RetentionMiniChart cohort={cohort} />

      <span
        style={{
          marginTop: 12,
          fontSize: 12,
          fontFamily: "var(--font-body)",
          color: "var(--accent-blue)",
          fontWeight: 600,
        }}
      >
        View detail →
      </span>
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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid var(--hairline)",
    borderRadius: 8,
    background: "var(--surface)",
    color: "var(--ink)",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    fontFamily: "var(--font-body)",
    color: "var(--ink-4)",
    textTransform: "uppercase",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          padding: "32px",
          width: "min(480px, 90vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            border: "1px solid var(--hairline)",
            borderRadius: 6,
            background: "var(--surface-3)",
            cursor: "pointer",
            fontSize: 16,
            color: "var(--ink-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 800,
            color: "var(--ink)",
            marginBottom: 6,
          }}
        >
          New Cohort
        </h2>
        <p
          style={{
            fontSize: 13,
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            marginBottom: 24,
            lineHeight: 1.5,
          }}
        >
          Define filter criteria to group merchants or creators into a new
          cohort.
        </p>

        <form
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
          onSubmit={handleSubmit}
        >
          <div>
            <label style={labelStyle} htmlFor="cohort-name">
              Cohort Name
            </label>
            <input
              id="cohort-name"
              style={inputStyle}
              placeholder='e.g. "Week 5 Flatbush Food"'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="cohort-type">
              Type
            </label>
            <select
              id="cohort-type"
              style={inputStyle}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="merchant">Merchant</option>
              <option value="creator">Creator</option>
            </select>
          </div>

          <div>
            <label style={labelStyle} htmlFor="cohort-hood">
              Neighborhood
            </label>
            <input
              id="cohort-hood"
              style={inputStyle}
              placeholder="e.g. Flatbush"
              value={form.neighborhood}
              onChange={(e) =>
                setForm({ ...form, neighborhood: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="cohort-borough">
              Borough
            </label>
            <select
              id="cohort-borough"
              style={inputStyle}
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

          <div>
            <label style={labelStyle} htmlFor="cohort-start">
              Start Date
            </label>
            <input
              id="cohort-start"
              type="date"
              style={inputStyle}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="cohort-notes">
              Notes (optional)
            </label>
            <input
              id="cohort-notes"
              style={inputStyle}
              placeholder="Experiment hypothesis or context"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              type="button"
              className="btn-ghost click-shift"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary click-shift"
              style={{ flex: 1 }}
            >
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

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: "5px 12px",
    border: "1px solid var(--hairline)",
    borderRadius: 6,
    background: active ? "var(--ink)" : "var(--surface-3)",
    color: active ? "var(--snow)" : "var(--ink-3)",
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
          ADMIN · PUSH INTERNAL · NYC COLD-START GROWTH ANALYSIS
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
          Cohort analysis
        </h1>
        <p
          style={{
            fontSize: 14,
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            marginBottom: 32,
          }}
        >
          Track activation, retention, and revenue across NYC neighborhood
          cohorts.
        </p>

        {/* KPI strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {[
            { label: "Total Cohorts", value: stats.total },
            { label: "Active", value: stats.active },
            { label: "Total Members", value: stats.totalMembers },
            {
              label: "Total GMV",
              value: `$${(stats.totalGmv / 1000).toFixed(0)}k`,
            },
          ].map(({ label, value }) => (
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
                  color: "var(--ink)",
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
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
          marginBottom: 0,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              style={chipStyle(typeFilter === t)}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}

          <div
            style={{
              width: 1,
              height: 20,
              background: "var(--hairline)",
              margin: "0 4px",
              alignSelf: "center",
            }}
          />

          {BOROUGH_FILTERS.map((b) => (
            <button
              key={b}
              style={chipStyle(boroughFilter === b)}
              onClick={() => setBoroughFilter(b)}
            >
              {b}
            </button>
          ))}

          <div
            style={{
              width: 1,
              height: 20,
              background: "var(--hairline)",
              margin: "0 4px",
              alignSelf: "center",
            }}
          />

          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              style={chipStyle(statusFilter === s)}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          className="btn-primary click-shift"
          onClick={() => setShowModal(true)}
        >
          + New Cohort
        </button>
      </div>

      {/* Grid */}
      <div style={{ padding: "24px 40px" }}>
        <div
          style={{
            fontSize: 12,
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            marginBottom: 16,
          }}
        >
          {filtered.length} cohort{filtered.length !== 1 ? "s" : ""}
        </div>

        {filtered.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-4)",
              fontSize: 14,
              textAlign: "center",
              padding: "48px 0",
            }}
          >
            No cohorts match the selected filters.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
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
