import React, { useState } from 'react'
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
  EyeOutlined
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

  const reportFolders = [
    {
      id: 1,
      name: 'Báo cáo nhóm Vận chuyển 1 từ ngày 01/01/2024 đến 31/01/2024',
      type: 'group',
      groupName: 'Vận chuyển 1',
      dateRange: '01/01/2024 - 31/01/2024',
      fileCount: 8,
      createdDate: '2024-01-15',
      files: [
        {
          id: 1,
          name: 'Báo cáo giao dịch - Vận chuyển 1.xlsx',
          type: 'excel',
          size: '1.2 MB',
          createdDate: '2024-01-15 10:30'
        },
        {
          id: 2,
          name: 'Báo cáo lịch xe - Vận chuyển 1.xlsx',
          type: 'excel',
          size: '0.8 MB',
          createdDate: '2024-01-15 11:15'
        }
      ]
    },
    {
      id: 2,
      name: 'Báo cáo của người dùng Nguyễn Văn A từ ngày 01/01/2024 đến 15/01/2024',
      type: 'user',
      userName: 'Nguyễn Văn A',
      dateRange: '01/01/2024 - 15/01/2024',
      fileCount: 5,
      createdDate: '2024-01-15',
      files: [
        {
          id: 3,
          name: 'Báo cáo giao dịch - Nguyễn Văn A.xlsx',
          type: 'excel',
          size: '0.9 MB',
          createdDate: '2024-01-15 14:20'
        },
        {
          id: 4,
          name: 'Báo cáo lịch xe - Nguyễn Văn A.xlsx',
          type: 'excel',
          size: '0.6 MB',
          createdDate: '2024-01-15 14:25'
        }
      ]
    },
    {
      id: 3,
      name: 'Báo cáo nhóm Vận chuyển 2 từ ngày 01/01/2024 đến 31/01/2024',
      type: 'group',
      groupName: 'Vận chuyển 2',
      dateRange: '01/01/2024 - 31/01/2024',
      fileCount: 6,
      createdDate: '2024-01-14',
      files: []
    },
    {
      id: 4,
      name: 'Báo cáo tổng hợp toàn công ty - Q4 2023',
      type: 'company',
      companyName: 'Toàn công ty',
      dateRange: '01/10/2023 - 31/12/2023',
      fileCount: 12,
      createdDate: '2024-01-13',
      files: [
        {
          id: 5,
          name: 'Báo cáo tài chính tổng hợp.xlsx',
          type: 'excel',
          size: '5.2 MB',
          createdDate: '2024-01-13 09:30'
        },
        {
          id: 6,
          name: 'Báo cáo nhân sự tổng hợp.xlsx',
          type: 'excel',
          size: '2.8 MB',
          createdDate: '2024-01-13 10:15'
        }
      ]
    },
    {
      id: 5,
      name: 'Báo cáo người dùng Lê Văn C từ ngày 01/12/2023 đến 31/12/2023',
      type: 'user',
      userName: 'Lê Văn C',
      dateRange: '01/12/2023 - 31/12/2023',
      fileCount: 7,
      createdDate: '2024-01-12',
      files: [
        {
          id: 7,
          name: 'Báo cáo giao dịch cá nhân.xlsx',
          type: 'excel',
          size: '1.1 MB',
          createdDate: '2024-01-12 16:45'
        }
      ]
    },
    {
      id: 6,
      name: 'Báo cáo nhóm Vận chuyển 3 từ ngày 01/01/2024 đến 31/01/2024',
      type: 'group',
      groupName: 'Vận chuyển 3',
      dateRange: '01/01/2024 - 31/01/2024',
      fileCount: 9,
      createdDate: '2024-01-11',
      files: [
        {
          id: 8,
          name: 'Báo cáo hiệu suất nhóm.xlsx',
          type: 'excel',
          size: '2.3 MB',
          createdDate: '2024-01-11 13:20'
        }
      ]
    },
    {
      id: 7,
      name: 'Báo cáo người dùng Hoàng Văn E từ ngày 01/11/2023 đến 30/11/2023',
      type: 'user',
      userName: 'Hoàng Văn E',
      dateRange: '01/11/2023 - 30/11/2023',
      fileCount: 4,
      createdDate: '2024-01-10',
      files: []
    },
    {
      id: 8,
      name: 'Báo cáo nhóm Vận chuyển 4 từ ngày 01/01/2024 đến 31/01/2024',
      type: 'group',
      groupName: 'Vận chuyển 4',
      dateRange: '01/01/2024 - 31/01/2024',
      fileCount: 11,
      createdDate: '2024-01-09',
      files: [
        {
          id: 9,
          name: 'Báo cáo chi phí vận hành.xlsx',
          type: 'excel',
          size: '3.7 MB',
          createdDate: '2024-01-09 11:45'
        },
        {
          id: 10,
          name: 'Báo cáo an toàn giao thông.xlsx',
          type: 'excel',
          size: '1.9 MB',
          createdDate: '2024-01-09 12:30'
        }
      ]
    },
    {
      id: 9,
      name: 'Báo cáo người dùng Trần Thị F từ ngày 01/10/2023 đến 31/10/2023',
      type: 'user',
      userName: 'Trần Thị F',
      dateRange: '01/10/2023 - 31/10/2023',
      fileCount: 6,
      createdDate: '2024-01-08',
      files: [
        {
          id: 11,
          name: 'Báo cáo hoạt động cá nhân.xlsx',
          type: 'excel',
          size: '1.4 MB',
          createdDate: '2024-01-08 15:20'
        }
      ]
    },
    {
      id: 10,
      name: 'Báo cáo nhóm Vận chuyển 5 từ ngày 01/01/2024 đến 31/01/2024',
      type: 'group',
      groupName: 'Vận chuyển 5',
      dateRange: '01/01/2024 - 31/01/2024',
      fileCount: 8,
      createdDate: '2024-01-07',
      files: []
    }
  ]

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

  const handleDownloadFile = (file) => {
    console.log('Tải về file:', file.name)
    // Xử lý logic tải về file
  }

  const handleDeleteFile = (file) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa file này?')) {
      console.log('Xóa file:', file.name)
      // Xử lý logic xóa file
    }
  }

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
        
        {/* 1. Recent Files Section - Horizontal Scroll */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Các file tạo gần đây</h3>
          <div className="relative">
            <div 
              className="flex space-x-6 overflow-x-auto pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
            >
              {recentFiles.map(file => (
                <div
                  key={file.id}
                  className="bg-white p-6 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 flex-shrink-0 w-80"
                  onContextMenu={(e) => handleContextMenu(e, { ...file, type: 'recent-file' })}
                >
                  <div className="w-24 h-24 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileExcelOutlined className="text-6xl text-green-600" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-gray-800 text-sm leading-tight mb-2">{file.name}</h4>
                    <p className="text-xs text-gray-500">
                      {file.size} • {file.lastModified}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Fade effect on right */}
            <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-gray-25 to-transparent pointer-events-none"></div>
          </div>
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
                  onClick={() => handleDownloadFile(selectedContextItem)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <DownloadOutlined className="text-sm" />
                  <span>Tải về</span>
                </button>
                <button
                  onClick={() => handleDeleteFile(selectedContextItem)}
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
