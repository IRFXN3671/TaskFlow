import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export async function login(req, res) {
    try {
        const { username, password } = req.body;

        // Find user
        const userResult = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];
        console.log(`[LOGIN] User found: ${username} (ID: ${user.id}, Role: ${user.role})`);

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log(`[LOGIN] Invalid password for user: ${username}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log(`[LOGIN] Password valid for user: ${username}`);

        // Check if employee/manager is active - REQUIRED for all users
        const empResult = await pool.query(
            'SELECT is_active FROM employees WHERE user_id = $1',
            [user.id]
        );
        
        console.log(`[LOGIN] Employee record check for user ${username}:`, empResult.rows.length > 0 ? 'FOUND' : 'NOT FOUND');
        if (empResult.rows.length > 0) {
            console.log(`[LOGIN] is_active status: ${empResult.rows[0].is_active}`);
        }
        
        // User MUST have an employee record
        if (empResult.rows.length === 0) {
            console.log(`[LOGIN] BLOCKED: No employee record for ${username}`);
            return res.status(403).json({ message: 'Account is inactive' });
        }
        
        // User must be active
        if (!empResult.rows[0].is_active) {
            console.log(`[LOGIN] BLOCKED: User ${username} is inactive`);
            return res.status(403).json({ message: 'Account is inactive' });
        }

        console.log(`[LOGIN] Allowing login for ${username}`);

        // Update last login
        await pool.query(
            'UPDATE employees SET last_login = NOW() WHERE user_id = $1',
            [user.id]
        );

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY }
        );

        res.json({
            user: { id: user.id, username: user.username, role: user.role, name: user.name },
            token
        });
    } catch (error) {
        console.error('[LOGIN] Error:', error);
        res.status(500).json({ message: error.message });
    }
}

export async function getCurrentUser(req, res) {
    try {
        const userResult = await pool.query(
            'SELECT id, username, role, name FROM users WHERE id = $1',
            [req.user.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userResult.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Get user
        const userResult = await pool.query(
            'SELECT password FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult.rows[0];

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await pool.query(
            'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
            [hashedPassword, userId]
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}