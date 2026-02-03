import pool from '../config/database.js';

// Get all tasks with filters and sorting
export async function getAllTasks(req, res) {
    try {
        const { status, priority, assigneeId, search, sortBy = 'due_date', sortOrder = 'ASC' } = req.query;
        const userId = req.user.id;
        
        let query = `
            SELECT t.*, u.name AS assignee_name, u.username AS assignee_username
            FROM tasks t
            LEFT JOIN employees e ON t.assignee_id = e.user_id
            LEFT JOIN users u ON e.user_id = u.id
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        // For employees: show only their tasks
        if (req.user.role === 'employee') {
            query += ` AND t.assignee_id = $${paramCount}`;
            params.push(userId);
            paramCount++;
        }

        // Filter by status
        if (status) {
            query += ` AND t.status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        // Filter by priority
        if (priority) {
            query += ` AND t.priority = $${paramCount}`;
            params.push(priority);
            paramCount++;
        }

        // Filter by assignee
        if (assigneeId) {
            query += ` AND t.assignee_id = $${paramCount}`;
            params.push(assigneeId);
            paramCount++;
        }

        // Search by title or description
        if (search) {
            query += ` AND (t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        // Sorting
        const validSortFields = ['due_date', 'priority', 'created_at', 'status'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'due_date';
        const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        query += ` ORDER BY t.${sortField} ${order}`;

        const result = await pool.query(query, params);
        
        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get single task by ID
export async function getTaskById(req, res) {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            `
                SELECT t.*, u.name AS assignee_name, u.username AS assignee_username
                FROM tasks t
                LEFT JOIN employees e ON t.assignee_id = e.user_id
                LEFT JOIN users u ON e.user_id = u.id
                WHERE t.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Check permission: employee can only see their own tasks
        const task = result.rows[0];
        if (req.user.role === 'employee' && task.assignee_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Create new task
export async function createTask(req, res) {
    try {
        const { title, description, status = 'pending', priority = 'medium', dueDate, assigneeId } = req.body;
        const createdBy = req.user.id;

        // Validate required fields
        if (!title || !dueDate || !assigneeId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: title, dueDate, assigneeId' 
            });
        }

        // Validate status and priority
        const validStatuses = ['pending', 'in-progress', 'completed'];
        const validPriorities = ['low', 'medium', 'high'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({ success: false, message: 'Invalid priority' });
        }

        // Check if assignee exists (assigneeId is the user_id of the employee)
        const empCheck = await pool.query(
            'SELECT user_id FROM employees WHERE user_id = $1',
            [assigneeId]
        );

        if (empCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Assignee not found' });
        }

        const result = await pool.query(
            `INSERT INTO tasks (title, description, status, priority, due_date, assignee_id, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [title, description, status, priority, dueDate, assigneeId, createdBy]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update task
export async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Find task first
        const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (taskResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const task = taskResult.rows[0];

        // Employees can only update their own tasks
        if (userRole === 'employee' && task.assignee_id !== userId) {
            return res.status(403).json({ success: false, message: 'You can only update your own tasks' });
        }

        // Validate status and priority if provided
        if (updates.status && !['pending', 'in-progress', 'completed'].includes(updates.status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        if (updates.priority && !['low', 'medium', 'high'].includes(updates.priority)) {
            return res.status(400).json({ success: false, message: 'Invalid priority' });
        }

        // Build update query dynamically
        const updateFields = [];
        const params = [];
        let paramCount = 1;

        const allowedFields = ['title', 'description', 'status', 'priority', 'due_date', 'assignee_id'];
        
        for (const field of allowedFields) {
            const key = field === 'due_date' ? 'dueDate' : field === 'assignee_id' ? 'assigneeId' : field;
            if (updates[key] !== undefined) {
                updateFields.push(`${field} = $${paramCount}`);
                params.push(updates[key]);
                paramCount++;
            }
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        updateFields.push(`updated_at = NOW()`);
        params.push(id);

        const query = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;

        const result = await pool.query(query, params);

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Delete task
export async function deleteTask(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, message: 'Task deleted successfully', id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get dashboard statistics
export async function getDashboardStats(req, res) {
    try {
        let query = `
            SELECT t.*, u.name AS assignee_name
            FROM tasks t
            LEFT JOIN employees e ON t.assignee_id = e.user_id
            LEFT JOIN users u ON e.user_id = u.id
            WHERE 1=1
        `;
        const params = [];

        // For employees: only their stats
        if (req.user.role === 'employee') {
            query += ' AND t.assignee_id = $1';
            params.push(req.user.id);
        }

        const tasksResult = await pool.query(query, params);
        const tasks = tasksResult.rows;

        const now = new Date();

        const tasksByAssignee = tasks.reduce((acc, task) => {
            const name = task.assignee_name || 'Unassigned';
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {});

        const stats = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'completed').length,
            pendingTasks: tasks.filter(t => t.status === 'pending').length,
            inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
            overdueTasks: tasks.filter(t => 
                new Date(t.due_date) < now && t.status !== 'completed'
            ).length,
            tasksByPriority: {
                low: tasks.filter(t => t.priority === 'low').length,
                medium: tasks.filter(t => t.priority === 'medium').length,
                high: tasks.filter(t => t.priority === 'high').length
            },
            tasksByAssignee,
            completionRate: tasks.length > 0 
                ? ((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100).toFixed(2)
                : 0
        };

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
