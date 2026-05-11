"use client";

/* ============================================================
   Footer v5 (2026-05-08) — full-bleed editorial ink panel.

   Removes the surrounding margin/padding that revealed cream body
   background. The ink panel now spans viewport edge-to-edge with a
   subtle inner gradient + champagne accents. Asymmetric layout:
   editorial intro line + giant newsletter + 3 small nav columns +
   oversized wordmark anchored bottom-right.
   ============================================================ */

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BRAND } from "@/lib/constants/brand";
import styles from "./Footer.module.css";

const NAV_COLS = [
  {
    label: "Product",
    links: [
      { label: "For creators", href: "/for-creators" },
      { label: "For merchants", href: "/for-merchants" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Explore", href: "/explore" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    label: "Trust",
    links: [
      { label: "Trust report", href: "/trust" },
      { label: "Security", href: "/security" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Help", href: "/help" },
    ],
  },
];

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/pushnyc" },
  { label: "X", href: "https://twitter.com/pushnyc" },
  { label: "LinkedIn", href: "https://linkedin.com/company/pushnyc" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className={styles.shell} aria-labelledby="footer-wordmark">
      {/* ── Editorial intro band ── */}
      <div className={styles.intro}>
        <p className={styles.introEyebrow}>The footer · made in NYC</p>
        <h2 className={styles.introTitle}>
          Built block <span className={styles.introAmp}>·</span> by block.
        </h2>
        <p className={styles.introBody}>
          Push is the verified-attribution layer for hyperlocal creator work. We
          don&apos;t do impressions. We do receipts.
        </p>
      </div>

      {/* ── Asymmetric grid ── */}
      <div className={styles.grid}>
        {/* Newsletter (large, left) */}
        <section className={styles.news}>
          <p className={styles.colLabel}>(Stay in the loop)</p>
          <h3 className={styles.newsTitle}>Block-by-block dispatches.</h3>
          <p className={styles.newsBody}>
            Two emails a month. New merchants, new creators, what verified
            attribution actually looks like in the wild.
          </p>
          {submitted ? (
            <p className={styles.newsThanks}>You&apos;re on the list.</p>
          ) : (
            <form
              className={styles.newsForm}
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubmitted(true);
              }}
            >
              <input
                type="email"
                className={styles.newsInput}
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <button type="submit" className={styles.newsBtn}>
                Join <ArrowRight size={14} strokeWidth={2.25} />
              </button>
            </form>
          )}
          <ul className={styles.socialList}>
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                >
                  {s.label}
                  <ArrowUpRight size={12} strokeWidth={2} />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* 3 nav columns */}
        <div className={styles.cols}>
          {NAV_COLS.map((col) => (
            <nav key={col.label} className={styles.col} aria-label={col.label}>
              <p className={styles.colLabel}>({col.label})</p>
              <ul className={styles.colLinks}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={styles.colLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ── Hairline divider ── */}
      <div className={styles.divider} aria-hidden />

      {/* ── Bottom band: legal + giant wordmark ── */}
      <div className={styles.bottom}>
        <div className={styles.legal}>
          <p className={styles.legalLine}>
            <span className={styles.legalCo}>{BRAND.legalName}</span> ·{" "}
            {BRAND.billingAddress.line1}, {BRAND.billingAddress.city},{" "}
            {BRAND.billingAddress.state} {BRAND.billingAddress.postal}
          </p>
          <p className={styles.legalLine}>
            &copy; 2026 {BRAND.legalName} · Built in NYC ·{" "}
            <Link href="/legal/privacy" className={styles.legalLink}>
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/legal/terms" className={styles.legalLink}>
              Terms
            </Link>
          </p>
        </div>
        <span
          id="footer-wordmark"
          className={styles.wordmark}
          aria-label={`${BRAND.name} brand mark`}
        >
          {BRAND.name.toUpperCase()}
        </span>
      </div>
    </footer>
  );
}
