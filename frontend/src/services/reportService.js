const API_BASE_URL = 'http://localhost:5000/api'

class ReportService {
  // Xuất báo cáo giao dịch của người dùng
  async exportUserTransactionsReport(token, userId, startDate, endDate) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/export-user-transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          startDate,
          endDate
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        return data
      } else {
        throw new Error(data.message || 'Lỗi khi xuất báo cáo')
      }
    } catch (error) {
      console.error('Error exporting user transactions report:', error)
      throw error
    }
  }

  // Xuất báo cáo lịch xe của người dùng
  async exportUserSchedulesReport(token, userId, startDate, endDate) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/export-user-schedules`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          startDate,
          endDate
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        return data
      } else {
        throw new Error(data.message || 'Lỗi khi xuất báo cáo')
      }
    } catch (error) {
      console.error('Error exporting user schedules report:', error)
      throw error
    }
  }

  // Xuất báo cáo tổng hợp của nhóm
  async exportGroupReport(token, groupId, startDate, endDate) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/export-group`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId,
          startDate,
          endDate
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        return data
      } else {
        throw new Error(data.message || 'Lỗi khi xuất báo cáo')
      }
    } catch (error) {
      console.error('Error exporting group report:', error)
      throw error
    }
  }

  // Lấy danh sách báo cáo
  async getReportsList(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        return data
      } else {
        throw new Error(data.message || 'Lỗi khi lấy danh sách báo cáo')
      }
    } catch (error) {
      console.error('Error getting reports list:', error)
      throw error
    }
  }

  // Tải về báo cáo
  async downloadReport(token, reportId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/download/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (response.ok) {
        // Tạo blob và tải về
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${reportId}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        return { success: true }
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Lỗi khi tải báo cáo')
      }
    } catch (error) {
      console.error('Error downloading report:', error)
      throw error
    }
  }

  // Xóa báo cáo
  async deleteReport(token, reportId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        return data
      } else {
        throw new Error(data.message || 'Lỗi khi xóa báo cáo')
      }
    } catch (error) {
      console.error('Error deleting report:', error)
      throw error
    }
  }

  // Tạo thư mục báo cáo cho người dùng mới
  async createUserReportDirectory(token, userId, userName) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/create-user-directory`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        return data
      } else {
        throw new Error(data.message || 'Lỗi khi tạo thư mục báo cáo')
      }
    } catch (error) {
      console.error('Error creating user report directory:', error)
      throw error
    }
  }

  // Tạo thư mục báo cáo cho nhóm mới
  async createGroupReportDirectory(token, groupId, groupName) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/create-group-directory`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId,
          groupName
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        return data
      } else {
        throw new Error(data.message || 'Lỗi khi tạo thư mục báo cáo')
      }
    } catch (error) {
      console.error('Error creating group report directory:', error)
      throw error
    }
  }
}

export const reportService = new ReportService()
