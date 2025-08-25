const reportExportService = require('../services/reportExportService')
const { pool } = require('../config/database')
const fs = require('fs').promises
const path = require('path')

class ReportController {
  // Xuất báo cáo giao dịch của người dùng
  async exportUserTransactionsReport(req, res) {
    try {
      const { userId, startDate, endDate } = req.body
      
      if (!userId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: userId, startDate, endDate'
        })
      }

      const result = await reportExportService.exportUserTransactionsReport(userId, startDate, endDate)
      
      res.json({
        success: true,
        message: 'Xuất báo cáo thành công',
        data: result
      })
    } catch (error) {
      console.error('Error in exportUserTransactionsReport:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi xuất báo cáo'
      })
    }
  }

  // Xuất báo cáo lịch xe của người dùng
  async exportUserSchedulesReport(req, res) {
    try {
      const { userId, startDate, endDate } = req.body
      
      if (!userId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: userId, startDate, endDate'
        })
      }

      const result = await reportExportService.exportUserSchedulesReport(userId, startDate, endDate)
      
      res.json({
        success: true,
        message: 'Xuất báo cáo thành công',
        data: result
      })
    } catch (error) {
      console.error('Error in exportUserSchedulesReport:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi xuất báo cáo'
      })
    }
  }

  // Xuất báo cáo tổng hợp của nhóm
  async exportGroupReport(req, res) {
    try {
      const { groupId, startDate, endDate } = req.body
      
      if (!groupId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: groupId, startDate, endDate'
        })
      }

      const result = await reportExportService.exportGroupReport(groupId, startDate, endDate)
      
      res.json({
        success: true,
        message: 'Xuất báo cáo thành công',
        data: result
      })
    } catch (error) {
      console.error('Error in exportGroupReport:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi xuất báo cáo'
      })
    }
  }

  // Lấy danh sách báo cáo
  async getReportsList(req, res) {
    try {
      const reports = await reportExportService.getReportsList()
      
      res.json({
        success: true,
        data: reports
      })
    } catch (error) {
      console.error('Error in getReportsList:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách báo cáo'
      })
    }
  }

  // Tải về báo cáo
  async downloadReport(req, res) {
    try {
      const { reportId } = req.params
      
      // Lấy thông tin báo cáo
      const [reportRows] = await pool.execute(
        'SELECT duong_dan_file FROM bao_cao WHERE id_bao_cao = ?',
        [reportId]
      )
      
      if (reportRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy báo cáo'
        })
      }

      const report = reportRows[0]
      const fullPath = path.join(__dirname, '..', report.duong_dan_file)
      
      // Kiểm tra file có tồn tại không
      try {
        await fs.access(fullPath)
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: 'File báo cáo không tồn tại'
        })
      }

      // Tải file
      res.download(fullPath)
    } catch (error) {
      console.error('Error in downloadReport:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi tải báo cáo'
      })
    }
  }

  // Xóa báo cáo
  async deleteReport(req, res) {
    try {
      const { reportId } = req.params
      
      const result = await reportExportService.deleteReport(reportId)
      
      if (result) {
        res.json({
          success: true,
          message: 'Xóa báo cáo thành công'
        })
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy báo cáo để xóa'
        })
      }
    } catch (error) {
      console.error('Error in deleteReport:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi xóa báo cáo'
      })
    }
  }

  // Tạo thư mục báo cáo cho người dùng mới
  async createUserReportDirectory(req, res) {
    try {
      const { userId, userName } = req.body
      
      if (!userId || !userName) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: userId, userName'
        })
      }

      const userDir = await reportExportService.createUserReportDirectory(userId, userName)
      
      res.json({
        success: true,
        message: 'Tạo thư mục báo cáo thành công',
        data: { directory: userDir }
      })
    } catch (error) {
      console.error('Error in createUserReportDirectory:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi tạo thư mục báo cáo'
      })
    }
  }

  // Tạo thư mục báo cáo cho nhóm mới
  async createGroupReportDirectory(req, res) {
    try {
      const { groupId, groupName } = req.body
      
      if (!groupId || !groupName) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: groupId, groupName'
        })
      }

      const groupDir = await reportExportService.createGroupReportDirectory(groupId, groupName)
      
      res.json({
        success: true,
        message: 'Tạo thư mục báo cáo thành công',
        data: { directory: groupDir }
      })
    } catch (error) {
      console.error('Error in createGroupReportDirectory:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi tạo thư mục báo cáo'
      })
    }
  }

  // Lấy danh sách folder báo cáo
  async getReportFolders(req, res) {
    try {
      const folders = await reportExportService.getReportFolders()
      
      res.json({
        success: true,
        data: folders
      })
    } catch (error) {
      console.error('Error in getReportFolders:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách folder báo cáo'
      })
    }
  }

  // Tải về file theo đường dẫn
  async downloadFileByPath(req, res) {
    try {
      const { filePath } = req.body
      
      if (!filePath) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: filePath'
        })
      }

      const fullPath = path.join(__dirname, '..', 'reports', filePath)
      
      // Kiểm tra file có tồn tại không
      try {
        await fs.access(fullPath)
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: 'File báo cáo không tồn tại'
        })
      }

      // Tải file
      res.download(fullPath)
    } catch (error) {
      console.error('Error in downloadFileByPath:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi tải báo cáo'
      })
    }
  }

  // Xóa file theo đường dẫn
  async deleteFileByPath(req, res) {
    try {
      const { filePath } = req.body
      
      if (!filePath) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: filePath'
        })
      }

      const result = await reportExportService.deleteFileByPath(filePath)
      
      if (result) {
        res.json({
          success: true,
          message: 'Xóa file thành công'
        })
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy file để xóa'
        })
      }
    } catch (error) {
      console.error('Error in deleteFileByPath:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi xóa file'
      })
    }
  }
}

module.exports = new ReportController()
