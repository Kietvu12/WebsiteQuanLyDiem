import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  DashboardOutlined,
  FileTextOutlined,
  CalendarOutlined,
  MessageOutlined,
  RocketOutlined,
  TransactionOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined
} from '@ant-design/icons'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()
  console.log('Sidebar user:', user);
  
  // Menu items dựa trên vai trò
  const getMenuItems = () => {
    // Sửa logic so sánh: la_admin có thể là 1 hoặc true
    const isAdmin = user?.la_admin === 1 || user?.la_admin === true
    
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
    <div className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 z-40">
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
              {user?.ho_ten || user?.ten_dang_nhap || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
            <div className="flex items-center mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                (user?.la_admin === 1 || user?.la_admin === true)
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {(user?.la_admin === 1 || user?.la_admin === true) ? 'Admin' : 'Member'}
              </span>
            </div>
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
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
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
                  <span className="font-medium">{item.label}</span>
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
  )
}

export default Sidebar
