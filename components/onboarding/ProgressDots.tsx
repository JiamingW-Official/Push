"use client";

interface ProgressDotsProps {
  total: number;
  current: number; // 1-based
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div
      className="ob2-progress"
      aria-label={`Step ${current} of ${total}`}
      role="status"
    >
      <span className="ob2-progress-text">
        {current} of {total}
      </span>
      <div className="ob2-dots" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          return (
            <span
              key={n}
              className={[
                "ob2-dot",
                n === current ? "ob2-dot--active" : "",
                n < current ? "ob2-dot--done" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}
