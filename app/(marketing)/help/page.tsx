import Link from "next/link";
import "./help.css";

export const metadata = {
  title: "Help Center — Push",
  description:
    "Everything you need to know about Push — QR attribution, payouts, creator setup, and merchant tools.",
};

/* ── Static data ─────────────────────────────────────────────── */

interface Category {
  key: string;
  label: string;
  description: string;
  icon: string;
  count: number;
}

const CATEGORIES: Category[] = [
  {
    key: "getting-started",
    label: "Getting Started",
    description: "Onboarding, account setup, and your first campaign.",
    icon: "◎",
    count: 6,
  },
  {
    key: "for-creators",
    label: "For Creators",
    description: "Applications, tiers, scoring, and earning more.",
    icon: "★",
    count: 9,
  },
  {
    key: "for-merchants",
    label: "For Merchants",
    description: "Campaigns, QR posters, location management, dashboards.",
    icon: "⊞",
    count: 8,
  },
  {
    key: "payouts-billing",
    label: "Payouts & Billing",
    description: "When and how you get paid, Stripe, invoices.",
    icon: "◈",
    count: 5,
  },
  {
    key: "attribution-qr",
    label: "Attribution & QR",
    description: "How Push verifies physical visits from QR scans.",
    icon: "⊠",
    count: 7,
  },
  {
    key: "account-settings",
    label: "Account & Settings",
    description: "Profile, notifications, privacy, and connected apps.",
    icon: "⊙",
    count: 4,
  },
];

interface PopularArticle {
  slug: string;
  title: string;
  category: string;
  readTime: string;
}

const POPULAR_ARTICLES: PopularArticle[] = [
  {
    slug: "how-push-qr-attribution-works",
    title: "How Push QR attribution works",
    category: "Attribution & QR",
    readTime: "5 min",
  },
  {
    slug: "setting-up-your-first-campaign",
    title: "Setting up your first campaign",
    category: "Getting Started",
    readTime: "4 min",
  },
  {
    slug: "creator-application-requirements",
    title: "Creator application requirements",
    category: "For Creators",
    readTime: "3 min",
  },
  {
    slug: "when-do-i-get-paid",
    title: "When do I get paid?",
    category: "Payouts & Billing",
    readTime: "2 min",
  },
  {
    slug: "how-to-generate-a-qr-poster",
    title: "How to generate a QR poster",
    category: "For Merchants",
    readTime: "3 min",
  },
  {
    slug: "understanding-verified-visits",
    title: "Understanding verified visits",
    category: "Attribution & QR",
    readTime: "4 min",
  },
];

/* ── Page ────────────────────────────────────────────────────── */

