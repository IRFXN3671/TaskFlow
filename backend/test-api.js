import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';
let TOKEN = '';

async function test(name, method, endpoint, body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (TOKEN) {
            options.headers['Authorization'] = `Bearer ${TOKEN}`;
        }

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();

        console.log(`\n✅ ${name}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(data, null, 2));

        return data;
    } catch (error) {
        console.log(`\n❌ ${name}`);
        console.log(`   Error: ${error.message}`);
    }
}

async function runTests() {
    console.log('\n🧪 TESTING TASKFLOW API\n');

    // 1. Health Check
    await test('Health Check', 'GET', '/health');

    // 2. Login
    const loginRes = await test(
        'Login Manager',
        'POST',
        '/auth/login',
        { username: 'manager1', password: 'password123' }
    );

    if (loginRes && loginRes.token) {
        TOKEN = loginRes.token;
        console.log(`\n   Token: ${TOKEN.substring(0, 20)}...`);

        // 3. Get Current User
        await test('Get Current User', 'GET', '/auth/me');

        // 4. Get All Tasks
        await test('Get All Tasks', 'GET', '/tasks');

        // 5. Get Task Stats
        await test('Get Task Statistics', 'GET', '/tasks/stats');

        // 6. Get All Employees
        await test('Get All Employees', 'GET', '/employees');

        // 7. Get Active Employees
        await test('Get Active Employees', 'GET', '/employees/active');

        // 8. Get Employee Stats (Manager Only)
        await test('Get Employee Statistics', 'GET', '/employees/stats');

        // 9. Create Task
        const createTaskRes = await test(
            'Create Task',
            'POST',
            '/tasks',
            {
                title: 'Integration Test Task',
                description: 'Testing the backend API',
                status: 'pending',
                priority: 'high',
                dueDate: '2025-02-15',
                assigneeId: 2
            }
        );

        if (createTaskRes && createTaskRes.data) {
            const taskId = createTaskRes.data.id;

            // 10. Get Single Task
            await test('Get Single Task', 'GET', `/tasks/${taskId}`);

            // 11. Update Task
            await test(
                'Update Task',
                'PUT',
                `/tasks/${taskId}`,
                { status: 'in-progress', priority: 'medium' }
            );

            // 12. Delete Task
            await test('Delete Task', 'DELETE', `/tasks/${taskId}`);
        }

        // 13. Change Password
        await test(
            'Change Password',
            'POST',
            '/auth/change-password',
            {
                currentPassword: 'password123',
                newPassword: 'newpassword123'
            }
        );
    }

    console.log('\n\n🎉 Testing Complete!\n');
    process.exit(0);
}

runTests();
