"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { timeAgo } from "@/lib/notifications/useNotifications";
import { type SystemNotif, type Category } from "@/lib/inbox/seed";
import { useInboxState } from "@/lib/inbox/state";
import { PaneHeader, PaneSubCount, EmptyState } from "@/lib/inbox/components";
import { Button } from "@/lib/workspace/buttons";
import "../inbox.css";
import "./system.css";

/* ── Category config — re-cut per audit P1 ──────────────────────
   Old taxonomy ("Campaigns" / "Alerts" / "Platform") didn't map
   to creator mental models. New cut groups by *what creator does
   with it*: take action, watch money, FYI updates, FTC compliance. */

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "action", label: "Action Required" },
  { id: "money", label: "Money" },
  { id: "updates", label: "Updates" },
  { id: "compliance", label: "Compliance" },
];

const EMPTY_MESSAGES: Record<Category, { title: string; body: string }> = {
  all: {
    title: "No notifications.",
    body: "Action items, payouts, and FTC reminders land here.",
  },
  action: {
    title: "Nothing needs you right now.",
    body: "Briefs to open, deadlines to confirm, decisions to make will appear here.",
  },
  money: {
    title: "No payment activity.",
    body: "Wallet credits, payouts, and bank transfers will appear here.",
  },
  updates: {
    title: "No updates.",
    body: "Score changes, tier moves, and FYI items will appear here.",
  },
  compliance: {
    title: "All compliant.",
    body: "FTC disclosure prompts and policy flags will appear here.",
  },
};

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
    case "money":
      return <PaymentsIcon className={className} />;
    case "action":
      return <AlertsIcon className={className} />;
    case "compliance":
      return <CampaignsIcon className={className} />;
    case "updates":
      return <PlatformIcon className={className} />;
    default:
      return <DefaultIcon className={className} />;
  }
};

/* Category badge label — short product UI tag shown next to title */
const BADGE_LABEL: Record<Category, string> = {
  all: "Update",
  action: "Action",
  money: "Money",
  updates: "Update",
  compliance: "Compliance",
};

/* ── Scan-verified dedupe ─────────────────────────────────────
   Consecutive scan_verified from the same brand collapse into one
   row with a running count badge — no agentic theater, just noise
   reduction. Sorted oldest→newest so the last body wins. */

type DedupeRow = SystemNotif & { runCount: number };

function dedupeNotifs(items: SystemNotif[]): DedupeRow[] {
  const out: DedupeRow[] = [];
  for (const n of items) {
    if (n.type === "scan_verified") {
      const prev = out[out.length - 1];
      const brand = n.title.includes(" · ") ? n.title.split(" · ")[1] : "";
      const prevBrand =
        prev?.type === "scan_verified" && prev.title.includes(" · ")
          ? (prev.title.split(" · ").pop() ?? "")
          : "";
      if (prev?.type === "scan_verified" && prevBrand === brand) {
        const newCount = prev.runCount + 1;
        out[out.length - 1] = {
          ...prev,
          runCount: newCount,
          title: `${newCount} scans verified · ${brand}`,
          body: n.body,
          createdAt: n.createdAt,
        };
        continue;
      }
      out.push({ ...n, runCount: 1 });
      continue;
    }
    out.push({ ...n, runCount: 1 });
  }
  return out;
}

/* ── Date grouping ───────────────────────────────────────────── */

type DateGroup = { label: string; items: SystemNotif[] };

