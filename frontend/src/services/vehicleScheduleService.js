const API_BASE_URL = 'http://localhost:5000/api'

export const vehicleScheduleService = {
  // Lấy tất cả lịch xe
  async getAllSchedules(token) {
    try {
      console.log('getAllSchedules - Token:', token)
      console.log('getAllSchedules - API URL:', `${API_BASE_URL}/schedules`)
      console.log('getAllSchedules - Headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
      
      const response = await fetch(`${API_BASE_URL}/schedules`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('getAllSchedules - Response status:', response.status)
      console.log('getAllSchedules - Response headers:', response.headers)
      
      const data = await response.json()
      console.log('getAllSchedules - Response data:', data)
      
      return data
    } catch (error) {
      console.error('Error fetching schedules:', error)
      throw error
    }
  },

  // Lấy lịch xe theo nhóm
  async getSchedulesByGroup(token, groupId) {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/group/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching group schedules:', error)
      throw error
    }
  },

  // Tạo lịch xe mới
  async createSchedule(token, scheduleData) {
    try {
      console.log('=== createSchedule Debug ===')
      console.log('Token:', token)
      console.log('Schedule Data:', scheduleData)
      console.log('API URL:', `${API_BASE_URL}/schedules`)
      console.log('Request Headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
      console.log('Request Body:', JSON.stringify(scheduleData, null, 2))
      
      const response = await fetch(`${API_BASE_URL}/schedules`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleData)
      })
      
      console.log('Response Status:', response.status)
      console.log('Response Status Text:', response.statusText)
      console.log('Response Headers:', response.headers)
      
      const data = await response.json()
      console.log('Response Data:', data)
      
      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        })
        throw new Error(data.message || 'Không thể tạo lịch xe')
      }
      
      console.log('=== createSchedule Success ===')
      return data
    } catch (error) {
      console.error('=== createSchedule Error ===')
      console.error('Error details:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      throw error
    }
  },

  // Lấy danh sách loại xe từ database
  async getVehicleTypes(token) {
    try {
      console.log('getVehicleTypes - Token:', token)
      console.log('getVehicleTypes - API URL:', `${API_BASE_URL}/schedules/vehicle-types`)
      
      const response = await fetch(`${API_BASE_URL}/schedules/vehicle-types`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('getVehicleTypes - Response status:', response.status)
      console.log('getVehicleTypes - Response headers:', response.headers)
      
      const data = await response.json()
      console.log('getVehicleTypes - Response data:', data)
      
      return data
    } catch (error) {
      console.error('Error fetching vehicle types:', error)
      throw error
    }
  },

  // Lấy danh sách loại tuyến
  async getRouteTypes(token) {
    try {
      console.log('getRouteTypes - Token:', token)
      console.log('getRouteTypes - API URL:', `${API_BASE_URL}/schedules/route-types`)
      
      const response = await fetch(`${API_BASE_URL}/schedules/route-types`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('getRouteTypes - Response status:', response.status)
      console.log('getRouteTypes - Response headers:', response.headers)
      
      const data = await response.json()
      console.log('getRouteTypes - Response data:', data)
      
      return data
    } catch (error) {
      console.error('Error fetching route types:', error)
      throw error
    }
  },

  // Lấy lịch xe sắp tới (trong 1 tiếng tới)
  async getUpcomingSchedules(token) {
    try {
      console.log('getUpcomingSchedules - Token:', token)
      console.log('getUpcomingSchedules - API URL:', `${API_BASE_URL}/schedules/upcoming`)
      
      const response = await fetch(`${API_BASE_URL}/schedules/upcoming`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching upcoming schedules:', error)
      throw error
    }
  },

  // Lấy lịch xe đã hoàn thành (sau 2 tiếng)
  async getCompletedSchedules(token) {
    try {
      console.log('getCompletedSchedules - Token:', token)
      console.log('getCompletedSchedules - API URL:', `${API_BASE_URL}/schedules/completed`)
      
      const response = await fetch(`${API_BASE_URL}/schedules/completed`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching completed schedules:', error)
      throw error
    }
  },

  // Tự động hoàn thành lịch xe (sau 2 tiếng) - chỉ admin
  async autoCompleteSchedules(token) {
    try {
      console.log('autoCompleteSchedules - Token:', token)
      console.log('autoCompleteSchedules - API URL:', `${API_BASE_URL}/schedules/auto-complete`)
      
      const response = await fetch(`${API_BASE_URL}/schedules/auto-complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error auto-completing schedules:', error)
      throw error
    }
  },

  // Lấy lịch xe của người dùng cụ thể
  async getUserSchedules(token, userId) {
    try {
      console.log('getUserSchedules - Token:', token)
      console.log('getUserSchedules - User ID:', userId)
      console.log('getUserSchedules - API URL:', `${API_BASE_URL}/users/${userId}/schedules`)
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/schedules`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('getUserSchedules - Response data:', data)
      return data
    } catch (error) {
      console.error('Error fetching user schedules:', error)
      throw error
    }
  },

  // Hủy lịch xe
  async cancelSchedule(token, scheduleId) {
    try {
      console.log('cancelSchedule - Token:', token)
      console.log('cancelSchedule - Schedule ID:', scheduleId)
      console.log('cancelSchedule - API URL:', `${API_BASE_URL}/schedules/${scheduleId}/cancel`)
      
      const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('cancelSchedule - Response data:', data)
      return data
    } catch (error) {
      console.error('Error cancelling schedule:', error)
      throw error
    }
  }
}
