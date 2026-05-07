import "./disputes.css";

/* ── Disputes Loading Skeleton ────────────────────────────────
 * Mirrors disputes/page.tsx: page header + 3-stat row + filter
 * pills + 5 dispute cards. Wrapped in `.disp-page`.
 * ============================================================ */

const SKEL_BG =
  "linear-gradient(90deg,var(--surface-3) 25%,var(--mist,#d8d4c8) 50%,var(--surface-3) 75%)";

const skel: React.CSSProperties = {
  background: SKEL_BG,
  backgroundSize: "600px 100%",
  animation: "disp-shimmer 1.4s infinite linear",
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

export default function DisputesLoading() {
  return (
    <div
      className="disp-page"
      role="status"
      aria-label="Loading disputes"
      aria-busy="true"
      style={{
        minHeight: "100svh",
        background: "var(--surface)",
        fontFamily: "var(--font-body)",
      }}
    >
      <style>{`@keyframes disp-shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>

      {/* Page header */}
      <div
        style={{
          padding: "40px 32px 32px",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Bar w={140} h={12} style={{ marginBottom: 12 }} />
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <Bar w="min(360px, 60%)" h={40} />
            <Bar w={160} h={40} />
          </div>
          <Bar w="min(460px, 70%)" h={14} style={{ marginTop: 16 }} />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        {/* Stats row (3 KPIs) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
          aria-hidden="true"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "var(--snow,#fff)",
                borderRadius: 12,
                padding: 20,
                border: "0.5px solid rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Bar w={88} h={10} />
              <Bar w="50%" h={32} />
              <Bar w="70%" h={12} />
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
          aria-hidden="true"
        >
          {[80, 96, 112, 88, 104].map((w, i) => (
            <Bar key={i} w={w} h={32} style={{ borderRadius: 999 }} />
          ))}
        </div>

        {/* Dispute cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <article
              key={i}
              className="mdisp-card"
              style={{ pointerEvents: "none" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr auto",
                  gap: 16,
                  padding: 20,
                  alignItems: "center",
                }}
              >
                <Bar w={48} h={48} style={{ borderRadius: "50%" }} />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <Bar w="40%" h={14} />
                  <Bar w="65%" h={16} />
                  <div style={{ display: "flex", gap: 12 }}>
                    <Bar w={80} h={12} />
                    <Bar w={96} h={12} />
                    <Bar w={64} h={20} style={{ borderRadius: 999 }} />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "flex-end",
                  }}
                >
                  <Bar w={88} h={20} />
                  <Bar w={56} h={12} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
