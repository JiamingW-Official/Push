/**
 * Next.js 15+ instrumentation hook. Called once per process per runtime.
 * Used to bootstrap Sentry (P0-3 observability) in the correct runtime.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Hook errors from server/edge runtimes into Sentry when captured through
// Next.js's new onRequestError API.
export { captureRequestError as onRequestError } from "@sentry/nextjs";
