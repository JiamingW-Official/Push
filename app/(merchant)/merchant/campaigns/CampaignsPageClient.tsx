"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { KPICard, PageHeader } from "@/components/merchant/shared";
import type { Campaign } from "@/lib/data/types";
import { mockStore } from "@/lib/data/mock-store";
import { CampaignsListClient } from "./CampaignsListClient";
import "./campaigns.css";

const USE_MOCK =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_USE_MOCK === "1";

interface CampaignsPageClientProps {
  initialCampaigns: Campaign[];
}

function numberOrZero(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatUsd(cents: number | null | undefined): string {
  // budget_total/budget_remaining are stored in cents
  const dollars = Math.round(numberOrZero(cents) / 100);
  return `$${dollars.toLocaleString("en-US")}`;
}

export default function CampaignsPageClient({
  initialCampaigns,
}: CampaignsPageClientProps) {
  // In USE_MOCK mode, the server fetch returns DEMO_CAMPAIGNS (mockStore
  // is empty on the server). After a client-side createCampaign writes
  // to localStorage, hydrate from the store on mount + on focus so the
  // newly published campaign appears in the list.
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);

  useEffect(() => {
    if (!USE_MOCK) return;
    const hydrate = () => {
      const stored = mockStore.read<Campaign[]>("merchant-campaigns", []);
      if (stored.length > 0) setCampaigns(stored);
    };
    hydrate();
    window.addEventListener("focus", hydrate);
    return () => window.removeEventListener("focus", hydrate);
  }, []);

  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === "active",
  ).length;
  const mtdSpend = campaigns.reduce(
    (sum, campaign) =>
      sum +
      Math.max(
        numberOrZero(campaign.budget_total) -
          numberOrZero(campaign.budget_remaining),
        0,
      ),
    0,
  );
  const totalReach = campaigns.reduce(
    (sum, campaign) => sum + numberOrZero(campaign.accepted_creators),
    0,
  );

  return (
    <div className="cl-page">
      <PageHeader
        eyebrow="CAMPAIGNS"
        title="Your Campaigns"
        subtitle="Manage active promotions, review pending launches, and close finished campaigns."
        action={
          <Link className="btn-primary text" href="/merchant/campaigns/new">
            New Campaign
          </Link>
        }
      />

      <section className="cl-kpi-row" aria-label="Campaign KPIs">
        <KPICard label="Active Campaigns" value={activeCampaigns} />
        <KPICard label="MTD Spend" value={formatUsd(mtdSpend)} />
        <KPICard
          label="Total Reach"
          value={numberOrZero(totalReach).toLocaleString("en-US")}
        />
      </section>

      <CampaignsListClient campaigns={campaigns} />
    </div>
  );
}
