import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function listAllUsers() {
    try {
        const result = await pool.query(
            'SELECT u.id, u.username, u.name, u.role, e.is_active FROM users u LEFT JOIN employees e ON u.id = e.user_id ORDER BY u.username'
        );

        console.log('\n📋 All Users in Database:');
        console.log('─'.repeat(70));
        
        result.rows.forEach(user => {
            const status = user.is_active === null ? '❓ NO RECORD' : (user.is_active ? '✅ Active' : '❌ Inactive');
            console.log(`  ${user.username.padEnd(15)} | ${user.name.padEnd(20)} | ${user.role.padEnd(10)} | ${status}`);
        });
        
        console.log('─'.repeat(70));

        // Check if anas exists (case-insensitive)
        const anasLower = result.rows.find(u => u.username.toLowerCase() === 'anas');
        if (anasLower) {
            console.log(`\n📍 Found user: ${anasLower.username}`);
        } else {
            console.log('\n❌ User "anas" not found in database');
            console.log('   Available users: ' + result.rows.map(u => u.username).join(', '));
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

listAllUsers();
