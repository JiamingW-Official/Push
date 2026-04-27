import Link from "next/link";
import { notFound } from "next/navigation";
import "../help.css";
import {
  getArticleBySlug,
  getRelatedArticles,
  CATEGORIES,
} from "@/lib/help/mock-articles";

/* ── Metadata ────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return { title: "Article Not Found — Push Help Center" };
  }
  return {
    title: `${article.title} — Push Help Center`,
    description: article.excerpt,
  };
}

/* ── Markdown-like renderer ──────────────────────────────────── */
function renderBody(body: string) {
  // Split into sections by h2 headings
  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      const headingText = line.slice(3);
      const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      elements.push(
        <h2
          key={key++}
          id={id}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
            color: "var(--ink)",
            margin: "48px 0 16px",
            paddingBottom: 12,
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          {headingText}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={key++}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            color: "var(--ink)",
            margin: "32px 0 12px",
          }}
        >
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={key++}
          style={{
            margin: "24px 0",
            padding: "16px 24px",
            borderLeft: "3px solid var(--brand-red)",
            background: "var(--brand-red-tint)",
            fontSize: 16,
            fontFamily: "var(--font-body)",
            color: "var(--graphite)",
            lineHeight: 1.55,
            borderRadius: "0 8px 8px 0",
          }}
        >
          {line.slice(2)}
        </blockquote>,
      );
    } else if (line.startsWith("```")) {
      // Code block
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={key++}
          style={{
            background: "var(--ink)",
            color: "var(--snow)",
            padding: 24,
            overflowX: "auto",
            marginBottom: 24,
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: 1.6,
            borderRadius: 8,
            borderLeft: "3px solid var(--brand-red)",
          }}
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
    } else if (line.startsWith("| ")) {
      // Table
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headers = tableLines[0]
        .split("|")
        .filter(Boolean)
        .map((h) => h.trim());
      const rows = tableLines.slice(2).map((row) =>
        row
          .split("|")
          .filter(Boolean)
          .map((c) => c.trim()),
      );
      elements.push(
        <div
          key={key++}
          style={{ overflowX: "auto", marginBottom: 24, borderRadius: 10 }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "var(--font-body)",
              fontSize: 14,
            }}
          >
            <thead>
              <tr>
                {headers.map((h, hi) => (
                  <th
                    key={hi}
                    style={{
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                      background: "var(--surface-2)",
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--hairline-2)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: "12px 16px",
                        borderBottom:
                          ri < rows.length - 1
                            ? "1px dotted var(--hairline)"
                            : "none",
                        color: "var(--ink-3)",
                        verticalAlign: "top",
                        lineHeight: 1.5,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      // Unordered list — collect consecutive list items
      const listItems: string[] = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul
          key={key++}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--ink-3)",
            paddingLeft: 24,
            marginBottom: 16,
          }}
        >
          {listItems.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 8 }}>
              {item}
            </li>
          ))}
        </ul>,
      );
      continue;
    } else if (/^\d+\. /.test(line)) {
      // Ordered list
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol
          key={key++}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--ink-3)",
            paddingLeft: 24,
            marginBottom: 16,
          }}
        >
          {listItems.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 8 }}>
              {item}
            </li>
          ))}
        </ol>,
      );
      continue;
    } else if (line.trim() !== "") {
      // Paragraph — handle **bold** inline
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const inline = parts.map((part, pi) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pi} style={{ fontWeight: 700, color: "var(--ink)" }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
      elements.push(
        <p
          key={key++}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--ink-3)",
            marginBottom: 16,
          }}
        >
          {inline}
        </p>,
      );
    }

    i++;
  }

  return elements;
}

