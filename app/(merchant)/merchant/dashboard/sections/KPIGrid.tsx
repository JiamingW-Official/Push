import { KPICard } from "@/components/merchant/shared";
import type { Application, Campaign } from "../types";

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
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(numberOrZero(value));
}

function formatUsd(value: number): string {
  return `$${numberOrZero(value).toLocaleString("en-US")}`;
}

export function KPIGrid({
  campaigns,
  applications,
  mtdSpend,
  totalReach,
}: KPIGridProps) {
  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === "active",
  ).length;
  const pendingApplications = applications.filter(
    (application) => application.status === "pending",
  ).length;

  // Inline mock series — small ascending/wavering arrays that read as
  // realistic 7- and 30-day trends. Real data wires up in a follow-up
  // wave; for now we infer trend direction from the values themselves.
  const ACTIVE_7D = [2, 4, 3, 5, 7, 6, 8];
  const PENDING_7D = [12, 9, 14, 11, 16, 13, 17];
  const SPEND_30D = [
    8, 14, 19, 22, 28, 31, 36, 42, 47, 53, 58, 63, 67, 71, 78, 84, 90, 95, 99,
    104, 110, 116, 121, 127, 133, 138, 144, 150, 156, 162,
  ];
  const REACH_30D = [
    320, 340, 365, 380, 410, 432, 455, 478, 501, 528, 552, 580, 612, 640, 671,
    702, 728, 759, 790, 822, 851, 880, 912, 944, 975, 1010, 1042, 1078, 1113,
    1150,
  ];

  return (
    <section
      className="db-major-section"
      aria-labelledby="dashboard-kpis-title"
    >
      <h2 id="dashboard-kpis-title" className="db-section-title">
        Performance Snapshot
      </h2>
      <div className="db-kpi-grid anim-stagger">
        <KPICard
          label="Active Campaigns"
          value={activeCampaigns}
          delta={`${campaigns.length} total`}
          deltaPositive={false}
          delay={40}
          sparkline={ACTIVE_7D}
        />
        <KPICard
          label="Pending Applications"
          value={pendingApplications}
          delta="Needs review"
          deltaPositive={false}
          delay={100}
          sparkline={PENDING_7D}
        />
        <KPICard
          label="MTD Spend"
          value={formatUsd(mtdSpend)}
          delta="Current month"
          deltaPositive={false}
          delay={160}
          sparkline={SPEND_30D}
        />
        <KPICard
          label="Total Reach"
          value={formatCompactNumber(totalReach)}
          delta="Creator followers"
          delay={220}
          sparkline={REACH_30D}
        />
      </div>
    </section>
  );
}
