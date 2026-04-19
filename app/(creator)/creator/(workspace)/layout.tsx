import type { ReactNode } from "react";
import { TopNav } from "@/components/creator/workspace/TopNav";
import { SideNav } from "@/components/creator/workspace/SideNav";
import { ContextPanel } from "@/components/creator/workspace/ContextPanel";
import "./workspace.css";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ws-shell">
      <header className="ws-topnav">
        <TopNav />
      </header>
      <nav className="ws-sidenav">
        <SideNav />
      </nav>
      <main className="ws-main">{children}</main>
      <aside className="ws-context">
        <ContextPanel />
      </aside>
    </div>
  );
}
