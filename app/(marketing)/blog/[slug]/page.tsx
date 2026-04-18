import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getPostBySlug,
  getRelatedPosts,
  MOCK_POSTS,
  type BlogPost,
  type PostCategory,
} from "@/lib/blog/mock-posts";
import ArticleChrome from "./ArticleChrome";
import "../blog.css";
import "./article.css";

/* ── Static params ───────────────────────────────────────── */
// Includes demo slugs for v5.1 so routes resolve even though mock-posts.ts
// is authored elsewhere. Real slugs from MOCK_POSTS are merged on top.
const DEMO_SLUGS = [
  "why-vertical-ai-for-local-commerce",
  "slr-metric-explained",
  "conversionoracle-v3-accuracy-update",
];

export async function generateStaticParams() {
  const fromData = MOCK_POSTS.map((p) => p.slug);
  const merged = Array.from(new Set([...fromData, ...DEMO_SLUGS]));
  return merged.map((slug) => ({ slug }));
}

/* ── v5.1 display categories ─────────────────────────────── */
type DisplayCategory = "Product" | "Engineering" | "Neighborhood" | "Research";

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
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 64);
}

/* ── Demo post fallback ─────────────────────────────────── */
// When a demo slug (from generateStaticParams above) is visited and it isn't
// in MOCK_POSTS, we render a minimal v5.1 placeholder so the route works and
// still carries v5.1 keywords.
const DEMO_POSTS: Record<string, BlogPost> = {
  "why-vertical-ai-for-local-commerce": {
    slug: "why-vertical-ai-for-local-commerce",
    category: "Product",
    title: "Why Vertical AI for Local Commerce, not a services shop.",
    excerpt:
      "Horizontal ad platforms cannot see who walked through the door. That is the attribution gap. Vertical AI closes it — and makes ConversionOracle™ the moat.",
    heroImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
    author: {
      name: "Jiaming Wang",
      role: "Founder, Push",
      avatar: "JW",
    },
    publishedAt: "2026-04-17",
    readMins: 5,
    tags: ["Vertical AI", "ConversionOracle", "Williamsburg", "Coffee+", "SLR"],
    body: `## The gap Meta and Google can't close

Horizontal ad platforms optimize for clicks because that's the only signal they can observe end-to-end. The moment a customer leaves the feed and walks into a shop, the attribution chain breaks.

Push is built on the opposite premise: the walk-in event is the only signal that matters, and capturing it creates ground-truth data that compounds into a defensible moat.

## ConversionOracle™ — why it is a moat, not a feature

> Any three engineers can ship "AI verification" in a weekend. No one else can ship a prediction model trained on verified walk-in labels from 200 neighborhoods.

ConversionOracle™ learns from every verified customer across the network. Its accuracy curve is a function of label volume, not engineering headcount — and label volume is a function of Push being the only platform with the verification primitive.

## Vertical = Coffee+ first

Williamsburg Coffee+ (AOV $8-20) is Template 0. We productize one neighborhood, one vertical, one Neighborhood Playbook — then replicate.

## What "Vertical AI for Local Commerce" means operationally

- Per-customer pricing tiered by vertical ($15-85) matches merchant gross margin × 2
- Two-Segment Creator Economics: T1-T3 per-customer, T4-T6 retainer + equity pool
- DisclosureBot turns FTC compliance into enterprise-procurement moat
- Software Leverage Ratio (SLR) = active campaigns ÷ ops FTE — Month-12 target ≥25

The services-era framing is dead. The Vertical AI framing is what's next.`,
  },
  "slr-metric-explained": {
    slug: "slr-metric-explained",
    category: "Product",
    title:
      "Software Leverage Ratio: the one number that tells you if we scale.",
    excerpt:
      "SLR = active campaigns ÷ ops FTE. Traditional creator shops run 3-5. Push's Month-12 target is ≥25. Here is why that number is the north star.",
    heroImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    author: {
      name: "Marcus Chen",
      role: "Co-founder & CEO, Push",
      avatar: "MC",
    },
    publishedAt: "2026-04-12",
    readMins: 6,
    tags: ["SLR", "metrics", "Vertical AI", "ConversionOracle"],
    body: `## Why not GMV, not MRR

GMV and MRR can both be grown by hiring more people. They don't tell you whether the business is software or services. Software Leverage Ratio does.

## The definition

SLR = active campaigns run in the trailing 30 days ÷ full-time operations headcount.

> A Vertical AI for Local Commerce company running SLR 25 is shipping campaigns at ~4x the throughput of a services shop with the same headcount.

## The Month-12 target

Push Month-12 target: SLR ≥ 25. Month-24: SLR ≥ 50. The step between those numbers is where ConversionOracle™ automation and the Neighborhood Playbook pay off.

## What moves SLR up

1. Agentic campaign creation (draft brief, generate creative directions, pre-score creators)
2. DisclosureBot auto-screening FTC compliance without human review
3. ConversionOracle™ replacing manual forecasting with predicted walk-in counts
4. Neighborhood Playbook productizing expansion (per-neighborhood $8-12K launch)

Each of these is software. Each of these pushes the ratio.`,
  },
  "conversionoracle-v3-accuracy-update": {
    slug: "conversionoracle-v3-accuracy-update",
    category: "Engineering",
    title: "ConversionOracle™ v3 — accuracy hits 87% on Coffee+ campaigns.",
    excerpt:
      "The v3 model retrains on the full Williamsburg Coffee+ ground-truth corpus. P95 MAE at 0.8 customers per 100 predicted. Here's the methodology.",
    heroImage:
      "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=1200&q=80",
    author: {
      name: "Alex Rivera",
      role: "CTO, Push",
      avatar: "AR",
    },
    publishedAt: "2026-04-08",
    readMins: 8,
    tags: ["ConversionOracle", "ML", "Williamsburg", "Coffee+", "engineering"],
    body: `## v3 accuracy in one line

ConversionOracle™ v3: 87.4% within-±2 accuracy on Coffee+ campaigns in Williamsburg, up from 79.1% in v2. P95 MAE = 0.8 customers per 100 predicted.

## The training set

- 1,412 verified Coffee+ walk-in events across 23 Williamsburg merchants
- 890 disclosed creator campaigns cross-joined with QR scan timestamps
- 380 days of hourly foot-traffic baselines

> The thing Meta cannot do: train on who actually walked through the door, because Meta does not see that event.

## What changed architecturally

v2 was a gradient-boosted tree. v3 is a small transformer conditioned on (creator embedding, merchant embedding, hour-of-day, weather, day-of-week). 40M parameters — intentionally small, because the moat is the data, not the architecture.

## What this unlocks

- Pre-campaign walk-in forecast shown to merchant before they approve
- Creator match-ranking improved (Vertical AI for Local Commerce signal > follower count)
- SLR goes up because a Push ops person no longer hand-estimates outcomes

Next: v4 on the full Neighborhood Playbook corpus.`,
  },
};

