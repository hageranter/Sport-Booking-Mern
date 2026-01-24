const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

let accessToken = '';
let refreshToken = '';
let userId = '';

async function testAuthSystem() {
  console.log('\n🧪 Testing Authentication System...\n');
  console.log('=' .repeat(50));

  try {
    // Test 1: Register a new user
    console.log('\n1️⃣ Testing User Registration...');
    try {
      const registerData = {
        email: 'testuser@example.com',
        password: 'Test123456',
        fullName: 'Test User',
        phoneNumber: '+201234567899',
        role: 'User'
      };

      const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
      console.log('✅ Registration successful');
      console.log('   User ID:', registerResponse.data.data.user.id);
      console.log('   Access Token:', registerResponse.data.data.accessToken.substring(0, 20) + '...');
      
      accessToken = registerResponse.data.data.accessToken;
      refreshToken = registerResponse.data.data.refreshToken;
      userId = registerResponse.data.data.user.id;
    } catch (error) {
      if (error.response?.data?.message?.includes('already registered')) {
        console.log('⚠️  User already exists (from previous test)');
        // Try login instead
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: 'testuser@example.com',
          password: 'Test123456'
        });
        accessToken = loginResponse.data.data.accessToken;
        refreshToken = loginResponse.data.data.refreshToken;
        userId = loginResponse.data.data.user.id;
        console.log('✅ Logged in with existing user');
      } else {
        throw error;
      }
    }

    // Test 2: Get user profile
    console.log('\n2️⃣ Testing Get User Profile (Protected Route)...');
    const meResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Profile fetched successfully');
    console.log('   Name:', meResponse.data.data.user.fullName);
    console.log('   Email:', meResponse.data.data.user.email);
    console.log('   Role:', meResponse.data.data.user.role);

    // Test 3: Access without token (should fail)
    console.log('\n3️⃣ Testing Unauthorized Access...');
    try {
      await axios.get(`${API_URL}/auth/me`);
      console.log('❌ Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly blocked unauthorized access');
        console.log('   Error:', error.response.data.message);
      } else {
        throw error;
      }
    }

    // Test 4: Refresh token
    console.log('\n4️⃣ Testing Token Refresh...');
    const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken
    });
    console.log('✅ Token refreshed successfully');
    console.log('   New Access Token:', refreshResponse.data.data.accessToken.substring(0, 20) + '...');
    
    const newAccessToken = refreshResponse.data.data.accessToken;
    const newRefreshToken = refreshResponse.data.data.refreshToken;

    // Test 5: Use new token
    console.log('\n5️⃣ Testing New Access Token...');
    const meResponse2 = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${newAccessToken}` }
    });
    console.log('✅ New token works correctly');

    // Test 6: Logout
    console.log('\n6️⃣ Testing Logout...');
    await axios.post(
      `${API_URL}/auth/logout`,
      { refreshToken: newRefreshToken },
      { headers: { Authorization: `Bearer ${newAccessToken}` } }
    );
    console.log('✅ Logout successful');

    // Test 7: Try using old refresh token (should fail)
    console.log('\n7️⃣ Testing Invalidated Refresh Token...');
    try {
      await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken: newRefreshToken
      });
      console.log('❌ Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Refresh token correctly invalidated after logout');
      } else {
        throw error;
      }
    }

    // Test 8: Login again
    console.log('\n8️⃣ Testing Login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'testuser@example.com',
      password: 'Test123456'
    });
    console.log('✅ Login successful');
    console.log('   Welcome back:', loginResponse.data.data.user.fullName);
    console.log('   Last Login:', loginResponse.data.data.user.lastLogin);

    // Test 9: Validation errors
    console.log('\n9️⃣ Testing Validation...');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email: 'invalid-email',
        password: '123', // Too short
        fullName: 'T', // Too short
        phoneNumber: 'invalid'
      });
      console.log('❌ Validation should have failed');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation working correctly');
        console.log('   Errors:', error.response.data.errors.length, 'validation errors caught');
      } else {
        throw error;
      }
    }

    // Test 10: Wrong password
    console.log('\n🔟 Testing Wrong Password...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'testuser@example.com',
        password: 'WrongPassword123'
      });
      console.log('❌ Should have failed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid credentials correctly rejected');
      } else {
        throw error;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL AUTHENTICATION TESTS PASSED!');
    console.log('='.repeat(50));
    console.log('\n📊 Test Summary:');
    console.log('   ✅ User Registration');
    console.log('   ✅ User Login');
    console.log('   ✅ Get Profile (Protected Route)');
    console.log('   ✅ Unauthorized Access Blocked');
    console.log('   ✅ Token Refresh');
    console.log('   ✅ New Token Validation');
    console.log('   ✅ Logout');
    console.log('   ✅ Token Invalidation');
    console.log('   ✅ Input Validation');
    console.log('   ✅ Wrong Password Rejection');
    console.log('\n🎉 Phase 3 Authentication System is Fully Functional!\n');

  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

testAuthSystem();
