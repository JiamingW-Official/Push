"use client";

import Link from "next/link";
import "./today.css";

interface TodayEvent {
  id: string;
  time: string;
  label: string;
  merchantName: string;
  campaignId: string;
  type: "visit" | "deadline" | "publish";
}

// Mock today events — will be replaced with real data hook
const MOCK_EVENTS: TodayEvent[] = [];

const HOURS = Array.from(
  { length: 17 },
  (_, i) => `${(i + 6).toString().padStart(2, "0")}:00`,
);

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function WorkTodayPage() {
  const today = new Date();
  const hasEvents = MOCK_EVENTS.length > 0;

  return (
    <div className="today-page">
      <div className="today-header">
        <h1 className="today-title">Today</h1>
        <p className="today-date">{formatDate(today)}</p>
      </div>

      {!hasEvents ? (
        <div className="today-empty">
          <p className="today-empty__title">No commitments today.</p>
          <p className="today-empty__body">
            Check your pipeline for upcoming milestones.
          </p>
          <Link href="/creator/work/pipeline" className="today-empty__link">
            Check pipeline →
          </Link>
        </div>
      ) : (
        <div className="today-timeline">
          {HOURS.map((hour) => {
            const events = MOCK_EVENTS.filter((e) =>
              e.time.startsWith(hour.slice(0, 2)),
            );
            return (
              <div key={hour} className="today-timeline__row">
                <span className="today-timeline__hour">{hour}</span>
                <div className="today-timeline__events">
                  {events.map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/creator/work/campaign/${ev.campaignId}`}
                      className={`today-event today-event--${ev.type}`}
                    >
                      <span className="today-event__label">{ev.label}</span>
                      <span className="today-event__merchant">
                        {ev.merchantName}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