function resolvePost(slug: string): BlogPost | undefined {
  const fromData = getPostBySlug(slug);
  if (fromData) return fromData;
  return DEMO_POSTS[slug];
}

/* ── Category eyebrow (article body reuses) ─────────────── */
function CategoryEyebrow({ category }: { category: PostCategory }) {
  const display = toDisplayCategory(category);
  return (
    <span className={`blog-eyebrow blog-eyebrow--${display.toLowerCase()}`}>
      {display}
    </span>
  );
}

/* ── Article body renderer ──────────────────────────────── */
// Converts the markdown-like body into React elements. Adds id-anchors to H2
// nodes so the TOC can link to them.
function ArticleBody({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;
  let i = 0;
  let pulledQuote = false; // demote first blockquote into a Pull Quote

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      const text = line.slice(3);
      elements.push(
        <h2 key={key++} className="article-h2" id={slugifyHeading(text)}>
          {text}
        </h2>,
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="article-h3">
          {line.slice(4)}
        </h3>,
      );
      i++;
      continue;
    }

    if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={key++} className="article-h4">
          {line.slice(5)}
        </h4>,
      );
      i++;
      continue;
    }

    if (line.startsWith("> ")) {
      // Render first blockquote as a pull-quote (big Darky 900 with Flag Red mark)
      const quoteText = line.slice(2);
      if (!pulledQuote) {
        pulledQuote = true;
        elements.push(
          <aside key={key++} className="article-pullquote">
            <span className="article-pullquote__mark" aria-hidden="true">
              &ldquo;
            </span>
            <p className="article-pullquote__text">{renderInline(quoteText)}</p>
          </aside>,
        );
      } else {
        elements.push(
          <blockquote key={key++} className="article-blockquote">
            <p>{renderInline(quoteText)}</p>
          </blockquote>,
        );
      }
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="article-list">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="article-list article-list--ordered">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <div key={key++} className="article-code-wrap">
          {lang && <span className="article-code-lang">{lang}</span>}
          <pre className="article-code">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>,
      );
      continue;
    }

    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        const row = lines[i]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        if (row.every((c) => /^[-: ]+$/.test(c))) {
          i++;
          continue;
        }
        rows.push(row);
        i++;
      }
      const [headerRow, ...bodyRows] = rows;
      elements.push(
        <div key={key++} className="article-table-wrap">
          <table className="article-table">
            <thead>
              <tr>
                {headerRow.map((cell, ci) => (
                  <th key={ci}>{renderInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    elements.push(
      <p key={key++} className="article-p">
        {renderInline(line)}
      </p>,
    );
    i++;
  }

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="article-inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/* ── Related post card ──────────────────────────────────── */
function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <article className="related-card">
      <Link href={`/blog/${post.slug}`} className="related-card__link">
        <div className="related-card__image-wrap">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="related-card__image"
          />
        </div>
        <div className="related-card__body">
          <CategoryEyebrow category={post.category} />
          <h4 className="related-card__title">{post.title}</h4>
          <span className="related-card__meta">
            {formatDate(post.publishedAt)} · {post.readMins} min
          </span>
        </div>
      </Link>
    </article>
  );
}

/* ── Extract table of contents from body (H2 only) ──────── */
function extractToc(body: string): { text: string; id: string }[] {
  const lines = body.split("\n");
  const toc: { text: string; id: string }[] = [];
  for (const line of lines) {
    if (line.startsWith("## ")) {
      const text = line.slice(3);
      toc.push({ text, id: slugifyHeading(text) });
    }
  }
  return toc;
}

/* ── Page ────────────────────────────────────────────────── */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = resolvePost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);
  const toc = extractToc(post.body);
  const shareUrl = `https://push.nyc/blog/${post.slug}`;
  const shareTitle = post.title;

  return (
    <>
      {/* ── Interactive chrome: progress bar + share panel + mobile TOC ── */}
      <ArticleChrome toc={toc} shareUrl={shareUrl} shareTitle={shareTitle} />

      {/* ── Breadcrumb ────────────────────────────────── */}
      <nav className="article-breadcrumb" aria-label="Breadcrumb">
        <div className="container article-breadcrumb__inner">
          <Link href="/" className="article-breadcrumb__link">
            Home
          </Link>
          <span className="article-breadcrumb__sep" aria-hidden="true">
            →
          </span>
          <Link href="/blog" className="article-breadcrumb__link">
            Blog
          </Link>
          <span className="article-breadcrumb__sep" aria-hidden="true">
            →
          </span>
          <span className="article-breadcrumb__current" aria-current="page">
            {toDisplayCategory(post.category)}
          </span>
        </div>
      </nav>

      {/* ── Article header ────────────────────────────── */}
      <header className="article-header">
        <div className="container article-header__inner">
          <CategoryEyebrow category={post.category} />
          <h1 className="article-headline">{post.title}</h1>
          <p className="article-excerpt">{post.excerpt}</p>
          <div className="article-byline">
            <span className="article-byline__avatar" aria-hidden="true">
              {post.author.avatar}
            </span>
            <div className="article-byline__text">
              <span className="article-byline__name">{post.author.name}</span>
              <span className="article-byline__role">{post.author.role}</span>
            </div>
            <div className="article-byline__divider" aria-hidden="true" />
            <div className="article-byline__date-wrap">
              <time
                dateTime={post.publishedAt}
                className="article-byline__date"
              >
                {formatDate(post.publishedAt)}
              </time>
              <span className="article-byline__read">
                {post.readMins} min read
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero image ────────────────────────────────── */}
      <div className="article-hero-image-wrap">
        <div className="container">
          <div className="article-hero-image">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="article-hero-image__img"
              priority
            />
            <div className="article-hero-image__overlay" />
          </div>
        </div>
      </div>

      {/* ── Article layout: TOC sidebar + body ────────── */}
      <div className="article-layout">
        <div className="container">
          <div className="article-layout__inner">
            {/* Sticky TOC */}
            <aside
              className="article-toc article-toc--desktop"
              aria-labelledby="toc-heading"
            >
              <p className="article-toc__label" id="toc-heading">
                In this dispatch
              </p>
              {toc.length > 0 ? (
                <ol className="article-toc__list">
                  {toc.map((item, i) => (
                    <li key={item.id} className="article-toc__item">
                      <a
                        href={`#${item.id}`}
                        className="article-toc__link"
                        data-toc-id={item.id}
                      >
                        <span className="article-toc__num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="article-toc__text">{item.text}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="article-toc__empty">One long thread.</p>
              )}

              {/* Tags below TOC */}
              <div className="article-toc__tags-block">
                <p className="article-toc__label">Tags</p>
                <ul className="article-tags">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <span className="article-tag">{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main content */}
            <article className="article-body">
              <ArticleBody content={post.body} />
            </article>
          </div>
        </div>
      </div>

      {/* ── Author bio ────────────────────────────────── */}
      <section className="article-author-bio">
        <div className="container">
          <div className="article-author-bio__inner">
            <span className="article-author-bio__avatar" aria-hidden="true">
              {post.author.avatar}
            </span>
            <div className="article-author-bio__text">
              <p className="article-author-bio__label">Written by</p>
              <p className="article-author-bio__name">{post.author.name}</p>
              <p className="article-author-bio__role">{post.author.role}</p>
              <p className="article-author-bio__bio">
                Working on Vertical AI for Local Commerce. Writes periodically
                about ConversionOracle™, the Software Leverage Ratio ladder, and
                what we&apos;re learning on the ground in Williamsburg Coffee+.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related posts ─────────────────────────────── */}
      {related.length > 0 && (
        <section className="article-related">
          <div className="container">
            <div className="article-related__header">
              <p className="article-related__eyebrow">Continue reading</p>
              <h2 className="article-related__headline">Related dispatches</h2>
              <Link href="/blog" className="article-related__all">
                All dispatches →
              </Link>
            </div>
            <div className="article-related__grid">
              {related.map((rel) => (
                <RelatedCard key={rel.slug} post={rel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
