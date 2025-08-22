const axios = require('axios');

async function debugUserTransactions() {
  try {
    console.log('=== DEBUG USER TRANSACTIONS ===');
    
    // 1. Đăng nhập user ID 3
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      ten_dang_nhap: 'nguyenvanA', // Giả sử đây là user ID 3
      mat_khau: 'User@123'
    });
    
    if (!loginResponse.data.success) {
      console.error('❌ User login failed:', loginResponse.data.message);
      return;
    }
    
    const { token, user } = loginResponse.data.data;
    console.log('✅ User login successful');
    console.log('User info:', {
      id: user.id_nguoi_dung,
      username: user.ten_dang_nhap,
      la_admin: user.la_admin,
      la_admin_type: typeof user.la_admin,
      la_admin_truthy: !!user.la_admin
    });
    
    // 2. Test GET /api/users/:id/transactions
    console.log('\n=== TEST GET /api/users/:id/transactions ===');
    console.log('Calling:', `GET /api/users/${user.id_nguoi_dung}/transactions`);
    console.log('User ID from token:', user.id_nguoi_dung);
    console.log('User ID from URL:', user.id_nguoi_dung);
    console.log('Are they equal?', user.id_nguoi_dung === user.id_nguoi_dung);
    
    try {
      const userTransactionsResponse = await axios.get(`http://localhost:5000/api/users/${user.id_nguoi_dung}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ GET /api/users/:id/transactions successful');
      console.log('Response status:', userTransactionsResponse.status);
      console.log('Transaction count:', userTransactionsResponse.data.data?.length || 0);
    } catch (error) {
      console.error('❌ GET /api/users/:id/transactions failed');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Message:', error.response?.data?.message);
    }
    
    // 3. Test với admin
    console.log('\n=== TEST WITH ADMIN ===');
    try {
      const adminLoginResponse = await axios.post('http://localhost:5000/api/users/login', {
        ten_dang_nhap: 'admin',
        mat_khau: 'Admin@123'
      });
      
      if (adminLoginResponse.data.success) {
        const { token: adminToken, user: adminUser } = adminLoginResponse.data.data;
        console.log('✅ Admin login successful');
        console.log('Admin info:', {
          id: adminUser.id_nguoi_dung,
          username: adminUser.ten_dang_nhap,
          la_admin: adminUser.la_admin,
          la_admin_type: typeof adminUser.la_admin,
          la_admin_truthy: !!adminUser.la_admin
        });
        
        // Admin thử xem giao dịch của user khác
        console.log('\n--- Admin viewing other user transactions ---');
        try {
          const adminViewUserTransactions = await axios.get(`http://localhost:5000/api/users/${user.id_nguoi_dung}/transactions`, {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('✅ Admin can view other user transactions');
          console.log('Transaction count:', adminViewUserTransactions.data.data?.length || 0);
        } catch (error) {
          console.error('❌ Admin cannot view other user transactions');
          console.error('Status:', error.response?.status);
          console.error('Message:', error.response?.data?.message);
        }
      }
    } catch (error) {
      console.error('❌ Admin login failed');
    }
    
    // 4. Debug logic
    console.log('\n=== DEBUG LOGIC ===');
    console.log('Logic check: req.user.id_nguoi_dung !== parseInt(id) && !req.user.la_admin');
    console.log('req.user.id_nguoi_dung:', user.id_nguoi_dung);
    console.log('parseInt(id):', parseInt(user.id_nguoi_dung));
    console.log('req.user.id_nguoi_dung !== parseInt(id):', user.id_nguoi_dung !== parseInt(user.id_nguoi_dung));
    console.log('!req.user.la_admin:', !user.la_admin);
    console.log('Final result:', user.id_nguoi_dung !== parseInt(user.id_nguoi_dung) && !user.la_admin);
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

debugUserTransactions();
