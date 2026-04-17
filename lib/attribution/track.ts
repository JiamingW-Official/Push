// Attribution tracking layer
// Current implementation: localStorage (demo)
// TODO: wire to Supabase for production persistence

const STORAGE_KEY = "push_attribution_events";

export type ScanEvent = {
  type: "scan";
  qrId: string;
  campaignId: string;
  creatorId: string;
  merchantId: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
  sessionId: string;
};

export type VerifyEvent = {
  type: "verify";
  qrId: string;
  campaignId: string;
  creatorId: string;
  merchantId: string;
  timestamp: string;
  evidenceType: "photo" | "receipt" | "screenshot";
  sessionId: string;
};

export type ConversionEvent = {
  type: "conversion";
  qrId: string;
  campaignId: string;
  creatorId: string;
  merchantId: string;
  timestamp: string;
  amount: number;
  offerTier: 1 | 2;
  sessionId: string;
};

export type AttributionEvent = ScanEvent | VerifyEvent | ConversionEvent;

// Generates or retrieves an anonymous session ID for this browser
function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "push_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

function loadEvents(): AttributionEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AttributionEvent[]) : [];
  } catch {
    return [];
  }
}

function persistEvent(event: AttributionEvent): void {
  if (typeof window === "undefined") return;
  const events = loadEvents();
  events.push(event);
  // Keep last 200 events in localStorage to avoid bloat
  const trimmed = events.slice(-200);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

// ── Public API ───────────────────────────────────────────────

/**
 * Record a QR code scan (customer lands on scan page).
 * Also fires POST /api/attribution/scan for server-side logging.
 */
export async function trackScan(
  qrId: string,
  meta: { campaignId: string; creatorId: string; merchantId: string },
): Promise<void> {
  const event: ScanEvent = {
    type: "scan",
    qrId,
    ...meta,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    sessionId: getSessionId(),
  };

  // Write locally for instant demo feedback
  persistEvent(event);

  // Fire-and-forget to API — don't block the page render
  try {
    await fetch("/api/attribution/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch {
    // Non-fatal — localStorage already has the event
  }
}

/**
 * Record a verification submission (customer uploads proof at store).
 */
export async function trackVerify(
  qrId: string,
  meta: {
    campaignId: string;
    creatorId: string;
    merchantId: string;
    evidenceType: "photo" | "receipt" | "screenshot";
  },
): Promise<void> {
  const event: VerifyEvent = {
    type: "verify",
    qrId,
    ...meta,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  };

  persistEvent(event);

  try {
    await fetch("/api/attribution/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch {
    // Non-fatal
  }
}

/**
 * Record a confirmed conversion (offer redeemed, amount known).
 * Called after merchant confirms redemption — Phase 2 feature.
 */
export async function trackConversion(
  qrId: string,
  meta: {
    campaignId: string;
    creatorId: string;
    merchantId: string;
    amount: number;
    offerTier: 1 | 2;
  },
): Promise<void> {
  const event: ConversionEvent = {
    type: "conversion",
    qrId,
    ...meta,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  };

  persistEvent(event);

  try {
    await fetch("/api/attribution/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch {
    // Non-fatal
  }
}

/**
 * Read all locally stored attribution events (debug / dashboard use).
 */
export function getLocalEvents(): AttributionEvent[] {
  return loadEvents();
}

/**
 * Check if this session already scanned a specific QR code.
 * Used to skip re-recording duplicate scans on page refresh.
 */
export function hasScannedThisSession(qrId: string): boolean {
  const sessionId = getSessionId();
  return loadEvents().some(
    (e) => e.type === "scan" && e.qrId === qrId && e.sessionId === sessionId,
  );
}

/**
 * Get the scan timestamp for a specific QR in this session.
 * Used for the 24h verification countdown.
 */
export function getScanTimestamp(qrId: string): string | null {
  const events = loadEvents();
  // Most recent scan for this QR in this session
  const scan = [...events]
    .reverse()
    .find(
      (e) =>
        e.type === "scan" && e.qrId === qrId && e.sessionId === getSessionId(),
    ) as ScanEvent | undefined;
  return scan?.timestamp ?? null;
}
