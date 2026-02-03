import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function setupDatabase() {
    // Connect to default 'postgres' database first
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: 'postgres',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    try {
        await client.connect();
        console.log('✓ Connected to PostgreSQL');

        // Check if database exists
        const result = await client.query(
            "SELECT datname FROM pg_database WHERE datname = $1",
            [process.env.DB_NAME]
        );

        if (result.rows.length === 0) {
            console.log(`\n📦 Creating database '${process.env.DB_NAME}'...`);
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`✓ Database '${process.env.DB_NAME}' created successfully\n`);
        } else {
            console.log(`✓ Database '${process.env.DB_NAME}' already exists\n`);
        }

    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

setupDatabase();
