"use client";

import { ErrorBoundary } from "@/components/loading/ErrorBoundary";

export default function ActiveError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundary
      {...props}
      scope="creator/gigs/active"
      title="Active gigs hiccup"
      body="We couldn't load your in-flight gigs. Scans and posts are tracked server-side — nothing was lost. Try again."
    />
  );
}
