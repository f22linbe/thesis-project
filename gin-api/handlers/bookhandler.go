package handlers

import (
	"fmt"
	"gin-api/models"
	"gin-api/repository"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetBookHandler(c *gin.Context) {
	// Get value from URI
	idStr := c.Param("id")

	// Convert to integer
	bookid, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	// Get book data
	bookdata, err := repository.GetBook(bookid)
	if err != nil {
		c.JSON(404, gin.H{"error": "Book was not found"})
		return
	}
	c.JSON(http.StatusOK, bookdata)
}

func PostBookHandler(c *gin.Context) {
	var book models.Book

	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON input"})
		return
	}

	if book.Author == "" || book.BookText == "" || book.BookSize == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Author, text and size are required"})
		return
	}

	id, err := repository.PostBook(book)
	if err != nil {
		log.Printf("CreateUser error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to post book"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": fmt.Sprintf("Book with ID %d was posted to the database", id),
	})
}
