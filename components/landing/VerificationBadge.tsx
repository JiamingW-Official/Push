/* ============================================================
   VerificationBadge — 3-layer AI verification visual
   QR scan · Claude Vision · Geo-match
   ============================================================ */

function QrIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="6" height="6" />
      <rect x="13" y="3" width="6" height="6" />
      <rect x="3" y="13" width="6" height="6" />
      <path d="M13 13h2v2M17 13v6M13 17h2v2M15 15h4" />
    </svg>
  );
}

function VisionIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M1.5 11c2.5-5 6-7 9.5-7s7 2 9.5 7c-2.5 5-6 7-9.5 7s-7-2-9.5-7z" />
      <circle cx="11" cy="11" r="3.2" />
      <path d="M11 9.5v3M9.5 11h3" />
    </svg>
  );
}

function GeoIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M11 2c-3.866 0-7 3.134-7 7 0 5.5 7 11 7 11s7-5.5 7-11c0-3.866-3.134-7-7-7z" />
      <circle cx="11" cy="9" r="2.5" />
    </svg>
  );
}

const LAYERS = [
  {
    key: "qr",
    label: "QR Scan",
    sub: "at point of entry",
    icon: <QrIcon />,
  },
  {
    key: "vision",
    label: "Claude Vision",
    sub: "receipt OCR · merchant match",
    icon: <VisionIcon />,
  },
  {
    key: "geo",
    label: "Geo-match",
    sub: "within 200m · <8s",
    icon: <GeoIcon />,
  },
];

export default function VerificationBadge() {
  return (
    <div className="verify-badge">
      <div className="verify-badge-head">
        <span className="rule" />
        <span className="verify-badge-eyebrow">AI Verification Layer</span>
      </div>
      <div className="verify-badge-row">
        {LAYERS.map((layer, i) => (
          <div
            key={layer.key}
            className="verify-badge-col"
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <div className="verify-badge-icon">{layer.icon}</div>
            <span className="verify-badge-label">{layer.label}</span>
            <span className="verify-badge-sub">{layer.sub}</span>
            {i < LAYERS.length - 1 && (
              <span className="verify-badge-connector" aria-hidden="true">
                &rarr;
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="verify-badge-tagline">
        All three must pass within 8 seconds. No verification, no charge.
      </p>
    </div>
  );
}
