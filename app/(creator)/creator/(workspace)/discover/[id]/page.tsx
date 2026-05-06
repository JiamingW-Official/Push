"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_CAMPAIGNS } from "@/lib/mocks/campaigns";
import { normalizePay, totalNormalizedPay } from "@/lib/services/pricing";
import "./detail.css";

/* Discover detail — placeholder. Renders the campaign anatomy in a
   single-column reading layout. Replace with full apply flow when
   the brand-side flow ships. */

export default function DiscoverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const c = MOCK_CAMPAIGNS.find((x) => x.id === id);
  if (!c) notFound();

  const { headline, estimate } = normalizePay(
    c.cashPay,
    c.payUnit,
    c.deliverables,
  );
  const totalPay = totalNormalizedPay(c.cashPay, c.deliverables);

  return (
    <article className="disc-detail">
      <Link
        href="/creator/discover"
        prefetch={false}
        className="disc-detail-back"
      >
        ← Back to discover
      </Link>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="disc-detail-hero" src={c.images[0]} alt="" />

      <header className="disc-detail-head">
        <p className="disc-detail-eyebrow">
          {c.category} · {c.neighborhood} · {c.distanceMi}mi
        </p>
        <h1 className="disc-detail-title">{c.title}</h1>
        <p className="disc-detail-merchant">{c.merchantName}</p>
      </header>

      {c.tagline && <p className="disc-detail-tagline">{c.tagline}</p>}

      <section className="disc-detail-pay">
        <span className="disc-detail-pay-headline">{headline}</span>
        {estimate && (
          <span className="disc-detail-pay-estimate">{estimate}</span>
        )}
        <span className="disc-detail-pay-total">~${totalPay} total</span>
      </section>

      <section className="disc-detail-deliverables">
        <h2 className="disc-detail-section-title">Deliverables</h2>
        <ul className="disc-detail-deliverable-list">
          {c.deliverables.map((d, i) => (
            <li key={i}>
              {d.count}× {d.type} · ${d.unitPay} each · {d.estHoursEach}h est.
            </li>
          ))}
        </ul>
      </section>

      <section className="disc-detail-meta">
        <div>
          <span className="disc-detail-meta-label">Format</span>
          <span className="disc-detail-meta-value">
            {c.format === "in-person"
              ? "In-person"
              : c.format === "remote"
                ? "Remote"
                : "Hybrid"}
          </span>
        </div>
        <div>
          <span className="disc-detail-meta-label">Slots open</span>
          <span className="disc-detail-meta-value">
            {c.slotsRemaining} of {c.slotsTotal}
          </span>
        </div>
        <div>
          <span className="disc-detail-meta-label">Tier required</span>
          <span className="disc-detail-meta-value">T{c.minimumTier}+</span>
        </div>
        {c.deadlineIso && (
          <div>
            <span className="disc-detail-meta-label">Deadline</span>
            <span className="disc-detail-meta-value">{c.deadlineIso}</span>
          </div>
        )}
      </section>

      <button type="button" className="disc-detail-apply">
        Apply now
      </button>
    </article>
  );
}
