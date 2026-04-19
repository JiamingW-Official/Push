"use client";

import { useCreatorProfile } from "@/lib/creator/hooks/useCreatorProfile";
import { usePayouts } from "@/lib/creator/hooks/usePayouts";
import EarningsSummary from "@/components/creator/portfolio/EarningsSummary";
import "./earnings.css";

export default function PortfolioEarningsPage() {
  const { creator, loading: profileLoading, isDemo } = useCreatorProfile();
  const { payouts, loading: payoutsLoading } = usePayouts(isDemo, creator?.id);

  const loading = profileLoading || payoutsLoading;

  return (
    <div className="earnings-page">
      <div className="earnings-header">
        <h1 className="earnings-title">Earnings</h1>
      </div>
      {loading ? (
        <div className="earnings-skeleton-row" />
      ) : (
        <EarningsSummary creator={creator} payouts={payouts} />
      )}
    </div>
  );
}
