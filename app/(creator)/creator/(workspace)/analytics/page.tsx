/* ─────────────────────────────────────────────────────────────────────
 * Push · Creator Analytics — Overview (v2 Bento)
 *
 * 8 agentic modules, each a clickable Link to its own detail page.
 * Asymmetric bento grid — no two adjacent modules same size.
 * Every interaction follows Design.md v11 + v11.1.
 *
 * Drill-downs:
 *   /analytics/tier         · Tier ladder, score dimensions
 *   /analytics/earnings     · Decomposition, per-campaign, trajectory
 *   /analytics/milestone    · Milestone history, projection
 *   /analytics/attribution  · 5 verification layers, decay curve, last-click
 *   /analytics/fans         · Fan list, decay buckets, expiring soon
 *   /analytics/geography    · Neighborhoods, opportunity, peer benchmarks
 *   /analytics/campaigns    · All campaigns, filters, drill rows
 *   /analytics/moves        · Suggested moves queue, dismissed history
 * ───────────────────────────────────────────────────────────────────── */

"use client";

import { useState } from "react";
import Link from "next/link";
import "./analytics.css";
import {
  SUMMARY,
  MILESTONE,
  TIME_SERIES,
  CAMPAIGNS,
  FANS,
  DECAY_DIST,
  DECAY_LABEL,
  DECAY_COLOR,
  NEIGHBORHOODS,
  MOVES,
  TIER_LADDER,
  tierMeta,
  nextTier,
  pctDelta,
  formatDelta,
  fmtNum,
  fmtUsd,
} from "./_data/mock";

const PERIODS = [
  { key: "7d",  label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "all", label: "All" },
] as const;
type Period = typeof PERIODS[number]["key"];

