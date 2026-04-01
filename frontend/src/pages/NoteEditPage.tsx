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
      setError(err instanceof Error ? err.message : 'Falha ao atualizar a nota.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Carregando dados da nota..." />;
  }

  if (error && !note) {
    return <ErrorState message={error} onRetry={() => void loadNote()} />;
  }

  if (!note) {
    return <ErrorState message="Nota não encontrada." />;
  }

  return (
    <section className="editor-layout">
      <div className="panel editor-sidebar">
        <p className="eyebrow">Editar nota</p>
        <h1>{note.title}</h1>
        <p className="editor-copy">
          Altere título e conteúdo com retorno imediato na UI. O backend atualiza `updated_at` e a
          listagem reflete a mudança sem refresh manual.
        </p>
        <div className="editor-aside-card">
          <span className="stat-label">Ação</span>
          <strong className="stat-value">Update com feedback direto</strong>
        </div>
      </div>
      <NoteForm
        initialValue={{ title: note.title, content: note.content }}
        isSubmitting={isSubmitting}
        onCancel={() => navigate(`/notes/${note.id}`)}
        onSubmit={handleSubmit}
        serverError={error}
        submitLabel="Salvar alterações"
      />
    </section>
  );
}
