"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  useNotifications,
  timeAgo,
  type Notification,
} from "@/lib/notifications/useNotifications";
import "../inbox.css";
import "./system.css";

/* ── Category config — product UI canonical labels ────────────── */

type Category = "all" | "payments" | "campaigns" | "platform" | "alerts";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "payments", label: "Payments" },
  { id: "campaigns", label: "Campaigns" },
  { id: "platform", label: "Platform" },
  { id: "alerts", label: "Alerts" },
];

const EMPTY_MESSAGES: Record<Category, { title: string; body: string }> = {
  all: {
    title: "No notifications.",
    body: "Payouts, campaign updates, and platform notices land here.",
  },
  payments: {
    title: "No payment activity.",
    body: "Wallet credits and bank transfers will appear here.",
  },
  campaigns: {
    title: "No campaign updates.",
    body: "Application decisions and deadline reminders will appear here.",
  },
  platform: {
    title: "No platform updates.",
    body: "Score changes, tier moves, and product news will appear here.",
  },
  alerts: {
    title: "No alerts.",
    body: "Action-required notices and compliance flags will appear here.",
  },
};

/* ── Extended notification type ─────────────────────────────── */

type SystemNotif = Notification & {
  category: Category;
  priority?: boolean;
  role?: string;
  type?: string;
};

/* ── Seed data ───────────────────────────────────────────────── */

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

/* ── Category icon SVGs — single icon family, 18px stroke 1.6 ──
   Using Lucide-style stroke icons for product UI register.   */

type IconProps = { className?: string };

const PaymentsIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M3 10h18" />
    <path d="M7 15h3" />
  </svg>
);

const CampaignsIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PlatformIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 3l2.4 5.4L20 9.5l-4 4 1 5.5-5-2.8-5 2.8 1-5.5-4-4 5.6-1.1z" />
  </svg>
);

const AlertsIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
    <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
  </svg>
);

const DefaultIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const ChevronIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const CategoryIcon = ({
  cat,
  className,
}: {
  cat: Category;
  className?: string;
}) => {
  switch (cat) {
    case "payments":
      return <PaymentsIcon className={className} />;
    case "campaigns":
      return <CampaignsIcon className={className} />;
    case "platform":
      return <PlatformIcon className={className} />;
    case "alerts":
      return <AlertsIcon className={className} />;
    default:
      return <DefaultIcon className={className} />;
  }
};

/* Category badge label — short product UI tag shown next to title */
const BADGE_LABEL: Record<Category, string> = {
  all: "Update",
  payments: "Payment",
  campaigns: "Campaign",
  platform: "Platform",
  alerts: "Alert",
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
  if (today.length) groups.push({ label: "TODAY", items: today });
  if (yesterday.length) groups.push({ label: "YESTERDAY", items: yesterday });
  if (earlier.length) groups.push({ label: "EARLIER", items: earlier });
  return groups;
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function SystemPage() {
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
    return groupByDate(sorted).map((g) => ({
      ...g,
      items: [
        ...g.items.filter((n) => n.priority && !n.read),
        ...g.items.filter((n) => !(n.priority && !n.read)),
      ],
    }));
  }, [filtered]);

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

  return (
    <div className="ib-content">
      {/* Eyebrow + action bar */}
      <div className="ib-sys-bar">
        <span className="ib-sys-eyebrow">
          LINKS
          <span className="ib-sys-eyebrow-sep" aria-hidden>
            ·
          </span>
          <span className="ib-sys-eyebrow-state">
            {totalUnread > 0 ? `${totalUnread} UNREAD` : "ALL CAUGHT UP"}
          </span>
        </span>
        {totalUnread > 0 && (
          <button
            type="button"
            className="ib-mark-all-btn"
            onClick={markAllSystemRead}
            aria-label="Mark all notifications as read"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Category filter chips */}
      <div
        className="ib-filter-row"
        role="group"
        aria-label="Filter notifications by category"
      >
        {CATEGORIES.map((cat) => {
          const count = countFor(cat.id);
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={isActive}
              className={`ib-chip${isActive ? " ib-chip--active" : ""}`}
            >
              {cat.label}
              {count > 0 && <span className="ib-chip-count"> · {count}</span>}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div className="ib-sys-list">
        {groups.length === 0 ? (
          <div className="ib-empty">
            <p className="ib-empty-title">
              {EMPTY_MESSAGES[activeCategory].title}
            </p>
            <p className="ib-empty-body">
              {EMPTY_MESSAGES[activeCategory].body}
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="ib-group">
              <div className="ib-group-label">
                <span>{group.label}</span>
                <span className="ib-group-line" aria-hidden />
              </div>

              {group.items.map((notif) => {
                const cat = notif.category as Category;
                const rowClass = [
                  "ib-sys-row",
                  `ib-sys-row--${cat}`,
                  !notif.read ? "ib-sys-row--unread" : "",
                  notif.priority && !notif.read ? "ib-sys-row--priority" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                const inner = (
                  <>
                    {/* Icon tile */}
                    <span
                      className={`ib-sys-icon ib-sys-icon--${cat}`}
                      aria-hidden
                    >
                      <CategoryIcon cat={cat} className="ib-sys-icon-svg" />
                    </span>

                    {/* Body */}
                    <span className="ib-sys-body">
                      <span className="ib-sys-meta-row">
                        <span className={`ib-sys-badge ib-sys-badge--${cat}`}>
                          {BADGE_LABEL[cat]}
                        </span>
                        <span className="ib-sys-time">
                          {timeAgo(notif.createdAt)}
                        </span>
                        {notif.priority && !notif.read && (
                          <span
                            className="ib-sys-priority-tag"
                            aria-label="Priority notification"
                          >
                            Priority
                          </span>
                        )}
                      </span>

                      <span
                        className={`ib-sys-title${
                          !notif.read ? " ib-sys-title--bold" : ""
                        }`}
                      >
                        {notif.title}
                      </span>
                      <span className="ib-sys-text">{notif.body}</span>
                    </span>

                    {/* Right: unread dot OR chevron when linkable */}
                    <span className="ib-sys-right">
                      {!notif.read ? (
                        <span
                          className="ib-sys-dot"
                          aria-label="Unread notification"
                        />
                      ) : notif.href ? (
                        <ChevronIcon className="ib-sys-chevron" />
                      ) : null}
                    </span>
                  </>
                );

                return notif.href ? (
                  <Link
                    key={notif.id}
                    href={notif.href}
                    className={rowClass}
                    onClick={() => markRead(notif.id)}
                  >
                    {inner}
                  </Link>
                ) : (
                  <button
                    key={notif.id}
                    type="button"
                    className={rowClass}
                    onClick={() => markRead(notif.id)}
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
