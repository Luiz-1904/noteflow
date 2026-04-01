import { Link } from 'react-router-dom';

import type { Note } from '../types/note';
import { formatDate } from '../utils/date';

export function NoteCard({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: (note: Note) => void;
}) {
  const excerpt =
    note.content.length > 120 ? `${note.content.slice(0, 120).trimEnd()}...` : note.content;
  const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <article className="note-card">
      <div className="note-card-header">
        <div>
          <p className="eyebrow">Atualizada em {formatDate(note.updated_at)}</p>
          <h2>{note.title}</h2>
          <div className="note-card-meta">
            <span>{Math.max(wordCount, 1)} palavras</span>
            <span>Nota ativa</span>
          </div>
        </div>
        <div className="note-card-actions">
          <Link className="button button-secondary" to={`/notes/${note.id}`}>
            Abrir
          </Link>
          <button className="button button-danger" onClick={() => onDelete(note)} type="button">
            Excluir
          </button>
        </div>
      </div>
      <p className="note-card-content">{excerpt}</p>
    </article>
  );
}
