import { NextResponse } from "next/server";

/**
 * Shared HTTP response helpers for Push's Next.js API routes. Extracted
 * from the Session 3-2 recruitment-sync implementation after the full
 * backend audit showed ~6 routes reinventing the same `errorMessage()`
 * helper and leaking raw Postgres error text to the client.
 *
 * Use `success` / `badRequest` / `serverError` from every route handler.
 * Never echo a raw `err.message` or `error.details` to the response body.
 */

// ---------------------------------------------------------------------------
// 5-char Postgres SQLSTATE (e.g. `23505` unique_violation). When `err.code`
// matches, the `.message` typically echoes constraint / table / column
// names — we log only the code and suppress the message.
// ---------------------------------------------------------------------------
const PG_ERRCODE_RE = /^[0-9A-Z]{5}$/;

/**
 * Success envelope. Always includes `timestamp` so clients never have to
 * branch on request method when reading the response shape.
 *
 * @example
 *   return success(rowOrObject);
 *   return success(rowOrObject, { count: rows.length }); // extra meta
 */
export function success<T>(
  data: T,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json({
    data,
    timestamp: new Date().toISOString(),
    ...extras,
  });
}

/**
 * Uniform 400 handler. Emits a `console.warn` for server-side log
 * grepping — no trace_id (400s are the caller's mistake; they already
 * know what they sent). Echoes only the caller-safe message + any
 * explicitly-passed enum hints.
 *
 * @example
 *   return badRequest("`tier` must be 1, 2, or 3");
 *   return badRequest("Invalid action", { allowed: ACTIONS });
 */
export function badRequest(
  message: string,
  extras?: Record<string, unknown>,
): NextResponse {
  console.warn("[api 400]", message);
  return NextResponse.json(
    extras ? { error: message, ...extras } : { error: message },
    { status: 400 },
  );
}

/**
 * Uniform 401 handler. Used when the route requires an authenticated
 * session and the cookie/token is missing or invalid.
 */
export function unauthorized(message = "Unauthorized"): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Uniform 403 handler. Used when the caller is authenticated but the
 * requested resource doesn't belong to them (ownership check failed).
 */
export function forbidden(message = "Forbidden"): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Uniform 404 handler. Used when a specific resource (row, record, etc.)
 * isn't found. Intentionally generic — we don't leak which resource
 * specifically, since an unauthenticated enumeration attacker
 * shouldn't learn "this id exists but isn't yours" vs "doesn't exist".
 */
export function notFound(message = "Not found"): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * Uniform 500 handler. Emits a minimized projection of the error to
 * server logs keyed on a generated `trace_id`, and returns ONLY the
 * `trace_id` to the client — never Postgres error text, schema details,
 * or constraint names.
 *
 * The `.cause` chain, full stack trace, and Postgres-flavored messages
 * are intentionally dropped because Sentry / Datadog transports
 * serialize whatever reaches `console.error` and that observability
 * layer is often accessible more widely than the DB itself. Callers
 * report the trace_id to ops; ops greps the log.
 *
 * @example
 *   try { ... } catch (err) { return serverError("merchant-dashboard", err); }
 */
export function serverError(label: string, err: unknown): NextResponse {
  const traceId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const code = (err as { code?: unknown } | null)?.code;
  const isPgError = typeof code === "string" && PG_ERRCODE_RE.test(code);

  // For Postgres errors: log only the SQLSTATE (message leaks schema).
  // For other errors: log the message but never the stack (cwd paths +
  // node_modules internals).
  const safe = isPgError
    ? { code }
    : {
        name: err instanceof Error ? err.name : undefined,
        message: err instanceof Error ? err.message : String(err),
      };

  console.error(`[${label}]`, traceId, safe);
  return NextResponse.json(
    { error: "Internal error", trace_id: traceId },
    { status: 500 },
  );
}
