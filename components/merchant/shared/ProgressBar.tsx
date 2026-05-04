import './progress-bar.css';

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'champagne' | 'tertiary';
  height?: 2 | 4 | 6;
}

export function ProgressBar({ value, max = 100, color = 'primary', height = 2 }: ProgressBarProps) {
  const safeMax = max <= 0 ? 1 : max;
  const clampedValue = Math.min(Math.max(value, 0), safeMax);

  return (
    <progress
      className={[`ms-progress`, `ms-progress--${color}`, `ms-progress--h-${height}`].join(' ')}
      max={safeMax}
      value={clampedValue}
    />
  );
}
