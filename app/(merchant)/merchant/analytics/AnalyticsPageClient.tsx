"use client";

import { useMemo, useState } from "react";
import { EmptyState, KPICard, PageHeader } from "@/components/merchant/shared";
import type { AttributionSummary } from "@/lib/data/api-client";
import "./analytics.css";

interface AnalyticsPageClientProps {
  summary: AttributionSummary;
  previous: AttributionSummary;
  windowDays: number;
}

type RangeKey = "7d" | "30d" | "90d";

function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateLabel(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Percentage delta vs prior window. Returns null when the prior is zero
// — Infinity / NaN should never reach the UI as a delta.
function pctDelta(current: number, prior: number): number | null {
  if (!Number.isFinite(prior) || prior === 0) return null;
  return ((current - prior) / prior) * 100;
}

function formatDelta(value: number | null): string {
  if (value === null) return "— vs prior";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "±";
  return `${sign}${Math.abs(value).toFixed(1)}% vs prior`;
}

function ByDayChart({
  data,
}: {
  data: Array<{ date: string; scans: number; verified: number }>;
}) {
  if (data.length === 0) {
    return (
      <div className="an-empty-wrap">
        <EmptyState
          title="No conversions in this window"
          description="New attributed activity will appear here."
        />
      </div>
    );
  }

  const maxVerified = Math.max(...data.map((point) => point.verified), 1);
  const peakIndex = data.findIndex((point) => point.verified === maxVerified);

  return (
    <div
      className="an-chart"
      role="img"
      aria-label="Attributed conversions by day"
    >
      {data.map((point, index) => {
        const height = Math.max(8, (point.verified / maxVerified) * 100);
        const isPeak = index === peakIndex && point.verified > 0;
        return (
          <div
            key={point.date}
            className={`an-chart-item${isPeak ? " an-chart-item--peak" : ""}`}
          >
            <button
              type="button"
              className="an-chart-track"
              aria-label={`${formatDateLabel(point.date)} — ${point.verified} conversions, ${point.scans} scans`}
            >
              <span className="an-chart-tooltip" role="tooltip">
                <strong>{point.verified}</strong> conversions
                <em>·</em>
                {point.scans} scans
              </span>
              <div className="an-chart-bar" style={{ height: `${height}%` }} />
            </button>
            <span className="an-chart-label">
              {formatDateLabel(point.date)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const RANGE_OPTIONS: ReadonlyArray<{
  key: RangeKey;
  label: string;
  days: number;
}> = [
  { key: "7d", label: "7D", days: 7 },
  { key: "30d", label: "30D", days: 30 },
  { key: "90d", label: "90D", days: 90 },
];

export default function AnalyticsPageClient({
  summary,
  previous,
  windowDays,
}: AnalyticsPageClientProps) {
  const creatorRows = useMemo(
    () =>
      [...summary.by_creator].sort(
        (left, right) => right.revenue - left.revenue,
      ),
    [summary.by_creator],
  );
  const hasNoConversionData =
    summary.verified_customers === 0 && summary.scans === 0;

  // Range selector is visual-only for now — server fetches a fixed window.
  // Once the data pipeline accepts dynamic ranges, swap this for a router push.
  const initialRange: RangeKey =
    windowDays === 7 ? "7d" : windowDays === 90 ? "90d" : "30d";
  const [range, setRange] = useState<RangeKey>(initialRange);

  const deltas = useMemo(
    () => ({
      conversions: pctDelta(
        summary.verified_customers,
        previous.verified_customers,
      ),
      revenue: pctDelta(
        summary.revenue_attributed,
        previous.revenue_attributed,
      ),
      roi: pctDelta(summary.roi, previous.roi),
      creators: pctDelta(summary.by_creator.length, previous.by_creator.length),
      fraud: pctDelta(summary.fraud_flags, previous.fraud_flags),
    }),
    [summary, previous],
  );

  const totalRevenueUsd = summary.revenue_attributed / 100;
  const previousRevenueUsd = previous.revenue_attributed / 100;
  const revenueLift = totalRevenueUsd - previousRevenueUsd;

  const action = (
    <div className="an-controls">
      <div className="an-segmented" role="tablist" aria-label="Time range">
        {RANGE_OPTIONS.map((option) => {
          const selected = option.key === range;
          const disabled = option.days !== windowDays;
          return (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-disabled={disabled}
              className={`an-segmented-item${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`}
              onClick={() => {
                if (!disabled) setRange(option.key);
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="an-export"
        aria-label="Export analytics CSV"
      >
        Export
      </button>
    </div>
  );

  return (
    <div className="an-page">
      <PageHeader
        eyebrow="PERFORMANCE"
        title="Analytics"
        subtitle="Track ROI, conversions, creator performance, and fraud signals across all campaigns."
        action={action}
      />

      <section className="an-kpis" aria-label="Overview metrics">
        <KPICard
          label="Total Conversions"
          value={summary.verified_customers}
          delta={formatDelta(deltas.conversions)}
          deltaPositive={(deltas.conversions ?? 0) >= 0}
          delay={40}
        />
        <KPICard
          label="Revenue Attributed"
          value={formatUsd(totalRevenueUsd)}
          delta={formatDelta(deltas.revenue)}
          deltaPositive={(deltas.revenue ?? 0) >= 0}
          delay={100}
        />
        <KPICard
          label="Blended ROI"
          value={`${summary.roi}x`}
          delta={formatDelta(deltas.roi)}
          deltaPositive={(deltas.roi ?? 0) >= 0}
          variant="accent"
          delay={160}
        />
        <KPICard
          label="Active Creators"
          value={summary.by_creator.length}
          delta={formatDelta(deltas.creators)}
          deltaPositive={(deltas.creators ?? 0) >= 0}
          delay={220}
        />
        <KPICard
          label="Fraud Rate"
          value={summary.fraud_flags}
          delta={formatDelta(deltas.fraud)}
          deltaPositive={(deltas.fraud ?? 0) <= 0}
          delay={280}
        />
      </section>

      <section className="an-section" aria-labelledby="roi-title">
        <div className="an-section-head">
          <p className="an-eyebrow">TIME SERIES</p>
          <h2 id="roi-title">Attributed conversions</h2>
        </div>

        <div className="an-chart-frame">
          {hasNoConversionData ? (
            <div className="an-empty-wrap">
              <EmptyState
                title="NO CONVERSIONS YET"
                description="Data appears here once creators drive verified visits."
              />
            </div>
          ) : (
            <>
              <ByDayChart data={summary.by_day} />
              <aside className="an-glass-tile" aria-label="Period revenue lift">
                <p className="an-glass-tile__eyebrow">REVENUE LIFT</p>
                <p className="an-glass-tile__numeral">
                  {revenueLift >= 0 ? "+" : "−"}
                  {formatUsd(Math.abs(revenueLift))}
                </p>
                <p className="an-glass-tile__caption">
                  vs prior {windowDays}-day window
                </p>
              </aside>
            </>
          )}
        </div>
      </section>

      <section
        className="an-section"
        aria-labelledby="creator-leaderboard-title"
      >
        <div className="an-section-head">
          <p className="an-eyebrow">BY CREATOR</p>
          <h2 id="creator-leaderboard-title">Creator Leaderboard</h2>
        </div>
        {hasNoConversionData ? (
          <div className="an-empty-wrap">
            <EmptyState title="NO ATTRIBUTED CREATORS YET" />
          </div>
        ) : summary.by_creator.length === 0 ? (
          <div className="an-empty-wrap">
            <EmptyState
              title="NO ATTRIBUTED CREATORS YET"
              description="Creator performance appears after verified activity."
            />
          </div>
        ) : (
          <div className="an-creator-leaderboard">
            {creatorRows.map((creator, index) => (
              <article key={creator.creator_id} className="an-leaderboard-item">
                <p
                  className={`an-leaderboard-rank${index < 3 ? " an-leaderboard-rank--top" : ""}`}
                >
                  {index + 1}
                </p>
                <div className="an-leaderboard-main">
                  <p className="an-leaderboard-handle">{creator.creator_id}</p>
                  <div className="an-leaderboard-stats">
                    <div>
                      <span>SCANS</span>
                      <strong>{creator.scans}</strong>
                    </div>
                    <div>
                      <span>VERIFIED</span>
                      <strong>{creator.verified}</strong>
                    </div>
                    <div>
                      <span>REVENUE</span>
                      <strong>{formatUsd(creator.revenue / 100)}</strong>
                    </div>
                    <div>
                      <span>ROI</span>
                      <strong>{creator.roi.toFixed(1)}x</strong>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style jsx global>{`
        .an-page .ms-kpi-card-value {
          overflow-wrap: break-word;
          font-variant-numeric: tabular-nums;
        }

        @media (max-width: 1240px) {
          .an-page .ms-kpi-card-value {
            font-size: clamp(36px, 4vw, 56px);
          }
        }
      `}</style>
    </div>
  );
}
