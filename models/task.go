package models

import (
	"time"
	"github.com/google/uuid"
)

// Task represents a task in the system
type Task struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	Title       string     `json:"title" db:"title" binding:"required,min=1,max=255"`
	Description *string    `json:"description" db:"description"`
	Status      TaskStatus `json:"status" db:"status" binding:"required,oneof=pending in_progress completed"`
	Priority    Priority   `json:"priority" db:"priority" binding:"required,oneof=low medium high"`
	DueDate     *time.Time `json:"due_date" db:"due_date"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
}

// TaskStatus represents the status of a task
type TaskStatus string

const (
	StatusPending    TaskStatus = "pending"
	StatusInProgress TaskStatus = "in_progress"
	StatusCompleted  TaskStatus = "completed"
)

// Priority represents the priority level of a task
type Priority string

const (
	PriorityLow    Priority = "low"
	PriorityMedium Priority = "medium"
	PriorityHigh   Priority = "high"
)

// CreateTaskRequest represents the request payload for creating a task
type CreateTaskRequest struct {
	Title       string     `json:"title" binding:"required,min=1,max=255"`
	Description *string    `json:"description"`
	Status      TaskStatus `json:"status" binding:"required,oneof=pending in_progress completed"`
	Priority    Priority   `json:"priority" binding:"required,oneof=low medium high"`
	DueDate     *time.Time `json:"due_date"`
}

// UpdateTaskRequest represents the request payload for updating a task
type UpdateTaskRequest struct {
	Title       *string    `json:"title" binding:"omitempty,min=1,max=255"`
	Description *string    `json:"description"`
	Status      *TaskStatus `json:"status" binding:"omitempty,oneof=pending in_progress completed"`
	Priority    *Priority   `json:"priority" binding:"omitempty,oneof=low medium high"`
	DueDate     *time.Time `json:"due_date"`
}

// TaskResponse represents the response format for task operations
type TaskResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    *Task  `json:"data,omitempty"`
}

// TasksResponse represents the response format for multiple tasks
type TasksResponse struct {
	Success bool    `json:"success"`
	Message string  `json:"message"`
	Data    []Task  `json:"data,omitempty"`
	Total   int     `json:"total"`
}

// ErrorResponse represents the error response format
type ErrorResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}