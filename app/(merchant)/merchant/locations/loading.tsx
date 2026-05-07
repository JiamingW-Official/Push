/**
 * Locations loading boundary — list panel + map placeholder split.
 */

import {
  SkeletonGroup,
  SkeletonCard,
  SkeletonHeading,
  SkeletonLine,
  SkeletonCircle,
} from "@/components/loading/Skeleton";

export default function LocationsLoading() {
  return (
    <div
      style={{
        padding: "32px clamp(24px, 4vw, 64px)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <SkeletonGroup label="locations">
        {/* Heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SkeletonLine width={120} height={12} />
          <SkeletonHeading lines={2} />
        </div>

        {/* Split: list (left) + map (right) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* List panel */}
          <SkeletonCard
            padding={20}
            heightHint={520}
            radius={16}
            delayIndex={0}
          >
            <SkeletonLine width="50%" height={14} />
            <SkeletonLine width="80%" height={20} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: 12,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "0.5px dashed rgba(0,0,0,0.06)",
                  }}
                >
                  <SkeletonCircle size={36} />
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <SkeletonLine width="64%" height={14} />
                    <SkeletonLine width="40%" height={12} />
                  </div>
                  <SkeletonLine width={56} height={20} radius={999} />
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Map placeholder */}
          <div
            style={{
              minHeight: 520,
              borderRadius: 16,
              background: "var(--surface-2, #f5f3ee)",
              border: "0.5px solid rgba(0,0,0,0.04)",
              position: "relative",
              overflow: "hidden",
            }}
            aria-hidden="true"
            className="skel-shimmer"
          />
        </div>
      </SkeletonGroup>
    </div>
  );
}
