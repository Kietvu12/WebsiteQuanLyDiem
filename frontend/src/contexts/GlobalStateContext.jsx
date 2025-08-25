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
    if (updates.transactions) {
      setTransactions(updates.transactions)
    }
    if (updates.groups) {
      setGroups(updates.groups)
    }
    if (updates.users) {
      setUsers(updates.users)
    }
    if (updates.schedules) {
      setSchedules(updates.schedules)
    }
    if (updates.notifications) {
      setNotifications(updates.notifications)
    }
  }, [])

  // Hàm khởi tạo real-time updates
  const initializeRealTimeUpdates = useCallback((token, userId, isAdmin = false) => {
    // Đăng ký listeners cho real-time updates
    const unsubscribeTransactions = realTimeService.subscribe('transactions', (data) => {
      setTransactions(data)
    })

    const unsubscribeGroups = realTimeService.subscribe('groups', (data) => {
      setGroups(data)
    })

    const unsubscribeUsers = realTimeService.subscribe('users', (data) => {
      setUsers(data)
    })

    const unsubscribeSchedules = realTimeService.subscribe('schedules', (data) => {
      setSchedules(data)
    })

    const unsubscribeNotifications = realTimeService.subscribe('notifications', (data) => {
      setNotifications(data)
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
