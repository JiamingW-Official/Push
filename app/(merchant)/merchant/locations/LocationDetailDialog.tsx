'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import './location-detail-dialog.css';

type LocationStatus = 'open' | 'closed';

type QrCode = {
  id: string;
  label: string;
  scans_today: number;
  scans_total: number;
  active: boolean;
};

type CampaignHistoryItem = {
  id: string;
  title: string;
  status: 'active' | 'closed' | 'paused';
  creators: number;
  scans: number;
  revenue: number;
  period: string;
};

type BusinessHours = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

export type LocationDetail = {
  id: string;
  name: string;
  business_name?: string;
  neighborhood: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  status: LocationStatus;
  image_url?: string;
  phone?: string;
  email?: string;
  scans_7d: number;
  conversions_30d: number;
  staff_count: number;
  primary_campaign_title: string | null;
  primary_campaign_status: 'active' | 'paused' | 'closed' | null;
  qr_codes: QrCode[];
  campaign_history: CampaignHistoryItem[];
  hours: BusinessHours[];
  lat: number;
  lng: number;
};

interface LocationDetailDialogProps {
  location: LocationDetail | null;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const nodes = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  return Array.from(nodes).filter((el) => el.getAttribute('aria-hidden') !== 'true');
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6 18 18M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function todayHours(hours: BusinessHours[]): string | null {
  if (hours.length === 0) return null;
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayLabel = days[new Date().getDay()];
  const today = hours.find((h) => h.day === dayLabel);
  if (!today) return null;
  if (today.closed) return 'Closed today';
  return `${today.open}–${today.close}`;
}

function formatRoi(scans: number, conversions: number): string {
  if (scans <= 0) return '—';
  return `${(conversions / Math.max(scans, 1)).toFixed(1)}x`;
}

function formatUsd(cents: number): string {
  return `$${cents.toLocaleString('en-US')}`;
}

function statusPillClass(status: 'active' | 'paused' | 'closed' | null): string {
  if (status === 'active') return 'ldd-mini-pill ldd-mini-pill--active';
  if (status === 'paused') return 'ldd-mini-pill ldd-mini-pill--paused';
  return 'ldd-mini-pill ldd-mini-pill--closed';
}

function statusPillLabel(status: 'active' | 'paused' | 'closed' | null): string {
  if (status === 'active') return 'Active';
  if (status === 'paused') return 'Paused';
  return 'Closed';
}

export function LocationDetailDialog({
  location,
  onClose,
}: LocationDetailDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Esc closes; Tab cycles focus within the dialog; focus is restored to the
  // previously-focused element on close (WCAG 2.4.3 / 2.4.11).
  useEffect(() => {
    if (!location) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        const focusables = getFocusable(dialogRef.current);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey) {
          if (active === first || !dialogRef.current?.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (active === last || !dialogRef.current?.contains(active)) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    closeBtnRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [location, onClose]);

  if (!location) return null;

  const today = todayHours(location.hours);
  const totalScansToday = location.qr_codes.reduce(
    (sum, qr) => sum + qr.scans_today,
    0,
  );
  const activeQrs = location.qr_codes.filter((q) => q.active).length;
  const recentHistory = location.campaign_history.slice(0, 3);

  return (
    <div className="ldd-backdrop" role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        className={`ldd-dialog ldd-dialog--${location.status}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Location details for ${location.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="ldd-close"
          onClick={onClose}
          aria-label="Close location details"
        >
          <CloseIcon />
        </button>

        <div className="ldd-scroll-area">
          {/* Hero — image + identity */}
          <header className="ldd-hero">
            <div className="ldd-image" aria-hidden="true">
              {location.image_url ? (
                <img
                  src={location.image_url}
                  alt=""
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <span>{location.name.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="ldd-identity">
              <p className="ldd-status-eyebrow">
                {location.status === 'open' ? 'Open' : 'Closed'}
                {today ? ` · ${today}` : ''}
              </p>
              <h2 className="ldd-name">{location.name}</h2>
              <p className="ldd-address">
                {location.address}
                <br />
                {location.neighborhood}, {location.city}, {location.state}
                {location.zip ? ` ${location.zip}` : ''}
              </p>
              {location.phone || location.email ? (
                <p className="ldd-contact">
                  {location.phone}
                  {location.phone && location.email ? ' · ' : ''}
                  {location.email}
                </p>
              ) : null}
            </div>
          </header>

          {/* Performance stats grid */}
          <section className="ldd-section ldd-stats">
            <div className="ldd-stat">
              <p className="ldd-eyebrow">Scans 7d</p>
              <p className="ldd-stat-num">{location.scans_7d.toLocaleString()}</p>
              <p className="ldd-stat-sub">{totalScansToday} today</p>
            </div>
            <div className="ldd-stat">
              <p className="ldd-eyebrow">Conversions 30d</p>
              <p className="ldd-stat-num">{location.conversions_30d}</p>
              <p className="ldd-stat-sub">last 30 days</p>
            </div>
            <div className="ldd-stat">
              <p className="ldd-eyebrow">ROI</p>
              <p className="ldd-stat-num">
                {formatRoi(location.scans_7d, location.conversions_30d)}
              </p>
              <p className="ldd-stat-sub">conv. ÷ scans</p>
            </div>
            <div className="ldd-stat">
              <p className="ldd-eyebrow">Staff</p>
              <p className="ldd-stat-num">{location.staff_count}</p>
              <p className="ldd-stat-sub">on roster</p>
            </div>
          </section>

          {/* Active campaign */}
          {location.primary_campaign_title ? (
            <section className="ldd-section">
              <p className="ldd-eyebrow">Active campaign</p>
              <div className="ldd-campaign-row">
                <p className="ldd-campaign-title">
                  {location.primary_campaign_title}
                </p>
                <span className={statusPillClass(location.primary_campaign_status)}>
                  {statusPillLabel(location.primary_campaign_status)}
                </span>
              </div>
            </section>
          ) : null}

          {/* QR codes list */}
          {location.qr_codes.length > 0 ? (
            <section className="ldd-section">
              <p className="ldd-eyebrow">
                QR codes ({activeQrs}/{location.qr_codes.length} active)
              </p>
              <ul className="ldd-qr-list">
                {location.qr_codes.map((qr) => (
                  <li className="ldd-qr-row" key={qr.id}>
                    <span
                      className={`ldd-qr-dot${qr.active ? ' ldd-qr-dot--active' : ''}`}
                      aria-hidden="true"
                    />
                    <span className="ldd-qr-label">{qr.label}</span>
                    <span className="ldd-qr-stats">
                      {qr.scans_today} today · {qr.scans_total.toLocaleString()} total
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Recent campaigns */}
          {recentHistory.length > 0 ? (
            <section className="ldd-section">
              <p className="ldd-eyebrow">Recent campaigns</p>
              <ul className="ldd-history-list">
                {recentHistory.map((item) => (
                  <li className="ldd-history-row" key={item.id}>
                    <div className="ldd-history-text">
                      <p className="ldd-history-title">{item.title}</p>
                      <p className="ldd-history-period">
                        {item.period} · {item.creators} creators · {item.scans} scans
                      </p>
                    </div>
                    <span className="ldd-history-revenue">
                      {formatUsd(item.revenue)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* Sticky action bar */}
        <footer className="ldd-actions">
          <button
            type="button"
            className="btn-ghost ldd-action-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <Link
            href={`/merchant/locations/${location.id}`}
            className="btn-primary ldd-action-primary"
            onClick={onClose}
          >
            Manage location
          </Link>
        </footer>
      </div>
    </div>
  );
}
