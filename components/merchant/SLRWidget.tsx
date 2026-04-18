"use client";

import { useMemo } from "react";
import styles from "./SLRWidget.module.css";

/* ── Types ──────────────────────────────────────────────────── */
export type SLRTargetPoint = { month: number; target: number };
export type SLRActualPoint = { month: number; actual: number };

export type SLRWidgetProps = {
  /** Current Software Leverage Ratio — active campaigns ÷ ops FTE */
  currentSLR?: number;
  /** Target trajectory month-over-month */
  targetByMonth?: SLRTargetPoint[];
  /** Optional actuals to overlay against the target curve */
  actualByMonth?: SLRActualPoint[];
  /** Industry baseline range — defaults to 3-5 (influencer shops) */
  industryBaselineMin?: number;
  industryBaselineMax?: number;
};

/* ── Defaults ───────────────────────────────────────────────── */
// Push v5.1 SLR milestones: Month 3 = 8 · Month 6 = 12 · Month 12 = 25 · Month 24 = 50
const DEFAULT_TARGETS: SLRTargetPoint[] = [
  { month: 1, target: 3 },
  { month: 2, target: 5 },
  { month: 3, target: 8 },
  { month: 4, target: 9 },
  { month: 5, target: 10 },
  { month: 6, target: 12 },
  { month: 7, target: 14 },
  { month: 8, target: 16 },
  { month: 9, target: 19 },
  { month: 10, target: 21 },
  { month: 11, target: 23 },
  { month: 12, target: 25 },
  { month: 15, target: 31 },
  { month: 18, target: 37 },
  { month: 21, target: 43 },
  { month: 24, target: 50 },
];

const MILESTONE_MONTHS = [3, 6, 12, 24];

