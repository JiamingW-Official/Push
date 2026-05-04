'use client';

import { useState } from 'react';
type CampaignActionStatus = 'active' | 'paused' | 'draft' | 'closed';

interface CampaignActionsProps {
  initialStatus: CampaignActionStatus;
}

function nextPrimaryLabel(status: CampaignActionStatus): string {
  if (status === 'active') return 'Pause Campaign';
  if (status === 'paused') return 'Resume Campaign';
  return 'Close Campaign';
}

export function CampaignActions({ initialStatus }: CampaignActionsProps) {
  const [status, setStatus] = useState<CampaignActionStatus>(initialStatus);

  const onPrimaryClick = () => {
    if (status === 'active') setStatus('paused');
    else if (status === 'paused') setStatus('active');
    else setStatus('closed');
  };

  return (
    <div className="cd-actions">
      <button className="btn-primary cd-action-primary" onClick={onPrimaryClick} type="button">
        {nextPrimaryLabel(status)}
      </button>
      <button className="btn-ghost cd-action-ghost" type="button">
        Edit details
      </button>
      <button className="btn-ghost cd-action-ghost" type="button">
        Download report
      </button>
    </div>
  );
}
