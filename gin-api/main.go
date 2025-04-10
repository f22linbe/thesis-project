package main

import (
	"gin-api/handlers"
	"gin-api/initializers"
	"net/http"
	"os"
	"runtime"

	"github.com/gin-gonic/gin"
)

func main() {
	//
	runtime.GOMAXPROCS(1)
	// Connect to PostgreSQL
	initializers.ConnectDB()
	// Close connection
	defer initializers.DB.Close()

	port := os.Getenv("PORT")

	// routes
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello gin",
		})
	})

	r.GET("/gin/book/:id", handlers.GetBookHandler)
	r.POST("/gin/book", handlers.PostBookHandler)
	r.Run(":" + port) // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
