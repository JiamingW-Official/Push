"use client";

import Link from "next/link";
import { BRAND } from "@/lib/constants/brand";

/* ---- Nav data — 2 cols per Figma spec (node 1:218) ---- */
const NAV_COLS = [
  {
    label: "(LINKS)",
    links: [
      { label: "For Merchants", href: "/for-merchants" },
      { label: "For Creators", href: "/for-creators" },
      { label: "Pricing", href: "/pricing" },
      { label: "Get in touch", href: "/contact" },
    ],
  },
  {
    label: "(CONNECT)",
    links: [
      { label: "About Push", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Help Center", href: "/help" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
];

/* ---- Component ---- */
export default function Footer() {
  return (
    <footer
      className="footer-root"
      style={{
        background: "var(--ink-2)",
        borderRadius: "8px 8px 0 0",
        padding: "120px 64px 32px",
        position: "relative",
        overflow: "hidden",
        marginTop: 80,
        color: "var(--snow)",
      }}
    >
      {/* Main row: wordmark left + nav columns right */}
      <div
        className="footer-main"
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          display: "flex",
          alignItems: "flex-end",
          gap: 80,
        }}
      >
        {/* Magvix Regular wordmark — Figma spec: weight 400, NOT italic */}
        <Link
          href="/"
          aria-label={`${BRAND.name} — home`}
          style={{
            fontFamily: "var(--font-hero)",
            fontSize: "clamp(80px, 14vw, 200px)",
            fontWeight: 400,
            fontStyle: "normal",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: "var(--snow)",
            flexShrink: 0,
            textDecoration: "none",
            display: "block",
            userSelect: "none",
          }}
        >
          {BRAND.name}
        </Link>

        {/* Nav columns — pushed to the far right */}
        <div
          className="footer-cols"
          style={{
            display: "flex",
            gap: 64,
            alignItems: "flex-start",
            marginLeft: "auto",
            paddingBottom: 8,
          }}
        >
          {NAV_COLS.map((col) => (
            <div key={col.label} className="footer-col">
              {/* Pill label — Figma spec: 10px mono, 0.4em ls, border pill */}
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "var(--ink-6)",
                  border:
                    "1px solid color-mix(in srgb, var(--ink-6) 40%, transparent)",
                  borderRadius: "50vh",
                  padding: "4px 12px",
                  marginBottom: 20,
                }}
              >
                {col.label}
              </span>

              {/* Links — right-aligned, underlined, mono 16px */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  alignItems: "flex-end",
                }}
              >
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="footer-link click-shift"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 16,
                        fontWeight: 400,
                        lineHeight: 1.4,
                        letterSpacing: "-0.01em",
                        color: "var(--ink-6)",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                        textAlign: "right",
                        display: "block",
                        transition: "color 0.12s",
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
      </div>

      {/* Bottom bar — copyright right-aligned only */}
      <div
        className="footer-bottom"
        style={{
          maxWidth: 1140,
          margin: "80px auto 0",
          display: "flex",
          justifyContent: "flex-end",
          borderTop:
            "1px solid color-mix(in srgb, var(--snow) 8%, transparent)",
          paddingTop: 24,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "color-mix(in srgb, var(--ink-6) 60%, transparent)",
            letterSpacing: "0.02em",
            margin: 0,
          }}
        >
          &copy; 2026 {BRAND.legalName} &middot; Built in NYC.
        </p>
      </div>

      {/* Responsive */}
      <style>{`
        .footer-link:hover { color: var(--snow) !important; }

        @media (max-width: 1023px) {
          .footer-root { padding: 80px 48px 32px !important; }
        }

        @media (max-width: 767px) {
          .footer-root { padding: 64px 24px 24px !important; border-radius: 0 !important; }
          .footer-main {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 48px !important;
          }
          .footer-cols {
            flex-direction: column !important;
            gap: 40px !important;
            margin-left: 0 !important;
          }
          .footer-col ul { align-items: flex-start !important; }
          .footer-col a { text-align: left !important; }
          .footer-bottom { margin-top: 48px !important; justify-content: flex-start !important; }
        }
      `}</style>
    </footer>
  );
}
