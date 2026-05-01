/*
 * DEPRECATED — /creator/explore is superseded by /creator/discover.
 *
 * Unique features that existed here (not yet in /discover):
 *   - Leaflet map view (MapView component, "map" view mode alongside grid/list)
 *   - 6-tier filter chip (seed → explorer → operator → proven → closer → partner)
 *   - Dual payout range sliders (budgetMin / budgetMax, 0–$5000)
 *   - Distance radius slider in km (0–30 km from NYC)
 *   - Deadline filter (today / this week / this month)
 *   - Infinite scroll with IntersectionObserver sentinel
 *   - creatorMock.explore() API integration (vs. MOCK_CAMPAIGNS in discover)
 *
 * If these features need to be ported, target /creator/(workspace)/discover/.
 */

import { redirect } from "next/navigation";

export default function ExplorePage() {
  redirect("/creator/discover");
}
