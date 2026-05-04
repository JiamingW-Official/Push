'use client';

import Link from 'next/link';
import { KPICard, PageHeader } from '@/components/merchant/shared';
import type { Campaign } from '@/lib/data/types';
import { CampaignsListClient } from './CampaignsListClient';
import './campaigns.css';

interface CampaignsPageClientProps {
  initialCampaigns: Campaign[];
}

function numberOrZero(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function formatUsd(cents: number | null | undefined): string {
  // budget_total/budget_remaining are stored in cents
  const dollars = Math.round(numberOrZero(cents) / 100);
  return `$${dollars.toLocaleString('en-US')}`;
}

export default function CampaignsPageClient({ initialCampaigns }: CampaignsPageClientProps) {
  const activeCampaigns = initialCampaigns.filter((campaign) => campaign.status === 'active').length;
  const mtdSpend = initialCampaigns.reduce(
    (sum, campaign) =>
      sum +
      Math.max(numberOrZero(campaign.budget_total) - numberOrZero(campaign.budget_remaining), 0),
    0,
  );
  const totalReach = initialCampaigns.reduce(
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
        <KPICard label="Total Reach" value={numberOrZero(totalReach).toLocaleString('en-US')} />
      </section>

      <CampaignsListClient campaigns={initialCampaigns} />
    </div>
  );
}
