"use client";

/* Repo target: components/creator/dashboard/widgets/ActivityTimeline.tsx
   6×2 — merged feed of payouts + applications. */

import Link from "next/link";
import type { ActivityEntry } from "../types";

export interface ActivityTimelineProps {
  entries: ActivityEntry[];
  className?: string;
}

export function ActivityTimeline({ entries, className = "" }: ActivityTimelineProps) {
  return (
    <div className={`dh-card ${className}`.trim()}>
      <div className="dh-card__header">
        <span className="dh-card__eyebrow">ACTIVITY</span>
        <Link href="/creator/inbox" className="dh-card__view-all">
          FULL FEED →
        </Link>
      </div>

      <div className="dh-timeline">
        {entries.length === 0 ? (
          <p style={{ color: "var(--ink-4)", fontSize: 13, marginTop: 8 }}>
            No recent activity yet — apply to a campaign to start your feed.
          </p>
        ) : (
          entries.map((e) => (
            <div key={e.id} className="dh-timeline__item">
              <div className="dh-timeline__rail">
                <span className={`dh-timeline__dot ${dotClass(e.kind)}`} />
              </div>
              <div>
                <div className="dh-timeline__title">{e.title}</div>
                <div className="dh-timeline__meta">{e.meta}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function dotClass(kind: ActivityEntry["kind"]): string {
  switch (kind) {
    case "payout_settled":         return "dh-timeline__dot--success";
    case "proof_verified":         return "dh-timeline__dot--success";
    case "invite_received":        return "dh-timeline__dot--brand";
    case "awaiting_verification":  return "dh-timeline__dot--pending";
    default:                       return "";
  }
}
