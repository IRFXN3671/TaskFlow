import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function checkAnasStatus() {
    try {
        // Check if anas exists and their status
        const result = await pool.query(
            'SELECT u.id, u.username, u.role, e.is_active FROM users u LEFT JOIN employees e ON u.id = e.user_id WHERE u.username = $1',
            ['anas']
        );

        if (result.rows.length === 0) {
            console.log('❌ User "anas" not found');
            process.exit(1);
        }

        const user = result.rows[0];
        console.log('\n📋 User "anas" Status:');
        console.log(`  Username: ${user.username}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Is Active: ${user.is_active}`);
        console.log(`  User ID: ${user.id}`);

        if (user.is_active === null) {
            console.log('\n⚠️  WARNING: User has NO employee record!');
            console.log('   Creating employee record for anas...');
            
            // Create employee record
            await pool.query(
                `INSERT INTO employees (user_id, email, position, department, joined_date, is_active)
                 VALUES ($1, $2, $3, $4, CURRENT_DATE, false)`,
                [user.id, `${user.username}@company.com`, user.role === 'manager' ? 'Manager' : 'Employee', 'General']
            );
            
            console.log('   ✅ Created employee record with is_active = false');
        } else if (user.is_active === true) {
            console.log('\n⚠️  User "anas" is ACTIVE. Deactivating...');
            
            // Deactivate
            await pool.query(
                'UPDATE employees SET is_active = false, updated_at = NOW() WHERE user_id = $1',
                [user.id]
            );
            
            console.log('   ✅ Deactivated successfully');
        } else {
            console.log('\n✅ User "anas" is already INACTIVE');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAnasStatus();
