"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useNotifications,
  timeAgo,
  type Notification,
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
  /** Legacy seed-only field kept for backward compatibility with the
   *  earlier notification shape; not consumed by the current render. */
  type?: string;
  icon?: string;
};

/* ── Seed with categories ────────────────────────────────────── */

const EXTENDED_NOTIFICATIONS: SystemNotif[] = [
  {
    id: "sys-c-001",
    role: "creator",
    type: "system",
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
    type: "system",
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
    type: "system",
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
    type: "system",
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
    type: "system",
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
    type: "system",
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
    type: "system",
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
    type: "system",
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
    type: "system",
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
    <div
      style={{
        background: "var(--surface)",
        minHeight: "100%",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Top nav */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 24px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
        }}
      >
        <Link
          href="/creator/dashboard"
          className="click-shift"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-3)",
            textDecoration: "none",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          ← Dashboard
        </Link>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 20,
            color: "var(--ink)",
          }}
        >
          Inbox
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink-3)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Live
          </span>
        </div>
      </header>

      {/* Section tabs */}
      <nav
        style={{
          display: "flex",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
          padding: "0 24px",
        }}
      >
        {[
          { href: "/creator/inbox", label: "Messages", badge: unreadMessages },
          {
            href: "/creator/inbox/invites",
            label: "Invites",
            badge: pendingInvites,
          },
          {
            href: "/creator/inbox/system",
            label: "System",
            badge: totalUnread,
          },
        ].map(({ href, label, badge }) => {
          const isActive =
            label === "System"
              ? pathname?.endsWith("/system")
              : label === "Invites"
                ? pathname?.endsWith("/invites")
                : !pathname?.endsWith("/invites") &&
                  !pathname?.endsWith("/system");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "14px 16px",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? "var(--ink)" : "var(--ink-3)",
                textDecoration: "none",
                borderBottom: isActive
                  ? "2px solid var(--brand-red)"
                  : "2px solid transparent",
                marginBottom: -1,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {label}
              {badge > 0 && (
                <span
                  style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    background: "var(--brand-red)",
                    color: "var(--snow)",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                  }}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Category filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          padding: "16px 24px 8px",
        }}
      >
        {CATEGORIES.map((cat) => {
          const count = countFor(cat.id);
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid var(--hairline)",
                background: isActive ? "var(--ink)" : "var(--surface-2)",
                color: isActive ? "var(--snow)" : "var(--ink-3)",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.label}
              {count > 0 && (
                <span
                  style={{
                    background: isActive
                      ? "rgba(255,255,255,0.25)"
                      : "var(--brand-red)",
                    color: "var(--snow)",
                    borderRadius: 8,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "1px 5px",
                    minWidth: 16,
                    textAlign: "center",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mark all read */}
      {totalUnread > 0 && (
        <div
          style={{
            padding: "8px 24px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="btn-ghost click-shift"
            onClick={markAllSystemRead}
            style={{ fontSize: 12 }}
          >
            Mark all read
          </button>
        </div>
      )}

      {/* Notification list */}
      <div style={{ padding: "0 24px 24px" }}>
        {groups.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--ink)",
                margin: "0 0 8px",
              }}
            >
              {EMPTY_MESSAGES[activeCategory].title}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-3)",
                margin: 0,
              }}
            >
              {EMPTY_MESSAGES[activeCategory].body}
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              {/* Date divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 0 8px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    flexShrink: 0,
                  }}
                >
                  {group.label}
                </span>
                <div
                  style={{ flex: 1, height: 1, background: "var(--hairline)" }}
                />
              </div>

              {group.items.map((notif, idx) => (
                <Link
                  key={notif.id}
                  href={notif.href}
                  onClick={() => markRead(notif.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "14px 16px",
                    borderRadius: 10,
                    border: "1px solid var(--hairline)",
                    background: notif.read ? "var(--surface)" : "var(--snow)",
                    marginBottom: 8,
                    textDecoration: "none",
                    opacity: notif.read ? 0.75 : 1,
                    animationDelay: `${idx * 25}ms`,
                    borderLeft: !notif.read
                      ? notif.category === "payments" && notif.priority
                        ? "3px solid var(--accent-blue)"
                        : "3px solid var(--brand-red)"
                      : "3px solid transparent",
                  }}
                >
                  {/* Icon tile */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "var(--surface-2)",
                      border: "1px solid var(--hairline)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {CATEGORY_ICONS[notif.category as Category]}
                  </div>

                  {/* Body */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: notif.read ? 400 : 700,
                          fontSize: 14,
                          color: "var(--ink)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {notif.title}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink-4)",
                          flexShrink: 0,
                        }}
                      >
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--ink-3)",
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {notif.body}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notif.read && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--brand-red)",
                        flexShrink: 0,
                        marginTop: 6,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
