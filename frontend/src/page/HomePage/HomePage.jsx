import React, { useState } from 'react'
import { 
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  CloseOutlined,
  UserOutlined,
  TeamOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons'

const HomePage = () => {
  const [activeFilters, setActiveFilters] = useState(['cho_xac_nhan', 'da_xac_nhan'])
  const [selectedTransaction, setSelectedTransaction] = useState(1)
  const [searchName, setSearchName] = useState('')
  const [searchGroup, setSearchGroup] = useState('')
  const [transactionType, setTransactionType] = useState('all')
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

  const getStatusInfo = (status) => {
    const statusConfig = {
      'cho_xac_nhan': { label: 'Chờ xác nhận', color: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: <ClockCircleOutlined className="text-yellow-500" /> },
      'da_xac_nhan': { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <CheckCircleOutlined className="text-blue-500" /> },
      'hoan_thanh': { label: 'Hoàn thành', color: 'bg-green-50 text-green-600 border-green-100', icon: <CheckCircleOutlined className="text-green-500" /> },
      'da_huy': { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-100', icon: <CloseCircleOutlined className="text-red-500" /> }
    }
    return statusConfig[status] || statusConfig['cho_xac_nhan']
  }

  const getTransactionTypeInfo = (type) => {
    const typeConfig = {
      'nhan_lich': { label: 'Nhận lịch', color: 'bg-green-50 text-green-600 border-green-100', icon: <ArrowDownOutlined className="text-green-500" />, isCredit: true },
      'giao_lich': { label: 'Giao lịch', color: 'bg-red-50 text-red-600 border-red-100', icon: <ArrowUpOutlined className="text-red-500" />, isCredit: false },
      'san_cho': { label: 'San cho', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <ArrowUpOutlined className="text-blue-500" />, isCredit: false },
      'nhan_san': { label: 'Nhận san', color: 'bg-green-50 text-green-600 border-green-100', icon: <ArrowDownOutlined className="text-green-500" />, isCredit: true },
      'huy_lich': { label: 'Hủy lịch', color: 'bg-orange-50 text-orange-600 border-orange-100', icon: <ArrowUpOutlined className="text-orange-500" />, isCredit: false }
    }
    return typeConfig[type] || typeConfig['nhan_lich']
  }

  const transactions = [
    {
      id: 1,
      sender: 'Nguyễn Văn A',
      receiver: 'Trần Thị B',
      type: 'nhan_lich',
      content: 'Nhận lịch xe từ Hà Nội đến TP.HCM',
      datetime: '2024-01-15 08:30',
      status: 'cho_xac_nhan',
      groupName: 'Nhóm Vận chuyển 1',
      amount: '500,000',
      points: 50
    },
    {
      id: 2,
      sender: 'Lê Văn C',
      receiver: 'Phạm Thị D',
      type: 'giao_lich',
      content: 'Giao lịch xe từ TP.HCM đến Đà Nẵng',
      datetime: '2024-01-15 09:15',
      status: 'da_xac_nhan',
      groupName: 'Nhóm Vận chuyển 2',
      amount: '750,000',
      points: 75
    },
    {
      id: 3,
      sender: 'Hoàng Văn E',
      receiver: 'Vũ Thị F',
      type: 'san_cho',
      content: 'San cho xe từ Đà Nẵng đến Huế',
      datetime: '2024-01-15 10:00',
      status: 'hoan_thanh',
      groupName: 'Nhóm Vận chuyển 3',
      amount: '300,000',
      points: 30
    },
    {
      id: 4,
      sender: 'Đặng Văn G',
      receiver: 'Bùi Thị H',
      type: 'nhan_san',
      content: 'Nhận san xe từ Huế đến Quảng Nam',
      datetime: '2024-01-15 11:30',
      status: 'da_huy',
      groupName: 'Nhóm Vận chuyển 4',
      amount: '400,000',
      points: 40
    }
  ]

  const transactionTypes = [
    { value: 'all', label: 'Tất cả loại giao dịch' },
    { value: 'nhan_lich', label: 'Nhận lịch' },
    { value: 'giao_lich', label: 'Giao lịch' },
    { value: 'san_cho', label: 'San cho' },
    { value: 'nhan_san', label: 'Nhận san' },
    { value: 'huy_lich', label: 'Hủy lịch' }
  ]

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Quản lý Giao dịch</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search by Name */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserOutlined className="mr-2 text-gray-400" />
                Tìm theo tên
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập tên người gửi/nhận..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
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
                  value={searchGroup}
                  onChange={(e) => setSearchGroup(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                />
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>

            {/* Transaction Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FilterOutlined className="mr-2 text-gray-400" />
                Loại giao dịch
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
              >
                {transactionTypes.map(type => (
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
            {['cho_xac_nhan', 'da_xac_nhan', 'hoan_thanh', 'da_huy'].map(status => {
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

        {/* Transaction List */}
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Danh sách giao dịch</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{transactions.length} giao dịch</span>
              
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
            {transactions.map(transaction => {
              const typeInfo = getTransactionTypeInfo(transaction.type)
              const statusInfo = getStatusInfo(transaction.status)
              return (
                <div
                  key={transaction.id}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
                    selectedTransaction === transaction.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTransaction(transaction.id)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Transaction Type Icon */}
                    <div className={`w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center text-white shadow-sm ${
                      typeInfo.isCredit 
                        ? 'from-green-400 to-green-500' 
                        : 'from-red-400 to-red-500'
                    }`}>
                      {typeInfo.icon}
                    </div>

                    {/* Transaction Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="text-sm font-medium text-gray-600">Từ: {transaction.sender}</span>
                            <ArrowDownOutlined className="text-gray-400 text-xs" />
                            <span className="text-sm font-medium text-gray-600">Đến: {transaction.receiver}</span>
                          </div>
                          <p className="text-sm text-gray-800 font-medium">{transaction.content}</p>
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
                            {transaction.datetime}
                          </span>
                          <span className="flex items-center">
                            <TeamOutlined className="mr-1" />
                            {transaction.groupName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className={`text-base font-semibold ${
                            typeInfo.isCredit ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {typeInfo.isCredit ? '' : '-'}{transaction.amount} VNĐ
                          </p>
                          <p className={`text-xs ${
                            typeInfo.isCredit ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {typeInfo.isCredit ? '+' : '-'}{transaction.points} điểm
                          </p>
                        </div>
                      </div>
                    </div>
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

export default HomePage