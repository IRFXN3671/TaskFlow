import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

async function deactivateUser() {
    try {
        const username = process.argv[2];

        if (!username) {
            console.log('❌ Please provide a username');
            console.log('Usage: node deactivate-user.js <username>');
            process.exit(1);
        }

        const result = await pool.query(
            `UPDATE employees SET is_active = false, updated_at = NOW() 
             WHERE user_id = (SELECT id FROM users WHERE username = $1) 
             RETURNING *`,
            [username]
        );

        if (result.rows.length === 0) {
            console.log(`❌ User "${username}" not found`);
            process.exit(1);
        }

        console.log(`✅ Successfully deactivated ${username}`);
        console.log(`   is_active: ${result.rows[0].is_active}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

deactivateUser();
