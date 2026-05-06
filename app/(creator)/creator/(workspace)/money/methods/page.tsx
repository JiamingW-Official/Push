import { MoneySubShell } from "../_components/MoneySubShell";
import "../money.css";

export default function MoneyMethods() {
  return (
    <MoneySubShell
      title="Methods"
      body="Stripe Connect (primary, 1099-K reporting) and Venmo (backup). Update bank, switch destination, or revoke access from the legacy wallet view."
      cta={[
        {
          href: "/creator/wallet",
          label: "Edit payout methods",
          variant: "primary",
        },
        { href: "/creator/money", label: "← Back to hub", variant: "ghost" },
      ]}
    />
  );
}
