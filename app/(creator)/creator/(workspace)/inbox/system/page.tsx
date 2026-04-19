"use client";

import Link from "next/link";
import {
  useNotifications,
  groupNotifications,
  timeAgo,
} from "@/lib/notifications/useNotifications";
import "../inbox.css";

/* ── Category config ────────────────────────────────────────── */
type NotifCategory = "Payment" | "Submission" | "Account" | "System";

const CATEGORY_CONFIG: Record<
  NotifCategory,
  { color: string; wrapClass: string; iconClass: string; label: string }
> = {
  Payment: {
    color: "#16a34a",
    wrapClass: "sys-icon-wrap--payment",
    iconClass: "sys-icon--payment",
    label: "Payment",
  },
  Submission: {
    color: "var(--tertiary)",
    wrapClass: "sys-icon-wrap--check",
    iconClass: "sys-icon--check",
    label: "Submission",
  },
  Account: {
    color: "var(--champagne)",
    wrapClass: "sys-icon-wrap--user",
    iconClass: "sys-icon--user",
    label: "Account",
  },
  System: {
    color: "var(--graphite)",
    wrapClass: "sys-icon-wrap--bell",
    iconClass: "sys-icon--bell",
    label: "System",
  },
};

function getCategory(title: string): NotifCategory {
  const lower = title.toLowerCase();
  if (
    lower.includes("payment") ||
    lower.includes("paycheck") ||
    lower.includes("pending") ||
    lower.includes("paid") ||
    lower.includes("milestone")
  )
    return "Payment";
  if (
    lower.includes("submis") ||
    lower.includes("verify") ||
    lower.includes("accepted") ||
    lower.includes("campaign")
  )
    return "Submission";
  if (
    lower.includes("score") ||
    lower.includes("profile") ||
    lower.includes("account")
  )
    return "Account";
  return "System";
}

/* ── Icon component (colored bg square + symbol) ─────────────── */
function SysIconBlock({ title }: { title: string }) {
  const cat = getCategory(title);
  const cfg = CATEGORY_CONFIG[cat];
  return (
    <span className={`sys-icon-wrap ${cfg.wrapClass}`}>
      <span className={`sys-icon ${cfg.iconClass}`} aria-hidden />
    </span>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function InboxSystemPage() {
  const { notifications, unreadCount, markAsRead, markAllRead, hydrated } =
    useNotifications("creator");

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const groups = groupNotifications(sorted);

  return (
    <div className="inbox-page">
      {/* Top bar */}
      <header className="inbox-topbar">
        <div className="inbox-topbar__left">
          <span className="inbox-topbar__title">System</span>
          {unreadCount > 0 && (
            <span className="inbox-topbar__badge">{unreadCount}</span>
          )}
        </div>
        <div className="inbox-topbar__actions">
          {unreadCount > 0 && (
            <button
              className="inbox-topbar__mark-all"
              onClick={markAllRead}
              type="button"
            >
              Mark all read
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <nav className="inbox-tabs" aria-label="Inbox sections">
        <Link href="/creator/inbox" className="inbox-tab">
          All
        </Link>
        <Link href="/creator/inbox/messages" className="inbox-tab">
          Messages
        </Link>
        <Link href="/creator/inbox/invites" className="inbox-tab">
          Invites
        </Link>
        <Link
          href="/creator/inbox/system"
          className="inbox-tab inbox-tab--active"
        >
          System
          {unreadCount > 0 && (
            <span className="inbox-tab__count">{unreadCount}</span>
          )}
        </Link>
      </nav>

      {/* Category legend */}
      <div
        className="inbox-category-legend"
        aria-label="Notification categories"
      >
        {(
          Object.entries(CATEGORY_CONFIG) as [
            NotifCategory,
            (typeof CATEGORY_CONFIG)[NotifCategory],
          ][]
        ).map(([cat, cfg]) => (
          <div key={cat} className="inbox-category-dot">
            <span
              className="inbox-category-dot__pip"
              style={{ background: cfg.color }}
              aria-hidden
            />
            {cfg.label}
          </div>
        ))}
      </div>

      {/* Notification groups */}
      {!hydrated || sorted.length === 0 ? (
        <div className="inbox-empty">
          <div
            className="inbox-empty__icon"
            aria-hidden
            style={{ fontSize: 18, color: "rgba(0,48,73,0.18)" }}
          >
            ◆
          </div>
          <p className="inbox-empty__title">All caught up.</p>
          <p className="inbox-empty__body">
            Payment confirmations, submission updates, and account changes
            appear here.
          </p>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.label} aria-label={group.label}>
            {/* Date eyebrow */}
            <div
              className="inbox-date-group__label"
              style={{ padding: "10px 32px 4px" }}
            >
              <span className="inbox-date-group__label-text">
                {group.label}
              </span>
              <span className="inbox-date-group__line" />
            </div>

            <div className="inbox-rows" role="list">
              {group.items.map((n) => {
                const isUnread = !n.read;
                const cat = getCategory(n.title);
                const cfg = CATEGORY_CONFIG[cat];
                return (
                  <Link
                    key={n.id}
                    href={n.href}
                    className={`inbox-row ${isUnread ? "inbox-row--system-unread" : ""}`}
                    role="listitem"
                    onClick={() => markAsRead(n.id)}
                    aria-label={n.title}
                    style={isUnread ? { borderLeftColor: cfg.color } : {}}
                  >
                    {/* Colored icon block */}
                    <div className="inbox-row__icon">
                      <SysIconBlock title={n.title} />
                    </div>

                    <div className="inbox-row__body">
                      <span
                        className="inbox-row__sender"
                        style={isUnread ? { fontWeight: 700 } : {}}
                      >
                        {n.title}
                      </span>
                      <span className="inbox-row__preview">{n.body}</span>
                    </div>

                    <div className="inbox-row__meta">
                      {/* Category tag */}
                      <span
                        className="inbox-row__cat-tag"
                        style={{ color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      <span className="inbox-row__time">
                        {timeAgo(n.createdAt)}
                      </span>
                      {isUnread && (
                        <span
                          className="inbox-row__unread-dot"
                          style={{ background: cfg.color }}
                          aria-hidden
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
