import express from 'express';
import { TaskController } from '../controllers/taskController.js';

const router = express.Router();
const taskController = new TaskController();

// Task CRUD routes
router.post('/', taskController.createTask);           // POST /api/v1/tasks
router.get('/', taskController.getAllTasks);           // GET /api/v1/tasks
router.get('/stats', taskController.getTaskStats);     // GET /api/v1/tasks/stats
router.get('/:id', taskController.getTask);            // GET /api/v1/tasks/:id
router.put('/:id', taskController.updateTask);         // PUT /api/v1/tasks/:id
router.delete('/:id', taskController.deleteTask);      // DELETE /api/v1/tasks/:id

export default router;