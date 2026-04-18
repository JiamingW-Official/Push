import Link from "next/link";
import { notFound } from "next/navigation";
import "../help.css";
import { HelpArticleClient } from "./client";

/* ============================================================
   Push — Help Article Template (v5.1 Vertical AI for Local Commerce)
   ------------------------------------------------------------
   Server component that resolves a slug to structured content,
   then hands the interactive bits (feedback widget, sticky TOC
   highlighting) to a small client subtree.
   ============================================================ */

type Section = {
  id: string;
  heading: string;
  level: 2 | 3;
  body?: string[];
  bullets?: string[];
};

export type ArticleRecord = {
  slug: string;
  topic: string;
  topicSlug: string;
  title: string;
  intro: string;
  lastUpdated: string; // ISO date
  readMinutes: number;
  sections: Section[];
  related: Array<{
    slug: string;
    topic: string;
    title: string;
    readMinutes: number;
  }>;
};

/* ── Demo articles — spec requires at least 3 slugs ────── */
const ARTICLES: Record<string, ArticleRecord> = {
  "first-campaign": {
    slug: "first-campaign",
    topic: "Your first campaign",
    topicSlug: "first-campaign",
    title: "Launch your first Williamsburg Coffee+ campaign in 48 hours",
    intro:
      "A step-by-step walk-through of the Push Customer Acquisition Engine, from acquisition goal to ConversionOracle™ forecast to going live on a Thursday morning.",
    lastUpdated: "2026-04-16",
    readMinutes: 6,
    sections: [
      {
        id: "state-your-goal",
        heading: "State your customer acquisition goal",
        level: 2,
        body: [
          "Every Push campaign starts with a single number: how many new customers you need this month. That's the input ConversionOracle™ uses to forecast creators, content, and budget — no marketing brief, no ad copy, no funnel to wire up.",
          "Good Coffee+ goals sit between 20 and 80 new customers per week. Numbers below 20 tend to be noisy; above 80 we'll recommend a Neighborhood plan because saturation matters more than spend.",
        ],
      },
      {
        id: "forecast-and-approve",
        heading: "Review the ConversionOracle™ forecast",
        level: 2,
        body: [
          "Within 60 seconds of entering your goal, you'll see a ±25% confidence band with a suggested creator mix — typically 3–5 Seed and Explorer-tier creators for a new Coffee+ merchant. Each forecast shows the Software Leverage Ratio (SLR) projection for the month.",
        ],
      },
      {
        id: "print-qr-optional",
        heading: "Print your QR (optional but recommended)",
        level: 3,
        body: [
          "Push mails a free table-tent with your creator QR overlay. Merchants who add one see about 14% incremental attribution — the offline-to-scan bridge captures customers who saw a creator post earlier in the week.",
        ],
      },
      {
        id: "launch-thursday",
        heading: "Campaign goes live Thursday at 10am ET",
        level: 2,
        bullets: [
          "DisclosureBot pre-screens every creator post for FTC 16 CFR Part 255 compliance",
          "Your first verified walk-in usually lands within 6 hours",
          "You only pay after ConversionOracle™ labels the scan verified",
        ],
      },
    ],
    related: [
      {
        slug: "print-qr-code",
        topic: "QR codes",
        title: "Print and place your in-store QR code",
        readMinutes: 4,
      },
      {
        slug: "connect-square-pos",
        topic: "Integrations",
        title: "Connect Square POS to feed ConversionOracle™",
        readMinutes: 5,
      },
      {
        slug: "understand-retention-add-on",
        topic: "Payments",
        title: "How the Retention Add-on works",
        readMinutes: 3,
      },
    ],
  },
  "print-qr-code": {
    slug: "print-qr-code",
    topic: "QR codes",
    topicSlug: "qr-codes",
    title: "Print and place your in-store QR code",
    intro:
      "Your creator QR is the primary attribution point inside the venue — here's how to print it, where to place it, and how to replace it if it gets damaged during the Williamsburg Coffee+ beachhead.",
    lastUpdated: "2026-04-12",
    readMinutes: 4,
    sections: [
      {
        id: "order-a-table-tent",
        heading: "Order a free table-tent",
        level: 2,
        body: [
          "Every Operator-plan merchant gets one free table-tent and window cling per campaign, printed on recyclable 280gsm stock and shipped with a 3-day SLA inside Williamsburg.",
        ],
      },
      {
        id: "placement-rules",
        heading: "Placement rules that move the needle",
        level: 2,
        bullets: [
          "Counter, eye-level — not the back wall",
          "Inside the 2-mile geo-match radius (the whole venue by default)",
          "Lit well enough for a phone camera to focus in under 1 second",
        ],
      },
      {
        id: "replacement",
        heading: "Replacement and reprints",
        level: 3,
        body: [
          "If your tent gets coffee-stained or curls, request a reprint from the Merchant Dashboard. Reprints ship within 72 hours at no cost for the duration of your pilot.",
        ],
      },
    ],
    related: [
      {
        slug: "first-campaign",
        topic: "Your first campaign",
        title: "Launch your first Williamsburg Coffee+ campaign in 48 hours",
        readMinutes: 6,
      },
      {
        slug: "connect-square-pos",
        topic: "Integrations",
        title: "Connect Square POS to feed ConversionOracle™",
        readMinutes: 5,
      },
      {
        slug: "dispute-a-verified-scan",
        topic: "Disputes",
        title: "File a dispute when a verified scan looks wrong",
        readMinutes: 4,
      },
    ],
  },
  "connect-square-pos": {
    slug: "connect-square-pos",
    topic: "Integrations",
    topicSlug: "integrations",
    title: "Connect Square POS to feed ConversionOracle™ ground truth",
    intro:
      "The POS webhook is what makes ConversionOracle™ different from Meta and Google — you're teaching our walk-in model with your own transaction reality. Setup takes about 7 minutes.",
    lastUpdated: "2026-04-10",
    readMinutes: 5,
    sections: [
      {
        id: "why-it-matters",
        heading: "Why the POS feed matters",
        level: 2,
        body: [
          "Without a POS webhook, ConversionOracle™ can verify scans but not learn your AOV, basket, or return cadence. With the webhook, Push can offer Retention Add-on pricing and tighten the confidence band from ±25% to ±15% over the first 10,000 events.",
        ],
      },
      {
        id: "install-steps",
        heading: "Install the Square integration",
        level: 2,
        bullets: [
          "Open Merchant Dashboard → Integrations → Square",
          "Authorize via Square OAuth (scopes: PAYMENTS_READ, ORDERS_READ)",
          "Pick the location that matches your venue pin",
          "Send a $0.01 test transaction to confirm the webhook",
        ],
      },
      {
        id: "what-we-store",
        heading: "What Push stores",
        level: 3,
        body: [
          "We store the total, timestamp, item count, and a hashed customer token — never names, phone numbers, or payment card data. You can revoke the webhook at any time from the Integrations panel.",
        ],
      },
    ],
    related: [
      {
        slug: "first-campaign",
        topic: "Your first campaign",
        title: "Launch your first Williamsburg Coffee+ campaign in 48 hours",
        readMinutes: 6,
      },
      {
        slug: "understand-retention-add-on",
        topic: "Payments",
        title: "How the Retention Add-on works",
        readMinutes: 3,
      },
      {
        slug: "print-qr-code",
        topic: "QR codes",
        title: "Print and place your in-store QR code",
        readMinutes: 4,
      },
    ],
  },
};

