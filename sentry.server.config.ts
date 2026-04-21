/**
 * Sentry Node / Next.js server runtime init. Loaded via instrumentation.ts
 * when the runtime is `nodejs`.
 *
 * No-op in dev and whenever SENTRY_DSN is unset. Production hard-throw is
 * intentionally NOT added here — missing Sentry is a degraded observability
 * posture but should never block a deploy (unlike INTERNAL_API_SECRET which
 * is a security gate).
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    release: process.env.VERCEL_GIT_COMMIT_SHA,

    // Sample at 10 % to keep quota headroom during Pilot.
    tracesSampleRate: 0.1,
    // Profile only the sampled traces.
    profilesSampleRate: 0.1,

    // Scrub anything that looks like a secret before it leaves the server.
    // The list mirrors the prefixes used in lib/db/index.ts + middleware.ts.
    beforeSend(event) {
      const scrub = (s: unknown): unknown => {
        if (typeof s !== "string") return s;
        return s
          .replace(/sb_secret_[A-Za-z0-9]+/g, "sb_secret_[redacted]")
          .replace(/sbp_[A-Za-z0-9]+/g, "sbp_[redacted]")
          .replace(/Bearer [A-Za-z0-9._-]+/g, "Bearer [redacted]")
          .replace(/eyJhbGciOi[A-Za-z0-9._-]+/g, "eyJ...[redacted]");
      };
      if (event.message) event.message = scrub(event.message) as string;
      if (event.extra) {
        for (const k of Object.keys(event.extra)) {
          event.extra[k] = scrub(event.extra[k]);
        }
      }
      return event;
    },
  });
}
