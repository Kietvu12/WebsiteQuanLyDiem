import React, { useState, useEffect } from 'react'
import { 
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  DollarOutlined,
  TeamOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  TransactionOutlined,
  CarOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  EyeOutlined,
  CloseOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { useGlobalState } from '../../contexts/GlobalStateContext'
import { transactionService } from '../../services/transactionService'
import { vehicleScheduleService } from '../../services/vehicleScheduleService'
import { reportService } from '../../services/reportService'

const UsersPage = () => {
  const { user: currentUser, isAuthenticated } = useAuth()
  const { users, updateUsers, addUser, updateUser, removeUser } = useGlobalState()
  const [searchUser, setSearchUser] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [activeTab, setActiveTab] = useState('transactions')
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: 'asc'
  })
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [transactionType, setTransactionType] = useState('all')
  const [scheduleStatus, setScheduleStatus] = useState('all')

  // State cho API
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userTransactions, setUserTransactions] = useState({})
  const [userSchedules, setUserSchedules] = useState({})
  
  // State cho modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showExportReportModal, setShowExportReportModal] = useState(false)
  const [exportingUser, setExportingUser] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [newUserData, setNewUserData] = useState({
    ten_dang_nhap: '',
    mat_khau: '',
    email: '',
    ho_ten: '',
    so_dien_thoai: '',
    dia_chi: ''
  })

  // Fetch tất cả người dùng
  const fetchUsers = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        updateUsers(data.data || [])
      } else {
        setError(data.message || 'Không thể lấy danh sách người dùng')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError(error.message || 'Có lỗi xảy ra khi tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  // Fetch giao dịch của người dùng
  const fetchUserTransactions = async (userId) => {
    if (!isAuthenticated || !userId) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:5000/api/users/${userId}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Xử lý logic hiển thị giao dịch theo vai trò người dùng
        const processedTransactions = processTransactionsForUser(data.data || [], userId, currentUser)
        setUserTransactions(prev => ({
          ...prev,
          [userId]: processedTransactions
        }))
      }
    } catch (error) {
      console.error('Error fetching user transactions:', error)
    }
  }

  // Xử lý logic hiển thị giao dịch theo vai trò người dùng
  const processTransactionsForUser = (transactions, targetUserId, currentUser) => {
    if (!transactions || transactions.length === 0) return []
    
    const isAdmin = currentUser?.la_admin === 1 || currentUser?.la_admin === true
    const isOwnUser = currentUser?.id_nguoi_dung === parseInt(targetUserId)
    
    // Nếu là admin xem giao dịch của người khác, hiển thị tất cả
    if (isAdmin && !isOwnUser) {
      return transactions
    }
    
    // Nếu là user thường xem giao dịch của mình hoặc admin xem giao dịch của mình
    const processedTransactions = []
    const processedScheduleIds = new Set()
    
    transactions.forEach(transaction => {
      const scheduleId = transaction.id_lich_xe
      
      // Nếu đã xử lý lịch xe này rồi, bỏ qua
      if (processedScheduleIds.has(scheduleId)) {
        return
      }
      
      // Tìm tất cả giao dịch liên quan đến lịch xe này
      const relatedTransactions = transactions.filter(t => t.id_lich_xe === scheduleId)
      
      if (relatedTransactions.length > 1) {
        // Có nhiều giao dịch liên quan (Giao lịch - Nhận lịch hoặc Hủy lịch)
        if (transaction.id_loai_giao_dich === 1) { // Giao lịch
          // Nếu là người giao lịch, chỉ hiển thị giao dịch giao lịch
          if (transaction.id_nguoi_gui === parseInt(targetUserId)) {
            processedTransactions.push(transaction)
            processedScheduleIds.add(scheduleId)
          }
        } else if (transaction.id_loai_giao_dich === 2) { // Nhận lịch
          // Nếu là người nhận lịch, chỉ hiển thị giao dịch nhận lịch
          if (transaction.id_nguoi_nhan === parseInt(targetUserId)) {
            processedTransactions.push(transaction)
            processedScheduleIds.add(scheduleId)
          }
        } else if (transaction.id_loai_giao_dich === 3) { // Hủy lịch
          // Gộp 2 giao dịch hủy lịch thành 1
          const cancelTransactions = relatedTransactions.filter(t => t.id_loai_giao_dich === 3)
          if (cancelTransactions.length === 2) {
            const senderCancel = cancelTransactions.find(t => t.id_nguoi_gui === parseInt(targetUserId))
            const receiverCancel = cancelTransactions.find(t => t.id_nguoi_nhan === parseInt(targetUserId))
            
            if (senderCancel || receiverCancel) {
              // Tạo giao dịch gộp
              const mergedTransaction = {
                ...transaction,
                noi_dung: `Hủy lịch xe #${scheduleId} - ${senderCancel ? 'Người giao' : 'Người nhận'} hủy`,
                is_merged: true,
                related_transactions: cancelTransactions
              }
              processedTransactions.push(mergedTransaction)
              processedScheduleIds.add(scheduleId)
            }
          }
        } else if (transaction.id_loai_giao_dich === 4 || transaction.id_loai_giao_dich === 5) { // San cho - Nhận san
          // Tương tự như giao lịch - nhận lịch
          if (transaction.id_loai_giao_dich === 4 && transaction.id_nguoi_gui === parseInt(targetUserId)) {
            processedTransactions.push(transaction)
            processedScheduleIds.add(scheduleId)
          } else if (transaction.id_loai_giao_dich === 5 && transaction.id_nguoi_nhan === parseInt(targetUserId)) {
            processedTransactions.push(transaction)
            processedScheduleIds.add(scheduleId)
          }
        }
      } else {
        // Chỉ có 1 giao dịch, hiển thị bình thường
        processedTransactions.push(transaction)
        processedScheduleIds.add(scheduleId)
      }
    })
    
    return processedTransactions
  }

  // Fetch lịch xe của người dùng
  const fetchUserSchedules = async (userId) => {
    if (!isAuthenticated || !userId) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:5000/api/users/${userId}/schedules`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setUserSchedules(prev => ({
          ...prev,
          [userId]: data.data || []
        }))
      }
    } catch (error) {
      console.error('Error fetching user schedules:', error)
    }
  }

  const transactionTypes = [
    { value: 'all', label: 'Tất cả loại giao dịch' },
    { value: 'nhan_lich', label: 'Nhận lịch' },
    { value: 'giao_lich', label: 'Giao lịch' },
    { value: 'san_cho', label: 'San cho' },
    { value: 'nhan_san', label: 'Nhận san' },
    { value: 'huy_lich', label: 'Hủy lịch' }
  ]

  const scheduleStatuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'cho_xac_nhan', label: 'Chờ xác nhận' },
    { value: 'da_xac_nhan', label: 'Đã xác nhận' },
    { value: 'dang_chay', label: 'Đang chạy' },
    { value: 'hoan_thanh', label: 'Hoàn thành' },
    { value: 'da_huy', label: 'Đã hủy' }
  ]

  // Load dữ liệu khi component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
    }
  }, [isAuthenticated])

  // Tạo người dùng mới
  const handleCreateUser = async () => {
    // Validation
    if (!newUserData.ten_dang_nhap.trim()) {
      setError('Tên đăng nhập không được để trống')
      return
    }
    if (!newUserData.mat_khau.trim()) {
      setError('Mật khẩu không được để trống')
      return
    }
    if (newUserData.mat_khau.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    if (!newUserData.email.trim()) {
      setError('Email không được để trống')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserData.email)) {
      setError('Email không đúng định dạng')
      return
    }
    if (!newUserData.ho_ten.trim()) {
      setError('Họ tên không được để trống')
      return
    }
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData)
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setShowCreateModal(false)
        setNewUserData({ ten_dang_nhap: '', mat_khau: '', email: '', ho_ten: '', so_dien_thoai: '', dia_chi: '' })
        fetchUsers()
        
        // Tạo thư mục báo cáo cho người dùng mới
        try {
          const token = localStorage.getItem('authToken')
          await reportService.createUserReportDirectory(token, data.data.id_nguoi_dung, data.data.ho_ten)
        } catch (error) {
          console.warn('Không thể tạo thư mục báo cáo:', error.message)
        }
        
        setError(null)
      } else {
        setError(data.message || 'Không thể tạo người dùng')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setError('Có lỗi xảy ra khi tạo người dùng')
    } finally {
      setLoading(false)
    }
  }

  // Sửa thông tin người dùng
  const handleEditUser = async (userId) => {
    const user = users.find(u => u.id_nguoi_dung === userId)
    if (user) {
      setEditingUser(user)
      setShowEditModal(true)
    }
  }

  // Cập nhật thông tin người dùng
  const handleUpdateUser = async () => {
    if (!editingUser) return
    
    // Validation
    if (!editingUser.ho_ten.trim()) {
      setError('Họ tên không được để trống')
      return
    }
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:5000/api/users/${editingUser.id_nguoi_dung}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ho_ten: editingUser.ho_ten,
          so_dien_thoai: editingUser.so_dien_thoai,
          dia_chi: editingUser.dia_chi
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setShowEditModal(false)
        setEditingUser(null)
        fetchUsers()
        setError(null)
      } else {
        setError(data.message || 'Không thể cập nhật người dùng')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Có lỗi xảy ra khi cập nhật người dùng')
    } finally {
      setLoading(false)
    }
  }

  // Xóa người dùng
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        removeUser(userId)
        setError(null)
      } else {
        setError(data.message || 'Không thể xóa người dùng')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('Có lỗi xảy ra khi xóa người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = (user) => {
    setExportingUser(user)
    setShowExportReportModal(true)
  }

  const handleExportUserReport = async (reportType, startDate, endDate) => {
    if (!exportingUser) return
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      let response
      
      if (reportType === 'transactions') {
        response = await reportService.exportUserTransactionsReport(token, exportingUser.id_nguoi_dung, startDate, endDate)
      } else if (reportType === 'schedules') {
        response = await reportService.exportUserSchedulesReport(token, exportingUser.id_nguoi_dung, startDate, endDate)
      }
      
      if (response.success) {
        alert(`Xuất báo cáo thành công!\nFile: ${response.data.fileName}\nSố bản ghi: ${response.data.recordCount}`)
        setShowExportReportModal(false)
        setExportingUser(null)
      }
    } catch (error) {
      alert(`Lỗi khi xuất báo cáo: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUserClick = async (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
    setActiveTab('transactions')
    
    // Load dữ liệu chi tiết nếu chưa có
    if (!userTransactions[user.id_nguoi_dung]) {
      await fetchUserTransactions(user.id_nguoi_dung)
    }
    if (!userSchedules[user.id_nguoi_dung]) {
      await fetchUserSchedules(user.id_nguoi_dung)
    }
  }

  const closeUserModal = () => {
    setShowUserModal(false)
    setSelectedUser(null)
  }

  const handleSort = (field) => {
    let direction = 'asc'
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ field, direction })
  }

  // Lọc và sắp xếp người dùng
  const getFilteredAndSortedUsers = () => {
    let filteredUsers = users

    // Lọc theo tìm kiếm
    if (searchUser.trim()) {
      filteredUsers = users.filter(user => 
        user.ho_ten.toLowerCase().includes(searchUser.toLowerCase()) ||
        user.ten_dang_nhap.toLowerCase().includes(searchUser.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchUser.toLowerCase()))
      )
    }

    // Sắp xếp
    if (!sortConfig.field) return filteredUsers

    return [...filteredUsers].sort((a, b) => {
      let aValue = a[sortConfig.field]
      let bValue = b[sortConfig.field]

      // Xử lý số dư và điểm
      if (sortConfig.field === 'so_du' || sortConfig.field === 'diem') {
        aValue = parseFloat(aValue || 0)
        bValue = parseFloat(bValue || 0)
        
        if (sortConfig.direction === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      }

      // Xử lý text
      if (typeof aValue === 'string') {
        if (sortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue, 'vi')
        } else {
          return bValue.localeCompare(aValue, 'vi')
        }
      }

      return 0
    })
  }

  const getTransactionTypeInfo = (type) => {
    const typeConfig = {
      'nhan_lich': { label: 'Nhận lịch', color: 'bg-green-50 text-green-600 border-green-100' },
      'giao_lich': { label: 'Giao lịch', color: 'bg-red-50 text-red-600 border-red-100' },
      'san_cho': { label: 'San cho', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      'nhan_san': { label: 'Nhận san', color: 'bg-green-50 text-green-600 border-green-100' },
      'huy_lich': { label: 'Hủy lịch', color: 'bg-orange-50 text-orange-600 border-orange-100' }
    }
    return typeConfig[type] || typeConfig['nhan_lich']
  }

  const getStatusInfo = (status) => {
    const statusConfig = {
      'cho_xac_nhan': { label: 'Chờ xác nhận', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
      'da_xac_nhan': { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      'dang_chay': { label: 'Đang chạy', color: 'bg-green-50 text-green-600 border-green-100' },
      'hoan_thanh': { label: 'Hoàn thành', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      'da_huy': { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-100' }
    }
    return statusConfig[status] || statusConfig['cho_xac_nhan']
  }

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return <SortAscendingOutlined className="text-gray-400 text-xs ml-1" />
    }
    return sortConfig.direction === 'asc' 
      ? <SortAscendingOutlined className="text-blue-500 text-xs ml-1" />
      : <SortDescendingOutlined className="text-blue-500 text-xs ml-1" />
  }

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Quản lý Người dùng</h1>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <ExclamationCircleOutlined className="text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Search and Create Section */}
        <div className="bg-white mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, tài khoản hoặc email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                />
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
            >
              <PlusOutlined className="text-sm" />
              <span>Thêm người dùng mới</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Bảng danh sách người dùng</h3>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <LoadingOutlined className="text-4xl text-blue-500 mb-4" />
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('ho_ten')}
                          className="flex items-center hover:text-gray-700 transition-colors"
                        >
                          Tên người dùng
                          {getSortIcon('ho_ten')}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('ten_dang_nhap')}
                          className="flex items-center hover:text-gray-700 transition-colors"
                        >
                          Tài khoản
                          {getSortIcon('ten_dang_nhap')}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mật khẩu
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('so_du')}
                          className="flex items-center justify-center hover:text-gray-700 transition-colors"
                        >
                          Số dư tiền
                          {getSortIcon('so_du')}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('diem')}
                          className="flex items-center justify-center hover:text-gray-700 transition-colors"
                        >
                          Điểm
                          {getSortIcon('diem')}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredAndSortedUsers().length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          {searchUser ? 'Không tìm thấy người dùng nào phù hợp' : 'Chưa có người dùng nào'}
                        </td>
                      </tr>
                    ) : (
                      getFilteredAndSortedUsers().map(user => (
                        <tr 
                          key={user.id_nguoi_dung}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleUserClick(user)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                              <UserOutlined className="text-white text-xs" />
                            </div>
                              <div className="text-sm font-medium text-gray-900">{user.ho_ten}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.ten_dang_nhap}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-500">••••••••</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <DollarOutlined className="text-green-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                                {parseFloat(user.so_du || 0).toLocaleString('vi-VN')} VNĐ
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <TeamOutlined className="text-purple-500 mr-2" />
                              <span className="text-sm font-medium text-gray-900">{parseFloat(user.diem || 0).toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleExportReport(user)
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xuất báo cáo"
                            >
                              <FileTextOutlined className="text-sm" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                  handleEditUser(user.id_nguoi_dung)
                              }}
                                className="p-2 text-green-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Sửa thông tin"
                            >
                              <EditOutlined className="text-sm" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                  handleDeleteUser(user.id_nguoi_dung)
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa người dùng"
                            >
                              <DeleteOutlined className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 space-y-4">
                {getFilteredAndSortedUsers().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <UserOutlined className="text-4xl mb-2 text-gray-300 mx-auto block" />
                    <p>{searchUser ? 'Không tìm thấy người dùng nào phù hợp' : 'Chưa có người dùng nào'}</p>
                  </div>
                ) : (
                  getFilteredAndSortedUsers().map(user => (
                    <div
                      key={user.id_nguoi_dung}
                      className="p-4 border border-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                            <UserOutlined className="text-white text-sm" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-base">{user.ho_ten}</h4>
                            <p className="text-sm text-gray-500">{user.ten_dang_nhap}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditUser(user.id_nguoi_dung)
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Sửa thông tin"
                          >
                            <EditOutlined className="text-sm" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteUser(user.id_nguoi_dung)
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa người dùng"
                          >
                            <DeleteOutlined className="text-sm" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center justify-center p-2 bg-green-50 rounded-lg">
                          <DollarOutlined className="text-green-500 mr-2" />
                          <span className="font-medium">{parseFloat(user.so_du || 0).toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <div className="flex items-center justify-center p-2 bg-purple-50 rounded-lg">
                          <TeamOutlined className="text-purple-500 mr-2" />
                          <span className="font-medium">{parseFloat(user.diem || 0).toFixed(2)} điểm</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tạo người dùng mới</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập *</label>
                  <input
                    type="text"
                    value={newUserData.ten_dang_nhap}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, ten_dang_nhap: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu *</label>
                  <input
                    type="password"
                    value={newUserData.mat_khau}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, mat_khau: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên *</label>
                  <input
                    type="text"
                    value={newUserData.ho_ten}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, ho_ten: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={newUserData.so_dien_thoai}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, so_dien_thoai: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  <textarea
                    value={newUserData.dia_chi}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, dia_chi: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewUserData({ ten_dang_nhap: '', mat_khau: '', email: '', ho_ten: '', so_dien_thoai: '', dia_chi: '' })
                    setError(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoadingOutlined /> : 'Tạo người dùng'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sửa thông tin người dùng</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
                  <input
                    type="text"
                    value={editingUser.ten_dang_nhap}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tên đăng nhập không thể thay đổi</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingUser.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên *</label>
                  <input
                    type="text"
                    value={editingUser.ho_ten || ''}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, ho_ten: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={editingUser.so_dien_thoai || ''}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, so_dien_thoai: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  <textarea
                    value={editingUser.dia_chi || ''}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, dia_chi: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                    setError(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoadingOutlined /> : 'Cập nhật'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Chi tiết người dùng: {selectedUser.ho_ten}
                </h3>
                <button
                  onClick={closeUserModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseOutlined className="text-lg" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'transactions'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Lịch sử giao dịch ({(userTransactions[selectedUser.id_nguoi_dung] || []).length})
                    </button>
                    <button
                      onClick={() => setActiveTab('schedules')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'schedules'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Lịch sử lịch xe ({(userSchedules[selectedUser.id_nguoi_dung] || []).length})
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'transactions' && (
                  <div>
                    {/* Filters for Transactions */}
                    <div className="flex items-center space-x-4 mb-4">
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
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Loại giao dịch:</label>
                        <select
                          value={transactionType}
                          onChange={(e) => setTransactionType(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          {transactionTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Transactions List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {(userTransactions[selectedUser.id_nguoi_dung] || []).length > 0 ? (
                        (userTransactions[selectedUser.id_nguoi_dung] || []).map(transaction => {
                          const typeInfo = getTransactionTypeInfo(transaction.id_loai_giao_dich)
                          return (
                            <div key={transaction.id_giao_dich} className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">{transaction.noi_dung}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(transaction.ngay_tao).toLocaleString('vi-VN')}
                                  </p>
                                  {transaction.is_merged && (
                                    <p className="text-xs text-blue-600 mt-1">
                                      ⚡ Giao dịch gộp từ nhiều bên
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${typeInfo.color}`}>
                                    {typeInfo.label}
                                  </span>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-gray-800">
                                      {parseFloat(transaction.so_tien || 0).toLocaleString('vi-VN')} VNĐ
                                    </p>
                                    <p className="text-xs text-gray-500">{parseFloat(transaction.diem || 0).toFixed(2)} điểm</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <TransactionOutlined className="text-4xl mb-2 text-gray-300" />
                          <p>Không có giao dịch nào</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'schedules' && (
                  <div>
                    {/* Filters for Schedules */}
                    <div className="flex items-center space-x-4 mb-4">
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
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
                        <select
                          value={scheduleStatus}
                          onChange={(e) => setScheduleStatus(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          {scheduleStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Schedules List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {(userSchedules[selectedUser.id_nguoi_dung] || []).length > 0 ? (
                        (userSchedules[selectedUser.id_nguoi_dung] || []).map(schedule => {
                          const statusInfo = getStatusInfo(schedule.trang_thai)
                          return (
                            <div key={schedule.id_lich_xe} className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    Lịch xe #{schedule.id_lich_xe}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(schedule.thoi_gian_bat_dau_don).toLocaleString('vi-VN')} - {new Date(schedule.thoi_gian_ket_thuc_don).toLocaleString('vi-VN')}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Loại xe: {schedule.id_loai_xe} chỗ | Loại tuyến: {schedule.id_loai_tuyen}
                                  </p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <CarOutlined className="text-4xl mb-2 text-gray-300" />
                          <p>Không có lịch xe nào</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Export Report Modal */}
        {showExportReportModal && exportingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Xuất báo cáo người dùng: {exportingUser.ho_ten}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại báo cáo</label>
                  <select
                    id="reportType"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue="transactions"
                  >
                    <option value="transactions">Báo cáo giao dịch</option>
                    <option value="schedules">Báo cáo lịch xe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                  <input
                    type="date"
                    id="startDate"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                  <input
                    type="date"
                    id="endDate"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <p>Báo cáo sẽ bao gồm:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Thông tin chi tiết theo loại báo cáo đã chọn</li>
                    <li>Thống kê theo khoảng thời gian</li>
                    <li>Dữ liệu được sắp xếp theo thời gian</li>
                  </ul>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowExportReportModal(false)
                    setExportingUser(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    const reportType = document.getElementById('reportType').value
                    const startDate = document.getElementById('startDate').value
                    const endDate = document.getElementById('endDate').value
                    if (startDate && endDate) {
                      handleExportUserReport(reportType, startDate, endDate)
                    } else {
                      alert('Vui lòng chọn khoảng thời gian')
                    }
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang xuất...' : 'Xuất báo cáo'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersPage
