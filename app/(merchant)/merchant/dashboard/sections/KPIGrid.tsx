import { KPICard } from '@/components/merchant/shared';
import type { Application, Campaign } from '../types';

interface KPIGridProps {
  campaigns: Campaign[];
  applications: Application[];
  mtdSpend: number;
  totalReach: number;
}

function numberOrZero(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(numberOrZero(value));
}

function formatUsd(value: number): string {
  return `$${numberOrZero(value).toLocaleString('en-US')}`;
}

export function KPIGrid({ campaigns, applications, mtdSpend, totalReach }: KPIGridProps) {
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'active').length;
  const pendingApplications = applications.filter((application) => application.status === 'pending').length;

  return (
    <section className="db-major-section" aria-labelledby="dashboard-kpis-title">
      <h2 id="dashboard-kpis-title" className="db-section-title">
        Performance Snapshot
      </h2>
      <div className="db-kpi-grid">
        <KPICard label="Active Campaigns" value={activeCampaigns} delta={`${campaigns.length} total`} deltaPositive={false} delay={40} />
        <KPICard label="Pending Applications" value={pendingApplications} delta="Needs review" deltaPositive={false} delay={100} />
        <KPICard label="MTD Spend" value={formatUsd(mtdSpend)} delta="Current month" deltaPositive={false} delay={160} />
        <KPICard label="Total Reach" value={formatCompactNumber(totalReach)} delta="Creator followers" delay={220} />
      </div>
    </section>
  );
}
