import fetch from 'node-fetch';

async function testCreateEmployee() {
    console.log('\n🧪 Testing Create Employee API...\n');
    
    // First login
    const loginRes = await fetch('https://taskflow-backend-wukr.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'sahal', password: 'password123' })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    console.log('✅ Logged in as sahal');
    
    // Try to create an employee
    console.log('\n📝 Creating new employee...\n');
    const createRes = await fetch('https://taskflow-backend-wukr.onrender.com/api/employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: 'New Test Employee',
            email: 'newtest' + Date.now() + '@example.com',
            position: 'Test Position',
            department: 'Test Dept',
            username: 'testuser' + Date.now(),
            password: 'password123',
            role: 'employee',
            skills: []
        })
    });
    
    const createData = await createRes.json();
    console.log('Response Status:', createRes.status);
    console.log('Response:', JSON.stringify(createData, null, 2));
    
    process.exit(0);
}

testCreateEmployee();
