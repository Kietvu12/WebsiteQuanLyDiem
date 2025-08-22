const { pool } = require('../config/database');

class VehicleType {
  // Lấy tất cả loại xe
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM loai_xe ORDER BY ten_loai ASC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách loại xe: ${error.message}`);
    }
  }

  // Lấy loại xe theo ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM loai_xe WHERE id_loai_xe = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin loại xe: ${error.message}`);
    }
  }

  // Tạo loại xe mới
  static async create(vehicleTypeData) {
    try {
      const { ten_loai, so_cho, mo_ta } = vehicleTypeData;
      const [result] = await pool.execute(
        'INSERT INTO loai_xe (ten_loai, so_cho, mo_ta) VALUES (?, ?, ?)',
        [ten_loai, so_cho, mo_ta]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Lỗi tạo loại xe: ${error.message}`);
    }
  }

  // Cập nhật loại xe
  static async update(id, vehicleTypeData) {
    try {
      const { ten_loai, so_cho, mo_ta } = vehicleTypeData;
      const [result] = await pool.execute(
        'UPDATE loai_xe SET ten_loai = ?, so_cho = ?, mo_ta = ? WHERE id_loai_xe = ?',
        [ten_loai, so_cho, mo_ta, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi cập nhật loại xe: ${error.message}`);
    }
  }

  // Xóa loại xe
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM loai_xe WHERE id_loai_xe = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi xóa loại xe: ${error.message}`);
    }
  }
}

module.exports = VehicleType;
