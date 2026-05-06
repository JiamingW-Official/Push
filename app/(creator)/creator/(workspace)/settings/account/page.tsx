import { SubShell } from "../_components/SubShell";

export default function SettingsAccount() {
  return (
    <SubShell
      title="Account"
      body="Display name, handle, login email, password, language, and time zone. The fields below sync across creator profile, public listings, and brand-facing notifications."
      cta={{ href: "/creator/profile", label: "Edit account profile" }}
    />
  );
}
