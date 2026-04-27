// Push — Creator Workspace layout
//
// 2-column portal: [72px icon rail] [1fr main content]
// The icon rail is the shared UnifiedSidebar; main scrolls independently.

import type { ReactNode } from "react";
import { UnifiedSidebar } from "@/components/shell/UnifiedSidebar";
import { CommandKProvider } from "@/components/search/CommandKProvider";
import { DEMO_CREATOR } from "@/lib/creator/demo-data";

import "@/components/creator/workspace/lumin-shell.css";
import "@/components/creator/workspace/lumin-cards.css";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const initial = DEMO_CREATOR.name.charAt(0).toUpperCase();

  return (
    <CommandKProvider>
      <a href="#cw-main-content" className="dh-skip">
        Skip to main content
      </a>
      <div className="dh-shell">
        <UnifiedSidebar
          role="creator"
          userInitial={initial}
          userName={DEMO_CREATOR.name}
        />
        <main id="cw-main-content" className="dh-main">
          {children}
        </main>
      </div>
    </CommandKProvider>
  );
}
