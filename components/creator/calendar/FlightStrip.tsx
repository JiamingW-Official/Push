"use client";

import { useMemo } from "react";
import { CalendarEvent, EventType } from "@/lib/calendar/mock-events";

// Priority order: deadline > review > milestone (higher = wins cell)
const EVENT_PRIORITY: Record<EventType, number> = {
  deadline: 3,
  review: 2,
  milestone: 1,
};

// Decay thresholds in days overdue → number of filled segments (out of 4)
function decaySegments(daysOverdue: number): number {
  if (daysOverdue < 30) return 4; // 100%
  if (daysOverdue < 60) return 2; // 50%
  if (daysOverdue < 90) return 1; // 25%
  return 0; //  0%
}

function daysBetween(a: string, b: string): number {
  return Math.floor(
    (new Date(b).getTime() - new Date(a).getTime()) / 86_400_000,
  );
}

const DOW_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_SHORT = [
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

function formatColHeader(dateStr: string): { dow: string; date: string } {
  const d = new Date(dateStr + "T00:00:00");
  return {
    dow: DOW_SHORT[d.getDay()],
    date: `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`,
  };
}

export interface FlightStripProps {
  events: CalendarEvent[];
  todayStr: string;
  campaignColorMap: Record<string, string>;
  onSelectDate: (date: string) => void;
}

export function FlightStrip({
  events,
  todayStr,
  campaignColorMap,
  onSelectDate,
}: FlightStripProps) {
  // Generate 7 days starting from today
  const agendaDays = useMemo<string[]>(() => {
    const days: string[] = [];
    const base = new Date(todayStr + "T00:00:00");
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  }, [todayStr]);

  // Active campaigns: campaigns with at least one non-done event, ordered by first seen
  const activeCampaignIds = useMemo<string[]>(() => {
    const seen = new Set<string>();
    const ids: string[] = [];
    for (const ev of events) {
      if (!ev.done && !seen.has(ev.campaignId)) {
        seen.add(ev.campaignId);
        ids.push(ev.campaignId);
      }
    }
    return ids;
  }, [events]);

  // Campaign metadata (title + merchant) by id
  const campaignMeta = useMemo<
    Record<string, { title: string; merchant: string }>
  >(() => {
    const map: Record<string, { title: string; merchant: string }> = {};
    for (const ev of events) {
      if (!(ev.campaignId in map)) {
        map[ev.campaignId] = {
          title: ev.campaignTitle,
          merchant: ev.merchantName,
        };
      }
    }
    return map;
  }, [events]);

  // Cell map: "campaignId__dateStr" → highest-priority event that day
  const cellMap = useMemo<Record<string, CalendarEvent>>(() => {
    const map: Record<string, CalendarEvent> = {};
    for (const ev of events) {
      const key = `${ev.campaignId}__${ev.date}`;
      const existing = map[key];
      if (
        !existing ||
        EVENT_PRIORITY[ev.type] > EVENT_PRIORITY[existing.type]
      ) {
        map[key] = ev;
      }
    }
    return map;
  }, [events]);

  // Most-overdue deadline per campaign (for decay bar)
  const campaignDecay = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const ev of events) {
      if (ev.type === "deadline" && !ev.done && ev.date < todayStr) {
        const daysOverdue = daysBetween(ev.date, todayStr);
        if (!(ev.campaignId in map) || daysOverdue > map[ev.campaignId]) {
          map[ev.campaignId] = daysOverdue;
        }
      }
    }
    return map;
  }, [events, todayStr]);

  if (activeCampaignIds.length === 0) {
    return (
      <div className="cal-flight-empty">
        <p className="cal-flight-empty__line">No active campaigns</p>
        <p className="cal-flight-empty__sub">All caught up</p>
      </div>
    );
  }

  return (
    <div className="cal-flight-wrap">
      {/* ── Header row ─────────────────────────────────── */}
      <div className="cal-flight-grid">
        <div className="cal-flight-row cal-flight-row--header">
          {/* campaign label column */}
          <div className="cal-flight-cell cal-flight-cell--label" />
          {agendaDays.map((d) => {
            const { dow, date } = formatColHeader(d);
            const isToday = d === todayStr;
            return (
              <div
                key={d}
                className={`cal-flight-cell cal-flight-cell--head${isToday ? " is-today" : ""}`}
              >
                <span className="cal-flight-head-dow">{dow}</span>
                <span className="cal-flight-head-date">{date}</span>
              </div>
            );
          })}
          {/* decay bar header */}
          <div className="cal-flight-cell cal-flight-cell--decay-head">
            <span className="cal-flight-decay-label">DECAY</span>
          </div>
        </div>

        {/* ── Campaign rows ──────────────────────────── */}
        {activeCampaignIds.map((campaignId) => {
          const meta = campaignMeta[campaignId];
          const color = campaignColorMap[campaignId] ?? "var(--graphite)";
          const daysOverdue = campaignDecay[campaignId];
          const hasDecay = daysOverdue !== undefined;
          const segs = hasDecay ? decaySegments(daysOverdue) : null;

          return (
            <div key={campaignId} className="cal-flight-row">
              {/* Campaign label */}
              <div
                className="cal-flight-cell cal-flight-cell--label"
                style={{ borderLeftColor: color }}
              >
                <span className="cal-flight-campaign-title">
                  {meta?.title ?? campaignId}
                </span>
                <span className="cal-flight-campaign-merchant">
                  {meta?.merchant}
                </span>
              </div>

              {/* Day cells */}
              {agendaDays.map((d) => {
                const isToday = d === todayStr;
                const ev = cellMap[`${campaignId}__${d}`];
                return (
                  <div
                    key={d}
                    className={`cal-flight-cell cal-flight-cell--day${isToday ? " is-today" : ""}${ev ? " has-event" : ""}`}
                    onClick={() => onSelectDate(d)}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      ev
                        ? `${ev.title} on ${d}`
                        : `No event for ${meta?.title} on ${d}`
                    }
                  >
                    {isToday && <div className="cal-flight-today-line" />}
                    {ev && (
                      <span
                        className={`cal-flight-event-chip event-type--${ev.type}${ev.done ? " is-done" : ""}`}
                      >
                        {ev.type === "deadline"
                          ? "DL"
                          : ev.type === "review"
                            ? "REV"
                            : "MS"}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Decay bar */}
              <div className="cal-flight-cell cal-flight-cell--decay">
                {hasDecay && segs !== null ? (
                  <div
                    className="cal-flight-decay-bar"
                    aria-label={`Decay ${segs * 25}%`}
                  >
                    {[3, 2, 1, 0].map((threshold) => (
                      <div
                        key={threshold}
                        className={`cal-flight-decay-seg${segs > threshold ? " is-active" : ""}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="cal-flight-decay-bar cal-flight-decay-bar--none" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
