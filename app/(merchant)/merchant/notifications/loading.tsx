import "./notifications.css";

/* ── Notifications Loading Skeleton ───────────────────────────
 * Mirrors NotificationsClient: page header + filter toggle row
 * + 8 notification rows. Wrapped in `.notif-page` to inherit
 * the page atmospheric backdrop + Liquid Glass tokens.
 * ============================================================ */

const SKEL_BG =
  "linear-gradient(90deg,var(--surface-3) 25%,var(--mist,#d8d4c8) 50%,var(--surface-3) 75%)";

const skel: React.CSSProperties = {
  background: SKEL_BG,
  backgroundSize: "600px 100%",
  animation: "notif-shimmer 1.4s infinite linear",
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

export default function NotificationsLoading() {
  return (
    <section
      className="notif-page"
      role="status"
      aria-label="Loading notifications"
      aria-busy="true"
    >
      <style>{`@keyframes notif-shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <Bar w={180} h={12} style={{ marginBottom: 12 }} />
        <Bar w="min(360px, 56%)" h={40} style={{ marginBottom: 12 }} />
        <Bar w="min(520px, 78%)" h={14} />
      </div>

      {/* Filter chip row */}
      <div
        className="notif-actions"
        style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}
        aria-hidden="true"
      >
        {[112, 96, 88, 104].map((w, i) => (
          <Bar key={i} w={w} h={32} style={{ borderRadius: 999 }} />
        ))}
      </div>

      {/* Notification rows */}
      <ul
        className="notif-list"
        aria-label="Loading notifications"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <li
            key={i}
            className="notif-item"
            style={{ pointerEvents: "none", animationDelay: `${i * 30}ms` }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr auto",
                gap: 16,
                alignItems: "center",
                padding: 16,
              }}
            >
              {/* icon tile */}
              <Bar w={40} h={40} style={{ borderRadius: 12 }} />
              {/* body */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <Bar w={`${50 + (i % 3) * 12}%`} h={14} />
                <Bar w={`${65 + (i % 4) * 8}%`} h={12} />
              </div>
              {/* time */}
              <Bar w={56} h={12} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
