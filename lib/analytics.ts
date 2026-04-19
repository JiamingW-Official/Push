"use client";

// Lightweight analytics wrapper — zero cost, zero dependency
// Set NEXT_PUBLIC_POSTHOG_KEY + NEXT_PUBLIC_POSTHOG_HOST in .env.local to enable PostHog

export type AnalyticsEvent =
  | "signup_started"
  | "segment_selected"
  | "signup_submitted"
  | "signup_success"
  | "onboarding_step_entered"
  | "onboarding_step_completed"
  | "onboarding_submitted"
  | "disclosure_scanned"
  | "post_submitted";

export function track(
  event: AnalyticsEvent,
  props?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;

  // PostHog — only fires if key is configured
  const ph = (
    window as unknown as {
      posthog?: { capture: (e: string, p?: unknown) => void };
    }
  ).posthog;
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY && ph) {
    ph.capture(event, props);
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[push:analytics] ${event}`, props ?? "");
  }
}
