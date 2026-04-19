"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "./today.css";

/* ── Types ─────────────────────────────────────────────────── */

type TaskStatus = "upcoming" | "active" | "done" | "free";

type TimelineTask = {
  id: string;
  time: string; // "HH:MM" 24h
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

const INITIAL_TIMELINE_TASKS: TimelineTask[] = [
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

const INITIAL_STATS: StatItem[] = [
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

// Convert "HH:MM" to fractional hour (e.g. "14:30" → 14.5)
function timeToFractionalHour(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

// Parse earnBadge "$XX" to number
function parseBadge(badge: string): number {
  return parseInt(badge.replace("$", "") || "0", 10);
}

// Generate a unique id
let customTaskCounter = 100;
function nextCustomId() {
  return `custom-${++customTaskCounter}`;
}

// Format current time as "H:MM AM/PM"
function formatCurrentTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

// Determine task urgency relative to now
function getUrgency(
  task: TimelineTask,
  nowHour: number,
): "overdue" | "urgent" | "normal" {
  if (task.status === "free" || task.status === "done") return "normal";
  const taskHour = timeToFractionalHour(task.time);
  const endHour = task.endTime
    ? timeToFractionalHour(task.endTime)
    : taskHour + 1;
  if (nowHour > endHour) return "overdue";
  if (taskHour - nowHour <= 2 && nowHour <= taskHour) return "urgent";
  return "normal";
}

/* ── Hours for quick-add selector ────────────────────────── */
const HOUR_OPTIONS = Array.from({ length: 14 }, (_, i) => {
  const h = i + 8; // 8 AM – 9 PM
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return {
    label: `${h12}:00 ${ampm}`,
    value: `${h.toString().padStart(2, "0")}:00`,
  };
});

/* ── Component ─────────────────────────────────────────────── */

export default function WorkTodayPage() {
  // ── Core state ──────────────────────────────────────────────
  const [tasks, setTasks] = useState<TimelineTask[]>(INITIAL_TIMELINE_TASKS);
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () =>
      new Set(
        INITIAL_TIMELINE_TASKS.filter((t) => t.status === "done").map(
          (t) => t.id,
        ),
      ),
  );
  const [selectedTask, setSelectedTask] = useState<string | null>("t2");

  // ── Scan counter ────────────────────────────────────────────
  const [scanCount, setScanCount] = useState(7);
  const [scanPulse, setScanPulse] = useState(false);

  // ── Now-line ────────────────────────────────────────────────
  const [nowTime, setNowTime] = useState<Date>(new Date());
  const timelineRef = useRef<HTMLDivElement>(null);

  // ── Quick-add form ───────────────────────────────────────────
  const [showAddForm, setShowAddForm] = useState(false);
  const [addHour, setAddHour] = useState("09:00");
  const [addText, setAddText] = useState("");

  // ── Update current time every minute ────────────────────────
  useEffect(() => {
    const id = setInterval(() => setNowTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  /* ── Derived values ─────────────────────────────────────────── */
  const scheduledTasks = tasks.filter((t) => t.status !== "free");
  const completedCount = completedIds.size;
  const totalPotential = scheduledTasks.reduce(
    (sum, t) => sum + parseBadge(t.earnBadge),
    0,
  );

  // Projected today: completed earn + 50% of active task earn
  const projectedEarn = tasks.reduce((sum, t) => {
    if (t.status === "free") return sum;
    if (completedIds.has(t.id)) return sum + parseBadge(t.earnBadge);
    if (t.status === "active")
      return sum + Math.round(parseBadge(t.earnBadge) * 0.5);
    return sum;
  }, 0);

  const activeCampaign = tasks.find((t) => t.status === "active");

  // Now-line: fractional hour position in the 8–22 range (14h window)
  const nowHour = nowTime.getHours() + nowTime.getMinutes() / 60;
  const TIMELINE_START = 8;
  const TIMELINE_END = 22;
  const nowPct = Math.min(
    100,
    Math.max(
      0,
      ((nowHour - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100,
    ),
  );

  // Build time-grouped sections
  const groups: { label: string; tasks: TimelineTask[] }[] = [];
  const seen = new Set<string>();
  for (const task of tasks) {
    const group = getTimeGroup(task.time);
    if (!seen.has(group)) {
      seen.add(group);
      groups.push({ label: group, tasks: [] });
    }
    groups[groups.length - 1].tasks.push(task);
  }

  /* ── Handlers ───────────────────────────────────────────────── */

  function toggleComplete(id: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // Restore original status
        setTasks((ts) =>
          ts.map((t) => {
            if (t.id !== id) return t;
            const orig = INITIAL_TIMELINE_TASKS.find((x) => x.id === id);
            return orig ? { ...t, status: orig.status } : t;
          }),
        );
      } else {
        next.add(id);
        setTasks((ts) =>
          ts.map((t) => (t.id === id ? { ...t, status: "done" } : t)),
        );
      }
      return next;
    });
  }

  function handleScanIncrement() {
    setScanCount((n) => n + 1);
    setScanPulse(true);
    setTimeout(() => setScanPulse(false), 600);
  }

  function handleAddTask() {
    if (!addText.trim()) return;
    const newTask: TimelineTask = {
      id: nextCustomId(),
      time: addHour,
      endTime: undefined,
      status: "upcoming",
      campaignName: addText.trim(),
      merchantName: "Custom Reminder",
      category: "Other",
      earnBadge: "$0",
      logoInitials: "✚",
      logoColor: "#669bbc",
    };
    setTasks((prev) => {
      const next = [...prev, newTask];
      // Sort by time
      next.sort(
        (a, b) => timeToFractionalHour(a.time) - timeToFractionalHour(b.time),
      );
      return next;
    });
    setAddText("");
    setShowAddForm(false);
  }

  /* ── Render ─────────────────────────────────────────────────── */

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
              FRIDAY · APR 18 · {scheduledTasks.length} ACTIVE CAMPAIGNS
            </p>
            <div className="wt-date-block">
              <h1 className="wt-date-day">FRIDAY</h1>
              <p className="wt-date-month">April 18</p>
            </div>
            {/* Progress bar — updates as tasks complete */}
            <div className="wt-progress-row">
              <span className="wt-progress-text">
                {completedCount}/{scheduledTasks.length} tasks complete
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
            <p className="wt-earnings-value">${totalPotential}</p>
            <p className="wt-earnings-sub">
              across {scheduledTasks.length} campaigns
            </p>
          </div>
        </div>
      </header>

      {/* ── Stats Strip ─────────────────────────────────────── */}
      <section className="wt-stats-strip">
        {/* Scan counter — interactive */}
        <div className="wt-stat-card wt-stat-scan-card">
          <span className="wt-stat-ghost" aria-hidden="true">
            {scanCount.toString().padStart(2, "0")}
          </span>
          <div className="wt-stat-body">
            <span
              className={`wt-stat-value${scanPulse ? " wt-stat-pulse" : ""}`}
            >
              {scanCount}
            </span>
            <span className="wt-stat-label">Scans Today</span>
            <span className="wt-stat-sub">+3 vs yesterday</span>
          </div>
          <button
            className="wt-scan-plus-btn"
            onClick={handleScanIncrement}
            aria-label="Log one scan manually"
            title="Log scan"
          >
            +1
          </button>
        </div>

        {INITIAL_STATS.slice(1).map((stat) => (
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
        {/* ── Timeline ──────────────────────────────────────── */}
        <section className="wt-timeline-section">
          <div className="wt-section-header">
            <h2 className="wt-section-title">TODAY&apos;S SCHEDULE</h2>
            <Link href="/creator/campaigns" className="wt-section-link">
              Browse more →
            </Link>
          </div>

          <div className="wt-timeline" ref={timelineRef}>
            <div className="wt-timeline-axis" aria-hidden="true" />

            {/* ── NOW line ──────────────────────────────────── */}
            <div
              className="wt-now-line"
              style={{ top: `${nowPct}%` }}
              aria-label={`Current time: ${formatCurrentTime(nowTime)}`}
            >
              <span className="wt-now-label">
                NOW · {formatCurrentTime(nowTime)}
              </span>
            </div>

            {groups.map(({ label, tasks: groupTasks }) => (
              <div key={label} className="wt-time-group">
                <div className="wt-time-group-label">
                  <span>{label}</span>
                </div>

                {groupTasks.map((task) => {
                  const urgency = getUrgency(task, nowHour);
                  const isDone = completedIds.has(task.id);

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
                      className={[
                        "wt-timeline-row wt-timeline-task",
                        `wt-status-${isDone ? "done" : task.status}`,
                        isSelected ? "wt-selected" : "",
                        isDone ? "wt-task-completed" : "",
                        urgency === "urgent" ? "wt-task-urgent" : "",
                        urgency === "overdue" && !isDone
                          ? "wt-task-overdue"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
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
                        className={`wt-timeline-dot wt-dot-${isDone ? "done" : task.status}`}
                      />

                      <div className="wt-task-content">
                        <div className="wt-task-main">
                          {/* Complete toggle button */}
                          <button
                            className={`wt-complete-btn${isDone ? " wt-complete-btn--done" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComplete(task.id);
                            }}
                            aria-label={
                              isDone ? "Mark incomplete" : "Mark complete"
                            }
                            title={isDone ? "Undo" : "Mark done"}
                          >
                            {isDone ? "✓" : "○"}
                          </button>

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
                              {task.status === "active" && !isDone && (
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

                          {/* Urgency / status badges */}
                          {urgency === "overdue" && !isDone ? (
                            <span className="wt-status-chip wt-chip-overdue">
                              OVERDUE
                            </span>
                          ) : (
                            <span
                              className={`wt-status-chip wt-chip-${isDone ? "done" : task.status}`}
                            >
                              {isDone ? "DONE" : STATUS_LABEL[task.status]}
                            </span>
                          )}
                        </div>

                        {/* Expanded actions */}
                        {isSelected && (
                          <div className="wt-task-expanded">
                            <div className="wt-task-actions">
                              {!isDone && task.status === "active" && (
                                <Link
                                  href="/creator/campaigns/demo-campaign-001/post"
                                  className="wt-action-btn wt-action-primary"
                                >
                                  Submit Content
                                </Link>
                              )}
                              {!isDone && task.status === "upcoming" && (
                                <button className="wt-action-btn wt-action-secondary">
                                  Mark Arrived
                                </button>
                              )}
                              <button
                                className={`wt-action-btn ${isDone ? "wt-action-ghost" : "wt-action-secondary"}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleComplete(task.id);
                                }}
                              >
                                {isDone ? "↩ Undo Complete" : "✓ Mark Done"}
                              </button>
                              <Link
                                href="/creator/campaigns/demo-campaign-001"
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

            {/* ── Quick add task ───────────────────────────── */}
            <div className="wt-quick-add-zone">
              {showAddForm ? (
                <form
                  className="wt-quick-add-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask();
                  }}
                >
                  <select
                    className="wt-add-time-picker"
                    value={addHour}
                    onChange={(e) => setAddHour(e.target.value)}
                    aria-label="Select time"
                  >
                    {HOUR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    className="wt-add-text-input"
                    type="text"
                    placeholder="Reminder note…"
                    value={addText}
                    onChange={(e) => setAddText(e.target.value)}
                    autoFocus
                    aria-label="Reminder text"
                  />
                  <button
                    type="submit"
                    className="wt-add-submit-btn"
                    disabled={!addText.trim()}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="wt-add-cancel-btn"
                    onClick={() => {
                      setShowAddForm(false);
                      setAddText("");
                    }}
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  className="wt-quick-add-btn"
                  onClick={() => setShowAddForm(true)}
                  aria-label="Add a custom reminder"
                >
                  <span className="wt-quick-add-icon">+</span>
                  Add reminder
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="wt-sidebar">
          {/* Active campaign CTA */}
          {activeCampaign && !completedIds.has(activeCampaign.id) && (
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

          {/* ── Projected Earnings ───────────────────────── */}
          <div className="wt-projection-card">
            <p className="wt-projection-label">PROJECTED TODAY</p>
            <p className="wt-projection-value" key={projectedEarn}>
              ${projectedEarn}
            </p>
            <p className="wt-projection-sub">
              {completedCount} tasks done ·{" "}
              {scheduledTasks.length - completedCount} remaining
            </p>
            <div className="wt-projection-bar">
              <div
                className="wt-projection-fill"
                style={{
                  width: totalPotential
                    ? `${(projectedEarn / totalPotential) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <p className="wt-projection-cap">of ${totalPotential} potential</p>
          </div>
        </aside>
      </div>

      {/* ── Empty state ──────────────────────────────────────── */}
      {tasks.length === 0 && (
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
