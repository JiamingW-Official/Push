"use client";

// v11 500 Error page — root error boundary
// ─────────────────────────────────────────────────────────────
// Apologetic, not panicky. Atmospheric backdrop, Liquid Glass card,
// Magvix Italic display, retry + report CTAs, optional digest.
// Marketing register, full Design.md compliance.

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Auto-retry countdown (30s) for transient errors — user can cancel
  const [autoRetryAt, setAutoRetryAt] = useState<number | null>(30);

  useEffect(() => {
    // Log once on mount — surfaces in Vercel runtime logs
    console.error("[push] unhandled route error", error);
  }, [error]);

  useEffect(() => {
    if (autoRetryAt === null || autoRetryAt <= 0) return;
    const t = setTimeout(() => {
      setAutoRetryAt((s) => (s !== null && s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearTimeout(t);
  }, [autoRetryAt]);

  useEffect(() => {
    if (autoRetryAt === 0) reset();
  }, [autoRetryAt, reset]);

  return (
    <main
      className="er-root"
      id="main-content"
      role="alert"
      aria-live="assertive"
    >
      {/* PANEL 1 — Hero */}
      <section className="er-hero" aria-labelledby="er-h1">
        {/* Ghost "500" — Darky 900 var(--ink) opacity 0.05 */}
        <span className="er-hero-ghost" aria-hidden="true">
          500
        </span>

        <div className="er-hero-inner">
          {/* Left — title + actions */}
          <div className="er-hero-content">
            <p className="eyebrow er-hero-eyebrow">
              <span className="er-hero-pulse" aria-hidden="true" />
              <span>(500 · SERVER ERROR)</span>
            </p>

            <h1 id="er-h1" className="er-hero-h1">
              Something broke
              <br />
              <em className="er-hero-h1-em">on our end.</em>
            </h1>

            <p className="er-hero-sub">
              Push Ops was notified the moment this happened. No customer was
              mis-verified, no payout triggered. Try the page again — most
              transient errors clear on the next request.
            </p>

            {error?.digest ? (
              <div className="er-digest" role="note">
                <span className="er-digest-label">Reference</span>
                <code className="er-digest-code">{error.digest}</code>
                <span className="er-digest-hint">
                  Include this when emailing support.
                </span>
              </div>
            ) : null}

            <div className="er-hero-cta-row">
              <button
                type="button"
                className="btn-primary click-shift"
                onClick={() => {
                  setAutoRetryAt(null);
                  reset();
                }}
              >
                Try again
              </button>
              <Link href="/" className="btn-ghost click-shift">
                Back to home
              </Link>
            </div>

            {autoRetryAt !== null && autoRetryAt > 0 ? (
              <p className="er-autoretry">
                Retrying automatically in <strong>{autoRetryAt}s</strong> ·{" "}
                <button
                  type="button"
                  className="er-autoretry-cancel"
                  onClick={() => setAutoRetryAt(null)}
                >
                  Cancel auto-retry
                </button>
              </p>
            ) : null}
          </div>

          {/* Right — Liquid Glass illustration card */}
          <aside
            className="lg-surface er-hero-glass"
            aria-label="Status: degraded"
          >
            <svg
              viewBox="0 0 240 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-hidden="true"
              className="er-hero-glass-svg"
            >
              {/* Cracked monitor frame */}
              <rect
                x="40"
                y="60"
                width="160"
                height="110"
                rx="8"
                fill="var(--surface)"
                stroke="var(--ink)"
                strokeWidth="3"
              />
              <rect
                x="48"
                y="68"
                width="144"
                height="94"
                rx="4"
                fill="var(--surface-3)"
              />
              {/* Crack lines on screen */}
              <path
                d="M 80 70 L 110 110 L 90 145 L 130 130 L 160 160"
                stroke="var(--brand-red)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M 110 110 L 95 90 M 110 110 L 130 105 M 130 130 L 145 115"
                stroke="var(--brand-red)"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Stand */}
              <rect x="108" y="170" width="24" height="14" fill="var(--ink)" />
              <rect
                x="80"
                y="184"
                width="80"
                height="6"
                rx="3"
                fill="var(--ink)"
              />
              {/* Caution sticker */}
              <circle cx="170" cy="80" r="14" fill="var(--champagne)" />
              <text
                x="170"
                y="86"
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontWeight="900"
                fontSize="18"
                fill="var(--ink)"
              >
                !
              </text>
            </svg>
            <p className="eyebrow er-hero-glass-label">(STATUS · DEGRADED)</p>
            <p className="er-hero-glass-text">Logged · Investigating</p>
          </aside>
        </div>
      </section>

      {/* SIGNATURE DIVIDER */}
      <div className="er-sig-wrap" aria-hidden="true">
        <span className="er-sig-divider">Logged · Notified · Recovering ·</span>
      </div>

      {/* PANEL 2 — 3 next-step cards */}
      <section className="er-actions" aria-labelledby="er-actions-h2">
        <div className="er-actions-inner">
          <p className="eyebrow er-actions-eyebrow">(WHAT NOW)</p>
          <h2 id="er-actions-h2" className="er-actions-h2">
            Three things you can try.
          </h2>

          <div className="er-action-grid">
            <button
              type="button"
              onClick={() => {
                setAutoRetryAt(null);
                reset();
              }}
              className="er-action-card er-action-card--butter click-shift"
            >
              <span className="eyebrow er-action-card-eyebrow">(RETRY)</span>
              <h3 className="er-action-card-title">Reload this page</h3>
              <p className="er-action-card-desc">
                Most server hiccups clear on the next request. Worth a click.
              </p>
              <span className="er-action-card-cta">Try again →</span>
            </button>

            <Link
              href="/status"
              className="er-action-card er-action-card--sky click-shift"
            >
              <span className="eyebrow er-action-card-eyebrow">(STATUS)</span>
              <h3 className="er-action-card-title">Check system status</h3>
              <p className="er-action-card-desc">
                Live uptime board. If it's a real outage, you'll see it here
                first.
              </p>
              <span className="er-action-card-cta">Open status →</span>
            </Link>

            <a
              href={`mailto:hello@pushnyc.co?subject=500%20error${error?.digest ? `%20%E2%80%94%20${encodeURIComponent(error.digest)}` : ""}&body=I%20hit%20a%20server%20error%20on%20Push.%0A%0AReference%3A%20${error?.digest ?? "n%2Fa"}%0A`}
              className="er-action-card er-action-card--peach click-shift"
            >
              <span className="eyebrow er-action-card-eyebrow">(REPORT)</span>
              <h3 className="er-action-card-title">Email support</h3>
              <p className="er-action-card-desc">
                Tell us what you were doing. Reference auto-included for the ops
                team.
              </p>
              <span className="er-action-card-cta">Email hello@pushnyc →</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="er-footer">
        <p className="er-footer-line">
          <span>Push · Pay per verified visit</span>
          <span aria-hidden="true">·</span>
          <span>
            Persistent issues?{" "}
            <a href="mailto:hello@pushnyc.co" className="er-footer-link">
              hello@pushnyc.co
            </a>
          </span>
        </p>
      </footer>

      {/* Scoped styles — keeps error.tsx self-contained, survives even if a
          page-specific stylesheet failed to load. All tokens come from
          globals.css (already loaded at the layout level). */}
      <style>{`
        .er-root {
          min-height: 100svh;
          width: 100%;
          background:
            radial-gradient(ellipse 900px 600px at 88% 8%, rgba(193, 18, 31, 0.10), transparent 55%),
            radial-gradient(ellipse 700px 500px at 5% 95%, rgba(191, 161, 112, 0.18), transparent 60%),
            radial-gradient(ellipse 600px 480px at 92% 95%, rgba(0, 133, 255, 0.05), transparent 65%),
            linear-gradient(180deg, var(--surface) 0%, var(--surface) 60%, var(--surface-2) 100%);
          background-attachment: fixed;
          position: relative;
          overflow-x: hidden;
        }

        /* ─── PANEL 1 — Hero ─── */
        .er-hero {
          position: relative;
          width: 100%;
          min-height: clamp(560px, 78svh, 760px);
          padding: clamp(96px, 12vw, 160px) clamp(24px, 5vw, 64px) 96px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .er-hero-ghost {
          position: absolute;
          top: clamp(40px, 8vw, 96px);
          right: clamp(-32px, -2vw, -16px);
          font-family: var(--font-display);
          font-size: clamp(180px, 28vw, 400px);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.85;
          color: var(--ink);
          opacity: 0.05;
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          z-index: 0;
        }

        .er-hero-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: 64px;
          align-items: end;
        }

        @media (max-width: 1023px) {
          .er-hero-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        .er-hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .er-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--brand-red) !important;
          margin-bottom: 32px;
        }

        .er-hero-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--brand-red);
          animation: er-pulse 1.6s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes er-pulse {
          0%, 100% { box-shadow: 0 0 0 0 var(--brand-red-focus); opacity: 1; }
          50%      { box-shadow: 0 0 0 8px transparent; opacity: 0.55; }
        }

        .er-hero-h1 {
          font-family: var(--font-hero);
          font-style: italic;
          font-weight: normal;
          font-size: clamp(48px, 7vw, 112px);
          letter-spacing: -0.025em;
          line-height: 0.92;
          color: var(--ink);
          margin: 0 0 32px;
        }

        .er-hero-h1-em {
          font-style: italic;
          color: var(--brand-red);
        }

        .er-hero-sub {
          font-family: var(--font-body);
          font-size: 18px;
          line-height: 1.55;
          color: var(--ink-3);
          max-width: 56ch;
          margin: 0 0 24px;
        }

        .er-digest {
          font-family: var(--font-body);
          font-size: 12px;
          background: var(--surface-3);
          border-left: 3px solid var(--brand-red);
          padding: 12px 16px;
          margin: 0 0 32px;
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          border-radius: var(--r-sm);
          color: var(--ink-3);
        }

        .er-digest-label {
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--champagne);
          font-size: 10px;
        }

        .er-digest-code {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--ink);
          letter-spacing: 0;
        }

        .er-digest-hint {
          color: var(--ink-4);
          font-size: 11px;
        }

        .er-hero-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .er-hero-cta-row { gap: 12px; }
        }

        .er-autoretry {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--ink-4);
          margin: 0;
        }

        .er-autoretry strong {
          color: var(--ink);
          font-variant-numeric: tabular-nums;
        }

        .er-autoretry-cancel {
          background: transparent;
          border: none;
          color: var(--brand-red);
          padding: 0;
          font-family: inherit;
          font-size: inherit;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
        }

        .er-autoretry-cancel:hover { color: var(--brand-red-deep); }

        /* Right column — Liquid Glass card with SVG */
        .er-hero-glass {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 360px;
          width: 100%;
          margin-left: auto;
        }

        .er-hero-glass-svg {
          width: 100%;
          height: auto;
          max-width: 240px;
          margin: 0 auto;
        }

        .er-hero-glass-label {
          color: var(--ink-3) !important;
          margin: 0;
          text-align: center;
        }

        .er-hero-glass-text {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin: 0;
          text-align: center;
        }

        @media (max-width: 1023px) {
          .er-hero-glass {
            max-width: 320px;
            margin: 0 auto;
          }
        }

        /* ─── SIGNATURE DIVIDER ─── */
        .er-sig-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 64px 24px;
        }

        .er-sig-divider {
          font-family: var(--font-hero);
          font-style: italic;
          font-weight: normal;
          font-size: clamp(28px, 3.5vw, 40px);
          letter-spacing: -0.01em;
          color: var(--ink-3);
          text-align: center;
        }

        /* ─── PANEL 2 — Action cards ─── */
        .er-actions {
          width: 100%;
          padding: 0 clamp(24px, 5vw, 64px) clamp(80px, 10vw, 120px);
        }

        .er-actions-inner {
          max-width: 1140px;
          margin: 0 auto;
        }

        .er-actions-eyebrow {
          color: var(--ink-3) !important;
          margin: 0 0 16px;
        }

        .er-actions-h2 {
          font-family: var(--font-display);
          font-size: clamp(32px, 4vw, 40px);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.05;
          color: var(--ink);
          margin: 0 0 48px;
        }

        .er-action-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 1023px) and (min-width: 768px) {
          .er-action-grid { grid-template-columns: repeat(2, 1fr); }
          .er-action-grid > :last-child {
            grid-column: 1 / -1;
            max-width: 480px;
            margin: 0 auto;
            width: 100%;
          }
        }

        @media (max-width: 767px) {
          .er-action-grid { grid-template-columns: 1fr; gap: 16px; }
        }

        .er-action-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 32px;
          border-radius: var(--r-md);
          text-decoration: none;
          color: inherit;
          border: 1px solid var(--mist);
          transition:
            transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 200ms ease;
          text-align: left;
          font-family: var(--font-body);
          cursor: pointer;
          min-height: 240px;
        }

        .er-action-card:hover {
          transform: translate(2px, 2px);
          box-shadow: var(--shadow-1);
        }

        .er-action-card:active { transform: translate(3px, 3px) scale(0.98); }
        .er-action-card:focus-visible { outline: none; box-shadow: var(--shadow-focus); }

        .er-action-card--butter { background: var(--panel-butter); }
        .er-action-card--sky    { background: var(--panel-sky); }
        .er-action-card--peach  { background: var(--panel-peach); }

        .er-action-card-eyebrow { color: var(--ink-4) !important; margin: 0; }

        .er-action-card-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.15;
          color: var(--ink);
          margin: 0;
        }

        .er-action-card-desc {
          font-family: var(--font-body);
          font-size: 16px;
          line-height: 1.55;
          color: var(--ink-3);
          margin: 0;
          flex: 1;
        }

        .er-action-card-cta {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink);
          margin-top: 8px;
        }

        /* ─── FOOTER ─── */
        .er-footer {
          width: 100%;
          padding: 24px clamp(24px, 5vw, 64px) 48px;
          border-top: 1px solid var(--mist);
        }

        .er-footer-line {
          max-width: 1140px;
          margin: 0 auto;
          font-family: var(--font-body);
          font-size: 12px;
          letter-spacing: 0.04em;
          color: var(--ink-4);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .er-footer-link {
          color: var(--ink);
          text-decoration: none;
          border-bottom: 1px solid var(--mist);
          transition: border-color 200ms ease, color 200ms ease;
        }

        .er-footer-link:hover {
          color: var(--brand-red);
          border-bottom-color: var(--brand-red);
        }
      `}</style>
    </main>
  );
}
