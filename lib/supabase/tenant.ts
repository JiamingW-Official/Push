import { createServerSupabaseClient } from "@/lib/supabase-server";

const DEMO_TENANT_ID = "demo-tenant-001";

function resolveTenantId(appMetadata: unknown): string {
  if (
    appMetadata &&
    typeof appMetadata === "object" &&
    "tenant_id" in appMetadata &&
    typeof appMetadata.tenant_id === "string" &&
    appMetadata.tenant_id.length > 0
  ) {
    return appMetadata.tenant_id;
  }

  return DEMO_TENANT_ID;
}

export async function getTenantId(): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return resolveTenantId(user?.app_metadata);
}

export async function requireTenantId(): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Dev/demo fallback: Supabase Auth frontend is not wired yet (goal.md
    // 后续待办). Until it is, let unauthenticated traffic fall through to
    // the demo tenant so the merchant dashboard stays usable.
    if (process.env.NODE_ENV !== "production") {
      return DEMO_TENANT_ID;
    }
    throw new Error("Authenticated session required");
  }

  return resolveTenantId(user.app_metadata);
}