/* ── Component ──────────────────────────────────────────────── */
export default function SLRWidget({
  currentSLR = 8,
  targetByMonth = DEFAULT_TARGETS,
  actualByMonth,
  industryBaselineMin = 3,
  industryBaselineMax = 5,
}: SLRWidgetProps) {
  // Chart geometry
  const W = 640;
  const H = 220;
  const padL = 40;
  const padR = 16;
  const padT = 16;
  const padB = 32;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const { targetPath, targetDots, actualPath, actualDots, xTicks, yTicks } =
    useMemo(() => {
      const sorted = [...targetByMonth].sort((a, b) => a.month - b.month);
      if (sorted.length === 0) {
        return {
          targetPath: "",
          targetDots: [] as { x: number; y: number; month: number }[],
          actualPath: "",
          actualDots: [] as { x: number; y: number; month: number }[],
          xTicks: [] as { x: number; label: string }[],
          yTicks: [] as { y: number; label: string }[],
        };
      }
      const minMonth = sorted[0].month;
      const maxMonth = sorted[sorted.length - 1].month;
      const monthSpan = Math.max(1, maxMonth - minMonth);

      const maxTargetY = sorted.reduce((m, p) => Math.max(m, p.target), 0);
      const maxActualY = (actualByMonth ?? []).reduce(
        (m, p) => Math.max(m, p.actual),
        0,
      );
      const maxY = Math.max(maxTargetY, maxActualY, 1);
      // Round up to nearest 10 for clean y-axis
      const yCeil = Math.ceil(maxY / 10) * 10;

      const xFor = (month: number) =>
        padL + ((month - minMonth) / monthSpan) * plotW;
      const yFor = (val: number) => padT + plotH - (val / yCeil) * plotH;

      const targetCoords = sorted.map((p) => ({
        x: xFor(p.month),
        y: yFor(p.target),
        month: p.month,
      }));
      const tPath = targetCoords
        .map(
          (c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`,
        )
        .join(" ");

      const actualCoords = (actualByMonth ?? [])
        .slice()
        .sort((a, b) => a.month - b.month)
        .map((p) => ({
          x: xFor(p.month),
          y: yFor(p.actual),
          month: p.month,
        }));
      const aPath = actualCoords
        .map(
          (c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`,
        )
        .join(" ");

      // x ticks: show milestone months that fall inside the range + endpoints
      const tickMonths = Array.from(
        new Set([
          minMonth,
          ...MILESTONE_MONTHS.filter((m) => m >= minMonth && m <= maxMonth),
          maxMonth,
        ]),
      ).sort((a, b) => a - b);
      const xT = tickMonths.map((m) => ({ x: xFor(m), label: `M${m}` }));

      // y ticks: 0, 1/2, max
      const yT = [0, Math.round(yCeil / 2), yCeil].map((v) => ({
        y: yFor(v),
        label: String(v),
      }));

      return {
        targetPath: tPath,
        targetDots: targetCoords.filter((c) =>
          MILESTONE_MONTHS.includes(c.month),
        ),
        actualPath: aPath,
        actualDots: actualCoords,
        xTicks: xT,
        yTicks: yT,
      };
    }, [targetByMonth, actualByMonth, plotW, plotH]);

  // Milestone cells (Month 3/6/12/24)
  const milestones = MILESTONE_MONTHS.map((m) => {
    const t = targetByMonth.find((p) => p.month === m);
    return {
      month: m,
      target: t?.target ?? null,
    };
  });

  return (
    <section
      className={styles.widget}
      aria-label="Software Leverage Ratio dashboard"
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>Operator Leverage</p>
          <h2 className={styles.title}>Software Leverage Ratio (SLR)</h2>
          <p className={styles.subtitle}>
            Active campaigns divided by ops FTE — the core efficiency metric for
            Vertical AI for Local Commerce.
          </p>
        </div>
        <div className={styles.categoryTag}>
          <span className={styles.categoryDot} aria-hidden="true" />
          v5.1 North-Star
        </div>
      </header>

      {/* Body: big number + chart */}
      <div className={styles.body}>
        {/* Big number panel */}
        <div className={styles.bigNumber}>
          <p className={styles.bigNumberLabel}>Current SLR</p>
          <p className={styles.bigNumberValue}>
            {currentSLR.toLocaleString(undefined, {
              maximumFractionDigits: currentSLR % 1 === 0 ? 0 : 1,
            })}
          </p>
          <p className={styles.bigNumberFoot}>campaigns per ops FTE</p>
          <hr className={styles.divider} />
          <p className={styles.baselineCaption}>
            Industry baseline: influencer shops run{" "}
            <strong>
              {industryBaselineMin}-{industryBaselineMax}
            </strong>{" "}
            campaigns per operator. Push SLR targets compound this through
            Vertical AI for Local Commerce automation.
          </p>
        </div>

        {/* Chart panel */}
        <div className={styles.chartPanel}>
          <div className={styles.chartHeader}>
            <p className={styles.chartTitle}>
              SLR Trajectory · Month-over-Month
            </p>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span
                  className={`${styles.legendSwatch} ${styles.legendSwatchTarget}`}
                />
                Target
              </span>
              {actualByMonth && actualByMonth.length > 0 && (
                <span className={styles.legendItem}>
                  <span
                    className={`${styles.legendSwatch} ${styles.legendSwatchActual}`}
                  />
                  Actual
                </span>
              )}
            </div>
          </div>

          <svg
            className={styles.chartSvg}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="SLR target trajectory chart"
            preserveAspectRatio="none"
          >
            {/* Horizontal grid lines */}
            {yTicks.map((t) => (
              <line
                key={`gy-${t.label}`}
                className={styles.chartGrid}
                x1={padL}
                x2={W - padR}
                y1={t.y}
                y2={t.y}
              />
            ))}

            {/* Y-axis */}
            <line
              className={styles.chartAxis}
              x1={padL}
              x2={padL}
              y1={padT}
              y2={H - padB}
            />
            {/* X-axis */}
            <line
              className={styles.chartAxis}
              x1={padL}
              x2={W - padR}
              y1={H - padB}
              y2={H - padB}
            />

            {/* Y-axis labels */}
            {yTicks.map((t) => (
              <text
                key={`yl-${t.label}`}
                className={styles.chartLabel}
                x={padL - 6}
                y={t.y + 3}
                textAnchor="end"
              >
                {t.label}
              </text>
            ))}

            {/* X-axis labels */}
            {xTicks.map((t) => (
              <text
                key={`xl-${t.label}`}
                className={styles.chartAxisLabel}
                x={t.x}
                y={H - padB + 16}
                textAnchor="middle"
              >
                {t.label}
              </text>
            ))}

            {/* Target line */}
            {targetPath && (
              <path className={styles.chartTargetLine} d={targetPath} />
            )}

            {/* Target milestone dots */}
            {targetDots.map((d) => (
              <circle
                key={`td-${d.month}`}
                className={styles.chartTargetDot}
                cx={d.x}
                cy={d.y}
                r={3.5}
              />
            ))}

            {/* Actual line */}
            {actualPath && (
              <path className={styles.chartActualLine} d={actualPath} />
            )}

            {/* Actual dots */}
            {actualDots.map((d) => (
              <circle
                key={`ad-${d.month}`}
                className={styles.chartActualDot}
                cx={d.x}
                cy={d.y}
                r={4}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Milestone targets row */}
      <div className={styles.milestoneGrid}>
        {milestones.map((m) => (
          <div key={m.month} className={styles.milestoneCell}>
            <div className={styles.milestoneLabel}>Month {m.month}</div>
            <div className={styles.milestoneValue}>
              {m.target !== null ? m.target : "—"}
            </div>
            <div className={styles.milestoneSub}>campaigns / FTE target</div>
          </div>
        ))}
      </div>
    </section>
  );
}
