"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MOCK_POSTS,
  type BlogPost,
  type PostCategory,
} from "@/lib/blog/mock-posts";
import "./blog.css";

/* ── v5.1 display categories ─────────────────────────────
   Spec says: All / Product / Engineering / Neighborhood / Research.
   Raw data still uses 5 categories (Product, Insights, Community,
   Case Studies, Engineering) — we map them into the v5.1 surface set
   without touching the data layer.
   ──────────────────────────────────────────────────────── */
type DisplayCategory = "Product" | "Engineering" | "Neighborhood" | "Research";

const DISPLAY_CATEGORIES: DisplayCategory[] = [
  "Product",
  "Engineering",
  "Neighborhood",
  "Research",
];

function toDisplayCategory(c: PostCategory): DisplayCategory {
  switch (c) {
    case "Product":
      return "Product";
    case "Engineering":
      return "Engineering";
    case "Community":
    case "Case Studies":
      return "Neighborhood";
    case "Insights":
    default:
      return "Research";
  }
}

/* ── Format helpers ─────────────────────────────────────── */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* Pseudo-views ranking — stable order derived from slug length + date.
   Deterministic so the "top 3 by views" sidebar doesn't hop around on
   re-renders. */
function viewsFor(post: BlogPost): number {
  const n = post.slug.length * 137 + post.readMins * 211;
  const t = new Date(post.publishedAt).getTime() / 864_00_000; // days
  return Math.round((n % 4200) + (t % 300));
}

/* ── Category eyebrow (maps source → display) ──────────── */
function CategoryEyebrow({ category }: { category: PostCategory }) {
  const display = toDisplayCategory(category);
  return (
    <span className={`blog-eyebrow blog-eyebrow--${display.toLowerCase()}`}>
      {display}
    </span>
  );
}

/* ── Featured post (full-width hero) ─────────────────────── */
function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <article className="blog-featured">
      <Link href={`/blog/${post.slug}`} className="blog-featured__link">
        <div className="blog-featured__image-wrap">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="blog-featured__image"
            priority
          />
          <div className="blog-featured__overlay" />
          <div className="blog-featured__badge">
            <span className="blog-featured__badge-label">Featured</span>
          </div>
        </div>
        <div className="blog-featured__body">
          <CategoryEyebrow category={post.category} />
          <h2 className="blog-featured__title">{post.title}</h2>
          <p className="blog-featured__excerpt">{post.excerpt}</p>
          <div className="blog-featured__author-row">
            <span className="blog-featured__avatar" aria-hidden="true">
              {post.author.avatar}
            </span>
            <div className="blog-featured__author-text">
              <span className="blog-featured__author">{post.author.name}</span>
              <span className="blog-featured__role">{post.author.role}</span>
            </div>
            <div className="blog-featured__divider" aria-hidden="true" />
            <div className="blog-featured__meta-stack">
              <time dateTime={post.publishedAt} className="blog-featured__date">
                {formatDate(post.publishedAt)}
              </time>
              <span className="blog-featured__read">
                {post.readMins} min read
              </span>
            </div>
          </div>
          <span className="blog-featured__cta">Read dispatch →</span>
        </div>
      </Link>
    </article>
  );
}

/* ── Grid card ──────────────────────────────────────────── */
function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <article
      className="blog-card"
      style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
    >
      <Link href={`/blog/${post.slug}`} className="blog-card__link">
        <div className="blog-card__image-wrap">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="blog-card__image"
          />
        </div>
        <div className="blog-card__body">
          <CategoryEyebrow category={post.category} />
          <h3 className="blog-card__title">{post.title}</h3>
          <p className="blog-card__excerpt">{post.excerpt}</p>
          <div className="blog-card__meta">
            <span className="blog-card__avatar" aria-hidden="true">
              {post.author.avatar}
            </span>
            <span className="blog-card__author">{post.author.name}</span>
            <span className="blog-card__sep" aria-hidden="true">
              /
            </span>
            <time dateTime={post.publishedAt}>
              {formatShortDate(post.publishedAt)}
            </time>
            <span className="blog-card__sep" aria-hidden="true">
              /
            </span>
            <span className="blog-card__read">{post.readMins} min</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ── Reading list (desktop sidebar) ─────────────────────── */
