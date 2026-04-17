"use client";

import { useRef } from "react";
import type { KycIdentity, KycDocument } from "@/lib/verify/mock-kyc";

interface Props {
  identity: KycIdentity;
  onChange: (identity: KycIdentity) => void;
}

const DOC_TYPES = [
  { value: "drivers_license", label: "Driver's License" },
  { value: "id_card", label: "ID Card" },
  { value: "passport", label: "Passport" },
] as const;

function DropZone({
  label,
  doc,
  onFile,
}: {
  label: string;
  doc: KycDocument | null;
  onFile: (doc: KycDocument) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onFile({
        name: file.name,
        size: file.size,
        dataUrl: ev.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className="kv-dropzone"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      tabIndex={0}
      role="button"
      aria-label={`Upload ${label}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      {doc ? (
        <div className="kv-dropzone__preview">
          {doc.dataUrl && doc.dataUrl.startsWith("data:image") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doc.dataUrl}
              alt={doc.name}
              className="kv-dropzone__img"
            />
          ) : (
            <span className="kv-dropzone__filename">{doc.name}</span>
          )}
          <span className="kv-dropzone__replace">Replace</span>
        </div>
      ) : (
        <div className="kv-dropzone__empty">
          <svg
            width="24"
            height="24"
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
          <span className="kv-dropzone__label">{label}</span>
          <span className="kv-dropzone__hint">JPG / PNG / PDF</span>
        </div>
      )}
    </div>
  );
}

export default function StepIdentity({ identity, onChange }: Props) {
  function set<K extends keyof KycIdentity>(key: K, value: KycIdentity[K]) {
    onChange({ ...identity, [key]: value });
  }

  return (
    <div className="kv-step-body">
      <h2 className="kv-step-heading">Identity</h2>

      {/* Doc type */}
      <fieldset className="kv-fieldset">
        <legend className="kv-label">Document Type</legend>
        <div className="kv-radio-group">
          {DOC_TYPES.map((dt) => (
            <label key={dt.value} className="kv-radio">
              <input
                type="radio"
                name="docType"
                value={dt.value}
                checked={identity.docType === dt.value}
                onChange={() => set("docType", dt.value)}
              />
              <span>{dt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Drop zones */}
      <div className="kv-dropzones">
        <div className="kv-field">
          <span className="kv-label">Front of Document</span>
          <DropZone
            label="Front"
            doc={identity.frontDoc}
            onFile={(d) => set("frontDoc", d)}
          />
        </div>
        {identity.docType !== "passport" && (
          <div className="kv-field">
            <span className="kv-label">Back of Document</span>
            <DropZone
              label="Back"
              doc={identity.backDoc}
              onFile={(d) => set("backDoc", d)}
            />
          </div>
        )}
        <div className="kv-field">
          <span className="kv-label">Selfie Holding Document</span>
          <DropZone
            label="Selfie"
            doc={identity.selfieDoc}
            onFile={(d) => set("selfieDoc", d)}
          />
        </div>
      </div>

      {/* Personal info */}
      <div className="kv-row">
        <div className="kv-field">
          <label htmlFor="kv-first" className="kv-label">
            First Name
          </label>
          <input
            id="kv-first"
            type="text"
            className="kv-input"
            value={identity.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            autoComplete="given-name"
          />
        </div>
        <div className="kv-field">
          <label htmlFor="kv-last" className="kv-label">
            Last Name
          </label>
          <input
            id="kv-last"
            type="text"
            className="kv-input"
            value={identity.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="kv-row">
        <div className="kv-field">
          <label htmlFor="kv-dob" className="kv-label">
            Date of Birth
          </label>
          <input
            id="kv-dob"
            type="date"
            className="kv-input"
            value={identity.dob}
            onChange={(e) => set("dob", e.target.value)}
            autoComplete="bday"
          />
        </div>
        <div className="kv-field">
          <label htmlFor="kv-ssn" className="kv-label">
            SSN Last 4
          </label>
          <input
            id="kv-ssn"
            type="text"
            className="kv-input"
            value={identity.ssnLast4}
            onChange={(e) =>
              set("ssnLast4", e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            maxLength={4}
            inputMode="numeric"
            placeholder="1234"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Security note */}
      <div className="kv-security-note" role="note">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6L12 2z"
            stroke="#669bbc"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Encrypted in transit. Only the compliance team sees this.
      </div>
    </div>
  );
}
