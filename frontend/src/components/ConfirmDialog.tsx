import { useEffect } from 'react';

import type { Note } from '../types/note';

export function ConfirmDialog({
  note,
  isOpen,
  isPending,
  onCancel,
  onConfirm,
}: {
  note: Note | null;
  isOpen: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isPending) {
        onCancel();
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isPending, onCancel]);

  if (!isOpen || !note) {
    return null;
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <div
        aria-describedby="confirm-delete-description"
        aria-labelledby="confirm-delete-title"
        aria-modal="true"
        className="dialog"
        role="dialog"
      >
        <h2 id="confirm-delete-title">Delete note</h2>
        <p id="confirm-delete-description">
          <strong>{note.title}</strong> will be permanently removed.
        </p>
        <div className="dialog-actions">
          <button className="button button-secondary" disabled={isPending} onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="button button-danger" disabled={isPending} onClick={onConfirm} type="button">
            {isPending ? 'Deleting...' : 'Delete note'}
          </button>
        </div>
      </div>
    </div>
  );
}
