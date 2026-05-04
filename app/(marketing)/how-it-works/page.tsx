// v11 How It Works — 4-panel Marketing register
// Structure: Hero → Merchant Steps → Sig Divider → Creator Steps → Trust Panel
// Spec: § 2 color tokens, § 3 type scale, § 5 grid, § 6 negative-space, § 9 buttons

import type { Metadata } from "next";
import Link from "next/link";
import "./how-it-works.css";

export const metadata: Metadata = {
  title: "How Push Works — Pay Per Verified Visit",
  description:
    "Posters meet performance. QR attribution, real-time scan tracking, and verified payouts — built for creators and merchants who demand proof.",
};

/* ── Page ─────────────────────────────────────────────────── */
export default function HowItWorksPage() {
  return (
    <main className="hiw-root">
      {/* ═══════════════════════════════════════════════════════
          PANEL 1 — HERO
          bg: var(--surface) warm ivory
          H1 bottom-left anchored, Darky Display, dual CTA
          ═══════════════════════════════════════════════════════ */}
      <section className="hiw-hero" aria-labelledby="hiw-h1">
        {/* Ghost watermark numeral */}
        <span className="hiw-hero-watermark" aria-hidden="true">
          1
        </span>

        <div className="hiw-hero-inner">
          {/* Bottom-left anchored content block */}
          <div className="hiw-hero-content">
            {/* (HOW·IT·WORKS) eyebrow — § 8.4 mono 12px parenthetical */}
            <p className="eyebrow hiw-hero-eyebrow">(HOW·IT·WORKS)</p>

            {/* H1 — Darky Display clamp(40,5vw,72) 800 bottom-left (§ 3.1 + § 7.1) */}
            <h1 id="hiw-h1" className="hiw-hero-h1">
              Posters meet
              <br />
              performance.
            </h1>

            {/* Subtitle — 18px body (§ 3.1) */}
            <p className="hiw-hero-sub">
              A creator posts a real recommendation. A customer walks in and
              scans. Push verifies. The merchant pays only for confirmed visits.
            </p>

            {/* Dual CTA row — gap 16px desktop, 12px mobile (§ 6 + § 9) */}
            <div className="hiw-hero-cta-row">
              <Link href="/for-creators" className="btn-primary click-shift">
                For Creators
              </Link>
              <Link href="/for-merchants" className="btn-secondary click-shift">
                For Merchants
              </Link>
            </div>
          </div>

          {/* Right — floating liquid-glass badge */}
          <aside
            className="lg-surface--badge hiw-hero-badge"
            aria-label="100% verified visits"
          >
            <div className="hiw-hero-badge-num">100%</div>
            <p className="eyebrow hiw-hero-badge-label">VERIFIED</p>
          </aside>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PANEL 2 — MERCHANT 3-STEP FLOW
          bg: var(--surface-2), H2 top-left, 3 step cards in row
          Liquid-glass QR Attribution tile over step 3
          ═══════════════════════════════════════════════════════ */}
      <section className="hiw-merchant" aria-labelledby="hiw-merchant-h2">
        <div className="hiw-section-inner">
          {/* Section eyebrow */}
          <p className="eyebrow hiw-section-eyebrow">(FOR MERCHANTS)</p>

          {/* H2 top-left — Darky 40px 800 (§ 3.1) */}
          <h2 id="hiw-merchant-h2" className="hiw-section-h2">
            For Merchants
          </h2>

          {/* 3 step cards row */}
          <div className="hiw-step-row">
            {/* Step 1 */}
            <div className="hiw-step-card click-shift" tabIndex={0}>
              <div
                className="hiw-step-num hiw-step-num--red"
                aria-hidden="true"
              >
                01
              </div>
              <h3 className="hiw-step-title">List your venue.</h3>
              <p className="hiw-step-body">
                Set a per-visit rate, define your campaign zone, and go live in
                minutes. No subscription, no setup fee.
              </p>
              <p className="eyebrow hiw-step-detail">
                Real listing · 10 min setup · No minimum spend
              </p>
            </div>

            {/* Step 2 */}
            <div className="hiw-step-card click-shift" tabIndex={0}>
              <div
                className="hiw-step-num hiw-step-num--red"
                aria-hidden="true"
              >
                02
              </div>
              <h3 className="hiw-step-title">Creators post in the wild.</h3>
              <p className="hiw-step-body">
                Push matches you with verified local creators who already visit
                your neighborhood. They post, QR posters go up.
              </p>
              <p className="eyebrow hiw-step-detail">
                Verified locals · No brand brief · Organic voice
              </p>
            </div>

            {/* Step 3 — liquid-glass QR Attribution tile floats over this card */}
            <div
              className="hiw-step-card hiw-step-card--qr click-shift"
              tabIndex={0}
            >
              <div
                className="hiw-step-num hiw-step-num--red"
                aria-hidden="true"
              >
                03
              </div>
              <h3 className="hiw-step-title">Pay for verified visits only.</h3>
              <p className="hiw-step-body">
                Customers scan QR at the door. GPS + timestamp verification
                clears in 72 hours. Invoice auto-generated.
              </p>
              <p className="eyebrow hiw-step-detail">
                72h oracle · GPS dwell · Stripe invoice
              </p>

              {/* ≤1 liquid-glass tile per panel (§ 8.5) — QR Attribution */}
              <aside
                className="lg-surface hiw-qr-glass"
                aria-label="Real-time scan tracking"
              >
                <div className="hiw-qr-glass-dot" aria-hidden="true" />
                <div className="hiw-qr-glass-content">
                  <p className="hiw-qr-glass-label">QR Attribution</p>
                  <p className="hiw-qr-glass-stat">Real-time scan tracking</p>
                  <p className="hiw-qr-glass-sub">
                    GPS · Timestamp · Venue signal
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MAGVIX ITALIC SIGNATURE DIVIDER (§ 8.6)
          Centered, ≤2 per page, 28-40px italic, no hover
          ═══════════════════════════════════════════════════════ */}
      <div className="hiw-sig-wrap" aria-hidden="true">
        <span className="sig-divider">Posted · Scanned · Verified ·</span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          PANEL 3 — CREATOR 3-STEP FLOW
          bg: var(--surface) warm ivory
          Step numbers in Champagne, photo-card placeholders 4:5
          ═══════════════════════════════════════════════════════ */}
      <section className="hiw-creator" aria-labelledby="hiw-creator-h2">
        <div className="hiw-section-inner">
          <p className="eyebrow hiw-section-eyebrow">(FOR CREATORS)</p>

          <h2 id="hiw-creator-h2" className="hiw-section-h2">
            For Creators
          </h2>

          <div className="hiw-step-row">
            {/* Creator Step 1 — Apply */}
            <div className="hiw-creator-card click-shift" tabIndex={0}>
              {/* Photo card 4:5 placeholder with gradient overlay */}
              <div
                className="hiw-photo-card"
                role="img"
                aria-label="Creator applying to Push — filling out neighborhood and visit history"
              >
                <div className="hiw-photo-placeholder hiw-photo-placeholder--apply">
                  <span className="hiw-photo-label">Apply</span>
                </div>
                {/* Bottom gradient overlay (§ 8.7 Photo Card) */}
                <div className="hiw-photo-overlay">
                  <p className="hiw-photo-meta">
                    Visit history · Not follower count
                  </p>
                </div>
              </div>

              <div className="hiw-creator-card-body">
                <div
                  className="hiw-step-num hiw-step-num--champagne"
                  aria-hidden="true"
                >
                  01
                </div>
                <h3 className="hiw-step-title">Apply.</h3>
                <p className="hiw-step-body">
                  Apply using your visit history, not your follower count. Push
                  scores your local credibility — 48h decision.
                </p>
              </div>
            </div>

            {/* Creator Step 2 — Post */}
            <div className="hiw-creator-card click-shift" tabIndex={0}>
              <div
                className="hiw-photo-card"
                role="img"
                aria-label="Creator posting authentic neighborhood content to their social story"
              >
                <div className="hiw-photo-placeholder hiw-photo-placeholder--post">
                  <span className="hiw-photo-label">Post</span>
                </div>
                <div className="hiw-photo-overlay">
                  <p className="hiw-photo-meta">Your voice · No brand brief</p>
                </div>
              </div>

              <div className="hiw-creator-card-body">
                <div
                  className="hiw-step-num hiw-step-num--champagne"
                  aria-hidden="true"
                >
                  02
                </div>
                <h3 className="hiw-step-title">Post.</h3>
                <p className="hiw-step-body">
                  Visit the venue, post in your own voice, and include the
                  campaign QR. No script, no brand guidelines.
                </p>
              </div>
            </div>

            {/* Creator Step 3 — Earn */}
            <div className="hiw-creator-card click-shift" tabIndex={0}>
              <div
                className="hiw-photo-card"
                role="img"
                aria-label="Creator checking Stripe payout dashboard on Friday"
              >
                <div className="hiw-photo-placeholder hiw-photo-placeholder--earn">
                  <span className="hiw-photo-label">Earn</span>
                </div>
                <div className="hiw-photo-overlay">
                  <p className="hiw-photo-meta">
                    Friday Stripe payout · Per scan
                  </p>
                </div>
              </div>

              <div className="hiw-creator-card-body">
                <div
                  className="hiw-step-num hiw-step-num--champagne"
                  aria-hidden="true"
                >
                  03
                </div>
                <h3 className="hiw-step-title">Earn.</h3>
                <p className="hiw-step-body">
                  Every verified scan you drive adds to your Friday Stripe
                  payout. See exact scan count in real time.
                </p>
              </div>
            </div>
          </div>

          {/* Creator CTA */}
          <div className="hiw-creator-cta">
            <Link href="/for-creators" className="btn-primary click-shift">
              Apply as Creator
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PANEL 4 — TRUST + ATTRIBUTION (dark ink)
          bg: var(--ink), H2 in Snow, 3 KPI tiles, eyebrow in ink-3
          ═══════════════════════════════════════════════════════ */}
      <section className="hiw-trust" aria-labelledby="hiw-trust-h2">
        <div className="hiw-section-inner">
          <p className="eyebrow hiw-trust-eyebrow">(VERIFICATION ENGINE)</p>

          {/* H2 top-left in Snow (§ 7.1) */}
          <h2 id="hiw-trust-h2" className="hiw-trust-h2">
            Push verification engine.
          </h2>

          {/* 3 KPI stat tiles — Darky clamp(40,5vw,72) 800 Snow */}
          <div className="hiw-kpi-row" role="list">
            <div className="hiw-kpi-tile" role="listitem">
              <p className="eyebrow hiw-trust-eyebrow">QR SCAN RATE</p>
              <div
                className="hiw-kpi-num"
                aria-label="100 percent QR scan rate"
              >
                100%
              </div>
              <p className="hiw-kpi-label">
                Every payout tied to a QR scan at the venue door. No scan, no
                payment.
              </p>
            </div>

            <div className="hiw-kpi-tile" role="listitem">
              <p className="eyebrow hiw-trust-eyebrow">FRAUD DETECTION</p>
              <div className="hiw-kpi-num" aria-label="Zero false positives">
                0
              </div>
              <p className="hiw-kpi-label">
                GPS dwell + timestamp match filters out sidewalk scans and
                replay attacks before the oracle clears any visit.
              </p>
            </div>

            <div className="hiw-kpi-tile" role="listitem">
              <p className="eyebrow hiw-trust-eyebrow">PAYOUT ACCURACY</p>
              <div className="hiw-kpi-num" aria-label="72 hour oracle window">
                72h
              </div>
              <p className="hiw-kpi-label">
                Oracle window closes in 72 hours. Creator receives exact scan
                count; merchant receives auto-generated invoice.
              </p>
            </div>
          </div>

          {/* Horizontal rule + merchant CTA */}
          <div className="hiw-trust-footer">
            <p className="hiw-trust-tagline">
              The only pay-per-visit platform built on physical-world proof.
            </p>
            <Link href="/for-merchants" className="btn-ink click-shift">
              List your venue
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
