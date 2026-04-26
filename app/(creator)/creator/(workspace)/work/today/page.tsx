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
    logoColor: "#3a3835",
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
    logoColor: "#0085ff",
  },
];

/* ── Helpers ──────────────────────────────────────────────── */

const STATUS_LABEL: Record<TaskStatus, string> = {
  upcoming: "UPCOMING",
  active: "ACTIVE",
  done: "DONE",
  free: "FREE",
};

// Group tasks into morning / afternoon / evening
function getTimeGroup(time: string): "MORNING" | "AFTERNOON" | "EVENING" {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour < 12) return "MORNING";
  if (hour < 17) return "AFTERNOON";
  return "EVENING";
}

// Convert "HH:MM" to fractional hour
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

// Format day name
function getDayName(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

// Format month + day
function getMonthDay(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
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

  // Now-line
  const [nowTime, setNowTime] = useState<Date>(new Date());
  const timelineRef = useRef<HTMLDivElement>(null);

  // Quick-add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addHour, setAddHour] = useState("09:00");
  const [addText, setAddText] = useState("");

  // Update current time every minute
  useEffect(() => {
    const id = setInterval(() => setNowTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  /* ── Derived values ─────────────────────────────────────────── */
  const scheduledTasks = tasks.filter((t) => t.status !== "free");
  const totalPotential = scheduledTasks.reduce(
    (sum, t) => sum + parseBadge(t.earnBadge),
    0,
  );

  const activeCampaign = tasks.find((t) => t.status === "active");
  const upcomingCount = tasks.filter(
    (t) => t.status === "upcoming" || t.status === "active",
  ).length;

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
      logoInitials: "+",
      logoColor: "#0085ff",
    };
    setTasks((prev) => {
      const next = [...prev, newTask];
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
    <div className="cw-page wt-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">
            {getDayName(nowTime)} · {getMonthDay(nowTime)}
            {upcomingCount > 0
              ? ` · ${upcomingCount} SHOOT${upcomingCount > 1 ? "S" : ""} · $${totalPotential}`
              : ""}
          </p>
          <h1 className="cw-title">Today&apos;s work</h1>
        </div>
        <div className="cw-header__right">
          <Link href="/creator/work/pipeline" className="cw-pill">
            Pipeline →
          </Link>
          <Link href="/creator/discover" className="cw-pill cw-pill--urgent">
            + Browse campaigns
          </Link>
        </div>
      </header>

      {/* ── Quick stats row ──────────────────────────────────── */}
      <div className="wt-stats-row">
        <div className="wt-stat-chip">
          <span className="wt-stat-val">
            {
              tasks.filter(
                (t) => t.status === "upcoming" || t.status === "active",
              ).length
            }
          </span>
          <span className="wt-stat-lbl eyebrow">Due Today</span>
        </div>
        <div className="wt-stat-chip">
          <span className="wt-stat-val">
            {tasks.filter((t) => t.status === "active").length}
          </span>
          <span className="wt-stat-lbl eyebrow">Active Now</span>
        </div>
        <div className="wt-stat-chip">
          <span className="wt-stat-val">${totalPotential}</span>
          <span className="wt-stat-lbl eyebrow">Potential</span>
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────────────────── */}
      <div className="wt-body">
        {/* ── Timeline ──────────────────────────────────────── */}
        <section className="wt-timeline-section">
          <div className="wt-section-header">
            <h2 className="wt-section-title eyebrow">TODAY&apos;S SCHEDULE</h2>
            <Link href="/creator/campaigns" className="wt-section-link">
              Browse more →
            </Link>
          </div>

          <div className="wt-timeline" ref={timelineRef}>
            <div className="wt-timeline-axis" aria-hidden="true" />

            {/* NOW line */}
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
                <div className="wt-time-group-label eyebrow">
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
                          {/* Complete toggle */}
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

                          {/* Status chip */}
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
                                  className="wt-action-btn wt-action-primary btn-primary click-shift"
                                >
                                  Submit Content
                                </Link>
                              )}
                              {!isDone && task.status === "upcoming" && (
                                <button className="wt-action-btn wt-action-secondary btn-ghost click-shift">
                                  Mark Arrived
                                </button>
                              )}
                              <button
                                className={`wt-action-btn ${isDone ? "wt-action-ghost" : "wt-action-secondary"} btn-ghost click-shift`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleComplete(task.id);
                                }}
                              >
                                {isDone ? "↩ Undo Complete" : "✓ Mark Done"}
                              </button>
                              <Link
                                href="/creator/campaigns/demo-campaign-001"
                                className="wt-action-btn wt-action-ghost btn-ghost click-shift"
                              >
                                View Details
                              </Link>
                              <Link
                                href="/creator/messages"
                                className="wt-action-btn wt-action-ghost btn-ghost click-shift"
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

            {/* Quick add task */}
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
                    className="wt-add-submit-btn btn-primary"
                    disabled={!addText.trim()}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="wt-add-cancel-btn btn-ghost"
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

        {/* ── Sidebar — ONE card ──────────────────────────────── */}
        <aside className="wt-sidebar">
          {/* Active campaign CTA — primary action */}
          {activeCampaign && !completedIds.has(activeCampaign.id) ? (
            <div className="wt-cta-card candy-panel">
              <p className="wt-cta-eyebrow eyebrow">ACTIVE NOW</p>
              <p className="wt-cta-title">{activeCampaign.merchantName}</p>
              <p className="wt-cta-desc">{activeCampaign.campaignName}</p>
              <p className="wt-cta-earn">{activeCampaign.earnBadge} est.</p>
              <Link
                href="/creator/campaigns/demo-campaign-001/post"
                className="btn-primary click-shift wt-cta-btn"
              >
                Submit Content →
              </Link>
            </div>
          ) : (
            /* Pipeline shortcut when no active campaign */
            <Link
              href="/creator/work/pipeline"
              className="wt-pipeline-shortcut click-shift"
            >
              <div className="wt-pipeline-shortcut-left">
                <p className="wt-pipeline-shortcut-label eyebrow">PIPELINE</p>
                <p className="wt-pipeline-shortcut-sub">
                  12 campaigns · $2,100 potential
                </p>
              </div>
              <span className="wt-pipeline-shortcut-arrow">→</span>
            </Link>
          )}
        </aside>
      </div>

      {/* ── Empty state ──────────────────────────────────────── */}
      {tasks.length === 0 && (
        <div className="wt-empty">
          <p className="wt-empty-title">No commitments today</p>
          <p className="wt-empty-sub">
            Take a break, or find your next opportunity
          </p>
          <Link
            href="/creator/explore"
            className="btn-primary click-shift wt-empty-cta"
          >
            Browse campaigns →
          </Link>
        </div>
      )}
    </div>
  );
}
