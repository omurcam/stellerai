package routes

import (
	"task-api/handlers"
	"task-api/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes() *gin.Engine {
	router := gin.Default()

	// Apply middleware
	router.Use(middleware.CORS())
	router.Use(middleware.Logger())

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Task API is running",
		})
	})

	// Initialize handlers
	taskHandler := handlers.NewTaskHandler()

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Task routes
		tasks := v1.Group("/tasks")
		{
			tasks.POST("", taskHandler.CreateTask)           // POST /api/v1/tasks
			tasks.GET("", taskHandler.GetAllTasks)           // GET /api/v1/tasks
			tasks.GET("/:id", taskHandler.GetTask)           // GET /api/v1/tasks/:id
			tasks.PUT("/:id", taskHandler.UpdateTask)        // PUT /api/v1/tasks/:id
			tasks.DELETE("/:id", taskHandler.DeleteTask)     // DELETE /api/v1/tasks/:id
		}
	}

	return router
}