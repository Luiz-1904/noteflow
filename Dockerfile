FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM golang:1.26-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/noteflow-api ./cmd/api

FROM alpine:3.22
WORKDIR /app

RUN adduser -D appuser

COPY --from=backend-builder /app/noteflow-api /app/noteflow-api
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

ENV PORT=8080
ENV STATIC_DIR=/app/frontend/dist

USER appuser
EXPOSE 8080

CMD ["/app/noteflow-api"]
