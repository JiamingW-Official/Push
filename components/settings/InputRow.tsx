"use client";

interface InputRowProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "url" | "tel";
  multiline?: boolean;
  maxLength?: number;
  disabled?: boolean;
}

export function InputRow({
  label,
  description,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  maxLength,
  disabled = false,
}: InputRowProps) {
  return (
    <div className={`input-row${disabled ? " input-row--disabled" : ""}`}>
      <div className="input-row__label-group">
        <label className="input-row__label">{label}</label>
        {description && <span className="input-row__desc">{description}</span>}
      </div>
      <div className="input-row__field">
        {multiline ? (
          <textarea
            className="push-input push-input--textarea"
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={4}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            className="push-input"
            type={type}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        {maxLength && (
          <span className="input-row__counter">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
