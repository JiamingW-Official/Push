/**
 * Applicants loading boundary — filter chips row + 3-column applicant
 * card grid skeleton.
 */

import {
  SkeletonGroup,
  SkeletonCard,
  SkeletonHeading,
  SkeletonLine,
  SkeletonCircle,
} from "@/components/loading/Skeleton";

export default function ApplicantsLoading() {
  return (
    <div
      style={{
        padding: "32px clamp(24px, 4vw, 64px)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <SkeletonGroup label="applicants">
        {/* Heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SkeletonLine width={120} height={12} />
          <SkeletonHeading lines={2} />
        </div>

        {/* Filter chips row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
          }}
        >
          {[80, 96, 88, 72, 104, 64].map((w, i) => (
            <SkeletonLine
              key={i}
              width={w}
              height={32}
              radius={999}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>

        {/* 3-column applicant card grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(288px, 1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard
              key={i}
              padding={20}
              heightHint={220}
              radius={16}
              delayIndex={i}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <SkeletonCircle size={48} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    flex: 1,
                  }}
                >
                  <SkeletonLine width="70%" height={16} />
                  <SkeletonLine width="50%" height={12} />
                </div>
              </div>
              <SkeletonLine width="100%" height={12} />
              <SkeletonLine width="86%" height={12} />
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <SkeletonLine width={88} height={32} radius={8} />
                <SkeletonLine width={88} height={32} radius={8} />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </SkeletonGroup>
    </div>
  );
}
