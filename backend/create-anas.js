import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './config/database.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function createAndDeactivateAnas() {
    const client = await pool.connect();
    
    try {
        console.log('🔧 Setting up anas user for testing...\n');
        
        await client.query('BEGIN');

        // Check if anas already exists
        let anasResult = await client.query(
            'SELECT id FROM users WHERE username = $1',
            ['anas']
        );

        let userId;

        if (anasResult.rows.length === 0) {
            // Create anas as a manager
            console.log('👤 Creating user "anas" as manager...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            const userResult = await client.query(
                `INSERT INTO users (username, password, role, name)
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                ['anas', hashedPassword, 'manager', 'Anas']
            );
            userId = userResult.rows[0].id;
            console.log('   ✅ Created user');
        } else {
            userId = anasResult.rows[0].id;
            console.log('👤 User "anas" already exists');
        }

        // Check if employee record exists
        const empCheck = await client.query(
            'SELECT id FROM employees WHERE user_id = $1',
            [userId]
        );

        if (empCheck.rows.length === 0) {
            // Create employee record
            console.log('📝 Creating employee record...');
            await client.query(
                `INSERT INTO employees (user_id, email, position, department, joined_date, is_active)
                 VALUES ($1, $2, $3, $4, CURRENT_DATE, $5)`,
                [userId, 'anas@company.com', 'Manager', 'Management', false]
            );
            console.log('   ✅ Created with is_active = false');
        } else {
            // Deactivate existing employee record
            console.log('📝 Deactivating employee record...');
            await client.query(
                `UPDATE employees SET is_active = false, updated_at = NOW() WHERE user_id = $1`,
                [userId]
            );
            console.log('   ✅ Deactivated successfully');
        }

        await client.query('COMMIT');

        // Verify
        const verifyResult = await client.query(
            'SELECT u.username, u.role, e.is_active FROM users u JOIN employees e ON u.id = e.user_id WHERE u.username = $1',
            ['anas']
        );

        const user = verifyResult.rows[0];
        console.log('\n✅ Final Status:');
        console.log(`  Username: ${user.username}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Is Active: ${user.is_active}`);
        console.log('\n🔐 Login Credentials:');
        console.log('  Username: anas');
        console.log('  Password: password123');
        console.log('\n⚠️  This user SHOULD BE BLOCKED from login!');

        process.exit(0);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        client.release();
    }
}

createAndDeactivateAnas();
