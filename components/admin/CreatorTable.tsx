import styles from "./CreatorTable.module.css";

export interface CreatorRow {
  id: string;
  tier: 1 | 2 | 3;
  status: "prospect" | "early_operator" | "active" | "churn";
  performance_score: number;
  recruitment_source: string;
  signed_date: string;
}

export interface CreatorTableProps {
  data: CreatorRow[];
}

const STATUS_COLORS: Record<CreatorRow["status"], string> = {
  active: "var(--primary)", // Flag Red
  prospect: "var(--tertiary)", // Steel Blue
  early_operator: "var(--accent)", // Molten Lava
  churn: "var(--accent)", // Molten Lava
};

export default function CreatorTable({ data }: CreatorTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tier</th>
            <th scope="col">Status</th>
            <th scope="col" style={{ textAlign: "right" }}>
              Score
            </th>
            <th scope="col">Source</th>
            <th scope="col">Signed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className={styles.idCell}>{shortenId(row.id)}</td>
              <td className={styles.tierCell}>T{row.tier}</td>
              <td>
                <span
                  className={styles.badge}
                  style={{ color: STATUS_COLORS[row.status] }}
                >
                  <span className="sr-only">Status: </span>
                  {row.status.replace("_", " ")}
                </span>
              </td>
              <td className={styles.scoreCell}>
                {row.performance_score.toFixed(2)}
              </td>
              <td className={styles.sourceCell}>
                {row.recruitment_source.replace("_", " ")}
              </td>
              <td className={styles.dateCell}>{formatDate(row.signed_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Show first 8 chars of a UUID-ish id, then ellipsis. */
function shortenId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

/** ISO 8601 → MM/DD/YYYY (UTC, to avoid timezone flicker on SSR hydrate). */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${mm}/${dd}/${yyyy}`;
}
