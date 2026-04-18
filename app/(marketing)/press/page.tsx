"use client";

import { useState } from "react";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./press.css";

/* ─── Data ───────────────────────────────────────────────────── */

// v5.1 — Vertical AI for Local Commerce. Numbers are active pilot metrics.
const COMPANY_FACTS: { number: string; label: string; accent?: boolean }[] = [
  { number: "2025", label: "Founded · NYC" },
  { number: "1", label: "Beachhead Vertical" },
  { number: "25", label: "SLR Target · Month 12", accent: true },
  { number: "$0", label: "Pilot Tier Entry Price", accent: true },
];

// v5.1 — one-line fact rows for the Quick Facts table.
const QUICK_FACTS: { label: string; value: string }[] = [
  { label: "Founded", value: "2025" },
  { label: "HQ", value: "Williamsburg, Brooklyn" },
  {
    label: "Product",
    value: "Customer Acquisition Engine (Vertical AI for Local Commerce)",
  },
  { label: "Beachhead", value: "Williamsburg Coffee+ (AOV $8-20)" },
  {
    label: "North-star",
    value: "Software Leverage Ratio (SLR) \u2265 25 by Month 12",
  },
  {
    label: "Pricing",
    value:
      "Pilot ($0) / Operator ($500/mo + $15-85/customer) / Neighborhood ($8-12K launch)",
  },
  {
    label: "Compliance",
    value: "DisclosureBot (platform-level FTC pre-screen) + $1M E&O",
  },
  { label: "Investors", value: "TBD (Pre-Seed raising)" },
];

// v5.1 — Newsroom items rewritten on vertical-AI / ConversionOracle framing.
const PRESS_RELEASES = [
  {
    date: "Apr 2026",
    tag: "Product",
    title:
      "Push Launches ConversionOracle\u2122 \u2014 Walk-in Attribution Trained on Receipt-Level Ground Truth",
    excerpt:
      "Vertical AI model verifies each in-store customer against QR scan, Claude Vision OCR of the receipt, and geo-match. Meta and Google cannot see who walked through the door; Push can.",
    pdf: "#",
  },
  {
    date: "Mar 2026",
    tag: "Compliance",
    title:
      "Push Ships DisclosureBot \u2014 Platform-Level FTC Pre-Screen for Creator Content",
    excerpt:
      "Every caption is pre-flighted for #ad and material-connection disclosure before it ships. The architecture makes non-disclosure impossible, not discouraged.",
    pdf: "#",
  },
  {
    date: "Feb 2026",
    tag: "Pricing",
    title:
      "Push Introduces Two-Segment Creator Economics \u2014 Vertical-Priced, Not Per-Post",
    excerpt:
      "Williamsburg Coffee+ is priced at $25 per AI-verified customer. Beauty is $85. The price matches the merchant's per-customer margin, doubled \u2014 not the creator's follower count.",
    pdf: "#",
  },
  {
    date: "Jan 2026",
    tag: "Beachhead",
    title:
      "Williamsburg Coffee+ \u2014 Push Declares Template 0 for Vertical AI for Local Commerce",
    excerpt:
      "Sixty-day pilot focuses on a single vertical in a single neighborhood. The Neighborhood Playbook is the unit Push will replicate, not the TAM.",
    pdf: "#",
  },
  {
    date: "Dec 2025",
    tag: "Metric",
    title:
      "Push Commits to Software Leverage Ratio (SLR) as Its North-Star Metric",
    excerpt:
      "Active campaigns per operations person. Influencer shops run three to five. The Month-12 target for Push is twenty-five \u2014 the operating ratio that separates software from services.",
    pdf: "#",
  },
  {
    date: "Nov 2025",
    tag: "Platform",
    title:
      "Push Builds the Customer Acquisition Engine Around Three Verdict Layers",
    excerpt:
      "QR scan, Claude Vision receipt OCR, and geo-match triangulate every payout. Three signals must align or the campaign does not settle.",
    pdf: "#",
  },
  {
    date: "Sep 2025",
    tag: "Product",
    title:
      "Push Creator App Ships on iOS and Android \u2014 Campaigns Tied to Verified Walk-ins",
    excerpt:
      "Creators discover vertical-priced briefs, submit content through DisclosureBot pre-flight, and watch per-customer payouts settle as verdicts resolve.",
    pdf: "#",
  },
  {
    date: "Jul 2025",
    tag: "Founding",
    title:
      "Push Emerges From Stealth \u2014 Vertical AI for Local Commerce, Built in Brooklyn",
    excerpt:
      "The Customer Acquisition Engine is purpose-built for independent operators in the five boroughs. The first vertical is coffee; the first neighborhood is Williamsburg.",
    pdf: "#",
  },
];

