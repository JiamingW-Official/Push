import type { Payment } from "@/lib/data/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type SupabaseLikeClient = SupabaseClient<any, "public", any>;

export type InvoiceDateFilters = {
  from?: string | null;
  to?: string | null;
};

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function parseAmountCents(value: unknown): number | null {
  if (typeof value !== "number" || !isPositiveInteger(value)) {
    return null;
  }

  return value;
}

export async function getMerchantForTenant(
  supabase: SupabaseLikeClient,
  tenantId: string,
) {
  const { data, error } = await supabase
    .from("merchants")
    .select("id, tenant_id")
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Merchant not found for tenant");
  }

  return data;
}

export async function listInvoices(
  supabase: SupabaseLikeClient,
  tenantId: string,
  filters: InvoiceDateFilters,
) {
  let query = supabase
    .from("billing_invoices")
    .select(
      "id, tenant_id, merchant_id, status, subtotal_cents, fees_cents, total_cents, issued_at, due_at, paid_at, metadata, created_at, updated_at",
    )
    .eq("tenant_id", tenantId)
    .order("issued_at", { ascending: false });

  if (filters.from) {
    query = query.gte("issued_at", filters.from);
  }

  if (filters.to) {
    query = query.lte("issued_at", filters.to);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getInvoiceDetail(
  supabase: SupabaseLikeClient,
  tenantId: string,
  invoiceId: string,
) {
  const { data: invoice, error } = await supabase
    .from("billing_invoices")
    .select(
      "id, tenant_id, merchant_id, status, subtotal_cents, fees_cents, total_cents, issued_at, due_at, paid_at, metadata, created_at, updated_at",
    )
    .eq("tenant_id", tenantId)
    .eq("id", invoiceId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!invoice) {
    return null;
  }

  const { data: lineItems, error: lineItemsError } = await supabase
    .from("billing_invoice_line_items")
    .select(
      "id, invoice_id, description, quantity, unit_amount_cents, total_amount_cents, metadata, created_at",
    )
    .eq("invoice_id", invoiceId)
    .order("created_at", { ascending: true });

  if (lineItemsError) {
    throw lineItemsError;
  }

  return {
    ...invoice,
    line_items: lineItems ?? [],
  };
}

export async function createPaymentMethod(
  supabase: SupabaseLikeClient,
  tenantId: string,
  input: {
    brand: string;
    lastFour: string;
    externalProvider?: string;
    externalId?: string;
  },
) {
  const merchant = await getMerchantForTenant(supabase, tenantId);
  const provider = input.externalProvider ?? "manual";
  const providerRef =
    input.externalId ?? `${provider}:${merchant.id}:${input.brand}:${input.lastFour}`;

  const { data, error } = await supabase
    .from("billing_payment_methods")
    .insert({
      merchant_id: merchant.id,
      provider,
      provider_ref: providerRef,
      brand: input.brand,
      last4: input.lastFour,
    })
    .select(
      "id, merchant_id, provider, provider_ref, brand, last4, exp_month, exp_year, is_default, created_at, updated_at",
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function listPayments(
  supabase: SupabaseLikeClient,
  tenantId: string,
): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select(
      "id, campaign_id, creator_id, merchant_id, amount_cents, status, milestone_id, created_at, paid_at",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((payment) => ({
    id: payment.id,
    campaign_id: payment.campaign_id,
    creator_id: payment.creator_id,
    merchant_id: payment.merchant_id,
    amount: Number(payment.amount_cents),
    status: payment.status,
    milestone_id: payment.milestone_id ?? undefined,
    created_at: payment.created_at,
    paid_at: payment.paid_at ?? undefined,
  }));
}

export async function createWalletTopup(
  supabase: SupabaseLikeClient,
  tenantId: string,
  amountCents: number,
  idempotencyKey?: string | null,
) {
  const { data, error } = await supabase.rpc("merchant_wallet_topup", {
    p_tenant_id: tenantId,
    p_amount_cents: amountCents,
    p_reference: idempotencyKey ?? null,
    p_metadata: {
      source: "merchant_api",
      // TODO: integrate Stripe — out of scope for this wave
    },
  });

  if (error) {
    throw error;
  }

  const row = Array.isArray(data) ? data[0] : data;
  return row ?? null;
}
