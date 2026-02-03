import express from 'express';
import {
    getAllEmployees,
    getActiveEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    toggleEmployeeStatus,
    deleteEmployee,
    resetPassword,
    getEmployeeStats
} from '../controllers/employeeController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All employee routes require authentication
router.use(authenticate);

// Get employee statistics (managers only)
router.get('/stats', authorize('manager'), getEmployeeStats);

// Get all employees
router.get('/', getAllEmployees);

// Get only active employees
router.get('/active', getActiveEmployees);

// Get single employee
router.get('/:id', getEmployeeById);

// Create employee (managers only)
router.post('/', authorize('manager'), createEmployee);

// Update employee (managers only)
router.put('/:id', authorize('manager'), updateEmployee);

// Toggle employee status (managers only)
router.patch('/:id/status', authorize('manager'), toggleEmployeeStatus);

// Reset employee password (managers only)
router.post('/:id/reset-password', authorize('manager'), resetPassword);

// Delete employee (managers only)
router.delete('/:id', authorize('manager'), deleteEmployee);

export default router;
