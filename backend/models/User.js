const { pool } = require('../config/database');

class User {
  // Lấy tất cả người dùng
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id_nguoi_dung, ten_dang_nhap, email, ho_ten, so_dien_thoai, dia_chi, so_du, diem, la_admin, ngay_tao FROM nguoi_dung ORDER BY ngay_tao DESC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách người dùng: ${error.message}`);
    }
  }

  // Lấy người dùng theo ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id_nguoi_dung, ten_dang_nhap, email, ho_ten, so_dien_thoai, dia_chi, so_du, diem, la_admin, ngay_tao FROM nguoi_dung WHERE id_nguoi_dung = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin người dùng: ${error.message}`);
    }
  }

  // Lấy người dùng theo tên đăng nhập
  static async getByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM nguoi_dung WHERE ten_dang_nhap = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin người dùng: ${error.message}`);
    }
  }

  // Lấy người dùng theo email
  static async getByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM nguoi_dung WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin người dùng: ${error.message}`);
    }
  }

  // Tạo người dùng mới
  static async create(userData) {
    try {
      const { ten_dang_nhap, mat_khau_hash, email, ho_ten, so_dien_thoai, dia_chi } = userData;
      const [result] = await pool.execute(
        'INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, email, ho_ten, so_dien_thoai, dia_chi) VALUES (?, ?, ?, ?, ?, ?)',
        [ten_dang_nhap, mat_khau_hash, email, ho_ten, so_dien_thoai, dia_chi]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Lỗi tạo người dùng: ${error.message}`);
    }
  }

  // Cập nhật thông tin người dùng
  static async update(id, userData) {
    try {
      const { ho_ten, so_dien_thoai, dia_chi } = userData;
      const [result] = await pool.execute(
        'UPDATE nguoi_dung SET ho_ten = ?, so_dien_thoai = ?, dia_chi = ? WHERE id_nguoi_dung = ?',
        [ho_ten, so_dien_thoai, dia_chi, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi cập nhật người dùng: ${error.message}`);
    }
  }

  // Cập nhật mật khẩu
  static async updatePassword(id, newPasswordHash) {
    try {
      const [result] = await pool.execute(
        'UPDATE nguoi_dung SET mat_khau_hash = ? WHERE id_nguoi_dung = ?',
        [newPasswordHash, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi cập nhật mật khẩu: ${error.message}`);
    }
  }

  // Cập nhật số dư và điểm
  static async updateBalanceAndPoints(id, so_du, diem) {
    try {
      const [result] = await pool.execute(
        'UPDATE nguoi_dung SET so_du = ?, diem = ? WHERE id_nguoi_dung = ?',
        [so_du, diem, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi cập nhật số dư và điểm: ${error.message}`);
    }
  }

  // Xóa người dùng
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM nguoi_dung WHERE id_nguoi_dung = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi xóa người dùng: ${error.message}`);
    }
  }

  // Lấy danh sách nhóm của người dùng
  static async getGroups(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT n.* FROM nhom n 
         INNER JOIN thanh_vien_nhom tvn ON n.id_nhom = tvn.id_nhom 
         WHERE tvn.id_nguoi_dung = ?`,
        [id]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách nhóm: ${error.message}`);
    }
  }
}

module.exports = User;
