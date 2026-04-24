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
import "../blog.css";
import "./article.css";

/* ── Static params ───────────────────────────────────────── */
export async function generateStaticParams() {
  return MOCK_POSTS.map((p) => ({ slug: p.slug }));
}

/* ── Format helpers ─────────────────────────────────────── */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ── Category tag ────────────────────────────────────────── */
function CategoryTag({ category }: { category: PostCategory }) {
  return (
    <span
      className={`blog-cat-tag blog-cat-tag--${category
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      {category}
    </span>
  );
}

/* ── Article body renderer ───────────────────────────────── */
// Converts the markdown-like body into React elements
function ArticleBody({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip blank lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="article-h2">
          {line.slice(3)}
        </h2>,
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="article-h3">
          {line.slice(4)}
        </h3>,
      );
      i++;
      continue;
    }

    // H4 (bold inline headers like **Heading**)
    if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={key++} className="article-h4">
          {line.slice(5)}
        </h4>,
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={key++} className="article-blockquote">
          <p>{renderInline(line.slice(2))}</p>
        </blockquote>,
      );
      i++;
      continue;
    }

    // Unordered list
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

    // Ordered list
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

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // consume closing ```
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

    // Table (pipe-delimited)
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      let isHeader = true;
      while (i < lines.length && lines[i].startsWith("|")) {
        const row = lines[i]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        // Skip separator rows (---|---)
        if (row.every((c) => /^[-: ]+$/.test(c))) {
          isHeader = false;
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

    // Paragraph
    elements.push(
      <p key={key++} className="article-p">
        {renderInline(line)}
      </p>,
    );
    i++;
  }

  return <>{elements}</>;
}

/* ── Inline markdown renderer ────────────────────────────── */
function renderInline(text: string): React.ReactNode {
  // Handle **bold**, *italic*, and `code`
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

/* ── Related post card ───────────────────────────────────── */
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
          <CategoryTag category={post.category} />
          <h4 className="related-card__title">{post.title}</h4>
          <span className="related-card__meta">
            {formatDate(post.publishedAt)} · {post.readMins} min
          </span>
        </div>
      </Link>
    </article>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  return (
    <>
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
            Push Notes
          </Link>
          <span className="article-breadcrumb__sep" aria-hidden="true">
            →
          </span>
          <span className="article-breadcrumb__current" aria-current="page">
            {post.category}
          </span>
        </div>
      </nav>

      {/* ── Article header ────────────────────────────── */}
      <header className="article-header">
        <div className="container article-header__inner">
          <CategoryTag category={post.category} />
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

      {/* ── Article body ──────────────────────────────── */}
      <div className="article-layout">
        <div className="container">
          <div className="article-layout__inner">
            {/* Tags sidebar */}
            <aside className="article-tags-col">
              <p className="article-tags__label">Tags</p>
              <ul className="article-tags">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <span className="article-tag">{tag}</span>
                  </li>
                ))}
              </ul>
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
            <div>
              <p className="article-author-bio__label">Written by</p>
              <p className="article-author-bio__name">{post.author.name}</p>
              <p className="article-author-bio__role">{post.author.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comments placeholder ──────────────────────── */}
      <section className="article-comments">
        <div className="container">
          <div className="article-comments__inner">
            <div className="eyebrow article-comments__eyebrow">Discussion</div>
            <h2 className="article-comments__headline">
              <span className="wt-900">Comments</span>{" "}
              <span className="wt-300">coming soon.</span>
            </h2>
            <p className="article-comments__body">
              We&apos;re building a community discussion layer for Push Notes.
              In the meantime, reply to us at{" "}
              <a
                href="mailto:notes@pushnyc.co"
                className="article-comments__link"
              >
                notes@pushnyc.co
              </a>{" "}
              — we read every reply.
            </p>
          </div>
        </div>
      </section>

      {/* ── Related posts ─────────────────────────────── */}
      {related.length > 0 && (
        <section className="article-related">
          <div className="container">
            <div className="article-related__header">
              <p className="eyebrow article-related__eyebrow">
                Continue reading
              </p>
              <h2 className="article-related__headline">
                Related field reports
              </h2>
              <Link href="/blog" className="article-related__all">
                All notes →
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
