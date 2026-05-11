"use client";

/* ============================================================
   /creator/work/velocity — Velocity (in-register chart)
   v1 · 2026-05-08

   Reached from the Work hub "Velocity" full-width panel. Stays
   INSIDE the Work register (audit § 3 finding 05 — was leaking
   into /creator/analytics/campaigns). Three views:

     1. Velocity over time (gigs / week, 30/90/all)
     2. Time-by-stage breakdown (where the hours go)
     3. Cohort percentile (vs same-tier creators)
   ============================================================ */

import TimeChart from "@/components/shared/charts/TimeChart";
import {
  StageShell,
  StageHeader,
  StageCard,
  StageTwoCol,
  StageMain,
  StageRail,
  StageRailCard,
  StageStat,
} from "@/components/shared/stage";
import "./velocity.css";

const STAGE_HOURS = [
  { stage: "Discover · Qualify", hours: 4.5, pct: 12 },
  { stage: "Apply", hours: 1.2, pct: 3 },
  { stage: "Confirmed · prep", hours: 2.8, pct: 7 },
  { stage: "Shoot", hours: 18.6, pct: 49 },
  { stage: "Submit", hours: 6.2, pct: 16 },
  { stage: "Wrap", hours: 4.7, pct: 13 },
];

export default function VelocityPage() {
  return (
    <StageShell
      backHref="/creator/work"
      backLabel="← Back to work"
      ariaLabel="Work velocity"
      showJourney={false}
    >
      <StageHeader
        eyebrow="Work · velocity"
        title="Where your time goes."
        sub="Gigs completed per week with prior-period overlay, plus a stage-by-stage hour breakdown so you can see exactly where you spend your time. Cohort percentile on the right."
      />

      <StageTwoCol>
        <StageMain>
          <StageCard
            eyebrow="Velocity"
            title="Gigs completed · 30 days"
            full
          >
            <TimeChart
              mode="bar"
              accent="ink"
              valueSuffix=" gigs"
              defaultPeriod="30d"
              data={{
                "7d": [1, 2, 1, 3, 2, 2, 1],
                "30d": Array.from({ length: 30 }, (_, i) =>
                  Math.max(0, Math.round(2 + Math.sin(i * 0.7) * 1.5 + i * 0.05)),
                ),
                "90d": Array.from({ length: 12 }, (_, i) =>
                  Math.max(2, Math.round(6 + Math.sin(i * 0.5) * 3 + i * 0.4)),
                ),
                all: Array.from({ length: 12 }, (_, i) =>
                  Math.max(4, Math.round(8 + Math.cos(i * 0.4) * 4 + i * 0.7)),
                ),
              }}
              priorData={{
                "7d": [1, 1, 1, 2, 1, 2, 1],
                "30d": Array.from({ length: 30 }, (_, i) =>
                  Math.max(0, Math.round(1.5 + Math.sin(i * 0.7) * 1.2)),
                ),
                "90d": Array.from({ length: 12 }, (_, i) =>
                  Math.max(1, Math.round(4 + Math.sin(i * 0.5) * 2)),
                ),
                all: Array.from({ length: 12 }, (_, i) =>
                  Math.max(3, Math.round(6 + Math.cos(i * 0.4) * 3)),
                ),
              }}
              labels={{
                "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                "30d": Array.from({ length: 30 }, (_, i) =>
                  i % 5 === 0 ? `D${i + 1}` : "",
                ),
                "90d": ["Wk1", "Wk2", "Wk3", "Wk4", "Wk5", "Wk6", "Wk7", "Wk8", "Wk9", "Wk10", "Wk11", "Wk12"],
                all: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              }}
              ariaLabel="Gigs completed velocity"
            />
          </StageCard>

          <StageCard
            eyebrow="Time-by-stage"
            title={`38 hrs · last 7 gigs`}
            full
          >
            <ul className="vel__stages">
              {STAGE_HOURS.map((s) => (
                <li key={s.stage} className="vel__stage">
                  <span className="vel__stage-label">{s.stage}</span>
                  <span className="vel__stage-track">
                    <span
                      className="vel__stage-fill"
                      style={{ width: `${s.pct}%` }}
                    />
                  </span>
                  <span className="vel__stage-num">{s.hours.toFixed(1)}h</span>
                  <span className="vel__stage-pct">{s.pct}%</span>
                </li>
              ))}
            </ul>
            <p className="vel__note">
              Shoot dominates · 49% of total. If your hourly rate slipped vs cohort, the lever is usually <strong>Shoot</strong> — pre-scout location, batch frames, cut commute.
            </p>
          </StageCard>
        </StageMain>

        <StageRail ariaLabel="Cohort summary">
          <StageRailCard variant="primary" label="This month">
            <StageStat size="xl" num="8" label="Gigs completed" helper="+33% vs last month" />
          </StageRailCard>
          <StageRailCard label="Cohort percentile">
            <StageStat size="lg" num="78%" label="Top quartile" helper="vs same-tier creators" />
          </StageRailCard>
          <StageRailCard label="Effective rate">
            <StageStat size="lg" num="$72/hr" label="Median this month" helper="cohort avg $58/hr" />
          </StageRailCard>
        </StageRail>
      </StageTwoCol>
    </StageShell>
  );
}
