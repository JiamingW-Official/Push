"use client";

// Push — Global Cmd-K Search Overlay
// Design.md: border-radius 0, 6 colors, Darky + CSGenioMono, 8px grid.

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import "./commandk.css";
import type {
  GroupedResults,
  SearchItem,
  SearchResultType,
} from "@/lib/search/mock-index";

// ---------------------------------------------------------------------------
// Type icons
// ---------------------------------------------------------------------------

const TYPE_ICON: Record<SearchResultType, string> = {
  campaign: "◈",
  creator: "◉",
  merchant: "◎",
  article: "◇",
  page: "▷",
};

const GROUP_LABEL: Record<SearchResultType, string> = {
  campaign: "Campaigns",
  creator: "Creators",
  merchant: "Merchants",
  article: "Help Articles",
  page: "Pages",
};

const GROUP_ORDER: SearchResultType[] = [
  "campaign",
  "creator",
  "merchant",
  "article",
  "page",
];

// ---------------------------------------------------------------------------
// Workspace quick-nav commands shown in empty state
// Grouped by category for visual clarity
// ---------------------------------------------------------------------------

interface QuickCommand {
  label: string;
  url: string;
  icon: string;
  category: string;
  shortcut?: string;
}

const WORKSPACE_COMMANDS: QuickCommand[] = [
  // Work
  {
    label: "Dashboard",
    url: "/creator/dashboard",
    icon: "▦",
    category: "Work",
    shortcut: "D",
  },
  {
    label: "Discover Campaigns",
    url: "/creator/explore",
    icon: "◈",
    category: "Work",
    shortcut: "E",
  },
  { label: "Calendar", url: "/creator/calendar", icon: "▣", category: "Work" },
  {
    label: "Analytics",
    url: "/creator/analytics",
    icon: "▲",
    category: "Work",
  },
  // Inbox & Portfolio
  {
    label: "Inbox",
    url: "/creator/messages",
    icon: "◫",
    category: "Inbox",
    shortcut: "I",
  },
  {
    label: "Notifications",
    url: "/creator/notifications",
    icon: "◎",
    category: "Inbox",
  },
  {
    label: "Portfolio",
    url: "/creator/portfolio",
    icon: "◉",
    category: "Portfolio",
    shortcut: "P",
  },
  {
    label: "Earnings",
    url: "/creator/earnings",
    icon: "◇",
    category: "Portfolio",
  },
  { label: "Wallet", url: "/creator/wallet", icon: "▷", category: "Portfolio" },
  // Account
  {
    label: "My Profile",
    url: "/creator/profile",
    icon: "◐",
    category: "Account",
  },
  {
    label: "Settings",
    url: "/creator/settings",
    icon: "◌",
    category: "Account",
  },
  {
    label: "Leaderboard",
    url: "/creator/leaderboard",
    icon: "◆",
    category: "Account",
  },
];

