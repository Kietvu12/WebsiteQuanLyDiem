import React, { useState, useEffect } from 'react'
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
  ClockCircleOutlined
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { transactionService } from '../../services/transactionService'
import { formatTime, formatDate, formatMoney } from '../../utils/dateUtils'

const HomePage = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState(null)

  // Load transactions khi component mount
  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user])

  // Load transactions
  const loadTransactions = async () => {
    if (!user) return
    
    console.log('🔍 === FRONTEND DEBUG ===');
    console.log('🔍 User info:', user);
    console.log('🔍 user.la_admin:', user.la_admin, 'type:', typeof user.la_admin);
    console.log('🔍 user.id_nguoi_dung:', user.id_nguoi_dung, 'type:', typeof user.id_nguoi_dung);
    console.log('🔍 Is admin check:', user.la_admin === 1 || user.la_admin === true);
    console.log('🔍 user.la_admin === 1:', user.la_admin === 1);
    console.log('🔍 user.la_admin === true:', user.la_admin === true);
    console.log('🔍 user.la_admin == 1:', user.la_admin == 1);
    console.log('🔍 user.la_admin == true:', user.la_admin == true);
    console.log('🔍 !!user.la_admin:', !!user.la_admin);
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      console.log('🔍 Token:', token ? 'Present' : 'Missing');
      let response
      
      if (user.la_admin === 1 || user.la_admin === true) {
        console.log('🔍 Calling getAllTransactions (Admin endpoint)');
        // Admin: lấy tất cả giao dịch
        response = await transactionService.getAllTransactions(token)
      } else {
        console.log('🔍 Calling getUserTransactions (User endpoint)');
        console.log('🔍 User ID for API call:', user.id_nguoi_dung);
        // User thường: lấy giao dịch của họ
        response = await transactionService.getUserTransactions(token, user.id_nguoi_dung)
      }
      
      if (response.success) {
        setTransactions(response.data || [])
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
      setError('Không thể tải danh sách giao dịch')
    } finally {
      setLoading(false)
    }
  }

  // Xác nhận giao dịch
  const handleConfirm = async (transactionId) => {
    setProcessingId(transactionId)
    try {
      const token = localStorage.getItem('authToken')
      const response = await transactionService.confirmTransaction(token, transactionId)
      
      if (response.success) {
        // Cập nhật trạng thái giao dịch
        setTransactions(prev => 
          prev.map(t => 
            t.id_giao_dich === transactionId 
              ? { ...t, trang_thai: 'hoan_thanh' }
              : t
          )
        )
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
        setTransactions(prev => 
          prev.map(t => 
            t.id_giao_dich === transactionId 
              ? { ...t, trang_thai: 'da_huy' }
              : t
          )
        )
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
          <h1 className="text-2xl font-bold text-gray-800">Quản lý giao dịch</h1>
          <p className="text-gray-600">Theo dõi và quản lý các giao dịch trong hệ thống</p>
            </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Tổng giao dịch</p>
            <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Chờ xác nhận</p>
            <p className="text-2xl font-bold text-yellow-600">
              {transactions.filter(t => t.trang_thai === 'cho_xac_nhan').length}
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

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Danh sách giao dịch</h2>
              </div>
        
        <div className="divide-y divide-gray-100">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <TransactionOutlined className="text-4xl mb-4 text-gray-300" />
              <p>Chưa có giao dịch nào</p>
            </div>
          ) : (
            transactions.map((transaction) => (
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
                      {/* Số tiền và điểm */}
                      {(transaction.so_tien || transaction.diem) && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {transaction.so_tien && (
                              <div>
                                <span className="text-gray-600">Số tiền:</span>
                                <p className={`font-medium ${
                                  transaction.so_tien > 0 ? 'text-green-600' : 
                                  transaction.so_tien < 0 ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                  {transaction.so_tien > 0 ? '+' : ''}
                                  {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                  }).format(transaction.so_tien)}
                                </p>
                              </div>
                            )}
                            {transaction.diem && (
                              <div>
                                <span className="text-gray-600">Số điểm:</span>
                                <p className={`font-medium ${
                                  transaction.diem > 0 ? 'text-green-600' : 
                                  transaction.diem < 0 ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                  {transaction.diem > 0 ? '+' : ''}
                                  {transaction.diem}
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage