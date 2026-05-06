"use client";

/**
 * Floating bulk-action bar (audit § P2-17). Slides up from the bottom
 * when at least one item is selected. Each call site provides its own
 * actions array (Accept N / Decline N / Export CSV / etc.) — this
 * component handles only the chrome.
 *
 * Lives outside the normal page flow (fixed position) so it doesn't
 * push content. On mobile, it sits above the bottom nav (88px from the
 * bottom of the viewport).
 */

import "./BulkBar.css";

export type BulkAction = {
  id: string;
  label: string;
  /** Visual variant. Default = "default". "danger" = red. */
  variant?: "default" | "danger" | "primary";
  onClick: () => void;
};

type Props = {
  /** Number of selected items. When 0 the bar hides. */
  count: number;
  /** Top-right "Clear" handler. */
  onClear: () => void;
  /** Up to 4 actions. */
  actions: BulkAction[];
};

export function BulkBar({ count, onClear, actions }: Props) {
  if (count === 0) return null;

  return (
    <div className="bulk-bar" role="toolbar" aria-label={`${count} selected`}>
      <span className="bulk-bar__count">{count} selected</span>
      <div className="bulk-bar__actions">
        {actions.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`bulk-bar__btn bulk-bar__btn--${a.variant ?? "default"}`}
            onClick={a.onClick}
          >
            {a.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="bulk-bar__clear"
        onClick={onClear}
        aria-label="Clear selection"
      >
        Clear
      </button>
    </div>
  );
}
