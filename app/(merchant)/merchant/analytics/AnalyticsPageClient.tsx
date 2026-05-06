/* ─────────────────────────────────────────────────────────────────────
 * Push · Merchant Analytics — Overview (v2.1 Bento + Liquid Glass)
 *
 * Bento of 8 modules · each Link → drilldown. Real AttributionSummary
 * data (server-fetched in page.tsx) + ExtendedSummary derivation layer
 * for fields not yet in API. iOS 26 atmosphere + glass via .an2-* shared
 * with creator analytics.
 *
 * Drilldowns:
 *   /roi · /spend · /creators · /funnel · /repeat ·
 *   /integrity · /trajectory · /decisions
 * ───────────────────────────────────────────────────────────────────── */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AttributionSummary } from "@/lib/data/api-client";
import {
  extendMerchantSummary,
  fmtUsd,
  fmtNum,
  pctDelta,
  formatDelta,
} from "./_data/extend";
import "./analytics.css";

interface Props {
  summary: AttributionSummary;
  previous: AttributionSummary;
  windowDays: number;
}

const PERIODS = [
  { key: "7d",  label: "7D",  days: 7 },
  { key: "30d", label: "30D", days: 30 },
  { key: "90d", label: "90D", days: 90 },
] as const;
type Period = typeof PERIODS[number]["key"];

