"use client";

import { useCallback, useState } from "react";

/**
 * Generic multi-select hook for list pages (audit § P2-17). Tracks a
 * Set<id> of selected items, with shift-click range support and
 * cmd/ctrl-click toggles.
 *
 * The hook doesn't care about the items' shape — pass an `items` array
 * for shift-click range computation, then call `toggle(id, modifiers?)`
 * from each row's click handler.
 */

type Modifiers = {
  shift?: boolean;
  cmd?: boolean;
};

export function useMultiSelect<T extends { id: string }>(items: T[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);

  const isSelected = useCallback((id: string) => selected.has(id), [selected]);

  const toggle = useCallback(
    (id: string, mods: Modifiers = {}) => {
      setSelected((prev) => {
        const next = new Set(prev);

        if (mods.shift && lastClickedId) {
          // Range select from lastClicked → current.
          const ids = items.map((it) => it.id);
          const startIdx = ids.indexOf(lastClickedId);
          const endIdx = ids.indexOf(id);
          if (startIdx >= 0 && endIdx >= 0) {
            const [from, to] =
              startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
            for (let i = from; i <= to; i++) {
              const itemId = ids[i];
              if (itemId) next.add(itemId);
            }
          }
        } else if (mods.cmd) {
          // Cmd/Ctrl-click toggles individual.
          if (next.has(id)) next.delete(id);
          else next.add(id);
        } else {
          // Plain click toggles single (preserves existing).
          if (next.has(id)) next.delete(id);
          else next.add(id);
        }

        return next;
      });
      setLastClickedId(id);
    },
    [items, lastClickedId],
  );

  const selectAll = useCallback(() => {
    setSelected(new Set(items.map((it) => it.id)));
  }, [items]);

  const clear = useCallback(() => {
    setSelected(new Set());
    setLastClickedId(null);
  }, []);

  return {
    selected,
    isSelected,
    toggle,
    selectAll,
    clear,
    count: selected.size,
  };
}
