"use client";

// MerchantShell — thin wrapper around the unified product chrome.
// Skips the chrome on unframed routes (login / signup / onboarding /
// redeem-terminal). Hosts the UnifiedSidebar for every other merchant page.

import { usePathname } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import { UnifiedSidebar } from "@/components/shell/UnifiedSidebar";
import { useThreadInboxStream } from "@/lib/realtime/use-thread-stream";
import {
  buildMerchantMockThreads,
  DEMO_MERCHANT_USER_ID,
} from "@/lib/messaging/merchant-mock-threads";
import "./merchant-shell.css";

interface MerchantShellProps {
  children: ReactNode;
}

export function MerchantShell({ children }: MerchantShellProps) {
  const pathname = usePathname();

  const isUnframed =
    pathname?.startsWith("/merchant/login") ||
    pathname?.startsWith("/merchant/signup") ||
    pathname?.startsWith("/merchant/onboarding") ||
    pathname?.startsWith("/redeem-terminal");

  /* Inbox unread badge — combines two sources:
       1. Mock thread unread counts (from the demo seed) so the badge
          reflects "real" merchant context even with no DB session.
       2. Live inserts from Supabase Realtime via useThreadInboxStream.
          Each new INSERT bumps the live counter by 1; markAllSeen()
          fires when the user enters /merchant/messages.
     Both hooks are unconditionally called (rules of hooks) but degrade
     to 0 in unframed routes — the displayed sum is gated on framed mode
     by the early return below. */
  const mockUnread = useMemo(
    () =>
      buildMerchantMockThreads().reduce(
        (sum, t) => sum + (t.unreadCount ?? 0),
        0,
      ),
    [],
  );
  const { unread: liveUnread } = useThreadInboxStream(DEMO_MERCHANT_USER_ID);
  const inboxUnread = mockUnread + liveUnread;

  if (isUnframed) {
    return <>{children}</>;
  }

  return (
    <div className="ms-shell">
      <UnifiedSidebar
        role="merchant"
        userInitial="M"
        userName="Merchant"
        notificationCount={1}
        inboxUnread={inboxUnread}
      />
      <main className="ms-main-content">{children}</main>
    </div>
  );
}
