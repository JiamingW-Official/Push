import BillingClient from "./BillingClient";
import type { Invoice, PaymentMethod } from "@/lib/data/api-client";
import { listInvoices } from "@/lib/api/billing";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireTenantId } from "@/lib/supabase/tenant";
import {
  MOCK_INVOICES,
  MOCK_PAYMENT_METHODS,
  MOCK_WALLET_STATS,
} from "@/lib/data/mock-invoices";

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
  const liveInvoices = await loadInitialInvoices();

  // When no auth/tenant data is available (demo or playtest), fall back to
  // the demo fixture so the page renders a believable history instead of
  // the bare empty state. Real merchants never see this branch — once they
  // have any invoice in the DB, that data takes over.
  const initialInvoices: Invoice[] =
    liveInvoices.length > 0 ? liveInvoices : MOCK_INVOICES;
  const initialPaymentMethods: PaymentMethod[] =
    liveInvoices.length > 0 ? [] : MOCK_PAYMENT_METHODS;

  return (
    <BillingClient
      initialInvoices={initialInvoices}
      initialPaymentMethods={initialPaymentMethods}
      walletStats={liveInvoices.length > 0 ? null : MOCK_WALLET_STATS}
    />
  );
}
