import type { Note, NotePayload } from '../types/note';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

class APIError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) {
        errorMessage = payload.error;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new APIError(errorMessage, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const notesAPI = {
  list(search = '') {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<Note[]>(`/notes${query}`);
  },
  get(id: string) {
    return request<Note>(`/notes/${id}`);
  },
  create(payload: NotePayload) {
    return request<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  update(id: string, payload: NotePayload) {
    return request<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  remove(id: string) {
    return request<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  },
};

export { APIError };
