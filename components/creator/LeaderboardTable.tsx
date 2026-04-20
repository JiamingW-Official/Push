import styles from "./LeaderboardTable.module.css";

export interface LeaderboardRow {
  rank: number;
  creator_name: string;
  weekly_referrals: number;
  /** Earnings in USD. */
  weekly_earnings: number;
}

export interface LeaderboardTableProps {
  data: LeaderboardRow[];
  /**
   * Name of the currently logged-in creator. The matching row is
   * highlighted with the "you" tag + accent background. Defaults to
   * `undefined`, in which case no row is highlighted.
   */
  currentCreatorName?: string;
}

export default function LeaderboardTable({
  data,
  currentCreatorName,
}: LeaderboardTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Rank</th>
            <th>Name</th>
            <th style={{ textAlign: "center" }}>Weekly Referrals</th>
            <th style={{ textAlign: "right" }}>Weekly Earnings</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isCurrent = row.creator_name === currentCreatorName;
            return (
              <tr
                key={`${row.rank}-${row.creator_name}`}
                className={isCurrent ? styles.currentRow : undefined}
                aria-current={isCurrent ? "true" : undefined}
              >
                <td className={styles.rankCell}>{row.rank}</td>
                <td className={styles.nameCell}>
                  {row.creator_name}
                  {isCurrent && <span className={styles.youTag}>you</span>}
                </td>
                <td className={styles.referralsCell}>{row.weekly_referrals}</td>
                <td className={styles.earningsCell}>
                  {formatUsd(row.weekly_earnings)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}
