"use client";

import { useEffect, useState } from "react";
import "./press.css";

/* ─── Data ─────────────────────────────────────────────────────
   Pre-pilot honesty: no fabricated press clips, no invented quotes.
   Numbers and dates are the ones we have on paper.
   ────────────────────────────────────────────────────────────── */

const COMPANY_FACTS: { label: string; value: string; sub?: string }[] = [
  { label: "Company", value: "Push", sub: "Push Labs Inc." },
  { label: "Founded", value: "2025", sub: "New York City" },
  {
    label: "Headquarters",
    value: "Lower Manhattan",
    sub: "Mott Street, 10013",
  },
  { label: "Team size", value: "5", sub: "no titles, one shared doc" },
  {
    label: "Pilot launch",
    value: "June 22, 2026",
    sub: "SoHo · Tribeca · Chinatown",
  },
  {
    label: "Pilot scope",
    value: "5 venues · 10 creators",
    sub: "7-block radius",
  },
];

const PRODUCT_FACTS = [
  {
    label: "Model",
    line: "Pay-per-verified-visit",
    body: "Merchants pay only when a creator-attributed customer actually walks into the venue. The QR scan is the conversion event.",
  },
  {
    label: "Creator structure",
    line: "Six-tier ladder",
    body: "Tiers are awarded on verified visits, not follower count. Movement between tiers is tracked monthly.",
  },
  {
    label: "Custody",
    line: "Stripe Connect",
    body: "All funds sit in segregated Stripe Connect accounts. Push initiates transfers; Stripe moves money. We are not a money transmitter.",
  },
  {
    label: "Footprint",
    line: "SoHo · Tribeca · Chinatown",
    body: "Pilot is a seven-block walking corridor in Lower Manhattan. We are not citywide. We are not multi-borough. Yet.",
  },
];

const FOUNDER = {
  name: "Jiaming Wang",
  role: "Founder",
  initials: "JW",
  bio: "Mott Street-native. Watched the family restaurant lose $800/month on Instagram ads with nothing to show for it on Tuesday night. Started Push at the door, not in a deck — the first version was a taped-up QR on Doyers Street and a spreadsheet. Reads every press email himself.",
  email: "jiaming@push.nyc",
};

const ASSETS = [
  {
    id: "wordmark-light",
    name: "Wordmark — Light Background",
    formats: "SVG · PNG · 1× 2× 3×",
    bg: "light" as const,
    type: "wordmark" as const,
  },
  {
    id: "wordmark-dark",
    name: "Wordmark — Dark Background",
    formats: "SVG · PNG · 1× 2× 3×",
    bg: "dark" as const,
    type: "wordmark" as const,
  },
  {
    id: "icon-light",
    name: "App Icon — Light Background",
    formats: "SVG · PNG · 1× 2× 3×",
    bg: "light" as const,
    type: "icon" as const,
  },
  {
    id: "icon-dark",
    name: "App Icon — Dark Background",
    formats: "SVG · PNG · 1× 2× 3×",
    bg: "dark" as const,
    type: "icon" as const,
  },
  {
    id: "mono-black",
    name: "Monochrome — Black",
    formats: "SVG · PNG · 1× 2× 3×",
    bg: "light" as const,
    type: "mono-black" as const,
  },
  {
    id: "mono-white",
    name: "Monochrome — White",
    formats: "SVG · PNG · 1× 2× 3×",
    bg: "dark" as const,
    type: "mono-white" as const,
  },
];

const COLORS = [
  { name: "Flag Red", hex: "#c1121f", usage: "Primary / CTA" },
  { name: "Molten Lava", hex: "#780000", usage: "Hover / Deep Accent" },
  { name: "Pearl Stone", hex: "#f5f2ec", usage: "Background" },
  { name: "Deep Space Blue", hex: "#003049", usage: "Text / Dark Panels" },
  { name: "Steel Blue", hex: "#669bbc", usage: "Info / Links" },
  { name: "Champagne Gold", hex: "#c9a96e", usage: "Premium Identity" },
];

