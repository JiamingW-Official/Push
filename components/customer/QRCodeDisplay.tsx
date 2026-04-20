import styles from "./QRCodeDisplay.module.css";

export interface QRCodeDisplayProps {
  /** Optional QR image URL. When provided, renders as <img>. */
  qr_code?: string | null;
  /** Human-readable fallback code, e.g. "12345-67890-12345". Shown only
   *  when `qr_code` is missing. */
  numeric_code?: string;
}

export default function QRCodeDisplay({
  qr_code,
  numeric_code,
}: QRCodeDisplayProps) {
  if (qr_code) {
    return (
      <div className={styles.wrapper}>
        {/* Plain <img> — this route is a customer-facing static view, no
            need to pull in next/image and its domain allowlist. */}
        <img
          className={styles.qrImage}
          src={qr_code}
          alt="Loyalty card QR code"
          width={200}
          height={200}
        />
        <span className={styles.caption}>扫描确认消费</span>
      </div>
    );
  }

  if (numeric_code) {
    return (
      <div className={styles.numericWrapper}>
        <code className={styles.numericCode}>{numeric_code}</code>
        <span className={styles.numericHint}>向店员出示此编号</span>
      </div>
    );
  }

  return <span className={styles.empty}>no code available</span>;
}
