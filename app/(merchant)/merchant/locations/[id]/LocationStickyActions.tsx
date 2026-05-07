'use client';

import { useState } from 'react';

interface LocationStickyActionsProps {
  locationId: string;
  initialStatus: 'open' | 'closed';
}

export default function LocationStickyActions({
  locationId,
  initialStatus,
}: LocationStickyActionsProps) {
  const [status, setStatus] = useState<'open' | 'closed'>(initialStatus);
  const [feedback, setFeedback] = useState<string | null>(null);

  const onOrderPosters = () => {
    if (typeof window === 'undefined') return;
    const url = `/merchant/qr-codes?location=${encodeURIComponent(locationId)}`;
    window.location.href = url;
  };

  const onTogglePause = () => {
    setStatus((prev) => (prev === 'open' ? 'closed' : 'open'));
    setFeedback(
      status === 'open'
        ? 'Location paused locally — refresh to confirm with server.'
        : 'Location resumed locally — refresh to confirm with server.',
    );
  };

  return (
    <>
      <button type="button" className="btn-primary location-sticky-btn" onClick={onOrderPosters}>
        Order QR Posters
      </button>
      <button type="button" className="btn-ghost location-sticky-btn" onClick={onTogglePause}>
        {status === 'open' ? 'Pause location' : 'Resume location'}
      </button>
      {feedback ? (
        <p className="location-sticky-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}
    </>
  );
}
