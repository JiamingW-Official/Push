"use client";

/**
 * Global ⌘K command palette (audit § P2-12). Built on `cmdk` for fuzzy
 * search + keyboard nav. Source list = STATIC_PAGES + STATIC_ACTIONS +
 * (future) brands + recent gigs.
 *
 * Trigger: ⌘K / Ctrl+K from anywhere on /creator/*. Skips when an INPUT,
 * TEXTAREA, or contentEditable has focus (so users can type "k" in
 * search bars without popping the palette).
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  STATIC_PAGES,
  STATIC_ACTIONS,
  RECENT_KEY,
  RECENT_MAX,
  type CommandItem,
} from "@/lib/cmdk";
import "./CommandPalette.css";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [recent, setRecent] = useState<string[]>([]);

  /* Hydrate recent list on mount. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      // localStorage unavailable (private mode); fall back to in-memory only
    }
  }, []);

  /* ⌘K / Ctrl+K trigger. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        // Skip if user is typing into an input field — but allow when the
        // palette is the focused element (cmd+k inside palette closes it).
        const target = e.target as HTMLElement | null;
        const inField =
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.isContentEditable;
        if (inField && !target?.closest("[data-cmdk-root]")) return;
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const onSelect = useCallback(
    (item: CommandItem) => {
      // Persist recent.
      try {
        const next = [item.id, ...recent.filter((id) => id !== item.id)].slice(
          0,
          RECENT_MAX,
        );
        setRecent(next);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }

      setOpen(false);

      if (item.onSelect) {
        item.onSelect();
        return;
      }
      if (item.href) router.push(item.href);
    },
    [recent, router],
  );

  if (!open) return null;

  const allItems = [...STATIC_PAGES, ...STATIC_ACTIONS];
  const recentItems = recent
    .map((id) => allItems.find((it) => it.id === id))
    .filter((x): x is CommandItem => Boolean(x));

  return (
    <div
      className="cmdk-overlay"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        className="cmdk-modal"
        onClick={(e) => e.stopPropagation()}
        data-cmdk-root
      >
        <Command label="Command palette">
          <div className="cmdk-input-row">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M21 21l-6-6M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <Command.Input
              autoFocus
              placeholder="Search pages, brands, gigs, settings…"
              className="cmdk-input"
            />
            <kbd className="cmdk-input-hint">esc</kbd>
          </div>

          <Command.List className="cmdk-list">
            <Command.Empty className="cmdk-empty">No results.</Command.Empty>

            {recentItems.length > 0 ? (
              <Command.Group heading="Recent" className="cmdk-group">
                {recentItems.map((item) => (
                  <Command.Item
                    key={`recent-${item.id}`}
                    value={`recent ${item.label} ${item.keywords?.join(" ") ?? ""}`}
                    onSelect={() => onSelect(item)}
                    className="cmdk-item"
                  >
                    <span className="cmdk-item__label">{item.label}</span>
                    {item.hint ? (
                      <span className="cmdk-item__hint">{item.hint}</span>
                    ) : null}
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}

            <Command.Group heading="Pages" className="cmdk-group">
              {STATIC_PAGES.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.label} ${item.keywords?.join(" ") ?? ""}`}
                  onSelect={() => onSelect(item)}
                  className="cmdk-item"
                >
                  <span className="cmdk-item__label">{item.label}</span>
                  {item.hint ? (
                    <span className="cmdk-item__hint">{item.hint}</span>
                  ) : null}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Actions" className="cmdk-group">
              {STATIC_ACTIONS.map((item) => (
                <Command.Item
                  key={item.id}
                  value={item.label}
                  onSelect={() => onSelect(item)}
                  className="cmdk-item"
                >
                  <span className="cmdk-item__label">{item.label}</span>
                  {item.hint ? (
                    <span className="cmdk-item__hint">{item.hint}</span>
                  ) : null}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="cmdk-foot">
            <span>
              <kbd>↑↓</kbd> navigate
            </span>
            <span>
              <kbd>↵</kbd> select
            </span>
            <span>
              <kbd>esc</kbd> close
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}
