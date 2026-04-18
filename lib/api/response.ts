import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------

/**
 * Typed error that API handlers can `throw` to short-circuit execution.
 * The `handle()` wrapper catches it and converts it to a structured JSON
 * error response automatically.
 *
 * @example
 * throw new ApiError(403, "You do not have permission", "FORBIDDEN");
 */
export class ApiError extends Error {
  /** HTTP status code (e.g. 400, 401, 403, 404). */
  readonly status: number;
  /** Short machine-readable error code (e.g. "UNAUTHORIZED", "NOT_FOUND"). */
  readonly code: string;
  /** Optional structured details attached to the error response. */
  readonly details?: unknown;

  constructor(
    status: number,
    message: string,
    code = "API_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// ---------------------------------------------------------------------------
// Response shape types
// ---------------------------------------------------------------------------

/** Shape of the `meta` object allowed in ok() responses. */
export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  pages?: number;
  [key: string]: unknown;
}

/** Shape returned by ok(). */
export interface OkResponse<T> {
  data: T;
  meta?: ResponseMeta;
}

/** Shape returned by fail(). */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ---------------------------------------------------------------------------
// ok()
// ---------------------------------------------------------------------------

/**
 * Returns a 200 JSON response with a consistent `{ data, meta? }` envelope.
 *
 * @example
 * return ok(campaigns, { page: 1, total: 42 });
 */
export function ok<T>(
  data: T,
  meta?: ResponseMeta,
): NextResponse<OkResponse<T>> {
  const body: OkResponse<T> = meta !== undefined ? { data, meta } : { data };
  return NextResponse.json(body);
}

// ---------------------------------------------------------------------------
// fail()
// ---------------------------------------------------------------------------

/**
 * Returns a JSON error response with a consistent `{ error: { code, message, details? } }` envelope.
 *
 * @param status  HTTP status code.
 * @param message Human-readable description of what went wrong.
 * @param code    Optional machine-readable code. Defaults to `"ERROR"`.
 * @param details Optional structured details (e.g. validation field errors).
 *
 * @example
 * return fail(400, "Budget must be between $50 and $50,000", "INVALID_BUDGET");
 */
export function fail(
  status: number,
  message: string,
  code = "ERROR",
  details?: unknown,
): NextResponse<ErrorResponse> {
  const body: ErrorResponse = {
    error: {
      code,
      message,
      ...(details !== undefined && { details }),
    },
  };
  return NextResponse.json(body, { status });
}

// ---------------------------------------------------------------------------
// handle()
// ---------------------------------------------------------------------------

/**
 * Wraps a route handler function so that:
 *  - `ApiError` instances thrown inside are converted to a `fail()` response.
 *  - Unknown errors produce a generic 500 response (without leaking internals).
 *
 * @example
 * export const GET = handle(async (req) => {
 *   const { user } = await requireUser();
 *   return ok(await fetchData(user.id));
 * });
 */
export function handle<Args extends unknown[]>(
  fn: (...args: Args) => Promise<NextResponse>,
): (...args: Args) => Promise<NextResponse> {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof ApiError) {
        return fail(err.status, err.message, err.code, err.details);
      }
      // Unknown error — do not expose internal details to the client
      return fail(500, "An unexpected error occurred", "INTERNAL_ERROR");
    }
  };
}
