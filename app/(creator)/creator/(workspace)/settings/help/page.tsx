import { SubShell } from "../_components/SubShell";

export default function SettingsHelp() {
  return (
    <SubShell
      title="Help & support"
      body="Knowledge base, status page, recent changelog, and a direct line to the Push concierge team. Most answers land within 24 hours."
      cta={{ href: "/help", label: "Browse help center" }}
    />
  );
}
