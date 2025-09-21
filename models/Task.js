import Joi from 'joi';

// Task status enum
export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// Priority enum
export const Priority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Validation schemas
export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 1 character long',
    'string.max': 'Title must not exceed 255 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid(...Object.values(TaskStatus)).required().messages({
    'any.only': 'Status must be one of: pending, in_progress, completed',
    'any.required': 'Status is required'
  }),
  priority: Joi.string().valid(...Object.values(Priority)).required().messages({
    'any.only': 'Priority must be one of: low, medium, high',
    'any.required': 'Priority is required'
  }),
  due_date: Joi.date().iso().allow(null).optional().messages({
    'date.format': 'Due date must be a valid ISO 8601 date'
  })
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional().messages({
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 1 character long',
    'string.max': 'Title must not exceed 255 characters'
  }),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid(...Object.values(TaskStatus)).optional().messages({
    'any.only': 'Status must be one of: pending, in_progress, completed'
  }),
  priority: Joi.string().valid(...Object.values(Priority)).optional().messages({
    'any.only': 'Priority must be one of: low, medium, high'
  }),
  due_date: Joi.date().iso().allow(null).optional().messages({
    'date.format': 'Due date must be a valid ISO 8601 date'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const queryParamsSchema = Joi.object({
  status: Joi.string().valid(...Object.values(TaskStatus)).optional(),
  priority: Joi.string().valid(...Object.values(Priority)).optional(),
  page: Joi.number().integer().min(1).default(1).optional(),
  page_size: Joi.number().integer().min(1).max(100).default(10).optional()
});

// Task class for data transformation
export class Task {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status;
    this.priority = data.priority;
    this.due_date = data.due_date;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Convert to JSON response format
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      due_date: this.due_date,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}