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
      nextErrors.title = 'Informe um título.';
    }
    if (!content.trim()) {
      nextErrors.content = 'Informe um conteúdo.';
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
          <h2>Escreva com clareza</h2>
        </div>
        <p className="form-copy">
          Use um título direto e um conteúdo escaneável. Esse layout foi pensado para funcionar bem
          em desktop e mobile.
        </p>
      </div>

      <div className="field-group">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          maxLength={120}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex.: Estudar Go"
          value={title}
        />
        {errors.title ? <p className="field-error">{errors.title}</p> : null}
      </div>

      <div className="field-group">
        <label htmlFor="content">Conteúdo</label>
        <textarea
          id="content"
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escreva sua nota aqui."
          rows={10}
          value={content}
        />
        {errors.content ? <p className="field-error">{errors.content}</p> : null}
      </div>

      {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}

      <div className="form-tip-card">
        <strong>Dica de portfólio</strong>
        <p>
          Mostre hierarquia no texto: quebre linhas, use blocos curtos e deixe cada nota com um
          propósito claro.
        </p>
      </div>

      <div className="form-actions">
        {onCancel ? (
          <button className="button button-secondary" disabled={isSubmitting} onClick={onCancel} type="button">
            Cancelar
          </button>
        ) : null}
        <button className="button button-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
