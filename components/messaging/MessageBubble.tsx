"use client";

import type { Message } from "@/lib/messaging/types";
import Image from "next/image";

interface Props {
  message: Message;
  isSelf: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function MessageBubble({ message, isSelf }: Props) {
  const hasImage = message.attachments.some((a) => a.type === "image");
  const hasFile = message.attachments.some((a) => a.type === "file");

  return (
    <div
      className={`msg-bubble-row ${isSelf ? "msg-bubble-row--self" : "msg-bubble-row--other"}`}
    >
      <div className="msg-bubble-wrap">
        {/* Campaign reference mini-card */}
        {message.contentType === "campaign-reference" &&
          message.campaignRef && (
            <div className="msg-campaign-ref">
              <span className="msg-campaign-ref__label">Campaign</span>
              <span className="msg-campaign-ref__title">
                {message.campaignRef.title}
              </span>
              <span className="msg-campaign-ref__meta">
                {message.campaignRef.businessName}
                {message.campaignRef.payout > 0
                  ? ` · $${message.campaignRef.payout}`
                  : " · Free product"}
              </span>
            </div>
          )}

        {/* Inline image attachments */}
        {hasImage && (
          <div className="msg-attachments-images">
            {message.attachments
              .filter((a) => a.type === "image")
              .map((a) => (
                <div key={a.id} className="msg-attachment-img">
                  <Image
                    src={a.url}
                    alt={a.name}
                    width={280}
                    height={180}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "auto",
                    }}
                    unoptimized
                  />
                </div>
              ))}
          </div>
        )}

        {/* Text bubble */}
        {message.content && (
          <div
            className={`msg-bubble ${isSelf ? "msg-bubble--self" : "msg-bubble--other"}`}
          >
            <p className="msg-bubble__text">{message.content}</p>
            <span
              className="msg-bubble__time"
              aria-label={formatDate(message.createdAt)}
            >
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}

        {/* File chips */}
        {hasFile && (
          <div className="msg-attachments-files">
            {message.attachments
              .filter((a) => a.type === "file")
              .map((a) => (
                <a
                  key={a.id}
                  href={a.url}
                  className="msg-file-chip"
                  download={a.name}
                  onClick={(e) => a.url === "#" && e.preventDefault()}
                >
                  <span className="msg-file-chip__icon">
                    <FileIcon />
                  </span>
                  <span className="msg-file-chip__name">{a.name}</span>
                  {a.size != null && (
                    <span className="msg-file-chip__size">
                      {formatSize(a.size)}
                    </span>
                  )}
                </a>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 1h6l3 3v9H3V1z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path d="M9 1v3h3" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
