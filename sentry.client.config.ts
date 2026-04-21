/**
 * Sentry browser init. Must read NEXT_PUBLIC_SENTRY_DSN (public-scoped)
 * because the DSN is embedded into the client bundle at build time.
 *
 * No-op when NEXT_PUBLIC_SENTRY_DSN is unset — the client bundle stays
 * small and dev builds don't spam the Sentry project.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.NEXT_PUBLIC_VERCEL_ENV ??
      process.env.NODE_ENV ??
      "development",
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: 0.1,
    // Replay only captures on error to respect user privacy + quota.
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,
  });
}
