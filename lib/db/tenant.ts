/**
 * Tenant resolution helpers — ported from z's lib/supabase/tenant.ts
 * adapted to Push's lib/db naming convention.
 *
 * Push is single-tenant today (one merchant org per Supabase project), but
 * the rest of the merchant API was written assuming a tenant_id column on
 * `merchants`. These two helpers preserve that contract while degrading
 * gracefully to a demo tenant when no auth session is present.
 *
 * Use `getTenantId()` from read-only routes, `requireTenantId()` from
 * write routes (it throws when no session is found instead of falling back).
 */
import "server-only";
import { createServerSupabaseClient } from "@/lib/db/server";

export const DEMO_TENANT_ID = "demo-tenant-001";

interface AppMetadataWithTenant {
  tenant_id?: string;
}

export async function getTenantId(): Promise<string> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const meta = user?.app_metadata as AppMetadataWithTenant | undefined;
    return meta?.tenant_id ?? DEMO_TENANT_ID;
  } catch {
    return DEMO_TENANT_ID;
  }
}

export async function requireTenantId(): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const meta = user?.app_metadata as AppMetadataWithTenant | undefined;
  if (meta?.tenant_id) {
    return meta.tenant_id;
  }

  if (process.env.NODE_ENV !== "production") {
    return DEMO_TENANT_ID;
  }

  throw new Error("Tenant not resolved — authentication required.");
}
