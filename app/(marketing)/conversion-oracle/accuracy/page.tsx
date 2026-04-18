import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./accuracy.css";

export const metadata: Metadata = {
  title: "ConversionOracle\u2122 Accuracy \u2014 public dashboard | Push",
  description:
    "Public accuracy trend and verdict breakdown for ConversionOracle\u2122, the verification stack inside Push's Vertical AI for Local Commerce. Williamsburg Coffee+ pilot cohort. Updated weekly.",
  robots: { index: true, follow: true },
};

/* ─── Data ────────────────────────────────────────────────── */

const LAST_UPDATED = "2026-04-18";
const COHORT = "Williamsburg Coffee+";
const EVENTS_TOTAL = 742;

// Weekly auto-verify accuracy (% of events where the 3-layer stack's
// verdict matched the human-audit ground truth).
const ACCURACY_SERIES: { week: number; pct: number; label: string }[] = [
  { week: 1, pct: 71.4, label: "W1" },
  { week: 2, pct: 75.2, label: "W2" },
  { week: 3, pct: 78.6, label: "W3" },
  { week: 4, pct: 81.9, label: "W4" },
  { week: 5, pct: 84.1, label: "W5" },
  { week: 6, pct: 86.7, label: "W6" },
  { week: 7, pct: 88.3, label: "W7" },
  { week: 8, pct: 89.4, label: "W8" },
  { week: 9, pct: 91.2, label: "W9" },
  { week: 10, pct: 94.1, label: "W10" },
];

// Verdict distribution for the current rolling 30-day window.
const VERDICT_DIST = [
  { id: "auto_verified", pct: 74.2, label: "auto_verified", tone: "tertiary" },
  { id: "auto_rejected", pct: 8.6, label: "auto_rejected", tone: "primary" },
  { id: "manual_review", pct: 12.3, label: "manual_review", tone: "champagne" },
  {
    id: "human_approved",
    pct: 3.4,
    label: "human_approved",
    tone: "tertiary-dark",
  },
  {
    id: "human_rejected",
    pct: 1.5,
    label: "human_rejected",
    tone: "primary-dark",
  },
] as const;

const CHANGELOG = [
  {
    date: "2026-04-12",
    kind: "model",
    title: "Lighting-compensation added to OCR step",
    body: "New pre-processing pass normalises low-lux receipt images before Claude Vision OCR. Week-over-week auto-verify accuracy up 2.1% on the pilot cohort.",
  },
  {
    date: "2026-04-05",
    kind: "policy",
    title: "200m geo-fence hardened against low-confidence fixes",
    body: "Any GPS fix with accuracy radius > 50m now abstains and routes to manual_review. False positives from spoofed locations down to 1.8%.",
  },
  {
    date: "2026-03-29",
    kind: "model",
    title: "Prompt-cache bump for matching prompt",
    body: "Cache hit rate on the creator-to-receipt matching prompt up from 71% to 84%. End-to-end median verify time dropped from 9.1s to 7.6s.",
  },
  {
    date: "2026-03-22",
    kind: "ops",
    title: "Manual review SLA commitment set at 24h",
    body: "Human ops queue drained in under 24h on 97% of batches during March. Publishing the 24h SLA externally; breach will post on the status page.",
  },
  {
    date: "2026-03-15",
    kind: "model",
    title: "Degraded-mode rule matcher shipped",
    body: "Env-gated mock fallback activates automatically when the Claude API returns errors for > 30s. Degraded windows flagged and published to the status page.",
  },
  {
    date: "2026-03-08",
    kind: "policy",
    title: "Fraud fingerprint retention made permanent",
    body: "Raw receipt images purged after 90 days as before, but hashed fingerprints (SKU sequence + device hash + geo bucket) now retained indefinitely. Disclosed in merchant and creator agreements.",
  },
];

