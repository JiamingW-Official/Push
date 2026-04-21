"use client";

import { useRef } from "react";
import type { KycAddress, KycDocument } from "@/lib/verify/mock-kyc";

interface Props {
  address: KycAddress;
  onChange: (address: KycAddress) => void;
}

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const NYC_CITIES = [
  "new york",
  "new york city",
  "nyc",
  "brooklyn",
  "queens",
  "bronx",
  "staten island",
  "manhattan",
];

function isNyc(city: string): boolean {
  return NYC_CITIES.includes(city.trim().toLowerCase());
}

// Simplified SVG NYC map with a pin
function NycMapPin({ active }: { active: boolean }) {
  return (
    <div className="kv-map-wrap" aria-hidden="true">
      <svg
        viewBox="0 0 300 220"
        className="kv-map-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Water background */}
        <rect width="300" height="220" fill="#d4e8f0" />
        {/* Manhattan simplified outline */}
        <path
          d="M130 30 L148 25 L162 35 L168 60 L165 90 L160 130 L155 160 L148 185 L140 195 L132 185 L128 160 L122 130 L118 90 L115 60 L120 35 Z"
          fill="#f5f2ec"
          stroke="#003049"
          strokeWidth="1.5"
        />
        {/* Brooklyn */}
        <path
          d="M155 160 L200 155 L220 165 L215 195 L190 205 L160 200 L148 185 Z"
          fill="#f5f2ec"
          stroke="#003049"
          strokeWidth="1.5"
        />
        {/* Queens */}
        <path
          d="M168 60 L230 50 L260 80 L250 130 L215 140 L200 155 L165 90 Z"
          fill="#f5f2ec"
          stroke="#003049"
          strokeWidth="1.5"
        />
        {/* Bronx */}
        <path
          d="M148 25 L200 10 L240 20 L245 50 L230 50 L168 60 L162 35 Z"
          fill="#f5f2ec"
          stroke="#003049"
          strokeWidth="1.5"
        />
        {/* Staten Island */}
        <path
          d="M80 170 L115 165 L125 190 L110 210 L80 205 L70 185 Z"
          fill="#f5f2ec"
          stroke="#003049"
          strokeWidth="1.5"
        />
        {/* Pin */}
        {active && (
          <>
            <circle cx="143" cy="90" r="8" fill="#c1121f" />
            <circle cx="143" cy="90" r="4" fill="#f5f2ec" />
            <line
              x1="143"
              y1="98"
              x2="143"
              y2="115"
              stroke="#c1121f"
              strokeWidth="2"
            />
          </>
        )}
        {!active && (
          <circle cx="143" cy="90" r="5" fill="#669bbc" opacity="0.5" />
        )}
        {/* Label */}
        <text
          x="10"
          y="215"
          fontFamily="monospace"
          fontSize="9"
          fill="#669bbc"
          letterSpacing="1"
        >
          NEW YORK CITY
        </text>
      </svg>
    </div>
  );
}

export default function StepAddress({ address, onChange }: Props) {
  const proofInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof KycAddress>(key: K, value: KycAddress[K]) {
    onChange({ ...address, [key]: value });
  }

  function handleProofFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      set("proofDoc", {
        name: file.name,
        size: file.size,
        dataUrl: ev.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  const showNycWarning = address.city.length > 2 && !isNyc(address.city);
  const pinActive = address.city.length > 0 && isNyc(address.city);

  return (
    <div className="kv-step-body">
      <h2 className="kv-step-heading">Address</h2>

      <div className="kv-addr-layout">
        <div className="kv-addr-form">
          <div className="kv-field">
            <label htmlFor="kv-street" className="kv-label">
              Street Address
            </label>
            <input
              id="kv-street"
              type="text"
              className="kv-input"
              value={address.street}
              onChange={(e) => set("street", e.target.value)}
              placeholder="123 Broadway"
              autoComplete="street-address"
            />
          </div>

          <div className="kv-field">
            <label htmlFor="kv-apt" className="kv-label">
              Apt / Unit <span className="kv-optional">(optional)</span>
            </label>
            <input
              id="kv-apt"
              type="text"
              className="kv-input"
              value={address.apt}
              onChange={(e) => set("apt", e.target.value)}
              placeholder="Apt 4B"
              autoComplete="address-line2"
            />
          </div>

          <div className="kv-row">
            <div className="kv-field">
              <label htmlFor="kv-city" className="kv-label">
                City
              </label>
              <input
                id="kv-city"
                type="text"
                className={`kv-input${showNycWarning ? " kv-input--warn" : ""}`}
                value={address.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="New York"
                autoComplete="address-level2"
              />
            </div>
            <div className="kv-field kv-field--state">
              <label htmlFor="kv-state" className="kv-label">
                State
              </label>
              <select
                id="kv-state"
                className="kv-input kv-select"
                value={address.state}
                onChange={(e) => set("state", e.target.value)}
                autoComplete="address-level1"
              >
                <option value="">—</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="kv-field kv-field--zip">
              <label htmlFor="kv-zip" className="kv-label">
                ZIP
              </label>
              <input
                id="kv-zip"
                type="text"
                className="kv-input"
                value={address.zip}
                onChange={(e) =>
                  set("zip", e.target.value.replace(/\D/g, "").slice(0, 5))
                }
                placeholder="10001"
                maxLength={5}
                inputMode="numeric"
                autoComplete="postal-code"
              />
            </div>
          </div>

          {showNycWarning && (
            <div className="kv-warn-banner" role="alert">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="#c1121f"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Push is currently active in NYC only. Your signup will be marked
              as <strong>waitlist</strong>.
            </div>
          )}
        </div>

        <NycMapPin active={pinActive} />
      </div>

      {/* Proof of address upload — optional */}
      <div className="kv-field" style={{ marginTop: 24 }}>
        <span className="kv-label">
          Proof of Address <span className="kv-optional">(optional)</span>
        </span>
        <p className="kv-field-hint">
          Utility bill, bank statement, or government mail dated within 90 days.
        </p>
        <input
          ref={proofInputRef}
          type="file"
          accept="image/*,application/pdf"
          style={{ display: "none" }}
          onChange={handleProofFile}
        />
        {address.proofDoc ? (
          <div className="kv-proof-uploaded">
            <span className="kv-proof-name">{address.proofDoc.name}</span>
            <button
              type="button"
              className="kv-proof-replace"
              onClick={() => proofInputRef.current?.click()}
            >
              Replace
            </button>
          </div>
        ) : (
          <div
            className="kv-dropzone kv-dropzone--sm"
            onClick={() => proofInputRef.current?.click()}
            onKeyDown={(e) =>
              e.key === "Enter" && proofInputRef.current?.click()
            }
            tabIndex={0}
            role="button"
            aria-label="Upload proof of address"
          >
            <div className="kv-dropzone__empty">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="#669bbc"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="kv-dropzone__label">Upload document</span>
              <span className="kv-dropzone__hint">JPG / PNG / PDF</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
