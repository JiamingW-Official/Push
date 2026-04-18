"use client";

import { useEffect, useState } from "react";
import "./press.css";

/* ─── Data ───────────────────────────────────────────────────── */

const COMPANY_FACTS: { number: string; label: string; accent?: boolean }[] = [
  { number: "2025", label: "Founded in New York" },
  { number: "NYC", label: "Headquarters" },
  { number: "340+", label: "Merchants verified", accent: true },
  { number: "$2M+", label: "Attributed GMV", accent: true },
];

const PRESS_RELEASES = [
  {
    date: "Apr 2026",
    tag: "Product",
    title: "Push Launches Real-Time QR Attribution Engine for NYC Restaurants",
    excerpt:
      "New verification layer gives merchants granular foot-traffic data tied to creator campaigns, closing the loop between social content and in-store revenue.",
    pdf: "#",
  },
  {
    date: "Mar 2026",
    tag: "Growth",
    title: "Push Expands to 340+ Verified Merchants Across Five NYC Boroughs",
    excerpt:
      "From Astoria to Bay Ridge, Push now powers creator marketing for independent restaurants, boutiques, and wellness studios citywide.",
    pdf: "#",
  },
  {
    date: "Feb 2026",
    tag: "Milestone",
    title:
      "$2M in Attributed GMV: Push Creators Drive Measurable Revenue for Local Businesses",
    excerpt:
      "Platform-wide attribution data confirms creator-led campaigns outperform traditional local advertising by a 4:1 ROI ratio on verified visits.",
    pdf: "#",
  },
  {
    date: "Jan 2026",
    tag: "Platform",
    title:
      "Push Introduces 6-Tier Creator Ranking System: From Seed to Partner",
    excerpt:
      "New tier framework rewards creators based on verified attribution performance, replacing follower count as the primary ranking metric.",
    pdf: "#",
  },
  {
    date: "Dec 2025",
    tag: "Community",
    title:
      "Push Hosts First NYC Creator Summit — 200 Creators, 50 Merchants, One Evening",
    excerpt:
      "The inaugural Push Summit connected top-performing creators with local merchants for live campaign pitching and community building.",
    pdf: "#",
  },
  {
    date: "Nov 2025",
    tag: "Partnership",
    title:
      "Push Partners With NYC Small Business Services to Support Independent Retail",
    excerpt:
      "Collaboration brings Push's performance-based marketing model to underserved neighborhood commercial corridors across all five boroughs.",
    pdf: "#",
  },
  {
    date: "Sep 2025",
    tag: "Product",
    title: "Push Creator App Now Available on iOS and Android",
    excerpt:
      "Mobile-first creator dashboard lets influencers discover campaigns, submit content, and track attributed payouts in real time.",
    pdf: "#",
  },
  {
    date: "Jul 2025",
    tag: "Launch",
    title:
      "Push Emerges from Stealth with $1.2M Pre-Seed Round to Reinvent Local Marketing",
    excerpt:
      "Backed by NYC-based operators and angels, Push launches its pay-per-verified-visit platform targeting the $14B local advertising market.",
    pdf: "#",
  },
];

const BRAND_ASSETS = [
  {
    id: "wordmark-light",
    name: "Wordmark — Light Background",
    formats: "SVG · PNG · 1×  2×  3×",
    bg: "light",
    previewType: "wordmark",
    dark: false,
  },
  {
    id: "wordmark-dark",
    name: "Wordmark — Dark Background",
    formats: "SVG · PNG · 1×  2×  3×",
    bg: "dark",
    previewType: "wordmark",
    dark: true,
  },
  {
    id: "icon-light",
    name: "App Icon — Light Background",
    formats: "SVG · PNG · 1×  2×  3×",
    bg: "light",
    previewType: "icon",
    dark: false,
  },
  {
    id: "icon-dark",
    name: "App Icon — Dark Background",
    formats: "SVG · PNG · 1×  2×  3×",
    bg: "dark",
    previewType: "icon",
    dark: true,
  },
  {
    id: "mono-black",
    name: "Monochrome — Black",
    formats: "SVG · PNG · 1×  2×  3×",
    bg: "light",
    previewType: "mono-black",
    dark: false,
  },
  {
    id: "mono-white",
    name: "Monochrome — White",
    formats: "SVG · PNG · 1×  2×  3×",
    bg: "dark",
    previewType: "mono-white",
    dark: true,
  },
];

