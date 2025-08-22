const { pool } = require('../config/database');

class RouteType {
  // Lấy tất cả loại tuyến
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM loai_tuyen ORDER BY ten_loai ASC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách loại tuyến: ${error.message}`);
    }
  }

  // Lấy loại tuyến theo ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM loai_tuyen WHERE id_loai_tuyen = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin loại tuyến: ${error.message}`);
    }
  }

  // Tạo loại tuyến mới
  static async create(routeTypeData) {
    try {
      const { ten_loai, la_khu_hoi, mo_ta } = routeTypeData;
      const [result] = await pool.execute(
        'INSERT INTO loai_tuyen (ten_loai, la_khu_hoi, mo_ta) VALUES (?, ?, ?)',
        [ten_loai, la_khu_hoi, mo_ta]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Lỗi tạo loại tuyến: ${error.message}`);
    }
  }

  // Cập nhật loại tuyến
  static async update(id, routeTypeData) {
    try {
      const { ten_loai, la_khu_hoi, mo_ta } = routeTypeData;
      const [result] = await pool.execute(
        'UPDATE loai_tuyen SET ten_loai = ?, la_khu_hoi = ?, mo_ta = ? WHERE id_loai_tuyen = ?',
        [ten_loai, la_khu_hoi, mo_ta, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi cập nhật loại tuyến: ${error.message}`);
    }
  }

  // Xóa loại tuyến
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM loai_tuyen WHERE id_loai_tuyen = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi xóa loại tuyến: ${error.message}`);
    }
  }
}

module.exports = RouteType;
