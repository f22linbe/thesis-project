package repository

import (
	"context"
	"gin-api/initializers"
	"gin-api/models"
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

func PostBook(book models.Book) (int, error) {
	var id int
	err := initializers.DB.QueryRow(context.Background(),
		`
		INSERT INTO posted_books (author, book_text, book_size) 
		VALUES ($1, $2, $3) 
		RETURNING id
	`,
		book.Author, book.BookText, book.BookSize).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}
