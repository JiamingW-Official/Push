"use client";

import { useState, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ChecklistItem = {
  id: string;
  text: string;
  description?: string; // short subtitle shown in the card
  tip?: string; // expandable pro tip
  required: boolean;
};

type CampaignChecklistProps = {
  campaignTitle: string;
  merchantName: string;
  category: string;
  requirements: string[];
  onComplete: () => void;
  isDemo?: boolean;
};

// ─── Default checklist data ───────────────────────────────────────────────────

const BASE_ITEMS: ChecklistItem[] = [
  {
    id: "greet",
    text: "Greet staff & mention Push",
    description: "Let them know you're a Push creator on campaign",
    tip: 'Say: "Hi, I\'m here through Push for the campaign"',
    required: true,
  },
  {
    id: "explore",
    text: "Scout the space",
    description: "Find the best light and angles before filming",
    tip: "Find the best light — usually near windows, 10am–2pm is golden",
    required: false,
  },
  {
    id: "product",
    text: "Try the featured product",
    description: "First-hand experience makes your content authentic",
    required: true,
  },
  {
    id: "capture",
    text: "Capture required content",
    description: "Follow the brief format — video, photo, or both",
    required: true,
  },
  {
    id: "tag",
    text: "Note the exact @handle",
    description: "Check the campaign brief for the correct handle",
    tip: "Check the campaign brief for the correct handle",
    required: true,
  },
  {
    id: "qr",
    text: "Scan the Push QR code",
    description: "Confirms your visit and starts your attribution window",
    tip: "This confirms your visit and starts your attribution window",
    required: true,
  },
  {
    id: "review",
    text: "Review content before leaving",
    description: "Easier to reshoot now than return tomorrow",
    tip: "Easier to reshoot now than come back tomorrow",
    required: false,
  },
];

const CATEGORY_EXTRAS: Record<string, ChecklistItem[]> = {
  Food: [
    {
      id: "menu",
      text: "Ask what's popular today",
      description: "Local knowledge makes for better, timely content",
      tip: "Local knowledge = better content",
      required: false,
    },
  ],
  Coffee: [
    {
      id: "barista",
      text: "Get a barista quote",
      description: "A recommendation from staff adds genuine credibility",
      required: false,
    },
  ],
  Beauty: [
    {
      id: "before",
      text: "Take a before reference shot",
      description: "Before/after contrast drives the highest engagement",
      required: false,
    },
  ],
  Retail: [
    {
      id: "price",
      text: "Note any sale or launch pricing",
      description: "Pricing details drive purchase intent — mention them",
      required: false,
    },
  ],
};

// ─── Step status label ────────────────────────────────────────────────────────

type StepStatus = "done" | "current" | "upcoming";

function getStepStatus(
  item: ChecklistItem,
  checked: Record<string, boolean>,
  allItems: ChecklistItem[],
  index: number,
): StepStatus {
  if (checked[item.id]) return "done";
  // "current" = first unchecked item
  const firstUnchecked = allItems.findIndex((it) => !checked[it.id]);
  if (index === firstUnchecked) return "current";
  return "upcoming";
}

// ─── Checkbox icon ────────────────────────────────────────────────────────────

function CheckboxIcon({ status }: { status: StepStatus }) {
  const isDone = status === "done";
  const isCurrent = status === "current";

  return (
    <div
      style={{
        width: 22,
        height: 22,
        flexShrink: 0,
        borderRadius: 0,
        border: isDone
          ? "none"
          : isCurrent
            ? "2px solid var(--brand-red)"
            : "2px solid rgba(10,10,10,0.18)",
        background: isDone ? "var(--ink)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 200ms ease, border-color 200ms ease",
      }}
    >
      {isDone && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path
            d="M1 5L4.5 8.5L11 1.5"
            stroke="var(--surface)"
            strokeWidth="1.8"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      )}
      {isCurrent && (
        <div
          style={{
            width: 8,
            height: 8,
            background: "var(--brand-red)",
            borderRadius: 0,
          }}
        />
      )}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <span
        style={{
          fontFamily: "'CS Genio Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink)",
          background: "rgba(10,10,10,0.08)",
          padding: "2px 6px",
          borderRadius: 0,
        }}
      >
        Done
      </span>
    );
  }
  if (status === "current") {
    return (
      <span
        style={{
          fontFamily: "'CS Genio Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--brand-red)",
          background: "rgba(193,18,31,0.07)",
          padding: "2px 6px",
          borderRadius: 0,
          border: "1px solid rgba(193,18,31,0.18)",
        }}
      >
        Now
      </span>
    );
  }
  return null;
}

