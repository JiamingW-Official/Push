import Link from "next/link";
import styles from "./Footer.module.css";

const PLATFORM_LINKS = [
  { label: "For Merchants", href: "/merchant/signup" },
  { label: "For Creators", href: "/creator/signup" },
  { label: "Pricing", href: "#pricing" },
  { label: "Demo", href: "#demo" },
];

const COMPANY_LINKS = [
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Top border */}
        <div className={styles.topBorder} />

        {/* 3-column grid */}
        <div className={styles.footerGrid}>
          {/* Col 1: Brand */}
          <div className={styles.brandCol}>
            <span className={styles.footerLogo}>Push</span>
            <p className={styles.footerTagline}>
              NYC-first creator acquisition.
            </p>
            <p className={styles.footerTagline} style={{ marginTop: 8 }}>
              The AI engine that turns creators into measurable customer
              acquisition for local businesses.
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
            &copy; 2026 Push. All rights reserved.
          </p>
          {/* Social links placeholder */}
          <div className={styles.socialLinks}>
            <span className={styles.socialLink}>Twitter</span>
            <span className={styles.socialLink}>Instagram</span>
            <span className={styles.socialLink}>LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
