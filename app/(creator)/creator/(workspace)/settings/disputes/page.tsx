import { SubShell } from "../_components/SubShell";

export default function SettingsDisputes() {
  return (
    <SubShell
      title="Disputes"
      body="Open and resolved cases. Submit appeal evidence, track decision timelines, and read final brand + admin notes. Cases close once payout adjusts."
      cta={{ href: "/creator/disputes", label: "View disputes inbox" }}
    />
  );
}
