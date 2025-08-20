import React, { useState } from 'react'
import { 
  SearchOutlined,
  PlusOutlined,
  TeamOutlined,
  TransactionOutlined,
  CarOutlined,
  DollarOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CalendarOutlined,
  FilterOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  EyeOutlined
} from '@ant-design/icons'

const GroupsPage = () => {
  const [searchGroup, setSearchGroup] = useState('')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)
  const [activeTab, setActiveTab] = useState('transactions')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [transactionType, setTransactionType] = useState('all')
  const [scheduleStatus, setScheduleStatus] = useState('all')

  const groups = [
    {
      id: 1,
      name: 'Nhóm Vận chuyển 1',
      transactionCount: 45,
      totalAmount: '15,500,000',
      totalPoints: 1550,
      members: [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          vehicleScheduleCount: 12,
          transactionCount: 15,
          transactions: [
            {
              id: 1,
              type: 'nhan_lich',
              content: 'Nhận lịch xe Hà Nội - TP.HCM',
              amount: '500,000',
              points: 50,
              datetime: '2024-01-15 08:30',
              status: 'hoan_thanh'
            },
            {
              id: 2,
              type: 'giao_lich',
              content: 'Giao lịch xe TP.HCM - Đà Nẵng',
              amount: '750,000',
              points: 75,
              datetime: '2024-01-15 09:15',
              status: 'da_xac_nhan'
            }
          ],
          schedules: [
            {
              id: 1,
              route: 'Hà Nội - TP.HCM',
              departureTime: '2024-01-15 08:00',
              arrivalTime: '2024-01-16 08:00',
              status: 'hoan_thanh',
              vehicleNumber: '29A-12345'
            },
            {
              id: 2,
              route: 'TP.HCM - Đà Nẵng',
              departureTime: '2024-01-16 09:00',
              arrivalTime: '2024-01-16 18:00',
              status: 'dang_chay',
              vehicleNumber: '51B-67890'
            }
          ]
        },
        {
          id: 2,
          name: 'Lê Văn C',
          vehicleScheduleCount: 8,
          transactionCount: 10,
          transactions: [
            {
              id: 3,
              type: 'san_cho',
              content: 'San cho xe Đà Nẵng - Huế',
              amount: '300,000',
              points: 30,
              datetime: '2024-01-15 10:00',
              status: 'hoan_thanh'
            }
          ],
          schedules: [
            {
              id: 3,
              route: 'Đà Nẵng - Huế',
              departureTime: '2024-01-15 10:00',
              arrivalTime: '2024-01-15 12:00',
              status: 'hoan_thanh',
              vehicleNumber: '43C-11111'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Nhóm Vận chuyển 2',
      transactionCount: 32,
      totalAmount: '12,800,000',
      totalPoints: 1280,
      members: [
        {
          id: 3,
          name: 'Hoàng Văn E',
          vehicleScheduleCount: 15,
          transactionCount: 20,
          transactions: [],
          schedules: []
        }
      ]
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

  const scheduleStatuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'cho_xac_nhan', label: 'Chờ xác nhận' },
    { value: 'da_xac_nhan', label: 'Đã xác nhận' },
    { value: 'dang_chay', label: 'Đang chạy' },
    { value: 'hoan_thanh', label: 'Hoàn thành' },
    { value: 'da_huy', label: 'Đã hủy' }
  ]

  const handleCreateGroup = () => {
    console.log('Tạo nhóm mới')
    // Xử lý logic tạo nhóm mới
  }

  const handleEditGroup = (groupId) => {
    console.log('Sửa thông tin nhóm:', groupId)
    // Xử lý logic sửa thông tin nhóm
  }

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhóm này?')) {
      console.log('Xóa nhóm:', groupId)
      // Xử lý logic xóa nhóm
    }
  }

  const handleExportReport = (groupId) => {
    console.log('Xuất báo cáo nhóm:', groupId)
    // Xử lý logic xuất báo cáo
  }

  const handleRemoveMember = (groupId, memberId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?')) {
      console.log('Xóa thành viên:', memberId, 'khỏi nhóm:', groupId)
      // Xử lý logic xóa thành viên khỏi nhóm
    }
  }

  const handleGroupClick = (group) => {
    setSelectedGroup(group)
    setSelectedMember(null)
  }

  const handleMemberClick = (member) => {
    setSelectedMember(member)
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

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Quản lý Nhóm</h1>
        
        {/* Search and Create Section */}
        <div className="bg-white mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm nhóm..."
                  value={searchGroup}
                  onChange={(e) => setSearchGroup(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                />
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>
            <button
              onClick={handleCreateGroup}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
            >
              <PlusOutlined className="text-sm" />
              <span>Tạo nhóm mới</span>
            </button>
          </div>
        </div>

        {/* Groups Table */}
        <div className="bg-white mb-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Bảng các nhóm</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên nhóm</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số giao dịch</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng điểm</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thành viên</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groups.map(group => (
                  <tr 
                    key={group.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedGroup?.id === group.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleGroupClick(group)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{group.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <TransactionOutlined className="text-blue-500 mr-2" />
                        <span className="text-sm text-gray-900">{group.transactionCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <DollarOutlined className="text-green-500 mr-2" />
                        <span className="text-sm text-gray-900">{group.totalAmount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <TeamOutlined className="text-purple-500 mr-2" />
                        <span className="text-sm text-gray-900">{group.totalPoints}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900">{group.members.length}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleExportReport(group.id)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xuất báo cáo"
                        >
                          <FileTextOutlined className="text-sm" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditGroup(group.id)
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Sửa thông tin"
                        >
                          <EditOutlined className="text-sm" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteGroup(group.id)
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa nhóm"
                        >
                          <DeleteOutlined className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Members Table - Drill-down */}
        {selectedGroup && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                Danh sách thành viên nhóm: {selectedGroup.name}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành viên</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số lịch xe</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số giao dịch</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedGroup.members.map(member => (
                    <tr 
                      key={member.id}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedMember?.id === member.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleMemberClick(member)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                            <UserOutlined className="text-white text-xs" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <CarOutlined className="text-blue-500 mr-2" />
                          <span className="text-sm text-gray-900">{member.vehicleScheduleCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <TransactionOutlined className="text-green-500 mr-2" />
                          <span className="text-sm text-gray-900">{member.transactionCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveMember(selectedGroup.id, member.id)
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa khỏi nhóm"
                        >
                          <DeleteOutlined className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Member Details - Drill-down */}
            {selectedMember && (
              <div className="border-t border-gray-200 p-6">
                <h4 className="text-md font-semibold text-gray-800 mb-4">
                  Chi tiết thành viên: {selectedMember.name}
                </h4>
                
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-4">
                  <div className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'transactions'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Giao dịch ({selectedMember.transactions.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('schedules')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'schedules'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Lịch xe ({selectedMember.schedules.length})
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'transactions' && (
                  <div>
                    {/* Filters */}
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
                    <div className="space-y-3">
                      {selectedMember.transactions.map(transaction => {
                        const typeInfo = getTransactionTypeInfo(transaction.type)
                        return (
                          <div key={transaction.id} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{transaction.content}</p>
                                <p className="text-xs text-gray-500 mt-1">{transaction.datetime}</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${typeInfo.color}`}>
                                  {typeInfo.label}
                                </span>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-800">{transaction.amount} VNĐ</p>
                                  <p className="text-xs text-gray-500">{transaction.points} điểm</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
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
                    <div className="space-y-3">
                      {selectedMember.schedules.map(schedule => {
                        const statusInfo = getStatusInfo(schedule.status)
                        return (
                          <div key={schedule.id} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{schedule.route}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {schedule.departureTime} - {schedule.arrivalTime}
                                </p>
                                <p className="text-xs text-gray-500">Biển số: {schedule.vehicleNumber}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupsPage
