"use client";

/* Repo target: components/creator/dashboard/widgets/InboxPeek.tsx
   3×2 — top 3 inbox threads with unread highlight. */

import Link from "next/link";
import { timeAgo } from "@/lib/creator/widget-helpers";
import type { InboxThread } from "../types";
import { ArrowUpRight } from "../CircleArrow";

export interface InboxPeekProps {
  threads: InboxThread[];
  className?: string;
}

export function InboxPeek({ threads, className = "" }: InboxPeekProps) {
  const unreadCount = threads.filter((t) => t.unread).length;

  return (
    <div className={`dh-card ${className}`.trim()}>
      <div className="dh-card__header">
        <span className="dh-card__eyebrow">
          INBOX{unreadCount > 0 ? ` · ${unreadCount} UNREAD` : ""}
        </span>
        <Link
          href="/creator/inbox"
          className="dh-circle-arrow"
          aria-label="Open inbox"
        >
          <ArrowUpRight />
        </Link>
      </div>

      <div className="dh-inbox">
        {threads.length === 0 ? (
          <p style={{ color: "var(--ink-4)", fontSize: 13, marginTop: 8 }}>
            No messages yet.
          </p>
        ) : (
          threads.slice(0, 3).map((t) => (
            <Link
              key={t.id}
              href={`/creator/inbox/${t.id}`}
              className={
                "dh-inbox__row" + (t.unread ? " dh-inbox__row--unread" : "")
              }
            >
              <span className="dh-inbox__avatar">{t.sender_initial}</span>
              <div className="dh-inbox__body">
                <div className="dh-inbox__top">{t.sender_name}</div>
                <div className="dh-inbox__preview">{t.preview}</div>
              </div>
              <span className="dh-inbox__time">{timeAgo(t.created_at)}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
