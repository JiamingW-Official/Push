import Link from "next/link";
import styles from "./Footer.module.css";

const IconTwitterX = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconLinkedIn = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const PLATFORM_LINKS = [
  { label: "For Businesses", href: "/#for-businesses" },
  { label: "For Creators", href: "/#for-creators" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
];

const COMPANY_LINKS = [
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Waitlist email capture */}
        <div className={styles.waitlistRow}>
          <p className={styles.waitlistLabel}>Get early access</p>
          <form
            className={styles.waitlistForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="your@email.com"
              className={styles.waitlistInput}
              aria-label="Email for early access"
            />
            <button type="submit" className={styles.waitlistBtn}>
              Join Waitlist
            </button>
          </form>
        </div>

        {/* Top border */}
        <div className={styles.topBorder} />

        {/* 3-column grid */}
        <div className={styles.footerGrid}>
          {/* Col 1: Brand */}
          <div className={styles.brandCol}>
            <span className={styles.footerLogo}>Push</span>
            <p className={styles.footerTagline}>
              NYC-first marketplace connecting businesses with creators who
              drive verified foot traffic.
            </p>
          </div>

          {/* Col 2: Platform links */}
          <div>
            <p className={styles.colLabel}>Platform</p>
            <div className={styles.footerLinks}>
              {PLATFORM_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} className={styles.footerLink}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Company links */}
          <div>
            <p className={styles.colLabel}>Company</p>
            <div className={styles.footerLinks}>
              {COMPANY_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} className={styles.footerLink}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.footerBottom}>
          <p className={styles.footerCopy}>
            &copy; 2026 Push NYC, Inc. All rights reserved.
          </p>
          {/* Social links */}
          <div className={styles.socialLinks}>
            <a
              href="https://twitter.com/pushnyc"
              className={styles.socialLink}
              aria-label="Twitter / X"
            >
              <IconTwitterX />
            </a>
            <a
              href="https://instagram.com/pushnyc"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <IconInstagram />
            </a>
            <a
              href="https://linkedin.com/company/pushnyc"
              className={styles.socialLink}
              aria-label="LinkedIn"
            >
              <IconLinkedIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
