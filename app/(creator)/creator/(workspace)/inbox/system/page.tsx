"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useNotifications,
  timeAgo,
  type AppNotification as Notification,
} from "@/lib/notifications/useNotifications";
import "../inbox.css";

/* ── Category config ─────────────────────────────────────────── */

type Category = "all" | "payments" | "campaigns" | "platform" | "alerts";

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "" },
  { id: "payments", label: "Payments", icon: "💳" },
  { id: "campaigns", label: "Campaign Updates", icon: "📣" },
  { id: "platform", label: "Platform", icon: "⚡" },
  { id: "alerts", label: "Alerts", icon: "🔔" },
];

const EMPTY_MESSAGES: Record<Category, { title: string; body: string }> = {
  all: {
    title: "Nothing here yet.",
    body: "When campaigns update or payments arrive, they appear here.",
  },
  payments: {
    title: "No payment notifications.",
    body: "Completed campaign payouts and wallet updates show here.",
  },
  campaigns: {
    title: "No campaign updates.",
    body: "Application decisions, deadline reminders, and milestone updates show here.",
  },
  platform: {
    title: "No platform updates.",
    body: "Score changes, tier upgrades, and Push news show here.",
  },
  alerts: {
    title: "No alerts.",
    body: "Urgent notices and action-required items show here.",
  },
};

/* ── Extended notification type with category ───────────────── */

type SystemNotif = Notification & {
  category: Category;
  priority?: boolean;
  /** Legacy role field on seeded rows — ignored by render but kept so
   *  the seed literal at line 57 remains valid. */
  role?: string;
};

/* ── Seed with categories ────────────────────────────────────── */

const EXTENDED_NOTIFICATIONS: SystemNotif[] = [
  {
    id: "sys-c-001",
    role: "creator",
    title: "Payment received",
    body: "$120.00 payout from Brow Theory campaign processed.",
    href: "/creator/wallet",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "payments",
    priority: true,
  },
  {
    id: "sys-c-002",
    role: "creator",
    title: "Application accepted",
    body: "Your application to Roberta's Summer campaign was accepted.",
    href: "/creator/dashboard",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "campaigns",
  },
  {
    id: "sys-c-003",
    role: "creator",
    title: "Deadline in 3 days",
    body: "Flamingo Estate shoot deadline is Friday 5pm.",
    href: "/creator/campaigns",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "alerts",
    priority: false,
  },
  {
    id: "sys-c-004",
    role: "creator",
    title: "Push Score updated",
    body: "Your Push Score increased by 3 points — now 87.",
    href: "/creator/profile",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "platform",
  },
  {
    id: "sys-c-005",
    role: "creator",
    title: "New campaign match",
    body: "Fort Greene Coffee matches your profile — $55 base payout.",
    href: "/creator/dashboard",
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "campaigns",
  },
  {
    id: "sys-c-006",
    role: "creator",
    title: "Wallet withdrawal processed",
    body: "$240 transferred to your bank account ending 4521.",
    href: "/creator/wallet",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "payments",
    priority: true,
  },
  {
    id: "sys-c-007",
    role: "creator",
    title: "Campaign completed",
    body: "Brow Theory Spring campaign marked complete. Great work!",
    href: "/creator/campaigns",
    createdAt: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000,
    ).toISOString(),
    read: true,
    category: "campaigns",
  },
  {
    id: "sys-c-008",
    role: "creator",
    title: "Tier upgrade available",
    body: "You're 2 campaigns away from Operator tier — higher payouts unlock.",
    href: "/creator/profile",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "platform",
  },
  {
    id: "sys-c-009",
    role: "creator",
    title: "Content flagged for review",
    body: "Your post for Fort Greene was flagged for minor compliance check.",
    href: "/creator/campaigns",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "alerts",
  },
];

/* ── Category icons for items ───────────────────────────────── */

const CATEGORY_ICONS: Record<Category, string> = {
  all: "●",
  payments: "💳",
  campaigns: "📣",
  platform: "⚡",
  alerts: "🔔",
};

/* ── Date grouping ───────────────────────────────────────────── */

type DateGroup = { label: string; items: SystemNotif[] };

