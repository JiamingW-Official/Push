import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ campaign?: string }>;
}

/**
 * /creator/inbox — preserves any ?campaign=xxx query when redirecting to
 * /messages, so deep links from the Work funnel + GigCard "Message merchant"
 * actions land on the right thread filter.
 */
export default async function InboxRoot({ searchParams }: Props) {
  const { campaign } = await searchParams;
  if (campaign) {
    redirect(
      `/creator/inbox/messages?campaign=${encodeURIComponent(campaign)}`,
    );
  }
  redirect("/creator/inbox/messages");
}
