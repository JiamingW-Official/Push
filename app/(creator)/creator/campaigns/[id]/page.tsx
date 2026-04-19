import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LegacyCampaignPage({ params }: Props) {
  const { id } = await params;
  redirect(`/creator/work/campaign/${id}`);
}

export function generateStaticParams() {
  return [{ id: "demo-campaign-001" }];
}
