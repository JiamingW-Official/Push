import Link from 'next/link';
import { EmptyState, StatusBadge } from '@/components/merchant/shared';
import type { Campaign } from '../types';

interface ActiveCampaignsProps {
  campaigns: Campaign[];
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'No deadline';
  return new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ActiveCampaigns({ campaigns }: ActiveCampaignsProps) {
  const visibleCampaigns = [...campaigns]
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .slice(0, 5);

  return (
    <section className="db-major-section" aria-labelledby="dashboard-campaigns-title">
      <div className="db-section-head">
        <h2 id="dashboard-campaigns-title" className="db-section-title">
          Active Campaigns
        </h2>
        <Link href="/merchant/campaigns" className="db-section-link">
          View all campaigns
        </Link>
      </div>

      <div className="db-list-surface">
        {visibleCampaigns.length === 0 ? (
          <EmptyState
            title="NO CAMPAIGNS YET"
            description="Launch a campaign to start receiving creator applications."
            ctaLabel="VIEW CAMPAIGNS"
            ctaHref="/merchant/campaigns"
          />
        ) : (
          visibleCampaigns.map((campaign) => (
            <article key={campaign.id} className="db-list-row db-campaign-row">
              <div className="db-row-main">
                <h3 className="db-row-title">{campaign.title}</h3>
                <p className="db-row-meta">
                  {campaign.category?.trim() || '—'} · Deadline: {formatDeadline(campaign.deadline)}
                </p>
              </div>
              <div className="db-row-side">
                <StatusBadge status={campaign.status}>{campaign.status.toUpperCase()}</StatusBadge>
                <span className="db-row-metric">{campaign.spots_remaining}/{campaign.spots_total} spots</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
