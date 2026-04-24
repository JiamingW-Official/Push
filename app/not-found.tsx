import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found · Push",
  description:
    "The page you were looking for moved, closed, or never existed. Head back to the Vertical AI for Local Commerce home.",
  robots: { index: false, follow: false },
};

const SUGGESTIONS: { label: string; href: string; desc: string }[] = [
  {
    label: "Start free with Lite",
    href: "/merchant/signup?plan=lite",
    desc: "$0/mo — 1 campaign, 1 creator slot, QR attribution from day one",
  },
  {
    label: "Join the creator network",
    href: "/creator/signup",
    desc: "v6 Community + Studio segments — per-verified-visit payouts via Stripe Connect",
  },
  {
    label: "See verified attribution",
    href: "/trust",
    desc: "FTC §255 disclosure, three-signal verification (QR + receipt + merchant confirm)",
  },
  {
    label: "Pricing",
    href: "/pricing",
    desc: "Lite $0 / Essentials $99 / Pro outcome-based / Advanced $349",
  },
];

export default function NotFound() {
  return (
    <main className="nf-wrap" role="main" aria-labelledby="nf-h">
      <div className="nf-grid">
        <div className="nf-top">
          <span className="nf-eyebrow">Error · 404</span>
          <span className="nf-dot" aria-hidden="true" />
          <span className="nf-status">Page not found</span>
        </div>

        <h1 id="nf-h" className="nf-h">
          <span className="nf-h-pre">This corner of the</span>
          <br />
          <em className="nf-h-em">Customer Acquisition Engine</em>
          <br />
          <span className="nf-h-post">hasn&apos;t been built yet.</span>
        </h1>

        <p className="nf-sub">
          The page you requested moved, closed, or never existed. No walk-in was
          verified — no payout triggered. Try one of the routes below.
        </p>

        <ul className="nf-list">
          {SUGGESTIONS.map((s) => (
            <li key={s.href} className="nf-row">
              <Link href={s.href} className="nf-row-link">
                <span className="nf-row-label">{s.label}</span>
                <span className="nf-row-desc">{s.desc}</span>
                <span className="nf-row-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="nf-footer">
          <Link href="/" className="nf-home">
            ← Back to home
          </Link>
          <span className="nf-meta">
            Push · Vertical AI for Local Commerce · Williamsburg Coffee+
            beachhead
          </span>
        </div>
      </div>

      <style>{`
        .nf-wrap {
          min-height: calc(100svh - 56px);
          background: var(--surface);
          padding: clamp(48px, 10vw, 120px) 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nf-grid {
          max-width: 900px;
          width: 100%;
        }
        .nf-top {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 32px;
        }
        .nf-dot {
          width: 6px;
          height: 6px;
          background: var(--primary);
          border-radius: 50%;
          display: inline-block;
        }
        .nf-status {
          color: rgba(0, 48, 73, 0.55);
        }
        .nf-h {
          font-family: var(--font-display);
          font-size: clamp(40px, 7vw, 96px);
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 0.98;
          color: var(--dark);
          margin: 0 0 24px;
        }
        .nf-h-pre, .nf-h-post {
          font-weight: 300;
          color: rgba(0, 48, 73, 0.42);
        }
        .nf-h-em {
          font-style: normal;
          color: var(--dark);
        }
        .nf-sub {
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.65;
          color: rgba(0, 48, 73, 0.65);
          max-width: 560px;
          margin: 0 0 48px;
        }
        .nf-list {
          list-style: none;
          padding: 0;
          margin: 0 0 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border: 1px solid rgba(0, 48, 73, 0.12);
          background: var(--surface-elevated);
          border-radius: var(--r-xl);
          overflow: hidden;
        }
        .nf-row {
          border-right: 1px solid rgba(0, 48, 73, 0.08);
          border-bottom: 1px solid rgba(0, 48, 73, 0.08);
        }
        .nf-row:nth-child(2n) { border-right: none; }
        .nf-row:nth-last-child(-n+2) { border-bottom: none; }
        .nf-row-link {
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: auto auto;
          padding: 24px 28px;
          text-decoration: none;
          gap: 4px 16px;
          transition: background 200ms ease;
        }
        .nf-row-link:hover {
          background: rgba(193, 18, 31, 0.04);
        }
        .nf-row-link:hover .nf-row-arrow {
          transform: translateX(4px);
          color: var(--primary);
        }
        .nf-row-label {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--dark);
        }
        .nf-row-desc {
          font-family: var(--font-body);
          font-size: 11px;
          line-height: 1.6;
          color: rgba(0, 48, 73, 0.55);
          grid-column: 1 / -1;
        }
        .nf-row-arrow {
          grid-row: 1;
          grid-column: 2;
          font-family: var(--font-body);
          font-size: 16px;
          color: rgba(0, 48, 73, 0.35);
          transition: transform 240ms cubic-bezier(0.22,1,0.36,1), color 200ms ease;
        }
        .nf-footer {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 48, 73, 0.08);
        }
        .nf-home {
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--dark);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 200ms ease, color 200ms ease;
        }
        .nf-home:hover {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .nf-meta {
          font-family: var(--font-body);
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(0, 48, 73, 0.35);
        }
        @media (max-width: 640px) {
          .nf-list { grid-template-columns: 1fr; }
          .nf-row { border-right: none; }
          .nf-row:nth-last-child(2) { border-bottom: 1px solid rgba(0,48,73,0.08); }
        }
      `}</style>
    </main>
  );
}
