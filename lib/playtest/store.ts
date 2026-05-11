// Shared playtest store.
//
// Uses a file-backed PersistedMap so data survives HMR and dev-server
// restarts. Each Map writes to .next/cache/playtest/<name>.json on every
// mutation and loads from there on first construction.
//
// fs is required dynamically and guarded by typeof window so this module
// is safe to import from Client Components (the persistence path simply
// becomes a no-op in the browser bundle).

/* ── Filesystem helpers (Node.js only) ─────────────────────── */

function isNode(): boolean {
  return typeof window === "undefined" && typeof process !== "undefined";
}

function getCacheDir(): string {
  if (process.env.VERCEL) return "/tmp/push-playtest";
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("path").join(process.cwd(), ".next", "cache", "playtest");
}

function tryReadEntries<T>(name: string): [string, T][] {
  if (!isNode()) return [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs") as typeof import("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path") as typeof import("path");
    const file = path.join(getCacheDir(), `${name}.json`);
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8")) as [string, T][];
  } catch {
    return [];
  }
}

function tryWrite<T>(name: string, map: Map<string, T>): void {
  if (!isNode()) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs") as typeof import("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path") as typeof import("path");
    const dir = getCacheDir();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, `${name}.json`),
      JSON.stringify(Array.from(map.entries())),
      "utf-8",
    );
  } catch {
    // Non-fatal: in-memory copy still works for this request.
  }
}

/* ── PersistedMap ────────────────────────────────────────────── */

class PersistedMap<T> extends Map<string, T> {
  private readonly _name: string;

  constructor(name: string) {
    super();
    this._name = name;
    // Restore from disk on module load (covers HMR + server restart).
    for (const [k, v] of tryReadEntries<T>(name)) {
      super.set(k, v);
    }
  }

  override set(key: string, value: T): this {
    super.set(key, value);
    tryWrite(this._name, this);
    return this;
  }

  override delete(key: string): boolean {
    const removed = super.delete(key);
    if (removed) tryWrite(this._name, this);
    return removed;
  }

  override clear(): void {
    super.clear();
    tryWrite(this._name, this);
  }
}

/* ── Exported stores ─────────────────────────────────────────── */

export interface PlaytestCampaign {
  id: string;
  token: string;
  merchantName: string;
  merchantType: string;
  title: string;
  description: string;
  offer: string;
  reward: string;
  accent: string;
  payout: number;
  spotsTotal: number;
  spotsRemaining: number;
  deadline: string;
  category: string;
  createdAt: string;
}

export interface PlaytestApplication {
  id: string;
  campaignId: string;
  campaignTitle: string;
  merchantName: string;
  creatorHandle: string;
  status: "pending" | "accepted" | "declined" | "shortlisted";
  appliedAt: string;
}

export interface PlaytestQRCode {
  id: string;
  campaignId: string;
  merchantName: string;
  campaignTitle: string;
  description: string;
  offer: string;
  reward: string;
  deadline: string;
  category: string;
  scanCount: number;
  createdAt: string;
}

export const playtestCampaigns = new PersistedMap<PlaytestCampaign>(
  "campaigns",
);
export const playtestApplications = new PersistedMap<PlaytestApplication>(
  "applications",
);
export const playtestQRCodes = new PersistedMap<PlaytestQRCode>("qr-codes");
