import CampaignDetailPage from "./CampaignPageClient";

export function generateStaticParams() {
  return [
    "demo-campaign-001",
    "demo-campaign-002",
    "demo-campaign-003",
    "demo-campaign-004",
    "demo-campaign-005",
    "demo-campaign-006",
    "demo-campaign-007",
    "demo-campaign-008",
    "disc-001",
    "disc-002",
    "disc-003",
    "disc-004",
    "disc-005",
    "disc-006",
    "disc-007",
    "disc-008",
    "disc-009",
    "disc-010",
  ].map((id) => ({ id }));
}

export default function Page() {
  return <CampaignDetailPage />;
}
