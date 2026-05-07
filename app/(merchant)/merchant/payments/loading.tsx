import "./payments.css";

/* ── Payments Loading Skeleton ────────────────────────────────
 * Mirrors PaymentsClient: page header + balance hero tile (KPI)
 * + 3-col method grid + transactions table.
 * Wrapped in `.pay-page` so the page atmospheric backdrop applies.
 * ============================================================ */

const SKEL_BG =
  "linear-gradient(90deg,var(--surface-3) 25%,var(--mist,#d8d4c8) 50%,var(--surface-3) 75%)";

const skel: React.CSSProperties = {
  background: SKEL_BG,
  backgroundSize: "600px 100%",
  animation: "pay-shimmer 1.4s infinite linear",
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

export default function PaymentsLoading() {
  return (
    <section
      className="pay-page"
      role="status"
      aria-label="Loading payments"
      aria-busy="true"
    >
      <style>{`@keyframes pay-shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>

      {/* PageHeader: eyebrow + title + subtitle + action */}
      <div style={{ marginBottom: 32 }}>
        <Bar w={180} h={12} style={{ marginBottom: 12 }} />
        <Bar w="min(420px, 60%)" h={40} style={{ marginBottom: 12 }} />
        <Bar w="min(560px, 80%)" h={14} style={{ marginBottom: 24 }} />
        <Bar w={180} h={44} />
      </div>

      {/* Balance hero tile */}
      <div className="pay-kpi-grid" aria-hidden="true">
        <div
          style={{
            background: "var(--snow,#fff)",
            borderRadius: 16,
            padding: 32,
            border: "0.5px solid rgba(0,0,0,0.06)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <Bar w={140} h={10} style={{ marginBottom: 16 }} />
          <Bar w="60%" h={56} style={{ marginBottom: 16 }} />
          <Bar w={220} h={12} />
        </div>
      </div>

      <div className="pay-section-gap-sm" />

      {/* Methods section */}
      <section className="pay-section">
        <Bar w={92} h={10} style={{ marginBottom: 12 }} />
        <Bar w={240} h={32} style={{ marginBottom: 24 }} />

        <div className="pay-method-grid" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <article
              key={i}
              className="pay-method-card"
              style={{ pointerEvents: "none" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Bar w={64} h={24} />
                <Bar w={56} h={20} />
              </div>
              <Bar w="55%" h={18} style={{ marginBottom: 8 }} />
              <Bar w="40%" h={14} style={{ marginBottom: 8 }} />
              <Bar w="35%" h={12} />
            </article>
          ))}
        </div>
      </section>

      <div className="pay-section-gap-sm" />

      {/* Transactions table */}
      <section className="pay-section">
        <Bar w={120} h={10} style={{ marginBottom: 12 }} />
        <Bar w={260} h={32} style={{ marginBottom: 24 }} />

        {/* Filter chips */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {[80, 96, 112, 88].map((w, i) => (
            <Bar key={i} w={w} h={32} style={{ borderRadius: 999 }} />
          ))}
        </div>

        {/* Table rows */}
        <div
          style={{
            background: "var(--snow,#fff)",
            borderRadius: 12,
            border: "0.5px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr 1fr 96px",
                gap: 16,
                padding: 16,
                borderBottom: i < 5 ? "0.5px solid rgba(0,0,0,0.06)" : "none",
                alignItems: "center",
              }}
            >
              <Bar w={88} h={12} />
              <Bar w="80%" h={14} />
              <Bar w={64} h={20} style={{ borderRadius: 999 }} />
              <Bar w={72} h={14} />
              <Bar w={72} h={12} />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
