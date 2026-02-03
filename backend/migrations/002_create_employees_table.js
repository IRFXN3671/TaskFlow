import pool from '../config/database.js';

export async function up() {
    const query = `
        CREATE TABLE IF NOT EXISTS employees (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            email VARCHAR(255) UNIQUE NOT NULL,
            position VARCHAR(255) NOT NULL,
            department VARCHAR(255) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            joined_date DATE NOT NULL,
            last_login TIMESTAMP,
            skills TEXT[] DEFAULT ARRAY[]::TEXT[],
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
        CREATE INDEX IF NOT EXISTS idx_employees_is_active ON employees(is_active);
        CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
    `;
    
    try {
        await pool.query(query);
        console.log('✓ Employees table created');
    } catch (error) {
        console.error('✗ Error creating employees table:', error.message);
        throw error;
    }
}

export async function down() {
    try {
        await pool.query('DROP TABLE IF EXISTS employees CASCADE;');
        console.log('✓ Employees table dropped');
    } catch (error) {
        console.error('✗ Error dropping employees table:', error.message);
        throw error;
    }
}