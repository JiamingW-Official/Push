// Pre-post compliance checklist data — keyed by campaignId.
// Surfaced on the Submit content flow (first screen), NOT in calendar.
// FTC §255 / ASA CAP Code: creator must complete before posting.

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface CampaignChecklist {
  campaignId: string;
  items: ChecklistItem[];
}

export const PRE_POST_CHECKLISTS: CampaignChecklist[] = [
  {
    campaignId: "camp-003",
    items: [
      { id: "pc-001-1", label: "Tag handles ready (@flamingoestate)" },
      {
        id: "pc-001-2",
        label: "FTC disclosure in caption (#ad or 'Paid partnership')",
      },
      { id: "pc-001-3", label: "Hashtags researched & added" },
      { id: "pc-001-4", label: "Content approved by brand team" },
      { id: "pc-001-5", label: "Posting time set for peak engagement" },
    ],
  },
  {
    campaignId: "camp-005",
    items: [
      { id: "pc-002-1", label: "Tag @glossier on all 3+ posts" },
      { id: "pc-002-2", label: "FTC disclosure on every post (#gifted / #ad)" },
      { id: "pc-002-3", label: "Video min 3 min (YouTube/TikTok ready)" },
      { id: "pc-002-4", label: "All captions proofread" },
      { id: "pc-002-5", label: "Stories cross-post scheduled" },
    ],
  },
  {
    campaignId: "camp-007",
    items: [
      { id: "pc-003-1", label: "5+ feed posts scheduled and reviewed" },
      { id: "pc-003-2", label: "2 Reels exported & captions added" },
      {
        id: "pc-003-3",
        label: "FTC disclosure on every piece (#ad / #KITHpartner)",
      },
      { id: "pc-003-4", label: "Tag @kith on each post" },
      { id: "pc-003-5", label: "Confirm with brand — any last feedback?" },
    ],
  },
];

export function getChecklistForCampaign(campaignId: string): ChecklistItem[] {
  return (
    PRE_POST_CHECKLISTS.find((c) => c.campaignId === campaignId)?.items ?? []
  );
}
