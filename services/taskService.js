import { TaskRepository } from '../repositories/taskRepository.js';
import { Task } from '../models/Task.js';

export class TaskService {
  constructor() {
    this.taskRepository = new TaskRepository();
  }

  // Create a new task
  async createTask(taskData) {
    try {
      // Additional business logic can be added here
      if (!taskData.title || taskData.title.trim() === '') {
        throw new Error('Task title is required');
      }

      const createdTask = await this.taskRepository.create(taskData);
      return new Task(createdTask);
    } catch (error) {
      throw error;
    }
  }

  // Get task by ID
  async getTaskById(id) {
    try {
      if (!id) {
        throw new Error('Task ID is required');
      }

      const task = await this.taskRepository.getById(id);
      if (!task) {
        throw new Error('Task not found');
      }

      return new Task(task);
    } catch (error) {
      throw error;
    }
  }

  // Get all tasks with filtering and pagination
  async getAllTasks(filters = {}) {
    try {
      // Set default values and validate pagination
      const page = Math.max(1, parseInt(filters.page) || 1);
      const pageSize = Math.min(100, Math.max(1, parseInt(filters.pageSize) || 10));

      const queryFilters = {
        ...filters,
        page,
        pageSize
      };

      const result = await this.taskRepository.getAll(queryFilters);
      
      return {
        tasks: result.tasks.map(task => new Task(task)),
        total: result.total,
        page,
        pageSize,
        totalPages: Math.ceil(result.total / pageSize)
      };
    } catch (error) {
      throw error;
    }
  }

  // Update task by ID
  async updateTask(id, updateData) {
    try {
      if (!id) {
        throw new Error('Task ID is required');
      }

      // Check if task exists
      const exists = await this.taskRepository.exists(id);
      if (!exists) {
        throw new Error('Task not found');
      }

      // Additional business logic validation
      if (updateData.title !== undefined && (!updateData.title || updateData.title.trim() === '')) {
        throw new Error('Task title cannot be empty');
      }

      const updatedTask = await this.taskRepository.update(id, updateData);
      if (!updatedTask) {
        throw new Error('Task not found');
      }

      return new Task(updatedTask);
    } catch (error) {
      throw error;
    }
  }

  // Delete task by ID
  async deleteTask(id) {
    try {
      if (!id) {
        throw new Error('Task ID is required');
      }

      // Check if task exists
      const exists = await this.taskRepository.exists(id);
      if (!exists) {
        throw new Error('Task not found');
      }

      await this.taskRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get task statistics (additional business logic)
  async getTaskStats() {
    try {
      const allTasks = await this.taskRepository.getAll({ pageSize: 1000 });
      const tasks = allTasks.tasks;

      const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        high_priority: tasks.filter(t => t.priority === 'high').length,
        medium_priority: tasks.filter(t => t.priority === 'medium').length,
        low_priority: tasks.filter(t => t.priority === 'low').length,
        overdue: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date()).length
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }
}