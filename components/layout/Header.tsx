"use client";

/* ============================================================
   Header — GA Tri-Color Nav (Design.md § 8.1 / § 14)
   Sticky chrome shared across marketing pages.
   - 32×32 Ink monogram (left) — flat, brightness-only hover
   - 3 GA Tri-Color pills (center): Home Orange / Active Green / Last Sky
     · pills are color-state only, NO transform shift (§ 16 exception)
   - Filled Primary CTA (right) — bottom-right hover shift
   - Mobile (<=768px): collapse to monogram + hamburger + drawer
   - a11y: aria-current, focus-visible 4px ring, ESC closes drawer,
     prefers-reduced-motion fallback (in CSS)
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

/* ── Pill route definitions ─────────────────────────────────── */
const HOME_PILL = { label: "HOME", href: "/" };

const MIDDLE_PILLS: { pattern: RegExp; label: string; href: string }[] = [
  { pattern: /^\/for-merchants/, label: "PRODUCT", href: "/for-merchants" },
  { pattern: /^\/for-creators/, label: "CREATORS", href: "/for-creators" },
  { pattern: /^\/pricing/, label: "PRICING", href: "/pricing" },
  { pattern: /^\/how-it-works/, label: "HOW IT WORKS", href: "/how-it-works" },
  { pattern: /^\/about/, label: "ABOUT", href: "/about" },
];
const DEFAULT_MIDDLE = { label: "PRODUCT", href: "/for-merchants" };

// Last pill is always PRICING — collapses to CREATORS if middle == PRICING
const LAST_PILL = { label: "PRICING", href: "/pricing" };

export default function Header() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  // Determine middle pill from current route. matched=true means "you are here".
  const matched = MIDDLE_PILLS.find((p) => p.pattern.test(pathname));
  const middlePill = matched ?? DEFAULT_MIDDLE;
  const isHome = pathname === "/";

  // Last pill avoids duplicating middle pill destination
  const lastPill =
    middlePill.href === LAST_PILL.href
      ? { label: "CREATORS", href: "/for-creators" }
      : LAST_PILL;

  // Scroll: scrolled flag + auto-hide on fast downward scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setHidden(y > 400 && y - lastY.current > 3);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on resize past breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // ESC closes drawer
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Build header className from state (CSS modules — class composition)
  const headerCls = [
    styles.header,
    scrolled ? styles.headerScrolled : "",
    hidden ? styles.headerHidden : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerCls}>
        <div className={styles.inner}>
          {/* Monogram */}
          <Link
            href="/"
            className={styles.monogram}
            aria-label="Push home"
            aria-current={isHome ? "page" : undefined}
          >
            P
          </Link>

          {/* Desktop: 3-pill cluster */}
          <nav className={styles.pillCluster} aria-label="Main navigation">
            <Link
              href={HOME_PILL.href}
              className={`${styles.pill} ${styles.pillHome}`}
              aria-current={isHome ? "page" : undefined}
            >
              {HOME_PILL.label}
            </Link>
            <Link
              href={middlePill.href}
              className={`${styles.pill} ${styles.pillActive}`}
              aria-current={matched ? "page" : undefined}
            >
              {middlePill.label}
            </Link>
            <Link
              href={lastPill.href}
              className={`${styles.pill} ${styles.pillLast}`}
              aria-current={
                pathname.startsWith(lastPill.href) ? "page" : undefined
              }
            >
              {lastPill.label}
            </Link>
          </nav>

          {/* CTA */}
          <Link
            href="/merchant/signup"
            className={styles.cta}
            data-cta="merchant-signup"
          >
            Get Started
          </Link>

          {/* Hamburger — only visible <=768px */}
          <button
            type="button"
            className={styles.hamburger}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="ga-mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={`${styles.bar} ${menuOpen ? styles.barOpen0 : ""}`}
            />
            <span
              className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ""}`}
            />
            <span
              className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ""}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile full-screen drawer */}
      <nav
        id="ga-mobile-nav"
        className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <Link
          href={HOME_PILL.href}
          className={`${styles.mobilePill} ${styles.pillHome}`}
          aria-current={isHome ? "page" : undefined}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        >
          {HOME_PILL.label}
        </Link>
        <Link
          href={middlePill.href}
          className={`${styles.mobilePill} ${styles.pillActive}`}
          aria-current={matched ? "page" : undefined}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        >
          {middlePill.label}
        </Link>
        <Link
          href={lastPill.href}
          className={`${styles.mobilePill} ${styles.pillLast}`}
          aria-current={pathname.startsWith(lastPill.href) ? "page" : undefined}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        >
          {lastPill.label}
        </Link>
        <Link
          href="/merchant/signup"
          className={styles.mobileCta}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        >
          Get Started
        </Link>
      </nav>
    </>
  );
}
