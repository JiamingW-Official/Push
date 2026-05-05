"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./grid.css";

/* ── Types ─────────────────────────────────────────────── */

type SlotStatus = "DONE" | "OVERDUE" | "ON GOING";
type SlotCategory = "coffee" | "food";
type StepState = "done" | "current" | "current-overdue" | "pending";
type RecentStatusIcon = "done" | "overdue" | "tracking";

interface TimeSlot {
  id: string;
  timeStart: string;
  timeEnd: string;
  category: SlotCategory;
  title: string;
  status: SlotStatus;
  payout: number;
  business: string;
  address: string;
  qrCode?: string;
  scanCount?: number;
}

interface InboxItem {
  initials: string;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
}

interface WeekDay {
  day: string;
  amount: number;
  isToday: boolean;
}

interface RecentItem {
  id: string;
  initials: string;
  merchant: string;
  statusIcon: RecentStatusIcon;
  statusText: string;
  time: string;
  needsReview?: boolean;
}

interface AvailableCampaign {
  id: string;
  business: string;
  address: string;
  payout: number;
  category: SlotCategory;
  distance: string;
  reason?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  doneByPush?: boolean;
  href: string;
}

/* ── Constants ─────────────────────────────────────────── */

const WORKFLOW_STEPS = [
  "Accepted",
  "Scheduled",
  "Posted",
  "Verifying",
  "Paid",
] as const;

// Production: derive from creator.tier === "Clay" || creator.completedCampaigns < 3
const isOnboarding = false;

/* ── Helpers ───────────────────────────────────────────── */

function getStepState(stepIndex: number, slotStatus: SlotStatus): StepState {
  // DONE = submitted → Verifying (step 3); otherwise = Posted (step 2)
  const currentStep = slotStatus === "DONE" ? 3 : 2;
  if (stepIndex < currentStep) return "done";
  if (stepIndex === currentStep) {
    return slotStatus === "OVERDUE" ? "current-overdue" : "current";
  }
  return "pending";
}

/* ── Mock data ─────────────────────────────────────────── */

const TIMELINE: TimeSlot[] = [
  {
    id: "s1",
    timeStart: "10:00",
    timeEnd: "11:30",
    category: "coffee",
    title: "Morning Coffee Story",
    status: "DONE",
    payout: 18,
    business: "Blank Street Coffee",
    address: "5 W 19th St",
    qrCode: "QR-BSC-0427",
    scanCount: 14,
  },
  {
    id: "s2",
    timeStart: "12:30",
    timeEnd: "14:00",
    category: "food",
    title: "Lunch Reel Campaign",
    status: "OVERDUE",
    payout: 32,
    business: "Superiority Burger",
    address: "119 Avenue A",
    qrCode: "QR-SB-0427",
    scanCount: 0,
  },
  {
    id: "s3",
    timeStart: "19:00",
    timeEnd: "20:30",
    category: "coffee",
    title: "Evening Matcha Story",
    status: "ON GOING",
    payout: 18,
    business: "Cha Cha Matcha",
    address: "3 W 16th St",
    qrCode: "QR-CC-0427",
    scanCount: 3,
  },
];

const INBOX_ITEMS: InboxItem[] = [
  {
    initials: "BS",
    name: "Blank Street Coffee",
    preview: "Approved — paying out tonight",
    time: "2m",
    unread: true,
  },
  {
    initials: "SB",
    name: "Saint Bagel",
    preview: "Question on the submission",
    time: "18m",
    unread: true,
  },
  {
    initials: "AM",
    name: "Anya M.",
    preview: "Campaign starts Monday",
    time: "1h",
    unread: false,
  },
  {
    initials: "CY",
    name: "Kopitiam NYC",
    preview: "Reschedule to Thursday?",
    time: "3h",
    unread: false,
  },
  {
    initials: "JC",
    name: "Joe Coffee",
    preview: "New Friday slot added",
    time: "5h",
    unread: false,
  },
  {
    initials: "IR",
    name: "Ivan Ramen",
    preview: "Looking forward to it",
    time: "1d",
    unread: false,
  },
  {
    initials: "ML",
    name: "Matcha Lab",
    preview: "Payment confirmed",
    time: "1d",
    unread: false,
  },
  {
    initials: "FE",
    name: "Flamingo Estate",
    preview: "Love the content!",
    time: "2d",
    unread: false,
  },
];

