'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { PageHeader } from '@/components/merchant/shared';
import '../locations.css';
import './new-location.css';

const CITY_OPTIONS = ['Brooklyn', 'New York', 'Queens', 'Jersey City', 'Other'];

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
  name: '',
  address: '',
  city: 'Brooklyn',
  neighborhood: '',
  state: 'NY',
  zip: '',
  phone: '',
  notes: '',
};

export default function NewLocationPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.address.trim()) return;
    setSubmitting(true);
    // Frontend-only mock: simulate the POST round-trip and route back to /locations.
    // Wire to api.merchant.createLocation when the backend endpoint lands.
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      window.setTimeout(() => router.push('/merchant/locations'), 1200);
    }, 480);
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
              type="text"
              className="newloc-input"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Blank Street — Williamsburg"
            />
          </label>

          <label className="newloc-field newloc-field--full">
            <span className="newloc-label">Street address</span>
            <input
              required
              type="text"
              className="newloc-input"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="123 Bedford Ave"
            />
          </label>

          <label className="newloc-field">
            <span className="newloc-label">City</span>
            <select
              className="newloc-input"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
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
              onChange={(e) => update('neighborhood', e.target.value)}
              placeholder="Williamsburg"
            />
          </label>

          <label className="newloc-field">
            <span className="newloc-label">State</span>
            <input
              type="text"
              className="newloc-input"
              value={form.state}
              onChange={(e) => update('state', e.target.value.toUpperCase().slice(0, 2))}
              maxLength={2}
            />
          </label>

          <label className="newloc-field">
            <span className="newloc-label">ZIP</span>
            <input
              type="text"
              className="newloc-input"
              value={form.zip}
              onChange={(e) => update('zip', e.target.value)}
              placeholder="11211"
            />
          </label>

          <label className="newloc-field newloc-field--full">
            <span className="newloc-label">Phone</span>
            <input
              type="tel"
              className="newloc-input"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="(718) 555-0144"
            />
          </label>

          <label className="newloc-field newloc-field--full">
            <span className="newloc-label">Notes (optional)</span>
            <textarea
              className="newloc-input newloc-textarea"
              rows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Anything ops should know — hours, parking, staff lead, etc."
            />
          </label>
        </div>

        <div className="newloc-footer">
          <p className="newloc-footnote">
            We will send a verification scan code to the venue manager once saved.
          </p>
          <div className="newloc-actions">
            <Link href="/merchant/locations" className="btn-ghost">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !form.name.trim() || !form.address.trim()}
            >
              {submitting ? 'Saving…' : submitted ? 'Saved ✓' : 'Save location'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
