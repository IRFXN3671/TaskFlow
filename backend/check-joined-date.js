import pool from './config/database.js';

async function checkJoinedDate() {
    try {
        console.log('\n🔍 Checking employees table structure...\n');
        
        // Get table columns
        const columns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'employees'
            ORDER BY ordinal_position
        `);
        
        console.log('Columns in employees table:');
        columns.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type}`);
        });
        
        // Check joined_date values
        console.log('\n📊 Sample employee joined dates:');
        const dates = await pool.query(`
            SELECT e.id, u.name, e.email, e.joined_date 
            FROM employees e 
            JOIN users u ON e.user_id = u.id 
            LIMIT 5
        `);
        
        dates.rows.forEach(row => {
            console.log(`  ${row.name}: ${row.joined_date}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkJoinedDate();
