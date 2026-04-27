"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../cohorts.css";
import {
  getCohortById,
  mockCohorts,
  type Cohort,
  type RetentionPoint,
} from "@/lib/admin/mock-cohorts";

// --- Retention heatmap table ---
// Days shown in columns: D0, D7, D14, D30, D60, D90
const HEAT_DAYS = [0, 7, 14, 30, 60, 90];

function heatColor(rate: number): string {
  // Interpolate from white (#ffffff) → Steel Blue (#669bbc) → Deep Space Blue (#003049)
  // rate: 0 = white, 0.5 = tertiary, 1 = dark
  if (rate >= 0.75) {
    // tertiary → dark
    const t = (rate - 0.75) / 0.25;
    const r = Math.round(102 + t * (0 - 102));
    const g = Math.round(155 + t * (48 - 155));
    const b = Math.round(188 + t * (73 - 188));
    return `rgb(${r},${g},${b})`;
  } else if (rate >= 0.35) {
    // white → tertiary
    const t = (rate - 0.35) / 0.4;
    const r = Math.round(255 + t * (102 - 255));
    const g = Math.round(255 + t * (155 - 255));
    const b = Math.round(255 + t * (188 - 255));
    return `rgb(${r},${g},${b})`;
  }
  return `rgba(245,242,236,1)`; // surface — essentially empty
}

function textOnHeat(rate: number): string {
  return rate >= 0.55 ? "#ffffff" : "#003049";
}

// Interpolate retention curve to arbitrary day
function interpolateRate(curve: RetentionPoint[], day: number): number {
  for (let i = 0; i < curve.length - 1; i++) {
    const a = curve[i];
    const b = curve[i + 1];
    if (day >= a.day && day <= b.day) {
      const t = (day - a.day) / (b.day - a.day);
      return a.rate + t * (b.rate - a.rate);
    }
  }
  if (day <= curve[0].day) return curve[0].rate;
  return curve[curve.length - 1].rate;
}

