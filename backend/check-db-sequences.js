import pool from './config/database.js';

async function checkDatabaseIssues() {
    try {
        console.log('\n🔍 Checking database status...\n');
        
        // Check max user ID
        const maxIdResult = await pool.query('SELECT MAX(id) as max_id FROM users');
        const maxId = maxIdResult.rows[0].max_id;
        console.log(`📊 Max user ID in database: ${maxId}`);
        
        // Check sequences
        const seqResult = await pool.query(`
            SELECT sequencename 
            FROM pg_sequences 
            WHERE schemaname = 'public'
        `);
        
        console.log('\n🔢 Database sequences:');
        for (const seq of seqResult.rows) {
            const lastVal = await pool.query(`SELECT last_value FROM ${seq.sequencename}`);
            console.log(`  ${seq.sequencename}: ${lastVal.rows[0].last_value}`);
        }
        
        // Reset sequences for all tables
        const tablesToFix = ['users', 'employees', 'tasks'];
        
        for (const table of tablesToFix) {
            const maxIdResult = await pool.query(`SELECT MAX(id) as max_id FROM ${table}`);
            const maxId = maxIdResult.rows[0].max_id;
            
            if (maxId && maxId > 0) {
                const nextVal = maxId + 1;
                console.log(`\n⚙️  Resetting ${table}_id_seq to ${nextVal}...`);
                await pool.query(`SELECT setval('${table}_id_seq', $1)`, [nextVal]);
                console.log(`✅ ${table}_id_seq reset`);
            }
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkDatabaseIssues();
