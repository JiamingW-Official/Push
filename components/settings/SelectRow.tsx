"use client";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectRowProps {
  label: string;
  description?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SelectRow({
  label,
  description,
  value,
  options,
  onChange,
  disabled = false,
}: SelectRowProps) {
  return (
    <div className={`input-row${disabled ? " input-row--disabled" : ""}`}>
      <div className="input-row__label-group">
        <label className="input-row__label">{label}</label>
        {description && <span className="input-row__desc">{description}</span>}
      </div>
      <div className="input-row__field">
        <select
          className="push-select"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
