"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./Footer.module.css";

/* ---- Social Icons (outline stroke only, square per Design.md) ---- */
const IconInstagram = () => (
  <svg
    width="16"
    height="16"
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
    width="16"
    height="16"
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
    width="16"
    height="16"
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
    width="16"
    height="16"
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

const IconArrow = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ---- Nav columns (v5.1) ---- */
type NavLink = { label: string; href: string };
type NavColumn = { label: string; links: NavLink[] };

const NAV_COLS: NavColumn[] = [
  {
    label: "Product",
    links: [
      { label: "For Merchants", href: "/for-merchants" },
      { label: "For Creators", href: "/for-creators" },
      { label: "ConversionOracle™", href: "/conversion-oracle" },
      { label: "Economics Calculator", href: "/merchant/pilot/economics" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Trust",
    links: [
      { label: "Trust Center", href: "/trust" },
      { label: "DisclosureBot Audits", href: "/trust/disclosure" },
      { label: "Security", href: "/security" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Help Center", href: "/help" },
      { label: "Status", href: "/status" },
      { label: "Changelog", href: "/changelog" },
      { label: "API Docs", href: "/api-docs" },
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

/* ---- NYC clock (real-time, Eastern Time) ---- */
function formatNYC(now: Date): string {
  // Intl.DateTimeFormat handles DST automatically.
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return fmt.format(now);
}

export default function Footer() {
  /* --- NYC clock tick (client-only, hydration-safe) --- */
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setClock(formatNYC(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000); // 30s; minute precision
    return () => window.clearInterval(id);
  }, []);

  /* --- Letter stagger for editorial brand word --- */
  const bigTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = bigTextRef.current;
    if (!el) return;

    const text = el.getAttribute("data-text") || el.textContent || "";
    el.textContent = "";
    const spans = text.split("").map((char) => {
      const s = document.createElement("span");
      s.textContent = char;
      s.className = styles.letter;
      el.appendChild(s);
      return s;
    });

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

  /* --- Newsletter inline form (visual only; wiring handled elsewhere) --- */
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <footer
      className={styles.footer}
      role="contentinfo"
      aria-labelledby="footer-brand-heading"
    >
      {/* Full-bleed top accent line */}
      <div className={styles.accentLine} aria-hidden="true" />

      <div className={styles.inner}>
        {/* =========================================================
             Row 1 — Brand block (LEFT) + 4 nav columns (RIGHT)
             ========================================================= */}
        <div className={styles.topGrid}>
          {/* -------- Brand block -------- */}
          <div className={styles.brandBlock}>
            <Link
              href="/"
              className={styles.brandLogo}
              aria-label="Push — home"
            >
              <span
                ref={bigTextRef}
                className={styles.brandWord}
                data-text="Push."
                id="footer-brand-heading"
              >
                Push.
              </span>
            </Link>

            <p className={styles.brandTag}>Vertical AI for Local Commerce.</p>

            {/* Meta chips: SLR · NYC clock */}
            <dl className={styles.metaGrid}>
              <div className={styles.metaCell}>
                <dt className={styles.metaLabel}>SLR Target</dt>
                <dd className={styles.metaValue}>
                  <span className={styles.metaArrow} aria-hidden="true">
                    &#9654;
                  </span>
                  25
                </dd>
                <span className={styles.metaSub}>
                  Software Leverage Ratio (SLR)
                </span>
              </div>
              <div className={styles.metaCell}>
                <dt className={styles.metaLabel}>NYC · ET</dt>
                <dd
                  className={styles.metaValue}
                  aria-live="polite"
                  suppressHydrationWarning
                >
                  {clock ?? "--:--"}
                </dd>
                <span className={styles.metaSub}>
                  Williamsburg Coffee+ beachhead
                </span>
              </div>
            </dl>

            {/* Social — compact row */}
            <nav className={styles.socialNav} aria-label="Push on social">
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
            </nav>
          </div>

          {/* -------- 4-column nav -------- */}
          <nav className={styles.navBlock} aria-label="Footer navigation">
            <div className={styles.colGrid}>
              {NAV_COLS.map((col, idx) => (
                <div key={col.label} className={styles.col}>
                  <h2 className={styles.colLabel}>{col.label}</h2>
                  <ul className={styles.colLinks}>
                    {col.links.map(({ label, href }) => (
                      <li key={label}>
                        <Link href={href} className={styles.colLink}>
                          <span className={styles.linkInner}>{label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Newsletter sits inside the Resources column */}
                  {idx === NAV_COLS.length - 1 && (
                    <form
                      className={styles.newsletter}
                      onSubmit={onSubscribe}
                      aria-label="Subscribe to Push operator updates"
                    >
                      <label
                        htmlFor="footer-newsletter"
                        className={styles.newsletterLabel}
                      >
                        Operator updates
                      </label>
                      <div className={styles.newsletterField}>
                        <input
                          id="footer-newsletter"
                          type="email"
                          className={styles.newsletterInput}
                          placeholder="ops@yourshop.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          required
                          disabled={submitted}
                        />
                        <button
                          type="submit"
                          className={styles.newsletterBtn}
                          aria-label={
                            submitted ? "Subscribed" : "Subscribe to updates"
                          }
                          disabled={submitted}
                        >
                          {submitted ? "Done" : <IconArrow />}
                        </button>
                      </div>
                      <p className={styles.newsletterNote}>
                        {submitted
                          ? "Subscribed. See you Monday."
                          : "Monthly Pilot + ConversionOracle™ notes. No spam."}
                      </p>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* =========================================================
             Row 2 — Bottom strip
             ========================================================= */}
        <div className={styles.bottomBar}>
          <div className={styles.status}>
            <span className={styles.pulseDot} aria-hidden="true" />
            <span className={styles.statusText}>All systems operational</span>
          </div>

          <p className={styles.copy}>
            <span>&copy; 2026 Push Labs</span>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <span>Williamsburg Coffee+ beachhead · NYC</span>
          </p>

          <span className={styles.version} aria-label="Product version">
            v5.1
          </span>
        </div>
      </div>
    </footer>
  );
}
