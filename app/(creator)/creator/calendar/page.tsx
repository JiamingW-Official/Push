"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import "./calendar.css";
import {
  MOCK_EVENTS,
  CalendarEvent,
  EventType,
  EVENT_TYPE_COLORS,
  EVENT_TYPE_LABELS,
} from "@/lib/calendar/mock-events";

/* ─────────────────────────────────────────────────────────────
   Your schedule.
   Customer Acquisition Engine — Creator Calendar
   Week / Month / Agenda views with ConversionOracle™ tips
   ───────────────────────────────────────────────────────────── */

type CalView = "week" | "month" | "agenda";

const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOW_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* Hours visible in week view: 6AM → 11PM */
const WEEK_HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6..23

/* Tier colors mapped to roles/event payout ranges.
   These mirror Design.md tier token palette. */
const TIER_COLORS = {
  clay: "#b8a99a", // Seed Clay
  bronze: "#8c6239", // Explorer Bronze
  steel: "#4a5568", // Operator Steel
  gold: "#c9a96e", // Proven / Champagne Gold
  ruby: "#9b111e", // Closer Ruby
  obsidian: "#1a1a2e", // Partner Obsidian
};

/* ConversionOracle™ daily tips pool — rotates by day-of-year */
const ORACLE_TIPS = [
  "ConversionOracle™ says: creators who visit during peak hours (7–10AM) see 2.3x the walk-in conversion.",
  "ConversionOracle™ says: posting within 18h of your visit lifts verified walk-ins by +42%.",
  "ConversionOracle™ says: tagging the merchant's geo-pin in-frame boosts QR scans by +28%.",
  "ConversionOracle™ says: Williamsburg Coffee+ creators earn more on Fridays 8–11AM.",
  "ConversionOracle™ says: DisclosureBot-approved captions convert 1.6x better on Reels.",
  "ConversionOracle™ says: Two-Segment creators who cross-post to Stories see 31% higher retention.",
  "ConversionOracle™ says: morning light shots (before 10AM) outperform afternoon shots by 19% in saves.",
];

