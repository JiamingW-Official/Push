"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./help.css";
import {
  ARTICLES,
  CATEGORIES,
  getPopularArticles,
  getArticleCountByCategory,
  searchArticles,
  type HelpCategory,
} from "@/lib/help/mock-articles";

/* ── Category icons (outline SVG) ─────────────────────────── */
function IconRocket() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
    </svg>
  );
}

function IconQr() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zm0 9.75c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zm9.75-9.75c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 6.75h.75v.75h-.75v-.75zm0 9.75h.75v.75h-.75v-.75zm9.75-9.75h.75v.75h-.75v-.75zm-3.75 9h1.5v1.5H12.75v-1.5zm3 0h.75v.75h-.75v-.75zm0 3h.75v.75h-.75v-.75zm-3 0h.75v.75h-.75v-.75zm-3-3h.75v.75h-.75v-.75zm3-3h.75v.75h-.75v-.75zm3 0h.75v.75h-.75v-.75z"
      />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
      />
    </svg>
  );
}

function IconStar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}

function IconStore() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
      />
    </svg>
  );
}

function IconUser() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={20}
      height={20}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
      />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={16}
      height={16}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

function IconStatus() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      />
    </svg>
  );
}

/* ── Category icon map ─────────────────────────────────────── */
const CATEGORY_ICONS: Record<HelpCategory, React.ReactNode> = {
  "getting-started": <IconRocket />,
  "qr-attribution": <IconQr />,
  payments: <IconCreditCard />,
  creators: <IconStar />,
  merchants: <IconStore />,
  account: <IconUser />,
};

/* ── Hero with search ──────────────────────────────────────── */
function HelpHero() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce 200ms
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(query), 200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const results =
    debouncedQuery.trim().length > 1 ? searchArticles(debouncedQuery) : [];
  const showDropdown = focused && debouncedQuery.trim().length > 1;

  return (
    <section className="help-hero">
      <p className="help-hero__eyebrow">Help Center</p>
      <h1 className="help-hero__title">
        How can we <em>help?</em>
      </h1>
      <div className="help-search">
        <input
          type="text"
          className="help-search__input"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          aria-label="Search help articles"
          autoComplete="off"
        />
        <span className="help-search__icon" aria-hidden>
          <IconSearch />
        </span>

        {showDropdown && (
          <div className="help-search__results" role="listbox">
            {results.length === 0 ? (
              <p className="help-search__no-results">
                No results for &quot;{query}&quot;
              </p>
            ) : (
              results.slice(0, 8).map((a) => (
                <Link
                  key={a.slug}
                  href={`/help/${a.slug}`}
                  className="help-search__result-item"
                  role="option"
                  aria-selected={false}
                >
                  <span className="help-search__result-title">{a.title}</span>
                  <span className="help-search__result-cat">
                    {CATEGORIES[a.category].label}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Category grid ─────────────────────────────────────────── */
function CategoryGrid() {
  const counts = getArticleCountByCategory();
  const cats = Object.entries(CATEGORIES) as [
    HelpCategory,
    { label: string; description: string },
  ][];

  return (
    <section className="help-categories">
      <h2 className="help-section-title">Browse by topic</h2>
      <div className="help-category-grid">
        {cats.map(([key, cat], i) => (
          <Link
            key={key}
            href={`/help?category=${key}`}
            className={`help-category-card help-animate help-animate--delay-${Math.min(i + 1, 6)}`}
          >
            <span className="help-category-icon" aria-hidden>
              {CATEGORY_ICONS[key]}
            </span>
            <span className="help-category-body">
              <span className="help-category-name">{cat.label}</span>
              <span className="help-category-desc">{cat.description}</span>
              <span className="help-category-count">
                {counts[key]} article{counts[key] !== 1 ? "s" : ""}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── Popular articles ──────────────────────────────────────── */
function PopularArticles() {
  const popular = getPopularArticles(8);

  return (
    <section className="help-popular">
      <h2 className="help-section-title">Popular articles</h2>
      <div className="help-popular-grid">
        {popular.map((article, i) => (
          <Link
            key={article.slug}
            href={`/help/${article.slug}`}
            className="help-article-row"
          >
            <span className="help-article-row__rank">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="help-article-row__body">
              <span className="help-article-row__title">{article.title}</span>
              <span className="help-article-row__meta">
                {CATEGORIES[article.category].label} &middot;{" "}
                {article.viewCount.toLocaleString()} views
              </span>
            </span>
            <span className="help-article-row__arrow" aria-hidden>
              <IconArrowRight />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── Quick links ───────────────────────────────────────────── */
function QuickLinks() {
  return (
    <section className="help-quicklinks">
      <h2 className="help-section-title">Quick links</h2>
      <div className="help-quicklinks-row">
        <a
          href="https://status.push.nyc"
          target="_blank"
          rel="noopener noreferrer"
          className="help-quicklink"
        >
          <IconStatus />
          Status page
        </a>
        <a href="mailto:support@push.nyc" className="help-quicklink">
          <IconMail />
          Contact support
        </a>
        <a
          href="https://community.push.nyc"
          target="_blank"
          rel="noopener noreferrer"
          className="help-quicklink"
        >
          <IconUsers />
          Community forum
        </a>
      </div>
    </section>
  );
}

/* ── Category filter view ──────────────────────────────────── */
function CategoryArticles({ category }: { category: HelpCategory }) {
  const cat = CATEGORIES[category];
  const articles = ARTICLES.filter((a) => a.category === category).sort(
    (a, b) => b.viewCount - a.viewCount,
  );

  return (
    <div style={{ paddingTop: 48 }}>
      <div style={{ marginBottom: 40 }}>
        <Link
          href="/help"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--tertiary)",
            textDecoration: "none",
          }}
        >
          &larr; All topics
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "var(--dark)",
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          {cat.label}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: "var(--graphite)",
          }}
        >
          {cat.description}
        </p>
      </div>

      <div className="help-popular-grid" style={{ gridTemplateColumns: "1fr" }}>
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/help/${article.slug}`}
            className="help-article-row"
          >
            <span className="help-article-row__body">
              <span className="help-article-row__title">{article.title}</span>
              <span className="help-article-row__meta">
                {article.viewCount.toLocaleString()} views &middot; Updated{" "}
                {new Date(article.lastUpdated).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </span>
            <span className="help-article-row__arrow" aria-hidden>
              <IconArrowRight />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function HelpPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const categoryParam = searchParams?.category as HelpCategory | undefined;
  const isValidCategory = categoryParam && categoryParam in CATEGORIES;

  return (
    <>
      <HelpHero />
      <main className="help-main">
        {isValidCategory ? (
          <CategoryArticles category={categoryParam as HelpCategory} />
        ) : (
          <>
            <CategoryGrid />
            <PopularArticles />
            <QuickLinks />
          </>
        )}
      </main>
    </>
  );
}
