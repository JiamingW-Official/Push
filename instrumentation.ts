/**
 * Next.js 15+ instrumentation hook. Called once per process per runtime.
 * Used to bootstrap Sentry (P0-3 observability) in the correct runtime.
 */

export async function register() {
  if (!process.env.SENTRY_DSN) return;
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Hook errors from server/edge runtimes into Sentry when captured through
// Next.js's new onRequestError API. Lazy-loaded so dev (no DSN) skips bundling
// the Sentry/OpenTelemetry tree entirely.
export async function onRequestError(
  err: unknown,
  request: Parameters<
    NonNullable<(typeof import("@sentry/nextjs"))["captureRequestError"]>
  >[1],
  context: Parameters<
    NonNullable<(typeof import("@sentry/nextjs"))["captureRequestError"]>
  >[2],
) {
  if (!process.env.SENTRY_DSN) return;
  const { captureRequestError } = await import("@sentry/nextjs");
  return captureRequestError(err, request, context);
}
