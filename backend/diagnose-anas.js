import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function fullDiagnostics() {
    try {
        console.log('🔍 FULL DATABASE DIAGNOSTICS FOR ANAS USER\n');
        console.log('═'.repeat(70));

        // Check users table
        console.log('\n📋 USERS TABLE:');
        const userResult = await pool.query(
            'SELECT id, username, role, name, created_at FROM users WHERE username = $1',
            ['anas']
        );

        if (userResult.rows.length === 0) {
            console.log('❌ User "anas" NOT FOUND in users table');
            process.exit(1);
        }

        const user = userResult.rows[0];
        console.log(`  Username: ${user.username}`);
        console.log(`  User ID: ${user.id}`);
        console.log(`  Role in users table: ${user.role}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Created: ${user.created_at}`);

        // Check employees table
        console.log('\n📋 EMPLOYEES TABLE:');
        const empResult = await pool.query(
            'SELECT id, user_id, email, position, department, is_active, joined_date FROM employees WHERE user_id = $1',
            [user.id]
        );

        if (empResult.rows.length === 0) {
            console.log('❌ NO EMPLOYEE RECORD FOUND for this user!');
            console.log('\n⚠️  Creating employee record with is_active = false...');
            
            await pool.query(
                `INSERT INTO employees (user_id, email, position, department, joined_date, is_active)
                 VALUES ($1, $2, $3, $4, CURRENT_DATE, false)`,
                [user.id, `${user.username}@company.com`, user.role === 'manager' ? 'Manager' : 'Employee', 'General']
            );
            
            console.log('✅ Employee record created with is_active = false');
        } else {
            const emp = empResult.rows[0];
            console.log(`  Employee ID: ${emp.id}`);
            console.log(`  User ID: ${emp.user_id}`);
            console.log(`  Email: ${emp.email}`);
            console.log(`  Position: ${emp.position}`);
            console.log(`  Department: ${emp.department}`);
            console.log(`  Is Active: ${emp.is_active}`);
            console.log(`  Joined: ${emp.joined_date}`);

            if (emp.is_active === true) {
                console.log('\n⚠️  User is ACTIVE! Deactivating...');
                await pool.query(
                    'UPDATE employees SET is_active = false, updated_at = NOW() WHERE user_id = $1',
                    [user.id]
                );
                console.log('✅ User deactivated');
            } else if (emp.is_active === false) {
                console.log('\n✅ User is already INACTIVE');
            }
        }

        // Final verification
        console.log('\n═'.repeat(70));
        console.log('\n✅ FINAL STATUS CHECK:');
        
        const finalResult = await pool.query(
            `SELECT u.username, u.role, e.is_active 
             FROM users u 
             JOIN employees e ON u.id = e.user_id 
             WHERE u.username = $1`,
            ['anas']
        );

        if (finalResult.rows.length === 0) {
            console.log('❌ FAILED - Still no employee record');
            process.exit(1);
        }

        const final = finalResult.rows[0];
        console.log(`  Username: ${final.username}`);
        console.log(`  Role: ${final.role}`);
        console.log(`  Is Active: ${final.is_active}`);

        if (final.is_active === false) {
            console.log('\n✅ SUCCESS! User "anas" is INACTIVE and should be blocked from login');
            console.log('\n🔐 Test Credentials:');
            console.log('  Username: anas');
            console.log('  Password: (whatever password they use)');
            console.log('\n⚠️  Trying to login should show: "Account is inactive"');
        } else {
            console.log('\n❌ ERROR! User is still ACTIVE');
        }

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Details:', error);
        process.exit(1);
    }
}

fullDiagnostics();
