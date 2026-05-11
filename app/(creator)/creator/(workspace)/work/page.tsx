"use client";

/* ============================================================
   /creator/work — WORK domain hub. v31 (2026-05-10)

   v31 changes:
   ① Remove horizontal gig urgency rail (was redundant with bento)
   ② Left bento: "Next Move" becomes a 20s cycling carousel —
      cycles through all active gigs, text-only transitions,
      progress bar restarts on each advance, "Next →" button
      manually skips
   ③ Right bento: renamed "Active · N gigs", now shows the gig
      list that was in the urgency rail (with thumbnail + chip + pay)
   ============================================================ */

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useLiveApplicationsList } from "@/lib/data/live-applications";
import {
  Zap,
  Inbox,
  TrendingUp,
  Wallet,
  Layers,
  Camera,
  Eye,
  Lightbulb,
  Activity,
  Sparkles,
  EyeOff,
  Calendar,
  Cloud,
  Navigation,
  FileEdit,
  QrCode,
  type LucideIcon,
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

/* ── Urgency / chip helpers ─────────────────────────────── */
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

/* ── Next Move carousel data ────────────────────────────── */
const MOVE_VERB: Record<string, string> = {
  shoot_live: "SHOOT",
  pre_shoot: "HEAD OUT",
  pending_upload: "UPLOAD",
  revision_requested: "REVISE",
  accepted: "PREP",
  reviewing: "WATCH",
  submitted: "WAIT",
  verified: "COLLECT",
  paid: "DONE",
};
const MOVE_DETAIL: Record<string, string> = {
  shoot_live: "QR at register · slot active now",
  pre_shoot: "Slot today · charge + QR ready",
  pending_upload: "Content due · 3 files to submit",
  revision_requested: "Flagged items · reshoot needed",
  accepted: "Review shot brief + confirm slot",
  reviewing: "Merchant reviewing your application",
  submitted: "Content under 72h merchant review",
  verified: "Transfer initiated · clearing soon",
  paid: "All done — rate your experience",
};
const MOVE_WHEN: Record<string, string> = {
  shoot_live: "Now",
  pre_shoot: "Today",
  pending_upload: "47h left",
  revision_requested: "48h window",
  accepted: "This week",
  reviewing: "~24h ETA",
  submitted: "72h window",
  verified: "~72h",
  paid: "Complete",
};
const MOVE_COLOR: Record<string, string> = {
  shoot_live: "red",
  pre_shoot: "amber",
  pending_upload: "blue",
  revision_requested: "amber",
  accepted: "green",
  reviewing: "snow50",
  submitted: "snow50",
  verified: "green",
  paid: "champagne",
};

const FALLBACK_MOVES = [
  {
    id: "app-disc-004",
    status: "pre_shoot",
    merchantName: "Roberta's Pizza",
    cashPay: 40,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=480&h=600&fit=crop&q=72",
  },
  {
    id: "app-disc-001",
    status: "pending_upload",
    merchantName: "Blank Street Coffee",
    cashPay: 32,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=480&h=600&fit=crop&q=72",
  },
  {
    id: "app-disc-002",
    status: "revision_requested",
    merchantName: "Chelsea Market",
    cashPay: 45,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=480&h=600&fit=crop&q=72",
  },
  {
    id: "app-disc-165",
    status: "submitted",
    merchantName: "Violette_FR",
    cashPay: 67,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=480&h=600&fit=crop&q=72",
  },
];

/* ── Per-status rich display data ──────────────────────────
   time   = large display (clock, countdown, or status label)
   action = one imperative sentence — what to do right now
   pct    = progress bar fill %
   chips  = max 2 context atoms (no repeat of action/time info)
   tasks  = 3 agent micro-steps
   ────────────────────────────────────────────────────────── */
type RichChip = { icon: LucideIcon; text: string };
type RichTask = [string, string, string]; // [verb, bold-target, note]
type RichEntry = {
  time: string;
  action: string;
  pct: number;
  chips: RichChip[];
  tasks: RichTask[];
};
const RICH: Record<string, RichEntry> = {
  shoot_live: {
    time: "LIVE",
    action: "Show QR at register — slot is active now",
    pct: 35,
    chips: [
      { icon: QrCode, text: "QR at register" },
      { icon: Camera, text: "3 frames · T+90" },
    ],
    tasks: [
      ["Show", "QR code", "at register to start attribution"],
      ["Capture", "wide shot", "storefront in natural light"],
      ["Submit", "3 frames", "before slot closes"],
    ],
  },
  pre_shoot: {
    time: "9:00",
    action: "Leave by 8:30 — 9 min on L train to arrive by 8:45",
    pct: 62,
    chips: [
      { icon: Cloud, text: "62°F · clear" },
      { icon: Navigation, text: "9 min · L train" },
    ],
    tasks: [
      ["Leave by", "8:30", "scout angle on the way"],
      ["Bring", "ring light", "counter is dim today"],
      ["QR on", "table 4", "frame 1 lock"],
    ],
  },
  pending_upload: {
    time: "6 PM",
    action: "Upload 3 frames + caption before today's deadline",
    pct: 55,
    chips: [
      { icon: Camera, text: "3 frames" },
      { icon: FileEdit, text: "Caption needed" },
    ],
    tasks: [
      ["Upload", "3 frames", "wide + product + lifestyle"],
      ["Write", "caption", "60–80 words · no hashtags"],
      ["Submit", "before 6 PM", "late = slot penalty"],
    ],
  },
  revision_requested: {
    time: "48h",
    action: "Reshoot the flagged frame — same location is fine",
    pct: 30,
    chips: [
      { icon: Camera, text: "Reshoot" },
      { icon: FileEdit, text: "Caption fix" },
    ],
    tasks: [
      ["Read", "feedback note", "from merchant first"],
      ["Reshoot", "flagged frame", "same location OK"],
      ["Resubmit", "before 48h", "window closes"],
    ],
  },
  reviewing: {
    time: "~24h",
    action: "Watch inbox — merchant typically replies within 24h",
    pct: 70,
    chips: [
      { icon: Eye, text: "Inbox alert on" },
      { icon: Inbox, text: "No action yet" },
    ],
    tasks: [
      ["Watch", "inbox", "reply notification comes here"],
      ["Browse", "new gigs", "while you wait"],
      ["Prep", "shot list", "for when it lands"],
    ],
  },
  submitted: {
    time: "72h",
    action: "Content is under review — check inbox for revision requests",
    pct: 45,
    chips: [
      { icon: Eye, text: "Merchant reviewing" },
      { icon: Wallet, text: "Payout on approval" },
    ],
    tasks: [
      ["Wait", "72h window", "merchant reviewing content"],
      ["Check", "inbox", "for any revision request"],
      ["Line up", "next gig", "keep momentum"],
    ],
  },
  verified: {
    time: "3 days",
    action: "Transfer initiated — payout clears in ~3 business days",
    pct: 80,
    chips: [
      { icon: Wallet, text: "Payout queued" },
      { icon: Sparkles, text: "Verified ✓" },
    ],
    tasks: [
      ["Watch", "Pay panel", "transfer clears Friday"],
      ["Rate", "experience", "boosts your tier score"],
      ["Apply", "next campaign", "keep the streak"],
    ],
  },
  accepted: {
    time: "Fri",
    action: "Slot confirmed — read brief tonight and charge gear tomorrow",
    pct: 20,
    chips: [
      { icon: Calendar, text: "Fri slot" },
      { icon: Camera, text: "3 frames" },
    ],
    tasks: [
      ["Read", "shot brief", "tonight"],
      ["Charge", "gear", "day before"],
      ["Set", "alarm", "15 min early for setup"],
    ],
  },
  paid: {
    time: "Done",
    action: "Payment received — rate your experience to earn tier points",
    pct: 100,
    chips: [
      { icon: Sparkles, text: "Tier points +1" },
      { icon: Wallet, text: "Paid ✓" },
    ],
    tasks: [
      ["Rate", "experience", "5 stars = tier boost"],
      ["Share", "to portfolio", "grows your profile"],
      ["Apply", "next campaign", "momentum matters"],
    ],
  },
};

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

  /* ── Next Move carousel ─────────────────────────────────── */
  type MoveItem = {
    id: string;
    status: string;
    merchantName: string;
    cashPay: number;
    thumbnailUrl?: string;
  };
  const moves: MoveItem[] = activeGigs.length > 0 ? activeGigs : FALLBACK_MOVES;

  const movesRef = useRef(moves);
  useEffect(() => {
    movesRef.current = moves;
  });

  const [rawIdx, setRawIdx] = useState(0);
  const [tick, setTick] = useState(0);

  const advanceMove = useCallback(() => {
    setRawIdx((i) => i + 1);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const id = setInterval(advanceMove, 20_000);
    return () => clearInterval(id);
  }, [advanceMove]);

  const moveIdx = rawIdx % moves.length;
  const currentMove = moves[moveIdx] ?? moves[0]!;

  /* ── KPIs ───────────────────────────────────────────────── */
  const kpis = {
    applied: buckets.invites.length || 6,
    confirmed: buckets.active.filter((it) => it.stage === 2).length || 1,
    execute: buckets.active.filter((it) => it.stage === 3).length || 1,
  };

  const pay = {
    cleared: 940,
    verifying: 263,
    cycleTarget: 1500,
    paidThisMonth: 1840,
    nextPayoutDay: "Fri",
    clearsInDays: 3,
    deltaPct: 22,
    verifiedScans: 24,
    avgPerScan: 50.13,
    lastScanAgo: "2h",
    tier: "Steel",
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

  const [hideMoney, setHideMoney] = useState(false);
  const m = (formatted: string) => (hideMoney ? "****" : formatted);

  const workHint = "Leave by 8:30 → Roberta's Pizza · 3 frames + ring light";

  return (
    <main className="work-hub" aria-label="Work">
      <header className="work-hero work-hero--compact">
        <h1 className="work-hero__title">Work</h1>
        <p className="work-hero__sub">{workHint}</p>
      </header>

      {/* ── Bento grid ────────────────────────────────────────── */}
      <section className="work-bento" aria-label="Work modules">
        {/* Row 1: Next Move (6) · Active Gigs (3) · Pulse (3) */}

        {/* ── Left: Next Move cycling carousel ─────────────────── */}
        <BentoModule
          href={`/creator/applied/${currentMove.id}`}
          eyebrow={`Next move · ${moveIdx + 1} / ${moves.length}`}
          icon={<Zap {...ICON_PROPS} />}
          span={6}
          tone="ink"
          live="urgent"
        >
          <div className="work-next">
            {/* Animated slide — key re-mounts on each advance */}
            <div key={tick} className="work-next__slide">
              {/* Merchant name eyebrow — small champagne label above time */}
              <p className="work-next__name">{currentMove.merchantName}</p>

              {/* Big time / status display */}
              <p className="work-next__time">
                {RICH[currentMove.status]?.time ?? "—"}
              </p>

              {/* One-sentence action — what to do right now */}
              <p className="work-next__action">
                {RICH[currentMove.status]?.action ?? "Action needed"}
              </p>

              {/* Progress bar — no meta text, just the visual */}
              <div className="work-next__countdown">
                <div className="work-next__countdown-track">
                  <div
                    className="work-next__countdown-fill"
                    style={{ width: `${RICH[currentMove.status]?.pct ?? 50}%` }}
                  />
                </div>
              </div>

              {/* 2 context chips */}
              <div className="work-next__chips">
                {(RICH[currentMove.status]?.chips ?? []).map(
                  ({ icon: Icon, text }, i) => (
                    <span key={i} className="work-next__chip">
                      <Icon size={14} strokeWidth={1.75} />
                      {text}
                    </span>
                  ),
                )}
              </div>

              {/* Agent micro-tasks */}
              <div className="work-next__agent-inline">
                <p className="work-next__agent-eyebrow">
                  <Lightbulb size={12} strokeWidth={2.25} />
                  Agent
                </p>
                <ul className="work-next__agent-mini">
                  {(RICH[currentMove.status]?.tasks ?? []).map(
                    ([verb, target, note], i) => (
                      <li key={i}>
                        {verb} <strong>{target}</strong> · {note}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            {/* Dots · ring · Next → (outside slide — don't re-animate) */}
            <div className="work-nextmove__nav">
              <div className="work-nextmove__dots" aria-hidden>
                {moves.map((_, i) => (
                  <span
                    key={i}
                    className={`work-nextmove__dot${i === moveIdx ? " is-active" : ""}`}
                  />
                ))}
              </div>
              <div className="work-nextmove__nav-right">
                {/* Circular 20s countdown — key restarts on each advance */}
                <div
                  key={tick}
                  className="work-nextmove__ring-wrap"
                  aria-hidden
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    style={{ display: "block" }}
                  >
                    {/* Track */}
                    <circle
                      cx="14"
                      cy="14"
                      r="11"
                      fill="none"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="2"
                    />
                    {/* Animated fill */}
                    <circle
                      className="work-nextmove__ring-fill"
                      cx="14"
                      cy="14"
                      r="11"
                      fill="none"
                      stroke="rgba(191,161,112,0.85)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="69.12"
                      strokeDashoffset="69.12"
                    />
                  </svg>
                </div>
                <button
                  type="button"
                  className="work-nextmove__btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    advanceMove();
                  }}
                  aria-label="Next move"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </BentoModule>

        {/* ── Right: Active gigs (replaces Actions queue) ─────── */}
        {/* Custom div to avoid nested <Link> with <Link> rows */}
        <div className="bento bento--span-3 bento--state-ready bento--gigrail">
          <div className="bento__head">
            <span className="bento__icon" aria-hidden>
              <Layers {...ICON_PROPS} />
            </span>
            <span className="bento__eyebrow">Active · {moves.length} gigs</span>
            <span className="bento__live bento__live--urgent" aria-hidden />
            <Link
              href="/creator/work/applied"
              className="bento__drill"
              aria-label="View all active gigs"
            >
              ↗
            </Link>
          </div>
          <div className="bento__body">
            <ul className="work-gigrail" aria-label="Active gigs">
              {moves.slice(0, 5).map((app) => (
                <li key={app.id}>
                  <Link
                    href={`/creator/applied/${app.id}`}
                    className="work-gigrail__row"
                  >
                    {app.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="work-gigrail__thumb"
                        src={app.thumbnailUrl}
                        alt=""
                      />
                    ) : (
                      <span className="work-gigrail__thumb work-gigrail__thumb--blank" />
                    )}
                    <span className="work-gigrail__body">
                      <span className="work-gigrail__name">
                        {app.merchantName}
                      </span>
                      <span
                        className={`work-gigrail__chip work-gigrail__chip--${CHIP_COLOR[app.status] ?? "gray"}`}
                      >
                        {CHIP_LABEL[app.status] ?? app.status}
                      </span>
                    </span>
                    <span className="work-gigrail__pay">${app.cashPay}</span>
                    <span className="work-gigrail__arrow" aria-hidden>
                      ›
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Pulse panel (unchanged) ───────────────────────────── */}
        <div className="bento bento--span-3 bento--state-ready work-pulse-panel">
          <div className="bento__head">
            <span className="bento__icon" aria-hidden>
              <Activity {...ICON_PROPS} />
            </span>
            <span className="bento__eyebrow">
              Pulse · 7D · {pulseActive!.delta >= 0 ? "+" : ""}
              {pulseActive!.delta}%
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
                <TimeChart
                  key={pulseActive!.key}
                  mode="line"
                  accent="champagne"
                  defaultPeriod="7d"
                  smooth
                  showPrior={false}
                  valuePrefix={pulseActive!.key === "earn" ? "$" : ""}
                  valueSuffix={pulseActive!.key === "er" ? "%" : ""}
                  data={{ "7d": pulseActive!.spark }}
                  labels={{
                    "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  }}
                  ariaLabel={`${pulseActive!.label} 7-day pulse`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 (7+5): Velocity · Pay */}

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

        <BentoModule
          href="/creator/money"
          eyebrow={`Pay · cycle close ${pay.nextPayoutDay}`}
          icon={<Wallet {...ICON_PROPS} />}
          span={5}
          tone="champagne"
        >
          <div className="work-pay">
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

        {/* Row 3 (3+3+3+3): 4 mini nav cards */}

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