const WEEK_EARNINGS: WeekDay[] = [
  { day: "M", amount: 18, isToday: false },
  { day: "T", amount: 32, isToday: false },
  { day: "W", amount: 0, isToday: false },
  { day: "T", amount: 18, isToday: false },
  { day: "F", amount: 13, isToday: false },
  { day: "S", amount: 0, isToday: false },
  { day: "S", amount: 0, isToday: true },
];

/* Recent — one row per campaign, single status line */
const RECENT_TODAY: RecentItem[] = [
  {
    id: "r1",
    initials: "BS",
    merchant: "Blank Street Coffee",
    statusIcon: "done",
    statusText: "Paid +$18 · 14v",
    time: "2m ago",
  },
  {
    id: "r2",
    initials: "SB",
    merchant: "Superiority Burger",
    statusIcon: "overdue",
    statusText: "Submit by 14:00",
    time: "Now",
  },
  {
    id: "r3",
    initials: "CC",
    merchant: "Cha Cha Matcha",
    statusIcon: "tracking",
    statusText: "3/8 verified",
    time: "6h ago",
  },
  {
    id: "r4",
    initials: "JC",
    merchant: "Joe Coffee",
    statusIcon: "tracking",
    statusText: "Invite pending",
    time: "3h ago",
    needsReview: true,
  },
];

const RECENT_YESTERDAY: RecentItem[] = [
  {
    id: "r5",
    initials: "FE",
    merchant: "Flamingo Estate",
    statusIcon: "done",
    statusText: "Paid +$11 · 6v",
    time: "Yesterday",
  },
  {
    id: "r6",
    initials: "LB",
    merchant: "Lil Bagel",
    statusIcon: "done",
    statusText: "Accepted · 9am",
    time: "Yesterday",
  },
  {
    id: "r7",
    initials: "ML",
    merchant: "Matcha Lab",
    statusIcon: "done",
    statusText: "Paid +$20 · 9v",
    time: "Yesterday",
  },
];

const AVAILABLE: AvailableCampaign[] = [
  {
    id: "a1",
    business: "Joe Coffee",
    address: "405 W 23rd St",
    payout: 22,
    category: "coffee",
    distance: "0.3 mi",
    reason: "Coffee match",
  },
  {
    id: "a2",
    business: "Ivan Ramen",
    address: "25 Clinton St",
    payout: 28,
    category: "food",
    distance: "0.8 mi",
    reason: "High conversion",
  },
  {
    id: "a3",
    business: "Kopitiam",
    address: "151 E Broadway",
    payout: 19,
    category: "food",
    distance: "1.1 mi",
    reason: "Open slot tonight",
  },
];

const AVAILABLE_EXTENDED: AvailableCampaign[] = [
  ...AVAILABLE,
  {
    id: "a4",
    business: "Blank Street Coffee",
    address: "5 W 19th St",
    payout: 18,
    category: "coffee",
    distance: "0.5 mi",
  },
  {
    id: "a5",
    business: "Superiority Burger",
    address: "119 Avenue A",
    payout: 32,
    category: "food",
    distance: "0.9 mi",
  },
  {
    id: "a6",
    business: "Cha Cha Matcha",
    address: "3 W 16th St",
    payout: 18,
    category: "coffee",
    distance: "1.2 mi",
  },
];

const TIER = {
  current: "Partner",
  next: "Gold",
  xp: 68,
  campaignsLeft: 12,
};

