"use client";

import { DisputeEvent } from "@/lib/disputes/mock-disputes";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const ACTOR_LABELS: Record<string, string> = {
  creator: "Creator",
  merchant: "Merchant",
  admin: "Admin",
  system: "System",
};

const EVENT_LABELS: Record<string, string> = {
  opened: "Dispute opened",
  evidence_submitted: "Evidence submitted",
  evidence_requested: "Evidence requested",
  admin_note: "Admin note",
  decision_made: "Decision posted",
  escalated: "Escalated",
  thread_locked: "Thread locked",
  message_creator: "Messaged creator",
  message_merchant: "Messaged merchant",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

function getEventColor(
  type: DisputeEvent["type"],
  actor: DisputeEvent["actor"],
): string {
  if (type === "resolved") return "var(--tertiary)";
  if (type === "dismissed") return "var(--graphite)";
  if (type === "escalated" || type === "thread_locked") return "var(--primary)";
  if (type === "decision_made") return "var(--champagne)";
  if (actor === "admin" || actor === "system") return "var(--dark)";
  if (actor === "creator") return "var(--tertiary)";
  if (actor === "merchant") return "var(--primary)";
  return "var(--graphite)";
}

type Props = {
  events: DisputeEvent[];
  showInternal?: boolean;
};

export function DisputeTimeline({ events, showInternal = false }: Props) {
  const visible = showInternal ? events : events.filter((e) => !e.internal);

  return (
    <div className="dispute-timeline">
      {visible.map((event, idx) => {
        const color = getEventColor(event.type, event.actor);
        return (
          <div
            key={event.id}
            className={`dt-item${event.internal ? " dt-item--internal" : ""}`}
          >
            {/* Connector line */}
            {idx < visible.length - 1 && <div className="dt-item__line" />}

            {/* Dot */}
            <div className="dt-item__dot" style={{ background: color }} />

            {/* Content */}
            <div className="dt-item__body">
              <div className="dt-item__meta">
                <span className="dt-item__event-label">
                  {EVENT_LABELS[event.type] ?? event.type}
                </span>
                <span className="dt-item__actor" style={{ color }}>
                  {ACTOR_LABELS[event.actor] ?? event.actor}
                  {event.actor !== "system" && ` — ${event.actor_name}`}
                </span>
                <span className="dt-item__time">
                  {formatTime(event.timestamp)}
                </span>
                {event.internal && (
                  <span className="dt-item__internal-badge">Internal</span>
                )}
              </div>
              <p className="dt-item__content">{event.content}</p>
              {event.attachment_url && (
                <a
                  href={event.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dt-item__attachment"
                >
                  View attachment
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
