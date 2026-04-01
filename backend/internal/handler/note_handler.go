package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"notesapp/backend/internal/model"
	"notesapp/backend/internal/repository"
	"notesapp/backend/internal/service"
)

type NoteHandler struct {
	service *service.NoteService
}

func NewNoteHandler(service *service.NoteService) *NoteHandler {
	return &NoteHandler{service: service}
}

func (h *NoteHandler) ListOrCreate(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		notes, err := h.service.List(r.Context(), r.URL.Query().Get("search"))
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to list notes")
			return
		}
		writeJSON(w, http.StatusOK, notes)
	case http.MethodPost:
		var input model.CreateNoteInput
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			writeError(w, http.StatusBadRequest, "invalid json payload")
			return
		}

		note, err := h.service.Create(r.Context(), input)
		if err != nil {
			h.handleServiceError(w, err)
			return
		}
		writeJSON(w, http.StatusCreated, note)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (h *NoteHandler) ByID(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/notes/")
	if id == "" || strings.Contains(id, "/") {
		writeError(w, http.StatusNotFound, "note not found")
		return
	}

	switch r.Method {
	case http.MethodGet:
		note, err := h.service.GetByID(r.Context(), id)
		if err != nil {
			h.handleServiceError(w, err)
			return
		}
		writeJSON(w, http.StatusOK, note)
	case http.MethodPut:
		var input model.UpdateNoteInput
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			writeError(w, http.StatusBadRequest, "invalid json payload")
			return
		}

		note, err := h.service.Update(r.Context(), id, input)
		if err != nil {
			h.handleServiceError(w, err)
			return
		}
		writeJSON(w, http.StatusOK, note)
	case http.MethodDelete:
		if err := h.service.Delete(r.Context(), id); err != nil {
			h.handleServiceError(w, err)
			return
		}
		writeJSON(w, http.StatusNoContent, nil)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (h *NoteHandler) handleServiceError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, service.ErrTitleRequired):
		writeError(w, http.StatusBadRequest, err.Error())
	case errors.Is(err, service.ErrContentRequired):
		writeError(w, http.StatusBadRequest, err.Error())
	case errors.Is(err, repository.ErrNoteNotFound):
		writeError(w, http.StatusNotFound, err.Error())
	default:
		writeError(w, http.StatusInternalServerError, "internal server error")
	}
}
