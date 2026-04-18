"use client";

import Link from "next/link";
import { useMemo, useState, type ReactElement } from "react";
import "./notifications.css";

/* ------------------------------------------------------------------
   Creator · Notifications center
   v5.1 Vertical AI for Local Commerce — Customer Acquisition Engine
   ConversionOracle™ · DisclosureBot · Two-Segment Creator Economics
   ------------------------------------------------------------------ */

type NotifCategory =
  | "campaigns"
  | "payments"
  | "disputes"
  | "system"
  | "product";

interface Notif {
  id: string;
  category: NotifCategory;
  title: string;
  body: string;
  minutesAgo: number; // static demo
  href: string;
  read: boolean;
  cta?: string;
}

/* ── Demo data (static) ──────────────────────────────────────────── */

const NOTIFICATIONS: Notif[] = [
  {
    id: "n1",
    category: "campaigns",
    title: "New campaign near you",
    body: "Devoción Coffee · Williamsburg · $22/customer · 120 verified walk-ins target.",
    minutesAgo: 12,
    href: "/creator/explore",
    read: false,
    cta: "View",
  },
  {
    id: "n2",
    category: "payments",
    title: "ConversionOracle™ verified",
    body: "Walk-in at Sey Coffee matched your QR post. Payout cleared: +$40.",
    minutesAgo: 47,
    href: "/creator/earnings",
    read: false,
    cta: "View",
  },
  {
    id: "n3",
    category: "campaigns",
    title: "Application accepted",
    body: "Sey Coffee approved your Customer Acquisition Engine brief. Post window opens 9am tomorrow.",
    minutesAgo: 95,
    href: "/creator/campaigns",
    read: false,
    cta: "Open brief",
  },
  {
    id: "n4",
    category: "product",
    title: "Partner tier now includes equity pool",
    body: "Two-Segment Creator Economics update — you qualify. Opt-in before May 1 to lock allocation.",
    minutesAgo: 180,
    href: "/creator/equity-pool",
    read: false,
    cta: "Opt in",
  },
  {
    id: "n5",
    category: "disputes",
    title: "Human review scheduled",
    body: "Disputed walk-in at Partners Coffee queued. 24h SLA — decision expected by tomorrow 6pm.",
    minutesAgo: 360,
    href: "/creator/disputes",
    read: false,
    cta: "View case",
  },
  {
    id: "n6",
    category: "payments",
    title: "$120 sent to Venmo",
    body: "Weekly payout for 3 verified customers. Reference: PAY-8812.",
    minutesAgo: 720,
    href: "/creator/wallet",
    read: true,
  },
  {
    id: "n7",
    category: "campaigns",
    title: "Post deadline tomorrow",
    body: "Devoción brief requires 1 Reel by 6pm. Neighborhood Playbook draft is ready in drafts.",
    minutesAgo: 1080,
    href: "/creator/campaigns",
    read: true,
    cta: "Review",
  },
  {
    id: "n8",
    category: "payments",
    title: "Milestone bonus unlocked",
    body: "10 verified walk-ins this month · +$30 bonus added to your next payout.",
    minutesAgo: 1500,
    href: "/creator/earnings",
    read: true,
  },
  {
    id: "n9",
    category: "disputes",
    title: "Dispute resolved in your favor",
    body: "Oracle re-scored the ambiguous walk-in — +$40 restored to your balance.",
    minutesAgo: 1800,
    href: "/creator/disputes",
    read: true,
  },
  {
    id: "n10",
    category: "system",
    title: "Identity verification expires in 7 days",
    body: "Re-upload your ID to keep payout eligibility active. Takes under 2 minutes.",
    minutesAgo: 2400,
    href: "/creator/verify",
    read: false,
    cta: "Verify",
  },
  {
    id: "n11",
    category: "product",
    title: "DisclosureBot accuracy now 94%",
    body: "Auto-compliance tagging improved. Your drafts pre-fill #ad where required — no manual work.",
    minutesAgo: 3000,
    href: "/creator/campaigns",
    read: true,
  },
  {
    id: "n12",
    category: "system",
    title: "2FA enabled",
    body: "Two-factor authentication is now protecting your account. Recovery codes saved.",
    minutesAgo: 4320,
    href: "/creator/settings",
    read: true,
  },
  {
    id: "n13",
    category: "campaigns",
    title: "Williamsburg Coffee+ beachhead open",
    body: "4 merchants hiring this week in your beachhead. Avg $19/verified customer.",
    minutesAgo: 5400,
    href: "/creator/explore",
    read: true,
    cta: "Browse",
  },
  {
    id: "n14",
    category: "payments",
    title: "ConversionOracle™ verified",
    body: "Walk-in at Partners Coffee confirmed via QR + geo match. Payout cleared: +$18.",
    minutesAgo: 7200,
    href: "/creator/earnings",
    read: true,
  },
  {
    id: "n15",
    category: "system",
    title: "Tax form W-9 needed before May 15",
    body: "Required before your next payout crosses $600 YTD. One-page form.",
    minutesAgo: 10080,
    href: "/creator/settings",
    read: true,
    cta: "Complete",
  },
  {
    id: "n16",
    category: "product",
    title: "Software Leverage Ratio (SLR) dashboard",
    body: "See how many campaigns your content drives vs. ops load. New in creator analytics.",
    minutesAgo: 14400,
    href: "/creator/analytics",
    read: true,
  },
];

