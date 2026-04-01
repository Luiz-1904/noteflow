import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NoteForm } from '../components/NoteForm';
import { notesAPI } from '../services/api';
import type { NotePayload } from '../types/note';

export default function NoteCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(payload: NotePayload) {
    setIsSubmitting(true);
    setError(null);

    try {
      const note = await notesAPI.create(payload);
      navigate(`/notes/${note.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="editor-layout">
      <div className="panel editor-sidebar">
        <p className="eyebrow">New note</p>
        <h1>Start a note worth coming back to.</h1>
        <p className="editor-copy">
          Draft quickly, keep the structure clean, and save without breaking your flow.
        </p>
        <div className="editor-aside-card">
          <span className="stat-label">Workflow</span>
          <strong className="stat-value">Compose → Save → Review</strong>
        </div>
      </div>
      <NoteForm
        isSubmitting={isSubmitting}
        onCancel={() => navigate('/')}
        onSubmit={handleSubmit}
        serverError={error}
        submitLabel="Save note"
      />
    </section>
  );
}
