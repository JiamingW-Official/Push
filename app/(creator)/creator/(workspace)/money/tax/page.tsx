import { MoneySubShell } from "../_components/MoneySubShell";
import "../money.css";

export default function MoneyTax() {
  return (
    <MoneySubShell
      title="Tax"
      body="Your 1099-K estimate, monthly earnings chart, and W-9 status. Push reports payouts ≥ $600/year per IRS rules. Download forms anytime."
      cta={[
        {
          href: "/creator/wallet",
          label: "Open tax center",
          variant: "primary",
        },
        { href: "/creator/money", label: "← Back to hub", variant: "ghost" },
      ]}
    />
  );
}
