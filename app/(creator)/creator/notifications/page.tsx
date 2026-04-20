"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useNotifications,
  timeAgo,
  type AppNotification as Notification,
} from "@/lib/notifications/useNotifications";
import "./notifications.css";

/* ── Types ──────────────────────────────────────────────── */

type NotifCategory = "ALL" | "CAMPAIGNS" | "PAYMENTS" | "SCORE" | "SYSTEM";

function inferCategory(n: Notification): Exclude<NotifCategory, "ALL"> {
  const t = n.title.toLowerCase();
  const b = n.body.toLowerCase();
  if (
    t.includes("campaign") ||
    t.includes("application") ||
    t.includes("match") ||
    t.includes("deadline") ||
    b.includes("campaign")
  )
    return "CAMPAIGNS";
  if (
    t.includes("payment") ||
    t.includes("milestone") ||
    b.includes("payment") ||
    b.includes("pending") ||
    b.includes("$")
  )
    return "PAYMENTS";
  if (t.includes("score") || b.includes("score") || b.includes("push score"))
    return "SCORE";
  return "SYSTEM";
}

const CATEGORY_COLORS: Record<Exclude<NotifCategory, "ALL">, string> = {
  CAMPAIGNS: "var(--primary)",
  PAYMENTS: "var(--champagne)",
  SCORE: "var(--dark)",
  SYSTEM: "var(--steel-blue)",
};

const CATEGORY_LABELS: Record<Exclude<NotifCategory, "ALL">, string> = {
  CAMPAIGNS: "Campaign",
  PAYMENTS: "Payment",
  SCORE: "Score",
  SYSTEM: "System",
};

/* ── Stats ──────────────────────────────────────────────── */

function computeStats(notifications: Notification[]) {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneWeekMs = 7 * oneDayMs;

  const today = notifications.filter(
    (n) => now - new Date(n.createdAt).getTime() < oneDayMs,
  );
  const thisWeek = notifications.filter(
    (n) => now - new Date(n.createdAt).getTime() < oneWeekMs,
  );

  let pendingPayments = 0;
  notifications.forEach((n) => {
    const match = n.body.match(/\$(\d+(\.\d+)?)/);
    if (match && inferCategory(n) === "PAYMENTS" && !n.read) {
      pendingPayments += parseFloat(match[1]);
    }
  });

  const scoreUpdates = thisWeek.filter(
    (n) => inferCategory(n) === "SCORE",
  ).length;

  return {
    todayCount: today.length,
    weekCount: thisWeek.length,
    pendingPayments,
    scoreUpdates,
    unreadToday: today.filter((n) => !n.read).length,
  };
}

const FILTERS: NotifCategory[] = [
  "ALL",
  "CAMPAIGNS",
  "PAYMENTS",
  "SCORE",
  "SYSTEM",
];

/* ── Main page ──────────────────────────────────────────── */

