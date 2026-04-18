"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import "./changelog.css";
import {
  changelogEntries,
  type AreaTag,
  type VersionTag,
} from "@/lib/changelog/mock-entries";

// ── v5.1 display categories ───────────────────────────────────────────────
// The data layer uses AreaTag = Attribution | Payments | Creator | Merchant | Platform.
// The v5.1 surface is Product | Trust | Engineering | UI. We map without
// mutating the data source.
type DisplayCategory = "Product" | "Trust" | "Engineering" | "UI";

const DISPLAY_CATEGORIES: DisplayCategory[] = [
  "Product",
  "Trust",
  "Engineering",
  "UI",
];

function toDisplayCategory(a: AreaTag): DisplayCategory {
  switch (a) {
    case "Attribution":
      return "Trust";
    case "Payments":
      return "Trust";
    case "Creator":
      return "Product";
    case "Merchant":
      return "Product";
    case "Platform":
      return "Engineering";
    default:
      return "Product";
  }
}

// Heuristic: if the entry's versionTag is patch OR it mentions "ui"/"design"
// in its bullets, treat it as a UI entry so we have coverage of all four chips.
function isUiEntry(e: (typeof changelogEntries)[number]): boolean {
  if (e.versionTag === "patch") return true;
  const hay = (e.title + " " + e.bullets.join(" ")).toLowerCase();
  return (
    hay.includes(" ui ") ||
    hay.includes("design") ||
    hay.includes("visual") ||
    hay.includes("redesign")
  );
}

function displayCategoryFor(
  e: (typeof changelogEntries)[number],
): DisplayCategory {
  if (isUiEntry(e)) return "UI";
  return toDisplayCategory(e.area);
}

// ── Helpers ───────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Filter to ~3 months of history (we show the 15 most recent — mock-entries
// is already in reverse-chronological order).
const RECENT_LIMIT = 15;

// ── Entry row ─────────────────────────────────────────────────────────────

function EntryRow({
  entry,
  isLast,
}: {
  entry: (typeof changelogEntries)[number];
  isLast: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const category = displayCategoryFor(entry);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("revealed");
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <article ref={rowRef} className="cl-row">
      {/* Date column */}
      <div className="cl-row__date-col">
        <time className="cl-row__date" dateTime={entry.date}>
          {formatDate(entry.date)}
        </time>
      </div>

      {/* Timeline line + dot */}
      <div className="cl-row__line" aria-hidden="true">
        <div className={`cl-row__dot cl-row__dot--${entry.versionTag}`} />
        {!isLast && <div className="cl-row__track" />}
      </div>

      {/* Content */}
      <div className="cl-row__content">
        <div className="cl-row__meta">
          <span
            className={`cl-row__version cl-row__version--${entry.versionTag}`}
          >
            v{entry.version}
          </span>
          <span
            className={`cl-row__category cl-row__category--${category.toLowerCase()}`}
          >
            {category}
          </span>
        </div>
        <h3 className="cl-row__title">{entry.title}</h3>
        <p className="cl-row__summary">{entry.summary}</p>
        <ul className="cl-row__bullets">
          {entry.bullets.slice(0, 4).map((b, i) => (
            <li key={i} className="cl-row__bullet">
              {b}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function ChangelogPage() {
  const [active, setActive] = useState<DisplayCategory | "All">("All");
  const [versionFilter, setVersionFilter] = useState<VersionTag | "All">("All");

  const recent = useMemo(() => changelogEntries.slice(0, RECENT_LIMIT), []);

  const filtered = useMemo(() => {
    return recent.filter((e) => {
      const cat = displayCategoryFor(e);
      const catMatch = active === "All" || cat === active;
      const versionMatch =
        versionFilter === "All" || e.versionTag === versionFilter;
      return catMatch && versionMatch;
    });
  }, [active, versionFilter, recent]);

  return (
    <main className="cl-page">
      {/* ── Hero ── */}
      <section className="cl-hero" aria-labelledby="cl-title">
        <div className="container cl-hero__inner">
          <p className="cl-hero__eyebrow">Changelog</p>
          <h1 className="cl-hero__title" id="cl-title">
            What&apos;s new.
          </h1>
          <p className="cl-hero__sub">
            Every meaningful change to Push — Vertical AI for Local Commerce —
            in reverse chronological order. ConversionOracle™ accuracy releases,
            Customer Acquisition Engine improvements, Neighborhood Playbook
            rollouts, UI polish.
          </p>
          <div className="cl-hero__meta">
            <a
              href="/api/changelog.rss"
              className="cl-rss-link"
              aria-label="RSS feed for changelog"
            >
              <svg
                className="cl-rss-icon"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="2" cy="12" r="1.5" fill="currentColor" />
                <path
                  d="M1 7.5a5.5 5.5 0 0 1 5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
                <path
                  d="M1 3a9 9 0 0 1 9 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
              RSS feed
            </a>
            <span className="cl-hero__count">
              {filtered.length} / {recent.length} entries · last ~3 months
            </span>
          </div>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <nav className="cl-filters" aria-label="Changelog filters">
        <div className="container cl-filters__inner">
          <span className="cl-filters__label">Category</span>
          <div
            className="cl-filters__chips"
            role="group"
            aria-label="Filter by category"
          >
            <button
              className={`cl-chip${active === "All" ? " is-active" : ""}`}
              onClick={() => setActive("All")}
              aria-pressed={active === "All"}
            >
              All
            </button>
            {DISPLAY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cl-chip${active === cat ? " is-active" : ""}`}
                data-variant={cat.toLowerCase()}
                onClick={() => setActive(cat)}
                aria-pressed={active === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="cl-filters__sep" aria-hidden="true" />

          <span className="cl-filters__label">Release</span>
          <div
            className="cl-filters__chips"
            role="group"
            aria-label="Filter by release type"
          >
            {(["All", "major", "minor", "patch"] as const).map((v) => (
              <button
                key={v}
                className={`cl-chip${versionFilter === v ? " is-active" : ""}`}
                data-variant={v.toLowerCase()}
                onClick={() => setVersionFilter(v)}
                aria-pressed={versionFilter === v}
              >
                {v === "All" ? "All" : v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Timeline ── */}
      <section className="cl-timeline">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="cl-empty" role="status">
              <p className="cl-empty__title">No entries match your filters.</p>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setActive("All");
                  setVersionFilter("All");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="cl-timeline__track">
              {filtered.map((entry, idx) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  isLast={idx === filtered.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Subscribe row ── */}
      <section className="cl-subscribe">
        <div className="container cl-subscribe__inner">
          <div>
            <p className="cl-subscribe__eyebrow">Stay on the dispatch</p>
            <h2 className="cl-subscribe__headline">
              <span className="wt-900">Every ship note,</span>
              <br />
              <span className="wt-300">direct to you.</span>
            </h2>
          </div>
          <div className="cl-subscribe__actions">
            <a href="/api/changelog.rss" className="cl-subscribe__btn">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="2" cy="12" r="1.5" fill="currentColor" />
                <path
                  d="M1 7.5a5.5 5.5 0 0 1 5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
                <path
                  d="M1 3a9 9 0 0 1 9 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
              RSS
            </a>
            <a href="/blog" className="cl-subscribe__link">
              Read the blog →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
