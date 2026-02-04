import pool from './config/database.js';
import bcrypt from 'bcryptjs';

async function testLogin() {
    try {
        const username = 'manager1';
        
        console.log('\n=== SIMULATING LOGIN PROCESS FOR:', username, '===\n');
        
        // Step 1: Find user
        const userResult = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            console.log('❌ User not found');
            process.exit(0);
        }

        const user = userResult.rows[0];
        console.log(`✓ Step 1: User found`);
        console.log(`  - ID: ${user.id}`);
        console.log(`  - Username: ${user.username}`);
        console.log(`  - Role: ${user.role}`);
        console.log(`  - Name: ${user.name}`);
        
        // Step 2: Check employee record
        console.log(`\n✓ Step 2: Checking employee record...`);
        const empResult = await pool.query(
            'SELECT is_active FROM employees WHERE user_id = $1',
            [user.id]
        );
        
        console.log(`  - Employee record found: ${empResult.rows.length > 0 ? 'YES' : 'NO'}`);
        
        if (empResult.rows.length === 0) {
            console.log('\n❌ RESULT: LOGIN BLOCKED - No employee record');
            console.log('   Return: 403 - Account is inactive');
            process.exit(0);
        }
        
        console.log(`  - is_active: ${empResult.rows[0].is_active}`);
        
        // Step 3: Check if active
        if (!empResult.rows[0].is_active) {
            console.log('\n❌ RESULT: LOGIN SHOULD BE BLOCKED - User is inactive');
            console.log('   Return: 403 - Account is inactive');
        } else {
            console.log('\n✓ RESULT: LOGIN ALLOWED - User is active');
            console.log('   Return: 200 - Token generated');
        }
        
        console.log('\n=== LOCAL CODE LOGIC ===');
        console.log('The local backend code WILL block this login.');
        console.log('If login is succeeding on your live site, it means:');
        console.log('  1. Railway backend is NOT running the latest code');
        console.log('  2. You need to deploy the backend to Railway\n');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testLogin();
