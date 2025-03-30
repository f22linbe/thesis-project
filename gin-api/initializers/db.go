package initializers

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var DB *pgxpool.Pool

func ConnectDB() {
	// Load Environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading envvironment file.")
	}
	connStr := os.Getenv("DATABASE_URL")

	DB, err = pgxpool.New(context.Background(), connStr)

	// Check env syntax
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	// Check DB connection or if service is running.
	if err := DB.Ping(context.Background()); err != nil {
		log.Fatal("Cannot connect to DB:", err)
	}

	log.Println("Connected to PostgreSQL")
}
