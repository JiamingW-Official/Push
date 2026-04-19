"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { TopNav } from "@/components/creator/workspace/TopNav";
import { SideNav } from "@/components/creator/workspace/SideNav";
import { ContextPanel } from "@/components/creator/workspace/ContextPanel";
import { MobileNav } from "@/components/creator/workspace/MobileNav";
import { CommandKProvider } from "@/components/search/CommandKProvider";
import "@/components/creator/workspace/workspace.css";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  // Ref to the element that triggered open — restored on close
  const triggerRef = useRef<HTMLElement | null>(null);

  const openSidebar = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement;
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    // Return focus to the hamburger button after closing
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  // Escape key closes overlay; focus trap inside overlay
  useEffect(() => {
    if (!sidebarOpen) return;

    // Move focus into overlay
    const firstFocusable = overlayRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSidebar();
        return;
      }
      // Focus trap: Tab / Shift+Tab within overlay
      if (e.key !== "Tab" || !overlayRef.current) return;
      const focusables = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, closeSidebar]);

  return (
    <CommandKProvider>
      {/* Skip navigation link — visually hidden until focused */}
      <a href="#ws-main-content" className="ws-skip-link">
        Skip to main content
      </a>

      <div className="ws-layout">
        {/* ── Top navigation bar ── */}
        <div className="ws-layout__topnav">
          <TopNav onMenuClick={openSidebar} />
        </div>

        {/* ── Desktop side navigation (always visible ≥768px) ── */}
        <div className="ws-layout__sidenav">
          <SideNav />
        </div>

        {/* ── Overlay sidebar for tablet/mobile hamburger ── */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="ws-sidebar-backdrop"
              aria-hidden="true"
              onClick={closeSidebar}
            />
            {/* Slide-in panel — focus trap managed by useEffect */}
            <div
              ref={overlayRef}
              className="ws-sidebar-overlay"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
            >
              <SideNav onClose={closeSidebar} />
            </div>
          </>
        )}

        {/* ── Main content area ── */}
        <main id="ws-main-content" className="ws-layout__main">
          {children}
        </main>

        {/* ── Desktop context panel ── */}
        <div className="ws-layout__context">
          <ContextPanel />
        </div>

        {/* ── Mobile bottom navigation ── */}
        <MobileNav />
      </div>
    </CommandKProvider>
  );
}
