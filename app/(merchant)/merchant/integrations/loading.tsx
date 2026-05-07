import "./integrations.css";

/* ── Integrations Loading Skeleton ────────────────────────────
 * Mirrors integrations/page.tsx: featured strip + page header
 * with stat tile + 3-col integration card grid.
 * Wrapped in `.int-shell` so atmospheric backdrop applies.
 * ============================================================ */

const SKEL_BG =
  "linear-gradient(90deg,var(--surface-3) 25%,var(--mist,#d8d4c8) 50%,var(--surface-3) 75%)";

const skel: React.CSSProperties = {
  background: SKEL_BG,
  backgroundSize: "600px 100%",
  animation: "int-shimmer 1.4s infinite linear",
  borderRadius: 8,
};

function Bar({
  w,
  h,
  style,
}: {
  w: string | number;
  h: string | number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        ...skel,
        width: typeof w === "number" ? `${w}px` : w,
        height: typeof h === "number" ? `${h}px` : h,
        ...style,
      }}
    />
  );
}

export default function IntegrationsLoading() {
  return (
    <div
      className="int-shell"
      role="status"
      aria-label="Loading integrations"
      aria-busy="true"
    >
      <style>{`@keyframes int-shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>

      {/* Featured strip */}
      <section className="int-featured" aria-hidden="true">
        <Bar w={88} h={10} style={{ marginBottom: 16 }} />
        <div
          className="int-featured__track"
          style={{ display: "flex", gap: 16, overflow: "hidden" }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 280px",
                background: "var(--snow,#fff)",
                borderRadius: 16,
                padding: 20,
                border: "0.5px solid rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Bar w={40} h={40} style={{ borderRadius: 12 }} />
                <Bar w="60%" h={16} />
              </div>
              <Bar w="100%" h={12} />
              <Bar w="80%" h={12} />
              <Bar w={96} h={32} style={{ marginTop: 8 }} />
            </div>
          ))}
        </div>
      </section>

      <main className="int-main">
        {/* Page header with stat tile */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
          aria-hidden="true"
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <Bar w={140} h={12} style={{ marginBottom: 12 }} />
            <Bar w="min(360px, 80%)" h={40} style={{ marginBottom: 12 }} />
            <Bar w="min(440px, 90%)" h={14} />
          </div>
          {/* Liquid-glass stat tile */}
          <div
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
              borderRadius: 16,
              padding: 24,
              border: "0.5px solid rgba(0,0,0,0.06)",
              minWidth: 200,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
              <Bar w={48} h={32} />
              <Bar w={16} h={20} />
              <Bar w={32} h={20} />
            </div>
            <Bar w={88} h={10} />
          </div>
        </div>

        {/* Section header */}
        <div style={{ marginBottom: 16 }} aria-hidden="true">
          <Bar w={120} h={12} style={{ marginBottom: 8 }} />
          <Bar w={200} h={20} />
        </div>

        {/* Integration card grid */}
        <div
          className="int-grid"
          aria-hidden="true"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "var(--snow,#fff)",
                borderRadius: 16,
                padding: 20,
                border: "0.5px solid rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Bar w={40} h={40} style={{ borderRadius: 12 }} />
                <Bar w={64} h={20} style={{ borderRadius: 999 }} />
              </div>
              <Bar w="70%" h={16} />
              <Bar w="100%" h={12} />
              <Bar w="85%" h={12} />
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <Bar w={88} h={32} />
                <Bar w={72} h={32} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
