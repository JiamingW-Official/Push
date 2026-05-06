import { MoneySubShell } from "../_components/MoneySubShell";
import "../money.css";

export default function MoneyHistory() {
  return (
    <MoneySubShell
      title="Transaction history"
      body="Every payout + every milestone hit + every fee. Filterable by date, status, and merchant. The full ledger lives at /earnings — that's where the deep table view sits today."
      cta={[
        {
          href: "/creator/earnings",
          label: "Open transaction ledger",
          variant: "primary",
        },
        { href: "/creator/money", label: "← Back to hub", variant: "ghost" },
      ]}
    />
  );
}
