/* ============================================================
   /campaign/[id] — legacy redirect (v15 · 2026-05-09)

   The campaign detail page moved into the creator workspace
   layout (gets sidebar + shares SWR cache). Old deep links to
   /campaign/[id] still work via this redirect.
   ============================================================ */

import { redirect } from "next/navigation";

export default async function CampaignLegacyRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/creator/campaign/${id}`);
}
