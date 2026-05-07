/**
 * Messages loading boundary — thread list (8 rows, left) + chat pane
 * skeleton (right).
 */

import {
  SkeletonGroup,
  SkeletonLine,
  SkeletonCircle,
} from "@/components/loading/Skeleton";

export default function MessagesLoading() {
  return (
    <div
      style={{
        padding: "24px clamp(16px, 3vw, 32px)",
        display: "grid",
        gridTemplateColumns: "minmax(280px, 360px) minmax(0, 1fr)",
        gap: 16,
        height: "calc(100svh - 96px)",
      }}
    >
      <SkeletonGroup label="messages">
        {/* Thread list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            background: "var(--surface-2, #f5f3ee)",
            borderRadius: 16,
            border: "0.5px solid rgba(0,0,0,0.04)",
            padding: "12px 8px",
            overflow: "hidden",
          }}
        >
          {/* List header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px 12px",
              gap: 8,
            }}
          >
            <SkeletonLine width="50%" height={16} />
          </div>

          {/* 8 thread rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr auto",
                gap: 12,
                alignItems: "center",
                padding: "10px 12px",
                animation:
                  "skelCardFadeIn 320ms cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: `${i * 60}ms`,
              }}
            >
              <SkeletonCircle size={40} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  minWidth: 0,
                }}
              >
                <SkeletonLine width={`${50 + (i % 3) * 10}%`} height={13} />
                <SkeletonLine width={`${60 + (i % 4) * 8}%`} height={11} />
              </div>
              <SkeletonLine width={32} height={10} />
            </div>
          ))}
        </div>

        {/* Chat pane */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "var(--surface-2, #f5f3ee)",
            borderRadius: 16,
            border: "0.5px solid rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 16,
              borderBottom: "0.5px solid rgba(0,0,0,0.06)",
            }}
          >
            <SkeletonCircle size={36} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                flex: 1,
              }}
            >
              <SkeletonLine width={160} height={14} />
              <SkeletonLine width={88} height={10} />
            </div>
          </div>

          {/* Bubbles */}
          <div
            style={{
              flex: 1,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              justifyContent: "flex-end",
            }}
          >
            {[
              { side: "left", w: "62%" },
              { side: "right", w: "44%" },
              { side: "left", w: "78%" },
              { side: "right", w: "52%" },
              { side: "left", w: "40%" },
              { side: "right", w: "68%" },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    b.side === "right" ? "flex-end" : "flex-start",
                  animation:
                    "skelCardFadeIn 320ms cubic-bezier(0.22,1,0.36,1) both",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <SkeletonLine width={b.w} height={36} radius={18} />
              </div>
            ))}
          </div>

          {/* Composer */}
          <div
            style={{
              padding: 16,
              borderTop: "0.5px solid rgba(0,0,0,0.06)",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <SkeletonLine width="100%" height={40} radius={20} />
            <SkeletonLine width={80} height={40} radius={8} />
          </div>
        </div>
      </SkeletonGroup>
    </div>
  );
}
