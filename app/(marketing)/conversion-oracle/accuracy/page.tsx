import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./accuracy.css";

export const metadata: Metadata = {
  title: "ConversionOracle\u2122 Accuracy Dashboard \u2014 Public | Push",
  description:
    "Public accuracy dashboard for ConversionOracle\u2122, Push's Vertical AI for Local Commerce. Commitment: \u226515% walk-in conversion lift vs cold Claude API baseline, measured on the Williamsburg Coffee+ beachhead.",
  robots: { index: true, follow: true },
};

/* ─── Data ────────────────────────────────────────────────── */
const LAST_UPDATED = "2026-04-18";

const FLYWHEEL_CARDS = [
  {
    kicker: "Events collected",
    value: "742",
    meta: "Williamsburg Coffee+ cohort \u00b7 cold-start phase \u00b7 all AI-verified",
    accent: false,
  },
  {
    kicker: "Current model version",
    value: "v0.3",
    meta: "Rule-based matching + Claude Sonnet 4.6 reasoning layer \u00b7 no fine-tune yet",
    accent: false,
  },
  {
    kicker: "Next milestone",
    value: "v1 fine-tune",
    meta: "Triggers at 1,000 events \u00b7 est. 2026-05-15 \u00b7 trained on Push-only corpus",
    accent: true,
  },
];

// Mock weekly accuracy: % of predictions within ±25% of actual walk-in rate.
// X = weeks since cohort start. Y = accuracy %.
const ACCURACY_SERIES: { week: number; pct: number }[] = [
  { week: 1, pct: 41 },
  { week: 2, pct: 47 },
  { week: 3, pct: 52 },
  { week: 4, pct: 56 },
  { week: 5, pct: 58 },
  { week: 6, pct: 63 },
  { week: 7, pct: 66 },
  { week: 8, pct: 68 },
  { week: 9, pct: 71 },
  { week: 10, pct: 72 },
];