function ReadingList({ posts }: { posts: BlogPost[] }) {
  return (
    <aside className="blog-reading-list" aria-labelledby="reading-list-heading">
      <div className="blog-reading-list__header">
        <span className="blog-reading-list__eyebrow">Most read</span>
        <h3 className="blog-reading-list__headline" id="reading-list-heading">
          Reading list.
        </h3>
      </div>
      <ol className="blog-reading-list__items">
        {posts.map((post, i) => (
          <li key={post.slug} className="blog-reading-list__item">
            <Link
              href={`/blog/${post.slug}`}
              className="blog-reading-list__link"
            >
              <span className="blog-reading-list__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="blog-reading-list__content">
                <CategoryEyebrow category={post.category} />
                <h4 className="blog-reading-list__title">{post.title}</h4>
                <span className="blog-reading-list__meta">
                  {post.readMins} min · {formatShortDate(post.publishedAt)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/* ── Main page ──────────────────────────────────────────── */
export default function BlogPage() {
  const [active, setActive] = useState<DisplayCategory | "All">("All");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Global "/" to focus search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Featured = newest post (first in MOCK_POSTS, already in reverse-chronological order)
  const featured = MOCK_POSTS[0];
  const rest = MOCK_POSTS.slice(1);

  // Top 3 for Reading List (stable, deterministic)
  const topThree = useMemo(() => {
    return [...MOCK_POSTS]
      .sort((a, b) => viewsFor(b) - viewsFor(a))
      .slice(0, 3);
  }, []);

  const filtered = useMemo(() => {
    let posts = rest;
    if (active !== "All") {
      posts = posts.filter((p) => toDisplayCategory(p.category) === active);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return posts;
  }, [active, query, rest]);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="blog-hero">
        <div className="container blog-hero__inner">
          <p className="eyebrow blog-hero__eyebrow">Blog</p>
          <h1 className="blog-hero__headline">
            Dispatches
            <br />
            <span className="wt-300">from the beachhead.</span>
          </h1>
          <p className="blog-hero__tagline">
            Field notes on Vertical AI for Local Commerce — Williamsburg
            Coffee+, ConversionOracle™ accuracy, the Software Leverage Ratio
            ladder, and what we&apos;re learning from the Neighborhood Playbook.
          </p>
          <div className="blog-hero__meta-row">
            <span className="blog-hero__count">
              {MOCK_POSTS.length} dispatches
            </span>
            <span className="blog-hero__sep" aria-hidden="true">
              ·
            </span>
            <span className="blog-hero__topics">
              Vertical AI · ConversionOracle · Neighborhood Playbook ·
              Engineering · Research
            </span>
          </div>
        </div>
      </section>

      {/* ── Featured post ──────────────────────────────── */}
      <section className="blog-featured-section">
        <div className="container">
          <FeaturedPost post={featured} />
        </div>
      </section>

      {/* ── Filter + Search toolbar ─────────────────────── */}
      <div className="blog-toolbar">
        <div className="container blog-toolbar__inner">
          {/* Category chips — pill 50vh (Design.md exception) */}
          <div
            className="blog-filter-chips"
            role="group"
            aria-label="Filter by category"
          >
            <button
              className={`blog-chip${active === "All" ? " blog-chip--active" : ""}`}
              onClick={() => setActive("All")}
              aria-pressed={active === "All"}
            >
              All
            </button>
            {DISPLAY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`blog-chip${active === cat ? " blog-chip--active" : ""}`}
                data-variant={cat.toLowerCase()}
                onClick={() => setActive(cat)}
                aria-pressed={active === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="blog-search-wrap">
            <span className="blog-search-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 11l3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </span>
            <input
              ref={searchRef}
              type="search"
              className="blog-search"
              placeholder="Search dispatches… (/)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search blog posts"
            />
          </div>
        </div>
      </div>

      {/* ── Grid + reading-list sidebar ─────────────────── */}
      <section className="blog-grid-section">
        <div className="container">
          <div className="blog-layout">
            <div className="blog-grid-wrap">
              {filtered.length > 0 ? (
                <div className="blog-grid">
                  {filtered.map((post, i) => (
                    <PostCard key={post.slug} post={post} index={i} />
                  ))}
                </div>
              ) : (
                <div className="blog-empty">
                  <p className="blog-empty__text">
                    No dispatches found
                    {query ? ` for "${query}"` : ""}.
                  </p>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      setActive("All");
                      setQuery("");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <ReadingList posts={topThree} />
          </div>
        </div>
      </section>
    </>
  );
}
