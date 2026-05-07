import MessagesClient from "../MessagesClient";
import { getThreads } from "@/lib/api/messages";
import { supabaseService } from "@/lib/supabase/service";
import { requireTenantId } from "@/lib/supabase/tenant";

// Deep-link route — /merchant/messages/[threadId]. Renders the same
// two-pane MessagesClient as /merchant/messages but seeds activeThreadId
// from the URL so a pasted link / bookmark / browser-back lands directly
// on the requested conversation. The thread list still loads in the left
// pane so the user can switch without an extra round-trip.

async function getMerchantThreads() {
  try {
    const supabase = supabaseService();
    const tenantId = await requireTenantId();
    const { data: merchant, error } = await supabase
      .from("merchants")
      .select("id")
      .eq("tenant_id", tenantId)
      .single();

    if (error || !merchant?.id) {
      return [];
    }

    return await getThreads(supabase, merchant.id, "all");
  } catch {
    return [];
  }
}

export default async function MerchantMessagesThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const initialThreads = await getMerchantThreads();

  return (
    <MessagesClient
      initialThreads={initialThreads}
      initialThreadId={threadId}
    />
  );
}
