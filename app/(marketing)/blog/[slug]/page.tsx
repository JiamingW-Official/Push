import Link from "next/link";
import "./article.css";

export const metadata = {
  title: "The Walk-In Economy Is Real — Push Notes",
  description:
    "Six months of QR scan data across 40 NYC neighborhoods reveal something the VC narrative missed: physical proximity still drives the most durable consumer behavior.",
};

/* ── Static post data ────────────────────────────────────── */
interface RelatedPost {
  slug: string;
  category: string;
  catAbbr: string;
  title: string;
  date: string;
  readTime: number;
  excerpt: string;
}

const RELATED: RelatedPost[] = [
  {
    slug: "how-mia-grew-her-brooklyn-following",
    category: "Merchant Stories",
    catAbbr: "MS",
    title: "How Mia Grew a Brooklyn Coffee Shop's Following 3× in 90 Days",
    date: "2026-04-11",
    readTime: 6,
    excerpt:
      "Mia Torres posted twice a week, kept her QR codes on the door and the receipt. Here's exactly what the attribution log looked like.",
  },
  {
    slug: "qr-code-fraud-and-how-we-stop-it",
    category: "Attribution",
    catAbbr: "AT",
    title: "QR Code Fraud: What We Learned After 2M Scans",
    date: "2026-04-04",
    readTime: 10,
    excerpt:
      "Screenshot replays. GPS spoofing. Coordinated scan rings. An honest account of how Push's verification layer evolved.",
  },
  {
    slug: "creators-earning-in-harlem",
    category: "NYC Local",
    catAbbr: "NY",
    title: "The Harlem Cohort: What $40K in Creator Earnings Looks Like",
    date: "2026-03-28",
    readTime: 7,
    excerpt:
      "Five creators from the 125th Street corridor. Every payout mapped back to a neighborhood business.",
  },
];

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function fmtShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ── Page ────────────────────────────────────────────────── */
export default function ArticlePage({ params }: { params: { slug: string } }) {
  // Static example post — "The Walk-In Economy Is Real"
  void params; // accepted for dynamic routing; content is static example

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          ARTICLE HERO — dark panel, H1 bottom-left (§7.1)
          Liquid-glass read-time badge top-right
      ════════════════════════════════════════════════════════ */}
      <header className="article-hero">
        {/* Grain overlay */}
        <div className="article-hero__grain" aria-hidden="true" />

        {/* Liquid-glass read-time badge — top-right */}
        <div
          className="article-hero__badge lg-surface--badge"
          aria-label="8 minute read"
        >
          <span className="article-hero__badge-num">8</span>
          <span className="article-hero__badge-label">min read</span>
        </div>

        {/* Corner-anchored content — bottom-left */}
        <div className="article-hero__content">
          {/* Breadcrumb */}
          <nav className="article-hero__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">→</span>
            <Link href="/blog">Push Notes</Link>
            <span aria-hidden="true">→</span>
            <span style={{ color: "rgba(255,255,255,0.65)" }}>
              Creator Economy
            </span>
          </nav>

          {/* Category eyebrow with parens — marketing register */}
          <p className="article-hero__eyebrow">(CREATOR ECONOMY)</p>

          {/* H1: clamp(40px,5vw,72px) Darky 800 — §3.1 */}
          <h1 className="article-hero__title">The Walk-In Economy Is Real</h1>

          {/* Byline — author + date + read time */}
          <div className="article-hero__byline">
            <div className="article-hero__avatar" aria-hidden="true">
              JC
            </div>
            <div>
              <p className="article-hero__author-name">Jordan Chen</p>
              <p className="article-hero__author-role">Head of Data · Push</p>
            </div>
            <div className="article-hero__byline-divider" aria-hidden="true" />
            <div>
              <p className="article-hero__date">{fmtDate("2026-04-18")}</p>
              <p className="article-hero__readtime">8 min read</p>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          ARTICLE BODY — sidebar tags + 72ch reading column
      ════════════════════════════════════════════════════════ */}
      <div className="article-layout">
        <div className="article-layout__inner">
          {/* Sticky tags sidebar */}
          <aside className="article-sidebar" aria-label="Article tags">
            <p className="article-sidebar__eyebrow">(TAGS)</p>
            <ul className="article-sidebar__tags">
              {[
                "QR Attribution",
                "Walk-in Traffic",
                "NYC Neighborhoods",
                "Creator Earnings",
                "Data Analysis",
              ].map((tag) => (
                <li key={tag} className="article-tag">
                  {tag}
                </li>
              ))}
            </ul>
          </aside>

          {/* Main reading column — max-width 72ch */}
          <article className="article-body">
            {/* Lead paragraph — Mono 18px, weight 600, ink */}
            <p className="article-body__lead">
              Six months ago we started logging not just scan events but the
              full 32-field ground-truth row for every QR code touched in New
              York City. What we found surprised even us.
            </p>

            {/* Body paragraphs — CS Genio Mono 18px 1.55 (§3.1 NEVER Darky body) */}
            <p className="article-body__p">
              The prevailing narrative in creator commerce — that reach is
              everything, that follower count predicts revenue, that online
              virality translates to in-store behavior — turns out to be a
              simplification that costs merchants real money.
            </p>

            <p className="article-body__p">
              Across 40 NYC neighborhoods, 312 merchant locations, and 2.1
              million verified scans, one pattern holds with statistical
              regularity:{" "}
              <strong style={{ color: "var(--ink)", fontWeight: 700 }}>
                proximity beats scale
              </strong>
              . A creator with 4,200 followers who lives six blocks from the
              merchant will drive more verified walk-ins than a creator with
              42,000 followers who lives in New Jersey.
            </p>

            {/* Section heading — H2: EXACTLY 40px Darky 800 */}
            <h2 className="article-body__h2">The Numbers</h2>

            <p className="article-body__p">
              We define a &ldquo;walk-in conversion&rdquo; as: a QR scan that
              occurred within 0.25 miles of the merchant location, verified by
              GPS ping within a 90-second window of the scan event, followed by
              a logged redemption at the merchant&apos;s POS within the same
              visit. It is a conservative definition. We prefer false negatives
              to false positives.
            </p>

            {/* KPI grid — stat numerals: clamp(40px,5vw,72px) Darky 700 */}
            <div
              className="article-kpi-grid"
              role="region"
              aria-label="Key statistics"
            >
              {[
                { num: "2.1M", label: "Verified scans" },
                { num: "40", label: "NYC neighborhoods" },
                { num: "73%", label: "Walk-ins from local creators" },
              ].map((stat) => (
                <div key={stat.label} className="article-kpi-item">
                  <span className="article-kpi-num">{stat.num}</span>
                  <span className="article-kpi-cap">{stat.label}</span>
                </div>
              ))}
            </div>

            <h2 className="article-body__h2">Why Proximity Wins</h2>

            <p className="article-body__p">
              The hypothesis we keep testing is behavioral, not algorithmic. A
              creator who lives near a merchant is more likely to visit
              unprompted, which means their content carries implicit geographic
              signals — the specific table they always sit at, the fact that
              they know the owner&apos;s name, the way they mention the
              neighborhood in casual conversation.
            </p>

            <p className="article-body__p">
              Audiences can smell the difference between a paid placement and a
              genuine recommendation. QR scan data is one of the few mechanisms
              that lets us quantify that difference.
            </p>

            <h2 className="article-body__h2">What This Means for Merchants</h2>

            <p className="article-body__p">
              Stop buying reach. Start buying proximity. If you are a merchant
              in Williamsburg, the most valuable creator partner you can work
              with is probably someone who already comes in twice a week —
              regardless of whether they have 2,000 or 200,000 followers.
            </p>

            <p className="article-body__p">
              Push&apos;s creator tier system is built around this insight. We
              score creators on verified redemption rate, neighborhood
              concentration, and repeat visit frequency — not follower count.
              The data supports this approach strongly.
            </p>
          </article>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          PULL QUOTE — brand-red full-width section
          Magvix italic clamp(32px,4vw,56px) snow
      ════════════════════════════════════════════════════════ */}
      <section className="article-pullquote">
        <div className="article-pullquote__inner">
          <p className="article-pullquote__eyebrow">(KEY INSIGHT)</p>
          <blockquote className="article-pullquote__quote">
            &ldquo;A creator who lives six blocks away beats one with ten times
            the followers, every time.&rdquo;
          </blockquote>
          <p className="article-pullquote__attribution">
            Jordan Chen — Head of Data, Push
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SIG DIVIDER
      ════════════════════════════════════════════════════════ */}
      <div className="article-sig-wrap">
        <span className="sig-divider">Posted · Scanned · Verified ·</span>
      </div>

      {/* ══════════════════════════════════════════════════════
          RELATED ARTICLES — 3-column Photo Card grid
      ════════════════════════════════════════════════════════ */}
      <section className="article-related">
        <div className="article-related__inner">
          {/* Header row */}
          <div className="article-related__header">
            <div>
              <p className="article-related__eyebrow">(CONTINUE READING)</p>
              {/* H2: EXACTLY 40px Darky 800 */}
              <h2 className="article-related__title">Related field reports</h2>
            </div>
            <Link href="/blog" className="btn-ghost click-shift">
              All notes →
            </Link>
          </div>

          {/* 3-column Photo Card grid */}
          <div className="article-related__grid">
            {RELATED.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="related-photo-card"
                aria-label={post.title}
              >
                {/* Tonal image bg */}
                <div className="related-photo-card__img-bg" aria-hidden="true">
                  <span className="related-photo-card__cat-ghost">
                    {post.catAbbr}
                  </span>
                </div>

                {/* Bottom gradient overlay */}
                <div
                  className="related-photo-card__overlay"
                  aria-hidden="true"
                />

                {/* Text at bottom 24px inset */}
                <div className="related-photo-card__text">
                  <p className="related-photo-card__eyebrow">{post.category}</p>
                  {/* Photo Card Title: Darky 20px 700 snow */}
                  <h3 className="related-photo-card__title">{post.title}</h3>
                  <div className="related-photo-card__meta">
                    <span>{fmtShort(post.date)}</span>
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
          TICKET PANEL CTA — "Subscribe to Push Dispatch"
          GA Orange, Magvix Italic centered, ≤1 per page
      ════════════════════════════════════════════════════════ */}
      <section className="article-ticket-section">
        <div className="article-ticket-section__inner">
          <div className="ticket-panel">
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.55)", textAlign: "center" }}
            >
              (SUBSCRIBE)
            </p>
            {/* Magvix Italic centered — Ticket Panel exception §7.3, clamp(40px,5vw,56px) */}
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
              Subscribe to Push Dispatch.
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
              {/* btn-ink: Ink fill + Snow text */}
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
