export type KycSocialAccount = {
  platform: "instagram" | "tiktok" | "xiaohongshu" | "youtube" | "twitter";
  connected: boolean;
  handle?: string;
  followers: number;
  recentPosts: string[];
};

export type KycDocument = {
  file?: File | null;
  name?: string;
  size?: number;
  dataUrl?: string;
  preview?: string | null;
  status?: "idle" | "uploading" | "done" | "error";
};

export type KycIdentity = {
  firstName: string;
  lastName: string;
  dob: string;
  ssnLast4: string;
  docType: "drivers_license" | "id_card" | "passport";
  frontDoc: KycDocument;
  backDoc: KycDocument;
  selfieDoc: KycDocument;
};

export type KycAddress = {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  proofDoc: KycDocument | null;
};

/** KYC review lifecycle. Superset covering both the pre-v5.1 legacy labels
 *  (`unverified` / `in_review` / `verified`) and the current canonical
 *  set (`idle` / `pending` / `approved` / `rejected`). Downstream pages
 *  may match any subset; adding a new value is backwards-compatible. */
export type KycStatus =
  | "idle"
  | "pending"
  | "approved"
  | "rejected"
  | "unverified"
  | "in_review"
  | "verified";

export type KycState = {
  socials: KycSocialAccount[];
  identity: KycIdentity;
  address: KycAddress;
  /** Review lifecycle state; `idle` on fresh sessions. */
  status?: KycStatus;
  /** Populated when `status === "rejected"`. */
  rejectionReason?: string;
};

// ── Local-storage stubs ────────────────────────────────────────────────
// Week-3 demo implementation — persists the wizard draft to localStorage
// so the merchant can refresh without losing input. Production will swap
// these for an authenticated /api/creator/kyc endpoint.

const LS_KEY = "push:creator-kyc-draft";

function readLocal(): KycState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as KycState) : null;
  } catch {
    return null;
  }
}

function writeLocal(state: KycState | null): void {
  if (typeof window === "undefined") return;
  try {
    if (state === null) window.localStorage.removeItem(LS_KEY);
    else window.localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or private-browsing mode — silently swallow.
  }
}

/** Load the current KYC draft from local storage, or return the empty
 *  template when none exists. */
export function loadKyc(): KycState {
  return readLocal() ?? { ...MOCK_KYC_STATE, status: "idle" };
}

/** Persist the current KYC draft to local storage. */
export function saveKyc(state: KycState): void {
  writeLocal(state);
}

/** Flip the draft to `pending` and persist. Returns the new state. */
export function submitKyc(state: KycState): KycState {
  const next: KycState = { ...state, status: "pending" };
  writeLocal(next);
  return next;
}

/** Wipe the draft (equivalent to clicking "Start over" on the wizard). */
export function resetKyc(): void {
  writeLocal(null);
}

// Synchronous — caller handles delay via setTimeout
export function mockOAuthConnect(
  platform: KycSocialAccount["platform"],
): KycSocialAccount {
  const seeds: Record<KycSocialAccount["platform"], number> = {
    instagram: 1,
    tiktok: 2,
    xiaohongshu: 3,
    youtube: 4,
    twitter: 5,
  };
  const seed = seeds[platform];
  const s = Math.sin(seed * 9301 + 49297) * 233280;
  const rand = s - Math.floor(s);
  return {
    platform,
    connected: true,
    handle: `@demo_${platform}`,
    followers: Math.round(4000 + rand * 46000),
    recentPosts: [],
  };
}

const emptyDoc = (): KycDocument => ({ status: "idle" });

export const MOCK_KYC_STATE: KycState = {
  socials: [
    { platform: "instagram", connected: false, followers: 0, recentPosts: [] },
    { platform: "tiktok", connected: false, followers: 0, recentPosts: [] },
    {
      platform: "xiaohongshu",
      connected: false,
      followers: 0,
      recentPosts: [],
    },
    { platform: "youtube", connected: false, followers: 0, recentPosts: [] },
    { platform: "twitter", connected: false, followers: 0, recentPosts: [] },
  ],
  identity: {
    firstName: "",
    lastName: "",
    dob: "",
    ssnLast4: "",
    docType: "drivers_license",
    frontDoc: emptyDoc(),
    backDoc: emptyDoc(),
    selfieDoc: emptyDoc(),
  },
  address: {
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    proofDoc: null,
  },
};
