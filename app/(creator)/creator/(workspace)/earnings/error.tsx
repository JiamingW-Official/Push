"use client";

import { ErrorBoundary } from "@/components/loading/ErrorBoundary";

export default function EarningsError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundary
      {...props}
      scope="creator/earnings"
      title="Earnings off the wire"
      body="We couldn't fetch your balance right now. Your payouts and Stripe ledger are unaffected. Try again, or check Settings → Payments."
    />
  );
}
