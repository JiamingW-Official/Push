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
        const ReactModule = await import("react");
        const ReactDOMModule = await import("react-dom");
        const axe = (await import("@axe-core/react")).default;
        if (cancelled) return;
        // axe-core takes (React, ReactDOM, debounceMs).
        axe(ReactModule, ReactDOMModule, 1000);
        // eslint-disable-next-line no-console
        console.info(
          "[a11y] axe-core attached — violations will print to the console",
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[a11y] axe-core failed to attach", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