/* ── Page ────────────────────────────────────────────────────── */
export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = getRelatedArticles(article, 3);
  const categoryLabel = CATEGORIES[article.category]?.label ?? article.category;

  return (
    <>
      {/* ═══ HERO — article header ══════════════════════════════ */}
      <section
        style={{
          background: "var(--panel-butter)",
          padding: "80px 0 64px",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 64px",
          }}
        >
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 32,
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/help"
              style={{ color: "var(--ink-3)", textDecoration: "none" }}
            >
              Help Center
            </Link>
            <span aria-hidden style={{ color: "var(--mist)" }}>
              /
            </span>
            <span style={{ color: "var(--ink-4)" }}>{categoryLabel}</span>
            <span aria-hidden style={{ color: "var(--mist)" }}>
              /
            </span>
            <span
              style={{
                color: "var(--ink-4)",
                maxWidth: 240,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {article.title}
            </span>
          </nav>

          {/* Category eyebrow */}
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", marginBottom: 16 }}
          >
            ({categoryLabel.toUpperCase()})
          </p>

          {/* Article title */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              lineHeight: 1.0,
              color: "var(--ink)",
              margin: "0 0 24px",
              maxWidth: 800,
            }}
          >
            {article.title}
          </h1>

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
              flexWrap: "wrap",
            }}
          >
            <span>Push Support Team</span>
            <span aria-hidden style={{ color: "var(--mist)" }}>
              ·
            </span>
            <span>
              Updated{" "}
              {new Date(article.lastUpdated).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span aria-hidden style={{ color: "var(--mist)" }}>
              ·
            </span>
            <span>{article.viewCount.toLocaleString()} views</span>
          </div>
        </div>
      </section>

      {/* ═══ CONTENT BODY ══════════════════════════════════════ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "80px 0",
        }}
      >
        <div
          style={{
            maxWidth: "72ch",
            margin: "0 auto",
            padding: "0 64px",
          }}
        >
          {/* Lead paragraph */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              lineHeight: 1.55,
              color: "var(--ink-3)",
              marginBottom: 48,
              borderLeft: "3px solid var(--brand-red)",
              paddingLeft: 24,
            }}
          >
            {article.excerpt}
          </p>

          {/* Article body */}
          {renderBody(article.body)}

          {/* Feedback panel */}
          <div className="help-feedback-panel">
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--ink-3)", marginBottom: 8 }}
              >
                (FEEDBACK)
              </p>
              <h3 className="help-feedback-title">Was this helpful?</h3>
            </div>
            <div className="help-feedback-btns">
              <button
                aria-label="Yes, this was helpful"
                className="btn-ghost click-shift"
                style={{ gap: 8 }}
              >
                <span aria-hidden>✓</span> Yes
              </button>
              <button
                aria-label="No, this was not helpful"
                className="btn-ghost click-shift"
                style={{ gap: 8 }}
              >
                <span aria-hidden>✕</span> Not really
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ RELATED ARTICLES ══════════════════════════════════ */}
      {related.length > 0 && (
        <section className="help-related-section">
          <div
            style={{
              maxWidth: 1140,
              margin: "0 auto",
              padding: "0 64px",
            }}
          >
            <div style={{ marginBottom: 48 }}>
              <p
                className="eyebrow"
                style={{ color: "var(--ink-3)", marginBottom: 16 }}
              >
                (KEEP READING)
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                Related articles.
              </h2>
            </div>

            <div className="help-related-grid">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/help/${rel.slug}`}
                  className="help-related-card click-shift"
                >
                  <p className="eyebrow" style={{ color: "var(--ink-4)" }}>
                    {CATEGORIES[rel.category]?.label ?? rel.category}
                  </p>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "var(--ink)",
                      lineHeight: 1.3,
                      flex: 1,
                    }}
                  >
                    {rel.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span className="eyebrow" style={{ color: "var(--ink-4)" }}>
                      {rel.viewCount.toLocaleString()} views
                    </span>
                    <span style={{ color: "var(--brand-red)", fontSize: 16 }}>
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ SIG DIVIDER ═══════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "80px 64px",
          background: "var(--surface)",
        }}
      >
        <span className="sig-divider">Real · Local · Verified ·</span>
      </div>

      {/* ═══ TICKET CTA ════════════════════════════════════════ */}
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          padding: "0 64px 120px",
        }}
      >
        <div className="ticket-panel">
          <p
            className="eyebrow"
            style={{
              color: "rgba(255,255,255,0.65)",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            (STILL NEED HELP)
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
            Not finding the answer?
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
            Our support team responds within one business day — usually the same
            hour.
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
