package handlers

import (
	"gin-api/repository"
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
	booktext, err := repository.GetBook(bookid)
	if err != nil {
		c.JSON(404, gin.H{"error": "Book was not found"})
		return
	}
	c.JSON(200, gin.H{"text": booktext})
}
