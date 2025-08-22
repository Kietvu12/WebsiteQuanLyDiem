import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-25 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  // Kiểm tra đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Kiểm tra quyền admin nếu cần - sửa logic so sánh
  if (requireAdmin && !(user?.la_admin === 1 || user?.la_admin === true)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
