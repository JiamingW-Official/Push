"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import "./help.css";

/* ============================================================
   Push — Help Center (v5.1 Vertical AI for Local Commerce)
   ------------------------------------------------------------
   - Big hero search (client-side, filters article list)
   - 8 topic cards with inline SVG, title, 1-line desc, count
   - Popular articles — 5-item list with read-time
   - Sidebar: "Talk to support" + email + 24h SLA
   ============================================================ */

/* ── Topic catalog ──────────────────────────────────────── */
type Topic = {
  slug: string;
  title: string;
  desc: string;
  articleCount: number;
  Icon: () => ReactElement;
};

/* Icons — outline, 24x24, inherit stroke color */
const IconRocket = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.6 14.4a6 6 0 0 1-5.8 7.3v-4.8m5.8-2.5a15 15 0 0 0 6.1-12.1A15 15 0 0 0 9.6 8.4m6 6a15 15 0 0 1-5.8 2.6m-.1-8.5a6 6 0 0 0-7.4 5.8h4.8m2.6-5.8a15 15 0 0 0-2.6 5.8m2.7 2.7a15 15 0 0 1-2.4-2.4m-2.3 2.4a4.5 4.5 0 0 0-1.7 4.3 4.5 4.5 0 0 0 4.3-1.8"
    />
  </svg>
);
const IconTarget = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
const IconQr = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    aria-hidden="true"
  >
    <rect x="3.5" y="3.5" width="6" height="6" />
    <rect x="14.5" y="3.5" width="6" height="6" />
    <rect x="3.5" y="14.5" width="6" height="6" />
    <path d="M14.5 14.5h3m0 0v3m0-3h3m-3 3v3m3-3h-3" strokeLinecap="round" />
  </svg>
);
const IconCard = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    aria-hidden="true"
  >
    <rect x="2.5" y="5.5" width="19" height="13" />
    <path d="M2.5 9.5h19" />
    <path d="M6.5 14.5h4" strokeLinecap="round" />
  </svg>
);
const IconShield = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    aria-hidden="true"
  >
    <path
      d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"
      strokeLinejoin="round"
    />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconAlert = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    aria-hidden="true"
  >
    <path d="M12 3l10 17H2L12 3z" strokeLinejoin="round" />
    <path d="M12 10v4" strokeLinecap="round" />
    <path d="M12 17.5v.5" strokeLinecap="round" />
  </svg>
);
const IconPlug = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    aria-hidden="true"
  >
    <path d="M9 3v5M15 3v5" strokeLinecap="round" />
    <path d="M5 8h14v4a7 7 0 0 1-14 0V8z" />
    <path d="M12 19v3" strokeLinecap="round" />
  </svg>
);
const IconUser = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" />
  </svg>
);

const TOPICS: Topic[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    desc: "Create your merchant account and claim your Williamsburg Coffee+ pilot slot.",
    articleCount: 6,
    Icon: IconRocket,
  },
  {
    slug: "first-campaign",
    title: "Your first campaign",
    desc: "Set an acquisition goal and let ConversionOracle™ forecast creators, content, and budget.",
    articleCount: 9,
    Icon: IconTarget,
  },
  {
    slug: "qr-codes",
    title: "QR codes",
    desc: "Place, test, and reprint the creator QR + optional in-store table tent.",
    articleCount: 5,
    Icon: IconQr,
  },
  {
    slug: "payments",
    title: "Payments",
    desc: "Merchant billing, creator payouts, retention add-on, and invoices.",
    articleCount: 7,
    Icon: IconCard,
  },
  {
    slug: "verification",
    title: "Verification",
    desc: "3-layer AI verification: QR timestamp, Claude Vision OCR, and 2-mile geo-match.",
    articleCount: 8,
    Icon: IconShield,
  },
  {
    slug: "disputes",
    title: "Disputes",
    desc: "72-hour dispute window, evidence review, and how ConversionOracle™ learns.",
    articleCount: 4,
    Icon: IconAlert,
  },
  {
    slug: "integrations",
    title: "Integrations",
    desc: "Square, Toast, and Shopify POS webhooks plus Instagram and TikTok auth.",
    articleCount: 6,
    Icon: IconPlug,
  },
  {
    slug: "account",
    title: "Account",
    desc: "Roles, permissions, 2FA, and Neighborhood Playbook access controls.",
    articleCount: 5,
    Icon: IconUser,
  },
];

/* ── Popular articles (with read-time) ──────────────────── */
type PopularArticle = {
  slug: string;
  topic: string;
  title: string;
  readMinutes: number;
};

const POPULAR_ARTICLES: PopularArticle[] = [
  {
    slug: "first-campaign",
    topic: "Your first campaign",
    title: "Launch your first Williamsburg Coffee+ campaign in 48 hours",
    readMinutes: 6,
  },
  {
    slug: "print-qr-code",
    topic: "QR codes",
    title: "Print and place your in-store QR code (table tent + window cling)",
    readMinutes: 4,
  },
  {
    slug: "connect-square-pos",
    topic: "Integrations",
    title: "Connect Square POS to feed ConversionOracle™ ground truth",
    readMinutes: 5,
  },
  {
    slug: "understand-retention-add-on",
    topic: "Payments",
    title: "How the Retention Add-on works — only pay for returning customers",
    readMinutes: 3,
  },
  {
    slug: "dispute-a-verified-scan",
    topic: "Disputes",
    title: "File a dispute when a verified scan looks wrong",
    readMinutes: 4,
  },
];

