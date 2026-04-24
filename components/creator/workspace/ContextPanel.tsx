"use client";

// Push Creator Workspace — ContextPanel  (Wave 3)
// Design.md: --surface-bright bg, 16px padding, --line dividers
// Collapsible on 768-1024px (280ms slide animation)
// Wave 3: page-aware contextual content via usePathname()

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./workspace.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuickStat {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
}

export interface Deadline {
  label: string;
  date: string;
  href?: string;
  urgent?: boolean;
}

export interface QuickAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export interface WeeklyEarnings {
  value: string;
  delta?: string;
  deltaPositive?: boolean;
}

export interface ContextPanelProps {
  /** Weekly earnings hero block */
  earnings?: WeeklyEarnings;
  /** Quick stats (2–3 items) */
  stats?: QuickStat[];
  /** Upcoming deadlines (2–3 items) */
  deadlines?: Deadline[];
  /** Quick action buttons (max 2) */
  actions?: QuickAction[];
  /** Whether panel starts collapsed */
  defaultCollapsed?: boolean;
}

// ---------------------------------------------------------------------------
// Per-page context definitions
// ---------------------------------------------------------------------------

interface PageContext {
  title: string;
  earnings?: WeeklyEarnings;
  stats?: QuickStat[];
  deadlines?: Deadline[];
  actions?: QuickAction[];
}