/* ── Tabs ────────────────────────────────────────────────────────── */

const TABS: { id: "all" | NotifCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "campaigns", label: "Campaigns" },
  { id: "payments", label: "Payments" },
  { id: "disputes", label: "Disputes" },
  { id: "system", label: "System" },
  { id: "product", label: "Product updates" },
];

/* ── Grouping ────────────────────────────────────────────────────── */

function groupLabel(
  minutes: number,
): "Today" | "Yesterday" | "This week" | "Earlier" {
  if (minutes < 60 * 24) return "Today";
  if (minutes < 60 * 48) return "Yesterday";
  if (minutes < 60 * 24 * 7) return "This week";
  return "Earlier";
}

function timeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

/* ── Category meta ───────────────────────────────────────────────── */

type CategoryMeta = {
  label: string;
  accent: string; // CSS color var
  icon: ReactElement;
};

const CATEGORY_META: Record<NotifCategory, CategoryMeta> = {
  campaigns: {
    label: "Campaign",
    accent: "var(--tertiary)", // Steel Blue
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M3 11l18-7-5 18-4-7-9-4z" />
      </svg>
    ),
  },
  payments: {
    label: "Payment",
    accent: "var(--champagne)", // Champagne Gold
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <rect x="3" y="6" width="18" height="12" />
        <path d="M3 10h18M7 14h3" />
      </svg>
    ),
  },
  disputes: {
    label: "Dispute",
    accent: "var(--primary)", // Flag Red
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M12 3l10 18H2L12 3z" />
        <path d="M12 10v5M12 18v.5" />
      </svg>
    ),
  },
  system: {
    label: "System",
    accent: "var(--graphite)", // tertiary / graphite
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  product: {
    label: "Product",
    accent: "var(--dark)", // Deep Space Blue
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M4 7l8-4 8 4v10l-8 4-8-4V7z" />
        <path d="M4 7l8 4 8-4M12 11v10" />
      </svg>
    ),
  },
};

/* ── Page ────────────────────────────────────────────────────────── */

const PAGE_SIZE = 12;

