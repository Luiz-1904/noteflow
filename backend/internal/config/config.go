package config

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type Config struct {
	Port       string
	Environment string
	DatabaseURL string
	CORSOrigin  string
	StaticDir   string
}

func Load() (Config, error) {
	loadEnv()

	cfg := Config{
		Port:        getEnv("PORT", "8080"),
		Environment: getEnv("APP_ENV", "development"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		CORSOrigin:  getEnv("CORS_ORIGIN", "http://localhost:5173"),
		StaticDir:   getEnv("STATIC_DIR", ""),
	}

	if cfg.DatabaseURL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
	}

	return cfg, nil
}

func loadEnv() {
	paths := []string{
		".env",
		"../.env",
		"../../.env",
		"backend/.env",
	}

	if wd, err := os.Getwd(); err == nil {
		paths = append(paths,
			filepath.Join(wd, ".env"),
			filepath.Join(wd, "..", ".env"),
			filepath.Join(wd, "..", "..", ".env"),
		)
	}

	for _, path := range paths {
		_ = godotenv.Overload(path)
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	return fallback
}