const CHECKLIST: ChecklistItem[] = [
  {
    id: "c1",
    label: "Add your first availability window",
    done: true,
    doneByPush: false,
    href: "/creator/work/calendar",
  },
  {
    id: "c2",
    label: "Accept your first campaign invite",
    done: true,
    doneByPush: true,
    href: "/creator/inbox/invites",
  },
  {
    id: "c3",
    label: "Post your first campaign content",
    done: false,
    href: "/creator/work/calendar",
  },
  {
    id: "c4",
    label: "Get your first verified scan",
    done: false,
    href: "/creator/analytics",
  },
  {
    id: "c5",
    label: "Receive your first payout",
    done: false,
    href: "/creator/earnings",
  },
];

/* ── Icon SVGs ─────────────────────────────────────────── */

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path
        d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FoodIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M6 2v5a3 3 0 006 0V2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 7v9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CoffeeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3 6h9v6a3 3 0 01-3 3H6a3 3 0 01-3-3V6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 8h1a2 2 0 010 4h-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.5 3c0-1 1-1.5 1-2.5M9.5 3c0-1 1-1.5 1-2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Small reusable pieces ─────────────────────────────── */

function CardArrow({ href }: { href: string }) {
  return (
    <Link href={href} className="cd-arrow-btn" aria-label="View more">
      <ArrowIcon />
    </Link>
  );
}

