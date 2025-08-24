const { pool } = require('../config/database');

class VehicleSchedule {
  // Lấy tất cả lịch xe (cho admin)
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
         ORDER BY lx.ngay_tao DESC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách lịch xe: ${error.message}`);
    }
  }

  // Lấy tất cả lịch xe của user (cả giao và nhận)
  static async getUserSchedules(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT DISTINCT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
         WHERE lx.id_nguoi_tao = ? OR lx.id_nguoi_nhan = ? -- Lịch xe mà user tạo HOẶC là tài xế (người nhận)
         ORDER BY lx.ngay_tao DESC`,
        [userId, userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe của người dùng: ${error.message}`);
    }
  }

  // Lấy lịch xe theo ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
         WHERE lx.id_lich_xe = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe: ${error.message}`);
    }
  }

  // Lấy lịch xe theo nhóm
  static async getByGroup(groupId) {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
         WHERE lx.id_nhom = ?
         ORDER BY lx.ngay_tao DESC`,
        [groupId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe theo nhóm: ${error.message}`);
    }
  }

  // Lấy lịch xe theo người tạo
  static async getByCreator(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
         WHERE lx.id_nguoi_tao = ?
         ORDER BY lx.ngay_tao DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe theo người tạo: ${error.message}`);
    }
  }

  // Lấy lịch xe theo trạng thái
  static async getByStatus(status) {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
         WHERE lx.trang_thai = ?
         ORDER BY lx.ngay_tao DESC`,
        [status]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe theo trạng thái: ${error.message}`);
    }
  }

  // Lấy lịch xe theo ngày
  static async getByDate(date) {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
         WHERE DATE(lx.ngay_tao) = ?
         ORDER BY lx.ngay_tao DESC`,
        [date]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe theo ngày: ${error.message}`);
    }
  }

  // Tạo lịch xe mới
  static async create(scheduleData) {
    try {
      const {
        id_loai_xe,
        id_loai_tuyen,
        thoi_gian_bat_dau_don,
        thoi_gian_ket_thuc_don,
        thoi_gian_bat_dau_tra,
        thoi_gian_ket_thuc_tra,
        id_nguoi_tao,
        id_nhom,
        id_nguoi_nhan
      } = scheduleData;

      console.log('=== VehicleSchedule.create Debug ===');
      console.log('Schedule data received:', scheduleData);
      console.log('id_nguoi_nhan:', id_nguoi_nhan);
      console.log('id_nguoi_nhan type:', typeof id_nguoi_nhan);

      const [result] = await pool.execute(
        `INSERT INTO lich_xe (id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don,
                              thoi_gian_bat_dau_tra, thoi_gian_ket_thuc_tra, id_nguoi_tao, id_nhom, id_nguoi_nhan) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don,
         thoi_gian_bat_dau_tra, thoi_gian_ket_thuc_tra, id_nguoi_tao, id_nhom, id_nguoi_nhan]
      );

      console.log('✅ Lịch xe được tạo với ID:', result.insertId);
      console.log('✅ id_nguoi_nhan đã được lưu:', id_nguoi_nhan);

      return { id: result.insertId, ...scheduleData };
    } catch (error) {
      console.error('❌ Lỗi khi tạo lịch xe:', error);
      throw new Error(`Lỗi tạo lịch xe: ${error.message}`);
    }
  }

  // Cập nhật lịch xe
  static async update(id, scheduleData) {
    try {
      const {
        id_loai_xe,
        id_loai_tuyen,
        thoi_gian_bat_dau_don,
        thoi_gian_ket_thuc_don,
        thoi_gian_bat_dau_tra,
        thoi_gian_ket_thuc_tra,
        id_nhom
      } = scheduleData;

      const [result] = await pool.execute(
        `UPDATE lich_xe 
         SET id_loai_xe = ?, id_loai_tuyen = ?, thoi_gian_bat_dau_don = ?, thoi_gian_ket_thuc_don = ?,
         thoi_gian_bat_dau_tra = ?, thoi_gian_ket_thuc_tra = ?, id_nhom = ?
         WHERE id_lich_xe = ?`,
        [id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don,
         thoi_gian_bat_dau_tra, thoi_gian_ket_thuc_tra, id_nhom, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Không tìm thấy lịch xe để cập nhật');
      }

      return { id, ...scheduleData };
    } catch (error) {
      throw new Error(`Lỗi cập nhật lịch xe: ${error.message}`);
    }
  }

  // Cập nhật trạng thái lịch xe
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE lich_xe SET trang_thai = ? WHERE id_lich_xe = ?',
        [status, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Không tìm thấy lịch xe để cập nhật trạng thái');
      }

      return true;
    } catch (error) {
      throw new Error(`Lỗi cập nhật trạng thái lịch xe: ${error.message}`);
    }
  }

  // Xóa lịch xe
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM lich_xe WHERE id_lich_xe = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Không tìm thấy lịch xe để xóa');
      }

      return true;
    } catch (error) {
      throw new Error(`Lỗi xóa lịch xe: ${error.message}`);
    }
  }

  // Lấy tất cả loại xe
  static async getVehicleTypes() {
    try {
      const [rows] = await pool.execute('SELECT * FROM loai_xe ORDER BY so_cho ASC');
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy loại xe: ${error.message}`);
    }
  }

  // Lấy tất cả loại tuyến
  static async getRouteTypes() {
    try {
      const [rows] = await pool.execute('SELECT * FROM loai_tuyen ORDER BY ten_loai ASC');
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy loại tuyến: ${error.message}`);
    }
  }

  // Tự động hoàn thành lịch xe (sau 2 tiếng từ giờ đón khách)
  static async autoCompleteSchedules() {
    try {
      const [result] = await pool.execute(
        `UPDATE lich_xe 
         SET trang_thai = 'hoan_thanh' 
         WHERE trang_thai IN ('cho_xac_nhan', 'da_xac_nhan') 
         AND thoi_gian_bat_dau_don < DATE_SUB(NOW(), INTERVAL 2 HOUR)`
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Lỗi tự động hoàn thành lịch xe: ${error.message}`);
    }
  }

  // Lấy lịch xe sắp tới (trong 1 tiếng tới) - cho admin
  static async getUpcomingSchedules() {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
         WHERE lx.trang_thai = 'cho_xac_nhan'
         AND lx.thoi_gian_bat_dau_don BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 1 HOUR)
         ORDER BY lx.thoi_gian_bat_dau_don ASC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe sắp tới: ${error.message}`);
    }
  }

  // Lấy lịch xe sắp tới của user (trong 1 tiếng tới) - cả giao và nhận
  static async getUserUpcomingSchedules(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT DISTINCT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
         WHERE (lx.id_nguoi_tao = ? OR lx.id_nguoi_nhan = ?) -- Lịch xe mà user tạo HOẶC là tài xế (người nhận)
         AND lx.trang_thai = 'cho_xac_nhan'
         AND lx.thoi_gian_bat_dau_don BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 1 HOUR)
         ORDER BY lx.thoi_gian_bat_dau_don ASC`,
        [userId, userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe sắp tới của người dùng: ${error.message}`);
    }
  }

  // Lấy lịch xe đã hoàn thành (sau 2 tiếng từ giờ đón khách) - cho admin
  static async getCompletedSchedules() {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
         WHERE lx.trang_thai = 'hoan_thanh'
         ORDER BY lx.thoi_gian_bat_dau_don DESC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe đã hoàn thành: ${error.message}`);
    }
  }

  // Lấy lịch xe đã hoàn thành của user (sau 2 tiếng từ giờ đón khách) - cả giao và nhận
  static async getUserCompletedSchedules(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT DISTINCT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom, nn.ho_ten as ten_nguoi_nhan
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
         WHERE (lx.id_nguoi_tao = ? OR lx.id_nguoi_nhan = ?) -- Lịch xe mà user tạo HOẶC là tài xế (người nhận)
         AND lx.trang_thai = 'hoan_thanh'
         ORDER BY lx.thoi_gian_bat_dau_don DESC`,
        [userId, userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe đã hoàn thành của người dùng: ${error.message}`);
    }
  }

  // Hủy lịch xe
  static async cancelSchedule(id, userId) {
    try {
      // Kiểm tra quyền hủy lịch xe
      const [checkResult] = await pool.execute(
        'SELECT * FROM lich_xe WHERE id_lich_xe = ? AND (id_nguoi_tao = ? OR id_nguoi_nhan = ? OR ? IN (SELECT id_nguoi_dung FROM nguoi_dung WHERE la_admin = TRUE))',
        [id, userId, userId, userId]
      );

      if (checkResult.length === 0) {
        throw new Error('Không thể hủy lịch xe - bạn không có quyền hoặc lịch xe không tồn tại');
      }

      const schedule = checkResult[0];
      
      // Cập nhật trạng thái lịch xe thành 'da_huy'
      const [updateResult] = await pool.execute(
        'UPDATE lich_xe SET trang_thai = ? WHERE id_lich_xe = ?',
        ['da_huy', id]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error('Không thể cập nhật trạng thái lịch xe');
      }

      // Trả về thông tin lịch xe để xử lý hoàn tiền/điểm ở controller
      return {
        success: true,
        schedule: schedule
      };
    } catch (error) {
      throw new Error(`Lỗi hủy lịch xe: ${error.message}`);
    }
  }


}

module.exports = VehicleSchedule;