import React, { useState, useEffect } from 'react'
import { 
  SearchOutlined,
  FileExcelOutlined,
  FolderOutlined,
  DownloadOutlined,
  DeleteOutlined,
  MoreOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  FileZipOutlined,
  EyeOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'

const ReportsPage = () => {
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [searchFile, setSearchFile] = useState('')
  const [searchFolder, setSearchFolder] = useState('')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [selectedContextItem, setSelectedContextItem] = useState(null)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  // State cho API
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reports, setReports] = useState([])
  const [reportFolders, setReportFolders] = useState([])

  const recentFiles = [
    {
      id: 1,
      name: 'Báo cáo nhóm vận chuyển 1 - Tháng 1 2024.xlsx',
      type: 'excel',
      size: '2.5 MB',
      lastModified: '2024-01-15 14:30',
      downloadCount: 15
    },
    {
      id: 2,
      name: 'Báo cáo người dùng Nguyễn Văn A - Q1 2024.xlsx',
      type: 'excel',
      size: '1.8 MB',
      lastModified: '2024-01-14 09:15',
      downloadCount: 8
    },
    {
      id: 3,
      name: 'Báo cáo tổng hợp giao dịch - Tháng 12 2023.xlsx',
      type: 'excel',
      size: '3.2 MB',
      lastModified: '2024-01-13 16:45',
      downloadCount: 22
    },
    {
      id: 4,
      name: 'Báo cáo lịch xe Hà Nội - TP.HCM - Tháng 1 2024.xlsx',
      type: 'excel',
      size: '1.9 MB',
      lastModified: '2024-01-12 11:20',
      downloadCount: 12
    },
    {
      id: 5,
      name: 'Báo cáo doanh thu vận chuyển - Q4 2023.xlsx',
      type: 'excel',
      size: '4.1 MB',
      lastModified: '2024-01-11 15:30',
      downloadCount: 18
    },
    {
      id: 6,
      name: 'Báo cáo hiệu suất lái xe - Tháng 12 2023.xlsx',
      type: 'excel',
      size: '2.8 MB',
      lastModified: '2024-01-10 10:15',
      downloadCount: 9
    },
    {
      id: 7,
      name: 'Báo cáo tổng hợp điểm thưởng - Năm 2023.xlsx',
      type: 'excel',
      size: '3.5 MB',
      lastModified: '2024-01-09 14:45',
      downloadCount: 25
    },
    {
      id: 8,
      name: 'Báo cáo chi phí nhiên liệu - Tháng 1 2024.xlsx',
      type: 'excel',
      size: '1.6 MB',
      lastModified: '2024-01-08 16:20',
      downloadCount: 11
    }
  ]

  // Xóa dữ liệu mock cũ - thay thế bằng state

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder)
  }

  const handleContextMenu = (e, item) => {
    e.preventDefault()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setSelectedContextItem(item)
    setShowContextMenu(true)
  }

  const closeContextMenu = () => {
    setShowContextMenu(false)
    setSelectedContextItem(null)
  }

  const handleDownloadZip = (folder) => {
    console.log('Tải về dạng ZIP:', folder.name)
    closeContextMenu()
    // Xử lý logic tải về ZIP
  }

  const handleDeleteFolder = (folder) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa folder này?')) {
      console.log('Xóa folder:', folder.name)
      closeContextMenu()
      // Xử lý logic xóa folder
    }
  }

  const handleDownloadFile = async (file) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('Vui lòng đăng nhập để tải file')
        return
      }

      // Tìm report ID từ database dựa trên đường dẫn file
      const response = await fetch(`${API_BASE_URL}/reports/download-by-path`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath: file.path
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Không thể tải file')
      }
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Lỗi khi tải file')
    }
  }

  const handleDeleteFile = async (file) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa file này?')) {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          alert('Vui lòng đăng nhập để xóa file')
          return
        }

        // Tìm và xóa report từ database dựa trên đường dẫn file
        const response = await fetch(`${API_BASE_URL}/reports/delete-by-path`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filePath: file.path
          })
        })

        if (response.ok) {
          // Làm mới danh sách
          loadReports()
          loadReportFolders()
          setSelectedFolder(null)
          alert('Đã xóa file thành công')
        } else {
          alert('Không thể xóa file')
        }
      } catch (error) {
        console.error('Error deleting file:', error)
        alert('Lỗi khi xóa file')
      }
    }
  }

  // Load danh sách báo cáo từ API
  const loadReports = async () => {
    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Vui lòng đăng nhập để xem báo cáo')
        return
      }

      const response = await fetch(`${API_BASE_URL}/reports/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setReports(data.data || [])
      } else {
        setError(data.message || 'Không thể tải danh sách báo cáo')
      }
    } catch (error) {
      console.error('Error loading reports:', error)
      setError('Lỗi khi tải danh sách báo cáo')
    } finally {
      setLoading(false)
    }
  }

  // Tải về báo cáo
  const handleDownloadReport = async (report) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('Vui lòng đăng nhập để tải báo cáo')
        return
      }

      const response = await fetch(`${API_BASE_URL}/reports/download/${report.id_bao_cao}`, {
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
        a.download = report.duong_dan_file.split('/').pop() || `report-${report.id_bao_cao}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        alert(data.message || 'Lỗi khi tải báo cáo')
      }
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Lỗi khi tải báo cáo')
    }
  }

  // Xóa báo cáo
  const handleDeleteReport = async (report) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) {
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('Vui lòng đăng nhập để xóa báo cáo')
        return
      }

      const response = await fetch(`${API_BASE_URL}/reports/${report.id_bao_cao}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        alert('Xóa báo cáo thành công')
        loadReports() // Reload danh sách
      } else {
        alert(data.message || 'Lỗi khi xóa báo cáo')
      }
    } catch (error) {
      console.error('Error deleting report:', error)
      alert('Lỗi khi xóa báo cáo')
    }
  }

  // Load danh sách folder báo cáo từ hệ thống file
  const loadReportFolders = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/reports/folders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setReportFolders(data.data)
        }
      }
    } catch (error) {
      console.error('Error loading report folders:', error)
    }
  }

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadReports()
    loadReportFolders()
  }, [])

  const getFolderIcon = (type) => {
    switch (type) {
      case 'group':
        return <TeamOutlined className="text-blue-500" />
      case 'user':
        return <UserOutlined className="text-green-500" />
      case 'company':
        return <FolderOutlined className="text-purple-500" />
      default:
        return <FolderOutlined className="text-gray-500" />
    }
  }

  const getFileIcon = (type) => {
    return <FileExcelOutlined className="text-green-600" />
  }

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="max-w-7xl mx-auto">
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <ExclamationCircleOutlined className="text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* 1. Recent Reports Section - Horizontal Scroll */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Các báo cáo gần đây</h3>
            <button
              onClick={loadReports}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? <LoadingOutlined className="mr-2" /> : null}
              Làm mới
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingOutlined className="text-2xl text-blue-500 animate-spin mr-3" />
              <span className="text-gray-500">Đang tải danh sách báo cáo...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileExcelOutlined className="text-4xl mb-2 text-gray-300 mx-auto block" />
              <p>Chưa có báo cáo nào</p>
            </div>
          ) : (
            <div className="relative">
              <div 
                className="flex space-x-6 overflow-x-auto pb-4"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitScrollbar: { display: 'none' }
                }}
              >
                {reports.slice(0, 8).map(report => (
                  <div
                    key={report.id_bao_cao}
                    className="bg-white p-6 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 flex-shrink-0 w-80"
                    onContextMenu={(e) => handleContextMenu(e, { ...report, type: 'recent-file' })}
                  >
                    <div className="w-24 h-24 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileExcelOutlined className="text-6xl text-green-600" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium text-gray-800 text-sm leading-tight mb-2">
                        {report.duong_dan_file.split('/').pop()}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {report.ten_nhom ? `Nhóm: ${report.ten_nhom}` : 'Người dùng'} • {new Date(report.ngay_bao_cao).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(report.ngay_tao_bao_cao).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Fade effect on right */}
              <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-gray-25 to-transparent pointer-events-none"></div>
            </div>
          )}
        </div>

        {/* 2. Report Folders Section - Horizontal Scroll */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Các folder báo cáo</h3>
          
          {/* Search and Filter Section */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên folder..."
                  value={searchFolder}
                  onChange={(e) => setSearchFolder(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Từ ngày:</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Đến ngày:</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Folders Horizontal Scroll */}
          <div className="relative">
            <div 
              className="flex space-x-6 overflow-x-auto pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
            >
              {reportFolders.map(folder => (
                <div
                  key={folder.id}
                  className={`bg-white p-6 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 flex-shrink-0 w-80 ${
                    selectedFolder?.id === folder.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleFolderClick(folder)}
                  onContextMenu={(e) => handleContextMenu(e, { ...folder, type: 'folder' })}
                >
                  <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {getFolderIcon(folder.type)}
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-gray-800 text-sm leading-tight mb-2">{folder.name}</h4>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p className="flex items-center justify-center">
                        <CalendarOutlined className="mr-1" />
                        {folder.createdDate}
                      </p>
                      <p className="flex items-center justify-center">
                        <FileExcelOutlined className="mr-1" />
                        {folder.fileCount} file
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Fade effect on right */}
            <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-gray-25 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* 3. Files in Selected Folder - Table Layout */}
        {selectedFolder && (
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Các file trong folder: {selectedFolder.name}
              </h3>
              <button
                onClick={() => setSelectedFolder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-sm">Đóng</span>
              </button>
            </div>

            {/* File Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên file..."
                  value={searchFile}
                  onChange={(e) => setSearchFile(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>

            {/* Files Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kích thước</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedFolder.files.length > 0 ? (
                    selectedFolder.files.map(file => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                              {getFileIcon(file.type)}
                            </div>
                            <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{file.size}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{file.createdDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleDownloadFile(file)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Tải về"
                            >
                              <DownloadOutlined className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <DeleteOutlined className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        <FileExcelOutlined className="text-4xl mb-2 text-gray-300 mx-auto block" />
                        <p>Không có file nào trong folder này</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-3">
              {selectedFolder.files.length > 0 ? (
                selectedFolder.files.map(file => (
                  <div key={file.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          {getFileIcon(file.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{file.name}</h4>
                          <p className="text-xs text-gray-500">{file.size} • {file.createdDate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleDownloadFile(file)}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        <DownloadOutlined className="mr-2" />
                        Tải về
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file)}
                        className="flex-1 px-3 py-2 border border-red-200 text-red-600 rounded text-sm font-medium hover:bg-red-50 transition-colors"
                      >
                        <DeleteOutlined className="mr-2" />
                        Xóa
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileExcelOutlined className="text-4xl mb-2 text-gray-300 mx-auto block" />
                  <p>Không có file nào trong folder này</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Context Menu */}
        {showContextMenu && selectedContextItem && (
          <div
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
            style={{
              left: contextMenuPosition.x,
              top: contextMenuPosition.y
            }}
          >
            {selectedContextItem.type === 'recent-file' && (
              <>
                <button
                  onClick={() => {
                    handleDownloadReport(selectedContextItem)
                    closeContextMenu()
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <DownloadOutlined className="text-sm" />
                  <span>Tải về</span>
                </button>
                <button
                  onClick={() => {
                    handleDeleteReport(selectedContextItem)
                    closeContextMenu()
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <DeleteOutlined className="text-sm" />
                  <span>Xóa</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Thông tin báo cáo:\n\nTên file: ${selectedContextItem.duong_dan_file.split('/').pop()}\nLoại: ${selectedContextItem.ten_nhom ? 'Báo cáo nhóm' : 'Báo cáo người dùng'}\nNhóm: ${selectedContextItem.ten_nhom || 'Không có'}\nNgày báo cáo: ${new Date(selectedContextItem.ngay_bao_cao).toLocaleDateString('vi-VN')}\nNgày tạo: ${new Date(selectedContextItem.ngay_tao_bao_cao).toLocaleString('vi-VN')}`)
                    closeContextMenu()
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <EyeOutlined className="text-sm" />
                  <span>Xem thông tin chi tiết</span>
                </button>
              </>
            )}
            
            {selectedContextItem.type === 'folder' && (
              <>
                <button
                  onClick={() => handleDownloadZip(selectedContextItem)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <FileZipOutlined className="text-sm" />
                  <span>Tải về dạng ZIP</span>
                </button>
                <button
                  onClick={() => handleDeleteFolder(selectedContextItem)}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <DeleteOutlined className="text-sm" />
                  <span>Xóa</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Xem thông tin chi tiết:', selectedContextItem.name)
                    closeContextMenu()
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <EyeOutlined className="text-sm" />
                  <span>Xem thông tin chi tiết</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close context menu */}
      {showContextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeContextMenu}
        />
      )}
    </div>
  )
}

export default ReportsPage
