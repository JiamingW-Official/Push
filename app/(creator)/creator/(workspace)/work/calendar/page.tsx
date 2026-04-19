"use client";

import { useState } from "react";
import Link from "next/link";
import "./calendar.css";

interface CalEvent {
  id: string;
  date: string; // YYYY-MM-DD
  label: string;
  merchantName: string;
  campaignId: string;
  category: string;
}

// Mock events — will connect to real data in P1
const MOCK_EVENTS: CalEvent[] = [];

const CATEGORY_COLOR: Record<string, string> = {
  Coffee: "#8c6239",
  Food: "#c1121f",
  Beauty: "#9b111e",
  Retail: "#003049",
  Fitness: "#669bbc",
  Lifestyle: "#c9a96e",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function WorkCalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayKey = toDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }
  function goToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="calendar-page">
      <div className="cal-nav">
        <button className="cal-nav__today" onClick={goToday}>
          Today
        </button>
        <button
          className="cal-nav__arrow"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="cal-nav__label">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          className="cal-nav__arrow"
          onClick={nextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="cal-grid">
        {WEEKDAYS.map((d) => (
          <div key={d} className="cal-weekday">
            {d}
          </div>
        ))}
        {cells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                className="cal-cell cal-cell--outside"
              />
            );
          }
          const key = toDateKey(year, month, day);
          const isToday = key === todayKey;
          const dayEvents = MOCK_EVENTS.filter((e) => e.date === key).slice(
            0,
            3,
          );

          return (
            <div
              key={key}
              className={`cal-cell${isToday ? " cal-cell--today" : ""}`}
            >
              <span className="cal-cell__day">{day}</span>
              <div className="cal-cell__events">
                {dayEvents.map((ev) => (
                  <Link
                    key={ev.id}
                    href={`/creator/work/campaign/${ev.campaignId}#timeline`}
                    className="cal-event-pill"
                    style={{
                      background: CATEGORY_COLOR[ev.category] ?? "#003049",
                    }}
                  >
                    {ev.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {MOCK_EVENTS.length === 0 && (
        <p className="cal-empty">No events this month.</p>
      )}
    </div>
  );
}
