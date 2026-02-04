import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

// Get all employees
export async function getAllEmployees(req, res) {
    try {
        const result = await pool.query(
            'SELECT e.*, u.username, u.name, u.role FROM employees e JOIN users u ON e.user_id = u.id ORDER BY u.name'
        );

        res.json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get only active employees
export async function getActiveEmployees(req, res) {
    try {
        const result = await pool.query(
            'SELECT e.*, u.username, u.name, u.role FROM employees e JOIN users u ON e.user_id = u.id WHERE e.is_active = true ORDER BY u.name'
        );

        res.json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get employee by ID
export async function getEmployeeById(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT e.*, u.username, u.name, u.role FROM employees e JOIN users u ON e.user_id = u.id WHERE e.user_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Create new employee
export async function createEmployee(req, res) {
    try {
        const { name, email, position, department, username, password, role = 'employee', skills = [] } = req.body;

        // Validate required fields
        if (!name || !email || !position || !department) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: name, email, position, department' 
            });
        }

        // Auto-generate username from email if not provided
        let finalUsername = username || email.split('@')[0];
        
        // Make username unique if needed
        let uniqueUsername = finalUsername;
        let counter = 1;
        let usernameExists = true;
        
        while (usernameExists) {
            const check = await pool.query(
                'SELECT id FROM users WHERE username = $1',
                [uniqueUsername]
            );
            if (check.rows.length === 0) {
                usernameExists = false;
            } else {
                uniqueUsername = `${finalUsername}${counter}`;
                counter++;
            }
        }
        
        finalUsername = uniqueUsername;

        // Check if email exists
        const emailCheck = await pool.query(
            'SELECT id FROM employees WHERE email = $1',
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password || 'password123', 10);

        // Start transaction
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Create user
            const userResult = await client.query(
                'INSERT INTO users (username, password, role, name) VALUES ($1, $2, $3, $4) RETURNING id',
                [finalUsername, hashedPassword, role, name]
            );

            const userId = userResult.rows[0].id;

            // Create employee
            const empResult = await client.query(
                `INSERT INTO employees (user_id, email, position, department, joined_date, skills, is_active)
                 VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, true)
                 RETURNING *`,
                [userId, email, position, department, skills]
            );

            await client.query('COMMIT');

            res.status(201).json({ 
                success: true, 
                data: { 
                    ...empResult.rows[0], 
                    username: finalUsername,
                    defaultPassword: 'password123'
                } 
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update employee
export async function updateEmployee(req, res) {
    try {
        const { id } = req.params;
        const { name, email, position, department, skills, role } = req.body;

        // Check if employee exists
        const empCheck = await pool.query(
            'SELECT * FROM employees WHERE user_id = $1',
            [id]
        );

        if (empCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        // Check if email is already taken
        if (email) {
            const emailCheck = await pool.query(
                'SELECT id FROM employees WHERE email = $1 AND user_id != $2',
                [email, id]
            );

            if (emailCheck.rows.length > 0) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Update user name and/or role if provided
            const userUpdateFields = [];
            const userParams = [];
            let userParamCount = 1;

            if (name) {
                userUpdateFields.push(`name = $${userParamCount}`);
                userParams.push(name);
                userParamCount++;
            }
            if (role) {
                userUpdateFields.push(`role = $${userParamCount}`);
                userParams.push(role);
                userParamCount++;
            }

            if (userUpdateFields.length > 0) {
                userUpdateFields.push('updated_at = NOW()');
                userParams.push(id);
                const userQuery = `UPDATE users SET ${userUpdateFields.join(', ')} WHERE id = $${userParamCount}`;
                await client.query(userQuery, userParams);
            }

            // Update employee
            const updateFields = [];
            const params = [];
            let paramCount = 1;

            if (email) {
                updateFields.push(`email = $${paramCount}`);
                params.push(email);
                paramCount++;
            }
            if (position) {
                updateFields.push(`position = $${paramCount}`);
                params.push(position);
                paramCount++;
            }
            if (department) {
                updateFields.push(`department = $${paramCount}`);
                params.push(department);
                paramCount++;
            }
            if (skills) {
                updateFields.push(`skills = $${paramCount}`);
                params.push(skills);
                paramCount++;
            }

            if (updateFields.length > 0 || userUpdateFields.length > 0) {
                if (updateFields.length > 0) {
                    updateFields.push('updated_at = NOW()');
                    params.push(id);

                    const query = `UPDATE employees SET ${updateFields.join(', ')} WHERE user_id = $${paramCount} RETURNING *`;
                    await client.query(query, params);
                }
                
                // Return employee with user role
                const result = await client.query(
                    'SELECT e.*, u.username, u.name, u.role FROM employees e JOIN users u ON e.user_id = u.id WHERE e.user_id = $1',
                    [id]
                );
                
                await client.query('COMMIT');
                res.json({ success: true, data: result.rows[0] });
            } else {
                await client.query('COMMIT');
                const result = await client.query(
                    'SELECT e.*, u.username, u.name, u.role FROM employees e JOIN users u ON e.user_id = u.id WHERE e.user_id = $1',
                    [id]
                );
                res.json({ success: true, message: 'No changes made', data: result.rows[0] });
            }
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Toggle employee active status
export async function toggleEmployeeStatus(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'UPDATE employees SET is_active = NOT is_active, updated_at = NOW() WHERE user_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Delete employee
export async function deleteEmployee(req, res) {
    try {
        const { id } = req.params;

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Delete employee
            const empDelete = await client.query(
                'DELETE FROM employees WHERE user_id = $1 RETURNING id',
                [id]
            );

            if (empDelete.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ success: false, message: 'Employee not found' });
            }

            // Delete user
            await client.query('DELETE FROM users WHERE id = $1', [id]);

            await client.query('COMMIT');

            res.json({ success: true, message: 'Employee deleted successfully', id });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Reset employee password
export async function resetPassword(req, res) {
    try {
        const { id } = req.params;
        const newPassword = 'password123';

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await pool.query(
            'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING username',
            [hashedPassword, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.json({ 
            success: true, 
            message: 'Password reset successfully',
            username: result.rows[0].username,
            newPassword
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get employee statistics
export async function getEmployeeStats(req, res) {
    try {
        const totalResult = await pool.query('SELECT COUNT(*) as count FROM employees');
        const activeResult = await pool.query('SELECT COUNT(*) as count FROM employees WHERE is_active = true');
        const inactiveResult = await pool.query('SELECT COUNT(*) as count FROM employees WHERE is_active = false');

        // Get tasks per employee
        const tasksResult = await pool.query(`
            SELECT 
                e.user_id,
                u.name,
                COUNT(t.id) as task_count,
                SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
            FROM employees e
            JOIN users u ON e.user_id = u.id
            LEFT JOIN tasks t ON e.user_id = t.assignee_id
            GROUP BY e.user_id, u.name
            ORDER BY task_count DESC
        `);

        const stats = {
            totalEmployees: parseInt(totalResult.rows[0].count),
            activeEmployees: parseInt(activeResult.rows[0].count),
            inactiveEmployees: parseInt(inactiveResult.rows[0].count),
            tasksByEmployee: tasksResult.rows
        };

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
