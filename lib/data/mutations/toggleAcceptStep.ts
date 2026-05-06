import { postJson } from "./types";

export type AcceptStepId = "brief" | "disclosure" | "qr" | "calendar";

export type ToggleAcceptStepResult = {
  inviteId: string;
  stepId: AcceptStepId;
  done: boolean;
};

/**
 * Toggle one step in the post-accept checklist (read brief, sign FTC
 * disclosure, generate QR, add calendar invite). Backend persists the
 * step state on campaign_application.metadata.accept_steps so it
 * survives reloads + cross-device.
 */
export function toggleAcceptStep(inviteId: string, stepId: AcceptStepId) {
  return postJson<ToggleAcceptStepResult>(
    `/api/creator/campaigns/${inviteId}/accept-steps`,
    { stepId },
  );
}
