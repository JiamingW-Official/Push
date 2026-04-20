import styles from "./ReferralTable.module.css";

export interface ReferralRow {
  /** ISO 8601 timestamp of the referral event. */
  date: string;
  merchant_name: string;
  customer_name: string;
  status: "verified" | "pending" | "rejected";
  /** Commission in USD. `0` for rejected claims. */
  commission: number;
}

export interface ReferralTableProps {
  data: ReferralRow[];
}

const STATUS_BG: Record<ReferralRow["status"], string> = {
  verified: "#c1121f", // Flag Red
  pending: "#669bbc", // Steel Blue
  rejected: "#780000", // Molten Lava
};

export default function ReferralTable({ data }: ReferralTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Merchant</th>
            <th>Customer</th>
            <th style={{ textAlign: "center" }}>Status</th>
            <th style={{ textAlign: "right" }}>Commission</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={`${row.date}-${row.customer_name}-${idx}`}>
              <td className={styles.dateCell}>{formatDateTime(row.date)}</td>
              <td className={styles.merchantCell}>{row.merchant_name}</td>
              <td className={styles.customerCell} title={row.customer_name}>
                {row.customer_name}
              </td>
              <td style={{ textAlign: "center" }}>
                <span
                  className={styles.badge}
                  style={{ backgroundColor: STATUS_BG[row.status] }}
                >
                  {row.status}
                </span>
              </td>
              <td className={styles.commissionCell}>
                {formatUsd(row.commission)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** ISO 8601 → `MM/DD/YYYY HH:MM` (UTC, to avoid SSR/client hydrate drift). */
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  return `${mm}/${dd}/${yyyy} ${hh}:${mi}`;
}

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}