const BRAND_COLORS = [
  { name: "Flag Red", hex: "#c1121f", usage: "Primary / CTA" },
  { name: "Molten Lava", hex: "#780000", usage: "Hover / Deep Accent" },
  { name: "Pearl Stone", hex: "#f5f2ec", usage: "Background" },
  { name: "Deep Space Blue", hex: "#003049", usage: "Text / Dark Panels" },
  { name: "Steel Blue", hex: "#669bbc", usage: "Info / Links" },
  { name: "Champagne Gold", hex: "#c9a96e", usage: "Premium Identity" },
];

const FOUNDERS = [
  {
    initials: "JW",
    name: "Jiaming Wang",
    title: "Co-Founder & CEO",
    bio: "Jiaming built Push after watching his family's Queens restaurant struggle to compete with chains that had unlimited marketing budgets. A Columbia engineering graduate, he spent two years running growth at a Series B fintech before founding Push in 2025. His conviction: local businesses deserve the same performance-based tools as Fortune 500 brands. Under his leadership, Push has onboarded 340+ verified merchants and built the first QR-based foot-traffic attribution system purpose-built for independent businesses in New York City.",
  },
  {
    initials: "CF",
    name: "Chris Ferrante",
    title: "Co-Founder & CTO",
    bio: "Chris leads product and engineering at Push, having previously built real-time data pipelines at a Bloomberg spin-out. His obsession is closing the attribution gap — proving that a creator's TikTok actually drove someone through the door last Tuesday at 7 pm. He architected Push's anti-fraud verification stack, which cross-validates QR scans against POS timing windows to eliminate bot and replay attacks. Chris holds a BS in Computer Science from NYU and is a founding member of the NYC Tech Founders Council.",
  },
];

const PHOTO_PLACEHOLDERS = [
  { label: "Team — Brooklyn HQ" },
  { label: "NYC Merchant Partners" },
  { label: "Creator Summit 2025" },
  { label: "Attribution Dashboard" },
  { label: "Push App — iOS" },
  { label: "Lower East Side Campaign" },
];

const COVERAGE = [
  {
    quote:
      "Push is rewriting local marketing — performance-based attribution that actually works for the bodega on the corner.",
    source: "TechCrunch",
    date: "Mar 2026",
  },
  {
    quote:
      "The QR system is elegant. Merchants finally have proof that the Instagram post brought in the Tuesday dinner crowd.",
    source: "Fast Company",
    date: "Feb 2026",
  },
  {
    quote:
      "Push may be the first startup to make creator economics work for businesses with five tables and a standing reservation list.",
    source: "New York Magazine",
    date: "Jan 2026",
  },
  {
    quote:
      "A product born from a real problem. Every restaurant owner we spoke to said they'd been waiting for something exactly like this.",
    source: "Gothamist",
    date: "Dec 2025",
  },
  {
    quote:
      "Pay only for verified visits. That three-word pitch is disrupting a $14 billion local advertising industry that hasn't innovated in a decade.",
    source: "Axios New York",
    date: "Nov 2025",
  },
  {
    quote:
      "Push's creator tier system is surprisingly smart — it rewards foot-traffic results, not follower counts. That changes the entire game.",
    source: "The Information",
    date: "Oct 2025",
  },
];

/* ─── Copy Button Component ──────────────────────────────────── */
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

/* ─── Logo Preview ───────────────────────────────────────────── */
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

