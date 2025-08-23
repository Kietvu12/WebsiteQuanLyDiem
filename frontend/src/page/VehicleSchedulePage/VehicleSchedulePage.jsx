import React, { useState, useEffect } from 'react'
import { 
  SearchOutlined,
  FilterOutlined,
  CloseOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  CarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { vehicleScheduleService } from '../../services/vehicleScheduleService'

const VehicleSchedulePage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchDriver, setSearchDriver] = useState('')
  const [searchRoute, setSearchRoute] = useState('')
  const [scheduleType, setScheduleType] = useState('all')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  // Load schedules based on active tab
  useEffect(() => {
    loadSchedules()
  }, [activeTab])

  const loadSchedules = async () => {
    if (!user) return
    
    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('authToken')
      let response
      
      if (activeTab === 'upcoming') {
        // Lịch xe sắp tới (trong 1 tiếng)
        response = await vehicleScheduleService.getUpcomingSchedules(token)
      } else if (activeTab === 'all') {
        // Tất cả lịch xe
        if (user.la_admin === 1 || user.la_admin === true) {
          // Admin: lấy tất cả lịch xe
          response = await vehicleScheduleService.getAllSchedules(token)
        } else {
          // User: lấy lịch xe cá nhân
          response = await vehicleScheduleService.getUserSchedules(token, user.id_nguoi_dung)
        }
      } else if (activeTab === 'completed') {
        // Lịch xe đã hoàn thành
        response = await vehicleScheduleService.getCompletedSchedules(token)
      }
      
      if (response.success) {
        setSchedules(response.data || [])
      } else {
        setError(response.message || 'Không thể tải danh sách lịch xe')
      }
    } catch (error) {
      console.error('Error loading schedules:', error)
      setError('Lỗi khi tải danh sách lịch xe')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSchedule = async (scheduleId) => {
    if (!confirm('Bạn có chắc chắn muốn hủy lịch xe này? Tiền và điểm sẽ được hoàn lại.')) {
      return
    }
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await vehicleScheduleService.cancelSchedule(token, scheduleId)
      
      if (response.success) {
        // Reload schedules
        loadSchedules()
        // Show success message
        alert('Hủy lịch xe thành công! Tiền và điểm đã được hoàn lại.')
      } else {
        alert(response.message || 'Lỗi khi hủy lịch xe')
      }
    } catch (error) {
      console.error('Error cancelling schedule:', error)
      alert('Lỗi khi hủy lịch xe')
    }
  }

  const getStatusInfo = (status) => {
    const statusConfig = {
      'cho_xac_nhan': { 
        label: 'Chờ xác nhận', 
        color: 'bg-yellow-50 text-yellow-600 border-yellow-100', 
        icon: <ClockCircleOutlined className="text-yellow-500" /> 
      },
      'da_xac_nhan': { 
        label: 'Đã xác nhận', 
        color: 'bg-blue-50 text-blue-600 border-blue-100', 
        icon: <CheckCircleOutlined className="text-blue-500" /> 
      },
      'hoan_thanh': { 
        label: 'Hoàn thành', 
        color: 'bg-green-50 text-green-600 border-green-100', 
        icon: <CheckCircleOutlined className="text-green-500" /> 
      },
      'da_huy': { 
        label: 'Đã hủy', 
        color: 'bg-red-50 text-red-600 border-red-100', 
        icon: <CloseCircleOutlined className="text-red-500" /> 
      }
    }
    return statusConfig[status] || statusConfig['cho_xac_nhan']
  }

  const getScheduleTypeInfo = (type) => {
    const typeConfig = {
      'don_san_bay': { 
        label: 'Đón Sân bay - Hà Nội', 
        color: 'bg-blue-50 text-blue-600 border-blue-100', 
        icon: <CarOutlined className="text-blue-500" />,
        description: 'Đón khách từ sân bay về Hà Nội'
      },
      'tien_san_bay': { 
        label: 'Tiễn Hà Nội - Sân bay', 
        color: 'bg-purple-50 text-purple-600 border-purple-100', 
        icon: <CarOutlined className="text-purple-500" />,
        description: 'Tiễn khách từ Hà Nội ra sân bay'
      },
      'mot_chieu': { 
        label: 'Đi tỉnh & huyện 1 chiều', 
        color: 'bg-orange-50 text-orange-600 border-orange-100', 
        icon: <CarOutlined className="text-orange-500" />,
        description: 'Chuyến đi một chiều đến tỉnh/huyện'
      },
      'hai_chieu': { 
        label: 'Đi tỉnh & huyện 2 chiều', 
        color: 'bg-indigo-50 text-indigo-600 border-indigo-100', 
        icon: <CarOutlined className="text-indigo-500" />,
        description: 'Chuyến đi khứ hồi đến tỉnh/huyện'
      }
    }
    return typeConfig[type] || typeConfig['don_san_bay']
  }

  const canCancelSchedule = (schedule) => {
    // Không thể hủy lịch xe đã bị hủy hoặc đã hoàn thành
    if (schedule.trang_thai === 'da_huy' || schedule.trang_thai === 'hoan_thanh') {
      return false;
    }
    
    // Người tạo và admin có thể hủy các trạng thái khác
    if (schedule.id_nguoi_tao === user.id_nguoi_dung || 
        user.la_admin === 1 || 
        user.la_admin === true) {
      return true;
    }
    
    // Người nhận lịch xe chỉ có thể hủy khi lịch xe chưa hoàn thành và chưa hủy
    if (schedule.id_nguoi_nhan === user.id_nguoi_dung) {
      return schedule.trang_thai === 'cho_xac_nhan' || schedule.trang_thai === 'da_xac_nhan';
    }
    
    return false;
  }

  const filteredSchedules = schedules.filter(schedule => {
    // Filter by driver name
    if (searchDriver && !schedule.ten_nguoi_tao?.toLowerCase().includes(searchDriver.toLowerCase())) {
      return false
    }
    
    // Filter by group name
    if (searchRoute && !schedule.ten_nhom?.toLowerCase().includes(searchRoute.toLowerCase())) {
      return false
    }
    
    // Filter by date range
    if (dateRange.startDate && dateRange.endDate) {
      const scheduleDate = new Date(schedule.thoi_gian_bat_dau_don)
      const startDate = new Date(dateRange.startDate)
      const endDate = new Date(dateRange.endDate)
      
      if (scheduleDate < startDate || scheduleDate > endDate) {
        return false
      }
    }
    
    return true
  })

  const tabs = [
    { 
      key: 'upcoming', 
      label: 'Lịch xe sắp tới', 
      description: 'Trong 1 tiếng tới',
      icon: <ClockCircleOutlined />
    },
    { 
      key: 'all', 
      label: 'Tất cả lịch xe', 
      description: user?.la_admin ? 'Tất cả người dùng' : 'Cá nhân',
      icon: <CarOutlined />
    },
    { 
      key: 'completed', 
      label: 'Lịch xe đã hoàn thành', 
      description: 'Sau 2 tiếng từ giờ đón',
      icon: <CheckCircleOutlined />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Quản lý lịch xe</h1>
        
        {/* Tabs */}
        <div className="bg-white mb-6 rounded-xl shadow-sm">
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {tab.icon}
                  <div className="text-center">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs text-gray-400">{tab.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white mb-6 rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search by Driver */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserOutlined className="mr-2 text-gray-400" />
                Tìm theo tài xế
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập tên tài xế..."
                  value={searchDriver}
                  onChange={(e) => setSearchDriver(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                />
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>

            {/* Search by Group */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TeamOutlined className="mr-2 text-gray-400" />
                Tìm theo nhóm 
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập tên nhóm..."
                  value={searchRoute}
                  onChange={(e) => setSearchRoute(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                />
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarOutlined className="mr-2 text-gray-400" />
                Khoảng thời gian
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                />
                <span className="text-gray-400">đến</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {activeTab === 'upcoming' && 'Lịch xe sắp tới'}
              {activeTab === 'all' && 'Tất cả lịch xe'}
              {activeTab === 'completed' && 'Lịch xe đã hoàn thành'}
            </h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{filteredSchedules.length} lịch xe</span>
              <button
                onClick={loadSchedules}
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? <LoadingOutlined className="animate-spin mr-2" /> : null}
                Làm mới
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingOutlined className="text-3xl text-blue-500 animate-spin mr-3" />
              <span className="text-gray-500">Đang tải danh sách lịch xe...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <ExclamationCircleOutlined className="text-3xl text-red-500 mr-3" />
              <span className="text-red-500">{error}</span>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-12">
              <CarOutlined className="text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500">Không có lịch xe nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSchedules.map(schedule => {
                const statusInfo = getStatusInfo(schedule.trang_thai)
                const canCancel = canCancelSchedule(schedule)
                
                return (
                  <div
                    key={schedule.id_lich_xe}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Schedule Type Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <CarOutlined className="text-lg" />
                      </div>

                      {/* Schedule Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <span className="text-sm font-medium text-gray-600">
                                Tài xế: {schedule.ten_nguoi_nhan}
                              </span>
                              <span className="text-sm text-gray-500">|</span>
                              <span className="text-sm font-medium text-gray-600">
                                Loại xe: {schedule.ten_loai_xe} ({schedule.so_cho} chỗ)
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 font-medium">
                              {schedule.ten_loai_tuyen} {schedule.la_khu_hoi ? '(Khứ hồi)' : '(Một chiều)'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Nhóm: {schedule.ten_nhom}
                              {schedule.ten_nguoi_nhan && ` • Người nhận: ${schedule.ten_nguoi_nhan}`}
                              {/* Hiển thị vai trò của user với lịch xe này */}
                              {schedule.id_nguoi_tao === user.id_nguoi_dung && (
                                <span className="inline-block ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                                  Bạn tạo
                                </span>
                              )}
                              {schedule.id_nguoi_nhan === user.id_nguoi_dung && (
                                <span className="inline-block ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                                  Bạn nhận
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${statusInfo.color}`}>
                              {statusInfo.icon} {statusInfo.label}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <ClockCircleOutlined className="mr-1" />
                              Bắt đầu: {new Date(schedule.thoi_gian_bat_dau_don).toLocaleString('vi-VN')}
                            </span>
                            <span className="flex items-center">
                              <ClockCircleOutlined className="mr-1" />
                              Kết thúc: {new Date(schedule.thoi_gian_ket_thuc_don).toLocaleString('vi-VN')}
                            </span>
                            {schedule.thoi_gian_bat_dau_tra && (
                              <span className="flex items-center">
                                <ClockCircleOutlined className="mr-1" />
                                Trả: {new Date(schedule.thoi_gian_bat_dau_tra).toLocaleString('vi-VN')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-xs text-gray-400">
                              Tạo: {new Date(schedule.ngay_tao).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {canCancel && (
                      <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                        {/* Thông báo về quyền hủy */}
                        <div className="flex-1 text-xs text-gray-500">
                          {schedule.id_nguoi_tao === user.id_nguoi_dung && (
                            <span>Bạn có thể hủy lịch xe này vì bạn là người tạo</span>
                          )}
                          {schedule.id_nguoi_nhan === user.id_nguoi_dung && (
                            <span>
                              Bạn có thể hủy lịch xe này vì bạn là người nhận
                              {schedule.trang_thai === 'da_xac_nhan' && ' (đã xác nhận)'}
                            </span>
                          )}
                          {user.la_admin === 1 || user.la_admin === true ? (
                            <span>Bạn có thể hủy lịch xe này vì bạn là admin</span>
                          ) : null}
                        </div>
                        <button
                          onClick={() => handleCancelSchedule(schedule.id_lich_xe)}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <CloseOutlined className="text-sm" />
                          <span className="text-sm font-medium">Hủy lịch</span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VehicleSchedulePage
