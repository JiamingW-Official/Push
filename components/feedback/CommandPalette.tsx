"use client";

// Push — Global Command Palette (Cmd+K / Ctrl+K)
//
// Audience-aware navigation + action palette spanning merchant, creator,
// and admin surfaces. Built on a static registry (lib/command-palette/registry.ts)
// — no third-party command library, plain CSS only. SSR-safe: no window
// access at module scope.
//
// Pairs with <CommandPaletteProvider> (below) which is mounted once in
// app/layout.tsx and owns the global Cmd+K listener.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import {
  COMMAND_REGISTRY,
  RECENT_KEY,
  RECENT_MAX,
  detectAudience,
  filterAndRank,
  groupForRender,
  type CommandItem,
} from "@/lib/command-palette/registry";
import "./command-palette.css";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CommandPaletteContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

// ---------------------------------------------------------------------------
// Provider — owns global Cmd+K listener + open state
// ---------------------------------------------------------------------------

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        // Skip when the user is typing into an input outside the palette
        // (so search bars on dashboard etc. aren't hijacked).
        const target = e.target as HTMLElement | null;
        const inField =
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.isContentEditable;
        if (inField && !target?.closest("[data-command-palette-root]")) return;

        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      {isOpen ? <CommandPalette onClose={close} /> : null}
    </CommandPaletteContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Modal — search + grouped results + keyboard nav
// ---------------------------------------------------------------------------

interface CommandPaletteProps {
  onClose: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const audience = detectAudience(pathname);

  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Hydrate recents from sessionStorage on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      /* private mode — fall back to in-memory */
    }
    // Auto-focus search input.
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  // ESC closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Filter + group.
  const items = useMemo(
    () => filterAndRank(query, audience, recent),
    [query, audience, recent],
  );
  const groups = useMemo(() => groupForRender(items, recent), [items, recent]);

  // Reset selection when results change.
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Scroll active item into view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-cp-idx="${activeIdx}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  // Persist recent + execute item.
  const execute = useCallback(
    (item: CommandItem) => {
      try {
        const next = [item.id, ...recent.filter((id) => id !== item.id)].slice(
          0,
          RECENT_MAX,
        );
        sessionStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      onClose();
      if (item.onAction) {
        item.onAction();
        return;
      }
      if (item.href) router.push(item.href);
    },
    [recent, router, onClose],
  );

  // Keyboard nav on Up/Down/Enter.
  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!items.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = items[activeIdx];
        if (item) execute(item);
      }
    },
    [items, activeIdx, execute],
  );

  // SSR-safe portal: only render on client.
  if (typeof document === "undefined") return null;

  // Compute global index per item for keyboard nav highlight.
  let globalIdx = 0;

  return createPortal(
    <div
      className="cp-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="cp-modal" data-command-palette-root>
        {/* Search input row */}
        <div className="cp-input-row">
          <svg
            className="cp-search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M21 21l-5-5M16.5 11A5.5 5.5 0 1 1 5.5 11a5.5 5.5 0 0 1 11 0z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="cp-input"
            placeholder="Search pages, actions, settings…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="cp-esc-hint">esc</kbd>
        </div>

        {/* Results list */}
        <div ref={listRef} className="cp-list" role="listbox">
          {groups.length === 0 ? (
            <div className="cp-empty">No results</div>
          ) : (
            groups.map((g) => (
              <div key={g.group} className="cp-group">
                <div className="cp-group-heading">
                  <span className="cp-group-dot" aria-hidden />
                  {g.group}
                </div>
                {g.items.map((item) => {
                  const idx = globalIdx++;
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-cp-idx={idx}
                      className={`cp-item${isActive ? " is-active" : ""}`}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => execute(item)}
                      role="option"
                      aria-selected={isActive}
                    >
                      <span className="cp-item__accent" aria-hidden />
                      <span className="cp-item__label">{item.label}</span>
                      {item.shortcut?.length ? (
                        <span
                          className="cp-shortcut-chip"
                          aria-label={`shortcut ${item.shortcut.join(" ")}`}
                        >
                          {item.shortcut.map((k, i) => (
                            <kbd key={i}>{k}</kbd>
                          ))}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Foot hints */}
        <div className="cp-foot">
          <span>
            <kbd>↑↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
          <span className="cp-foot__count">
            {items.length} of {COMMAND_REGISTRY.length}
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default CommandPalette;
