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
      setError(err instanceof Error ? err.message : 'Falha ao criar a nota.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="editor-layout">
      <div className="panel editor-sidebar">
        <p className="eyebrow">Nova nota</p>
        <h1>Transforme uma ideia solta em algo consultável.</h1>
        <p className="editor-copy">
          Essa tela foi desenhada para parecer uma ferramenta real: foco na escrita, ações claras e
          uso confortável em qualquer largura de tela.
        </p>
        <div className="editor-aside-card">
          <span className="stat-label">Fluxo</span>
          <strong className="stat-value">Criar → Persistir → Exibir</strong>
        </div>
      </div>
      <NoteForm
        isSubmitting={isSubmitting}
        onCancel={() => navigate('/')}
        onSubmit={handleSubmit}
        serverError={error}
        submitLabel="Salvar nota"
      />
    </section>
  );
}
