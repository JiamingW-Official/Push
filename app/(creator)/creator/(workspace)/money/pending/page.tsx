import { MoneySubShell } from "../_components/MoneySubShell";
import "../money.css";

export default function MoneyPending() {
  return (
    <MoneySubShell
      title="Pending"
      body="Payouts in flight. Once cleared, funds become cashable from /earnings — typically 1-3 business days after merchant settlement."
      cta={[
        {
          href: "/creator/wallet",
          label: "View payout wallet",
          variant: "primary",
        },
        { href: "/creator/money", label: "← Back to hub", variant: "ghost" },
      ]}
    />
  );
}