export default function AnalyticsPageClient({ summary, previous, windowDays }: Props) {
  const [period, setPeriod] = useState<Period>(
    windowDays === 7 ? "7d" : windowDays === 90 ? "90d" : "30d"
  );

  const ext = useMemo(() => extendMerchantSummary(summary, windowDays), [summary, windowDays]);
  const extPrev = useMemo(() => extendMerchantSummary(previous, windowDays), [previous, windowDays]);

  const revenueDelta   = pctDelta(ext.revenue_attributed, extPrev.revenue_attributed);
  const roiDelta       = pctDelta(ext.roi, extPrev.roi);
  const verifiedDelta  = pctDelta(ext.verified_customers, extPrev.verified_customers);
  const repeatDelta    = pctDelta(ext.repeat_customers, extPrev.repeat_customers);

  const topCreators = useMemo(
    () => [...ext.by_creator].sort((a, b) => b.revenue - a.revenue).slice(0, 4),
    [ext.by_creator]
  );

  const trajectoryMax = Math.max(...ext.by_day.map(d => d.verified), 1);
  const sevColor = ext.recommendation.action;

  return (
    <div className="an2">
      {/* ─── Header ─── */}
      <header className="an2-header">
        <div className="an2-header__left">
          <p className="an2-eyebrow">
            <span className="pulse" aria-hidden /> Performance · last {windowDays} days
          </p>
          <h1 className="an2-title">Analytics</h1>
          <p className="an2-meta">
            ROI · attribution · creator performance · refreshed 2 min ago
          </p>
        </div>
        <div className="an2-header__right">
          <div className="an2-chips" role="tablist" aria-label="Time range">
            {PERIODS.map(p => {
              const disabled = p.days !== windowDays;
              return (
                <button
                  key={p.key}
                  role="tab"
                  aria-selected={period === p.key}
                  disabled={disabled}
                  className={"an2-chip" + (period === p.key ? " is-active" : "")}
                  onClick={() => !disabled && setPeriod(p.key)}
                  style={disabled ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
                >{p.label}</button>
              );
            })}
          </div>
          <Link href="/merchant/analytics/decisions" className="an2-export">
            Export ▾
          </Link>
        </div>
      </header>

      {/* ─── Bento ─── */}
      <div className="an2-bento">

        {/* ════════ ROI hero ════════ */}
        <Link href="/merchant/analytics/roi" className="an2-mod an2-mod--roi" aria-label="ROI detail">
          <div className="an2-roi">
            <div>
              <p className="an2-mod__eyebrow">Return on investment · {windowDays}d</p>
              <p className="an2-roi__big">
                {ext.roi.toFixed(1)}<span className="an2-roi__big-x">×</span>
              </p>
              <p className="an2-roi__delta">
                <span className="arrow">↑</span>{formatDelta(roiDelta, "vs prior period")}
              </p>
            </div>

            <div className="an2-roi__flow">
              <div className="an2-roi__flow-cell">
                <p className="an2-roi__flow-num muted">{fmtUsd(ext.spend_cents)}</p>
                <p className="an2-roi__flow-lbl">Spent</p>
              </div>
              <span className="an2-roi__flow-arrow" aria-hidden>→</span>
              <div className="an2-roi__flow-cell" style={{ textAlign: "right" }}>
                <p className="an2-roi__flow-num">{fmtUsd(ext.revenue_attributed)}</p>
                <p className="an2-roi__flow-lbl">Attributed revenue</p>
              </div>
            </div>

            <p className="an2-roi__caption">
              {fmtNum(ext.verified_customers)} verified · {fmtUsd(ext.cost_per_verified_cents, { decimals: 2 })} cost per visit
            </p>
          </div>
          <span className="an2-drill">ROI detail</span>
        </Link>

        {/* ════════ Spend ════════ */}
        <Link href="/merchant/analytics/spend" className="an2-mod an2-mod--spend" aria-label="Spend detail">
          <div className="an2-spend">
            <p className="an2-mod__eyebrow">Spend · this period</p>
            <p className="an2-spend__total">{fmtUsd(ext.spend_cents)}</p>
            <div className="an2-spend__split">
              <div
                className="an2-spend__split-seg sub"
                style={{ flex: ext.spend_breakdown.subscription_cents }}
                title={`Subscription ${fmtUsd(ext.spend_breakdown.subscription_cents, { decimals: 2 })}`}
              />
              <div
                className="an2-spend__split-seg promo"
                style={{ flex: ext.spend_breakdown.promo_cents }}
                title={`Promo ${fmtUsd(ext.spend_breakdown.promo_cents, { decimals: 2 })}`}
              />
              <div
                className="an2-spend__split-seg fee"
                style={{ flex: ext.spend_breakdown.platform_fee_cents }}
                title={`Platform fee ${fmtUsd(ext.spend_breakdown.platform_fee_cents, { decimals: 2 })}`}
              />
            </div>
            <div className="an2-spend__legend">
              <span>
                <span className="sw" style={{ background: "var(--ink)" }} />
                Sub {fmtUsd(ext.spend_breakdown.subscription_cents, { decimals: 2 })}
              </span>
              <span>
                <span className="sw" style={{ background: "var(--accent-blue)" }} />
                Promo {fmtUsd(ext.spend_breakdown.promo_cents)}
              </span>
              <span>
                <span className="sw" style={{ background: "var(--mist)" }} />
                Fee {fmtUsd(ext.spend_breakdown.platform_fee_cents, { decimals: 2 })}
              </span>
            </div>
          </div>
          <span className="an2-drill">Spend detail</span>
        </Link>

        {/* ════════ Creators ════════ */}
        <Link href="/merchant/analytics/creators" className="an2-mod an2-mod--creators" aria-label="Creator leaderboard">
          <p className="an2-mod__eyebrow">Top creators · {ext.by_creator.length} active</p>
          <div className="an2-creators">
            {topCreators.length === 0 && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-4)" }}>
                No creator activity yet — they'll show as soon as scans verify.
              </p>
            )}
            {topCreators.map((c, i) => (
              <div key={c.creator_id} className="an2-creators__row">
                <span className="an2-creators__rank">{i + 1}</span>
                <span className="an2-creators__name">{c.creator_id}</span>
                <span className="an2-creators__verified">{c.verified} verified</span>
                <span className="an2-creators__roi">{c.roi.toFixed(1)}×</span>
              </div>
            ))}
          </div>
          <span className="an2-drill">All creators</span>
        </Link>

        {/* ════════ Funnel hero ════════ */}
        <Link href="/merchant/analytics/funnel" className="an2-mod an2-mod--funnel" aria-label="Conversion funnel detail">
          <div className="an2-funnel">
            <div>
              <p className="an2-mod__eyebrow">Conversion funnel · 5 stages</p>
              <h2 className="an2-mod__title" style={{ fontSize: 28 }}>
                {fmtNum(ext.funnel.impressions)} <span style={{ color: "var(--ink-4)", fontSize: "0.7em" }}>→</span> {fmtNum(ext.funnel.repeat)}
              </h2>
              <p className="an2-funnel__delta" style={{ marginTop: 8 }}>
                Impression → repeat: <strong>{((ext.funnel.repeat / Math.max(1, ext.funnel.impressions)) * 100).toFixed(2)}%</strong>{" "}
                · Verification rate: <strong>{((ext.funnel.scans_verified / Math.max(1, ext.funnel.scans_raw)) * 100).toFixed(0)}%</strong>
              </p>
            </div>

            <div className="an2-funnel__stages">
              {[
                { lbl: "Impression", num: ext.funnel.impressions,    rate: null },
                { lbl: "Click",      num: ext.funnel.clicks,         rate: ext.funnel.clicks / Math.max(1, ext.funnel.impressions) },
                { lbl: "Scan",       num: ext.funnel.scans_raw,      rate: ext.funnel.scans_raw / Math.max(1, ext.funnel.clicks) },
                { lbl: "Verified",   num: ext.funnel.scans_verified, rate: ext.funnel.scans_verified / Math.max(1, ext.funnel.scans_raw) },
                { lbl: "Repeat",     num: ext.funnel.repeat,         rate: ext.funnel.repeat / Math.max(1, ext.funnel.scans_verified) },
              ].map((s, i) => (
                <div key={s.lbl} className="an2-funnel__stage">
                  <div className="an2-funnel__bar">
                    <span className="an2-funnel__bar-num">{fmtNum(s.num)}</span>
                  </div>
                  <span className="an2-funnel__lbl">{s.lbl}</span>
                  {s.rate !== null && (
                    <span className="an2-funnel__rate">{(s.rate * 100).toFixed(0)}%</span>
                  )}
                  {i === 0 && <span className="an2-funnel__rate">·</span>}
                </div>
              ))}
            </div>

            <p className="an2-funnel__delta">
              Biggest drop: <strong>scan → verified ({((1 - ext.funnel.scans_verified / Math.max(1, ext.funnel.scans_raw)) * 100).toFixed(0)}% loss)</strong>{" "}
              — typical for QR campaigns. Window-cliff drop, not creator quality.
            </p>
          </div>
          <span className="an2-drill">Funnel detail</span>
        </Link>

        {/* ════════ Repeat ════════ */}
        <Link href="/merchant/analytics/repeat" className="an2-mod an2-mod--repeat" aria-label="Repeat customers detail">
          <p className="an2-mod__eyebrow">Repeat customers</p>
          <div className="an2-repeat">
            <p className="an2-repeat__num">{fmtNum(ext.repeat_customers)}</p>
            <p className="an2-repeat__share">
              <strong>{(ext.repeat_share * 100).toFixed(0)}%</strong> of verified · drives <strong>{(ext.repeat_revenue_share * 100).toFixed(0)}%</strong> of revenue
            </p>
            <div className="an2-repeat__strip" aria-label="Decay distribution">
              {ext.decay_dist.map(seg => (
                <div
                  key={seg.tier}
                  className="an2-repeat__seg"
                  style={{
                    flex: `${seg.share * 100} 1 0`,
                    background: seg.tier === "fresh" ? "var(--accent-blue)" :
                                seg.tier === "d50"   ? "#4ade80" :
                                seg.tier === "d30"   ? "var(--champagne)" :
                                seg.tier === "d10"   ? "#f0e6c4" :
                                                       "var(--surface-3)",
                  }}
                  title={`${seg.tier} · ${seg.count} fans`}
                />
              ))}
            </div>
          </div>
          <span className="an2-drill">Cohort detail</span>
        </Link>

        {/* ════════ Integrity ════════ */}
        <Link href="/merchant/analytics/integrity" className="an2-mod an2-mod--integrity" aria-label="Integrity detail">
          <p className="an2-mod__eyebrow">Integrity · fraud + confidence</p>
          <div className="an2-integrity">
            <div className="an2-integrity__top">
              <p className={"an2-integrity__num" + (ext.fraud_flags > ext.verified_customers * 0.05 ? " flagged" : "")}>
                {ext.fraud_flags}
              </p>
              <span className="an2-integrity__sub">flagged · {((ext.fraud_flags / Math.max(1, ext.verified_customers)) * 100).toFixed(1)}% rate</span>
            </div>
            <div className="an2-integrity__conf">
              {(["high", "med", "low"] as const).map(k => {
                const v = ext.confidence_dist[k === "med" ? "medium" : k];
                const total = ext.confidence_dist.high + ext.confidence_dist.medium + ext.confidence_dist.low;
                const pct = total > 0 ? (v / total) * 100 : 0;
                return (
                  <div key={k} className="an2-integrity__conf-cell">
                    <span style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{k === "med" ? "MED" : k.toUpperCase()}</span>
                      <span className="an2-integrity__conf-num">{v}</span>
                    </span>
                    <div className="an2-integrity__conf-bar">
                      <div className={`an2-integrity__conf-fill ${k}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <span className="an2-drill">Integrity log</span>
        </Link>

        {/* ════════ Trajectory full-width ════════ */}
        <Link href="/merchant/analytics/trajectory" className="an2-mod an2-mod--trajectory" aria-label="Trajectory detail">
          <div className="an2-trajectory">
            <div className="an2-trajectory__head">
              <div>
                <p className="an2-mod__eyebrow">Daily trajectory · {windowDays} days</p>
                <p className="an2-trajectory__total">{fmtUsd(ext.revenue_attributed)}</p>
              </div>
              <p className="an2-roi__delta">
                <span className="arrow">↑</span>{formatDelta(revenueDelta, "vs prior")} ·{" "}
                {fmtNum(ext.verified_customers)} verified ({formatDelta(verifiedDelta, "")})
              </p>
            </div>
            <div className="an2-trajectory__chart" aria-hidden>
              {ext.by_day.map((d, i) => {
                const isCurrent = i === ext.by_day.length - 1;
                const h = (d.verified / trajectoryMax) * 100;
                return (
                  <div
                    key={d.date}
                    className={"an2-trajectory__bar" + (isCurrent ? " current" : "")}
                    style={{ height: `${Math.max(4, h)}%` }}
                    title={`${d.date}: ${d.verified} verified, ${d.scans} scans`}
                  />
                );
              })}
              {ext.by_day.length === 0 && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-4)", margin: "auto" }}>
                  No daily data yet — the trajectory fills in once verified visits start.
                </p>
              )}
            </div>
          </div>
          <span className="an2-drill">Trajectory detail</span>
        </Link>

        {/* ════════ Decisions full-width ════════ */}
        <Link href="/merchant/analytics/decisions" className="an2-mod an2-mod--decisions" aria-label="Renewal decision detail">
          <div className="an2-decisions">
            <div className={`an2-decisions__icon ${sevColor}`}>
              {sevColor === "expand" ? "✦" : sevColor === "renew" ? "↻" : sevColor === "pause" ? "‖" : "!"}
            </div>
            <div className="an2-decisions__main">
              <span className={`an2-decisions__sev ${sevColor}`}>
                {ext.recommendation.action} · {ext.recommendation.confidence} confidence
              </span>
              <h2 className="an2-decisions__headline">{ext.recommendation.headline}</h2>
              <p className="an2-decisions__body">{ext.recommendation.body}</p>
            </div>
            <span className="an2-drill" style={{ position: "static" }}>Decision detail</span>
          </div>
        </Link>

      </div>

      <p className="an2-div"><span>verified · attributed · paid back.</span></p>
    </div>
  );
}
