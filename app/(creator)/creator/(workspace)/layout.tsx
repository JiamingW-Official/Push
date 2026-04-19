import type { ReactNode } from "react";
import { TopNav } from "@/components/creator/workspace/TopNav";
import { SideNav } from "@/components/creator/workspace/SideNav";
import { ContextPanel } from "@/components/creator/workspace/ContextPanel";
import "@/components/creator/workspace/workspace.css";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ws-layout">
      <div className="ws-layout__topnav">
        <TopNav />
      </div>
      <div className="ws-layout__sidenav">
        <SideNav />
      </div>
      <main className="ws-layout__main">{children}</main>
      <div className="ws-layout__context">
        <ContextPanel />
      </div>
    </div>
  );
}
