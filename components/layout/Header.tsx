"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "For Merchants", href: "/#merchants" },
  { label: "For Creators", href: "/#creators" },
  { label: "Pricing", href: "/#pricing" },
];

// Extract section id from hash href, e.g. "/#merchants" → "merchants"
function hrefToSectionId(href: string): string | null {
  const match = href.match(/^\/#(.+)$/);
  return match ? match[1] : null;
}

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setHidden(y > 120 && y > lastY.current);
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

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["merchants", "creators", "how-it-works", "pricing"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -60% 0px" },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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
          Push
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => {
            const sectionId = hrefToSectionId(href);
            const isActive = sectionId !== null && activeSection === sectionId;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  styles.navLink,
                  isActive ? styles.navLinkActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* CTA buttons */}
        <div className={styles.ctaGroup}>
          <Link href="/creator/signup" className="btn btn-ghost">
            Join as Creator
          </Link>
          <Link href="/merchant/signup" className="btn btn-primary">
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
        {NAV_LINKS.map(({ label, href }) => {
          const sectionId = hrefToSectionId(href);
          const isActive = sectionId !== null && activeSection === sectionId;
          return (
            <Link
              key={href}
              href={href}
              className={[
                styles.mobileNavLink,
                isActive ? styles.mobileNavLinkActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          );
        })}
        <div className={styles.mobileCta}>
          <Link
            href="/creator/signup"
            className="btn btn-ghost"
            onClick={() => setMenuOpen(false)}
          >
            Join as Creator
          </Link>
          <Link
            href="/merchant/signup"
            className="btn btn-primary"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
