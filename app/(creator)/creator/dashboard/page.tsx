"use client";

import Link from "next/link";
import "./grid.css";

/* ── Types ─────────────────────────────────────────────── */

type SlotStatus = "DONE" | "OVERDUE" | "ON GOING";
type SlotCategory = "coffee" | "food";
type SubmissionStatus = "REVIEWING" | "WAITING" | "PAID";

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
  submissionStatus?: SubmissionStatus;
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

interface AvailableCampaign {
  id: string;
  business: string;
  address: string;
  payout: number;
  category: SlotCategory;
  distance: string;
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
    submissionStatus: "REVIEWING",
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
    submissionStatus: "WAITING",
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

const AVAILABLE: AvailableCampaign[] = [
  {
    id: "a1",
    business: "Joe Coffee",
    address: "405 W 23rd St",
    payout: 22,
    category: "coffee",
    distance: "0.3 mi",
  },
  {
    id: "a2",
    business: "Ivan Ramen",
    address: "25 Clinton St",
    payout: 28,
    category: "food",
    distance: "0.8 mi",
  },
  {
    id: "a3",
    business: "Kopitiam",
    address: "151 E Broadway",
    payout: 19,
    category: "food",
    distance: "1.1 mi",
  },
];

const TIER = {
  current: "Partner",
  next: "Gold",
  xp: 68,
  campaignsLeft: 12,
};

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

/* ── Small reusable pieces ─────────────────────────────── */

function CardArrow({ href }: { href: string }) {
  return (
    <Link href={href} className="cd-arrow-btn" aria-label="View more">
      <ArrowIcon />
    </Link>
  );
}

/* ── Page ──────────────────────────────────────────────── */

export default function CreatorDashboardPage() {
  const weekMax = Math.max(...WEEK_EARNINGS.map((d) => d.amount), 1);

  return (
    <div className="cd-page">
      <div className="cd-grid">
        {/* ══ LEFT: Greeting · Balance · Tier · Performance ══ */}
        <div className="cd-col">
          {/* Greeting — canonical eyebrow + Darky display name */}
          <div className="cd-greeting">
            <span className="cd-avatar" aria-hidden>
              A
            </span>
            <div className="cd-greeting-text">
              <p className="cd-greeting-eyebrow">Monday · 27 Apr</p>
              <h1 className="cd-hi">Hi, Alex</h1>
            </div>
          </div>

          {/* Balance card → wallet (Brand Red Filled candy panel) */}
          <Link
            href="/creator/wallet"
            className="cd-balance-card"
            aria-label="Total balance — view wallet"
          >
            <div className="cd-card-header">
              <span className="cd-card-label">Total balance</span>
              <span className="cd-arrow-btn" aria-hidden>
                <ArrowIcon />
              </span>
            </div>
            <div className="cd-balance-amount">
              <span className="cd-balance-dollar">$</span>
              <span>130</span>
              <span className="cd-balance-cents">.00</span>
            </div>
            <svg
              className="cd-sparkline"
              viewBox="0 0 200 32"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M0 22 C 30 22, 50 12, 80 16 S 140 10, 200 13"
                stroke="var(--ink-3)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.55"
              />
            </svg>
            <div className="cd-balance-pending">
              <span className="cd-balance-pending-label">Pending</span>
              <span className="cd-balance-pending-val">+$32</span>
            </div>
            <p className="cd-balance-meta">Last payout +$21 yesterday</p>
          </Link>

          {/* Tier — Champagne ceremonial accent (§ 2.2);
              consolidated this-month KPI now lives here, not in a separate card. */}
          <div className="cd-card">
            <div className="cd-card-header">
              <span className="cd-card-title">Tier</span>
              <CardArrow href="/creator/profile" />
            </div>

            <div className="cd-tier-kpi">
              <span className="cd-tier-kpi-num">$347</span>
              <span className="cd-tier-kpi-trend">↑21% vs last</span>
              <span className="cd-tier-kpi-label">This month</span>
            </div>

            <div className="cd-tier-row">
              <span className="cd-tier-badge cd-tier-badge--current">
                {TIER.current}
              </span>
              <span className="cd-tier-sep" aria-hidden>
                →
              </span>
              <span className="cd-tier-badge cd-tier-badge--next">
                {TIER.next}
              </span>
              <span className="cd-tier-pct" aria-hidden>
                {TIER.xp}%
              </span>
            </div>
            <div
              className="cd-tier-track"
              role="progressbar"
              aria-valuenow={TIER.xp}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${TIER.xp}% to ${TIER.next}`}
            >
              <div className="cd-tier-fill" style={{ width: `${TIER.xp}%` }} />
            </div>
            <p className="cd-tier-note">
              {TIER.campaignsLeft} campaigns to {TIER.next}
            </p>
          </div>
        </div>

        {/* ══ CENTER: Live Now · Today · Weekly ══ */}
        <div className="cd-col">
          {/* Live Now — hero, most actionable item.
              Brand Red lives here as the Submit CTA (§ 2.3). */}
          {(() => {
            const live =
              TIMELINE.find((s) => s.status === "OVERDUE") ??
              TIMELINE.find((s) => s.status === "ON GOING") ??
              TIMELINE[0];
            const isOverdue = live.status === "OVERDUE";
            return (
              <div
                className={`cd-card cd-live-card${isOverdue ? " cd-live-card--overdue" : ""}`}
              >
                <div className="cd-live-top">
                  <span className="cd-live-eyebrow">
                    {isOverdue
                      ? `(OVERDUE · ${"1h 30m"})`
                      : `LIVE · ${"1h 30m"}`}
                  </span>
                  <Link
                    href="/creator/inbox/messages"
                    className="btn-pill cd-live-msg-pill"
                  >
                    Messages · 2
                  </Link>
                </div>

                <div className="cd-live-bottom">
                  <div className="cd-live-bottom-text">
                    <p className="cd-live-biz-line">
                      {live.business} · {live.address}
                    </p>
                    <h2 className="cd-live-hero-title">
                      {live.title} · ${live.payout}
                    </h2>
                  </div>
                  <Link
                    href={`/creator/campaigns/${live.id}/post`}
                    className="btn-primary cd-live-submit"
                  >
                    Submit content
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* Today's Schedule */}
          <div className="cd-card">
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
                    <span className="cd-slot-time-end">{slot.timeEnd}</span>
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
                    {slot.category === "coffee" ? <CoffeeIcon /> : <FoodIcon />}
                  </span>

                  <div className="cd-slot-body">
                    <p className="cd-slot-title">{slot.title}</p>
                    <p className="cd-slot-biz">{slot.business}</p>
                    <p className="cd-slot-addr">{slot.address}</p>
                  </div>

                  <div className="cd-slot-right">
                    {slot.submissionStatus && (
                      <span
                        className="cd-slot-status"
                        data-submission-status={slot.submissionStatus}
                      >
                        {slot.submissionStatus === "PAID"
                          ? `+$${slot.payout}`
                          : slot.submissionStatus}
                      </span>
                    )}
                    <span className="cd-slot-pay">${slot.payout}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Weekly Earnings */}
          <div className="cd-card">
            <div className="cd-card-header">
              <div>
                <p className="cd-card-title">This week</p>
                <p className="cd-today-date">$81 earned · ↑ 14% vs last</p>
              </div>
              <CardArrow href="/creator/wallet" />
            </div>
            <div className="cd-week-chart">
              {WEEK_EARNINGS.map((d, i) => {
                const h =
                  d.amount > 0 ? Math.round((d.amount / weekMax) * 56) : 4;
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
        </div>

        {/* ══ RIGHT: Inbox · Status · Available ══ */}
        <div className="cd-col">
          {/* Inbox — premium message list, liquid glass */}
          <div className="cd-card cd-card--glass">
            <div className="cd-card-header">
              <div className="cd-inbox-title-row">
                <span className="cd-card-title">Inbox</span>
                <span className="cd-inbox-badge">2</span>
              </div>
              <CardArrow href="/creator/inbox/messages" />
            </div>
            {INBOX_ITEMS.map((item, i) => (
              <Link
                key={i}
                href="/creator/inbox/messages"
                className="cd-inbox-row"
              >
                <span
                  className={`cd-inbox-av-lg${!item.unread ? " cd-inbox-av-lg--read" : ""}`}
                >
                  {item.initials}
                  {item.unread && <span className="cd-inbox-dot" aria-hidden />}
                </span>
                <div className="cd-inbox-body">
                  <p
                    className={`cd-inbox-name${item.unread ? " cd-inbox-name--unread" : ""}`}
                  >
                    {item.name}
                  </p>
                  <p
                    className={`cd-inbox-preview${item.unread ? " cd-inbox-preview--unread" : ""}`}
                  >
                    {item.preview}
                  </p>
                </div>
                <span className="cd-inbox-time">{item.time}</span>
              </Link>
            ))}
          </div>

          {/* Available Nearby */}
          <div className="cd-card">
            <div className="cd-card-header">
              <div>
                <span className="cd-card-title">Available</span>
                <p className="cd-today-date">Within 1 mile</p>
              </div>
              <CardArrow href="/creator/discover" />
            </div>
            {AVAILABLE.map((c) => (
              <Link
                key={c.id}
                href="/creator/discover"
                className="cd-avail-item"
              >
                <span
                  className="cd-cat-icon"
                  style={{
                    background:
                      c.category === "coffee" ? "var(--char)" : "var(--ink)",
                  }}
                >
                  {c.category === "coffee" ? <CoffeeIcon /> : <FoodIcon />}
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
      </div>
    </div>
  );
}
