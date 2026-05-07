// Dev-only test scaffold — intentionally triggers notFound() so we can
// verify the branded 404 (app/not-found.tsx) renders correctly.
// Gated behind NODE_ENV !== 'production' — returns 404 in production
// even before notFound() fires, so this never ships to real users.

import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Test404Page() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  notFound();
}
