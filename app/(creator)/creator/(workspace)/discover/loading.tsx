import "./discover.css";

/* ── Discover Loading Skeleton ────────────────────────────── */

function SkeletonBlock({
  width = "100%",
  height = "12px",
  style = {},
}: {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}) {
  return <div className="disc-skeleton" style={{ width, height, ...style }} />;
}

function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="disc-card disc-skeleton-card"
      style={{ animationDelay: `${delay}ms`, cursor: "default" }}
    >
      <div className="disc-card-inner">
        <SkeletonBlock width="65%" height="22px" style={{ marginBottom: 8 }} />
        <SkeletonBlock width="85%" height="13px" style={{ marginBottom: 24 }} />
        <div className="disc-card-bottom" style={{ alignItems: "flex-end" }}>
          <div>
            <SkeletonBlock
              width="64px"
              height="10px"
              style={{ marginBottom: 4 }}
            />
            <SkeletonBlock width="80px" height="10px" />
          </div>
          <SkeletonBlock width="48px" height="18px" />
        </div>
        <SkeletonBlock width="100%" height="40px" style={{ marginTop: 24 }} />
      </div>
    </div>
  );
}

export default function DiscoverLoading() {
  return (
    <div className="disc">
      {/* Hero skeleton */}
      <header className="disc-hero">
        <div>
          <SkeletonBlock
            width="220px"
            height="56px"
            style={{ marginBottom: 12 }}
          />
          <SkeletonBlock width="260px" height="13px" />
        </div>
      </header>

      {/* Toolbar skeleton */}
      <div className="disc-toolbar">
        <div className="disc-search-wrap">
          <SkeletonBlock width="100%" height="40px" />
        </div>
        <SkeletonBlock width="90px" height="40px" />
      </div>

      {/* Content skeleton */}
      <main className="disc-content">
        <div className="disc-results-meta" style={{ marginBottom: 32 }}>
          <SkeletonBlock width="160px" height="13px" />
          <div className="disc-sort-row" style={{ gap: 8 }}>
            {[80, 90, 96, 80].map((w, i) => (
              <SkeletonBlock key={i} width={`${w}px`} height="13px" />
            ))}
          </div>
        </div>

        {/* Grid skeleton — 6 cards */}
        <div className="disc-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} delay={i * 40} />
          ))}
        </div>
      </main>
    </div>
  );
}
