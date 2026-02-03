import pool from '../config/database.js';

export async function up() {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'employee')),
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `;
    
    try {
        await pool.query(query);
        console.log('✓ Users table created');
    } catch (error) {
        console.error('✗ Error creating users table:', error.message);
        throw error;
    }
}

export async function down() {
    try {
        await pool.query('DROP TABLE IF EXISTS users CASCADE;');
        console.log('✓ Users table dropped');
    } catch (error) {
        console.error('✗ Error dropping users table:', error.message);
        throw error;
    }
}