const { pool } = require('./config/database');

async function testNewLogic() {
  try {
    console.log('=== Testing New VehicleSchedule Logic ===');
    
    const userId = 3;
    
    console.log('1. Testing getUserSchedules (User ID: 3)...');
    console.log('Logic: lx.id_nguoi_tao = ? OR lx.id_nguoi_nhan = ?');
    
    // Test query trực tiếp
    const [rows] = await pool.execute(
      `SELECT DISTINCT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
              nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
       FROM lich_xe lx
       INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
       INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
       INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
       INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
       LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
       WHERE lx.id_nguoi_tao = ? OR lx.id_nguoi_nhan = ?
       ORDER BY lx.ngay_tao DESC`,
      [userId, userId]
    );
    
    console.log('✅ getUserSchedules result:', rows.length, 'schedules');
    
    if (rows.length > 0) {
      console.log('\n📋 Schedule details:');
      rows.forEach((row, index) => {
        console.log(`\nSchedule ${index + 1}:`);
        console.log('- ID:', row.id_lich_xe);
        console.log('- Người tạo:', row.ten_nguoi_tao, '(ID:', row.id_nguoi_tao, ')');
        console.log('- Người nhận (tài xế):', row.ten_nguoi_nhan || 'NULL', '(ID:', row.id_nguoi_nhan || 'NULL', ')');
        console.log('- Trạng thái:', row.trang_thai);
        console.log('- Loại xe:', row.ten_loai_xe);
        console.log('- Loại tuyến:', row.ten_loai_tuyen);
      });
    }
    
    console.log('\n2. Checking current lich_xe table structure...');
    const [lichXeStructure] = await pool.execute('DESCRIBE lich_xe');
    console.log('📊 Current lich_xe columns:');
    lichXeStructure.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    console.log('\n3. Checking if id_nguoi_nhan column exists...');
    const hasIdNguoiNhan = lichXeStructure.some(col => col.Field === 'id_nguoi_nhan');
    if (hasIdNguoiNhan) {
      console.log('✅ Column id_nguoi_nhan already exists!');
      
      // Check current data
      const [currentData] = await pool.execute(
        'SELECT id_lich_xe, id_nguoi_tao, id_nguoi_nhan FROM lich_xe ORDER BY id_lich_xe'
      );
      console.log('\n📊 Current lich_xe data:');
      currentData.forEach(row => {
        console.log(`- ID ${row.id_lich_xe}: người tạo=${row.id_nguoi_tao}, người nhận=${row.id_nguoi_nhan || 'NULL'}`);
      });
    } else {
      console.log('❌ Column id_nguoi_nhan does NOT exist yet');
      console.log('💡 Need to run migration first!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}

testNewLogic();
