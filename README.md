# NoteFlow

NoteFlow is a full-stack notes application built with React + TypeScript on the frontend and Go + PostgreSQL on the backend. It was designed as a compact but real project: a complete CRUD flow, persistent storage, backend search, responsive UI, and clean separation between application layers.

## Stack

- Frontend: React, TypeScript, React Router, Vite
- Backend: Go 1.26, `net/http`, PostgreSQL, `pgx`
- Database: PostgreSQL

## Features

- Create, list, read, update, and delete notes
- Search notes by title with case-insensitive backend filtering
- Responsive UI for mobile, tablet, and desktop
- Loading, empty, and error states across the main flows
- Immediate UI updates after mutations
- Environment-based configuration

## Project Structure

```txt
backend/
  cmd/api
  internal/
    config/
    database/
    handler/
    model/
    repository/
    service/
frontend/
  public/
  src/
docker-compose.yml
.env.example
```

## Local Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Start PostgreSQL.

If your Docker installation supports Compose:

```bash
docker compose up -d
```

If it does not, run the container directly:

```bash
docker run --name notes-app-db \
  -e POSTGRES_DB=notes_app \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:17-alpine
```

3. Install dependencies:

```bash
cd backend && go mod tidy
cd ../frontend && npm install
```

## Run in Development

Backend:

```bash
cd backend
go run ./cmd/api
```

Frontend:

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`.

Backend runs at `http://localhost:8080`.

## API

- `GET /health`
- `GET /notes?search=go`
- `GET /notes/:id`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`

## Environment Safety

Real local environment files are intentionally excluded from version control.

- `.env`
- `backend/.env`
- `frontend/.env`
- `.env.*`
- `*.local`

Only example files should be committed:

- `.env.example`
- other `*.example` files if you add them later

If you ever accidentally stage a real environment file after initializing Git, remove it from the index before committing:

```bash
git rm --cached .env backend/.env frontend/.env
```

## Architecture Notes

- Handlers deal with HTTP concerns only.
- Services apply application rules and coordinate the flow.
- Repositories are responsible for database access.
- The notes table migration runs automatically when the API starts.

## Security Note

Based on the current project files, there is no mechanism here that automatically commits or uploads your `.env` anywhere. The main risk is only human error during Git commits. The repository has been set up so local environment files are ignored by default, which is the correct baseline protection.
