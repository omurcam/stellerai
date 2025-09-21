package services

import (
	"fmt"
	"task-api/models"
	"task-api/repositories"

	"github.com/google/uuid"
)

type TaskService struct {
	repo *repositories.TaskRepository
}

// NewTaskService creates a new task service
func NewTaskService() *TaskService {
	return &TaskService{
		repo: repositories.NewTaskRepository(),
	}
}

// CreateTask creates a new task
func (s *TaskService) CreateTask(req *models.CreateTaskRequest) (*models.Task, error) {
	// Additional business logic validation can be added here
	if req.Title == "" {
		return nil, fmt.Errorf("task title is required")
	}

	return s.repo.Create(req)
}

// GetTaskByID retrieves a task by its ID
func (s *TaskService) GetTaskByID(id uuid.UUID) (*models.Task, error) {
	return s.repo.GetByID(id)
}

// GetAllTasks retrieves all tasks with optional filtering and pagination
func (s *TaskService) GetAllTasks(status, priority string, page, pageSize int) ([]models.Task, int, error) {
	// Set default pagination values
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize
	return s.repo.GetAll(status, priority, pageSize, offset)
}

// UpdateTask updates an existing task
func (s *TaskService) UpdateTask(id uuid.UUID, req *models.UpdateTaskRequest) (*models.Task, error) {
	// Check if task exists
	_, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Additional business logic validation can be added here
	if req.Title != nil && *req.Title == "" {
		return nil, fmt.Errorf("task title cannot be empty")
	}

	return s.repo.Update(id, req)
}

// DeleteTask deletes a task by its ID
func (s *TaskService) DeleteTask(id uuid.UUID) error {
	// Check if task exists
	_, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	return s.repo.Delete(id)
}