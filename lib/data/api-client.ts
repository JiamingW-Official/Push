// Push API client — mock layer for demo mode
// TODO: wire each method to real Supabase/API endpoints

import {
  MOCK_QR_CODES,
  type QRCodeRecord,
  type PosterType,
} from "@/lib/attribution/mock-qr-codes-extended";

/* ── Types ─────────────────────────────────────────────────── */
export type QRListParams = {
  campaign_id?: string;
  poster_type?: PosterType;
  status?: "active" | "disabled" | "all";
};

export type QRCreateInput = {
  campaign_id: string;
  campaign_name: string;
  poster_type: PosterType;
  hero_message: string;
  sub_message: string;
};

export type QRUpdateInput = {
  disabled?: boolean;
  regenerate?: boolean;
};

/* ── merchantMock.qrCodes ──────────────────────────────────── */
let _store: QRCodeRecord[] = [...MOCK_QR_CODES];

export const merchantMock = {
  qrCodes: {
    /** List QR codes with optional filters */
    list(params: QRListParams = {}): QRCodeRecord[] {
      let results = [..._store];
      if (params.campaign_id) {
        results = results.filter((q) => q.campaign_id === params.campaign_id);
      }
      if (params.poster_type) {
        results = results.filter((q) => q.poster_type === params.poster_type);
      }
      if (params.status === "active") {
        results = results.filter((q) => !q.disabled);
      } else if (params.status === "disabled") {
        results = results.filter((q) => q.disabled);
      }
      return results;
    },

    /** Create a new QR code record */
    create(input: QRCreateInput): QRCodeRecord {
      const newCode: QRCodeRecord = {
        id: `qr-${Date.now()}`,
        campaign_id: input.campaign_id,
        campaign_name: input.campaign_name,
        poster_type: input.poster_type,
        hero_message: input.hero_message,
        sub_message: input.sub_message,
        scan_url: `/scan/qr-${Date.now()}`,
        scan_count: 0,
        conversion_count: 0,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        disabled: false,
      };
      _store = [newCode, ..._store];
      return newCode;
    },

    /** Get a single QR code by id */
    get(id: string): QRCodeRecord | undefined {
      return _store.find((q) => q.id === id);
    },

    /** Update (disable/enable/regenerate) a QR code */
    update(id: string, input: QRUpdateInput): QRCodeRecord | null {
      const idx = _store.findIndex((q) => q.id === id);
      if (idx === -1) return null;

      let updated = { ..._store[idx] };

      if (input.disabled !== undefined) {
        updated.disabled = input.disabled;
      }

      if (input.regenerate) {
        // Reset scan state; new id simulates new signed payload
        updated = {
          ...updated,
          id: `qr-regen-${Date.now()}`,
          scan_count: 0,
          created_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
        };
      }

      _store = _store.map((q) => (q.id === id ? updated : q));
      return updated;
    },

    /** Delete a QR code */
    delete(id: string): boolean {
      const before = _store.length;
      _store = _store.filter((q) => q.id !== id);
      return _store.length < before;
    },
  },
};
