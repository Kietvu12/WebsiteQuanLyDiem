const { pool } = require('./config/database');

async function debugQuery() {
  try {
    console.log('=== Debugging Query Logic ===');
    
    const userId = 3;
    
    console.log('1. Checking lich_xe table for user 3...');
    const [lichXeForUser] = await pool.execute(
      'SELECT id_lich_xe, id_nguoi_tao, id_nguoi_nhan, trang_thai FROM lich_xe WHERE id_nguoi_tao = ? OR id_nguoi_nhan = ?',
      [userId, userId]
    );
    console.log('Lich xe for user 3:', lichXeForUser.length);
    lichXeForUser.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, {
        id_lich_xe: row.id_lich_xe,
        id_nguoi_tao: row.id_nguoi_tao,
        id_nguoi_nhan: row.id_nguoi_nhan,
        trang_thai: row.trang_thai
      });
    });
    
    console.log('\n2. Testing the full query with JOINs...');
    const [fullQueryResult] = await pool.execute(
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
    console.log('Full query result:', fullQueryResult.length);
    
    console.log('\n3. Testing getUserUpcomingSchedules logic...');
    const [upcomingResult] = await pool.execute(
      `SELECT DISTINCT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
              nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
       FROM lich_xe lx
       INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
       INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
       INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
       INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
       LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
       WHERE (lx.id_nguoi_tao = ? OR lx.id_nguoi_nhan = ?)
       AND lx.trang_thai = 'cho_xac_nhan'
       AND lx.thoi_gian_bat_dau_don BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 1 HOUR)
       ORDER BY lx.thoi_gian_bat_dau_don ASC`,
      [userId, userId]
    );
    console.log('Upcoming schedules result:', upcomingResult.length);
    
    if (upcomingResult.length === 0) {
      console.log('\n4. Checking why no upcoming schedules...');
      console.log('Current time:', new Date());
      
      // Check schedules with status 'cho_xac_nhan'
      const [choXacNhanSchedules] = await pool.execute(
        'SELECT id_lich_xe, thoi_gian_bat_dau_don, trang_thai FROM lich_xe WHERE trang_thai = "cho_xac_nhan" AND (id_nguoi_tao = ? OR id_nguoi_nhan = ?)',
        [userId, userId]
      );
      console.log('Schedules with status "cho_xac_nhan":', choXacNhanSchedules.length);
      
      choXacNhanSchedules.forEach((row, index) => {
        const pickupTime = new Date(row.thoi_gian_bat_dau_don);
        const now = new Date();
        const diffHours = (pickupTime - now) / (1000 * 60 * 60);
        console.log(`Schedule ${index + 1}: ID=${row.id_lich_xe}, Pickup=${pickupTime}, Diff=${diffHours.toFixed(2)} hours`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}

debugQuery();
