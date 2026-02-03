import pool from '../config/database.js';

export async function up() {
    const query = `
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) NOT NULL DEFAULT 'pending' 
                CHECK (status IN ('pending', 'in-progress', 'completed')),
            priority VARCHAR(50) NOT NULL DEFAULT 'medium'
                CHECK (priority IN ('low', 'medium', 'high')),
            due_date DATE NOT NULL,
            assignee_id INTEGER NOT NULL REFERENCES employees(user_id) ON DELETE CASCADE,
            created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
        CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
        CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
        CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
    `;
    
    try {
        await pool.query(query);
        console.log('✓ Tasks table created');
    } catch (error) {
        console.error('✗ Error creating tasks table:', error.message);
        throw error;
    }
}

export async function down() {
    try {
        await pool.query('DROP TABLE IF EXISTS tasks CASCADE;');
        console.log('✓ Tasks table dropped');
    } catch (error) {
        console.error('✗ Error dropping tasks table:', error.message);
        throw error;
    }
}