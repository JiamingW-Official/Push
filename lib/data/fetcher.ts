/**
 * Single SWR fetcher for the creator workspace. Every data hook in
 * /lib/data/hooks/ goes through this so we have one place to:
 *   - attach credentials (Supabase session cookie)
 *   - parse the success envelope from /lib/api/responses.ts
 *   - normalize errors into FetchError so SWR's onError sees a typed shape
 *
 * The envelope contract:
 *   - SUCCESS: { data, timestamp, ...extras }   ← we return `data`
 *   - SUCCESS (legacy): { foo, bar, ... }       ← we return the body as-is
 *   - ERROR: { error, trace_id? }                ← we throw FetchError
 *
 * Legacy support is intentional — /api/creator/earnings predates the
 * envelope helpers and returns a flat shape. Migration is incremental.
 */

export class FetchError extends Error {
  readonly status: number;
  readonly traceId?: string;
  readonly url: string;

  constructor(
    message: string,
    init: { status: number; traceId?: string; url: string },
  ) {
    super(message);
    this.name = "FetchError";
    this.status = init.status;
    this.traceId = init.traceId;
    this.url = init.url;
  }
}

/** Returns true if the body looks like the new `{ data, timestamp }` envelope. */
function isEnvelope(
  body: unknown,
): body is { data: unknown; timestamp?: string } {
  return (
    typeof body === "object" &&
    body !== null &&
    "data" in (body as Record<string, unknown>) &&
    "timestamp" in (body as Record<string, unknown>)
  );
}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  // Read body once; treat parse failure as a transport error.
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    if (!res.ok) {
      throw new FetchError(`HTTP ${res.status}`, { status: res.status, url });
    }
    // 2xx with non-JSON body — caller must handle. Return null cast.
    return null as T;
  }

  if (!res.ok) {
    const errBody = body as { error?: string; trace_id?: string } | null;
    throw new FetchError(errBody?.error ?? `HTTP ${res.status}`, {
      status: res.status,
      traceId: errBody?.trace_id,
      url,
    });
  }

  if (isEnvelope(body)) return body.data as T;
  return body as T;
}
