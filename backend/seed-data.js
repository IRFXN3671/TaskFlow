import pool from './config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('\n📦 Seeding database...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await client.query('DELETE FROM tasks CASCADE');
        await client.query('DELETE FROM employees CASCADE');
        await client.query('DELETE FROM users CASCADE');

        // Create manager
        console.log('👤 Creating manager user...');
        const managerPassword = await bcrypt.hash('password123', 10);
        const managerResult = await client.query(
            `INSERT INTO users (username, password, role, name)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            ['manager1', managerPassword, 'manager', 'Irfan']
        );
        const managerId = managerResult.rows[0].id;

        // Create employees
        console.log('👥 Creating employee users...');
        const employees = [
            { username: 'employee1', name: 'Nidal', email: 'nidal@taskflow.com', position: 'Frontend Developer', department: 'Development' },
            { username: 'employee2', name: 'Wasim', email: 'wasim@taskflow.com', position: 'Backend Developer', department: 'Development' },
            { username: 'employee3', name: 'Sanin', email: 'sanin@taskflow.com', position: 'QA Engineer', department: 'Quality Assurance' }
        ];

        const employeeIds = [];

        for (const emp of employees) {
            const password = await bcrypt.hash('password123', 10);
            const userResult = await client.query(
                `INSERT INTO users (username, password, role, name)
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                [emp.username, password, 'employee', emp.name]
            );

            const userId = userResult.rows[0].id;
            employeeIds.push(userId);

            await client.query(
                `INSERT INTO employees (user_id, email, position, department, joined_date, skills, is_active)
                 VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, true)`,
                [userId, emp.email, emp.position, emp.department, ['JavaScript', 'React']]
            );
        }

        // Create sample tasks
        console.log('📝 Creating sample tasks...');
        const tasks = [
            {
                title: 'Design Homepage Layout',
                description: 'Create wireframes and mockups for the new homepage design',
                status: 'in-progress',
                priority: 'high',
                dueDate: '2025-02-01',
                assigneeId: employeeIds[0]
            },
            {
                title: 'API Documentation Update',
                description: 'Update the API documentation with latest endpoints',
                status: 'pending',
                priority: 'medium',
                dueDate: '2025-01-28',
                assigneeId: employeeIds[1]
            },
            {
                title: 'Database Migration Script',
                description: 'Create migration scripts for the new user roles table',
                status: 'completed',
                priority: 'high',
                dueDate: '2025-01-20',
                assigneeId: employeeIds[2]
            },
            {
                title: 'User Testing Session',
                description: 'Conduct user testing for the new dashboard interface',
                status: 'pending',
                priority: 'medium',
                dueDate: '2025-02-05',
                assigneeId: employeeIds[0]
            },
            {
                title: 'Security Audit',
                description: 'Perform comprehensive security audit of the authentication system',
                status: 'in-progress',
                priority: 'high',
                dueDate: '2025-01-25',
                assigneeId: employeeIds[1]
            },
            {
                title: 'Mobile App Testing',
                description: 'Test mobile responsiveness across different devices',
                status: 'completed',
                priority: 'low',
                dueDate: '2025-01-22',
                assigneeId: employeeIds[2]
            }
        ];

        for (const task of tasks) {
            await client.query(
                `INSERT INTO tasks (title, description, status, priority, due_date, assignee_id, created_by)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [task.title, task.description, task.status, task.priority, task.dueDate, task.assigneeId, managerId]
            );
        }

        await client.query('COMMIT');

        console.log('\n✅ Database seeded successfully!\n');
        console.log('📊 Seed data:');
        console.log('   - 1 Manager: manager1 / password123');
        console.log('   - 3 Employees: employee1, employee2, employee3 / password123');
        console.log('   - 6 Sample tasks\n');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    } finally {
        client.release();
        process.exit(0);
    }
}

seedDatabase();
