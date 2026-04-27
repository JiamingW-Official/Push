import Link from "next/link";
import "./blog.css";

export const metadata = {
  title: "Push Notes — Field Reports from the Block",
  description:
    "Creator economy analysis, merchant stories, NYC local commerce intelligence, and product updates from the Push team.",
};

/* ── Static data ─────────────────────────────────────────── */
interface BlogPost {
  id: string;
  slug: string;
  category: string;
  catAbbr: string; // ghost watermark abbreviation
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  featured: boolean;
}

const POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "the-walk-in-economy-is-real",
    category: "Creator Economy",
    catAbbr: "CE",
    title: "The Walk-In Economy Is Real",
    excerpt:
      "Six months of QR scan data across 40 NYC neighborhoods reveal something the VC narrative missed: physical proximity still drives the most durable consumer behavior. We ran the numbers.",
    date: "2026-04-18",
    readTime: 8,
    featured: true,
  },
  {
    id: "2",
    slug: "how-mia-grew-her-brooklyn-following",
    category: "Merchant Stories",
    catAbbr: "MS",
    title: "How Mia Grew a Brooklyn Coffee Shop's Following 3× in 90 Days",
    excerpt:
      "Mia Torres posted twice a week, kept her QR codes on the door and the receipt. Here's exactly what the attribution log looked like — and what finally moved the needle.",
    date: "2026-04-11",
    readTime: 6,
    featured: false,
  },
  {
    id: "3",
    slug: "qr-code-fraud-and-how-we-stop-it",
    category: "Attribution",
    catAbbr: "AT",
    title: "QR Code Fraud: What We Learned After 2M Scans",
    excerpt:
      "Screenshot replays. GPS spoofing. Coordinated scan rings. We've seen it all. This is an honest account of how Push's verification layer evolved — and where it still has gaps.",
    date: "2026-04-04",
    readTime: 10,
    featured: false,
  },
  {
    id: "4",
    slug: "creators-earning-in-harlem",
    category: "NYC Local",
    catAbbr: "NY",
    title: "The Harlem Cohort: What $40K in Creator Earnings Looks Like",
    excerpt:
      "We sat with five creators from the 125th Street corridor and mapped every payout back to a neighborhood business. Spoiler: it's not who you'd expect.",
    date: "2026-03-28",
    readTime: 7,
    featured: false,
  },
  {
    id: "5",
    slug: "push-launch-v11-design",
    category: "Product Updates",
    catAbbr: "PU",
    title: "Push v11: Liquid Glass, Image-First, and the 3-Tier Rule",
    excerpt:
      "Our biggest visual overhaul since launch. Grain-archive typography, unified button discipline, and an expanded design token system built for the long term.",
    date: "2026-03-21",
    readTime: 5,
    featured: false,
  },
  {
    id: "6",
    slug: "building-creator-community-lower-east-side",
    category: "Community",
    catAbbr: "CO",
    title: "Building Creator Density on the Lower East Side",
    excerpt:
      "When ten creators in the same neighborhood all post about the same block, something interesting happens to merchant foot traffic. A look at the cluster effect.",
    date: "2026-03-14",
    readTime: 6,
    featured: false,
  },
];

const CATEGORIES = [
  "Creator Economy",
  "Merchant Stories",
  "NYC Local",
  "Product Updates",
  "Attribution",
  "Community",
];