function groupByDate(notifications: SystemNotif[], now: number): DateGroup[] {
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

/* ── Why-this Oracle attribution ─────────────────────────────── */

function getWhyReasons(notif: SystemNotif): string[] {
  if (notif.type === "scan_verified") {
    return [
      "QR hash matched at point-of-sale terminal",
      "Creator location within 0.3mi of placement at scan time",
      "Timestamp within ±2 min of registered scan window",
    ];
  }
  if (notif.category === "compliance") {
    return [
      "FTC 16 CFR 255 requires #ad disclosure on sponsored posts",
      "Push policy v5.4: disclosure must be signed before content goes live",
      "Unresolved disclosure blocks campaign payout",
    ];
  }
  if (notif.category === "money") {
    return [
      "Payout computed from verified scan count at deadline",
      "Push Attribution v5.3: QR hash + location + timestamp all required",
      "Transfer initiated via Stripe Connect — available in 1–2 days",
    ];
  }
  if (notif.category === "action") {
    return [
      "Deadline trigger: campaign window closes within 3 days",
      "Scan count below target threshold at time of notification",
      "Action items remain visible until campaign closes or you act",
    ];
  }
  return ["Generated by Push platform event engine"];
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function SystemPage() {
  /* Notifications + mutations come from the shared inbox context.
     This means an "Application accepted" notification fired by
     accepting an invite over in /invites is read here in real
     time — and the segmented nav badge re-counts everywhere. */
  const router = useRouter();
  const {
    notifications,
    markNotifRead: markRead,
    markAllNotifsRead: markAllSystemRead,
    snoozeNotif,
  } = useInboxState();

  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [expandedWhyId, setExpandedWhyId] = useState<string | null>(null);

  /* Auto-archive: FYI items (Money/Updates) drop off the list 7 days
     after they're read. Action / Compliance items stick until the
     creator handles the underlying campaign — they don't auto-rot.
     Snoozed items hide until their snoozedUntil time arrives. */
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  /* SSR-safe live clock — null on first paint so server and client
     hydration agree, then refreshes every 60s. Filters that depend
     on `now` simply pass through everything until mount. */
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((n) => {
        if (now == null) return true;
        if (n.snoozedUntil && n.snoozedUntil > now) return false;
        if (!n.fyiArchive || !n.read) return true;
        const age = now - new Date(n.createdAt).getTime();
        return age < SEVEN_DAYS;
      }),
    [notifications, now],
  );

  const filtered = useMemo(() => {
    if (activeCategory === "all") return visibleNotifications;
    return visibleNotifications.filter((n) => n.category === activeCategory);
  }, [visibleNotifications, activeCategory]);

  const groups = useMemo(() => {
    const sorted = [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    /* During SSR `now` is null — use the newest createdAt as the
       reference so grouping is deterministic across server / client.
       After hydration, real `now` takes over. */
    const reference =
      now ?? (sorted.length > 0 ? new Date(sorted[0].createdAt).getTime() : 0);
    return groupByDate(sorted, reference).map((g) => ({
      ...g,
      items: [
        ...g.items.filter((n) => n.priority && !n.read),
        ...g.items.filter((n) => !(n.priority && !n.read)),
      ],
    }));
  }, [filtered, now]);

  /* Per audit: unify sidebar count semantics. Every category — incl.
     "All" — now shows UNREAD count (not a mix of total & unread). */
  const countFor = useCallback(
    (cat: Category) => {
      const src =
        cat === "all"
          ? visibleNotifications
          : visibleNotifications.filter((n) => n.category === cat);
      return src.filter((n) => !n.read).length;
    },
    [visibleNotifications],
  );

  const totalUnread = countFor("all");

  const oracleSummary = useMemo(() => {
    const scans = visibleNotifications.filter(
      (n) => n.type === "scan_verified",
    );
    if (scans.length === 0) return null;
    const brands = new Set(
      scans
        .map((n) => (n.title.includes(" · ") ? n.title.split(" · ")[1] : ""))
        .filter(Boolean),
    );
    return {
      total: scans.length,
      brands: brands.size,
      unread: scans.filter((n) => !n.read).length,
    };
  }, [visibleNotifications]);

  // Map of pretty group title for the right column
  const GROUP_TITLE: Record<string, string> = {
    TODAY: "Today",
    YESTERDAY: "Yesterday",
    EARLIER: "Earlier",
  };

  return (
    <div className="ib-content ib-sys-layout">
      {/* ── Left sidebar — Figma reference 2 ─────────────────── */}
      <aside
        className="ib-sys-sidebar"
        aria-label="Notification categories"
        data-lenis-prevent
      >
        <span className="ib-sys-sidebar-icon" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4h12M2 8h12M2 12h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>

        {/* ALL — big pill at top */}
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          aria-pressed={activeCategory === "all"}
          className={`ib-sys-cat ib-sys-cat--all${activeCategory === "all" ? " is-active" : ""}`}
        >
          <span>All</span>
          <span
            className={`ib-sys-cat-count${countFor("all") === 0 ? " ib-sys-cat-count--quiet" : ""}`}
          >
            {countFor("all")}
          </span>
        </button>

        {/* Category rows with colored dots */}
        {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
          const count = countFor(cat.id);
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={isActive}
              className={`ib-sys-cat${isActive ? " is-active" : ""}`}
            >
              <span
                className={`ib-sys-dot-cat ib-sys-dot-cat--${cat.id}`}
                aria-hidden
              />
              <span>{cat.label}</span>
              {count > 0 ? (
                <span className="ib-sys-cat-count">{count}</span>
              ) : (
                <span className="ib-sys-cat-count ib-sys-cat-count--quiet">
                  0
                </span>
              )}
            </button>
          );
        })}
      </aside>

      {/* ── Right column — grouped notification list ─────────── */}
      <div className="ib-sys-main" data-lenis-prevent>
        <PaneHeader
          title={
            CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "All"
          }
          sub={
            totalUnread > 0 ? (
              <PaneSubCount count={totalUnread} label="unread" />
            ) : (
              <strong>All caught up</strong>
            )
          }
          actions={
            totalUnread > 0 && (
              <Button
                variant="pill"
                size="sm"
                onClick={markAllSystemRead}
                ariaLabel="Mark all notifications as read"
              >
                Mark all read
              </Button>
            )
          }
        />

        <div className="ib-sys-list">
          {/* P1-C: ConversionOracle audit summary — pinned when scan data exists */}
          {oracleSummary && (
            <div
              className="ib-oracle-card"
              aria-label="ConversionOracle summary"
            >
              <span className="ib-oracle-eyebrow">
                (ConversionOracle) · Last 24h
              </span>
              <div className="ib-oracle-stats">
                <div className="ib-oracle-stat">
                  <span className="ib-oracle-stat-num">
                    {oracleSummary.total}
                  </span>
                  <span className="ib-oracle-stat-label">scans verified</span>
                </div>
                <div className="ib-oracle-stat">
                  <span className="ib-oracle-stat-num">
                    {oracleSummary.brands}
                  </span>
                  <span className="ib-oracle-stat-label">
                    brand{oracleSummary.brands !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="ib-oracle-stat">
                  <span className="ib-oracle-stat-num">100%</span>
                  <span className="ib-oracle-stat-label">match rate</span>
                </div>
              </div>
              <p className="ib-oracle-footer">
                QR hash · Location ±0.3mi · Timestamp ±2min — all 3 required to
                count
              </p>
            </div>
          )}
          {groups.length === 0 ? (
            <EmptyState
              title={EMPTY_MESSAGES[activeCategory].title}
              body={EMPTY_MESSAGES[activeCategory].body}
            />
          ) : (
            groups.map((group) => (
              <div key={group.label} className="ib-group">
                {/* New v11 Figma title — replaces the old line-divider band
                  (the band is hidden by .ib-sys-layout .ib-group-label) */}
                <h3 className="ib-sys-group-title">
                  {GROUP_TITLE[group.label] ?? group.label}
                </h3>
                <div className="ib-group-label">
                  <span>{group.label}</span>
                  <span className="ib-group-line" aria-hidden />
                </div>

                {dedupeNotifs(group.items).map((notif) => {
                  const cat = notif.category as Category;
                  const rowClass = [
                    "ib-sys-row",
                    `ib-sys-row--${cat}`,
                    !notif.read ? "ib-sys-row--unread" : "",
                    notif.priority && !notif.read ? "ib-sys-row--priority" : "",
                    notif.nextAction ? "ib-sys-row--has-action" : "",
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
                          <span
                            className="ib-sys-time"
                            suppressHydrationWarning
                          >
                            {timeAgo(notif.createdAt)}
                          </span>
                          {notif.runCount > 1 && (
                            <span className="ib-sys-run-count">
                              ×{notif.runCount}
                            </span>
                          )}
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

                        {/* Inline next-action + snooze (audit P0/P2) */}
                        <div className="ib-sys-row-tools">
                          {notif.nextAction && (
                            <Link
                              href={notif.nextAction.href}
                              className="ib-sys-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                markRead(notif.id);
                              }}
                            >
                              {notif.nextAction.label}
                              <span aria-hidden>→</span>
                            </Link>
                          )}
                          {/* Snooze only on Action / Compliance — FYI items
                            already auto-archive; money is terminal. */}
                          {(notif.category === "action" ||
                            notif.category === "compliance") && (
                            <div className="ib-sys-snooze-wrap">
                              <button
                                type="button"
                                className="ib-sys-snooze-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const nextEl = e.currentTarget
                                    .nextElementSibling as HTMLElement | null;
                                  nextEl?.classList.toggle("is-open");
                                }}
                                aria-label="Snooze this item"
                                title="Snooze"
                              >
                                Snooze
                              </button>
                              <div className="ib-sys-snooze-menu">
                                {(
                                  [
                                    ["1h", 1],
                                    ["3h", 3],
                                    ["Tomorrow", 18],
                                    ["Next week", 24 * 7],
                                  ] as const
                                ).map(([label, hours]) => (
                                  <button
                                    key={label}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      snoozeNotif(notif.id, hours);
                                      (
                                        e.currentTarget
                                          .parentElement as HTMLElement
                                      ).classList.remove("is-open");
                                    }}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {/* P1-D: Why this? — Oracle feature attribution */}
                        <button
                          type="button"
                          className="ib-sys-why-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setExpandedWhyId(
                              expandedWhyId === notif.id ? null : notif.id,
                            );
                          }}
                          aria-expanded={expandedWhyId === notif.id}
                          aria-label="Why this notification?"
                        >
                          {expandedWhyId === notif.id
                            ? "Why this ▴"
                            : "Why this?"}
                        </button>
                        {expandedWhyId === notif.id && (
                          <div className="ib-sys-why-panel">
                            <ul className="ib-sys-why-list">
                              {getWhyReasons(notif).map((r, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
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
                    /* Use div+onClick (not Link) so that inner action
                       Links don't create invalid nested <a> elements. */
                    <div
                      key={notif.id}
                      role="button"
                      tabIndex={0}
                      className={rowClass}
                      onClick={() => {
                        markRead(notif.id);
                        router.push(notif.href!);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          markRead(notif.id);
                          router.push(notif.href!);
                        }
                      }}
                    >
                      {inner}
                    </div>
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
    </div>
  );
}
