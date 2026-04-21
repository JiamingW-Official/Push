/**
 * Distributed rate-limit wrapper.
 *
 * Prefers Upstash Redis (distributed, survives lambda cold starts, accurate
 * across regions) when `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
 * are set. Falls back to the in-memory sliding-window limiter in
 * `lib/rate-limit.ts` otherwise (dev / preview).
 *
 * Usage:
 *   const ok = await checkRateLimit(`login:${ip}`, { limit: 5, windowSec: 60 });
 *   if (!ok) return tooManyRequests();
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { rateLimit as inMemoryRateLimit } from "@/lib/rate-limit";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

// One Ratelimit instance per (limit, window) bucket — cached lazily so a hot
// endpoint reuses the same object.
const cache = new Map<string, Ratelimit>();

function getRatelimit(limit: number, windowSec: number): Ratelimit | null {
  if (!redis) return null;
  const key = `${limit}:${windowSec}`;
  let rl = cache.get(key);
  if (!rl) {
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      analytics: false,
    });
    cache.set(key, rl);
  }
  return rl;
}

export interface RateLimitOptions {
  /** Max requests permitted inside the window. */
  limit: number;
  /** Window length in seconds. */
  windowSec: number;
}

/**
 * @returns true if the request is allowed, false if it should be 429'd.
 */
export async function checkRateLimit(
  identifier: string,
  opts: RateLimitOptions,
): Promise<boolean> {
  const rl = getRatelimit(opts.limit, opts.windowSec);
  if (rl) {
    const { success } = await rl.limit(identifier);
    return success;
  }
  // Fallback: in-memory. Approximate but non-blocking.
  return inMemoryRateLimit(identifier, opts.limit, opts.windowSec * 1000);
}
