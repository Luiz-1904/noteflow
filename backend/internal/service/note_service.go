package service

import (
	"context"
	"errors"
	"strings"
	"time"

	"notesapp/backend/internal/model"
	"notesapp/backend/internal/repository"

	"github.com/google/uuid"
)

var (
	ErrTitleRequired   = errors.New("title is required")
	ErrContentRequired = errors.New("content is required")
)

type NoteService struct {
	repository *repository.NoteRepository
}

func NewNoteService(repository *repository.NoteRepository) *NoteService {
	return &NoteService{repository: repository}
}

func (s *NoteService) List(ctx context.Context, search string) ([]model.Note, error) {
	return s.repository.List(ctx, search)
}

func (s *NoteService) GetByID(ctx context.Context, id string) (model.Note, error) {
	return s.repository.GetByID(ctx, strings.TrimSpace(id))
}

func (s *NoteService) Create(ctx context.Context, input model.CreateNoteInput) (model.Note, error) {
	title := strings.TrimSpace(input.Title)
	content := strings.TrimSpace(input.Content)

	if title == "" {
		return model.Note{}, ErrTitleRequired
	}
	if content == "" {
		return model.Note{}, ErrContentRequired
	}

	now := time.Now().UTC()
	note := repository.NewNote(uuid.NewString(), title, content, now, now)
	return s.repository.Create(ctx, note)
}

func (s *NoteService) Update(ctx context.Context, id string, input model.UpdateNoteInput) (model.Note, error) {
	title := strings.TrimSpace(input.Title)
	content := strings.TrimSpace(input.Content)

	if title == "" {
		return model.Note{}, ErrTitleRequired
	}
	if content == "" {
		return model.Note{}, ErrContentRequired
	}

	note := model.Note{
		ID:        strings.TrimSpace(id),
		Title:     title,
		Content:   content,
		UpdatedAt: time.Now().UTC(),
	}

	return s.repository.Update(ctx, note)
}

func (s *NoteService) Delete(ctx context.Context, id string) error {
	return s.repository.Delete(ctx, strings.TrimSpace(id))
}
