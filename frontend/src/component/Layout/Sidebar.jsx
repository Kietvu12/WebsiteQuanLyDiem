import React, { useState } from 'react'
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

const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
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
    },
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
  ]

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

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <div className={`${
                  activeTab === item.id
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-gray-600'
                }`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
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
