"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/data/api-client";
import type {
  ApplicationStatus,
  MockApplication,
} from "@/lib/data/mock-applications";
import {
  EmptyState,
  FilterTabs,
  PageHeader,
  StatusBadge,
  TierBadge,
} from "@/components/merchant/shared";
import "./applicants.css";

type ApplicantsTab = "all" | "pending" | "approved" | "rejected" | "shortlist";
type Decision = "accept" | "decline" | "shortlist";

interface ApplicantsPageClientProps {
  initialApplicants: MockApplication[];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return `${first}${second}`.toUpperCase();
}

function formatRoi(applicant: MockApplication): string {
  const roi = applicant.creator.conversionRate * 100;
  return `${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%`;
}

function formatFollowers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return `${n}`;
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.max(0, Math.round((now - then) / 86400000));
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}

function toSharedStatus(status: ApplicationStatus): {
  status: "active" | "closed" | "pending" | "resolved";
  label: string;
} {
  switch (status) {
    case "accepted":
      return { status: "active", label: "Approved" };
    case "declined":
      return { status: "closed", label: "Rejected" };
    case "shortlisted":
      return { status: "resolved", label: "Shortlist" };
    default:
      return { status: "pending", label: "Pending" };
  }
}

function matchesTab(status: ApplicationStatus, tab: ApplicantsTab): boolean {
  switch (tab) {
    case "pending":
      return status === "pending";
    case "approved":
      return status === "accepted";
    case "rejected":
      return status === "declined";
    case "shortlist":
      return status === "shortlisted";
    default:
      return true;
  }
}

function hasQrCode(
  value: unknown,
): value is MockApplication & { qr_code: unknown } {
  return Boolean(value && typeof value === "object" && "qr_code" in value);
}

function toastMessageForDecision(
  decision: Decision,
  response: unknown,
): string {
  if (hasQrCode(response) && response.qr_code) {
    return "QR generated";
  }

  switch (decision) {
    case "accept":
      return "Application approved";
    case "decline":
      return "Application rejected";
    default:
      return "Application shortlisted";
  }
}

