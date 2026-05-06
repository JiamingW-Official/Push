"use client";

/* ============================================================
   System — v12 channel-thread layout
   Left:  4 fixed category channels (Action / Money / Compliance / Updates)
          — each acts like a contact. Sorted by most recent notification.
   Right: All notifications in the selected channel as a chronological
          thread — oldest at top, newest at bottom — mirrors Messages
          iMessage layout exactly, using the same .msg-* CSS classes.
   ============================================================ */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { timeAgo } from "@/lib/notifications/useNotifications";
import { type SystemNotif } from "@/lib/inbox/seed";
import { useWorkspaceState } from "@/lib/workspace/state";
import "../inbox.css";
import "../messages/messages.css";
import "./system.css";

/* ── Channel config ─────────────────────────────────────────── */

type CatKey =
  | "action"
  | "compliance"
  | "money"
  | "updates"
  | "platform"
  | "network";

const CAT_BG: Record<CatKey, string> = {
  action: "var(--brand-red)",
  money: "#16a34a",
  compliance: "#ea580c",
  updates: "var(--ink-4)",
  platform: "#0085ff",
  network: "#7c3aed",
};

const CAT_INITIAL: Record<CatKey, string> = {
  action: "!",
  money: "$",
  compliance: "⚠",
  updates: "↑",
  platform: "P",
  network: "◎",
};

const CAT_LABEL: Record<CatKey, string> = {
  action: "Action Required",
  money: "Money",
  compliance: "Compliance",
  updates: "Updates",
  platform: "Push Platform",
  network: "Network",
};

const CAT_META: Record<CatKey, string> = {
  action: "Requires your attention",
  money: "Payouts · Wallet",
  compliance: "FTC · Policy",
  updates: "Campaign Activity",
  platform: "Features · Policy · Account",
  network: "Brand Interest · Discovery",
};

const CAT_ORDER: CatKey[] = [
  "action",
  "compliance",
  "money",
  "updates",
  "platform",
  "network",
];

/* ── Time formatting ─────────────────────────────────────────── */

function formatThreadTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (sameDay) return `Today at ${time}`;

  const date = d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return `${date} · ${time}`;
}

/* ── Icons ──────────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 10L13 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 4h12M2 8h12M2 12h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M9 3L5 7l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckAllIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 8l4 4L14 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 8l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Shared inbox tab nav ────────────────────────────────────── */