/* ─── Copy Button ────────────────────────────────────────────── */
function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  }

  return (
    <button
      className={`color-copy-btn${copied ? " copied" : ""}`}
      onClick={handleCopy}
      aria-label={`Copy ${text}`}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

/* ─── Logo Preview (visual placeholder until SVG assets land) ── */
function LogoPreview({ type, dark }: { type: string; dark: boolean }) {
  if (type === "wordmark") {
    return (
      <span className={`logo-wordmark-preview${dark ? " on-dark" : ""}`}>
        Push.
      </span>
    );
  }
  if (type === "icon") {
    return <div className="logo-icon-preview">P</div>;
  }
  if (type === "mono-black") {
    return <span className="logo-mono-preview">Push.</span>;
  }
  return <span className="logo-mono-preview on-dark">Push.</span>;
}

/* ─── Scroll Reveal ──────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Page Component ─────────────────────────────────────────── */
export default function PressPage() {
  useScrollReveal();

  return (
    <main className="press-page">
      {/* ═══════════════ 01 — HERO (ink) ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette press-hero-v7"
        aria-labelledby="press-hero-heading"
      >
        <div className="press-container press-hero-inner">
          <div className="press-hero-top reveal">
            <span className="pill-lux" style={{ color: "#fff" }}>
              Pre-pilot · April 2026
            </span>
            <span className="eyebrow-lux" style={{ color: "var(--champagne)" }}>
              Press kit
            </span>
          </div>

          <div
            className="section-marker reveal"
            data-num="01"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Press kit
          </div>

          <h1 id="press-hero-heading" className="press-hero-h1 reveal">
            Nothing to quote
            <span aria-hidden="true" className="press-hero-h1-period">
              .
            </span>
          </h1>
          <div className="display-ghost press-hero-ghost reveal">yet.</div>

          <div className="press-hero-body reveal">
            <p>
              We have not launched yet, so there is no press to quote. The pilot
              opens June 22, 2026, on a seven-block stretch of SoHo, Tribeca,
              and Chinatown. Five venues, ten creators, one operator walking the
              doors with them.
            </p>
            <p className="press-hero-body-muted">
              This page is the press kit before the press — the facts on paper,
              the assets you can actually download, and a direct line to the
              founder. If you&apos;re writing about Push, write to
              jiaming@push.nyc. He answers his own email.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ 02 — FACT SHEET ═══════════════ */}
      <section className="press-section press-facts-v7">
        <div className="press-container">
          <div className="reveal">
            <div className="section-marker" data-num="02">
              Fact sheet
            </div>
            <h2 className="press-section-title">
              The numbers we have.
              <br />
              <span className="display-ghost">
                Not the ones we wish we did.
              </span>
            </h2>
            <p className="press-section-sub">
              Everything below is on paper. We&apos;re pre-pilot — no
              attribution dataset to publish, no merchant testimonials to quote,
              no Series A to announce. When those exist, they&apos;ll be here
              too.
            </p>
          </div>

          {/* Bento — Company facts (4 cards) */}
          <div className="bento-grid press-facts-bento">
            {COMPANY_FACTS.map((fact, i) => (
              <article
                key={fact.label}
                className="card-premium press-fact-card reveal bento-4x1"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="press-fact-label">{fact.label}</span>
                <h3 className="press-fact-value">{fact.value}</h3>
                {fact.sub && <p className="press-fact-sub">{fact.sub}</p>}
              </article>
            ))}
          </div>

          {/* Product facts — long-form bento */}
          <div className="press-product-header reveal">
            <div
              className="section-marker"
              data-num="02·B"
              style={{ marginTop: "clamp(64px, 8vw, 120px)" }}
            >
              What we&apos;re building
            </div>
          </div>
          <div className="bento-grid press-product-bento">
            {PRODUCT_FACTS.map((p, i) => (
              <article
                key={p.label}
                className="card-premium press-product-card reveal bento-6x1"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="press-product-label">{p.label}</span>
                <h3 className="press-product-line">{p.line}</h3>
                <p className="press-product-body">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 03 — FOUNDER ═══════════════ */}
      <section className="press-section press-founder-v7 bg-mesh-editorial">
        <div className="press-container">
          <div className="reveal">
            <div className="section-marker" data-num="03">
              Founder
            </div>
            <h2 className="press-section-title">
              One operator.
              <br />
              <span className="display-ghost">Walks the doors himself.</span>
            </h2>
          </div>

          <article className="card-premium press-founder-card reveal">
            <div className="press-founder-grid">
              <div className="press-founder-portrait" aria-hidden="true">
                <span className="press-founder-initials">
                  {FOUNDER.initials}
                </span>
              </div>
              <div className="press-founder-body">
                <h3 className="press-founder-name">{FOUNDER.name}</h3>
                <p className="press-founder-role">{FOUNDER.role}</p>
                <p className="press-founder-bio">{FOUNDER.bio}</p>
                <a
                  href={`mailto:${FOUNDER.email}`}
                  className="press-founder-email"
                >
                  {FOUNDER.email}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ═══════════════ 04 — BRAND ASSETS ═══════════════ */}
      <section className="press-section press-assets-v7">
        <div className="press-container">
          <div className="reveal">
            <div className="section-marker" data-num="04">
              Brand assets
            </div>
            <h2 className="press-section-title">
              Logo downloads.
              <br />
              <span className="display-ghost">Use them as drawn.</span>
            </h2>
            <p className="press-section-sub">
              Do not modify, recolor, or distort the Push wordmark. Minimum size
              24px in height. If you need a layout we don&apos;t ship, email
              jiaming@push.nyc and we&apos;ll cut it for you.
            </p>
          </div>

          <div className="press-assets-grid reveal">
            {ASSETS.map((asset) => (
              <div
                key={asset.id}
                className={`press-asset-card${asset.bg === "dark" ? " dark-bg" : ""}`}
              >
                <div
                  className={`press-asset-preview${asset.bg === "dark" ? " dark-bg" : ""}`}
                >
                  <LogoPreview type={asset.type} dark={asset.bg === "dark"} />
                </div>
                <div className="press-asset-meta">
                  <span className="press-asset-name">{asset.name}</span>
                  <span className="press-asset-formats">{asset.formats}</span>
                </div>
                <a
                  href={`mailto:jiaming@push.nyc?subject=Press%20asset%3A%20${encodeURIComponent(
                    asset.name,
                  )}`}
                  className="press-asset-dl"
                  aria-label={`Request ${asset.name}`}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 1v7M3 5l3 3 3-3M1 10h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                  Request file
                </a>
              </div>
            ))}
          </div>

          <p className="press-assets-note reveal">
            The press archive zip is being assembled for the pilot launch. Until
            then, request specific files by email and we&apos;ll send them
            within one business day.
          </p>
        </div>
      </section>

      {/* ═══════════════ 05 — COLOR PALETTE ═══════════════ */}
      <section className="press-section press-colors-v7 bg-mesh-editorial">
        <div className="press-container">
          <div className="reveal">
            <div className="section-marker" data-num="05">
              Color palette
            </div>
            <h2 className="press-section-title">
              Six colors.
              <br />
              <span className="display-ghost">No additions.</span>
            </h2>
          </div>

          <div className="color-palette-grid reveal">
            {COLORS.map((c) => (
              <div className="color-swatch-card" key={c.hex}>
                <div
                  className="color-swatch"
                  style={{ background: c.hex }}
                  aria-label={`${c.name} color swatch`}
                />
                <div className="color-swatch-body">
                  <span className="color-swatch-name">{c.name}</span>
                  <span className="color-swatch-hex">{c.hex}</span>
                  <span className="color-swatch-usage">{c.usage}</span>
                  <CopyButton text={c.hex} label="Copy HEX" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 06 — TYPOGRAPHY ═══════════════ */}
      <section className="press-section press-type-v7">
        <div className="press-container">
          <div className="reveal">
            <div className="section-marker" data-num="06">
              Typography
            </div>
            <h2 className="press-section-title">
              Two fonts.
              <br />
              <span className="display-ghost">That&apos;s the system.</span>
            </h2>
          </div>

          <div className="type-showcase reveal">
            <div className="type-panel">
              <div className="type-panel-label">
                Darky — Display &amp; Headline
              </div>
              <div className="type-darky-display">Push.</div>
              <div className="type-darky-weights">
                {[
                  { w: 900, name: "Black", sample: "Verified visits." },
                  { w: 800, name: "ExtraBold", sample: "Lower Manhattan." },
                  { w: 700, name: "Bold", sample: "June 22, 2026" },
                  { w: 600, name: "SemiBold", sample: "Press kit" },
                  { w: 300, name: "Light", sample: "Six-tier creator ladder" },
                  { w: 200, name: "ExtraLight", sample: "Pre-pilot" },
                ].map((row) => (
                  <div className="type-weight-row" key={row.w}>
                    <span
                      className="type-weight-sample"
                      style={{ fontWeight: row.w }}
                    >
                      {row.sample}
                    </span>
                    <span className="type-weight-meta">
                      {row.w} · {row.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="type-panel">
              <div className="type-panel-label">
                CS Genio Mono — Body &amp; UI
              </div>
              <div className="type-mono-display">
                Pay only for
                <br />
                verified visits.
              </div>
              <div className="type-mono-samples">
                {[
                  { sample: "Body — 16px / 1rem / 400", size: 16 },
                  { sample: "SMALL LABEL — 14PX / 700", size: 14 },
                  { sample: "Caption — 12px / 400", size: 12 },
                  { sample: "EYEBROW — 11PX / 700 / 0.08EM", size: 11 },
                ].map((row) => (
                  <div className="type-mono-row" key={row.size}>
                    <span
                      className="type-mono-sample"
                      style={{ fontSize: row.size }}
                    >
                      {row.sample}
                    </span>
                    <span className="type-mono-meta">
                      CS Genio Mono · {row.size}px
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 07 — BOILERPLATE ═══════════════ */}
      <section className="press-section press-boiler-v7">
        <div className="press-container">
          <div className="reveal">
            <div className="section-marker" data-num="07">
              Boilerplate
            </div>
            <h2 className="press-section-title">
              For the bottom of your story.
              <br />
              <span className="display-ghost">Fifty words. Factual.</span>
            </h2>
          </div>

          <article className="card-premium press-boiler-card reveal">
            <p className="press-boiler-text">
              Push is a New York-based local marketing platform that pays
              creators only when an attributed customer walks into a partner
              venue. Founded in 2025 by Jiaming Wang in Lower Manhattan, Push
              opens its pilot June 22, 2026 across SoHo, Tribeca, and Chinatown
              with five merchants and ten creators. Funds custody is handled by
              Stripe Connect.
            </p>
            <CopyButton
              text={
                "Push is a New York-based local marketing platform that pays creators only when an attributed customer walks into a partner venue. Founded in 2025 by Jiaming Wang in Lower Manhattan, Push opens its pilot June 22, 2026 across SoHo, Tribeca, and Chinatown with five merchants and ten creators. Funds custody is handled by Stripe Connect."
              }
              label="Copy boilerplate"
            />
          </article>
        </div>
      </section>

      {/* ═══════════════ 08 — PRESS CONTACT (ink CTA) ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette press-contact-v7"
        aria-labelledby="press-contact-heading"
      >
        <div className="press-container press-contact-inner">
          <div className="reveal">
            <div
              className="section-marker"
              data-num="08"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Press contact
            </div>
            <h2 id="press-contact-heading" className="press-contact-headline">
              <span className="wt-900">Write to the founder.</span>
              <br />
              <span className="wt-200">He reads every email.</span>
            </h2>
            <p className="press-contact-sub">
              Interview requests, embargoed briefings, and asset permissions go
              to one inbox. Average reply time is under 24 hours during business
              days. If it&apos;s urgent, say so in the subject line.
            </p>

            <div className="press-contact-actions">
              <a href="mailto:jiaming@push.nyc" className="press-contact-email">
                jiaming@push.nyc
              </a>
              <span className="divider-lux press-contact-divider">or</span>
              <a
                href="mailto:press@push.nyc"
                className="press-contact-email-alt"
              >
                press@push.nyc
              </a>
            </div>

            <p className="press-contact-foot">
              every email read by hand · 48-hour reply
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
