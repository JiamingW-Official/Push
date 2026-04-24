"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MOCK_POSTS,
  BLOG_CATEGORIES,
  type BlogPost,
  type PostCategory,
} from "@/lib/blog/mock-posts";
import "./blog.css";

/* ── Format helpers ─────────────────────────────────────── */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ── Category pill ──────────────────────────────────────── */
function CategoryTag({ category }: { category: PostCategory }) {
  return (
    <span
      className={`blog-cat-tag blog-cat-tag--${category.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {category}
    </span>
  );
}

/* ── Featured post card ─────────────────────────────────── */
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
            <span className="blog-featured__badge-label">Latest</span>
          </div>
        </div>
        <div className="blog-featured__body">
          <CategoryTag category={post.category} />
          <h2 className="blog-featured__title">{post.title}</h2>
          <p className="blog-featured__excerpt">{post.excerpt}</p>
          <div className="blog-featured__meta">
            <span className="blog-featured__author">{post.author.name}</span>
            <span className="blog-featured__sep" aria-hidden="true">
              ·
            </span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            <span className="blog-featured__sep" aria-hidden="true">
              ·
            </span>
            <span>{post.readMins} min read</span>
          </div>
          <span className="blog-featured__cta">Read field report →</span>
        </div>
      </Link>
    </article>
  );
}

/* ── Post card (grid) ───────────────────────────────────── */
function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <article
      className="blog-card"
      style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
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
          <CategoryTag category={post.category} />
          <h3 className="blog-card__title">{post.title}</h3>
          <p className="blog-card__excerpt">{post.excerpt}</p>
          <div className="blog-card__meta">
            <span className="blog-card__avatar" aria-hidden="true">
              {post.author.avatar}
            </span>
            <span className="blog-card__author">{post.author.name}</span>
            <span className="blog-card__sep" aria-hidden="true">
              ·
            </span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ── Newsletter section ─────────────────────────────────── */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="blog-newsletter">
      <div className="blog-newsletter__inner">
        <div className="blog-newsletter__text">
          <p className="eyebrow blog-newsletter__eyebrow">Push Notes Weekly</p>
          <h2 className="blog-newsletter__headline">
            <span className="wt-900">Field reports.</span>
            <br />
            <span className="wt-300">Every Thursday.</span>
          </h2>
          <p className="blog-newsletter__sub">
            Attribution data, creator economy analysis, and NYC local commerce
            intelligence — direct to your inbox.
          </p>
        </div>
        <div className="blog-newsletter__form-wrap">
          {submitted ? (
            <div className="blog-newsletter__success">
              <span className="blog-newsletter__success-icon">✓</span>
              <span>You&apos;re in. First report arrives Thursday.</span>
            </div>
          ) : (
            <form className="blog-newsletter__form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="blog-newsletter__input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <button
                type="submit"
                className="btn btn-primary blog-newsletter__btn"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="blog-newsletter__note">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}

/* ── Main page ──────────────────────────────────────────── */
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<PostCategory | "All">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Debounce search input 200ms
  const handleSearch = useCallback((val: string) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(val);
    }, 200);
  }, []);

  // Global "/" shortcut to focus search
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

  const [featuredPost, ...gridPosts] = MOCK_POSTS;

  const filteredPosts = useMemo(() => {
    let posts = gridPosts;
    if (activeCategory !== "All") {
      posts = posts.filter((p) => p.category === activeCategory);
    }
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.author.name.toLowerCase().includes(q),
      );
    }
    return posts;
  }, [activeCategory, debouncedQuery]);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="blog-hero">
        <div className="container blog-hero__inner">
          <p className="eyebrow blog-hero__eyebrow">Push Notes</p>
          <h1 className="blog-hero__headline">
            <span className="wt-900">Push Notes.</span>
          </h1>
          <p className="blog-hero__tagline">
            Field reports from NYC&apos;s verified foot traffic revolution.
          </p>
          <div className="blog-hero__meta-row">
            <span className="blog-hero__count">
              {MOCK_POSTS.length} dispatches
            </span>
            <span className="blog-hero__sep" aria-hidden="true">
              ·
            </span>
            <span className="blog-hero__topics">
              Attribution · Creator Economy · Local Commerce · Engineering
            </span>
          </div>
        </div>
      </section>

      {/* ── Featured post ──────────────────────────────── */}
      <section className="blog-featured-section">
        <div className="container">
          <FeaturedPost post={featuredPost} />
        </div>
      </section>

      {/* ── Filter + Search toolbar ─────────────────────── */}
      <div className="blog-toolbar">
        <div className="container blog-toolbar__inner">
          {/* Category chips */}
          <div
            className="blog-filter-chips"
            role="group"
            aria-label="Filter by category"
          >
            <button
              className={`blog-chip${activeCategory === "All" ? " blog-chip--active" : ""}`}
              onClick={() => setActiveCategory("All")}
            >
              All
            </button>
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`blog-chip${activeCategory === cat ? " blog-chip--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
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
              placeholder="Search notes… (/)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Search blog posts"
            />
          </div>
        </div>
      </div>

      {/* ── Post grid ──────────────────────────────────── */}
      <section className="blog-grid-section">
        <div className="container">
          {filteredPosts.length > 0 ? (
            <div className="blog-grid">
              {filteredPosts.map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="blog-empty">
              <p className="blog-empty__text">
                No notes found{debouncedQuery ? ` for "${debouncedQuery}"` : ""}
                .
              </p>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                  setDebouncedQuery("");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────────── */}
      <Newsletter />
    </>
  );
}
