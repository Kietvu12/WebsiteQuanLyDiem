const { pool } = require('../config/database');

class Report {
  // Lấy tất cả báo cáo
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT bc.*, n.ten_nhom
         FROM bao_cao bc
         LEFT JOIN nhom n ON bc.id_nhom = n.id_nhom
         ORDER BY bc.ngay_tao_bao_cao DESC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách báo cáo: ${error.message}`);
    }
  }

  // Lấy báo cáo theo ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT bc.*, n.ten_nhom
         FROM bao_cao bc
         LEFT JOIN nhom n ON bc.id_nhom = n.id_nhom
         WHERE bc.id_bao_cao = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin báo cáo: ${error.message}`);
    }
  }

  // Lấy báo cáo theo nhóm
  static async getByGroup(groupId) {
    try {
      const [rows] = await pool.execute(
        `SELECT bc.*, n.ten_nhom
         FROM bao_cao bc
         LEFT JOIN nhom n ON bc.id_nhom = n.id_nhom
         WHERE bc.id_nhom = ?
         ORDER BY bc.ngay_tao_bao_cao DESC`,
        [groupId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy báo cáo theo nhóm: ${error.message}`);
    }
  }

  // Tạo báo cáo mới
  static async create(reportData) {
    try {
      const { id_nhom, ngay_bao_cao, duong_dan_file } = reportData;
      const [result] = await pool.execute(
        'INSERT INTO bao_cao (id_nhom, ngay_bao_cao, duong_dan_file) VALUES (?, ?, ?)',
        [id_nhom, ngay_bao_cao, duong_dan_file]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Lỗi tạo báo cáo: ${error.message}`);
    }
  }

  // Cập nhật báo cáo
  static async update(id, reportData) {
    try {
      const { id_nhom, ngay_bao_cao, duong_dan_file } = reportData;
      const [result] = await pool.execute(
        'UPDATE bao_cao SET id_nhom = ?, ngay_bao_cao = ?, duong_dan_file = ? WHERE id_bao_cao = ?',
        [id_nhom, ngay_bao_cao, duong_dan_file, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi cập nhật báo cáo: ${error.message}`);
    }
  }

  // Xóa báo cáo
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM bao_cao WHERE id_bao_cao = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi xóa báo cáo: ${error.message}`);
    }
  }

  // Lấy báo cáo theo ngày
  static async getByDate(date) {
    try {
      const [rows] = await pool.execute(
        `SELECT bc.*, n.ten_nhom
         FROM bao_cao bc
         LEFT JOIN nhom n ON bc.id_nhom = n.id_nhom
         WHERE bc.ngay_bao_cao = ?
         ORDER BY bc.ngay_tao_bao_cao DESC`,
        [date]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy báo cáo theo ngày: ${error.message}`);
    }
  }

  // Lấy báo cáo theo khoảng thời gian
  static async getByDateRange(startDate, endDate) {
    try {
      const [rows] = await pool.execute(
        `SELECT bc.*, n.ten_nhom
         FROM bao_cao bc
         LEFT JOIN nhom n ON bc.id_nhom = n.id_nhom
         WHERE bc.ngay_bao_cao BETWEEN ? AND ?
         ORDER BY bc.ngay_tao_bao_cao DESC`,
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy báo cáo theo khoảng thời gian: ${error.message}`);
    }
  }

  // Lấy báo cáo theo tháng
  static async getByMonth(year, month) {
    try {
      const [rows] = await pool.execute(
        `SELECT bc.*, n.ten_nhom
         FROM bao_cao bc
         LEFT JOIN nhom n ON bc.id_nhom = n.id_nhom
         WHERE YEAR(bc.ngay_bao_cao) = ? AND MONTH(bc.ngay_bao_cao) = ?
         ORDER BY bc.ngay_tao_bao_cao DESC`,
        [year, month]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy báo cáo theo tháng: ${error.message}`);
    }
  }

  // Lấy báo cáo theo năm
  static async getByYear(year) {
    try {
      const [rows] = await pool.execute(
        `SELECT bc.*, n.ten_nhom
         FROM bao_cao bc
         LEFT JOIN nhom n ON bc.id_nhom = n.id_nhom
         WHERE YEAR(bc.ngay_bao_cao) = ?
         ORDER BY bc.ngay_tao_bao_cao DESC`,
        [year]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy báo cáo theo năm: ${error.message}`);
    }
  }

  // Lấy số lượng báo cáo theo nhóm
  static async getCountByGroup(groupId) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM bao_cao WHERE id_nhom = ?',
        [groupId]
      );
      return rows[0].count;
    } catch (error) {
      throw new Error(`Lỗi đếm số báo cáo theo nhóm: ${error.message}`);
    }
  }

  // Lấy báo cáo mới nhất theo nhóm
  static async getLatestByGroup(groupId) {
    try {
      const [rows] = await pool.execute(
        `SELECT bc.*, n.ten_nhom
         FROM bao_cao bc
         LEFT JOIN nhom n ON bc.id_nhom = n.id_nhom
         WHERE bc.id_nhom = ?
         ORDER BY bc.ngay_tao_bao_cao DESC
         LIMIT 1`,
        [groupId]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy báo cáo mới nhất: ${error.message}`);
    }
  }
}

module.exports = Report;
