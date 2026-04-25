"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND } from "@/lib/constants/brand";

/* ---- Social Icons ---- */
const IconInstagram = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconTikTok = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const IconX = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
);

const IconLinkedIn = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
  </svg>
);

const IconArrow = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IconChevronUp = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

/* ---- Nav data (preserved structure) ---- */
const NAV_COLS = [
  {
    label: "(LINKS)",
    links: [
      { label: "For Merchants", href: "/for-merchants" },
      { label: "For Creators", href: "/for-creators" },
      { label: "Get in touch", href: "/contact" },
    ],
  },
  {
    label: "(CONNECT)",
    links: [
      { label: "About Push", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    label: "(ESSENTIALS)",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
];

const SOCIAL = [
  {
    href: "https://instagram.com/pushnyc",
    label: "Instagram",
    Icon: IconInstagram,
  },
  { href: "https://tiktok.com/@pushnyc", label: "TikTok", Icon: IconTikTok },
  { href: "https://twitter.com/pushnyc", label: "X / Twitter", Icon: IconX },
  {
    href: "https://linkedin.com/company/pushnyc",
    label: "LinkedIn",
    Icon: IconLinkedIn,
  },
];

/* ---- Component ---- */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <footer
      style={{
        background: "var(--editorial-blue)",
        color: "var(--snow)",
        borderRadius: "var(--r-4xl) var(--r-4xl) 0 0",
        overflow: "hidden",
        position: "relative",
        marginTop: 80,
      }}
    >
      {/* Floating liquid-glass tiles peeking above the fold */}
      <div
        style={{
          position: "relative",
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 24,
            position: "relative",
            top: -40,
            marginBottom: -16,
          }}
        >
          {/* Newsletter tile (left) */}
          <div
            className="lg-surface--footer-tile"
            style={{
              width: 360,
              padding: "24px 32px",
              flexShrink: 0,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.65)",
                marginBottom: 12,
              }}
            >
              (STAY IN THE LOOP)
            </p>
            {submitted ? (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--snow)",
                  lineHeight: 1.5,
                }}
              >
                You&apos;re on the list. We&apos;ll be in touch.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  aria-label="Email address"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.25)",
                    background: "rgba(255,255,255,0.12)",
                    color: "var(--snow)",
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  className="click-shift"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    borderRadius: 8,
                    background: "var(--snow)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    border: "none",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                  }}
                >
                  Join <IconArrow />
                </button>
              </form>
            )}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "rgba(255,255,255,0.50)",
                marginTop: 10,
              }}
            >
              No spam. Launch updates + pilot results only.
            </p>
          </div>

          {/* Socials tile (right) */}
          <div
            className="lg-surface--footer-tile"
            style={{
              width: 280,
              padding: "24px 32px",
              flexShrink: 0,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.65)",
                marginBottom: 12,
              }}
            >
              (FOLLOW PUSH)
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SOCIAL.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="click-shift"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "var(--snow)",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "6px 0",
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--r-lg)",
                      background: "rgba(255,255,255,0.14)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon />
                  </span>
                  <span style={{ flex: 1 }}>{label}</span>
                  <IconArrow />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 64px 96px",
        }}
      >
        {/* 3-column nav grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 40,
            paddingTop: 48,
            paddingBottom: 48,
            borderBottom: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {NAV_COLS.map((col) => (
            <div key={col.label}>
              {/* Column eyebrow label — Marketing parenthetical register */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.65)",
                  marginBottom: 16,
                }}
              >
                {col.label}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="click-shift"
                      style={{
                        display: "inline-block",
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.80)",
                        textDecoration: "none",
                        transition: "color 180ms ease",
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant Darky Wordmark — bottom-left, v11 spec */}
        <div style={{ marginTop: 96 }}>
          <Link
            href="/"
            aria-label={`${BRAND.name} — home`}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(140px, 18vw, 320px)",
              color: "var(--snow)",
              lineHeight: 0.85,
              letterSpacing: "-0.045em",
              textDecoration: "none",
              display: "block",
              userSelect: "none",
            }}
          >
            {BRAND.name}
          </Link>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.15)",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "rgba(255,255,255,0.65)",
              margin: 0,
            }}
          >
            &copy; 2026 {BRAND.legalName} · Built in NYC.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              style={
                {
                  background: "none",
                  border: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.90)",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 4,
                  background2: "rgba(255,255,255,0.12)",
                } as React.CSSProperties
              }
            >
              EN
            </button>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
              /
            </span>
            <button
              style={{
                background: "none",
                border: "none",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.50)",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              中文
            </button>
          </div>
          <button
            className="click-shift"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.20)",
              color: "var(--snow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <IconChevronUp />
          </button>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1023px) {
          .footer-inner-pad { padding: 0 48px 80px !important; }
          .footer-tile-row { top: -32px !important; }
        }
        @media (max-width: 767px) {
          .footer-tile-row { flex-direction: column !important; top: -24px !important; }
          .footer-tile-row > * { width: 100% !important; }
          .footer-col-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
