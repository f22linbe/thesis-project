package repository

import (
	"context"
	"gin-api/initializers"
	"gin-api/models"
)

func GetBook(id int) (models.BookResponse, error) {
	var book models.BookResponse

	query := "SELECT id, book_id, url, text FROM books WHERE id=$1"
	err := initializers.DB.QueryRow(context.Background(), query, id).Scan(&book.ID, &book.Bookid, &book.Url, &book.Text)

	if err != nil {
		return models.BookResponse{}, err
	}
	return book, nil
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
