import { supabase } from '../server.js';

export class TaskRepository {
  constructor() {
    this.tableName = 'tasks';
  }

  // Create a new task
  async create(taskData) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([taskData])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create task: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get task by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Task not found
        }
        throw new Error(`Failed to get task: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get all tasks with filtering and pagination
  async getAll(filters = {}) {
    try {
      const { status, priority, page = 1, pageSize = 10 } = filters;
      const offset = (page - 1) * pageSize;

      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }
      if (priority) {
        query = query.eq('priority', priority);
      }

      // Apply pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Failed to get tasks: ${error.message}`);
      }

      return {
        tasks: data || [],
        total: count || 0
      };
    } catch (error) {
      throw error;
    }
  }

  // Update task by ID
  async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Task not found
        }
        throw new Error(`Failed to update task: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Delete task by ID
  async delete(id) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete task: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Check if task exists
  async exists(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Failed to check task existence: ${error.message}`);
      }

      return !!data;
    } catch (error) {
      throw error;
    }
  }
}