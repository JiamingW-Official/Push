"use client";

/* ============================================================
   <ConnectThreadRow> — Stage 4 (Connect) row.

   Compact merchant chat thread summary shown on Work funnel hub.
   One row per active campaign-scoped conversation.

   Displays:
     - Brand avatar + name + campaign
     - Last message snippet
     - Last reply timestamp ("2h ago" / "3d ago")
     - STUCK badge if merchant silent >3d (channels into NUDGE CTA)
     - Unread dot if new merchant message
   ============================================================ */

import Link from "next/link";
import { Hourglass, Bell } from "lucide-react";

export interface ConnectThread {
  id: string;
  /** Campaign id used to scope inbox query: ?campaign={campaignId} */
  campaignId: string;
  brand: string;
  brandInitial: string;
  campaign: string;
  lastMessage: string;
  lastReplyAt: string; // human "2h ago" / "5d ago"
  /** True if merchant is the one who's last to respond — creator's turn */
  awaitingCreator?: boolean;
  /** True if creator is waiting on merchant >3d */
  stuck?: boolean;
  daysSinceLastReply?: number;
  unread?: boolean;
}

interface Props {
  thread: ConnectThread;
}

export function ConnectThreadRow({ thread }: Props) {
  return (
    <Link
      href={`/creator/inbox?campaign=${encodeURIComponent(thread.campaignId)}`}
      className={[
        "ctr",
        thread.stuck ? "ctr--stuck" : "",
        thread.awaitingCreator ? "ctr--awaiting" : "",
        thread.unread ? "ctr--unread" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="ctr__avatar">
        {thread.brandInitial}
        {thread.unread && <span className="ctr__unread-dot" aria-hidden />}
      </span>
      <div className="ctr__body">
        <div className="ctr__line1">
          <span className="ctr__brand">{thread.brand}</span>
          <span className="ctr__when">{thread.lastReplyAt}</span>
        </div>
        <p className="ctr__campaign">{thread.campaign}</p>
        <p className="ctr__msg">{thread.lastMessage}</p>
      </div>
      {thread.stuck ? (
        <span className="ctr__action ctr__action--nudge">
          <Hourglass size={12} strokeWidth={2.5} />
          Nudge
          {thread.daysSinceLastReply && (
            <span className="ctr__action-meta">
              {thread.daysSinceLastReply}d
            </span>
          )}
        </span>
      ) : thread.awaitingCreator ? (
        <span className="ctr__action ctr__action--reply">
          <Bell size={12} strokeWidth={2.5} />
          Reply
        </span>
      ) : (
        <span className="ctr__action ctr__action--quiet">→</span>
      )}
    </Link>
  );
}
