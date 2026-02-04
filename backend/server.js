import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import employeesRoutes from './routes/employees.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
    origin: corsOrigin === '*' ? corsOrigin : corsOrigin.split(','),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auto-migration: Add joined_date column if it doesn't exist
async function ensureJoinedDateColumn() {
    try {
        const columnCheck = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'employees' AND column_name = 'joined_date'
        `);
        
        if (columnCheck.rows.length === 0) {
            console.log('⏳ Adding joined_date column to employees table...');
            await pool.query(`
                ALTER TABLE employees 
                ADD COLUMN joined_date DATE DEFAULT CURRENT_DATE
            `);
            console.log('✅ joined_date column added successfully');
        }
    } catch (error) {
        if (!error.message.includes('already exists')) {
            console.warn('⚠️  Could not ensure joined_date column:', error.message);
        }
    }
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/employees', employeesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    });
});

// Start server
async function startServer() {
    try {
        // Run migrations before starting server
        await ensureJoinedDateColumn();
        
        // Start listening on 0.0.0.0 for cloud deployments
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`\n🚀 Server running on http://0.0.0.0:${PORT}`);
            console.log(`📚 API Documentation: http://0.0.0.0:${PORT}/api/docs\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();