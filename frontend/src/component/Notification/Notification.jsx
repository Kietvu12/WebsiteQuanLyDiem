import React, { useState, useEffect } from 'react'
import { 
  BellOutlined,
  CloseOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { useGlobalState } from '../../contexts/GlobalStateContext'
import { transactionService } from '../../services/transactionService'
import { formatTime, formatDate } from '../../utils/dateUtils'

const Notification = () => {
  const { user } = useAuth()
  const { notifications, updateNotifications, updateNotification, markNotificationAsRead, markAllNotificationsAsRead } = useGlobalState()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState(null)
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false)
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  // Không cần loadNotifications nữa vì dữ liệu sẽ được cập nhật tự động từ global state
  // Chỉ set loading false sau khi component mount
  useEffect(() => {
    if (user) {
      // Dữ liệu sẽ được load tự động từ real-time service
      setLoading(false)
    }
  }, [user])

  // Tạo tiêu đề thông báo từ dữ liệu thực
  const getNotificationTitle = (notification) => {
    if (notification.noi_dung.includes('lịch xe mới')) {
      return 'Lịch xe mới'
    } else if (notification.noi_dung.includes('xác nhận')) {
      return 'Giao dịch được xác nhận'
    } else if (notification.noi_dung.includes('hủy')) {
      return 'Giao dịch bị hủy'
    } else if (notification.noi_dung.includes('giao dịch giao lịch')) {
      return 'Giao dịch giao lịch thành công'
    } else if (notification.noi_dung.includes('giao dịch san cho')) {
      return 'Giao dịch san cho thành công'
    } else {
      return 'Thông báo mới'
    }
  }

  // Tạo nội dung thông báo từ dữ liệu thực
  const getNotificationContent = (notification) => {
    return notification.noi_dung || 'Không có nội dung'
  }

  // Xác định loại thông báo từ dữ liệu thực
  const getNotificationType = (notification) => {
    if (notification.noi_dung.includes('lịch xe mới')) {
      return 'transaction'
    } else if (notification.noi_dung.includes('xác nhận')) {
      return 'success'
    } else if (notification.noi_dung.includes('hủy')) {
      return 'cancel'
    } else if (notification.noi_dung.includes('giao dịch')) {
      return 'info'
    } else {
      return 'info'
    }
  }

  // Format thời gian
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  // Tính số thông báo chưa đọc
  const unreadCount = notifications.filter(n => !n.da_doc).length
  
  // Cập nhật unreadCount khi notifications thay đổi
  useEffect(() => {
    const newUnreadCount = notifications.filter(n => !n.da_doc).length
    // Có thể thêm logic để cập nhật badge ở đây nếu cần
  }, [notifications])

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

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification)
    
    // Chỉ đánh dấu đã đọc nếu chưa đọc
    if (!notification.da_doc) {
      try {
        const token = localStorage.getItem('authToken')
        const response = await fetch(`${API_BASE_URL}/notifications/${notification.id_thong_bao}/read`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          // Cập nhật state local
          updateNotification(notification.id_thong_bao, { ...notification, da_doc: true })
          console.log('✅ Đã đánh dấu thông báo đã đọc')
        } else {
          console.error('❌ Lỗi khi đánh dấu thông báo đã đọc:', response.status)
        }
      } catch (error) {
        console.error('❌ Lỗi khi đánh dấu thông báo đã đọc:', error)
      }
    }
  }

  const handleMarkAllAsRead = async () => {
    if (markingAllAsRead) return // Prevent multiple clicks
    
    setMarkingAllAsRead(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        // Cập nhật state local - đánh dấu tất cả đã đọc
        markAllNotificationsAsRead()
        console.log('✅ Đã đánh dấu tất cả thông báo đã đọc')
      } else {
        console.error('❌ Lỗi khi đánh dấu tất cả thông báo đã đọc:', response.status)
      }
    } catch (error) {
      console.error('❌ Lỗi khi đánh dấu tất cả thông báo đã đọc:', error)
    } finally {
      setMarkingAllAsRead(false)
    }
  }

  const handleConfirm = async () => {
    if (!selectedNotification || !selectedNotification.id_giao_dich) return
    
    setProcessingId(selectedNotification.id_thong_bao)
    try {
      const token = localStorage.getItem('authToken')
      const response = await transactionService.confirmTransaction(token, selectedNotification.id_giao_dich)
      
      if (response.success) {
        // Cập nhật trạng thái thông báo
        updateNotification(selectedNotification.id_thong_bao, { ...selectedNotification, trang_thai: 'completed', da_doc: true })
        
        // Đóng modal
        setSelectedNotification(null)
        
        // Reload notifications
        // loadNotifications() // This line is removed as per the edit hint
      }
    } catch (error) {
      console.error('Error confirming notification:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async () => {
    if (!selectedNotification || !selectedNotification.id_giao_dich) return
    
    setProcessingId(selectedNotification.id_thong_bao)
    try {
      const token = localStorage.getItem('authToken')
      const response = await transactionService.cancelTransaction(token, selectedNotification.id_giao_dich)
      
      if (response.success) {
        // Cập nhật trạng thái thông báo
        updateNotification(selectedNotification.id_thong_bao, { ...selectedNotification, trang_thai: 'cancelled', da_doc: true })
        
        // Đóng modal
        setSelectedNotification(null)
        
        // Reload notifications
        // loadNotifications() // This line is removed as per the edit hint
      }
    } catch (error) {
      console.error('Error rejecting notification:', error)
    } finally {
      setProcessingId(null)
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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {unreadCount} chưa đọc
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={markingAllAsRead}
                    className={`text-xs text-blue-600 hover:text-blue-800 underline hover:no-underline transition-all duration-200 ${
                      markingAllAsRead ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Đánh dấu tất cả thông báo đã đọc"
                  >
                    {markingAllAsRead ? (
                      <>
                        <LoadingOutlined className="animate-spin mr-1" />
                        Đang xử lý...
                      </>
                    ) : (
                      `Đánh dấu tất cả đã đọc (${unreadCount})`
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center">
                  <LoadingOutlined className="text-2xl text-blue-500 animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Không có thông báo nào
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id_thong_bao}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-l-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      getNotificationColor(notification.type)
                    } ${!notification.da_doc ? 'bg-blue-50' : 'bg-white'}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium mb-1 ${
                          !notification.da_doc ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {getNotificationTitle(notification)}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          {getNotificationContent(notification)}
                        </p>
                        <span className="text-xs text-gray-400">
                          {formatDateTime(notification.ngay_tao)}
                        </span>
                      </div>
                      {!notification.da_doc && (
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
                    {getNotificationTitle(selectedNotification)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(selectedNotification.ngay_tao)}
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
              {selectedNotification.id_giao_dich && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ID giao dịch:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {selectedNotification.id_giao_dich}
                    </span>
                  </div>
                  {selectedNotification.ten_nguoi_gui && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Người gửi:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {selectedNotification.ten_nguoi_gui}
                      </span>
                    </div>
                  )}
                  {selectedNotification.ten_nguoi_nhan && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Người nhận:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {selectedNotification.ten_nguoi_nhan}
                      </span>
                    </div>
                  )}
                  {selectedNotification.so_tien && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Số tiền:</span>
                      <span className={`text-sm font-medium ${
                        selectedNotification.so_tien > 0 ? 'text-green-600' : 
                        selectedNotification.so_tien < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {selectedNotification.so_tien > 0 ? '+' : ''}
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(selectedNotification.so_tien)}
                      </span>
                    </div>
                  )}
                  {selectedNotification.diem && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Số điểm:</span>
                      <span className={`text-sm font-medium ${
                        selectedNotification.diem > 0 ? 'text-green-600' : 
                        selectedNotification.diem < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {selectedNotification.diem > 0 ? '+' : ''}
                        {selectedNotification.diem}
                      </span>
                    </div>
                  )}
                  
                  {/* Thông tin lịch xe */}
                  {selectedNotification.id_lich_xe && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">Thông tin lịch xe</h4>
                      <div className="space-y-2 text-sm">
                        {selectedNotification.ten_loai_xe && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Loại xe:</span>
                            <span className="font-medium text-gray-800">
                              {selectedNotification.ten_loai_xe} ({selectedNotification.so_cho} chỗ)
                            </span>
                          </div>
                        )}
                        {selectedNotification.ten_loai_tuyen && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Loại tuyến:</span>
                            <span className="font-medium text-gray-800">
                              {selectedNotification.ten_loai_tuyen} {selectedNotification.la_khu_hoi ? '(Khứ hồi)' : '(Một chiều)'}
                            </span>
                          </div>
                        )}
                        {selectedNotification.thoi_gian_bat_dau_don && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Thời gian đón:</span>
                            <span className="font-medium text-gray-800">
                              {formatTime(selectedNotification.thoi_gian_bat_dau_don)}
                            </span>
                          </div>
                        )}
                        {selectedNotification.thoi_gian_ket_thuc_don && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kết thúc đón:</span>
                            <span className="font-medium text-gray-800">
                              {formatTime(selectedNotification.thoi_gian_ket_thuc_don)}
                            </span>
                          </div>
                        )}
                        {selectedNotification.thoi_gian_bat_dau_tra && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Thời gian trả:</span>
                            <span className="font-medium text-gray-800">
                              {formatTime(selectedNotification.thoi_gian_bat_dau_tra)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {selectedNotification.id_giao_dich && (
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                  {/* Nút xác nhận - chỉ hiển thị cho người nhận giao dịch giao lịch CHƯA XỬ LÝ */}
                  {selectedNotification.id_loai_giao_dich === 1 && 
                   selectedNotification.ten_nguoi_nhan === user.ho_ten &&
                   selectedNotification.trang_thai === 'cho_xac_nhan' && (
                    <button
                      onClick={handleConfirm}
                      disabled={processingId === selectedNotification.id_thong_bao}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {processingId === selectedNotification.id_thong_bao ? (
                        <LoadingOutlined className="animate-spin" />
                      ) : (
                        <CheckOutlined />
                      )}
                      <span>Xác nhận</span>
                    </button>
                  )}
                  
                  {/* Nút hủy giao dịch - hiển thị cho người gửi, người nhận hoặc admin KHI GIAO DỊCH CHƯA XỬ LÝ */}
                  {(selectedNotification.ten_nguoi_gui === user.ho_ten || 
                    selectedNotification.ten_nguoi_nhan === user.ho_ten ||
                    user.la_admin === 1 || 
                    user.la_admin === true) &&
                    selectedNotification.trang_thai === 'cho_xac_nhan' && (
                    <button
                      onClick={handleReject}
                      disabled={processingId === selectedNotification.id_thong_bao}
                      className="flex-1 px-4 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {processingId === selectedNotification.id_thong_bao ? (
                        <LoadingOutlined className="animate-spin" />
                      ) : (
                        <CloseCircleOutlined />
                      )}
                      <span>Hủy giao dịch</span>
                    </button>
                  )}
                  
                  {/* Hiển thị trạng thái giao dịch nếu đã được xử lý */}
                  {selectedNotification.trang_thai && 
                   selectedNotification.trang_thai !== 'cho_xac_nhan' && (
                    <div className="w-full text-center py-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedNotification.trang_thai === 'hoan_thanh' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedNotification.trang_thai === 'da_huy'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedNotification.trang_thai === 'hoan_thanh' ? 
                          (selectedNotification.id_loai_giao_dich === 4 || selectedNotification.id_loai_giao_dich === 5) 
                            ? '✅ Giao dịch đã hoàn thành' 
                            : '✅ Đã xác nhận' :
                         selectedNotification.trang_thai === 'da_huy' ? '❌ Đã hủy' :
                         selectedNotification.trang_thai}
                      </span>
                    </div>
                  )}
                  
                  {/* Nếu không có nút nào được hiển thị và giao dịch chưa xử lý, hiển thị thông báo */}
                  {selectedNotification.trang_thai === 'cho_xac_nhan' &&
                   !((selectedNotification.id_loai_giao_dich === 1 && selectedNotification.ten_nguoi_nhan === user.ho_ten) ||
                     (selectedNotification.ten_nguoi_gui === user.ho_ten || selectedNotification.ten_nguoi_nhan === user.ho_ten || user.la_admin === 1 || user.la_admin === true)) && (
                    <div className="w-full text-center text-sm text-gray-500 py-2">
                      Bạn không có quyền thực hiện hành động này
                    </div>
                  )}
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
