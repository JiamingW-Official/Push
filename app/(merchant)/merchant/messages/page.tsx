import MessagesClient from './MessagesClient';
import { getThreads } from '@/lib/api/messages';
import { supabaseService } from '@/lib/supabase/service';
import { requireTenantId } from '@/lib/supabase/tenant';

async function getMerchantThreads() {
  try {
    const supabase = supabaseService();
    const tenantId = await requireTenantId();
    const { data: merchant, error } = await supabase.from('merchants').select('id').eq('tenant_id', tenantId).single();

    if (error || !merchant?.id) {
      return [];
    }

    return await getThreads(supabase, merchant.id, 'all');
  } catch {
    return [];
  }
}

export default async function MerchantMessagesPage() {
  const initialThreads = await getMerchantThreads();

  return <MessagesClient initialThreads={initialThreads} />;
}
