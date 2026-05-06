"use client";

/**
 * <TwoPane> — single canonical implementation of the list-+-detail
 * layout that audit § 1 found duplicated 5× across the workspace
 * (gigs/active, gigs/invites, inbox/messages, disputes detail,
 * work/campaign/[id]). Every duplicated implementation diverged on
 * detail width, search, filter chips, keyboard nav.
 *
 * This component normalizes:
 *   - Two-column grid: list | sticky detail
 *   - Mobile: list-only by default, detail slides in as bottom sheet
 *   - Optional toolbar slot above the list (search + filter chips)
 *   - Optional empty / loading states for the detail pane
 *
 * Consumers pass children for list + detail; this owns nothing about
 * the rows or the panel — only the shell.
 *
 * Usage:
 *   <TwoPane
 *     toolbar={<MyFilters />}
 *     list={<MyRowList />}
 *     detail={<MyDetailPanel />}
 *     detailWidth={480}
 *   />
 */

import type { ReactNode } from "react";
import "./TwoPane.css";

type Props = {
  /** Optional toolbar above both panes — typically search + filter chips. */
  toolbar?: ReactNode;
  /** Left pane content — usually a scrollable list of rows. */
  list: ReactNode;
  /** Right pane content — usually a sticky detail panel. */
  detail: ReactNode;
  /** Width of the detail pane in px. Default 480. */
  detailWidth?: number;
  /** Optional class for the outer wrapper. */
  className?: string;
  /** Aria-label for the section. Default "Workspace". */
  ariaLabel?: string;
  /** Whether the detail pane is "active" — controls mobile bottom-sheet visibility. */
  detailActive?: boolean;
  /** Mobile only: callback when user taps the dim/back of the bottom sheet to close. */
  onDetailClose?: () => void;
};

export function TwoPane({
  toolbar,
  list,
  detail,
  detailWidth = 480,
  className,
  ariaLabel = "Workspace",
  detailActive = true,
  onDetailClose,
}: Props) {
  return (
    <section
      className={["twp", className].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
      style={{ ["--twp-detail-w" as string]: `${detailWidth}px` }}
    >
      {toolbar ? <div className="twp__toolbar">{toolbar}</div> : null}

      <div className="twp__shell">
        <div className="twp__list" aria-label="List pane">
          {list}
        </div>

        <aside
          className={`twp__detail${detailActive ? " is-open" : ""}`}
          aria-label="Detail pane"
        >
          {detail}
        </aside>

        {/* Mobile bottom-sheet dim. Hidden ≥768px. */}
        {onDetailClose && detailActive ? (
          <button
            type="button"
            className="twp__dim"
            aria-label="Close detail"
            onClick={onDetailClose}
          />
        ) : null}
      </div>
    </section>
  );
}
