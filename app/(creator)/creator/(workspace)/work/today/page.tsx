"use client";

/* ─────────────────────────────────────────────────────────────────────
 * Push — Creator Work · Today (v2 redesign)
 *
 * Layout (cw-* primitives, no bespoke chrome):
 *   header            cw-header
 *   NOW dark hero     cw-card--dark (only when an active task is in flight)
 *   KPI strip         cw-strip · 4 cells (Due / Active / Potential / Streak)
 *   2-col body:
 *     left 8 cols     SCHEDULE timeline w/ refined NOW indicator
 *     right 4 cols    UP NEXT rail · 2-3 next campaigns
 *   reminder add      ghost row at bottom
 *
 * Authority: lumin-cards.css cw-* primitives + Design.md v11
 * ───────────────────────────────────────────────────────────────────── */

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  earnBadge: string;
  logoInitials: string;
  logoColor: string;
  address?: string;
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
    address: "5 W 19th St",
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
    address: "119 Avenue A",
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
    address: "La Guardia Pl",
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
    address: "85 Kenmare St",
  },
];

/* ── Helpers ──────────────────────────────────────────────── */

const STATUS_LABEL: Record<TaskStatus, string> = {
  upcoming: "UPCOMING",
  active: "LIVE NOW",
  done: "DONE",
  free: "FREE",
};

function getTimeGroup(time: string): "MORNING" | "AFTERNOON" | "EVENING" {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour < 12) return "MORNING";
  if (hour < 17) return "AFTERNOON";
  return "EVENING";
}

