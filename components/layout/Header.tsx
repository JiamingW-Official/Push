"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ---- GA Tri-Color Nav pill definitions ---- */
const HOME_PILL = { label: "HOME", href: "/" };

const MIDDLE_PILLS: { pattern: RegExp; label: string; href: string }[] = [
  { pattern: /^\/for-merchants/, label: "PRODUCT", href: "/for-merchants" },
  { pattern: /^\/for-creators/, label: "CREATORS", href: "/for-creators" },
  { pattern: /^\/pricing/, label: "PRICING", href: "/pricing" },
  { pattern: /^\/how-it-works/, label: "HOW IT WORKS", href: "/how-it-works" },
];
const DEFAULT_MIDDLE = { label: "PRODUCT", href: "/for-merchants" };

const LAST_PILL = { label: "CREATORS", href: "/for-creators" };

/* ---- Inline style helpers ---- */
const S = {
  /* Sticky nav bar */
  header: (scrolled: boolean, hidden: boolean): React.CSSProperties => ({
    position: "sticky",
    top: 0,
    zIndex: 100,
    width: "100%",
    background: "rgba(248,244,232,0.85)",
    WebkitBackdropFilter: "blur(16px)",
    backdropFilter: "blur(16px)",
    borderBottom: scrolled
      ? "1px solid rgba(10,10,10,0.08)"
      : "1px solid transparent",
    transition:
      "border-color 200ms ease, transform 240ms ease, opacity 240ms ease",
    transform: hidden ? "translateY(-100%)" : "translateY(0)",
    opacity: hidden ? 0 : 1,
  }),

  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 64px",
    height: 64,
    gap: 16,
  } as React.CSSProperties,

  /* 32×32 Ink circle monogram */
  monogram: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "var(--ink)",
    color: "var(--snow)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    textDecoration: "none",
    fontFamily: "var(--font-hero)",
    fontStyle: "italic",
    fontSize: 18,
    lineHeight: 1,
    userSelect: "none",
  } as React.CSSProperties,

  /* 3-pill cluster */
  pillCluster: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  } as React.CSSProperties,

  /* Base pill */
  pillBase: {
    fontFamily: "var(--font-body)",
    fontSize: 14,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    padding: "8px 18px",
    borderRadius: "50vh",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1,
    transition: "filter 180ms ease",
    whiteSpace: "nowrap" as const,
  },

  pillHome: {
    background: "var(--ga-orange)",
    color: "#ffffff",
  } as React.CSSProperties,

  pillActive: {
    background: "var(--ga-green)",
    color: "var(--ink)",
  } as React.CSSProperties,

  pillLast: {
    background: "var(--ga-sky)",
    color: "var(--ink)",
  } as React.CSSProperties,

  /* CTA */
  cta: {
    fontFamily: "var(--font-body)",
    fontSize: 14,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    padding: "10px 22px",
    borderRadius: 8,
    background: "var(--brand-red)",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1,
    flexShrink: 0,
    transition: "transform 180ms cubic-bezier(0.34,1.56,0.64,1)",
  } as React.CSSProperties,

  /* Hamburger */
  hamburger: {
    display: "none",
    flexDirection: "column" as const,
    justifyContent: "center",
    gap: 5,
    width: 40,
    height: 40,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 8,
    flexShrink: 0,
  } as React.CSSProperties,

  bar: (open: boolean, idx: number): React.CSSProperties => ({
    display: "block",
    width: 22,
    height: 2,
    background: "var(--ink)",
    borderRadius: 1,
    transformOrigin: "center",
    transition: "transform 200ms ease, opacity 200ms ease",
    transform:
      open && idx === 0
        ? "rotate(45deg) translate(5px, 5px)"
        : open && idx === 1
          ? "scaleX(0)"
          : open && idx === 2
            ? "rotate(-45deg) translate(5px, -5px)"
            : "none",
    opacity: open && idx === 1 ? 0 : 1,
  }),

  /* Mobile overlay */
  mobileOverlay: (open: boolean): React.CSSProperties => ({
    position: "fixed",
    inset: 0,
    zIndex: 99,
    background: "rgba(248,244,232,0.96)",
    WebkitBackdropFilter: "blur(24px)",
    backdropFilter: "blur(24px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    opacity: open ? 1 : 0,
    pointerEvents: open ? "all" : "none",
    transition: "opacity 200ms ease",
  }),

  mobilePillBase: {
    fontFamily: "var(--font-body)",
    fontSize: 18,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    padding: "14px 32px",
    borderRadius: "50vh",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1,
    width: 240,
    justifyContent: "center",
  } as React.CSSProperties,

  mobileCta: {
    marginTop: 24,
    fontFamily: "var(--font-body)",
    fontSize: 16,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    padding: "14px 40px",
    borderRadius: 8,
    background: "var(--brand-red)",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1,
  } as React.CSSProperties,
} as const;

