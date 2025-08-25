import React, { useState, useEffect, useMemo } from 'react'
import { 
  TransactionOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { useGlobalState } from '../../contexts/GlobalStateContext'
import { transactionService } from '../../services/transactionService'
import { formatTime, formatDate, formatMoney } from '../../utils/dateUtils'
import PointCalculationDisplay from '../../components/PointCalculationDisplay'

const HomePage = () => {
  const { user } = useAuth()
  const { transactions, updateTransactions, updateTransaction } = useGlobalState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    searchText: '',
    selectedGroup: '',
    selectedStatus: '',
    dateRange: null,
    selectedUser: ''
  })
  
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Không cần loadTransactions nữa vì dữ liệu sẽ được cập nhật tự động từ global state
  // Chỉ set loading false sau khi component mount
  useEffect(() => {
    if (user) {
      // Dữ liệu sẽ được load tự động từ real-time service
      setLoading(false)
    }
  }, [user])

  // Xác nhận giao dịch
  const handleConfirm = async (transactionId) => {
    setProcessingId(transactionId)
    try {
      const token = localStorage.getItem('authToken')
      const response = await transactionService.confirmTransaction(token, transactionId)
      
      if (response.success) {
        // Cập nhật trạng thái giao dịch
        updateTransaction(transactionId, { trang_thai: 'hoan_thanh' }) // Use updateTransaction from global state
      }
    } catch (error) {
      console.error('Error confirming transaction:', error)
      setError('Không thể xác nhận giao dịch')
    } finally {
      setProcessingId(null)
    }
  }

  // Hủy giao dịch
  const handleCancel = async (transactionId) => {
    setProcessingId(transactionId)
    try {
      const token = localStorage.getItem('authToken')
      const response = await transactionService.cancelTransaction(token, transactionId)
      
      if (response.success) {
        // Cập nhật trạng thái giao dịch
        updateTransaction(transactionId, { trang_thai: 'da_huy' }) // Use updateTransaction from global state
      }
    } catch (error) {
      console.error('Error cancelling transaction:', error)
      setError('Không thể hủy giao dịch')
    } finally {
      setProcessingId(null)
    }
  }

  // Lấy icon cho loại giao dịch
  const getTransactionIcon = (type) => {
    switch (type) {
      case 1: // Giao lịch
        return <ExclamationCircleOutlined className="text-red-500" />
      case 2: // Nhận lịch
        return <CheckCircleOutlined className="text-green-500" />
      case 4: // San cho
        return <InfoCircleOutlined className="text-blue-500" />
      case 5: // Nhận san
        return <CheckCircleOutlined className="text-green-500" />
      default:
        return <InfoCircleOutlined className="text-gray-500" />
    }
  }

  // Lấy label cho loại giao dịch
  const getTransactionLabel = (type) => {
    switch (type) {
      case 1: return 'Giao lịch'
      case 2: return 'Nhận lịch'
      case 4: return 'San cho'
      case 5: return 'Nhận san'
      default: return 'Khác'
    }
  }

  // Lấy màu cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case 'cho_xac_nhan':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hoan_thanh':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'da_huy':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Lấy label cho trạng thái
  const getStatusLabel = (status) => {
    switch (status) {
      case 'cho_xac_nhan':
        return 'Chờ xác nhận'
      case 'hoan_thanh':
        return 'Hoàn thành'
      case 'da_huy':
        return 'Đã hủy'
      default:
        return 'Không xác định'
    }
  }

  // Xác định quyền thao tác với giao dịch
  const canAction = (transaction) => {
    // Chỉ hiển thị nút khi giao dịch đang chờ xác nhận
    if (transaction.trang_thai !== 'cho_xac_nhan') {
      return 'none';
    }

    // Người nhận giao dịch giao lịch có thể xác nhận
    if (transaction.id_loai_giao_dich === 1 && 
        transaction.id_nguoi_nhan === user.id_nguoi_dung) {
      return 'confirm';
    }

    // Người gửi hoặc admin có thể hủy
    if (transaction.id_nguoi_gui === user.id_nguoi_dung || 
        user.la_admin === 1 || 
        user.la_admin === true) {
      return 'cancel';
    }

    return 'none';
  }

  // Filter logic
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by search text (tên người gửi/nhận)
    if (filters.searchText) {
      filtered = filtered.filter(transaction => 
        (transaction.ten_nguoi_gui && transaction.ten_nguoi_gui.toLowerCase().includes(filters.searchText.toLowerCase())) ||
        (transaction.ten_nguoi_nhan && transaction.ten_nguoi_nhan.toLowerCase().includes(filters.searchText.toLowerCase()))
      );
    }

    // Filter by group
    if (filters.selectedGroup) {
      filtered = filtered.filter(transaction => 
        transaction.ten_nhom === filters.selectedGroup
      );
    }

    // Filter by status
    if (filters.selectedStatus) {
      filtered = filtered.filter(transaction => 
        transaction.trang_thai === filters.selectedStatus
      );
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange.length === 2) {
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      endDate.setHours(23, 59, 59, 999); // End of day
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.ngay_tao);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    // Filter by specific user
    if (filters.selectedUser) {
      filtered = filtered.filter(transaction => 
        transaction.ten_nguoi_gui === filters.selectedUser ||
        transaction.ten_nguoi_nhan === filters.selectedUser
      );
    }

    return filtered;
  }, [transactions, filters]);

  // Get unique values for filter options
  const uniqueGroups = useMemo(() => {
    const groups = [...new Set(transactions.map(t => t.ten_nhom).filter(Boolean))];
    return groups.sort();
  }, [transactions]);

  const uniqueUsers = useMemo(() => {
    const users = new Set();
    transactions.forEach(t => {
      if (t.ten_nguoi_gui) users.add(t.ten_nguoi_gui);
      if (t.ten_nguoi_nhan) users.add(t.ten_nguoi_nhan);
    });
    return Array.from(users).sort();
  }, [transactions]);

  const statusOptions = [
    { value: 'cho_xac_nhan', label: 'Chờ xác nhận' },
    { value: 'hoan_thanh', label: 'Hoàn thành' },
    { value: 'da_huy', label: 'Đã hủy' }
  ];

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchText: '',
      selectedGroup: '',
      selectedStatus: '',
      dateRange: null,
      selectedUser: ''
    });
  };

  // Handle search input with suggestions
  const handleSearchChange = (value) => {
    handleFilterChange('searchText', value);
    
    if (value.length > 0) {
      const filtered = uniqueUsers.filter(user => 
        user.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    handleFilterChange('searchText', suggestion);
    setShowSuggestions(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingOutlined className="text-4xl text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {user.la_admin === 1 || user.la_admin === true ? 'Quản lý giao dịch' : 'Giao dịch của tôi'}
          </h1>
          <p className="text-gray-600">
            {user.la_admin === 1 || user.la_admin === true 
              ? 'Theo dõi và quản lý tất cả giao dịch trong hệ thống' 
              : 'Theo dõi các giao dịch liên quan đến bạn (giao lịch, nhận lịch, san cho, nhận san)'
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {user.la_admin === 1 || user.la_admin === true ? 'Tổng giao dịch' : 'Giao dịch của tôi'}
            </p>
            <p className="text-2xl font-bold text-blue-600">{filteredTransactions.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Chờ xác nhận</p>
            <p className="text-2xl font-bold text-yellow-600">
              {filteredTransactions.filter(t => t.trang_thai === 'cho_xac_nhan').length}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FilterOutlined className="mr-2" />
              Bộ lọc giao dịch
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="px-6 py-4 space-y-4">
            {/* Search and User Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Box with Suggestions */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm theo tên người gửi/nhận
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.searchText}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Nhập tên để tìm kiếm..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <SearchOutlined className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo người dùng cụ thể
                </label>
                <select
                  value={filters.selectedUser}
                  onChange={(e) => handleFilterChange('selectedUser', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả người dùng</option>
                  {uniqueUsers.map((userName) => (
                    <option key={userName} value={userName}>
                      {userName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Group and Status Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Group Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo nhóm
                </label>
                <select
                  value={filters.selectedGroup}
                  onChange={(e) => handleFilterChange('selectedGroup', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả nhóm</option>
                  {uniqueGroups.map((groupName) => (
                    <option key={groupName} value={groupName}>
                      {groupName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo trạng thái
                </label>
                <select
                  value={filters.selectedStatus}
                  onChange={(e) => handleFilterChange('selectedStatus', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả trạng thái</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Range Filter Row */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo khoảng thời gian
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={filters.dateRange?.[0] || ''}
                  onChange={(e) => {
                    const newRange = filters.dateRange ? [e.target.value, filters.dateRange[1]] : [e.target.value, ''];
                    handleFilterChange('dateRange', newRange);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={filters.dateRange?.[1] || ''}
                  onChange={(e) => {
                    const newRange = filters.dateRange ? [filters.dateRange[0], e.target.value] : ['', e.target.value];
                    handleFilterChange('dateRange', newRange);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-gray-600">
                Hiển thị {filteredTransactions.length} giao dịch trong tổng số {transactions.length} giao dịch
              </div>
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ClearOutlined className="mr-2" />
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {user.la_admin === 1 || user.la_admin === true ? 'Danh sách giao dịch' : 'Giao dịch của tôi'}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <TransactionOutlined className="text-4xl mb-4 text-gray-300" />
              <p>
                {transactions.length === 0 
                  ? (user.la_admin === 1 || user.la_admin === true 
                      ? 'Chưa có giao dịch nào trong hệ thống' 
                      : 'Bạn chưa có giao dịch nào (giao lịch, nhận lịch, san cho, nhận san)'
                    )
                  : 'Không có giao dịch nào khớp với bộ lọc đã chọn'
                }
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Layout */}
              <div className="hidden md:block">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id_giao_dich} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      {/* Transaction Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {getTransactionIcon(transaction.id_loai_giao_dich)}
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {getTransactionLabel(transaction.id_loai_giao_dich)}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {transaction.noi_dung}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Người gửi:</span>
                            <p className="font-medium">{transaction.ten_nguoi_gui || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Người nhận:</span>
                            <p className="font-medium">{transaction.ten_nguoi_nhan || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Nhóm:</span>
                            <p className="font-medium">{transaction.ten_nhom || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Loại giao dịch:</span>
                            <p className="font-medium">{transaction.ten_loai_giao_dich || 'N/A'}</p>
                          </div>
                          
                          {/* Số tiền và điểm - Logic mới */}
                          {(transaction.so_tien || transaction.diem) && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                {transaction.so_tien && (
                                  <div>
                                    <span className="text-gray-600">Số tiền:</span>
                                    <p className={`font-medium ${
                                      // Logic mới: 
                                      // - Giao lịch (id=1): người giao lịch ĐƯỢC cộng tiền (+)
                                      // - Nhận lịch (id=2): người nhận lịch BỊ trừ tiền (-)
                                      // - San cho (id=4): người san cho BỊ trừ tiền (-)
                                      // - Nhận san (id=5): người nhận san ĐƯỢC cộng tiền (+)
                                      (transaction.id_loai_giao_dich === 1 || transaction.id_loai_giao_dich === 5) ? 'text-green-600' : 
                                      (transaction.id_loai_giao_dich === 2 || transaction.id_loai_giao_dich === 4) ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                      {(transaction.id_loai_giao_dich === 1 || transaction.id_loai_giao_dich === 5) ? '+' : ''}
                                      {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                      }).format(Math.abs(transaction.so_tien))}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {transaction.id_loai_giao_dich === 1 ? 'Người giao lịch được cộng' :
                                       transaction.id_loai_giao_dich === 2 ? 'Người nhận lịch bị trừ' :
                                       transaction.id_loai_giao_dich === 4 ? 'Người san cho bị trừ' :
                                       transaction.id_loai_giao_dich === 5 ? 'Người nhận san được cộng' : ''}
                                    </p>
                                  </div>
                                )}
                                {transaction.diem && (
                                  <div>
                                    <span className="text-gray-600">Số điểm:</span>
                                    <p className={`font-medium ${
                                      // Logic tương tự như tiền
                                      (transaction.id_loai_giao_dich === 1 || transaction.id_loai_giao_dich === 5) ? 'text-green-600' : 
                                      (transaction.id_loai_giao_dich === 2 || transaction.id_loai_giao_dich === 4) ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                      {(transaction.id_loai_giao_dich === 1 || transaction.id_loai_giao_dich === 5) ? '+' : ''}
                                      {Math.abs(transaction.diem)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {transaction.id_loai_giao_dich === 1 ? 'Người giao lịch được cộng' :
                                       transaction.id_loai_giao_dich === 2 ? 'Người nhận lịch bị trừ' :
                                       transaction.id_loai_giao_dich === 4 ? 'Người san cho bị trừ' :
                                       transaction.id_loai_giao_dich === 5 ? 'Người nhận san được cộng' : ''}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Vehicle Schedule Info - Chỉ hiển thị khi có lịch xe */}
                        {transaction.id_lich_xe && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                              <CarOutlined className="mr-2" />
                              Thông tin lịch xe
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Loại xe:</span>
                                <p className="font-medium text-blue-700">
                                  {transaction.ten_loai_xe} ({transaction.so_cho} chỗ)
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600">Loại tuyến:</span>
                                <p className="font-medium text-blue-700">
                                  {transaction.ten_loai_tuyen}
                                  {transaction.la_khu_hoi && ' (Khứ hồi)'}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600">Bắt đầu đón:</span>
                                <p className="font-medium text-blue-700">
                                  {formatTime(transaction.thoi_gian_bat_dau_don)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600">Kết thúc đón:</span>
                                <p className="font-medium text-blue-700">
                                  {formatTime(transaction.thoi_gian_ket_thuc_don)}
                                </p>
                              </div>
                            </div>
                            {(transaction.thoi_gian_bat_dau_tra || transaction.thoi_gian_ket_thuc_tra) && (
                              <div className="mt-3 pt-3 border-t border-blue-200">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Bắt đầu trả:</span>
                                    <p className="font-medium text-blue-700">
                                      {formatTime(transaction.thoi_gian_bat_dau_tra)}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Kết thúc trả:</span>
                                    <p className="font-medium text-blue-700">
                                      {formatTime(transaction.thoi_gian_ket_thuc_tra)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                                                         {/* Hiển thị người nhận lịch nếu có */}
                             {transaction.id_nguoi_nhan_lich && (
                               <div className="mt-3 pt-3 border-t border-blue-200">
                                 <div className="text-sm">
                                   <span className="text-gray-600">Người nhận lịch:</span>
                                   <p className="font-medium text-blue-700">
                                     {transaction.ten_nguoi_nhan_lich || 'N/A'}
                                   </p>
                                 </div>
                               </div>
                             )}
                           </div>
                         )}
                         
                         {/* Hiển thị thông tin tính điểm */}
                         <PointCalculationDisplay 
                           transaction={transaction}
                           lichXeData={{
                             so_cho: transaction.so_cho,
                             gia_ve: transaction.so_tien,
                             thoi_gian_bat_dau_don: transaction.thoi_gian_bat_dau_don,
                             thoi_gian_bat_dau_tra: transaction.thoi_gian_bat_dau_tra,
                             la_khu_hoi: transaction.la_khu_hoi,
                             la_don_san_bay: transaction.la_don_san_bay,
                             la_tien_san_bay: transaction.la_tien_san_bay,
                             la_lich_pho: transaction.la_lich_pho,
                             khoang_cach_km: transaction.khoang_cach_km
                           }}
                         />
                        
                        <div className="mt-3 text-xs text-gray-400">
                          {formatDate(transaction.ngay_tao)}
                        </div>
                      </div>
                      
                      {/* Status and Actions */}
                      <div className="flex flex-col items-end space-y-3">
                        {/* Status Badge */}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.trang_thai)}`}>
                          {getStatusLabel(transaction.trang_thai)}
                        </span>
                        
                        {/* Action Buttons */}
                        {/* Hiển thị nút hành động chỉ khi giao dịch chưa xử lý */}
                        {transaction.trang_thai === 'cho_xac_nhan' && (
                          <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200">
                            {/* Nút xác nhận - chỉ hiển thị cho người nhận giao dịch giao lịch */}
                            {transaction.id_loai_giao_dich === 1 &&
                             transaction.id_nguoi_nhan === user.id_nguoi_dung && (
                              <button
                                onClick={() => handleConfirm(transaction.id_giao_dich)}
                                disabled={processingId === transaction.id_giao_dich}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                              >
                                {processingId === transaction.id_giao_dich ? (
                                  <LoadingOutlined className="animate-spin" />
                                ) : (
                                  <CheckOutlined />
                                )}
                                <span>Xác nhận</span>
                              </button>
                            )}

                            {/* Nút hủy cho người nhận giao dịch giao lịch */}
                            {transaction.id_loai_giao_dich === 1 &&
                             transaction.id_nguoi_nhan === user.id_nguoi_dung && (
                              <button
                                onClick={() => handleCancel(transaction.id_giao_dich)}
                                disabled={processingId === transaction.id_giao_dich}
                                className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                              >
                                {processingId === transaction.id_giao_dich ? (
                                  <LoadingOutlined className="animate-spin" />
                                ) : (
                                  <CloseCircleOutlined />
                                )}
                                <span>Hủy</span>
                              </button>
                            )}
                           
                            {/* Nút hủy - hiển thị cho người gửi hoặc admin (người nhận đã có nút riêng ở trên) */}
                            {(transaction.id_nguoi_gui === user.id_nguoi_dung || 
                              user.la_admin === 1 || 
                              user.la_admin === true) && (
                             <button
                               onClick={() => handleCancel(transaction.id_giao_dich)}
                               disabled={processingId === transaction.id_giao_dich}
                               className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                             >
                               {processingId === transaction.id_giao_dich ? (
                                 <LoadingOutlined className="animate-spin" />
                               ) : (
                                 <CloseCircleOutlined />
                               )}
                               <span>Hủy</span>
                             </button>
                           )}
                           
                                                                          {/* Nếu không có nút nào được hiển thị, hiển thị thông báo */}
                           {!((transaction.id_loai_giao_dich === 1 && transaction.id_nguoi_nhan === user.id_nguoi_dung) ||
                              (transaction.id_nguoi_gui === user.id_nguoi_dung || user.la_admin === 1 || user.la_admin === true)) && (
                             <div className="w-full text-center text-sm text-gray-500 py-2">
                               Bạn không có quyền thực hiện hành động này
                             </div>
                           )}
                                            </div>
                        )}

                        {/* Hiển thị trạng thái giao dịch khi đã được xử lý */}
                        {transaction.trang_thai && transaction.trang_thai !== 'cho_xac_nhan' && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-center">
                              <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                                transaction.trang_thai === 'hoan_thanh' 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : transaction.trang_thai === 'da_huy'
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}>
                                {transaction.trang_thai === 'hoan_thanh' ? 
                                  (transaction.id_loai_giao_dich === 4 || transaction.id_loai_giao_dich === 5) 
                                    ? '✅ Giao dịch đã hoàn thành' 
                                    : '✅ Giao dịch đã được xác nhận' :
                                 transaction.trang_thai === 'da_huy' ? '❌ Giao dịch đã bị hủy' :
                                 transaction.trang_thai}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id_giao_dich} className="p-4 border border-gray-200 rounded-lg bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getTransactionIcon(transaction.id_loai_giao_dich)}
                        <span className="font-medium text-gray-800 text-sm">
                          {getTransactionLabel(transaction.id_loai_giao_dich)}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.trang_thai)}`}>
                        {getStatusLabel(transaction.trang_thai)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mb-3">
                      <p className="text-sm text-gray-700">{transaction.noi_dung}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Gửi: {transaction.ten_nguoi_gui || 'N/A'}</p>
                        <p>Nhận: {transaction.ten_nguoi_nhan || 'N/A'}</p>
                        <p>Nhóm: {transaction.ten_nhom || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Amount and Points */}
                    {(transaction.so_tien || transaction.diem) && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {transaction.so_tien && (
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <p className={`text-sm font-medium ${
                              (transaction.id_loai_giao_dich === 1 || transaction.id_loai_giao_dich === 5) ? 'text-green-600' : 
                              (transaction.id_loai_giao_dich === 2 || transaction.id_loai_giao_dich === 4) ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {(transaction.id_loai_giao_dich === 1 || transaction.id_loai_giao_dich === 5) ? '+' : ''}
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(Math.abs(transaction.so_tien))}
                            </p>
                          </div>
                        )}
                        {transaction.diem && (
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <p className={`text-sm font-medium ${
                              (transaction.id_loai_giao_dich === 1 || transaction.id_loai_giao_dich === 5) ? 'text-green-600' : 
                              (transaction.id_loai_giao_dich === 2 || transaction.id_loai_giao_dich === 4) ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {(transaction.id_loai_giao_dich === 1 || transaction.id_loai_giao_dich === 5) ? '+' : ''}
                              {Math.abs(transaction.diem)} điểm
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {transaction.trang_thai === 'cho_xac_nhan' && (
                      <div className="flex space-x-2 pt-3 border-t border-gray-100">
                        {transaction.id_loai_giao_dich === 1 && transaction.id_nguoi_nhan === user.id_nguoi_dung && (
                          <button
                            onClick={() => handleConfirm(transaction.id_giao_dich)}
                            disabled={processingId === transaction.id_giao_dich}
                            className="flex-1 px-3 py-2 bg-green-500 text-white rounded text-sm font-medium disabled:opacity-50"
                          >
                            {processingId === transaction.id_giao_dich ? 'Đang xử lý...' : 'Xác nhận'}
                          </button>
                        )}
                        {(transaction.id_nguoi_gui === user.id_nguoi_dung || user.la_admin === 1 || user.la_admin === true) && (
                          <button
                            onClick={() => handleCancel(transaction.id_giao_dich)}
                            disabled={processingId === transaction.id_giao_dich}
                            className="flex-1 px-3 py-2 border border-red-200 text-red-600 rounded text-sm font-medium disabled:opacity-50"
                          >
                            {processingId === transaction.id_giao_dich ? 'Đang xử lý...' : 'Hủy'}
                          </button>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-2">
                      {formatDate(transaction.ngay_tao)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage