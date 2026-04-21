import ProgressBar from "./ProgressBar";
import QRCodeDisplay from "./QRCodeDisplay";
import styles from "./LoyaltyCard.module.css";

export interface LoyaltyCardProps {
  merchant_name: string;
  creator_name: string;
  current_stamps: number;
  max_stamps: number;
  /** Optional QR image URL. Missing → numeric code is shown instead. */
  qr_code?: string | null;
  /** Human-readable fallback code. */
  numeric_code: string;
  /** ISO 8601 datetime; formatted as `YYYY-MM-DD` in the footer. */
  redeemed_at?: string | null;
}

export default function LoyaltyCard({
  merchant_name,
  creator_name,
  current_stamps,
  max_stamps,
  qr_code,
  numeric_code,
  redeemed_at,
}: LoyaltyCardProps) {
  return (
    <article className={styles.card} aria-label="Loyalty card">
      <header className={styles.header}>
        <h1 className={styles.merchantName}>{merchant_name}</h1>
        <p className={styles.creatorLine}>
          由 <span className={styles.creatorName}>{creator_name}</span> 推荐
        </p>
      </header>

      <hr className={styles.divider} />

      <section className={styles.section} aria-label="Stamp progress">
        <span className={styles.sectionLabel}>邮票进度</span>
        <ProgressBar current={current_stamps} max={max_stamps} />
        <p className={styles.stampsSummary}>
          已集{" "}
          <span className={styles.stampsSummary__count}>{current_stamps}</span>{" "}
          / {max_stamps} 枚
        </p>
      </section>

      <hr className={styles.divider} />

      <section className={styles.section} aria-label="Redemption code">
        <span className={styles.sectionLabel}>兑现码</span>
        <QRCodeDisplay qr_code={qr_code} numeric_code={numeric_code} />
      </section>

      {redeemed_at && (
        <>
          <hr className={styles.divider} />
          <div className={styles.redeemedRow}>
            <span>兑现日期</span>
            <span className={styles.redeemedRow__value}>
              {formatIsoDate(redeemed_at)}
            </span>
          </div>
        </>
      )}
    </article>
  );
}

/** ISO 8601 → `YYYY-MM-DD` (UTC, SSR-safe). */
function formatIsoDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().split("T")[0];
}
