import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

async function updateRoles() {
    try {
        console.log('🔄 Checking and updating employee roles...');

        // Check current users without explicit roles or with null roles
        const usersCheck = await pool.query(
            'SELECT id, username, role, name FROM users ORDER BY id'
        );

        console.log('\n📋 Current users:');
        usersCheck.rows.forEach(user => {
            console.log(`  - ${user.name} (${user.username}): ${user.role || 'NO ROLE'}`);
        });

        // Update any users that might not have a role set (though the schema should prevent this)
        // This is just a safety check
        const updateResult = await pool.query(
            `UPDATE users 
             SET role = 'employee' 
             WHERE role IS NULL OR role = ''
             RETURNING id, username, name, role`
        );

        if (updateResult.rows.length > 0) {
            console.log('\n✅ Updated users without roles:');
            updateResult.rows.forEach(user => {
                console.log(`  - ${user.name}: set to ${user.role}`);
            });
        } else {
            console.log('\n✅ All users already have roles assigned');
        }

        console.log('\n✨ Role update complete!');
        console.log('\nℹ️  To manually set a user as manager, run:');
        console.log("   UPDATE users SET role = 'manager' WHERE username = 'username_here';");
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating roles:', error.message);
        process.exit(1);
    }
}

updateRoles();
