import './tier-badge.css';

export interface TierBadgeProps {
  tier: 'seed' | 'explorer' | 'operator' | 'proven' | 'closer' | 'partner';
}

const tierCopy: Record<TierBadgeProps['tier'], { prefix: string; label: string }> = {
  seed: { prefix: 'Clay', label: 'Seed' },
  explorer: { prefix: 'Bronze', label: 'Explorer' },
  operator: { prefix: 'Steel', label: 'Operator' },
  proven: { prefix: 'Gold', label: 'Proven' },
  closer: { prefix: 'Ruby', label: 'Closer' },
  partner: { prefix: 'Obsidian', label: 'Partner' },
};

export function TierBadge({ tier }: TierBadgeProps) {
  const copy = tierCopy[tier];

  return <span className={`ms-tier-badge ms-tier-badge--${tier}`}>{copy.prefix} · {copy.label}</span>;
}
