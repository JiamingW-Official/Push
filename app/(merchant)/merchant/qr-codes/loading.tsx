/**
 * QR Codes loading boundary — KPI tiles (3) + filter pills + 4-column
 * QR poster card grid skeleton.
 */

import {
  SkeletonGroup,
  SkeletonKPIGrid,
  SkeletonCard,
  SkeletonHeading,
  SkeletonLine,
} from "@/components/loading/Skeleton";

export default function QRCodesLoading() {
  return (
    <div
      style={{
        padding: "32px clamp(24px, 4vw, 64px)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <SkeletonGroup label="QR codes">
        {/* Heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SkeletonLine width={120} height={12} />
          <SkeletonHeading lines={2} />
        </div>

        {/* KPI tiles — 3 across */}
        <SkeletonKPIGrid count={3} />

        {/* Filter pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
          }}
        >
          {[72, 96, 88, 80, 104].map((w, i) => (
            <SkeletonLine
              key={i}
              width={w}
              height={32}
              radius={999}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>

        {/* 4-column QR card grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard
              key={i}
              padding={16}
              heightHint={300}
              radius={16}
              delayIndex={i}
            >
              {/* QR poster preview block — square */}
              <SkeletonLine width="100%" height={180} radius={10} />
              <SkeletonLine width="80%" height={14} />
              <SkeletonLine width="50%" height={12} />
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <SkeletonLine width="50%" height={28} radius={8} />
                <SkeletonLine width="50%" height={28} radius={8} />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </SkeletonGroup>
    </div>
  );
}
