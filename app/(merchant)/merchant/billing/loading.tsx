/**
 * Billing loading boundary — KPI tiles (3) + invoices table skeleton.
 */

import {
  SkeletonGroup,
  SkeletonKPIGrid,
  SkeletonTable,
  SkeletonHeading,
  SkeletonLine,
} from "@/components/loading/Skeleton";

export default function BillingLoading() {
  return (
    <div
      style={{
        padding: "32px clamp(24px, 4vw, 64px)",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <SkeletonGroup label="billing">
        {/* Heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SkeletonLine width={120} height={12} />
          <SkeletonHeading lines={2} />
        </div>

        {/* KPI tiles */}
        <SkeletonKPIGrid count={3} />

        {/* Invoices table */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <SkeletonLine width={180} height={20} />
            <SkeletonLine width={120} height={32} radius={8} />
          </div>
          <SkeletonTable rows={6} cols={5} />
        </div>
      </SkeletonGroup>
    </div>
  );
}
