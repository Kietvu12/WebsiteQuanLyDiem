import React, { useState, useEffect } from 'react'
import { 
  PlusOutlined,
  CloseOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  LoadingOutlined,
  CarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { groupService } from '../../services/groupService'
import { transactionService } from '../../services/transactionService'
import { vehicleScheduleService } from '../../services/vehicleScheduleService'

const AddNewTransaction = () => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form data
  const [formData, setFormData] = useState({
    id_loai_giao_dich: 'giao_lich', // 1: giao_lich, 4: san_cho
    id_nguoi_nhan: '',
    id_nhom: '',
    so_tien: '',
    diem: '',
    noi_dung: ''
  })

  // Vehicle schedule data (chỉ khi chọn giao lịch)
  const [scheduleData, setScheduleData] = useState({
    id_loai_xe: '',
    id_loai_tuyen: '',
    thoi_gian_bat_dau_don: '',
    thoi_gian_ket_thuc_don: '',
    thoi_gian_bat_dau_tra: '',
    thoi_gian_ket_thuc_tra: ''
  })

  // Data từ API
  const [groups, setGroups] = useState([])
  const [groupMembers, setGroupMembers] = useState([])
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [routeTypes, setRouteTypes] = useState([])
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [loadingVehicleData, setLoadingVehicleData] = useState(false)

  // Transaction types
  const transactionTypes = [
    { value: 'giao_lich', label: 'Giao lịch', color: 'bg-red-50 text-red-600 border-red-100', id: 1 },
    { value: 'san_cho', label: 'San cho', color: 'bg-blue-50 text-blue-600 border-blue-100', id: 4 }
  ]

  // Load groups khi component mount
  useEffect(() => {
    if (isOpen && user) {
      console.log('Modal opened, loading data...') // Debug log
      console.log('Current formData:', formData) // Debug log
      console.log('formData.id_loai_giao_dich:', formData.id_loai_giao_dich) // Debug log
      console.log('formData.id_loai_giao_dich === "giao_lich":', formData.id_loai_giao_dich === 'giao_lich') // Debug log
      console.log('formData.id_loai_giao_dich type:', typeof formData.id_loai_giao_dich) // Debug log
      loadGroups()
      loadVehicleData()
    }
  }, [isOpen, user])

  // Theo dõi thay đổi của formData.id_loai_giao_dich
  useEffect(() => {
    console.log('formData.id_loai_giao_dich changed to:', formData.id_loai_giao_dich)
    console.log('Type:', typeof formData.id_loai_giao_dich)
    console.log('Should show vehicle form:', formData.id_loai_giao_dich === 'giao_lich' || formData.id_loai_giao_dich === 1)
  }, [formData.id_loai_giao_dich])

  // Load groups
  const loadGroups = async () => {
    if (!user) return
    
    setLoadingGroups(true)
    try {
      const token = localStorage.getItem('authToken')
      let response
      
      if (user.la_admin === 1 || user.la_admin === true) {
        // Admin: lấy tất cả nhóm
        console.log('Loading all groups for admin...')
        response = await groupService.getAllGroups(token)
      } else {
        // User thường: lấy nhóm của họ
        console.log('Loading user groups for regular user...')
        response = await groupService.getUserGroups(token, user.id_nguoi_dung)
      }
      
      if (response.success) {
        setGroups(response.data || [])
        console.log('Groups loaded:', response.data)
      }
    } catch (error) {
      console.error('Error loading groups:', error)
      setError('Không thể tải danh sách nhóm')
    } finally {
      setLoadingGroups(false)
    }
  }

  // Load vehicle data (loại xe, loại tuyến)
  const loadVehicleData = async () => {
    if (!user) return
    
    setLoadingVehicleData(true)
    setError('') // Clear previous errors
    try {
      const token = localStorage.getItem('authToken')
      
      // Load vehicle types và route types song song
      const [vehicleResponse, routeResponse] = await Promise.all([
        vehicleScheduleService.getVehicleTypes(token),
        vehicleScheduleService.getRouteTypes(token)
      ])
      
      console.log('Vehicle types response:', vehicleResponse)
      console.log('Route types response:', routeResponse)
      
      if (vehicleResponse.success) {
        setVehicleTypes(vehicleResponse.data || [])
        console.log('Vehicle types loaded:', vehicleResponse.data)
      } else {
        console.error('Vehicle types API error:', vehicleResponse.message)
        setError(`Không thể tải danh sách loại xe: ${vehicleResponse.message}`)
      }
      
      if (routeResponse.success) {
        setRouteTypes(routeResponse.data || [])
        console.log('Route types loaded:', routeResponse.data)
      } else {
        console.error('Route types API error:', routeResponse.message)
        setError(`Không thể tải danh sách loại tuyến: ${routeResponse.message}`)
      }
    } catch (error) {
      console.error('Error loading vehicle data:', error)
      setError('Không thể tải dữ liệu xe và tuyến')
    } finally {
      setLoadingVehicleData(false)
    }
  }

  // Load members khi chọn nhóm
  const loadGroupMembers = async (groupId) => {
    if (!groupId) {
      setGroupMembers([])
      return
    }
    
    setLoadingMembers(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await groupService.getGroupMembers(token, groupId)
      
      if (response.success) {
        let filteredMembers = response.data || []
        
        if (user.la_admin === 1 || user.la_admin === true) {
          // Admin: thấy tất cả thành viên trong nhóm
          console.log('Admin can see all members in group')
        } else {
          // User thường: lọc ra người dùng khác (không phải chính mình)
          console.log('Regular user can only see other members')
          filteredMembers = filteredMembers.filter(
            member => member.id_nguoi_dung !== user.id_nguoi_dung
          )
        }
        
        setGroupMembers(filteredMembers)
        console.log('Group members loaded:', filteredMembers)
      }
    } catch (error) {
      console.error('Error loading group members:', error)
      setError('Không thể tải danh sách thành viên')
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleInputChange = (field, value) => {
    console.log('handleInputChange:', field, value) // Debug log
    console.log('Previous formData:', formData) // Debug log
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      console.log('New formData:', newData) // Debug log
      return newData
    })

    // Reset người nhận khi thay đổi nhóm
    if (field === 'id_nhom') {
    setFormData(prev => ({
        ...prev,
        id_nguoi_nhan: ''
      }))
      loadGroupMembers(value)
    }
  }

  const handleScheduleChange = (field, value) => {
    setScheduleData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('=== handleSubmit Debug ===')
    console.log('Form submitted')
    console.log('Current formData:', formData)
    console.log('Current scheduleData:', scheduleData)
    console.log('Current user:', user)
    
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate form cơ bản
      console.log('Validating form...')
      if (!formData.id_nhom) {
        throw new Error('Vui lòng chọn nhóm')
      }
      if (!formData.id_nguoi_nhan) {
        throw new Error('Vui lòng chọn người nhận')
      }
      if (!formData.noi_dung.trim()) {
        throw new Error('Vui lòng nhập nội dung giao dịch')
      }

      // Kiểm tra người nhận có phải chính mình không (chỉ áp dụng cho user thường)
      if (!(user.la_admin === 1 || user.la_admin === true) && 
          parseInt(formData.id_nguoi_nhan) === user.id_nguoi_dung) {
        throw new Error('Bạn không thể tạo giao dịch cho chính mình')
      }

      // Validate lịch xe nếu là giao lịch
      if (formData.id_loai_giao_dich === 'giao_lich') {
        console.log('Validating vehicle schedule data...')
        if (!scheduleData.id_loai_xe) {
          throw new Error('Vui lòng chọn loại xe')
        }
        if (!scheduleData.id_loai_tuyen) {
          throw new Error('Vui lòng chọn loại tuyến')
        }
        if (!scheduleData.thoi_gian_bat_dau_don) {
          throw new Error('Vui lòng nhập thời gian bắt đầu đón')
        }
        if (!scheduleData.thoi_gian_ket_thuc_don) {
          throw new Error('Vui lòng nhập thời gian kết thúc đón')
        }
      }

      let scheduleId = null

      // Tạo lịch xe trước nếu là giao lịch
      if (formData.id_loai_giao_dich === 'giao_lich') {
        console.log('Creating vehicle schedule...')
        const token = localStorage.getItem('authToken')
        const scheduleResponse = await vehicleScheduleService.createSchedule(token, {
          ...scheduleData,
          id_nguoi_tao: user.id_nguoi_dung,
          id_nhom: parseInt(formData.id_nhom),
          id_nguoi_nhan: parseInt(formData.id_nguoi_nhan) // Thêm người nhận lịch
        })

        if (scheduleResponse.success) {
          scheduleId = scheduleResponse.data.id
          console.log('Vehicle schedule created with ID:', scheduleId)
        } else {
          throw new Error('Không thể tạo lịch xe')
        }
      }

      // Chuẩn bị data gửi API transaction
      const transactionData = {
        id_loai_giao_dich: formData.id_loai_giao_dich === 'giao_lich' ? 1 : 4,
        id_nguoi_nhan: parseInt(formData.id_nguoi_nhan),
        id_nhom: parseInt(formData.id_nhom),
        id_lich_xe: scheduleId, // ID lịch xe nếu có
        so_tien: formData.so_tien ? parseFloat(formData.so_tien) : 0,
        diem: formData.diem ? parseInt(formData.diem) : 0,
        noi_dung: formData.noi_dung.trim()
      }
      
      console.log('Transaction data prepared:', transactionData)

      const token = localStorage.getItem('authToken')
      console.log('Creating transaction...')
      const response = await transactionService.createTransaction(token, transactionData)

      if (response.success) {
        console.log('Transaction created successfully!')
        setSuccess('Tạo giao dịch thành công!')
    // Reset form
    setFormData({
          id_loai_giao_dich: 'giao_lich', // Đảm bảo giá trị mặc định là string
          id_nguoi_nhan: '',
          id_nhom: '',
          so_tien: '',
          diem: '',
          noi_dung: ''
        })
        setScheduleData({
          id_loai_xe: '',
          id_loai_tuyen: '',
          thoi_gian_bat_dau_don: '',
          thoi_gian_ket_thuc_don: '',
          thoi_gian_bat_dau_tra: '',
          thoi_gian_ket_thuc_tra: ''
        })
        setGroupMembers([])
        
        // Đóng modal sau 2 giây
        setTimeout(() => {
          setIsOpen(false)
          setSuccess('')
        }, 2000)
      }
    } catch (error) {
      setError(error.message || 'Tạo giao dịch thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setError('')
    setSuccess('')
    // Reset form
    setFormData({
      id_loai_giao_dich: 'giao_lich', // Đảm bảo giá trị mặc định là string
      id_nguoi_nhan: '',
      id_nhom: '',
      so_tien: '',
      diem: '',
      noi_dung: ''
    })
    setScheduleData({
      id_loai_xe: '',
      id_loai_tuyen: '',
      thoi_gian_bat_dau_don: '',
      thoi_gian_ket_thuc_don: '',
      thoi_gian_bat_dau_tra: '',
      thoi_gian_ket_thuc_tra: ''
    })
    setGroupMembers([])
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <PlusOutlined className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Tạo giao dịch mới</h2>
                  <p className="text-sm text-gray-500">Nhập thông tin giao dịch</p>
                  {(user?.la_admin === 1 || user?.la_admin === true) && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <UserOutlined className="mr-1" />
                        Admin - Có thể tạo giao dịch ở mọi nhóm
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                disabled={isLoading}
              >
                <CloseOutlined className="text-gray-500" />
              </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Debug Info */}
              <div className="p-3 bg-yellow-100 rounded-lg text-xs text-yellow-800">
                <strong>Debug Info:</strong><br />
                formData.id_loai_giao_dich: "{formData.id_loai_giao_dich}"<br />
                Type: {typeof formData.id_loai_giao_dich}<br />
                Should show vehicle form: {formData.id_loai_giao_dich === 'giao_lich' ? 'YES' : 'NO'}<br />
                Current user: {user?.ho_ten} (Admin: {user?.la_admin ? 'Yes' : 'No'})
              </div>

              {/* Transaction Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Loại giao dịch
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {transactionTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        console.log('Clicking transaction type:', type.value) // Debug log
                        console.log('Type value:', type.value) // Debug log
                        console.log('Type value type:', typeof type.value) // Debug log
                        handleInputChange('id_loai_giao_dich', type.value)
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                        formData.id_loai_giao_dich === type.value
                          ? `${type.color} border-current`
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TeamOutlined className="mr-2 text-gray-400" />
                  Chọn nhóm
                  {(user?.la_admin === 1 || user?.la_admin === true) && (
                    <span className="ml-2 text-xs text-purple-600 font-medium">
                      (Admin - Tất cả nhóm)
                    </span>
                  )}
                </label>
                <select
                  value={formData.id_nhom}
                  onChange={(e) => handleInputChange('id_nhom', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                  required
                  disabled={loadingGroups}
                >
                  <option value="">{loadingGroups ? 'Đang tải...' : 'Chọn nhóm'}</option>
                  {groups.map((group) => (
                    <option key={group.id_nhom} value={group.id_nhom}>
                      {group.ten_nhom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Receiver Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserOutlined className="mr-2 text-gray-400" />
                  Người nhận
                  {(user?.la_admin === 1 || user?.la_admin === true) && (
                    <span className="ml-2 text-xs text-purple-600 font-medium">
                      (Admin - Tất cả thành viên)
                    </span>
                  )}
                </label>
                <select
                  value={formData.id_nguoi_nhan}
                  onChange={(e) => handleInputChange('id_nguoi_nhan', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                  required
                  disabled={!formData.id_nhom || loadingMembers}
                >
                  <option value="">
                    {!formData.id_nhom 
                      ? 'Vui lòng chọn nhóm trước' 
                      : loadingMembers 
                        ? 'Đang tải...' 
                        : 'Chọn người nhận'
                    }
                  </option>
                  {groupMembers.map((member) => (
                    <option key={member.id_nguoi_dung} value={member.id_nguoi_dung}>
                      {member.ho_ten} ({member.ten_dang_nhap})
                      {parseInt(member.id_nguoi_dung) === user.id_nguoi_dung && 
                        (user?.la_admin === 1 || user?.la_admin === true) && 
                        ' (Bạn - Admin)'
                      }
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Schedule Section - Chỉ hiển thị khi chọn Giao lịch */}
              {(formData.id_loai_giao_dich === 'giao_lich' || formData.id_loai_giao_dich === 1) && (
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CarOutlined className="mr-2 text-blue-500" />
                    Thông tin lịch xe
                    {(user?.la_admin === 1 || user?.la_admin === true) && (
                      <span className="ml-2 text-xs text-purple-600 font-medium">
                        (Admin - Có thể tạo lịch xe cho mọi nhóm)
                      </span>
                    )}
                  </h3>
                  
                  {/* Debug info */}
                  <div className="mb-4 p-2 bg-blue-100 rounded text-xs text-blue-800">
                    Debug: formData.id_loai_giao_dich = "{formData.id_loai_giao_dich}"
                    <br />
                    Type: {typeof formData.id_loai_giao_dich}
                    <br />
                    Comparison: formData.id_loai_giao_dich === 'giao_lich' = {formData.id_loai_giao_dich === 'giao_lich' ? 'true' : 'false'}
                    <br />
                    Comparison: formData.id_loai_giao_dich === 1 = {formData.id_loai_giao_dich === 1 ? 'true' : 'false'}
                    <br />
                    Should show: {(formData.id_loai_giao_dich === 'giao_lich' || formData.id_loai_giao_dich === 1) ? 'YES' : 'NO'}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Loại xe */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CarOutlined className="mr-2 text-gray-400" />
                        Loại xe
                      </label>
                      <select
                        value={scheduleData.id_loai_xe}
                        onChange={(e) => handleScheduleChange('id_loai_xe', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        required
                        disabled={loadingVehicleData}
                      >
                        <option value="">{loadingVehicleData ? 'Đang tải...' : 'Chọn loại xe'}</option>
                        {vehicleTypes.map((type) => (
                          <option key={type.id_loai_xe} value={type.id_loai_xe}>
                            {type.ten_loai} ({type.so_cho} chỗ)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Loại tuyến */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <EnvironmentOutlined className="mr-2 text-gray-400" />
                        Loại tuyến
                      </label>
                      <select
                        value={scheduleData.id_loai_tuyen}
                        onChange={(e) => handleScheduleChange('id_loai_tuyen', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        required
                        disabled={loadingVehicleData}
                      >
                        <option value="">{loadingVehicleData ? 'Đang tải...' : 'Chọn loại tuyến'}</option>
                        {routeTypes.map((type) => (
                          <option key={type.id_loai_tuyen} value={type.id_loai_tuyen}>
                            {type.ten_loai} {type.la_khu_hoi ? '(Khứ hồi)' : '(Một chiều)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {/* Thời gian đón */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClockCircleOutlined className="mr-2 text-gray-400" />
                        Thời gian bắt đầu đón
                  </label>
                  <input
                        type="datetime-local"
                        value={scheduleData.thoi_gian_bat_dau_don}
                        onChange={(e) => handleScheduleChange('thoi_gian_bat_dau_don', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClockCircleOutlined className="mr-2 text-gray-400" />
                        Thời gian kết thúc đón
                  </label>
                  <input
                        type="datetime-local"
                        value={scheduleData.thoi_gian_ket_thuc_don}
                        onChange={(e) => handleScheduleChange('thoi_gian_ket_thuc_don', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                    required
                  />
                </div>
              </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {/* Thời gian trả */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClockCircleOutlined className="mr-2 text-gray-400" />
                        Thời gian bắt đầu trả
                  </label>
                  <input
                        type="datetime-local"
                        value={scheduleData.thoi_gian_bat_dau_tra}
                        onChange={(e) => handleScheduleChange('thoi_gian_bat_dau_tra', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClockCircleOutlined className="mr-2 text-gray-400" />
                        Thời gian kết thúc trả
                  </label>
                  <input
                        type="datetime-local"
                        value={scheduleData.thoi_gian_ket_thuc_tra}
                        onChange={(e) => handleScheduleChange('thoi_gian_ket_thuc_tra', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileTextOutlined className="mr-2 text-gray-400" />
                  Nội dung giao dịch
                </label>
                <textarea
                  value={formData.noi_dung}
                  onChange={(e) => handleInputChange('noi_dung', e.target.value)}
                  placeholder="Nhập nội dung giao dịch"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 resize-none"
                  required
                />
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
                    value={formData.so_tien}
                    onChange={(e) => handleInputChange('so_tien', e.target.value)}
                    placeholder="Nhập số tiền (có thể âm)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    step="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Số âm: người nhận trả tiền, Số dương: người nhận nhận tiền
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarOutlined className="mr-2 text-gray-400" />
                    Số điểm
                  </label>
                  <input
                    type="number"
                    value={formData.diem}
                    onChange={(e) => handleInputChange('diem', e.target.value)}
                    placeholder="Nhập số điểm (có thể âm)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Số âm: người nhận trả điểm, Số dương: người nhận nhận điểm
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm flex items-center space-x-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingOutlined className="animate-spin" />
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    <span>Tạo giao dịch</span>
                  )}
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
