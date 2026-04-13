"use client";

import { useEffect, useState } from "react";

// Re-export types from demo-data for convenience
export type {
  CreatorTier,
  DemoCreator,
  DemoCampaign,
  DemoApplication,
  DemoPayout,
} from "./demo-data";

/**
 * Check if currently in demo mode (client-side only).
 * Reads the push-demo-role cookie.
 */
export function isDemoMode(role?: "creator" | "merchant"): boolean {
  if (typeof document === "undefined") return false;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const demoCookie = cookies.find((c) => c.startsWith("push-demo-role="));
  if (!demoCookie) return false;
  const value = demoCookie.split("=")[1];
  if (role) return value === role;
  return value === "creator" || value === "merchant";
}

/**
 * Hook: returns true if in demo mode.
 * Safe to call in any client component.
 */
export function useDemoMode(role?: "creator" | "merchant"): boolean {
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    setDemo(isDemoMode(role));
  }, [role]);
  return demo;
}

/**
 * Enter demo mode as creator or merchant.
 * Sets cookie + optionally redirects.
 */
export function enterDemoMode(
  role: "creator" | "merchant",
  redirectTo?: string,
): void {
  document.cookie = `push-demo-role=${role}; path=/; max-age=${60 * 60 * 2}`; // 2hr
  if (redirectTo) window.location.assign(redirectTo);
}

/**
 * Exit demo mode. Clears cookie + redirects to home.
 */
export function exitDemoMode(): void {
  document.cookie = "push-demo-role=; path=/; max-age=0";
  window.location.assign("/");
}

/**
 * Server-side check: read demo cookie from Next.js cookies().
 * Use in middleware or server components.
 * Returns the role ('creator' | 'merchant' | null).
 */
export function getDemoRoleFromCookieString(
  cookieHeader: string | null,
): "creator" | "merchant" | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/push-demo-role=(creator|merchant)/);
  return (match?.[1] as "creator" | "merchant") ?? null;
}
