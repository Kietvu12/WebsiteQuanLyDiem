// Test chi tiết logic tính điểm Room One - WIN [1-1]
// File này để test tất cả các trường hợp tính điểm

import { 
  calculateSchedulePoints, 
  getPointCalculationDetails, 
  validateScheduleData,
  VEHICLE_TYPES,
  ROUTE_TYPES,
  TIME_RANGES
} from './services/pointCalculationService.js';

// Mock data cho các test cases
const testCases = [
  // === TEST LỊCH ĐÓN SÂN BAY (5h00 - 11h59) ===
  {
    category: 'ĐÓN SÂN BAY SÁNG (5h-11h59)',
    tests: [
      {
        name: 'Xe 5 chỗ - 350k (>= 320k)',
        data: {
          so_cho: 5,
          gia_ve: 350000,
          thoi_gian_bat_dau_don: '2024-01-15T08:00:00Z',
          la_don_san_bay: true
        },
        expected: 1.5,
        description: 'Xe 5 chỗ đón sân bay sáng, giá >= 320k → 1.5 điểm'
      },
      {
        name: 'Xe 5 chỗ - 300k (>= 270k)',
        data: {
          so_cho: 5,
          gia_ve: 300000,
          thoi_gian_bat_dau_don: '2024-01-15T09:00:00Z',
          la_don_san_bay: true
        },
        expected: 1.25,
        description: 'Xe 5 chỗ đón sân bay sáng, giá >= 270k → 1.25 điểm'
      },
      {
        name: 'Xe 5 chỗ - 260k (>= 250k)',
        data: {
          so_cho: 5,
          gia_ve: 260000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_don_san_bay: true
        },
        expected: 1.0,
        description: 'Xe 5 chỗ đón sân bay sáng, giá >= 250k → 1.0 điểm'
      },
      {
        name: 'Xe 7 chỗ - 400k (>= 380k)',
        data: {
          so_cho: 7,
          gia_ve: 400000,
          thoi_gian_bat_dau_don: '2024-01-15T07:00:00Z',
          la_don_san_bay: true
        },
        expected: 1.5,
        description: 'Xe 7 chỗ đón sân bay sáng, giá >= 380k → 1.5 điểm'
      },
      {
        name: 'Xe 7 chỗ - 350k (>= 330k)',
        data: {
          so_cho: 7,
          gia_ve: 350000,
          thoi_gian_bat_dau_don: '2024-01-15T08:30:00Z',
          la_don_san_bay: true
        },
        expected: 1.25,
        description: 'Xe 7 chỗ đón sân bay sáng, giá >= 330k → 1.25 điểm'
      }
    ]
  },

  // === TEST LỊCH ĐÓN SÂN BAY (12h00 - 4h59 hôm sau) ===
  {
    category: 'ĐÓN SÂN BAY ĐÊM (12h-4h59)',
    tests: [
      {
        name: 'Xe 5 chỗ - 260k (>= 250k)',
        data: {
          so_cho: 5,
          gia_ve: 260000,
          thoi_gian_bat_dau_don: '2024-01-15T14:00:00Z',
          la_don_san_bay: true
        },
        expected: 1.0,
        description: 'Xe 5 chỗ đón sân bay đêm, giá >= 250k → 1.0 điểm'
      },
      {
        name: 'Xe 7 chỗ - 320k (>= 300k)',
        data: {
          so_cho: 7,
          gia_ve: 320000,
          thoi_gian_bat_dau_don: '2024-01-15T02:00:00Z',
          la_don_san_bay: true
        },
        expected: 1.0,
        description: 'Xe 7 chỗ đón sân bay đêm, giá >= 300k → 1.0 điểm'
      }
    ]
  },

  // === TEST LỊCH TIỄN SÂN BAY (00h - 8h59) ===
  {
    category: 'TIỄN SÂN BAY ĐÊM (00h-8h59)',
    tests: [
      {
        name: 'Xe 4 chỗ - 220k (>= 200k)',
        data: {
          so_cho: 4,
          gia_ve: 220000,
          thoi_gian_bat_dau_tra: '2024-01-15T06:00:00Z',
          la_tien_san_bay: true
        },
        expected: 0.5,
        description: 'Xe 4 chỗ tiễn sân bay đêm, giá >= 200k → 0.5 điểm'
      },
      {
        name: 'Xe 7 chỗ - 250k (>= 220k)',
        data: {
          so_cho: 7,
          gia_ve: 250000,
          thoi_gian_bat_dau_tra: '2024-01-15T07:30:00Z',
          la_tien_san_bay: true
        },
        expected: 0.5,
        description: 'Xe 7 chỗ tiễn sân bay đêm, giá >= 220k → 0.5 điểm'
      }
    ]
  },

  // === TEST LỊCH TIỄN SÂN BAY (9h00 - 23h59) ===
  {
    category: 'TIỄN SÂN BAY NGÀY (9h-23h59)',
    tests: [
      {
        name: 'Xe 4 chỗ - 230k (>= 220k)',
        data: {
          so_cho: 4,
          gia_ve: 230000,
          thoi_gian_bat_dau_tra: '2024-01-15T14:00:00Z',
          la_tien_san_bay: true
        },
        expected: 1.0,
        description: 'Xe 4 chỗ tiễn sân bay ngày, giá >= 220k → 1.0 điểm'
      },
      {
        name: 'Xe 4 chỗ - 210k (>= 200k)',
        data: {
          so_cho: 4,
          gia_ve: 210000,
          thoi_gian_bat_dau_tra: '2024-01-15T15:00:00Z',
          la_tien_san_bay: true
        },
        expected: 0.75,
        description: 'Xe 4 chỗ tiễn sân bay ngày, giá >= 200k → 0.75 điểm'
      },
      {
        name: 'Xe 7 chỗ - 270k (>= 250k)',
        data: {
          so_cho: 7,
          gia_ve: 270000,
          thoi_gian_bat_dau_tra: '2024-01-15T16:00:00Z',
          la_tien_san_bay: true
        },
        expected: 1.0,
        description: 'Xe 7 chỗ tiễn sân bay ngày, giá >= 250k → 1.0 điểm'
      },
      {
        name: 'Xe 7 chỗ - 230k (>= 220k)',
        data: {
          so_cho: 7,
          gia_ve: 230000,
          thoi_gian_bat_dau_tra: '2024-01-15T17:00:00Z',
          la_tien_san_bay: true
        },
        expected: 0.75,
        description: 'Xe 7 chỗ tiễn sân bay ngày, giá >= 220k → 0.75 điểm'
      }
    ]
  },

  // === TEST LỊCH TỈNH/HUYỆN ===
  {
    category: 'LỊCH TỈNH/HUYỆN',
    tests: [
      {
        name: 'Lịch tỉnh 1 chiều - 150k (< 180k)',
        data: {
          so_cho: 7,
          gia_ve: 150000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 0,
        description: 'Lịch tỉnh 1 chiều dưới 180k → 0 điểm'
      },
      {
        name: 'Lịch tỉnh 1 chiều - 250k (180k-300k)',
        data: {
          so_cho: 7,
          gia_ve: 250000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 0.5,
        description: 'Lịch tỉnh 1 chiều 180k-300k → 0.5 điểm'
      },
      {
        name: 'Lịch tỉnh 1 chiều - 500k (300k-600k)',
        data: {
          so_cho: 7,
          gia_ve: 500000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 1.0,
        description: 'Lịch tỉnh 1 chiều 300k-600k → 1.0 điểm'
      },
      {
        name: 'Lịch tỉnh 1 chiều - 800k (700k-900k)',
        data: {
          so_cho: 7,
          gia_ve: 800000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 1.5,
        description: 'Lịch tỉnh 1 chiều 700k-900k → 1.5 điểm'
      },
      {
        name: 'Lịch tỉnh 1 chiều - 1.1M (900k-1.2M)',
        data: {
          so_cho: 7,
          gia_ve: 1100000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 2.0,
        description: 'Lịch tỉnh 1 chiều 900k-1.2M → 2.0 điểm'
      },
      {
        name: 'Lịch tỉnh 1 chiều - 1.3M (1.2M-1.5M)',
        data: {
          so_cho: 7,
          gia_ve: 1300000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 2.5,
        description: 'Lịch tỉnh 1 chiều 1.2M-1.5M → 2.5 điểm'
      },
      {
        name: 'Lịch tỉnh 1 chiều - 1.7M (1.5M-1.9M)',
        data: {
          so_cho: 7,
          gia_ve: 1700000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 3.0,
        description: 'Lịch tỉnh 1 chiều 1.5M-1.9M → 3.0 điểm'
      },
      {
        name: 'Lịch tỉnh 1 chiều - 2M (1.9M-2.1M)',
        data: {
          so_cho: 7,
          gia_ve: 2000000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 3.5,
        description: 'Lịch tỉnh 1 chiều 1.9M-2.1M → 3.5 điểm'
      },
      {
        name: 'Lịch tỉnh 1 chiều - 2.5M (> 2.1M)',
        data: {
          so_cho: 7,
          gia_ve: 2500000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 'manual',
        description: 'Lịch tỉnh 1 chiều trên 2.1M → Tính thủ công'
      }
    ]
  },

  // === TEST LỊCH PHỐ 2 CHIỀU ===
  {
    category: 'LỊCH PHỐ 2 CHIỀU',
    tests: [
      {
        name: 'Lịch phố 2 chiều xe 5 chỗ - 300k (250k-350k)',
        data: {
          so_cho: 5,
          gia_ve: 300000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: true,
          la_lich_pho: true
        },
        expected: 0.5,
        description: 'Lịch phố 2 chiều xe 5 chỗ 250k-350k → 0.5 điểm'
      },
      {
        name: 'Lịch phố 2 chiều xe 5 chỗ - 400k (350k-450k)',
        data: {
          so_cho: 5,
          gia_ve: 400000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: true,
          la_lich_pho: true
        },
        expected: 1.0,
        description: 'Lịch phố 2 chiều xe 5 chỗ 350k-450k → 1.0 điểm'
      },
      {
        name: 'Lịch phố 2 chiều xe 5 chỗ - 600k (450k-800k)',
        data: {
          so_cho: 5,
          gia_ve: 600000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: true,
          la_lich_pho: true
        },
        expected: 1.5,
        description: 'Lịch phố 2 chiều xe 5 chỗ 450k-800k → 1.5 điểm'
      },
      {
        name: 'Lịch phố 2 chiều xe 7 chỗ - 480k (450k-500k)',
        data: {
          so_cho: 7,
          gia_ve: 480000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: true,
          la_lich_pho: true
        },
        expected: 1.0,
        description: 'Lịch phố 2 chiều xe 7 chỗ 450k-500k → 1.0 điểm'
      },
      {
        name: 'Lịch phố 2 chiều xe 7 chỗ - 600k (500k-800k)',
        data: {
          so_cho: 7,
          gia_ve: 600000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: true,
          la_lich_pho: true
        },
        expected: 1.5,
        description: 'Lịch phố 2 chiều xe 7 chỗ 500k-800k → 1.5 điểm'
      }
    ]
  },

  // === TEST XE ĐẶC BIỆT (16, 29, 45 chỗ) ===
  {
    category: 'XE ĐẶC BIỆT (16, 29, 45 chỗ)',
    tests: [
      {
        name: 'Xe 16 chỗ - 1.5M (1.5M-1.9M)',
        data: {
          so_cho: 16,
          gia_ve: 1500000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 3.0,
        description: 'Xe 16 chỗ tính như xe 7 chỗ → 3.0 điểm'
      },
      {
        name: 'Xe 29 chỗ - 2.5M (> 2.1M)',
        data: {
          so_cho: 29,
          gia_ve: 2500000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 'manual',
        description: 'Xe 29 chỗ trên 2.1M → Tính thủ công'
      },
      {
        name: 'Xe 45 chỗ - 1.8M (1.9M-2.1M)',
        data: {
          so_cho: 45,
          gia_ve: 1800000,
          thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z',
          la_khu_hoi: false
        },
        expected: 3.5,
        description: 'Xe 45 chỗ tính như xe 7 chỗ → 3.5 điểm'
      }
    ]
  }
];

// Function test chính
function runAllTests() {
  console.log('🚀 === TEST CHI TIẾT LOGIC TÍNH ĐIỂM ROOM ONE ===\n');
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  testCases.forEach((category, categoryIndex) => {
    console.log(`📋 ${categoryIndex + 1}. ${category.category.toUpperCase()}`);
    console.log('='.repeat(60));
    
    category.tests.forEach((test, testIndex) => {
      totalTests++;
      
      console.log(`\n🔍 Test ${testIndex + 1}: ${test.name}`);
      console.log(`   Mô tả: ${test.description}`);
      
      // Validate dữ liệu trước khi test
      const validation = validateScheduleData(test.data);
      if (!validation.isValid) {
        console.log(`   ❌ Dữ liệu không hợp lệ: ${validation.errors.join(', ')}`);
        failedTests++;
        return;
      }
      
      // Tính điểm
      const result = calculateSchedulePoints(test.data);
      const details = getPointCalculationDetails(test.data);
      
      // Kiểm tra kết quả
      const isPass = result === test.expected;
      if (isPass) {
        passedTests++;
        console.log(`   ✅ PASS: ${result} điểm`);
      } else {
        failedTests++;
        console.log(`   ❌ FAIL: ${result} điểm (mong đợi: ${test.expected} điểm)`);
      }
      
      // Hiển thị chi tiết
      console.log(`   Phương pháp: ${details.calculationMethod}`);
      console.log(`   Ghi chú: ${details.notes.join(', ')}`);
      
      // Hiển thị dữ liệu test
      console.log(`   Dữ liệu: Xe ${test.data.so_cho} chỗ, Giá ${test.data.gia_ve.toLocaleString('vi-VN')} VNĐ`);
      if (test.data.la_don_san_bay) console.log(`   Loại: Đón sân bay`);
      if (test.data.la_tien_san_bay) console.log(`   Loại: Tiễn sân bay`);
      if (test.data.la_khu_hoi) console.log(`   Loại: Khứ hồi`);
      if (test.data.la_lich_pho) console.log(`   Loại: Lịch phố`);
    });
    
    console.log('\n');
  });
  
  // Tóm tắt kết quả
  console.log('📊 === TÓM TẮT KẾT QUẢ ===');
  console.log(`Tổng số test: ${totalTests}`);
  console.log(`✅ PASS: ${passedTests}`);
  console.log(`❌ FAIL: ${failedTests}`);
  console.log(`Tỷ lệ thành công: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 TẤT CẢ TEST ĐỀU THÀNH CÔNG!');
  } else {
    console.log(`\n⚠️ Có ${failedTests} test thất bại, cần kiểm tra lại logic!`);
  }
}

// Test edge cases
function testEdgeCases() {
  console.log('\n🔬 === TEST EDGE CASES ===\n');
  
  const edgeCases = [
    {
      name: 'Giá vé = 0',
      data: {
        so_cho: 7,
        gia_ve: 0,
        thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z'
      },
      expected: 0
    },
    {
      name: 'Giá vé âm',
      data: {
        so_cho: 7,
        gia_ve: -100000,
        thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z'
      },
      expected: 0
    },
    {
      name: 'Số chỗ xe không hợp lệ',
      data: {
        so_cho: 3,
        gia_ve: 500000,
        thoi_gian_bat_dau_don: '2024-01-15T10:00:00Z'
      },
      expected: 0
    },
    {
      name: 'Thiếu thời gian',
      data: {
        so_cho: 7,
        gia_ve: 500000
      },
      expected: 0
    }
  ];
  
  edgeCases.forEach((testCase, index) => {
    console.log(`Edge Case ${index + 1}: ${testCase.name}`);
    const result = calculateSchedulePoints(testCase.data);
    const details = getPointCalculationDetails(testCase.data);
    
    console.log(`   Kết quả: ${result} điểm`);
    console.log(`   Phương pháp: ${details.calculationMethod}`);
    console.log(`   Ghi chú: ${details.notes.join(', ')}`);
    console.log(`   ${result === testCase.expected ? '✅ PASS' : '❌ FAIL'}\n`);
  });
}

// Chạy test
console.log('🚀 Bắt đầu test logic tính điểm Room One...\n');

try {
  runAllTests();
  testEdgeCases();
} catch (error) {
  console.error('❌ Lỗi khi chạy test:', error);
}

console.log('\n🏁 Test hoàn thành!');
