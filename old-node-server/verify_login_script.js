const BASE_URL = 'http://localhost:4000/api/users';
const TEST_USER = {
    fullName: 'Test User',
    email: `test_${Date.now()}@example.com`,
    phone: '1234567890',
    password: 'password123'
};

async function post(endpoint, data) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but got ${contentType}. Body: ${text.substring(0, 100)}...`);
    }

    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.error || 'Request failed');
    }
    return json;
}

async function runTest() {
    try {
        console.log('--- Starting Backend Verification ---');

        // 1. Signup
        console.log(`\n1. Testing Signup for ${TEST_USER.email}...`);
        try {
            const signupRes = await post('/signup', TEST_USER);
            console.log('✅ Signup Successful:', signupRes);
        } catch (error) {
            if (error.message.includes('User already exists')) {
                console.log('⚠️ User already exists, proceeding to login...');
            } else {
                throw error;
            }
        }

        // 2. Login Init
        console.log('\n2. Testing Login Init...');
        const loginInitRes = await post('/login-init', {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        console.log('✅ Login Init Successful:', loginInitRes);

        if (loginInitRes.step !== 'otp') {
            throw new Error('Expected OTP step in login response');
        }

        console.log('\n--- Backend Verification Complete ---');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        process.exit(1);
    }
}

runTest();
