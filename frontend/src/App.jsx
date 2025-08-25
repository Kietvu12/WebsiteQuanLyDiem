import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { GlobalStateProvider } from './contexts/GlobalStateContext'
import LoginPage from './page/LoginPage/LoginPage'
import Layout from './component/Layout/Layout'

// Component con để sử dụng useAuth hook
const AppRoutes = () => {
  const { isAuthenticated, loading, error } = useAuth()

  console.log('AppRoutes - isAuthenticated:', isAuthenticated)
  console.log('AppRoutes - loading:', loading)
  console.log('AppRoutes - error:', error)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
          <p className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Có lỗi xảy ra</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex space-x-3 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Tải lại trang
            </button>
            <button 
              onClick={() => {
                const { clearError } = useAuth()
                clearError()
              }} 
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Fallback UI nếu có lỗi
  if (isAuthenticated === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Có lỗi xảy ra</h1>
          <p className="text-red-600 mb-4">Không thể xác định trạng thái đăng nhập</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Route cho trang đăng nhập */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } 
      />
      
      {/* Route cho trang chính - cần đăng nhập */}
      <Route 
        path="/*" 
        element={
          isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <GlobalStateProvider>
        <Router>
          <AppRoutes />
        </Router>
      </GlobalStateProvider>
    </AuthProvider>
  )
}

export default App
