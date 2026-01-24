const axios = require('axios');

const testRegister = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      email: 'newuser@example.com',
      password: 'Test123456',
      fullName: 'Test User',
      phoneNumber: '01234567890',
      role: 'User'
    });
    
    console.log('✅ Registration successful!');
    console.log('User:', response.data.data.user);
    console.log('Access Token:', response.data.data.accessToken.substring(0, 20) + '...');
  } catch (error) {
    console.error('❌ Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Errors:', JSON.stringify(error.response?.data?.errors, null, 2));
  }
};

testRegister();
