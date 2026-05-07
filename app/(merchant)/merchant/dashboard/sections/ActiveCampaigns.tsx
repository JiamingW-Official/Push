import Link from "next/link";
import { EmptyState, StatusBadge } from "@/components/merchant/shared";
import type { Campaign } from "../types";

interface ActiveCampaignsProps {
  campaigns: Campaign[];
}

function formatDeadline(deadline: string | null): string | null {
  if (!deadline) return null;
  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildMetaLine(
  category: string | undefined,
  deadline: string | null,
): string {
  const deadlineLabel = formatDeadline(deadline);
  const categoryLabel = category?.trim() || null;
  const parts: string[] = [];
  if (categoryLabel) parts.push(categoryLabel);
  parts.push(deadlineLabel ? `Deadline: ${deadlineLabel}` : "No deadline set");
  return parts.join(" · ");
}

function formatSpots(remaining: number, total: number): string {
  const safeTotal = Number.isFinite(total) && total > 0 ? total : 0;
  const safeRemaining = Number.isFinite(remaining)
    ? Math.max(0, Math.min(remaining, safeTotal || remaining))
    : 0;
  if (safeTotal === 0) return "— spots";
  return `${safeRemaining}/${safeTotal} spots`;
}

export function ActiveCampaigns({ campaigns }: ActiveCampaignsProps) {
  const visibleCampaigns = [...campaigns]
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() -
        new Date(left.created_at).getTime(),
    )
    .slice(0, 5);

  return (
    <section
      className="db-major-section"
      aria-labelledby="dashboard-campaigns-title"
    >
      <div className="db-section-head">
        <h2 id="dashboard-campaigns-title" className="db-section-title">
          Active Campaigns
        </h2>
        <Link href="/merchant/campaigns" className="db-section-link">
          View all campaigns
        </Link>
      </div>

      <div className="db-list-surface anim-stagger">
        {visibleCampaigns.length === 0 ? (
          <EmptyState
            title="NO CAMPAIGNS YET"
            description="Launch a campaign to start receiving creator applications."
            ctaLabel="VIEW CAMPAIGNS"
            ctaHref="/merchant/campaigns"
          />
        ) : (
          visibleCampaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/merchant/campaigns/${campaign.id}`}
              className="db-list-row db-campaign-row"
            >
              <div className="db-row-main">
                <h3 className="db-row-title">{campaign.title}</h3>
                <p className="db-row-meta">
                  {buildMetaLine(campaign.category, campaign.deadline)}
                </p>
              </div>
              <div className="db-row-side">
                <StatusBadge status={campaign.status}>
                  {campaign.status.toUpperCase()}
                </StatusBadge>
                <span className="db-row-metric">
                  {formatSpots(campaign.spots_remaining, campaign.spots_total)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
