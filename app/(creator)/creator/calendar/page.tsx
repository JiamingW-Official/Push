"use client";

import { useState, useMemo, useRef, useEffect } from "react";
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

const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

  // Pad leading empty cells
  for (let i = 0; i < first.getDay(); i++) cells.push(null);

  for (let d = 1; d <= last.getDate(); d++) {
    cells.push(new Date(year, month, d));
  }

  // Pad trailing
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

/* ── Event dot colors ─────────────────────────────────────── */

function dotColor(type: EventType): string {
  return EVENT_TYPE_COLORS[type];
}

/* ── Sub-components ──────────────────────────────────────── */

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
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
      {event.postUrl && !event.done && (
        <Link
          href={event.postUrl}
          className="btn-primary click-shift"
          style={{ fontSize: 12, padding: "6px 14px" }}
        >
          Submit content
        </Link>
      )}
      <button
        className="btn-ghost click-shift"
        onClick={() => onMarkDone(event.id)}
        disabled={event.done}
        style={{
          fontSize: 12,
          padding: "6px 14px",
          opacity: event.done ? 0.5 : 1,
        }}
      >
        {event.done ? "Done" : "Mark done"}
      </button>
      {!event.done && (
        <>
          <button
            className="btn-ghost click-shift"
            onClick={() => onSnooze(event.id)}
            style={{ fontSize: 12, padding: "6px 14px" }}
          >
            Snooze
          </button>
          <button
            className="btn-ghost click-shift"
            onClick={() => onAddNote(event.id)}
            style={{ fontSize: 12, padding: "6px 14px" }}
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
  const [pos, setPos] = useState({ top: 120, left: 120 });

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const pw = 320;
    const left = Math.min(rect.left, window.innerWidth - pw - 16);
    const top = rect.bottom + 8;
    setPos({ top: Math.max(8, top), left: Math.max(8, left) });
  }, [anchorRef]);

  // Close on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
        }}
        onClick={onClose}
      />
      <div
        ref={popRef}
        style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          zIndex: 101,
          width: 320,
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
        role="dialog"
        aria-label={`Events for ${formatDisplayDate(dateStr)}`}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            {formatDisplayDate(dateStr)}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: "var(--ink-4)",
              lineHeight: 1,
              padding: 0,
            }}
          >
            &times;
          </button>
        </div>

        <div
          style={{
            padding: "12px 20px 20px",
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {events.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
                margin: 0,
              }}
            >
              No events today.
            </p>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  borderBottom: "1px dotted var(--hairline)",
                  paddingBottom: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: dotColor(ev.type),
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {ev.title}
                  </span>
                </div>
                {ev.time && (
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--ink-4)",
                      marginLeft: 16,
                      marginBottom: 2,
                    }}
                  >
                    {ev.time}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-4)",
                    marginLeft: 16,
                    marginBottom: 4,
                  }}
                >
                  {ev.merchantName} · {ev.campaignTitle}
                </div>
                <div style={{ marginLeft: 16 }}>
                  <ActionButtons
                    event={ev}
                    onMarkDone={onMarkDone}
                    onSnooze={onSnooze}
                    onAddNote={onAddNote}
                  />
                </div>
                {noteTarget === ev.id && (
                  <div style={{ marginLeft: 16, marginTop: 8 }}>
                    <textarea
                      rows={2}
                      placeholder="Add a note..."
                      value={noteValue}
                      onChange={(e) => onNoteChange(e.target.value)}
                      autoFocus
                      style={{
                        width: "100%",
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--ink)",
                        background: "var(--surface-2)",
                        border: "1px solid var(--hairline)",
                        borderRadius: 8,
                        padding: "8px 12px",
                        resize: "vertical",
                        outline: "none",
                      }}
                    />
                    <button
                      className="btn-ghost click-shift"
                      style={{ marginTop: 6, fontSize: 12 }}
                      onClick={onNoteSave}
                    >
                      Save note
                    </button>
                  </div>
                )}
                {ev.note && noteTarget !== ev.id && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--ink-4)",
                      marginLeft: 16,
                      marginTop: 4,
                      fontStyle: "italic",
                    }}
                  >
                    Note: {ev.note}
                  </p>
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
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  // Week anchor (defaults to today's week)
  const [weekAnchor, setWeekAnchor] = useState(today);

  // Popover state
  const [popoverDate, setPopoverDate] = useState<string | null>(null);
  const popoverAnchor = useRef<HTMLElement | null>(null);

  // Event state (local mutation for demo)
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);

  // Note state
  const [noteTarget, setNoteTarget] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState("");

  /* ── Derived ─────────────────────────────────────────── */

  const ym = formatYearMonth(year, month);
  const deadlineCount = useMemo(() => countDeadlinesInMonth(ym), [ym]);

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

  // List view: events in current month, grouped by date
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
      } else {
        setMonth((m) => m - 1);
      }
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
      } else {
        setMonth((m) => m + 1);
      }
    }
  }

  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setWeekAnchor(today);
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

  function markDone(id: string) {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, done: true } : e)),
    );
  }

  function snooze(id: string) {
    // Snooze: push date forward 1 day
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const d = new Date(e.date + "T00:00:00");
        d.setDate(d.getDate() + 1);
        return { ...e, date: toYMD(d), snoozed: true };
      }),
    );
  }

  function addNote(id: string) {
    setNoteTarget(id);
    setNoteValue("");
  }

  function saveNote() {
    if (!noteTarget) return;
    setEvents((prev) =>
      prev.map((e) => (e.id === noteTarget ? { ...e, note: noteValue } : e)),
    );
    setNoteTarget(null);
    setNoteValue("");
  }

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

  /* ── Shared styles ───────────────────────────────────── */

  const cardStyle = {
    background: "var(--surface-2)",
    border: "1px solid var(--hairline)",
    borderRadius: 10,
    padding: 24,
  } as React.CSSProperties;

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div
      style={{
        background: "var(--surface)",
        minHeight: "100vh",
        paddingBottom: 96,
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 64px" }}>
        {/* ── Page header ────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: 40,
            paddingBottom: 32,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              CREATOR PORTAL
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 40,
                fontWeight: 700,
                color: "var(--ink)",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Your Calendar
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
                margin: "8px 0 0",
              }}
            >
              {MONTH_NAMES[month]} {year} ·{" "}
              <strong style={{ color: "var(--ink-3)" }}>{deadlineCount}</strong>{" "}
              {deadlineCount === 1 ? "deadline" : "deadlines"} this month
            </p>
          </div>

          {/* Export / Subscribe */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-ghost click-shift"
              onClick={() => downloadICS(events)}
            >
              Export .ics
            </button>
            <a
              className="btn-ghost click-shift"
              href="webcal://push.nyc/api/creator/calendar/feed"
            >
              Subscribe
            </a>
          </div>
        </div>

        {/* ── Controls bar ───────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          {/* Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="btn-ghost click-shift"
              onClick={prevPeriod}
              aria-label="Previous period"
              style={{ padding: "8px 14px", fontSize: 16 }}
            >
              ‹
            </button>
            <button
              onClick={goToday}
              title="Go to today"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--ink)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 8px",
                minWidth: 220,
                textAlign: "center",
              }}
            >
              {periodLabel}
            </button>
            <button
              className="btn-ghost click-shift"
              onClick={nextPeriod}
              aria-label="Next period"
              style={{ padding: "8px 14px", fontSize: 16 }}
            >
              ›
            </button>
          </div>

          {/* View tabs */}
          <div
            style={{
              display: "flex",
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 8,
              padding: 4,
              gap: 2,
            }}
          >
            {(["month", "week", "list"] as CalView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: view === v ? 600 : 400,
                  color: view === v ? "var(--ink)" : "var(--ink-4)",
                  background: view === v ? "var(--surface)" : "none",
                  border:
                    view === v
                      ? "1px solid var(--hairline)"
                      : "1px solid transparent",
                  borderRadius: 6,
                  padding: "6px 14px",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  transition: "all 0.15s",
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Legend ─────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          {(Object.entries(EVENT_TYPE_LABELS) as [EventType, string][]).map(
            ([type, label]) => (
              <span
                key={type}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--ink-4)",
                  letterSpacing: "0.04em",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: EVENT_TYPE_COLORS[type],
                    flexShrink: 0,
                  }}
                />
                {label}
              </span>
            ),
          )}
        </div>

        {/* ── Month view ─────────────────────────────────── */}
        {view === "month" && (
          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {/* Day-of-week headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              {DOW_LABELS.map((d) => (
                <div
                  key={d}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    textAlign: "center",
                    padding: "12px 0",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
              }}
            >
              {monthGrid.map((date, i) => {
                if (!date) {
                  return (
                    <div
                      key={`empty-${i}`}
                      style={{
                        minHeight: 88,
                        borderRight: "1px solid var(--hairline)",
                        borderBottom: "1px solid var(--hairline)",
                        background: "var(--surface)",
                        opacity: 0.4,
                      }}
                    />
                  );
                }

                const dateStr = toYMD(date);
                const isToday = dateStr === todayStr;
                const dayEvents = eventsByDate[dateStr] ?? [];
                const shown = dayEvents.slice(0, 2);
                const extra = dayEvents.length - shown.length;

                return (
                  <div
                    key={dateStr}
                    style={{
                      minHeight: 88,
                      borderRight: "1px solid var(--hairline)",
                      borderBottom: "1px solid var(--hairline)",
                      padding: "8px 6px",
                      cursor: "pointer",
                      background: isToday
                        ? "rgba(193,18,31,0.04)"
                        : "transparent",
                      transition: "background 0.12s",
                    }}
                    onClick={(e) => openPopover(dateStr, e.currentTarget)}
                    role="button"
                    aria-label={`${formatDisplayDate(dateStr)}, ${dayEvents.length} events`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        openPopover(dateStr, e.currentTarget);
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        fontWeight: isToday ? 700 : 400,
                        color: isToday ? "var(--brand-red)" : "var(--ink)",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      {date.getDate()}
                    </span>

                    {/* Dot row */}
                    <div
                      style={{
                        display: "flex",
                        gap: 3,
                        flexWrap: "wrap",
                        marginBottom: 4,
                      }}
                    >
                      {dayEvents.slice(0, 6).map((ev) => (
                        <span
                          key={ev.id}
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: dotColor(ev.type),
                            opacity: ev.done ? 0.3 : 1,
                            flexShrink: 0,
                          }}
                        />
                      ))}
                    </div>

                    {/* Compact pills */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {shown.map((ev) => (
                        <span
                          key={ev.id}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 10,
                            color: "var(--snow)",
                            background: dotColor(ev.type),
                            borderRadius: 4,
                            padding: "1px 5px",
                            opacity: ev.done ? 0.4 : 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ev.title}
                        </span>
                      ))}
                      {extra > 0 && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 10,
                            color: "var(--ink-4)",
                          }}
                        >
                          +{extra} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Week view ──────────────────────────────────── */}
        {view === "week" && (
          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
              }}
            >
              {weekDates.map((date) => {
                const dateStr = toYMD(date);
                const isToday = dateStr === todayStr;
                const dayEvents = eventsByDate[dateStr] ?? [];

                return (
                  <div
                    key={dateStr}
                    style={{
                      borderRight: "1px solid var(--hairline)",
                      minHeight: 200,
                    }}
                  >
                    <div
                      style={{
                        padding: "12px 12px 8px",
                        borderBottom: "1px solid var(--hairline)",
                        background: isToday
                          ? "rgba(193,18,31,0.04)"
                          : "transparent",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink-4)",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          display: "block",
                        }}
                      >
                        {DOW_LABELS_FULL[date.getDay()]}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 22,
                          fontWeight: 700,
                          color: isToday ? "var(--brand-red)" : "var(--ink)",
                        }}
                      >
                        {date.getDate()}
                      </span>
                    </div>

                    <div
                      style={{
                        padding: "8px 8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {dayEvents.length === 0 ? (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            color: "var(--ink-4)",
                          }}
                        >
                          —
                        </span>
                      ) : (
                        dayEvents.map((ev) => (
                          <div
                            key={ev.id}
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 11,
                              color: "var(--snow)",
                              background: dotColor(ev.type),
                              borderRadius: 4,
                              padding: "4px 8px",
                              opacity: ev.done ? 0.4 : 1,
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openPopover(dateStr, e.currentTarget);
                            }}
                            role="button"
                            tabIndex={0}
                            title={ev.title}
                          >
                            <div
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {ev.title}
                            </div>
                            {ev.time && (
                              <div style={{ opacity: 0.85, fontSize: 10 }}>
                                {ev.time}
                              </div>
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

        {/* ── List view ──────────────────────────────────── */}
        {view === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {listGroups.length === 0 ? (
              <div
                style={{
                  ...cardStyle,
                  textAlign: "center",
                  padding: 48,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 64,
                    fontWeight: 700,
                    color: "var(--hairline)",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  0
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--ink-4)",
                    margin: 0,
                  }}
                >
                  No events in {MONTH_NAMES[month]}.
                </p>
              </div>
            ) : (
              listGroups.map(([dateStr, dayEvents]) => {
                const [y, m, d] = dateStr.split("-").map(Number);
                const date = new Date(y, m - 1, d);
                const isToday = dateStr === todayStr;

                return (
                  <div key={dateStr} style={{ marginBottom: 8 }}>
                    {/* Date header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 0 8px",
                        borderBottom: "1px solid var(--hairline)",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 16,
                          fontWeight: 700,
                          color: "var(--ink)",
                        }}
                      >
                        {MONTH_NAMES[date.getMonth()]} {date.getDate()}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: "var(--ink-4)",
                        }}
                      >
                        {DOW_LABELS_FULL[date.getDay()]}
                      </span>
                      {isToday && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            color: "var(--snow)",
                            background: "var(--brand-red)",
                            borderRadius: 4,
                            padding: "2px 8px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Today
                        </span>
                      )}
                    </div>

                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "56px 1fr auto",
                          gap: 16,
                          padding: "12px 0",
                          borderBottom: "1px dotted var(--hairline)",
                          opacity: ev.done ? 0.5 : 1,
                        }}
                      >
                        {/* Time column */}
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            color: "var(--ink-4)",
                            paddingTop: 2,
                          }}
                        >
                          {ev.time ?? "—"}
                        </div>

                        {/* Content column */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: dotColor(ev.type),
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 11,
                                color: "var(--ink-4)",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                              }}
                            >
                              {EVENT_TYPE_LABELS[ev.type]}
                            </span>
                            {ev.payout ? (
                              <span
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: 11,
                                  color: "var(--ink-3)",
                                  fontWeight: 700,
                                }}
                              >
                                ${ev.payout}
                              </span>
                            ) : null}
                          </div>

                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 14,
                              fontWeight: 600,
                              color: "var(--ink)",
                            }}
                          >
                            {ev.title}
                          </span>

                          <Link
                            href={
                              ev.postUrl ??
                              `/creator/campaigns/${ev.campaignId}/post`
                            }
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 12,
                              color: "var(--accent-blue)",
                              textDecoration: "none",
                            }}
                          >
                            {ev.campaignTitle}
                          </Link>

                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 12,
                              color: "var(--ink-4)",
                            }}
                          >
                            {ev.merchantName}
                          </span>

                          {/* Note textarea */}
                          {noteTarget === ev.id && (
                            <div style={{ marginTop: 8 }}>
                              <textarea
                                rows={2}
                                placeholder="Add a note..."
                                value={noteValue}
                                onChange={(e) => setNoteValue(e.target.value)}
                                autoFocus
                                style={{
                                  width: "100%",
                                  fontFamily: "var(--font-body)",
                                  fontSize: 13,
                                  color: "var(--ink)",
                                  background: "var(--surface-2)",
                                  border: "1px solid var(--hairline)",
                                  borderRadius: 8,
                                  padding: "8px 12px",
                                  resize: "vertical",
                                  outline: "none",
                                }}
                              />
                              <button
                                className="btn-ghost click-shift"
                                style={{ marginTop: 6, fontSize: 12 }}
                                onClick={saveNote}
                              >
                                Save note
                              </button>
                            </div>
                          )}
                          {ev.note && noteTarget !== ev.id && (
                            <p
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 12,
                                color: "var(--ink-4)",
                                fontStyle: "italic",
                                margin: 0,
                              }}
                            >
                              Note: {ev.note}
                            </p>
                          )}
                        </div>

                        {/* Actions column */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            alignItems: "flex-end",
                          }}
                        >
                          {ev.postUrl && !ev.done && (
                            <Link
                              href={ev.postUrl}
                              className="btn-primary click-shift"
                              style={{
                                fontSize: 12,
                                padding: "6px 14px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Submit
                            </Link>
                          )}
                          <button
                            className="btn-ghost click-shift"
                            onClick={() => markDone(ev.id)}
                            disabled={ev.done}
                            style={{
                              fontSize: 12,
                              padding: "6px 14px",
                              opacity: ev.done ? 0.5 : 1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {ev.done ? "Done" : "Mark done"}
                          </button>
                          {!ev.done && (
                            <>
                              <button
                                className="btn-ghost click-shift"
                                onClick={() => snooze(ev.id)}
                                style={{ fontSize: 12, padding: "6px 14px" }}
                              >
                                Snooze
                              </button>
                              <button
                                className="btn-ghost click-shift"
                                onClick={() => addNote(ev.id)}
                                style={{ fontSize: 12, padding: "6px 14px" }}
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
      </div>

      {/* ── Day popover ──────────────────────────────────── */}
      {popoverDate && (
        <DayPopover
          dateStr={popoverDate}
          events={eventsByDate[popoverDate] ?? []}
          anchorRef={popoverAnchor}
          onClose={closePopover}
          onMarkDone={(id) => {
            markDone(id);
          }}
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
