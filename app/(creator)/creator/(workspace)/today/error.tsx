"use client";

import { ErrorBoundary } from "@/components/loading/ErrorBoundary";

export default function TodayError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundary
      {...props}
      scope="creator/today"
      title="Something off"
      body="We couldn't pull today's briefing. Your invites and earnings are safe — try again, or jump to Gigs while we sort this out."
    />
  );
}
