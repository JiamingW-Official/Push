"use client";

import DiscoverFeed from "@/components/creator/discover/DiscoverFeed";
import { useCampaigns } from "@/lib/creator/hooks/useCampaigns";
import "./discover.css";

export default function DiscoverPage() {
  const { campaigns, loading } = useCampaigns(false);

  if (loading) {
    return (
      <div className="discover-page-loading">
        <div className="discover-skeleton" />
      </div>
    );
  }

  return (
    <DiscoverFeed
      campaigns={campaigns}
      isAuthenticated={true}
      agentBannerText="Agent is matching you — invites land in Inbox automatically. Browse here to explore."
    />
  );
}
