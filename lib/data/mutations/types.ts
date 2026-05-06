/**
 * Shared types for /lib/data/mutations/*.
 * Each mutation returns a discriminated union — success or typed error —
 * so `withOptimistic` can branch without instanceof checks at the call site.
 */

export class MutationError extends Error {
  readonly status: number;
  readonly retryable: boolean;
  readonly traceId?: string;

  constructor(
    message: string,
    init: { status: number; retryable: boolean; traceId?: string },
  ) {
    super(message);
    this.name = "MutationError";
    this.status = init.status;
    this.retryable = init.retryable;
    this.traceId = init.traceId;
  }
}

export type MutationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: MutationError };

/* Helper that POSTs JSON to an endpoint and parses the {data, error}
 * envelope into a MutationResult. Used by every mutation in this folder
 * so we have one place to reason about retry classification (5xx + network
 * = retryable; 4xx = not retryable). */
export async function postJson<T>(
  url: string,
  body: unknown,
): Promise<MutationResult<T>> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
  } catch (netErr) {
    return {
      ok: false,
      error: new MutationError(
        netErr instanceof Error ? netErr.message : "Network error",
        { status: 0, retryable: true },
      ),
    };
  }

  let parsed: unknown = null;
  try {
    parsed = await res.json();
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    const err = parsed as
      | { error?: string; trace_id?: string }
      | null
      | undefined;
    return {
      ok: false,
      error: new MutationError(err?.error ?? `HTTP ${res.status}`, {
        status: res.status,
        retryable: res.status >= 500,
        traceId: err?.trace_id,
      }),
    };
  }

  // Either {data: ...} envelope or flat — caller knows the shape.
  const out =
    parsed != null &&
    typeof parsed === "object" &&
    "data" in (parsed as Record<string, unknown>)
      ? (parsed as { data: T }).data
      : (parsed as T);

  return { ok: true, value: out };
}