/* ── Search icon ────────────────────────────────────────── */
function SearchGlass() {
  return (
    <svg
      className="help-search-glass"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10" />
      <path d="M8 3l5 5-5 5" />
    </svg>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function HelpPage() {
  const [query, setQuery] = useState("");

  // Client-side filter across topics + popular articles
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { topics: TOPICS, popular: POPULAR_ARTICLES };
    return {
      topics: TOPICS.filter(
        (t) =>
          t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q),
      ),
      popular: POPULAR_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.topic.toLowerCase().includes(q),
      ),
    };
  }, [query]);

  const hasResults = filtered.topics.length > 0 || filtered.popular.length > 0;

  return (
    <main className="help-page">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="help-hero">
        <div className="help-hero-inner">
          <p className="help-eyebrow">Help Center</p>
          <h1 className="help-headline">
            How can we <em>help?</em>
          </h1>
          <p className="help-subhead">
            Answers for the Williamsburg Coffee+ Customer Acquisition Engine —
            onboarding, ConversionOracle™ verification, payments, and the
            Two-Segment creator model.
          </p>

          <div className="help-search">
            <SearchGlass />
            <input
              type="search"
              className="help-search-input"
              placeholder="Search help articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search help articles"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                type="button"
                className="help-search-clear"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                >
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            )}
          </div>
          {query && (
            <p className="help-search-meta">
              {filtered.topics.length + filtered.popular.length} result
              {filtered.topics.length + filtered.popular.length !== 1
                ? "s"
                : ""}{" "}
              for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* ── Main body + sidebar layout ───────────────────── */}
      <div className="help-body">
        <div className="help-body-inner">
          {/* Main column */}
          <div className="help-main">
            {!hasResults ? (
              <div className="help-empty">
                <p className="help-empty-title">No matches for that search.</p>
                <p className="help-empty-sub">
                  Try a shorter term, or{" "}
                  <a href="mailto:support@push.nyc">email support</a>.
                </p>
              </div>
            ) : (
              <>
                {/* Topic grid */}
                {filtered.topics.length > 0 && (
                  <section className="help-topics-section">
                    <header className="help-section-head">
                      <span className="help-section-rule" aria-hidden="true" />
                      <h2 className="help-section-title">Browse by topic</h2>
                    </header>
                    <div className="help-topic-grid">
                      {filtered.topics.map((topic) => {
                        const Icon = topic.Icon;
                        return (
                          <Link
                            key={topic.slug}
                            href={`/help/${topic.slug}`}
                            className="help-topic-card"
                          >
                            <span
                              className="help-topic-icon"
                              aria-hidden="true"
                            >
                              <Icon />
                            </span>
                            <span className="help-topic-body">
                              <span className="help-topic-title">
                                {topic.title}
                              </span>
                              <span className="help-topic-desc">
                                {topic.desc}
                              </span>
                              <span className="help-topic-count">
                                {topic.articleCount} article
                                {topic.articleCount !== 1 ? "s" : ""}
                              </span>
                            </span>
                            <span
                              className="help-topic-arrow"
                              aria-hidden="true"
                            >
                              <ArrowRight />
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Popular articles */}
                {filtered.popular.length > 0 && (
                  <section className="help-popular-section">
                    <header className="help-section-head">
                      <span className="help-section-rule" aria-hidden="true" />
                      <h2 className="help-section-title">Popular articles</h2>
                    </header>
                    <ol className="help-popular-list">
                      {filtered.popular.map((article, idx) => (
                        <li key={article.slug} className="help-popular-item">
                          <Link
                            href={`/help/${article.slug}`}
                            className="help-popular-link"
                          >
                            <span
                              className="help-popular-rank"
                              aria-hidden="true"
                            >
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="help-popular-body">
                              <span className="help-popular-title">
                                {article.title}
                              </span>
                              <span className="help-popular-meta">
                                {article.topic} &middot; {article.readMinutes}{" "}
                                min read
                              </span>
                            </span>
                            <span
                              className="help-popular-arrow"
                              aria-hidden="true"
                            >
                              <ArrowRight />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}
              </>
            )}
          </div>

          {/* Sidebar (desktop) */}
          <aside className="help-sidebar" aria-label="Support">
            <div className="help-support-card">
              <p className="help-support-eyebrow">Talk to support</p>
              <h3 className="help-support-title">
                Our team answers in <span>24h.</span>
              </h3>
              <p className="help-support-sub">
                Williamsburg Coffee+ onboarding questions, ConversionOracle™
                label disputes, and integration help.
              </p>
              <a
                href="mailto:support@push.nyc"
                className="help-support-primary"
              >
                support@push.nyc
                <ArrowRight />
              </a>
              <dl className="help-support-meta">
                <div>
                  <dt>Response SLA</dt>
                  <dd>24 business hours</dd>
                </div>
                <div>
                  <dt>Trust escalations</dt>
                  <dd>4 hours</dd>
                </div>
                <div>
                  <dt>Hours</dt>
                  <dd>Mon–Fri, 9a–7p ET</dd>
                </div>
              </dl>
              <div className="help-support-divider" />
              <Link href="/faq" className="help-support-secondary">
                Read the FAQ
              </Link>
              <Link href="/status" className="help-support-secondary">
                System status
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
