"use client";

/* ============================================================
   Inbox Layout — v11.3 headerless shell
   The top chrome (breadcrumb + segmented nav) has been removed.
   Each sub-page embeds its own InboxTabNav inside the relevant
   panel (left list-pane for Messages, sidebar for System) so
   nav lives where the user's eye already is.

   WorkspaceStateProvider is upstream in (workspace)/layout.tsx;
   this layout only provides the fullbleed container + a11y region.
   ============================================================ */

import { useWorkspaceState } from "@/lib/workspace/state";
import "./inbox.css";

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InboxShell>{children}</InboxShell>;
}

function InboxShell({ children }: { children: React.ReactNode }) {
  const { liveMessage } = useWorkspaceState();

  return (
    <div className="cw-page ib-page ib-page--fullbleed">
      {children}

      {/* A11y live region — broadcasts mutations from any pane to
          screen readers without taking visual space. */}
      <div
        className="cw-a11y-live"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {liveMessage}
      </div>
    </div>
  );
}
