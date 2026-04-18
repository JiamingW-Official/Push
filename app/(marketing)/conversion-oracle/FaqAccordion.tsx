"use client";

import { useState } from "react";

type Item = { q: string; a: string };

export default function FaqAccordion({ items }: { items: Item[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="co-faq reveal">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={item.q}
            className={`co-faq-row${isOpen ? " co-faq-row--open" : ""}`}
          >
            <button
              type="button"
              className="co-faq-q"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <span
                className="co-faq-chev"
                aria-hidden="true"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
              >
                +
              </span>
            </button>
            <div className="co-faq-a" hidden={!isOpen}>
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
