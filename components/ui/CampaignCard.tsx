import type { CampaignPin } from "@/components/layout/MapView";
import styles from "./CampaignCard.module.css";

type Props = {
  campaign: CampaignPin & {
    deadline?: string | null;
    description?: string | null;
  };
  active?: boolean;
  onClick?: () => void;
};

export default function CampaignCard({ campaign: c, active, onClick }: Props) {
  const spotsUrgent = c.spots_remaining <= 2;

  return (
    <div
      className={`${styles.card} ${active ? styles.active : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className={styles.header}>
        <div className={styles.payout}>${c.payout}</div>
        <span
          className={`${styles.spots} ${spotsUrgent ? styles.spotsUrgent : ""}`}
        >
          {c.spots_remaining} spot{c.spots_remaining !== 1 ? "s" : ""} left
        </span>
      </div>

      <p className={styles.business}>{c.business_name}</p>
      <h3 className={styles.title}>{c.title}</h3>

      {c.description && <p className={styles.description}>{c.description}</p>}

      {c.deadline && (
        <p className={styles.deadline}>
          Deadline:{" "}
          {new Date(c.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      )}

      <button className={`btn btn-secondary ${styles.cta}`}>Apply</button>
    </div>
  );
}
