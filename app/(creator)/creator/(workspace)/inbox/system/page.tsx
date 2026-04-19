"use client";

import Link from "next/link";
import {
  useNotifications,
  groupNotifications,
  timeAgo,
} from "@/lib/notifications/useNotifications";
import "../inbox.css";

/* ── Icon picker ────────────────────────────────────────────── */
function SysIcon({ title }: { title: string }) {
  const lower = title.toLowerCase();
  if (
    lower.includes("payment") ||
    lower.includes("paycheck") ||
    lower.includes("pending") ||
    lower.includes("paid")
  ) {
    return <span className="sys-icon sys-icon--payment" aria-hidden />;
  }
  if (
    lower.includes("submis") ||
    lower.includes("verify") ||
    lower.includes("accepted") ||
    lower.includes("milestone")
  ) {
    return <span className="sys-icon sys-icon--check" aria-hidden />;
  }
  if (
    lower.includes("score") ||
    lower.includes("profile") ||
    lower.includes("account")
  ) {
    return <span className="sys-icon sys-icon--user" aria-hidden />;
  }
  return <span className="sys-icon sys-icon--bell" aria-hidden />;
}

/* ── Category label ─────────────────────────────────────────── */
function getCategory(
  title: string,
): "Payment" | "Submission" | "Account" | "System" {
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

const CATEGORY_COLORS: Record<string, string> = {
  Payment: "#16a34a",
  Submission: "var(--tertiary)",
  Account: "var(--champagne)",
  System: "var(--graphite)",
};

/* ── Page ────────────────────────────────────────────────────── */
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
        style={{
          display: "flex",
          gap: 16,
          padding: "10px 32px",
          borderBottom: "1px solid rgba(0,48,73,0.06)",
          background: "var(--surface)",
          flexWrap: "wrap",
        }}
      >
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div
            key={cat}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--graphite)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {cat}
          </div>
        ))}
      </div>

      {/* Notification groups */}
      {!hydrated || sorted.length === 0 ? (
        <div className="inbox-empty">
          <p className="inbox-empty__title">All caught up.</p>
          <p className="inbox-empty__body">
            Payment confirmations, submission updates, and account changes
            appear here.
          </p>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.label} aria-label={group.label}>
            <div className="inbox-section-header">
              <span className="inbox-section-label">{group.label}</span>
            </div>
            <div className="inbox-rows" role="list">
              {group.items.map((n) => {
                const isUnread = !n.read;
                const cat = getCategory(n.title);
                const catColor = CATEGORY_COLORS[cat];
                return (
                  <Link
                    key={n.id}
                    href={n.href}
                    className={`inbox-row ${isUnread ? "inbox-row--system-unread" : ""}`}
                    role="listitem"
                    onClick={() => markAsRead(n.id)}
                    aria-label={n.title}
                    style={isUnread ? { borderLeftColor: catColor } : {}}
                  >
                    <div className="inbox-row__icon">
                      <SysIcon title={n.title} />
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
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          color: catColor,
                          flexShrink: 0,
                        }}
                      >
                        {cat}
                      </span>
                      <span className="inbox-row__time">
                        {timeAgo(n.createdAt)}
                      </span>
                      {isUnread && (
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: catColor,
                            flexShrink: 0,
                          }}
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
