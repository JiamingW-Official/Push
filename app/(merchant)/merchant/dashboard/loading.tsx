/**
 * Dashboard loading boundary — KPI grid (4 tiles) + 2 list surfaces.
 * Auto-shown by Next.js during route transitions into /merchant/dashboard.
 */

import {
  SkeletonGroup,
  SkeletonKPIGrid,
  SkeletonCard,
  SkeletonHeading,
  SkeletonLine,
} from "@/components/loading/Skeleton";

export default function DashboardLoading() {
  return (
    <div
      style={{
        padding: "32px clamp(24px, 4vw, 64px)",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <SkeletonGroup label="dashboard">
        {/* Page heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SkeletonLine width={120} height={12} />
          <SkeletonHeading lines={2} />
        </div>

        {/* KPI grid — 4 tiles */}
        <SkeletonKPIGrid count={4} />

        {/* Two list surfaces side-by-side on desktop, stacked on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 24,
          }}
        >
          <SkeletonCard padding={24} heightHint={320} delayIndex={0}>
            <SkeletonLine width="40%" height={14} />
            <SkeletonLine width="72%" height={22} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: 8,
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <SkeletonLine key={i} width="100%" height={48} radius={8} />
              ))}
            </div>
          </SkeletonCard>
          <SkeletonCard padding={24} heightHint={320} delayIndex={1}>
            <SkeletonLine width="40%" height={14} />
            <SkeletonLine width="72%" height={22} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: 8,
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <SkeletonLine key={i} width="100%" height={48} radius={8} />
              ))}
            </div>
          </SkeletonCard>
        </div>
      </SkeletonGroup>
    </div>
  );
}