/* ─── Chart helpers ────────────────────────────────────────── */
const CHART = {
  w: 1120,
  h: 420,
  padL: 72,
  padR: 32,
  padT: 32,
  padB: 64,
  yMin: 50,
  yMax: 100,
  xMin: 0,
  xMax: 11,
};

function xScale(week: number) {
  const inner = CHART.w - CHART.padL - CHART.padR;
  return CHART.padL + ((week - CHART.xMin) / (CHART.xMax - CHART.xMin)) * inner;
}
function yScale(pct: number) {
  const inner = CHART.h - CHART.padT - CHART.padB;
  return (
    CHART.padT + (1 - (pct - CHART.yMin) / (CHART.yMax - CHART.yMin)) * inner
  );
}
function buildPath(series: { week: number; pct: number }[]) {
  return series
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${xScale(p.week).toFixed(1)} ${yScale(p.pct).toFixed(1)}`,
    )
    .join(" ");
}

/* ─── Page ────────────────────────────────────────────────── */

export default function ConversionOracleAccuracyPage() {
  const linePath = buildPath(ACCURACY_SERIES);
  const current = ACCURACY_SERIES[ACCURACY_SERIES.length - 1];
  const currentX = xScale(current.week);
  const currentY = yScale(current.pct);

  const xTicks = ACCURACY_SERIES.map((p) => p.week);
  const yTicks = [50, 60, 70, 80, 90, 100];

  return (
    <main className="coa">
      <ScrollRevealInit />

      {/* ───────── HERO ───────── */}
      <section className="coa-hero">
        <div className="container coa-hero__inner">
          <span className="coa-eyebrow">
            <span className="coa-rule coa-rule--w" />
            Public dashboard
          </span>
          <h1>
            ConversionOracle<span>&trade;</span> accuracy.
            <br />
            Audited against receipts.
          </h1>
          <p className="coa-hero__sub">
            Weekly auto-verify accuracy for ConversionOracle&trade;, the
            verification stack inside Push&apos;s Vertical AI for Local Commerce
            engine. Cohort: Williamsburg Coffee+ beachhead. Ground truth: human
            audit against original receipt images.
          </p>
          <div className="coa-hero__meta">
            <span>
              Last updated &middot; <strong>{LAST_UPDATED}</strong>
            </span>
            <span>
              Cohort &middot; <strong>{COHORT}</strong>
            </span>
            <span>
              Events &middot; <strong>{EVENTS_TOTAL.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ───────── §1 Accuracy chart ───────── */}
      <section className="coa-section reveal">
        <div className="container">
          <span className="coa-s-label">
            <span className="coa-rule" />
            §1 · Accuracy trend
          </span>
          <h2>Weekly auto-verify accuracy, pilot start to now.</h2>
          <p className="coa-section__lede">
            Target bands mark our public commitments. 75% is the floor below
            which we publicly apologise. 85% is the Month-3 target for the
            auto-verify rate. 90% is the Month-6 target. Current: {current.pct}
            %.
          </p>

          <div className="coa-chart">
            <svg
              className="coa-chart__svg"
              viewBox={`0 0 ${CHART.w} ${CHART.h}`}
              role="img"
              aria-label="Weekly auto-verify accuracy line with three dashed target bands at 75%, 85%, and 90%, NOW marker highlighted in red."
            >
              {/* Horizontal gridlines */}
              {yTicks.map((t) => (
                <line
                  key={`gh-${t}`}
                  x1={CHART.padL}
                  x2={CHART.w - CHART.padR}
                  y1={yScale(t)}
                  y2={yScale(t)}
                  stroke="rgba(0,48,73,0.08)"
                  strokeWidth={1}
                />
              ))}

              {/* Y-axis labels (CS Genio Mono) */}
              {yTicks.map((t) => (
                <text
                  key={`yl-${t}`}
                  x={CHART.padL - 12}
                  y={yScale(t) + 4}
                  fontSize="10"
                  fill="#4a5568"
                  fontFamily="CSGenioMono, monospace"
                  textAnchor="end"
                >
                  {t}%
                </text>
              ))}

              {/* X-axis labels */}
              {xTicks.map((t) => (
                <text
                  key={`xl-${t}`}
                  x={xScale(t)}
                  y={CHART.h - CHART.padB + 22}
                  fontSize="10"
                  fill="#4a5568"
                  fontFamily="CSGenioMono, monospace"
                  textAnchor="middle"
                >
                  W{t}
                </text>
              ))}

              <text
                x={(CHART.padL + (CHART.w - CHART.padR)) / 2}
                y={CHART.h - 16}
                fontSize="10"
                fill="#4a5568"
                fontFamily="CSGenioMono, monospace"
                textAnchor="middle"
                letterSpacing="1.5"
              >
                WEEKS SINCE PILOT START
              </text>

              {/* Target bands (dashed) */}
              {/* 75% Steel Blue */}
              <line
                x1={CHART.padL}
                x2={CHART.w - CHART.padR}
                y1={yScale(75)}
                y2={yScale(75)}
                stroke="#669bbc"
                strokeWidth={1.5}
                strokeDasharray="6 6"
              />
              <text
                x={CHART.w - CHART.padR - 6}
                y={yScale(75) - 8}
                fontSize="10"
                fill="#669bbc"
                fontFamily="CSGenioMono, monospace"
                textAnchor="end"
                fontWeight="700"
                letterSpacing="1.2"
              >
                FLOOR · 75%
              </text>

              {/* 85% Champagne */}
              <line
                x1={CHART.padL}
                x2={CHART.w - CHART.padR}
                y1={yScale(85)}
                y2={yScale(85)}
                stroke="#c9a96e"
                strokeWidth={1.5}
                strokeDasharray="6 6"
              />
              <text
                x={CHART.w - CHART.padR - 6}
                y={yScale(85) - 8}
                fontSize="10"
                fill="#c9a96e"
                fontFamily="CSGenioMono, monospace"
                textAnchor="end"
                fontWeight="700"
                letterSpacing="1.2"
              >
                MONTH-3 · 85%
              </text>

              {/* 90% Flag Red */}
              <line
                x1={CHART.padL}
                x2={CHART.w - CHART.padR}
                y1={yScale(90)}
                y2={yScale(90)}
                stroke="#c1121f"
                strokeWidth={1.5}
                strokeDasharray="6 6"
              />
              <text
                x={CHART.w - CHART.padR - 6}
                y={yScale(90) - 8}
                fontSize="10"
                fill="#c1121f"
                fontFamily="CSGenioMono, monospace"
                textAnchor="end"
                fontWeight="700"
                letterSpacing="1.2"
              >
                MONTH-6 · 90%
              </text>

              {/* Y-axis line */}
              <line
                x1={CHART.padL}
                x2={CHART.padL}
                y1={CHART.padT}
                y2={CHART.h - CHART.padB}
                stroke="#003049"
                strokeWidth={1.5}
              />
              {/* X-axis line */}
              <line
                x1={CHART.padL}
                x2={CHART.w - CHART.padR}
                y1={CHART.h - CHART.padB}
                y2={CHART.h - CHART.padB}
                stroke="#003049"
                strokeWidth={1.5}
              />

              {/* Series line */}
              <path
                d={linePath}
                fill="none"
                stroke="#003049"
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Data points */}
              {ACCURACY_SERIES.map((p) => (
                <circle
                  key={`pt-${p.week}`}
                  cx={xScale(p.week)}
                  cy={yScale(p.pct)}
                  r={3.5}
                  fill="#003049"
                />
              ))}

              {/* NOW marker */}
              <circle
                cx={currentX}
                cy={currentY}
                r={10}
                fill="none"
                stroke="#c1121f"
                strokeWidth={2}
              />
              <circle cx={currentX} cy={currentY} r={4} fill="#c1121f" />
              <line
                x1={currentX}
                y1={currentY + 14}
                x2={currentX}
                y2={currentY + 36}
                stroke="#c1121f"
                strokeWidth={1.2}
                strokeDasharray="2 3"
              />
              <text
                x={currentX}
                y={currentY + 52}
                fontSize="11"
                fill="#c1121f"
                fontFamily="CSGenioMono, monospace"
                textAnchor="middle"
                fontWeight="700"
                letterSpacing="1.2"
              >
                NOW · {current.pct}%
              </text>
            </svg>

            <div className="coa-chart__legend">
              <span>
                <span
                  className="coa-chart__legend-dot"
                  style={{ background: "#003049" }}
                />
                Weekly auto-verify accuracy
              </span>
              <span>
                <span
                  className="coa-chart__legend-dot"
                  style={{ background: "#c1121f" }}
                />
                NOW · W{current.week} · {current.pct}%
              </span>
              <span>
                <span
                  className="coa-chart__legend-dot"
                  style={{ background: "#669bbc" }}
                />
                Floor target 75%
              </span>
              <span>
                <span
                  className="coa-chart__legend-dot"
                  style={{ background: "#c9a96e" }}
                />
                Month-3 target 85%
              </span>
              <span>
                <span
                  className="coa-chart__legend-dot"
                  style={{ background: "#c1121f" }}
                />
                Month-6 target 90%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── §2 Verdict breakdown ───────── */}
      <section className="coa-section reveal">
        <div className="container">
          <span className="coa-s-label">
            <span className="coa-rule" />
            §2 · Verdict breakdown
          </span>
          <h2>Where each event lands, rolling 30 days.</h2>
          <p className="coa-section__lede">
            Distribution of every verification event processed by the
            ConversionOracle&trade; stack in the last 30 days. auto_verified +
            human_approved = the share of real customers we paid on. Manual
            review is the abstain queue.
          </p>

          <div
            className="coa-stack-bar"
            role="img"
            aria-label="Stacked 100% verdict distribution bar"
          >
            {VERDICT_DIST.map((v) => (
              <div
                key={v.id}
                className={`coa-stack-seg coa-stack-seg--${v.tone}`}
                style={{ width: `${v.pct}%` }}
                title={`${v.label} · ${v.pct}%`}
              >
                <span className="coa-stack-seg-pct">{v.pct}%</span>
              </div>
            ))}
          </div>

          <div className="coa-stack-legend">
            {VERDICT_DIST.map((v) => (
              <div
                key={v.id}
                className={`coa-stack-key coa-stack-key--${v.tone}`}
              >
                <span className="coa-stack-swatch" aria-hidden="true" />
                <span className="coa-stack-key-label">{v.label}</span>
                <span className="coa-stack-key-pct">{v.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── §3 Changelog ───────── */}
      <section className="coa-section reveal">
        <div className="container">
          <span className="coa-s-label coa-s-label--gold">
            <span className="coa-rule coa-rule--gold" />
            §3 · Changelog
          </span>
          <h2>What shipped, what moved the number.</h2>
          <p className="coa-section__lede">
            Every model, policy, and ops change that touched the stack. We do
            not silently edit prior numbers.
          </p>

          <ol className="coa-log">
            {CHANGELOG.map((e) => (
              <li key={e.date + e.title} className="coa-log-row">
                <div className="coa-log-meta">
                  <span className="coa-log-date">{e.date}</span>
                  <span className={`coa-log-kind coa-log-kind--${e.kind}`}>
                    {e.kind}
                  </span>
                </div>
                <div className="coa-log-body">
                  <h3 className="coa-log-title">{e.title}</h3>
                  <p className="coa-log-note">{e.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="coa-cta">
        <div className="container">
          <h2>Audit us. Then decide.</h2>
          <div className="coa-cta__row">
            <Link href="/conversion-oracle" className="coa-btn coa-btn--ghost">
              Back to ConversionOracle&trade;
            </Link>
            <Link href="/merchant/pilot" className="coa-btn coa-btn--primary">
              Start $0 Pilot
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