const COMMAND_CATEGORY_ORDER = [
  "Work",
  "Inbox",
  "Portfolio",
  "Account",
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function flattenGroups(grouped: GroupedResults): SearchItem[] {
  return GROUP_ORDER.flatMap((type) => grouped[type] ?? []);
}

function hasResults(grouped: GroupedResults): boolean {
  return GROUP_ORDER.some((t) => (grouped[t]?.length ?? 0) > 0);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CommandKProps {
  isOpen: boolean;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CommandK({ isOpen, onClose }: CommandKProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedResults | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Flat list for keyboard nav
  const flatItems =
    results && hasResults(results) ? flattenGroups(results) : [];

  // ----- Close with exit animation -----
  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setQuery("");
      setResults(null);
      setActiveIdx(0);
      onClose();
    }, 160);
  }, [onClose]);

  // ----- Focus input on open -----
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults(null);
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  // ----- Debounced search (200ms) -----
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    setActiveIdx(0);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q.trim()) {
      setResults(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results ?? null);
      } catch {
        // silently fail — offline or edge cold start
      }
    }, 200);
  }, []);

  // ----- Keyboard navigation -----
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (!flatItems.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = flatItems[activeIdx];
        if (item) {
          router.push(item.url);
          close();
        }
      }
    },
    [flatItems, activeIdx, close, router],
  );

  // ----- Scroll active item into view -----
  useEffect(() => {
    if (!bodyRef.current) return;
    const el = bodyRef.current.querySelector<HTMLElement>(
      `[data-idx="${activeIdx}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  // ----- Cleanup debounce -----
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!isOpen && !isClosing) return null;

  // ----- Navigate to a result -----
  const navigate = (url: string) => {
    router.push(url);
    close();
  };

  // ----- Render grouped results -----
  const renderResults = () => {
    if (!results || !hasResults(results)) {
      return (
        <div className="ck-no-results">
          <div className="ck-no-results-title">
            No results for &ldquo;{query}&rdquo;
          </div>
          <div className="ck-no-results-sub">
            Try searching for a campaign, creator, or page name.
          </div>
        </div>
      );
    }

    let globalIdx = 0;
    const groups: React.ReactNode[] = [];

    GROUP_ORDER.forEach((type, groupI) => {
      const items = results[type];
      if (!items?.length) return;

      groups.push(
        <div key={type} className="ck-group">
          {groupI > 0 && <div className="ck-divider" />}
          <div className="ck-group-label">{GROUP_LABEL[type]}</div>
          {items.map((item) => {
            const idx = globalIdx++;
            const isActive = idx === activeIdx;
            return (
              <button
                key={item.id}
                className={`ck-item${isActive ? " ck-item--active" : ""}`}
                data-idx={idx}
                onClick={() => navigate(item.url)}
                onMouseEnter={() => setActiveIdx(idx)}
                tabIndex={-1}
              >
                <span className="ck-item-icon">{TYPE_ICON[item.type]}</span>
                <span className="ck-item-text">
                  <span className="ck-item-title">{item.title}</span>
                  <span className="ck-item-sub">{item.subtitle}</span>
                </span>
                <span className={`ck-item-badge ck-badge--${item.type}`}>
                  {item.type}
                </span>
              </button>
            );
          })}
        </div>,
      );
    });

    return groups;
  };

  // ----- Empty state: grouped workspace commands -----
  const renderEmpty = () => {
    const byCategory = COMMAND_CATEGORY_ORDER.map((cat) => ({
      category: cat,
      commands: WORKSPACE_COMMANDS.filter((c) => c.category === cat),
    }));

    return (
      <div className="ck-empty">
        <div className="ck-empty-sections">
          {byCategory.map(({ category, commands }) => (
            <div key={category} className="ck-empty-section">
              <div className="ck-empty-label">{category}</div>
              <div className="ck-cmd-list">
                {commands.map((cmd) => (
                  <button
                    key={cmd.url}
                    className="ck-cmd-item"
                    onClick={() => navigate(cmd.url)}
                  >
                    <span className="ck-cmd-icon">{cmd.icon}</span>
                    <span className="ck-cmd-label">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="ck-cmd-shortcut">{cmd.shortcut}</kbd>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`ck-backdrop${isClosing ? " ck-closing" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="ck-panel" onKeyDown={handleKeyDown}>
        {/* Input row */}
        <div className="ck-input-row">
          <svg
            className="ck-search-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            ref={inputRef}
            className="ck-input"
            type="search"
            value={query}
            onChange={handleInput}
            placeholder="Search campaigns, creators, pages…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Search"
            aria-autocomplete="list"
            aria-expanded={!!results}
          />
          <div className="ck-kbd">
            <kbd>Esc</kbd>
          </div>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="ck-body" role="listbox">
          {query.trim() ? renderResults() : renderEmpty()}
        </div>

        {/* Footer hints */}
        <div className="ck-footer">
          <span className="ck-footer-hint">
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span className="ck-footer-hint">
            <kbd>↵</kbd> open
          </span>
          <span className="ck-footer-hint">
            <kbd>Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
