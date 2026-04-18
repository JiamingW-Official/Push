"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./MobileStickyBar.module.css";

/**
 * MobileStickyBar — v5.1 dual-CTA bottom bar for ≤768px.
 *
 * - Fixed at bottom, Deep Space Blue with 1px champagne top border.
 * - Two CTAs: Creator (btn-outline-light) + Start $0 Pilot (btn-fill).
 * - Hidden on desktop (>768px), hidden when the mobile drawer is open
 *   (listens for the "push:mobile-nav" CustomEvent dispatched by Header),
 *   and hidden on scroll-down past 400px to match Header auto-hide.
 * - Respects iOS safe-area-inset-bottom.
 */
export default function MobileStickyBar() {
  const [hidden, setHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Match Header: hide on scroll-down past 400px, pin on scroll-up.
      setHidden(y > 400 && y - lastY.current > 3);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Listen for Header drawer open/close events.
  useEffect(() => {
    const onDrawer = (e: Event) => {
      const detail = (e as CustomEvent<{ open: boolean }>).detail;
      setDrawerOpen(Boolean(detail?.open));
    };
    window.addEventListener("push:mobile-nav", onDrawer as EventListener);
    return () =>
      window.removeEventListener("push:mobile-nav", onDrawer as EventListener);
  }, []);

  const suppress = drawerOpen || hidden;

  return (
    <div
      className={[styles.bar, suppress ? styles.barHidden : ""]
        .filter(Boolean)
        .join(" ")}
      role="navigation"
      aria-label="Primary actions"
      aria-hidden={suppress}
    >
      <Link
        href="/creator/signup"
        className={`btn-outline-light ${styles.btn} ${styles.btnCreator}`}
      >
        Creator
      </Link>
      <Link
        href="/merchant/pilot"
        className={`btn-fill ${styles.btn} ${styles.btnPilot}`}
      >
        Start $0 Pilot
      </Link>
    </div>
  );
}
