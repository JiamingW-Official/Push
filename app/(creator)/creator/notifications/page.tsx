"use client";

import Link from "next/link";
import {
  useNotifications,
  groupNotifications,
  timeAgo,
} from "@/lib/notifications/useNotifications";
import "./notifications.css";

export default function CreatorNotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllRead, hydrated } =
    useNotifications("creator");

  const groups = groupNotifications(
    [...notifications].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  if (!hydrated) {
    return (
      <div className="notif-page">
        <header className="notif-nav">
          <Link href="/creator/dashboard" className="notif-nav-back">
            ← Dashboard
          </Link>
          <span className="notif-nav-title">Inbox</span>
        </header>
      </div>
    );
  }

  return (
    <div className="notif-page">
      {/* Nav */}
      <header className="notif-nav">
        <Link href="/creator/dashboard" className="notif-nav-back">
          ← Dashboard
        </Link>
        <span className="notif-nav-title">Inbox.</span>
        {unreadCount > 0 && (
          <button className="notif-mark-all" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </header>

      {/* Hero */}
      <section className="notif-hero">
        <h1 className="notif-hero-headline">
          {unreadCount > 0 ? (
            <>
              <span className="notif-hero-count">{unreadCount}</span>{" "}
              <span className="notif-hero-light">unread.</span>
            </>
          ) : (
            <span className="notif-hero-light">All caught up.</span>
          )}
        </h1>
        <p className="notif-hero-sub">
          {notifications.length} notification
          {notifications.length !== 1 ? "s" : ""} total
        </p>
      </section>

      {/* Groups */}
      <main className="notif-main">
        {groups.length === 0 ? (
          <div className="notif-empty">
            <p className="notif-empty-title">Nothing here yet.</p>
            <p className="notif-empty-body">
              When campaigns update or payments arrive, they appear here.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <section key={group.label} className="notif-group">
              <div className="notif-group-label">{group.label}</div>
              <div className="notif-list">
                {group.items.map((n) => (
                  <Link
                    key={n.id}
                    href={n.href}
                    className={`notif-item${n.read ? " notif-item--read" : ""}`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className="notif-item-avatar">{n.title.charAt(0)}</div>
                    <div className="notif-item-body">
                      <div className="notif-item-header">
                        <span className="notif-item-title">{n.title}</span>
                        <span className="notif-item-time">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="notif-item-text">{n.body}</p>
                    </div>
                    {!n.read && <span className="notif-unread-dot" />}
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
