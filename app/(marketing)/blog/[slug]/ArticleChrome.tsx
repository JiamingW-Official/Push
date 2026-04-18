"use client";

// Client-only chrome around the server-rendered article body.
// - Reading progress bar (fixed top) that fills as the user scrolls.
// - Floating share panel (left rail on desktop; inline on mobile).
// - Collapsible TOC sheet on mobile.
// - Scroll-spy that highlights the active TOC item on desktop.

import { useEffect, useState, useCallback } from "react";

interface TocItem {
  text: string;
  id: string;
}

interface ArticleChromeProps {
  toc: TocItem[];
  shareUrl: string;
  shareTitle: string;
}

export default function ArticleChrome({
  toc,
  shareUrl,
  shareTitle,
}: ArticleChromeProps) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  /* ── Reading progress ── */
  useEffect(() => {
    function update() {
      const article = document.querySelector(
        ".article-body",
      ) as HTMLElement | null;
      if (!article) {
        const total =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        setProgress(total > 0 ? Math.min(1, scrolled / total) : 0);
        return;
      }
      const rect = article.getBoundingClientRect();
      const start = rect.top + window.scrollY - window.innerHeight * 0.4;
      const end = rect.bottom + window.scrollY - window.innerHeight * 0.6;
      const range = Math.max(1, end - start);
      const current = Math.min(range, Math.max(0, window.scrollY - start));
      setProgress(current / range);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* ── Scroll spy for TOC ── */
  useEffect(() => {
    if (toc.length === 0) return;
    const nodes = toc
      .map((t) => document.getElementById(t.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [toc]);

  /* ── Drive desktop TOC active state via data attribute ── */
  useEffect(() => {
    const links =
      document.querySelectorAll<HTMLAnchorElement>(".article-toc__link");
    links.forEach((link) => {
      const id = link.dataset.tocId;
      if (!id) return;
      link.classList.toggle("is-active", id === activeId);
    });
  }, [activeId]);

  /* ── Share actions ── */
  const onCopy = useCallback(() => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard
      ?.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {
        setCopied(false);
      });
  }, [shareUrl]);

  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <>
      {/* ── Reading progress bar ── */}
      <div
        className="article-progress"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="article-progress__fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* ── Floating share panel (desktop left rail) ── */}
      <aside className="article-share" aria-label="Share this dispatch">
        <span className="article-share__label">Share</span>
        <a
          href={twitterHref}
          target="_blank"
          rel="noopener noreferrer"
          className="article-share__btn"
          aria-label="Share on X / Twitter"
        >
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <path
              d="M13.6 3h2.6l-5.7 6.5L17 17h-4.9l-3.8-5-4.4 5H1.3l6.1-6.9L1 3h5l3.4 4.5L13.6 3zm-.9 12.3h1.4L5.3 4.4H3.8l8.9 10.9z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          className="article-share__btn"
          aria-label="Share on LinkedIn"
        >
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <path
              d="M4.4 6.8c1 0 1.9-.9 1.9-1.9S5.4 3 4.4 3s-1.9.9-1.9 1.9.9 1.9 1.9 1.9zM3 8.1h2.9V17H3V8.1zM7.9 8.1h2.7v1.2h.1c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.3V17h-2.8v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V17H7.9V8.1z"
              fill="currentColor"
            />
          </svg>
        </a>
        <button
          type="button"
          onClick={onCopy}
          className={`article-share__btn${copied ? " article-share__btn--copied" : ""}`}
          aria-label={copied ? "Link copied" : "Copy link"}
        >
          {copied ? (
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path
                d="M4 10.5l4 4 8-8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="square"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path
                d="M8 6h7a2 2 0 0 1 2 2v7M12 10H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-1"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
            </svg>
          )}
        </button>
      </aside>

      {/* ── Mobile TOC toggle ── */}
      {toc.length > 0 && (
        <div className={`article-toc-mobile${tocOpen ? " is-open" : ""}`}>
          <button
            type="button"
            className="article-toc-mobile__toggle"
            onClick={() => setTocOpen((v) => !v)}
            aria-expanded={tocOpen}
          >
            <span>In this dispatch</span>
            <span className="article-toc-mobile__chev" aria-hidden="true">
              {tocOpen ? "–" : "+"}
            </span>
          </button>
          {tocOpen && (
            <ol className="article-toc-mobile__list">
              {toc.map((item, i) => (
                <li key={item.id} className="article-toc-mobile__item">
                  <a
                    href={`#${item.id}`}
                    className="article-toc-mobile__link"
                    onClick={() => setTocOpen(false)}
                  >
                    <span className="article-toc-mobile__num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </>
  );
}
