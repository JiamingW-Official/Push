"use client";

/* ============================================================
   <StageRouter> — switches the right panel by effective stage
   v1 · 2026-05-10
   ============================================================ */

import type { Campaign } from "@/lib/mocks/campaigns";
import type { CreatorApplication } from "@/lib/data/hooks/useCreatorApplications";
import { useApplicationStage } from "@/lib/services/application-stage";

import { Stage1ReviewingPanel } from "./panels/Stage1ReviewingPanel";
import { Stage2AcceptedPanel } from "./panels/Stage2AcceptedPanel";
import { Stage3PreShootPanel } from "./panels/Stage3PreShootPanel";
import { Stage4ShootLivePanel } from "./panels/Stage4ShootLivePanel";
import { Stage5PendingUploadPanel } from "./panels/Stage5PendingUploadPanel";
import { Stage6SubmittedPanel } from "./panels/Stage6SubmittedPanel";
import { Stage7aRevisionPanel } from "./panels/Stage7aRevisionPanel";
import { Stage8VerifiedPanel } from "./panels/Stage8VerifiedPanel";
import { Stage9PaidPanel } from "./panels/Stage9PaidPanel";
import { TerminalDeclinedPanel } from "./panels/TerminalDeclinedPanel";

export interface StagePanelProps {
  application: CreatorApplication;
  campaign: Campaign;
}

export function StageRouter({ application, campaign }: StagePanelProps) {
  const stage = useApplicationStage(application);

  switch (stage) {
    case "reviewing":
      return (
        <Stage1ReviewingPanel application={application} campaign={campaign} />
      );
    case "accepted":
      return (
        <Stage2AcceptedPanel application={application} campaign={campaign} />
      );
    case "pre_shoot":
      return (
        <Stage3PreShootPanel application={application} campaign={campaign} />
      );
    case "shoot_live":
      return (
        <Stage4ShootLivePanel application={application} campaign={campaign} />
      );
    case "pending_upload":
      return (
        <Stage5PendingUploadPanel
          application={application}
          campaign={campaign}
        />
      );
    case "submitted":
      return (
        <Stage6SubmittedPanel application={application} campaign={campaign} />
      );
    case "revision_requested":
      return (
        <Stage7aRevisionPanel application={application} campaign={campaign} />
      );
    case "verified":
      // Stage 7b (just approved) and Stage 8 (payout countdown) share the
      // verified status. We treat them as Stage 8 view (countdown) — the
      // 7b celebratory beat is the first 5s of the 8-panel.
      return (
        <Stage8VerifiedPanel application={application} campaign={campaign} />
      );
    case "paid":
      return <Stage9PaidPanel application={application} campaign={campaign} />;
    case "declined":
    case "withdrawn":
      return (
        <TerminalDeclinedPanel application={application} campaign={campaign} />
      );
    default:
      return (
        <Stage1ReviewingPanel application={application} campaign={campaign} />
      );
  }
}
