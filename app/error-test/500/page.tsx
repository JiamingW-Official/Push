// Dev-only test scaffold — intentionally throws so we can verify the
// branded 500 (app/error.tsx) renders correctly.
// Gated behind NODE_ENV !== 'production' — calls notFound() in production
// so this never surfaces a real error to users.

import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Test500Page() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  // Intentional dev-only throw — caught by app/error.tsx boundary.
  throw new Error(
    "Intentional test error — verifies branded 500 page renders correctly.",
  );
}
