import { SubShell } from "../_components/SubShell";

export default function SettingsPayments() {
  return (
    <SubShell
      title="Payments & tax"
      body="Stripe Connect account, Venmo backup, payout cadence, and 1099-K tax document download. Cashout from Earnings; this is the long-form configuration surface."
      cta={{ href: "/creator/wallet", label: "Open payments wallet" }}
    />
  );
}
