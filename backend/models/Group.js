const { pool } = require('../config/database');

class Group {
  // Lấy tất cả nhóm
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM nhom ORDER BY ngay_tao DESC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách nhóm: ${error.message}`);
    }
  }

  // Lấy nhóm theo ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM nhom WHERE id_nhom = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin nhóm: ${error.message}`);
    }
  }

  // Tạo nhóm mới
  static async create(groupData) {
    try {
      const { ten_nhom, mo_ta } = groupData;
      const [result] = await pool.execute(
        'INSERT INTO nhom (ten_nhom, mo_ta) VALUES (?, ?)',
        [ten_nhom, mo_ta]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Lỗi tạo nhóm: ${error.message}`);
    }
  }

  // Cập nhật thông tin nhóm
  static async update(id, groupData) {
    try {
      const { ten_nhom, mo_ta } = groupData;
      const [result] = await pool.execute(
        'UPDATE nhom SET ten_nhom = ?, mo_ta = ? WHERE id_nhom = ?',
        [ten_nhom, mo_ta, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi cập nhật nhóm: ${error.message}`);
    }
  }

  // Xóa nhóm
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM nhom WHERE id_nhom = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi xóa nhóm: ${error.message}`);
    }
  }

  // Lấy danh sách thành viên trong nhóm
  static async getMembers(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT nd.id_nguoi_dung, nd.ten_dang_nhap, nd.ho_ten, nd.email, nd.so_dien_thoai, tvn.ngay_tham_gia
         FROM nguoi_dung nd
         INNER JOIN thanh_vien_nhom tvn ON nd.id_nguoi_dung = tvn.id_nguoi_dung
         WHERE tvn.id_nhom = ?
         ORDER BY tvn.ngay_tham_gia ASC`,
        [id]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách thành viên: ${error.message}`);
    }
  }

  // Thêm thành viên vào nhóm
  static async addMember(groupId, userId) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO thanh_vien_nhom (id_nguoi_dung, id_nhom) VALUES (?, ?)',
        [userId, groupId]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Lỗi thêm thành viên vào nhóm: ${error.message}`);
    }
  }

  // Xóa thành viên khỏi nhóm
  static async removeMember(groupId, userId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM thanh_vien_nhom WHERE id_nguoi_dung = ? AND id_nhom = ?',
        [userId, groupId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi xóa thành viên khỏi nhóm: ${error.message}`);
    }
  }

  // Kiểm tra người dùng có trong nhóm không
  static async isMember(groupId, userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM thanh_vien_nhom WHERE id_nhom = ? AND id_nguoi_dung = ?',
        [groupId, userId]
      );
      return rows[0].count > 0;
    } catch (error) {
      throw new Error(`Lỗi kiểm tra thành viên: ${error.message}`);
    }
  }

  // Lấy số lượng thành viên trong nhóm
  static async getMemberCount(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM thanh_vien_nhom WHERE id_nhom = ?',
        [id]
      );
      return rows[0].count;
    } catch (error) {
      throw new Error(`Lỗi đếm số thành viên: ${error.message}`);
    }
  }
}

module.exports = Group;
