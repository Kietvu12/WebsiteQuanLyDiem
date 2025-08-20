import React, { useState } from 'react'
import { 
  SearchOutlined,
  UserOutlined,
  DownOutlined,
  EditOutlined,
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined
} from '@ant-design/icons'
import Notification from '../Notification/Notification'

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [profileData, setProfileData] = useState({
    fullName: 'Anne Douglas',
    email: 'anne.douglas@example.com',
    phone: '0123456789',
    address: 'Hà Nội, Việt Nam',
    avatar: null
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const handleMenuClick = (action) => {
    setActiveModal(action)
    setIsProfileOpen(false)
  }

  const closeModal = () => {
    setActiveModal(null)
    // Reset form data
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    console.log('Cập nhật thông tin cá nhân:', profileData)
    closeModal()
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }
    console.log('Đổi mật khẩu:', passwordData)
    closeModal()
  }

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      console.log('Đăng xuất')
      closeModal()
      // Xử lý logic đăng xuất ở đây
    }
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
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between fixed top-0 left-72 right-0 z-30 h-16">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Quick Search (ctrl+D)"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
            />
            <SearchOutlined className="absolute left-3.5 top-3 text-gray-400 text-sm" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <Notification />
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all duration-200"
              onClick={handleProfileClick}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <UserOutlined className="text-white text-sm" />
              </div>
              <span className="text-gray-700 text-sm font-medium">Anne Douglas</span>
              <DownOutlined className={`text-gray-400 text-xs transition-transform duration-200 ${
                isProfileOpen ? 'rotate-180' : ''
              }`} />
            </div>

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
                      <h3 className="text-sm font-semibold text-gray-800">Anne Douglas</h3>
                      <p className="text-xs text-gray-500">anne.douglas@example.com</p>
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
              >
                <CloseOutlined className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
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
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MailOutlined className="mr-2 text-gray-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <PhoneOutlined className="mr-2 text-gray-400" />
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <HomeOutlined className="mr-2 text-gray-400" />
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
                >
                  Cập nhật
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
              >
                <CloseOutlined className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
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
