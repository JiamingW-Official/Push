"use client";

import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { TopNav } from "@/components/creator/workspace/TopNav";
import { SideNav } from "@/components/creator/workspace/SideNav";
import { ContextPanel } from "@/components/creator/workspace/ContextPanel";
import { MobileNav } from "@/components/creator/workspace/MobileNav";
import { CommandKProvider } from "@/components/search/CommandKProvider";
import "@/components/creator/workspace/workspace.css";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <CommandKProvider>
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
            {/* Slide-in panel */}
            <div
              className="ws-sidebar-overlay"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <SideNav onClose={closeSidebar} />
            </div>
          </>
        )}

        {/* ── Main content area ── */}
        <main className="ws-layout__main">{children}</main>

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
