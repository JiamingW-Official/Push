"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { BRAND } from "@/lib/constants/brand";

const NAV_LINKS = [
  { label: "Product", href: "/#merchants" },
  { label: "Creators", href: "/#creators" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(false);

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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
          {BRAND.name}
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className={styles.navLink}>
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA — single compact button */}
        <div className={styles.ctaGroup}>
          <Link href="/merchant/signup" className={styles.ctaBtn}>
            Get Started
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

      {/* Mobile nav dropdown */}
      <nav
        className={[styles.mobileNav, menuOpen ? styles.mobileNavOpen : ""]
          .filter(Boolean)
          .join(" ")}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={styles.mobileNavLink}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <div className={styles.mobileCta}>
          <Link
            href="/creator/signup"
            className={styles.mobileCtaLink}
            onClick={() => setMenuOpen(false)}
          >
            Join as Creator
          </Link>
          <Link
            href="/merchant/signup"
            className={styles.mobileCtaBtn}
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
