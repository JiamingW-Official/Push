/**
 * Request-ID helper. Every inbound request is tagged with a stable ID so
 * a client-side 500 can be correlated with the exact server log line and
 * Sentry event.
 *
 * Convention:
 *   - If the request already carries `x-request-id`, trust it (passthrough
 *     from upstream load balancer / CDN).
 *   - Else, generate a UUIDv4.
 *   - Always echo the resolved ID back in the response via
 *     `x-request-id: <id>`.
 */
export const REQUEST_ID_HEADER = "x-request-id";

export function resolveRequestId(req: Request | { headers: Headers }): string {
  const incoming = req.headers.get(REQUEST_ID_HEADER);
  if (incoming && /^[A-Za-z0-9-]{8,64}$/.test(incoming)) {
    return incoming;
  }
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
