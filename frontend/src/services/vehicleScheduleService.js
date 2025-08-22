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

  // Lấy danh sách loại tuyến từ database
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
  }
}
