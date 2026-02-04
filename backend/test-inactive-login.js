import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

async function testLogin() {
    try {
        console.log('🧪 Testing login with inactive manager (manager1)...\n');
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'manager1',
                password: 'password123'
            })
        });

        const data = await response.json();

        console.log(`Status: ${response.status}`);
        console.log(`Response:`, JSON.stringify(data, null, 2));

        if (response.status === 403) {
            console.log('\n✅ SUCCESS: Inactive manager was blocked from login!');
            console.log(`   Message: "${data.message}"`);
        } else if (response.status === 200) {
            console.log('\n❌ FAILED: Inactive manager was allowed to login!');
            console.log(`   Token: ${data.token ? 'ISSUED' : 'NOT ISSUED'}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('❌ Details:', error);
        console.log('\n⚠️  Make sure the backend server is running on port 5000');
        console.log('   Run: npm start (in the backend directory)');
        process.exit(1);
    }
}

testLogin();
