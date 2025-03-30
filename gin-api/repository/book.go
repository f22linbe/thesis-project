package repository

import (
	"context"
	"gin-api/initializers"
)

func GetBook(id int) (string, error) {
	var text string

	row := initializers.DB.QueryRow(context.Background(), "SELECT text FROM books WHERE id=$1", id)
	err := row.Scan(&text)

	if err != nil {
		return "", err
	}
	return text, nil
}