export default function CreatorAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [moveIdx, setMoveIdx] = useState(0);

  const tier = tierMeta(SUMMARY.currentTier);
  const next = nextTier(SUMMARY.currentTier)!;
  const tierPct = Math.round(
    ((SUMMARY.currentScore - tier.scoreFloor) / (next.scoreFloor - tier.scoreFloor)) * 100
  );
  const verifiedDelta  = pctDelta(SUMMARY.scansVerified, SUMMARY.scansVerifiedPrior);
  const earningsDelta  = pctDelta(SUMMARY.earnings.total, SUMMARY.earningsPrior);
  const repeatDelta    = pctDelta(SUMMARY.repeatCustomers, SUMMARY.repeatCustomersPrior);

  const earnTotal = SUMMARY.earnings.total;
  const move = MOVES[moveIdx];

  return (
    <div className="an2">
      {/* ─── Header ─── */}
      <header className="an2-header">
        <div className="an2-header__left">
          <p className="an2-eyebrow"><span className="pulse" aria-hidden /> Analytics · last 30 days</p>
          <h1 className="an2-title">Analytics</h1>
          <p className="an2-meta">
            {SUMMARY.windowFrom} → {SUMMARY.windowTo} · refreshed 2 min ago
          </p>
        </div>
        <div className="an2-header__right">
          <div className="an2-chips" role="tablist" aria-label="Time range">
            {PERIODS.map(p => (
              <button
                key={p.key}
                role="tab"
                aria-selected={period === p.key}
                className={"an2-chip" + (period === p.key ? " is-active" : "")}
                onClick={() => setPeriod(p.key)}
              >{p.label}</button>
            ))}
          </div>
          <Link href="/creator/analytics/moves" className="an2-export" aria-label="Export & share">
            Export ▾
          </Link>
        </div>
      </header>

      {/* ─── Bento ─── */}
      <div className="an2-bento">

        {/* ════════════════ TIER (hero) ════════════════ */}
        <Link href="/creator/analytics/tier" className="an2-mod an2-mod--tier" aria-label="View tier detail">
          <div className="an2-tier">
            <div>
              <p className="an2-mod__eyebrow">Tier · progression</p>
              <div className="an2-tier__top">
                <h2 className="an2-tier__name">{SUMMARY.currentTier}</h2>
                <span className="an2-tier__material">
                  <span className="an2-tier__swatch" style={{ background: tier.swatch }} />
                  {tier.material}
                </span>
              </div>
              <div className="an2-tier__score-row">
                <span className="an2-tier__score-num">{SUMMARY.currentScore}</span>
                <span className="an2-tier__score-lbl">push score</span>
              </div>
            </div>

            <div className="an2-tier__progress">
              <div className="an2-tier__sparkline" aria-hidden>
                {SUMMARY.scoreHistory.map((v, i) => {
                  const max = Math.max(...SUMMARY.scoreHistory);
                  const h = (v / max) * 100;
                  const isLast = i === SUMMARY.scoreHistory.length - 1;
                  return (
                    <div
                      key={i}
                      className={"an2-tier__spark-bar" + (isLast ? " current" : "")}
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
              <div className="an2-tier__progress-meta">
                <span>To <strong>{next.tier}</strong> · score <strong>{next.scoreFloor}</strong></span>
                <span><strong>{next.scoreFloor - SUMMARY.currentScore} pts</strong> away</span>
              </div>
              <div className="an2-tier__track">
                <div className="an2-tier__fill" style={{ width: `${Math.max(2, tierPct)}%` }} />
              </div>
            </div>

            <div className="an2-tier__unlocks">
              <div className="an2-unlock"><strong>{next.commission} commission</strong>up from {tier.commission}</div>
              <div className="an2-unlock"><strong>{next.basePay}</strong>up from {tier.basePay}</div>
              <div className="an2-unlock"><strong>{next.concurrent} concurrent</strong>up from {tier.concurrent}</div>
              <div className="an2-unlock"><strong>{next.payoutSpeed} payouts</strong>up from {tier.payoutSpeed}</div>
            </div>
          </div>
          <span className="an2-drill">Tier detail</span>
        </Link>

        {/* ════════════════ EARNINGS ════════════════ */}
        <Link href="/creator/analytics/earnings" className="an2-mod an2-mod--earnings" aria-label="View earnings detail">
          <p className="an2-mod__eyebrow">Earnings · last 30d</p>
          <div className="an2-earn">
            <div>
              <p className="an2-earn__big">{fmtUsd(earnTotal)}</p>
              <p className="an2-earn__delta">
                <span className="arrow">↑</span>{formatDelta(earningsDelta)}
              </p>
            </div>
            <div className="an2-earn__split">
              {(["base", "commission", "milestone"] as const).map(k => {
                const v = SUMMARY.earnings[k];
                const pct = (v / earnTotal) * 100;
                return (
                  <div key={k} className="an2-earn__split-row">
                    <span className="an2-earn__split-lbl">{k}</span>
                    <div className="an2-earn__split-bar">
                      <div className={`an2-earn__split-fill ${k}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="an2-earn__split-val">${v}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <span className="an2-drill">Earnings detail</span>
        </Link>

        {/* ════════════════ MILESTONE (Liquid Glass) ════════════════ */}
        <Link href="/creator/analytics/milestone" className="an2-mod an2-mod--milestone" aria-label="View milestone detail">
          <div className="an2-ms">
            <div>
              <p className="an2-mod__eyebrow">
                Referral milestone · {MILESTONE.hit ? "hit" : "in progress"}
              </p>
              <h3 className="an2-ms__title">
                {MILESTONE.current} <span style={{ color: "var(--ink-4)" }}>/</span> {MILESTONE.threshold}
                <span style={{ color: "var(--ink-4)", fontWeight: 600, fontSize: "0.6em", marginLeft: 8 }}>referrals</span>
              </h3>
            </div>
            <div>
              <div className="an2-ms__track">
                <div
                  className="an2-ms__fill"
                  style={{ width: `${Math.min(100, (MILESTONE.current / MILESTONE.threshold) * 100)}%` }}
                />
              </div>
              <p className="an2-ms__meta" style={{ marginTop: 12 }}>
                {MILESTONE.hit
                  ? <>Hit on {MILESTONE.hitDate} · <strong style={{ color: "var(--ink)" }}>+${MILESTONE.bonus} unlocked</strong></>
                  : <>{MILESTONE.threshold - MILESTONE.current} to go · resets {MILESTONE.windowResetsAt}</>}
              </p>
            </div>
          </div>
          <span className="an2-drill">Milestone detail</span>
        </Link>

        {/* ════════════════ ATTRIBUTION RAIL ════════════════ */}
        <Link href="/creator/analytics/attribution" className="an2-mod an2-mod--attribution" aria-label="View attribution rail detail">
          <div className="an2-attr">
            <div>
              <p className="an2-mod__eyebrow">Attribution rail · 6 months</p>
              <div className="an2-attr__numerals">
                <div className="an2-attr__num-block">
                  <div className="an2-attr__num">{fmtNum(SUMMARY.scansVerified)}</div>
                  <div className="an2-attr__num-lbl">Verified visits</div>
                </div>
                <div className="an2-attr__num-block">
                  <div className="an2-attr__num muted">{fmtNum(SUMMARY.scansRaw)}</div>
                  <div className="an2-attr__num-lbl">Raw scans · {Math.round(SUMMARY.verificationRate * 100)}% verified</div>
                </div>
                <div className="an2-attr__num-block">
                  <div className="an2-attr__num">{fmtNum(SUMMARY.repeatCustomers)}</div>
                  <div className="an2-attr__num-lbl">Repeat · {Math.round(SUMMARY.repeatRevenueShare * 100)}% of commission</div>
                </div>
              </div>
            </div>

            <div className="an2-attr__chart" aria-hidden>
              {(() => {
                const max = Math.max(...TIME_SERIES.map(d => d.raw));
                return TIME_SERIES.map((d, i) => {
                  const isCurrent = i === TIME_SERIES.length - 1;
                  const verifiedH = (d.verified / max) * 100;
                  const rawExtraH = ((d.raw - d.verified) / max) * 100;
                  return (
                    <div key={d.m} className={"an2-bar-col" + (isCurrent ? " current" : "")}>
                      <div className="an2-bar-stack">
                        <div className="an2-bar-verified" style={{ height: `${verifiedH}%` }} />
                        <div className="an2-bar-raw-extra" style={{ height: `${rawExtraH}%` }} />
                      </div>
                      <span className="an2-bar-lbl">{d.m}</span>
                    </div>
                  );
                });
              })()}
            </div>

            <div>
              <div className="an2-decay-strip" aria-label="Decay distribution">
                {DECAY_DIST.map(seg => (
                  <div
                    key={seg.tier}
                    className="an2-decay-seg"
                    style={{ flex: `${seg.share * 100} 1 0`, background: DECAY_COLOR[seg.tier] }}
                    title={`${DECAY_LABEL[seg.tier]} · ${Math.round(seg.share * 100)}% · ${seg.count} fans`}
                  />
                ))}
              </div>
              <div className="an2-attr__legend" style={{ marginTop: 10 }}>
                <span><span className="an2-legend-sw" style={{ background: "var(--ink)" }} /> Verified</span>
                <span><span className="an2-legend-sw" style={{ background: "var(--mist)" }} /> Raw</span>
                <span><span className="an2-legend-sw" style={{ background: "var(--brand-red)" }} /> Current period</span>
                <span style={{ marginLeft: "auto", color: "var(--ink-4)" }}>
                  ↑ {formatDelta(verifiedDelta)} verified
                </span>
              </div>
            </div>
          </div>
          <span className="an2-drill">Rail detail</span>
        </Link>

        {/* ════════════════ FANS ════════════════ */}
        <Link href="/creator/analytics/fans" className="an2-mod an2-mod--fans" aria-label="View fans detail">
          <div className="an2-fans">
            <div>
              <p className="an2-mod__eyebrow">Top fans · push signature</p>
              <h2 className="an2-mod__title" style={{ fontSize: 22, marginBottom: 4 }}>
                {fmtNum(SUMMARY.repeatCustomers)} repeat
              </h2>
              <p className="an2-fans__summary">
                of <strong>{fmtNum(SUMMARY.scansVerified)}</strong> verified · drives <strong>{Math.round(SUMMARY.repeatRevenueShare * 100)}%</strong> of commission
              </p>
            </div>

            <div className="an2-fans__list">
              {FANS.slice(0, 5).map(f => (
                <div key={f.id} className="an2-fans__row">
                  <span className="an2-fans__id">{f.id.slice(0, 7)}</span>
                  <span className="an2-fans__visits">
                    {f.visits}<span className="an2-fans__visits-unit">visits</span>
                  </span>
                  <span className={`an2-decay-pill ${f.decay}`}>{DECAY_LABEL[f.decay].split(" ")[0]}</span>
                </div>
              ))}
            </div>

            <p className="an2-fans__summary" style={{ fontSize: 12, color: "var(--ink-4)" }}>
              {DECAY_DIST.find(d => d.tier === "fresh")!.count} fresh ·{" "}
              {DECAY_DIST.find(d => d.tier === "expired")!.count} expired
            </p>
          </div>
          <span className="an2-drill">Fan detail</span>
        </Link>

        {/* ════════════════ GEOGRAPHY ════════════════ */}
        <Link href="/creator/analytics/geography" className="an2-mod an2-mod--geography" aria-label="View geography detail">
          <div className="an2-geo">
            <p className="an2-mod__eyebrow">By neighborhood</p>
            <div className="an2-geo__list">
              {NEIGHBORHOODS.slice(0, 4).map(n => {
                const max = Math.max(...NEIGHBORHOODS.map(x => x.visits));
                const pct = (n.visits / max) * 100;
                return (
                  <div key={n.name} className="an2-geo__row">
                    <span className={"an2-geo__name" + (n.isHome ? " home" : "")}>{n.name}</span>
                    <div className="an2-geo__track">
                      <div className="an2-geo__fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="an2-geo__rate">{fmtUsd(n.perScan, { cents: true })}</span>
                  </div>
                );
              })}
            </div>
            <p className="an2-geo__opp">
              <strong>Opportunity ·</strong> LES creators at your tier earn{" "}
              <strong>$0.12/scan</strong> vs your Williamsburg <strong>$0.06</strong>. 4 open campaigns this week.
            </p>
          </div>
          <span className="an2-drill">Geography detail</span>
        </Link>

        {/* ════════════════ CAMPAIGNS ════════════════ */}
        <Link href="/creator/analytics/campaigns" className="an2-mod an2-mod--campaigns" aria-label="View campaigns detail">
          <div className="an2-cmp">
            <p className="an2-mod__eyebrow">Active &amp; recent campaigns</p>
            <div className="an2-cmp__list">
              {CAMPAIGNS.slice(0, 5).map(c => (
                <div key={c.id} className="an2-cmp__row">
                  <span className="an2-cmp__name">{c.name}</span>
                  <span className="an2-cmp__num">{c.verified}</span>
                  <span className="an2-cmp__num soft">{Math.round(c.repeatPct * 100)}%</span>
                  <span className={`an2-status ${c.status}`}>{c.status}</span>
                  <span className="an2-cmp__money">${c.earnings}</span>
                </div>
              ))}
            </div>
          </div>
          <span className="an2-drill">All campaigns</span>
        </Link>

        {/* ════════════════ MOVES (full-width single-narrative) ════════════════ */}
        <Link href={move.ctaHref} className="an2-mod an2-mod--moves" aria-label={move.cta}>
          <div className="an2-moves">
            <div className="an2-moves__main">
              <p className="an2-mod__eyebrow">Suggested move · {moveIdx + 1} of {MOVES.length}</p>
              <span className={`an2-moves__sev ${move.severity}`}>{move.severity}</span>
              <h2 className="an2-moves__headline">
                <span className="an2-moves__numeral">{move.numeral}</span>
                {move.headline}
              </h2>
              <p className="an2-moves__body">{move.body}</p>
              <p className="an2-fans__summary" style={{ marginTop: 14, fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700 }}>
                {move.cta} →
              </p>
            </div>
            <div className="an2-moves__nav">
              <button
                className="an2-moves__nav-arrow"
                onClick={(e) => { e.preventDefault(); setMoveIdx((moveIdx + 1) % MOVES.length); }}
                aria-label="Next move"
                type="button"
              >→</button>
              <div className="an2-moves__dots">
                {MOVES.map((_, i) => <span key={i} className={"an2-moves__dot" + (i === moveIdx ? " active" : "")} />)}
              </div>
            </div>
          </div>
        </Link>

      </div>

      <p className="an2-div"><span>visited · scanned · verified.</span></p>
    </div>
  );
}
