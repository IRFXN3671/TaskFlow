import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import employeesRoutes from './routes/employees.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
    origin: corsOrigin,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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