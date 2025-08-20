import React, { useState } from 'react'
import { 
  BellOutlined,
  CloseOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Giao dịch mới cần xác nhận',
      content: 'Nguyễn Văn A đã tạo giao dịch "Giao lịch xe khách Hà Nội - Hải Phòng" với số tiền 2,500,000 VNĐ',
      type: 'transaction',
      sender: 'Nguyễn Văn A',
      amount: '2,500,000 VNĐ',
      points: '250 điểm',
      datetime: '2024-01-15 14:30:00',
      isRead: false,
      status: 'pending'
    },
    {
      id: 2,
      title: 'Yêu cầu san lịch',
      content: 'Lê Văn C yêu cầu san lịch xe khách Hà Nội - Hải Phòng ngày 16/01/2024',
      type: 'request',
      sender: 'Lê Văn C',
      route: 'Hà Nội - Hải Phòng',
      date: '16/01/2024',
      datetime: '2024-01-15 13:15:00',
      isRead: false,
      status: 'pending'
    },
    {
      id: 3,
      title: 'Giao dịch đã hoàn thành',
      content: 'Giao dịch "Thanh toán dịch vụ internet" của Hoàng Văn E đã được hoàn thành thành công',
      type: 'success',
      sender: 'Hoàng Văn E',
      service: 'Thanh toán dịch vụ internet',
      datetime: '2024-01-15 12:00:00',
      isRead: true,
      status: 'completed'
    },
    {
      id: 4,
      title: 'Hủy lịch xe',
      content: 'Đặng Văn G đã hủy lịch xe khách Hà Nội - Hải Phòng ngày 15/01/2024',
      type: 'cancel',
      sender: 'Đặng Văn G',
      route: 'Hà Nội - Hải Phòng',
      date: '15/01/2024',
      datetime: '2024-01-15 11:45:00',
      isRead: true,
      status: 'cancelled'
    }
  ])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'transaction':
        return <ExclamationCircleOutlined className="text-blue-500" />
      case 'request':
        return <InfoCircleOutlined className="text-orange-500" />
      case 'success':
        return <CheckCircleOutlined className="text-green-500" />
      case 'cancel':
        return <CloseCircleOutlined className="text-red-500" />
      default:
        return <InfoCircleOutlined className="text-gray-500" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'transaction':
        return 'border-l-blue-500'
      case 'request':
        return 'border-l-orange-500'
      case 'success':
        return 'border-l-green-500'
      case 'cancel':
        return 'border-l-red-500'
      default:
        return 'border-l-gray-500'
    }
  }

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification)
    // Đánh dấu đã đọc
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    )
  }

  const handleConfirm = () => {
    if (selectedNotification) {
      // Xử lý logic xác nhận thông báo
      console.log('Xác nhận thông báo:', selectedNotification.id)
      setSelectedNotification(null)
    }
  }

  const handleReject = () => {
    if (selectedNotification) {
      // Xử lý logic từ chối thông báo
      console.log('Từ chối thông báo:', selectedNotification.id)
      setSelectedNotification(null)
    }
  }

  const closeDetail = () => {
    setSelectedNotification(null)
  }

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <BellOutlined className="text-xl text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
              <span className="text-sm text-gray-500">
                {unreadCount} chưa đọc
              </span>
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Không có thông báo nào
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-l-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      getNotificationColor(notification.type)
                    } ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium mb-1 ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          {notification.content}
                        </p>
                        <span className="text-xs text-gray-400">
                          {notification.datetime}
                        </span>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {selectedNotification.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedNotification.datetime}
                  </p>
                </div>
              </div>
              <button
                onClick={closeDetail}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <CloseOutlined className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedNotification.content}
                </p>
              </div>

              {/* Additional Details */}
              {selectedNotification.type === 'transaction' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Người gửi:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {selectedNotification.sender}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Số tiền:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {selectedNotification.amount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Số điểm:</span>
                    <span className="text-sm font-medium text-green-600">
                      {selectedNotification.points}
                    </span>
                  </div>
                </div>
              )}

              {selectedNotification.type === 'request' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Người yêu cầu:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {selectedNotification.sender}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tuyến xe:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {selectedNotification.route}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {selectedNotification.date}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedNotification.status === 'pending' && (
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleReject}
                    className="flex-1 px-4 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CloseCircleOutlined />
                    <span>Từ chối</span>
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <CheckOutlined />
                    <span>Xác nhận</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Notification
