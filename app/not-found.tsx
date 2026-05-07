// v11 404 page — Atmospheric backdrop + Liquid Glass + corner-anchored
// Magvix Italic display + 3 colorful section cards + signature divider.
// Marketing register. Full Design.md compliance — STRICT identity tokens.
//
// Composition:
//   PANEL 1 — Hero (warm atmospheric mesh, ghost "404", Magvix italic title,
//             live pulse eyebrow, dual-CTA Filled Primary + N2W Blue secondary,
//             inline SVG illustration "wrong door")
//   SIGNATURE DIVIDER — "Closed · Moved · Never Existed ·"
//   PANEL 2 — 3 Liquid Glass action cards (Home / Search / Help)
//   FOOTER — reassurance line + support email

import Link from "next/link";
import type { Metadata } from "next";
import "./not-found.css";

export const metadata: Metadata = {
  title: "404 · Lost in the system · Push",
  description:
    "This page moved, closed, or never existed. Find what you need — head home, search the directory, or read the help docs.",
  robots: { index: false, follow: false },
};

/* ─── Three Liquid Glass action cards ───────────────────────── */
const ACTIONS: {
  href: string;
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  variant: "butter" | "sky" | "peach";
}[] = [
  {
    href: "/",
    eyebrow: "(GO HOME)",
    title: "Push homepage",
    desc: "Back to the front door — the walk-in economy starts here.",
    cta: "Take me home →",
    variant: "butter",
  },
  {
    href: "/explore",
    eyebrow: "(SEARCH)",
    title: "Browse merchants",
    desc: "Explore the live directory of NYC merchants on Push right now.",
    cta: "Open directory →",
    variant: "sky",
  },
  {
    href: "/help",
    eyebrow: "(HELP)",
    title: "Help center",
    desc: "FAQs, walkthroughs, and getting-started guides — for creators + merchants.",
    cta: "Read the docs →",
    variant: "peach",
  },
];

