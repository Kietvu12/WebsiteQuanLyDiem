const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const groupService = {
  // Lấy tất cả nhóm (admin)
  async getAllGroups(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách nhóm')
      }
      return data
    } catch (error) {
      console.error('groupService - getAllGroups error:', error)
      throw error
    }
  },

  // Lấy nhóm của người dùng
  async getUserGroups(token, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/groups`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách nhóm của người dùng')
      }
      return data
    } catch (error) {
      console.error('groupService - getUserGroups error:', error)
      throw error
    }
  },

  // Lấy thành viên trong nhóm
  async getGroupMembers(token, groupId) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách thành viên')
      }
      return data
    } catch (error) {
      console.error('groupService - getGroupMembers error:', error)
      throw error
    }
  }
}
