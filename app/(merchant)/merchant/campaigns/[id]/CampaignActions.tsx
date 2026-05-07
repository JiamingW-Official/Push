"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/toast/Toaster";
type CampaignActionStatus = "active" | "paused" | "draft" | "closed";

interface CampaignActionsProps {
  initialStatus: CampaignActionStatus;
}

function nextPrimaryLabel(status: CampaignActionStatus): string {
  if (status === "active") return "Pause Campaign";
  if (status === "paused") return "Resume Campaign";
  return "Close Campaign";
}

export function CampaignActions({ initialStatus }: CampaignActionsProps) {
  const [status, setStatus] = useState<CampaignActionStatus>(initialStatus);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const campaignId = params?.id ?? "campaign";

  const onPrimaryClick = () => {
    if (status === "active") {
      setStatus("paused");
      toast.warn(`Campaign ${campaignId} paused`);
    } else if (status === "paused") {
      setStatus("active");
      toast.success(`Campaign ${campaignId} resumed`);
    } else {
      setStatus("closed");
      toast.info(`Campaign ${campaignId} closed`);
    }
  };

  const onEditClick = () => {
    // No /merchant/campaigns/[id]/edit route yet — surface playtest feedback
    // and route the user back to the new-campaign wizard as the closest match.
    toast.info(`Editing ${campaignId}`, {
      body: "Opening campaign wizard…",
    });
    router.push("/merchant/campaigns/new");
  };

  const onDownloadClick = () => {
    toast.success(`Report for ${campaignId} ready`, {
      body: "CSV download started (playtest).",
    });
  };

  return (
    <div className="cd-actions">
      <button
        className="btn-primary cd-action-primary"
        onClick={onPrimaryClick}
        type="button"
      >
        {nextPrimaryLabel(status)}
      </button>
      <button
        className="btn-ghost cd-action-ghost"
        type="button"
        onClick={onEditClick}
      >
        Edit details
      </button>
      <button
        className="btn-ghost cd-action-ghost"
        type="button"
        onClick={onDownloadClick}
      >
        Download report
      </button>
    </div>
  );
}
