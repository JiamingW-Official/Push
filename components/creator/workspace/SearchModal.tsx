"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "./SearchModal.css";

interface SearchResult {
  id: string;
  group: "Campaigns" | "Archive" | "Messages" | "Merchants";
  title: string;
  subtitle?: string;
  href: string;
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: "r1",
    group: "Campaigns",
    title: "Morning Ritual",
    subtitle: "Onyx Coffee Bar",
    href: "/creator/work/campaign/camp-001",
  },
  {
    id: "r2",
    group: "Messages",
    title: "Onyx Coffee Bar",
    subtitle: "Hey! Looking forward...",
    href: "/creator/inbox/messages",
  },
  {
    id: "r3",
    group: "Merchants",
    title: "Matcha House",
    subtitle: "Williamsburg",
    href: "/creator/work/pipeline",
  },
];

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      MOCK_RESULTS.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.subtitle?.toLowerCase().includes(q),
      ),
    );
    setActiveIdx(0);
  }, [query]);

  function navigate(href: string) {
    router.push(href);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter" && results[activeIdx]) {
      navigate(results[activeIdx].href);
      return;
    }
  }

  if (!open) return null;

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.group] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div
      className="search-overlay"
      onClick={onClose}
      role="dialog"
      aria-label="Search"
    >
      <div
        className="search-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="search-input-row">
          <svg
            className="search-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle
              cx="6.5"
              cy="6.5"
              r="4.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10.5 10.5L14 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search campaigns, merchants, messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="search-esc">Esc</kbd>
        </div>

        {Object.keys(grouped).length > 0 && (
          <div className="search-results">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="search-group">
                <span className="search-group__label">{group}</span>
                {items.map((r) => {
                  const globalIdx = results.indexOf(r);
                  return (
                    <button
                      key={r.id}
                      className={`search-result${globalIdx === activeIdx ? " search-result--active" : ""}`}
                      onClick={() => navigate(r.href)}
                      onMouseEnter={() => setActiveIdx(globalIdx)}
                    >
                      <span className="search-result__title">{r.title}</span>
                      {r.subtitle && (
                        <span className="search-result__subtitle">
                          {r.subtitle}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <p className="search-no-results">
            No results for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
