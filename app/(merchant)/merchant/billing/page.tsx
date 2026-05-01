import BillingClient from './BillingClient';
import type { Invoice, PaymentMethod } from '@/lib/data/api-client';
import { listInvoices } from '@/lib/api/billing';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requireTenantId } from '@/lib/supabase/tenant';

async function loadInitialInvoices(): Promise<Invoice[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const tenantId = await requireTenantId();
    return (await listInvoices(supabase, tenantId, {})) as Invoice[];
  } catch {
    return [];
  }
}

export default async function MerchantBillingPage() {
  const initialInvoices = await loadInitialInvoices();
  const initialPaymentMethods: PaymentMethod[] = [];

  return (
    <BillingClient
      initialInvoices={initialInvoices}
      initialPaymentMethods={initialPaymentMethods}
    />
  );
}
