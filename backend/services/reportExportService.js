const fs = require('fs').promises
const path = require('path')
const { pool } = require('../config/database')

class ReportExportService {
  constructor() {
    this.reportsDir = path.join(__dirname, '../reports')
    console.log('🏗️ ReportExportService initialized')
    console.log('📁 Reports directory:', this.reportsDir)
  }

  // Tạo thư mục cho người dùng hoặc nhóm nếu chưa có
  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath)
      console.log('📁 Directory already exists:', dirPath)
    } catch (error) {
      console.log('📁 Creating directory:', dirPath)
      await fs.mkdir(dirPath, { recursive: true })
      console.log('✅ Directory created:', dirPath)
    }
  }

  // Tạo thư mục cho người dùng mới
  async createUserReportDirectory(userId, userName) {
    const userDir = path.join(this.reportsDir, `Báo cáo người dùng ${userName}`)
    console.log('👤 Creating user report directory:', userDir)
    await this.ensureDirectoryExists(userDir)
    console.log('✅ User report directory ready:', userDir)
    return userDir
  }

  // Tạo thư mục cho nhóm mới
  async createGroupReportDirectory(groupId, groupName) {
    const groupDir = path.join(this.reportsDir, `Báo cáo nhóm ${groupName}`)
    console.log('👥 Creating group report directory:', groupDir)
    await this.ensureDirectoryExists(groupDir)
    console.log('✅ Group report directory ready:', groupDir)
    return groupDir
  }

  // Chuyển đổi dữ liệu thành CSV
  convertToCSV(data, headers) {
    if (!data || data.length === 0) {
      return headers.map(header => header.label).join(',') + '\n'
    }

    const csvRows = [headers.map(header => header.label).join(',')]
    
    data.forEach((row, index) => {
      const csvRow = headers.map(header => {
        let value = ''
        
        // Xử lý STT
        if (header.key === 'stt') {
          value = String(index + 1)
        } else {
          value = row[header.key] || ''
        }
        
        // Chuyển đổi giá trị thành string và xử lý null/undefined
        if (value === null || value === undefined) {
          value = ''
        } else {
          value = String(value)
        }
        
        // Xử lý các trường hợp đặc biệt
        if (value === '') {
          return '' // Giá trị rỗng
        }
        
        // Escape dấu phẩy, dấu ngoặc kép và xuống dòng
        if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
          // Thay thế xuống dòng bằng dấu cách
          value = value.replace(/\r?\n/g, ' ').replace(/\r/g, ' ')
          // Escape dấu ngoặc kép
          value = value.replace(/"/g, '""')
          // Bọc trong dấu ngoặc kép
          return `"${value}"`
        }
        
        return value
      })
      csvRows.push(csvRow.join(','))
    })

    return csvRows.join('\n')
  }

  // Xuất báo cáo giao dịch của người dùng
  async exportUserTransactionsReport(userId, startDate, endDate) {
    try {
      // Lấy thông tin người dùng
      const [userRows] = await pool.execute(
        'SELECT ho_ten, ten_dang_nhap FROM nguoi_dung WHERE id_nguoi_dung = ?',
        [userId]
      )
      
      if (userRows.length === 0) {
        throw new Error('Không tìm thấy người dùng')
      }

      const user = userRows[0]
      const userDir = await this.createUserReportDirectory(userId, user.ho_ten)

      // Lấy giao dịch của người dùng trong khoảng thời gian
      const [transactions] = await pool.execute(
        `SELECT 
          gd.id_giao_dich,
          gd.ngay_tao,
          gd.so_tien,
          gd.diem,
          gd.noi_dung,
          gd.trang_thai,
          lg.ten_loai as loai_giao_dich,
          n.ten_nhom,
          ng.ho_ten as nguoi_gui,
          nn.ho_ten as nguoi_nhan
        FROM giao_dich gd
        LEFT JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
        LEFT JOIN nhom n ON gd.id_nhom = n.id_nhom
        LEFT JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
        LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
        WHERE (gd.id_nguoi_gui = ? OR gd.id_nguoi_nhan = ?)
        AND DATE(gd.ngay_tao) BETWEEN ? AND ?
        ORDER BY gd.ngay_tao DESC`,
        [userId, userId, startDate, endDate]
      )

      // Tạo CSV cho giao dịch
      const transactionHeaders = [
        { key: 'stt', label: 'STT' },
        { key: 'ngay_tao', label: 'Ngày tạo giao dịch' },
        { key: 'loai_giao_dich', label: 'Loại giao dịch' },
        { key: 'nguoi_gui', label: 'Người gửi' },
        { key: 'nguoi_nhan', label: 'Người nhận' },
        { key: 'so_tien', label: 'Số tiền' },
        { key: 'diem', label: 'Điểm' },
        { key: 'trang_thai', label: 'Trạng thái giao dịch' },
        { key: 'noi_dung', label: 'Nội dung giao dịch' },
        { key: 'ten_nhom', label: 'Nhóm tham chiếu' }
      ]

      const csvContent = this.convertToCSV(transactions, transactionHeaders)
      
      // Tạo tên file
      const fileName = `Báo cáo người dùng ${user.ho_ten} từ ${startDate} đến ${endDate}.csv`
      const filePath = path.join(userDir, fileName)
      
      console.log('📁 Creating user transactions file:', filePath)
      console.log('📊 CSV content length:', csvContent.length)
      
      // Ghi file với BOM để Excel hiểu đúng UTF-8
      const bom = '\uFEFF' // Byte Order Mark
      await fs.writeFile(filePath, bom + csvContent, 'utf8')
      console.log('✅ User transactions file created successfully:', filePath)
      
      // Lưu vào database
      const [result] = await pool.execute(
        'INSERT INTO bao_cao (id_nhom, ngay_bao_cao, duong_dan_file) VALUES (NULL, ?, ?)',
        [endDate, `reports/Báo cáo người dùng ${user.ho_ten}/${fileName}`]
      )

      return {
        success: true,
        filePath: `reports/Báo cáo người dùng ${user.ho_ten}/${fileName}`,
        fileName: fileName,
        recordCount: transactions.length
      }
    } catch (error) {
      console.error('Error exporting user transactions report:', error)
      throw new Error(`Lỗi xuất báo cáo: ${error.message}`)
    }
  }

  // Xuất báo cáo lịch xe của người dùng
  async exportUserSchedulesReport(userId, startDate, endDate) {
    try {
      // Lấy thông tin người dùng
      const [userRows] = await pool.execute(
        'SELECT ho_ten, ten_dang_nhap FROM nguoi_dung WHERE id_nguoi_dung = ?',
        [userId]
      )
      
      if (userRows.length === 0) {
        throw new Error('Không tìm thấy người dùng')
      }

      const user = userRows[0]
      const userDir = await this.createUserReportDirectory(userId, user.ho_ten)

      // Lấy lịch xe của người dùng trong khoảng thời gian
      const [schedules] = await pool.execute(
        `SELECT 
          lx.id_lich_xe,
          lx.thoi_gian_bat_dau_don,
          lx.thoi_gian_ket_thuc_don,
          lx.thoi_gian_bat_dau_tra,
          lx.thoi_gian_ket_thuc_tra,
          lx.trang_thai,
          lx.ngay_tao,
          lx_type.ten_loai as ten_loai_xe,
          lx_type.so_cho,
          lt.ten_loai as loai_tuyen,
          lt.la_khu_hoi,
          n.ten_nhom,
          nt.ho_ten as nguoi_tao,
          nn.ho_ten as nguoi_nhan
        FROM lich_xe lx
        LEFT JOIN loai_xe lx_type ON lx.id_loai_xe = lx_type.id_loai_xe
        LEFT JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
        LEFT JOIN nhom n ON lx.id_nhom = n.id_nhom
        LEFT JOIN nguoi_dung nt ON lx.id_nguoi_tao = nt.id_nguoi_dung
        LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
        WHERE (lx.id_nguoi_tao = ? OR lx.id_nguoi_nhan = ?)
        AND DATE(lx.thoi_gian_bat_dau_don) BETWEEN ? AND ?
        ORDER BY lx.thoi_gian_bat_dau_don DESC`,
        [userId, userId, startDate, endDate]
      )

      // Tạo CSV cho lịch xe
      const scheduleHeaders = [
        { key: 'stt', label: 'STT' },
        { key: 'ngay_tao', label: 'Ngày tạo giao dịch' },
        { key: 'loai_tuyen', label: 'Loại giao dịch' },
        { key: 'nguoi_tao', label: 'Người gửi' },
        { key: 'nguoi_nhan', label: 'Người nhận' },
        { key: 'thoi_gian_bat_dau_don', label: 'Số tiền' },
        { key: 'thoi_gian_ket_thuc_don', label: 'Điểm' },
        { key: 'trang_thai', label: 'Trạng thái giao dịch' },
        { key: 'ten_loai_xe', label: 'Nội dung giao dịch' },
        { key: 'ten_nhom', label: 'Nhóm tham chiếu' }
      ]

      const csvContent = this.convertToCSV(schedules, scheduleHeaders)
      
      // Tạo tên file
      const fileName = `Báo cáo lịch xe người dùng ${user.ho_ten} từ ${startDate} đến ${endDate}.csv`
      const filePath = path.join(userDir, fileName)
      
      console.log('📁 Creating user schedules file:', filePath)
      console.log('📊 CSV content length:', csvContent.length)
      
      // Ghi file với BOM để Excel hiểu đúng UTF-8
      const bom = '\uFEFF' // Byte Order Mark
      await fs.writeFile(filePath, bom + csvContent, 'utf8')
      console.log('✅ User schedules file created successfully:', filePath)
      
      // Lưu vào database
      const [result] = await pool.execute(
        'INSERT INTO bao_cao (id_nhom, ngay_bao_cao, duong_dan_file) VALUES (NULL, ?, ?)',
        [endDate, `reports/Báo cáo người dùng ${user.ho_ten}/${fileName}`]
      )

      return {
        success: true,
        filePath: `reports/Báo cáo người dùng ${user.ho_ten}/${fileName}`,
        fileName: fileName,
        recordCount: schedules.length
      }
    } catch (error) {
      console.error('Error exporting user schedules report:', error)
      throw new Error(`Lỗi xuất báo cáo: ${error.message}`)
    }
  }

  // Xuất báo cáo tổng hợp của nhóm
  async exportGroupReport(groupId, startDate, endDate) {
    try {
      // Lấy thông tin nhóm
      const [groupRows] = await pool.execute(
        'SELECT ten_nhom FROM nhom WHERE id_nhom = ?',
        [groupId]
      )
      
      if (groupRows.length === 0) {
        throw new Error('Không tìm thấy nhóm')
      }

      const group = groupRows[0]
      const groupDir = await this.createGroupReportDirectory(groupId, group.ten_nhom)

      // Lấy giao dịch của nhóm
      const [transactions] = await pool.execute(
        `SELECT 
          gd.id_giao_dich,
          gd.ngay_tao,
          gd.so_tien,
          gd.diem,
          gd.noi_dung,
          gd.trang_thai,
          lg.ten_loai as loai_giao_dich,
          ng.ho_ten as nguoi_gui,
          nn.ho_ten as nguoi_nhan,
          n.ten_nhom
        FROM giao_dich gd
        LEFT JOIN loai_giao_dich lg ON gd.id_loai_giao_dich = lg.id_loai_giao_dich
        LEFT JOIN nhom n ON gd.id_nhom = n.id_nhom
        LEFT JOIN nguoi_dung ng ON gd.id_nguoi_gui = ng.id_nguoi_dung
        LEFT JOIN nguoi_dung nn ON gd.id_nguoi_nhan = nn.id_nguoi_dung
        WHERE gd.id_nhom = ?
        AND DATE(gd.ngay_tao) BETWEEN ? AND ?
        ORDER BY gd.ngay_tao DESC`,
        [groupId, startDate, endDate]
      )

      // Lấy lịch xe của nhóm
      const [schedules] = await pool.execute(
        `SELECT 
          lx.id_lich_xe,
          lx.thoi_gian_bat_dau_don,
          lx.thoi_gian_ket_thuc_don,
          lx.thoi_gian_bat_dau_tra,
          lx.thoi_gian_ket_thuc_tra,
          lx.trang_thai,
          lx.ngay_tao,
          lx_type.ten_loai as ten_loai_xe,
          lx_type.so_cho,
          lt.ten_loai as loai_tuyen,
          lt.la_khu_hoi,
          nt.ho_ten as nguoi_tao,
          nn.ho_ten as nguoi_nhan,
          n.ten_nhom
        FROM lich_xe lx
        LEFT JOIN loai_xe lx_type ON lx.id_loai_xe = lx_type.id_loai_xe
        LEFT JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
        LEFT JOIN nhom n ON lx.id_nhom = n.id_nhom
        LEFT JOIN nguoi_dung nt ON lx.id_nguoi_tao = nt.id_nguoi_dung
        LEFT JOIN nguoi_dung nn ON lx.id_nguoi_nhan = nn.id_nguoi_dung
        WHERE lx.id_nhom = ?
        AND DATE(lx.thoi_gian_bat_dau_don) BETWEEN ? AND ?
        ORDER BY lx.thoi_gian_bat_dau_don DESC`,
        [groupId, startDate, endDate]
      )

      // Tạo CSV cho giao dịch
      const transactionHeaders = [
        { key: 'stt', label: 'STT' },
        { key: 'ngay_tao', label: 'Ngày tạo giao dịch' },
        { key: 'loai_giao_dich', label: 'Loại giao dịch' },
        { key: 'nguoi_gui', label: 'Người gửi' },
        { key: 'nguoi_nhan', label: 'Người nhận' },
        { key: 'so_tien', label: 'Số tiền' },
        { key: 'diem', label: 'Điểm' },
        { key: 'trang_thai', label: 'Trạng thái giao dịch' },
        { key: 'noi_dung', label: 'Nội dung giao dịch' },
        { key: 'ten_nhom', label: 'Nhóm tham chiếu' }
      ]

      const transactionCSV = this.convertToCSV(transactions, transactionHeaders)

      // Tạo CSV cho lịch xe
      const scheduleHeaders = [
        { key: 'stt', label: 'STT' },
        { key: 'ngay_tao', label: 'Ngày tạo giao dịch' },
        { key: 'loai_tuyen', label: 'Loại giao dịch' },
        { key: 'nguoi_tao', label: 'Người gửi' },
        { key: 'nguoi_nhan', label: 'Người nhận' },
        { key: 'thoi_gian_bat_dau_don', label: 'Số tiền' },
        { key: 'thoi_gian_ket_thuc_don', label: 'Điểm' },
        { key: 'trang_thai', label: 'Trạng thái giao dịch' },
        { key: 'ten_loai_xe', label: 'Nội dung giao dịch' },
        { key: 'ten_nhom', label: 'Nhóm tham chiếu' }
      ]

      const scheduleCSV = this.convertToCSV(schedules, scheduleHeaders)

      // Tạo tên file
      const fileName = `Báo cáo nhóm ${group.ten_nhom} từ ${startDate} đến ${endDate}.csv`
      const filePath = path.join(groupDir, fileName)
      
      console.log('📁 Creating file:', filePath)
      console.log('📊 Transaction CSV length:', transactionCSV.length)
      console.log('📊 Schedule CSV length:', scheduleCSV.length)
      
      // Ghi file với BOM để Excel hiểu đúng UTF-8
      const bom = '\uFEFF' // Byte Order Mark
      await fs.writeFile(filePath, bom + transactionCSV + '\n\n' + scheduleCSV, 'utf8')
      console.log('✅ File created successfully:', filePath)
      
      // Lưu vào database
      const [result] = await pool.execute(
        'INSERT INTO bao_cao (id_nhom, ngay_bao_cao, duong_dan_file) VALUES (?, ?, ?)',
        [groupId, endDate, `reports/Báo cáo nhóm ${group.ten_nhom}/${fileName}`]
      )

      return {
        success: true,
        filePath: `reports/Báo cáo nhóm ${group.ten_nhom}/${fileName}`,
        fileName: fileName,
        transactionCount: transactions.length,
        scheduleCount: schedules.length
      }
    } catch (error) {
      console.error('Error exporting group report:', error)
      throw new Error(`Lỗi xuất báo cáo: ${error.message}`)
    }
  }

  // Lấy danh sách báo cáo
  async getReportsList() {
    try {
      const [rows] = await pool.execute(
        `SELECT 
          bc.*, 
          n.ten_nhom,
          CASE 
            WHEN bc.id_nhom IS NULL THEN 'Báo cáo người dùng'
            ELSE 'Báo cáo nhóm'
          END as loai_bao_cao
        FROM bao_cao bc
        LEFT JOIN nhom n ON bc.id_nhom = n.id_nhom
        ORDER BY bc.ngay_tao_bao_cao DESC`
      )
      return rows
    } catch (error) {
      console.error('Error getting reports list:', error)
      throw new Error(`Lỗi lấy danh sách báo cáo: ${error.message}`)
    }
  }

  // Xóa báo cáo
  async deleteReport(reportId) {
    try {
      // Lấy thông tin báo cáo
      const [reportRows] = await pool.execute(
        'SELECT duong_dan_file FROM bao_cao WHERE id_bao_cao = ?',
        [reportId]
      )
      
      if (reportRows.length === 0) {
        throw new Error('Không tìm thấy báo cáo')
      }

      const report = reportRows[0]
      const fullPath = path.join(__dirname, '..', report.duong_dan_file)
      
      // Xóa file
      try {
        await fs.unlink(fullPath)
      } catch (fileError) {
        console.warn('File không tồn tại hoặc đã bị xóa:', fileError.message)
      }
      
      // Xóa record trong database
      const [result] = await pool.execute(
        'DELETE FROM bao_cao WHERE id_bao_cao = ?',
        [reportId]
      )

      return result.affectedRows > 0
    } catch (error) {
      console.error('Error deleting report:', error)
      throw new Error(`Lỗi xóa báo cáo: ${error.message}`)
    }
  }

  // Lấy danh sách folder báo cáo
  async getReportFolders() {
    try {
      const folders = []
      
      // Đọc thư mục reports
      const reportDirs = await fs.readdir(this.reportsDir)
      
      for (const dir of reportDirs) {
        const dirPath = path.join(this.reportsDir, dir)
        const stats = await fs.stat(dirPath)
        
        if (stats.isDirectory()) {
          // Đọc các file trong thư mục
          const files = await fs.readdir(dirPath)
          const csvFiles = files.filter(file => file.endsWith('.csv'))
          
          // Lấy thông tin từ database
          const [dbRows] = await pool.execute(
            'SELECT * FROM bao_cao WHERE duong_dan_file LIKE ? ORDER BY ngay_tao_bao_cao DESC',
            [`%${dir}%`]
          )
          
          folders.push({
            id: dir,
            name: dir,
            type: dir.includes('người dùng') ? 'user' : 'group',
            fileCount: csvFiles.length,
            files: csvFiles.map(file => ({
              name: file,
              path: path.join(dir, file),
              size: 'N/A', // Có thể tính toán kích thước thực tế nếu cần
              createdDate: dbRows.length > 0 ? dbRows[0].ngay_tao_bao_cao : new Date().toISOString()
            })),
            createdDate: dbRows.length > 0 ? dbRows[0].ngay_tao_bao_cao : new Date().toISOString()
          })
        }
      }
      
      return folders
    } catch (error) {
      console.error('Error getting report folders:', error)
      throw new Error(`Lỗi khi lấy danh sách folder báo cáo: ${error.message}`)
    }
  }

  // Xóa file theo đường dẫn
  async deleteFileByPath(filePath) {
    try {
      const fullPath = path.join(this.reportsDir, filePath)
      
      // Xóa file
      try {
        await fs.unlink(fullPath)
      } catch (fileError) {
        console.warn('File không tồn tại hoặc đã bị xóa:', fileError.message)
        return false
      }
      
      // Xóa record trong database
      const [result] = await pool.execute(
        'DELETE FROM bao_cao WHERE duong_dan_file LIKE ?',
        [`%${filePath}%`]
      )

      return result.affectedRows > 0
    } catch (error) {
      console.error('Error deleting file by path:', error)
      throw new Error(`Lỗi xóa file: ${error.message}`)
    }
  }
}

module.exports = new ReportExportService()
