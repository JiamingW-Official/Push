'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/merchant/shared';
import { ActiveCampaigns } from './sections/ActiveCampaigns';
import { KPIGrid } from './sections/KPIGrid';
import { RecentApplications } from './sections/RecentApplications';
import type { Application, Campaign } from './types';
import './dashboard.css';

export type DashboardState = {
  campaigns: Campaign[];
  applications: Application[];
  mtdSpend: number;
  totalReach: number;
};

interface DashboardClientProps {
  initialData: DashboardState;
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  return (
    <div className="db-dashboard-page">
      <PageHeader
        eyebrow="OVERVIEW"
        title="Merchant Dashboard"
        subtitle="Your Push business at a glance."
        action={
          <Link href="/merchant/campaigns/new" className="btn-primary">
            New Campaign
          </Link>
        }
      />

      <KPIGrid
        campaigns={initialData.campaigns}
        applications={initialData.applications}
        mtdSpend={initialData.mtdSpend}
        totalReach={initialData.totalReach}
      />

      <ActiveCampaigns campaigns={initialData.campaigns} />
      <RecentApplications applications={initialData.applications} />
    </div>
  );
}
