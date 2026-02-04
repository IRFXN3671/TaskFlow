import { Client } from 'pg';

const NEON_URL = 'postgresql://neondb_owner:npg_HZXRi6rCg3OG@ep-dawn-paper-a18b60ms-pooler.ap-southeast-1.aws.neon.tech/taskflow?sslmode=require';

async function createSchema() {
    const client = new Client({ connectionString: NEON_URL });
    
    try {
        await client.connect();
        console.log('✅ Connected to Neon\n');
        
        // Create users table
        console.log('Creating users table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'employee',
                name VARCHAR(255),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ users table created');
        
        // Create employees table
        console.log('Creating employees table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                email VARCHAR(255),
                position VARCHAR(255),
                department VARCHAR(255),
                is_active BOOLEAN DEFAULT true,
                skills TEXT,
                last_login TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ employees table created');
        
        // Create tasks table
        console.log('Creating tasks table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                assigned_to INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
                status VARCHAR(50) DEFAULT 'pending',
                priority VARCHAR(50) DEFAULT 'medium',
                due_date DATE,
                created_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ tasks table created');
        
        // Verify
        console.log('\n📋 Verifying tables...');
        const result = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `);
        
        console.log(`\n✅ Successfully created ${result.rows.length} tables:`);
        result.rows.forEach(row => console.log(`   - ${row.table_name}`));
        
        await client.end();
        return true;
    } catch (error) {
        console.error('❌ Error:', error.message);
        await client.end();
        return false;
    }
}

createSchema();
