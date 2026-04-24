"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./Footer.module.css";
import { BRAND } from "@/lib/constants/brand";

/* ---- Social Icons (outline stroke only) ---- */
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
    <rect x="2" y="2" width="20" height="20" rx="0" ry="0" />
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
    <rect x="2" y="2" width="20" height="20" rx="0" ry="0" />
    <path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
  </svg>
);

/* ---- Link data ---- */
const NAV_COLS = [
  {
    label: "Product",
    links: [
      { label: "For Creators", href: "/for-creators" },
      { label: "For Merchants", href: "/for-merchants" },
      { label: "Pricing", href: "/pricing" },
      { label: "Attribution", href: "/trust" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "/help" },
      { label: "FAQ", href: "/faq" },
      { label: "API Docs", href: "/api-docs" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Cookies", href: "/legal/cookies" },
      {
        label: "Do Not Sell My Personal Information",
        href: "/legal/do-not-sell",
      },
      { label: "Your Privacy Rights", href: "/legal/privacy#your-rights" },
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
  const bigTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = bigTextRef.current;
    if (!el) return;

    // Split "Push." into individual letter spans for stagger animation
    const text = el.textContent || "";
    el.textContent = "";
    const spans = text.split("").map((char) => {
      const s = document.createElement("span");
      s.textContent = char;
      s.className = styles.letter;
      el.appendChild(s);
      return s;
    });

    // IntersectionObserver — trigger once when footer enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            spans.forEach((s, i) => {
              s.style.transitionDelay = `${i * 60}ms`;
              s.classList.add(styles.letterVisible);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className={styles.footer}>
      {/* Full-bleed top accent line */}
      <div className={styles.accentLine} />

      <div className={styles.inner}>
        {/* ---- Big editorial brand word ---- */}
        <div className={styles.bigBrand}>
          <span
            ref={bigTextRef}
            className={styles.bigText}
            aria-label={`${BRAND.name}.`}
          >
            {BRAND.name}.
          </span>
        </div>

        {/* ---- Link columns ---- */}
        <div className={styles.colGrid}>
          {NAV_COLS.map((col) => (
            <div key={col.label} className={styles.col}>
              <p className={styles.colLabel}>{col.label}</p>
              <ul className={styles.colLinks}>
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className={styles.colLink}>
                      <span className={styles.linkInner}>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---- Bottom bar ---- */}
        <div className={styles.bottomBar}>
          <p className={styles.copy}>
            &copy; 2026 {BRAND.legalName} Built in NYC.
          </p>

          {/* Language toggle */}
          <div className={styles.langToggle}>
            <button className={`${styles.langBtn} ${styles.langActive}`}>
              EN
            </button>
            <span className={styles.langSep}>/</span>
            <button className={styles.langBtn}>中文</button>
          </div>

          {/* Social icons */}
          <div className={styles.social}>
            {SOCIAL.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className={styles.socialLink}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
