import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Debug function để kiểm tra localStorage
  const debugLocalStorage = () => {
    console.log('=== LocalStorage Debug ===')
    console.log('authToken:', localStorage.getItem('authToken'))
    console.log('userData:', localStorage.getItem('userData'))
    console.log('Current state - isAuthenticated:', isAuthenticated)
    console.log('Current state - user:', user)
    console.log('Current state - loading:', loading)
    console.log('Current state - error:', error)
    console.log('========================')
  }

  // Function để force restore user từ localStorage
  const forceRestoreUser = () => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData)
        console.log('AuthContext - Force restoring user:', parsedUserData)
        setIsAuthenticated(true)
        setUser(parsedUserData)
        return true
      } catch (error) {
        console.error('AuthContext - Force restore failed:', error)
        return false
      }
    }
    return false
  }

  // Thêm debug functions vào window
  useEffect(() => {
    window.debugAuth = debugLocalStorage
    window.forceRestoreUser = forceRestoreUser
    window.clearAuth = () => {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      setIsAuthenticated(false)
      setUser(null)
      console.log('Auth cleared')
    }
    
    return () => {
      delete window.debugAuth
      delete window.forceRestoreUser
      delete window.clearAuth
    }
  }, [])

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage khi component mount
    const checkAuthStatus = async () => {
      try {
        console.log('AuthContext - Component mounted, checking auth status...')
        debugLocalStorage()
        
        const token = localStorage.getItem('authToken')
        const userData = localStorage.getItem('userData')
        
        console.log('AuthContext - Token:', token)
        console.log('AuthContext - UserData from localStorage:', userData)
        
        if (token && userData && userData !== 'undefined' && userData !== 'null') {
          try {
            // Đầu tiên khôi phục user data từ localStorage để UI hiển thị ngay
            const parsedUserData = JSON.parse(userData)
            console.log('AuthContext - Restoring user from localStorage:', parsedUserData)
            
            // Kiểm tra parsed data có hợp lệ không
            if (parsedUserData && typeof parsedUserData === 'object') {
              setIsAuthenticated(true)
              setUser(parsedUserData)
              setError(null)
              console.log('AuthContext - User restored from localStorage successfully')
            } else {
              console.error('AuthContext - Invalid user data from localStorage:', parsedUserData)
              throw new Error('Invalid user data')
            }
            
            // Sau đó mới validate token với API (không blocking)
            console.log('AuthContext - Validating token with API...')
            try {
              const profileResponse = await authService.getProfile(token)
              console.log('AuthContext - Profile API response:', profileResponse)
              
              if (profileResponse.success) {
                // Cập nhật user data mới nhất từ API
                const userData = profileResponse.data.user || profileResponse.data
                console.log('AuthContext - Updating user from API:', userData)
                setUser(userData)
                // Cập nhật localStorage với data mới
                localStorage.setItem('userData', JSON.stringify(userData))
              } else {
                console.log('AuthContext - API response not successful, keeping localStorage data')
              }
            } catch (apiError) {
              console.error('AuthContext - API validation failed, keeping localStorage data:', apiError)
              // API thất bại không ảnh hưởng đến user đã đăng nhập
            }
          } catch (parseError) {
            console.error('AuthContext - Failed to parse user data from localStorage:', parseError)
            // Xóa dữ liệu không hợp lệ
            localStorage.removeItem('authToken')
            localStorage.removeItem('userData')
            setIsAuthenticated(false)
            setUser(null)
            setError('Dữ liệu đăng nhập không hợp lệ')
          }
        } else {
          console.log('AuthContext - No token or userData found in localStorage')
          setIsAuthenticated(false)
          setUser(null)
          setError(null)
        }
      } catch (error) {
        console.error('AuthContext - Unexpected error in checkAuthStatus:', error)
        setError('Có lỗi xảy ra khi kiểm tra trạng thái đăng nhập')
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        // Luôn set loading = false sau khi kiểm tra xong
        console.log('AuthContext - Setting loading to false')
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (tenDangNhap, matKhau) => {
    try {
      console.log('AuthContext - Login attempt for:', tenDangNhap)
      const response = await authService.login(tenDangNhap, matKhau)
      console.log('AuthContext - Login API response:', response)
      
      if (response.success) {
        const { user, token } = response.data
        console.log('AuthContext - Login successful, user:', user)
        console.log('AuthContext - Login successful, token:', token)
        console.log('AuthContext - User type:', typeof user)
        console.log('AuthContext - User stringify:', JSON.stringify(user))
        
        // Kiểm tra user data trước khi lưu
        if (!user) {
          throw new Error('User data is null or undefined')
        }
        
        // Lưu thông tin vào localStorage
        localStorage.setItem('authToken', token)
        localStorage.setItem('userData', JSON.stringify(user))
        
        // Verify việc lưu
        const savedUserData = localStorage.getItem('userData')
        console.log('AuthContext - Saved userData to localStorage:', savedUserData)
        
        // Cập nhật state
        setIsAuthenticated(true)
        setUser(user)
        
        return { success: true, user }
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      console.error('AuthContext - Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  }

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('Không có token xác thực')

      const response = await authService.updateProfile(token, profileData)
      
      if (response.success) {
        // Cập nhật thông tin user trong state
        setUser(prevUser => ({
          ...prevUser,
          ...response.data.user
        }))
        
        // Cập nhật localStorage
        localStorage.setItem('userData', JSON.stringify({
          ...user,
          ...response.data.user
        }))
        
        return { success: true, user: response.data.user }
      } else {
        throw new Error(response.message || 'Cập nhật thông tin thất bại')
      }
    } catch (error) {
      throw error
    }
  }

  const changePassword = async (passwordData) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('Không có token xác thực')

      const response = await authService.changePassword(token, passwordData)
      return response
    } catch (error) {
      throw error
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    forceRestoreUser,
    debugLocalStorage,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
