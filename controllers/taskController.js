import { TaskService } from '../services/taskService.js';
import { createTaskSchema, updateTaskSchema, queryParamsSchema } from '../models/Task.js';
import { validateUUID } from '../utils/validation.js';

export class TaskController {
  constructor() {
    this.taskService = new TaskService();
  }

  // Create a new task
  createTask = async (req, res, next) => {
    try {
      // Validate request body
      const { error, value } = createTaskSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const task = await this.taskService.createTask(value);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task.toJSON()
      });
    } catch (error) {
      next(error);
    }
  };

  // Get task by ID
  getTask = async (req, res, next) => {
    try {
      const { id } = req.params;

      // Validate UUID format
      if (!validateUUID(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID format',
          error: 'Task ID must be a valid UUID'
        });
      }

      const task = await this.taskService.getTaskById(id);

      res.json({
        success: true,
        message: 'Task retrieved successfully',
        data: task.toJSON()
      });
    } catch (error) {
      if (error.message === 'Task not found') {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
          error: error.message
        });
      }
      next(error);
    }
  };

  // Get all tasks with filtering and pagination
  getAllTasks = async (req, res, next) => {
    try {
      // Validate query parameters
      const { error, value } = queryParamsSchema.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          error: error.details[0].message
        });
      }

      const result = await this.taskService.getAllTasks(value);

      res.json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: result.tasks.map(task => task.toJSON()),
        pagination: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Update task by ID
  updateTask = async (req, res, next) => {
    try {
      const { id } = req.params;

      // Validate UUID format
      if (!validateUUID(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID format',
          error: 'Task ID must be a valid UUID'
        });
      }

      // Validate request body
      const { error, value } = updateTaskSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const task = await this.taskService.updateTask(id, value);

      res.json({
        success: true,
        message: 'Task updated successfully',
        data: task.toJSON()
      });
    } catch (error) {
      if (error.message === 'Task not found') {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
          error: error.message
        });
      }
      next(error);
    }
  };

  // Delete task by ID
  deleteTask = async (req, res, next) => {
    try {
      const { id } = req.params;

      // Validate UUID format
      if (!validateUUID(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID format',
          error: 'Task ID must be a valid UUID'
        });
      }

      await this.taskService.deleteTask(id);

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Task not found') {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
          error: error.message
        });
      }
      next(error);
    }
  };

  // Get task statistics
  getTaskStats = async (req, res, next) => {
    try {
      const stats = await this.taskService.getTaskStats();

      res.json({
        success: true,
        message: 'Task statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };
}