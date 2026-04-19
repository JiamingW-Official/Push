"use client";

import Link from "next/link";
import { useState } from "react";
import "./today.css";

/* ── Types ─────────────────────────────────────────────────── */

type TaskStatus = "upcoming" | "active" | "done" | "free";

type TimelineTask = {
  id: string;
  time: string;
  endTime?: string;
  status: TaskStatus;
  campaignName: string;
  merchantName: string;
  category: string;
  earnBadge: string; // e.g. "$24"
  logoInitials: string;
  logoColor: string;
};

type StatItem = {
  label: string;
  value: string;
  ghost: string;
  sublabel?: string;
};

type ActivityItem = {
  id: string;
  type: "scan" | "submission" | "approval" | "message";
  text: string;
  time: string;
};

/* ── Mock data ─────────────────────────────────────────────── */

const TODAY_STATS: StatItem[] = [
  {
    label: "Scans Today",
    value: "7",
    ghost: "07",
    sublabel: "+3 vs yesterday",
  },
  {
    label: "Active Campaigns",
    value: "3",
    ghost: "03",
    sublabel: "2 due this week",
  },
  {
    label: "Est. Earnings",
    value: "$128",
    ghost: "$128",
    sublabel: "This session",
  },
];

const TIMELINE_TASKS: TimelineTask[] = [
  {
    id: "t1",
    time: "10:00",
    endTime: "11:30",
    status: "done",
    campaignName: "Morning Coffee Story",
    merchantName: "Blank Street Coffee",
    category: "Coffee",
    earnBadge: "$18",
    logoInitials: "BS",
    logoColor: "#003049",
  },
  {
    id: "t2",
    time: "12:30",
    endTime: "14:00",
    status: "active",
    campaignName: "Lunch Reel Campaign",
    merchantName: "Superiority Burger",
    category: "Food",
    earnBadge: "$32",
    logoInitials: "SB",
    logoColor: "#c1121f",
  },
  {
    id: "t3",
    time: "14:00",
    endTime: "15:30",
    status: "free",
    campaignName: "",
    merchantName: "",
    category: "",
    earnBadge: "",
    logoInitials: "",
    logoColor: "",
  },
  {
    id: "t4",
    time: "16:00",
    endTime: "17:30",
    status: "upcoming",
    campaignName: "Afternoon Lifestyle Post",
    merchantName: "Flamingo Estate",
    category: "Lifestyle",
    earnBadge: "$44",
    logoInitials: "FE",
    logoColor: "#c9a96e",
  },
  {
    id: "t5",
    time: "18:00",
    endTime: "19:00",
    status: "upcoming",
    campaignName: "Matcha Bar Content",
    merchantName: "Cha Cha Matcha",
    category: "Coffee",
    earnBadge: "$34",
    logoInitials: "CC",
    logoColor: "#669bbc",
  },
];

const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    type: "approval",
    text: "Content approved — Blank Street Coffee",
    time: "9:42 AM",
  },
  {
    id: "a2",
    type: "scan",
    text: "QR scan verified — Superiority Burger",
    time: "12:51 PM",
  },
  {
    id: "a3",
    type: "submission",
    text: "Submission received — Flamingo Estate review pending",
    time: "1:14 PM",
  },
];

/* ── Helpers ──────────────────────────────────────────────── */

const STATUS_LABEL: Record<TaskStatus, string> = {
  upcoming: "UPCOMING",
  active: "ACTIVE",
  done: "DONE",
  free: "FREE",
};

const ACTIVITY_ICONS: Record<ActivityItem["type"], string> = {
  scan: "◈",
  submission: "◆",
  approval: "✓",
  message: "◉",
};

const ACTIVITY_COLORS: Record<ActivityItem["type"], string> = {
  scan: "var(--tertiary)",
  submission: "var(--champagne)",
  approval: "var(--primary)",
  message: "var(--graphite)",
};

// Group tasks into morning / afternoon / evening
function getTimeGroup(time: string): "MORNING" | "AFTERNOON" | "EVENING" {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour < 12) return "MORNING";
  if (hour < 17) return "AFTERNOON";
  return "EVENING";
}

/* ── Component ─────────────────────────────────────────────── */

