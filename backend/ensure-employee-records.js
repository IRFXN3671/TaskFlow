import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

async function ensureAllUsersHaveEmployeeRecords() {
    try {
        console.log('🔄 Checking if all users have employee records...');

        // Find users without employee records
        const usersWithoutEmp = await pool.query(`
            SELECT u.id, u.username, u.name, u.role 
            FROM users u 
            LEFT JOIN employees e ON u.id = e.user_id 
            WHERE e.id IS NULL
        `);

        if (usersWithoutEmp.rows.length > 0) {
            console.log(`\n⚠️  Found ${usersWithoutEmp.rows.length} users without employee records:`);
            
            for (const user of usersWithoutEmp.rows) {
                console.log(`  - ${user.name} (${user.username}) - Role: ${user.role}`);
                
                // Create employee record for this user
                await pool.query(
                    `INSERT INTO employees (user_id, email, position, department, joined_date, is_active)
                     VALUES ($1, $2, $3, $4, CURRENT_DATE, true)
                     ON CONFLICT (user_id) DO NOTHING`,
                    [
                        user.id,
                        `${user.username}@company.com`,
                        user.role === 'manager' ? 'Manager' : 'Employee',
                        'General'
                    ]
                );
                console.log(`    ✅ Created employee record`);
            }
        } else {
            console.log('✅ All users already have employee records');
        }

        // Verify the fix
        const allUsers = await pool.query(`
            SELECT u.username, u.role, e.is_active 
            FROM users u 
            JOIN employees e ON u.id = e.user_id 
            ORDER BY u.username
        `);

        console.log('\n📋 Users and their status:');
        allUsers.rows.forEach(user => {
            const status = user.is_active ? '✅ Active' : '❌ Inactive';
            console.log(`  - ${user.username} (${user.role}): ${status}`);
        });

        console.log('\n✨ Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

ensureAllUsersHaveEmployeeRecords();