/* ── Format date ─────────────────────────────────────────── */
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ── Page ────────────────────────────────────────────────── */
export default function BlogPage() {
  const featured = POSTS.find((p) => p.featured)!;
  const grid = POSTS.filter((p) => !p.featured);

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO — dark panel, Magvix Italic bottom-left (§7.1)
          Ghost "BLOG" watermark, liquid-glass stat badge
      ════════════════════════════════════════════════════════ */}
      <section className="blog-hero">
        {/* Dark gradient bg */}
        <div className="blog-hero__bg" aria-hidden="true" />

        {/* Grain texture */}
        <div className="blog-hero__grain" aria-hidden="true" />

        {/* Ghost "BLOG" watermark */}
        <span className="blog-hero__watermark" aria-hidden="true">
          BLOG
        </span>

        {/* Liquid-glass stat badge — top-right */}
        <div
          className="blog-hero__badge lg-surface--badge"
          aria-label="6 dispatches published"
        >
          <span className="blog-hero__badge-num">{POSTS.length}</span>
          <span className="blog-hero__badge-label">dispatches</span>
        </div>

        {/* Corner-anchored title — bottom-left */}
        <div className="blog-hero__content">
          <p className="blog-hero__eyebrow">(EDITORIAL)</p>
          {/* Magvix Hero italic — 1 per page, clamp(64px,9vw,160px) */}
          <h1 className="blog-hero__title">Push Perspectives.</h1>
          <p className="blog-hero__sub">
            Field reports from NYC&apos;s creator-commerce frontier. Attribution
            data, merchant stories, and the economics of the block.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SIG DIVIDER 1
      ════════════════════════════════════════════════════════ */}
      <div className="blog-sig-wrap">
        <span className="sig-divider">Cut · Print · Wrap ·</span>
      </div>

      {/* ══════════════════════════════════════════════════════
          STATS STRIP — dark ink panel with 3 KPI numbers
      ════════════════════════════════════════════════════════ */}
      <div className="blog-stats-strip">
        <div className="blog-stats-strip__inner">
          <div className="blog-stats-strip__item">
            <span className="blog-stats-strip__num">12</span>
            <span className="blog-stats-strip__cap">Stories published</span>
          </div>
          <div className="blog-stats-strip__divider" aria-hidden="true" />
          <div className="blog-stats-strip__item">
            <span className="blog-stats-strip__num">6</span>
            <span className="blog-stats-strip__cap">Categories</span>
          </div>
          <div className="blog-stats-strip__divider" aria-hidden="true" />
          <div className="blog-stats-strip__item">
            <span className="blog-stats-strip__num">40</span>
            <span className="blog-stats-strip__cap">NYC neighborhoods</span>
          </div>
          <div className="blog-stats-strip__divider" aria-hidden="true" />
          <div className="blog-stats-strip__item">
            <span className="blog-stats-strip__num">Wkly</span>
            <span className="blog-stats-strip__cap">Updated weekly</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          CATEGORY FILTER + SECTION TITLE
      ════════════════════════════════════════════════════════ */}
      <section className="blog-filter">
        <div className="blog-filter__inner">
          <p className="blog-filter__eyebrow">(BROWSE BY TOPIC)</p>
          <h2 className="blog-filter__title">All Dispatches</h2>
          {/* btn-pill style filter chips */}
          <div
            className="blog-filter__pills"
            role="group"
            aria-label="Filter by category"
          >
            <span className="blog-pill blog-pill--active">All</span>
            {CATEGORIES.map((cat) => (
              <span key={cat} className="blog-pill">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURED ARTICLE — full 12-col Photo Card
      ════════════════════════════════════════════════════════ */}
      <section className="blog-featured-section">
        <div className="blog-featured-section__inner">
          <Link
            href={`/blog/${featured.slug}`}
            className="blog-featured-card click-shift"
            aria-label={`Featured: ${featured.title}`}
          >
            {/* Tonal image background */}
            <div className="blog-featured-card__img-bg" aria-hidden="true">
              <span className="blog-featured-card__cat-mark">
                {featured.catAbbr}
              </span>
            </div>

            {/* Bottom gradient overlay — 35% transparent → rgba(0,0,0,0.78) */}
            <div className="blog-featured-card__overlay" aria-hidden="true" />

            {/* Featured badge */}
            <span className="blog-featured-card__badge">Featured</span>

            {/* Text overlay — bottom-left (§7.1 Photo Card) */}
            <div className="blog-featured-card__text">
              <p className="blog-featured-card__eyebrow">{featured.category}</p>
              {/* Photo Card Title: Darky 20px 700 snow */}
              <h2 className="blog-featured-card__title">{featured.title}</h2>
              <div className="blog-featured-card__meta">
                <span>{fmtDate(featured.date)}</span>
                <span aria-hidden="true">·</span>
                <span>{featured.readTime} min read</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ARTICLE GRID — 3-column Photo Cards
      ════════════════════════════════════════════════════════ */}
      <section className="blog-grid-section">
        <div className="blog-grid-section__inner">
          <div className="blog-grid-section__header">
            <p className="blog-grid-section__eyebrow">(ALL DISPATCHES)</p>
          </div>

          <div className="blog-grid">
            {grid.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="photo-card"
                aria-label={post.title}
              >
                {/* Tonal image bg with ghost cat abbreviation */}
                <div className="photo-card__img-bg" aria-hidden="true">
                  <span className="photo-card__cat-ghost">{post.catAbbr}</span>
                </div>

                {/* Bottom gradient overlay */}
                <div className="photo-card__overlay" aria-hidden="true" />

                {/* Text overlay — bottom 24px inset */}
                <div className="photo-card__text">
                  <p className="photo-card__eyebrow">{post.category}</p>
                  {/* Photo Card Title: Darky 20px 700 snow */}
                  <h3 className="photo-card__title">{post.title}</h3>
                  <div className="photo-card__meta">
                    <span>{fmtDate(post.date)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DARK EDITORIAL — "Push Perspectives" display + categories
      ════════════════════════════════════════════════════════ */}
      <section className="blog-perspectives">
        <div className="blog-perspectives__inner">
          {/* Left: Darky Display headline */}
          <div>
            <p className="blog-perspectives__eyebrow">(WHY THIS EXISTS)</p>
            {/* Darky Display Hero — clamp(56px,8vw,128px) weight 900 */}
            <h2 className="blog-perspectives__title">
              Push
              <br />
              Notes.
            </h2>
            <p className="blog-perspectives__body">
              Six lenses on the creator-commerce economy. Every dispatch is a
              primary source — tied to real scan logs, real neighborhoods, real
              creators.
            </p>
          </div>

          {/* Right: category list with dotted rows */}
          <div
            className="blog-cat-list"
            role="list"
            aria-label="Content categories"
          >
            {CATEGORIES.map((cat, i) => (
              <div key={cat} className="blog-cat-row" role="listitem">
                <div className="blog-cat-row__left">
                  <span className="blog-cat-row__num" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="blog-cat-row__name">{cat}</span>
                </div>
                <span className="blog-cat-row__count">
                  {POSTS.filter((p) => p.category === cat).length} post
                  {POSTS.filter((p) => p.category === cat).length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SIG DIVIDER 2
      ════════════════════════════════════════════════════════ */}
      <div className="blog-sig-wrap">
        <span className="sig-divider">Posted · Scanned · Verified ·</span>
      </div>

      {/* ══════════════════════════════════════════════════════
          TICKET PANEL CTA — ≤1 per page, GA Orange
          "Never miss a post" with email CTA
      ════════════════════════════════════════════════════════ */}
      <section className="blog-ticket-section">
        <div className="blog-ticket-section__inner">
          <div className="ticket-panel">
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.55)", textAlign: "center" }}
            >
              (SUBSCRIBE)
            </p>
            {/* Magvix Italic centered headline — Ticket Panel exception §7.3 */}
            <h2
              style={{
                fontFamily: "var(--font-hero)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(40px, 5vw, 56px)",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                margin: "16px 0 0",
                textAlign: "center",
              }}
            >
              Never miss a dispatch.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                lineHeight: 1.5,
                color: "var(--ink)",
                opacity: 0.75,
                maxWidth: "40ch",
                textAlign: "center",
                margin: "16px auto 32px",
              }}
            >
              Attribution data, creator economy analysis, and NYC local commerce
              intelligence — every Thursday.
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {/* btn-ink: Ink fill + Snow text, 8px radius */}
              <Link href="/blog" className="btn-ink">
                Browse all notes
              </Link>
              {/* btn-ghost: transparent + 1px ink border */}
              <a href="mailto:notes@pushnyc.co" className="btn-ghost">
                Write to us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
