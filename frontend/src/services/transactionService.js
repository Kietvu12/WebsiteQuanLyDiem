const API_BASE_URL = 'http://localhost:5000/api'

export const transactionService = {
  // Lấy tất cả giao dịch
  async getAllTransactions(token) {
    try {
      console.log('🔗 === getAllTransactions Service ===');
      console.log('🔗 API URL:', `${API_BASE_URL}/transactions`);
      console.log('🔗 Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })
      
      console.log('🔗 Response status:', response.status);
      console.log('🔗 Response statusText:', response.statusText);

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách giao dịch')
      }
      return data
    } catch (error) {
      console.error('transactionService - getAllTransactions error:', error)
      throw error
    }
  },

  // Tạo giao dịch mới
  async createTransaction(token, transactionData) {
    try {
      console.log('=== createTransaction Debug ===')
      console.log('Token:', token)
      console.log('Transaction Data:', transactionData)
      console.log('API URL:', `${API_BASE_URL}/transactions`)
      console.log('Request Headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      })
      console.log('Request Body:', JSON.stringify(transactionData, null, 2))
      
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
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
        throw new Error(data.message || 'Không thể tạo giao dịch')
      }
      
      console.log('=== createTransaction Success ===')
      return data
    } catch (error) {
      console.error('=== createTransaction Error ===')
      console.error('Error details:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      throw error
    }
  },

  // Xác nhận giao dịch
  async confirmTransaction(token, transactionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Không thể xác nhận giao dịch')
      }
      return data
    } catch (error) {
      console.error('transactionService - confirmTransaction error:', error)
      throw error
    }
  },

  // Hủy giao dịch
  async cancelTransaction(token, transactionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Không thể hủy giao dịch')
      }
      return data
    } catch (error) {
      console.error('transactionService - cancelTransaction error:', error)
      throw error
    }
  },

  // Lấy giao dịch theo người dùng
  async getUserTransactions(token, userId) {
    try {
      console.log('🔗 === getUserTransactions Service ===');
      console.log('🔗 API URL:', `${API_BASE_URL}/users/${userId}/transactions`);
      console.log('🔗 User ID:', userId);
      console.log('🔗 Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/transactions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })
      
      console.log('🔗 Response status:', response.status);
      console.log('🔗 Response statusText:', response.statusText);

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy giao dịch của người dùng')
      }
      return data
    } catch (error) {
      console.error('transactionService - getUserTransactions error:', error)
      throw error
    }
  }
}
