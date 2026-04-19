"use client";

// Push Creator Workspace — ContextPanel  (Wave 2)
// Design.md: --surface-bright bg, 16px padding, --line dividers
// Collapsible on 768-1024px (280ms slide animation)
// Sections: Weekly earnings hero → quick stats → deadlines → quick actions

import { useState } from "react";
import Link from "next/link";
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
// Default / fallback content
// ---------------------------------------------------------------------------

const DEFAULT_EARNINGS: WeeklyEarnings = {
  value: "$0",
  delta: "—",
  deltaPositive: false,
};

const DEFAULT_STATS: QuickStat[] = [
  { label: "Active Scans", value: "0", delta: "—" },
  { label: "Campaigns", value: "0", delta: "—" },
  { label: "Conversion", value: "—%", delta: "—" },
];

const DEFAULT_DEADLINES: Deadline[] = [
  { label: "No upcoming deadlines", date: "", urgent: false },
];

const DEFAULT_ACTIONS: QuickAction[] = [
  { label: "Explore Campaigns", href: "/creator/explore", variant: "primary" },
  { label: "View Earnings", href: "/creator/earnings", variant: "secondary" },
];

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
  earnings = DEFAULT_EARNINGS,
  stats = DEFAULT_STATS,
  deadlines = DEFAULT_DEADLINES,
  actions = DEFAULT_ACTIONS,
  defaultCollapsed = false,
}: ContextPanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const visibleActions = actions.slice(0, 2);

  return (
    <aside
      className={`ws-context${collapsed ? " ws-context--collapsed" : ""}`}
      aria-label="Context panel"
    >
      {/* ── Header ── */}
      <div className="ws-context__header">
        <span className="ws-context__title">This Week</span>
        {/* Collapse toggle — visible on tablet via CSS */}
        <button
          className="ws-context__collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-label={
            collapsed ? "Expand context panel" : "Collapse context panel"
          }
          type="button"
        >
          <CollapseIcon collapsed={collapsed} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="ws-context__body" aria-hidden={collapsed}>
        {/* Weekly earnings hero block */}
        <div className="ws-context__earnings">
          <span className="ws-context__earnings-label">Earnings This Week</span>
          <span className="ws-context__earnings-value">{earnings.value}</span>
          {earnings.delta && (
            <span
              className={`ws-context__earnings-delta${
                earnings.deltaPositive ? " ws-context__earnings-delta--up" : ""
              }`}
            >
              {earnings.deltaPositive ? "↑ " : ""}
              {earnings.delta} vs last week
            </span>
          )}
        </div>

        <div className="ws-context__divider" aria-hidden="true" />

        {/* Quick Stats */}
        <section className="ws-context__section">
          <div className="ws-context__section-label">Period Stats</div>
          <div className="ws-context__stats">
            {stats.map((stat, i) => (
              <div key={i} className="ws-context__stat">
                <span className="ws-context__stat-value">{stat.value}</span>
                <span className="ws-context__stat-label">{stat.label}</span>
                {stat.delta && (
                  <span
                    className={`ws-context__stat-delta${
                      stat.deltaPositive ? " ws-context__stat-delta--up" : ""
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

        {/* Upcoming Deadlines */}
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

        {/* Quick Actions */}
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
      </div>
    </aside>
  );
}