function groupByDate(notifications: SystemNotif[]): DateGroup[] {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const today: SystemNotif[] = [];
  const yesterday: SystemNotif[] = [];
  const earlier: SystemNotif[] = [];

  for (const n of notifications) {
    const age = now - new Date(n.createdAt).getTime();
    if (age < oneDayMs) today.push(n);
    else if (age < 2 * oneDayMs) yesterday.push(n);
    else earlier.push(n);
  }

  const groups: DateGroup[] = [];
  if (today.length) groups.push({ label: "Today", items: today });
  if (yesterday.length) groups.push({ label: "Yesterday", items: yesterday });
  if (earlier.length) groups.push({ label: "Earlier", items: earlier });
  return groups;
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function SystemPage() {
  const pathname = usePathname();
  const { markAllRead } = useNotifications("creator");

  const [notifications, setNotifications] = useState<SystemNotif[]>(
    EXTENDED_NOTIFICATIONS,
  );
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllSystemRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllRead();
  }, [markAllRead]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return notifications;
    return notifications.filter((n) => n.category === activeCategory);
  }, [notifications, activeCategory]);

  const groups = useMemo(() => {
    const sorted = [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    // Payments with priority: float to top of their date group
    return groupByDate(sorted).map((g) => ({
      ...g,
      items: [
        ...g.items.filter((n) => n.priority && !n.read),
        ...g.items.filter((n) => !(n.priority && !n.read)),
      ],
    }));
  }, [filtered]);

  // Count unread per category
  const countFor = useCallback(
    (cat: Category) => {
      const src =
        cat === "all"
          ? notifications
          : notifications.filter((n) => n.category === cat);
      return src.filter((n) => !n.read).length;
    },
    [notifications],
  );

  const totalUnread = countFor("all");
  const unreadMessages = 2;
  const pendingInvites = 3;

  return (
    <div className="system-page">
      {/* Top nav */}
      <header className="inbox-nav">
        <Link href="/creator/dashboard" className="inbox-nav-back">
          ← Dashboard
        </Link>
        <span className="inbox-nav-title">Inbox.</span>
        <div className="inbox-live-indicator">
          <span className="inbox-live-dot" />
          <span className="inbox-live-label">Live</span>
        </div>
      </header>

      {/* Section tabs */}
      <nav className="inbox-tabs">
        <Link
          href="/creator/inbox"
          className={`inbox-tab${!pathname?.endsWith("/invites") && !pathname?.endsWith("/system") ? " inbox-tab--active" : ""}`}
        >
          Messages
          {unreadMessages > 0 && (
            <span className="inbox-tab-badge">{unreadMessages}</span>
          )}
        </Link>
        <Link
          href="/creator/inbox/invites"
          className={`inbox-tab${pathname?.endsWith("/invites") ? " inbox-tab--active" : ""}`}
        >
          Invites
          {pendingInvites > 0 && (
            <span className="inbox-tab-badge">{pendingInvites}</span>
          )}
        </Link>
        <Link
          href="/creator/inbox/system"
          className={`inbox-tab${pathname?.endsWith("/system") ? " inbox-tab--active" : ""}`}
        >
          System
          {totalUnread > 0 && (
            <span className="inbox-tab-badge">{totalUnread}</span>
          )}
        </Link>
      </nav>

      {/* Category filters */}
      <div className="system-filters">
        {CATEGORIES.map((cat) => {
          const count = countFor(cat.id);
          return (
            <button
              key={cat.id}
              className={`system-filter-chip${activeCategory === cat.id ? " system-filter-chip--active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.label}
              {count > 0 && (
                <span className="system-filter-chip-count">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mark all read */}
      {totalUnread > 0 && (
        <div className="system-mark-bar">
          <button className="system-mark-all-btn" onClick={markAllSystemRead}>
            Mark all read
          </button>
        </div>
      )}

      {/* Notification list */}
      <div className="system-list">
        {groups.length === 0 ? (
          <div className="system-empty">
            <p className="system-empty-title">
              {EMPTY_MESSAGES[activeCategory].title}
            </p>
            <p className="system-empty-body">
              {EMPTY_MESSAGES[activeCategory].body}
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <div className="system-date-divider">{group.label}</div>
              {group.items.map((notif, idx) => (
                <Link
                  key={notif.id}
                  href={notif.href}
                  className={`system-item${notif.category === "payments" && notif.priority ? " system-item--payment" : ""}${notif.read ? " system-item--read" : ""}`}
                  onClick={() => markRead(notif.id)}
                  style={{ animationDelay: `${idx * 25}ms` }}
                >
                  <div className="system-item-icon">
                    {CATEGORY_ICONS[notif.category as Category]}
                  </div>
                  <div className="system-item-body">
                    <div className="system-item-header">
                      <span className="system-item-title">{notif.title}</span>
                      <span className="system-item-time">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="system-item-text">{notif.body}</p>
                  </div>
                  {!notif.read && <span className="system-item-unread-dot" />}
                </Link>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
