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
          <p className="eyebrow">Seu espaço de notas</p>
          <h1>Uma notes app que parece produto, não exercício.</h1>
          <p className="hero-copy">
            Busca instantânea, persistência real e uma interface pensada para apresentar arquitetura
            full-stack com clareza.
          </p>
          <div className="hero-badges" aria-label="Principais recursos">
            <span className="hero-badge">Busca por título</span>
            <span className="hero-badge">Persistência em banco</span>
            <span className="hero-badge">CRUD completo</span>
          </div>
        </div>
        <div className="hero-side">
          <SearchInput value={searchValue} onChange={setSearchValue} />
          <div className="hero-stats" aria-label="Resumo de notas">
            <article className="stat-card">
              <span className="stat-label">Notas salvas</span>
              <strong className="stat-value">{notes.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">Palavras no acervo</span>
              <strong className="stat-value">{totalWords}</strong>
            </article>
            <article className="stat-card stat-card-highlight">
              <span className="stat-label">Última atividade</span>
              <strong className="stat-value">
                {latestNote ? latestNote.title : 'Sem notas ainda'}
              </strong>
            </article>
          </div>
        </div>
      </section>

      {deleteError ? (
        <ErrorState message={deleteError} onRetry={() => void reload()} />
      ) : null}

      {isLoading ? <LoadingSpinner label="Carregando notas..." /> : null}

      {!isLoading && error ? <ErrorState message={error} onRetry={() => void reload()} /> : null}

      {!isLoading && !error && notes.length === 0 ? (
        <EmptyState
          title={searchValue ? 'Nenhum resultado encontrado' : 'Nenhuma nota ainda'}
          description={
            searchValue
              ? 'Tente outro termo de busca para localizar a nota pelo título.'
              : 'Crie sua primeira nota para começar a organizar suas ideias.'
          }
        />
      ) : null}

      {!isLoading && !error && notes.length > 0 ? (
        <section className="notes-grid-layout">
          <div className="notes-column-main">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Coleção</p>
                <h2>Notas recentes</h2>
              </div>
              <p className="section-copy">
                Ordenadas por atualização para privilegiar o que está vivo no seu fluxo.
              </p>
            </div>
            <NoteList notes={notes} onDelete={setNoteToDelete} />
          </div>

          <aside className="notes-column-side panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Resumo visual</p>
                <h2>O que este projeto comunica</h2>
              </div>
            </div>
            <ul className="feature-list">
              <li>Integra frontend, API e banco com contrato JSON simples e limpo.</li>
              <li>Mostra estados de loading, erro, vazio e mutações sem refresh manual.</li>
              <li>Tem layout mobile-first, contraste forte e tipografia com hierarquia.</li>
              <li>É pequeno o bastante para terminar e sólido o bastante para entrar no currículo.</li>
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
