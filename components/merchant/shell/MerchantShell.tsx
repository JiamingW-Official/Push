"use client";

// MerchantShell — thin wrapper around the unified product chrome.
// Skips the chrome on unframed routes (login / signup / onboarding /
// redeem-terminal). Hosts the UnifiedSidebar for every other merchant page.

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { UnifiedSidebar } from "@/components/shell/UnifiedSidebar";
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
      />
      <main className="ms-main-content">{children}</main>
    </div>
  );
}
