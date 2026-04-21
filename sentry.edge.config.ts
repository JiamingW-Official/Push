/**
 * Sentry Edge runtime init (middleware + edge routes). Loaded via
 * instrumentation.ts when the runtime is `edge`.
 *
 * Edge runtime lacks Node APIs (fs, node:crypto.randomBytes, etc.);
 * `@sentry/nextjs` ships an edge-compatible transport automatically.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: 0.1,
  });
}
