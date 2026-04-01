import type { Note } from '../types/note';
import { NoteCard } from './NoteCard';

export function NoteList({
  notes,
  onDelete,
}: {
  notes: Note[];
  onDelete: (note: Note) => void;
}) {
  return (
    <section className="note-list" aria-label="Lista de notas">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </section>
  );
}
