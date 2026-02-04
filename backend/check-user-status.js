import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function checkStatus() {
    try {
        const result = await pool.query(
            'SELECT u.username, u.role, e.is_active FROM users u JOIN employees e ON u.id = e.user_id WHERE u.username = $1',
            ['manager1']
        );

        if (result.rows.length === 0) {
            console.log('❌ manager1 not found');
            process.exit(1);
        }

        const user = result.rows[0];
        console.log('\n📋 manager1 Status:');
        console.log(`  Username: ${user.username}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Is Active: ${user.is_active}`);

        if (user.is_active === false) {
            console.log('\n✅ Confirmed: manager1 is INACTIVE in database');
            console.log('   (Should be blocked from login)');
        } else {
            console.log('\n❌ manager1 is still ACTIVE in database!');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkStatus();
