import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorState } from '../components/ErrorState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NoteForm } from '../components/NoteForm';
import { notesAPI } from '../services/api';
import type { Note, NotePayload } from '../types/note';

export default function NoteEditPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadNote() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await notesAPI.get(id);
      setNote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar a nota.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadNote();
  }, [id]);

  async function handleSubmit(payload: NotePayload) {
    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await notesAPI.update(id, payload);
      navigate(`/notes/${updated.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading note..." />;
  }

  if (error && !note) {
    return <ErrorState message={error} onRetry={() => void loadNote()} />;
  }

  if (!note) {
    return <ErrorState message="Note not found." />;
  }

  return (
    <section className="editor-layout">
      <div className="panel editor-sidebar">
        <p className="eyebrow">Edit note</p>
        <h1>{note.title}</h1>
        <p className="editor-copy">
          Refine the structure, update the wording, and save changes with immediate feedback.
        </p>
        <div className="editor-aside-card">
          <span className="stat-label">Mode</span>
          <strong className="stat-value">Live editing</strong>
        </div>
      </div>
      <NoteForm
        initialValue={{ title: note.title, content: note.content }}
        isSubmitting={isSubmitting}
        onCancel={() => navigate(`/notes/${note.id}`)}
        onSubmit={handleSubmit}
        serverError={error}
        submitLabel="Save changes"
      />
    </section>
  );
}
