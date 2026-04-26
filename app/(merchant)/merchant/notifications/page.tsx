"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useNotifications,
  groupNotifications,
  timeAgo,
} from "@/lib/notifications/useNotifications";
// Reuse the creator notifications stylesheet
import "@/app/(creator)/creator/(workspace)/notifications/notifications.css";

type FilterTab = "All" | "Unread" | "Campaigns" | "Payments" | "System";

// Derive icon from notification title/body for merchant context
function notifIcon(title: string, body: string): string {
  const t = title.toLowerCase();
  const b = body.toLowerCase();
  if (
    t.includes("applicant") ||
    t.includes("creator") ||
    t.includes("content") ||
    b.includes("applicant") ||
    b.includes("published")
  )
    return "👤";
  if (
    t.includes("conversion") ||
    t.includes("walk-in") ||
    t.includes("verified") ||
    b.includes("walk-in") ||
    b.includes("qr") ||
    b.includes("verified")
  )
    return "📍";
  if (
    t.includes("budget") ||
    t.includes("payout") ||
    t.includes("payment") ||
    b.includes("budget") ||
    b.includes("%") ||
    b.includes("payment")
  )
    return "💰";
  if (
    t.includes("ended") ||
    t.includes("alert") ||
    t.includes("limit") ||
    b.includes("ended") ||
    b.includes("allows") ||
    b.includes("used")
  )
    return "⚠️";
  return "✅";
}

// Map notification to filter category
function notifCategory(
  title: string,
  body: string,
): Omit<FilterTab, "All" | "Unread"> {
  const t = title.toLowerCase();
  const b = body.toLowerCase();
  if (
    t.includes("budget") ||
    t.includes("payout") ||
    t.includes("payment") ||
    b.includes("budget") ||
    b.includes("payment")
  )
    return "Payments";
  if (
    t.includes("applicant") ||
    t.includes("campaign") ||
    t.includes("ended") ||
    t.includes("conversion") ||
    b.includes("campaign") ||
    b.includes("applicant")
  )
    return "Campaigns";
  return "System";
}

export default function MerchantNotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllRead, hydrated } =
    useNotifications("merchant");

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
      <div className="notif-page">
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
    <div className="notif-page">
      {/* Page header */}
      <div className="notif-header">
        <Link href="/merchant/dashboard" className="notif-back">
          ← Dashboard
        </Link>
        <div className="notif-title-row">
          <h1 className="notif-title">Notifications</h1>
          {unreadCount > 0 && (
            <span className="notif-unread-badge">{unreadCount} unread</span>
          )}
        </div>
      </div>

      {/* Filter tabs + mark all */}
      <div className="notif-tabs-row">
        <div className="notif-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`notif-tab${activeTab === tab ? " notif-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            className="notif-mark-all-btn click-shift"
            onClick={markAllRead}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <main className="notif-main">
        {groups.length === 0 ? (
          <div className="notif-empty">
            <div className="notif-empty-icon">✅</div>
            <p className="notif-empty-title">You&apos;re all caught up</p>
            <p className="notif-empty-body">
              Applicant updates, budget alerts, and conversion reports appear
              here.
            </p>
            <Link href="/merchant/campaigns" className="btn-ghost click-shift">
              View campaigns
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
                      className={`notif-item click-shift${n.read ? " notif-item--read" : " notif-item--unread"}`}
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
