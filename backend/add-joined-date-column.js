import pool from './config/database.js';

async function addJoinedDateColumn() {
    try {
        console.log('\n⏳ Adding joined_date column to employees table...\n');
        
        // Add the column with a default value of today
        await pool.query(`
            ALTER TABLE employees 
            ADD COLUMN joined_date DATE DEFAULT CURRENT_DATE
        `);
        
        console.log('✅ Column joined_date added successfully');
        
        // Verify the column exists
        const columns = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'employees' AND column_name = 'joined_date'
        `);
        
        if (columns.rows.length > 0) {
            console.log('✅ Column verified in employees table\n');
        }
        
        process.exit(0);
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log('ℹ️  Column already exists');
            process.exit(0);
        }
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addJoinedDateColumn();
