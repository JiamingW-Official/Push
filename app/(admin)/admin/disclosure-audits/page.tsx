import type { Metadata } from "next";
import DisclosureAuditsClient from "./DisclosureAuditsClient";

export const metadata: Metadata = {
  title: "DisclosureBot Audit Trail | Push Admin",
  description:
    "Audit trail for every creator post, scored by DisclosureBot for FTC disclosure compliance.",
  robots: { index: false, follow: false },
};

export default function DisclosureAuditsPage() {
  return <DisclosureAuditsClient />;
}
