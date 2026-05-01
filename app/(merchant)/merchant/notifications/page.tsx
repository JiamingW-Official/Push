"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FilterTabs, PageHeader } from "@/components/merchant/shared";
import {
  api,
  type Notification as MerchantNotification,
} from "@/lib/data/api-client";
import "./notifications.css";

/* ── Filters: All / Unread + 4 merchant kinds ────────────────── */
type NotificationFilter =
  | "all"
  | "unread"
  | "applicants"
  | "redemptions"
  | "billing"
  | "system";
type NotificationGroup = "TODAY" | "YESTERDAY" | "EARLIER";
type MerchantKind = "applicants" | "redemptions" | "billing" | "system";

/* ── SVG icons — naked SVG forbidden on tiles, so each renders inside a 40×40 .notif-item-icon ── */

function IconApplicant() {
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
      <circle cx="10" cy="7" r="3.2" />
      <path d="M3.5 17c1.4-3 3.8-4.5 6.5-4.5s5.1 1.5 6.5 4.5" />
    </svg>
  );
}

function IconRedemption() {
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
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <path d="M11 11h2v2h-2zM15 11h2M11 15h2M15 13v4" />
    </svg>
  );
}

function IconBilling() {
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

function IconSystem() {
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

/* ── Classification — derived from kind / title / body ───────── */
function notifKind(notification: MerchantNotification): MerchantKind {
  const k = (notification.kind || "").toLowerCase();
  const t = (notification.title || "").toLowerCase();
  const b = (notification.body || "").toLowerCase();
  const haystack = `${k} ${t} ${b}`;

  if (
    haystack.includes("applicant") ||
    haystack.includes("application") ||
    haystack.includes("apply") ||
    haystack.includes("match") ||
    haystack.includes("roster") ||
    haystack.includes("creator joined")
  )
    return "applicants";

  if (
    haystack.includes("redemption") ||
    haystack.includes("redeem") ||
    haystack.includes("scan") ||
    haystack.includes("qr ") ||
    haystack.includes("verified") ||
    haystack.includes("walk-in") ||
    haystack.includes("walkin")
  )
    return "redemptions";

  if (
    haystack.includes("payout") ||
    haystack.includes("billing") ||
    haystack.includes("invoice") ||
    haystack.includes("payment") ||
    haystack.includes("charge") ||
    haystack.includes("credit") ||
    haystack.includes("balance")
  )
    return "billing";

  return "system";
}

function kindIcon(kind: MerchantKind): ReactNode {
  switch (kind) {
    case "applicants":
      return <IconApplicant />;
    case "redemptions":
      return <IconRedemption />;
    case "billing":
      return <IconBilling />;
    default:
      return <IconSystem />;
  }
}

function kindLabel(kind: MerchantKind): string {
  switch (kind) {
    case "applicants":
      return "Applicant";
    case "redemptions":
      return "Redemption";
    case "billing":
      return "Billing";
    default:
      return "System";
  }
}

/* ── Time helpers ─────────────────────────────────────────────── */

function timeAgo(value: string): string {
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return "";
  const diff = Date.now() - target;
  if (diff < 60_000) return "Just now";
  const min = Math.floor(diff / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getGroupLabel(value: string): NotificationGroup {
  const target = new Date(value);
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const yesterday = today - 86_400_000;
  const targetDay = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  ).getTime();
  if (targetDay === today) return "TODAY";
  if (targetDay === yesterday) return "YESTERDAY";
  return "EARLIER";
}

/* ── Filter tabs ──────────────────────────────────────────────── */

const FILTER_TABS = [
  { value: "all", label: "ALL" },
  { value: "unread", label: "UNREAD" },
  { value: "applicants", label: "APPLICANTS" },
  { value: "redemptions", label: "REDEMPTIONS" },
  { value: "billing", label: "BILLING" },
  { value: "system", label: "SYSTEM" },
] as const;

export default function MerchantNotificationsPage() {
  const [notifications, setNotifications] = useState<MerchantNotification[]>(
    [],
  );
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    api.merchant.notifications.list().then((result) => {
      if (!active) return;

      if (result.ok) {
        setNotifications(result.data);
        return;
      }

      setError(result.error.toUpperCase());
    });

    return () => {
      active = false;
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.reduce((sum, n) => sum + (n.read_at ? 0 : 1), 0),
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    const sorted = notifications
      .slice()
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

    if (filter === "all") return sorted;
    if (filter === "unread") return sorted.filter((n) => !n.read_at);
    return sorted.filter((n) => notifKind(n) === filter);
  }, [filter, notifications]);

  const groupedNotifications = useMemo(() => {
    const groups: Record<NotificationGroup, MerchantNotification[]> = {
      TODAY: [],
      YESTERDAY: [],
      EARLIER: [],
    };
    for (const n of filteredNotifications)
      groups[getGroupLabel(n.created_at)].push(n);
    return groups;
  }, [filteredNotifications]);

  // Today summary — drives the floating glass tile (≤1 per panel)
  const todaySummary = useMemo(() => {
    const today = groupedNotifications.TODAY;
    let applicants = 0;
    let redemptions = 0;
    let billing = 0;
    for (const n of today) {
      const k = notifKind(n);
      if (k === "applicants") applicants++;
      else if (k === "redemptions") redemptions++;
      else if (k === "billing") billing++;
    }
    return { total: today.length, applicants, redemptions, billing };
  }, [groupedNotifications]);

  async function handleMarkRead(notification: MerchantNotification) {
    if (notification.read_at) return;

    const optimisticReadAt = new Date().toISOString();
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, read_at: optimisticReadAt }
          : item,
      ),
    );

    const result = await api.merchant.notifications.markRead(notification.id);
    if (result.ok) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read_at: result.data.read_at }
            : item,
        ),
      );
      return;
    }

    // rollback on failure
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, read_at: notification.read_at }
          : item,
      ),
    );
    setError(result.error.toUpperCase());
  }

  async function handleMarkAllRead() {
    if (busy || unreadCount === 0) return;
    setBusy(true);
    const unread = notifications.filter((n) => !n.read_at);
    // optimistic
    const stamp = new Date().toISOString();
    setNotifications((current) =>
      current.map((n) => (n.read_at ? n : { ...n, read_at: stamp })),
    );

    const failures: string[] = [];
    await Promise.all(
      unread.map(async (n) => {
        const r = await api.merchant.notifications.markRead(n.id);
        if (!r.ok) failures.push(n.id);
      }),
    );

    if (failures.length > 0) {
      // rollback failed items only
      setNotifications((current) =>
        current.map((n) =>
          failures.includes(n.id) ? { ...n, read_at: null } : n,
        ),
      );
      setError(
        `COULDN'T MARK ${failures.length} ITEM${failures.length > 1 ? "S" : ""} AS READ`,
      );
    }
    setBusy(false);
  }

  const showSummary = filter === "all" && todaySummary.total > 0;
  const eyebrow = unreadCount > 0 ? `LINKS · ${unreadCount} UNREAD` : "LINKS";

  return (
    <section className="notif-page">
      <PageHeader
        eyebrow={eyebrow}
        title="Notifications"
        subtitle="Applicants, redemptions, billing, and system events."
        action={
          unreadCount > 0 ? (
            <button
              type="button"
              className="btn-ghost notif-mark-all"
              onClick={handleMarkAllRead}
              disabled={busy}
              aria-label={`Mark all ${unreadCount} unread notifications as read`}
            >
              {busy ? "Marking…" : "Mark all read"}
            </button>
          ) : null
        }
      />

      <div className="notif-toolbar">
        <FilterTabs
          tabs={[...FILTER_TABS]}
          value={filter}
          onChange={(value) => setFilter(value as NotificationFilter)}
        />
        {error ? (
          <p className="notif-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {/* ≤1 floating liquid-glass tile per panel — Design v11 § 8.12 */}
      {showSummary ? (
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
            {todaySummary.applicants > 0 ? (
              <div className="notif-summary-stat">
                <span className="notif-summary-num">
                  {todaySummary.applicants}
                </span>
                <span className="notif-summary-key">Applicants</span>
              </div>
            ) : null}
            {todaySummary.redemptions > 0 ? (
              <div className="notif-summary-stat">
                <span className="notif-summary-num">
                  {todaySummary.redemptions}
                </span>
                <span className="notif-summary-key">Redemptions</span>
              </div>
            ) : null}
            {todaySummary.billing > 0 ? (
              <div className="notif-summary-stat">
                <span className="notif-summary-num">
                  {todaySummary.billing}
                </span>
                <span className="notif-summary-key">Billing</span>
              </div>
            ) : null}
          </div>
        </aside>
      ) : null}

      {filteredNotifications.length === 0 ? (
        <div className="notif-empty" role="status">
          <div className="notif-empty-icon">
            <IconCheck />
          </div>
          <p className="notif-empty-title">
            {filter === "unread" ? "Inbox zero" : "You're all caught up"}
          </p>
          <p className="notif-empty-body">
            {filter === "unread"
              ? "No unread notifications. Switch to All to revisit recent activity."
              : "When applicants apply, scans verify, or invoices post, they appear here."}
          </p>
          <Link href="/merchant/dashboard" className="btn-ghost">
            Back to dashboard
          </Link>
        </div>
      ) : (
        <div className="notif-groups">
          {(["TODAY", "YESTERDAY", "EARLIER"] as const).map((group) =>
            groupedNotifications[group].length > 0 ? (
              <section
                key={group}
                className="notif-group"
                aria-labelledby={`notifications-${group.toLowerCase()}`}
              >
                <div className="notif-group-head">
                  <p
                    id={`notifications-${group.toLowerCase()}`}
                    className="notif-group-title"
                  >
                    {group}
                    <span className="notif-group-count">
                      ({groupedNotifications[group].length})
                    </span>
                  </p>
                </div>
                <ul className="notif-list" role="list">
                  {groupedNotifications[group].map((notification) => {
                    const kind = notifKind(notification);
                    const isUnread = !notification.read_at;
                    const itemClasses = [
                      "notif-item",
                      isUnread ? "notif-item--unread" : "notif-item--read",
                      `notif-item--${kind}`,
                    ].join(" ");
                    return (
                      <li key={notification.id} className={itemClasses}>
                        <span className="notif-item-icon" aria-hidden="true">
                          {kindIcon(kind)}
                        </span>
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
                              {timeAgo(notification.created_at)}
                            </span>
                          </div>
                          <h2 className="notif-item-title">
                            {notification.title}
                          </h2>
                          <p className="notif-item-text">{notification.body}</p>
                        </div>
                        <div className="notif-item-actions">
                          {isUnread ? (
                            <span
                              className="notif-unread-dot"
                              aria-label="Unread"
                            />
                          ) : null}
                          {isUnread ? (
                            <button
                              type="button"
                              className="btn-ghost notif-mark-read"
                              onClick={() => handleMarkRead(notification)}
                              aria-label={`Mark "${notification.title}" as read`}
                            >
                              Mark read
                            </button>
                          ) : null}
                          {notification.link ? (
                            <Link
                              className="btn-pill notif-link"
                              href={notification.link}
                            >
                              View
                            </Link>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null,
          )}
        </div>
      )}
    </section>
  );
}