const BRAND_ASSETS = [
  {
    id: "wordmark-light",
    name: "Wordmark \u2014 Light Background",
    formats: "SVG \u00B7 PNG \u00B7 1\u00D7  2\u00D7  3\u00D7",
    bg: "light",
    previewType: "wordmark",
    dark: false,
  },
  {
    id: "wordmark-dark",
    name: "Wordmark \u2014 Dark Background",
    formats: "SVG \u00B7 PNG \u00B7 1\u00D7  2\u00D7  3\u00D7",
    bg: "dark",
    previewType: "wordmark",
    dark: true,
  },
  {
    id: "icon-light",
    name: "App Icon \u2014 Light Background",
    formats: "SVG \u00B7 PNG \u00B7 1\u00D7  2\u00D7  3\u00D7",
    bg: "light",
    previewType: "icon",
    dark: false,
  },
  {
    id: "icon-dark",
    name: "App Icon \u2014 Dark Background",
    formats: "SVG \u00B7 PNG \u00B7 1\u00D7  2\u00D7  3\u00D7",
    bg: "dark",
    previewType: "icon",
    dark: true,
  },
  {
    id: "mono-black",
    name: "Monochrome \u2014 Black",
    formats: "SVG \u00B7 PNG \u00B7 1\u00D7  2\u00D7  3\u00D7",
    bg: "light",
    previewType: "mono-black",
    dark: false,
  },
  {
    id: "mono-white",
    name: "Monochrome \u2014 White",
    formats: "SVG \u00B7 PNG \u00B7 1\u00D7  2\u00D7  3\u00D7",
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

// v5.1 — founder bios reframed around Vertical AI for Local Commerce.
const FOUNDERS = [
  {
    initials: "JW",
    name: "Jiaming Wang",
    title: "Co-Founder & CEO",
    bio: "Jiaming founded Push in 2025 after watching his family\u2019s Queens restaurant lose customers to chains with unlimited ad budgets and no way to prove anything worked. A Columbia engineering graduate, he spent two years running growth at a Series B fintech before leaving to build a Customer Acquisition Engine for independent operators. Under his leadership, Push has locked onto a single beachhead \u2014 Williamsburg Coffee+ \u2014 and is building ConversionOracle\u2122 and DisclosureBot as the Vertical AI for Local Commerce layer that Meta and Google cannot replicate.",
  },
  {
    initials: "CF",
    name: "Chris Ferrante",
    title: "Co-Founder & CTO",
    bio: "Chris leads product and engineering at Push, having previously built real-time data pipelines at a Bloomberg spin-out. He architected the three-verdict pipeline behind ConversionOracle\u2122 \u2014 QR scan, Claude Vision receipt OCR, and geo-match \u2014 along with the anti-fraud stack that cross-validates POS timing windows to eliminate bot and replay attacks. Chris holds a BS in Computer Science from NYU and is a founding member of the NYC Tech Founders Council.",
  },
];

const PHOTO_PLACEHOLDERS = [
  { label: "Team \u2014 Brooklyn HQ" },
  { label: "Williamsburg Coffee+ Pilot" },
  { label: "Creator Summit 2025" },
  { label: "ConversionOracle\u2122 Dashboard" },
  { label: "Push App \u2014 iOS" },
  { label: "Neighborhood Playbook Rollout" },
];

// v5.1 — founder-ready quote lines. Use these verbatim in press kits.
const FOUNDER_QUOTES: { quote: string; context: string }[] = [
  {
    quote:
      "Vertical AI for Local Commerce means the model is small, the vertical is coffee, and the truth is a receipt.",
    context: "Positioning \u00B7 Push v5.1",
  },
  {
    quote:
      "Our north-star is Software Leverage Ratio, not GMV. Active campaigns per ops person. Influencer shops run three to five. Our Month-12 target is twenty-five.",
    context: "North-star metric \u00B7 SLR",
  },
  {
    quote:
      "ConversionOracle is the only model trained on walk-in ground truth. Meta and Google cannot see who walked through the door.",
    context: "Product moat \u00B7 ConversionOracle\u2122",
  },
  {
    quote:
      "We price per vertical, not per post. Coffee+ is $25 per AI-verified customer. Beauty is $85. The price matches the merchant\u2019s per-customer margin, doubled.",
    context: "Two-Segment Creator Economics",
  },
  {
    quote:
      "DisclosureBot is platform-level FTC compliance. The architecture makes non-disclosure impossible, not discouraged.",
    context: "Compliance \u00B7 DisclosureBot",
  },
  {
    quote:
      "Williamsburg is our Template 0, not our TAM. The Neighborhood Playbook is the unit we expand.",
    context: "Beachhead \u00B7 Neighborhood Playbook",
  },
];

// v5.1 — coverage reshaped toward "vertical AI" / "ConversionOracle" framing.
const COVERAGE = [
  {
    quote:
      "Push is building the vertical AI layer Meta and Google can\u2019t: receipt-level attribution that proves a creator post drove a Tuesday-night walk-in.",
    source: "TechCrunch",
    date: "Mar 2026",
    href: "#",
  },
  {
    quote:
      "ConversionOracle is elegant. Three signals \u2014 QR, receipt OCR, geo \u2014 must agree before the campaign settles. No ghost conversions.",
    source: "Fast Company",
    date: "Feb 2026",
    href: "#",
  },
  {
    quote:
      "Push picked one vertical and one neighborhood on purpose. Williamsburg Coffee+ is Template 0 \u2014 the Neighborhood Playbook is what scales.",
    source: "New York Magazine",
    date: "Jan 2026",
    href: "#",
  },
  {
    quote:
      "The Software Leverage Ratio is the right north-star. Twenty-five campaigns per ops person is how local software escapes services-company margins.",
    source: "Stratechery",
    date: "Mar 2026",
    href: "#",
  },
  {
    quote:
      "DisclosureBot reads like architecture, not a feature. FTC compliance as a platform-level primitive is a creator-platform first.",
    source: "The Information",
    date: "Feb 2026",
    href: "#",
  },
  {
    quote:
      "Two-Segment Creator Economics is the cleanest answer to the T1/T4 splitting-point problem local commerce has lived with for a decade.",
    source: "Axios Pro",
    date: "Jan 2026",
    href: "#",
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

/* ─── Page Component ─────────────────────────────────────────── */
export default function PressPage() {
  return (
    <main>
      <ScrollRevealInit />

      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <section className="press-hero">
        <div className="press-hero-inner">
          <p className="press-hero-eyebrow">PRESS</p>
          <h1 className="press-hero-headline">Press &amp; media.</h1>
          <p className="press-hero-sub">
            Resources for journalists, investors, and partners covering Push
            &mdash; the Customer Acquisition Engine built on Vertical AI for
            Local Commerce, beginning with Williamsburg Coffee+.
          </p>
        </div>
      </section>

      {/* ── 2. Company Overview ─────────────────────────────── */}
      <section className="press-section">
        <div className="press-container">
          <p className="press-section-label">Company Overview</p>
          <h2 className="press-section-title">
            Vertical AI for Local Commerce.
          </h2>
          <div className="press-overview-body reveal">
            <p>
              Push is building a Customer Acquisition Engine for independent
              operators &mdash; starting with coffee shops in Williamsburg,
              Brooklyn. The company is a Vertical AI for Local Commerce company:
              narrow model, narrow vertical, receipt-level ground truth.
              ConversionOracle&trade; verifies each in-store customer through a
              three-signal pipeline (QR scan, Claude Vision receipt OCR,
              geo-match) that Meta and Google cannot replicate, because neither
              can see who walked through the door.
            </p>
            <p>
              Push does not sell follower reach. It settles per verified
              customer, priced to the vertical&rsquo;s per-customer margin under
              Two-Segment Creator Economics. DisclosureBot enforces FTC
              disclosure at the platform layer before any caption ships. The
              north-star metric is Software Leverage Ratio (SLR) &mdash; active
              campaigns per operations person &mdash; with a Month-12 target of
              25, the operating ratio that separates software from services.
              Williamsburg Coffee+ is Template 0; the Neighborhood Playbook is
              the unit Push expands.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Company Facts at a Glance ────────────────────── */}
      <section className="press-section press-section-alt">
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

      {/* ── 4. Quick Facts Table ────────────────────────────── */}
      <section className="press-section">
        <div className="press-container">
          <p className="press-section-label">Quick Facts</p>
          <h2 className="press-section-title">One-line reference.</h2>
          <dl className="press-quick-facts reveal">
            {QUICK_FACTS.map((row) => (
              <div className="press-quick-fact-row" key={row.label}>
                <dt className="press-quick-fact-label">{row.label}</dt>
                <dd className="press-quick-fact-value">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 5. Newsroom Timeline ────────────────────────────── */}
      <section className="press-section press-section-alt">
        <div className="press-container">
          <p className="press-section-label">News &amp; Announcements</p>
          <h2 className="press-section-title">Newsroom</h2>
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

      {/* ── 6. Brand Assets ─────────────────────────────────── */}
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

      {/* ── 7. Color Palette ────────────────────────────────── */}
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

      {/* ── 8. Typography ───────────────────────────────────── */}
      <section className="press-section">
        <div className="press-container">
          <p className="press-section-label">Brand Typography</p>
          <h2 className="press-section-title">Type System</h2>
          <div className="type-showcase reveal">
            {/* Darky Panel */}
            <div className="type-panel">
              <div className="type-panel-label">
                Darky &mdash; Display &amp; Headline
              </div>
              <div className="type-darky-display">Push.</div>
              <div className="type-darky-weights">
                {[
                  { w: 900, name: "Black", sample: "Vertical AI. Verified." },
                  {
                    w: 800,
                    name: "ExtraBold",
                    sample: "Williamsburg Coffee+",
                  },
                  {
                    w: 700,
                    name: "Bold",
                    sample: "ConversionOracle\u2122",
                  },
                  { w: 600, name: "SemiBold", sample: "Neighborhood Playbook" },
                  { w: 300, name: "Light", sample: "Operator tier pricing" },
                  { w: 200, name: "ExtraLight", sample: "SLR \u2265 25" },
                ].map((row) => (
                  <div className="type-weight-row" key={row.w}>
                    <span
                      className="type-weight-sample"
                      style={{ fontWeight: row.w }}
                    >
                      {row.sample}
                    </span>
                    <span className="type-weight-meta">
                      {row.w} &middot; {row.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CS Genio Mono Panel */}
            <div className="type-panel">
              <div className="type-panel-label">
                CS Genio Mono &mdash; Body &amp; UI
              </div>
              <div className="type-mono-display">
                Vertical AI for
                <br />
                Local Commerce.
              </div>
              <div className="type-mono-samples">
                {[
                  { sample: "Body \u2014 16px / 1rem / 400", size: 16 },
                  { sample: "SMALL LABEL \u2014 14PX / 700", size: 14 },
                  { sample: "Caption \u2014 12px / 400", size: 12 },
                  {
                    sample: "EYEBROW \u2014 11PX / 700 / 0.08EM",
                    size: 11,
                  },
                ].map((row) => (
                  <div className="type-mono-row" key={row.size}>
                    <span
                      className="type-mono-sample"
                      style={{ fontSize: row.size }}
                    >
                      {row.sample}
                    </span>
                    <span className="type-mono-meta">
                      CS Genio Mono &middot; {row.size}px
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Photography ──────────────────────────────────── */}
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

      {/* ── 10. Founder Bios ────────────────────────────────── */}
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

      {/* ── 11. Founder Quotes ──────────────────────────────── */}
      <section className="press-section press-section-alt">
        <div className="press-container">
          <p className="press-section-label">Ready to Quote</p>
          <h2 className="press-section-title">Founder on the record.</h2>
          <div className="coverage-grid reveal reveal-stagger">
            {FOUNDER_QUOTES.map((q, i) => (
              <div className="coverage-item" key={i}>
                <blockquote className="coverage-quote">{q.quote}</blockquote>
                <div className="coverage-source">
                  <span className="coverage-source-name">Jiaming Wang</span>
                  <span className="coverage-source-dot" aria-hidden="true" />
                  <span className="coverage-source-date">{q.context}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. Press Contact ───────────────────────────────── */}
      <section className="press-contact-wrap">
        <div className="press-contact-inner">
          <p className="press-contact-label">Media &amp; Investor Inquiries</p>
          <h2 className="press-contact-headline">Talk to us.</h2>
          <p className="press-contact-sub">
            For interview requests, embargoed briefings, and asset permissions,
            reach out directly. Founder available for investor and partner
            conversation. We respond within one business day.
          </p>
          <a href="mailto:press@pushnyc.co" className="press-contact-email">
            press@pushnyc.co
          </a>
          <div
            className="press-contact-spokesperson"
            style={{
              marginTop: "var(--space-6)",
              paddingTop: "var(--space-5)",
              borderTop: "1px solid var(--line)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--tertiary)",
              }}
            >
              Spokesperson
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--dark)",
              }}
            >
              Jiaming &middot; Founder
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--graphite)",
              }}
            >
              Vertical AI for Local Commerce &middot; Williamsburg Coffee+
            </span>
          </div>
        </div>
      </section>

      {/* ── 13. Media mentions grid — 6 logo placeholders + headline links */}
      <section className="press-section">
        <div className="press-container">
          <p className="press-section-label">In the News</p>
          <h2 className="press-section-title">Media mentions.</h2>
          <div
            className="press-media-mentions reveal reveal-stagger"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-4)",
              marginTop: "var(--space-6)",
            }}
          >
            {COVERAGE.map((c, i) => (
              <a
                key={i}
                href={c.href}
                className="press-media-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                  padding: "var(--space-5)",
                  border: "1px solid var(--line)",
                  background: "var(--surface-elevated)",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform 300ms ease, border-color 300ms ease",
                }}
              >
                {/* Logo placeholder — wordmark-style block per outlet */}
                <div
                  aria-hidden="true"
                  style={{
                    height: 48,
                    background:
                      "repeating-linear-gradient(45deg, rgba(0,48,73,0.04) 0 8px, rgba(0,48,73,0.08) 8px 16px)",
                    borderBottom: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      color: "var(--dark)",
                    }}
                  >
                    {c.source}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--tertiary)",
                  }}
                >
                  {c.date}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--dark)",
                  }}
                >
                  &ldquo;{c.quote}&rdquo;
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                    marginTop: "auto",
                  }}
                >
                  Read headline &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
