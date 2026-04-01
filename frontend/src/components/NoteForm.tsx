import { FormEvent, useState } from 'react';

import type { NotePayload } from '../types/note';

interface NoteFormProps {
  initialValue?: NotePayload;
  isSubmitting?: boolean;
  submitLabel: string;
  onSubmit: (payload: NotePayload) => Promise<void>;
  onCancel?: () => void;
  serverError?: string | null;
}

export function NoteForm({
  initialValue = { title: '', content: '' },
  isSubmitting = false,
  submitLabel,
  onSubmit,
  onCancel,
  serverError,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialValue.title);
  const [content, setContent] = useState(initialValue.content);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: { title?: string; content?: string } = {};
    if (!title.trim()) {
      nextErrors.title = 'Add a title.';
    }
    if (!content.trim()) {
      nextErrors.content = 'Add some content.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      title: title.trim(),
      content: content.trim(),
    });
  }

  return (
    <form className="note-form panel" onSubmit={handleSubmit}>
      <div className="form-intro">
        <div>
          <p className="eyebrow">Editor</p>
          <h2>Write with structure</h2>
        </div>
        <p className="form-copy">
          Keep titles sharp, keep the body readable, and treat every note like a useful working
          document.
        </p>
      </div>

      <div className="field-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          maxLength={120}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Weekly planning, API notes, sprint retro..."
          value={title}
        />
        {errors.title ? <p className="field-error">{errors.title}</p> : null}
      </div>

      <div className="field-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write the full note here."
          rows={10}
          value={content}
        />
        {errors.content ? <p className="field-error">{errors.content}</p> : null}
      </div>

      {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}

      <div className="form-tip-card">
        <strong>Writing pattern</strong>
        <p>
          Break ideas into short sections so the same note works well in quick scans and deep reads.
        </p>
      </div>

      <div className="form-actions">
        {onCancel ? (
          <button className="button button-secondary" disabled={isSubmitting} onClick={onCancel} type="button">
            Cancel
          </button>
        ) : null}
        <button className="button button-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