/* ─── Page ──────────────────────────────────────────────────── */
export default function NotFound() {
  return (
    <main className="nf-root" id="main-content">
      {/* ─── PANEL 1 — Hero with atmospheric mesh + ghost numeral ─── */}
      <section className="nf-hero" aria-labelledby="nf-h1">
        {/* Ghost "404" — Darky 900 var(--ink) opacity 0.05, anchored corner */}
        <span className="nf-hero-ghost" aria-hidden="true">
          404
        </span>

        <div className="nf-hero-inner">
          {/* Left — title block, bottom-left anchored */}
          <div className="nf-hero-content">
            {/* Eyebrow with live pulse — § 8.4 mono parenthetical + dot */}
            <p className="eyebrow nf-hero-eyebrow">
              <span className="nf-hero-pulse" aria-hidden="true" />
              <span>(404 · WRONG DOOR)</span>
            </p>

            {/* Magvix Italic display — corner-anchored bottom-left
                clamp(56,8vw,128)px per § 3.1 */}
            <h1 id="nf-h1" className="nf-hero-h1">
              Lost in the
              <br />
              <em className="nf-hero-h1-em">system.</em>
            </h1>

            {/* 18px Open Sans body */}
            <p className="nf-hero-sub">
              This page moved, closed, or never existed. The link you followed
              could be stale — or someone typo'd a URL. Either way, you're not
              stuck. Pick a door below.
            </p>

            {/* Dual CTA row — § 9 unified buttons */}
            <div className="nf-hero-cta-row">
              <Link href="/" className="btn-primary click-shift">
                Go home
              </Link>
              <Link href="/explore" className="btn-secondary click-shift">
                Search directory
              </Link>
            </div>
          </div>

          {/* Right — inline SVG illustration: creator at a wrong door */}
          <aside
            className="nf-hero-illustration"
            aria-label="Illustration: someone standing at a closed door"
          >
            <svg
              viewBox="0 0 320 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-hidden="true"
            >
              {/* Background frame circle */}
              <circle cx="160" cy="160" r="148" fill="var(--surface-2)" />
              <circle
                cx="160"
                cy="160"
                r="148"
                stroke="var(--mist)"
                strokeWidth="1"
                fill="none"
              />

              {/* Door panel */}
              <rect
                x="100"
                y="80"
                width="120"
                height="180"
                rx="10"
                fill="var(--surface-3)"
                stroke="var(--ink-3)"
                strokeWidth="2"
              />
              {/* Door inner panels */}
              <rect
                x="116"
                y="96"
                width="88"
                height="60"
                rx="4"
                stroke="var(--ink-4)"
                strokeWidth="1.5"
                fill="var(--surface)"
              />
              <rect
                x="116"
                y="172"
                width="88"
                height="76"
                rx="4"
                stroke="var(--ink-4)"
                strokeWidth="1.5"
                fill="var(--surface)"
              />
              {/* Door handle */}
              <circle cx="196" cy="200" r="3.5" fill="var(--champagne)" />

              {/* Closed sign on door */}
              <rect
                x="124"
                y="112"
                width="72"
                height="28"
                rx="2"
                fill="var(--brand-red)"
                transform="rotate(-2 160 126)"
              />
              <text
                x="160"
                y="131"
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontWeight="800"
                fontSize="14"
                fill="var(--snow)"
                letterSpacing="0.08em"
                transform="rotate(-2 160 126)"
              >
                CLOSED
              </text>

              {/* Creator silhouette — small figure looking up */}
              <g>
                {/* Body */}
                <ellipse cx="60" cy="240" rx="14" ry="6" fill="var(--ink-4)" />
                <rect
                  x="52"
                  y="190"
                  width="16"
                  height="50"
                  rx="6"
                  fill="var(--ink-3)"
                />
                {/* Head */}
                <circle cx="60" cy="180" r="9" fill="var(--ink-3)" />
                {/* Question pin floating above */}
                <circle
                  cx="80"
                  cy="148"
                  r="14"
                  fill="var(--accent-blue)"
                  stroke="var(--snow)"
                  strokeWidth="2"
                />
                <text
                  x="80"
                  y="153"
                  textAnchor="middle"
                  fontFamily="var(--font-display)"
                  fontWeight="900"
                  fontSize="16"
                  fill="var(--snow)"
                >
                  ?
                </text>
                {/* Pin tail */}
                <path
                  d="M 80 162 L 76 168 L 80 174 L 84 168 Z"
                  fill="var(--accent-blue)"
                />
              </g>

              {/* Floor line */}
              <line
                x1="40"
                y1="260"
                x2="280"
                y2="260"
                stroke="var(--ink-4)"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            </svg>
          </aside>
        </div>
      </section>

      {/* ─── SIGNATURE DIVIDER — Magvix Italic, ≤2 per page ─── */}
      <div className="nf-sig-wrap" aria-hidden="true">
        <span className="nf-sig-divider">Closed · Moved · Never existed ·</span>
      </div>

      {/* ─── PANEL 2 — 3 colorful action cards (candy panels) ─── */}
      <section className="nf-actions" aria-labelledby="nf-actions-h2">
        <div className="nf-actions-inner">
          <p className="eyebrow nf-actions-eyebrow">(THINGS YOU CAN DO)</p>
          <h2 id="nf-actions-h2" className="nf-actions-h2">
            Three doors that work.
          </h2>

          <div
            className="nf-action-grid"
            role="navigation"
            aria-label="Helpful links"
          >
            {ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`nf-action-card nf-action-card--${action.variant} click-shift`}
                aria-label={`${action.title}: ${action.desc}`}
              >
                <span className="eyebrow nf-action-card-eyebrow">
                  {action.eyebrow}
                </span>
                <h3 className="nf-action-card-title">{action.title}</h3>
                <p className="nf-action-card-desc">{action.desc}</p>
                <span className="nf-action-card-cta">{action.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER — reassurance line ─── */}
      <footer className="nf-footer">
        <p className="nf-footer-line">
          <span>Push · Pay per verified visit</span>
          <span aria-hidden="true">·</span>
          <span>
            If this keeps happening,{" "}
            <a href="mailto:hello@pushnyc.co" className="nf-footer-link">
              email hello@pushnyc.co
            </a>
          </span>
        </p>
      </footer>
    </main>
  );
}
