import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../../components/ProtectedRoute'
import Sidebar from './Sidebar'
import Header from './Header'
import AddNewTransaction from '../AddNewTransaction/AddNewTransaction'
import HomePage from '../../page/HomePage/HomePage'
import VehicleSchedulePage from '../../page/VehicleSchedulePage/VehicleSchedulePage'
import GroupsPage from '../../page/GroupsPage/GroupsPage'
import UsersPage from '../../page/UsersPage/UsersPage'
import ReportsPage from '../../page/ReportsPage/ReportsPage'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-25">
      <Sidebar />
      <Header />
      <div className="ml-72 pt-16 min-h-screen">
        <div className="p-8">
          <Routes>
            {/* Các trang cơ bản - tất cả user đều truy cập được */}
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/vehicle-schedule" element={
              <ProtectedRoute>
                <VehicleSchedulePage />
              </ProtectedRoute>
            } />
            
            {/* Các trang chỉ admin mới truy cập được */}
            <Route path="/groups" element={
              <ProtectedRoute requireAdmin={true}>
                <GroupsPage />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute requireAdmin={true}>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute requireAdmin={true}>
                <ReportsPage />
              </ProtectedRoute>
            } />
            
            {/* Redirect về trang chủ nếu truy cập trang không được phép */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      <AddNewTransaction />
    </div>
  )
}

export default Layout