export default function WorkTodayPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>("t2");

  const completedCount = TIMELINE_TASKS.filter(
    (t) => t.status === "done",
  ).length;
  const totalPaid = TIMELINE_TASKS.filter((t) => t.status !== "free").reduce(
    (sum, t) => sum + parseInt(t.earnBadge.replace("$", "") || "0"),
    0,
  );
  const activeCampaign = TIMELINE_TASKS.find((t) => t.status === "active");
  const scheduledTasks = TIMELINE_TASKS.filter((t) => t.status !== "free");

  // Build time-grouped sections
  const groups: { label: string; tasks: TimelineTask[] }[] = [];
  const seen = new Set<string>();
  for (const task of TIMELINE_TASKS) {
    const group = getTimeGroup(task.time);
    if (!seen.has(group)) {
      seen.add(group);
      groups.push({ label: group, tasks: [] });
    }
    groups[groups.length - 1].tasks.push(task);
  }

  return (
    <div className="wt-page">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="wt-nav">
        <Link href="/creator/dashboard" className="wt-nav-back">
          ← WORKSPACE
        </Link>
        <span className="wt-nav-sep">|</span>
        <span className="wt-nav-title">WORK TODAY</span>
        <div className="wt-nav-right">
          <Link href="/creator/work/pipeline" className="wt-nav-link">
            Pipeline →
          </Link>
        </div>
      </nav>

      {/* ── Hero Header ─────────────────────────────────────── */}
      <header className="wt-hero">
        <div className="wt-hero-inner">
          <div className="wt-hero-left">
            <p className="wt-eyebrow">
              FRIDAY · APR 18 · {TODAY_STATS[1].value} ACTIVE CAMPAIGNS
            </p>
            {/* Editorial date: weight contrast */}
            <div className="wt-date-block">
              <h1 className="wt-date-day">FRIDAY</h1>
              <p className="wt-date-month">April 18</p>
            </div>
            <div className="wt-progress-row">
              <span className="wt-progress-text">
                {completedCount} of {scheduledTasks.length} tasks completed
              </span>
              <div className="wt-progress-bar">
                <div
                  className="wt-progress-fill"
                  style={{
                    width: `${scheduledTasks.length ? (completedCount / scheduledTasks.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="wt-hero-right">
            <p className="wt-earnings-label">POTENTIAL EARNINGS TODAY</p>
            <p className="wt-earnings-value">${totalPaid}</p>
            <p className="wt-earnings-sub">
              across {scheduledTasks.length} campaigns
            </p>
          </div>
        </div>
      </header>

      {/* ── Stats Strip — 3 editorial numbers ─────────────────── */}
      <section className="wt-stats-strip">
        {TODAY_STATS.map((stat) => (
          <div key={stat.label} className="wt-stat-card">
            <span className="wt-stat-ghost" aria-hidden="true">
              {stat.ghost}
            </span>
            <div className="wt-stat-body">
              <span className="wt-stat-value">{stat.value}</span>
              <span className="wt-stat-label">{stat.label}</span>
              {stat.sublabel && (
                <span className="wt-stat-sub">{stat.sublabel}</span>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ── Main Layout ─────────────────────────────────────── */}
      <div className="wt-body">
        {/* ── Timeline ────────────────────────────────────────── */}
        <section className="wt-timeline-section">
          <div className="wt-section-header">
            <h2 className="wt-section-title">TODAY&apos;S SCHEDULE</h2>
            <Link href="/creator/campaigns" className="wt-section-link">
              Browse more →
            </Link>
          </div>

          <div className="wt-timeline">
            <div className="wt-timeline-axis" aria-hidden="true" />

            {groups.map(({ label, tasks }) => (
              <div key={label} className="wt-time-group">
                {/* Time group eyebrow */}
                <div className="wt-time-group-label">
                  <span>{label}</span>
                </div>

                {tasks.map((task) => {
                  if (task.status === "free") {
                    return (
                      <div
                        key={task.id}
                        className="wt-timeline-row wt-timeline-free"
                      >
                        <div className="wt-time-label">
                          <span>{task.time}</span>
                          <span className="wt-time-end">{task.endTime}</span>
                        </div>
                        <div className="wt-timeline-dot wt-dot-free" />
                        <div className="wt-free-block">
                          <span className="wt-free-text">
                            Free window · No commitments
                          </span>
                          <Link href="/creator/explore" className="wt-free-cta">
                            + Find campaign
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  const isSelected = selectedTask === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`wt-timeline-row wt-timeline-task wt-status-${task.status}${isSelected ? " wt-selected" : ""}`}
                      onClick={() =>
                        setSelectedTask(isSelected ? null : task.id)
                      }
                      role="button"
                      tabIndex={0}
                      aria-expanded={isSelected}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        setSelectedTask(isSelected ? null : task.id)
                      }
                    >
                      <div className="wt-time-label">
                        <span>{task.time}</span>
                        <span className="wt-time-end">{task.endTime}</span>
                      </div>

                      <div
                        className={`wt-timeline-dot wt-dot-${task.status}`}
                      />

                      <div className="wt-task-content">
                        <div className="wt-task-main">
                          <div
                            className="wt-task-logo"
                            style={{ background: task.logoColor }}
                            aria-hidden="true"
                          >
                            {task.logoInitials}
                          </div>
                          <div className="wt-task-info">
                            <p className="wt-task-campaign">
                              {task.campaignName}
                            </p>
                            <p className="wt-task-merchant">
                              {task.merchantName}
                              {/* Pulsing LIVE indicator for active */}
                              {task.status === "active" && (
                                <span className="wt-active-indicator">
                                  <span className="wt-active-dot" />
                                  LIVE
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="wt-task-meta">
                            <span className="wt-task-category">
                              {task.category}
                            </span>
                            <span className="wt-task-earn">
                              {task.earnBadge}
                            </span>
                          </div>
                          <span
                            className={`wt-status-chip wt-chip-${task.status}`}
                          >
                            {STATUS_LABEL[task.status]}
                          </span>
                        </div>

                        {/* Expanded actions */}
                        {isSelected && (
                          <div className="wt-task-expanded">
                            <div className="wt-task-actions">
                              {task.status === "active" && (
                                <Link
                                  href={`/creator/campaigns/demo-campaign-001/post`}
                                  className="wt-action-btn wt-action-primary"
                                >
                                  Submit Content
                                </Link>
                              )}
                              {task.status === "upcoming" && (
                                <button className="wt-action-btn wt-action-secondary">
                                  Mark Arrived
                                </button>
                              )}
                              {task.status === "done" && (
                                <span className="wt-action-done">
                                  ✓ Completed
                                </span>
                              )}
                              <Link
                                href={`/creator/campaigns/demo-campaign-001`}
                                className="wt-action-btn wt-action-ghost"
                              >
                                View Details
                              </Link>
                              <Link
                                href="/creator/messages"
                                className="wt-action-btn wt-action-ghost"
                              >
                                Message Merchant
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* ── Sidebar ───────────────────────────────────────── */}
        <aside className="wt-sidebar">
          {/* Active campaign CTA — shows earn in champagne */}
          {activeCampaign && (
            <div className="wt-cta-card">
              <p className="wt-cta-eyebrow">ACTIVE NOW</p>
              <p className="wt-cta-title">{activeCampaign.merchantName}</p>
              <p className="wt-cta-desc">{activeCampaign.campaignName}</p>
              <p className="wt-cta-earn">{activeCampaign.earnBadge} est.</p>
              <Link
                href="/creator/campaigns/demo-campaign-001/post"
                className="wt-cta-btn"
              >
                Submit Content →
              </Link>
            </div>
          )}

          {/* Recent Activity */}
          <div className="wt-activity-card">
            <h3 className="wt-activity-title">RECENT ACTIVITY</h3>
            <ul className="wt-activity-list">
              {RECENT_ACTIVITY.map((item) => (
                <li key={item.id} className="wt-activity-item">
                  <span
                    className="wt-activity-icon"
                    style={{ color: ACTIVITY_COLORS[item.type] }}
                    aria-hidden="true"
                  >
                    {ACTIVITY_ICONS[item.type]}
                  </span>
                  <div className="wt-activity-body">
                    <p className="wt-activity-text">{item.text}</p>
                    <p className="wt-activity-time">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pipeline shortcut */}
          <Link href="/creator/work/pipeline" className="wt-pipeline-shortcut">
            <div className="wt-pipeline-shortcut-left">
              <p className="wt-pipeline-shortcut-label">PIPELINE</p>
              <p className="wt-pipeline-shortcut-sub">
                12 campaigns · $2,100 potential
              </p>
            </div>
            <span className="wt-pipeline-shortcut-arrow">→</span>
          </Link>
        </aside>
      </div>

      {/* ── Empty state ────────────────────────────────────────── */}
      {TIMELINE_TASKS.length === 0 && (
        <div className="wt-empty">
          <p className="wt-empty-ghost" aria-hidden="true">
            REST
          </p>
          <p className="wt-empty-title">No commitments today</p>
          <p className="wt-empty-sub">
            Take a break, or find your next opportunity
          </p>
          <Link href="/creator/explore" className="wt-empty-cta">
            Browse campaigns →
          </Link>
        </div>
      )}
    </div>
  );
}
