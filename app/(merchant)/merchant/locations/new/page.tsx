"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/merchant/shared";
import { useToast } from "@/components/toast/Toaster";
import {
  MOCK_LOCATIONS,
  type Location as MerchantLocation,
} from "@/lib/merchant/mock-locations";
import "../locations.css";
import "./new-location.css";

const CITY_OPTIONS = ["Brooklyn", "New York", "Queens", "Jersey City", "Other"];

interface FormState {
  name: string;
  address: string;
  city: string;
  neighborhood: string;
  state: string;
  zip: string;
  phone: string;
  notes: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  address: "",
  city: "Brooklyn",
  neighborhood: "",
  state: "NY",
  zip: "",
  phone: "",
  notes: "",
};

const DEFAULT_HOURS = [
  { day: "Monday", open: "08:00", close: "20:00", closed: false },
  { day: "Tuesday", open: "08:00", close: "20:00", closed: false },
  { day: "Wednesday", open: "08:00", close: "20:00", closed: false },
  { day: "Thursday", open: "08:00", close: "21:00", closed: false },
  { day: "Friday", open: "08:00", close: "22:00", closed: false },
  { day: "Saturday", open: "09:00", close: "22:00", closed: false },
  { day: "Sunday", open: "10:00", close: "18:00", closed: false },
];

function buildLocation(form: FormState): MerchantLocation {
  const id = `loc-mock-${Date.now()}`;
  const now = new Date().toISOString();
  return {
    id,
    merchant_id: "demo-merchant-001",
    tenant_id: "tenant-demo-001",
    name: form.name.trim(),
    business_name: form.name.trim(),
    neighborhood: form.neighborhood.trim() || form.city,
    address: form.address.trim(),
    city: form.city,
    state: form.state || "NY",
    zip: form.zip.trim(),
    lat: 40.7128,
    lng: -74.006,
    status: "open",
    image_url:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
    phone: form.phone.trim(),
    email: "",
    scans_7d: 0,
    conversions_30d: 0,
    staff_count: 0,
    primary_campaign_title: null,
    primary_campaign_status: null,
    qr_codes: [],
    staff: [],
    hours: DEFAULT_HOURS,
    campaign_history: [],
    pos_integrations: [
      { name: "Square", connected: false },
      { name: "Toast", connected: false },
      { name: "Clover", connected: false },
    ],
    created_at: now,
  };
}

export default function NewLocationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const zipRef = useRef<HTMLInputElement | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    if (!form.name.trim()) {
      toast.error("Add a venue name to continue");
      nameRef.current?.focus();
      return;
    }
    if (!form.address.trim()) {
      toast.error("Add a street address to continue");
      addressRef.current?.focus();
      return;
    }
    if (!form.zip.trim()) {
      toast.error("Add a ZIP code to continue");
      zipRef.current?.focus();
      return;
    }

    setSubmitting(true);
    const next = buildLocation(form);
    // Mutate the in-process mock store so the locations list picks it up.
    // Mirrors the existing `_qrStore` / `_applications` pattern in api-client.
    MOCK_LOCATIONS.unshift(next);

    toast.success(`Location saved · ${next.name}`);
    router.push("/merchant/locations");
  };

  return (
    <section className="loc-page">
      <PageHeader
        eyebrow="Locations · New"
        title="Add a location"
        subtitle="Register a new venue so creators can route scans here. Drafts are saved locally until backend wiring lands."
        action={
          <Link href="/merchant/locations" className="btn-ghost">
            Cancel
          </Link>
        }
      />

      <form className="newloc-form" onSubmit={onSubmit} noValidate>
        <div className="newloc-grid">
          <label className="newloc-field newloc-field--full">
            <span className="newloc-label">Venue name</span>
            <input
              required
              ref={nameRef}
              type="text"
              className="newloc-input"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Blank Street — Williamsburg"
            />
          </label>

          <label className="newloc-field newloc-field--full">
            <span className="newloc-label">Street address</span>
            <input
              required
              ref={addressRef}
              type="text"
              className="newloc-input"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="123 Bedford Ave"
            />
          </label>

          <label className="newloc-field">
            <span className="newloc-label">City</span>
            <select
              className="newloc-input"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            >
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="newloc-field">
            <span className="newloc-label">Neighborhood</span>
            <input
              type="text"
              className="newloc-input"
              value={form.neighborhood}
              onChange={(e) => update("neighborhood", e.target.value)}
              placeholder="Williamsburg"
            />
          </label>

          <label className="newloc-field">
            <span className="newloc-label">State</span>
            <input
              type="text"
              className="newloc-input"
              value={form.state}
              onChange={(e) =>
                update("state", e.target.value.toUpperCase().slice(0, 2))
              }
              maxLength={2}
            />
          </label>

          <label className="newloc-field">
            <span className="newloc-label">ZIP</span>
            <input
              ref={zipRef}
              type="text"
              className="newloc-input"
              value={form.zip}
              onChange={(e) => update("zip", e.target.value)}
              placeholder="11211"
            />
          </label>

          <label className="newloc-field newloc-field--full">
            <span className="newloc-label">Phone</span>
            <input
              type="tel"
              className="newloc-input"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="(718) 555-0144"
            />
          </label>

          <label className="newloc-field newloc-field--full">
            <span className="newloc-label">Notes (optional)</span>
            <textarea
              className="newloc-input newloc-textarea"
              rows={3}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Anything ops should know — hours, parking, staff lead, etc."
            />
          </label>
        </div>

        <div className="newloc-footer">
          <p className="newloc-footnote">
            We will send a verification scan code to the venue manager once
            saved.
          </p>
          <div className="newloc-actions">
            <Link href="/merchant/locations" className="btn-ghost">
              Cancel
            </Link>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : "Save location"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
