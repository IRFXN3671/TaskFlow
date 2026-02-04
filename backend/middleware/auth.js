import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export async function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user is still active in database
        const empResult = await pool.query(
            'SELECT is_active FROM employees WHERE user_id = $1',
            [decoded.id]
        );
        
        // User must have employee record and be active
        if (empResult.rows.length === 0 || !empResult.rows[0].is_active) {
            return res.status(401).json({ message: 'Account is inactive' });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
}