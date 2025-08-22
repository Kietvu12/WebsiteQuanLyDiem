/**
 * Test tích hợp logic tính điểm vào transactionController
 * Kiểm tra việc tự động tính điểm khi tạo giao dịch Giao lịch
 */

const { calculatePointsForGiaoLich } = require('./services/pointCalculationService');

// Mock data cho lịch xe
const mockSchedules = [
  {
    id: 1,
    so_cho: 5,
    gia_ve: 320000,
    thoi_gian_bat_dau_don: '2024-01-15T06:00:00Z',
    la_don_san_bay: true,
    la_tien_san_bay: false,
    la_khu_hoi: false,
    la_lich_pho: false
  },
  {
    id: 2,
    so_cho: 7,
    gia_ve: 450000,
    thoi_gian_bat_dau_don: '2024-01-15T14:00:00Z',
    la_don_san_bay: false,
    la_tien_san_bay: true,
    la_khu_hoi: false,
    la_lich_pho: false
  },
  {
    id: 3,
    so_cho: 5,
    gia_ve: 180000,
    thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
    la_don_san_bay: false,
    la_tien_san_bay: false,
    la_khu_hoi: false,
    la_lich_pho: true
  },
  {
    id: 4,
    so_cho: 7,
    gia_ve: 800000,
    thoi_gian_bat_dau_don: '2024-01-15T12:00:00Z',
    la_don_san_bay: false,
    la_tien_san_bay: false,
    la_khu_hoi: true,
    la_lich_pho: false
  },
  {
    id: 5,
    so_cho: 16,
    gia_ve: 2500000,
    thoi_gian_bat_dau_don: '2024-01-15T08:00:00Z',
    la_don_san_bay: false,
    la_tien_san_bay: false,
    la_khu_hoi: false,
    la_lich_pho: false
  }
];

// Mock VehicleSchedule model
const mockVehicleSchedule = {
  getById: async (id) => {
    const schedule = mockSchedules.find(s => s.id === id);
    return schedule || null;
  }
};

// Mock database connection
const mockDbConnection = {};

// Test function
async function testPointCalculationIntegration() {
  console.log('🧪 === TEST TÍCH HỢP TÍNH ĐIỂM VÀO TRANSACTION CONTROLLER ===\n');

  // Test các trường hợp khác nhau
  const testCases = [
    {
      name: 'Lịch đón sân bay xe 5 chỗ - 320k (5h00-11h59)',
      scheduleId: 1,
      expectedPoints: 1.5
    },
    {
      name: 'Lịch tiễn sân bay xe 7 chỗ - 450k (9h00-23h59)',
      scheduleId: 2,
      expectedPoints: 1.0
    },
    {
      name: 'Lịch phố xe 5 chỗ - 180k (dưới mức tối thiểu)',
      scheduleId: 3,
      expectedPoints: 0
    },
    {
      name: 'Lịch khứ hồi xe 7 chỗ - 800k',
      scheduleId: 4,
      expectedPoints: 1.5
    },
    {
      name: 'Lịch xe 16 chỗ - 2.5 triệu (cần tính thủ công)',
      scheduleId: 5,
      expectedPoints: 'manual'
    }
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`📋 Test: ${testCase.name}`);
    console.log(`   Schedule ID: ${testCase.scheduleId}`);
    
    try {
      // Mock require để trả về mock model
      const originalRequire = require;
      require = function(modulePath) {
        if (modulePath === '../models') {
          return { VehicleSchedule: mockVehicleSchedule };
        }
        return originalRequire(modulePath);
      };

      const result = await calculatePointsForGiaoLich(testCase.scheduleId, mockDbConnection);
      
      // Restore original require
      require = originalRequire;

      console.log(`   Kết quả:`, result);
      
      if (result.success) {
        if (result.points === testCase.expectedPoints) {
          console.log(`   ✅ PASS - Điểm tính được: ${result.points}`);
          passedTests++;
        } else {
          console.log(`   ❌ FAIL - Mong đợi: ${testCase.expectedPoints}, Nhận được: ${result.points}`);
        }
      } else {
        console.log(`   ❌ FAIL - Lỗi: ${result.message}`);
      }
      
    } catch (error) {
      console.log(`   ❌ FAIL - Exception: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }

  // Test summary
  console.log('📊 === KẾT QUẢ TEST ===');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 TẤT CẢ TEST ĐỀU PASS! Logic tính điểm đã được tích hợp thành công.');
  } else {
    console.log('\n⚠️ Có một số test bị fail. Cần kiểm tra lại logic.');
  }
}

// Test transaction creation flow
function testTransactionCreationFlow() {
  console.log('\n🔄 === TEST FLOW TẠO GIAO DỊCH VỚI TÍNH ĐIỂM TỰ ĐỘNG ===\n');

  const testTransactions = [
    {
      name: 'Giao dịch Giao lịch với lịch xe 5 chỗ - 320k',
      id_loai_giao_dich: 1,
      id_lich_xe: 1,
      so_tien: 320000,
      diem: null, // Không có điểm, sẽ tự động tính
      expectedPoints: 1.5
    },
    {
      name: 'Giao dịch Giao lịch với lịch xe 7 chỗ - 450k',
      id_loai_giao_dich: 1,
      id_lich_xe: 2,
      so_tien: 450000,
      diem: null,
      expectedPoints: 1.0
    },
    {
      name: 'Giao dịch Giao lịch với điểm đã có sẵn',
      id_loai_giao_dich: 1,
      id_lich_xe: 3,
      so_tien: 180000,
      diem: 2.5, // Đã có điểm sẵn
      expectedPoints: 2.5
    }
  ];

  console.log('📋 Các trường hợp test:');
  testTransactions.forEach((test, index) => {
    console.log(`   ${index + 1}. ${test.name}`);
    console.log(`      - Loại giao dịch: ${test.id_loai_giao_dich} (Giao lịch)`);
    console.log(`      - Lịch xe: ${test.id_lich_xe}`);
    console.log(`      - Số tiền: ${test.so_tien?.toLocaleString('vi-VN')} VNĐ`);
    console.log(`      - Điểm gốc: ${test.diem || 'null (sẽ tự động tính)'}`);
    console.log(`      - Điểm mong đợi: ${test.expectedPoints}`);
    console.log('');
  });

  console.log('💡 Lưu ý:');
  console.log('   - Khi tạo giao dịch Giao lịch, hệ thống sẽ tự động tính điểm nếu chưa có');
  console.log('   - Nếu lịch xe cần tính thủ công, điểm sẽ được set là null');
  console.log('   - Điểm đã tính sẽ được áp dụng cho cả giao dịch chính và giao dịch đối ứng');
  console.log('   - Thông báo sẽ hiển thị điểm đã tính được');
}

// Run tests
async function runAllTests() {
  try {
    await testPointCalculationIntegration();
    testTransactionCreationFlow();
  } catch (error) {
    console.error('❌ Lỗi khi chạy test:', error);
  }
}

// Export for use in other files
module.exports = {
  testPointCalculationIntegration,
  testTransactionCreationFlow,
  runAllTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}
