"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import "./changelog.css";
import {
  changelogEntries,
  allAreas,
  allVersionTags,
  type VersionTag,
  type AreaTag,
} from "@/lib/changelog/mock-entries";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getYear(iso: string): string {
  return iso.slice(0, 4);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Group entries by year, newest year first
function groupByYear(
  entries: typeof changelogEntries,
): [string, typeof changelogEntries][] {
  const map = new Map<string, typeof changelogEntries>();
  for (const e of entries) {
    const y = getYear(e.date);
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(e);
  }
  // Sort years descending
  return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0]));
}

// ── Image Placeholder ────────────────────────────────────────────────────────

function ImagePlaceholder({
  label,
  size,
}: {
  label: string;
  size: "normal" | "large";
}) {
  return (
    <div className={`cl-card-image ${size === "large" ? "major" : ""}`}>
      <div className="cl-image-placeholder-inner">
        {/* Simple image icon */}
        <svg
          className="cl-image-icon"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2"
            y="6"
            width="36"
            height="28"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="13"
            cy="16"
            r="3.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M2 30 L11 20 L18 27 L26 18 L38 30"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <span className="cl-image-label">{label}</span>
      </div>
    </div>
  );
}

// ── Entry Card ────────────────────────────────────────────────────────────────

function EntryCard({ entry }: { entry: (typeof changelogEntries)[number] }) {
  const [bodyOpen, setBodyOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={cardRef} className={`cl-card ${entry.versionTag}`} role="article">
      {/* ── Card header ── */}
      <div className="cl-card-header">
        <div className="cl-card-meta-left">
          <span className={`cl-version-badge ${entry.versionTag}`}>
            {entry.versionTag === "major"
              ? "Major"
              : entry.versionTag === "minor"
                ? "Minor"
                : "Patch"}
          </span>
          <span className="cl-version-string">v{entry.version}</span>
        </div>
        <span className="cl-area-badge" data-area={entry.area}>
          {entry.area}
        </span>
      </div>

      {/* ── Hero image placeholder ── */}
      <ImagePlaceholder
        label={entry.imagePlaceholder}
        size={entry.versionTag === "major" ? "large" : "normal"}
      />

      {/* ── Body ── */}
      <div className="cl-card-body">
        <h3 className="cl-card-title">{entry.title}</h3>
        <p className="cl-card-summary">{entry.summary}</p>

        {/* Collapsible long body */}
        <div className={`cl-card-long ${bodyOpen ? "open" : ""}`}>
          {entry.body}
        </div>

        <button
          className={`cl-read-more-btn ${bodyOpen ? "open" : ""}`}
          onClick={() => setBodyOpen((v) => !v)}
          aria-expanded={bodyOpen}
        >
          {bodyOpen ? "Show less" : "Read more"}
          <span className="cl-read-more-chevron" aria-hidden="true">
            ↓
          </span>
        </button>

        {/* Bullet features */}
        <ul className="cl-bullet-list">
          {entry.bullets.map((b, i) => (
            <li key={i} className="cl-bullet-item">
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Footer ── */}
      <div className="cl-card-footer">
        <div className="cl-author">
          <div className="cl-author-avatar" aria-hidden="true">
            <span className="cl-author-avatar-initials">
              {getInitials(entry.author.name)}
            </span>
          </div>
          <div className="cl-author-info">
            <span className="cl-author-name">{entry.author.name}</span>
            <span className="cl-author-role">{entry.author.role}</span>
          </div>
        </div>
        <span className="cl-coded-by">
          Coded by <strong>{entry.codedBy}</strong>
        </span>
      </div>
    </div>
  );
}

// ── Timeline row (three-column grid row) ──────────────────────────────────────

function TimelineRow({
  entry,
  isLast,
}: {
  entry: (typeof changelogEntries)[number];
  isLast: boolean;
}) {
  return (
    <div
      className="cl-entry"
      style={
        {
          /* display:contents means children slot into .cl-track grid columns */
        }
      }
    >
      {/* Column 1: date */}
      <div className="cl-entry-date-col">
        <time className="cl-entry-date" dateTime={entry.date}>
          {formatDate(entry.date)}
        </time>
      </div>

      {/* Column 2: line + dot */}
      <div className="cl-entry-line-col" aria-hidden="true">
        <div className={`cl-entry-dot ${entry.versionTag}`} />
        {!isLast && <div className="cl-line-track" />}
      </div>

      {/* Column 3: card */}
      <div className="cl-entry-content">
        <EntryCard entry={entry} />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ChangelogPage() {
  const [activeArea, setActiveArea] = useState<AreaTag | "all">("all");
  const [activeVersion, setActiveVersion] = useState<VersionTag | "all">("all");

  // Filtered entries
  const filtered = changelogEntries.filter((e) => {
    const areaMatch = activeArea === "all" || e.area === activeArea;
    const versionMatch =
      activeVersion === "all" || e.versionTag === activeVersion;
    return areaMatch && versionMatch;
  });

  const grouped = groupByYear(filtered);

  const handleAreaChip = useCallback((area: AreaTag | "all") => {
    setActiveArea((prev) => (prev === area ? "all" : area));
  }, []);

  const handleVersionChip = useCallback((v: VersionTag | "all") => {
    setActiveVersion((prev) => (prev === v ? "all" : v));
  }, []);

  return (
    <main className="cl-page">
      {/* ── Hero ── */}
      <section className="cl-hero" aria-labelledby="cl-title">
        <div className="cl-hero-inner">
          <p className="cl-hero-eyebrow">Product Updates</p>
          <h1 className="cl-hero-title" id="cl-title">
            Shipping
            <br />
            notes.
          </h1>
          <p className="cl-hero-sub">
            What we released, what we learned. Every meaningful change to Push,
            in reverse chronological order.
          </p>
          <div className="cl-hero-meta">
            <a
              href="/api/changelog.rss"
              className="cl-rss-link"
              aria-label="RSS feed for changelog"
            >
              {/* RSS icon */}
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
              RSS Feed
            </a>
            <span className="cl-entry-count">
              {filtered.length} of {changelogEntries.length} entries
            </span>
          </div>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <nav className="cl-filter-bar" aria-label="Changelog filters">
        <div className="cl-filter-inner">
          {/* Area filters */}
          <span className="cl-filter-label">Area</span>
          <div
            className="cl-filter-chips"
            role="group"
            aria-label="Filter by area"
          >
            <button
              className={`cl-chip cl-chip-all ${activeArea === "all" ? "active" : ""}`}
              onClick={() => handleAreaChip("all")}
              aria-pressed={activeArea === "all"}
            >
              All
            </button>
            {allAreas.map((area) => (
              <button
                key={area}
                className={`cl-chip ${activeArea === area ? "active" : ""}`}
                data-variant={area}
                onClick={() => handleAreaChip(area)}
                aria-pressed={activeArea === area}
              >
                {area}
              </button>
            ))}
          </div>

          <div className="cl-filter-sep" aria-hidden="true" />

          {/* Version type filters */}
          <span className="cl-filter-label">Type</span>
          <div
            className="cl-filter-chips"
            role="group"
            aria-label="Filter by release type"
          >
            <button
              className={`cl-chip cl-chip-all ${activeVersion === "all" ? "active" : ""}`}
              onClick={() => handleVersionChip("all")}
              aria-pressed={activeVersion === "all"}
            >
              All
            </button>
            {allVersionTags.map((v) => (
              <button
                key={v}
                className={`cl-chip ${activeVersion === v ? "active" : ""}`}
                data-variant={v}
                onClick={() => handleVersionChip(v)}
                aria-pressed={activeVersion === v}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Timeline ── */}
      <div className="cl-timeline">
        {grouped.length === 0 ? (
          <div className="cl-empty" role="status">
            <p className="cl-empty-title">No entries match your filters.</p>
            <p className="cl-empty-sub">
              Try clearing the Area or Type filter above.
            </p>
          </div>
        ) : (
          grouped.map(([year, entries]) => (
            <div key={year} className="cl-year-group">
              <p className="cl-year-label" aria-hidden="true">
                {year}
              </p>
              <div className="cl-track">
                {entries.map((entry, idx) => (
                  <TimelineRow
                    key={entry.id}
                    entry={entry}
                    isLast={idx === entries.length - 1}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
