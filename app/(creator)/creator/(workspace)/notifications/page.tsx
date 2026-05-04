"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useNotifications,
  groupNotifications,
  timeAgo,
} from "@/lib/notifications/useNotifications";
import "./notifications.css";

/* ── Filter tabs — 4 product categories + All / Unread ─────── */

type FilterTab = "All" | "Unread" | "Tasks" | "Invites" | "Payouts" | "System";

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
      aria-hidden="true"
    >
      <rect x="2" y="5" width="16" height="12" rx="2" />
      <path d="M2 9h16" />
      <path d="M6 13h2" />
    </svg>
  );
}

function IconInvite() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 5h14v10H3z" />
      <path d="M3 5l7 5 7-5" />
    </svg>
  );
}

function IconTask() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <path d="M7 10l2 2 4-4" />
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
      aria-hidden="true"
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
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8" />
      <path d="M6.5 10.5l2.5 2.5 4.5-4.5" />
    </svg>
  );
}

/* ── Classification ───────────────────────────────────────── */

type NotifKind = "tasks" | "invites" | "payouts" | "system";

function notifKind(title: string, body: string): NotifKind {
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
    return "payouts";
  if (
    t.includes("accepted") ||
    t.includes("invite") ||
    t.includes("invitation") ||
    t.includes("match") ||
    b.includes("invited") ||
    b.includes("matches your profile")
  )
    return "invites";
  if (
    t.includes("deadline") ||
    t.includes("ending") ||
    t.includes("scan") ||
    t.includes("visit") ||
    b.includes("deadline") ||
    b.includes("days") ||
    b.includes("walk-in") ||
    b.includes("verified") ||
    b.includes("qr")
  )
    return "tasks";
  return "system";
}

function kindIcon(kind: NotifKind): React.ReactNode {
  switch (kind) {
    case "payouts":
      return <IconPayment />;
    case "invites":
      return <IconInvite />;
    case "tasks":
      return <IconTask />;
    default:
      return <IconAlert />;
  }
}

function kindLabel(kind: NotifKind): string {
  switch (kind) {
    case "payouts":
      return "Payout";
    case "invites":
      return "Invite";
    case "tasks":
      return "Task";
    default:
      return "System";
  }
}

function tabMatchesKind(tab: FilterTab, kind: NotifKind): boolean {
  if (tab === "Tasks") return kind === "tasks";
  if (tab === "Invites") return kind === "invites";
  if (tab === "Payouts") return kind === "payouts";
  if (tab === "System") return kind === "system";
  return false;
}

