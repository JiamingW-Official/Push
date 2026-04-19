"use client";

import type { InboxItem } from "@/lib/creator/api/inbox";
import { formatCountdown, isUrgent } from "@/lib/creator/api/inbox";
import "./InviteRow.css";

interface InviteRowProps {
  item: InboxItem;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onClick: (item: InboxItem) => void;
}

export default function InviteRow({
  item,
  onAccept,
  onDecline,
  onClick,
}: InviteRowProps) {
  const urgent = isUrgent(item.expiresAt);
  const countdown = item.expiresAt ? formatCountdown(item.expiresAt) : null;

  return (
    <div
      className={`invite-row${item.read ? "" : " invite-row--unread"}${urgent ? " invite-row--urgent" : ""}`}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(item)}
    >
      <div className="invite-row__status-bar" aria-hidden="true" />
      <div className="invite-row__avatar">{item.merchantName?.[0] ?? "?"}</div>
      <div className="invite-row__content">
        <span className="invite-row__merchant">{item.merchantName}</span>
        <span className="invite-row__campaign">{item.campaignTitle}</span>
      </div>
      <div className="invite-row__meta">
        {item.payout && (
          <span className="invite-row__payout">${item.payout}</span>
        )}
        {countdown && (
          <span
            className={`invite-row__countdown${urgent ? " invite-row__countdown--urgent" : ""}`}
          >
            {countdown}
          </span>
        )}
        <div className="invite-row__actions">
          <button
            className="invite-row__btn invite-row__btn--accept"
            onClick={(e) => {
              e.stopPropagation();
              onAccept(item.id);
            }}
          >
            Accept
          </button>
          <button
            className="invite-row__btn invite-row__btn--decline"
            onClick={(e) => {
              e.stopPropagation();
              onDecline(item.id);
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
