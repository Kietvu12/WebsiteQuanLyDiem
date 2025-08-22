const axios = require('axios');

async function debugAdminAccess() {
  try {
    console.log('=== DEBUG ADMIN ACCESS ===');
    
    // 1. Đăng nhập admin
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      ten_dang_nhap: 'admin',
      mat_khau: 'Admin@123'
    });
    
    if (!loginResponse.data.success) {
      console.error('❌ Admin login failed:', loginResponse.data.message);
      return;
    }
    
    const { token, user } = loginResponse.data.data;
    console.log('✅ Admin login successful');
    console.log('Admin user info:', {
      id: user.id_nguoi_dung,
      username: user.ten_dang_nhap,
      la_admin: user.la_admin,
      la_admin_type: typeof user.la_admin
    });
    
    // 2. Test GET /api/transactions (admin endpoint)
    console.log('\n=== TEST GET /api/transactions (Admin endpoint) ===');
    try {
      const transactionsResponse = await axios.get('http://localhost:5000/api/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ GET /api/transactions successful');
      console.log('Response status:', transactionsResponse.status);
      console.log('Response data:', transactionsResponse.data);
    } catch (error) {
      console.error('❌ GET /api/transactions failed');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Headers:', error.response?.headers);
    }
    
    // 3. Test GET /api/users/:id/transactions (user endpoint)
    console.log('\n=== TEST GET /api/users/:id/transactions (User endpoint) ===');
    try {
      const userTransactionsResponse = await axios.get(`http://localhost:5000/api/users/${user.id_nguoi_dung}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ GET /api/users/:id/transactions successful');
      console.log('Response status:', userTransactionsResponse.status);
      console.log('Response data:', userTransactionsResponse.data);
    } catch (error) {
      console.error('❌ GET /api/users/:id/transactions failed');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
    }
    
    // 4. Test với user thường
    console.log('\n=== TEST WITH REGULAR USER ===');
    try {
      const userLoginResponse = await axios.post('http://localhost:5000/api/users/login', {
        ten_dang_nhap: 'nguyenvanA',
        mat_khau: 'User@123'
      });
      
      if (userLoginResponse.data.success) {
        const { token: userToken, user: regularUser } = userLoginResponse.data.data;
        console.log('✅ Regular user login successful');
        console.log('Regular user info:', {
          id: regularUser.id_nguoi_dung,
          username: regularUser.ten_dang_nhap,
          la_admin: regularUser.la_admin,
          la_admin_type: typeof regularUser.la_admin
        });
        
        // Test admin endpoint với user thường
        console.log('\n--- Test admin endpoint with regular user ---');
        try {
          const adminEndpointResponse = await axios.get('http://localhost:5000/api/transactions', {
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('⚠️ Regular user can access admin endpoint (unexpected)');
        } catch (error) {
          console.log('✅ Regular user correctly blocked from admin endpoint');
          console.log('Status:', error.response?.status);
          console.log('Message:', error.response?.data?.message);
        }
        
        // Test user endpoint với user thường
        console.log('\n--- Test user endpoint with regular user ---');
        try {
          const userEndpointResponse = await axios.get(`http://localhost:5000/api/users/${regularUser.id_nguoi_dung}/transactions`, {
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('✅ Regular user can access own transactions');
          console.log('Transaction count:', userEndpointResponse.data.data?.length || 0);
        } catch (error) {
          console.error('❌ Regular user cannot access own transactions');
          console.error('Status:', error.response?.status);
          console.error('Message:', error.response?.data?.message);
        }
      }
    } catch (error) {
      console.error('❌ Regular user login failed');
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

debugAdminAccess();
