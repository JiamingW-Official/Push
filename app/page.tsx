"use client";

import { useEffect, useRef, useState } from "react";
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
      <p className="hp-submit-confirm" role="status" aria-live="polite">
        You&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="hp-newsletter-form"
      aria-label="Newsletter sign-up"
    >
      <label htmlFor="hp-newsletter-email" className="hp-visually-hidden">
        Email address
      </label>
      <input
        id="hp-newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        autoComplete="email"
        className="hp-newsletter-input"
      />
      <button type="submit" className="btn-ink click-shift">
        Join the signal
      </button>
    </form>
  );
}

/* ── Reveal-on-scroll hook — IntersectionObserver, a11y safe ── */
function useRevealOnScroll() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    root
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ── Page component ─────────────────────────────────────────── */
export default function HomePage() {
  const rootRef = useRevealOnScroll();

  return (
    <div className="hp-root" id="main-content" ref={rootRef}>
      <Header />

      <div className="hp-panels">
        {/* ═══════════════════════════════════════════════════════
            PANEL 1 — HERO  ·  (WELCOME)
            Full-bleed dark editorial hero.
            Magvix Hero clamp(64,9vw,160) — corner-anchored bottom-left.
            ≤1 liquid-glass tile (top-right) + dual CTA.
            ═══════════════════════════════════════════════════════ */}
        <section className="hp-hero" aria-labelledby="hp-hero-title">
          <div className="hp-hero-watermark" aria-hidden="true">
            PUSH
          </div>

          {/* Liquid-glass stat tile (≤1 per panel) */}
          <div className="hp-hero-stat-tile lg-surface--dark" data-reveal>
            <span className="hp-hero-stat-num">1.4M</span>
            <span className="hp-hero-stat-label">(VERIFIED SCANS)</span>
          </div>

          {/* Bottom-left content block — STRICT corner anchor */}
          <div className="hp-hero-content" data-reveal>
            <p className="hp-hero-eyebrow">(WELCOME) · NYC LOCAL</p>

            <h1 id="hp-hero-title" className="hp-hero-title">
              Pay per
              <br />
              walk-in.
            </h1>

            <div className="hp-hero-sub-wrap">
              <p className="hp-hero-sub">
                Push connects NYC local businesses with neighborhood creators.
                You pay only for verified store visits — not impressions, not
                reach.
              </p>
            </div>

            {/* Dual audience CTA — For Merchants (primary) + For Creators (ghost) */}
            <div className="hp-hero-ctas">
              <Link
                href="/for-merchants"
                className="btn-primary click-shift"
                aria-label="For merchants — get started free"
              >
                For Merchants
              </Link>
              <Link
                href="/for-creators"
                className="btn-ghost click-shift hp-hero-btn-ghost"
                aria-label="For creators — earn per verified visit"
              >
                For Creators
              </Link>
            </div>
          </div>
        </section>

        {/* ── Magvix Italic Signature Divider (between panels, ≤2 per page) ── */}
        <div className="hp-divider" aria-hidden="true">
          <span className="hp-divider-text">
            Posted&nbsp;·&nbsp;Scanned&nbsp;·&nbsp;Verified&nbsp;·
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════════
            PANEL 2 — WHO IT'S FOR  ·  Two-pathway router (warm tone)
            Image-first photo card (≤1 per panel) + dual tile router.
            ═══════════════════════════════════════════════════════ */}
        <section
          className="candy-panel hp-adventure"
          aria-labelledby="hp-adventure-h"
        >
          <div className="hp-section-head" data-reveal>
            <p className="eyebrow hp-adventure-eyebrow">(WHO IT&rsquo;S FOR)</p>
            <h2 id="hp-adventure-h" className="hp-section-h">
              Two audiences.
              <br />
              One physical signal.
            </h2>
            <p className="hp-italic-quote">
              <em>&ldquo;The block is the algorithm.&rdquo;</em>
            </p>
          </div>

          <div className="hp-adventure-grid">
            {/* Merchants: dark ink tile */}
            <Link
              href="/for-merchants"
              className="hp-adventure-tile hp-adventure-tile--ink click-shift"
              data-reveal
            >
              <div>
                <p className="hp-tile-eyebrow-snow">(FOR MERCHANTS)</p>
                <h3 className="hp-tile-h2-snow">
                  Pay only
                  <br />
                  for the
                  <br />
                  walk-in.
                </h3>
                <p className="hp-tile-body-snow">
                  No impressions. No reach. You pay exactly once — when a
                  verified creator scan converts to a real store visit.
                </p>
              </div>
              <span className="hp-tile-cta-snow">See merchant plans →</span>
            </Link>

            {/* Creators: warm tile with photo card overlay (image-first pattern) */}
            <Link
              href="/for-creators"
              className="hp-adventure-tile hp-adventure-tile--warm click-shift"
              data-reveal
            >
              <div>
                <p className="hp-tile-eyebrow-ink">(FOR CREATORS)</p>
                <h3 className="hp-tile-h2-ink">
                  Perform.
                  <br />
                  Get paid.
                  <br />
                  Repeat.
                </h3>
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
            PANEL 3 — WHY PUSH  ·  Proof numbers (cool / dark)
            8+4 grid · ≤1 Champagne ceremonial accent.
            ═══════════════════════════════════════════════════════ */}
        <section className="candy-panel hp-proof" aria-labelledby="hp-proof-h">
          <p className="eyebrow hp-section-eyebrow" data-reveal>
            (WHY PUSH)
          </p>

          <div className="hp-proof-grid">
            {/* Left: giant KPI with Champagne accent (≤1 ceremonial / page) */}
            <div className="hp-proof-left" data-reveal>
              <p className="hp-kpi-num">
                1.4M<span className="hp-kpi-accent">+</span>
              </p>
              <p className="hp-kpi-label">(VERIFIED WALK-INS TO DATE)</p>
            </div>

            {/* Right: heading + secondary stats */}
            <div className="hp-proof-right" data-reveal>
              <h2 id="hp-proof-h" className="hp-proof-heading">
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

        {/* ── Magvix Italic Signature Divider ── */}
        <div className="hp-divider" aria-hidden="true">
          <span className="hp-divider-text">
            End of campaign&nbsp;·&nbsp;Fin&nbsp;·
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════════
            PANEL 4 — HOW IT WORKS  ·  Surface-2 (warm)
            Numbered editorial rows + ≤1 Editorial Pink moment.
            ═══════════════════════════════════════════════════════ */}
        <section className="hp-how" aria-labelledby="hp-how-h">
          <div className="hp-section-head" data-reveal>
            <p className="eyebrow hp-section-eyebrow">(GET STARTED)</p>
            <h2 id="hp-how-h" className="hp-how-heading">
              Three steps
              <br />
              to a verified visit.
            </h2>
          </div>

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
                data-reveal
              >
                <span className="hp-how-num">{item.n}</span>
                <h3 className="hp-how-step-title">{item.title}</h3>
                <p className="hp-how-step-body">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Editorial Pink stamp — single moment per panel (≤1 per page) */}
          <p className="hp-how-stamp" aria-hidden="true">
            <em>Posted &amp; verified.</em>
          </p>

          <div className="hp-how-ctas" data-reveal>
            <Link href="/for-merchants" className="btn-primary click-shift">
              For Merchants
            </Link>
            <Link href="/for-creators" className="btn-ghost click-shift">
              For Creators
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PANEL 5 — TICKET PANEL · GA Orange (≤1 per page)
            Newsletter sign-up. Marketing-only.
            ═══════════════════════════════════════════════════════ */}
        <div
          className="ticket-panel hp-ticket"
          role="complementary"
          aria-labelledby="hp-ticket-h"
          data-reveal
        >
          <div className="hp-grommet hp-grommet--tl" aria-hidden="true" />
          <div className="hp-grommet hp-grommet--tr" aria-hidden="true" />
          <div className="hp-grommet hp-grommet--bl" aria-hidden="true" />
          <div className="hp-grommet hp-grommet--br" aria-hidden="true" />

          <div className="hp-ticket-inner">
            <h2 id="hp-ticket-h" className="hp-ticket-title">
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