// ─── Checklist card ───────────────────────────────────────────────────────────

function ChecklistCard({
  item,
  status,
  stepNumber,
  onToggle,
}: {
  item: ChecklistItem;
  status: StepStatus;
  stepNumber: number;
  onToggle: () => void;
}) {
  const [tipOpen, setTipOpen] = useState(false);
  const isDone = status === "done";
  const isCurrent = status === "current";
  const isUpcoming = status === "upcoming";

  return (
    <div
      style={{
        border: isCurrent
          ? "1.5px solid rgba(193,18,31,0.3)"
          : "1px solid rgba(10,10,10,0.08)",
        background: isCurrent
          ? "rgba(193,18,31,0.03)"
          : isDone
            ? "rgba(10,10,10,0.02)"
            : "var(--surface-2)",
        transition: "border-color 200ms ease, background 200ms ease",
        opacity: isUpcoming ? 0.55 : 1,
      }}
    >
      {/* Required accent bar */}
      {item.required && (
        <div
          style={{
            height: 2,
            background: isDone ? "var(--ink)" : "var(--brand-red)",
            transition: "background 300ms ease",
          }}
        />
      )}

      {/* Card body */}
      <div
        style={{ padding: "12px 14px", cursor: "pointer" }}
        onClick={onToggle}
        role="checkbox"
        aria-checked={isDone}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        {/* Top row: step number + checkbox + badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: item.description ? 8 : 0,
          }}
        >
          {/* Step number */}
          <span
            style={{
              fontFamily: "'CS Genio Mono', monospace",
              fontSize: 10,
              color: isDone
                ? "rgba(10,10,10,0.35)"
                : isCurrent
                  ? "var(--brand-red)"
                  : "rgba(10,10,10,0.3)",
              letterSpacing: "0.04em",
              flexShrink: 0,
              width: 18,
              fontWeight: 700,
              transition: "color 200ms ease",
            }}
          >
            {String(stepNumber).padStart(2, "0")}
          </span>

          <CheckboxIcon status={status} />

          {/* Text */}
          <span
            style={{
              flex: 1,
              fontFamily: "'CS Genio Mono', monospace",
              fontSize: 13,
              fontWeight: 600,
              color: isDone ? "rgba(10,10,10,0.35)" : "var(--ink)",
              textDecoration: isDone ? "line-through" : "none",
              letterSpacing: "0.01em",
              transition: "color 200ms ease",
            }}
          >
            {item.text}
          </span>

          {/* Badges */}
          <StatusBadge status={status} />
          {item.required && (
            <div
              aria-label="Required"
              title="Required"
              style={{
                width: 5,
                height: 5,
                background: isDone ? "rgba(10,10,10,0.25)" : "var(--brand-red)",
                borderRadius: 0,
                flexShrink: 0,
                transition: "background 200ms ease",
              }}
            />
          )}
        </div>

        {/* Description */}
        {item.description && (
          <div
            style={{
              marginLeft: 28,
              fontFamily: "'CS Genio Mono', monospace",
              fontSize: 11,
              color: isDone ? "rgba(10,10,10,0.28)" : "rgba(10,10,10,0.55)",
              lineHeight: 1.5,
              letterSpacing: "0.01em",
              transition: "color 200ms ease",
            }}
          >
            {item.description}
          </div>
        )}
      </div>

      {/* Pro tip toggle — outside click zone */}
      {item.tip && (
        <div
          style={{
            borderTop: "1px solid rgba(10,10,10,0.05)",
            padding: "0 14px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setTipOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              padding: "8px 0",
              cursor: "pointer",
              fontFamily: "'CS Genio Mono', monospace",
              fontSize: 10,
              color: "var(--accent-blue)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
            aria-expanded={tipOpen}
          >
            Pro tip {tipOpen ? "↑" : "↓"}
          </button>

          {tipOpen && (
            <div
              style={{
                paddingBottom: 10,
                fontSize: 11,
                fontFamily: "'CS Genio Mono', monospace",
                color: "rgba(10,10,10,0.65)",
                background: "rgba(102,155,188,0.06)",
                padding: "8px 12px 10px",
                borderLeft: "2px solid var(--accent-blue)",
                lineHeight: "18px",
                marginBottom: 2,
              }}
            >
              {item.tip}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Progress indicator ───────────────────────────────────────────────────────

function ProgressIndicator({
  checked,
  total,
  pct,
  allRequiredDone,
}: {
  checked: number;
  total: number;
  pct: number;
  allRequiredDone: boolean;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      {/* Label row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "'CS Genio Mono', monospace",
            fontSize: 12,
            color: "var(--ink)",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {checked}/{total} steps completed
        </span>
        {allRequiredDone && checked < total && (
          <span
            style={{
              fontFamily: "'CS Genio Mono', monospace",
              fontSize: 10,
              color: "var(--ink)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              background: "rgba(10,10,10,0.06)",
              padding: "2px 8px",
            }}
          >
            Required done ✓
          </span>
        )}
      </div>

      {/* Track */}
      <div
        style={{
          height: 4,
          background: "rgba(10,10,10,0.08)",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: pct === 100 ? "var(--ink)" : "var(--brand-red)",
            width: `${pct}%`,
            transition: "width 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* Step dots */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginTop: 6,
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: 0,
              background: i < checked ? "var(--ink)" : "rgba(10,10,10,0.12)",
              transition: "background 300ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CampaignChecklist({
  campaignTitle,
  merchantName,
  category,
  requirements,
  onComplete,
  isDemo = false,
}: CampaignChecklistProps) {
  const allItems = useMemo<ChecklistItem[]>(() => {
    const extras = CATEGORY_EXTRAS[category] ?? [];
    return [...BASE_ITEMS, ...extras];
  }, [category]);

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalCount = allItems.length;
  const checkedCount = allItems.filter((item) => checked[item.id]).length;
  const requiredItems = allItems.filter((item) => item.required);
  const allRequiredDone = requiredItems.every((item) => checked[item.id]);
  const progressPct = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div
      style={{
        background: "var(--surface-3)",
        border: "1px solid rgba(10,10,10,0.1)",
        maxWidth: 500,
        width: "100%",
        fontFamily: "'CS Genio Mono', monospace",
        position: "relative",
      }}
    >
      {/* Demo badge */}
      {isDemo && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "var(--surface)",
            border: "1px solid rgba(10,10,10,0.12)",
            padding: "2px 8px",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(10,10,10,0.45)",
            fontFamily: "'CS Genio Mono', monospace",
          }}
        >
          Demo
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "18px 20px 16px",
          borderBottom: "1px solid rgba(10,10,10,0.08)",
          background: "var(--surface)",
        }}
      >
        <p
          style={{
            margin: "0 0 4px",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent-blue)",
            fontFamily: "'CS Genio Mono', monospace",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span aria-hidden>📍</span> You&apos;re at {merchantName}
        </p>
        <h2
          style={{
            margin: "0 0 10px",
            fontFamily: "Darky, Georgia, serif",
            fontWeight: 700,
            fontSize: 22,
            color: "var(--ink)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {campaignTitle}
        </h2>

        {/* Requirements chips */}
        {requirements.length > 0 && (
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}
          >
            {requirements.map((req, i) => (
              <span
                key={i}
                style={{
                  fontSize: 10,
                  fontFamily: "'CS Genio Mono', monospace",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--brand-red)",
                  background: "rgba(193,18,31,0.06)",
                  padding: "3px 8px",
                  border: "1px solid rgba(193,18,31,0.15)",
                  borderRadius: 0,
                }}
              >
                {req}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Progress ─────────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 20px 0" }}>
        <ProgressIndicator
          checked={checkedCount}
          total={totalCount}
          pct={progressPct}
          allRequiredDone={allRequiredDone}
        />
      </div>

      {/* ── Step cards ───────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {allItems.map((item, index) => {
          const status = getStepStatus(item, checked, allItems, index);
          return (
            <ChecklistCard
              key={item.id}
              item={item}
              status={status}
              stepNumber={index + 1}
              onToggle={() => toggle(item.id)}
            />
          );
        })}
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      {allRequiredDone && (
        <div
          style={{
            padding: "0 20px 20px",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 11,
              fontFamily: "'CS Genio Mono', monospace",
              color: "rgba(10,10,10,0.5)",
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            You&apos;ve hit all the required steps — nice work.
          </p>
          <button
            onClick={onComplete}
            style={{
              width: "100%",
              height: 48,
              background: "var(--brand-red)",
              color: "var(--surface)",
              border: "none",
              borderRadius: 0,
              cursor: "pointer",
              fontFamily: "'CS Genio Mono', monospace",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--brand-red)";
            }}
          >
            Submit proof when ready →
          </button>
        </div>
      )}
    </div>
  );
}
