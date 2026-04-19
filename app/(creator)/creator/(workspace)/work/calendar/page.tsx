"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import "./calendar.css";
import {
  MOCK_EVENTS,
  CalendarEvent,
  EventType,
  EVENT_TYPE_COLORS,
  EVENT_TYPE_LABELS,
  countDeadlinesInMonth,
} from "@/lib/calendar/mock-events";

/* ── Types ───────────────────────────────────────────────── */

type CalView = "month" | "week" | "list";

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

/* ── Helpers ─────────────────────────────────────────────── */

function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
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
  // week starts Monday: offset = (getDay() + 6) % 7
  const offset = (first.getDay() + 6) % 7;
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++)
    cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function buildWeekDates(anchorDate: Date): Date[] {
  const start = new Date(anchorDate);
  start.setDate(anchorDate.getDate() - anchorDate.getDay());
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

function estimateMonthEarnings(events: CalendarEvent[], ym: string): number {
  return events
    .filter((e) => e.date.startsWith(ym) && e.type === "payment" && e.payout)
    .reduce((sum, e) => sum + (e.payout ?? 0), 0);
}

function dotColor(type: EventType): string {
  return EVENT_TYPE_COLORS[type];
}

function pillTypeClass(type: EventType): string {
  const map: Record<EventType, string> = {
    deadline: "cal-cell-event-pill--deadline",
    review: "cal-cell-event-pill--review",
    payment: "cal-cell-event-pill--payment",
    milestone: "cal-cell-event-pill--milestone",
  };
  return map[type];
}

/* ── Side Panel ──────────────────────────────────────────── */

interface SidePanelProps {
  selectedDate: string | null;
  events: CalendarEvent[];
  todayStr: string;
  onMarkDone: (id: string) => void;
  onSnooze: (id: string) => void;
  onAddNote: (id: string) => void;
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
  onSnooze,
  onAddNote,
  noteTarget,
  noteValue,
  onNoteChange,
  onNoteSave,
}: SidePanelProps) {
  if (!selectedDate) {
    return (
      <div className="cal-side-panel">
        <div className="cal-side-panel-hint">
          Click any day
          <br />
          to see events
        </div>
      </div>
    );
  }

  const dayEvents = events.filter((e) => e.date === selectedDate);
  const isToday = selectedDate === todayStr;

  return (
    <div className="cal-side-panel">
      <div className="cal-side-panel-header">
        <div className="cal-side-panel-date">
          {formatShortDate(selectedDate)}
          {isToday && <span className="cal-side-panel-today-badge">Today</span>}
        </div>
        <div className="cal-side-panel-dow">{getDOW(selectedDate)}</div>
      </div>

      <div className="cal-side-panel-events">
        {dayEvents.length === 0 ? (
          <div className="cal-side-panel-empty">
            No events scheduled.
            <br />
            <span style={{ opacity: 0.6 }}>Free day!</span>
          </div>
        ) : (
          dayEvents.map((ev) => (
            <div
              key={ev.id}
              className="cal-side-panel-event"
              style={
                { "--event-color": dotColor(ev.type) } as React.CSSProperties
              }
            >
              <div className="cal-side-panel-event-top">
                <span
                  className={`cal-side-panel-type-chip${ev.type === "milestone" ? " cal-side-panel-type-chip--milestone" : ""}`}
                  style={
                    ev.type !== "milestone"
                      ? { background: dotColor(ev.type) }
                      : {}
                  }
                >
                  {EVENT_TYPE_LABELS[ev.type]}
                </span>
              </div>

              <div
                className="cal-side-panel-event-title"
                style={{ marginTop: 6, paddingLeft: 0 }}
              >
                {ev.title}
              </div>

              {ev.time && (
                <div className="cal-side-panel-event-time">{ev.time}</div>
              )}
              <div className="cal-side-panel-event-campaign">
                {ev.merchantName} · {ev.campaignTitle}
              </div>
              {ev.payout ? (
                <div className="cal-side-panel-event-payout">${ev.payout}</div>
              ) : null}

              <div className="cal-side-panel-actions">
                {ev.postUrl && !ev.done && (
                  <Link
                    href={ev.postUrl}
                    className="cal-action-btn cal-action-btn--primary"
                  >
                    Submit
                  </Link>
                )}
                <button
                  className={
                    ev.done
                      ? "cal-action-btn cal-action-btn--done"
                      : "cal-action-btn"
                  }
                  onClick={() => onMarkDone(ev.id)}
                  disabled={ev.done}
                >
                  {ev.done ? "Done" : "Mark done"}
                </button>
                {!ev.done && (
                  <>
                    <button
                      className="cal-action-btn"
                      onClick={() => onSnooze(ev.id)}
                    >
                      Snooze
                    </button>
                    <button
                      className="cal-action-btn"
                      onClick={() => onAddNote(ev.id)}
                    >
                      Note
                    </button>
                  </>
                )}
              </div>

              {noteTarget === ev.id && (
                <div style={{ paddingLeft: 0, marginTop: 8 }}>
                  <textarea
                    className="cal-note-input"
                    rows={2}
                    placeholder="Add a note..."
                    value={noteValue}
                    onChange={(e) => onNoteChange(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="cal-action-btn"
                    style={{ marginTop: 6 }}
                    onClick={onNoteSave}
                  >
                    Save note
                  </button>
                </div>
              )}
              {ev.note && noteTarget !== ev.id && (
                <p className="cal-note-saved">Note: {ev.note}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ── Action buttons component ────────────────────────────── */

interface ActionButtonsProps {
  event: CalendarEvent;
  onMarkDone: (id: string) => void;
  onSnooze: (id: string) => void;
  onAddNote: (id: string) => void;
}

function ActionButtons({
  event,
  onMarkDone,
  onSnooze,
  onAddNote,
}: ActionButtonsProps) {
  return (
    <div className="cal-popover-actions">
      {event.postUrl && !event.done && (
        <Link
          href={event.postUrl}
          className="cal-action-btn cal-action-btn--primary"
        >
          Submit content
        </Link>
      )}
      <button
        className={
          event.done ? "cal-action-btn cal-action-btn--done" : "cal-action-btn"
        }
        onClick={() => onMarkDone(event.id)}
        disabled={event.done}
      >
        {event.done ? "Done" : "Mark done"}
      </button>
      {!event.done && (
        <>
          <button className="cal-action-btn" onClick={() => onSnooze(event.id)}>
            Snooze
          </button>
          <button
            className="cal-action-btn"
            onClick={() => onAddNote(event.id)}
          >
            Add note
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
  onSnooze: (id: string) => void;
  onAddNote: (id: string) => void;
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
  onSnooze,
  onAddNote,
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

  return (
    <>
      <div className="cal-popover-backdrop" onClick={onClose} />
      <div
        ref={popRef}
        className="cal-popover"
        style={{ top: pos.top, left: pos.left }}
        role="dialog"
        aria-label={`Events for ${formatDisplayDate(dateStr)}`}
      >
        <div className="cal-popover-header">
          <span className="cal-popover-date">{formatDisplayDate(dateStr)}</span>
          <button
            className="cal-popover-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="cal-popover-events">
          {events.length === 0 ? (
            <p className="cal-popover-empty">No events today.</p>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="cal-popover-event">
                <div className="cal-popover-event-top">
                  <span
                    className="cal-popover-type-dot"
                    style={{ background: dotColor(ev.type) }}
                  />
                  <span className="cal-popover-event-title">{ev.title}</span>
                </div>
                {ev.time && (
                  <div className="cal-popover-event-time">{ev.time}</div>
                )}
                <div className="cal-popover-event-campaign">
                  {ev.merchantName} · {ev.campaignTitle}
                </div>
                <ActionButtons
                  event={ev}
                  onMarkDone={onMarkDone}
                  onSnooze={onSnooze}
                  onAddNote={onAddNote}
                />
                {noteTarget === ev.id && (
                  <div style={{ paddingLeft: 17, marginTop: 8 }}>
                    <textarea
                      className="cal-note-input"
                      rows={2}
                      placeholder="Add a note..."
                      value={noteValue}
                      onChange={(e) => onNoteChange(e.target.value)}
                      autoFocus
                    />
                    <button
                      className="cal-action-btn"
                      style={{ marginTop: 6 }}
                      onClick={onNoteSave}
                    >
                      Save note
                    </button>
                  </div>
                )}
                {ev.note && noteTarget !== ev.id && (
                  <p className="cal-note-saved">Note: {ev.note}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

/* ── Main page ───────────────────────────────────────────── */

export default function CreatorCalendarPage() {
  const today = new Date();
  const todayStr = todayYMD();

  const [view, setView] = useState<CalView>("month");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [weekAnchor, setWeekAnchor] = useState(today);

  // Selected day for side panel
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);

  // Popover for mobile (on smaller screens)
  const [popoverDate, setPopoverDate] = useState<string | null>(null);
  const popoverAnchor = useRef<HTMLElement | null>(null);

  // Event state
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);

  // Note state
  const [noteTarget, setNoteTarget] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState("");

  /* ── Derived ─────────────────────────────────────────── */

  const ym = formatYearMonth(year, month);
  const deadlineCount = useMemo(() => countDeadlinesInMonth(ym), [ym]);
  const estEarnings = useMemo(
    () => estimateMonthEarnings(events, ym),
    [events, ym],
  );

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, [events]);

  const monthGrid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const weekDates = useMemo(() => buildWeekDates(weekAnchor), [weekAnchor]);

  const listGroups = useMemo(() => {
    const monthEvents = events.filter((e) => e.date.startsWith(ym));
    const grouped: Record<string, CalendarEvent[]> = {};
    for (const ev of monthEvents) {
      if (!grouped[ev.date]) grouped[ev.date] = [];
      grouped[ev.date].push(ev);
    }
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [events, ym]);

  /* ── Handlers ────────────────────────────────────────── */

  function prevPeriod() {
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
  }

  function nextPeriod() {
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
  }

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

  function handleCellClick(dateStr: string, el: HTMLElement) {
    // On large screens: use side panel. On small: popover.
    if (window.innerWidth >= 1024) {
      setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
    } else {
      openPopover(dateStr, el);
    }
  }

  const markDone = useCallback((id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, done: true } : e)),
    );
  }, []);

  const snooze = useCallback((id: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const d = new Date(e.date + "T00:00:00");
        d.setDate(d.getDate() + 1);
        return { ...e, date: toYMD(d), snoozed: true };
      }),
    );
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
    <div className="cal">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="cal-hero">
        <p className="cal-hero-eyebrow">Work Calendar</p>
        <h1 className="cal-hero-title">CALENDAR</h1>
        <div className="cal-hero-meta">
          <span className="cal-hero-month">
            {MONTH_NAMES[month]} {year}
          </span>
          <span className="cal-hero-stat">
            <span className="cal-hero-stat-num">{deadlineCount}</span>
            {deadlineCount === 1 ? "deadline" : "deadlines"} this month
          </span>
          {estEarnings > 0 && (
            <span className="cal-hero-earnings">
              ${estEarnings.toLocaleString()} est. earnings
            </span>
          )}
          <div className="cal-hero-actions">
            <button
              className="cal-hero-btn"
              onClick={() => downloadICS(events)}
              title="Export .ics calendar file"
            >
              Export .ics
            </button>
            <a
              className="cal-hero-btn"
              href="webcal://push.nyc/api/creator/calendar/feed"
              title="Subscribe to calendar"
            >
              Subscribe
            </a>
          </div>
        </div>
      </section>

      {/* ── Controls bar ─────────────────────────────── */}
      <div className="cal-controls">
        <div className="cal-nav">
          <button
            className="cal-nav-btn"
            onClick={prevPeriod}
            aria-label="Previous period"
          >
            &#8249;
          </button>
          <button
            className="cal-nav-label"
            onClick={goToday}
            title="Go to today"
            style={{ cursor: "pointer", background: "none", border: "none" }}
          >
            {periodLabel}
          </button>
          <button
            className="cal-nav-btn"
            onClick={nextPeriod}
            aria-label="Next period"
          >
            &#8250;
          </button>
        </div>

        <div className="cal-view-tabs">
          {(["month", "week", "list"] as CalView[]).map((v) => (
            <button
              key={v}
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
          ([type, label]) => (
            <span key={type} className="cal-legend-item">
              <span
                className="cal-legend-swatch"
                style={{ background: EVENT_TYPE_COLORS[type] }}
              />
              {label}
            </span>
          ),
        )}
      </div>

      {/* ── Month view ───────────────────────────────── */}
      {view === "month" && (
        <div className="cal-month-layout">
          <div className="cal-month">
            {/* Day-of-week headers */}
            <div className="cal-month-header">
              {DOW_LABELS.map((d) => (
                <div key={d} className="cal-month-dow">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="cal-month-grid">
              {monthGrid.map((date, i) => {
                if (!date) {
                  return (
                    <div
                      key={`empty-${i}`}
                      className="cal-cell cal-cell--other-month"
                    />
                  );
                }

                const dateStr = toYMD(date);
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const dayEvents = eventsByDate[dateStr] ?? [];
                const shown = dayEvents.slice(0, 3);
                const extra = dayEvents.length - shown.length;

                const cellClasses = [
                  "cal-cell",
                  isToday ? "cal-cell--today" : "",
                  isSelected && !isToday ? "cal-cell--selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={dateStr}
                    className={cellClasses}
                    onClick={(e) => handleCellClick(dateStr, e.currentTarget)}
                    role="button"
                    aria-label={`${formatDisplayDate(dateStr)}, ${dayEvents.length} events`}
                    aria-pressed={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleCellClick(dateStr, e.currentTarget);
                    }}
                  >
                    <div className="cal-cell-num">
                      <span className="cal-cell-num-inner">
                        {date.getDate()}
                      </span>
                    </div>

                    {/* Compact pills */}
                    <div className="cal-cell-events">
                      {shown.map((ev) => (
                        <span
                          key={ev.id}
                          className={`cal-cell-event-pill ${pillTypeClass(ev.type)}`}
                          style={{ opacity: ev.done ? 0.4 : 1 }}
                        >
                          {ev.title}
                        </span>
                      ))}
                      {extra > 0 && (
                        <span className="cal-cell-event-more">
                          +{extra} more
                        </span>
                      )}
                    </div>

                    {/* Dot strip (mobile fallback) */}
                    <div className="cal-cell-dots">
                      {dayEvents.slice(0, 6).map((ev) => (
                        <span
                          key={ev.id}
                          className="cal-dot"
                          style={{
                            background: dotColor(ev.type),
                            opacity: ev.done ? 0.3 : 1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side panel */}
          <SidePanel
            selectedDate={selectedDate}
            events={events}
            todayStr={todayStr}
            onMarkDone={markDone}
            onSnooze={(id) => {
              snooze(id);
            }}
            onAddNote={addNote}
            noteTarget={noteTarget}
            noteValue={noteValue}
            onNoteChange={setNoteValue}
            onNoteSave={saveNote}
          />
        </div>
      )}

      {/* ── Week view ────────────────────────────────── */}
      {view === "week" && (
        <div className="cal-week">
          <div className="cal-week-grid">
            {weekDates.map((date) => {
              const dateStr = toYMD(date);
              const isToday = dateStr === todayStr;
              const dayEvents = eventsByDate[dateStr] ?? [];

              return (
                <div
                  key={dateStr}
                  className={`cal-week-col${isToday ? " cal-week-col--today" : ""}`}
                >
                  <div className="cal-week-col-header">
                    <span className="cal-week-col-dow">
                      {DOW_LABELS_FULL[date.getDay()]}
                    </span>
                    <span className="cal-week-col-num">{date.getDate()}</span>
                  </div>

                  <div className="cal-week-col-events">
                    {dayEvents.length === 0 ? (
                      <span className="cal-week-col-empty">—</span>
                    ) : (
                      dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={`cal-week-event${ev.done ? " cal-week-event-done" : ""}`}
                          style={{ background: dotColor(ev.type) }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openPopover(dateStr, e.currentTarget);
                          }}
                          role="button"
                          tabIndex={0}
                          title={ev.title}
                        >
                          <span className="cal-week-event-title">
                            {ev.title}
                          </span>
                          {ev.time && (
                            <span className="cal-week-event-time">
                              {ev.time}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── List view ────────────────────────────────── */}
      {view === "list" && (
        <div className="cal-list">
          {listGroups.length === 0 ? (
            <div className="cal-empty">
              <div className="cal-empty-num">0</div>
              <p className="cal-empty-msg">
                No events in {MONTH_NAMES[month]}.
              </p>
            </div>
          ) : (
            listGroups.map(([dateStr, dayEvents]) => {
              const [y, m, d] = dateStr.split("-").map(Number);
              const date = new Date(y, m - 1, d);
              const isToday = dateStr === todayStr;

              return (
                <div key={dateStr} className="cal-list-group">
                  <div className="cal-list-group-header">
                    <span className="cal-list-group-date">
                      {MONTH_NAMES[date.getMonth()]} {date.getDate()}
                    </span>
                    <span className="cal-list-group-dow">
                      {DOW_LABELS_FULL[date.getDay()]}
                    </span>
                    {isToday && (
                      <span className="cal-list-group-today-badge">Today</span>
                    )}
                  </div>

                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`cal-list-row${ev.done ? " cal-list-row--done" : ""}`}
                    >
                      <div className="cal-list-time-col">{ev.time ?? "—"}</div>

                      <div className="cal-list-content">
                        <div className="cal-list-type-row">
                          <span
                            className="cal-list-type-dot"
                            style={{ background: dotColor(ev.type) }}
                          />
                          <span className="cal-list-type-label">
                            {EVENT_TYPE_LABELS[ev.type]}
                          </span>
                          {ev.payout ? (
                            <span className="cal-list-payout">
                              ${ev.payout}
                            </span>
                          ) : null}
                        </div>

                        <span className="cal-list-title">{ev.title}</span>

                        <Link
                          href={
                            ev.postUrl ??
                            `/creator/campaigns/${ev.campaignId}/post`
                          }
                          className="cal-list-campaign"
                        >
                          {ev.campaignTitle}
                        </Link>

                        <span className="cal-list-merchant">
                          {ev.merchantName}
                        </span>

                        {noteTarget === ev.id && (
                          <div style={{ marginTop: 8 }}>
                            <textarea
                              className="cal-note-input"
                              rows={2}
                              placeholder="Add a note..."
                              value={noteValue}
                              onChange={(e) => setNoteValue(e.target.value)}
                              autoFocus
                            />
                            <button
                              className="cal-action-btn"
                              style={{ marginTop: 6 }}
                              onClick={saveNote}
                            >
                              Save note
                            </button>
                          </div>
                        )}
                        {ev.note && noteTarget !== ev.id && (
                          <p className="cal-note-saved">Note: {ev.note}</p>
                        )}
                      </div>

                      <div className="cal-list-actions-col">
                        {ev.postUrl && !ev.done && (
                          <Link
                            href={ev.postUrl}
                            className="cal-action-btn cal-action-btn--primary"
                          >
                            Submit
                          </Link>
                        )}
                        <button
                          className={
                            ev.done
                              ? "cal-action-btn cal-action-btn--done"
                              : "cal-action-btn"
                          }
                          onClick={() => markDone(ev.id)}
                          disabled={ev.done}
                        >
                          {ev.done ? "Done" : "Mark done"}
                        </button>
                        {!ev.done && (
                          <>
                            <button
                              className="cal-action-btn"
                              onClick={() => snooze(ev.id)}
                            >
                              Snooze
                            </button>
                            <button
                              className="cal-action-btn"
                              onClick={() => addNote(ev.id)}
                            >
                              Note
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Day popover (mobile / week view) ─────────── */}
      {popoverDate && (
        <DayPopover
          dateStr={popoverDate}
          events={eventsByDate[popoverDate] ?? []}
          anchorRef={popoverAnchor}
          onClose={closePopover}
          onMarkDone={(id) => markDone(id)}
          onSnooze={(id) => {
            snooze(id);
            closePopover();
          }}
          onAddNote={addNote}
          noteTarget={noteTarget}
          noteValue={noteValue}
          onNoteChange={setNoteValue}
          onNoteSave={saveNote}
        />
      )}
    </div>
  );
}
