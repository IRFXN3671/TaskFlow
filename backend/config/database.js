import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,  // Connection pooling: max 20 connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: { rejectUnauthorized: false }  // For Neon
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export default pool;