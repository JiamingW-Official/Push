"use client";

/**
 * Footer — v11 § 8.3 Darky Giant Wordmark + § 8.9.2 Tile Pair
 * Editorial Blue rounded-top panel, two floating liquid-glass tiles peeking
 * above the seam, 3-column parenthetical eyebrow grid, and a Darky 800 giant
 * "PUSH" anchored bottom-left. Static wordmark — no hover shift (§ 0.8).
 */

import Link from "next/link";
import { BRAND } from "@/lib/constants/brand";
import styles from "./Footer.module.css";

/* ----------------- Nav data — 3-column marketing register ----------------- */
const NAV_COLS: ReadonlyArray<{
  label: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}> = [
  {
    label: "(LINKS)",
    links: [
      { label: "For merchants", href: "/for-merchants" },
      { label: "For creators", href: "/for-creators" },
      { label: "Pricing", href: "/pricing" },
      { label: "Get in touch", href: "/contact" },
    ],
  },
  {
    label: "(LEGAL)",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Help center", href: "/help" },
    ],
  },
];

const SOCIAL_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Instagram", href: "https://instagram.com/pushnyc" },
  { label: "X / Twitter", href: "https://twitter.com/pushnyc" },
  { label: "LinkedIn", href: "https://linkedin.com/company/pushnyc" },
];

export default function Footer() {
  return (
    <footer className={styles.shell} aria-labelledby="footer-wordmark">
      <div className={styles.panel}>
        {/* Two liquid-glass tiles peeking above the rounded-top seam — § 8.9.2 */}
        <div className={styles.tileRow} aria-hidden={false}>
          <section
            className={`${styles.tile} lg-surface lg-surface--footer-tile`}
            aria-label="Newsletter"
          >
            <p className={styles.tileEyebrow}>(NEWSLETTER)</p>
            <h3 className={styles.tileTitle}>Block-by-block dispatches.</h3>
            <p className={styles.tileBody}>
              Two emails a month. New merchants, new creators, what verified
              attribution actually looks like.
            </p>
          </section>

          <section
            className={`${styles.tile} lg-surface lg-surface--footer-tile`}
            aria-label="Social"
          >
            <p className={styles.tileEyebrow}>(CONNECT)</p>
            <ul className={styles.tileSocialList}>
              {SOCIAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    className={styles.tileSocialLink}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 3-column parenthetical eyebrow grid */}
        <div className={styles.cols}>
          {NAV_COLS.map((col) => (
            <div key={col.label} className={styles.col}>
              <p className={styles.colLabel}>{col.label}</p>
              <ul className={styles.colLinks}>
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className={styles.colLink}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={`${styles.col} ${styles.colCopyCol || ""}`}>
            <p className={styles.colLabel}>(PUSH, INC.)</p>
            <p className={styles.colCopy}>
              {BRAND.legalName}
              <br />
              {BRAND.billingAddress.line1}
              <br />
              {BRAND.billingAddress.city}, {BRAND.billingAddress.state}{" "}
              {BRAND.billingAddress.postal}
            </p>
            <p className={styles.colCopy}>
              &copy; 2026 {BRAND.legalName}. Built in NYC.
            </p>
          </div>
        </div>

        {/* Giant Wordmark — bottom-left, static (no hover shift) — § 8.3 */}
        <div className={styles.wordmarkRow}>
          <span
            id="footer-wordmark"
            className={styles.wordmark}
            aria-label={`${BRAND.name} — brand mark`}
          >
            {BRAND.name.toUpperCase()}
          </span>
        </div>
      </div>
    </footer>
  );
}
