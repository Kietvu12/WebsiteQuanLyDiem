import React, { useState } from 'react'
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
  CheckOutlined
} from '@ant-design/icons'

const VehicleSchedulePage = () => {
  const [activeFilters, setActiveFilters] = useState(['da_xac_nhan'])
  const [selectedSchedule, setSelectedSchedule] = useState(1)
  const [searchDriver, setSearchDriver] = useState('')
  const [searchRoute, setSearchRoute] = useState('')
  const [scheduleType, setScheduleType] = useState('all')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  const removeFilter = (filterToRemove) => {
    setActiveFilters(activeFilters.filter(filter => filter !== filterToRemove))
  }

  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter))
    } else {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const handleComplete = (scheduleId) => {
    console.log('Hoàn thành lịch:', scheduleId)
    // Xử lý logic hoàn thành lịch
  }

  const handleCancel = (scheduleId) => {
    console.log('Hủy lịch:', scheduleId)
    // Xử lý logic hủy lịch
  }

  const getStatusInfo = (status) => {
    const statusConfig = {
      'da_xac_nhan': { label: 'Đã xác nhận', color: 'bg-green-50 text-green-600 border-green-100', icon: <CheckCircleOutlined className="text-green-500" /> },
      'da_huy': { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-100', icon: <CloseCircleOutlined className="text-red-500" /> }
    }
    return statusConfig[status] || statusConfig['da_xac_nhan']
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

  const schedules = [
    {
      id: 1,
      driver: 'Nguyễn Văn A',
      vehicleNumber: '29A-12345',
      type: 'don_san_bay',
      route: 'Sân bay Nội Bài - Hà Nội',
      departureTime: '2024-01-15 08:00',
      arrivalTime: '2024-01-15 09:00',
      status: 'da_xac_nhan',
      groupName: 'Nhóm Vận chuyển 1',
      capacity: 45,
      price: '200,000',
      distance: '35 km',
      passengerCount: 32
    },
    {
      id: 2,
      driver: 'Lê Văn C',
      vehicleNumber: '51B-67890',
      type: 'tien_san_bay',
      route: 'Hà Nội - Sân bay Nội Bài',
      departureTime: '2024-01-15 14:00',
      arrivalTime: '2024-01-15 15:00',
      status: 'da_xac_nhan',
      groupName: 'Nhóm Vận chuyển 2',
      capacity: 45,
      price: '200,000',
      distance: '35 km',
      passengerCount: 28
    },
    {
      id: 3,
      driver: 'Hoàng Văn E',
      vehicleNumber: '43C-11111',
      type: 'mot_chieu',
      route: 'Hà Nội - Hải Phòng',
      departureTime: '2024-01-15 10:00',
      arrivalTime: '2024-01-15 12:00',
      status: 'da_xac_nhan',
      groupName: 'Nhóm Vận chuyển 3',
      capacity: 35,
      price: '150,000',
      distance: '120 km',
      passengerCount: 25
    },
    {
      id: 4,
      driver: 'Đặng Văn G',
      vehicleNumber: '92D-22222',
      type: 'hai_chieu',
      route: 'Hà Nội - Nam Định (Khứ hồi)',
      departureTime: '2024-01-15 07:00',
      arrivalTime: '2024-01-15 18:00',
      status: 'da_xac_nhan',
      groupName: 'Nhóm Vận chuyển 4',
      capacity: 40,
      price: '300,000',
      distance: '90 km',
      passengerCount: 38
    }
  ]

  const scheduleTypes = [
    { value: 'all', label: 'Tất cả loại lịch' },
    { value: 'don_san_bay', label: 'Đón Sân bay - Hà Nội' },
    { value: 'tien_san_bay', label: 'Tiễn Hà Nội - Sân bay' },
    { value: 'mot_chieu', label: 'Đi tỉnh & huyện 1 chiều' },
    { value: 'hai_chieu', label: 'Đi tỉnh & huyện 2 chiều' }
  ]

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Quản lý lịch xe</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white mb-6">
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

            {/* Search by Route */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <EnvironmentOutlined className="mr-2 text-gray-400" />
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

            {/* Schedule Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FilterOutlined className="mr-2 text-gray-400" />
                Loại lịch
              </label>
              <select
                value={scheduleType}
                onChange={(e) => setScheduleType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
              >
                {scheduleTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="bg-white mb-6">
          <div className="flex flex-wrap gap-3">
            {['da_xac_nhan', 'da_huy'].map(status => {
              const statusInfo = getStatusInfo(status)
              const isActive = activeFilters.includes(status)
              return (
                <button
                  key={status}
                  onClick={() => toggleFilter(status)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? `${statusInfo.color} shadow-sm`
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {statusInfo.icon}
                  <span className="font-medium text-sm">{statusInfo.label}</span>
                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFilter(status)
                      }}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <CloseOutlined className="text-xs" />
                    </button>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Schedule List */}
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Danh sách lịch xe</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{schedules.length} lịch xe</span>
              
              {/* Date Range Filter */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <CalendarOutlined className="mr-2 text-gray-400" />
                  Khoảng thời gian:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                  />
                  <span className="text-gray-400">đến</span>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {schedules.map(schedule => {
              const typeInfo = getScheduleTypeInfo(schedule.type)
              const statusInfo = getStatusInfo(schedule.status)
              return (
                <div
                  key={schedule.id}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
                    selectedSchedule === schedule.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSchedule(schedule.id)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Schedule Type Icon */}
                    <div className={`w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center text-white shadow-sm ${
                      schedule.type === 'don_san_bay' ? 'from-blue-400 to-blue-500' :
                      schedule.type === 'tien_san_bay' ? 'from-purple-400 to-purple-500' :
                      schedule.type === 'mot_chieu' ? 'from-orange-400 to-orange-500' :
                      'from-indigo-400 to-indigo-500'
                    }`}>
                      {typeInfo.icon}
                    </div>

                    {/* Schedule Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="text-sm font-medium text-gray-600">Tài xế: {schedule.driver}</span>
                            <span className="text-sm text-gray-500">|</span>
                            <span className="text-sm font-medium text-gray-600">Biển số: {schedule.vehicleNumber}</span>
                          </div>
                          <p className="text-sm text-gray-800 font-medium">{schedule.route}</p>
                          <p className="text-xs text-gray-500 mt-1">{typeInfo.description}</p>
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
                            Khởi hành: {schedule.departureTime}
                          </span>
                          <span className="flex items-center">
                            <ClockCircleOutlined className="mr-1" />
                            Đến nơi: {schedule.arrivalTime}
                          </span>
                          <span className="flex items-center">
                            <TeamOutlined className="mr-1" />
                            {schedule.groupName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <UserOutlined className="mr-1" />
                            {schedule.passengerCount}/{schedule.capacity} chỗ
                          </span>
                          <span className="flex items-center">
                            <DollarOutlined className="mr-1" />
                            {schedule.price} VNĐ
                          </span>
                          <span className="text-xs text-gray-400">
                            {schedule.distance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleComplete(schedule.id)
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckOutlined className="text-sm" />
                      <span className="text-sm font-medium">Hoàn thành</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCancel(schedule.id)
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <CloseOutlined className="text-sm" />
                      <span className="text-sm font-medium">Hủy lịch</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleSchedulePage
