"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import InviteRow from "@/components/creator/inbox/InviteRow";
import {
  getInboxItems,
  respondToInvite,
  type InboxFilter,
  type InboxItem,
} from "@/lib/creator/api/inbox";
import "./inbox.css";

const FILTERS: { key: InboxFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "invites", label: "Invites" },
  { key: "messages", label: "Messages" },
  { key: "system", label: "System" },
];

export default function InboxPage() {
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<InboxItem | null>(null);

  useEffect(() => {
    setLoading(true);
    getInboxItems(filter).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [filter]);

  async function handleAccept(id: string) {
    await respondToInvite(id, "accept");
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleDecline(id: string) {
    await respondToInvite(id, "decline");
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const inviteItems = items.filter((i) => i.type === "invite");
  const otherItems = items.filter((i) => i.type !== "invite");

  return (
    <div className="inbox-page">
      <div className="inbox-header">
        <h1 className="inbox-title">Inbox</h1>
        <nav className="inbox-filters" aria-label="Inbox filter">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`inbox-filter-btn${filter === f.key ? " inbox-filter-btn--active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="inbox-list">
        {loading && (
          <div className="inbox-skeleton">
            {[1, 2, 3].map((n) => (
              <div key={n} className="inbox-skeleton-row" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="inbox-empty">
            <p className="inbox-empty__title">Clear inbox.</p>
            <p className="inbox-empty__body">
              Agent&apos;s still matching — new invite typically lands within
              4h.
            </p>
            <Link href="/creator/discover" className="inbox-empty__link">
              Browse Discover →
            </Link>
          </div>
        )}

        {!loading &&
          inviteItems.map((item) => (
            <InviteRow
              key={item.id}
              item={item}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onClick={setSelected}
            />
          ))}

        {!loading &&
          otherItems.map((item) => (
            <div
              key={item.id}
              className={`inbox-row${item.read ? "" : " inbox-row--unread"}`}
              onClick={() => setSelected(item)}
              role="button"
              tabIndex={0}
            >
              <div className="inbox-row__status-bar" />
              <div className="inbox-row__icon">
                {item.type === "system" ? "◈" : "✉"}
              </div>
              <div className="inbox-row__content">
                <span className="inbox-row__title">
                  {item.systemTitle ?? item.senderName}
                </span>
                <span className="inbox-row__body">
                  {item.systemBody ?? item.messagePreview}
                </span>
              </div>
              {item.unreadCount != null && item.unreadCount > 0 && (
                <span className="inbox-row__badge">{item.unreadCount}</span>
              )}
            </div>
          ))}
      </div>

      {/* suppress unused variable warning until detail panel is wired */}
      {selected && null}
    </div>
  );
}
