"use client";

import { useState, useCallback } from "react";
import type { UserRole, CreateThreadPayload } from "@/lib/messaging/types";

// Selectable contacts — in real app fetched from API
const MERCHANT_CONTACTS = [
  { userId: "demo-merchant-001", name: "Blank Street Coffee" },
  { userId: "demo-merchant-002", name: "Superiority Burger" },
  { userId: "demo-merchant-003", name: "Momofuku Noodle Bar" },
  { userId: "demo-merchant-004", name: "Levain Bakery" },
  { userId: "demo-merchant-005", name: "Via Carota" },
  { userId: "demo-merchant-006", name: "Russ & Daughters" },
  { userId: "demo-merchant-007", name: "Smorgasburg" },
  { userId: "demo-merchant-008", name: "The Odeon" },
];

const CREATOR_CONTACTS = [{ userId: "demo-user-001", name: "Alex Chen" }];

interface Props {
  selfRole: UserRole;
  onClose: () => void;
  onCreate: (payload: CreateThreadPayload) => Promise<void>;
}

export default function NewThreadModal({ selfRole, onClose, onCreate }: Props) {
  const contacts =
    selfRole === "creator" ? MERCHANT_CONTACTS : CREATOR_CONTACTS;

  const [recipientId, setRecipientId] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const recipientRole: UserRole =
    selfRole === "creator" ? "merchant" : "creator";
  const canSubmit =
    recipientId.trim() !== "" &&
    initialMessage.trim().length > 0 &&
    !submitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onCreate({
        participantUserId: recipientId,
        participantRole: recipientRole,
        initialMessage: initialMessage.trim(),
      });
      onClose();
    } catch {
      setSubmitting(false);
    }
  }, [
    canSubmit,
    recipientId,
    recipientRole,
    initialMessage,
    onCreate,
    onClose,
  ]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-thread-title"
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title" id="new-thread-title">
            New Conversation
          </h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="modal__body">
          <div className="modal__field">
            <label className="modal__label" htmlFor="new-thread-recipient">
              {selfRole === "creator" ? "Select merchant" : "Select creator"}
            </label>
            <select
              id="new-thread-recipient"
              className="modal__select"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
            >
              <option value="">Choose a contact…</option>
              {contacts.map((c) => (
                <option key={c.userId} value={c.userId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="new-thread-message">
              First message
            </label>
            <textarea
              id="new-thread-message"
              className="modal__textarea"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Write your opening message…"
              rows={4}
            />
          </div>
        </div>

        <div className="modal__footer">
          <button
            type="button"
            className="modal__btn modal__btn--cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal__btn modal__btn--primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {submitting ? "Sending…" : "Start conversation"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 2L14 14M14 2L2 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
