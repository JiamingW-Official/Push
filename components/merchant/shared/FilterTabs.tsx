"use client";

import { useCallback, useId, useRef, type KeyboardEvent } from "react";
import "./filter-tabs.css";

export interface FilterTab {
  value: string;
  label: string;
  count?: number;
}

export interface FilterTabsProps {
  tabs: Array<FilterTab>;
  value: string;
  onChange: (v: string) => void;
  /** Accessible label for the tablist; defaults to "Filters". */
  ariaLabel?: string;
}

export function FilterTabs({
  tabs,
  value,
  onChange,
  ariaLabel = "Filters",
}: FilterTabsProps) {
  const groupId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = useCallback(
    (index: number) => {
      const total = tabs.length;
      if (total === 0) return;
      const next = ((index % total) + total) % total;
      const el = refs.current[next];
      if (el) {
        el.focus();
        onChange(tabs[next].value);
      }
    },
    [onChange, tabs],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          focusTab(currentIndex + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          focusTab(currentIndex - 1);
          break;
        case "Home":
          event.preventDefault();
          focusTab(0);
          break;
        case "End":
          event.preventDefault();
          focusTab(tabs.length - 1);
          break;
        default:
          break;
      }
    },
    [focusTab, tabs.length],
  );

  return (
    <div
      className="ms-filter-tabs"
      role="tablist"
      aria-label={ariaLabel}
      id={`ms-filter-tabs-${groupId}`}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.value === value;

        return (
          <button
            key={tab.value}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-pressed={isActive}
            tabIndex={isActive ? 0 : -1}
            className={[
              "ms-filter-tabs-btn btn-pill",
              isActive ? "ms-filter-tabs-btn--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onChange(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" ? (
              <span className="ms-filter-tabs-count">{tab.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
