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

// Auto-fix: Reset database sequences if they're out of sync
async function fixDatabaseSequences() {
    try {
        const tablesToFix = ['users', 'employees', 'tasks'];
        
        for (const table of tablesToFix) {
            const maxIdResult = await pool.query(`SELECT MAX(id) as max_id FROM ${table}`);
            const maxId = maxIdResult.rows[0].max_id;
            
            if (maxId && maxId > 0) {
                const seqResult = await pool.query(
                    `SELECT last_value FROM ${table}_id_seq`
                );
                const lastValue = seqResult.rows[0].last_value;
                
                if (lastValue < maxId) {
                    const nextVal = maxId + 1;
                    console.log(`⚙️  Fixing ${table}_id_seq: ${lastValue} → ${nextVal}`);
                    await pool.query(`SELECT setval('${table}_id_seq', $1)`, [nextVal]);
                }
            }
        }
    } catch (error) {
        console.warn('⚠️  Could not fix sequences:', error.message);
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
        // Run migrations and fixes before starting server
        await ensureJoinedDateColumn();
        await fixDatabaseSequences();
        
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