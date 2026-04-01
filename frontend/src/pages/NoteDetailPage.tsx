import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorState } from '../components/ErrorState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { notesAPI } from '../services/api';
import type { Note } from '../types/note';
import { formatDate } from '../utils/date';

export default function NoteDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function loadNote() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await notesAPI.get(id);
      setNote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load note.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadNote();
  }, [id]);

  async function handleDelete() {
    if (!note) {
      return;
    }

    setIsDeleting(true);
    try {
      await notesAPI.remove(note.id);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note.');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading note..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void loadNote()} />;
  }

  if (!note) {
    return <ErrorState message="Note not found." />;
  }

  return (
    <>
      <article className="panel note-detail">
        <div className="detail-topbar">
          <Link className="button button-secondary" to="/">
            Back
          </Link>
          <div className="detail-actions">
            <Link className="button button-secondary" to={`/notes/${note.id}/edit`}>
              Edit
            </Link>
            <button className="button button-danger" onClick={() => setShowDeleteDialog(true)} type="button">
              Delete
            </button>
          </div>
        </div>

        <div className="page-heading">
          <p className="eyebrow">Note</p>
          <h1>{note.title}</h1>
          <p className="detail-copy">
            Full-length reading view with editing and maintenance actions kept close at hand.
          </p>
        </div>

        <dl className="detail-metadata">
          <div>
            <dt>Created</dt>
            <dd>{formatDate(note.created_at)}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{formatDate(note.updated_at)}</dd>
          </div>
          <div>
            <dt>Length</dt>
            <dd>{note.content.trim().split(/\s+/).filter(Boolean).length || 1} words</dd>
          </div>
        </dl>

        <div className="note-body">
          {note.content.split('\n').map((paragraph, index) => (
            <p key={`${note.id}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        isPending={isDeleting}
        note={note}
        onCancel={() => {
          if (!isDeleting) {
            setShowDeleteDialog(false);
          }
        }}
        onConfirm={() => void handleDelete()}
      />
    </>
  );
}