function InboxTabNav() {
  const pathname = usePathname();
  const { unreadThreads, unreadNotifications } = useWorkspaceState();

  const tabs = [
    {
      href: "/creator/inbox/messages",
      label: "Messages",
      count: unreadThreads,
      match: (p: string) => p.startsWith("/creator/inbox/messages"),
    },
    {
      href: "/creator/inbox/system",
      label: "System",
      count: unreadNotifications,
      match: (p: string) => p.startsWith("/creator/inbox/system"),
    },
  ];

  return (
    <nav className="inbox-pane-nav" aria-label="Inbox" role="tablist">
      {tabs.map((tab) => {
        const active = tab.match(pathname ?? "");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            role="tab"
            aria-selected={active}
            className={`inbox-pane-nav-tab${active ? " is-active" : ""}`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className="inbox-pane-nav-badge"
                aria-label={`${tab.count} unread`}
              >
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function SystemPage() {
  const {
    notifications,
    markNotifRead: markRead,
    markAllNotifsRead: markAllRead,
  } = useWorkspaceState();

  type SysFilter = "all" | "unread" | "priority";
  const [activeCat, setActiveCat] = useState<CatKey | null>(null);
  const [sysFilter, setSysFilter] = useState<SysFilter>("all");
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const menuWrapRef = useRef<HTMLDivElement>(null);

  /* Group notifications by category, sorted oldest → newest per channel */
  const byCategory = useMemo(() => {
    const map: Record<CatKey, SystemNotif[]> = {
      action: [],
      money: [],
      compliance: [],
      updates: [],
      platform: [],
      network: [],
    };
    for (const n of notifications) {
      const cat = n.category as CatKey;
      if (cat in map) map[cat].push(n);
    }
    for (const cat of CAT_ORDER) {
      map[cat].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }
    return map;
  }, [notifications]);

  /* Channel list sorted by most recent notification descending,
     filtered by search query + sysFilter (all / unread / priority) */
  const sortedChannels = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...CAT_ORDER]
      .filter((cat) => {
        if (!byCategory[cat].length) return false;
        // sysFilter gating
        if (sysFilter === "unread" && !byCategory[cat].some((n) => !n.read))
          return false;
        if (
          sysFilter === "priority" &&
          !byCategory[cat].some((n) => !n.read && n.priority)
        )
          return false;
        if (!q) return true;
        return (
          CAT_LABEL[cat].toLowerCase().includes(q) ||
          CAT_META[cat].toLowerCase().includes(q) ||
          byCategory[cat].some(
            (n) =>
              n.title.toLowerCase().includes(q) ||
              n.body.toLowerCase().includes(q),
          )
        );
      })
      .sort((a, b) => {
        const aT = byCategory[a].at(-1)?.createdAt ?? "";
        const bT = byCategory[b].at(-1)?.createdAt ?? "";
        return new Date(bT).getTime() - new Date(aT).getTime();
      });
  }, [byCategory, query, sysFilter]);

  const activeThread = activeCat ? byCategory[activeCat] : [];

  /* Selecting a channel marks all its notifications read */
  const handleSelectCat = useCallback(
    (cat: CatKey) => {
      setActiveCat(cat);
      byCategory[cat].forEach((n) => markRead(n.id));
    },
    [byCategory, markRead],
  );

  /* Scroll thread to bottom when channel changes */
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [activeCat]);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (
        menuWrapRef.current &&
        !menuWrapRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const totalUnread = notifications.filter((n) => !n.read).length;
  const unreadPriority = notifications.filter(
    (n) => !n.read && n.priority,
  ).length;

  const catHasUnread = (cat: CatKey) => byCategory[cat].some((n) => !n.read);

  return (
    <section
      className={`ib-content msg-pane-layout sys-pane-layout${activeCat ? " has-active" : ""}`}
      aria-label="System notifications"
    >
      {/* ── Left pane: fixed channel list ─────────────────────── */}
      <aside className="msg-list-pane" aria-label="Notification channels">
        <header className="msg-list-pane-header">
          <div className="msg-list-pane-nav-row">
            <InboxTabNav />
            {/* Hamburger → liquid-glass dropdown (matches Messages layout) */}
            <div className="msg-filter-wrap" ref={menuWrapRef}>
              <button
                type="button"
                className="ib-icon-btn"
                aria-label="Notification options"
                title="Options"
                aria-expanded={showMenu}
                aria-haspopup="true"
                onClick={() => setShowMenu((v) => !v)}
              >
                <HamburgerIcon />
              </button>
              {showMenu && (
                <div
                  className="msg-filter-dropdown"
                  role="menu"
                  aria-label="Filter channels"
                >
                  {/* Show filter — mirrors Messages pattern exactly */}
                  {(
                    [
                      { value: "all", label: "All" },
                      {
                        value: "unread",
                        label: "Unread",
                        count: totalUnread,
                      },
                      {
                        value: "priority",
                        label: "Priority",
                        count: unreadPriority,
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={sysFilter === opt.value}
                      className={`msg-filter-item${sysFilter === opt.value ? " is-active" : ""}`}
                      onClick={() => {
                        setSysFilter(opt.value);
                        setShowMenu(false);
                      }}
                    >
                      <span>{opt.label}</span>
                      {"count" in opt && opt.count > 0 && (
                        <span className="msg-filter-badge">{opt.count}</span>
                      )}
                    </button>
                  ))}
                  {totalUnread > 0 && <div className="msg-filter-divider" />}
                  {totalUnread > 0 && (
                    <button
                      type="button"
                      role="menuitem"
                      className="msg-filter-item"
                      onClick={() => {
                        markAllRead();
                        setShowMenu(false);
                      }}
                    >
                      <span>Mark all read</span>
                      <span className="msg-filter-badge">{totalUnread}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search bar — identical to Messages */}
          <label className="msg-list-search">
            <span className="msg-list-search-icon" aria-hidden>
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search channels"
            />
          </label>
        </header>

        <div className="msg-list-body" data-lenis-prevent>
          {sortedChannels.map((cat) => {
            const latest = byCategory[cat].at(-1);
            const hasUnread = catHasUnread(cat);
            const isActive = activeCat === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelectCat(cat)}
                aria-pressed={isActive}
                className={[
                  "msg-list-row",
                  isActive ? "is-active" : "",
                  hasUnread ? "is-unread" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {hasUnread && (
                  <span className="msg-list-unread-dot" aria-hidden />
                )}
                <span
                  className="msg-list-avatar"
                  style={{ background: CAT_BG[cat] }}
                  aria-hidden
                >
                  {CAT_INITIAL[cat]}
                </span>
                <span className="msg-list-row-body">
                  <span className="msg-list-row-top">
                    <span className="msg-list-row-name">{CAT_LABEL[cat]}</span>
                    <span
                      className="msg-list-row-time"
                      suppressHydrationWarning
                    >
                      {latest ? timeAgo(latest.createdAt) : ""}
                    </span>
                  </span>
                  <span className="msg-list-row-preview">
                    {latest ? latest.title : "No notifications"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Right pane: channel thread ────────────────────────── */}
      <section
        className="msg-thread-pane sys-thread-pane"
        aria-label="Notification thread"
      >
        {!activeCat ? (
          <div className="msg-thread-empty">
            <span className="msg-thread-empty-icon" aria-hidden>
              <BellIcon />
            </span>
            <h3 className="msg-thread-empty-title">Pick a channel.</h3>
            <p className="msg-thread-empty-body">
              Action items, payouts, and campaign updates land here.
            </p>
          </div>
        ) : (
          <>
            {/* Thread header — identical to Messages */}
            <header className="msg-thread-header">
              <button
                type="button"
                className="msg-thread-back-btn"
                onClick={() => setActiveCat(null)}
                aria-label="Back to channels"
              >
                <ChevronLeft />
              </button>
              <span
                className="msg-thread-header-avatar"
                style={{ background: CAT_BG[activeCat] }}
                aria-hidden
              >
                {CAT_INITIAL[activeCat]}
              </span>
              <div className="msg-thread-header-info">
                <p className="msg-thread-header-name">{CAT_LABEL[activeCat]}</p>
                <p className="msg-thread-header-meta">
                  PUSH PLATFORM · {CAT_META[activeCat].toUpperCase()}
                </p>
              </div>
            </header>

            {/* Thread body — chronological, oldest at top, newest at bottom */}
            <div className="msg-thread-body" ref={bodyRef} data-lenis-prevent>
              {activeThread.map((notif) => (
                <div key={notif.id} className="sys-notif-entry">
                  {/* Centered timestamp */}
                  <p className="msg-bubble-time" suppressHydrationWarning>
                    {formatThreadTime(notif.createdAt)}
                  </p>

                  {/* Notification card — centered, WeChat 服务号 style */}
                  <div className="sys-notif-card">
                    {/* Colored header strip with channel icon */}
                    <div
                      className="sys-notif-card-header"
                      style={{ background: CAT_BG[activeCat] }}
                      aria-hidden
                    >
                      <span className="sys-notif-card-icon">
                        {CAT_INITIAL[activeCat]}
                      </span>
                    </div>

                    {/* Card body: priority + title + body + CTA */}
                    <div className="sys-notif-card-body">
                      {notif.priority && (
                        <span
                          className="sys-bubble-priority"
                          aria-label="Priority notification"
                        >
                          PRIORITY
                        </span>
                      )}
                      <p className="sys-bubble-title">{notif.title}</p>
                      <p className="sys-bubble-body">{notif.body}</p>
                      {notif.nextAction && (
                        <Link
                          href={notif.nextAction.href}
                          className="sys-notif-cta-btn"
                          onClick={() => markRead(notif.id)}
                        >
                          {notif.nextAction.label}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </section>
  );
}
