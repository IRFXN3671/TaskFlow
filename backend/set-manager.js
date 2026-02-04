import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

async function setManager() {
    try {
        // Get username from command line argument
        const username = process.argv[2];

        if (!username) {
            console.log('❌ Please provide a username');
            console.log('Usage: node set-manager.js <username>');
            console.log('\nAvailable users:');
            
            const users = await pool.query('SELECT username, name, role FROM users ORDER BY name');
            users.rows.forEach(user => {
                console.log(`  - ${user.username} (${user.name}) - Current role: ${user.role}`);
            });
            
            process.exit(1);
        }

        // Update user role to manager
        const result = await pool.query(
            `UPDATE users SET role = 'manager', updated_at = NOW() WHERE username = $1 RETURNING id, username, name, role`,
            [username]
        );

        if (result.rows.length === 0) {
            console.log(`❌ User "${username}" not found`);
            process.exit(1);
        }

        const user = result.rows[0];
        console.log(`✅ Successfully promoted ${user.name} (${user.username}) to Manager`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting manager:', error.message);
        process.exit(1);
    }
}

setManager();
