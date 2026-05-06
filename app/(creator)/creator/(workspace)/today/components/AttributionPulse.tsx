"use client";

import { PaneHeader } from "@/lib/workspace/chrome";
import { timeAgo } from "@/lib/notifications/useNotifications";
import type { AttributionEvent } from "@/lib/inbox/seed";

interface AttributionPulseProps {
  events: AttributionEvent[];
  now: number | null;
}

function statusDotClass(status: AttributionEvent["status"]): string {
  if (status === "verified") return "pulse-dot pulse-dot--verified";
  if (status === "rejected") return "pulse-dot pulse-dot--rejected";
  return "pulse-dot pulse-dot--pending";
}

function formatPayout(event: AttributionEvent): string {
  if (event.status === "verified" && event.payoutCents > 0) {
    return `+$${(event.payoutCents / 100).toFixed(2)}`;
  }
  return "—";
}

export default function AttributionPulse({
  events,
  now,
}: AttributionPulseProps) {
  const topFive = events.slice(0, 5);

  return (
    <section className="pulse-section" aria-label="Attribution pulse">
      <PaneHeader title="Live" sub="Last 5 scans" />
      {topFive.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-5)",
          }}
        >
          No scans recorded yet.
        </p>
      ) : (
        <div role="list">
          {topFive.map((event) => (
            <div key={event.id} className="pulse-row" role="listitem">
              <span
                className={statusDotClass(event.status)}
                aria-label={event.status}
              />
              <span className="pulse-label">{event.campaignLabel}</span>
              <span
                className={`pulse-payout${event.status !== "verified" ? " pulse-payout--muted" : ""}`}
                suppressHydrationWarning
              >
                {now != null ? formatPayout(event) : "—"}
              </span>
              <span className="pulse-time" suppressHydrationWarning>
                {timeAgo(event.occurredAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
