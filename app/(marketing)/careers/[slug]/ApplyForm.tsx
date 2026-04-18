"use client";

import Link from "next/link";
import { useState, useRef } from "react";

type FormState = "idle" | "submitting" | "success";

export default function ApplyForm({ jobTitle }: { jobTitle: string }) {
  const [state, setState] = useState<FormState>("idle");
  const [fileName, setFileName] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");

    // UI-only mock 1.5s submission
    await new Promise((r) => setTimeout(r, 1500));
    setState("success");
  }

  if (state === "success") {
    return (
      <div className="job-apply-success">
        <p className="job-apply-success-label">Application received</p>
        <h2 className="job-apply-success-headline">Received.</h2>
        <p className="job-apply-success-body">
          We read every application personally. If there&apos;s a fit, someone
          from the team will reach out within 5 business days. Thanks for your
          interest in <strong>{jobTitle}</strong>.
        </p>
        <Link href="/careers" className="job-btn-secondary">
          Back to open roles
        </Link>
      </div>
    );
  }

  return (
    <form className="job-apply-form" onSubmit={handleSubmit} noValidate>
      <div className="job-form-grid">
        {/* Role (pre-filled, read-only) */}
        <div className="job-form-field job-form-field--full">
          <label className="job-form-label" htmlFor="apply-role">
            Applying for
          </label>
          <input
            id="apply-role"
            type="text"
            className="job-form-input"
            value={jobTitle}
            readOnly
            aria-readonly="true"
          />
        </div>

        {/* Name */}
        <div className="job-form-field">
          <label className="job-form-label" htmlFor="apply-name">
            Full name *
          </label>
          <input
            id="apply-name"
            type="text"
            className="job-form-input"
            placeholder="Jane Smith"
            required
            disabled={state === "submitting"}
          />
        </div>

        {/* Email */}
        <div className="job-form-field">
          <label className="job-form-label" htmlFor="apply-email">
            Email *
          </label>
          <input
            id="apply-email"
            type="email"
            className="job-form-input"
            placeholder="jane@example.com"
            required
            disabled={state === "submitting"}
          />
        </div>

        {/* LinkedIn */}
        <div className="job-form-field job-form-field--full">
          <label className="job-form-label" htmlFor="apply-linkedin">
            LinkedIn URL
          </label>
          <input
            id="apply-linkedin"
            type="url"
            className="job-form-input"
            placeholder="https://linkedin.com/in/janesmith"
            disabled={state === "submitting"}
          />
        </div>

        {/* Resume upload */}
        <div className="job-form-field job-form-field--full">
          <label className="job-form-label" htmlFor="apply-resume">
            Resume *
          </label>
          <button
            type="button"
            className="job-form-file-trigger"
            onClick={() => fileRef.current?.click()}
            disabled={state === "submitting"}
          >
            {fileName ? (
              <span className="job-form-file-name">{fileName}</span>
            ) : (
              <>
                <span className="job-form-file-icon">&uarr;</span>
                <span>Upload PDF or Word doc</span>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            id="apply-resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ display: "none" }}
            required
            disabled={state === "submitting"}
          />
        </div>

        {/* Why Push */}
        <div className="job-form-field job-form-field--full">
          <label className="job-form-label" htmlFor="apply-why">
            Why Push? *
          </label>
          <textarea
            id="apply-why"
            className="job-form-textarea"
            rows={6}
            placeholder="Tell us why this role and why now. Skip the cover-letter boilerplate — we'd rather hear you think."
            required
            disabled={state === "submitting"}
          />
        </div>
      </div>

      <div className="job-form-footer">
        <button
          type="submit"
          className="job-btn-primary"
          disabled={state === "submitting"}
        >
          {state === "submitting" ? (
            <span className="job-btn-loading">
              <span className="job-btn-spinner" />
              Sending&hellip;
            </span>
          ) : (
            "Submit application"
          )}
        </button>
        <p className="job-form-disclaimer">
          We read every application within 5 business days.
        </p>
      </div>
    </form>
  );
}
