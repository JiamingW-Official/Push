"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Global error boundary — renders when an unhandled exception bubbles up from a
 * route. Client component; must not throw synchronously.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
     
    console.error("[push] unhandled route error", error);
  }, [error]);

  return (
    <main className="err-wrap" role="alert" aria-labelledby="err-h">
      <div className="err-inner">
        <div className="err-top">
          <span className="err-eyebrow">Error · Runtime</span>
          <span className="err-dot" aria-hidden="true" />
          <span className="err-status">Something broke on our side</span>
        </div>

        <h1 id="err-h" className="err-h">
          <span className="err-h-pre">ConversionOracle&trade;</span>
          <br />
          <em className="err-h-em">didn&apos;t see this one coming.</em>
        </h1>

        <p className="err-sub">
          A route threw an unhandled exception. No customer was mis-verified, no
          payout triggered. Push Ops was notified. Try the action below — or
          head back home.
        </p>

        {error?.digest ? (
          <p className="err-digest">
            <span className="err-digest-label">Reference</span>
            <code className="err-digest-code">{error.digest}</code>
          </p>
        ) : null}

        <div className="err-actions">
          <button
            type="button"
            className="err-btn-fill"
            onClick={() => reset()}
          >
            Retry this page
          </button>
          <Link href="/" className="err-btn-outline">
            ← Back to home
          </Link>
        </div>

        <div className="err-footer">
          <span>Push · Vertical AI for Local Commerce</span>
          <a href="mailto:ops@push.nyc" className="err-mail">
            Report this issue
          </a>
        </div>
      </div>

      <style>{`
        .err-wrap {
          min-height: calc(100svh - 56px);
          background: var(--surface, #f5f2ec);
          padding: clamp(48px, 10vw, 120px) 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .err-inner {
          max-width: 720px;
          width: 100%;
        }
        .err-top {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'CS Genio Mono', 'SF Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--primary, #c1121f);
          margin-bottom: 32px;
        }
        .err-dot {
          width: 6px;
          height: 6px;
          background: var(--primary, #c1121f);
          border-radius: 0;
          display: inline-block;
          animation: err-pulse 1.6s ease-in-out infinite;
        }
        @keyframes err-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .err-status {
          color: rgba(0, 48, 73, 0.55);
        }
        .err-h {
          font-family: 'Darky', sans-serif;
          font-size: clamp(36px, 6vw, 80px);
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 1;
          color: var(--dark, #003049);
          margin: 0 0 24px;
        }
        .err-h-pre { font-weight: 300; color: rgba(0, 48, 73, 0.42); }
        .err-h-em { font-style: normal; color: var(--primary, #c1121f); }
        .err-sub {
          font-family: 'CS Genio Mono', 'SF Mono', monospace;
          font-size: 14px;
          line-height: 1.65;
          color: rgba(0, 48, 73, 0.65);
          max-width: 560px;
          margin: 0 0 24px;
        }
        .err-digest {
          font-family: 'CS Genio Mono', 'SF Mono', monospace;
          font-size: 11px;
          margin: 0 0 32px;
          padding: 10px 14px;
          background: rgba(0, 48, 73, 0.04);
          border-left: 3px solid var(--champagne, #c9a96e);
          color: rgba(0, 48, 73, 0.7);
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        .err-digest-label {
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--champagne, #c9a96e);
        }
        .err-digest-code {
          font-size: 12px;
          font-family: inherit;
        }
        .err-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .err-btn-fill {
          font-family: 'CS Genio Mono', 'SF Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 12px 20px;
          background: var(--primary, #c1121f);
          color: #ffffff;
          border: 1px solid var(--primary, #c1121f);
          border-radius: 0;
          cursor: pointer;
          transition: background 200ms ease;
        }
        .err-btn-fill:hover { background: var(--accent, #780000); }
        .err-btn-outline {
          font-family: 'CS Genio Mono', 'SF Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 12px 20px;
          background: transparent;
          color: var(--dark, #003049);
          border: 1px solid var(--dark, #003049);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: background 200ms ease, color 200ms ease;
        }
        .err-btn-outline:hover {
          background: var(--dark, #003049);
          color: #ffffff;
        }
        .err-footer {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 48, 73, 0.08);
          font-family: 'CS Genio Mono', 'SF Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(0, 48, 73, 0.35);
        }
        .err-mail {
          color: var(--dark, #003049);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 200ms ease;
        }
        .err-mail:hover { border-bottom-color: var(--primary, #c1121f); color: var(--primary, #c1121f); }
      `}</style>
    </main>
  );
}