export default function ApplicantsPageClient({
  initialApplicants,
}: ApplicantsPageClientProps) {
  const [activeTab, setActiveTab] = useState<ApplicantsTab>("all");
  const [allApplicants, setAllApplicants] = useState(initialApplicants);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const filteredApplicants = useMemo(
    () =>
      allApplicants.filter((application) =>
        matchesTab(application.status, activeTab),
      ),
    [activeTab, allApplicants],
  );

  // Reset focus index when filter changes / list shrinks.
  useEffect(() => {
    setFocusedIndex((current) => {
      if (filteredApplicants.length === 0) return 0;
      return Math.min(current, filteredApplicants.length - 1);
    });
  }, [filteredApplicants.length]);

  const tabCounts = useMemo(() => {
    const pending = allApplicants.filter(
      (applicant) => applicant.status === "pending",
    ).length;
    const approved = allApplicants.filter(
      (applicant) => applicant.status === "accepted",
    ).length;
    const rejected = allApplicants.filter(
      (applicant) => applicant.status === "declined",
    ).length;
    const shortlist = allApplicants.filter(
      (applicant) => applicant.status === "shortlisted",
    ).length;

    return {
      all: allApplicants.length,
      pending,
      approved,
      rejected,
      shortlist,
    };
  }, [allApplicants]);

  const tabs = useMemo(
    () => [
      { value: "all", label: "All", count: tabCounts.all },
      { value: "pending", label: "Pending", count: tabCounts.pending },
      { value: "approved", label: "Approved", count: tabCounts.approved },
      { value: "rejected", label: "Rejected", count: tabCounts.rejected },
      { value: "shortlist", label: "Shortlist", count: tabCounts.shortlist },
    ],
    [tabCounts],
  );

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2500);
  }, []);

  const decide = useCallback(
    async (application: MockApplication, decision: Decision) => {
      setPendingIds((current) => [...current, application.id]);

      const statusMap: Record<Decision, ApplicationStatus> = {
        accept: "accepted",
        decline: "declined",
        shortlist: "shortlisted",
      };
      const optimistic = { ...application, status: statusMap[decision] };

      setAllApplicants((current) =>
        current.map((item) => (item.id === optimistic.id ? optimistic : item)),
      );

      try {
        const result = await api.merchant.decideApplication(
          application.id,
          decision,
        );

        if (!result) {
          throw new Error("Decision failed");
        }

        setAllApplicants((current) =>
          current.map((item) => (item.id === result.id ? result : item)),
        );
        showToast(toastMessageForDecision(decision, result));
      } catch {
        setAllApplicants((current) =>
          current.map((item) =>
            item.id === application.id ? application : item,
          ),
        );
        showToast("Unable to update application");
      } finally {
        setPendingIds((current) =>
          current.filter((id) => id !== application.id),
        );
      }
    },
    [showToast],
  );

  const drawerApplicant = useMemo(
    () =>
      drawerId ? (allApplicants.find((a) => a.id === drawerId) ?? null) : null,
    [drawerId, allApplicants],
  );

  // Keyboard navigation: J/K (or arrow down/up) to move; Enter to open drawer; Esc closes drawer.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const editable =
        tag === "input" || tag === "textarea" || target?.isContentEditable;

      if (event.key === "Escape" && drawerId) {
        setDrawerId(null);
        return;
      }

      if (editable || drawerId) return;
      if (filteredApplicants.length === 0) return;

      if (event.key === "j" || event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedIndex((i) => {
          const next = Math.min(i + 1, filteredApplicants.length - 1);
          cardRefs.current[next]?.focus();
          return next;
        });
      } else if (event.key === "k" || event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedIndex((i) => {
          const next = Math.max(i - 1, 0);
          cardRefs.current[next]?.focus();
          return next;
        });
      } else if (event.key === "Enter") {
        const a = filteredApplicants[focusedIndex];
        if (a) setDrawerId(a.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerId, filteredApplicants, focusedIndex]);

  const pendingCount = tabCounts.pending;

  return (
    <div className="ap-page">
      <PageHeader
        eyebrow="LINKS · TALENT PIPELINE"
        title="Applicants"
        subtitle="Review creators applying to your campaigns. Approve, shortlist, or reject without leaving the queue."
      />

      <section className="ap-section" aria-label="Applicant queue">
        <div className="ap-control-row">
          <div className="ap-filter-row">
            <FilterTabs
              tabs={tabs}
              value={activeTab}
              onChange={(value) => setActiveTab(value as ApplicantsTab)}
            />
          </div>

          <aside
            className="ap-glass-tile"
            aria-label={`Pending applicants: ${pendingCount}`}
          >
            <span className="ap-glass-eyebrow">PENDING REVIEW</span>
            <span className="ap-glass-stat">{pendingCount}</span>
            <span className="ap-glass-caption">
              {pendingCount === 1
                ? "creator awaiting decision"
                : "creators awaiting decision"}
            </span>
          </aside>
        </div>

        <p className="ap-keyhint" aria-hidden="true">
          <kbd>J</kbd>
          <kbd>K</kbd>
          <span>browse</span>
          <span className="ap-keyhint-sep">·</span>
          <kbd>Enter</kbd>
          <span>details</span>
          <span className="ap-keyhint-sep">·</span>
          <kbd>Esc</kbd>
          <span>close</span>
        </p>

        <div className="ap-toast-slot" aria-live="polite" role="status">
          {toastMessage ? <div className="ap-toast">{toastMessage}</div> : null}
        </div>

        <div className="ap-list">
          {filteredApplicants.length === 0 ? (
            <EmptyState
              title="No applicants in this view"
              description="Nothing here yet. Adjust the filter, or publish a campaign to attract creators."
              ctaLabel="Create a campaign"
              ctaHref="/merchant/campaigns/new"
            />
          ) : (
            <div className="ap-card-grid">
              {filteredApplicants.map((applicant, idx) => {
                const mappedStatus = toSharedStatus(applicant.status);
                const isPending = pendingIds.includes(applicant.id);
                const matchPct = applicant.matchScore;

                return (
                  <article
                    key={applicant.id}
                    className="ap-card"
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open details for ${applicant.creator.name}`}
                    onFocus={() => setFocusedIndex(idx)}
                    onClick={() => setDrawerId(applicant.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setDrawerId(applicant.id);
                      }
                    }}
                  >
                    <div className="ap-photo-card">
                      <div className="ap-photo-avatar" aria-hidden="true">
                        {initials(applicant.creator.name)}
                      </div>
                      <div className="ap-photo-overlay">
                        <h2 className="ap-photo-name">
                          {applicant.creator.name}
                        </h2>
                        <p className="ap-photo-meta">
                          {applicant.creator.handle}
                        </p>
                      </div>
                      <span
                        className="ap-match-badge"
                        title={`Match score: ${matchPct}/98`}
                      >
                        <span className="ap-match-num">{matchPct}</span>
                        <span className="ap-match-lbl">MATCH</span>
                      </span>
                    </div>

                    <div className="ap-body">
                      <div className="ap-badges">
                        <TierBadge tier={applicant.creator.tier} />
                        <StatusBadge status={mappedStatus.status}>
                          {mappedStatus.label}
                        </StatusBadge>
                      </div>

                      <p className="ap-campaign" title={applicant.campaignName}>
                        Applied to <span>{applicant.campaignName}</span>
                      </p>

                      <dl className="ap-stats">
                        <div className="ap-stat">
                          <dt>FOLLOWERS</dt>
                          <dd>
                            {formatFollowers(applicant.creator.followers)}
                          </dd>
                        </div>
                        <div className="ap-stat">
                          <dt>CAMPAIGNS</dt>
                          <dd>{applicant.creator.campaignsCompleted}</dd>
                        </div>
                        <div className="ap-stat">
                          <dt>CONV.</dt>
                          <dd>{formatRoi(applicant)}</dd>
                        </div>
                      </dl>

                      <p className="ap-applied">
                        Applied {formatRelative(applicant.appliedAt)}
                      </p>

                      <div
                        className="ap-actions"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="btn-primary ap-action-btn"
                          disabled={
                            isPending || applicant.status === "accepted"
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            void decide(applicant, "accept");
                          }}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="btn-secondary ap-action-btn"
                          disabled={
                            isPending || applicant.status === "shortlisted"
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            void decide(applicant, "shortlist");
                          }}
                        >
                          Shortlist
                        </button>
                        <button
                          type="button"
                          className="btn-ghost ap-action-btn"
                          disabled={
                            isPending || applicant.status === "declined"
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            void decide(applicant, "decline");
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {drawerApplicant ? (
        <div
          className="ap-drawer-scrim"
          role="presentation"
          onClick={() => setDrawerId(null)}
        >
          <aside
            className="ap-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`${drawerApplicant.creator.name} details`}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="ap-drawer-head">
              <p className="ap-drawer-eyebrow">LINKS · CREATOR DETAIL</p>
              <h2 className="ap-drawer-name">{drawerApplicant.creator.name}</h2>
              <p className="ap-drawer-handle">
                {drawerApplicant.creator.handle}
              </p>
              <button
                type="button"
                className="ap-drawer-close"
                aria-label="Close drawer"
                onClick={() => setDrawerId(null)}
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M5 5 15 15M15 5 5 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </header>

            <div className="ap-drawer-row">
              <TierBadge tier={drawerApplicant.creator.tier} />
              <StatusBadge
                status={toSharedStatus(drawerApplicant.status).status}
              >
                {toSharedStatus(drawerApplicant.status).label}
              </StatusBadge>
              <span className="ap-drawer-match">
                Match {drawerApplicant.matchScore}
              </span>
            </div>

            <dl className="ap-drawer-stats">
              <div>
                <dt>PUSH SCORE</dt>
                <dd>{drawerApplicant.creator.pushScore}</dd>
              </div>
              <div>
                <dt>FOLLOWERS</dt>
                <dd>{formatFollowers(drawerApplicant.creator.followers)}</dd>
              </div>
              <div>
                <dt>COMPLETED</dt>
                <dd>{drawerApplicant.creator.campaignsCompleted}</dd>
              </div>
              <div>
                <dt>CONVERSION</dt>
                <dd>{formatRoi(drawerApplicant)}</dd>
              </div>
            </dl>

            <section className="ap-drawer-section">
              <p className="ap-drawer-label">CAMPAIGN</p>
              <p className="ap-drawer-text">{drawerApplicant.campaignName}</p>
            </section>

            <section className="ap-drawer-section">
              <p className="ap-drawer-label">PITCH</p>
              <p className="ap-drawer-text ap-drawer-pitch">
                {drawerApplicant.coverLetter}
              </p>
            </section>

            <section className="ap-drawer-section">
              <p className="ap-drawer-label">BIO</p>
              <p className="ap-drawer-text">{drawerApplicant.creator.bio}</p>
            </section>

            <footer className="ap-drawer-actions">
              <button
                type="button"
                className="btn-primary ap-action-btn"
                disabled={
                  pendingIds.includes(drawerApplicant.id) ||
                  drawerApplicant.status === "accepted"
                }
                onClick={() => {
                  void decide(drawerApplicant, "accept");
                }}
              >
                Accept
              </button>
              <button
                type="button"
                className="btn-secondary ap-action-btn"
                disabled={
                  pendingIds.includes(drawerApplicant.id) ||
                  drawerApplicant.status === "shortlisted"
                }
                onClick={() => {
                  void decide(drawerApplicant, "shortlist");
                }}
              >
                Shortlist
              </button>
              <button
                type="button"
                className="btn-ghost ap-action-btn"
                disabled={
                  pendingIds.includes(drawerApplicant.id) ||
                  drawerApplicant.status === "declined"
                }
                onClick={() => {
                  void decide(drawerApplicant, "decline");
                }}
              >
                Reject
              </button>
            </footer>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
