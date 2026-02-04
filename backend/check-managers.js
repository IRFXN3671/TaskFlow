import pool from './config/database.js';

async function checkManagers() {
    try {
        console.log('\n=== CHECKING ALL MANAGERS ===\n');
        
        // Get all managers from users table
        const managersResult = await pool.query(
            "SELECT id, username, name, role FROM users WHERE role = 'manager' ORDER BY id"
        );
        
        console.log(`Found ${managersResult.rows.length} managers in users table:\n`);
        
        for (const manager of managersResult.rows) {
            console.log(`Manager: ${manager.username} (ID: ${manager.id}, Name: ${manager.name})`);
            
            // Check if they have an employee record
            const empResult = await pool.query(
                'SELECT user_id, email, position, department, is_active FROM employees WHERE user_id = $1',
                [manager.id]
            );
            
            if (empResult.rows.length === 0) {
                console.log(`  ❌ NO EMPLOYEE RECORD FOUND - THIS MANAGER CAN LOGIN!`);
            } else {
                const emp = empResult.rows[0];
                console.log(`  ✓ Employee record found:`);
                console.log(`    - Email: ${emp.email}`);
                console.log(`    - Position: ${emp.position}`);
                console.log(`    - Department: ${emp.department}`);
                console.log(`    - is_active: ${emp.is_active} ${emp.is_active ? '✓' : '❌ SHOULD BE BLOCKED'}`);
            }
            console.log('');
        }
        
        console.log('\n=== SUMMARY ===');
        console.log('If a manager has NO employee record, they will bypass the is_active check!');
        console.log('This is the bug - all users must have employee records.\n');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkManagers();
