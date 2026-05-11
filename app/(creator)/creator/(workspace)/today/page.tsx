/* ============================================================
   /creator/today — REDIRECT to /creator/work
   v3 · 2026-05-08 night

   Today and Work were 80% redundant: NEXT MOVE / NEEDS YOU / SCHEDULE /
   OPPS panels on Today duplicated NEXT MOVE / ACTIVE / TODAY / DISCOVER
   panels on Work. Today's two unique panels (THIS WEEK milestone +
   PULSE 24h KPIs) have been folded into Work as native panels —
   nothing is lost. /creator/today now redirects so legacy deep-links
   keep working; sidebar nav drops the Today menu item entirely.
   ============================================================ */

import { redirect } from "next/navigation";

export default function TodayRedirect() {
  redirect("/creator/work");
}
