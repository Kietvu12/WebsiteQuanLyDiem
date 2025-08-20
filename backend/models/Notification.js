const { pool } = require('../config/database');

class Notification {
  // Lấy tất cả thông báo
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT tb.*, nd.ho_ten as ten_nguoi_dung, gd.id_giao_dich
         FROM thong_bao tb
         INNER JOIN nguoi_dung nd ON tb.id_nguoi_dung = nd.id_nguoi_dung
         LEFT JOIN giao_dich gd ON tb.id_giao_dich = gd.id_giao_dich
         ORDER BY tb.ngay_tao DESC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách thông báo: ${error.message}`);
    }
  }

  // Lấy thông báo theo ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT tb.*, nd.ho_ten as ten_nguoi_dung, gd.id_giao_dich
         FROM thong_bao tb
         INNER JOIN nguoi_dung nd ON tb.id_nguoi_dung = nd.id_nguoi_dung
         LEFT JOIN giao_dich gd ON tb.id_giao_dich = gd.id_giao_dich
         WHERE tb.id_thong_bao = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin thông báo: ${error.message}`);
    }
  }

  // Lấy thông báo theo người dùng
  static async getByUser(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT tb.*, nd.ho_ten as ten_nguoi_dung, gd.id_giao_dich
         FROM thong_bao tb
         INNER JOIN nguoi_dung nd ON tb.id_nguoi_dung = nd.id_nguoi_dung
         LEFT JOIN giao_dich gd ON tb.id_giao_dich = gd.id_giao_dich
         WHERE tb.id_nguoi_dung = ?
         ORDER BY tb.ngay_tao DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy thông báo theo người dùng: ${error.message}`);
    }
  }

  // Lấy thông báo chưa đọc theo người dùng
  static async getUnreadByUser(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT tb.*, nd.ho_ten as ten_nguoi_dung, gd.id_giao_dich
         FROM thong_bao tb
         INNER JOIN nguoi_dung nd ON tb.id_nguoi_dung = nd.id_nguoi_dung
         LEFT JOIN giao_dich gd ON tb.id_giao_dich = gd.id_giao_dich
         WHERE tb.id_nguoi_dung = ? AND tb.da_doc = FALSE
         ORDER BY tb.ngay_tao DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy thông báo chưa đọc: ${error.message}`);
    }
  }

  // Tạo thông báo mới
  static async create(notificationData) {
    try {
      const { id_nguoi_dung, id_giao_dich, noi_dung } = notificationData;
      const [result] = await pool.execute(
        'INSERT INTO thong_bao (id_nguoi_dung, id_giao_dich, noi_dung) VALUES (?, ?, ?)',
        [id_nguoi_dung, id_giao_dich, noi_dung]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Lỗi tạo thông báo: ${error.message}`);
    }
  }

  // Đánh dấu thông báo đã đọc
  static async markAsRead(id) {
    try {
      const [result] = await pool.execute(
        'UPDATE thong_bao SET da_doc = TRUE WHERE id_thong_bao = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi đánh dấu thông báo đã đọc: ${error.message}`);
    }
  }

  // Đánh dấu tất cả thông báo của người dùng đã đọc
  static async markAllAsRead(userId) {
    try {
      const [result] = await pool.execute(
        'UPDATE thong_bao SET da_doc = TRUE WHERE id_nguoi_dung = ?',
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi đánh dấu tất cả thông báo đã đọc: ${error.message}`);
    }
  }

  // Xóa thông báo
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM thong_bao WHERE id_thong_bao = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi xóa thông báo: ${error.message}`);
    }
  }

  // Xóa tất cả thông báo của người dùng
  static async deleteAllByUser(userId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM thong_bao WHERE id_nguoi_dung = ?',
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi xóa tất cả thông báo: ${error.message}`);
    }
  }

  // Lấy số lượng thông báo chưa đọc
  static async getUnreadCount(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM thong_bao WHERE id_nguoi_dung = ? AND da_doc = FALSE',
        [userId]
      );
      return rows[0].count;
    } catch (error) {
      throw new Error(`Lỗi đếm thông báo chưa đọc: ${error.message}`);
    }
  }

  // Lấy thông báo theo giao dịch
  static async getByTransaction(transactionId) {
    try {
      const [rows] = await pool.execute(
        `SELECT tb.*, nd.ho_ten as ten_nguoi_dung, gd.id_giao_dich
         FROM thong_bao tb
         INNER JOIN nguoi_dung nd ON tb.id_nguoi_dung = nd.id_nguoi_dung
         LEFT JOIN giao_dich gd ON tb.id_giao_dich = gd.id_giao_dich
         WHERE tb.id_giao_dich = ?
         ORDER BY tb.ngay_tao DESC`,
        [transactionId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy thông báo theo giao dịch: ${error.message}`);
    }
  }

  // Lấy thông báo theo ngày
  static async getByDate(date) {
    try {
      const [rows] = await pool.execute(
        `SELECT tb.*, nd.ho_ten as ten_nguoi_dung, gd.id_giao_dich
         FROM thong_bao tb
         INNER JOIN nguoi_dung nd ON tb.id_nguoi_dung = nd.id_nguoi_dung
         LEFT JOIN giao_dich gd ON tb.id_giao_dich = gd.id_giao_dich
         WHERE DATE(tb.ngay_tao) = ?
         ORDER BY tb.ngay_tao DESC`,
        [date]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy thông báo theo ngày: ${error.message}`);
    }
  }
}

module.exports = Notification;