function getPageContext(pathname: string): PageContext {
  // /creator/work/today
  if (pathname.includes("/work/today")) {
    return {
      title: "Today's Schedule",
      earnings: {
        value: "$84",
        delta: "+$12 vs yesterday",
        deltaPositive: true,
      },
      stats: [
        { label: "Scans Today", value: "7", delta: "+3", deltaPositive: true },
        { label: "Daily Goal", value: "70%", delta: "10 left" },
      ],
      deadlines: [
        {
          label: "Lighthouse Coffee",
          date: "2:00 PM",
          href: "/creator/work/today",
        },
        {
          label: "Breads Bakery",
          date: "5:30 PM",
          href: "/creator/work/today",
        },
      ],
      actions: [
        {
          label: "Log a Scan",
          href: "/creator/work/today",
          variant: "primary",
        },
        {
          label: "View Schedule",
          href: "/creator/work/calendar",
          variant: "secondary",
        },
      ],
    };
  }

  // /creator/work/pipeline
  if (pathname.includes("/work/pipeline")) {
    return {
      title: "Pipeline Summary",
      stats: [
        { label: "Applied", value: "3", delta: "pending" },
        { label: "Active", value: "2", delta: "live" },
        {
          label: "Potential",
          value: "$240",
          delta: "this week",
          deltaPositive: true,
        },
      ],
      deadlines: [
        {
          label: "Breads Bakery",
          date: "2 days",
          urgent: true,
          href: "/creator/work/pipeline",
        },
        { label: "Café Vita", date: "5 days", href: "/creator/work/pipeline" },
      ],
      actions: [
        {
          label: "Browse Campaigns",
          href: "/creator/discover",
          variant: "primary",
        },
        {
          label: "My Pipeline",
          href: "/creator/work/pipeline",
          variant: "secondary",
        },
      ],
    };
  }

  // /creator/work/calendar
  if (pathname.includes("/work/calendar")) {
    return {
      title: "This Month",
      earnings: { value: "$320", delta: "April target", deltaPositive: false },
      stats: [
        {
          label: "Events This Month",
          value: "8",
          delta: "+2",
          deltaPositive: true,
        },
        { label: "Confirmed", value: "5", delta: "locked" },
      ],
      deadlines: [
        {
          label: "Lighthouse Coffee",
          date: "Apr 19",
          href: "/creator/work/calendar",
        },
        {
          label: "Breads Bakery",
          date: "Apr 21",
          href: "/creator/work/calendar",
        },
        { label: "Sweetleaf", date: "Apr 24", href: "/creator/work/calendar" },
      ],
      actions: [
        {
          label: "Add Event",
          href: "/creator/work/calendar",
          variant: "primary",
        },
      ],
    };
  }

  // /creator/work/drafts
  if (pathname.includes("/work/drafts")) {
    return {
      title: "Drafts Summary",
      stats: [
        {
          label: "Ready to Submit",
          value: "2",
          delta: "action needed",
          deltaPositive: true,
        },
        { label: "Overdue", value: "1", delta: "urgent" },
        { label: "Approved", value: "4", delta: "this month" },
      ],
      deadlines: [
        {
          label: "Breads Bakery reel",
          date: "Overdue",
          urgent: true,
          href: "/creator/work/drafts",
        },
        {
          label: "Lighthouse story",
          date: "Due tomorrow",
          href: "/creator/work/drafts",
        },
      ],
      actions: [
        {
          label: "Submit Drafts",
          href: "/creator/work/drafts",
          variant: "primary",
        },
      ],
    };
  }

  // /creator/discover
  if (pathname.startsWith("/creator/discover")) {
    return {
      title: "Your Match Score",
      stats: [
        {
          label: "Campaigns Matched",
          value: "4",
          delta: "this week",
          deltaPositive: true,
        },
        { label: "Earn Rate", value: "$40+", delta: "avg" },
      ],
      deadlines: [
        {
          label: "Lighthouse Coffee",
          date: "$45/visit",
          href: "/creator/discover",
        },
        { label: "Sweetleaf", date: "$38/visit", href: "/creator/discover" },
      ],
      actions: [
        { label: "Apply Now", href: "/creator/discover", variant: "primary" },
        {
          label: "Adjust Filters",
          href: "/creator/discover",
          variant: "secondary",
        },
      ],
    };
  }

  // /creator/inbox
  if (pathname.startsWith("/creator/inbox")) {
    return {
      title: "Inbox Summary",
      stats: [
        { label: "Unread Messages", value: "3", delta: "new" },
        {
          label: "Pending Invites",
          value: "2",
          delta: "respond",
          deltaPositive: true,
        },
      ],
      deadlines: [
        {
          label: "Breads Bakery",
          date: "Invited you",
          urgent: false,
          href: "/creator/inbox",
        },
        {
          label: "Lighthouse Coffee",
          date: "New message",
          href: "/creator/inbox",
        },
      ],
      actions: [
        { label: "View Invites", href: "/creator/inbox", variant: "primary" },
        { label: "Open Inbox", href: "/creator/inbox", variant: "secondary" },
      ],
    };
  }

  // /creator/portfolio (and sub-pages)
  if (pathname.startsWith("/creator/portfolio")) {
    return {
      title: "Your Profile",
      earnings: { value: "847", delta: "Creator Score", deltaPositive: true },
      stats: [
        {
          label: "Profile Complete",
          value: "72%",
          delta: "+8% this week",
          deltaPositive: true,
        },
        { label: "Current Tier", value: "Operator", delta: "→ Proven" },
      ],
      deadlines: [
        {
          label: "Add portfolio link",
          date: "+12 pts",
          href: "/creator/portfolio",
        },
        { label: "Verify phone", date: "+8 pts", href: "/creator/portfolio" },
      ],
      actions: [
        {
          label: "Complete Profile",
          href: "/creator/portfolio",
          variant: "primary",
        },
      ],
    };
  }

  // Default / fallback
  return {
    title: "Quick Stats",
    earnings: { value: "$84", delta: "+$12 this week", deltaPositive: true },
    stats: [
      { label: "Active Campaigns", value: "2", delta: "live" },
      {
        label: "Scans This Week",
        value: "31",
        delta: "+6",
        deltaPositive: true,
      },
      { label: "Conversion", value: "68%", delta: "+4%", deltaPositive: true },
    ],
    deadlines: [{ label: "No upcoming deadlines", date: "" }],
    actions: [
      {
        label: "Explore Campaigns",
        href: "/creator/discover",
        variant: "primary",
      },
      {
        label: "View Earnings",
        href: "/creator/portfolio",
        variant: "secondary",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Collapse icon
// ---------------------------------------------------------------------------

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      aria-hidden="true"
      style={{
        transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
        transition: "transform 200ms ease",
        flexShrink: 0,
      }}
    >
      <path strokeLinecap="square" strokeLinejoin="miter" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ContextPanel({
  earnings: earningsProp,
  stats: statsProp,
  deadlines: deadlinesProp,
  actions: actionsProp,
  defaultCollapsed = false,
}: ContextPanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const pathname = usePathname();

  // Per-page context — memoised to avoid re-computation on unrelated re-renders
  const ctx = useMemo(() => getPageContext(pathname), [pathname]);
  const earnings = earningsProp ?? ctx.earnings;
  const stats = statsProp ?? ctx.stats ?? [];
  const deadlines = deadlinesProp ?? ctx.deadlines ?? [];
  const actions = actionsProp ?? ctx.actions ?? [];

  const visibleActions = actions.slice(0, 2);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <aside
      className={`ws-context${collapsed ? " ws-context--collapsed" : ""}`}
      aria-label="Context panel"
    >
      {/* ── Header ── */}
      <div className="ws-context__header">
        <span className="ws-context__title">{ctx.title}</span>
        {/* Collapse toggle — visible on tablet via CSS */}
        <button
          className="ws-context__collapse-btn"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={
            collapsed ? "Expand context panel" : "Collapse context panel"
          }
          type="button"
        >
          <CollapseIcon collapsed={collapsed} />
        </button>
      </div>

      {/* ── Body — hidden from AT when panel is collapsed ── */}
      <div
        className="ws-context__body"
        aria-hidden={collapsed ? "true" : undefined}
      >
        {/* Earnings / hero block — only when defined for this page */}
        {earnings && (
          <>
            <div className="ws-context__earnings">
              <span className="ws-context__earnings-label">
                {pathname.startsWith("/creator/portfolio")
                  ? "Creator Score"
                  : "Earnings"}
              </span>
              <span className="ws-context__earnings-value">
                {earnings.value}
              </span>
              {earnings.delta && (
                <span
                  className={`ws-context__earnings-delta${
                    earnings.deltaPositive
                      ? " ws-context__earnings-delta--up"
                      : ""
                  }`}
                >
                  {earnings.deltaPositive ? "↑ " : ""}
                  {earnings.delta}
                </span>
              )}
            </div>
            <div className="ws-context__divider" aria-hidden="true" />
          </>
        )}

        {/* Quick Stats */}
        {stats.length > 0 && (
          <>
            <section className="ws-context__section">
              <div className="ws-context__section-label">Stats</div>
              <div className="ws-context__stats">
                {stats.map((stat, i) => (
                  <div key={i} className="ws-context__stat">
                    <span className="ws-context__stat-value">{stat.value}</span>
                    <span className="ws-context__stat-label">{stat.label}</span>
                    {stat.delta && (
                      <span
                        className={`ws-context__stat-delta${
                          stat.deltaPositive
                            ? " ws-context__stat-delta--up"
                            : ""
                        }`}
                      >
                        {stat.delta}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
            <div className="ws-context__divider" aria-hidden="true" />
          </>
        )}

        {/* Upcoming / contextual list */}
        {deadlines.length > 0 && (
          <>
            <section className="ws-context__section">
              <div className="ws-context__section-label">Upcoming</div>
              <ul className="ws-context__deadlines" role="list">
                {deadlines.map((d, i) => (
                  <li key={i} className="ws-context__deadline">
                    {d.href ? (
                      <Link
                        href={d.href}
                        className={`ws-context__deadline-inner ws-context__deadline-inner--link${
                          d.urgent ? " ws-context__deadline-inner--urgent" : ""
                        }`}
                      >
                        <span className="ws-context__deadline-label">
                          {d.label}
                        </span>
                        {d.date && (
                          <span className="ws-context__deadline-date">
                            {d.date}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <div
                        className={`ws-context__deadline-inner${
                          d.urgent ? " ws-context__deadline-inner--urgent" : ""
                        }`}
                      >
                        <span className="ws-context__deadline-label">
                          {d.label}
                        </span>
                        {d.date && (
                          <span className="ws-context__deadline-date">
                            {d.date}
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
            <div className="ws-context__divider" aria-hidden="true" />
          </>
        )}

        {/* Quick Actions */}
        {visibleActions.length > 0 && (
          <section className="ws-context__section ws-context__section--actions">
            {visibleActions.map((action, i) =>
              action.href ? (
                <Link
                  key={i}
                  href={action.href}
                  className={`ws-context__action${
                    action.variant === "primary"
                      ? " ws-context__action--primary"
                      : ""
                  }`}
                >
                  {action.label}
                </Link>
              ) : (
                <button
                  key={i}
                  type="button"
                  className={`ws-context__action${
                    action.variant === "primary"
                      ? " ws-context__action--primary"
                      : ""
                  }`}
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              ),
            )}
          </section>
        )}
      </div>
    </aside>
  );
}
