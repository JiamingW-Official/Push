"use client";

// Push — CommandK Provider
// Provides global Cmd+K / Ctrl+K keyboard listener and mounts the overlay.
// Mount this once in app/layout.tsx — does NOT wrap children with extra DOM nodes.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import CommandK from "./CommandK";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CommandKContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const CommandKContext = createContext<CommandKContextValue>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export function useCommandK() {
  return useContext(CommandKContext);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CommandKProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <CommandKContext.Provider value={{ open, close, isOpen }}>
      {children}
      <CommandK isOpen={isOpen} onClose={close} />
    </CommandKContext.Provider>
  );
}