function RetentionHeatmap({ cohort }: { cohort: Cohort }) {
  // Show current cohort + 3 random comparison cohorts
  const comparisons = mockCohorts
    .filter((c) => c.id !== cohort.id && c.type === cohort.type)
    .slice(0, 3);
  const rows = [cohort, ...comparisons];

  return (
    <div className="retention-section">
      <h2 className="section-title">Retention Cohort Table</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="retention-table">
          <thead>
            <tr>
              <th>Cohort</th>
              {HEAT_DAYS.map((d) => (
                <th key={d}>D{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c, rowIdx) => (
              <tr key={c.id}>
                <td>
                  <span style={{ fontWeight: rowIdx === 0 ? 800 : 600 }}>
                    {rowIdx === 0 ? "▶ " : ""}
                    {c.name}
                  </span>
                </td>
                {HEAT_DAYS.map((day) => {
                  const rate = interpolateRate(c.retentionCurve, day);
                  const bg = heatColor(rate);
                  const fg = textOnHeat(rate);
                  return (
                    <td
                      key={day}
                      className="heat-cell"
                      style={{ background: bg, color: fg }}
                    >
                      {day === 0 ? "100%" : `${(rate * 100).toFixed(0)}%`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Activation Funnel ---
const FUNNEL_STEPS = [
  { label: "Sign up", key: "signup" },
  { label: "First action", key: "firstAction" },
  { label: "First campaign", key: "firstCampaign" },
  { label: "First payment", key: "firstPayment" },
];

function ActivationFunnel({ cohort }: { cohort: Cohort }) {
  // Derive funnel values from activation rate
  const base = cohort.size;
  const steps = [
    { label: "Sign up", count: base, pct: 100 },
    {
      label: "First action",
      count: Math.round(base * cohort.activationRate),
      pct: Math.round(cohort.activationRate * 100),
    },
    {
      label: "First campaign",
      count: Math.round(base * cohort.activationRate * 0.82),
      pct: Math.round(cohort.activationRate * 82),
    },
    {
      label: "First payment",
      count: Math.round(base * cohort.activationRate * 0.71),
      pct: Math.round(cohort.activationRate * 71),
    },
  ];

  // Colors for stepped bars — use opacity variants of brand colors
  const colors = [
    "#003049",
    "rgba(10,10,10,0.72)",
    "rgba(102,155,188,0.85)",
    "#c1121f",
  ];

  return (
    <div className="funnel-section">
      <h2 className="section-title">Activation Funnel</h2>
      <div className="funnel-bars">
        {steps.map((step, i) => (
          <div key={step.label} className="funnel-step">
            <div className="funnel-step__label">{step.label}</div>
            <div className="funnel-step__bar-wrap">
              <div
                className="funnel-step__bar"
                style={{
                  width: `${step.pct}%`,
                  background: colors[i],
                }}
              />
            </div>
            <div className="funnel-step__pct">{step.pct}%</div>
          </div>
        ))}
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-caption)",
          color: "var(--ink-4)",
          marginTop: "var(--space-3)",
        }}
      >
        {steps[steps.length - 1].count} of {base} members completed full
        activation
      </p>
    </div>
  );
}

// --- Member list ---
function MemberList({ cohort }: { cohort: Cohort }) {
  const [page, setPage] = useState(0);
  const PER_PAGE = 10;
  const total = cohort.members.length;
  const paged = cohort.members.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(total / PER_PAGE);

  function formatGmv(v: number) {
    return v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`;
  }

  return (
    <div className="member-section">
      <h2 className="section-title">
        Members
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-caption)",
            fontWeight: 700,
            color: "var(--graphite)",
          }}
        >
          {total} total
        </span>
      </h2>
      <div style={{ overflowX: "auto" }}>
        <table className="member-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              {cohort.type === "creator" && <th>Tier</th>}
              <th>Joined</th>
              <th>Campaigns</th>
              <th>GMV</th>
              <th>LTV</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((m) => (
              <tr key={m.id}>
                <td style={{ fontWeight: 600, color: "var(--ink)" }}>
                  {m.name}
                  {m.handle && (
                    <span
                      style={{
                        display: "block",
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: "var(--accent-blue)",
                        fontWeight: 400,
                      }}
                    >
                      {m.handle}
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className={`member-status-badge member-status-badge--${m.status}`}
                  >
                    {m.status}
                  </span>
                </td>
                {cohort.type === "creator" && (
                  <td>
                    {m.tier && <span className="member-tier">{m.tier}</span>}
                  </td>
                )}
                <td style={{ color: "var(--graphite)" }}>{m.joinedAt}</td>
                <td
                  style={{
                    textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {m.campaigns}
                </td>
                <td
                  style={{
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {formatGmv(m.gmv)}
                </td>
                <td
                  style={{
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 600,
                    color: m.ltv > 3000 ? "var(--brand-red)" : "var(--ink)",
                  }}
                >
                  {formatGmv(m.ltv)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            marginTop: "var(--space-3)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-caption)",
            color: "var(--graphite)",
          }}
        >
          <button
            className="export-btn"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{ opacity: page === 0 ? 0.4 : 1 }}
          >
            ← Prev
          </button>
          <span>
            Page {page + 1} / {totalPages}
          </span>
          <button
            className="export-btn"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            style={{ opacity: page === totalPages - 1 ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// --- Experiment comparison ---
type CompareMetric = "retentionD30" | "activationRate" | "ltv" | "gmv";

const METRICS: {
  key: CompareMetric;
  label: string;
  format: (v: number) => string;
}[] = [
  {
    key: "retentionD30",
    label: "D30 Retention",
    format: (v) => `${(v * 100).toFixed(0)}%`,
  },
  {
    key: "activationRate",
    label: "Activation",
    format: (v) => `${(v * 100).toFixed(0)}%`,
  },
  { key: "ltv", label: "Avg LTV", format: (v) => `$${v.toLocaleString()}` },
  {
    key: "gmv",
    label: "Total GMV",
    format: (v) => `$${(v / 1000).toFixed(0)}k`,
  },
];

function ExperimentComparison({ cohort }: { cohort: Cohort }) {
  const [metric, setMetric] = useState<CompareMetric>("retentionD30");
  const metaDef = METRICS.find((m) => m.key === metric)!;

  // Compare with all same-type cohorts
  const peers = mockCohorts.filter((c) => c.type === cohort.type);
  const maxVal = Math.max(...peers.map((c) => c[metric] as number));

  return (
    <div className="compare-section">
      <h2 className="section-title">Experiment Comparison</h2>
      <div className="compare-metric-tabs">
        {METRICS.map((m) => (
          <button
            key={m.key}
            className={`compare-tab${metric === m.key ? " active" : ""}`}
            onClick={() => setMetric(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="compare-chart">
        {peers
          .sort((a, b) => (b[metric] as number) - (a[metric] as number))
          .map((c) => {
            const val = c[metric] as number;
            const isCurrent = c.id === cohort.id;
            const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
            return (
              <div key={c.id} className="compare-row">
                <div
                  className={`compare-row__name${isCurrent ? " is-current" : ""}`}
                >
                  {isCurrent ? "▶ " : ""}
                  {c.name}
                </div>
                <div className="compare-bar-wrap">
                  <div
                    className={`compare-bar${isCurrent ? " is-current" : " is-other"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="compare-row__val">{metaDef.format(val)}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

// --- CSV Export ---
function exportCsv(cohort: Cohort) {
  const headers = [
    "id",
    "name",
    "neighborhood",
    "joinedAt",
    "status",
    "campaigns",
    "gmv",
    "ltv",
  ];
  const rows = cohort.members.map((m) =>
    [
      m.id,
      m.name,
      m.neighborhood,
      m.joinedAt,
      m.status,
      m.campaigns,
      m.gmv,
      m.ltv,
    ].join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${cohort.id}-members.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// --- Page ---
export default function CohortDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const cohort = getCohortById(id);

  if (!cohort) notFound();

  const statusLabel =
    cohort.status === "active"
      ? "Active"
      : cohort.status === "completed"
        ? "Completed"
        : "Paused";

  return (
    <>
      {/* Hero */}
      <section
        className="cohort-hero"
        style={{ paddingBottom: "var(--space-6)" }}
      >
        <div
          style={{
            maxWidth: "var(--content-width)",
            margin: "0 auto",
            padding: "0 var(--space-5)",
          }}
        >
          <Link href="/admin/cohorts" className="cohort-back">
            All Cohorts
          </Link>

          <div className="cohort-detail-hero__eyebrow">
            <span className={`cohort-badge cohort-badge--${cohort.type}`}>
              {cohort.type}
            </span>
            &nbsp;&nbsp;{cohort.neighborhood} · {cohort.borough}
          </div>

          <h1
            className="cohort-hero__title"
            style={{ marginTop: "var(--space-2)" }}
          >
            {cohort.name}
          </h1>

          <p className="cohort-hero__sub">
            <span
              className={`status-dot status-dot--${cohort.status}`}
              style={{ display: "inline-block", marginRight: 6 }}
            />
            {statusLabel} · Started {cohort.startDate} · {cohort.size} members
          </p>

          {cohort.notes && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-small)",
                color: "rgba(255,255,255,0.45)",
                marginTop: "var(--space-2)",
                fontStyle: "italic",
                maxWidth: 560,
              }}
            >
              &quot;{cohort.notes}&quot;
            </p>
          )}

          {/* KPIs */}
          <div
            className="cohort-hero__stats"
            style={{
              marginTop: "var(--space-5)",
              paddingTop: "var(--space-4)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="hero-stat">
              <div className="hero-stat__value">
                {(cohort.activationRate * 100).toFixed(0)}%
              </div>
              <div className="hero-stat__label">Activation</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat__value">
                {(cohort.retentionD7 * 100).toFixed(0)}%
              </div>
              <div className="hero-stat__label">D7 Retention</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat__value">
                {(cohort.retentionD30 * 100).toFixed(0)}%
              </div>
              <div className="hero-stat__label">D30 Retention</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat__value">
                ${(cohort.gmv / 1000).toFixed(0)}k
              </div>
              <div className="hero-stat__label">Total GMV</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat__value">
                ${cohort.ltv.toLocaleString()}
              </div>
              <div className="hero-stat__label">Avg LTV</div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail content */}
      <div className="cohort-detail">
        {/* Export */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "var(--space-4)",
          }}
        >
          <button className="export-btn" onClick={() => exportCsv(cohort)}>
            ↓ Export CSV
          </button>
        </div>

        {/* Experiment tags */}
        {cohort.experimentTags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "var(--space-1)",
              flexWrap: "wrap",
              marginBottom: "var(--space-6)",
            }}
          >
            {cohort.experimentTags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  padding: "3px 10px",
                  background: "rgba(10,10,10,0.06)",
                  border: "1px solid var(--line)",
                  color: "var(--graphite)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Retention heatmap */}
        <RetentionHeatmap cohort={cohort} />

        {/* Activation funnel */}
        <ActivationFunnel cohort={cohort} />

        {/* Member list */}
        <MemberList cohort={cohort} />

        {/* Experiment comparison */}
        <ExperimentComparison cohort={cohort} />
      </div>
    </>
  );
}
