import { MoneySubShell } from "../_components/MoneySubShell";
import "../money.css";

export default function MoneyEarnings() {
  return (
    <MoneySubShell
      title="Earnings"
      body="This-period earnings decomposed into Guaranteed base, scan commission, and milestone bonuses. The legacy /earnings page remains the deep view until the bento sub-page is fully built out."
      cta={[
        {
          href: "/creator/earnings",
          label: "Open legacy earnings",
          variant: "primary",
        },
        { href: "/creator/money", label: "← Back to hub", variant: "ghost" },
      ]}
    />
  );
}
