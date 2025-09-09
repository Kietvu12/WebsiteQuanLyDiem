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
      
      // Gộp giao dịch hủy lịch
      const processedRows = [];
      const processedScheduleIds = new Set();
      
      for (const row of rows) {
        if (row.id_loai_giao_dich === 3 && row.id_lich_xe && !processedScheduleIds.has(row.id_lich_xe)) {
          // Tìm giao dịch hủy lịch gộp
          const mergedTransaction = await this.getMergedCancelTransactions(row.id_lich_xe);
          if (mergedTransaction) {
            processedRows.push(mergedTransaction);
            processedScheduleIds.add(row.id_lich_xe);
          } else {
            processedRows.push(row);
          }
        } else if (row.id_loai_giao_dich !== 3 || !row.id_lich_xe || !processedScheduleIds.has(row.id_lich_xe)) {
          processedRows.push(row);
        }
      }
      
      return processedRows;
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
      
      // Gộp giao dịch hủy lịch
      const processedRows = [];
      const processedScheduleIds = new Set();
      
      for (const row of rows) {
        if (row.id_loai_giao_dich === 3 && row.id_lich_xe && !processedScheduleIds.has(row.id_lich_xe)) {
          // Tìm giao dịch hủy lịch gộp
          const mergedTransaction = await this.getMergedCancelTransactions(row.id_lich_xe);
          if (mergedTransaction) {
            processedRows.push(mergedTransaction);
            processedScheduleIds.add(row.id_lich_xe);
          } else {
            processedRows.push(row);
          }
        } else if (row.id_loai_giao_dich !== 3 || !row.id_lich_xe || !processedScheduleIds.has(row.id_lich_xe)) {
          processedRows.push(row);
        }
      }
      
      return processedRows;
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
      
      // Gộp giao dịch hủy lịch
      const processedRows = [];
      const processedScheduleIds = new Set();
      
      for (const row of rows) {
        if (row.id_loai_giao_dich === 3 && row.id_lich_xe && !processedScheduleIds.has(row.id_lich_xe)) {
          // Tìm giao dịch hủy lịch gộp
          const mergedTransaction = await this.getMergedCancelTransactions(row.id_lich_xe);
          if (mergedTransaction) {
            processedRows.push(mergedTransaction);
            processedScheduleIds.add(row.id_lich_xe);
          } else {
            processedRows.push(row);
          }
        } else if (row.id_loai_giao_dich !== 3 || !row.id_lich_xe || !processedScheduleIds.has(row.id_lich_xe)) {
          processedRows.push(row);
        }
      }
      
      return processedRows;
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
      
      // Gộp giao dịch hủy lịch
      const processedRows = [];
      const processedScheduleIds = new Set();
      
      for (const row of rows) {
        if (row.id_loai_giao_dich === 3 && row.id_lich_xe && !processedScheduleIds.has(row.id_lich_xe)) {
          // Tìm giao dịch hủy lịch gộp
          const mergedTransaction = await this.getMergedCancelTransactions(row.id_lich_xe);
          if (mergedTransaction) {
            processedRows.push(mergedTransaction);
            processedScheduleIds.add(row.id_lich_xe);
          } else {
            processedRows.push(row);
          }
        } else if (row.id_loai_giao_dich !== 3 || !row.id_lich_xe || !processedScheduleIds.has(row.id_lich_xe)) {
          processedRows.push(row);
        }
      }
      
      return processedRows;
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

      // Xử lý các giá trị null/undefined để tránh lỗi MySQL
      const processedData = {
        id_loai_giao_dich: id_loai_giao_dich !== undefined && id_loai_giao_dich !== null ? id_loai_giao_dich : null,
        id_nguoi_gui: id_nguoi_gui !== undefined && id_nguoi_gui !== null ? id_nguoi_gui : null,
        id_nguoi_nhan: id_nguoi_nhan !== undefined && id_nguoi_nhan !== null ? id_nguoi_nhan : null,
        id_nhom: id_nhom !== undefined && id_nhom !== null ? id_nhom : null,
        id_lich_xe: id_lich_xe !== undefined && id_lich_xe !== null ? id_lich_xe : null,
        so_tien: so_tien !== undefined && so_tien !== null ? so_tien : null,
        diem: diem !== undefined && diem !== null ? diem : null,
        noi_dung: noi_dung || null,
        trang_thai: trang_thai || 'cho_xac_nhan'
      };

      // Kiểm tra dữ liệu bắt buộc
      if (processedData.id_loai_giao_dich === null || processedData.id_loai_giao_dich === undefined ||
          processedData.id_nhom === null || processedData.id_nhom === undefined ||
          !processedData.noi_dung) {
        throw new Error('Thiếu thông tin bắt buộc để tạo giao dịch');
      }
      
      // Kiểm tra: phải có ít nhất một trong hai (id_nguoi_gui hoặc id_nguoi_nhan)
      if ((processedData.id_nguoi_gui === null || processedData.id_nguoi_gui === undefined) &&
          (processedData.id_nguoi_nhan === null || processedData.id_nguoi_nhan === undefined)) {
        throw new Error('Phải có ít nhất một người gửi hoặc người nhận');
      }
      
      // Log validation result
      console.log('✅ Validation passed:');
      console.log('  - id_nguoi_gui:', processedData.id_nguoi_gui);
      console.log('  - id_nguoi_nhan:', processedData.id_nguoi_nhan);
      console.log('  - At least one is not null:', (processedData.id_nguoi_gui !== null && processedData.id_nguoi_gui !== undefined) || 
                                                   (processedData.id_nguoi_nhan !== null && processedData.id_nguoi_nhan !== undefined));

      console.log('Processed transaction data:', processedData);
      console.log('🔍 Chi tiết validation:');
      console.log('  - id_loai_giao_dich:', processedData.id_loai_giao_dich, '(type:', typeof processedData.id_loai_giao_dich, ')');
      console.log('  - id_nguoi_gui:', processedData.id_nguoi_gui, '(type:', typeof processedData.id_nguoi_gui, ')');
      console.log('  - id_nguoi_nhan:', processedData.id_nguoi_nhan, '(type:', typeof processedData.id_nguoi_nhan, ')');
      console.log('  - id_nhom:', processedData.id_nhom, '(type:', typeof processedData.id_nhom, ')');
      console.log('  - noi_dung:', processedData.noi_dung, '(type:', typeof processedData.noi_dung, ')');

      console.log('🚀 Thực hiện SQL INSERT:');
      console.log('  - SQL Query:', `INSERT INTO giao_dich (id_loai_giao_dich, id_nguoi_gui, id_nguoi_nhan, id_nhom, id_lich_xe, so_tien, diem, noi_dung, trang_thai, ngay_hoan_thanh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'hoan_thanh' THEN CURRENT_TIMESTAMP ELSE NULL END)`);
      console.log('  - Parameters:', [processedData.id_loai_giao_dich, processedData.id_nguoi_gui, processedData.id_nguoi_nhan, processedData.id_nhom, processedData.id_lich_xe, processedData.so_tien, processedData.diem, processedData.noi_dung, processedData.trang_thai, processedData.trang_thai]);
      
      const [result] = await pool.execute(
        `INSERT INTO giao_dich (id_loai_giao_dich, id_nguoi_gui, id_nguoi_nhan, id_nhom, id_lich_xe, so_tien, diem, noi_dung, trang_thai, ngay_hoan_thanh) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'hoan_thanh' THEN CURRENT_TIMESTAMP ELSE NULL END)`,
        [processedData.id_loai_giao_dich, processedData.id_nguoi_gui, processedData.id_nguoi_nhan, processedData.id_nhom, processedData.id_lich_xe, processedData.so_tien, processedData.diem, processedData.noi_dung, processedData.trang_thai, processedData.trang_thai]
      );
      
      console.log('✅ SQL INSERT thành công - Result:', result);
      console.log('✅ Insert ID:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Transaction.create error:', error);
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
  static async findOppositeTransaction(senderId, receiverId, groupId, scheduleId, typeId, trangThai = 'cho_xac_nhan') {
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
         AND trang_thai = ?
         ORDER BY ngay_tao DESC 
         LIMIT 1`,
        [receiverId, senderId, groupId, scheduleId, oppositeTypeId, trangThai]
      );
      
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi tìm giao dịch đối ứng: ${error.message}`);
    }
  }

  // Tìm giao dịch đối ứng bất kể trạng thái (để hủy giao dịch)
  static async findOppositeTransactionAnyStatus(senderId, receiverId, groupId, scheduleId, typeId) {
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

  // Gộp 2 giao dịch hủy lịch có chung id_lich_xe
  static async getMergedCancelTransactions(scheduleId) {
    try {
      const [rows] = await pool.execute(
        `SELECT gd.*, lg.ten_loai as ten_loai_giao_dich, lg.yeu_cau_xac_nhan,
                ng.ho_ten as ten_nguoi_gui, nn.ho_ten as ten_nguoi_nhan,
                n.ten_nhom, lx.id_lich_xe
         FROM giao_dich gd
         INNER JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
         LEFT JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
         LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
         INNER JOIN nhom n ON gd.id_nhom = n.id_nhom
         LEFT JOIN lich_xe lx ON gd.id_lich_xe = lx.id_lich_xe
         WHERE gd.id_lich_xe = ? AND gd.id_loai_giao_dich = 3
         ORDER BY gd.ngay_tao ASC`,
        [scheduleId]
      );
      
      if (rows.length === 2) {
        // Gộp 2 giao dịch hủy lịch
        const [transaction1, transaction2] = rows;
        
        // Xác định người gửi và người nhận từ 2 giao dịch
        const nguoiGui = transaction1.id_nguoi_gui || transaction2.id_nguoi_gui;
        const nguoiNhan = transaction1.id_nguoi_nhan || transaction2.id_nguoi_nhan;
        
        // Lấy tên người dùng
        const [nguoiGuiInfo] = await pool.execute(
          'SELECT ho_ten FROM nguoi_dung WHERE id_nguoi_dung = ?',
          [nguoiGui]
        );
        
        const [nguoiNhanInfo] = await pool.execute(
          'SELECT ho_ten FROM nguoi_dung WHERE id_nguoi_dung = ?',
          [nguoiNhan]
        );
        
        // Tạo giao dịch gộp với đầy đủ thông tin
        const mergedTransaction = {
          id_giao_dich: `merged_${transaction1.id_giao_dich}_${transaction2.id_giao_dich}`,
          id_loai_giao_dich: 3,
          id_nguoi_gui: nguoiGui,
          id_nguoi_nhan: nguoiNhan,
          id_nhom: transaction1.id_nhom,
          id_lich_xe: scheduleId,
          so_tien: Math.abs(transaction1.so_tien),
          diem: Math.abs(transaction1.diem),
          noi_dung: `Hủy lịch xe #${scheduleId} - ${nguoiGuiInfo[0]?.ho_ten || 'N/A'} bị trừ và ${nguoiNhanInfo[0]?.ho_ten || 'N/A'} được cộng`,
          trang_thai: 'hoan_thanh',
          ngay_tao: transaction1.ngay_tao,
          ten_loai_giao_dich: 'Hủy lịch xe',
          ten_nguoi_gui: nguoiGuiInfo[0]?.ho_ten || 'N/A',
          ten_nguoi_nhan: nguoiNhanInfo[0]?.ho_ten || 'N/A',
          ten_nhom: transaction1.ten_nhom,
          is_merged: true,
          original_transactions: [transaction1, transaction2]
        };
        
        return mergedTransaction;
      }
      
      return null;
    } catch (error) {
      throw new Error(`Lỗi gộp giao dịch hủy lịch: ${error.message}`);
    }
  }
}

module.exports = Transaction;
