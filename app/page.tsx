"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import "./(marketing)/landing.css";

/* ── Newsletter form component ─────────────────────────────── */
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="hp-submit-confirm">
        You&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="hp-newsletter-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="hp-newsletter-input"
      />
      <button type="submit" className="btn-ink click-shift">
        Join the signal
      </button>
    </form>
  );
}

/* ── Page component ─────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="hp-root" id="main-content">
      <Header />

      <div className="hp-panels">
        {/* ═══════════════════════════════════════════════════════
            PANEL 1 — HERO
            Full-viewport ink panel. Title bottom-left anchored.
            Magvix Hero clamp(64px,9vw,160px) — STRICT spec.
            border-radius: 0 — allowed (full-bleed editorial hero).
            ═══════════════════════════════════════════════════════ */}
        <section className="hp-hero" aria-label="Hero">
          {/* Film grain */}
          <div className="hp-hero-grain" aria-hidden="true" />

          {/* Bottom vignette */}
          <div className="hp-hero-vignette" aria-hidden="true" />

          {/* Ghost watermark — Darky 100, opacity 0.05 */}
          <div className="hp-hero-watermark" aria-hidden="true">
            PUSH
          </div>

          {/* Top-right: liquid-glass stat tile */}
          <div className="hp-hero-stat-tile lg-surface--dark">
            <span className="hp-hero-stat-num">1.4M</span>
            <span className="hp-hero-stat-label">(VERIFIED SCANS)</span>
          </div>

          {/* Bottom-left: eyebrow + title + CTAs — STRICTLY bottom-left */}
          <div className="hp-hero-content">
            <p className="hp-hero-eyebrow">(NYC LOCAL)</p>

            {/* Magvix Hero — clamp(64px,9vw,160px), max 1 hero per page */}
            <h1 className="hp-hero-title">
              Pay per
              <br />
              walk-in.
            </h1>

            {/* Subtitle in frosted glass badge */}
            <div className="hp-hero-sub-wrap">
              <p className="hp-hero-sub">
                Push connects NYC local businesses with neighborhood creators.
                You pay only for verified store visits — not impressions, not
                reach.
              </p>
            </div>

            <div className="hp-hero-ctas">
              <Link href="/merchant/signup" className="btn-primary click-shift">
                Get Started Free
              </Link>
              <Link
                href="/for-creators"
                className="btn-ghost click-shift hp-hero-btn-ghost"
              >
                For Creators
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PANEL 2 — TWO-PATHWAY ROUTER · Candy Peach (warm)
            Two full-height tiles: Ink tile (merchants) + glass tile (creators)
            ═══════════════════════════════════════════════════════ */}
        <section
          className="candy-panel hp-adventure"
          aria-label="Choose your path"
        >
          <p className="eyebrow hp-adventure-eyebrow">(TWO WAYS IN)</p>

          <div className="hp-adventure-grid">
            {/* Merchants: dark ink tile */}
            <Link
              href="/for-merchants"
              className="hp-adventure-tile hp-adventure-tile--ink click-shift"
            >
              <div>
                <p className="hp-tile-eyebrow-snow">(FOR MERCHANTS)</p>
                <h2 className="hp-tile-h2-snow">
                  Pay only
                  <br />
                  for the
                  <br />
                  walk-in.
                </h2>
                <p className="hp-tile-body-snow">
                  No impressions. No reach. You pay exactly once — when a
                  verified creator scan converts to a real store visit.
                </p>
              </div>
              <span className="hp-tile-cta-snow">See merchant plans →</span>
            </Link>

            {/* Creators: warm translucent tile */}
            <Link
              href="/for-creators"
              className="hp-adventure-tile hp-adventure-tile--warm click-shift"
            >
              <div>
                <p className="hp-tile-eyebrow-ink">(FOR CREATORS)</p>
                <h2 className="hp-tile-h2-ink">
                  Perform.
                  <br />
                  Get paid.
                  <br />
                  Repeat.
                </h2>
                <p className="hp-tile-body-ink">
                  Post your neighborhood spots. Let your audience discover them.
                  Earn per verified visit — no sponsorship minimum.
                </p>
              </div>
              <span className="hp-tile-cta-ink">Join as creator →</span>
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PANEL 3 — PROOF
            Giant KPI left (8-col) + secondary stats right (4-col)
            ═══════════════════════════════════════════════════════ */}
        <section className="candy-panel hp-proof" aria-label="Proof numbers">
          <p className="eyebrow hp-section-eyebrow">(THE NUMBERS)</p>

          {/* Asymmetric 8+4 grid */}
          <div className="hp-proof-grid">
            {/* Left 8-col: giant KPI */}
            <div className="hp-proof-left">
              {/* Ghost watermark numeral behind KPI */}
              <div className="hp-proof-ghost" aria-hidden="true">
                1.4M
              </div>
              <p className="hp-kpi-num">1.4M+</p>
              <p className="hp-kpi-label">(VERIFIED WALK-INS TO DATE)</p>
            </div>

            {/* Right 4-col: headline + 2 secondary stats */}
            <div className="hp-proof-right">
              <h2 className="hp-proof-heading">
                Physical proof,
                <br />
                not digital
                <br />
                promises.
              </h2>

              <div className="hp-proof-stats">
                {[
                  { num: "87%", label: "(CREATOR RETENTION)" },
                  { num: "$0", label: "(COST PER UNVERIFIED VISIT)" },
                ].map((s) => (
                  <div key={s.num} className="hp-proof-stat">
                    <span className="hp-proof-stat-num">{s.num}</span>
                    <span className="eyebrow hp-proof-stat-label">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PANEL 4 — HOW IT WORKS · Surface-2
            Numbered editorial rows — 3-column grid: number / title / body
            ═══════════════════════════════════════════════════════ */}
        <section className="hp-how" aria-label="How it works">
          <p className="eyebrow hp-section-eyebrow">(HOW IT WORKS)</p>

          <h2 className="hp-how-heading">
            Three steps
            <br />
            to a verified visit.
          </h2>

          <div className="hp-how-rows">
            {[
              {
                n: "01",
                title: "Creator picks up your campaign.",
                body: "A local creator in your neighborhood finds your Push campaign and collects a QR poster — no agency, no retainer, no upfront fee.",
              },
              {
                n: "02",
                title: "Their audience walks through the door.",
                body: "Story is posted, audience scans the QR at your entrance. Our system logs GPS + timestamp. The visit is live in your dashboard within seconds.",
              },
              {
                n: "03",
                title: "You pay per verified visit only.",
                body: "ConversionOracle confirms every scan: GPS dwell + QR match + timestamp. You're billed only for real foot traffic — zero impressions counted.",
              },
            ].map((item, i, arr) => (
              <div
                key={item.n}
                className={`hp-how-row${i < arr.length - 1 ? " hp-how-row--border" : ""}`}
              >
                <span className="hp-how-num">{item.n}</span>
                <h3 className="hp-how-step-title">{item.title}</h3>
                <p className="hp-how-step-body">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="hp-how-ctas">
            <Link href="/merchant/signup" className="btn-primary click-shift">
              Get Started Free
            </Link>
            <Link href="/pricing" className="btn-ghost click-shift">
              See Pricing
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PANEL 5 — TICKET PANEL · GA Orange
            Newsletter sign-up. ≤1 per page. Marketing-only.
            Grommets: 16px circles, 24px inset from corners.
            Perforation: via .ticket-panel::before/after in globals.
            ═══════════════════════════════════════════════════════ */}
        <div className="ticket-panel hp-ticket" role="complementary">
          {/* 4 grommet circles — 16px diameter, 24px inset */}
          <div className="hp-grommet hp-grommet--tl" aria-hidden="true" />
          <div className="hp-grommet hp-grommet--tr" aria-hidden="true" />
          <div className="hp-grommet hp-grommet--bl" aria-hidden="true" />
          <div className="hp-grommet hp-grommet--br" aria-hidden="true" />

          <div className="hp-ticket-inner">
            <h2 className="hp-ticket-title">
              Tune into
              <br />
              the signal.
            </h2>
            <p className="hp-ticket-body">
              Get early access updates, Wave 1 results, and local commerce
              insights — straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
