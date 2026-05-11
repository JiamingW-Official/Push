"use client";

/* ============================================================
   <CampaignLocation> — address + embedded map + public note
   v11 · 2026-05-09

   Uses OpenStreetMap embed (no API key required) to render a
   tile-based map preview centered on the campaign lat/lng. For
   directions we link out to Google Maps.
   ============================================================ */

import { ExternalLink, MapPin, Navigation } from "lucide-react";
import type { Campaign } from "@/lib/mocks/campaigns";

export function CampaignLocation({ campaign }: { campaign: Campaign }) {
  const addr = campaign.address;
  if (!addr) {
    return (
      <div className="cd-loc-empty">
        <p>Location details not yet published. The merchant will share the address after you apply.</p>
      </div>
    );
  }

  // OpenStreetMap embed — bbox a small box around the lat/lng so the
  // pin is centered. ~0.004 deg ≈ 400m square at NYC latitude.
  const halfBox = 0.004;
  const bbox = [
    addr.lng - halfBox,
    addr.lat - halfBox,
    addr.lng + halfBox,
    addr.lat + halfBox,
  ].join(",");
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${addr.lat},${addr.lng}`;

  // Google Maps directions deep link.
  const googleMapsHref = `https://www.google.com/maps/dir/?api=1&destination=${addr.lat},${addr.lng}`;

  return (
    <div className="cd-loc">
      <h2 className="cd-section__title">Where you&apos;ll shoot</h2>
      <p className="cd-loc__sub">
        {campaign.distanceMi.toFixed(1)} miles from your home base. Public
        transit + walking directions available.
      </p>

      <div className="cd-loc__row">
        {/* Address card */}
        <div className="cd-loc__address">
          <p className="cd-loc__addr-eyebrow">
            <MapPin size={12} strokeWidth={2} />
            Merchant address
          </p>
          <p className="cd-loc__merchant">{campaign.merchantName}</p>
          <p className="cd-loc__line">
            {addr.line1}
            {addr.line2 ? `, ${addr.line2}` : ""}
          </p>
          <p className="cd-loc__line">
            {addr.city}, {addr.state} {addr.zip}
          </p>

          {addr.publicNote && (
            <div className="cd-loc__note">
              <strong>Note from merchant:</strong> {addr.publicNote}
            </div>
          )}

          <a
            href={googleMapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="cd-loc__directions"
          >
            <Navigation size={13} strokeWidth={2} />
            Get directions
            <ExternalLink size={11} strokeWidth={2} />
          </a>
        </div>

        {/* Map preview */}
        <div className="cd-loc__map">
          <iframe
            src={embedSrc}
            title={`Map of ${campaign.merchantName}`}
            className="cd-loc__map-iframe"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
