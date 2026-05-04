"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./calendar.css";
import {
  MOCK_EVENTS,
  CalendarEvent,
  EventType,
  EVENT_TYPE_LABELS,
} from "@/lib/calendar/mock-events";

/* ── Types ───────────────────────────────────────────────── */

type CalView = "month" | "week";

/* ── Constants ───────────────────────────────────────────── */

const DOW_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DOW_LABELS_FULL = [
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
const MONTH_ABBR = [
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
];

// P0-3 / P3-4: Campaign accent palette — CSS var strings (Design.md § 2 closed list)
// Using var() strings so colors respond to any future token updates
const CAMPAIGN_COLORS = [
  "var(--brand-red)",
  "var(--accent-blue)",
  "var(--champagne)",
  "var(--char)",
  "var(--graphite)",
  "var(--mist)",
];

// P3-4: Hash-based assignment — stable across months, independent of event order
function hashCampaignId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

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

function formatYearMonth(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const cells: (Date | null)[] = [];
  const offset = (first.getDay() + 6) % 7;
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++)
    cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function buildWeekDates(anchorDate: Date): Date[] {
  const start = new Date(anchorDate);
  const offset = (anchorDate.getDay() + 6) % 7;
  start.setDate(anchorDate.getDate() - offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
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

function formatShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function getDOW(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return DOW_LABELS_FULL[date.getDay()];
}

// P0-2: Breadcrumb label — "May 1 · TODAY" or "May 8 · Friday"
function getSideBreadcrumb(dateStr: string, todayStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const monthName = MONTH_ABBR[date.getMonth()];
  const suffix =
    dateStr === todayStr ? "TODAY" : DOW_LABELS_FULL[date.getDay()];
  return `${monthName} ${d} · ${suffix}`;
}

function fmtTime(time?: string): string {
  if (!time) return "All day";
  const [hh, mm] = time.split(":").map(Number);
  if (Number.isNaN(hh)) return time;
  const period = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  const minutes = String(mm ?? 0).padStart(2, "0");
  return `${h12}:${minutes} ${period}`;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)).trimEnd() + "…";
}

function downloadICS(events: CalendarEvent[]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Push//Creator Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const ev of events) {
    const dtStart = ev.time
      ? ev.date.replace(/-/g, "") + "T" + ev.time.replace(":", "") + "00"
      : ev.date.replace(/-/g, "");
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${ev.id}@push`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`SUMMARY:${ev.title}`);
    lines.push(`DESCRIPTION:${ev.description ?? ""}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "push-calendar.ics";
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Left panel component ────────────────────────────────── */

interface LeftPanelProps {
  monthName: string;
  year: number;
  /** Past-due deadlines, sorted most-overdue first, max 3 */
  blockingEvents: CalendarEvent[];
  /** Upcoming deadlines + reviews, sorted by date asc, max 3 */
  nextActions: CalendarEvent[];
  todayStr: string;
  onSelectDate: (date: string) => void;
}

function LeftPanel({
  monthName,
  year,
  blockingEvents,
  nextActions,
  todayStr,
  onSelectDate,
}: LeftPanelProps) {
  return (
    <div className="cal-lp">
      {/* Month / year header */}
      <div className="cal-lp__head">
        <span className="cal-lp__month">{monthName}</span>
        <span className="cal-lp__year">{year}</span>
      </div>

      {/* Blocking — past-due deadlines */}
      <div className="cal-lp__section">
        <span className="cal-lp__section-eyebrow">
          Blocking
          {blockingEvents.length > 0 ? ` (${blockingEvents.length})` : ""}
        </span>
        {blockingEvents.length === 0 ? (
          <p className="cal-lp__section-empty">None — on track</p>
        ) : (
          <div className="cal-lp__item-list">
            {blockingEvents.map((ev) => {
              const [ey, em, ed] = ev.date.split("-").map(Number);
              const [ty, tm, td] = todayStr.split("-").map(Number);
              const ms =
                new Date(ty, tm - 1, td).getTime() -
                new Date(ey, em - 1, ed).getTime();
              const daysLate = Math.round(ms / 86400000);
              return (
                <button
                  key={ev.id}
                  type="button"
                  className="cal-lp__item cal-lp__item--blocking"
                  onClick={() => onSelectDate(ev.date)}
                >
                  <span className="cal-lp__item-title">
                    {truncate(
                      `${ev.merchantName} – ${EVENT_TYPE_LABELS[ev.type]}`,
                      24,
                    )}
                  </span>
                  <span className="cal-lp__item-sub">
                    {daysLate} {daysLate === 1 ? "day" : "days"} late
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Next actions — upcoming deadlines + reviews */}
      <div className="cal-lp__section">
        <span className="cal-lp__section-eyebrow">
          Next actions{nextActions.length > 0 ? ` (${nextActions.length})` : ""}
        </span>
        {nextActions.length === 0 ? (
          <p className="cal-lp__section-empty">Nothing due soon</p>
        ) : (
          <div className="cal-lp__item-list">
            {nextActions.map((ev) => (
              <button
                key={ev.id}
                type="button"
                className="cal-lp__item"
                onClick={() => onSelectDate(ev.date)}
              >
                <span className="cal-lp__item-date">
                  {ev.date === todayStr
                    ? "Today"
                    : ev.date.slice(5).replace("-", "/")}
                </span>
                <span className="cal-lp__item-title">
                  {truncate(ev.title, 22)}
                </span>
                <span className="cal-lp__item-sub">{ev.merchantName}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Side Panel ──────────────────────────────────────────── */

interface SidePanelProps {
  selectedDate: string;
  events: CalendarEvent[];
  todayStr: string;
  onMarkDone: (id: string) => void;
  onAddNote: (id: string) => void;
  onMessageMerchant: (campaignId: string) => void;
  onRequestExtension: (id: string) => void;
  noteTarget: string | null;
  noteValue: string;
  onNoteChange: (v: string) => void;
  onNoteSave: () => void;
}

function SidePanel({
  selectedDate,
  events,
  todayStr,
  onMarkDone,
  onAddNote,
  onMessageMerchant,
  onRequestExtension,
  noteTarget,
  noteValue,
  onNoteChange,
  onNoteSave,
}: SidePanelProps) {
  const dayEvents = events.filter((e) => e.date === selectedDate);
  const isToday = selectedDate === todayStr;

  return (
    <aside
      className="cal-side"
      aria-label={`Events on ${formatDisplayDate(selectedDate)}`}
    >
      <header className="cal-side__head">
        {/* P0-2: Breadcrumb */}
        <p className="cal-side__breadcrumb">
          {getSideBreadcrumb(selectedDate, todayStr)}
        </p>
        <div className="cal-side__date-row">
          <span className="cal-side__date">
            {formatShortDate(selectedDate)}
          </span>
          {isToday && <span className="cal-tag cal-tag--today">Today</span>}
        </div>
        <div className="cal-side__dow">{getDOW(selectedDate)}</div>
      </header>

      <div className="cal-side__body">
        {dayEvents.length === 0 ? (
          <div className="cal-side__empty">
            <p className="cal-side__empty-line">No events scheduled</p>
            <p className="cal-side__empty-sub">
              Free day &mdash; rest, reset, repeat
            </p>
          </div>
        ) : (
          dayEvents.map((ev) => (
            <article
              key={ev.id}
              className={`cal-side__event event-type--${ev.type}${ev.done ? " is-done" : ""}`}
            >
              <header className="cal-side__event-head">
                <span className={`cal-chip event-type--${ev.type}`}>
                  {EVENT_TYPE_LABELS[ev.type]}
                </span>
                {ev.time && (
                  <span className="cal-side__event-time">
                    {fmtTime(ev.time)}
                  </span>
                )}
              </header>

              <h3 className="cal-side__event-title">{ev.title}</h3>

              <p className="cal-side__event-meta">
                {ev.merchantName} <span className="cal-dot-sep">&middot;</span>{" "}
                {ev.campaignTitle}
              </p>

              {ev.payout ? (
                <p className="cal-side__event-payout">
                  <span className="cal-side__event-payout-eyebrow">PAYOUT</span>
                  <span className="cal-side__event-payout-num">
                    ${ev.payout}
                  </span>
                </p>
              ) : null}

              {/* action buttons */}
              <div className="cal-side__actions">
                {ev.postUrl && !ev.done && (
                  <Link
                    href={ev.postUrl}
                    className="btn-primary click-shift cal-btn-sm"
                  >
                    Submit
                  </Link>
                )}
                <button
                  className="btn-ghost click-shift cal-btn-sm"
                  onClick={() => onMarkDone(ev.id)}
                  disabled={ev.done}
                >
                  {ev.done ? "Done" : "Mark done"}
                </button>
                {!ev.done && (
                  <>
                    <button
                      className="btn-ghost click-shift cal-btn-sm"
                      onClick={() => onAddNote(ev.id)}
                    >
                      Note
                    </button>
                    <button
                      className="btn-ghost click-shift cal-btn-sm"
                      onClick={() => onMessageMerchant(ev.campaignId)}
                    >
                      Message merchant
                    </button>
                    <button
                      className="btn-ghost click-shift cal-btn-sm"
                      onClick={() => onRequestExtension(ev.id)}
                    >
                      Request extension
                    </button>
                  </>
                )}
              </div>

              {noteTarget === ev.id && (
                <div className="cal-note-wrap">
                  <textarea
                    className="cal-note-input"
                    rows={2}
                    placeholder="Add a note..."
                    value={noteValue}
                    onChange={(e) => onNoteChange(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="btn-secondary click-shift cal-btn-sm"
                    onClick={onNoteSave}
                  >
                    Save note
                  </button>
                </div>
              )}
              {ev.note && noteTarget !== ev.id && (
                <p className="cal-note-saved">Note: {ev.note}</p>
              )}
            </article>
          ))
        )}
      </div>
    </aside>
  );
}

/* ── Action buttons (popover + list view) ────────────────── */

interface ActionButtonsProps {
  event: CalendarEvent;
  onMarkDone: (id: string) => void;
  onAddNote: (id: string) => void;
  onMessageMerchant: (campaignId: string) => void;
  onRequestExtension: (id: string) => void;
}

function ActionButtons({
  event,
  onMarkDone,
  onAddNote,
  onMessageMerchant,
  onRequestExtension,
}: ActionButtonsProps) {
  return (
    <div className="cal-actions-row">
      {event.postUrl && !event.done && (
        <Link
          href={event.postUrl}
          className="btn-primary click-shift cal-btn-sm"
        >
          Submit
        </Link>
      )}
      <button
        className="btn-ghost click-shift cal-btn-sm"
        onClick={() => onMarkDone(event.id)}
        disabled={event.done}
      >
        {event.done ? "Done" : "Mark done"}
      </button>
      {!event.done && (
        <>
          <button
            className="btn-ghost click-shift cal-btn-sm"
            onClick={() => onAddNote(event.id)}
          >
            Note
          </button>
          <button
            className="btn-ghost click-shift cal-btn-sm"
            onClick={() => onMessageMerchant(event.campaignId)}
          >
            Message merchant
          </button>
          <button
            className="btn-ghost click-shift cal-btn-sm"
            onClick={() => onRequestExtension(event.id)}
          >
            Request extension
          </button>
        </>
      )}
    </div>
  );
}

/* ── Day popover ─────────────────────────────────────────── */

interface DayPopoverProps {
  dateStr: string;
  events: CalendarEvent[];
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  onMarkDone: (id: string) => void;
  onAddNote: (id: string) => void;
  onMessageMerchant: (campaignId: string) => void;
  onRequestExtension: (id: string) => void;
  noteTarget: string | null;
  noteValue: string;
  onNoteChange: (v: string) => void;
  onNoteSave: () => void;
}

function DayPopover({
  dateStr,
  events,
  anchorRef,
  onClose,
  onMarkDone,
  onAddNote,
  onMessageMerchant,
  onRequestExtension,
  noteTarget,
  noteValue,
  onNoteChange,
  onNoteSave,
}: DayPopoverProps) {
  const popRef = useRef<HTMLDivElement>(null);
  const [pos] = useState(() => {
    if (!anchorRef.current) return { top: 120, left: 120 };
    const rect = anchorRef.current.getBoundingClientRect();
    const pw = 320;
    const left = Math.min(rect.left, window.innerWidth - pw - 16);
    const top = rect.bottom + 8;
    return { top: Math.max(8, top), left: Math.max(8, left) };
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="cal-pop__backdrop" onClick={onClose} />
      <div
        ref={popRef}
        className="cal-pop"
        role="dialog"
        aria-label={`Events for ${formatDisplayDate(dateStr)}`}
        style={{ top: pos.top, left: pos.left }}
      >
        <header className="cal-pop__head">
          <span className="cal-pop__date">{formatDisplayDate(dateStr)}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cal-pop__close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 3 L11 11 M11 3 L3 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="cal-pop__body">
          {events.length === 0 ? (
            <p className="cal-pop__empty">No events today.</p>
          ) : (
            events.map((ev) => (
              <article
                key={ev.id}
                className={`cal-pop__event event-type--${ev.type}${ev.done ? " is-done" : ""}`}
              >
                <header className="cal-pop__event-head">
                  <span
                    className={`cal-dot event-type--${ev.type}`}
                    aria-hidden
                  />
                  <h3 className="cal-pop__event-title">{ev.title}</h3>
                </header>

                {ev.time && (
                  <p className="cal-pop__event-time">{fmtTime(ev.time)}</p>
                )}
                <p className="cal-pop__event-meta">
                  {ev.merchantName}{" "}
                  <span className="cal-dot-sep">&middot;</span>{" "}
                  {ev.campaignTitle}
                </p>

                <ActionButtons
                  event={ev}
                  onMarkDone={onMarkDone}
                  onAddNote={onAddNote}
                  onMessageMerchant={onMessageMerchant}
                  onRequestExtension={onRequestExtension}
                />

                {noteTarget === ev.id && (
                  <div className="cal-note-wrap">
                    <textarea
                      className="cal-note-input"
                      rows={2}
                      placeholder="Add a note..."
                      value={noteValue}
                      onChange={(e) => onNoteChange(e.target.value)}
                      autoFocus
                    />
                    <button
                      className="btn-secondary click-shift cal-btn-sm"
                      onClick={onNoteSave}
                    >
                      Save note
                    </button>
                  </div>
                )}
                {ev.note && noteTarget !== ev.id && (
                  <p className="cal-note-saved">Note: {ev.note}</p>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </>
  );
}

/* ── Main page ───────────────────────────────────────────── */

export default function CreatorCalendarPage() {
  const router = useRouter();
  const today = new Date();
  const todayStr = todayYMD();

  const [view, setView] = useState<CalView>("month");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [weekAnchor, setWeekAnchor] = useState(today);

  // P3-2: SidePanel is always anchored — never null
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [popoverDate, setPopoverDate] = useState<string | null>(null);
  const popoverAnchor = useRef<HTMLElement | null>(null);

  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [noteTarget, setNoteTarget] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState("");

  // P1-3: Event-type filter chips
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set());
  function toggleFilter(type: EventType) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }
  function clearFilters() {
    setActiveFilters(new Set());
  }

  const gridRef = useRef<HTMLDivElement>(null);

  // P3-2: Auto-return to today 5 s after last date selection
  useEffect(() => {
    if (selectedDate === todayStr) return;
    const timer = setTimeout(() => {
      setSelectedDate(todayStr);
    }, 5000);
    return () => clearTimeout(timer);
  }, [selectedDate, todayStr]);

  /* ── Derived ─────────────────────────────────────────── */

  const ym = formatYearMonth(year, month);
  // P3-4: Campaign color map — hash-based, stable across months + reloads
  const campaignColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const ev of events) {
      if (!(ev.campaignId in map)) {
        map[ev.campaignId] =
          CAMPAIGN_COLORS[
            hashCampaignId(ev.campaignId) % CAMPAIGN_COLORS.length
          ];
      }
    }
    return map;
  }, [events]);

  const filteredEvents = useMemo(
    () =>
      activeFilters.size === 0
        ? events
        : events.filter((ev) => activeFilters.has(ev.type)),
    [events, activeFilters],
  );

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of filteredEvents) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, [filteredEvents]);

  const monthGrid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const weekDates = useMemo(() => buildWeekDates(weekAnchor), [weekAnchor]);

  // P3-3: Event counts per type in the current month (unfiltered, for chip labels)
  const typeCounts = useMemo(() => {
    const counts: Record<EventType, number> = {
      deadline: 0,
      review: 0,
      milestone: 0,
    };
    for (const ev of events) {
      if (ev.date.startsWith(ym)) counts[ev.type]++;
    }
    return counts;
  }, [events, ym]);

  // P3-1: Blocking — past-due deadlines, most-overdue first, max 3
  const blockingEvents = useMemo(
    () =>
      events
        .filter((e) => e.date < todayStr && e.type === "deadline" && !e.done)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3),
    [events, todayStr],
  );

  // P3-1: Next actions — upcoming deadlines + reviews, date asc, max 3
  const nextActions = useMemo(
    () =>
      events
        .filter(
          (e) =>
            e.date >= todayStr &&
            (e.type === "deadline" || e.type === "review") &&
            !e.done,
        )
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3),
    [events, todayStr],
  );

  /* ── Handlers ────────────────────────────────────────── */

  const prevPeriod = useCallback(() => {
    if (view === "week") {
      const d = new Date(weekAnchor);
      d.setDate(d.getDate() - 7);
      setWeekAnchor(d);
    } else {
      if (month === 0) {
        setYear((y) => y - 1);
        setMonth(11);
      } else setMonth((m) => m - 1);
    }
  }, [view, weekAnchor, month]);

  const nextPeriod = useCallback(() => {
    if (view === "week") {
      const d = new Date(weekAnchor);
      d.setDate(d.getDate() + 7);
      setWeekAnchor(d);
    } else {
      if (month === 11) {
        setYear((y) => y + 1);
        setMonth(0);
      } else setMonth((m) => m + 1);
    }
  }, [view, weekAnchor, month]);

  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setWeekAnchor(today);
    setSelectedDate(todayStr);
  }

  function openPopover(dateStr: string, el: HTMLElement) {
    popoverAnchor.current = el;
    setPopoverDate(dateStr);
    setNoteTarget(null);
    setNoteValue("");
  }

  function closePopover() {
    setPopoverDate(null);
    setNoteTarget(null);
    setNoteValue("");
  }

  // P3-2: Always select — no toggle-to-null
  function handleCellClick(dateStr: string, el: HTMLElement) {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSelectedDate(dateStr);
    } else {
      openPopover(dateStr, el);
    }
  }

  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (view !== "month") return;
      const focused = document.activeElement as HTMLElement | null;
      const cellAttr = focused?.getAttribute("data-date");
      if (!cellAttr) return;

      let delta = 0;
      switch (e.key) {
        case "ArrowLeft":
          delta = -1;
          break;
        case "ArrowRight":
          delta = 1;
          break;
        case "ArrowUp":
          delta = -7;
          break;
        case "ArrowDown":
          delta = 7;
          break;
        default:
          return;
      }
      e.preventDefault();
      const [y, m, d] = cellAttr.split("-").map(Number);
      const next = new Date(y, m - 1, d);
      next.setDate(next.getDate() + delta);
      const nextStr = toYMD(next);

      if (next.getMonth() !== month || next.getFullYear() !== year) {
        setYear(next.getFullYear());
        setMonth(next.getMonth());
        requestAnimationFrame(() => {
          gridRef.current
            ?.querySelector<HTMLElement>(`[data-date="${nextStr}"]`)
            ?.focus();
        });
      } else {
        gridRef.current
          ?.querySelector<HTMLElement>(`[data-date="${nextStr}"]`)
          ?.focus();
      }
      setSelectedDate(nextStr);
    },
    [view, month, year],
  );

  const markDone = useCallback((id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, done: true } : e)),
    );
  }, []);

  // P0-2: Message merchant — navigate to campaign detail
  const messageMerchant = useCallback(
    (campaignId: string) => {
      router.push(`/creator/campaigns/${campaignId}`);
    },
    [router],
  );

  // P0-2: Request extension — opens note with pre-filled text
  const requestExtension = useCallback((id: string) => {
    setNoteTarget(id);
    setNoteValue("Requesting a deadline extension for this campaign.");
  }, []);

  const addNote = useCallback((id: string) => {
    setNoteTarget(id);
    setNoteValue("");
  }, []);

  const saveNote = useCallback(() => {
    if (!noteTarget) return;
    setEvents((prev) =>
      prev.map((e) => (e.id === noteTarget ? { ...e, note: noteValue } : e)),
    );
    setNoteTarget(null);
    setNoteValue("");
  }, [noteTarget, noteValue]);

  /* ── Period label ────────────────────────────────────── */

  const periodLabel =
    view === "week"
      ? (() => {
          const start = weekDates[0];
          const end = weekDates[6];
          if (start.getMonth() === end.getMonth()) {
            return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
          }
          return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()} – ${MONTH_NAMES[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
        })()
      : `${MONTH_NAMES[month]} ${year}`;

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div className="cw-page cal">
      <div className="cal-three-col">
        {/* ── Left panel — blocking + next actions ── */}
        <aside className="cal-panel cal-panel-left">
          <LeftPanel
            monthName={MONTH_NAMES[month]}
            year={year}
            blockingEvents={blockingEvents}
            nextActions={nextActions}
            todayStr={todayStr}
            onSelectDate={setSelectedDate}
          />
        </aside>

        {/* ── Center panel — topbar + filters + calendar ── */}
        <div className="cal-panel cal-panel-center">
          {/* ── Compact topbar — nav + period + view switcher + export ── */}
          <nav className="cal-topbar" aria-label="Calendar navigation">
            <div className="cal-topbar__nav">
              <button
                type="button"
                onClick={prevPeriod}
                aria-label="Previous period"
                className="cal-nav__btn"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M9 2 L4 7 L9 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={goToday}
                className="cal-topbar__period"
              >
                {periodLabel}
              </button>
              <button
                type="button"
                onClick={nextPeriod}
                aria-label="Next period"
                className="cal-nav__btn"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 2 L10 7 L5 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={goToday}
                className="cal-topbar__today"
              >
                Today
              </button>
            </div>
            <div className="cal-topbar__right">
              <div
                className="cal-seg"
                role="tablist"
                aria-label="Calendar view"
              >
                {(["month", "week"] as CalView[]).map((v) => (
                  <button
                    key={v}
                    role="tab"
                    aria-selected={view === v}
                    type="button"
                    onClick={() => setView(v)}
                    className={`cal-seg__opt${view === v ? " is-active" : ""}`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn-ghost click-shift cal-btn-sm"
                onClick={() => downloadICS(events)}
                title="Export .ics calendar file"
              >
                Export .ics
              </button>
            </div>
          </nav>

          {/* ── Filter rail — legend chips as type filters ── */}
          <div className="cal-filter-rail">
            {(Object.entries(EVENT_TYPE_LABELS) as [EventType, string][]).map(
              ([type, label]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleFilter(type as EventType)}
                  className={`cal-legend-chip${activeFilters.has(type as EventType) ? " is-active" : ""}`}
                >
                  <span className={`cal-dot event-type--${type}`} aria-hidden />
                  {label}
                  <span className="cal-legend-chip__count">
                    ({typeCounts[type as EventType]})
                  </span>
                </button>
              ),
            )}
            {activeFilters.size > 0 && (
              <button
                type="button"
                className="cal-legend-chip cal-filter-clear"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>

          {/* ── Month view ───────────────────────────────────── */}
          {view === "month" && (
            <div className="cal-month">
              <div className="cal-month__dow-row" aria-hidden>
                {DOW_LABELS.map((d) => (
                  <div key={d} className="cal-month__dow">
                    {d}
                  </div>
                ))}
              </div>

              <div
                ref={gridRef}
                className="cal-month__grid"
                role="grid"
                aria-label={`${MONTH_NAMES[month]} ${year}`}
                onKeyDown={handleGridKeyDown}
              >
                {monthGrid.map((date, i) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${i}`}
                        className="cal-cell cal-cell--empty"
                        aria-hidden
                      />
                    );
                  }

                  const dateStr = toYMD(date);
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDate;
                  const dayEvents = eventsByDate[dateStr] ?? [];
                  const shown = dayEvents.slice(0, 3);
                  const extra = dayEvents.length - shown.length;
                  const hasEvents = dayEvents.length > 0;
                  const cellLabel = hasEvents
                    ? `${formatDisplayDate(dateStr)}, ${dayEvents.length} ${dayEvents.length === 1 ? "event" : "events"}`
                    : `${formatDisplayDate(dateStr)}, no events`;

                  return (
                    <div
                      key={dateStr}
                      data-date={dateStr}
                      onClick={(e) => handleCellClick(dateStr, e.currentTarget)}
                      role="gridcell"
                      aria-label={cellLabel}
                      aria-selected={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleCellClick(dateStr, e.currentTarget);
                        }
                      }}
                      className={[
                        "cal-cell",
                        isToday && "cal-cell--today",
                        isSelected && "cal-cell--selected",
                        hasEvents && "cal-cell--has-events",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="cal-cell__num-row">
                        <span className="cal-cell__num">{date.getDate()}</span>
                        {dayEvents.length > 0 && (
                          <span className="cal-cell__count" aria-hidden>
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* P0-3: Campaign-accented event pills */}
                      <div className="cal-cell__events">
                        {shown.map((ev) => (
                          <div key={ev.id} className="cal-chip-wrap">
                            <span
                              className={`cal-pill-event event-type--${ev.type}${ev.done ? " is-done" : ""}`}
                              title={ev.title}
                            >
                              <span
                                className="cal-pill-accent"
                                style={{
                                  background: campaignColorMap[ev.campaignId],
                                }}
                                aria-hidden
                              />
                              <span className="cal-pill-text">
                                {truncate(
                                  `${EVENT_TYPE_LABELS[ev.type]} · ${ev.merchantName}`,
                                  20,
                                )}
                              </span>
                            </span>
                            {/* Hover card */}
                            <div className="cal-chip-hover" role="tooltip">
                              <p className="cal-chip-hover__title">
                                {ev.campaignTitle}
                              </p>
                              <p className="cal-chip-hover__meta">
                                {ev.merchantName}
                                {ev.payout ? ` · $${ev.payout}` : ""}
                              </p>
                              <Link
                                href={
                                  ev.postUrl ??
                                  `/creator/campaigns/${ev.campaignId}/post`
                                }
                                className="cal-chip-hover__link"
                              >
                                View campaign →
                              </Link>
                            </div>
                          </div>
                        ))}
                        {extra > 0 && (
                          <span className="cal-cell__more">+{extra} more</span>
                        )}
                      </div>

                      {/* Dot strip — mobile fallback */}
                      <div className="cal-cell__dots" aria-hidden>
                        {dayEvents.slice(0, 6).map((ev) => (
                          <span
                            key={ev.id}
                            className={`cal-dot event-type--${ev.type}${ev.done ? " is-done" : ""}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Week view ────────────────────────────────────── */}

          {view === "week" && (
            <div className="cal-week">
              <div className="cal-week__grid">
                {weekDates.map((date) => {
                  const dateStr = toYMD(date);
                  const isToday = dateStr === todayStr;
                  const dayEvents = eventsByDate[dateStr] ?? [];

                  return (
                    <div
                      key={dateStr}
                      className={`cal-week__col${isToday ? " cal-week__col--today" : ""}`}
                    >
                      <header className="cal-week__col-head">
                        <span className="cal-week__dow">
                          {DOW_LABELS_FULL[date.getDay()]
                            .slice(0, 3)
                            .toUpperCase()}
                        </span>
                        <span className="cal-week__num">{date.getDate()}</span>
                      </header>

                      <div className="cal-week__events">
                        {dayEvents.length === 0 ? (
                          <span className="cal-week__empty">&mdash;</span>
                        ) : (
                          dayEvents.map((ev) => (
                            <button
                              key={ev.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPopover(dateStr, e.currentTarget);
                              }}
                              title={ev.title}
                              className={`cal-week__event event-type--${ev.type}${ev.done ? " is-done" : ""}`}
                            >
                              <span className="cal-week__event-title">
                                {truncate(ev.title, 22)}
                              </span>
                              {ev.time && (
                                <span className="cal-week__event-time">
                                  {fmtTime(ev.time)}
                                </span>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day popover (mobile / week view) */}
          {popoverDate && (
            <DayPopover
              dateStr={popoverDate}
              events={eventsByDate[popoverDate] ?? []}
              anchorRef={popoverAnchor}
              onClose={closePopover}
              onMarkDone={(id) => markDone(id)}
              onAddNote={addNote}
              onMessageMerchant={messageMerchant}
              onRequestExtension={requestExtension}
              noteTarget={noteTarget}
              noteValue={noteValue}
              onNoteChange={setNoteValue}
              onNoteSave={saveNote}
            />
          )}
        </div>
        {/* ── Right panel — selected-day event detail ── */}
        <aside className="cal-panel cal-panel-right">
          <SidePanel
            selectedDate={selectedDate}
            events={events}
            todayStr={todayStr}
            onMarkDone={markDone}
            onAddNote={addNote}
            onMessageMerchant={messageMerchant}
            onRequestExtension={requestExtension}
            noteTarget={noteTarget}
            noteValue={noteValue}
            onNoteChange={setNoteValue}
            onNoteSave={saveNote}
          />
        </aside>
      </div>
    </div>
  );
}
