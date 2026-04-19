import { redirect } from "next/navigation";

export default function LegacyDashboardPage() {
  redirect("/creator/inbox");
}
