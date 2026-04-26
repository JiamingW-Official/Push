// Push — Creator Dashboard layout
//
// Lumin-style premium SaaS shell: a single collapsible glass rail (64→200px
// on hover) and a generous main column. Replaces the heavier workspace shell
// (TopNav + SideNav + ContextPanel) used elsewhere — the dashboard's content
// IS the experience here, not the navigation chrome.
//
// Authority:
//   creator_home_mockup_day0_7.html (rail spec)
//   Design.md v11 § 1 r9 Product UI register
//   CREATOR_PSYCHOLOGY_v1.md § 5 (5-zone composition)

import type { ReactNode } from "react";
import { RailNav } from "@/components/creator/dashboard/RailNav";
import "./shell.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dh-shell">
      <RailNav />
      <main className="dh-main" id="dh-main-content">
        {children}
      </main>
    </div>
  );
}