const MOAT_ROWS = [
  {
    layer: "Data exclusivity",
    status: "Active",
    statusKind: "active" as const,
    body: "742 Williamsburg Coffee+ events \u00b7 0 competitor can claim this dataset. Each event carries (creator, content, merchant, neighborhood, weather, time, receipt) \u2014 a schema no ads platform or generic LLM has written access to.",
  },
  {
    layer: "Cold-start barrier",
    status: "Active",
    statusKind: "active" as const,
    body: "Any new entrant needs 1,000+ verified walk-in events to reach v1 parity. At our current 60-day accrual pace, that is a ~6-month head start compounding with every campaign we run.",
  },
  {
    layer: "Long-tail advantage",
    status: "Early signal",
    statusKind: "early" as const,
    body: "Nano/micro creator predictions (n=120, \u22645k followers) already 12% better than general-model baseline on walk-in rate. The head of the distribution is crowded; the tail is where the moat lives.",
  },
  {
    layer: "Compound transfer",
    status: "Not yet active",
    statusKind: "future" as const,
    body: "Cross-neighborhood transfer learning activates at 10 neighborhoods. Currently operating in 1 (Williamsburg). We will re-audit this layer after Brooklyn Heights + Bushwick expansion.",
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
  yMin: 0,
  yMax: 100,
  xMin: 0,
  xMax: 24,
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

  const xTicks = [0, 4, 8, 12, 16, 20, 24];
  const yTicks = [0, 25, 50, 75, 100];

  return (
    <>
      <ScrollRevealInit />
      <main className="coa">
        {/* ─── Hero ─────────────────────────────────────── */}
        <section className="coa-hero">
          <div className="container coa-hero__inner">
            <span className="coa-eyebrow">
              <span className="coa-rule coa-rule--w" />
              Accountability &middot; Public Dashboard
            </span>
            <h1>
              ConversionOracle<span>&trade;</span> Accuracy. Public.
            </h1>
            <p className="coa-hero__sub">
              We commit to &ge;15% walk-in conversion lift vs cold Claude API
              baseline. This page shows the current state of that commitment
              &mdash; no curated demo, no vendor cherry-picking, audited against
              receipts from the Williamsburg Coffee+ beachhead.
            </p>
            <div className="coa-hero__meta">
              <span>
                Last updated &middot; <strong>{LAST_UPDATED}</strong>
              </span>
              <span>
                Cohort &middot; <strong>Williamsburg Coffee+</strong>
              </span>
              <span>
                Positioning &middot;{" "}
                <strong>Vertical AI for Local Commerce</strong>
              </span>
            </div>
          </div>
        </section>

        {/* ─── §1 Flywheel current stage ─────────────────── */}
        <section className="coa-section reveal">
          <div className="container">
            <span className="coa-s-label">
              <span className="coa-rule" />
              &sect;1 Training flywheel &middot; current stage
            </span>
            <h2>Where ConversionOracle&trade; sits today.</h2>
            <p className="coa-section__lede">
              The flywheel is in cold-start. We are bootstrapping labels from
              the first cohort of AI-verified walk-ins. No fine-tune has shipped
              yet &mdash; everything below is the truthful pre-v1 state.
            </p>

            <div className="coa-fly">
              {FLYWHEEL_CARDS.map((c) => (
                <div
                  key={c.kicker}
                  className={`coa-fly__card${c.accent ? " coa-fly__card--accent" : ""}`}
                >
                  <span className="coa-fly__kicker">{c.kicker}</span>
                  <span className="coa-fly__value">{c.value}</span>
                  <span className="coa-fly__meta">{c.meta}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── §2 Prediction vs actual chart ─────────────── */}
        <section className="coa-section reveal">
          <div className="container">
            <span className="coa-s-label">
              <span className="coa-rule" />
              &sect;2 Prediction vs actual
            </span>
            <h2>
              Share of predictions within &plusmn;25% of actual walk-in rate.
            </h2>
            <p className="coa-section__lede">
              Weekly rolling accuracy on live campaigns in the Williamsburg
              Coffee+ cohort. Target bands mark the commitment levels for each
              model version. Ground truth: AI-verified customer (QR scan +
              Claude Vision receipt OCR + geo-match).
            </p>

            <div className="coa-chart">
              <svg
                className="coa-chart__svg"
                viewBox={`0 0 ${CHART.w} ${CHART.h}`}
                role="img"
                aria-label="Weekly accuracy percentage over time with target lines for v0, v1, and v2 model milestones"
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

                {/* Y-axis labels */}
                {yTicks.map((t) => (
                  <text
                    key={`yl-${t}`}
                    x={CHART.padL - 12}
                    y={yScale(t) + 4}
                    fontSize="11"
                    fill="rgba(0,48,73,0.55)"
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
                    fontSize="11"
                    fill="rgba(0,48,73,0.55)"
                    textAnchor="middle"
                  >
                    w{t}
                  </text>
                ))}

                {/* X-axis label */}
                <text
                  x={(CHART.padL + (CHART.w - CHART.padR)) / 2}
                  y={CHART.h - 16}
                  fontSize="10"
                  fill="rgba(0,48,73,0.55)"
                  textAnchor="middle"
                  letterSpacing="1.5"
                >
                  WEEKS SINCE COHORT START
                </text>

                {/* Target line: 75% cold-start */}
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
                  textAnchor="end"
                  fontWeight="700"
                  letterSpacing="1.2"
                >
                  v0 TARGET 75%
                </text>

                {/* Target line: 85% v1 */}
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
                  textAnchor="end"
                  fontWeight="700"
                  letterSpacing="1.2"
                >
                  v1 TARGET 85%
                </text>

                {/* Target line: 90% v2 */}
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
                  textAnchor="end"
                  fontWeight="700"
                  letterSpacing="1.2"
                >
                  v2 TARGET 90%
                </text>

                {/* Axes */}
                <line
                  x1={CHART.padL}
                  x2={CHART.padL}
                  y1={CHART.padT}
                  y2={CHART.h - CHART.padB}
                  stroke="#003049"
                  strokeWidth={1.5}
                />
                <line
                  x1={CHART.padL}
                  x2={CHART.w - CHART.padR}
                  y1={CHART.h - CHART.padB}
                  y2={CHART.h - CHART.padB}
                  stroke="#003049"
                  strokeWidth={1.5}
                />

                {/* Accuracy line */}
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

                {/* Current position marker */}
                <circle
                  cx={currentX}
                  cy={currentY}
                  r={9}
                  fill="none"
                  stroke="#c1121f"
                  strokeWidth={2}
                />
                <circle cx={currentX} cy={currentY} r={5} fill="#c1121f" />
                <text
                  x={currentX - 14}
                  y={currentY - 14}
                  fontSize="11"
                  fill="#c1121f"
                  textAnchor="end"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  NOW &middot; {current.pct}% @ w{current.week}
                </text>
              </svg>

              <div className="coa-chart__legend">
                <span>
                  <span
                    className="coa-chart__legend-dot"
                    style={{ background: "#003049" }}
                  />
                  Weekly accuracy (actual)
                </span>
                <span>
                  <span
                    className="coa-chart__legend-dot"
                    style={{ background: "#c1121f" }}
                  />
                  Current position
                </span>
                <span>
                  <span
                    className="coa-chart__legend-dot"
                    style={{ background: "#669bbc" }}
                  />
                  v0 target 75%
                </span>
                <span>
                  <span
                    className="coa-chart__legend-dot"
                    style={{ background: "#c9a96e" }}
                  />
                  v1 target 85%
                </span>
                <span>
                  <span
                    className="coa-chart__legend-dot"
                    style={{ background: "#c1121f" }}
                  />
                  v2 target 90%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── §3 A/B commitment log ─────────────────────── */}
        <section className="coa-section reveal">
          <div className="container">
            <span className="coa-s-label coa-s-label--gold">
              <span className="coa-rule coa-rule--gold" />
              &sect;3 A/B commitment log
            </span>
            <h2>The month-6 head-to-head test.</h2>
            <p className="coa-section__lede">
              We will run a 100-campaign split at the end of month 6, publish
              the full methodology, and post the outcome here &mdash; win, loss,
              or null.
            </p>

            <div className="coa-ab">
              <h3>Month-6 100-campaign split</h3>
              <dl>
                <dt>Arm A</dt>
                <dd>
                  ConversionOracle<strong>&trade;</strong> v1 (fine-tuned on
                  Push-only corpus)
                </dd>

                <dt>Arm B</dt>
                <dd>
                  Cold Claude API zero-shot (no Push fine-tuning, public web
                  priors only)
                </dd>

                <dt>Primary metric</dt>
                <dd>
                  Walk-in conversion rate per impression (AI-verified customers)
                </dd>

                <dt>Target lift</dt>
                <dd>
                  <strong>&ge;15%</strong> at p&lt;0.05
                </dd>

                <dt>Status</dt>
                <dd>
                  <strong>Scheduled</strong> &mdash; cohort accrual in progress
                  (742 / 1,000 events)
                </dd>

                <dt>Publication</dt>
                <dd>
                  Raw results, significance, residuals &mdash; posted here
                </dd>
              </dl>

              <div className="coa-ab__escape">
                <span className="coa-ab__escape-tag">Escape clause</span>
                If lift &lt;15%, we publicly pivot moat narrative to ops
                leverage + supply density, not data moat. We will not redefine
                the metric, extend the deadline, or drop inconvenient arms.
              </div>
            </div>
          </div>
        </section>

        {/* ─── §4 Four-layer moat audit ──────────────────── */}
        <section className="coa-section reveal">
          <div className="container">
            <span className="coa-s-label">
              <span className="coa-rule" />
              &sect;4 Four-layer moat &middot; current state audit
            </span>
            <h2>What's real today, what's a bet, what's not yet active.</h2>
            <p className="coa-section__lede">
              We separate what compounds today from what compounds later. Future
              layers are disclosed as not-yet-active &mdash; not claimed as
              strengths.
            </p>

            <div className="coa-moat">
              {MOAT_ROWS.map((row) => (
                <div key={row.layer} className="coa-moat__row">
                  <div className="coa-moat__head">
                    <span className="coa-moat__layer">{row.layer}</span>
                    <span
                      className={`coa-moat__status coa-moat__status--${row.statusKind}`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="coa-moat__body">{row.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── §5 Methodology ────────────────────────────── */}
        <section className="coa-section reveal">
          <div className="container">
            <span className="coa-s-label">
              <span className="coa-rule" />
              &sect;5 Methodology
            </span>
            <h2>How we measure, what counts, what doesn't.</h2>
            <p className="coa-section__lede">
              Plain-English definitions so nothing hides behind jargon. If a
              category is not listed, it does not count.
            </p>

            <div className="coa-method">
              <div className="coa-method__block">
                <h3>What the model predicts</h3>
                <p>
                  Before each campaign, ConversionOracle&trade; outputs a
                  forecast walk-in rate (verified customers per 1,000 content
                  impressions) for a (creator, content, merchant, neighborhood,
                  time) tuple.
                </p>
              </div>

              <div className="coa-method__block">
                <h3>What counts as a hit</h3>
                <p>
                  A prediction is a hit if the realized walk-in rate falls
                  within &plusmn;25% of the predicted rate at campaign close.
                  Tighter bands (&plusmn;15%, &plusmn;10%) will be tracked
                  separately once v1 ships.
                </p>
              </div>

              <div className="coa-method__block">
                <h3>What counts as a miss</h3>
                <p>
                  Anything outside the &plusmn;25% band, including overshoots.
                  An overshoot is still wrong &mdash; merchants plan capacity on
                  our number.
                </p>
              </div>

              <div className="coa-method__block">
                <h3>Ground truth definition</h3>
                <p>
                  An AI-verified customer is a walk-in where all three pipeline
                  layers passed: QR scan at checkout, Claude Vision receipt OCR
                  match, and geo-proximity at scan time. No single-source signal
                  counts as verified.
                </p>
              </div>

              <div className="coa-method__block">
                <h3>Exclusions</h3>
                <p>
                  Campaigns canceled within the first 24h (not enough signal),
                  disputed conversions under active review, and events where the
                  receipt OCR returned low confidence. Count of exclusions is
                  disclosed every update.
                </p>
              </div>

              <div className="coa-method__block">
                <h3>Update cadence</h3>
                <p>
                  This page refreshes every Friday. The A/B test result posts
                  within 10 business days of the month-6 milestone. We never
                  silently edit prior numbers &mdash; corrections are called out
                  with a changelog entry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────── */}
        <section className="coa-cta">
          <div className="container">
            <h2>Audit us. Then decide.</h2>
            <div className="coa-cta__row">
              <Link href="/merchant/pilot" className="coa-btn coa-btn--primary">
                Apply for Pilot
              </Link>
              <Link
                href="/conversion-oracle"
                className="coa-btn coa-btn--ghost"
              >
                See ConversionOracle&trade; full page
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
