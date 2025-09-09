import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useGlobalState } from '../../contexts/GlobalStateContext'
import { 
  UserOutlined,
  DownOutlined,
  EditOutlined,
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
  MenuOutlined
} from '@ant-design/icons'
import Notification from '../Notification/Notification'

const Header = ({ onToggleSidebar }) => {
  const { user, logout, updateProfile, changePassword } = useAuth()
  const { users } = useGlobalState()
  
  // Đảm bảo user tồn tại
  if (!user) {
    console.warn('No user found in AuthContext')
    return null
  }
  
  // Debug: kiểm tra type và giá trị của users
  console.log('Header users type:', typeof users, 'users value:', users, 'isArray:', Array.isArray(users))
  
  // Tìm user hiện tại trong global state để có thông tin mới nhất
  // Fallback an toàn: luôn đảm bảo currentUser có giá trị
  let currentUser = user // Fallback về user từ AuthContext
  
  try {
    if (Array.isArray(users) && users.length > 0) {
      const foundUser = users.find(u => u.id_nguoi_dung === user?.id_nguoi_dung)
      if (foundUser) {
        currentUser = foundUser
      }
    }
  } catch (error) {
    console.error('Error finding current user in users array:', error)
    // Giữ nguyên currentUser = user (fallback)
  }
  
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [profileData, setProfileData] = useState({
    ho_ten: currentUser?.ho_ten || '',
    so_dien_thoai: currentUser?.so_dien_thoai || '',
    dia_chi: currentUser?.dia_chi || ''
  })
  const [passwordData, setPasswordData] = useState({
    mat_khau_cu: '',
    mat_khau_moi: '',
    xac_nhan_mat_khau: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const handleMenuClick = (action) => {
    setActiveModal(action)
    setIsProfileOpen(false)
    
    // Reset form data khi mở modal
    if (action === 'edit-profile') {
      setProfileData({
        ho_ten: user?.ho_ten || '',
        so_dien_thoai: user?.so_dien_thoai || '',
        dia_chi: user?.dia_chi || ''
      })
      setProfileError('')
    } else if (action === 'change-password') {
      setPasswordData({
        mat_khau_cu: '',
        mat_khau_moi: '',
        xac_nhan_mat_khau: ''
      })
      setPasswordError('')
    }
  }

  const closeModal = () => {
    setActiveModal(null)
    setProfileError('')
    setPasswordError('')
    setIsSubmitting(false)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setProfileError('')
    
    try {
      const result = await updateProfile(profileData)
      if (result.success) {
        closeModal()
        // Có thể hiển thị thông báo thành công ở đây
      }
    } catch (error) {
      setProfileError(error.message || 'Cập nhật thông tin thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordData.mat_khau_moi !== passwordData.xac_nhan_mat_khau) {
      setPasswordError('Mật khẩu xác nhận không khớp!')
      return
    }
    
    setIsSubmitting(true)
    setPasswordError('')
    
    try {
      const result = await changePassword({
        mat_khau_cu: passwordData.mat_khau_cu,
        mat_khau_moi: passwordData.mat_khau_moi
      })
      
      if (result.success) {
        closeModal()
        // Có thể hiển thị thông báo thành công ở đây
      }
    } catch (error) {
      setPasswordError(error.message || 'Đổi mật khẩu thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    closeModal()
  }

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <>
            <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between fixed top-0 left-0 lg:left-72 right-0 z-30 h-16">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors mr-4"
        >
          <MenuOutlined className="text-gray-600 text-lg" />
        </button>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <Notification />
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <UserOutlined className="text-white text-sm" />
              </div>
              {/* Ẩn tên người dùng ở mobile */}
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {profileData.ho_ten || 'Người dùng'}
              </span>
              <DownOutlined className="hidden md:block text-xs text-gray-500" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                {/* User Info Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-white text-base" />
                    </div>
                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800">
                    {currentUser?.ho_ten || currentUser?.ten_dang_nhap || 'User'}
                  </h3>
                  <p className="text-xs text-gray-500">{currentUser?.email || 'user@example.com'}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      (currentUser?.la_admin === 1 || currentUser?.la_admin === true)
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {(currentUser?.la_admin === 1 || currentUser?.la_admin === true) ? 'Admin' : 'Member'}
                    </span>
                  </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => handleMenuClick('edit-profile')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <EditOutlined className="text-blue-500 text-sm" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Sửa thông tin cá nhân</span>
                      <p className="text-xs text-gray-500">Cập nhật thông tin cá nhân</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleMenuClick('change-password')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <LockOutlined className="text-green-500 text-sm" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Đổi mật khẩu</span>
                      <p className="text-xs text-gray-500">Thay đổi mật khẩu tài khoản</p>
                    </div>
                  </button>

                  {(currentUser?.la_admin === 1 || currentUser?.la_admin === true) && (
                    <button
                      onClick={() => handleMenuClick('settings')}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                        <SettingOutlined className="text-purple-500 text-sm" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Cài đặt</span>
                        <p className="text-xs text-gray-500">Tùy chỉnh hệ thống</p>
                      </div>
                    </button>
                  )}
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={() => handleMenuClick('logout')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors group rounded-xl"
                  >
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <LogoutOutlined className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-red-600">Đăng xuất</span>
                      <p className="text-xs text-red-400">Thoát khỏi hệ thống</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {activeModal === 'edit-profile' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <EditOutlined className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Sửa thông tin cá nhân</h2>
                  <p className="text-sm text-gray-500">Cập nhật thông tin cá nhân của bạn</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                disabled={isSubmitting}
              >
                <CloseOutlined className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
              {/* Error Message */}
              {profileError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <ExclamationCircleOutlined className="text-red-500 text-lg" />
                    <span className="text-red-700 text-sm font-medium">{profileError}</span>
                  </div>
                </div>
              )}

              {/* Avatar Upload */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserOutlined className="text-white text-2xl" />
                </div>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Thay đổi ảnh đại diện
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserOutlined className="mr-2 text-gray-400" />
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={profileData.ho_ten}
                    onChange={(e) => handleInputChange('ho_ten', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MailOutlined className="mr-2 text-gray-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-500 text-sm bg-gray-100"
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <PhoneOutlined className="mr-2 text-gray-400" />
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={profileData.so_dien_thoai}
                    onChange={(e) => handleInputChange('so_dien_thoai', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <HomeOutlined className="mr-2 text-gray-400" />
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={profileData.dia_chi}
                    onChange={(e) => handleInputChange('dia_chi', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {activeModal === 'change-password' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <LockOutlined className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Đổi mật khẩu</h2>
                  <p className="text-sm text-gray-500">Thay đổi mật khẩu tài khoản</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                disabled={isSubmitting}
              >
                <CloseOutlined className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              {/* Error Message */}
              {passwordError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <ExclamationCircleOutlined className="text-red-500 text-lg" />
                    <span className="text-red-700 text-sm font-medium">{passwordError}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordData.mat_khau_cu}
                  onChange={(e) => handlePasswordChange('mat_khau_cu', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.mat_khau_moi}
                  onChange={(e) => handlePasswordChange('mat_khau_moi', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.xac_nhan_mat_khau}
                  onChange={(e) => handlePasswordChange('xac_nhan_mat_khau', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal - Chỉ hiển thị cho Admin */}
      {activeModal === 'settings' && currentUser?.la_admin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <SettingOutlined className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Cài đặt hệ thống</h2>
                  <p className="text-sm text-gray-500">Tùy chỉnh cài đặt hệ thống</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <CloseOutlined className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Thông báo email</h3>
                    <p className="text-xs text-gray-500">Nhận thông báo qua email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Thông báo push</h3>
                    <p className="text-xs text-gray-500">Nhận thông báo push trên trình duyệt</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Chế độ tối</h3>
                    <p className="text-xs text-gray-500">Bật chế độ tối cho giao diện</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
                >
                  Lưu cài đặt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {activeModal === 'logout' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <LogoutOutlined className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Xác nhận đăng xuất</h2>
                  <p className="text-sm text-gray-500">Bạn có chắc chắn muốn đăng xuất?</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <CloseOutlined className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-gray-600">Bạn sẽ bị đăng xuất khỏi hệ thống và cần đăng nhập lại để tiếp tục sử dụng.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
