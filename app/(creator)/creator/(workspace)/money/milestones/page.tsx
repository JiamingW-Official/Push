import { MoneySubShell } from "../_components/MoneySubShell";
import "../money.css";

export default function MoneyMilestones() {
  return (
    <MoneySubShell
      title="Milestones"
      body="Live progress toward your next bonus thresholds. Each accepted gig has a Guaranteed → Target → Stretch payout ladder; this view tracks every campaign in flight."
      cta={[
        {
          href: "/creator/gigs/active",
          label: "View active gigs",
          variant: "primary",
        },
        { href: "/creator/money", label: "← Back to hub", variant: "ghost" },
      ]}
    />
  );
}
