'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import './modal.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5 15 15M15 5 5 15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ms-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className={[`ms-modal-dialog`, `ms-modal-dialog--${size}`].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ms-modal-header">
          <h2 className="ms-modal-title">{title}</h2>
          <button type="button" className="ms-modal-close" aria-label="Close modal" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="ms-modal-body">{children}</div>
        {footer ? <div className="ms-modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