/* Recent row — single line: avatar / name / icon / status / time */
function RecentRow({ item }: { item: RecentItem }) {
  const iconMap: Record<RecentStatusIcon, string> = {
    done: "✓",
    overdue: "⚠",
    tracking: "◔",
  };
  return (
    <div className="cd-recent-row">
      <span className="cd-status-av">{item.initials}</span>
      <span className="cd-recent-name">{item.merchant}</span>
      <span
        className={`cd-recent-icon cd-recent-icon--${item.statusIcon}`}
        aria-hidden
      >
        {iconMap[item.statusIcon]}
      </span>
      <span
        className={`cd-recent-status${item.statusIcon === "overdue" ? " cd-recent-status--overdue" : ""}`}
      >
        {item.statusText}
        {item.needsReview && (
          <>
            {" · "}
            <Link href="/creator/inbox/invites" className="cd-recent-review">
              Review
            </Link>
          </>
        )}
      </span>
      <span className="cd-recent-time">{item.time}</span>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */

export default function CreatorDashboardPage() {
  // Derived data — computed outside hooks so they're stable references
  const weekMax = Math.max(...WEEK_EARNINGS.map((d) => d.amount), 1);
  const live =
    TIMELINE.find((s) => s.status === "OVERDUE") ??
    TIMELINE.find((s) => s.status === "ON GOING") ??
    TIMELINE[0];
  const isOverdue = live.status === "OVERDUE";
  const availableList = isOnboarding ? AVAILABLE_EXTENDED : AVAILABLE;
  const checklistDone = isOnboarding
    ? CHECKLIST.filter((c) => c.done).length
    : 0;
  const unreadCount = INBOX_ITEMS.filter((i) => i.unread).length;
  // Campaigns not yet paid out (OVERDUE = at risk, ON GOING = in flight)
  const actionsNeeded = TIMELINE.filter((t) => t.status === "OVERDUE").length;
  const pendingTotal = TIMELINE.filter(
    (t) => t.status === "OVERDUE" || t.status === "ON GOING",
  ).reduce((s, t) => s + t.payout, 0);

  /* Live scan counter — demo via setTimeout; replace with EventSource in prod */
  const [liveScans, setLiveScans] = useState(live.scanCount ?? 0);
  const [scanHalo, setScanHalo] = useState(false);
  const [overdueHalo, setOverdueHalo] = useState(false);

  useEffect(() => {
    if (isOverdue) return;
    // Both timers cleaned up on unmount / isOverdue change
    let haloTimer: ReturnType<typeof setTimeout>;
    const scanTimer = setTimeout(() => {
      setLiveScans((n) => n + 1);
      setScanHalo(true);
      haloTimer = setTimeout(() => setScanHalo(false), 800);
    }, 8000);
    return () => {
      clearTimeout(scanTimer);
      clearTimeout(haloTimer);
    };
  }, [isOverdue]);

  function handleNeedsYouClick() {
    setOverdueHalo(true);
    setTimeout(() => setOverdueHalo(false), 1500);
  }

  return (
    <div className="cd-page">
      {/* ── Tier-1 status bar ────────────────────────────── */}
      <div className="cd-agent-bar">
        <span className="cd-agent-pulse" aria-hidden />
        <span className="cd-agent-label">Push is active</span>
        {actionsNeeded > 0 && (
          <>
            <span className="cd-agent-sep" aria-hidden>
              ·
            </span>
            <button
              className="cd-agent-needs-you"
              onClick={handleNeedsYouClick}
              type="button"
            >
              {actionsNeeded} NEEDS YOU
            </button>
          </>
        )}
        <span className="cd-agent-sep" aria-hidden>
          ·
        </span>
        <span className="cd-agent-detail">${pendingTotal} pending</span>
        <span className="cd-agent-last">last action 2m ago</span>
      </div>

      <div className="cd-grid">
        {/* ══ LEFT: Greeting · Earnings · This week ══ */}
        <div className="cd-col cd-col--left">
          {/* Greeting — plain, on background, not a card */}
          <div className="cd-greeting">
            <div className="cd-avatar" aria-hidden>
              A
            </div>
            <div className="cd-greeting-text">
              <p className="cd-greeting-eyebrow">Good afternoon</p>
              <h1 className="cd-hi">Hi, Alex</h1>
            </div>
          </div>
          {isOnboarding ? (
            <div className="cd-card">
              <div className="cd-card-header">
                <span className="cd-card-title">Get started</span>
              </div>
              <div className="cd-card-body">
                <div className="cd-checklist">
                  {CHECKLIST.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`cd-checklist-item${item.done ? " cd-checklist-item--done" : ""}`}
                    >
                      <span className="cd-checklist-radio" aria-hidden>
                        {item.done && <CheckIcon />}
                      </span>
                      <span className="cd-checklist-label">
                        {item.label}
                        {item.doneByPush && (
                          <span className="cd-checklist-push-badge">
                            {" "}
                            · Push
                          </span>
                        )}
                      </span>
                      {!item.done && (
                        <span className="cd-checklist-arrow">
                          <ArrowIcon />
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
                <div className="cd-checklist-progress">
                  <div
                    className="cd-checklist-bar"
                    style={{
                      width: `${(checklistDone / CHECKLIST.length) * 100}%`,
                    }}
                  />
                </div>
                <p className="cd-checklist-note">
                  {checklistDone} of {CHECKLIST.length} complete
                </p>
              </div>
            </div>
          ) : (
            /* Earnings card — hero + 3-col + tier footer */
            <div className="cd-card cd-card--brand-orange">
              <div className="cd-card-header">
                <div className="cd-earn-header-left">
                  <span className="cd-card-label">Earnings</span>
                  <button className="cd-earn-period">Apr ↓</button>
                </div>
                <CardArrow href="/creator/earnings" />
              </div>

              <div className="cd-earn-hero">
                <span className="cd-earn-dollar">$</span>
                <span className="cd-earn-num">347</span>
                <span className="cd-earn-trend">↑21%</span>
              </div>

              <div className="cd-earn-breakdown">
                <div className="cd-earn-col">
                  <span className="cd-earn-col-label">Available</span>
                  <span className="cd-earn-col-val">$130</span>
                </div>
                <div className="cd-earn-divider" aria-hidden />
                <div className="cd-earn-col">
                  <span className="cd-earn-col-label">Pending</span>
                  <span className="cd-earn-col-val">$32</span>
                </div>
                <div className="cd-earn-divider" aria-hidden />
                <div className="cd-earn-col">
                  <span className="cd-earn-col-label">Last paid</span>
                  <span className="cd-earn-col-val cd-earn-col-val--paid">
                    +$21
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="cd-earn-actions">
                <Link
                  href="/creator/earnings/withdraw"
                  className="btn-ink cd-earn-btn"
                >
                  Withdraw $130
                </Link>
                <Link
                  href="/creator/earnings"
                  className="btn-ghost cd-earn-btn"
                >
                  Report
                </Link>
              </div>

              {/* Tier footer — single caption row + 4px bar */}
              <div className="cd-tier-footer">
                <span className="cd-tier-footer-label">
                  Tier · {TIER.current} → {TIER.next} · {TIER.xp}%
                </span>
                <span className="cd-tier-footer-note">
                  {TIER.campaignsLeft} to go
                </span>
              </div>
              <div
                className="cd-tier-progress"
                role="progressbar"
                aria-valuenow={TIER.xp}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${TIER.xp}% to ${TIER.next}`}
              >
                <div
                  className="cd-tier-progress-fill"
                  style={{ width: `${TIER.xp}%` }}
                />
              </div>
            </div>
          )}

          {/* This week — left col center slot */}
          <div className="cd-card cd-card--glass">
            <div className="cd-card-header">
              <div>
                <p className="cd-card-title">This week</p>
                <p className="cd-today-date">$81 earned · ↑ 14%</p>
              </div>
              <CardArrow href="/creator/wallet" />
            </div>
            <div className="cd-week-chart">
              {WEEK_EARNINGS.map((d, i) => {
                const h =
                  d.amount > 0 ? Math.round((d.amount / weekMax) * 80) : 2;
                return (
                  <div
                    key={i}
                    className={`cd-week-col${d.isToday ? " cd-week-col--today" : ""}`}
                  >
                    <div
                      className="cd-week-bar"
                      style={{ height: `${h}px` }}
                      data-empty={d.amount === 0 ? "true" : undefined}
                    />
                    <span className="cd-week-day">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available — moved from right col so Recent can expand */}
          {!isOnboarding && (
            <div className="cd-card cd-card--glass">
              <div className="cd-card-header">
                <div>
                  <span className="cd-card-title">Available</span>
                  <p className="cd-today-date">
                    {availableList.length} matches nearby
                  </p>
                </div>
                <CardArrow href="/creator/discover" />
              </div>
              <div className="cd-card-body">
                {availableList.map((c) => (
                  <Link
                    key={c.id}
                    href="/creator/discover"
                    className="cd-avail-item"
                  >
                    <span
                      className="cd-cat-icon"
                      style={{
                        background:
                          c.category === "coffee"
                            ? "var(--char)"
                            : "var(--ink)",
                      }}
                    >
                      {c.category === "coffee" ? <CoffeeIcon /> : <FoodIcon />}
                    </span>
                    <div className="cd-avail-body">
                      <p className="cd-avail-biz">{c.business}</p>
                      <p className="cd-avail-meta">{c.reason ?? c.distance}</p>
                    </div>
                    <div className="cd-avail-right">
                      <span
                        className="cd-avail-pay"
                        style={
                          c.payout >= 25
                            ? { color: "var(--brand-red)" }
                            : undefined
                        }
                      >
                        ${c.payout}
                      </span>
                      <span className="cd-avail-dist">{c.distance}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ══ CENTER: Live now · Today ══ */}
        <div className="cd-col cd-col--center">
          {isOnboarding ? (
            <>
              <div className="cd-card">
                <div className="cd-card-header">
                  <span className="cd-card-title">How Push works</span>
                </div>
                <div className="cd-card-body">
                  <div className="cd-how-steps">
                    {[
                      {
                        n: "01",
                        title: "Accept a campaign",
                        desc: "Browse nearby merchants and book a posting slot.",
                      },
                      {
                        n: "02",
                        title: "Post on-site content",
                        desc: "Visit the merchant and post a story or reel.",
                      },
                      {
                        n: "03",
                        title: "Customers scan your QR",
                        desc: "Your unique QR code at the register tracks every visit.",
                      },
                      {
                        n: "04",
                        title: "Get paid per verified visit",
                        desc: "Push verifies each scan and pays you within 24h.",
                      },
                    ].map((s) => (
                      <div key={s.n} className="cd-how-step">
                        <span className="cd-how-num">{s.n}</span>
                        <div className="cd-how-body">
                          <p className="cd-how-title">{s.title}</p>
                          <p className="cd-how-desc">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="cd-card">
                <div className="cd-card-header">
                  <div>
                    <span className="cd-card-title">Available nearby</span>
                    <p className="cd-today-date">Within 1 mile · 6 open</p>
                  </div>
                  <CardArrow href="/creator/discover" />
                </div>
                <div className="cd-card-body">
                  {AVAILABLE_EXTENDED.map((c) => (
                    <Link
                      key={c.id}
                      href="/creator/discover"
                      className="cd-avail-item"
                    >
                      <span
                        className="cd-cat-icon"
                        style={{
                          background:
                            c.category === "coffee"
                              ? "var(--char)"
                              : "var(--ink)",
                        }}
                      >
                        {c.category === "coffee" ? (
                          <CoffeeIcon />
                        ) : (
                          <FoodIcon />
                        )}
                      </span>
                      <div className="cd-avail-body">
                        <p className="cd-avail-biz">{c.business}</p>
                        <p className="cd-avail-meta">
                          {c.distance} · {c.address}
                        </p>
                      </div>
                      <span className="cd-avail-pay">${c.payout}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Live now — workflow + single meta caption + CTA */}
              <div
                className={`cd-card cd-card--glass cd-live-card${isOverdue ? " cd-live-card--overdue" : ""}${overdueHalo ? " cd-live-card--halo" : ""}`}
              >
                <div className="cd-card-header">
                  <span className="cd-card-title">Live now</span>
                  <Link
                    href="/creator/inbox/messages"
                    className="btn-pill cd-live-msg-pill"
                  >
                    Messages · 2
                  </Link>
                </div>

                {/* 5-step attribution workflow strip */}
                <div
                  className="cd-workflow-strip"
                  aria-label="Campaign workflow"
                >
                  {WORKFLOW_STEPS.map((step, i) => {
                    const state = getStepState(i, live.status);
                    return (
                      <div
                        key={step}
                        className="cd-workflow-step"
                        data-state={state}
                      >
                        <span className="cd-wf-dot" aria-hidden />
                        <span className="cd-wf-label">{step}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Single meta caption row — replaces alert banner + biz row + eyebrow */}
                <p className="cd-live-meta-caption">
                  {live.business} · {live.address}
                  {isOverdue ? (
                    <>
                      {" · "}
                      <span className="cd-live-meta-overdue">
                        OVERDUE since {live.timeStart}
                      </span>
                      {" · 0 scans"}
                    </>
                  ) : (
                    <>
                      {" · "}
                      <span
                        className={
                          scanHalo ? "cd-scan-counter--halo" : undefined
                        }
                      >
                        {liveScans} scans
                      </span>
                    </>
                  )}
                </p>

                <div className="cd-live-bottom">
                  <div className="cd-live-title-group">
                    <h2 className="cd-live-hero-title">{live.title}</h2>
                    <p className="cd-live-payout-line">${live.payout}</p>
                  </div>
                  <Link
                    href={`/creator/campaigns/${live.id}/post`}
                    className="btn-primary cd-live-submit"
                  >
                    Submit content
                  </Link>
                </div>
              </div>

              {/* Today */}
              <div className="cd-card cd-card--glass">
                <div className="cd-card-header">
                  <div>
                    <p className="cd-card-title">Today</p>
                    <p className="cd-today-date">27 April · 3 slots booked</p>
                  </div>
                  <Link
                    href="/creator/work/calendar"
                    className="btn-pill cd-today-add-pill"
                  >
                    + Add
                  </Link>
                </div>
                <div className="cd-card-body">
                  <div className="cd-timeline">
                    {TIMELINE.map((slot) => (
                      <Link
                        key={slot.id}
                        href="/creator/work/calendar"
                        className="cd-slot"
                        data-status={slot.status}
                      >
                        <div className="cd-slot-time">
                          <span>{slot.timeStart}</span>
                          <span className="cd-slot-time-end">
                            {slot.timeEnd}
                          </span>
                        </div>
                        <span
                          className={`cd-slot-radio${slot.status === "DONE" ? " cd-slot-radio--done" : ""}`}
                          aria-hidden
                        />
                        <span
                          className="cd-cat-icon"
                          style={{
                            background:
                              slot.category === "coffee"
                                ? "var(--char)"
                                : "var(--ink)",
                          }}
                        >
                          {slot.category === "coffee" ? (
                            <CoffeeIcon />
                          ) : (
                            <FoodIcon />
                          )}
                        </span>
                        <div className="cd-slot-body">
                          <p className="cd-slot-title">{slot.title}</p>
                          <p className="cd-slot-meta">
                            {slot.business} · {slot.address}
                          </p>
                        </div>
                        <div className="cd-slot-right">
                          <span className="cd-slot-pay">${slot.payout}</span>
                          <span className="cd-slot-scans">
                            {slot.scanCount === 0
                              ? "0 scans"
                              : `${slot.scanCount} scan${slot.scanCount !== 1 ? "s" : ""}`}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ══ RIGHT: Combined dark Liquid Glass panel (Inbox + Recent) ══ */}
        <div className="cd-col cd-col--right">
          <div className="cd-card cd-card--dark-glass">
            {/* ── Inbox section ── */}
            <div className="cd-card-header">
              <div className="cd-inbox-title-row">
                <span className="cd-card-title">Inbox</span>
                <span className="cd-inbox-badge">{unreadCount}</span>
              </div>
              <CardArrow href="/creator/inbox/messages" />
            </div>
            {/* Message preview rows */}
            <div className="cd-inbox-rows">
              {INBOX_ITEMS.slice(0, 5).map((item, i) => (
                <Link
                  key={i}
                  href="/creator/inbox/messages"
                  className="cd-inbox-row"
                  data-unread={item.unread || undefined}
                >
                  <span className="cd-inbox-avatar" aria-hidden>
                    <span className="cd-inbox-initials">{item.initials}</span>
                    {item.unread && (
                      <span className="cd-inbox-dot" aria-hidden />
                    )}
                  </span>
                  <div className="cd-inbox-row-body">
                    <div className="cd-inbox-row-top">
                      <span className="cd-inbox-row-name">{item.name}</span>
                      <span className="cd-inbox-row-time">{item.time}</span>
                    </div>
                    <p className="cd-inbox-row-snippet">{item.preview}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* ── Section separator ── */}
            <div className="cd-right-panel-sep" aria-hidden />

            {/* ── Recent section ── */}
            {!isOnboarding && (
              <>
                <div className="cd-card-header">
                  <span className="cd-card-title">Recent</span>
                  <CardArrow href="/creator/analytics" />
                </div>
                <div className="cd-card-body">
                  <p className="cd-status-section-hdr">Today, 27 April</p>
                  {RECENT_TODAY.map((item) => (
                    <RecentRow key={item.id} item={item} />
                  ))}
                  <p className="cd-status-section-hdr">Yesterday, 26 April</p>
                  {RECENT_YESTERDAY.map((item) => (
                    <RecentRow key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
