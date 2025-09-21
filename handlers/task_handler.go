package handlers

import (
	"net/http"
	"strconv"
	"task-api/models"
	"task-api/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TaskHandler struct {
	service *services.TaskService
}

// NewTaskHandler creates a new task handler
func NewTaskHandler() *TaskHandler {
	return &TaskHandler{
		service: services.NewTaskService(),
	}
}

// CreateTask handles POST /tasks
func (h *TaskHandler) CreateTask(c *gin.Context) {
	var req models.CreateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Success: false,
			Message: "Invalid request payload",
			Error:   err.Error(),
		})
		return
	}

	task, err := h.service.CreateTask(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Message: "Failed to create task",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, models.TaskResponse{
		Success: true,
		Message: "Task created successfully",
		Data:    task,
	})
}

// GetTask handles GET /tasks/:id
func (h *TaskHandler) GetTask(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Success: false,
			Message: "Invalid task ID format",
			Error:   err.Error(),
		})
		return
	}

	task, err := h.service.GetTaskByID(id)
	if err != nil {
		if err.Error() == "task not found" {
			c.JSON(http.StatusNotFound, models.ErrorResponse{
				Success: false,
				Message: "Task not found",
				Error:   err.Error(),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Message: "Failed to retrieve task",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.TaskResponse{
		Success: true,
		Message: "Task retrieved successfully",
		Data:    task,
	})
}

// GetAllTasks handles GET /tasks
func (h *TaskHandler) GetAllTasks(c *gin.Context) {
	// Parse query parameters
	status := c.Query("status")
	priority := c.Query("priority")
	
	page := 1
	if pageParam := c.Query("page"); pageParam != "" {
		if p, err := strconv.Atoi(pageParam); err == nil && p > 0 {
			page = p
		}
	}

	pageSize := 10
	if pageSizeParam := c.Query("page_size"); pageSizeParam != "" {
		if ps, err := strconv.Atoi(pageSizeParam); err == nil && ps > 0 && ps <= 100 {
			pageSize = ps
		}
	}

	tasks, total, err := h.service.GetAllTasks(status, priority, page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Message: "Failed to retrieve tasks",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.TasksResponse{
		Success: true,
		Message: "Tasks retrieved successfully",
		Data:    tasks,
		Total:   total,
	})
}

// UpdateTask handles PUT /tasks/:id
func (h *TaskHandler) UpdateTask(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Success: false,
			Message: "Invalid task ID format",
			Error:   err.Error(),
		})
		return
	}

	var req models.UpdateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Success: false,
			Message: "Invalid request payload",
			Error:   err.Error(),
		})
		return
	}

	task, err := h.service.UpdateTask(id, &req)
	if err != nil {
		if err.Error() == "task not found" {
			c.JSON(http.StatusNotFound, models.ErrorResponse{
				Success: false,
				Message: "Task not found",
				Error:   err.Error(),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Message: "Failed to update task",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.TaskResponse{
		Success: true,
		Message: "Task updated successfully",
		Data:    task,
	})
}

// DeleteTask handles DELETE /tasks/:id
func (h *TaskHandler) DeleteTask(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Success: false,
			Message: "Invalid task ID format",
			Error:   err.Error(),
		})
		return
	}

	err = h.service.DeleteTask(id)
	if err != nil {
		if err.Error() == "task not found" {
			c.JSON(http.StatusNotFound, models.ErrorResponse{
				Success: false,
				Message: "Task not found",
				Error:   err.Error(),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Message: "Failed to delete task",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Task deleted successfully",
	})
}