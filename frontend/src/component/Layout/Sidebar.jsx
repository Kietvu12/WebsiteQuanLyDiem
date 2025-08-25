import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useGlobalState } from '../../contexts/GlobalStateContext'
import { 
  DashboardOutlined,
  FileTextOutlined,
  CalendarOutlined,
  MessageOutlined,
  RocketOutlined,
  TransactionOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
  CloseOutlined
} from '@ant-design/icons'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { user } = useAuth()
  const { users } = useGlobalState()
  
  // Tìm user hiện tại trong global state để có thông tin mới nhất
  const currentUser = users.find(u => u.id_nguoi_dung === user?.id_nguoi_dung) || user
  
  console.log('Sidebar user:', currentUser);
  
  // Menu items dựa trên vai trò
  const getMenuItems = () => {
    // Sửa logic so sánh: la_admin có thể là 1 hoặc true
    const isAdmin = currentUser?.la_admin === 1 || currentUser?.la_admin === true
    
    const baseMenuItems = [
      {
        id: 'transactions',
        label: 'Quản lý giao dịch',
        icon: <TransactionOutlined className="text-xl" />,
        path: '/'
      },
      {
        id: 'vehicle-schedule',
        label: 'Quản lý lịch xe',
        icon: <CalendarOutlined className="text-xl" />,
        path: '/vehicle-schedule'
      }
    ]

    // Chỉ admin mới thấy các tab quản lý
    if (isAdmin) {
      baseMenuItems.push(
        {
          id: 'groups',
          label: 'Quản lý Nhóm',
          icon: <TeamOutlined className="text-xl" />,
          path: '/groups'
        },
        {
          id: 'users',
          label: 'Quản lý người dùng',
          icon: <UserOutlined className="text-xl" />,
          path: '/users'
        },
        {
          id: 'reports',
          label: 'Danh sách báo cáo',
          icon: <BarChartOutlined className="text-xl" />,
          path: '/reports'
        }
      )
    }

    return baseMenuItems
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Close button for mobile */}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <CloseOutlined className="text-gray-500" />
          </button>
        </div>

        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <RocketOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Quản Lý Điểm</h1>
              <p className="text-xs text-gray-500">Hệ thống quản lý</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <UserOutlined className="text-white text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {currentUser?.ho_ten || currentUser?.ten_dang_nhap || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.email || 'user@example.com'}
              </p>
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
          
          {/* Số dư và điểm */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">₫</span>
                </div>
                <span className="text-xs text-gray-600">Số dư</span>
              </div>
              <span className="text-sm font-semibold text-green-700">
                {currentUser?.so_du ? `${parseFloat(currentUser.so_du).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">★</span>
                </div>
                <span className="text-xs text-gray-600">Điểm</span>
              </div>
              <span className="text-sm font-semibold text-blue-700">
                {currentUser?.diem ? `${parseFloat(currentUser.diem).toLocaleString('vi-VN')}` : '0'} điểm
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <div className={`${
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                      {item.icon}
                    </div>
                    <span className={`font-medium ${
                      isActive ? 'text-white' : ''
                    }`}>{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-400">© 2024 Quản Lý Điểm</p>
            <p className="text-xs text-gray-400">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
