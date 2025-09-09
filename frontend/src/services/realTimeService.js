import { transactionService } from './transactionService'
import { groupService } from './groupService'
import { vehicleScheduleService } from './vehicleScheduleService'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
class RealTimeService {
  constructor() {
    this.pollingIntervals = new Map()
    this.subscribers = new Map()
    this.isPolling = false
    this.pollInterval = 5000 // 5 giây
  }

  // Đăng ký callback để nhận updates
  subscribe(dataType, callback) {
    if (!this.subscribers.has(dataType)) {
      this.subscribers.set(dataType, new Set())
    }
    this.subscribers.get(dataType).add(callback)
    
    // Trả về unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(dataType)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.subscribers.delete(dataType)
        }
      }
    }
  }

  // Thông báo cho tất cả subscribers
  notify(dataType, data) {
    console.log(`🔔 RealTimeService - Notifying ${dataType}:`, data)
    console.log(`🔔 RealTimeService - Data type:`, typeof data)
    console.log(`🔔 RealTimeService - Is array:`, Array.isArray(data))
    if (data && typeof data === 'object') {
      console.log(`🔔 RealTimeService - Object keys:`, Object.keys(data))
    }
    
    const callbacks = this.subscribers.get(dataType)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in ${dataType} subscriber:`, error)
        }
      })
    }
  }

  // Bắt đầu polling cho một loại dữ liệu
  startPolling(dataType, fetchFunction) {
    if (this.pollingIntervals.has(dataType)) {
      return // Đã polling rồi
    }

    const interval = setInterval(async () => {
      try {
        const data = await fetchFunction()
        this.notify(dataType, data)
      } catch (error) {
        console.error(`Error polling ${dataType}:`, error)
      }
    }, this.pollInterval)

    this.pollingIntervals.set(dataType, interval)
    console.log(`Started polling for ${dataType}`)
  }

  // Dừng polling cho một loại dữ liệu
  stopPolling(dataType) {
    const interval = this.pollingIntervals.get(dataType)
    if (interval) {
      clearInterval(interval)
      this.pollingIntervals.delete(dataType)
      console.log(`Stopped polling for ${dataType}`)
    }
  }

  // Dừng tất cả polling
  stopAllPolling() {
    this.pollingIntervals.forEach((interval, dataType) => {
      clearInterval(interval)
      console.log(`Stopped polling for ${dataType}`)
    })
    this.pollingIntervals.clear()
  }

  // Cập nhật dữ liệu ngay lập tức (không cần chờ polling)
  updateDataImmediately(dataType, data) {
    this.notify(dataType, data)
  }

  // Khởi tạo polling cho tất cả loại dữ liệu
  initializePolling(token, userId, isAdmin = false) {
    if (this.isPolling) {
      return
    }

    this.isPolling = true

    // Polling cho transactions
    this.startPolling('transactions', async () => {
      try {
        if (isAdmin) {
          const response = await transactionService.getAllTransactions(token)
          return response.success ? response.data : []
        } else {
          const response = await transactionService.getUserTransactions(token, userId)
          return response.success ? response.data : []
        }
      } catch (error) {
        console.error('Error polling transactions:', error)
        return []
      }
    })

    // Polling cho groups (chỉ admin)
    if (isAdmin) {
      this.startPolling('groups', async () => {
        try {
          const response = await groupService.getAllGroups(token)
          return response.success ? response.data : []
        } catch (error) {
          console.error('Error polling groups:', error)
          return []
        }
      })
    }

    // Polling cho notifications
    this.startPolling('notifications', async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        return data.success ? data.data : []
      } catch (error) {
        console.error('Error polling notifications:', error)
        return []
      }
    })

    // Polling cho schedules
    this.startPolling('schedules', async () => {
      try {
        if (isAdmin) {
          const response = await vehicleScheduleService.getAllSchedules(token)
          return response.success ? response.data : []
        } else {
          const response = await vehicleScheduleService.getUserSchedules(token, userId)
          return response.success ? response.data : []
        }
      } catch (error) {
        console.error('Error polling schedules:', error)
        return []
      }
    })

    console.log('Real-time polling initialized')
  }

  // Cleanup khi component unmount
  cleanup() {
    this.stopAllPolling()
    this.subscribers.clear()
    this.isPolling = false
  }
}

// Export singleton instance
export const realTimeService = new RealTimeService()
