"use client";

/**
 * Dev-only axe-core integration. Loads in development to surface a11y
 * violations in the console. No-ops in production.
 *
 * Mount via /app/(creator)/creator/(workspace)/layout.tsx wrapped in
 * a check for NODE_ENV. Findings appear as a console table with the
 * impact level (critical / serious / moderate / minor), the violating
 * selector, and a link to the rule documentation.
 */

import { useEffect } from "react";

export function AxeInit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    let cancelled = false;
    (async () => {
      try {
        // Lazy import so prod bundle doesn't include axe-core.
        // React 19 + Turbopack expose Module Namespace Objects with
        // read-only getters; @axe-core/react monkey-patches createElement
        // on the passed module, which throws "Cannot set property
        // createElement of [object Module] which has only a getter".
        // Workaround: spread into a plain object so the props are writable.
        const ReactModule = { ...(await import("react")) };
        const ReactDOMModule = { ...(await import("react-dom")) };
        const axe = (await import("@axe-core/react")).default;
        if (cancelled) return;
        // axe-core takes (React, ReactDOM, debounceMs).
        axe(ReactModule, ReactDOMModule, 1000);
        console.info(
          "[a11y] axe-core attached — violations will print to the console",
        );
      } catch (err) {
        // Soft-fail: dev-only a11y diagnostic; never block app.
        console.debug("[a11y] axe-core skipped (dev-only diagnostic)", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
