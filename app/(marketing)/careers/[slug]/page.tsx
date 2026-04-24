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
        <h2 className="job-apply-success-headline">Got it.</h2>
        <p className="job-apply-success-body">
          Jiaming reads every application by hand. If there&apos;s a fit,
          someone from the team writes back within five business days. Thanks
          for the note about <strong>{jobTitle}</strong>.
        </p>
        <Link href="/careers" className="job-btn-secondary">
          Back to the eight seats
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
            LinkedIn or portfolio URL
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
            placeholder="Tell us what made you read this. Skip the cover-letter boilerplate. Plain words are fine."
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
          Reply within five business days. Read by hand.
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

      {/* ═══════════════ 01 — HERO (ink) ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette job-hero-v7"
        style={{
          position: "relative",
          minHeight: "70svh",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(24px, 4vw, 64px)",
          paddingTop: "clamp(80px, 8vw, 120px)",
          overflow: "hidden",
        }}
      >
        {/* Top row: pill + back link */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            position: "relative",
            zIndex: 3,
          }}
        >
          <span className="pill-lux" style={{ color: "#fff" }}>
            {job.department} · {job.location}
          </span>
          <Link
            href="/careers"
            className="job-back-v7"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            &larr; All eight seats
          </Link>
        </div>

        {/* Hero content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 3,
            maxWidth: 1180,
            margin: "0 auto",
            width: "100%",
            paddingTop: "clamp(48px, 8vh, 96px)",
            paddingBottom: "clamp(48px, 8vh, 96px)",
          }}
        >
          <div
            className="section-marker"
            data-num="01"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            The role
          </div>
          <span
            className="eyebrow-lux"
            style={{ color: "var(--champagne)", marginBottom: 24 }}
          >
            {job.type} · {job.compensation}
          </span>

          <h1
            className="reveal"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 9vw, 132px)",
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              color: "#fff",
              margin: "12px 0 0",
            }}
          >
            {job.title}
            <span
              aria-hidden="true"
              style={{
                color: "var(--brand-red)",
                marginLeft: "-0.04em",
              }}
            >
              .
            </span>
          </h1>

          <p
            className="reveal"
            style={{
              marginTop: "clamp(24px, 4vw, 40px)",
              maxWidth: 640,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.15vw, 18px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            {job.aboutRole}
          </p>

          <div
            style={{
              marginTop: "clamp(32px, 5vw, 48px)",
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <a href="#apply" className="btn btn-primary">
              Apply for this seat
            </a>
            <Link
              href="/careers"
              className="btn btn-ghost"
              style={{
                color: "rgba(255,255,255,0.7)",
                borderColor: "rgba(255,255,255,0.18)",
              }}
            >
              See the other seats&nbsp;&rarr;
            </Link>
          </div>
          <p
            style={{
              marginTop: 16,
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.34)",
            }}
          >
            every application read by hand · 5 business-day reply
          </p>
        </div>
      </section>

      {/* ═══════════════ Body ═══════════════ */}
      <section className="job-body">
        <div className="job-inner job-body-grid">
          {/* Main content */}
          <div className="job-content">
            {/* You'll be */}
            <div className="job-section reveal">
              <div className="section-marker" data-num="02">
                What you&apos;ll do
              </div>
              <h2 className="job-section-title">
                <span className="wt-900">First-week work,</span>{" "}
                <span className="wt-300">not a year-out promise.</span>
              </h2>
              <ul className="job-list">
                {job.youllBe.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet">&rarr;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* You should have */}
            <div className="job-section reveal">
              <div className="section-marker" data-num="03">
                Who fits
              </div>
              <h2 className="job-section-title">
                <span className="wt-900">The filters.</span>{" "}
                <span className="wt-300">All real, none cosmetic.</span>
              </h2>
              <ul className="job-list">
                {job.youShouldHave.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet">&rarr;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nice to have */}
            <div className="job-section reveal">
              <div className="section-marker" data-num="04">
                Bonus
              </div>
              <h2 className="job-section-title">
                <span className="wt-900">Helpful,</span>{" "}
                <span className="wt-300">not required.</span>
              </h2>
              <ul className="job-list job-list--muted">
                {job.niceToHave.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet">&deg;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What we offer */}
            <div className="job-section reveal">
              <div className="section-marker" data-num="05">
                What you&apos;ll get
              </div>
              <h2 className="job-section-title">
                <span className="wt-900">Plain comp.</span>{" "}
                <span className="wt-300">Equity over cash.</span>
              </h2>
              <ul className="job-list">
                {job.whatWeOffer.map((item) => (
                  <li key={item} className="job-list-item">
                    <span className="job-list-bullet job-list-bullet--check">
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply form */}
            <div className="job-section job-section--apply reveal" id="apply">
              <div className="section-marker" data-num="06">
                Apply
              </div>
              <h2 className="job-section-title">
                <span className="wt-900">No cover-letter theater.</span>{" "}
                <span className="wt-300">Just send it.</span>
              </h2>
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
              View all seats
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
