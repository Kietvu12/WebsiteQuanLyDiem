import React, { useState } from 'react'
import { 
  PlusOutlined,
  CloseOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons'

const AddNewTransaction = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    sender: '',
    receiver: '',
    transactionType: 'giao_lich',
    content: '',
    groupName: '',
    amount: '',
    points: ''
  })

  const transactionTypes = [
    { value: 'nhan_lich', label: 'Nhận lịch', color: 'bg-green-50 text-green-600 border-green-100' },
    { value: 'giao_lich', label: 'Giao lịch', color: 'bg-red-50 text-red-600 border-red-100' },
    { value: 'san_cho', label: 'San cho', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { value: 'nhan_san', label: 'Nhận san', color: 'bg-green-50 text-green-600 border-green-100' },
    { value: 'huy_lich', label: 'Hủy lịch', color: 'bg-orange-50 text-orange-600 border-orange-100' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Xử lý logic tạo giao dịch mới ở đây
    console.log('Form data:', formData)
    setIsOpen(false)
    // Reset form
    setFormData({
      sender: '',
      receiver: '',
      transactionType: 'giao_lich',
      content: '',
      groupName: '',
      amount: '',
      points: ''
    })
  }

  const handleCancel = () => {
    setIsOpen(false)
    // Reset form
    setFormData({
      sender: '',
      receiver: '',
      transactionType: 'giao_lich',
      content: '',
      groupName: '',
      amount: '',
      points: ''
    })
  }

  return (
    <>
      {/* Floating Button */}
      <div 
        className="fixed bottom-8 right-8 z-50 cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
          <PlusOutlined className="text-white text-2xl" />
        </div>
        <div className="absolute right-0 top-0 bg-white text-gray-700 px-3 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium">
          Tạo giao dịch mới
        </div>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <PlusOutlined className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Tạo giao dịch mới</h2>
                  <p className="text-sm text-gray-500">Nhập thông tin giao dịch</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <CloseOutlined className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Transaction Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Loại giao dịch
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {transactionTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('transactionType', type.value)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                        formData.transactionType === type.value
                          ? `${type.color} border-current`
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender and Receiver */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserOutlined className="mr-2 text-gray-400" />
                    Người gửi
                  </label>
                  <input
                    type="text"
                    value={formData.sender}
                    onChange={(e) => handleInputChange('sender', e.target.value)}
                    placeholder="Nhập tên người gửi"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserOutlined className="mr-2 text-gray-400" />
                    Người nhận
                  </label>
                  <input
                    type="text"
                    value={formData.receiver}
                    onChange={(e) => handleInputChange('receiver', e.target.value)}
                    placeholder="Nhập tên người nhận"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Content and Group */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileTextOutlined className="mr-2 text-gray-400" />
                    Nội dung giao dịch
                  </label>
                  <input
                    type="text"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Nhập nội dung giao dịch"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TeamOutlined className="mr-2 text-gray-400" />
                    Tên nhóm
                  </label>
                  <input
                    type="text"
                    value={formData.groupName}
                    onChange={(e) => handleInputChange('groupName', e.target.value)}
                    placeholder="Nhập tên nhóm"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Amount and Points */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarOutlined className="mr-2 text-gray-400" />
                    Số tiền (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="Nhập số tiền"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarOutlined className="mr-2 text-gray-400" />
                    Số điểm
                  </label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => handleInputChange('points', e.target.value)}
                    placeholder="Nhập số điểm"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
                >
                  Tạo giao dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default AddNewTransaction
