"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useState, useRef } from "react";
import { getJobBySlug } from "@/lib/careers/mock-jobs";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./job.css";

/* ── Apply form ─────────────────────────────────────────── */
type FormState = "idle" | "submitting" | "success";

function ApplyForm({ jobTitle }: { jobTitle: string }) {
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

    // Mock 1.5s submission
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
                <span className="job-form-file-icon">↑</span>
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
              Sending…
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

/* ── Page ───────────────────────────────────────────────── */
export default function JobDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0];
  const job = slug ? getJobBySlug(slug) : undefined;

  if (!job) {
    notFound();
  }

  return (
    <>
      <ScrollRevealInit />

      {/* ── Job header ──────────────────────────────────── */}
      <section className="job-hero">
        <div className="job-inner">
          <Link href="/careers" className="job-back">
            ← All open roles
          </Link>
          <div className="job-hero-content">
            <div className="job-meta-row reveal">
              <span className="job-dept-tag">{job.department}</span>
              <span className="job-divider">·</span>
              <span className="job-location">{job.location}</span>
              <span className="job-divider">·</span>
              <span className="job-type">{job.type}</span>
            </div>
            <h1 className="job-title reveal">{job.title}</h1>
            <p className="job-comp reveal">{job.compensation}</p>
          </div>
        </div>
      </section>

      {/* ── Body ────────────────────────────────────────── */}
      <section className="job-body">
        <div className="job-inner job-body-grid">
          {/* Main content */}
          <div className="job-content">
            {/* About the role */}
            <div className="job-section reveal">
              <h2 className="job-section-title">About the role</h2>
              <p className="job-section-body">{job.aboutRole}</p>
            </div>

            {/* You'll be */}
            <div className="job-section reveal">
              <h2 className="job-section-title">You&apos;ll be</h2>
              <ul className="job-list">
                {job.youllBe.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* You should have */}
            <div className="job-section reveal">
              <h2 className="job-section-title">You should have</h2>
              <ul className="job-list">
                {job.youShouldHave.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nice to have */}
            <div className="job-section reveal">
              <h2 className="job-section-title">Nice to have</h2>
              <ul className="job-list job-list--muted">
                {job.niceToHave.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet">○</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What we offer */}
            <div className="job-section reveal">
              <h2 className="job-section-title">What we offer</h2>
              <ul className="job-list">
                {job.whatWeOffer.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet job-list-bullet--check">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply form */}
            <div className="job-section job-section--apply reveal" id="apply">
              <h2 className="job-section-title">Apply</h2>
              <ApplyForm jobTitle={job.title} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="job-sidebar">
            <div className="job-sidebar-card">
              <p className="job-sidebar-label">Position</p>
              <p className="job-sidebar-value">{job.title}</p>
            </div>
            <div className="job-sidebar-card">
              <p className="job-sidebar-label">Department</p>
              <p className="job-sidebar-value">{job.department}</p>
            </div>
            <div className="job-sidebar-card">
              <p className="job-sidebar-label">Location</p>
              <p className="job-sidebar-value">{job.location}</p>
            </div>
            <div className="job-sidebar-card">
              <p className="job-sidebar-label">Type</p>
              <p className="job-sidebar-value">{job.type}</p>
            </div>
            <div className="job-sidebar-card">
              <p className="job-sidebar-label">Compensation</p>
              <p className="job-sidebar-value">{job.compensation}</p>
            </div>
            <a href="#apply" className="job-btn-primary job-sidebar-cta">
              Apply now
            </a>
            <Link href="/careers" className="job-sidebar-back">
              View all roles
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
