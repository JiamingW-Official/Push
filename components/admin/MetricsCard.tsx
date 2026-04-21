import styles from "./MetricsCard.module.css";

export interface MetricsCardProps {
  label: string;
  value: string | number;
  /** Brand hex color used for the 4px border and the value text. */
  color: string;
}

export default function MetricsCard({ label, value, color }: MetricsCardProps) {
  return (
    <div className={styles.card} style={{ borderColor: color }}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value} style={{ color }}>
        {value}
      </span>
    </div>
  );
}
