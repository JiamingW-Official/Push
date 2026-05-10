"use client";

/* ============================================================
   /creator/work — WORK domain hub. v30 (2026-05-09 afternoon)

   v30 fixes 5 user complaints:
   ① Pipeline strip questioned + "莫名其妙" → KILLED. Stage counts
      were already in mini cards below; strip was just nav repeat.
   ② Velocity span 12 too long → span 8 (chart breathes, balanced)
   ③ This Week was Row 1 → moved to Row 2 (paired with chart)
   ④ Each row dense: 3 panels per row instead of 2
   ⑤ Bottom mini cards redesigned in v29 already, kept

   Layout:
     Row 1 (5+4+3): NEXT MOVE (ink) · ACTIONS (urgent) · PULSE 24h (live)
     Row 2 (8+4):   VELOCITY chart · THIS WEEK milestone (champagne)
     Row 3 (3+3+3+3): Applied · Paid · Disputes · Pipeline (4 mini nav)
   ============================================================ */

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLiveApplicationsList } from "@/lib/data/live-applications";
import {
  Zap,
  Inbox,
  CheckSquare,
  TrendingUp,
  Wallet,
  Layers,
  Camera,
  Upload,
  Eye,
  CheckCircle2,
  Lightbulb,
  Activity,
  Sparkles,
  EyeOff,
  MessageSquare,
  Calendar,
  Cloud,
  Navigation,
  FileEdit,
  AlertTriangle,
} from "lucide-react";
import { BentoModule } from "@/components/shared/primitives";
import TimeChart from "@/components/shared/charts/TimeChart";
import { useActiveGigs, useInvites } from "@/lib/data/hooks";
import {
  enrich,
  partitionByKind,
  type GigWithPriority,
} from "@/lib/creator/gigs/stage";
import "@/components/shared/hub-shell.css";
import "./work.css";

const ICON_PROPS = { size: 18, strokeWidth: 1.75 } as const;
const TOP_GIG_ID = "disc-001";

const URGENCY_RANK: Record<string, number> = {
  shoot_live: 0,
  pre_shoot: 1,
  pending_upload: 2,
  revision_requested: 3,
  accepted: 4,
  reviewing: 5,
  submitted: 6,
  verified: 7,
  paid: 8,
};
const CHIP_COLOR: Record<string, string> = {
  shoot_live: "red",
  pre_shoot: "amber",
  pending_upload: "blue",
  revision_requested: "amber",
  accepted: "green",
  reviewing: "gray",
  submitted: "blue",
  verified: "green",
  paid: "champagne",
};
const CHIP_LABEL: Record<string, string> = {
  shoot_live: "Live now",
  pre_shoot: "Today",
  pending_upload: "Upload",
  revision_requested: "Revise",
  accepted: "Confirmed",
  reviewing: "In review",
  submitted: "Submitted",
  verified: "Verified",
  paid: "Paid",
};
const TERMINAL_STATUS = new Set(["declined", "withdrawn"]);

