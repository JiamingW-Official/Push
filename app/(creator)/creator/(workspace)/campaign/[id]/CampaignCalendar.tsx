"use client";

/* ============================================================
   <CampaignCalendar> — month grid + time slot picker
   v11 · 2026-05-09

   Two-stage interaction:
     1. Month grid — bookable dates show a champagne dot. Click
        a date to expand its slots below.
     2. Time slot pills — pick a time → onSelect fires. Apply
        button in the right rail picks up the selected slot.

   Push DNA:
     - 8px grid · iOS 26 radii · ink/champagne palette only
     - Bottom-right hover shift on every clickable
     - Single primary moment (selected slot ring in champagne)
   ============================================================ */

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { ShootWindow } from "@/lib/mocks/campaigns";

type Selected = { date: string; startTime: string; endTime: string } | null;

export function CampaignCalendar({
  windows,
  selected,
  onSelect,
}: {
  windows: ShootWindow[];
  selected: Selected;
  onSelect: (slot: Selected) => void;
}) {
  /* Anchor month — start at the month containing the first
     bookable date. User can ←→ to neighboring months but
     only sees dots on bookable dates. */
  const firstBookable = windows[0]?.date;
  const initialAnchor = firstBookable
    ? new Date(firstBookable + "T00:00")
    : new Date("2026-05-09");

  const [anchor, setAnchor] = useState(
    new Date(initialAnchor.getFullYear(), initialAnchor.getMonth(), 1),
  );
  const [activeDate, setActiveDate] = useState<string | null>(
    firstBookable ?? null,
  );

  /* Map date → window for fast lookup. */
  const byDate = useMemo(() => {
    const m = new Map<string, ShootWindow>();
    for (const w of windows) m.set(w.date, w);
    return m;
  }, [windows]);

  /* Build visible cells for current month — leading/trailing
     blanks so weekday alignment is correct. Week starts Sunday. */
  const cells = useMemo(() => buildMonthCells(anchor), [anchor]);

  const monthLabel = anchor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const activeWindow = activeDate ? byDate.get(activeDate) : null;

  if (windows.length === 0) {
    return (
      <div className="cd-cal-empty">
        <p>No shoot windows scheduled yet. The merchant will publish them soon.</p>
      </div>
    );
  }

  return (
    <div className="cd-cal">
      <h2 className="cd-section__title">Pick a date and time</h2>
      <p className="cd-cal__sub">
        Selecting a slot pre-fills your application with the time you want
        to shoot. Slots are first-come — the merchant locks in once you apply.
      </p>

      {/* Month nav */}
      <div className="cd-cal__nav">
        <button
          type="button"
          className="cd-cal__navbtn"
          aria-label="Previous month"
          onClick={() => setAnchor(addMonths(anchor, -1))}
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <span className="cd-cal__month">{monthLabel}</span>
        <button
          type="button"
          className="cd-cal__navbtn"
          aria-label="Next month"
          onClick={() => setAnchor(addMonths(anchor, 1))}
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Weekday header */}
      <div className="cd-cal__dow" aria-hidden>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="cd-cal__dow-cell">
            {d}
          </span>
        ))}
      </div>

      {/* v16 — role=grid + role=gridcell removed (Next 16 a11y rule
          forbids gridcell with content children). Plain semantic
          buttons in a div work for a date picker; aria-label gives
          screen readers the day + availability state. */}
      <div className="cd-cal__grid">
        {cells.map((cell, i) => {
          if (cell.kind === "blank") {
            return (
              <span
                key={`b-${i}`}
                className="cd-cal__cell cd-cal__cell--blank"
                aria-hidden
              />
            );
          }
          const date = cell.date;
          const w = byDate.get(date);
          const bookable = !!w;
          const isActive = activeDate === date;
          return (
            <button
              key={date}
              type="button"
              className={`cd-cal__cell${bookable ? " is-bookable" : ""}${isActive ? " is-active" : ""}`}
              onClick={() => bookable && setActiveDate(date)}
              disabled={!bookable}
              aria-label={`${cell.day} ${monthLabel}${bookable ? ` — ${w.slots.length} slots available` : " — unavailable"}`}
              aria-pressed={isActive}
            >
              <span className="cd-cal__day">{cell.day}</span>
              {bookable && <span className="cd-cal__dot" aria-hidden />}
            </button>
          );
        })}
      </div>

      {/* Slot pills for active date */}
      {activeWindow && (
        <div className="cd-slots">
          <p className="cd-slots__head">
            Available times · {formatHumanDate(activeWindow.date)}
          </p>
          <div className="cd-slots__list">
            {activeWindow.slots.map((slot, i) => {
              const taken =
                slot.bookedBy && slot.bookedBy.length >= slot.capacity;
              const isSelected =
                selected?.date === activeWindow.date &&
                selected?.startTime === slot.startTime;
              return (
                <button
                  key={i}
                  type="button"
                  className={`cd-slot${isSelected ? " is-selected" : ""}${taken ? " is-taken" : ""}`}
                  onClick={() =>
                    !taken &&
                    onSelect(
                      isSelected
                        ? null
                        : {
                            date: activeWindow.date,
                            startTime: slot.startTime,
                            endTime: slot.endTime,
                          },
                    )
                  }
                  disabled={taken}
                >
                  <Clock size={11} strokeWidth={2.25} />
                  <span>{slot.startTime}</span>
                  <span className="cd-slot__sep">–</span>
                  <span>{slot.endTime}</span>
                  {taken && <span className="cd-slot__tag">Taken</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

type Cell =
  | { kind: "blank" }
  | { kind: "day"; date: string; day: number };

function buildMonthCells(anchor: Date): Cell[] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const startDow = first.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Cell[] = [];
  for (let i = 0; i < startDow; i++) cells.push({ kind: "blank" });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ kind: "day", date: dateStr, day: d });
  }
  // Pad to multiple of 7 for clean grid.
  while (cells.length % 7 !== 0) cells.push({ kind: "blank" });
  return cells;
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function formatHumanDate(iso: string): string {
  const d = new Date(iso + "T00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
