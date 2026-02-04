import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Your Neon connection string
const NEON_URL = 'postgresql://neondb_owner:npg_HZXRi6rCg3OG@ep-dawn-paper-a18b60ms-pooler.ap-southeast-1.aws.neon.tech/taskflow?sslmode=require&channel_binding=require';

// Step 1: Export from Railway (or your current database)
async function exportDatabase() {
    console.log('\n📤 STEP 1: Exporting schema and data from Railway...\n');
    
    return new Promise((resolve, reject) => {
        // First, get your Railway DATABASE_URL - check Railway dashboard
        // For now, we'll create the schema directly in Neon
        console.log('⚠️  Manual step needed:');
        console.log('1. Get your Railway DATABASE_URL from Railway dashboard');
        console.log('2. Or provide it here to export automatically');
        console.log('\nFor now, I\'ll create the schema in Neon...\n');
        resolve();
    });
}

async function createSchema() {
    console.log('🗄️  Creating schema in Neon...\n');
    
    const { Client } = await import('pg');
    const client = new Client({ connectionString: NEON_URL });
    
    try {
        await client.connect();
        console.log('✅ Connected to Neon');
        
        // Create users table
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
        console.log('✅ Created users table');
        
        // Create employees table
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
        console.log('✅ Created employees table');
        
        // Create tasks table
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
        console.log('✅ Created tasks table');
        
        console.log('\n✅ Schema created successfully!');
        
        // Check tables
        const result = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('\n📋 Tables in Neon:');
        result.rows.forEach(row => console.log(`   - ${row.table_name}`));
        
        await client.end();
        return true;
    } catch (error) {
        console.error('❌ Error creating schema:', error.message);
        await client.end();
        return false;
    }
}

async function testConnection() {
    console.log('\n\n🧪 STEP 2: Testing Neon connection...\n');
    
    const { Client } = await import('pg');
    const client = new Client({ connectionString: NEON_URL });
    
    try {
        await client.connect();
        console.log('✅ Successfully connected to Neon!');
        
        const result = await client.query('SELECT NOW()');
        console.log(`✅ Database time: ${result.rows[0].now}`);
        
        // List tables
        const tables = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log(`\n📋 Tables found: ${tables.rows.length}`);
        tables.rows.forEach(row => console.log(`   - ${row.table_name}`));
        
        // Count records
        for (const table of ['users', 'employees', 'tasks']) {
            const count = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
            console.log(`   - ${table}: ${count.rows[0].count} records`);
        }
        
        await client.end();
        return true;
    } catch (error) {
        console.error('❌ Connection error:', error.message);
        return false;
    }
}

async function main() {
    console.log('====================================');
    console.log('    TASKFLOW → NEON MIGRATION');
    console.log('====================================');
    
    // Test Neon connection
    const connected = await testConnection();
    
    if (!connected) {
        console.error('\n❌ Cannot connect to Neon. Check connection string.');
        process.exit(1);
    }
    
    console.log('\n\n✅ NEON IS READY!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Get Railway DATABASE_URL from Railway dashboard');
    console.log('2. Run: pg_dump <RAILWAY_URL> | psql <NEON_URL>');
    console.log('   (Or use the migration-with-data.js script)');
    console.log('3. Update backend/.env with new NEON DATABASE_URL');
    console.log('4. Test locally: npm test');
    console.log('5. Deploy to production');
    
    console.log('\n🔗 Your Neon connection string:');
    console.log(NEON_URL.substring(0, 50) + '...');
    
    process.exit(0);
}

main();