export default function CreatorNotificationsPage() {
  const [items, setItems] = useState<Notif[]>(NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<"all" | NotifCategory>("all");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? items
        : items.filter((n) => n.category === activeTab),
    [items, activeTab],
  );

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items],
  );

  const visible = filtered.slice(0, visibleCount);
  const grouped = useMemo(() => {
    const buckets: Record<string, Notif[]> = {
      Today: [],
      Yesterday: [],
      "This week": [],
      Earlier: [],
    };
    for (const n of visible) buckets[groupLabel(n.minutesAgo)].push(n);
    return (["Today", "Yesterday", "This week", "Earlier"] as const)
      .map((label) => ({ label, rows: buckets[label] }))
      .filter((g) => g.rows.length > 0);
  }, [visible]);

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setItems([]);

  const markOne = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const dismissOne = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="notif-page">
      {/* Nav */}
      <header className="notif-nav">
        <Link href="/creator/dashboard" className="notif-nav-back">
          ← Dashboard
        </Link>
        <span className="notif-nav-title">Inbox.</span>
      </header>

      {/* Hero strip */}
      <section className="notif-hero">
        <div className="notif-hero-inner">
          <div className="notif-hero-left">
            <h1 className="notif-hero-headline">Notifications.</h1>
            <p className="notif-hero-sub">
              {unreadCount > 0 ? (
                <>
                  <span className="notif-hero-count">{unreadCount}</span> unread
                  · {items.length} total
                </>
              ) : (
                <>All caught up · {items.length} total</>
              )}
            </p>
          </div>
          <div className="notif-hero-actions">
            <button
              type="button"
              className="notif-action-btn"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </button>
            <button
              type="button"
              className="notif-action-btn"
              onClick={clearAll}
              disabled={items.length === 0}
            >
              Clear all
            </button>
            <Link
              href="/creator/settings"
              className="notif-action-btn notif-action-btn--ghost"
            >
              Settings
            </Link>
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <nav className="notif-tabs" aria-label="Notification categories">
        {TABS.map((t) => {
          const count =
            t.id === "all"
              ? items.length
              : items.filter((n) => n.category === t.id).length;
          return (
            <button
              key={t.id}
              type="button"
              className={`notif-tab${activeTab === t.id ? " notif-tab--active" : ""}`}
              onClick={() => {
                setActiveTab(t.id);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              <span>{t.label}</span>
              <span className="notif-tab-count">{count}</span>
            </button>
          );
        })}
      </nav>

      {/* Main list */}
      <main className="notif-main">
        {filtered.length === 0 ? (
          <div className="notif-empty">
            <p className="notif-empty-title">Nothing here yet.</p>
            <p className="notif-empty-body">
              Campaign briefs, ConversionOracle™ verifications, payouts, and
              product updates will appear here.
            </p>
          </div>
        ) : (
          <>
            {grouped.map((group) => (
              <section key={group.label} className="notif-group">
                <div className="notif-group-label">{group.label}</div>
                <ul className="notif-list">
                  {group.rows.map((n) => {
                    const meta = CATEGORY_META[n.category];
                    return (
                      <li
                        key={n.id}
                        className={`notif-item${n.read ? " notif-item--read" : " notif-item--unread"}`}
                        style={{ ["--row-accent" as string]: meta.accent }}
                      >
                        <span
                          className="notif-item-accent"
                          aria-hidden="true"
                        />
                        <span
                          className="notif-item-icon"
                          style={{ color: meta.accent }}
                          aria-hidden="true"
                        >
                          {meta.icon}
                        </span>
                        <div className="notif-item-body">
                          <div className="notif-item-header">
                            <span className="notif-item-cat">{meta.label}</span>
                            <span className="notif-item-time">
                              {timeAgo(n.minutesAgo)}
                            </span>
                          </div>
                          <div className="notif-item-title">{n.title}</div>
                          <p className="notif-item-text">{n.body}</p>
                          <div className="notif-item-actions">
                            <Link
                              href={n.href}
                              className="notif-item-link"
                              onClick={() => markOne(n.id)}
                            >
                              {n.cta ?? "View"}
                            </Link>
                            <span className="notif-item-sep">·</span>
                            <button
                              type="button"
                              className="notif-item-link notif-item-link--muted"
                              onClick={() => dismissOne(n.id)}
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                        {!n.read && (
                          <span
                            className="notif-unread-dot"
                            aria-label="Unread"
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}

            {filtered.length > visibleCount && (
              <div className="notif-loadmore">
                <button
                  type="button"
                  className="notif-action-btn"
                  onClick={() =>
                    setVisibleCount((c) =>
                      Math.min(c + PAGE_SIZE, filtered.length),
                    )
                  }
                >
                  Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)}{" "}
                  more
                </button>
              </div>
            )}
          </>
        )}

        {/* Preferences preview */}
        <section className="notif-prefs" aria-label="Notification preferences">
          <div className="notif-prefs-header">
            <span className="notif-prefs-eyebrow">Push preferences</span>
            <Link href="/creator/settings" className="notif-prefs-link">
              Edit in Settings →
            </Link>
          </div>
          <dl className="notif-prefs-grid">
            <div className="notif-prefs-row">
              <dt>Campaign briefs</dt>
              <dd>
                <span className="notif-pref-pill notif-pref-pill--on">
                  Push · Email
                </span>
              </dd>
            </div>
            <div className="notif-prefs-row">
              <dt>ConversionOracle™ verifications</dt>
              <dd>
                <span className="notif-pref-pill notif-pref-pill--on">
                  Push
                </span>
              </dd>
            </div>
            <div className="notif-prefs-row">
              <dt>Payouts & milestones</dt>
              <dd>
                <span className="notif-pref-pill notif-pref-pill--on">
                  Push · Email
                </span>
              </dd>
            </div>
            <div className="notif-prefs-row">
              <dt>Disputes (24h SLA)</dt>
              <dd>
                <span className="notif-pref-pill notif-pref-pill--on">
                  Push · Email · SMS
                </span>
              </dd>
            </div>
            <div className="notif-prefs-row">
              <dt>Product updates (DisclosureBot, SLR)</dt>
              <dd>
                <span className="notif-pref-pill notif-pref-pill--off">
                  Email only
                </span>
              </dd>
            </div>
            <div className="notif-prefs-row">
              <dt>Quiet hours</dt>
              <dd>
                <span className="notif-pref-pill notif-pref-pill--off">
                  10pm – 8am
                </span>
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
