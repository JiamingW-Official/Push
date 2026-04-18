"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Product", href: "/#merchants" },
  { label: "Pricing", href: "/pricing/coffee-plus" },
  { label: "ConversionOracle", href: "/conversion-oracle" },
  { label: "Trust", href: "/trust/disclosure" },
  { label: "Neighborhoods", href: "/neighborhoods" },
];

/**
 * Normalise a pathname/href pair and decide whether the nav link
 * should be highlighted. Hash-only links match on the pathname prefix.
 */
function isActiveLink(pathname: string, href: string): boolean {
  if (!pathname) return false;
  const normalizedPath = pathname.replace(/\/$/, "") || "/";

  // Hash targets on the home page (e.g. "/#merchants")
  if (href.includes("#")) {
    const [basePath] = href.split("#");
    const normalizedBase = (basePath || "/").replace(/\/$/, "") || "/";
    return normalizedPath === normalizedBase;
  }

  const normalizedHref = href.replace(/\/$/, "") || "/";
  if (normalizedHref === "/") return normalizedPath === "/";
  return (
    normalizedPath === normalizedHref ||
    normalizedPath.startsWith(`${normalizedHref}/`)
  );
}

export default function Header() {
  const pathname = usePathname() || "/";
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setHidden(y > 400 && y - lastY.current > 3);

      // Scroll-progress: 0 -> 1 across full page height
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.min(1, Math.max(0, y / max));
      setProgress(pct);

      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Broadcast mobile nav state so MobileStickyBar can hide when the drawer is open.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("push:mobile-nav", { detail: { open: menuOpen } }),
    );
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={[
        styles.header,
        scrolled ? styles.headerScrolled : "",
        hidden ? styles.hidden : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          Push
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActiveLink(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={[styles.navLink, active ? styles.navLinkActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* CTA — creator link + merchant pilot */}
        <div className={styles.ctaGroup}>
          <Link href="/creator/signup" className={styles.ctaLink}>
            Creator
          </Link>
          <Link href="/merchant/pilot" className={styles.ctaBtn}>
            Start $0 Pilot
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={[styles.bar, menuOpen ? styles.barTop : ""]
              .filter(Boolean)
              .join(" ")}
          />
          <span
            className={[styles.bar, menuOpen ? styles.barMid : ""]
              .filter(Boolean)
              .join(" ")}
          />
          <span
            className={[styles.bar, menuOpen ? styles.barBot : ""]
              .filter(Boolean)
              .join(" ")}
          />
        </button>
      </div>

      {/* Scroll progress line — Champagne Gold, only visible after 30px */}
      <div
        className={[
          styles.progressTrack,
          scrolled ? styles.progressTrackVisible : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        <span
          className={styles.progressFill}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* Mobile nav dropdown */}
      <nav
        className={[styles.mobileNav, menuOpen ? styles.mobileNavOpen : ""]
          .filter(Boolean)
          .join(" ")}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map(({ label, href }) => {
          const active = isActiveLink(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                styles.mobileNavLink,
                active ? styles.mobileNavLinkActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={active ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          );
        })}
        <div className={styles.mobileCta}>
          <Link
            href="/creator/signup"
            className={styles.mobileCtaLink}
            onClick={() => setMenuOpen(false)}
          >
            Join as Creator
          </Link>
          <Link
            href="/merchant/pilot"
            className={styles.mobileCtaBtn}
            onClick={() => setMenuOpen(false)}
          >
            Start $0 Pilot
          </Link>
        </div>
      </nav>
    </header>
  );
}
