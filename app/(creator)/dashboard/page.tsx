// Legacy /dashboard route — redirects to unified creator cockpit at /creator/dashboard.
// Kept as a thin redirect so stale links and old supabase redirects don't 404.

import { redirect } from "next/navigation";

export default function LegacyDashboardRedirect() {
  redirect("/creator/dashboard");
}
