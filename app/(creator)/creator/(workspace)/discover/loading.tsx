import "./discover.css";

/* ── Discover Loading Skeleton ────────────────────────────── */
/* Mirrors the real page layout exactly: hero → filters → featured → grid */

function SkeletonLine({
  width = "100%",
  height = "12px",
  className = "",
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={`disc-skeleton-shimmer ${className}`}
      style={{ width, height }}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="disc-skeleton-card">
      {/* Top: logo + badge row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div
          className="disc-skeleton-shimmer disc-skeleton-logo"
          style={{ flexShrink: 0 }}
        />
        <SkeletonLine width="52px" height="20px" />
      </div>

      {/* Payout — largest */}
      <SkeletonLine
        width="60%"
        height="32px"
        className="disc-skeleton-line--xl"
      />

      {/* Campaign name */}
      <SkeletonLine width="80%" height="16px" />
      <SkeletonLine width="55%" height="16px" />

      {/* Meta */}
      <SkeletonLine
        width="70%"
        height="10px"
        className="disc-skeleton-line--sm"
      />

      {/* Tags row */}
      <div style={{ display: "flex", gap: 6 }}>
        <SkeletonLine width="52px" height="20px" />
        <SkeletonLine width="64px" height="20px" />
      </div>

      {/* Apply button */}
      <div
        className="disc-skeleton-shimmer disc-skeleton-btn"
        style={{ marginTop: "auto" }}
      />
    </div>
  );
}

export default function DiscoverLoading() {
  return (
    <div className="disc">
      {/* Hero skeleton */}
      <header className="disc-hero" style={{ paddingBottom: 32 }}>
        <div className="disc-hero-inner">
          <div className="disc-hero-left">
            <SkeletonLine width="120px" height="10px" />
            <div style={{ marginTop: 10 }}>
              <SkeletonLine width="320px" height="72px" />
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 14,
                opacity: 0.4,
              }}
            >
              <SkeletonLine width="80px" height="10px" />
              <SkeletonLine width="60px" height="10px" />
              <SkeletonLine width="100px" height="10px" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <SkeletonLine width="200px" height="36px" />
            <SkeletonLine width="200px" height="36px" />
          </div>
        </div>
      </header>

      {/* Filter zone skeleton */}
      <div className="disc-filters-zone" style={{ paddingTop: 0 }}>
        {/* Search bar */}
        <div className="disc-search-row" style={{ gap: 12 }}>
          <SkeletonLine width="100%" height="56px" />
        </div>
        {/* Chips */}
        <div className="disc-chips-row" style={{ padding: "12px 24px" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="disc-skeleton-shimmer"
                style={{
                  width: `${60 + i * 8}px`,
                  height: "28px",
                  borderRadius: "50vh",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <main className="disc-content">
        {/* Earner banner skeleton */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 20px",
            border: "1px solid rgba(0,48,73,0.07)",
          }}
        >
          <SkeletonLine width="24px" height="24px" />
          <SkeletonLine width="320px" height="12px" />
          <SkeletonLine width="80px" height="28px" />
        </div>

        {/* Featured card skeleton */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <SkeletonLine width="160px" height="13px" />
            <SkeletonLine width="60px" height="10px" />
          </div>
          <div
            className="disc-skeleton-shimmer"
            style={{
              height: 180,
              width: "100%",
            }}
          />
        </div>

        {/* Results bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: "1px solid rgba(0,48,73,0.07)",
          }}
        >
          <SkeletonLine width="140px" height="13px" />
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLine key={i} width="72px" height="28px" />
            ))}
          </div>
        </div>

        {/* Grid skeleton — 3 columns, 6 cards */}
        <div className="disc-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
