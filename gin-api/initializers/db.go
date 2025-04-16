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

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatal("Could not parse connection string", err)
	}
	config.MaxConns = 20

	DB, err = pgxpool.NewWithConfig(context.Background(), config)
	// if error check env
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	// if error check DB connection or if service is running.
	if err := DB.Ping(context.Background()); err != nil {
		log.Fatal("Cannot connect to DB:", err)
	}

	log.Println("Connected to PostgreSQL")
}
