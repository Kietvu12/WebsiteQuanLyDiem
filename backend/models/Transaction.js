const { pool } = require('../config/database');

class Transaction {
  // Lấy tất cả giao dịch
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT gd.*, lg.ten_loai as ten_loai_giao_dich, lg.yeu_cau_xac_nhan,
                ng.ho_ten as ten_nguoi_gui, nn.ho_ten as ten_nguoi_nhan,
                n.ten_nhom, lx.id_lich_xe, lx.id_nguoi_nhan as id_nguoi_nhan_lich,
                nguoi_nhan_lich.ho_ten as ten_nguoi_nhan_lich,
                lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                lx.thoi_gian_bat_dau_don, lx.thoi_gian_ket_thuc_don, lx.thoi_gian_bat_dau_tra, lx.thoi_gian_ket_thuc_tra
         FROM giao_dich gd
         INNER JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
         INNER JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
         LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
         INNER JOIN nhom n ON gd.id_nhom = n.id_nhom
         LEFT JOIN lich_xe lx ON gd.id_lich_xe = lx.id_lich_xe
         LEFT JOIN nguoi_dung nguoi_nhan_lich ON lx.id_nguoi_nhan = nguoi_nhan_lich.id_nguoi_dung
         LEFT JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         LEFT JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         ORDER BY gd.ngay_tao DESC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách giao dịch: ${error.message}`);
    }
  }

  // Lấy giao dịch theo ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT gd.*, lg.ten_loai as ten_loai_giao_dich, lg.yeu_cau_xac_nhan,
                ng.ho_ten as ten_nguoi_gui, nn.ho_ten as ten_nguoi_nhan,
                n.ten_nhom, lx.id_lich_xe, lx.id_nguoi_nhan as id_nguoi_nhan_lich,
                nguoi_nhan_lich.ho_ten as ten_nguoi_nhan_lich,
                lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                lx.thoi_gian_bat_dau_don, lx.thoi_gian_ket_thuc_don, lx.thoi_gian_bat_dau_tra, lx.thoi_gian_ket_thuc_tra
         FROM giao_dich gd
         INNER JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
         INNER JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
         LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
         INNER JOIN nhom n ON gd.id_nhom = n.id_nhom
         LEFT JOIN lich_xe lx ON gd.id_lich_xe = lx.id_lich_xe
         LEFT JOIN nguoi_dung nguoi_nhan_lich ON lx.id_nguoi_nhan = nguoi_nhan_lich.id_nguoi_dung
         LEFT JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         LEFT JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         WHERE gd.id_giao_dich = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin giao dịch: ${error.message}`);
    }
  }

  // Lấy giao dịch theo nhóm
  static async getByGroup(groupId) {
    try {
      const [rows] = await pool.execute(
        `SELECT gd.*, lg.ten_loai as ten_loai_giao_dich, lg.yeu_cau_xac_nhan,
                ng.ho_ten as ten_nguoi_gui, nn.ho_ten as ten_nguoi_nhan,
                n.ten_nhom, lx.id_lich_xe, lx.id_nguoi_nhan as id_nguoi_nhan_lich,
                nguoi_nhan_lich.ho_ten as ten_nguoi_nhan_lich,
                lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                lx.thoi_gian_bat_dau_don, lx.thoi_gian_ket_thuc_don, lx.thoi_gian_bat_dau_tra, lx.thoi_gian_ket_thuc_tra
         FROM giao_dich gd
         INNER JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
         INNER JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
         LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
         INNER JOIN nhom n ON gd.id_nhom = n.id_nhom
         LEFT JOIN lich_xe lx ON gd.id_lich_xe = lx.id_lich_xe
         LEFT JOIN nguoi_dung nguoi_nhan_lich ON lx.id_nguoi_nhan = nguoi_nhan_lich.id_nguoi_dung
         LEFT JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         LEFT JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         WHERE gd.id_nhom = ?
         ORDER BY gd.ngay_tao DESC`,
        [groupId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy giao dịch theo nhóm: ${error.message}`);
    }
  }

  // Lấy giao dịch theo người gửi
  static async getBySender(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT gd.*, lg.ten_loai as ten_loai_giao_dich, lg.yeu_cau_xac_nhan,
                ng.ho_ten as ten_nguoi_gui, nn.ho_ten as ten_nguoi_nhan,
                n.ten_nhom, lx.id_lich_xe, lx.id_nguoi_nhan as id_nguoi_nhan_lich,
                nguoi_nhan_lich.ho_ten as ten_nguoi_nhan_lich,
                lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                lx.thoi_gian_bat_dau_don, lx.thoi_gian_ket_thuc_don, lx.thoi_gian_bat_dau_tra, lx.thoi_gian_ket_thuc_tra
         FROM giao_dich gd
         INNER JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
         INNER JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
         LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
         INNER JOIN nhom n ON gd.id_nhom = n.id_nhom
         LEFT JOIN lich_xe lx ON gd.id_lich_xe = lx.id_lich_xe
         LEFT JOIN nguoi_dung nguoi_nhan_lich ON lx.id_nguoi_nhan = nguoi_nhan_lich.id_nguoi_dung
         LEFT JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         LEFT JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         WHERE gd.id_nguoi_gui = ?
         ORDER BY gd.ngay_tao DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy giao dịch theo người gửi: ${error.message}`);
    }
  }

  // Lấy giao dịch theo người nhận
  static async getByReceiver(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT gd.*, lg.ten_loai as ten_loai_giao_dich, lg.yeu_cau_xac_nhan,
                ng.ho_ten as ten_nguoi_gui, nn.ho_ten as ten_nguoi_nhan,
                n.ten_nhom, lx.id_lich_xe, lx.id_nguoi_nhan as id_nguoi_nhan_lich,
                nguoi_nhan_lich.ho_ten as ten_nguoi_nhan_lich,
                lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                lx.thoi_gian_bat_dau_don, lx.thoi_gian_ket_thuc_don, lx.thoi_gian_bat_dau_tra, lx.thoi_gian_ket_thuc_tra
         FROM giao_dich gd
         INNER JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
         INNER JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
         LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
         INNER JOIN nhom n ON gd.id_nhom = n.id_nhom
         LEFT JOIN lich_xe lx ON gd.id_lich_xe = lx.id_lich_xe
         LEFT JOIN nguoi_dung nguoi_nhan_lich ON lx.id_nguoi_nhan = nguoi_nhan_lich.id_nguoi_dung
         LEFT JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         LEFT JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         WHERE gd.id_nguoi_nhan = ?
         ORDER BY gd.ngay_tao DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy giao dịch theo người nhận: ${error.message}`);
    }
  }

  // Lấy giao dịch theo trạng thái
  static async getByStatus(status) {
    try {
      const [rows] = await pool.execute(
        `SELECT gd.*, lg.ten_loai as ten_loai_giao_dich, lg.yeu_cau_xac_nhan,
                ng.ho_ten as ten_nguoi_gui, nn.ho_ten as ten_nguoi_nhan,
                n.ten_nhom, lx.id_lich_xe, lx.id_nguoi_nhan as id_nguoi_nhan_lich,
                nguoi_nhan_lich.ho_ten as ten_nguoi_nhan_lich,
                lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                lx.thoi_gian_bat_dau_don, lx.thoi_gian_ket_thuc_don, lx.thoi_gian_bat_dau_tra, lx.thoi_gian_ket_thuc_tra
         FROM giao_dich gd
         INNER JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
         INNER JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
         LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
         INNER JOIN nhom n ON gd.id_nhom = n.id_nhom
         LEFT JOIN lich_xe lx ON gd.id_lich_xe = lx.id_lich_xe
         LEFT JOIN nguoi_dung nguoi_nhan_lich ON lx.id_nguoi_nhan = nguoi_nhan_lich.id_nguoi_dung
         LEFT JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         LEFT JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         WHERE gd.trang_thai = ?
         ORDER BY gd.ngay_tao DESC`,
        [status]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy giao dịch theo trạng thái: ${error.message}`);
    }
  }

  // Tạo giao dịch mới
  static async create(transactionData) {
    try {
      const {
        id_loai_giao_dich,
        id_nguoi_gui,
        id_nguoi_nhan,
        id_nhom,
        id_lich_xe,
        so_tien,
        diem,
        noi_dung,
        trang_thai = 'cho_xac_nhan'
      } = transactionData;

      const [result] = await pool.execute(
        `INSERT INTO giao_dich (id_loai_giao_dich, id_nguoi_gui, id_nguoi_nhan, id_nhom, id_lich_xe, so_tien, diem, noi_dung, trang_thai) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_loai_giao_dich, id_nguoi_gui, id_nguoi_nhan, id_nhom, id_lich_xe, so_tien, diem, noi_dung, trang_thai]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Lỗi tạo giao dịch: ${error.message}`);
    }
  }

  // Cập nhật trạng thái giao dịch
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE giao_dich SET trang_thai = ?, ngay_hoan_thanh = CURRENT_TIMESTAMP WHERE id_giao_dich = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi cập nhật trạng thái giao dịch: ${error.message}`);
    }
  }

  // Xóa giao dịch
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM giao_dich WHERE id_giao_dich = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi xóa giao dịch: ${error.message}`);
    }
  }

  // Lấy giao dịch theo loại
  static async getByType(typeId) {
    try {
      const [rows] = await pool.execute(
        `SELECT gd.*, lg.ten_loai as ten_loai_giao_dich, lg.yeu_cau_xac_nhan,
                ng.ho_ten as ten_nguoi_gui, nn.ho_ten as ten_nguoi_nhan,
                n.ten_nhom, lx.id_lich_xe, lx.id_nguoi_nhan as id_nguoi_nhan_lich,
                nguoi_nhan_lich.ho_ten as ten_nguoi_nhan_lich,
                lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                lx.thoi_gian_bat_dau_don, lx.thoi_gian_ket_thuc_don, lx.thoi_gian_bat_dau_tra, lx.thoi_gian_ket_thuc_tra
         FROM giao_dich gd
         INNER JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
         INNER JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
         LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
         INNER JOIN nhom n ON gd.id_nhom = n.id_nhom
         LEFT JOIN lich_xe lx ON gd.id_lich_xe = lx.id_lich_xe
         LEFT JOIN nguoi_dung nguoi_nhan_lich ON lx.id_nguoi_nhan = nguoi_nhan_lich.id_nguoi_dung
         LEFT JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         LEFT JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         WHERE gd.id_loai_giao_dich = ?
         ORDER BY gd.ngay_tao DESC`,
        [typeId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy giao dịch theo loại: ${error.message}`);
    }
  }

  // Lấy giao dịch theo ngày
  static async getByDate(date) {
    try {
      const [rows] = await pool.execute(
        `SELECT gd.*, lg.ten_loai as ten_loai_giao_dich, lg.yeu_cau_xac_nhan,
                ng.ho_ten as ten_nguoi_gui, nn.ho_ten as ten_nguoi_nhan,
                n.ten_nhom, lx.id_lich_xe, lx.id_nguoi_nhan as id_nguoi_nhan_lich,
                nguoi_nhan_lich.ho_ten as ten_nguoi_nhan_lich,
                lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                lx.thoi_gian_bat_dau_don, lx.thoi_gian_ket_thuc_don, lx.thoi_gian_bat_dau_tra, lx.thoi_gian_ket_thuc_tra
         FROM giao_dich gd
         INNER JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
         INNER JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
         LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
         INNER JOIN nhom n ON gd.id_nhom = n.id_nhom
         LEFT JOIN lich_xe lx ON gd.id_lich_xe = lx.id_lich_xe
         LEFT JOIN nguoi_dung nguoi_nhan_lich ON lx.id_nguoi_nhan = nguoi_nhan_lich.id_nguoi_dung
         LEFT JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         LEFT JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         WHERE DATE(gd.ngay_tao) = ?
         ORDER BY gd.ngay_tao DESC`,
        [date]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy giao dịch theo ngày: ${error.message}`);
    }
  }

  // Tìm giao dịch đối ứng (opposite transaction)
  static async findOppositeTransaction(senderId, receiverId, groupId, scheduleId, typeId) {
    try {
      // Xác định loại giao dịch đối ứng
      let oppositeTypeId;
      if (typeId === 1) { // Giao lịch
        oppositeTypeId = 2; // Nhận lịch
      } else if (typeId === 4) { // San cho
        oppositeTypeId = 5; // Nhận san
      } else {
        throw new Error('Loại giao dịch không hỗ trợ tìm đối ứng');
      }

      const [rows] = await pool.execute(
        `SELECT * FROM giao_dich 
         WHERE id_nguoi_gui = ? 
         AND id_nguoi_nhan = ? 
         AND id_nhom = ? 
         AND id_lich_xe = ? 
         AND id_loai_giao_dich = ?
         AND trang_thai = 'cho_xac_nhan'
         ORDER BY ngay_tao DESC 
         LIMIT 1`,
        [receiverId, senderId, groupId, scheduleId, oppositeTypeId]
      );
      
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi tìm giao dịch đối ứng: ${error.message}`);
    }
  }

  // Lấy giao dịch theo lịch xe
  static async getByScheduleId(scheduleId) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM giao_dich 
         WHERE id_lich_xe = ?
         ORDER BY ngay_tao DESC`,
        [scheduleId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy giao dịch theo lịch xe: ${error.message}`);
    }
  }

  // Lấy giao dịch theo lịch xe và loại giao dịch cụ thể
  static async findByScheduleIdAndType(scheduleId, loaiGiaoDichId) {
    try {
      const [rows] = await pool.execute(
        `SELECT gd.*, lg.ten_loai as ten_loai_giao_dich, lg.yeu_cau_xac_nhan,
                ng.ho_ten as ten_nguoi_gui, ng.so_du as so_du_nguoi_gui, ng.diem as diem_nguoi_gui,
                nn.ho_ten as ten_nguoi_nhan, nn.so_du as so_du_nguoi_nhan, nn.diem as diem_nguoi_nhan,
                n.ten_nhom, lx.id_lich_xe
         FROM giao_dich gd
         INNER JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
         INNER JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
         LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
         INNER JOIN nhom n ON gd.id_nhom = n.id_nhom
         LEFT JOIN lich_xe lx ON gd.id_lich_xe = lx.id_lich_xe
         WHERE gd.id_lich_xe = ? AND gd.id_loai_giao_dich = ?
         ORDER BY gd.ngay_tao DESC`,
        [scheduleId, loaiGiaoDichId]
      );
      
      if (rows.length > 0) {
        const transaction = rows[0];
        // Thêm thông tin người gửi và người nhận
        transaction.nguoi_gui = {
          id_nguoi_dung: transaction.id_nguoi_gui,
          ho_ten: transaction.ten_nguoi_gui,
          so_du: transaction.so_du_nguoi_gui,
          diem: transaction.diem_nguoi_gui
        };
        transaction.nguoi_nhan = {
          id_nguoi_dung: transaction.id_nguoi_nhan,
          ho_ten: transaction.ten_nguoi_nhan,
          so_du: transaction.so_du_nguoi_nhan,
          diem: transaction.diem_nguoi_nhan
        };
        return transaction;
      }
      
      return null;
    } catch (error) {
      throw new Error(`Lỗi lấy giao dịch theo lịch xe và loại: ${error.message}`);
    }
  }
}

module.exports = Transaction;
