// Customer-side persistence for the scan/verify flow.
// Lives in sessionStorage (per-tab, ephemeral) so a fresh tab → fresh attribution
// while a back-button navigation re-finds the same scan.

export type ScanSession = {
  scanId: string | null;
  scannedAt: string;
  customerSessionId: string;
};

export const PUSH_COOKIE_KEY = "push_cookie_id";

function getKey(shortCode: string) {
  return `push.scan.${shortCode}`;
}

export function getOrCreateCustomerSessionId() {
  if (typeof window === "undefined") {
    return "server-session";
  }

  const key = "push.customer-session";
  const existing = window.localStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const next =
    window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  window.localStorage.setItem(key, next);
  return next;
}

function readCookieValue(source: string, name: string) {
  const match = source
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export function getPushCookieId(cookieHeader?: string | null) {
  if (typeof window === "undefined") {
    return cookieHeader ? readCookieValue(cookieHeader, PUSH_COOKIE_KEY) : null;
  }

  return readCookieValue(document.cookie, PUSH_COOKIE_KEY);
}

export function saveScanSession(shortCode: string, session: ScanSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(getKey(shortCode), JSON.stringify(session));
}

export function getScanSession(shortCode: string): ScanSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(getKey(shortCode));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ScanSession;
  } catch {
    return null;
  }
}

export function getScanTimestamp(shortCode: string) {
  return getScanSession(shortCode)?.scannedAt ?? null;
}

export function hasActiveScanSession(shortCode: string) {
  return getScanSession(shortCode) !== null;
}
