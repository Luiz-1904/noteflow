package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"notesapp/backend/internal/model"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrNoteNotFound = errors.New("note not found")

type NoteRepository struct {
	pool *pgxpool.Pool
}

func NewNoteRepository(pool *pgxpool.Pool) *NoteRepository {
	return &NoteRepository{pool: pool}
}

func (r *NoteRepository) List(ctx context.Context, search string) ([]model.Note, error) {
	query := `
		SELECT id, title, content, created_at, updated_at
		FROM notes
		WHERE ($1 = '' OR LOWER(title) LIKE '%' || LOWER($1) || '%')
		ORDER BY updated_at DESC, created_at DESC
	`

	rows, err := r.pool.Query(ctx, query, strings.TrimSpace(search))
	if err != nil {
		return nil, fmt.Errorf("list notes: %w", err)
	}
	defer rows.Close()

	notes := make([]model.Note, 0)
	for rows.Next() {
		note, err := scanNote(rows)
		if err != nil {
			return nil, err
		}
		notes = append(notes, note)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate notes: %w", err)
	}

	return notes, nil
}

func (r *NoteRepository) GetByID(ctx context.Context, id string) (model.Note, error) {
	query := `
		SELECT id, title, content, created_at, updated_at
		FROM notes
		WHERE id = $1
	`

	row := r.pool.QueryRow(ctx, query, id)
	note, err := scanNote(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.Note{}, ErrNoteNotFound
		}
		return model.Note{}, fmt.Errorf("get note by id: %w", err)
	}

	return note, nil
}

func (r *NoteRepository) Create(ctx context.Context, note model.Note) (model.Note, error) {
	query := `
		INSERT INTO notes (id, title, content, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, title, content, created_at, updated_at
	`

	row := r.pool.QueryRow(ctx, query, note.ID, note.Title, note.Content, note.CreatedAt, note.UpdatedAt)
	created, err := scanNote(row)
	if err != nil {
		return model.Note{}, fmt.Errorf("create note: %w", err)
	}

	return created, nil
}

func (r *NoteRepository) Update(ctx context.Context, note model.Note) (model.Note, error) {
	query := `
		UPDATE notes
		SET title = $2, content = $3, updated_at = $4
		WHERE id = $1
		RETURNING id, title, content, created_at, updated_at
	`

	row := r.pool.QueryRow(ctx, query, note.ID, note.Title, note.Content, note.UpdatedAt)
	updated, err := scanNote(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.Note{}, ErrNoteNotFound
		}
		return model.Note{}, fmt.Errorf("update note: %w", err)
	}

	return updated, nil
}

func (r *NoteRepository) Delete(ctx context.Context, id string) error {
	commandTag, err := r.pool.Exec(ctx, `DELETE FROM notes WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("delete note: %w", err)
	}

	if commandTag.RowsAffected() == 0 {
		return ErrNoteNotFound
	}

	return nil
}

type noteScanner interface {
	Scan(dest ...any) error
}

func scanNote(scanner noteScanner) (model.Note, error) {
	var note model.Note
	err := scanner.Scan(
		&note.ID,
		&note.Title,
		&note.Content,
		&note.CreatedAt,
		&note.UpdatedAt,
	)
	if err != nil {
		return model.Note{}, err
	}

	return note, nil
}

func NewNote(id, title, content string, createdAt, updatedAt time.Time) model.Note {
	return model.Note{
		ID:        id,
		Title:     title,
		Content:   content,
		CreatedAt: createdAt,
		UpdatedAt: updatedAt,
	}
}
