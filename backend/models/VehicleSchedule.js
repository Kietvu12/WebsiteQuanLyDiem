const { pool } = require('../config/database');

class VehicleSchedule {
  // Lấy tất cả lịch xe
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         ORDER BY lx.ngay_tao DESC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách lịch xe: ${error.message}`);
    }
  }

  // Lấy lịch xe theo ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         WHERE lx.id_lich_xe = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin lịch xe: ${error.message}`);
    }
  }

  // Lấy lịch xe theo nhóm
  static async getByGroup(groupId) {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
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
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
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
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         WHERE lx.trang_thai = ?
         ORDER BY lx.ngay_tao DESC`,
        [status]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe theo trạng thái: ${error.message}`);
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
        id_nhom
      } = scheduleData;

      const [result] = await pool.execute(
        `INSERT INTO lich_xe (id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don, 
                              thoi_gian_bat_dau_tra, thoi_gian_ket_thuc_tra, id_nguoi_tao, id_nhom) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don, 
         thoi_gian_bat_dau_tra, thoi_gian_ket_thuc_tra, id_nguoi_tao, id_nhom]
      );
      return result.insertId;
    } catch (error) {
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
        `UPDATE lich_xe SET 
         id_loai_xe = ?, id_loai_tuyen = ?, thoi_gian_bat_dau_don = ?, thoi_gian_ket_thuc_don = ?,
         thoi_gian_bat_dau_tra = ?, thoi_gian_ket_thuc_tra = ?, id_nhom = ?
         WHERE id_lich_xe = ?`,
        [id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don,
         thoi_gian_bat_dau_tra, thoi_gian_ket_thuc_tra, id_nhom, id]
      );
      return result.affectedRows > 0;
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
      return result.affectedRows > 0;
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
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi xóa lịch xe: ${error.message}`);
    }
  }

  // Lấy lịch xe theo ngày
  static async getByDate(date) {
    try {
      const [rows] = await pool.execute(
        `SELECT lx.*, lxe.ten_loai as ten_loai_xe, lxe.so_cho, lt.ten_loai as ten_loai_tuyen, lt.la_khu_hoi,
                nd.ho_ten as ten_nguoi_tao, n.ten_nhom
         FROM lich_xe lx
         INNER JOIN loai_xe lxe ON lx.id_loai_xe = lxe.id_loai_xe
         INNER JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
         INNER JOIN nguoi_dung nd ON lx.id_nguoi_tao = nd.id_nguoi_dung
         INNER JOIN nhom n ON lx.id_nhom = n.id_nhom
         WHERE DATE(lx.ngay_tao) = ?
         ORDER BY lx.thoi_gian_bat_dau_don ASC`,
        [date]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch xe theo ngày: ${error.message}`);
    }
  }
}

module.exports = VehicleSchedule;
