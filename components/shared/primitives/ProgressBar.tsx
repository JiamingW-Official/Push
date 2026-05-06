"use client";

/**
 * <ProgressBar> — milestone / tier / draft / phase progress visual.
 * Replaces 12+ duplicate implementations across the workspace.
 *
 * Three modes:
 *   - linear (default)  bar fills from 0 → 100%
 *   - segmented         N discrete steps with current step highlighted
 *   - milestone         linear bar with named milestone notches
 */

import "./ProgressBar.css";

type LinearProps = {
  mode?: "linear";
  value: number;
  /** Max value. Default 100. */
  max?: number;
  /** Optional label above the bar. */
  label?: string;
  /** Optional sub-label below the bar. */
  sub?: string;
  /** Tonal variant. */
  tone?: "ink" | "blue" | "champagne";
};

type SegmentedProps = {
  mode: "segmented";
  /** Current step (0-indexed). */
  step: number;
  /** Total steps. */
  total: number;
  /** Optional labels per step. */
  stepLabels?: string[];
  label?: string;
  tone?: "ink" | "blue" | "champagne";
};

type MilestoneProps = {
  mode: "milestone";
  value: number;
  max?: number;
  /** Named notches: { atPct, label } */
  milestones: { atPct: number; label: string }[];
  label?: string;
  tone?: "ink" | "blue" | "champagne";
};

type Props = LinearProps | SegmentedProps | MilestoneProps;

export function ProgressBar(props: Props) {
  const tone = props.tone ?? "ink";

  if (props.mode === "segmented") {
    const cells = Array.from({ length: props.total });
    return (
      <div className={`pgb pgb--segmented pgb--tone-${tone}`}>
        {props.label ? <span className="pgb__label">{props.label}</span> : null}
        <div
          className="pgb__seg-row"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={props.total}
          aria-valuenow={props.step + 1}
        >
          {cells.map((_, i) => (
            <span
              key={i}
              className={`pgb__seg${i <= props.step ? " is-done" : ""}`}
            >
              {props.stepLabels?.[i] ? (
                <span className="pgb__seg-label">{props.stepLabels[i]}</span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const max = props.max ?? 100;
  const pct = Math.max(0, Math.min(100, (props.value / max) * 100));

  if (props.mode === "milestone") {
    return (
      <div className={`pgb pgb--milestone pgb--tone-${tone}`}>
        {props.label ? <span className="pgb__label">{props.label}</span> : null}
        <div
          className="pgb__track"
          role="progressbar"
          aria-valuenow={props.value}
          aria-valuemax={max}
          aria-valuemin={0}
        >
          <div className="pgb__fill" style={{ width: `${pct}%` }} />
          {props.milestones.map((m, i) => (
            <span
              key={i}
              className="pgb__notch"
              style={{ left: `${m.atPct}%` }}
              aria-label={m.label}
            >
              <span className="pgb__notch-label">{m.label}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`pgb pgb--linear pgb--tone-${tone}`}>
      {props.label ? <span className="pgb__label">{props.label}</span> : null}
      <div
        className="pgb__track"
        role="progressbar"
        aria-valuenow={props.value}
        aria-valuemax={max}
        aria-valuemin={0}
      >
        <div className="pgb__fill" style={{ width: `${pct}%` }} />
      </div>
      {props.sub ? <span className="pgb__sub">{props.sub}</span> : null}
    </div>
  );
}
