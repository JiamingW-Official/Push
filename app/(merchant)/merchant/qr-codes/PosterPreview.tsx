interface PosterPreviewProps {
  campaign: string;
  type: string;
}

export default function PosterPreview({ campaign, type }: PosterPreviewProps) {
  return (
    <article className="qr-poster-card">
      <div className="qr-poster-head">
        <span>{campaign}</span>
        <span>{type}</span>
      </div>
      <div className="qr-poster-code" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="84" height="84" fill="none">
          <rect x="2" y="2" width="60" height="60" stroke="var(--ink)" />
          <rect x="8" y="8" width="12" height="12" fill="var(--ink)" />
          <rect x="44" y="8" width="12" height="12" fill="var(--ink)" />
          <rect x="8" y="44" width="12" height="12" fill="var(--ink)" />
          <rect x="26" y="26" width="4" height="4" fill="var(--ink)" />
          <rect x="34" y="26" width="4" height="4" fill="var(--ink)" />
          <rect x="26" y="34" width="4" height="4" fill="var(--ink)" />
          <rect x="34" y="34" width="4" height="4" fill="var(--ink)" />
        </svg>
      </div>
      <p className="qr-poster-note">Print-ready export with attribution tags.</p>
    </article>
  );
}
