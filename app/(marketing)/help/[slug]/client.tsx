"use client";

import Link from "next/link";
import { useState } from "react";

/* ============================================================
   Push — Help Article client island
   ------------------------------------------------------------
   Isolates the "Was this helpful?" widget + related-article
   hover states so the rest of the article template can stay on
   the server and ship zero JS for plain readers.
   ============================================================ */

type Related = {
  slug: string;
  topic: string;
  title: string;
  readMinutes: number;
};

type Vote = "yes" | "no" | null;

export function HelpArticleClient({
  related,
  articleSlug,
}: {
  related: Related[];
  articleSlug: string;
}) {
  const [vote, setVote] = useState<Vote>(null);

  function handleVote(v: Exclude<Vote, null>) {
    if (vote !== null) return;
    setVote(v);
    // UI-only per spec — no API call.
    // A real implementation would POST to /api/help/feedback here.
  }

  return (
    <>
      {/* Was this helpful? */}
      <section
        className="help-feedback"
        aria-labelledby={`feedback-title-${articleSlug}`}
      >
        <h2
          className="help-feedback-title"
          id={`feedback-title-${articleSlug}`}
        >
          Was this helpful?
        </h2>

        {vote === null ? (
          <div className="help-feedback-buttons">
            <button
              type="button"
              className="help-feedback-btn"
              onClick={() => handleVote("yes")}
              aria-label="Yes, this article was helpful"
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 10v11" />
                <path d="M14 3l-2 7h6v4l-3 7H8V10l4-7 2 0z" />
              </svg>
              Yes
            </button>
            <button
              type="button"
              className="help-feedback-btn"
              onClick={() => handleVote("no")}
              aria-label="No, this article was not helpful"
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M17 14V3" />
                <path d="M10 21l2-7H6v-4l3-7h8v11l-4 7-2 0z" />
              </svg>
              No
            </button>
          </div>
        ) : (
          <p className="help-feedback-thanks" role="status">
            {vote === "yes"
              ? "Thanks — glad this helped."
              : "Got it. We'll re-write this article with a human editor in the next pass."}
          </p>
        )}
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="help-related" aria-labelledby="related-title">
          <h2 className="help-related-title" id="related-title">
            Related articles
          </h2>
          <div className="help-related-row">
            {related.slice(0, 3).map((rel) => (
              <Link
                key={rel.slug}
                href={`/help/${rel.slug}`}
                className="help-related-card"
              >
                <span className="help-related-card-topic">{rel.topic}</span>
                <span className="help-related-card-title">{rel.title}</span>
                <span className="help-related-card-meta">
                  {rel.readMinutes} min read
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
