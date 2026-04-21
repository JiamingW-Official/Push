import styles from "./ProgressBar.module.css";

export interface ProgressBarProps {
  /** Current stamp count. Clamped to [0, max] internally. */
  current: number;
  /** Total stamps required for reward. Expected ≥ 1. */
  max: number;
  /** Fill color. Defaults to Flag Red (brand primary). */
  color?: string;
  /** Optional aria-label override for screen readers. */
  ariaLabel?: string;
}

export default function ProgressBar({
  current,
  max,
  color,
  ariaLabel,
}: ProgressBarProps) {
  const safeMax = Math.max(1, max);
  const safeCurrent = Math.min(Math.max(0, current), safeMax);
  const pct = (safeCurrent / safeMax) * 100;

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeCurrent}
      aria-label={ariaLabel ?? `${safeCurrent} of ${safeMax} stamps`}
    >
      <div
        className={styles.fill}
        style={{
          width: `${pct}%`,
          ...(color ? { background: color } : null),
        }}
      />
      <span className={styles.label}>
        {safeCurrent}/{safeMax}
      </span>
    </div>
  );
}
