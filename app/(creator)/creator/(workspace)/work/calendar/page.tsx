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

/* v11 event pill color mapping — deadlines use brand-red, active campaigns use accent-blue */
function eventPillStyle(type: EventType): React.CSSProperties {
  const map: Record<EventType, { bg: string; color: string }> = {
    deadline: { bg: "var(--brand-red)", color: "var(--snow)" },
    review: { bg: "var(--surface-2)", color: "var(--ink-3)" },
    payment: { bg: "#bfa170", color: "var(--snow)" },
    milestone: { bg: "var(--accent-blue)", color: "var(--snow)" },
  };
  return {
    background: map[type].bg,
    color: map[type].color,
    fontSize: 10,
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    padding: "2px 6px",
    borderRadius: 4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
    marginBottom: 2,
  };
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
      <div
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          padding: "32px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-4)",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Click any day
          <br />
          to see events
        </p>
      </div>
    );
  }

  const dayEvents = events.filter((e) => e.date === selectedDate);
  const isToday = selectedDate === todayStr;

  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        overflow: "hidden",
        minWidth: 260,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--ink)",
            }}
          >
            {formatShortDate(selectedDate)}
          </span>
          {isToday && (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 4,
                background: "var(--brand-red)",
                color: "var(--snow)",
                fontFamily: "var(--font-body)",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Today
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-4)",
            marginTop: 2,
          }}
        >
          {getDOW(selectedDate)}
        </div>
      </div>

      {/* Events */}
      <div style={{ padding: "12px 20px" }}>
        {dayEvents.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-4)",
              padding: "16px 0",
              textAlign: "center",
            }}
          >
            No events scheduled.
            <br />
            <span style={{ opacity: 0.6 }}>Free day!</span>
          </p>
        ) : (
          dayEvents.map((ev) => (
            <div
              key={ev.id}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              {/* Type chip */}
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: dotColor(ev.type),
                  color: "var(--snow)",
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                {EVENT_TYPE_LABELS[ev.type]}
              </span>

              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--ink)",
                  marginBottom: 4,
                }}
              >
                {ev.title}
              </div>

              {ev.time && (
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-3)",
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
                  color: "var(--ink-3)",
                  marginBottom: 4,
                }}
              >
                {ev.merchantName} · {ev.campaignTitle}
              </div>
              {ev.payout ? (
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--ink)",
                    marginBottom: 8,
                  }}
                >
                  ${ev.payout}
                </div>
              ) : null}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ev.postUrl && !ev.done && (
                  <Link
                    href={ev.postUrl}
                    className="btn-primary click-shift"
                    style={{ fontSize: 12, padding: "4px 12px" }}
                  >
                    Submit
                  </Link>
                )}
                <button
                  className={ev.done ? "btn-ghost" : "btn-ghost click-shift"}
                  onClick={() => onMarkDone(ev.id)}
                  disabled={ev.done}
                  style={{
                    fontSize: 12,
                    padding: "4px 12px",
                    opacity: ev.done ? 0.5 : 1,
                  }}
                >
                  {ev.done ? "Done" : "Mark done"}
                </button>
                {!ev.done && (
                  <>
                    <button
                      className="btn-ghost click-shift"
                      onClick={() => onSnooze(ev.id)}
                      style={{ fontSize: 12, padding: "4px 12px" }}
                    >
                      Snooze
                    </button>
                    <button
                      className="btn-ghost click-shift"
                      onClick={() => onAddNote(ev.id)}
                      style={{ fontSize: 12, padding: "4px 12px" }}
                    >
                      Note
                    </button>
                  </>
                )}
              </div>

              {noteTarget === ev.id && (
                <div style={{ marginTop: 8 }}>
                  <textarea
                    className="cal-note-input"
                    rows={2}
                    placeholder="Add a note..."
                    value={noteValue}
                    onChange={(e) => onNoteChange(e.target.value)}
                    autoFocus
                    style={{
                      width: "100%",
                      border: "1px solid var(--hairline)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--ink)",
                      background: "var(--snow)",
                      resize: "none",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    className="btn-secondary click-shift"
                    style={{ marginTop: 6, fontSize: 12, padding: "4px 12px" }}
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
                    color: "var(--ink-3)",
                    fontStyle: "italic",
                    marginTop: 6,
                    padding: "6px 10px",
                    background: "var(--surface)",
                    borderRadius: 6,
                    border: "1px solid var(--hairline)",
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
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
      {event.postUrl && !event.done && (
        <Link
          href={event.postUrl}
          className="btn-primary click-shift"
          style={{ fontSize: 11, padding: "3px 10px" }}
        >
          Submit content
        </Link>
      )}
      <button
        className={event.done ? "btn-ghost" : "btn-ghost click-shift"}
        onClick={() => onMarkDone(event.id)}
        disabled={event.done}
        style={{
          fontSize: 11,
          padding: "3px 10px",
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
            style={{ fontSize: 11, padding: "3px 10px" }}
          >
            Snooze
          </button>
          <button
            className="btn-ghost click-shift"
            onClick={() => onAddNote(event.id)}
            style={{ fontSize: 11, padding: "3px 10px" }}
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
      <div
        className="cal-popover-backdrop"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
        }}
      />
      <div
        ref={popRef}
        role="dialog"
        aria-label={`Events for ${formatDisplayDate(dateStr)}`}
        style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          width: 320,
          zIndex: 50,
          background: "var(--snow)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Popover header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 15,
              color: "var(--ink)",
            }}
          >
            {formatDisplayDate(dateStr)}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "1px solid var(--hairline)",
              background: "var(--surface-2)",
              color: "var(--ink)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-body)",
              fontSize: 14,
            }}
          >
            &times;
          </button>
        </div>

        <div
          style={{ padding: "12px 16px", maxHeight: 400, overflowY: "auto" }}
        >
          {events.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
                textAlign: "center",
                padding: "16px 0",
              }}
            >
              No events today.
            </p>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  paddingBottom: 12,
                  marginBottom: 12,
                  borderBottom: "1px solid var(--hairline)",
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
                      fontWeight: 700,
                      fontSize: 13,
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
                      fontSize: 12,
                      color: "var(--ink-3)",
                      marginBottom: 2,
                      paddingLeft: 16,
                    }}
                  >
                    {ev.time}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-3)",
                    paddingLeft: 16,
                    marginBottom: 4,
                  }}
                >
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
                      style={{
                        width: "100%",
                        border: "1px solid var(--hairline)",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--ink)",
                        background: "var(--snow)",
                        resize: "none",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      className="btn-secondary click-shift"
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        padding: "4px 12px",
                      }}
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
                      color: "var(--ink-3)",
                      fontStyle: "italic",
                      marginTop: 6,
                      paddingLeft: 16,
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

  /* ── Shared note textarea style ──────────────────────── */
  const noteTextareaStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid var(--hairline)",
    borderRadius: 8,
    padding: "8px 12px",
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink)",
    background: "var(--snow)",
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
  };

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div className="cw-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">
            CALENDAR · {MONTH_NAMES[month]} {year} · {deadlineCount}{" "}
            {deadlineCount === 1 ? "DEADLINE" : "DEADLINES"}
            {estEarnings > 0 ? ` · $${estEarnings.toLocaleString()} EST.` : ""}
          </p>
          <h1 className="cw-title">Calendar</h1>
        </div>
        <div className="cw-header__right">
          <button
            type="button"
            className="cw-pill"
            onClick={() => downloadICS(events)}
            title="Export .ics calendar file"
          >
            Export .ics
          </button>
          <a
            href="webcal://push.nyc/api/creator/calendar/feed"
            className="cw-pill cw-pill--urgent"
            title="Subscribe to calendar"
          >
            Subscribe →
          </a>
        </div>
      </header>

      {/* ── Controls bar ─────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--surface-2)",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={prevPeriod}
            aria-label="Previous period"
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: "1px solid var(--hairline)",
              background: "var(--snow)",
              color: "var(--ink)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            &#8249;
          </button>
          <button
            onClick={goToday}
            title="Go to today"
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: "1px solid var(--hairline)",
              background: "var(--snow)",
              color: "var(--ink)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              minWidth: 160,
              textAlign: "center",
            }}
          >
            {periodLabel}
          </button>
          <button
            onClick={nextPeriod}
            aria-label="Next period"
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: "1px solid var(--hairline)",
              background: "var(--snow)",
              color: "var(--ink)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            &#8250;
          </button>
        </div>

        {/* View tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {(["month", "week", "list"] as CalView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                border: "1px solid var(--hairline)",
                background: view === v ? "var(--ink)" : "var(--snow)",
                color: view === v ? "var(--snow)" : "var(--ink-3)",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Legend ───────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "12px 24px",
          borderBottom: "1px solid var(--hairline)",
          flexWrap: "wrap",
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
                fontSize: 12,
                color: "var(--ink-3)",
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

      {/* ── Month view ───────────────────────────────── */}
      {view === "month" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 24,
            padding: "24px",
            alignItems: "start",
          }}
        >
          <div>
            {/* Day-of-week headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 2,
                marginBottom: 4,
              }}
            >
              {DOW_LABELS.map((d) => (
                <div
                  key={d}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    textAlign: "center",
                    padding: "4px 0",
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
                gap: 2,
              }}
            >
              {monthGrid.map((date, i) => {
                if (!date) {
                  return (
                    <div
                      key={`empty-${i}`}
                      style={{
                        minHeight: 80,
                        background: "var(--surface)",
                        borderRadius: 6,
                        opacity: 0.3,
                      }}
                    />
                  );
                }

                const dateStr = toYMD(date);
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const dayEvents = eventsByDate[dateStr] ?? [];
                const shown = dayEvents.slice(0, 3);
                const extra = dayEvents.length - shown.length;

                return (
                  <div
                    key={dateStr}
                    onClick={(e) => handleCellClick(dateStr, e.currentTarget)}
                    role="button"
                    aria-label={`${formatDisplayDate(dateStr)}, ${dayEvents.length} events`}
                    aria-pressed={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleCellClick(dateStr, e.currentTarget);
                    }}
                    style={{
                      minHeight: 80,
                      padding: "6px",
                      borderRadius: 8,
                      border: isSelected
                        ? "2px solid var(--brand-red)"
                        : "1px solid var(--hairline)",
                      background: isToday
                        ? "var(--snow)"
                        : isSelected
                          ? "var(--surface-2)"
                          : "var(--surface-2)",
                      cursor: "pointer",
                      position: "relative",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Day number */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-body)",
                          fontWeight: isToday ? 700 : 400,
                          fontSize: 12,
                          background: isToday
                            ? "var(--brand-red)"
                            : "transparent",
                          color: isToday ? "var(--snow)" : "var(--ink)",
                        }}
                      >
                        {date.getDate()}
                      </span>
                    </div>

                    {/* Event pills — desktop */}
                    <div className="cal-cell-events">
                      {shown.map((ev) => (
                        <span
                          key={ev.id}
                          style={{
                            ...eventPillStyle(ev.type),
                            opacity: ev.done ? 0.4 : 1,
                          }}
                        >
                          {ev.title}
                        </span>
                      ))}
                      {extra > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: "var(--font-body)",
                            color: "var(--ink-4)",
                          }}
                        >
                          +{extra} more
                        </span>
                      )}
                    </div>

                    {/* Dot strip — mobile fallback */}
                    <div
                      className="cal-cell-dots"
                      style={{ display: "flex", gap: 2, marginTop: 2 }}
                    >
                      {dayEvents.slice(0, 6).map((ev) => (
                        <span
                          key={ev.id}
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: dotColor(ev.type),
                            opacity: ev.done ? 0.3 : 1,
                            flexShrink: 0,
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
        <div style={{ padding: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 8,
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
                    background: isToday ? "var(--snow)" : "var(--surface-2)",
                    border: isToday
                      ? "2px solid var(--brand-red)"
                      : "1px solid var(--hairline)",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  {/* Column header */}
                  <div
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid var(--hairline)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 10,
                        color: "var(--ink-4)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 2,
                      }}
                    >
                      {DOW_LABELS_FULL[date.getDay()].slice(0, 3)}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 18,
                        color: isToday ? "var(--brand-red)" : "var(--ink)",
                      }}
                    >
                      {date.getDate()}
                    </div>
                  </div>

                  {/* Events */}
                  <div style={{ padding: "8px" }}>
                    {dayEvents.length === 0 ? (
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: "var(--ink-4)",
                          display: "block",
                          textAlign: "center",
                          padding: "8px 0",
                        }}
                      >
                        —
                      </span>
                    ) : (
                      dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openPopover(dateStr, e.currentTarget);
                          }}
                          role="button"
                          tabIndex={0}
                          title={ev.title}
                          style={{
                            padding: "4px 8px",
                            borderRadius: 6,
                            background: dotColor(ev.type),
                            marginBottom: 4,
                            cursor: "pointer",
                            opacity: ev.done ? 0.4 : 1,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 11,
                              fontWeight: 600,
                              color: "var(--snow)",
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {ev.title}
                          </span>
                          {ev.time && (
                            <span
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 10,
                                color: "rgba(255,255,255,0.75)",
                              }}
                            >
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
        <div style={{ padding: 24 }}>
          {listGroups.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 48,
                  color: "var(--ink-4)",
                  marginBottom: 8,
                }}
              >
                0
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--ink-3)",
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
                <div key={dateStr} style={{ marginBottom: 24 }}>
                  {/* Date header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 16,
                          color: "var(--ink)",
                        }}
                      >
                        {MONTH_NAMES[date.getMonth()]} {date.getDate()}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: "var(--ink-3)",
                          marginLeft: 8,
                        }}
                      >
                        {DOW_LABELS_FULL[date.getDay()]}
                      </span>
                    </div>
                    {isToday && (
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "var(--brand-red)",
                          color: "var(--snow)",
                          fontFamily: "var(--font-body)",
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Today
                      </span>
                    )}
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: "var(--hairline)",
                      }}
                    />
                  </div>

                  {/* Event rows */}
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "56px 1fr auto",
                        gap: 16,
                        alignItems: "start",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: "1px solid var(--hairline)",
                        background: ev.done
                          ? "var(--surface)"
                          : "var(--surface-2)",
                        marginBottom: 8,
                        opacity: ev.done ? 0.6 : 1,
                      }}
                    >
                      {/* Time col */}
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

                      {/* Content */}
                      <div>
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
                              fontSize: 11,
                              color: "var(--ink-4)",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {EVENT_TYPE_LABELS[ev.type]}
                          </span>
                          {ev.payout ? (
                            <span
                              style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                fontSize: 14,
                                color: "var(--ink)",
                              }}
                            >
                              ${ev.payout}
                            </span>
                          ) : null}
                        </div>

                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "var(--ink)",
                            marginBottom: 4,
                          }}
                        >
                          {ev.title}
                        </div>

                        <Link
                          href={
                            ev.postUrl ??
                            `/creator/campaigns/${ev.campaignId}/post`
                          }
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            color: "var(--accent-blue)",
                            display: "block",
                            marginBottom: 2,
                            textDecoration: "none",
                          }}
                        >
                          {ev.campaignTitle}
                        </Link>

                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            color: "var(--ink-3)",
                          }}
                        >
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
                              style={noteTextareaStyle}
                            />
                            <button
                              className="btn-secondary click-shift"
                              style={{
                                marginTop: 6,
                                fontSize: 12,
                                padding: "4px 12px",
                              }}
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
                              color: "var(--ink-3)",
                              fontStyle: "italic",
                              marginTop: 6,
                              padding: "6px 10px",
                              background: "var(--surface)",
                              borderRadius: 6,
                              border: "1px solid var(--hairline)",
                            }}
                          >
                            Note: {ev.note}
                          </p>
                        )}
                      </div>

                      {/* Actions col */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        {ev.postUrl && !ev.done && (
                          <Link
                            href={ev.postUrl}
                            className="btn-primary click-shift"
                            style={{ fontSize: 11, padding: "4px 10px" }}
                          >
                            Submit
                          </Link>
                        )}
                        <button
                          className={
                            ev.done ? "btn-ghost" : "btn-ghost click-shift"
                          }
                          onClick={() => markDone(ev.id)}
                          disabled={ev.done}
                          style={{
                            fontSize: 11,
                            padding: "4px 10px",
                            opacity: ev.done ? 0.5 : 1,
                          }}
                        >
                          {ev.done ? "Done" : "Mark done"}
                        </button>
                        {!ev.done && (
                          <>
                            <button
                              className="btn-ghost click-shift"
                              onClick={() => snooze(ev.id)}
                              style={{ fontSize: 11, padding: "4px 10px" }}
                            >
                              Snooze
                            </button>
                            <button
                              className="btn-ghost click-shift"
                              onClick={() => addNote(ev.id)}
                              style={{ fontSize: 11, padding: "4px 10px" }}
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