export default function CreatorNotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllRead, hydrated } =
    useNotifications("creator");

  const [activeFilter, setActiveFilter] = useState<NotifCategory>("ALL");

  const stats = useMemo(() => computeStats(notifications), [notifications]);

  const filtered = useMemo(() => {
    const sorted = [...notifications].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return activeFilter === "ALL"
      ? sorted
      : sorted.filter((n) => inferCategory(n) === activeFilter);
  }, [notifications, activeFilter]);

  /* Skeleton */
  if (!hydrated) {
    return (
      <div className="np-shell">
        <header className="np-topbar">
          <Link href="/creator/dashboard" className="np-back">
            ← Back
          </Link>
          <span className="np-topbar-title">Notifications.</span>
        </header>
        <div className="np-skeleton-hero">
          <div className="np-skel np-skel--lg" />
          <div className="np-skel np-skel--sm" style={{ marginTop: 16 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="np-shell">
      {/* Top bar */}
      <header className="np-topbar">
        <Link href="/creator/dashboard" className="np-back">
          ← Back to Workspace
        </Link>
        <span className="np-topbar-title">Notifications.</span>
        {unreadCount > 0 && (
          <button className="np-mark-all" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </header>

      <div className="np-body">
        {/* Main column */}
        <div className="np-main">
          {/* Hero */}
          <section className="np-hero">
            <div className="np-hero-left">
              <h1 className="np-hero-title">
                {unreadCount > 0 ? `${unreadCount} unread.` : "All caught up."}
              </h1>
              <p className="np-hero-sub">
                {notifications.length} notification
                {notifications.length !== 1 ? "s" : ""} total
              </p>
            </div>
            <div className="np-hero-right">
              <div className="np-stat-row">
                <span className="np-stat-label">Today</span>
                <span className="np-stat-val">{stats.todayCount}</span>
              </div>
              <div className="np-stat-row">
                <span className="np-stat-label">This week</span>
                <span className="np-stat-val">{stats.weekCount}</span>
              </div>
              <div className="np-stat-row">
                <span className="np-stat-label">Total</span>
                <span className="np-stat-val">{notifications.length}</span>
              </div>
            </div>
          </section>

          {/* Filters */}
          <div className="np-filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`np-filter-tab${activeFilter === f ? " np-filter-tab--active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="np-list">
            {filtered.length === 0 ? (
              <div className="np-empty">
                <div className="np-empty-title">All caught up.</div>
                <div className="np-empty-body">
                  Check back when campaigns update.
                </div>
              </div>
            ) : (
              filtered.map((n) => {
                const cat = inferCategory(n);
                return (
                  <Link
                    key={n.id}
                    href={n.href}
                    className={`np-item${n.read ? " np-item--read" : " np-item--unread"}`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <span
                      className="np-item-dot"
                      style={{ background: CATEGORY_COLORS[cat] }}
                      aria-label={cat}
                    />
                    <div className="np-item-content">
                      <div className="np-item-header">
                        <div className="np-item-title-row">
                          <span className="np-item-cat-label">
                            {CATEGORY_LABELS[cat]}
                          </span>
                          <span className="np-item-title">{n.title}</span>
                        </div>
                        <span className="np-item-time">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="np-item-body">{n.body}</p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Right panel */}
        <aside className="np-panel">
          <div className="np-panel-block">
            <div className="np-panel-eyebrow">Notification Stats</div>
            <div className="np-panel-stat">
              <span className="np-panel-stat-num">{stats.unreadToday}</span>
              <span className="np-panel-stat-desc">unread today</span>
            </div>
            {stats.pendingPayments > 0 && (
              <div className="np-panel-stat">
                <span className="np-panel-stat-num np-panel-stat-num--gold">
                  ${stats.pendingPayments.toFixed(0)}
                </span>
                <span className="np-panel-stat-desc">in pending payments</span>
              </div>
            )}
            <div className="np-panel-stat">
              <span className="np-panel-stat-num">{stats.scoreUpdates}</span>
              <span className="np-panel-stat-desc">
                score updates this week
              </span>
            </div>
          </div>

          <div className="np-panel-divider" />

          <div className="np-panel-block">
            <div className="np-panel-eyebrow">Quick Actions</div>
            <Link href="/creator/campaigns" className="np-quick-action">
              View all campaigns →
            </Link>
            <Link href="/creator/earnings" className="np-quick-action">
              Check earnings →
            </Link>
          </div>

          <div className="np-panel-divider" />

          <div className="np-panel-block">
            <div className="np-panel-eyebrow">Key</div>
            {(
              Object.keys(CATEGORY_COLORS) as Exclude<NotifCategory, "ALL">[]
            ).map((cat) => (
              <div key={cat} className="np-legend-row">
                <span
                  className="np-legend-dot"
                  style={{ background: CATEGORY_COLORS[cat] }}
                />
                <span className="np-legend-label">{CATEGORY_LABELS[cat]}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
