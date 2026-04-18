"use client";

import { ReactNode } from "react";

export type ChecklistItemStatus = "locked" | "active" | "done" | "skipped";

interface ChecklistItemProps {
  index: number; // 1-based display number
  total: number;
  title: string;
  description: string;
  status: ChecklistItemStatus;
  children?: ReactNode; // expanded step content
  isExpanded?: boolean;
  onExpand?: () => void;
}

const STATUS_LABELS: Record<ChecklistItemStatus, string> = {
  locked: "Locked",
  active: "In progress",
  done: "Complete",
  skipped: "Skipped",
};

export function ChecklistItem({
  index,
  total,
  title,
  description,
  status,
  children,
  isExpanded,
  onExpand,
}: ChecklistItemProps) {
  const isInteractive = status === "active" || status === "done";

  return (
    <div
      className={[
        "chk-item",
        `chk-item--${status}`,
        isExpanded ? "chk-item--expanded" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Header row */}
      <button
        type="button"
        className="chk-header"
        onClick={isInteractive ? onExpand : undefined}
        aria-expanded={isExpanded}
        aria-disabled={!isInteractive}
        disabled={!isInteractive && status === "locked"}
      >
        {/* Step number / check indicator */}
        <span className="chk-marker" aria-hidden="true">
          {status === "done" ? (
            <span className="chk-check">✓</span>
          ) : (
            <span className="chk-num">{String(index).padStart(2, "0")}</span>
          )}
        </span>

        {/* Title block */}
        <span className="chk-title-block">
          <span className="chk-step-label">
            Step {index} / {total}
          </span>
          <span className="chk-title">{title}</span>
          <span className="chk-description">{description}</span>
        </span>

        {/* Status badge */}
        <span className={`chk-badge chk-badge--${status}`}>
          {STATUS_LABELS[status]}
        </span>

        {/* Chevron */}
        {isInteractive && (
          <span className="chk-chevron" aria-hidden="true">
            {isExpanded ? "−" : "+"}
          </span>
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && children && <div className="chk-body">{children}</div>}
    </div>
  );
}
