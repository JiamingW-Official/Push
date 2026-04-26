"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useNotifications,
  groupNotifications,
  timeAgo,
} from "@/lib/notifications/useNotifications";
import "./notifications.css";

type FilterTab = "All" | "Unread" | "Campaigns" | "Payments" | "System";

/* ── SVG icon helpers (replace emoji — product register) ─── */

function IconPayment() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="16" height="12" rx="2" />
      <path d="M2 9h16" />
      <path d="M6 13h2" />
    </svg>
  );
}

function IconLocation() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="8" r="3" />
      <path d="M10 2C6.69 2 4 4.69 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6z" />
    </svg>
  );
}

function IconPerson() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="6" r="3" />
      <path d="M3 17c0-3.87 3.13-7 7-7s7 3.13 7 7" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2L2 17h16L10 2z" />
      <path d="M10 9v4" />
      <circle cx="10" cy="15" r="0.5" fill="currentColor" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="10" r="8" />
      <path d="M6.5 10.5l2.5 2.5 4.5-4.5" />
    </svg>
  );
}

// Derive icon component from notification title/body
function notifIcon(title: string, body: string): React.ReactNode {
  const t = title.toLowerCase();
  const b = body.toLowerCase();
  if (
    t.includes("payout") ||
    t.includes("payment") ||
    t.includes("milestone") ||
    b.includes("payment") ||
    b.includes("paid") ||
    b.includes("pending")
  )
    return <IconPayment />;
  if (
    t.includes("scan") ||
    t.includes("visit") ||
    b.includes("verified") ||
    b.includes("walk-in") ||
    b.includes("qr")
  )
    return <IconLocation />;
  if (
    t.includes("accepted") ||
    t.includes("application") ||
    t.includes("tier") ||
    t.includes("score") ||
    b.includes("accepted") ||
    b.includes("level")
  )
    return <IconPerson />;
  if (
    t.includes("deadline") ||
    t.includes("ending") ||
    t.includes("alert") ||
    b.includes("deadline") ||
    b.includes("days")
  )
    return <IconAlert />;
  return <IconCheck />;
}

// Map notification to filter category
function notifCategory(
  title: string,
  body: string,
): Omit<FilterTab, "All" | "Unread"> {
  const t = title.toLowerCase();
  const b = body.toLowerCase();
  if (
    t.includes("payout") ||
    t.includes("payment") ||
    t.includes("milestone") ||
    b.includes("payment") ||
    b.includes("paid")
  )
    return "Payments";
  if (
    t.includes("accepted") ||
    t.includes("match") ||
    t.includes("campaign") ||
    t.includes("deadline") ||
    b.includes("campaign") ||
    b.includes("application")
  )
    return "Campaigns";
  return "System";
}

export default function CreatorNotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllRead, hydrated } =
    useNotifications("creator");

  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  // Filter notifications based on active tab
  const filteredNotifications = notifications
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .filter((n) => {
      if (activeTab === "All") return true;
      if (activeTab === "Unread") return !n.read;
      return notifCategory(n.title, n.body) === activeTab;
    });

  const groups = groupNotifications(filteredNotifications);

  const tabs: FilterTab[] = [
    "All",
    "Unread",
    "Campaigns",
    "Payments",
    "System",
  ];

  // Loading skeleton
  if (!hydrated) {
    return (
      <div className="cw-page notif-page">
        <div className="notif-skeleton">
          <div className="notif-skeleton-title" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="notif-skeleton-item" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cw-page notif-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">
            NOTIFICATIONS{unreadCount > 0 ? ` · ${unreadCount} UNREAD` : ""}
          </p>
          <h1 className="cw-title">Notifications</h1>
        </div>
        <div className="cw-header__right">
          {unreadCount > 0 && (
            <button type="button" className="cw-pill" onClick={markAllRead}>
              Mark all read
            </button>
          )}
          <div className="cw-chip-row" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={"cw-chip" + (activeTab === tab ? " is-active" : "")}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tab === "Unread" && unreadCount > 0 && ` · ${unreadCount}`}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Notification list */}
      <main className="notif-main">
        {groups.length === 0 ? (
          <div className="notif-empty">
            <div className="notif-empty-icon">
              <IconCheck />
            </div>
            <p className="notif-empty-title">You&apos;re all caught up</p>
            <p className="notif-empty-body">
              When campaigns update, payouts arrive, or scans are verified, they
              appear here.
            </p>
            <Link href="/creator/discover" className="btn-ghost click-shift">
              Explore campaigns
            </Link>
          </div>
        ) : (
          <>
            {groups.map((group) => (
              <section
                key={group.label}
                className="notif-group"
                aria-label={group.label}
              >
                <div className="notif-group-label">{group.label}</div>
                <div className="notif-list" role="list">
                  {group.items.map((n) => (
                    <Link
                      key={n.id}
                      href={n.href}
                      role="listitem"
                      className={`notif-item${n.read ? " notif-item--read" : " notif-item--unread"}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="notif-item-icon" aria-hidden="true">
                        {notifIcon(n.title, n.body)}
                      </div>
                      <div className="notif-item-body">
                        <div className="notif-item-header">
                          <span className="notif-item-title">{n.title}</span>
                          <span className="notif-item-time">
                            {timeAgo(n.createdAt)}
                          </span>
                        </div>
                        <p className="notif-item-text">{n.body}</p>
                      </div>
                      {!n.read && (
                        <span
                          className="notif-unread-dot"
                          aria-label="Unread"
                        />
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            ))}

            {/* Load more */}
            <div className="notif-load-more-row">
              <button className="btn-ghost click-shift">Load more</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
