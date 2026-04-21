"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../help.css";
import {
  CATEGORIES,
  getArticleBySlug,
  getRelatedArticles,
  type HelpArticle,
} from "@/lib/help/mock-articles";

/* ────────────────────────────────────────────────────────────
   Markdown renderer — covers h2/h3/p/ul/ol/code/pre/blockquote/table
   ──────────────────────────────────────────────────────────── */
function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let keyCounter = 0;
  const key = () => keyCounter++;

  function inlineText(text: string): React.ReactNode {
    // Bold, code, links in inline text
    const parts: React.ReactNode[] = [];
    const re = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      if (match.index > last) {
        parts.push(text.slice(last, match.index));
      }
      const m = match[0];
      if (m.startsWith("`")) {
        parts.push(<code key={key()}>{m.slice(1, -1)}</code>);
      } else if (m.startsWith("**")) {
        parts.push(<strong key={key()}>{m.slice(2, -2)}</strong>);
      } else {
        // link
        const label = m.match(/\[([^\]]+)\]/)?.[1] ?? "";
        const href = m.match(/\(([^)]+)\)/)?.[1] ?? "#";
        parts.push(
          <a key={key()} href={href}>
            {label}
          </a>,
        );
      }
      last = match.index + m.length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.length === 1 && typeof parts[0] === "string"
      ? parts[0]
      : parts;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      const text = line.slice(3);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      nodes.push(
        <h2 key={key()} id={id}>
          {text}
        </h2>,
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      const text = line.slice(4);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      nodes.push(
        <h3 key={key()} id={id}>
          {text}
        </h3>,
      );
      i++;
      continue;
    }

    // Code block
    if (line.startsWith("```")) {
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // closing ```
      nodes.push(
        <pre key={key()}>
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        bqLines.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <blockquote key={key()}>
          {bqLines.map((l, li) => (
            <p key={li}>{inlineText(l)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    // Table
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      // First row = header, second = separator, rest = body
      const parseRow = (row: string) =>
        row
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());

      const headers = parseRow(tableLines[0]);
      const bodyRows = tableLines.slice(2).map(parseRow);

      nodes.push(
        <table key={key()}>
          <thead>
            <tr>
              {headers.map((h, hi) => (
                <th key={hi}>{inlineText(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>{inlineText(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      );
      continue;
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(<li key={key()}>{inlineText(lines[i].slice(2))}</li>);
        i++;
      }
      nodes.push(<ul key={key()}>{items}</ul>);
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\. /)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        const text = lines[i].replace(/^\d+\. /, "");
        items.push(<li key={key()}>{inlineText(text)}</li>);
        i++;
      }
      nodes.push(<ol key={key()}>{items}</ol>);
      continue;
    }

    // Checklist items
    if (line.match(/^- \[ \] /)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && lines[i].match(/^- \[[ x]\] /)) {
        const checked = lines[i].startsWith("- [x]");
        const text = lines[i].replace(/^- \[[ x]\] /, "");
        items.push(
          <li key={key()}>
            <input
              type="checkbox"
              defaultChecked={checked}
              readOnly
              style={{ marginRight: 8 }}
            />
            {inlineText(text)}
          </li>,
        );
        i++;
      }
      nodes.push(<ul key={key()}>{items}</ul>);
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("|") &&
      !lines[i].match(/^[-*] /) &&
      !lines[i].match(/^\d+\. /)
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      nodes.push(<p key={key()}>{inlineText(paraLines.join(" "))}</p>);
    }
  }

  return nodes;
}

/* ────────────────────────────────────────────────────────────
   TOC extraction
   ──────────────────────────────────────────────────────────── */
interface TocEntry {
  level: 2 | 3;
  text: string;
  id: string;
}

function extractToc(body: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const line of body.split("\n")) {
    if (line.startsWith("## ")) {
      const text = line.slice(3);
      entries.push({
        level: 2,
        text,
        id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      });
    } else if (line.startsWith("### ")) {
      const text = line.slice(4);
      entries.push({
        level: 3,
        text,
        id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      });
    }
  }
  return entries;
}

/* ────────────────────────────────────────────────────────────
   TOC sidebar — highlights active heading on scroll
   ──────────────────────────────────────────────────────────── */
function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const [activeId, setActiveId] = useState(toc[0]?.id ?? "");

  useEffect(() => {
    if (toc.length === 0) return;
    const headings = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0.1 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <aside className="help-toc" aria-label="Table of contents">
      <p className="help-toc__title">On this page</p>
      <ul className="help-toc__list">
        {toc.map((entry) => (
          <li
            key={entry.id}
            className={`help-toc__item${entry.level === 3 ? " help-toc__item--h3" : ""}`}
          >
            <a
              href={`#${entry.id}`}
              className={activeId === entry.id ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(entry.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                setActiveId(entry.id);
              }}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ────────────────────────────────────────────────────────────
   Feedback widget
   ──────────────────────────────────────────────────────────── */
function FeedbackWidget({ article }: { article: HelpArticle }) {
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (v: "yes" | "no") => {
    setVote(v);
    if (v === "yes") {
      // For "yes", auto-submit after short delay
      setTimeout(() => setSubmitted(true), 800);
    }
  };

  const handleSubmitFeedback = () => {
    setSubmitted(true);
  };

  return (
    <div className="help-feedback">
      <p className="help-feedback__title">Was this article helpful?</p>

      {submitted ? (
        <p className="help-feedback__thanks">
          Thanks for your feedback — it helps us improve Push Help Center.
        </p>
      ) : (
        <>
          <div className="help-feedback__buttons">
            <button
              className={`help-feedback__btn help-feedback__btn--yes${vote === "yes" ? " active" : ""}`}
              onClick={() => handleVote("yes")}
              aria-pressed={vote === "yes"}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.25M6.633 10.5H5.25a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25h.463"
                />
              </svg>
              Yes, it helped
            </button>
            <button
              className={`help-feedback__btn help-feedback__btn--no${vote === "no" ? " active" : ""}`}
              onClick={() => handleVote("no")}
              aria-pressed={vote === "no"}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.367 13.5c-.806 0-1.533.446-2.031 1.08a9.041 9.041 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H4.372c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 012.25 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729h3.586c.483 0 .964.078 1.423.23l3.114 1.04a4.501 4.501 0 001.423.23h1.383M17.367 13.5H18.75a2.25 2.25 0 002.25-2.25V4.5a2.25 2.25 0 00-2.25-2.25h-.463"
                />
              </svg>
              Not really
            </button>
          </div>

          {vote === "no" && (
            <div className="help-feedback__textarea-wrap">
              <textarea
                className="help-feedback__textarea"
                placeholder="Tell us what we can improve..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                aria-label="Feedback details"
              />
              <button
                className="help-feedback__submit"
                onClick={handleSubmitFeedback}
              >
                Send feedback
              </button>
            </div>
          )}

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 12,
            }}
          >
            {article.helpful.toLocaleString()} people found this helpful
          </p>
        </>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Related articles
   ──────────────────────────────────────────────────────────── */
function RelatedArticles({ article }: { article: HelpArticle }) {
  const related = getRelatedArticles(article, 3);
  if (related.length === 0) return null;

  return (
    <div className="help-related">
      <h2 className="help-related__title">Related articles</h2>
      <div className="help-related__list">
        {related.map((a) => (
          <Link
            key={a.slug}
            href={`/help/${a.slug}`}
            className="help-related__item"
          >
            <span className="help-related__item-title">{a.title}</span>
            <span className="help-related__item-meta">
              {a.viewCount.toLocaleString()} views
            </span>
            <svg
              className="help-related__arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Article page
   ──────────────────────────────────────────────────────────── */
export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const cat = CATEGORIES[article.category];
  const toc = extractToc(article.body);
  const renderedBody = renderMarkdown(article.body);

  const formattedDate = new Date(article.lastUpdated).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" },
  );

  return (
    <main className="help-article-page">
      {/* Breadcrumb */}
      <nav className="help-breadcrumb" aria-label="Breadcrumb">
        <Link href="/help">Help Center</Link>
        <span className="help-breadcrumb__sep" aria-hidden>
          /
        </span>
        <Link href={`/help?category=${article.category}`}>{cat.label}</Link>
        <span className="help-breadcrumb__sep" aria-hidden>
          /
        </span>
        <span className="help-breadcrumb__current">{article.title}</span>
      </nav>

      {/* Article header */}
      <header className="help-article-header">
        <span className="help-article-cat-badge">{cat.label}</span>
        <h1 className="help-article-title">{article.title}</h1>
        <div className="help-article-meta">
          <span className="help-article-meta__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            Updated {formattedDate}
          </span>
          <span className="help-article-meta__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {article.viewCount.toLocaleString()} views
          </span>
          <span className="help-article-meta__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.25M6.633 10.5H5.25a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25h.463"
              />
            </svg>
            {article.helpful.toLocaleString()} found helpful
          </span>
        </div>
      </header>

      <hr className="help-article-divider" />

      {/* TOC + body layout */}
      <div className="help-article-layout">
        {/* TOC — hidden on mobile via CSS grid collapse */}
        <TableOfContents toc={toc} />

        {/* Body */}
        <div>
          <article className="help-article-body">{renderedBody}</article>
          <FeedbackWidget article={article} />
          <RelatedArticles article={article} />
        </div>
      </div>
    </main>
  );
}
