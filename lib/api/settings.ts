import type { SupabaseClient } from "@supabase/supabase-js";

export const DEFAULT_MERCHANT_SETTINGS = {
  profile: {
    display_name: "",
    logo_url: "",
    timezone: "America/New_York",
  },
  team: {
    members: [],
  },
  api_keys: {
    active: [],
  },
  notification_prefs: {
    email: true,
    sms: false,
    new_applicant: true,
    campaign_end: true,
  },
} as const;

export type MerchantSettings = typeof DEFAULT_MERCHANT_SETTINGS;
export type MerchantSettingsSection = keyof MerchantSettings;

type JsonRecord = Record<string, unknown>;
type SupabaseLikeClient = SupabaseClient<any, "public", any>;

function cloneDefaultSettings(): MerchantSettings {
  return JSON.parse(JSON.stringify(DEFAULT_MERCHANT_SETTINGS)) as MerchantSettings;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isMerchantSettingsSection(
  value: string,
): value is MerchantSettingsSection {
  return value in DEFAULT_MERCHANT_SETTINGS;
}

export function mergeSettingsSection(
  currentValue: unknown,
  nextValue: unknown,
): unknown {
  if (isRecord(currentValue) && isRecord(nextValue)) {
    return {
      ...currentValue,
      ...nextValue,
    };
  }

  return nextValue;
}

function normalizeSettingsRow(row: Partial<MerchantSettings> | null): MerchantSettings {
  const defaults = cloneDefaultSettings();

  return {
    profile: isRecord(row?.profile)
      ? { ...defaults.profile, ...row.profile }
      : defaults.profile,
    team: isRecord(row?.team) ? { ...defaults.team, ...row.team } : defaults.team,
    api_keys: isRecord(row?.api_keys)
      ? { ...defaults.api_keys, ...row.api_keys }
      : defaults.api_keys,
    notification_prefs: isRecord(row?.notification_prefs)
      ? { ...defaults.notification_prefs, ...row.notification_prefs }
      : defaults.notification_prefs,
  };
}

export async function getOrCreateMerchantSettings(
  supabase: SupabaseLikeClient,
  tenantId: string,
): Promise<MerchantSettings> {
  const { data, error } = await supabase
    .from("merchant_settings")
    .select("profile, team, api_keys, notification_prefs")
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return normalizeSettingsRow(data);
  }

  const defaults = cloneDefaultSettings();
  const { data: inserted, error: insertError } = await supabase
    .from("merchant_settings")
    .insert({
      tenant_id: tenantId,
      ...defaults,
    })
    .select("profile, team, api_keys, notification_prefs")
    .single();

  if (insertError) {
    throw insertError;
  }

  return normalizeSettingsRow(inserted);
}

export async function updateMerchantSettingsSection(
  supabase: SupabaseLikeClient,
  tenantId: string,
  section: MerchantSettingsSection,
  nextValue: unknown,
): Promise<MerchantSettings> {
  const current = await getOrCreateMerchantSettings(supabase, tenantId);
  const mergedValue = mergeSettingsSection(current[section], nextValue);

  const { data, error } = await supabase
    .from("merchant_settings")
    .update({
      [section]: mergedValue,
    })
    .eq("tenant_id", tenantId)
    .select("profile, team, api_keys, notification_prefs")
    .single();

  if (error) {
    throw error;
  }

  return normalizeSettingsRow(data);
}