/* ── Helpers ─────────────────────────────────────────────── */

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayYMD(): string {
  return toYMD(new Date());
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const cells: (Date | null)[] = [];
  // Start grid on Monday (shift Sun=0 → 6)
  const leading = (first.getDay() + 6) % 7;
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/* Monday-first week dates */
function buildWeekDates(anchorDate: Date): Date[] {
  const start = new Date(anchorDate);
  const dow = (anchorDate.getDay() + 6) % 7; // Mon=0
  start.setDate(anchorDate.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/* Next N days including today */
function buildNextNDays(n: number): Date[] {
  const arr: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    arr.push(d);
  }
  return arr;
}

function formatTime12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatHourLabel(h: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${period}`;
}

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/* Deterministic tier color per event.
   Visit → champagne gold (milestone/visit events)
   Deadline → Flag Red (primary)
   Payment → Steel Blue
   Review → graphite steel (tier steel) */
function tierColorForEvent(ev: CalendarEvent): string {
  // Allow tier color to track event.type + payout magnitude for variety.
  if (ev.type === "deadline") return "#c1121f"; // Flag Red
  if (ev.type === "payment") return "#669bbc"; // Steel Blue
  if (ev.type === "review") return TIER_COLORS.steel; // Operator Steel
  // milestone / visit
  if (!ev.payout) return TIER_COLORS.clay;
  if (ev.payout >= 150) return TIER_COLORS.obsidian;
  if (ev.payout >= 100) return TIER_COLORS.ruby;
  if (ev.payout >= 50) return TIER_COLORS.gold;
  if (ev.payout >= 25) return TIER_COLORS.bronze;
  return TIER_COLORS.clay;
}

function eventTypeLabel(ev: CalendarEvent): string {
  if (ev.type === "milestone") {
    if (ev.title.toLowerCase().includes("visit")) return "Visit scheduled";
    if (ev.title.toLowerCase().includes("shoot")) return "Visit scheduled";
    if (ev.title.toLowerCase().includes("appointment"))
      return "Visit scheduled";
    return "Milestone";
  }
  if (ev.type === "deadline") return "Post deadline";
  if (ev.type === "payment") return "Payment pending";
  if (ev.type === "review") return "Verification review";
  return EVENT_TYPE_LABELS[ev.type];
}

function eventAction(ev: CalendarEvent): { label: string; href: string } {
  if (ev.type === "deadline" && ev.postUrl) {
    return { label: "View brief", href: ev.postUrl };
  }
  if (ev.type === "payment") {
    return { label: "Upload receipt", href: `/creator/wallet` };
  }
  if (ev.type === "milestone") {
    return {
      label: "Mark visited",
      href: `/creator/campaigns/${ev.campaignId}`,
    };
  }
  return {
    label: "View brief",
    href: ev.postUrl ?? `/creator/campaigns/${ev.campaignId}`,
  };
}

/* .ics blob export — Google Calendar + Apple Calendar compatible */
function buildICS(events: CalendarEvent[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Push//Customer Acquisition Engine Creator Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Push — Your schedule",
  ];
  const dtstamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d+Z$/, "Z");

  for (const ev of events) {
    const yyyymmdd = ev.date.replace(/-/g, "");
    const hhmm = (ev.time ?? "09:00").replace(":", "");
    const dtStart = `${yyyymmdd}T${hhmm}00`;
    // +1h default duration
    const [hh, mm] = (ev.time ?? "09:00").split(":").map(Number);
    const endH = String((hh + 1) % 24).padStart(2, "0");
    const dtEnd = `${yyyymmdd}T${endH}${String(mm).padStart(2, "0")}00`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${ev.id}@push.nyc`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${escapeICS(ev.title)}`,
      `DESCRIPTION:${escapeICS(
        `${ev.merchantName} · ${ev.campaignTitle}${
          ev.payout ? ` · Payout $${ev.payout}` : ""
        }${ev.description ? ` — ${ev.description}` : ""}`,
      )}`,
      `CATEGORIES:${eventTypeLabel(ev).toUpperCase()}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function escapeICS(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

function triggerDownloadICS(events: CalendarEvent[], filename: string) {
  const blob = new Blob([buildICS(events)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

/* Google Calendar quick-add for a single representative event (template) */
function googleAddUrl(ev: CalendarEvent): string {
  const yyyymmdd = ev.date.replace(/-/g, "");
  const hhmm = (ev.time ?? "09:00").replace(":", "");
  const [hh, mm] = (ev.time ?? "09:00").split(":").map(Number);
  const endH = String((hh + 1) % 24).padStart(2, "0");
  const start = `${yyyymmdd}T${hhmm}00`;
  const end = `${yyyymmdd}T${endH}${String(mm).padStart(2, "0")}00`;
  const u = new URL("https://calendar.google.com/calendar/render");
  u.searchParams.set("action", "TEMPLATE");
  u.searchParams.set("text", ev.title);
  u.searchParams.set("dates", `${start}/${end}`);
  u.searchParams.set(
    "details",
    `${ev.merchantName} — ${ev.campaignTitle}${ev.description ? `\n\n${ev.description}` : ""}`,
  );
  return u.toString();
}

/* Pick an oracle tip deterministically by day of year */
function pickOracleTip(): string {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const doy = Math.floor(diff / (1000 * 60 * 60 * 24));
  return ORACLE_TIPS[doy % ORACLE_TIPS.length];
}

/* ── Main page ───────────────────────────────────────────── */

export default function CreatorCalendarPage() {
  const today = new Date();
  const todayStr = todayYMD();

  // Detect mobile on mount; default to agenda on mobile
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState<CalView>("week");
  const [weekAnchor, setWeekAnchor] = useState<Date>(today);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [slideoverDate, setSlideoverDate] = useState<string | null>(null);
  const [nowMinutes, setNowMinutes] = useState<number>(
    today.getHours() * 60 + today.getMinutes(),
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const apply = () => {
      setIsMobile(mq.matches);
      if (mq.matches) setView("agenda");
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Tick now-line every minute in week view
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNowMinutes(d.getHours() * 60 + d.getMinutes());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const events = MOCK_EVENTS;

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      (map[ev.date] ??= []).push(ev);
    }
    // sort each day's events by time
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
    }
    return map;
  }, [events]);

  const weekDates = useMemo(() => buildWeekDates(weekAnchor), [weekAnchor]);
  const monthGrid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  // Next 14 days agenda
  const agendaDays = useMemo(() => buildNextNDays(14), []);
  const agendaGroups = useMemo(() => {
    return agendaDays
      .map((d) => {
        const ds = toYMD(d);
        return { date: d, dateStr: ds, events: eventsByDate[ds] ?? [] };
      })
      .filter((g) => g.events.length > 0);
  }, [agendaDays, eventsByDate]);

  // Upcoming 5 (today → future)
  const upcoming5 = useMemo(() => {
    return [...events]
      .filter((e) => e.date >= todayStr && !e.done)
      .sort((a, b) =>
        (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")),
      )
      .slice(0, 5);
  }, [events, todayStr]);

  // Deadlines this week (current weekDates)
  const deadlinesThisWeek = useMemo(() => {
    const start = toYMD(weekDates[0]);
    const end = toYMD(weekDates[6]);
    return events.filter(
      (e) => e.type === "deadline" && e.date >= start && e.date <= end,
    ).length;
  }, [events, weekDates]);

  const oracleTip = useMemo(() => pickOracleTip(), []);

  /* ── Navigation ──────────────────────────────────────── */

  function prevPeriod() {
    if (view === "week") {
      const d = new Date(weekAnchor);
      d.setDate(d.getDate() - 7);
      setWeekAnchor(d);
    } else if (view === "month") {
      if (month === 0) {
        setYear((y) => y - 1);
        setMonth(11);
      } else setMonth((m) => m - 1);
    }
  }
  function nextPeriod() {
    if (view === "week") {
      const d = new Date(weekAnchor);
      d.setDate(d.getDate() + 7);
      setWeekAnchor(d);
    } else if (view === "month") {
      if (month === 11) {
        setYear((y) => y + 1);
        setMonth(0);
      } else setMonth((m) => m + 1);
    }
  }
  function goToday() {
    setWeekAnchor(new Date());
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }

  /* ── Period label ────────────────────────────────────── */

  const periodLabel =
    view === "week"
      ? (() => {
          const s = weekDates[0];
          const e = weekDates[6];
          if (s.getMonth() === e.getMonth()) {
            return `${MONTH_NAMES[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`;
          }
          return `${MONTH_NAMES[s.getMonth()]} ${s.getDate()} – ${MONTH_NAMES[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
        })()
      : view === "month"
        ? `${MONTH_NAMES[month]} ${year}`
        : `Next 14 days`;

  /* ── Render helpers ─────────────────────────────────── */

  function renderWeekGrid() {
    return (
      <div className="cal-week-wrap">
        <div className="cal-week-sticky-head">
          <div className="cal-week-gutter-corner" aria-hidden />
          {weekDates.map((d) => {
            const isToday = toYMD(d) === todayStr;
            return (
              <div
                key={toYMD(d)}
                className={`cal-week-day-head${isToday ? " cal-week-day-head--today" : ""}`}
              >
                <span className="cal-week-day-dow">
                  {DOW_SHORT[d.getDay()]}
                </span>
                <span className="cal-week-day-num">{d.getDate()}</span>
              </div>
            );
          })}
        </div>

        <div className="cal-week-grid-body">
          {/* Hour gutter */}
          <div className="cal-week-gutter">
            {WEEK_HOURS.map((h) => (
              <div key={h} className="cal-week-hour-label">
                {formatHourLabel(h)}
              </div>
            ))}
          </div>

          {/* 7 day columns */}
          {weekDates.map((d) => {
            const ds = toYMD(d);
            const isToday = ds === todayStr;
            const dayEvents = (eventsByDate[ds] ?? []).filter((e) => {
              if (!e.time) return false;
              const h = parseInt(e.time.split(":")[0], 10);
              return h >= 6 && h <= 23;
            });

            return (
              <div
                key={ds}
                className={`cal-week-col${isToday ? " cal-week-col--today" : ""}`}
              >
                {/* Hour grid lines */}
                {WEEK_HOURS.map((h) => (
                  <div key={h} className="cal-week-hour-slot" />
                ))}

                {/* Events absolutely positioned */}
                {dayEvents.map((ev) => {
                  const [hh, mm] = ev.time!.split(":").map(Number);
                  const topMin = (hh - 6) * 60 + mm;
                  // 1h block (or until next event fits naturally); demo defaults 60min
                  const duration = 60;
                  return (
                    <button
                      key={ev.id}
                      className={`cal-week-block${ev.done ? " cal-week-block--done" : ""}`}
                      style={{
                        top: `${(topMin / 60) * 72}px`,
                        height: `${(duration / 60) * 72 - 4}px`,
                        background: tierColorForEvent(ev),
                        color:
                          tierColorForEvent(ev) === TIER_COLORS.gold
                            ? "#003049"
                            : "#fff",
                      }}
                      onClick={() => setSlideoverDate(ds)}
                      title={`${ev.title} — ${ev.merchantName}`}
                    >
                      <span className="cal-week-block-type">
                        {eventTypeLabel(ev)}
                      </span>
                      <span className="cal-week-block-title">
                        {ev.merchantName}
                      </span>
                      <span className="cal-week-block-meta">
                        {formatTime12(ev.time!)}
                        {ev.payout ? ` · $${ev.payout}` : ""}
                      </span>
                    </button>
                  );
                })}

                {/* Now ruler only for today */}
                {isToday &&
                  nowMinutes >= 6 * 60 &&
                  nowMinutes <= 23 * 60 + 59 && (
                    <div
                      className="cal-week-now"
                      style={{ top: `${((nowMinutes - 360) / 60) * 72}px` }}
                      aria-hidden
                    >
                      <span className="cal-week-now-dot" />
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderMonthGrid() {
    return (
      <div className="cal-month">
        <div className="cal-month-header">
          {/* Monday-first headers */}
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="cal-month-dow">
              {d}
            </div>
          ))}
        </div>
        <div className="cal-month-grid">
          {monthGrid.map((date, i) => {
            if (!date) {
              return (
                <div key={`x-${i}`} className="cal-cell cal-cell--empty" />
              );
            }
            const ds = toYMD(date);
            const isToday = ds === todayStr;
            const dayEvents = eventsByDate[ds] ?? [];
            const shownDots = dayEvents.slice(0, 3);
            const extra = dayEvents.length - shownDots.length;

            return (
              <button
                key={ds}
                className={`cal-cell${isToday ? " cal-cell--today" : ""}`}
                onClick={() => setSlideoverDate(ds)}
                aria-label={`${formatDisplayDate(ds)}, ${dayEvents.length} events`}
              >
                <span className="cal-cell-num">{date.getDate()}</span>
                <div className="cal-cell-dots">
                  {shownDots.map((ev) => (
                    <span
                      key={ev.id}
                      className="cal-cell-dot"
                      style={{ background: tierColorForEvent(ev) }}
                    />
                  ))}
                  {extra > 0 && <span className="cal-cell-more">+{extra}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function renderAgenda() {
    return (
      <div className="cal-agenda">
        {agendaGroups.length === 0 ? (
          <div className="cal-empty">
            <div className="cal-empty-num">0</div>
            <p className="cal-empty-msg">
              Nothing scheduled in the next 14 days.
            </p>
          </div>
        ) : (
          agendaGroups.map((g) => {
            const isToday = g.dateStr === todayStr;
            return (
              <section key={g.dateStr} className="cal-agenda-group">
                <header className="cal-agenda-head">
                  <span className="cal-agenda-head-date">
                    {MONTH_NAMES[g.date.getMonth()].slice(0, 3)}{" "}
                    {g.date.getDate()}
                  </span>
                  <span className="cal-agenda-head-dow">
                    {DOW_LONG[g.date.getDay()]}
                  </span>
                  {isToday && (
                    <span className="cal-agenda-head-today">Today</span>
                  )}
                </header>

                <ul className="cal-agenda-list">
                  {g.events.map((ev) => {
                    const action = eventAction(ev);
                    const tier = tierColorForEvent(ev);
                    return (
                      <li key={ev.id} className="cal-agenda-item">
                        <span className="cal-agenda-time">
                          {ev.time ? formatTime12(ev.time) : "—"}
                        </span>
                        <div className="cal-agenda-body">
                          <span
                            className="cal-agenda-pill"
                            style={{
                              background: tier,
                              color:
                                tier === TIER_COLORS.gold ? "#003049" : "#fff",
                            }}
                          >
                            {eventTypeLabel(ev)}
                          </span>
                          <span className="cal-agenda-merchant">
                            {ev.merchantName}
                          </span>
                          <span className="cal-agenda-title">{ev.title}</span>
                          <span className="cal-agenda-meta">
                            {ev.campaignTitle}
                            {ev.payout ? ` · $${ev.payout} payout` : ""}
                          </span>
                        </div>
                        <Link href={action.href} className="cal-agenda-action">
                          {action.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })
        )}
      </div>
    );
  }

  /* ── Slide-over (used by month + week) ───────────────── */

  const slideoverEvents = slideoverDate
    ? (eventsByDate[slideoverDate] ?? [])
    : [];

  /* ── Floating add (mobile) ───────────────────────────── */

  function onFloatingAdd() {
    // Demo behavior: trigger .ics export of full calendar
    triggerDownloadICS(events, "push-schedule.ics");
  }

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div className="cal">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="cal-hero">
        <p className="cal-hero-eyebrow">Calendar</p>
        <h1 className="cal-hero-title">Your schedule.</h1>
        <p className="cal-hero-sub">
          Visits, deadlines, and posts for your Customer Acquisition Engine
          campaigns — synced with ConversionOracle™ walk-in tracking.
        </p>

        <div className="cal-hero-meta">
          <span className="cal-hero-chip">
            <strong>{upcoming5.length}</strong> upcoming
          </span>
          <span className="cal-hero-chip">
            <strong>{deadlinesThisWeek}</strong> deadlines this week
          </span>
          <div className="cal-hero-actions">
            <button
              className="cal-hero-btn"
              onClick={() => triggerDownloadICS(events, "push-schedule.ics")}
              title="Export full .ics (Apple Calendar)"
            >
              Apple .ics
            </button>
            <a
              className="cal-hero-btn"
              href={upcoming5[0] ? googleAddUrl(upcoming5[0]) : "#"}
              target="_blank"
              rel="noopener noreferrer"
              title="Add next event to Google Calendar"
            >
              Google Cal
            </a>
          </div>
        </div>
      </section>

      {/* ── Controls ─────────────────────────────────── */}
      <div className="cal-controls">
        <div className="cal-nav">
          <button
            className="cal-nav-btn"
            onClick={prevPeriod}
            disabled={view === "agenda"}
            aria-label="Previous"
          >
            &#8249;
          </button>
          <button
            className="cal-nav-label"
            onClick={goToday}
            title="Jump to today"
          >
            {periodLabel}
          </button>
          <button
            className="cal-nav-btn"
            onClick={nextPeriod}
            disabled={view === "agenda"}
            aria-label="Next"
          >
            &#8250;
          </button>
        </div>

        <div className="cal-view-tabs" role="tablist">
          {(["week", "month", "agenda"] as CalView[]).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              className={`cal-view-tab${view === v ? " cal-view-tab--active" : ""}`}
              onClick={() => setView(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Legend ───────────────────────────────────── */}
      <div className="cal-legend">
        {(Object.entries(EVENT_TYPE_LABELS) as [EventType, string][]).map(
          ([type]) => {
            const label =
              type === "milestone"
                ? "Visit scheduled"
                : type === "deadline"
                  ? "Post deadline"
                  : type === "payment"
                    ? "Payment pending"
                    : "Verification review";
            return (
              <span key={type} className="cal-legend-item">
                <span
                  className="cal-legend-dot"
                  style={{ background: EVENT_TYPE_COLORS[type] }}
                />
                {label}
              </span>
            );
          },
        )}
      </div>

      {/* ── Main + Sidebar layout ────────────────────── */}
      <div className="cal-layout">
        <div className="cal-main">
          {view === "week" && renderWeekGrid()}
          {view === "month" && renderMonthGrid()}
          {view === "agenda" && renderAgenda()}
        </div>

        {/* Sidebar — desktop only */}
        <aside className="cal-side">
          <section className="cal-side-card">
            <h3 className="cal-side-title">Upcoming</h3>
            {upcoming5.length === 0 ? (
              <p className="cal-side-empty">Nothing on deck.</p>
            ) : (
              <ul className="cal-side-list">
                {upcoming5.map((ev) => (
                  <li key={ev.id} className="cal-side-item">
                    <span
                      className="cal-side-dot"
                      style={{ background: tierColorForEvent(ev) }}
                    />
                    <div className="cal-side-item-body">
                      <span className="cal-side-item-date">
                        {ev.date.slice(5).replace("-", "/")}
                        {ev.time ? ` · ${formatTime12(ev.time)}` : ""}
                      </span>
                      <span className="cal-side-item-title">
                        {ev.merchantName}
                      </span>
                      <span className="cal-side-item-type">
                        {eventTypeLabel(ev)}
                        {ev.payout ? ` · $${ev.payout}` : ""}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="cal-side-stat">
            <span className="cal-side-stat-num">{deadlinesThisWeek}</span>
            <span className="cal-side-stat-label">
              Deadline{deadlinesThisWeek === 1 ? "" : "s"} this week
            </span>
          </section>

          <section className="cal-side-oracle">
            <span className="cal-side-oracle-eyebrow">ConversionOracle™</span>
            <p className="cal-side-oracle-body">{oracleTip}</p>
          </section>
        </aside>
      </div>

      {/* ── Day slide-over (month / week click) ─────── */}
      {slideoverDate && (
        <>
          <div
            className="cal-slideover-backdrop"
            onClick={() => setSlideoverDate(null)}
          />
          <aside
            className="cal-slideover"
            role="dialog"
            aria-label="Day detail"
          >
            <header className="cal-slideover-head">
              <div>
                <span className="cal-slideover-eyebrow">Day detail</span>
                <h3 className="cal-slideover-date">
                  {formatDisplayDate(slideoverDate)}
                </h3>
              </div>
              <button
                className="cal-slideover-close"
                onClick={() => setSlideoverDate(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </header>
            <div className="cal-slideover-body">
              {slideoverEvents.length === 0 ? (
                <p className="cal-slideover-empty">No events this day.</p>
              ) : (
                <ul className="cal-slideover-list">
                  {slideoverEvents.map((ev) => {
                    const action = eventAction(ev);
                    const tier = tierColorForEvent(ev);
                    return (
                      <li key={ev.id} className="cal-slideover-item">
                        <span
                          className="cal-slideover-item-bar"
                          style={{ background: tier }}
                        />
                        <div className="cal-slideover-item-body">
                          <span
                            className="cal-slideover-item-type"
                            style={{
                              color: tier,
                            }}
                          >
                            {eventTypeLabel(ev)}
                          </span>
                          <span className="cal-slideover-item-title">
                            {ev.title}
                          </span>
                          <span className="cal-slideover-item-meta">
                            {ev.merchantName} · {ev.campaignTitle}
                          </span>
                          {(ev.time || ev.payout) && (
                            <span className="cal-slideover-item-sub">
                              {ev.time ? formatTime12(ev.time) : ""}
                              {ev.time && ev.payout ? " · " : ""}
                              {ev.payout ? `$${ev.payout} payout` : ""}
                            </span>
                          )}
                          <div className="cal-slideover-actions">
                            <Link
                              href={action.href}
                              className="cal-slideover-btn cal-slideover-btn--primary"
                            >
                              {action.label}
                            </Link>
                            <a
                              className="cal-slideover-btn"
                              href={googleAddUrl(ev)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Add to Google
                            </a>
                            <button
                              className="cal-slideover-btn"
                              onClick={() =>
                                triggerDownloadICS([ev], `push-${ev.id}.ics`)
                              }
                            >
                              .ics
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>
        </>
      )}

      {/* ── Floating add (mobile) ───────────────────── */}
      {isMobile && (
        <button
          className="cal-fab"
          onClick={onFloatingAdd}
          aria-label="Export full schedule"
          title="Export full schedule (.ics)"
        >
          <span className="cal-fab-plus" aria-hidden>
            +
          </span>
        </button>
      )}
    </div>
  );
}