function timeToFractionalHour(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

function parseBadge(badge: string): number {
  return parseInt(badge.replace("$", "") || "0", 10);
}

let customTaskCounter = 100;
function nextCustomId() {
  return `custom-${++customTaskCounter}`;
}

function formatCurrentTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatTimeRange(start: string, end?: string): string {
  function pretty(t: string): string {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return m === 0 ? `${h12} ${ampm}` : `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
  }
  if (!end) return pretty(start);
  return `${pretty(start)} — ${pretty(end)}`;
}

function getDayName(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function getMonthDay(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function getUrgency(
  task: TimelineTask,
  nowHour: number,
): "overdue" | "urgent" | "normal" {
  if (task.status === "free" || task.status === "done") return "normal";
  const taskHour = timeToFractionalHour(task.time);
  const endHour = task.endTime ? timeToFractionalHour(task.endTime) : taskHour + 1;
  if (nowHour > endHour) return "overdue";
  if (taskHour - nowHour <= 2 && nowHour <= taskHour) return "urgent";
  return "normal";
}

/** Time remaining on the active task — "1h 12m left", "12m left", or "wrapping" */
function timeLeftLabel(task: TimelineTask, now: Date): string {
  if (!task.endTime) return "in flight";
  const [eh, em] = task.endTime.split(":").map(Number);
  const end = new Date(now);
  end.setHours(eh, em, 0, 0);
  const ms = end.getTime() - now.getTime();
  if (ms <= 0) return "wrapping up";
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m}m left`;
  return `${h}h ${m}m left`;
}

const HOUR_OPTIONS = Array.from({ length: 14 }, (_, i) => {
  const h = i + 8;
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
        INITIAL_TIMELINE_TASKS.filter((t) => t.status === "done").map((t) => t.id),
      ),
  );
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [nowTime, setNowTime] = useState<Date>(new Date());
  const timelineRef = useRef<HTMLDivElement>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addHour, setAddHour] = useState("09:00");
  const [addText, setAddText] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNowTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  /* ── Derived ────────────────────────────────────────────── */

  const scheduledTasks = tasks.filter((t) => t.status !== "free");
  const totalPotential = scheduledTasks.reduce(
    (sum, t) => sum + parseBadge(t.earnBadge),
    0,
  );
  const dueCount = tasks.filter(
    (t) =>
      (t.status === "upcoming" || t.status === "active") &&
      !completedIds.has(t.id),
  ).length;
  const activeNowCount = tasks.filter(
    (t) => t.status === "active" && !completedIds.has(t.id),
  ).length;
  const doneCount = tasks.filter(
    (t) => t.status === "done" || completedIds.has(t.id),
  ).length;

  const activeCampaign = tasks.find(
    (t) => t.status === "active" && !completedIds.has(t.id),
  );
  const upcomingTasks = tasks.filter(
    (t) =>
      t.status === "upcoming" &&
      !completedIds.has(t.id) &&
      timeToFractionalHour(t.time) > nowTime.getHours() + nowTime.getMinutes() / 60,
  );

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

  /* Build time-grouped sections */
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

  /* ── Handlers ───────────────────────────────────────────── */

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
    setTasks((ts) =>
      [...ts, newTask].sort((a, b) =>
        timeToFractionalHour(a.time) - timeToFractionalHour(b.time) > 0 ? 1 : -1,
      ),
    );
    setAddText("");
    setShowAddForm(false);
  }

  /* ── Render ────────────────────────────────────────────── */

  return (
    <div className="cw-page wt-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">
            {getDayName(nowTime).toUpperCase()} · {getMonthDay(nowTime).toUpperCase()}
            {dueCount > 0
              ? ` · ${dueCount} SHOOT${dueCount > 1 ? "S" : ""} · $${totalPotential}`
              : ""}
          </p>
          <h1 className="cw-title">Today.</h1>
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

      {/* ── KPI STRIP ──────────────────────────────────────── */}
      <div className="cw-strip wt-strip">
        <div className="cw-strip__cell">
          <span className="cw-stat__label">Due today</span>
          <span className="cw-stat__value">{dueCount}</span>
          <span className="cw-stat__delta cw-stat__delta--flat">
            {scheduledTasks.length - dueCount} done
          </span>
        </div>
        <div className="cw-strip__cell">
          <span className="cw-stat__label">Live now</span>
          <span
            className={
              "cw-stat__value" +
              (activeNowCount > 0 ? " cw-stat__value--brand" : " cw-stat__value--muted")
            }
          >
            {activeNowCount}
          </span>
          <span className="cw-stat__delta cw-stat__delta--flat">
            {activeNowCount > 0 ? "in flight" : "no active"}
          </span>
        </div>
        <div className="cw-strip__cell">
          <span className="cw-stat__label">Potential</span>
          <span className="cw-stat__value">${totalPotential}</span>
          <span className="cw-stat__delta cw-stat__delta--up">
            ▲ {scheduledTasks.length} bookings
          </span>
        </div>
        <div className="cw-strip__cell">
          <span className="cw-stat__label">Streak</span>
          <span className="cw-stat__value">{doneCount}</span>
          <span className="cw-stat__delta cw-stat__delta--up">
            day {doneCount > 0 ? "🔥" : ""}
          </span>
        </div>
      </div>

      {/* ── NOW HERO (only when there's an active campaign) ─── */}
      {activeCampaign && (
        <section className="wt-now">
          <div className="wt-now__pulse" aria-hidden="true">
            <span className="wt-now__pulse-dot" />
            <span className="wt-now__pulse-label">LIVE NOW · {formatCurrentTime(nowTime)}</span>
          </div>

          <div className="wt-now__head">
            <div
              className="wt-now__avatar"
              style={{ background: activeCampaign.logoColor }}
              aria-hidden="true"
            >
              {activeCampaign.logoInitials}
            </div>
            <div className="wt-now__head-text">
              <p className="wt-now__merchant">{activeCampaign.merchantName}</p>
              <h2 className="wt-now__campaign">{activeCampaign.campaignName}</h2>
            </div>
            <div className="wt-now__pay">
              <span className="wt-now__pay-num">{activeCampaign.earnBadge}</span>
              <span className="wt-now__pay-label">EST.</span>
            </div>
          </div>

          <div className="wt-now__meta">
            <div className="wt-now__meta-cell">
              <span className="wt-now__meta-label">SLOT</span>
              <span className="wt-now__meta-value">
                {formatTimeRange(activeCampaign.time, activeCampaign.endTime)}
              </span>
            </div>
            <div className="wt-now__meta-cell">
              <span className="wt-now__meta-label">ENDS IN</span>
              <span className="wt-now__meta-value">
                {timeLeftLabel(activeCampaign, nowTime)}
              </span>
            </div>
            <div className="wt-now__meta-cell">
              <span className="wt-now__meta-label">LOCATION</span>
              <span className="wt-now__meta-value">
                {activeCampaign.address ?? activeCampaign.category}
              </span>
            </div>
          </div>

          <div className="wt-now__actions">
            <Link
              href="/creator/campaigns/demo-campaign-001/post"
              className="wt-now__cta wt-now__cta--primary"
            >
              Submit content
            </Link>
            <button
              type="button"
              className="wt-now__cta wt-now__cta--ghost"
              onClick={() => toggleComplete(activeCampaign.id)}
            >
              ✓ Mark done
            </button>
            <Link
              href="/creator/messages"
              className="wt-now__cta wt-now__cta--ghost"
            >
              Message merchant
            </Link>
          </div>
        </section>
      )}

      {/* ── BODY: timeline (left) + Up next rail (right) ───── */}
      <div className="wt-body">
        <section className="wt-timeline-card">
          <div className="cw-section-head">
            <span className="cw-section-eyebrow">Today's schedule</span>
            <Link href="/creator/work/calendar" className="cw-section-link">
              View calendar →
            </Link>
          </div>

          <div className="wt-timeline" ref={timelineRef}>
            <div className="wt-timeline__axis" aria-hidden="true" />

            {/* NOW indicator */}
            <div
              className="wt-timeline__now"
              style={{ top: `${nowPct}%` }}
              aria-label={`Current time: ${formatCurrentTime(nowTime)}`}
            >
              <span className="wt-timeline__now-chip">
                NOW · {formatCurrentTime(nowTime)}
              </span>
            </div>

            {groups.map(({ label, tasks: groupTasks }) => (
              <div key={label} className="wt-tg">
                <div className="wt-tg__label">{label}</div>

                {groupTasks.map((task) => {
                  const isDone = completedIds.has(task.id);
                  const urgency = getUrgency(task, nowHour);

                  if (task.status === "free") {
                    return (
                      <div key={task.id} className="wt-row wt-row--free">
                        <div className="wt-row__time">
                          <span>{task.time}</span>
                          {task.endTime && (
                            <span className="wt-row__time-end">{task.endTime}</span>
                          )}
                        </div>
                        <div className="wt-row__dot wt-row__dot--free" />
                        <div className="wt-row__free">
                          <span className="wt-row__free-text">
                            Free window — no commitments
                          </span>
                          <Link href="/creator/discover" className="wt-row__free-cta">
                            + Find a slot
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  const isSelected = selectedTask === task.id;

                  return (
                    <div
                      key={task.id}
                      className={
                        "wt-row wt-row--task" +
                        (isDone ? " is-done" : "") +
                        (task.status === "active" && !isDone ? " is-live" : "") +
                        (urgency === "overdue" && !isDone ? " is-overdue" : "") +
                        (isSelected ? " is-selected" : "")
                      }
                      onClick={() => setSelectedTask(isSelected ? null : task.id)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isSelected}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedTask(isSelected ? null : task.id);
                        }
                      }}
                    >
                      <div className="wt-row__time">
                        <span>{task.time}</span>
                        {task.endTime && (
                          <span className="wt-row__time-end">{task.endTime}</span>
                        )}
                      </div>

                      <div
                        className={
                          "wt-row__dot wt-row__dot--" + (isDone ? "done" : task.status)
                        }
                      />

                      <div className="wt-row__card">
                        <div className="wt-row__main">
                          <button
                            type="button"
                            className={
                              "wt-row__check" + (isDone ? " is-checked" : "")
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComplete(task.id);
                            }}
                            aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                          >
                            {isDone ? "✓" : ""}
                          </button>

                          <div
                            className="wt-row__avatar"
                            style={{ background: task.logoColor }}
                            aria-hidden="true"
                          >
                            {task.logoInitials}
                          </div>

                          <div className="wt-row__body">
                            <p className="wt-row__title">{task.campaignName}</p>
                            <p className="wt-row__sub">
                              {task.merchantName}
                              {task.category && ` · ${task.category}`}
                              {task.address && ` · ${task.address}`}
                            </p>
                          </div>

                          <div className="wt-row__side">
                            <span className="wt-row__pay">{task.earnBadge}</span>
                            <span
                              className={
                                "wt-row__chip wt-row__chip--" +
                                (urgency === "overdue" && !isDone
                                  ? "overdue"
                                  : isDone
                                    ? "done"
                                    : task.status)
                              }
                            >
                              {urgency === "overdue" && !isDone
                                ? "OVERDUE"
                                : isDone
                                  ? "DONE"
                                  : STATUS_LABEL[task.status]}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="wt-row__expanded">
                            {!isDone && task.status === "active" && (
                              <Link
                                href="/creator/campaigns/demo-campaign-001/post"
                                className="cw-pill cw-pill--urgent"
                              >
                                Submit content
                              </Link>
                            )}
                            {!isDone && task.status === "upcoming" && (
                              <button type="button" className="cw-pill">
                                Mark arrived
                              </button>
                            )}
                            <button
                              type="button"
                              className="cw-pill"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleComplete(task.id);
                              }}
                            >
                              {isDone ? "↩ Undo" : "✓ Mark done"}
                            </button>
                            <Link
                              href="/creator/campaigns/demo-campaign-001"
                              className="cw-pill"
                            >
                              View details
                            </Link>
                            <Link href="/creator/messages" className="cw-pill">
                              Message merchant
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Quick add reminder */}
            <div className="wt-add">
              {showAddForm ? (
                <form
                  className="wt-add__form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask();
                  }}
                >
                  <select
                    className="wt-add__time"
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
                    className="wt-add__text"
                    type="text"
                    placeholder="Reminder note…"
                    value={addText}
                    onChange={(e) => setAddText(e.target.value)}
                    autoFocus
                    aria-label="Reminder text"
                  />
                  <button
                    type="submit"
                    className="cw-pill cw-pill--urgent"
                    disabled={!addText.trim()}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="cw-pill"
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
                  type="button"
                  className="wt-add__btn"
                  onClick={() => setShowAddForm(true)}
                >
                  <span aria-hidden="true">+</span> Add reminder
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── UP NEXT rail ──────────────────────────────────── */}
        <aside className="wt-rail">
          <div className="cw-section-head">
            <span className="cw-section-eyebrow">Up next</span>
            <Link href="/creator/work/pipeline" className="cw-section-link">
              All →
            </Link>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="cw-empty">
              <p className="cw-empty__title">All clear after now.</p>
              <p className="cw-empty__body">
                Nothing else booked today. Browse Discover for tomorrow's campaigns.
              </p>
              <Link href="/creator/discover" className="cw-pill cw-pill--urgent">
                + Browse campaigns
              </Link>
            </div>
          ) : (
            <div className="wt-rail__list">
              {upcomingTasks.slice(0, 3).map((task) => (
                <Link
                  key={task.id}
                  href="/creator/campaigns/demo-campaign-001"
                  className="wt-rail__item"
                >
                  <div
                    className="wt-rail__avatar"
                    style={{ background: task.logoColor }}
                    aria-hidden="true"
                  >
                    {task.logoInitials}
                  </div>
                  <div className="wt-rail__body">
                    <p className="wt-rail__title">{task.merchantName}</p>
                    <p className="wt-rail__sub">
                      {formatTimeRange(task.time, task.endTime)} · {task.category}
                    </p>
                  </div>
                  <span className="wt-rail__pay">{task.earnBadge}</span>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* ── Empty state ───────────────────────────────────── */}
      {tasks.length === 0 && (
        <div className="cw-empty wt-empty-day">
          <p className="cw-empty__title">No commitments today.</p>
          <p className="cw-empty__body">
            Take a break, or find your next opportunity.
          </p>
          <Link href="/creator/discover" className="cw-pill cw-pill--urgent">
            + Browse campaigns
          </Link>
        </div>
      )}
    </div>
  );
}
