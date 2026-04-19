import "./discover.css";

/* ── Discover Loading Skeleton ────────────────────────────── */
/* Mirrors the real page layout exactly: hero → filters → featured → grid */

function SkeletonLine({
  width = "100%",
  height = "12px",
  className = "",
  style = {},
}: {
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`disc-skeleton-shimmer ${className}`}
      style={{ width, height, ...style }}
    />
  );
}

function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="disc-skeleton-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Category color bar already rendered via ::before */}
      <div className="disc-skeleton-card-inner">
        {/* Logo + badge row */}
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
          <SkeletonLine width="48px" height="18px" />
        </div>

        {/* Payout — the earn number, biggest element */}
        <SkeletonLine
          width="52%"
          height="34px"
          className="disc-skeleton-line--xl"
        />

        {/* Campaign title — two lines */}
        <SkeletonLine
          width="85%"
          height="16px"
          className="disc-skeleton-line--lg"
        />
        <SkeletonLine
          width="60%"
          height="16px"
          className="disc-skeleton-line--md"
        />

        {/* Merchant meta */}
        <SkeletonLine
          width="70%"
          height="10px"
          className="disc-skeleton-line--sm"
        />

        {/* Distance + slots row */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <SkeletonLine
            width="64px"
            height="22px"
            style={{ borderRadius: "50vh" }}
          />
          <SkeletonLine width="80px" height="10px" />
        </div>

        {/* Tags row */}
        <div style={{ display: "flex", gap: 6 }}>
          <SkeletonLine
            width="50px"
            height="20px"
            style={{ borderRadius: "50vh" }}
          />
          <SkeletonLine
            width="64px"
            height="20px"
            style={{ borderRadius: "50vh" }}
          />
        </div>

        {/* Apply button */}
        <div
          className="disc-skeleton-shimmer disc-skeleton-btn"
          style={{ marginTop: "auto" }}
        />
      </div>
    </div>
  );
}

export default function DiscoverLoading() {
  return (
    <div className="disc">
      {/* Hero skeleton */}
      <header className="disc-hero" style={{ paddingBottom: 36 }}>
        <div className="disc-hero-inner">
          <div className="disc-hero-left">
            <SkeletonLine
              width="130px"
              height="10px"
              style={{ opacity: 0.3 }}
            />
            <div style={{ marginTop: 12 }}>
              <SkeletonLine
                width="340px"
                height="80px"
                style={{ opacity: 0.25 }}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 16,
                alignItems: "center",
              }}
            >
              <SkeletonLine
                width="90px"
                height="10px"
                style={{ opacity: 0.2 }}
              />
              <div
                style={{
                  width: 1,
                  height: 10,
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <SkeletonLine
                width="160px"
                height="10px"
                style={{ opacity: 0.2 }}
              />
              <div
                style={{
                  width: 1,
                  height: 10,
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <SkeletonLine
                width="110px"
                height="10px"
                style={{ opacity: 0.2 }}
              />
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
            <SkeletonLine
              width="210px"
              height="38px"
              style={{ opacity: 0.2 }}
            />
            <SkeletonLine
              width="210px"
              height="38px"
              style={{ opacity: 0.25 }}
            />
          </div>
        </div>
      </header>

      {/* Filter zone skeleton */}
      <div className="disc-filters-zone" style={{ paddingTop: 0 }}>
        {/* Search bar row */}
        <div className="disc-search-row" style={{ gap: 0 }}>
          <div
            className="disc-skeleton-shimmer"
            style={{ width: "52px", height: "56px", opacity: 0.4 }}
          />
          <SkeletonLine
            width="100%"
            height="24px"
            style={{ margin: "0 16px", opacity: 0.3 }}
          />
        </div>
        {/* Filter chips */}
        <div className="disc-chips-row" style={{ padding: "10px 24px" }}>
          <div style={{ display: "flex", gap: 8, overflow: "hidden" }}>
            {[68, 96, 76, 80, 72, 88, 64].map((w, i) => (
              <div
                key={i}
                className="disc-skeleton-shimmer"
                style={{
                  width: `${w}px`,
                  height: "28px",
                  borderRadius: "50vh",
                  flexShrink: 0,
                  opacity: 0.5,
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
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "13px 20px",
            border: "1px solid rgba(201,169,110,0.15)",
            borderLeft: "3px solid rgba(201,169,110,0.3)",
            background: "rgba(201,169,110,0.03)",
          }}
        >
          <SkeletonLine width="18px" height="18px" />
          <SkeletonLine width="300px" height="11px" />
          <SkeletonLine
            width="90px"
            height="28px"
            style={{ marginLeft: "auto" }}
          />
        </div>

        {/* Progress nudge skeleton */}
        <div
          style={{
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "10px 20px",
            border: "1px solid rgba(0,48,73,0.06)",
          }}
        >
          <SkeletonLine width="220px" height="10px" />
          <SkeletonLine width="100%" height="2px" />
        </div>

        {/* Featured card skeleton */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <SkeletonLine width="160px" height="12px" />
            <SkeletonLine width="70px" height="10px" />
          </div>
          {/* Featured card — 3 column layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "96px 1fr 200px",
              minHeight: 200,
              border: "1px solid rgba(201,169,110,0.18)",
              borderLeft: "5px solid rgba(201,169,110,0.3)",
              overflow: "hidden",
            }}
          >
            <div className="disc-skeleton-shimmer" style={{ opacity: 0.6 }} />
            <div
              style={{
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                borderRight: "1px solid rgba(0,48,73,0.06)",
              }}
            >
              <SkeletonLine width="140px" height="10px" />
              <SkeletonLine width="70%" height="26px" />
              <SkeletonLine width="50%" height="10px" />
              <SkeletonLine width="45%" height="20px" />
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <SkeletonLine
                  width="52px"
                  height="20px"
                  style={{ borderRadius: "50vh" }}
                />
                <SkeletonLine
                  width="64px"
                  height="20px"
                  style={{ borderRadius: "50vh" }}
                />
              </div>
            </div>
            <div
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <SkeletonLine width="80%" height="48px" />
              <SkeletonLine width="60%" height="10px" />
              <SkeletonLine width="100%" height="3px" />
              <SkeletonLine width="70%" height="10px" />
              <SkeletonLine
                width="100%"
                height="40px"
                style={{ marginTop: "auto" }}
              />
            </div>
          </div>
        </div>

        {/* Results bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: "1px solid rgba(0,48,73,0.06)",
            gap: 12,
          }}
        >
          <SkeletonLine width="150px" height="14px" />
          <div style={{ display: "flex", gap: 6 }}>
            {[82, 78, 88, 76].map((w, i) => (
              <SkeletonLine key={i} width={`${w}px`} height="28px" />
            ))}
            <SkeletonLine width="72px" height="28px" />
          </div>
        </div>

        {/* Grid skeleton — 3 columns, 9 cards staggered */}
        <div className="disc-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} delay={i * 40} />
          ))}
        </div>
      </main>
    </div>
  );
}