/* ── Static params ────────────────────────────────────── */
export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

/* ── SVG bits (server-safe) ───────────────────────────── */
function IconCalendar() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  const formattedDate = new Date(article.lastUpdated).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" },
  );

  const tocEntries = article.sections.map((s) => ({
    id: s.id,
    heading: s.heading,
    level: s.level,
  }));

  return (
    <main className="help-article-page">
      <div className="help-article-inner">
        {/* Breadcrumb */}
        <nav className="help-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="help-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <Link href="/help">Help</Link>
          <span className="help-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <Link href={`/help#${article.topicSlug}`}>{article.topic}</Link>
          <span className="help-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span className="help-breadcrumb-current">{article.title}</span>
        </nav>

        {/* Header */}
        <header className="help-article-header">
          <h1 className="help-article-title">{article.title}</h1>
          <div className="help-article-meta">
            <span className="help-article-meta-item">
              <IconCalendar />
              Last updated {formattedDate}
            </span>
            <span className="help-article-meta-sep" aria-hidden="true">
              |
            </span>
            <span className="help-article-meta-item">
              <IconClock />
              {article.readMinutes} min read
            </span>
            <span className="help-article-meta-sep" aria-hidden="true">
              |
            </span>
            <span className="help-article-meta-item">{article.topic}</span>
          </div>
        </header>

        {/* TOC + Body layout */}
        <div className="help-article-layout">
          {/* Sticky TOC */}
          <aside className="help-toc" aria-label="Table of contents">
            <p className="help-toc-title">On this page</p>
            <ul className="help-toc-list">
              {tocEntries.map((entry) => (
                <li
                  key={entry.id}
                  style={{
                    paddingLeft: entry.level === 3 ? 12 : 0,
                  }}
                >
                  <a href={`#${entry.id}`}>{entry.heading}</a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Body */}
          <div>
            <article className="help-article-body">
              <p>
                <strong>{article.intro}</strong>
              </p>
              {article.sections.map((section) => {
                const Heading = section.level === 2 ? "h2" : "h3";
                return (
                  <section key={section.id}>
                    <Heading id={section.id}>{section.heading}</Heading>
                    {section.body?.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                    {section.bullets && (
                      <ul>
                        {section.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </article>

            {/* Interactive bits — isolated to a client island */}
            <HelpArticleClient
              related={article.related}
              articleSlug={article.slug}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
