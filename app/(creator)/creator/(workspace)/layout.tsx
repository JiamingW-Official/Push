// Push — Creator Workspace layout (Lumin shell)
//
// Replaces the heavy TopNav + SideNav + ContextPanel + MobileNav stack with
// a single collapsible glass rail (72→248px on hover). Every creator page
// in (workspace)/ inherits this chrome and the shared `.cw-*` card system.
//
// Authority:
//   push-design-spec § 8.13 sidebar (248px, glass blur 32+sat180)
//   creator_home_mockup_day0_7.html (collapse interaction)
//   Design.md v11 § 1 r9 Product UI register

import type { ReactNode } from "react";
import { RailNav } from "@/components/creator/workspace/RailNav";
import { CommandKProvider } from "@/components/search/CommandKProvider";

import "@/components/creator/workspace/lumin-shell.css";
import "@/components/creator/workspace/lumin-cards.css";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <CommandKProvider>
      <a href="#cw-main-content" className="dh-skip">
        Skip to main content
      </a>
      <div className="dh-shell">
        <RailNav />
        <main id="cw-main-content" className="dh-main">
          {children}
        </main>
      </div>
    </CommandKProvider>
  );
}
