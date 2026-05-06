import { SubShell } from "../_components/SubShell";

export default function SettingsPrivacy() {
  return (
    <SubShell
      title="Privacy & data"
      body="Public profile visibility, DSAR (data subject access request) export, and account deletion. CCPA + GDPR compliant with a 45-day SLA."
      cta={{ href: "/my-privacy", label: "Open privacy controls" }}
    />
  );
}
