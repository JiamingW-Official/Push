"use client";

import { useEffect, useRef } from "react";
import type { DisputeEvent } from "@/lib/disputes/types";
import {
  eventBorderClass,
  eventTypeLabel,
  formatDate,
} from "@/lib/disputes/utils";

interface DisputeTimelineProps {
  events: DisputeEvent[];
}

export function DisputeTimeline({ events }: DisputeTimelineProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Fade-up entrance on scroll
  useEffect(() => {
    const els = listRef.current?.querySelectorAll(".dispute-timeline-event");
    if (!els?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    // Stagger with small delay per event
    els.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 60}ms`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [events]);

  return (
    <div className="dispute-timeline" ref={listRef}>
      {events.map((event) => {
        const borderCls = eventBorderClass(event.authorRole, event.type);
        const isDecision = event.type === "admin_decision";

        return (
          <div key={event.id} className={`dispute-timeline-event ${borderCls}`}>
            <div className="dispute-timeline-event__header">
              <div className="dispute-timeline-event__author">
                <span
                  className={`dispute-timeline-event__role-pill dispute-timeline-event__role-pill--${event.authorRole}`}
                >
                  {event.authorRole}
                </span>
                <span className="dispute-timeline-event__author-name">
                  {event.authorName}
                </span>
              </div>
              <span className="dispute-timeline-event__time">
                {formatDate(event.createdAt)}
              </span>
            </div>

            {/* Type label — shown for system events */}
            {event.type !== "creator_response" &&
              event.type !== "merchant_response" &&
              event.type !== "filed" && (
                <p className="dispute-timeline-event__type-label">
                  {eventTypeLabel(event.type)}
                </p>
              )}

            <p
              className="dispute-timeline-event__message"
              style={isDecision ? { fontWeight: 600 } : undefined}
            >
              {event.message}
            </p>

            {/* Evidence thumbnails */}
            {event.evidence && event.evidence.length > 0 && (
              <div className="dispute-timeline-evidence">
                {event.evidence.map((ev) => (
                  <a
                    key={ev.id}
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dispute-evidence-thumb"
                    title={ev.label}
                  >
                    {ev.type === "image" ? (
                      <img
                        src={ev.url}
                        alt={ev.label}
                        className="dispute-evidence-thumb__img"
                      />
                    ) : (
                      <span style={{ fontSize: "20px" }}>🔗</span>
                    )}
                    <span className="dispute-evidence-thumb__label">
                      {ev.label}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
