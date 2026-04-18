"use client";

export type Channel = "email" | "push" | "sms";

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Optional per-channel toggles shown below the main row */
  channels?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    onChannelChange?: (channel: Channel, value: boolean) => void;
  };
  disabled?: boolean;
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
  channels,
  disabled = false,
}: ToggleRowProps) {
  return (
    <div className={`toggle-row${disabled ? " toggle-row--disabled" : ""}`}>
      <div className="toggle-row__main">
        <div className="toggle-row__text">
          <span className="toggle-row__label">{label}</span>
          {description && (
            <span className="toggle-row__desc">{description}</span>
          )}
        </div>
        {/* Rectangular switch — no border-radius per design */}
        <button
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          className={`toggle-switch${checked ? " toggle-switch--on" : ""}`}
          onClick={() => onChange(!checked)}
        >
          <span className="toggle-switch__thumb" />
          <span className="sr-only">{checked ? "On" : "Off"}</span>
        </button>
      </div>

      {/* Per-channel sub-toggles, shown only when parent is on */}
      {channels && checked && (
        <div className="toggle-row__channels">
          {(["email", "push", "sms"] as Channel[]).map((ch) => {
            const val = channels[ch] ?? false;
            return (
              <button
                key={ch}
                className={`channel-chip${val ? " channel-chip--on" : ""}`}
                onClick={() => channels.onChannelChange?.(ch, !val)}
              >
                {ch.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