/* ---- Component ---- */
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  // Determine active middle pill
  const middlePill =
    MIDDLE_PILLS.find((p) => p.pattern.test(pathname)) ?? DEFAULT_MIDDLE;

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

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Pill hover handler via inline style doesn't support :hover — use CSS class from globals
  function pillStyle(variant: "home" | "active" | "last"): React.CSSProperties {
    const color =
      variant === "home"
        ? S.pillHome
        : variant === "active"
          ? S.pillActive
          : S.pillLast;
    return { ...S.pillBase, ...color };
  }

  return (
    <>
      <header style={S.header(scrolled, hidden)}>
        <div style={S.inner}>
          {/* Monogram */}
          <Link href="/" style={S.monogram} aria-label="Push home">
            P
          </Link>

          {/* Desktop: 3-pill cluster */}
          <div style={S.pillCluster} aria-label="Main navigation">
            <Link
              href={HOME_PILL.href}
              style={pillStyle("home")}
              aria-label={HOME_PILL.label}
              onMouseEnter={(e) =>
                (e.currentTarget.style.filter = "brightness(1.08)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.filter = "")}
              onMouseDown={(e) =>
                (e.currentTarget.style.filter = "brightness(0.92)")
              }
              onMouseUp={(e) => (e.currentTarget.style.filter = "")}
            >
              {HOME_PILL.label}
            </Link>
            <Link
              href={middlePill.href}
              style={pillStyle("active")}
              aria-current="page"
              onMouseEnter={(e) =>
                (e.currentTarget.style.filter = "brightness(1.08)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.filter = "")}
              onMouseDown={(e) =>
                (e.currentTarget.style.filter = "brightness(0.92)")
              }
              onMouseUp={(e) => (e.currentTarget.style.filter = "")}
            >
              {middlePill.label}
            </Link>
            <Link
              href={LAST_PILL.href}
              style={pillStyle("last")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.filter = "brightness(1.08)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.filter = "")}
              onMouseDown={(e) =>
                (e.currentTarget.style.filter = "brightness(0.92)")
              }
              onMouseUp={(e) => (e.currentTarget.style.filter = "")}
            >
              {LAST_PILL.label}
            </Link>
          </div>

          {/* CTA */}
          <Link
            href="/merchant/signup"
            style={S.cta}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translate(1px,1px)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform =
                "translate(2px,2px) scale(0.98)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          >
            Get Started
          </Link>

          {/* Hamburger — visible on mobile via media query class */}
          <button
            style={S.hamburger}
            className="ga-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span style={S.bar(menuOpen, 0)} />
            <span style={S.bar(menuOpen, 1)} />
            <span style={S.bar(menuOpen, 2)} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <nav
        style={S.mobileOverlay(menuOpen)}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <Link
          href={HOME_PILL.href}
          style={{
            ...S.mobilePillBase,
            background: "var(--ga-orange)",
            color: "#ffffff",
          }}
          onClick={() => setMenuOpen(false)}
        >
          {HOME_PILL.label}
        </Link>
        <Link
          href={middlePill.href}
          style={{
            ...S.mobilePillBase,
            background: "var(--ga-green)",
            color: "var(--ink)",
          }}
          onClick={() => setMenuOpen(false)}
        >
          {middlePill.label}
        </Link>
        <Link
          href={LAST_PILL.href}
          style={{
            ...S.mobilePillBase,
            background: "var(--ga-sky)",
            color: "var(--ink)",
          }}
          onClick={() => setMenuOpen(false)}
        >
          {LAST_PILL.label}
        </Link>
        <Link
          href="/merchant/signup"
          style={S.mobileCta}
          onClick={() => setMenuOpen(false)}
        >
          Get Started
        </Link>
      </nav>

      {/* Mobile responsive overrides injected globally */}
      <style>{`
        @media (max-width: 768px) {
          .ga-nav-pills { display: none !important; }
          .ga-hamburger { display: flex !important; }
          .ga-cta-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}
