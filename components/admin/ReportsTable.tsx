import styles from "./ReportsTable.module.css";

export interface ReportRow {
  /** ISO 8601 week start date. */
  week_start: string;
  merchant_id: string;
  merchant_name: string;
  verified_customers: number;
  revenue: number;
  /** Percentage number (e.g. 250 = 250%). */
  roi: number;
}

export interface ReportsTableProps {
  data: ReportRow[];
}

export default function ReportsTable({ data }: ReportsTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Week Start</th>
            <th scope="col">Merchant</th>
            <th scope="col" style={{ textAlign: "center" }}>
              Customers
            </th>
            <th scope="col" style={{ textAlign: "right" }}>
              Revenue
            </th>
            <th scope="col" style={{ textAlign: "right" }}>
              ROI
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={`${row.merchant_id}-${row.week_start}`}>
              <td className={styles.weekCell}>{formatDate(row.week_start)}</td>
              <td className={styles.merchantCell}>{row.merchant_name}</td>
              <td className={styles.customersCell}>{row.verified_customers}</td>
              <td className={styles.revenueCell}>{formatUsd(row.revenue)}</td>
              <td className={styles.roiCell}>{formatRoi(row.roi)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** ISO 8601 → MM/DD/YYYY (UTC, SSR-safe). */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

function formatRoi(n: number): string {
  return `${n.toFixed(1)}%`;
}
