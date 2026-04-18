"use client";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Red border-left accent for danger zone */
  danger?: boolean;
}

export function SettingsSection({
  title,
  description,
  children,
  danger = false,
}: SettingsSectionProps) {
  return (
    <section
      className={`settings-section${danger ? " settings-section--danger" : ""}`}
    >
      <div className="settings-section__header">
        <h2 className="settings-section__title">{title}</h2>
        {description && <p className="settings-section__desc">{description}</p>}
      </div>
      <div className="settings-section__body">{children}</div>
    </section>
  );
}
