"use client";

/* ============================================================
   /creator/profile — PROFILE editor. v2 (2026-05-08, Work-template)
   Champagne accent (matches /creator/me identity register).
   6 panels: identity / niches / locations / bio / portfolio / visibility.
   ============================================================ */

import { useState } from "react";
import Link from "next/link";
import { BentoModule, StatusPill } from "@/components/shared/primitives";
import {
  User,
  Tag,
  MapPin,
  FileText,
  Share2,
  Eye,
  Camera,
  CheckCircle2,
  Save,
  ArrowLeft,
} from "lucide-react";
import "@/components/shared/hub-shell.css";
import "./profile.css";

const ICON_PROPS = { size: 18, strokeWidth: 1.75 } as const;

const NICHES = [
  "Food & drink",
  "Coffee",
  "Brooklyn local",
  "Streetwear",
] as const;
const NEIGHBORHOODS = [
  { name: "Williamsburg", primary: true },
  { name: "Bushwick", primary: false },
  { name: "Greenpoint", primary: false },
];

export default function ProfilePage() {
  const [draftName, setDraftName] = useState("Alex Chen");
  const [draftHandle, setDraftHandle] = useState("@alexc.nyc");
  const [draftBio, setDraftBio] = useState(
    "Brooklyn-based creator. Coffee + neighborhood food obsessive. Push Operator tier.",
  );
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saveState !== "idle") return;
    setSaveState("saving");
    setTimeout(() => setSaveState("saved"), 800);
    setTimeout(() => setSaveState("idle"), 2400);
  };

  return (
    <main className="profile-hub" aria-label="Profile editor">
      <header className="profile-hero">
        <div className="profile-hero__left">
          <Link href="/creator/me" className="hub-back">
            <ArrowLeft size={14} strokeWidth={2.25} />
            Me
          </Link>
          <h1 className="profile-hero__title">Profile</h1>
          <p className="profile-hero__sub">
            Identity that brands see · niches you cover · neighborhoods you work
            · public bio + portfolio link.
          </p>
        </div>
        <div className="profile-hero__right">
          <button
            type="button"
            className={"profile-save profile-save--" + saveState}
            onClick={handleSave}
            disabled={saveState !== "idle"}
            aria-live="polite"
          >
            {saveState === "saving" ? (
              <>
                <Save size={14} strokeWidth={2.25} />
                Saving…
              </>
            ) : saveState === "saved" ? (
              <>
                <CheckCircle2 size={14} strokeWidth={2.25} />
                Saved
              </>
            ) : (
              <>
                <Save size={14} strokeWidth={2.25} />
                Save changes
              </>
            )}
          </button>
        </div>
      </header>

      <section className="profile-bento" aria-label="Profile modules">
        <BentoModule
          href="/creator/me"
          eyebrow="Identity · who you are"
          icon={<User {...ICON_PROPS} />}
          span={5}
          tone="champagne"
        >
          <div className="profile-id">
            <span className="profile-id__avatar" aria-hidden>
              {draftName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <div className="profile-id__copy">
              <label className="profile-field">
                <span className="profile-field__lbl">Display name</span>
                <input
                  type="text"
                  className="profile-field__input"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                />
              </label>
              <label className="profile-field">
                <span className="profile-field__lbl">Handle</span>
                <input
                  type="text"
                  className="profile-field__input"
                  value={draftHandle}
                  onChange={(e) => setDraftHandle(e.target.value)}
                />
              </label>
            </div>
          </div>
          <button
            type="button"
            className="profile-photo-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Camera size={14} strokeWidth={2.25} />
            Change photo
          </button>
        </BentoModule>

        <BentoModule
          href="/creator/profile/niches"
          eyebrow={`Niches · ${NICHES.length}`}
          icon={<Tag {...ICON_PROPS} />}
          span={4}
        >
          <div className="profile-chips">
            {NICHES.map((n) => (
              <span key={n} className="profile-chip">
                {n}
              </span>
            ))}
            <span className="profile-chip profile-chip--add">+ Add</span>
          </div>
        </BentoModule>

        <BentoModule
          href="/creator/profile/neighborhoods"
          eyebrow={`Hoods · ${NEIGHBORHOODS.length}`}
          icon={<MapPin {...ICON_PROPS} />}
          span={3}
        >
          <ul className="profile-list">
            {NEIGHBORHOODS.map((h) => (
              <li key={h.name} className="profile-list__row">
                <span className="profile-list__name">{h.name}</span>
                {h.primary ? (
                  <span className="profile-list__tag">Primary</span>
                ) : null}
              </li>
            ))}
          </ul>
        </BentoModule>

        <BentoModule
          href="/creator/profile/bio"
          eyebrow="Public bio · brand-facing"
          icon={<FileText {...ICON_PROPS} />}
          span={5}
        >
          <textarea
            className="profile-bio"
            value={draftBio}
            onChange={(e) => setDraftBio(e.target.value)}
            rows={4}
            aria-label="Public bio"
          />
          <p className="profile-bio__count">
            {draftBio.length} / 240 chars · shown on your public Push page
          </p>
        </BentoModule>

        <BentoModule
          href="/creator/portfolio"
          eyebrow="Portfolio · 18 works · share"
          icon={<Share2 {...ICON_PROPS} />}
          span={4}
        >
          <p className="profile-link__url">push.nyc/c/alex-chen</p>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat__num">142</span>
              <span className="profile-stat__lbl">Views · 30d</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat__num">8</span>
              <span className="profile-stat__lbl">Saves</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat__num">3</span>
              <span className="profile-stat__lbl">Brand inquiries</span>
            </div>
          </div>
          <span className="profile-row-status">
            <StatusPill variant="green" label="Live" dot />
          </span>
          <div className="profile-link-actions">
            <button
              type="button"
              className="profile-copy-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  void navigator.clipboard.writeText(
                    "https://push.nyc/c/alex-chen",
                  );
                }
              }}
            >
              <CheckCircle2 size={12} strokeWidth={2.25} />
              Copy link
            </button>
            <a
              href="/creator/public/alex-chen"
              target="_blank"
              rel="noreferrer"
              className="profile-preview-btn"
              onClick={(e) => e.stopPropagation()}
            >
              Preview ↗
            </a>
          </div>
        </BentoModule>

        <BentoModule
          href="/creator/settings/privacy"
          eyebrow="Visibility"
          icon={<Eye {...ICON_PROPS} />}
          span={3}
          tone="ink"
        >
          <p className="profile-vis__lbl">Public profile</p>
          <p className="profile-vis__state">ON</p>
          <p className="profile-vis__meta">
            Brands can find you in Discover. Toggle off to go private.
          </p>
        </BentoModule>
      </section>
    </main>
  );
}
