import { useEffect, useState } from 'react';

import { notesAPI } from '../../services/api';
import type { Note } from '../../types/note';

export function useNotes(search: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadNotes() {
    setIsLoading(true);
    setError(null);

    try {
      const nextNotes = await notesAPI.list(search);
      setNotes(nextNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar notas.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadNotes();
  }, [search]);

  return {
    notes,
    setNotes,
    isLoading,
    error,
    reload: loadNotes,
  };
}
