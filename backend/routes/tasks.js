import express from 'express';
import { 
    getAllTasks, 
    getTaskById, 
    createTask, 
    updateTask, 
    deleteTask,
    getDashboardStats 
} from '../controllers/taskController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

// Get all tasks
router.get('/', getAllTasks);

// Get single task
router.get('/:id', getTaskById);

// Create task (managers only)
router.post('/', authorize('manager'), createTask);

// Update task (managers and employees can update)
router.put('/:id', authenticate, updateTask);

// Delete task (managers only)
router.delete('/:id', authorize('manager'), deleteTask);

export default router;
