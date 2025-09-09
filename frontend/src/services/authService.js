const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const authService = {
  // Đăng nhập
  async login(tenDangNhap, matKhau) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ten_dang_nhap: tenDangNhap,
          mat_khau: matKhau
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại')
      }

      return data
    } catch (error) {
      throw error
    }
  },

  // Lấy thông tin profile
  async getProfile(token) {
    try {
      console.log('authService - Calling getProfile with token:', token.substring(0, 20) + '...')
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // Thêm cache: 'no-cache' để tránh browser cache
        cache: 'no-cache'
      })

      console.log('authService - Profile response status:', response.status)
      console.log('authService - Profile response headers:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('authService - Profile response data:', data)
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy thông tin profile')
      }

      return data
    } catch (error) {
      console.error('authService - getProfile error:', error)
      throw error
    }
  },

  // Cập nhật thông tin profile
  async updateProfile(token, profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật thông tin thất bại')
      }

      return data
    } catch (error) {
      throw error
    }
  },

  // Đổi mật khẩu
  async changePassword(token, passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Đổi mật khẩu thất bại')
      }

      return data
    } catch (error) {
      throw error
    }
  }
}