export default function WorkHub() {
  const { data: invites } = useInvites();
  const { data: actives } = useActiveGigs();
  const liveApps = useLiveApplicationsList();

  const allItems: GigWithPriority[] = useMemo(() => {
    const merged = [...(invites ?? []), ...(actives ?? [])];
    const seen = new Set<string>();
    const unique = merged.filter((g) => {
      if (seen.has(g.id)) return false;
      seen.add(g.id);
      return true;
    });
    return enrich(unique);
  }, [invites, actives]);

  const buckets = useMemo(() => partitionByKind(allItems), [allItems]);

  const activeGigs = useMemo(
    () =>
      liveApps
        .filter((a) => !TERMINAL_STATUS.has(a.status))
        .sort(
          (a, b) =>
            (URGENCY_RANK[a.status] ?? 99) - (URGENCY_RANK[b.status] ?? 99),
        ),
    [liveApps],
  );

  const kpis = {
    applied: buckets.invites.length || 6,
    confirmed: buckets.active.filter((it) => it.stage === 2).length || 1,
    execute: buckets.active.filter((it) => it.stage === 3).length || 1,
  };

  /* Pay panel data — Push-specific narrative.
     Cleared = withdrawable RIGHT NOW (Stripe Connect instant).
     Verifying = scanned + recorded but still inside the 72h
     attribution decay window (per v5.4 Tier 0 architecture).
     Empty = portion of cycle target still unearned.
     Each verified QR scan has an avg rate determined by creator
     tier — Steel ≈ $11.75/scan after platform cut. */
  const pay = {
    cleared: 940, // ready to cash out instantly
    verifying: 263, // 72h decay window — clears on Fri
    cycleTarget: 1500, // weekly target this cycle
    paidThisMonth: 1840,
    nextPayoutDay: "Fri",
    clearsInDays: 3,
    deltaPct: 22, // vs prior cycle
    verifiedScans: 24, // unique attributed in-store scans
    avgPerScan: 50.13, // 24 scans / $1,203 total this cycle
    lastScanAgo: "2h", // recent attribution event
    tier: "Steel", // creator tier (v3.0 6-tier system)
  };
  const cycleEarned = pay.cleared + pay.verifying;
  const cycleEmpty = Math.max(0, pay.cycleTarget - cycleEarned);

  const pulse = {
    scans24h: 12,
    verified: 8,
    earned24h: 94,
    activeCampaigns: 3,
    spark24h: [2, 1, 0, 0, 1, 3, 2, 0, 1, 1, 0, 1],
    deltaVsAvg: 18,
  };

  /* Pulse 6-metric array — past 7 DAYS (one value per day, M→S).
     Numbers are internally consistent across the funnel:
       VIEWS  (29.4k) = impressions on this week's posts
       ENGAGE (2,180) = likes + comments + shares (ER = 7.4%)
       SCANS  (84)    = QR/link touchpoints from those impressions
       OK     (56)    = scans that verified in-store (verify ≈ 67%)
       EARNED ($658)  = payout from the 56 verified scans (avg $11.75)
       ER     (7.4%)  = ENGAGE / VIEWS — derived from the two columns */
  const PULSE_IMP = [3800, 4200, 3500, 4600, 4900, 4200, 4200];
  const PULSE_ENG = PULSE_IMP.map((v) => Math.round(v * 0.074));
  const PULSE_SCAN = [11, 13, 9, 14, 15, 12, 10];
  const PULSE_OK = PULSE_SCAN.map((v) => Math.round(v * 0.67));
  const PULSE_EARN = PULSE_OK.map((v) => v * 11.75);
  const PULSE_ER = PULSE_IMP.map(
    (v, i) => +(((PULSE_ENG[i] ?? 0) / Math.max(v, 1)) * 100).toFixed(1),
  );

  type PulseKey = "scans" | "ok" | "earn" | "engage" | "imp" | "er";
  const PULSE_METRICS: Array<{
    key: PulseKey;
    label: string;
    display: string;
    spark: number[];
    delta: number;
  }> = [
    {
      key: "scans",
      label: "Scans",
      display: "84",
      spark: PULSE_SCAN,
      delta: 18,
    },
    { key: "ok", label: "Verified", display: "56", spark: PULSE_OK, delta: 14 },
    {
      key: "earn",
      label: "Earned",
      display: "$658",
      spark: PULSE_EARN,
      delta: 22,
    },
    {
      key: "engage",
      label: "Engage",
      display: "2.2k",
      spark: PULSE_ENG,
      delta: 9,
    },
    {
      key: "imp",
      label: "Views",
      display: "29.4k",
      spark: PULSE_IMP,
      delta: 31,
    },
    {
      key: "er",
      label: "Eng rate",
      display: "7.4%",
      spark: PULSE_ER,
      delta: -2,
    },
  ];
  const [pulseKey, setPulseKey] = useState<PulseKey>("scans");
  const pulseActive =
    PULSE_METRICS.find((m) => m.key === pulseKey) ?? PULSE_METRICS[0];

  /* Privacy toggle — when hideMoney is true, EVERY money string on
     the page renders as **** (Pay panel + Pulse earn + Paid mini
     card). Eye / EyeOff icon next to $940 is the single control
     point; state is local to the work hub session. */
  const [hideMoney, setHideMoney] = useState(false);
  const m = (formatted: string) => (hideMoney ? "****" : formatted);

  /* v47 — agent-style sub line under "Work" title (matches /money's
     pattern). Picks the most pressing imperative right now: leaving
     for the next confirmed shoot. Reads as a contextual hint, not a
     timestamp. */
  const workHint = "Leave by 8:30 → Roberta's Pizza · 3 frames + ring light";

  return (
    <main className="work-hub" aria-label="Work">
      <header className="work-hero work-hero--compact">
        <h1 className="work-hero__title">Work</h1>
        <p className="work-hero__sub">{workHint}</p>
      </header>

      {/* ── Active gigs urgency strip — only when there are live apps ── */}
      {activeGigs.length > 0 && (
        <div className="work-urgency" aria-label="Active gigs">
          {activeGigs.map((app) => (
            <Link
              key={app.id}
              href={`/creator/applied/${app.id}`}
              className="work-urgency__card"
            >
              {app.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="work-urgency__thumb"
                  src={app.thumbnailUrl}
                  alt=""
                />
              ) : (
                <span className="work-urgency__thumb work-urgency__thumb--blank" />
              )}
              <span className="work-urgency__body">
                <span className="work-urgency__name">{app.merchantName}</span>
                <span className="work-urgency__status-row">
                  <span
                    className={`work-urgency__chip work-urgency__chip--${CHIP_COLOR[app.status] ?? "gray"}`}
                  >
                    {CHIP_LABEL[app.status] ?? app.status}
                  </span>
                  <span className="work-urgency__pay">${app.cashPay}</span>
                </span>
              </span>
              <span className="work-urgency__arrow" aria-hidden>
                ›
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* ── Bento ── v30: Pipeline strip removed (was redundant nav) ── */}
      <section className="work-bento" aria-label="Work modules">
        {/* Row 1 (5+4+3): Next Move · Actions · Pulse 24h */}

        <BentoModule
          href={`/creator/work/active/${TOP_GIG_ID}`}
          eyebrow="Next move · in 47 min"
          icon={<Zap {...ICON_PROPS} />}
          span={6}
          tone="ink"
          live="urgent"
        >
          <div className="work-next">
            <p className="work-next__time">9:00</p>
            <p className="work-next__time-meta">
              AM · Roberta&apos;s Pizza · 261 Moore St
            </p>

            {/* Countdown rail — progress bar showing time-until-leave,
                then meta line "47:00 to go · arrive by 8:45". */}
            <div className="work-next__countdown" aria-label="Time until leave">
              <div className="work-next__countdown-track">
                <div
                  className="work-next__countdown-fill"
                  style={{ width: "62%" }}
                />
              </div>
              <p className="work-next__countdown-meta">
                47:00 to go · arrive by <strong>8:45</strong>
              </p>
            </div>

            {/* Trip chips — weather + transit + frames. Replaces the
                old Williamsburg/3 frames/Tag merchant row. */}
            <div className="work-next__chips">
              <span className="work-next__chip">
                <Cloud size={14} strokeWidth={1.75} />
                62°F · clear
              </span>
              <span className="work-next__chip">
                <Navigation size={14} strokeWidth={1.75} />9 min · L train
              </span>
              <span className="work-next__chip">
                <Camera size={14} strokeWidth={1.75} />3 frames
              </span>
            </div>

            <div className="work-next__agent-inline">
              <p className="work-next__agent-eyebrow">
                <Lightbulb size={12} strokeWidth={2.25} />
                Agent
              </p>
              <ul className="work-next__agent-mini">
                <li>
                  Leave by <strong>8:30</strong> · scout angle
                </li>
                <li>
                  Bring <strong>ring light</strong> · counter dim
                </li>
                <li>
                  QR on <strong>table 4</strong> · frame 1 lock
                </li>
              </ul>
            </div>
          </div>
        </BentoModule>

        <BentoModule
          href="/creator/work/active"
          eyebrow={`Actions · ${kpis.confirmed + kpis.execute + 1} due today`}
          icon={<CheckSquare {...ICON_PROPS} />}
          span={3}
          live="urgent"
        >
          <ul className="work-queue" aria-label="Action queue">
            <li className="work-queue__row work-queue__row--submit">
              <span className="work-queue__tile" aria-hidden>
                <Upload size={18} strokeWidth={1.75} />
              </span>
              <span className="work-queue__copy">
                <span className="work-queue__verb">Submit</span>
                <span className="work-queue__target">Devoción content</span>
              </span>
              <span className="work-queue__when">6 PM</span>
            </li>
            <li className="work-queue__row work-queue__row--reply">
              <span className="work-queue__tile" aria-hidden>
                <MessageSquare size={18} strokeWidth={1.75} />
              </span>
              <span className="work-queue__copy">
                <span className="work-queue__verb">Reply</span>
                <span className="work-queue__target">
                  Roberta&apos;s — angles
                </span>
              </span>
              <span className="work-queue__when">2h</span>
            </li>
            <li className="work-queue__row work-queue__row--review">
              <span className="work-queue__tile" aria-hidden>
                <Eye size={18} strokeWidth={1.75} />
              </span>
              <span className="work-queue__copy">
                <span className="work-queue__verb">Review</span>
                <span className="work-queue__target">Brow Theory invite</span>
              </span>
              <span className="work-queue__when">Today</span>
            </li>
            <li className="work-queue__row work-queue__row--confirm">
              <span className="work-queue__tile" aria-hidden>
                <Calendar size={18} strokeWidth={1.75} />
              </span>
              <span className="work-queue__copy">
                <span className="work-queue__verb">Confirm</span>
                <span className="work-queue__target">Maman shoot · Fri</span>
              </span>
              <span className="work-queue__when">EOD</span>
            </li>
          </ul>
        </BentoModule>

        {/* Pulse — custom panel (not BentoModule) so the inner stat
            tiles can be <button> click targets without bubbling into
            a Link nav. The drill ↗ in the head is its own <Link>. */}
        <div className="bento bento--span-3 bento--state-ready work-pulse-panel">
          <div className="bento__head">
            <span className="bento__icon" aria-hidden>
              <Activity {...ICON_PROPS} />
            </span>
            <span className="bento__eyebrow">
              Pulse · 7D · {pulseActive.delta >= 0 ? "+" : ""}
              {pulseActive.delta}%
            </span>
            <span className="bento__live bento__live--live" aria-hidden />
            <Link
              href="/creator/analytics/attribution"
              className="bento__drill"
              aria-label="Open attribution analytics"
            >
              ↗
            </Link>
          </div>

          <div className="bento__body">
            <div className="work-pulse">
              <div
                className="work-pulse__grid"
                role="tablist"
                aria-label="Pulse metric"
              >
                {PULSE_METRICS.map((metric) => (
                  <button
                    key={metric.key}
                    type="button"
                    role="tab"
                    aria-selected={pulseKey === metric.key}
                    className={`work-pulse__stat-panel${pulseKey === metric.key ? " is-active" : ""}`}
                    onClick={() => setPulseKey(metric.key)}
                  >
                    <span className="work-pulse__num">
                      {metric.key === "earn"
                        ? m(metric.display)
                        : metric.display}
                    </span>
                    <span className="work-pulse__lbl">{metric.label}</span>
                  </button>
                ))}
              </div>
              <div className="work-chart-bottom work-chart-bottom--pulse">
                {/* Hover-interactive spark via TimeChart so each bucket
                    shows value + time on hover (matches Velocity pattern).
                    Period-switcher hidden via .work-pulse-panel CSS — only
                    the 24h "7d" series exists. */}
                {/* v45: 7-day fixed-period smooth-curve line chart.
                    Period switcher hidden via CSS; only the 7d series
                    renders. Day labels (M-S) under the chart. */}
                <TimeChart
                  key={pulseActive.key}
                  mode="line"
                  accent="champagne"
                  defaultPeriod="7d"
                  smooth
                  showPrior={false}
                  valuePrefix={pulseActive.key === "earn" ? "$" : ""}
                  valueSuffix={pulseActive.key === "er" ? "%" : ""}
                  data={{ "7d": pulseActive.spark }}
                  labels={{
                    "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  }}
                  ariaLabel={`${pulseActive.label} 7-day pulse`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 (7+5): Velocity chart · Pay panel — slimmer Velocity
            (was span 8) gives Pay 1 more col so the new KPI strip
            has room. Default period 7D so the chart reads dense. */}

        <BentoModule
          href="/creator/work/velocity"
          eyebrow="Velocity · gigs / week · 30D"
          icon={<TrendingUp {...ICON_PROPS} />}
          span={7}
        >
          <div className="work-chart-bottom work-chart-bottom--velocity">
            <TimeChart
              mode="bar"
              accent="ink"
              valueSuffix=" gigs"
              defaultPeriod="30d"
              data={{
                "7d": [1, 2, 1, 3, 2, 2, 1],
                "30d": Array.from({ length: 30 }, (_, i) =>
                  Math.max(
                    0,
                    Math.round(2 + Math.sin(i * 0.7) * 1.5 + i * 0.05),
                  ),
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
                "90d": [
                  "Wk1",
                  "Wk2",
                  "Wk3",
                  "Wk4",
                  "Wk5",
                  "Wk6",
                  "Wk7",
                  "Wk8",
                  "Wk9",
                  "Wk10",
                  "Wk11",
                  "Wk12",
                ],
                all: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
              }}
              ariaLabel="Gigs completed velocity"
            />
          </div>
        </BentoModule>

        {/* Pay panel — v49 premium Push redesign.
            The earlier 3-KPI strip read as generic fintech. This
            version tells the Push story: a creator earns money via
            verified in-store scans (the unit of work), each cycle
            closes on Friday with a payout. Three layers of info:
              1. Hero: $940 instantly withdrawable + delta + tier badge
              2. Segmented bar: cleared / verifying / unearned cycle
              3. Attribution row: # of verified scans + avg/scan +
                 most recent scan timestamp — Push DNA. */}
        <BentoModule
          href="/creator/money"
          eyebrow={`Pay · cycle close ${pay.nextPayoutDay}`}
          icon={<Wallet {...ICON_PROPS} />}
          span={5}
          tone="champagne"
        >
          <div className="work-pay">
            {/* Hero row — big withdrawable number left, tier right.
                Eye toggle sits inline next to the number; clicking it
                hides every money string on the page (returns to ****
                when EyeOff). preventDefault stops the parent Link nav. */}
            <div className="work-pay__hero">
              <div className="work-pay__hero-stack">
                <div className="work-pay__hero-num-row">
                  <span className="work-pay__hero-num">
                    {hideMoney ? "****" : `$${pay.cleared.toLocaleString()}`}
                  </span>
                  <button
                    type="button"
                    className="work-pay__eye"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setHideMoney((v) => !v);
                    }}
                    aria-label={hideMoney ? "Show amounts" : "Hide amounts"}
                    title={hideMoney ? "Show amounts" : "Hide amounts"}
                  >
                    {hideMoney ? (
                      <EyeOff size={16} strokeWidth={1.75} />
                    ) : (
                      <Eye size={16} strokeWidth={1.75} />
                    )}
                  </button>
                </div>
                <span className="work-pay__hero-sub">
                  ready to cash out
                  <span className="work-pay__delta">↑ {pay.deltaPct}%</span>
                </span>
              </div>
              <span
                className="work-pay__tier"
                title={`${pay.tier} tier creator`}
              >
                <Sparkles size={12} strokeWidth={1.75} />
                {pay.tier}
              </span>
            </div>

            {/* Segmented cycle bar — cleared / verifying / unearned.
                Three flex segments scaled by their dollar amounts so
                the bar visually represents this cycle's pay anatomy. */}
            <div className="work-pay__bar" aria-label="Cycle progress">
              <span
                className="work-pay__seg work-pay__seg--cleared"
                style={{ flex: pay.cleared }}
                title={`$${pay.cleared} cleared`}
              />
              <span
                className="work-pay__seg work-pay__seg--verifying"
                style={{ flex: pay.verifying }}
                title={`$${pay.verifying} verifying`}
              />
              <span
                className="work-pay__seg work-pay__seg--empty"
                style={{ flex: cycleEmpty }}
                title={`$${cycleEmpty} unearned of cycle`}
              />
            </div>
            <div className="work-pay__bar-legend">
              <span className="work-pay__bar-legend-item">
                <span className="work-pay__legend-swatch work-pay__legend-swatch--cleared" />
                <strong>{m(`$${pay.cleared}`)}</strong> cleared
              </span>
              <span className="work-pay__bar-legend-item">
                <span className="work-pay__legend-swatch work-pay__legend-swatch--verifying" />
                <strong>{m(`$${pay.verifying}`)}</strong> verifying ·{" "}
                {pay.clearsInDays}d
              </span>
            </div>

            {/* Push-signature attribution row — what makes this panel
                belong to Push and no one else: verified-scan unit
                economics. */}
            <div className="work-pay__attr">
              <span className="work-pay__attr-dot" aria-hidden />
              <strong>{pay.verifiedScans}</strong> verified scans
              <span className="work-pay__attr-sep">·</span>
              avg <strong>{m(`$${pay.avgPerScan.toFixed(2)}`)}</strong>/scan
              <span className="work-pay__attr-sep">·</span>
              last <strong>{pay.lastScanAgo}</strong> ago
            </div>
          </div>
        </BentoModule>

        {/* Row 3 (3+3+3+3): 4 mini nav cards · v31 each gets own chart */}

        <Link
          href="/creator/work/applied"
          className="work-mini work-mini--champagne"
          prefetch={false}
        >
          <div className="work-mini__head">
            <span className="work-mini__icon-fill" aria-hidden>
              <Inbox size={18} strokeWidth={1.75} />
            </span>
            <span className="work-mini__arrow" aria-hidden>
              ↗
            </span>
          </div>
          <span className="work-mini__num">{kpis.applied}</span>
          <span className="work-mini__lbl">Applied · waiting</span>
          <span className="work-mini__sub">
            2 likely accepted EOD · avg reply 18h
          </span>
          <div className="work-mini__viz" aria-hidden>
            <div className="work-mini__seg-bar">
              <span
                className="work-mini__seg work-mini__seg--accept"
                style={{ flex: 2 }}
                title="2 likely accepted"
              />
              <span
                className="work-mini__seg work-mini__seg--review"
                style={{ flex: 3 }}
                title="3 reviewing"
              />
              <span
                className="work-mini__seg work-mini__seg--decline"
                style={{ flex: 1 }}
                title="1 declined"
              />
            </div>
            <div className="work-mini__viz-legend">
              <span>
                <strong>2</strong> accept
              </span>
              <span>
                <strong>3</strong> review
              </span>
              <span>
                <strong>1</strong> decline
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/creator/work/wrap"
          className="work-mini work-mini--green"
          prefetch={false}
        >
          <div className="work-mini__head">
            <span className="work-mini__icon-fill" aria-hidden>
              <Wallet size={18} strokeWidth={1.75} />
            </span>
            <span className="work-mini__arrow" aria-hidden>
              ↗
            </span>
          </div>
          <span className="work-mini__num">{m("$1,840")}</span>
          <span className="work-mini__lbl">Paid · last 7 days</span>
          <span className="work-mini__sub">
            Avg {m("$263")} · 2 to rate · 94 scans
          </span>
          <div className="work-mini__viz" aria-hidden>
            <div className="work-mini__sparkbars">
              {[312, 264, 0, 95, 240, 731, 198].map((v, i) => (
                <span
                  key={i}
                  className={`work-mini__sparkbar${i === 6 ? " is-current" : ""}`}
                  style={{ height: `${Math.max((v / 731) * 100, 6)}%` }}
                  title={`Day ${i + 1}: $${v}`}
                />
              ))}
            </div>
            <div className="work-mini__viz-axis">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </div>
        </Link>

        {/* v63 — replaced broken "Disputes · open" mini (href looped back to
            /creator/work) with "Drafts · in progress" since /drafts was an
            orphan page with NO inbound link. Drafts is core flow content
            (WIP shoot prep / unposted reels), Disputes is rare-flow which
            now lives in admin-strip footer + /wrap deep-link only. */}
        <Link
          href="/creator/work/drafts"
          className="work-mini work-mini--ok"
          prefetch={false}
        >
          <div className="work-mini__head">
            <span className="work-mini__icon-fill" aria-hidden>
              <FileEdit size={18} strokeWidth={1.75} />
            </span>
            <span className="work-mini__arrow" aria-hidden>
              ↗
            </span>
          </div>
          <span className="work-mini__num">3</span>
          <span className="work-mini__lbl">Drafts · in progress</span>
          <span className="work-mini__sub">
            2 ready to post · 1 needs review
          </span>
          <div className="work-mini__viz" aria-hidden>
            <div className="work-mini__streak">
              {[
                { state: "ready" },
                { state: "ready" },
                { state: "review" },
              ].map((d, i) => (
                <span
                  key={i}
                  className="work-mini__streak-dot work-mini__streak-dot--ok"
                  style={{
                    aspectRatio: "auto",
                    width: "auto",
                    height: 18,
                    padding: "0 8px",
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--snow)",
                    background: "var(--ink, #111)",
                  }}
                >
                  {d.state}
                </span>
              ))}
            </div>
            <div className="work-mini__viz-legend">
              <span>
                <strong>3</strong> drafts · oldest 2d
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/creator/work/pipeline"
          className="work-mini work-mini--ink"
          prefetch={false}
        >
          <div className="work-mini__head">
            <span className="work-mini__icon-fill" aria-hidden>
              <Layers size={18} strokeWidth={1.75} />
            </span>
            <span className="work-mini__arrow" aria-hidden>
              ↗
            </span>
          </div>
          <span className="work-mini__num">
            {kpis.confirmed + kpis.execute + 1}
          </span>
          <span className="work-mini__lbl">Pipeline · in flight</span>
          <span className="work-mini__sub">
            Across 3 stages · open 7-stage kanban
          </span>
          <div className="work-mini__viz" aria-hidden>
            <div className="work-mini__stages">
              {[
                { l: "D", on: false },
                { l: "Q", on: false },
                { l: "A", on: false },
                { l: "C", on: true },
                { l: "S", on: true },
                { l: "Sb", on: true },
                { l: "P", on: false },
              ].map((s, i) => (
                <span
                  key={i}
                  className={`work-mini__stage-pip${s.on ? " is-on" : ""}`}
                >
                  {s.l}
                </span>
              ))}
            </div>
            <div className="work-mini__viz-legend">
              <span>
                <strong>3</strong> stages active · C·S·Sb
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* v47/63 — admin link strip (matches /money pattern). Sub-page nav
          for E-level deep dives. v63 added Calendar + Velocity + (conditional)
          Disputes so EVERY work sub-page has at least one canonical entry
          point from the hub — no more orphan pages. */}
      <nav className="work-admin-strip" aria-label="Work admin">
        <Link href="/creator/work/pipeline" className="work-admin-strip__link">
          <Layers size={14} strokeWidth={1.75} />
          Pipeline · 3 in flight
        </Link>
        <span className="work-admin-strip__sep" aria-hidden>
          ·
        </span>
        <Link href="/creator/work/applied" className="work-admin-strip__link">
          <Inbox size={14} strokeWidth={1.75} />
          Applied · {kpis.applied} waiting
        </Link>
        <span className="work-admin-strip__sep" aria-hidden>
          ·
        </span>
        <Link href="/creator/work/wrap" className="work-admin-strip__link">
          <Wallet size={14} strokeWidth={1.75} />
          Wrap · {kpis.confirmed} to rate
        </Link>
        <span className="work-admin-strip__sep" aria-hidden>
          ·
        </span>
        <Link href="/creator/work/calendar" className="work-admin-strip__link">
          <Calendar size={14} strokeWidth={1.75} />
          Calendar
        </Link>
        <span className="work-admin-strip__sep" aria-hidden>
          ·
        </span>
        <Link href="/creator/work/velocity" className="work-admin-strip__link">
          <TrendingUp size={14} strokeWidth={1.75} />
          Velocity
        </Link>
      </nav>
    </main>
  );
}
