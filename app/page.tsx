"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

/* ── SVG Icons ──────────────────────────────────────────────── */
const StorefrontIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const MicIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const ScanIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
);

/* ── Newsletter form component ─────────────────────────────── */
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "16px",
          color: "var(--ink)",
          textAlign: "center",
        }}
      >
        You&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "12px",
        justifyContent: "center",
        flexWrap: "wrap",
        width: "100%",
        maxWidth: "480px",
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        style={{
          flex: 1,
          minWidth: "200px",
          height: "48px",
          padding: "0 16px",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--ink)",
          background: "rgba(255,255,255,0.72)",
          border: "1px solid var(--hairline-2)",
          borderRadius: "var(--r-sm)",
          outline: "none",
        }}
      />
      <button
        type="submit"
        className="btn-ink"
        style={{ height: "48px", whiteSpace: "nowrap" }}
      >
        Join the signal
      </button>
    </form>
  );
}

/* ── Page component ─────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div
      style={{ overflow: "hidden", background: "var(--surface)" }}
      id="main-content"
    >
      <Header />

      {/* ── Panel stack: 16px outer padding, 12px gap ─────────── */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* ═══════════════════════════════════════════════════════
            PANEL 1 — HERO · Full-bleed gradient, bottom-left title
            border-radius: 0 (allowed exception: Full-Bleed Photo Card Hero)
            ═══════════════════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            height: "clamp(560px, 80vh, 880px)",
            borderRadius: 0,
            overflow: "hidden",
            background: `
              linear-gradient(160deg, rgba(10,10,10,0.02) 0%, transparent 40%),
              radial-gradient(ellipse 120% 80% at 70% 30%, rgba(193,18,31,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 80% 100% at 20% 80%, rgba(30,95,173,0.15) 0%, transparent 50%),
              linear-gradient(180deg, #1a1816 0%, #2c2a26 100%)
            `,
          }}
        >
          {/* Noise overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.04,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "256px 256px",
              pointerEvents: "none",
            }}
          />

          {/* Dark gradient overlay bottom */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Right-upper liquid glass stat tile */}
          <div
            className="lg-surface--dark"
            style={{
              position: "absolute",
              top: "clamp(32px, 4vw, 56px)",
              right: "clamp(32px, 5vw, 64px)",
              padding: "24px 32px",
              minWidth: "160px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(40px, 5vw, 56px)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "var(--snow)",
              }}
            >
              1.4M
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                marginTop: "8px",
              }}
            >
              verified scans
            </div>
          </div>

          {/* Bottom-left: eyebrow + title + subtitle + CTAs */}
          <div
            style={{
              position: "absolute",
              bottom: "clamp(56px, 8vw, 96px)",
              left: "clamp(24px, 5vw, 64px)",
              right: "clamp(24px, 5vw, 64px)",
              maxWidth: "760px",
            }}
          >
            {/* Eyebrow parenthetical */}
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                marginBottom: "16px",
              }}
            >
              (NYC LOCAL)
            </div>

            {/* Magvix hero title — bottom-left anchor */}
            <h1
              style={{
                fontFamily: "var(--font-hero)",
                fontWeight: "normal",
                fontSize: "clamp(64px, 9vw, 160px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
                color: "var(--snow)",
                margin: "0 0 32px 0",
              }}
            >
              Local performance
              <br />
              marketing.
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "18px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.72)",
                maxWidth: "480px",
                margin: "0 0 48px 0",
              }}
            >
              Push connects NYC local businesses with neighborhood creators. You
              pay only for verified store visits — not impressions.
            </p>

            {/* CTA cluster */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link
                href="/merchant/signup"
                className="btn-primary click-shift"
                style={{ textDecoration: "none" }}
              >
                Get Started
              </Link>
              {/* Ghost white variant on dark bg */}
              <Link
                href="/how-it-works"
                className="click-shift"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "52px",
                  padding: "0 28px",
                  background: "transparent",
                  color: "var(--snow)",
                  border: "1px solid rgba(255,255,255,0.45)",
                  borderRadius: "var(--r-sm)",
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                See how it works
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PANEL 2 — ADVENTURE · Candy Peach · 3-route cards
            ═══════════════════════════════════════════════════════ */}
        <section
          className="candy-panel"
          style={{
            background: "var(--panel-peach)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Eyebrow + H2 — top-left anchor */}
          <div style={{ marginBottom: "clamp(40px, 5vw, 56px)" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-4)",
                display: "block",
                marginBottom: "16px",
              }}
            >
              (HOW IT WORKS)
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(32px, 4vw, 40px)",
                letterSpacing: "-0.045em",
                lineHeight: 1.1,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              Choose your
              <br />
              path forward.
            </h2>
          </div>

          {/* 3-column route cards — 4+4+4 grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Card 1 — For Merchants */}
            <Link
              href="/for-merchants"
              className="click-shift"
              style={{
                background: "rgba(255,255,255,0.55)",
                borderRadius: "var(--r-xl)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                textDecoration: "none",
                minHeight: "240px",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--r-md)",
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--ink)",
                    marginBottom: "16px",
                  }}
                >
                  <StorefrontIcon />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "20px",
                    letterSpacing: "-0.025em",
                    color: "var(--ink)",
                    marginBottom: "12px",
                  }}
                >
                  For Merchants
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "var(--ink-3)",
                    margin: 0,
                  }}
                >
                  Drive verified foot traffic. Pay only when a creator&apos;s
                  scan converts to a real store visit.
                </p>
              </div>
              <span className="btn-ghost" style={{ alignSelf: "flex-start" }}>
                Learn more →
              </span>
            </Link>

            {/* Card 2 — For Creators */}
            <Link
              href="/for-creators"
              className="click-shift"
              style={{
                background: "rgba(255,255,255,0.55)",
                borderRadius: "var(--r-xl)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                textDecoration: "none",
                minHeight: "240px",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--r-md)",
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--ink)",
                    marginBottom: "16px",
                  }}
                >
                  <MicIcon />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "20px",
                    letterSpacing: "-0.025em",
                    color: "var(--ink)",
                    marginBottom: "12px",
                  }}
                >
                  For Creators
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "var(--ink-3)",
                    margin: 0,
                  }}
                >
                  Earn per verified visit. Post your favorite local spots, let
                  your audience discover them, get paid when they show up.
                </p>
              </div>
              <span className="btn-ghost" style={{ alignSelf: "flex-start" }}>
                Join as creator →
              </span>
            </Link>

            {/* Card 3 — How Scans Work */}
            <Link
              href="/how-it-works"
              className="click-shift"
              style={{
                background: "rgba(255,255,255,0.55)",
                borderRadius: "var(--r-xl)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                textDecoration: "none",
                minHeight: "240px",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--r-md)",
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--ink)",
                    marginBottom: "16px",
                  }}
                >
                  <ScanIcon />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "20px",
                    letterSpacing: "-0.025em",
                    color: "var(--ink)",
                    marginBottom: "12px",
                  }}
                >
                  How Scans Work
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "var(--ink-3)",
                    margin: 0,
                  }}
                >
                  Creator posts a QR. Audience scans it. Visit is verified
                  on-site. Merchant pays. Transparent, fraud-resistant, local.
                </p>
              </div>
              <span className="btn-ghost" style={{ alignSelf: "flex-start" }}>
                See the flow →
              </span>
            </Link>
          </div>
        </section>

        {/* ── Signature Divider 1 ─────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span className="sig-divider">Posted · Scanned · Verified ·</span>
        </div>

        {/* ═══════════════════════════════════════════════════════
            PANEL 3 — PROOF · Candy Blush · stats + merchant quotes
            ═══════════════════════════════════════════════════════ */}
        <section
          className="candy-panel"
          style={{
            background: "var(--panel-blush)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Floating status badge — top right */}
          <div
            className="lg-surface--badge"
            style={{
              position: "absolute",
              top: "clamp(24px, 3vw, 40px)",
              right: "clamp(24px, 3vw, 40px)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--ga-green)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "var(--ink)",
                whiteSpace: "nowrap",
              }}
            >
              Live now · Williamsburg ·
            </span>
          </div>

          {/* Eyebrow + H2 */}
          <div style={{ marginBottom: "clamp(40px, 5vw, 56px)" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-4)",
                display: "block",
                marginBottom: "16px",
              }}
            >
              (THE NUMBERS)
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(32px, 4vw, 40px)",
                letterSpacing: "-0.045em",
                lineHeight: 1.1,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              Physical proof,
              <br />
              not digital promises.
            </h2>
          </div>

          {/* 3 stat tiles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              marginBottom: "clamp(40px, 5vw, 56px)",
            }}
          >
            {[
              { num: "1.4M+", label: "Verified scans to date" },
              { num: "87%", label: "Creator retention rate" },
              { num: "$0", label: "Cost per unverified visit" },
            ].map((stat) => (
              <div
                key={stat.num}
                className="lg-surface"
                style={{ padding: "24px 32px", textAlign: "center" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(40px, 5vw, 72px)",
                    lineHeight: 1,
                    letterSpacing: "-0.045em",
                    color: "var(--ink)",
                    marginBottom: "8px",
                  }}
                >
                  {stat.num}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--ink-3)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* 2×2 merchant proof quotes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                quote:
                  "We had 47 first-time customers walk in with a Push QR in week 2. CAC dropped to $14.",
                attribution: "NYC café owner · Wave 1",
              },
              {
                quote:
                  "No agency fees. No impression metrics. Just real people walking through the door.",
                attribution: "Brooklyn retail merchant · Wave 1",
              },
              {
                quote:
                  "My audience started discovering places they&apos;d walked past for years. It feels genuine.",
                attribution: "Local food creator · Williamsburg",
              },
              {
                quote:
                  "The QR scan verification removes all the guesswork. I know exactly what I&apos;m paying for.",
                attribution: "Lower East Side bar owner · Wave 1",
              },
            ].map((item, i) => (
              <blockquote
                key={i}
                style={{
                  background: "rgba(255,255,255,0.6)",
                  borderRadius: "var(--r-xl)",
                  padding: "24px",
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(15px, 1.6vw, 18px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--ink-4)",
                    letterSpacing: "0.04em",
                  }}
                >
                  — {item.attribution}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* ── Signature Divider 2 ─────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span className="sig-divider">End of receipt · Fin ·</span>
        </div>

        {/* ═══════════════════════════════════════════════════════
            PANEL 4 — EDITORIAL TABLE · Surface-2 · comparison
            ═══════════════════════════════════════════════════════ */}
        <section
          style={{
            background: "var(--surface-2)",
            borderRadius: "var(--r-md)",
            padding: "clamp(32px, 4vw, 48px) clamp(24px, 4vw, 56px)",
            overflowX: "auto",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              letterSpacing: "-0.045em",
              lineHeight: 1.1,
              color: "var(--ink)",
              margin: "0 0 56px 0",
              textAlign: "left",
            }}
          >
            Why Push beats the
            <br />
            alternatives.
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "560px",
            }}
          >
            <thead>
              <tr>
                {[
                  "(PLATFORM)",
                  "(VERIFIED VISITS)",
                  "(LOCAL CREATORS)",
                  "(COST MODEL)",
                ].map((col, i) => (
                  <th
                    key={col}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--ink-4)",
                      textAlign: i === 3 ? "right" : "left",
                      paddingBottom: "16px",
                      borderBottom: "1px dotted rgba(10,10,10,0.30)",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  platform: "Push",
                  verified: "✓",
                  creators: "✓",
                  cost: "Pay per visit",
                  isPush: true,
                },
                {
                  platform: "Yelp Ads",
                  verified: "✗",
                  creators: "✗",
                  cost: "CPM",
                  isPush: false,
                },
                {
                  platform: "Influencer Agency",
                  verified: "Partial",
                  creators: "✗",
                  cost: "Retainer",
                  isPush: false,
                },
                {
                  platform: "Groupon",
                  verified: "✗",
                  creators: "✗",
                  cost: "Revenue share",
                  isPush: false,
                },
              ].map((row, i, arr) => (
                <tr key={row.platform}>
                  <td
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "clamp(16px, 1.8vw, 20px)",
                      letterSpacing: "-0.02em",
                      color: row.isPush ? "var(--ink)" : "var(--ink-3)",
                      padding: "20px 0",
                      borderBottom:
                        i < arr.length - 1
                          ? "1px dotted rgba(10,10,10,0.18)"
                          : "none",
                    }}
                  >
                    {row.platform}
                  </td>
                  <td
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      color:
                        row.verified === "✓"
                          ? "var(--ga-green)"
                          : row.verified === "Partial"
                            ? "var(--ink-3)"
                            : "var(--ink-5)",
                      padding: "20px 0",
                      borderBottom:
                        i < arr.length - 1
                          ? "1px dotted rgba(10,10,10,0.18)"
                          : "none",
                    }}
                  >
                    {row.verified}
                  </td>
                  <td
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      color:
                        row.creators === "✓"
                          ? "var(--ga-green)"
                          : "var(--ink-5)",
                      padding: "20px 0",
                      borderBottom:
                        i < arr.length - 1
                          ? "1px dotted rgba(10,10,10,0.18)"
                          : "none",
                    }}
                  >
                    {row.creators}
                  </td>
                  <td
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      color: "var(--ink-3)",
                      padding: "20px 0",
                      textAlign: "right",
                      borderBottom:
                        i < arr.length - 1
                          ? "1px dotted rgba(10,10,10,0.18)"
                          : "none",
                      fontWeight: row.isPush ? 700 : 400,
                    }}
                  >
                    {row.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PANEL 5 — TICKET · GA Orange · newsletter
            ═══════════════════════════════════════════════════════ */}
        <div className="ticket-panel" style={{ position: "relative" }}>
          {/* Grommet circles — 4 corners */}
          {[
            { top: "24px", left: "24px" },
            { top: "24px", right: "24px" },
            { bottom: "24px", left: "24px" },
            { bottom: "24px", right: "24px" },
          ].map((pos, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                ...pos,
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                border: "2px solid var(--ink)",
                background: "transparent",
              }}
            />
          ))}

          {/* Central content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-hero)",
                fontStyle: "italic",
                fontWeight: "normal",
                fontSize: "clamp(40px, 5vw, 56px)",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              Tune into
              <br />
              the signal.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "var(--ink-3)",
                maxWidth: "480px",
                margin: 0,
              }}
            >
              Get early access updates, Wave 1 results, and local commerce
              insights — straight to your inbox.
            </p>

            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FOOTER — Editorial Blue, floating glass tiles
          ═══════════════════════════════════════════════════════ */}
      <Footer />
    </div>
  );
}
