import { useState } from 'react';

import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NoteList } from '../components/NoteList';
import { SearchInput } from '../components/SearchInput';
import { useNotes } from '../features/notes/useNotes';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { notesAPI } from '../services/api';
import type { Note } from '../types/note';

export default function NotesListPage() {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebouncedValue(searchValue, 300);
  const { notes, setNotes, isLoading, error, reload } = useNotes(debouncedSearch);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const totalWords = notes.reduce(
    (count, note) => count + note.content.trim().split(/\s+/).filter(Boolean).length,
    0,
  );
  const latestNote = notes[0];

  async function confirmDelete() {
    if (!noteToDelete) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await notesAPI.remove(noteToDelete.id);
      setNotes((current) => current.filter((note) => note.id !== noteToDelete.id));
      setNoteToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Falha ao excluir a nota.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <section className="hero panel">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Notes built for flow, not clutter.</h1>
          <p className="hero-copy">
            A focused space for drafting, reviewing, and finding notes fast across desktop and
            mobile.
          </p>
          <div className="hero-badges" aria-label="Principais recursos">
            <span className="hero-badge">Instant search</span>
            <span className="hero-badge">Persistent storage</span>
            <span className="hero-badge">Clean CRUD flow</span>
          </div>
        </div>
        <div className="hero-side">
          <SearchInput value={searchValue} onChange={setSearchValue} />
          <div className="hero-stats" aria-label="Notes summary">
            <article className="stat-card">
              <span className="stat-label">Saved notes</span>
              <strong className="stat-value">{notes.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">Words stored</span>
              <strong className="stat-value">{totalWords}</strong>
            </article>
            <article className="stat-card stat-card-highlight">
              <span className="stat-label">Latest entry</span>
              <strong className="stat-value">
                {latestNote ? latestNote.title : 'No notes yet'}
              </strong>
            </article>
          </div>
        </div>
      </section>

      {deleteError ? <ErrorState message={deleteError} onRetry={() => void reload()} /> : null}

      {isLoading ? <LoadingSpinner label="Loading notes..." /> : null}

      {!isLoading && error ? <ErrorState message={error} onRetry={() => void reload()} /> : null}

      {!isLoading && !error && notes.length === 0 ? (
        <EmptyState
          title={searchValue ? 'No results found' : 'No notes yet'}
          description={
            searchValue
              ? 'Try a different title or clear the search to browse everything again.'
              : 'Create your first note and start building a searchable working archive.'
          }
        />
      ) : null}

      {!isLoading && !error && notes.length > 0 ? (
        <section className="notes-grid-layout">
          <div className="notes-column-main">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Library</p>
                <h2>Recent notes</h2>
              </div>
              <p className="section-copy">
                Ordered by recent activity so the notes you are actively shaping stay on top.
              </p>
            </div>
            <NoteList notes={notes} onDelete={setNoteToDelete} />
          </div>

          <aside className="notes-column-side panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Overview</p>
                <h2>Designed for real use</h2>
              </div>
            </div>
            <ul className="feature-list">
              <li>Fast title search makes note retrieval feel immediate.</li>
              <li>Every mutation reflects in the interface without manual refresh.</li>
              <li>The layout stays readable and touch-friendly on smaller screens.</li>
              <li>The visual system is compact, intentional, and built to feel product-ready.</li>
            </ul>
          </aside>
        </section>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(noteToDelete)}
        isPending={isDeleting}
        note={noteToDelete}
        onCancel={() => {
          if (!isDeleting) {
            setNoteToDelete(null);
          }
        }}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}
