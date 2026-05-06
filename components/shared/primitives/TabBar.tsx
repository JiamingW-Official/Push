"use client";

/**
 * <TabBar> — filter pill row. Replaces 4× duplicate implementations
 * (wallet / notifications / settings / profile). All filter chips
 * across the workspace converge here.
 *
 * Behavior:
 *   - role=tablist + role=tab + aria-selected
 *   - Arrow-key navigation (left/right)
 *   - Optional count badge per tab
 *
 * Visual: Pill row, selected tab gets ink fill + snow text.
 */

import { useRef, type KeyboardEvent } from "react";
import "./TabBar.css";

export type Tab<T extends string> = {
  id: T;
  label: string;
  /** Optional count badge to right of label. */
  count?: number;
};

type Props<T extends string> = {
  tabs: Tab<T>[];
  active: T;
  onChange: (id: T) => void;
  /** Optional aria-label for the tablist. */
  ariaLabel?: string;
  className?: string;
};

export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  ariaLabel = "Filter",
  className,
}: Props<T>) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const idx = tabs.findIndex((t) => t.id === active);
    const dir = e.key === "ArrowLeft" ? -1 : 1;
    const next = (idx + dir + tabs.length) % tabs.length;
    const target = tabs[next];
    if (!target) return;
    onChange(target.id);
    refs.current[target.id]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={["tbb", className].filter(Boolean).join(" ")}
      onKeyDown={onKey}
    >
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            type="button"
            role="tab"
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            className={`tbb__tab${isActive ? " is-active" : ""}`}
            onClick={() => onChange(t.id)}
          >
            <span className="tbb__label">{t.label}</span>
            {typeof t.count === "number" ? (
              <span className="tbb__count" aria-hidden>
                {t.count > 99 ? "99+" : t.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
