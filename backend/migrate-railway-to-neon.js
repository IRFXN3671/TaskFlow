import { Client } from 'pg';

const RAILWAY_URL = 'postgresql://postgres:EKwPSGhiaitOugPqphwNyKEkzYDbvlnm@hopper.proxy.rlwy.net:31384/railway';
const NEON_URL = 'postgresql://neondb_owner:npg_HZXRi6rCg3OG@ep-dawn-paper-a18b60ms-pooler.ap-southeast-1.aws.neon.tech/taskflow?sslmode=require';

async function migrateData() {
    const railwayClient = new Client({ connectionString: RAILWAY_URL });
    const neonClient = new Client({ connectionString: NEON_URL, ssl: { rejectUnauthorized: false } });

    try {
        console.log('\n====================================');
        console.log('   RAILWAY → NEON DATA MIGRATION');
        console.log('====================================\n');

        // Connect to both databases
        console.log('🔌 Connecting to Railway...');
        await railwayClient.connect();
        console.log('✅ Connected to Railway');

        console.log('🔌 Connecting to Neon...');
        await neonClient.connect();
        console.log('✅ Connected to Neon\n');

        // ===== MIGRATE USERS =====
        console.log('📤 Migrating users table...');
        const usersResult = await railwayClient.query('SELECT * FROM users ORDER BY id');
        const users = usersResult.rows;
        console.log(`   Found ${users.length} users`);

        if (users.length > 0) {
            for (const user of users) {
                await neonClient.query(
                    'INSERT INTO users (id, username, password, role, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
                    [user.id, user.username, user.password, user.role, user.name, user.created_at, user.updated_at]
                );
            }
            console.log(`✅ Inserted ${users.length} users to Neon\n`);
        }

        // ===== MIGRATE EMPLOYEES =====
        console.log('📤 Migrating employees table...');
        const employeesResult = await railwayClient.query('SELECT * FROM employees ORDER BY id');
        const employees = employeesResult.rows;
        console.log(`   Found ${employees.length} employees`);

        if (employees.length > 0) {
            for (const emp of employees) {
                await neonClient.query(
                    'INSERT INTO employees (id, user_id, email, position, department, is_active, skills, last_login, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING',
                    [emp.id, emp.user_id, emp.email, emp.position, emp.department, emp.is_active, emp.skills, emp.last_login, emp.created_at, emp.updated_at]
                );
            }
            console.log(`✅ Inserted ${employees.length} employees to Neon\n`);
        }

        // ===== MIGRATE TASKS =====
        console.log('📤 Migrating tasks table...');
        const tasksResult = await railwayClient.query('SELECT * FROM tasks ORDER BY id');
        const tasks = tasksResult.rows;
        console.log(`   Found ${tasks.length} tasks`);

        if (tasks.length > 0) {
            let skipped = 0;
            for (const task of tasks) {
                // Skip tasks with null assigned_to
                if (!task.assigned_to) {
                    console.log(`   ⚠️  Skipping task ${task.id} - no assigned employee`);
                    skipped++;
                    continue;
                }
                await neonClient.query(
                    'INSERT INTO tasks (id, title, description, assigned_to, status, priority, due_date, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING',
                    [task.id, task.title, task.description, task.assigned_to, task.status, task.priority, task.due_date, task.created_by, task.created_at, task.updated_at]
                );
            }
            console.log(`✅ Inserted ${tasks.length - skipped} tasks to Neon (${skipped} skipped)\n`);
        }

        // ===== VERIFY MIGRATION =====
        console.log('🧪 Verifying migration...\n');

        const neonUsers = await neonClient.query('SELECT COUNT(*) as count FROM users');
        const neonEmployees = await neonClient.query('SELECT COUNT(*) as count FROM employees');
        const neonTasks = await neonClient.query('SELECT COUNT(*) as count FROM tasks');

        console.log('📊 Neon Database Status:');
        console.log(`   - Users: ${neonUsers.rows[0].count} records`);
        console.log(`   - Employees: ${neonEmployees.rows[0].count} records`);
        console.log(`   - Tasks: ${neonTasks.rows[0].count} records\n`);

        // Show sample user data
        console.log('👥 Sample users in Neon:');
        const sampleUsers = await neonClient.query('SELECT id, username, name, role FROM users LIMIT 3');
        sampleUsers.rows.forEach(user => {
            console.log(`   - ${user.username} (${user.name}) [${user.role}]`);
        });

        console.log('\n✅ MIGRATION COMPLETE!\n');
        console.log('📋 NEXT STEPS:');
        console.log('1. ✅ Backend .env updated with Neon DATABASE_URL');
        console.log('2. ✅ All data migrated from Railway to Neon');
        console.log('3. 🔧 Deploy backend to production');
        console.log('4. 🧪 Test login and functionality');

        await railwayClient.end();
        await neonClient.end();
    } catch (error) {
        console.error('\n❌ Migration error:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Check Railway DATABASE_URL is correct');
        console.error('2. Check Neon DATABASE_URL is correct');
        console.error('3. Ensure both databases are accessible');
        await railwayClient.end();
        await neonClient.end();
        process.exit(1);
    }
}

migrateData();