/* ─── Scroll Reveal Hook ─────────────────────────────────────── */
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
    <main>
      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <section className="press-hero">
        <div className="press-hero-inner">
          <p className="press-hero-eyebrow">
            Push — Media Kit &amp; Press Resources
          </p>
          <h1 className="press-hero-headline">Press.</h1>
          <p className="press-hero-sub">
            Resources for journalists, creators, and partners covering the
            future of local marketing in New York City.
          </p>
        </div>
      </section>

      {/* ── 2. Company Facts ────────────────────────────────── */}
      <section className="press-section">
        <div className="press-container">
          <p className="press-section-label">At a Glance</p>
          <div className="facts-grid reveal reveal-stagger">
            {COMPANY_FACTS.map((f) => (
              <div className="fact-item" key={f.label}>
                <div className="fact-number">
                  {f.accent ? <em>{f.number}</em> : f.number}
                </div>
                <div className="fact-label">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Press Releases ───────────────────────────────── */}
      <section className="press-section press-section-alt">
        <div className="press-container">
          <p className="press-section-label">News &amp; Announcements</p>
          <h2 className="press-section-title">Press Releases</h2>
          <div className="press-timeline">
            {PRESS_RELEASES.map((pr, i) => (
              <article
                className={`press-release-item reveal`}
                style={{ transitionDelay: `${Math.min(i * 40, 200)}ms` }}
                key={pr.title}
              >
                <div className="press-release-date">{pr.date}</div>
                <div className="press-release-content">
                  <span className="press-release-tag">{pr.tag}</span>
                  <h3 className="press-release-title">{pr.title}</h3>
                  <p className="press-release-excerpt">{pr.excerpt}</p>
                </div>
                <div className="press-release-action">
                  <a
                    href={pr.pdf}
                    className="press-dl-link"
                    aria-label={`Download PDF: ${pr.title}`}
                  >
                    <svg
                      width="12"
                      height="12"
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
                    PDF
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Brand Assets ─────────────────────────────────── */}
      <section className="press-section">
        <div className="press-container">
          <p className="press-section-label">Brand Assets</p>
          <div className="brand-assets-header">
            <h2 className="press-section-title" style={{ marginBottom: 0 }}>
              Logo Downloads
            </h2>
            <p className="brand-assets-note">
              Do not modify, recolor, or distort the Push logo. Use only on
              approved backgrounds. Minimum size: 24px height.
            </p>
          </div>
          <div className="brand-assets-grid reveal reveal-stagger">
            {BRAND_ASSETS.map((asset) => (
              <div
                className={`brand-asset-card${asset.dark ? " dark-bg" : ""}`}
                key={asset.id}
              >
                <div
                  className={`brand-asset-preview${asset.dark ? " dark-bg" : ""}`}
                >
                  <LogoPreview type={asset.previewType} dark={asset.dark} />
                </div>
                <div className="brand-asset-meta">
                  <span className="brand-asset-name">{asset.name}</span>
                  <span className="brand-asset-formats">{asset.formats}</span>
                </div>
                <a
                  href="#"
                  className="brand-asset-dl"
                  aria-label={`Download ${asset.name}`}
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
                  Download
                </a>
              </div>
            ))}
          </div>
          <div className="brand-zip-cta">
            <a href="#" className="btn-zip">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 1v9M3.5 6l3.5 4 3.5-4M1 12h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
              Download All Assets (.zip)
            </a>
          </div>
        </div>
      </section>

      {/* ── 5. Color Palette ────────────────────────────────── */}
      <section className="press-section press-section-alt">
        <div className="press-container">
          <p className="press-section-label">Brand Colors</p>
          <h2 className="press-section-title">Color Palette</h2>
          <div className="color-palette-grid reveal reveal-stagger">
            {BRAND_COLORS.map((c) => (
              <div className="color-swatch-card" key={c.hex}>
                <div
                  className="color-swatch"
                  style={{ background: c.hex }}
                  aria-label={`${c.name} color swatch`}
                />
                <div className="color-swatch-body">
                  <span className="color-swatch-name">{c.name}</span>
                  <span className="color-swatch-hex">{c.hex}</span>
                  <CopyButton text={c.hex} label="Copy HEX" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Typography ───────────────────────────────────── */}
      <section className="press-section">
        <div className="press-container">
          <p className="press-section-label">Brand Typography</p>
          <h2 className="press-section-title">Type System</h2>
          <div className="type-showcase reveal">
            {/* Darky Panel */}
            <div className="type-panel">
              <div className="type-panel-label">
                Darky — Display &amp; Headline
              </div>
              <div className="type-darky-display">Push.</div>
              <div className="type-darky-weights">
                {[
                  { w: 900, name: "Black", sample: "Local. Proven." },
                  { w: 800, name: "ExtraBold", sample: "NYC Verified." },
                  { w: 700, name: "Bold", sample: "340+ Merchants" },
                  { w: 600, name: "SemiBold", sample: "Press Resources" },
                  { w: 300, name: "Light", sample: "Editorial partner tier" },
                  { w: 200, name: "ExtraLight", sample: "$2,000,000" },
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

            {/* CS Genio Mono Panel */}
            <div className="type-panel">
              <div className="type-panel-label">
                CS Genio Mono — Body &amp; UI
              </div>
              <div className="type-mono-display">
                Performance-based
                <br />
                local marketing.
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

      {/* ── 7. Photography ──────────────────────────────────── */}
      <section className="press-section press-section-alt">
        <div className="press-container">
          <p className="press-section-label">Photography</p>
          <h2 className="press-section-title">Photo Library</h2>
          <div className="photo-grid reveal reveal-stagger">
            {PHOTO_PLACEHOLDERS.map((p, i) => (
              <div className="photo-grid-item" key={i}>
                <div className="photo-placeholder">
                  <svg
                    className="photo-placeholder-icon"
                    viewBox="0 0 48 48"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="2"
                      y="8"
                      width="44"
                      height="32"
                      rx="0"
                      stroke="#003049"
                      strokeWidth="2"
                    />
                    <circle
                      cx="16"
                      cy="20"
                      r="5"
                      stroke="#003049"
                      strokeWidth="2"
                    />
                    <path
                      d="M2 36l12-12 8 8 8-8 16 16"
                      stroke="#003049"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </svg>
                  <span className="photo-placeholder-label">{p.label}</span>
                </div>
                <div className="photo-overlay">
                  <span className="photo-overlay-caption">{p.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Founder Bios ─────────────────────────────────── */}
      <section className="press-section">
        <div className="press-container">
          <p className="press-section-label">Leadership</p>
          <h2 className="press-section-title">Founders</h2>
          <div className="founder-grid reveal">
            {FOUNDERS.map((f) => (
              <div className="founder-card" key={f.name}>
                <div className="founder-headshot">
                  <span className="founder-headshot-placeholder">
                    {f.initials}
                  </span>
                </div>
                <div className="founder-info">
                  <h3 className="founder-name">{f.name}</h3>
                  <p className="founder-title">{f.title}</p>
                  <p className="founder-bio">{f.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Press Contact ────────────────────────────────── */}
      <section className="press-contact-wrap">
        <div className="press-contact-inner">
          <p className="press-contact-label">Media Inquiries</p>
          <h2 className="press-contact-headline">Talk to us.</h2>
          <p className="press-contact-sub">
            For interview requests, embargoed briefings, and asset permissions,
            reach out directly. We respond within one business day.
          </p>
          <a href="mailto:press@push.nyc" className="press-contact-email">
            press@push.nyc
          </a>
        </div>
      </section>

      {/* ── 10. Coverage ────────────────────────────────────── */}
      <section className="press-section">
        <div className="press-container">
          <p className="press-section-label">In the News</p>
          <h2 className="press-section-title">Coverage</h2>
          <div className="coverage-grid reveal reveal-stagger">
            {COVERAGE.map((c, i) => (
              <div className="coverage-item" key={i}>
                <blockquote className="coverage-quote">{c.quote}</blockquote>
                <div className="coverage-source">
                  <span className="coverage-source-name">{c.source}</span>
                  <span className="coverage-source-dot" aria-hidden="true" />
                  <span className="coverage-source-date">{c.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
