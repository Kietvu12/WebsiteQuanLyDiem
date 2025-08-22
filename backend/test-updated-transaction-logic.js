const Transaction = require('./models/Transaction');

async function testUpdatedTransactionLogic() {
  try {
    console.log('=== Test Logic Giao Dịch Đã Cập Nhật ===');
    
    // Test case 1: Tìm giao dịch đối ứng cho Giao lịch (typeId = 1)
    console.log('\n1. Test tìm giao dịch đối ứng cho Giao lịch:');
    try {
      const opposite1 = await Transaction.findOppositeTransaction(1, 2, 1, 1, 1);
      console.log('✅ Kết quả:', opposite1);
    } catch (error) {
      console.log('❌ Lỗi:', error.message);
    }
    
    // Test case 2: Tìm giao dịch đối ứng cho San cho (typeId = 4)
    console.log('\n2. Test tìm giao dịch đối ứng cho San cho:');
    try {
      const opposite2 = await Transaction.findOppositeTransaction(1, 2, 1, 1, 4);
      console.log('✅ Kết quả:', opposite2);
    } catch (error) {
      console.log('❌ Lỗi:', error.message);
    }
    
    // Test case 3: Test với loại giao dịch không hỗ trợ
    console.log('\n3. Test với loại giao dịch không hỗ trợ:');
    try {
      const opposite3 = await Transaction.findOppositeTransaction(1, 2, 1, 1, 3);
      console.log('✅ Kết quả:', opposite3);
    } catch (error) {
      console.log('❌ Lỗi như mong đợi:', error.message);
    }
    
    // Test case 4: Test với loại giao dịch không hỗ trợ khác
    console.log('\n4. Test với loại giao dịch không hỗ trợ khác:');
    try {
      const opposite4 = await Transaction.findOppositeTransaction(1, 2, 1, 1, 6);
      console.log('✅ Kết quả:', opposite4);
    } catch (error) {
      console.log('❌ Lỗi như mong đợi:', error.message);
    }
    
    console.log('\n=== Test hoàn thành ===');
    
  } catch (error) {
    console.error('❌ Lỗi test:', error);
  }
}

// Chạy test
testUpdatedTransactionLogic();
