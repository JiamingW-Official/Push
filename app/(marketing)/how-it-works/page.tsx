/* ============================================================
   /how-it-works — 4-step explainer. v3 (2026-05-08)
   Ink accent · 1 hero + 4 vertical step cards (with arrow connectors)
   + creator-side mini-flow + close CTA.
   ============================================================ */

import Link from "next/link";
import {
  Megaphone,
  UserCheck,
  Camera,
  ScanLine,
  ShieldCheck,
  DollarSign,
  ArrowDown,
} from "lucide-react";
import "../_styles/mkt.css";
import "./how-it-works.css";

export default function HowItWorksPage() {
  return (
    <main className="mkt-page mkt-page--ink hiw-page" aria-label="How it works">
      <header className="mkt-hero">
        <p className="mkt-hero__eyebrow">How it works · 4 steps</p>
        <h1 className="mkt-hero__title">From poster to verified visit.</h1>
        <p className="mkt-hero__sub">
          Push is the only platform that pays creators for physical foot
          traffic, not impressions. Here&apos;s the loop, end-to-end.
        </p>
      </header>

      {/* ── 4-step vertical timeline · merchant + creator + verify + paid ── */}
      <section className="mkt-section">
        <div className="hiw-flow">
          <article className="mkt-panel mkt-panel--ink hiw-step">
            <span className="hiw-step__num">01</span>
            <Megaphone size={22} strokeWidth={1.75} />
            <p className="mkt-panel__eyebrow">Merchant</p>
            <h3 className="mkt-panel__title">Brief a campaign</h3>
            <p className="mkt-panel__body">
              Set deliverables (3 frames + post), tier requirement (Operator+),
              base pay ($30) + commission (8%). Push generates QR posters tied
              to each accepted creator.
            </p>
          </article>

          <span className="hiw-arrow" aria-hidden>
            <ArrowDown size={20} />
          </span>

          <article className="mkt-panel hiw-step">
            <span className="hiw-step__num">02</span>
            <UserCheck size={22} strokeWidth={1.75} />
            <p className="mkt-panel__eyebrow">Creator</p>
            <h3 className="mkt-panel__title">Apply &amp; get matched</h3>
            <p className="mkt-panel__body">
              Tier-eligible NYC creators see the gig in Discover. Apply with 1
              tap. Merchant accepts 2-3 from match-scored applicants.
            </p>
          </article>

          <span className="hiw-arrow" aria-hidden>
            <ArrowDown size={20} />
          </span>

          <article className="mkt-panel hiw-step">
            <span className="hiw-step__num">03</span>
            <Camera size={22} strokeWidth={1.75} />
            <p className="mkt-panel__eyebrow">On site</p>
            <h3 className="mkt-panel__title">Shoot · post · place poster</h3>
            <p className="mkt-panel__body">
              Creator visits the merchant, captures content, posts with merchant
              tag + disclosure. Drops the QR poster at the storefront for fans
              to scan.
            </p>
          </article>

          <span className="hiw-arrow" aria-hidden>
            <ArrowDown size={20} />
          </span>

          <article className="mkt-panel mkt-panel--orange hiw-step">
            <span className="hiw-step__num">04</span>
            <ScanLine size={22} strokeWidth={1.75} />
            <p className="mkt-panel__eyebrow">Verify · attribute · pay</p>
            <h3 className="mkt-panel__title">QR scan = verified visit</h3>
            <p className="mkt-panel__body">
              Fans scan the poster IN STORE. AI verifies geo + time + fraud
              signals. Merchant pays only for verified visits. Creator paid T+1
              next business day.
            </p>
          </article>
        </div>
      </section>

      {/* ── 2-up trust + payout proof ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">The unique part</p>
          <h2 className="mkt-section__title">Why physical attribution wins.</h2>
        </div>
        <div className="mkt-grid-2">
          <article className="mkt-panel">
            <ShieldCheck size={20} strokeWidth={1.75} />
            <p className="mkt-panel__eyebrow">5-layer verification</p>
            <h3 className="mkt-panel__title">
              Not just &ldquo;they scanned&rdquo;
            </h3>
            <p className="mkt-panel__body">
              Every scan goes through geo, time-of-day, fraud-signal, repeat,
              and AI-Vision OCR checks. Verified visits {"≠"} raw scans.
            </p>
            <Link href="/trust" className="hiw-link">
              Read the trust report →
            </Link>
          </article>
          <article className="mkt-panel mkt-panel--champagne">
            <DollarSign size={20} strokeWidth={1.75} />
            <p className="mkt-panel__eyebrow">T+1 payouts · no retention</p>
            <h3 className="mkt-panel__title">Creators paid the next day</h3>
            <p className="mkt-panel__body">
              Each verified visit fires a Stripe payout to the creator. No
              hidden fees, no minimums, no retention.
            </p>
          </article>
        </div>
      </section>

      {/* ── Final CTA · 2 buttons (creator + merchant) ── */}
      <section className="mkt-section">
        <div className="mkt-panel mkt-panel--ink">
          <p className="mkt-panel__eyebrow">Ready?</p>
          <h2 className="mkt-panel__title">Pick your role.</h2>
          <div className="mkt-hero__cta-row" style={{ marginTop: 16 }}>
            <Link href="/creator/signup" className="mkt-btn mkt-btn--accent">
              I&apos;m a creator →
            </Link>
            <Link href="/merchant/signup" className="mkt-btn mkt-btn--ghost">
              I&apos;m a merchant →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