export default function CreatorNotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllRead, hydrated } =
    useNotifications("creator");

  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  // Sort once + filter per tab
  const filteredNotifications = useMemo(() => {
    return notifications
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .filter((n) => {
        if (activeTab === "All") return true;
        if (activeTab === "Unread") return !n.read;
        return tabMatchesKind(activeTab, notifKind(n.title, n.body));
      });
  }, [notifications, activeTab]);

  // Today summary — counts for the floating glass tile
  const todaySummary = useMemo(() => {
    const dayMs = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const today = notifications.filter(
      (n) => now - new Date(n.createdAt).getTime() < dayMs,
    );
    let invites = 0;
    let payouts = 0;
    let tasks = 0;
    for (const n of today) {
      const k = notifKind(n.title, n.body);
      if (k === "invites") invites++;
      else if (k === "payouts") payouts++;
      else if (k === "tasks") tasks++;
    }
    return { total: today.length, invites, payouts, tasks };
  }, [notifications]);

  const groups = groupNotifications(filteredNotifications);

  const tabs: FilterTab[] = [
    "All",
    "Unread",
    "Tasks",
    "Invites",
    "Payouts",
    "System",
  ];

  // Loading skeleton
  if (!hydrated) {
    return (
      <div className="cw-page notif-page">
        <div className="notif-skeleton" aria-busy="true" aria-live="polite">
          <div className="notif-skeleton-title" />
          <div className="notif-skeleton-summary" />
          {[1, 2, 3, 4].map((i) => (
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
            LINKS{unreadCount > 0 ? ` · ${unreadCount} UNREAD` : ""}
          </p>
          <h1 className="cw-title">Notifications</h1>
        </div>
        <div className="cw-header__right">
          {unreadCount > 0 && (
            <button
              type="button"
              className="cw-pill"
              onClick={markAllRead}
              aria-label={`Mark all ${unreadCount} unread notifications as read`}
            >
              Mark all read
            </button>
          )}
          <div
            className="cw-chip-row"
            role="tablist"
            aria-label="Filter notifications"
          >
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

      {/* Liquid-glass Today Summary tile — ≤1 floating glass per panel (Design v11) */}
      {todaySummary.total > 0 && activeTab === "All" && (
        <aside
          className="notif-summary-glass"
          aria-label={`Today summary — ${todaySummary.total} new`}
        >
          <div className="notif-summary-eyebrow">
            <span className="notif-summary-dot" aria-hidden="true" />
            (TODAY)
          </div>
          <div className="notif-summary-stats">
            <div className="notif-summary-stat">
              <span className="notif-summary-num">{todaySummary.total}</span>
              <span className="notif-summary-key">New</span>
            </div>
            {todaySummary.invites > 0 && (
              <div className="notif-summary-stat">
                <span className="notif-summary-num">
                  {todaySummary.invites}
                </span>
                <span className="notif-summary-key">Invites</span>
              </div>
            )}
            {todaySummary.payouts > 0 && (
              <div className="notif-summary-stat">
                <span className="notif-summary-num">
                  {todaySummary.payouts}
                </span>
                <span className="notif-summary-key">Payouts</span>
              </div>
            )}
            {todaySummary.tasks > 0 && (
              <div className="notif-summary-stat">
                <span className="notif-summary-num">{todaySummary.tasks}</span>
                <span className="notif-summary-key">Tasks</span>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Notification list */}
      <main className="notif-main">
        {groups.length === 0 ? (
          <div className="notif-empty" role="status">
            <div className="notif-empty-icon">
              <IconCheck />
            </div>
            <p className="notif-empty-title">
              {activeTab === "Unread" ? "Inbox zero" : "You're all caught up"}
            </p>
            <p className="notif-empty-body">
              {activeTab === "Unread"
                ? "No unread notifications. Switch to All to revisit recent activity."
                : "When campaigns update, payouts arrive, or scans are verified, they appear here."}
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
                <div className="notif-group-label">
                  <span>{group.label}</span>
                  <span className="notif-group-count">
                    ({group.items.length})
                  </span>
                </div>
                <div className="notif-list" role="list">
                  {group.items.map((n) => {
                    const kind = notifKind(n.title, n.body);
                    return (
                      <Link
                        key={n.id}
                        href={n.href}
                        role="listitem"
                        aria-label={`${kindLabel(kind)} — ${n.title}. ${n.body}. ${timeAgo(n.createdAt)}.${
                          n.read ? "" : " Unread."
                        }`}
                        className={
                          "notif-item" +
                          (n.read
                            ? " notif-item--read"
                            : " notif-item--unread") +
                          ` notif-item--${kind}`
                        }
                        onClick={() => markAsRead(n.id)}
                      >
                        <div className="notif-item-icon" aria-hidden="true">
                          {kindIcon(kind)}
                        </div>
                        <div className="notif-item-body">
                          <div className="notif-item-meta">
                            <span className="notif-item-kind">
                              {kindLabel(kind)}
                            </span>
                            <span
                              className="notif-item-meta-sep"
                              aria-hidden="true"
                            >
                              ·
                            </span>
                            <span className="notif-item-time">
                              {timeAgo(n.createdAt)}
                            </span>
                          </div>
                          <span className="notif-item-title">{n.title}</span>
                          <p className="notif-item-text">{n.body}</p>
                        </div>
                        {!n.read && (
                          <span
                            className="notif-unread-dot"
                            aria-label="Unread"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Load more */}
            <div className="notif-load-more-row">
              <button type="button" className="btn-ghost click-shift">
                Load more
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