export default function HelpPage() {
  return (
    <>
      {/* ═══ HERO — dark panel, bottom-left anchored ═══════════ */}
      <section className="help-hero">
        <div className="help-hero-inner">
          {/* Stats badges — top right */}
          <div className="help-hero-badges" aria-hidden>
            <div className="lg-surface--badge help-hero-badge">
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 900,
                  color: "var(--snow)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                39
              </div>
              <div
                className="eyebrow"
                style={{ color: "rgba(255,255,255,0.55)", marginTop: 4 }}
              >
                (ARTICLES)
              </div>
            </div>
            <div className="lg-surface--badge help-hero-badge">
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 900,
                  color: "var(--brand-red)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                6
              </div>
              <div
                className="eyebrow"
                style={{ color: "rgba(255,255,255,0.55)", marginTop: 4 }}
              >
                (TOPICS)
              </div>
            </div>
          </div>

          {/* Bottom-left title anchor */}
          <div className="help-hero-content">
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.45)", marginBottom: 16 }}
            >
              (HELP CENTER)
            </p>

            <h1 className="help-hero-title">
              Get help,{" "}
              <em
                style={{
                  fontFamily: "var(--font-hero)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "1em",
                  letterSpacing: "-0.02em",
                  color: "var(--snow)",
                }}
              >
                fast.
              </em>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.6)",
                margin: "24px 0 40px",
                maxWidth: 520,
              }}
            >
              Everything you need to know about Push — attribution, payouts,
              creator setup, and merchant tools. One team reads every ticket.
            </p>

            {/* Search bar */}
            <div className="help-search-wrap">
              <div className="help-search-field">
                <input
                  type="text"
                  placeholder="Search articles…"
                  readOnly
                  aria-label="Search help articles"
                  className="help-search-input"
                />
                <span className="help-search-icon" aria-hidden>
                  ⌕
                </span>
              </div>
            </div>

            {/* Quick-filter pills */}
            <div className="help-hero-pills">
              {["Getting Started", "Payouts & Billing", "Attribution & QR"].map(
                (label) => (
                  <Link
                    key={label}
                    href={`/help?category=${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="btn-pill"
                  >
                    {label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES GRID — 3×2 ══════════════════════════════ */}
      <section className="help-categories-section">
        <div className="help-section-container">
          <div style={{ marginBottom: 56 }}>
            <p
              className="eyebrow"
              style={{ color: "var(--ink-3)", marginBottom: 16 }}
            >
              (BROWSE BY TOPIC)
            </p>
            <h2 className="help-section-h2">Browse by topic.</h2>
          </div>

          <div className="help-category-grid">
            {CATEGORIES.map((cat, i) => {
              const altBg =
                i % 3 === 1
                  ? "var(--panel-blush)"
                  : i % 3 === 2
                    ? "var(--panel-sky)"
                    : "var(--surface-2)";
              return (
                <Link
                  key={cat.key}
                  href={`/help?category=${cat.key}`}
                  className="help-category-card click-shift"
                  style={{ background: altBg }}
                >
                  {/* Icon tile — 40×40, 12px radius */}
                  <div className="help-category-icon-tile">{cat.icon}</div>

                  <div>
                    <h3 className="help-category-name">{cat.label}</h3>
                    <p className="help-category-desc">{cat.description}</p>
                    <span className="eyebrow" style={{ color: "var(--ink-4)" }}>
                      {cat.count} articles
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ POPULAR ARTICLES — numbered editorial list ══════════ */}
      <section className="help-popular-section">
        <div className="help-section-container">
          <div style={{ marginBottom: 56 }}>
            <p
              className="eyebrow"
              style={{ color: "var(--ink-3)", marginBottom: 16 }}
            >
              (MOST READ)
            </p>
            <h2 className="help-section-h2">Popular articles.</h2>
          </div>

          <div className="help-article-list">
            {POPULAR_ARTICLES.map((article, i) => (
              <Link
                key={article.slug}
                href={`/help/${article.slug}`}
                className="help-article-row click-shift"
              >
                {/* Rank number */}
                <span className="help-article-rank" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Title */}
                <span className="help-article-title-text">{article.title}</span>

                {/* Category pill */}
                <span className="btn-pill help-article-cat-pill">
                  {article.category}
                </span>

                {/* Read time */}
                <span
                  className="eyebrow"
                  style={{
                    color: "var(--ink-4)",
                    flexShrink: 0,
                    minWidth: 48,
                    textAlign: "right",
                  }}
                >
                  {article.readTime}
                </span>

                <span
                  aria-hidden
                  style={{
                    color: "var(--brand-red)",
                    flexShrink: 0,
                    fontSize: 16,
                  }}
                >
                  →
                </span>
              </Link>
            ))}
            <div className="help-list-cap" />
          </div>
        </div>
      </section>

      {/* ═══ SIG DIVIDER ════════════════════════════════════════ */}
      <div className="help-sig-wrap">
        <span className="sig-divider">Real · Local · Verified ·</span>
      </div>

      {/* ═══ TICKET CTA ══════════════════════════════════════════ */}
      <div className="help-ticket-wrap">
        <div className="ticket-panel">
          <p
            className="eyebrow"
            style={{
              color: "rgba(255,255,255,0.65)",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            (STILL SEARCHING)
          </p>
          <h2
            style={{
              fontFamily: "var(--font-hero)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 56px)",
              color: "var(--snow)",
              marginBottom: 24,
              textAlign: "center",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
            }}
          >
            {"Can't find what you need?"}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 32,
              textAlign: "center",
              lineHeight: 1.55,
            }}
          >
            Talk to the Push support team. We respond within one business day —
            often the same hour.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link href="/contact" className="btn-ink">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
