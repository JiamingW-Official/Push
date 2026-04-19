// In-memory sliding window rate limiter — no external dependencies
// For production at scale, replace the store with Upstash Redis

const store = new Map<string, number[]>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const cutoff = Date.now() - 60_000;
      for (const [key, timestamps] of store.entries()) {
        const fresh = timestamps.filter((t) => t > cutoff);
        if (fresh.length === 0) store.delete(key);
        else store.set(key, fresh);
      }
    },
    5 * 60 * 1000,
  );
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 * @param identifier  IP address or user ID
 * @param limit       Max requests per window (default 10)
 * @param windowMs    Window size in ms (default 60s)
 */
export function rateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = (store.get(identifier) ?? []).filter((t) => t > cutoff);
  if (timestamps.length >= limit) return false;
  timestamps.push(now);
  store.set(identifier, timestamps);
  return true;
}

/** Extract best available IP from Next.js request headers */
export function getIP(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
