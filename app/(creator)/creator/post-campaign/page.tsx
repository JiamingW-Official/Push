"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PostCampaignRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const campaignId = searchParams.get("campaign_id");
    if (campaignId) {
      router.replace(`/creator/work/campaign/${campaignId}?celebrate=1`);
    } else {
      router.replace("/creator/inbox");
    }
  }, [router, searchParams]);

  return null;
}

export default function LegacyPostCampaignPage() {
  return (
    <Suspense>
      <PostCampaignRedirect />
    </Suspense>
  );
}
