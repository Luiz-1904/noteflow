# NoteFlow

NoteFlow is a full-stack note-taking application built with React, TypeScript, Go, and PostgreSQL. The project focuses on clean interaction design, fast CRUD workflows, responsive layout behavior, and a straightforward backend architecture.

## Highlights

- Full CRUD notes workflow
- Case-insensitive search by title
- Responsive interface across mobile, tablet, and desktop
- Loading, empty, and error states across core screens
- Immediate UI updates after create, edit, and delete actions
- REST API with layered Go backend structure

## Stack

- React
- TypeScript
- React Router
- Vite
- Go
- PostgreSQL

## Architecture

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
```

## Run locally

```bash
cp .env.example .env
docker compose up -d
cd backend && go run ./cmd/api
cd frontend && npm install && npm run dev
```

## Deployment

The project includes a production `Dockerfile` that builds the frontend, compiles the Go API, and serves the React app from the same runtime container.

## API

- `GET /health`
- `GET /notes`
- `GET /notes/:id`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`
