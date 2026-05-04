import Link from 'next/link';
import { EmptyState, StatusBadge, TierBadge } from '@/components/merchant/shared';
import type { Application } from '../types';

interface RecentApplicationsProps {
  applications: Application[];
}

function mapApplicationStatus(status: Application['status']): {
  badgeStatus: 'pending' | 'resolved' | 'closed';
  label: string;
} {
  if (status === 'pending') {
    return { badgeStatus: 'pending', label: 'Pending' };
  }

  if (status === 'accepted') {
    return { badgeStatus: 'resolved', label: 'Accepted' };
  }

  return { badgeStatus: 'closed', label: 'Rejected' };
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  const recentApplications = [...applications]
    .sort((left, right) => new Date(right.applied_at).getTime() - new Date(left.applied_at).getTime())
    .slice(0, 5);

  return (
    <section className="db-major-section" aria-labelledby="dashboard-applications-title">
      <div className="db-section-head">
        <h2 id="dashboard-applications-title" className="db-section-title">
          Recent Applications
        </h2>
        <Link href="/merchant/applicants" className="db-section-link">
          View all applicants
        </Link>
      </div>

      <div className="db-list-surface">
        {recentApplications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Applications from creators will show up here once campaigns start receiving interest."
            ctaLabel="View campaigns"
            ctaHref="/merchant/campaigns"
          />
        ) : (
          recentApplications.map((application) => {
            const status = mapApplicationStatus(application.status);
            return (
              <article key={application.id} className="db-list-row db-application-row">
                <div className="db-row-main">
                  <h3 className="db-row-title">{application.creator_name}</h3>
                  <p className="db-row-meta">
                    {application.creator_handle} · {application.campaign_title}
                  </p>
                </div>
                <div className="db-row-side db-row-side--application">
                  <TierBadge tier={application.creator_tier} />
                  <StatusBadge status={status.badgeStatus}>{status.label}</StatusBadge>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
