"use client";

import { ErrorBoundary } from "@/components/loading/ErrorBoundary";

export default function InvitesError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundary
      {...props}
      scope="creator/gigs/invites"
      title="Invites took a beat"
      body="Couldn't fetch your invite queue. Nothing's lost — brands keep waiting on the server side. Try again."
    />
  );
}
