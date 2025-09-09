import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { realTimeService } from '../services/realTimeService'

const GlobalStateContext = createContext()

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}

export const GlobalStateProvider = ({ children }) => {
  // State cho các dữ liệu chính
  const [transactions, setTransactions] = useState([])
  const [groups, setGroups] = useState([])
  const [users, setUsers] = useState([])
  const [schedules, setSchedules] = useState([])
  const [notifications, setNotifications] = useState([])
  
  // Các hàm cập nhật state
  const updateTransactions = useCallback((newTransactions) => {
    setTransactions(newTransactions)
  }, [])

  const addTransaction = useCallback((newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev])
    // Cập nhật real-time service ngay lập tức
    realTimeService.updateDataImmediately('transactions', [newTransaction, ...transactions])
  }, [transactions])

  const updateTransaction = useCallback((transactionId, updates) => {
    setTransactions(prev => {
      const updated = prev.map(t => 
        t.id_giao_dich === transactionId ? { ...t, ...updates } : t
      )
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('transactions', updated)
      return updated
    })
  }, [])

  const removeTransaction = useCallback((transactionId) => {
    setTransactions(prev => {
      const filtered = prev.filter(t => t.id_giao_dich !== transactionId)
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('transactions', filtered)
      return filtered
    })
  }, [])

  const updateGroups = useCallback((newGroups) => {
    setGroups(newGroups)
  }, [])

  const addGroup = useCallback((newGroup) => {
    setGroups(prev => {
      const updated = [newGroup, ...prev]
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('groups', updated)
      return updated
    })
  }, [])

  const updateGroup = useCallback((groupId, updates) => {
    setGroups(prev => {
      const updated = prev.map(g => 
        g.id_nhom === groupId ? { ...g, ...updates } : g
      )
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('groups', updated)
      return updated
    })
  }, [])

  const removeGroup = useCallback((groupId) => {
    setGroups(prev => {
      const filtered = prev.filter(g => g.id_nhom !== groupId)
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('groups', filtered)
      return filtered
    })
  }, [])

  const updateUsers = useCallback((newUsers) => {
    setUsers(newUsers)
  }, [])

  const addUser = useCallback((newUser) => {
    setUsers(prev => {
      const updated = [newUser, ...prev]
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('users', updated)
      return updated
    })
  }, [])

  const updateUser = useCallback((userId, updates) => {
    setUsers(prev => {
      const updated = prev.map(u => 
        u.id_nguoi_dung === userId ? { ...u, ...updates } : u
      )
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('users', updated)
      return updated
    })
  }, [])

  const removeUser = useCallback((userId) => {
    setUsers(prev => {
      const filtered = prev.filter(u => u.id_nguoi_dung !== userId)
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('users', filtered)
      return filtered
    })
  }, [])

  const updateSchedules = useCallback((newSchedules) => {
    setSchedules(newSchedules)
  }, [])

  const addSchedule = useCallback((newSchedule) => {
    setSchedules(prev => {
      const updated = [newSchedule, ...prev]
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('schedules', updated)
      return updated
    })
  }, [])

  const updateSchedule = useCallback((scheduleId, updates) => {
    setSchedules(prev => {
      const updated = prev.map(s => 
        s.id_lich_xe === scheduleId ? { ...s, ...updates } : s
      )
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('schedules', updated)
      return updated
    })
  }, [])

  const removeSchedule = useCallback((scheduleId) => {
    setSchedules(prev => {
      const filtered = prev.filter(s => s.id_lich_xe !== scheduleId)
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('schedules', filtered)
      return filtered
    })
  }, [])

  const updateNotifications = useCallback((newNotifications) => {
    setNotifications(newNotifications)
  }, [])

  const addNotification = useCallback((newNotification) => {
    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('notifications', updated)
      return updated
    })
  }, [])

  const updateNotification = useCallback((notificationId, updates) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id_thong_bao === notificationId ? { ...n, ...updates } : n
      )
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('notifications', updated)
      return updated
    })
  }, [])

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const filtered = prev.filter(n => n.id_thong_bao !== notificationId)
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('notifications', filtered)
      return filtered
    })
  }, [])

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id_thong_bao === notificationId ? { ...n, da_doc: true } : n
      )
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('notifications', updated)
      return updated
    })
  }, [])

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, da_doc: true }))
      // Cập nhật real-time service ngay lập tức
      realTimeService.updateDataImmediately('notifications', updated)
      return updated
    })
  }, [])

     // Hàm cập nhật đồng thời nhiều state
   const updateMultipleStates = useCallback((updates) => {
     console.log('🔔 GlobalStateContext - updateMultipleStates called with:', updates)
     
     if (updates.transactions) {
       if (Array.isArray(updates.transactions)) {
         setTransactions(updates.transactions)
       } else if (updates.transactions && typeof updates.transactions === 'object' && 'transactions' in updates.transactions) {
         setTransactions(Array.isArray(updates.transactions.transactions) ? updates.transactions.transactions : [])
       } else {
         setTransactions([])
       }
     }
     if (updates.groups) {
       if (Array.isArray(updates.groups)) {
         setGroups(updates.groups)
       } else if (updates.groups && typeof updates.groups === 'object' && 'groups' in updates.groups) {
         setGroups(Array.isArray(updates.groups.groups) ? updates.groups.groups : [])
       } else {
         setGroups([])
       }
     }
     if (updates.users) {
       console.log('🔔 GlobalStateContext - Processing users update:', updates.users)
       if (Array.isArray(updates.users)) {
         console.log('✅ Setting users to array:', updates.users)
         setUsers(updates.users)
       } else if (updates.users && typeof updates.users === 'object' && 'users' in updates.users) {
         console.log('✅ Setting users to updates.users.users:', updates.users.users)
         setUsers(Array.isArray(updates.users.users) ? updates.users.users : [])
       } else {
         console.log('❌ Invalid users structure, setting to empty array')
         setUsers([])
       }
     }
     if (updates.schedules) {
       if (Array.isArray(updates.schedules)) {
         setSchedules(updates.schedules)
       } else if (updates.schedules && typeof updates.schedules === 'object' && 'schedules' in updates.schedules) {
         setSchedules(Array.isArray(updates.schedules.schedules) ? updates.schedules.schedules : [])
       } else {
         setSchedules([])
       }
     }
     if (updates.notifications) {
       if (Array.isArray(updates.notifications)) {
         setNotifications(updates.notifications)
       } else if (updates.notifications && typeof updates.notifications === 'object' && 'notifications' in updates.notifications) {
         setNotifications(Array.isArray(updates.notifications.notifications) ? updates.notifications.notifications : [])
       } else {
         setNotifications([])
       }
     }
   }, [])

  // Hàm khởi tạo real-time updates
  const initializeRealTimeUpdates = useCallback((token, userId, isAdmin = false) => {
    // Đăng ký listeners cho real-time updates
         const unsubscribeTransactions = realTimeService.subscribe('transactions', (data) => {
       // Đảm bảo data là array trước khi set
       if (Array.isArray(data)) {
         setTransactions(data)
       } else if (data && data.transactions && Array.isArray(data.transactions)) {
         setTransactions(data.transactions)
       } else if (data && typeof data === 'object' && 'transactions' in data) {
         // Xử lý trường hợp data có cấu trúc {transactions: [...]}
         if (Array.isArray(data.transactions)) {
           setTransactions(data.transactions)
         } else {
           console.warn('Invalid transactions data structure:', data)
           setTransactions([])
         }
       } else {
         console.warn('Invalid transactions data received:', data)
         setTransactions([])
       }
     })

         const unsubscribeGroups = realTimeService.subscribe('groups', (data) => {
       // Đảm bảo data là array trước khi set
       if (Array.isArray(data)) {
         setGroups(data)
       } else if (data && data.groups && Array.isArray(data.groups)) {
         setGroups(data.groups)
       } else if (data && typeof data === 'object' && 'groups' in data) {
         // Xử lý trường hợp data có cấu trúc {groups: [...]}
         if (Array.isArray(data.groups)) {
           setGroups(data.groups)
         } else {
           console.warn('Invalid groups data structure:', data)
           setGroups([])
         }
       } else {
         console.warn('Invalid groups data received:', data)
         setGroups([])
       }
     })

         const unsubscribeUsers = realTimeService.subscribe('users', (data) => {
       console.log('🔔 GlobalStateContext - Users subscription received:', data)
       // Đảm bảo data là array trước khi set
       if (Array.isArray(data)) {
         console.log('✅ Setting users to array:', data)
         setUsers(data)
       } else if (data && data.users && Array.isArray(data.users)) {
         console.log('✅ Setting users to data.users:', data.users)
         setUsers(data.users)
       } else if (data && typeof data === 'object' && 'users' in data) {
         // Xử lý trường hợp data có cấu trúc {users: [...]}
         if (Array.isArray(data.users)) {
           console.log('✅ Setting users to data.users (nested):', data.users)
           setUsers(data.users)
         } else {
           console.warn('❌ Invalid users data structure:', data)
           setUsers([])
         }
       } else {
         console.warn('❌ Invalid users data received:', data)
         setUsers([])
       }
     })

         const unsubscribeSchedules = realTimeService.subscribe('schedules', (data) => {
       // Đảm bảo data là array trước khi set
       if (Array.isArray(data)) {
         setSchedules(data)
       } else if (data && data.schedules && Array.isArray(data.schedules)) {
         setSchedules(data.schedules)
       } else if (data && typeof data === 'object' && 'schedules' in data) {
         // Xử lý trường hợp data có cấu trúc {schedules: [...]}
         if (Array.isArray(data.schedules)) {
           setSchedules(data.schedules)
         } else {
           console.warn('Invalid schedules data structure:', data)
           setSchedules([])
         }
       } else {
         console.warn('Invalid schedules data received:', data)
         setSchedules([])
       }
     })

         const unsubscribeNotifications = realTimeService.subscribe('notifications', (data) => {
       // Đảm bảo data là array trước khi set
       if (Array.isArray(data)) {
         setNotifications(data)
       } else if (data && data.notifications && Array.isArray(data.notifications)) {
         setNotifications(data.notifications)
       } else if (data && typeof data === 'object' && 'notifications' in data) {
         // Xử lý trường hợp data có cấu trúc {notifications: [...]}
         if (Array.isArray(data.notifications)) {
           setNotifications(data.notifications)
         } else {
           console.warn('Invalid notifications data structure:', data)
           setNotifications([])
         }
       } else {
         console.warn('Invalid notifications data received:', data)
         setNotifications([])
       }
     })

    // Khởi tạo polling
    realTimeService.initializePolling(token, userId, isAdmin)

    // Trả về cleanup function
    return () => {
      unsubscribeTransactions()
      unsubscribeGroups()
      unsubscribeUsers()
      unsubscribeSchedules()
      unsubscribeNotifications()
      realTimeService.cleanup()
    }
  }, [])

  const value = {
    // State
    transactions,
    groups,
    users,
    schedules,
    notifications,
    
    // Hàm cập nhật
    updateTransactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    
    updateGroups,
    addGroup,
    updateGroup,
    removeGroup,
    
    updateUsers,
    addUser,
    updateUser,
    removeUser,
    
    updateSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,
    
    updateNotifications,
    addNotification,
    updateNotification,
    removeNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    
    updateMultipleStates,
    initializeRealTimeUpdates
  }

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  )
}
