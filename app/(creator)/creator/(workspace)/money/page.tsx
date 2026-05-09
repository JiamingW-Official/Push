"use client";

/* ============================================================
   /creator/money — MONEY hub. v3 (2026-05-09 redesign)

   Audit-driven rewrite. Old layout had three reasons to die:
     · "$412 this month" hero was a vanity metric — what creators
       actually want to know is "how much can I cash out RIGHT NOW".
     · PENDING SPLIT donut over-visualized $87.
     · TAX + METHODS each ate a full grid cell for content that's
       set-once admin chrome.

   New layout — Push-DNA-first:
     Row 1 (240 + 5):
       HERO span 7  — cleared cash + eye + tier + segmented cycle
                       bar + verified-scan attribution row
       MILESTONE 5  — weekly bonus tied to verified scans + cycle
                      close countdown
     Row 2 (240px):
       SCANS span 4 — recent verified-scan feed (Push-only data)
       TREND span 8 — earnings curve + base/comm/bonus stacked
                      breakdown overlay
     Row 3 (~110px admin strip):
       METHODS 6    — payout methods compact
       TAX 6        — YTD + W-9 + 1099 download
   ============================================================ */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEarnings } from "@/lib/data/hooks";
import { BentoModule } from "@/components/shared/primitives";
import TimeChart from "@/components/shared/charts/TimeChart";
import {
  Wallet,
  Sparkles,
  CreditCard,
  Receipt,
  FileText,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  ArrowDownToLine,
  Calendar,
  History,
  Trophy,
  Heart,
  Camera,
  Zap,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import "@/components/shared/hub-shell.css";
import "./money.css";

const ICON_PROPS = { size: 18, strokeWidth: 1.75 } as const;

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

export default function MoneyHub() {
  const { data: earnings } = useEarnings();
  const router = useRouter();

  /* ── Data ────────────────────────────────────────────────── */
  const balances = earnings?.balances ?? {
    pending: 87,
    cleared: 240,
    processing: 0,
    paidOut: 1840,
    total: 2167,
  };
  const summary = earnings?.summary ?? {
    thisMonthEarned: 412,
    lastMonthEarned: 348,
    delta: 18.4,
    pendingNext: 87,
  };
  const lifetime = balances.paidOut + balances.cleared + balances.processing;

  /* Privacy toggle — masks every money string on the page when on.
     v4 — moved up so activeMilestones / taxData and other data
     definitions further below can call m() at array-build time. */
  const [hideMoney, setHideMoney] = useState(false);
  const m = (formatted: string) => (hideMoney ? "****" : formatted);

  /* Push-specific cycle + attribution data. Numbers stay
     internally consistent with /work/pay's Pulse panel:
     verified scans × avg/scan ≈ this cycle's earnings. */
  /* Tier naming = canonical Push v5.2 names (Seed → Explorer → Operator
     → Proven → Closer → Partner per lib/creator/constants.ts).
     Material tags (Clay/Bronze/Steel/Gold/Ruby/Obsidian) are visual
     identity ONLY and surface as small swatches under each ladder cell. */
  const cycle = {
    closeDay: "Fri",
    target: 500, // weekly cycle target
    verifiedScans: 24,
    avgPerScan: 11.75, // Operator tier avg post-platform-cut
    lastScanAgo: "2h",
    tier: "Operator",
    nextTier: "Proven",
    tierScans: 22, // verified customers toward next tier
    tierThreshold: 40, // customers needed to unlock Proven
    tierRateGain: 2.5, // $/customer rate gain at Proven
    pendingArrives: "Mon May 13",
    pendingSplit: { base: 60, comm: 12, bonus: 15 }, // $87 total
  };
  const cycleEarned = balances.cleared + balances.pending;
  const cycleEmpty = Math.max(0, cycle.target - cycleEarned);

  /* Recent verified-scan feed — what makes /money belong to Push.
     Each row = one in-store attribution event that converted to
     creator pay. Status pill: verified / pending (still in 72h
     attribution-decay window). */
  const recentScans = [
    { ago: "2h", merchant: "Roberta's Pizza", amount: 11.75, verified: true },
    { ago: "Yesterday", merchant: "Devoción", amount: 22.5, verified: true },
    { ago: "2d", merchant: "Brow Theory", amount: 15.0, verified: false },
    { ago: "3d", merchant: "Maman", amount: 18.25, verified: true },
    { ago: "4d", merchant: "Roberta's Pizza", amount: 11.75, verified: true },
  ];

  /* Top merchants this cycle — folds /money/history's "by merchant"
     view into the main page so users don't need to drill. */
  const topMerchants = [
    { name: "Roberta's", total: 23.5, scans: 2 },
    { name: "Devoción", total: 22.5, scans: 1 },
    { name: "Maman", total: 18.25, scans: 1 },
  ];

  /* Pending clearing schedule — folds /money/pending into the Scans
     panel. Each row = a verified scan still in the 72h attribution-
     decay window, with the day it'll hit the cleared bucket. */
  const pendingSchedule = [
    { day: "Today", when: "5pm", merchant: "Devoción", amount: 25 },
    { day: "Tomorrow", when: "10am", merchant: "Maman", amount: 35 },
    { day: "Mon", when: "May 13", merchant: "Brow Theory", amount: 27 },
  ];

  /* Admin strip metadata — used by the small footer link strip.
     Full management lives in sub-pages (E-level, rare). */
  const methodsCount = 3;
  const taxYear = 2026;

  /* v9 — cashSpark removed (sparkline taken out per audit, was
     filler not value-add). trendKpis retained for KPI strip below
     the trend chart. Push v5.2 DNA terminology. */
  const trendKpis = [
    { lbl: "per customer", val: "$0.99" },
    { lbl: "per shoot", val: "$82" },
    { lbl: "bonuses", val: "1" },
    { lbl: "campaigns", val: "5" },
  ];

  /* v6.1 — Milestones panel (replaces tier ladder; tier lives in
     /stats). 2-3 active milestones, each cycle-bound and actionable.
     Shape: name (campaign or theme) + merchant + progress (x/y
     customers) + bonus amount. Falls back to realistic mock if
     useEarnings hasn't populated activeMilestones yet. */
  /* v8 — milestone categories drive icon + countdown variation
     so the rows aren't visually identical. Categories:
       · loyalty    = repeat-customer driven (heart icon)
       · content    = post/reel content driven (camera icon)
       · firsttimer = new-customer wave (zap icon)
       · streak     = cycle streak / consistency (flame icon, v10.5)
       · anchor     = single-merchant focus (target icon, v10.6)
       · tempo      = week-over-week momentum (trending-up icon, v10.6) */
  type MilestoneKind =
    | "loyalty"
    | "content"
    | "firsttimer"
    | "streak"
    | "anchor"
    | "tempo";
  type DisplayMilestone = {
    name: string;
    merchant: string;
    progress: number;
    threshold: number;
    bonus: number;
    daysLeft: number;
    kind: MilestoneKind;
  };
  const rawMilestones = earnings?.activeMilestones ?? [];
  const displayMilestones: DisplayMilestone[] =
    rawMilestones.length > 0
      ? rawMilestones.slice(0, 6).map((m, i) => ({
          name: m.campaign,
          merchant: m.merchant,
          progress: m.milestones.filter((sub) => sub.done).length,
          threshold: m.milestones.length,
          bonus: m.totalPayout,
          daysLeft: 4,
          kind: ([
            "loyalty",
            "content",
            "firsttimer",
            "streak",
            "anchor",
            "tempo",
          ][i % 6] ?? "loyalty") as MilestoneKind,
        }))
      : [
          {
            name: "Loyalty drive",
            merchant: "Roberta's Pizza",
            progress: 7,
            threshold: 10,
            bonus: 50,
            daysLeft: 4,
            kind: "loyalty" as MilestoneKind,
          },
          {
            name: "Reels this week",
            merchant: "Multiple",
            progress: 2,
            threshold: 5,
            bonus: 30,
            daysLeft: 4,
            kind: "content" as MilestoneKind,
          },
          {
            name: "First-timer wave",
            merchant: "Devoción",
            progress: 4,
            threshold: 8,
            bonus: 40,
            daysLeft: 4,
            kind: "firsttimer" as MilestoneKind,
          },
          {
            name: "Cycle streak",
            merchant: "Bonus tier",
            progress: 3,
            threshold: 4,
            bonus: 25,
            daysLeft: 4,
            kind: "streak" as MilestoneKind,
          },
          {
            name: "Anchor merchant",
            merchant: "Maman",
            progress: 5,
            threshold: 6,
            bonus: 35,
            daysLeft: 4,
            kind: "anchor" as MilestoneKind,
          },
          {
            name: "Week tempo",
            merchant: "Multiple",
            progress: 6,
            threshold: 12,
            bonus: 45,
            daysLeft: 4,
            kind: "tempo" as MilestoneKind,
          },
        ];
  const totalBonusUnlockable = displayMilestones.reduce(
    (s, x) => s + x.bonus,
    0,
  );

  /* v10.8 — agent-style sub line. Replaces the static "refreshed just
     now" timestamp with an actionable hint based on whichever milestone
     is closest to unlock (smallest customers-to-go, ties broken by
     highest bonus). Reads like the /work page's AGENT block — gives
     the creator a clear next step the moment they land on /money. */
  const agentHint = (() => {
    // Pick the milestone with the fewest customers-to-go (and as a tie
    // breaker, the highest bonus) — that's "what's most ripe to chase".
    const ranked = [...displayMilestones]
      .map((x) => ({
        ...x,
        toGo: Math.max(0, x.threshold - x.progress),
      }))
      .filter((x) => x.toGo > 0)
      .sort((a, b) => a.toGo - b.toGo || b.bonus - a.bonus);
    const closest = ranked[0];
    if (!closest) {
      // All milestones complete — celebrate the haul.
      return `All ${displayMilestones.length} milestones unlocked · +$${totalBonusUnlockable} this cycle`;
    }
    const noun =
      closest.toGo === 1 ? "verified customer" : "verified customers";
    const at =
      closest.merchant && closest.merchant !== "Multiple"
        ? ` at ${closest.merchant}`
        : "";
    return `${closest.toGo} ${noun}${at} → +$${closest.bonus} ${closest.name.toLowerCase()}`;
  })();

  return (
    <main className="money-hub" aria-label="Money">
      <header className="money-hero">
        <div className="money-hero__left">
          <h1 className="money-hero__title">Money</h1>
          <p className="money-hero__sub">{agentHint}</p>
        </div>
      </header>

      <section className="money-bento" aria-label="Money modules">
        {/* ── Row 1 ────────────────────────────────────────── */}

        {/* HERO — cleared cash + tier + segmented cycle bar +
            attribution row. Replaces the old BALANCE blue solid +
            PENDING SPLIT donut combo. */}
        <BentoModule
          href="/creator/money/earnings"
          eyebrow={`Cash · cycle close ${cycle.closeDay}`}
          icon={<Wallet {...ICON_PROPS} />}
          span={7}
        >
          {/* v6 — composition refactor. Tight stack:
              [num + delta + eye + tier]  ← all on top row
              [sub line · attribution]
              [BIG segmented bar]
              [legend]
              [4 quick-action buttons row] ← Lumin/Ulty pattern */}
          <div className="cash-hero">
            <div className="cash-hero__top">
              <span className="cash-hero__num">
                {hideMoney ? "****" : `$${fmtMoney(balances.cleared)}`}
              </span>
              <span className="cash-hero__delta">
                ↑ {summary.delta.toFixed(1)}%
              </span>
              <button
                type="button"
                className="cash-hero__eye"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setHideMoney((v) => !v);
                }}
                aria-label={hideMoney ? "Show amounts" : "Hide amounts"}
              >
                {hideMoney ? (
                  <EyeOff size={18} strokeWidth={1.75} />
                ) : (
                  <Eye size={18} strokeWidth={1.75} />
                )}
              </button>
              <span className="cash-hero__tier">
                <Sparkles size={14} strokeWidth={1.75} />
                {cycle.tier}
              </span>
            </div>

            {/* v7 — single-strong sub line per typography audit.
                Was: "ready to cash out · 24 verified customers · avg
                $11.75 /customer" (3 strongs + 2 separators competing).
                Now: only the customer count is bold; avg-per-customer
                is moved to the legend row below for breathing room. */}
            <p className="cash-hero__sub">
              Ready to cash out · <strong>{cycle.verifiedScans}</strong>{" "}
              verified customers
            </p>

            <div className="cash-hero__bar" aria-label="Cycle progress">
              <span
                className="cash-hero__seg cash-hero__seg--cleared"
                style={{ flex: balances.cleared }}
              />
              <span
                className="cash-hero__seg cash-hero__seg--pending"
                style={{ flex: balances.pending }}
              />
              <span
                className="cash-hero__seg cash-hero__seg--empty"
                style={{ flex: cycleEmpty }}
              />
            </div>
            {/* v7 — single-strong legend per typography audit. Each
                legend item: dollar amount strong + label demoted.
                Pending arrival date is now ink-4 caption (was inline
                with same weight as the $ figure). avg/customer added
                here as a quiet meta in champagne-deep. */}
            <div className="cash-hero__legend">
              <span className="cash-hero__legend-item">
                <span className="cash-hero__sw cash-hero__sw--cleared" />
                <strong>{m(`$${fmtMoney(balances.cleared)}`)}</strong>
                <span className="cash-hero__legend-lbl">cleared</span>
              </span>
              <span className="cash-hero__legend-item">
                <span className="cash-hero__sw cash-hero__sw--pending" />
                <strong>{m(`$${balances.pending}`)}</strong>
                <span className="cash-hero__legend-lbl">
                  pending · clears {cycle.pendingArrives}
                </span>
              </span>
              <span className="cash-hero__legend-meta">
                avg {m(`$${cycle.avgPerScan.toFixed(2)}`)} / customer
              </span>
            </div>

            {/* v9 — sparkline removed. It was filler trying to fix
                a "dead whitespace" problem that's better solved by
                tightening row height. Cash panel now: hero number,
                bar, legend, actions — clean A+B flow surface. */}

            {/* Quick actions row — Design.md § 9 unified buttons:
                Cash out = .btn-ink (Filled Ink, the press-here primary).
                Schedule / History / Methods = .btn-pill (filter-chip
                register for repeated secondary nav). */}
            <div className="cash-hero__actions">
              <button
                type="button"
                className="btn-pill money-cashout"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <ArrowDownToLine size={14} strokeWidth={2} />
                Cash out
              </button>
              {/* v8 — buttons (not Links) to avoid <a> nested inside
                  BentoModule's outer <a>. router.push handles the nav
                  programmatically. e.preventDefault() stops the parent
                  Link from also firing. */}
              <button
                type="button"
                className="btn-pill money-quick-pill"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/creator/money/history");
                }}
              >
                <Calendar size={14} strokeWidth={1.75} />
                Schedule
              </button>
              <button
                type="button"
                className="btn-pill money-quick-pill"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/creator/money/history");
                }}
              >
                <History size={14} strokeWidth={1.75} />
                History
              </button>
              {/* v9.1 — Methods quick-pill removed. It was redundant
                  with the admin strip footer ("Methods · 3 on file")
                  and caused the 4th button to clip on the span-7
                  panel. Schedule + History stay because they're A/B
                  flow adjacent (when do I get paid? where did past
                  payouts go?). */}
            </div>
          </div>
        </BentoModule>

        {/* MILESTONES — 2-3 active campaign-bound bonuses, each a
            cycle-bound actionable progression with $bonus reward.
            Replaces the v6 tier ladder (tier info lives in /stats;
            duplicating it on /money was wasted dashboard real estate
            per user audit 2026-05-09). */}
        <BentoModule
          href="/creator/money/milestones"
          eyebrow={`Milestones · ${displayMilestones.length} active`}
          icon={<Trophy {...ICON_PROPS} />}
          span={5}
        >
          {/* v10.5 — 4 ring-progress tiles in 2×2 grid. Replaces the v10
              3-tile single row. Premium chart treatment: bigger rings
              (88×88), gradient stroke (linearGradient ink-fade for default,
              success-fade for closest-to-completion), thinner track for
              elegance, stroke shadow filter for soft glow. Inline pct%
              inside the ring complements the icon. Below ring: name +
              "x/y · +$bonus" inline meta. */}
          <div className="ms-panel">
            {/* Shared SVG defs — gradients + drop-shadow filter reused
                across all 4 ring fills. position:absolute keeps it out
                of layout flow. */}
            <svg
              width="0"
              height="0"
              style={{ position: "absolute" }}
              aria-hidden
            >
              <defs>
                <linearGradient
                  id="ms-grad-ink"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3a3835" />
                  <stop offset="100%" stopColor="#0a0a0a" />
                </linearGradient>
                <linearGradient
                  id="ms-grad-success"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#1f7a39" />
                </linearGradient>
              </defs>
            </svg>

            {/* v10.7 — head removed per user "我可以把+$225 unlockable
                this cycle 去掉，这样可以流出上面的空间来进行放大".
                The eyebrow ("MILESTONES · 6 ACTIVE") already conveys count;
                each tile shows its own +$bonus. The aggregate was
                redundant and ate ~38px of vertical that's now used to
                grow rings + label fonts. */}

            <ul className="ms-tiles" aria-label="Active milestones">
              {(() => {
                const closestIdx = displayMilestones.reduce(
                  (best, ms, i) =>
                    ms.progress / ms.threshold >
                    displayMilestones[best].progress /
                      displayMilestones[best].threshold
                      ? i
                      : best,
                  0,
                );
                return displayMilestones.map((ms, i) => {
                  const pct = Math.min(
                    100,
                    Math.round((ms.progress / Math.max(ms.threshold, 1)) * 100),
                  );
                  const closest = i === closestIdx;
                  const KindIcon =
                    ms.kind === "loyalty"
                      ? Heart
                      : ms.kind === "content"
                        ? Camera
                        : ms.kind === "firsttimer"
                          ? Zap
                          : ms.kind === "streak"
                            ? Flame
                            : ms.kind === "anchor"
                              ? Target
                              : TrendingUp;
                  // v10.5 — ring geometry bumped: r=32 (was 22) for premium
                  // larger viewBox 80×80, circumference ≈ 201.06
                  const r = 32;
                  const c = 2 * Math.PI * r;
                  const dash = (pct / 100) * c;
                  return (
                    <li
                      key={i}
                      className={`ms-tile${closest ? " ms-tile--closest" : ""} ms-tile--${ms.kind}`}
                    >
                      <div className="ms-tile__ring">
                        <svg
                          viewBox="0 0 80 80"
                          className="ms-tile__ring-svg"
                          aria-hidden
                        >
                          <circle
                            className="ms-tile__ring-track"
                            cx="40"
                            cy="40"
                            r={r}
                            fill="none"
                            strokeWidth="4.5"
                          />
                          <circle
                            className="ms-tile__ring-fill"
                            cx="40"
                            cy="40"
                            r={r}
                            fill="none"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                            stroke={
                              closest
                                ? "url(#ms-grad-success)"
                                : "url(#ms-grad-ink)"
                            }
                            strokeDasharray={`${dash} ${c}`}
                            transform="rotate(-90 40 40)"
                          />
                        </svg>
                        <span className="ms-tile__ring-center" aria-hidden>
                          <KindIcon size={16} strokeWidth={1.75} />
                          <span className="ms-tile__ring-pct">{pct}%</span>
                        </span>
                      </div>
                      <p className="ms-tile__label">
                        <span className="ms-tile__name">{ms.name}</span>
                        <span className="ms-tile__sep" aria-hidden>
                          ·
                        </span>
                        <span className="ms-tile__bonus">
                          +{m(`$${ms.bonus}`)}
                        </span>
                      </p>
                    </li>
                  );
                });
              })()}
            </ul>
          </div>
        </BentoModule>

        {/* ── Row 2 ────────────────────────────────────────── */}

        {/* RECENT SCANS feed + Top merchants summary (folds the
            "by merchant" breakdown from /money/history). Header
            row shows top 3 merchants this cycle; feed below shows
            individual scan events. */}
        <BentoModule
          href="/creator/money/history"
          eyebrow={`Verified · ${recentScans.length} this cycle`}
          icon={<CheckCircle2 {...ICON_PROPS} />}
          span={4}
        >
          {/* v9 — single hero number + sub line + tight timeline.
              Removed: 3-stat header (redundant), color-segment bar
              (decorative without delivering info), avatar dots.
              The timeline IS the panel content; everything else is
              minimal context. */}
          {(() => {
            const cycleEarned = recentScans
              .filter((s) => s.verified)
              .reduce((sum, s) => sum + s.amount, 0);
            const verifiedCount = recentScans.filter((s) => s.verified).length;
            return (
              <div className="scans-feed">
                <div className="scans-feed__hero">
                  <span className="scans-feed__hero-num">
                    {m(`$${cycleEarned.toFixed(0)}`)}
                  </span>
                  <span className="scans-feed__hero-meta">
                    earned this cycle · {verifiedCount} verified ·{" "}
                    {topMerchants.length} merchants
                  </span>
                </div>

                <ul className="scans-feed__timeline" aria-label="Scan timeline">
                  {pendingSchedule.length > 0 && (
                    <li className="scans-feed__group" aria-hidden>
                      Clearing soon
                    </li>
                  )}
                  {pendingSchedule.slice(0, 2).map((p, i) => (
                    <li
                      key={`p-${i}`}
                      className="scans-feed__row scans-feed__row--pending"
                    >
                      <span
                        className="scans-feed__status scans-feed__status--pending"
                        aria-label="Pending"
                      >
                        <Clock size={11} strokeWidth={2.25} />
                      </span>
                      <span className="scans-feed__merchant-tx">
                        {p.merchant}
                      </span>
                      <span className="scans-feed__amount">
                        {m(`$${p.amount}`)}
                      </span>
                      <span className="scans-feed__when">{p.day}</span>
                    </li>
                  ))}

                  <li className="scans-feed__group" aria-hidden>
                    Verified
                  </li>
                  {recentScans.slice(0, 3).map((s, i) => (
                    <li
                      key={`s-${i}`}
                      className={`scans-feed__row${s.verified ? " scans-feed__row--verified" : ""}`}
                    >
                      <span
                        className={`scans-feed__status${s.verified ? " scans-feed__status--verified" : ""}`}
                        aria-label={s.verified ? "Verified" : "Unverified"}
                      >
                        {s.verified ? "✓" : "·"}
                      </span>
                      <span className="scans-feed__merchant-tx">
                        {s.merchant}
                      </span>
                      <span className="scans-feed__amount scans-feed__amount--earned">
                        +{m(`$${s.amount.toFixed(2)}`)}
                      </span>
                      <span className="scans-feed__when">{s.ago}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </BentoModule>

        {/* TREND — earnings curve + base/comm/bonus breakdown overlay */}
        <BentoModule
          href="/creator/money/history"
          eyebrow="Earnings · trend"
          icon={<Receipt {...ICON_PROPS} />}
          span={8}
        >
          <div className="money-trend">
            {/* v10.3 — premium hero row: $393 + delta on left,
                3 breakdown chips inline on right. Replaces the v6
                stacked layout (chips above, $393 inside chart head)
                so the chart gets more vertical real estate. */}
            <div className="money-trend__hero">
              <div className="money-trend__hero-left">
                <p className="money-trend__num">{m("$393")}</p>
                <p className="money-trend__delta">↑ 22.0% vs prior</p>
              </div>
              <div className="money-trend__breakdown">
                <span className="money-trend__chip money-trend__chip--base">
                  <span className="money-trend__sw money-trend__sw--base" />
                  <strong>{m(`$${cycle.pendingSplit.base}`)}</strong> base
                </span>
                <span className="money-trend__chip money-trend__chip--comm">
                  <span className="money-trend__sw money-trend__sw--comm" />
                  <strong>{m(`$${cycle.pendingSplit.comm}`)}</strong> comm
                </span>
                <span className="money-trend__chip money-trend__chip--bonus">
                  <span className="money-trend__sw money-trend__sw--bonus" />
                  <strong>{m(`$${cycle.pendingSplit.bonus}`)}</strong> bonus
                </span>
              </div>
            </div>

            <div className="money-trend__chart">
              <TimeChart
                accent="blue"
                valuePrefix={hideMoney ? "" : "$"}
                defaultPeriod="30d"
                mode="bar"
                showPrior={false}
                data={{
                  "7d": [12, 0, 18, 0, 25, 14, 18],
                  "30d": [
                    14, 0, 18, 22, 0, 12, 8, 24, 16, 0, 14, 28, 18, 12, 0, 22,
                    14, 18, 0, 16, 24, 12, 0, 18, 22, 16, 8, 14, 18, 5,
                  ],
                  "90d": Array.from({ length: 90 }, (_, i) => {
                    const dayOfWeek = i % 7;
                    if (dayOfWeek === 1 || dayOfWeek === 4) return 0;
                    return Math.max(0, Math.round(14 + Math.sin(i * 0.4) * 8));
                  }),
                  all: Array.from({ length: 52 }, (_, i) =>
                    Math.max(20, Math.round(40 + Math.sin(i * 0.3) * 12)),
                  ),
                }}
                labels={{
                  "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  "30d": Array.from({ length: 30 }, (_, i) => `D${i + 1}`),
                  "90d": Array.from({ length: 90 }, (_, i) =>
                    i % 30 === 0 ? `M${i / 30 + 1}` : "",
                  ),
                  all: Array.from({ length: 52 }, (_, i) =>
                    i % 13 === 0 ? `Q${Math.floor(i / 13) + 1}` : "",
                  ),
                }}
                ariaLabel="Earnings over time"
              />
            </div>

            {/* v8 — KPI tile grid replaces the thin footer text.
                4 stats in a 4-col grid, each with a Darky number
                + uppercase label + tiny ink-4 caption. Fills the
                ~120px dead space below the (capped 140px) chart so
                the panel reads as a real earnings dashboard. */}
            <div className="money-trend__kpis">
              <div className="money-trend__kpi">
                <span className="money-trend__kpi-num">
                  {m(trendKpis[0].val)}
                </span>
                <span className="money-trend__kpi-lbl">per customer</span>
                <span className="money-trend__kpi-cap">avg this cycle</span>
              </div>
              <div className="money-trend__kpi">
                <span className="money-trend__kpi-num">
                  {m(trendKpis[1].val)}
                </span>
                <span className="money-trend__kpi-lbl">per shoot</span>
                <span className="money-trend__kpi-cap">avg per delivery</span>
              </div>
              <div className="money-trend__kpi">
                <span className="money-trend__kpi-num">{trendKpis[2].val}</span>
                <span className="money-trend__kpi-lbl">bonuses</span>
                <span className="money-trend__kpi-cap">unlocked</span>
              </div>
              <div className="money-trend__kpi">
                <span className="money-trend__kpi-num">{trendKpis[3].val}</span>
                <span className="money-trend__kpi-lbl">campaigns</span>
                <span className="money-trend__kpi-cap">active this cycle</span>
              </div>
            </div>
          </div>
        </BentoModule>

        {/* v6 — Row 3 (Methods + Tax) DELETED.
            Per user-flow analysis, these are E-level (rare admin,
            quarterly/yearly): switch payment method, download 1099.
            They don't belong on a daily dashboard — daily dashboard
            serves A (quick balance check 80%), B (1-tap cashout),
            C (weekly review: trend + scans + bonus distance).
            Methods + Tax remain reachable via:
              · Cash hero quick-action "Methods" button (B-adjacent)
              · Tax · 1099 link in the page header strip below
              · Sidebar nav (global)
              · Sub-pages /money/methods + /money/tax for full mgmt. */}
      </section>

      {/* Admin link strip — tiny footer of E-level sub-page links.
          Sits below the dashboard and replaces the old row 3.
          Visually subdued so it reads as "by the way, here's where
          to manage your account". */}
      <nav className="money-admin-strip" aria-label="Account admin">
        <Link href="/creator/money/methods" className="money-admin-strip__link">
          <CreditCard size={14} strokeWidth={1.75} />
          Methods · {methodsCount} on file
        </Link>
        <span className="money-admin-strip__sep" aria-hidden>
          ·
        </span>
        <Link href="/creator/money/tax" className="money-admin-strip__link">
          <FileText size={14} strokeWidth={1.75} />
          Tax · {taxYear} · 1099-K
        </Link>
        <span className="money-admin-strip__sep" aria-hidden>
          ·
        </span>
        <Link href="/creator/money/history" className="money-admin-strip__link">
          <History size={14} strokeWidth={1.75} />
          Full history
        </Link>
      </nav>

      {/* Deep sections moved into dedicated sub-pages — landing
          stays a focused dashboard. Each panel above drills ↗ to
          its sub-page for the workflow's full surface:
            · /money/earnings   — KPI strip + source split + per-campaign table + tier impact
            · /money/milestones — 4 active milestones + tier ladder + tier impact details
            · /money/history    — KPI strip + transactions table + filters + export
            · /money/tax        — 4-step filing + setaside + monthly bars + 1099 download
            · /money/methods    — card stack + recent payouts + add/edit method */}
    </main>
  );
}
