import "./admin.css";
import type { ReactNode } from "react";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { UnifiedSidebar } from "@/components/shell/UnifiedSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      <div className="adm-shell">
        <UnifiedSidebar role="admin" userInitial="A" userName="Admin" />
        <main className="adm-main" id="adm-main" role="main">
          <header className="adm-topbar" role="banner">
            <span className="adm-topbar__eyebrow">(PUSH · INTERNAL)</span>
            <span className="adm-topbar__divider" aria-hidden="true" />
            <span className="adm-topbar__title">Operations Console</span>
            <span className="adm-topbar__spacer" />
            <span
              className="adm-internal-badge"
              role="status"
              aria-label="Authenticated as internal staff"
            >
              <span className="adm-internal-badge__dot" aria-hidden="true" />
              Authority · Staff
            </span>
          </header>
          {children}
        </main>
      </div>
    </>
  );
}
