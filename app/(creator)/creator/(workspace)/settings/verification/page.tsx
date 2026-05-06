import { SubShell } from "../_components/SubShell";

export default function SettingsVerification() {
  return (
    <SubShell
      title="Verification"
      body="Government ID upload, address proof, and FTC disclosure language. Verification unlocks higher-paying tiers and required-disclosure campaigns."
      cta={{ href: "/creator/verify", label: "Run verification flow" }}
    />
  );
}
