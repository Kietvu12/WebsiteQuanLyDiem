import React, { useState, useEffect } from 'react'
import { 
  SearchOutlined, PlusOutlined, TeamOutlined, TransactionOutlined,
  CarOutlined, DollarOutlined, UserOutlined, EditOutlined,
  DeleteOutlined, FileTextOutlined, LoadingOutlined, ExclamationCircleOutlined
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { useGlobalState } from '../../contexts/GlobalStateContext'
import { groupService } from '../../services/groupService'
import { transactionService } from '../../services/transactionService'
import { vehicleScheduleService } from '../../services/vehicleScheduleService'
import { reportService } from '../../services/reportService'

const GroupsPage = () => {
  const { user, isAuthenticated } = useAuth()
  const { groups, updateGroups, addGroup, updateGroup, removeGroup } = useGlobalState()
  const [searchGroup, setSearchGroup] = useState('')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)
  const [activeTab, setActiveTab] = useState('transactions')
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  // State cho API
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [groupMembers, setGroupMembers] = useState({})
  const [groupTransactions, setGroupTransactions] = useState({})
  const [groupSchedules, setGroupSchedules] = useState({})
  const [availableUsers, setAvailableUsers] = useState([])
  const [filteredAvailableUsers, setFilteredAvailableUsers] = useState([])
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  // State cho modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showUserDetailModal, setShowUserDetailModal] = useState(false)
  const [showExportReportModal, setShowExportReportModal] = useState(false)
  const [exportingGroup, setExportingGroup] = useState(null)
  const [editingGroup, setEditingGroup] = useState(null)
  const [selectedUserDetail, setSelectedUserDetail] = useState(null)
  const [newGroupData, setNewGroupData] = useState({
    ten_nhom: '',
    mo_ta: '',
    memberIds: []
  })
  const [newMemberData, setNewMemberData] = useState({
    userId: '',
    groupId: ''
  })
  
  // State cho filter user detail - riêng cho từng tab
  const [transactionFilters, setTransactionFilters] = useState({
    searchText: '',
    senderName: '',
    transactionType: 'all',
    startDate: '',
    endDate: '',
    status: 'all'
  })
  
  const [scheduleFilters, setScheduleFilters] = useState({
    searchText: '',
    vehicleType: 'all',
    routeType: 'all',
    startDate: '',
    endDate: '',
    status: 'all'
  })

  // Fetch tất cả nhóm
  const fetchGroups = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('authToken')
      const response = await groupService.getAllGroups(token)
      
      if (response.success) {
        updateGroups(response.data.groups || response.data || [])
      } else {
        setError(response.message || 'Không thể lấy danh sách nhóm')
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
      setError(error.message || 'Có lỗi xảy ra khi tải danh sách nhóm')
    } finally {
      setLoading(false)
    }
  }

  // Fetch danh sách người dùng có sẵn
  const fetchAvailableUsers = async () => {
    if (!isAuthenticated) return
    
    try {
      const token = localStorage.getItem('authToken')
      
      // Thử lấy danh sách người dùng cơ bản trước (cho tất cả user)
      let response = await fetch('http://localhost:5000/api/users/basic-list', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAvailableUsers(data.data.users || [])
          return
        }
      }
      
      // Nếu không được, thử lấy danh sách đầy đủ (chỉ admin)
      response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAvailableUsers(data.data.users || [])
        } else {
          console.error('Error response:', data)
          setAvailableUsers([])
        }
      } else {
        console.error('HTTP Error:', response.status)
        setAvailableUsers([])
      }
    } catch (error) {
      console.error('Error fetching available users:', error)
      setAvailableUsers([])
    }
  }

  // Fetch thành viên của nhóm
  const fetchGroupMembers = async (groupId) => {
    if (!isAuthenticated || !groupId) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await groupService.getGroupMembers(token, groupId)
      
      if (response.success) {
        setGroupMembers(prev => ({
          ...prev,
          [groupId]: response.data.members || response.data || []
        }))
      }
    } catch (error) {
      console.error('Error fetching group members:', error)
    }
  }

  // Fetch giao dịch của nhóm
  const fetchGroupTransactions = async (groupId) => {
    if (!isAuthenticated || !groupId) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await transactionService.getAllTransactions(token)
      
      if (response.success) {
        const groupTransactions = (response.data.transactions || response.data || [])
          .filter(transaction => transaction.id_nhom === groupId)
        
        setGroupTransactions(prev => ({
          ...prev,
          [groupId]: groupTransactions
        }))
      }
    } catch (error) {
      console.error('Error fetching group transactions:', error)
    }
  }

  // Fetch lịch xe của nhóm
  const fetchGroupSchedules = async (groupId) => {
    if (!isAuthenticated || !groupId) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await vehicleScheduleService.getSchedulesByGroup(token, groupId)
      
      if (response.success) {
        setGroupSchedules(prev => ({
          ...prev,
          [groupId]: response.data.schedules || response.data || []
        }))
      }
    } catch (error) {
      console.error('Error fetching group schedules:', error)
    }
  }

  // Tạo nhóm mới
  const handleCreateGroup = async () => {
    if (!newGroupData.ten_nhom.trim()) {
      setError('Tên nhóm không được để trống')
      return
    }
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ten_nhom: newGroupData.ten_nhom,
          mo_ta: newGroupData.mo_ta,
          memberIds: newGroupData.memberIds
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setShowCreateModal(false)
        setNewGroupData({ ten_nhom: '', mo_ta: '', memberIds: [] })
        
        // Cập nhật global state ngay lập tức
        const newGroup = data.data
        addGroup(newGroup)
        
        // Tạo thư mục báo cáo cho nhóm mới
        try {
          const token = localStorage.getItem('authToken')
          await reportService.createGroupReportDirectory(token, newGroup.id_nhom, newGroup.ten_nhom)
        } catch (error) {
          console.warn('Không thể tạo thư mục báo cáo:', error.message)
        }
        
        setError(null)
      } else {
        setError(data.message || 'Không thể tạo nhóm')
      }
    } catch (error) {
      console.error('Error creating group:', error)
      setError('Có lỗi xảy ra khi tạo nhóm')
    } finally {
      setLoading(false)
    }
  }

  // Xóa nhóm - Chuyển tất cả thành viên thành free-agent
  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhóm này? Tất cả thành viên sẽ trở thành free-agent.')) return
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Cập nhật global state ngay lập tức
        removeGroup(groupId)
        
        if (selectedGroup?.id_nhom === groupId) {
          setSelectedGroup(null)
          setSelectedMember(null)
        }
        setError(null)
      } else {
        setError(data.message || 'Không thể xóa nhóm')
      }
    } catch (error) {
      console.error('Error deleting group:', error)
      setError('Có lỗi xảy ra khi xóa nhóm')
    } finally {
      setLoading(false)
    }
  }

  // Thêm thành viên vào nhóm
  const handleAddMember = async () => {
    if (!newMemberData.userId || !newMemberData.groupId) {
      setError('Vui lòng chọn người dùng và nhóm')
      return
    }
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/groups/add-member`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMemberData)
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setShowAddMemberModal(false)
        setNewMemberData({ userId: '', groupId: '' })
        fetchGroupMembers(newMemberData.groupId)
        setError(null)
      } else {
        setError(data.message || 'Không thể thêm thành viên')
      }
    } catch (error) {
      console.error('Error adding member:', error)
      setError('Có lỗi xảy ra khi thêm thành viên')
    } finally {
      setLoading(false)
    }
  }

  // Thêm thành viên vào nhóm hiện có (từ modal edit)
  const handleAddMemberToExistingGroup = async (groupId, userId) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/groups/add-member`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId,
          userId
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        fetchGroupMembers(groupId) // Refresh thành viên
        setError(null)
      } else {
        setError(data.message || 'Không thể thêm thành viên')
      }
    } catch (error) {
      console.error('Error adding member to existing group:', error)
      setError('Có lỗi xảy ra khi thêm thành viên')
    } finally {
      setLoading(false)
    }
  }

  // Xóa thành viên khỏi nhóm
  const handleRemoveMember = async (groupId, userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?')) return
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/groups/remove-member`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId,
          userId
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        fetchGroupMembers(groupId) // Refresh thành viên
        setError(null)
      } else {
        setError(data.message || 'Không thể xóa thành viên')
      }
    } catch (error) {
      console.error('Error removing member:', error)
      setError('Có lỗi xảy ra khi xóa thành viên')
    } finally {
      setLoading(false)
    }
  }

  // Cập nhật nhóm
  const handleEditGroup = async () => {
    if (!editingGroup || !editingGroup.ten_nhom.trim()) {
      setError('Tên nhóm không được để trống')
      return
    }
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
        const response = await fetch(`${API_BASE_URL}/groups/${editingGroup.id_nhom}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ten_nhom: editingGroup.ten_nhom,
          mo_ta: editingGroup.mo_ta
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setShowEditModal(false)
        setEditingGroup(null)
        fetchGroups() // Refresh danh sách
        setError(null)
      } else {
        setError(data.message || 'Không thể cập nhật nhóm')
      }
    } catch (error) {
      console.error('Error updating group:', error)
      setError('Có lỗi xảy ra khi cập nhật nhóm')
    } finally {
      setLoading(false)
    }
  }

  // Xử lý click vào nhóm - chỉ cần chọn, không cần fetch lại
  const handleGroupClick = (group) => {
    setSelectedGroup(group)
    setSelectedMember(null)
    // Dữ liệu đã được load sẵn từ useEffect
  }

  // Tính toán thống kê cho nhóm
  const calculateGroupStats = (groupId) => {
    const transactions = groupTransactions[groupId] || []
    const totalAmount = transactions.reduce((sum, t) => sum + (parseFloat(t.so_tien) || 0), 0)
    const totalPoints = transactions.reduce((sum, t) => sum + (parseFloat(t.diem) || 0), 0)
    
    return {
      transactionCount: transactions.length,
      totalAmount: totalAmount.toLocaleString('vi-VN'),
      totalPoints: totalPoints.toFixed(2)
    }
  }

  // Lọc nhóm theo tìm kiếm
  const filteredGroups = groups.filter(group => 
    group.ten_nhom.toLowerCase().includes(searchGroup.toLowerCase())
  )

  // Xử lý click vào user để xem chi tiết
  const handleUserDetailClick = (user) => {
    setSelectedUserDetail(user)
    setShowUserDetailModal(true)
  }

  // Lọc giao dịch theo filter
  const getFilteredTransactions = (userId) => {
    if (!selectedGroup) return []
    
    const allTransactions = groupTransactions[selectedGroup.id_nhom] || []
    let filtered = allTransactions.filter(t => 
      t.id_nguoi_gui === userId || t.id_nguoi_nhan === userId
    )

    // Xử lý logic hiển thị giao dịch theo vai trò người dùng
    filtered = processTransactionsForUser(filtered, userId, user)

    // Filter theo loại giao dịch
    if (transactionFilters.transactionType !== 'all') {
      filtered = filtered.filter(t => t.id_loai_giao_dich == transactionFilters.transactionType)
    }

    // Filter theo trạng thái
    if (transactionFilters.status !== 'all') {
      filtered = filtered.filter(t => t.trang_thai === transactionFilters.status)
    }

    // Filter theo ngày
    if (transactionFilters.startDate) {
      filtered = filtered.filter(t => new Date(t.ngay_tao) >= new Date(transactionFilters.startDate))
    }
    if (transactionFilters.endDate) {
      filtered = filtered.filter(t => new Date(t.ngay_tao) <= new Date(transactionFilters.endDate))
    }

    // Filter theo text
    if (transactionFilters.searchText) {
      filtered = filtered.filter(t => 
        t.noi_dung.toLowerCase().includes(transactionFilters.searchText.toLowerCase())
      )
    }

    return filtered
  }

  // Xử lý logic hiển thị giao dịch theo vai trò người dùng
  const processTransactionsForUser = (transactions, targetUserId, currentUser) => {
    if (!transactions || transactions.length === 0) return []
    
    const isAdmin = currentUser?.la_admin === 1 || currentUser?.la_admin === true
    const isOwnUser = currentUser?.id_nguoi_dung === parseInt(targetUserId)
    
    // Nếu là admin xem giao dịch của người khác, hiển thị tất cả
    if (isAdmin && !isOwnUser) {
      return transactions
    }
    
    // Nếu là user thường xem giao dịch của mình hoặc admin xem giao dịch của mình
    const processedTransactions = []
    const processedScheduleIds = new Set()
    
    transactions.forEach(transaction => {
      const scheduleId = transaction.id_lich_xe
      
      // Nếu đã xử lý lịch xe này rồi, bỏ qua
      if (processedScheduleIds.has(scheduleId)) {
        return
      }
      
      // Tìm tất cả giao dịch liên quan đến lịch xe này
      const relatedTransactions = transactions.filter(t => t.id_lich_xe === scheduleId)
      
      if (relatedTransactions.length > 1) {
        // Có nhiều giao dịch liên quan (Giao lịch - Nhận lịch hoặc Hủy lịch)
        if (transaction.id_loai_giao_dich === 1) { // Giao lịch
          // Nếu là người giao lịch, chỉ hiển thị giao dịch giao lịch
          if (transaction.id_nguoi_gui === parseInt(targetUserId)) {
            processedTransactions.push(transaction)
            processedScheduleIds.add(scheduleId)
          }
        } else if (transaction.id_loai_giao_dich === 2) { // Nhận lịch
          // Nếu là người nhận lịch, chỉ hiển thị giao dịch nhận lịch
          if (transaction.id_nguoi_nhan === parseInt(targetUserId)) {
            processedTransactions.push(transaction)
            processedScheduleIds.add(scheduleId)
          }
        } else if (transaction.id_loai_giao_dich === 3) { // Hủy lịch
          // Gộp 2 giao dịch hủy lịch thành 1
          const cancelTransactions = relatedTransactions.filter(t => t.id_loai_giao_dich === 3)
          if (cancelTransactions.length === 2) {
            const senderCancel = cancelTransactions.find(t => t.id_nguoi_gui === parseInt(targetUserId))
            const receiverCancel = cancelTransactions.find(t => t.id_nguoi_nhan === parseInt(targetUserId))
            
            if (senderCancel || receiverCancel) {
              // Tạo giao dịch gộp
              const mergedTransaction = {
                ...transaction,
                noi_dung: `Hủy lịch xe #${scheduleId} - ${senderCancel ? 'Người giao' : 'Người nhận'} hủy`,
                is_merged: true,
                related_transactions: cancelTransactions
              }
              processedTransactions.push(mergedTransaction)
              processedScheduleIds.add(scheduleId)
            }
          }
        } else if (transaction.id_loai_giao_dich === 4 || transaction.id_loai_giao_dich === 5) { // San cho - Nhận san
          // Tương tự như giao lịch - nhận lịch
          if (transaction.id_loai_giao_dich === 4 && transaction.id_nguoi_gui === parseInt(targetUserId)) {
            processedTransactions.push(transaction)
            processedScheduleIds.add(scheduleId)
          } else if (transaction.id_loai_giao_dich === 5 && transaction.id_nguoi_nhan === parseInt(targetUserId)) {
            processedTransactions.push(transaction)
            processedScheduleIds.add(scheduleId)
          }
        }
      } else {
        // Chỉ có 1 giao dịch, hiển thị bình thường
        processedTransactions.push(transaction)
        processedScheduleIds.add(scheduleId)
      }
    })
    
    return processedTransactions
  }

  // Lọc lịch xe theo filter
  const getFilteredSchedules = (userId) => {
    if (!selectedGroup) return []
    
    const allSchedules = groupSchedules[selectedGroup.id_nhom] || []
    let filtered = allSchedules.filter(s => 
      s.id_nguoi_tao === userId || s.id_nguoi_nhan === userId
    )

    // Filter theo loại xe
    if (scheduleFilters.vehicleType !== 'all') {
      filtered = filtered.filter(s => s.id_loai_xe == scheduleFilters.vehicleType)
    }

    // Filter theo loại tuyến
    if (scheduleFilters.routeType !== 'all') {
      filtered = filtered.filter(s => s.id_loai_tuyen == scheduleFilters.routeType)
    }

    // Filter theo trạng thái
    if (scheduleFilters.status !== 'all') {
      filtered = filtered.filter(s => s.trang_thai === scheduleFilters.status)
    }

    // Filter theo ngày
    if (scheduleFilters.startDate) {
      filtered = filtered.filter(s => new Date(s.thoi_gian_bat_dau_don) >= new Date(scheduleFilters.startDate))
    }
    if (scheduleFilters.endDate) {
      filtered = filtered.filter(s => new Date(s.thoi_gian_bat_dau_don) <= new Date(scheduleFilters.endDate))
    }

    // Filter theo text
    if (scheduleFilters.searchText) {
      filtered = filtered.filter(s => 
        s.noi_dung?.toLowerCase().includes(scheduleFilters.searchText.toLowerCase()) ||
        s.id_lich_xe.toString().includes(scheduleFilters.searchText)
      )
    }

    return filtered
  }

  // Xuất báo cáo nhóm
  const handleExportReport = (group) => {
    setExportingGroup(group)
    setShowExportReportModal(true)
  }

  const handleExportGroupReport = async (startDate, endDate) => {
    if (!exportingGroup) return
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await reportService.exportGroupReport(token, exportingGroup.id_nhom, startDate, endDate)
      
      if (response.success) {
        alert(`Xuất báo cáo thành công!\nFile: ${response.data.fileName}\nSố giao dịch: ${response.data.transactionCount}\nSố lịch xe: ${response.data.scheduleCount}`)
        setShowExportReportModal(false)
        setExportingGroup(null)
      }
    } catch (error) {
      alert(`Lỗi khi xuất báo cáo: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Load dữ liệu khi component mount
  useEffect(() => {
    if (isAuthenticated) {
      // Dữ liệu sẽ được load tự động từ real-time service
      // Chỉ cần set loading false
      setLoading(false)
      // Kiểm tra quyền admin
      setIsUserAdmin(user?.la_admin === 1 || user?.la_admin === true)
    }
  }, [isAuthenticated, user])

  // Load danh sách người dùng khi quyền admin thay đổi hoặc khi cần thiết
  useEffect(() => {
    if (isAuthenticated) {
      fetchAvailableUsers()
    }
  }, [isAuthenticated, isUserAdmin])

  // Load danh sách người dùng khi component mount để có thể tạo nhóm mới
  useEffect(() => {
    if (isAuthenticated && (!Array.isArray(availableUsers) || availableUsers.length === 0)) {
      fetchAvailableUsers()
    }
  }, [isAuthenticated, availableUsers])

  // Load danh sách người dùng khi mở modal tạo nhóm mới
  useEffect(() => {
    if (showCreateModal && (!Array.isArray(availableUsers) || availableUsers.length === 0)) {
      fetchAvailableUsers()
    }
  }, [showCreateModal, availableUsers])

  // Load danh sách người dùng khi mở modal edit nhóm
  useEffect(() => {
    if (showEditModal && editingGroup) {
      // Luôn load lại danh sách người dùng khi mở modal edit
      fetchAvailableUsers()
      // Đảm bảo thành viên của nhóm đang edit được load
      if (!groupMembers[editingGroup.id_nhom]) {
        fetchGroupMembers(editingGroup.id_nhom)
      }
    }
  }, [showEditModal, editingGroup])

  // Load danh sách người dùng khi mở modal thêm thành viên
  useEffect(() => {
    if (showAddMemberModal && (!Array.isArray(availableUsers) || availableUsers.length === 0)) {
      fetchAvailableUsers()
    }
  }, [showAddMemberModal, availableUsers])

  // Load dữ liệu chi tiết cho tất cả nhóm sau khi có danh sách nhóm
  useEffect(() => {
    if (groups.length > 0) {
      // Load dữ liệu cho tất cả nhóm cùng lúc
      groups.forEach(group => {
        fetchGroupMembers(group.id_nhom)
        fetchGroupTransactions(group.id_nhom)
        fetchGroupSchedules(group.id_nhom)
      })
    }
  }, [groups])

  // Load danh sách người dùng khi có nhóm được chọn
  useEffect(() => {
    if (selectedGroup) {
      // Nếu đã có thành viên của nhóm, sử dụng để làm danh sách có sẵn
      const currentMembers = groupMembers[selectedGroup.id_nhom] || []
      if (currentMembers.length > 0) {
        setAvailableUsers(currentMembers)
      } else {
        // Nếu chưa có, fetch từ API
        fetchAvailableUsers()
      }
    } else {
      // Khi không có nhóm nào được chọn, vẫn cần danh sách người dùng để tạo nhóm mới
      fetchAvailableUsers()
    }
  }, [selectedGroup, groupMembers])

  // Khởi tạo filteredAvailableUsers khi availableUsers thay đổi
  useEffect(() => {
    setFilteredAvailableUsers(availableUsers)
  }, [availableUsers])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-25 flex items-center justify-center">
        <div className="text-center">
          <ExclamationCircleOutlined className="text-6xl text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-500">Bạn cần đăng nhập để truy cập trang này</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Quản lý Nhóm</h1>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <ExclamationCircleOutlined className="text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Search and Create Section */}
        <div className="bg-white mb-6 rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            {/* Search Input */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm nhóm..."
                  value={searchGroup}
                  onChange={(e) => setSearchGroup(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                />
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>
            
            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
            >
              <PlusOutlined className="text-sm" />
              <span className="whitespace-nowrap">Tạo nhóm mới</span>
            </button>
          </div>
        </div>

        {/* Groups Table */}
        <div className="bg-white mb-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-800">Bảng các nhóm</h3>
              {loading && (
                <div className="flex items-center text-sm text-blue-600">
                  <LoadingOutlined className="mr-2" />
                  <span>Đang tải dữ liệu chi tiết...</span>
                </div>
              )}
            </div>
          </div>
          
          {groups.length === 0 ? (
            <div className="p-12 text-center">
              <LoadingOutlined className="text-4xl text-blue-500 mb-4" />
              <p className="text-gray-500">Đang tải danh sách nhóm...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên nhóm</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số giao dịch</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng điểm</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thành viên</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {filteredGroups.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                            {searchGroup ? 'Không tìm thấy nhóm nào phù hợp' : 'Chưa có nhóm nào'}
                          </td>
                        </tr>
                      ) : (
                        filteredGroups.map(group => {
                          const stats = calculateGroupStats(group.id_nhom)
                          return (
                            <tr 
                              key={group.id_nhom}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                              selectedGroup?.id_nhom === group.id_nhom ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleGroupClick(group)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{group.ten_nhom}</div>
                                {group.mo_ta && (
                                  <div className="text-xs text-gray-500 mt-1">{group.mo_ta}</div>
                                )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <TransactionOutlined className="text-blue-500 mr-2" />
                                  <span className="text-sm text-gray-900">{stats.transactionCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <DollarOutlined className="text-green-500 mr-2" />
                                  <span className="text-sm text-gray-900">{stats.totalAmount} VNĐ</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <TeamOutlined className="text-purple-500 mr-2" />
                                  <span className="text-sm text-gray-900">{stats.totalPoints}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="text-sm text-gray-900">
                                  {(groupMembers[group.id_nhom] || []).length}
                                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleExportReport(group)
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xuất báo cáo"
                            >
                              <FileTextOutlined className="text-sm" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingGroup(group)
                                setShowEditModal(true)
                                // Đảm bảo dữ liệu thành viên đã được load
                                if (!groupMembers[group.id_nhom]) {
                                  fetchGroupMembers(group.id_nhom)
                                }
                                // Đảm bảo danh sách người dùng có sẵn
                                if (availableUsers.length === 0) {
                                  fetchAvailableUsers()
                                }
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Sửa thông tin"
                            >
                              <EditOutlined className="text-sm" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                      handleDeleteGroup(group.id_nhom)
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa nhóm"
                            >
                              <DeleteOutlined className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                          )
                        })
                      )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 space-y-4">
                {filteredGroups.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <TeamOutlined className="text-4xl mb-2 text-gray-300 mx-auto block" />
                    <p>{searchGroup ? 'Không tìm thấy nhóm nào phù hợp' : 'Chưa có nhóm nào'}</p>
                  </div>
                ) : (
                  filteredGroups.map(group => {
                    const stats = calculateGroupStats(group.id_nhom)
                    return (
                      <div
                        key={group.id_nhom}
                        className={`p-4 border border-gray-200 rounded-lg cursor-pointer transition-colors ${
                          selectedGroup?.id_nhom === group.id_nhom ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleGroupClick(group)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-base">{group.ten_nhom}</h4>
                            {group.mo_ta && (
                              <p className="text-sm text-gray-500 mt-1">{group.mo_ta}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingGroup(group)
                                setShowEditModal(true)
                                if (!groupMembers[group.id_nhom]) {
                                  fetchGroupMembers(group.id_nhom)
                                }
                                // Đảm bảo danh sách người dùng có sẵn
                                if (availableUsers.length === 0) {
                                  fetchAvailableUsers()
                                }
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Sửa thông tin"
                            >
                              <EditOutlined className="text-sm" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteGroup(group.id_nhom)
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa nhóm"
                            >
                              <DeleteOutlined className="text-sm" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center justify-center p-2 bg-blue-50 rounded-lg">
                            <TransactionOutlined className="text-blue-500 mr-2" />
                            <span className="font-medium">{stats.transactionCount} giao dịch</span>
                          </div>
                          <div className="flex items-center justify-center p-2 bg-green-50 rounded-lg">
                            <DollarOutlined className="text-green-500 mr-2" />
                            <span className="font-medium">{stats.totalAmount} VNĐ</span>
                          </div>
                          <div className="flex items-center justify-center p-2 bg-purple-50 rounded-lg">
                            <TeamOutlined className="text-purple-500 mr-2" />
                            <span className="font-medium">{stats.totalPoints} điểm</span>
                          </div>
                          <div className="flex items-center justify-center p-2 bg-orange-50 rounded-lg">
                            <UserOutlined className="text-orange-500 mr-2" />
                            <span className="font-medium">{(groupMembers[group.id_nhom] || []).length} thành viên</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Members Table - Drill-down */}
        {selectedGroup && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Danh sách thành viên nhóm: {selectedGroup.ten_nhom}
                  </h3>
                  {!groupMembers[selectedGroup.id_nhom] && (
                    <p className="text-sm text-gray-500 mt-1">Đang tải danh sách thành viên...</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành viên</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số lịch xe</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số giao dịch</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(groupMembers[selectedGroup.id_nhom] || []).length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        Chưa có thành viên nào trong nhóm
                      </td>
                    </tr>
                  ) : (
                    (groupMembers[selectedGroup.id_nhom] || []).map(member => {
                      const memberTransactions = (groupTransactions[selectedGroup.id_nhom] || [])
                        .filter(t => t.id_nguoi_gui === member.id_nguoi_dung || t.id_nguoi_nhan === member.id_nguoi_dung)
                      
                      const memberSchedules = (groupSchedules[selectedGroup.id_nhom] || [])
                        .filter(s => s.id_nguoi_tao === member.id_nguoi_dung || s.id_nguoi_nhan === member.id_nguoi_dung)
                      
                      return (
                        <tr 
                          key={member.id_nguoi_dung}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedMember?.id_nguoi_dung === member.id_nguoi_dung ? 'bg-blue-50' : ''
                      }`}
                          onClick={() => handleUserDetailClick(member)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                            <UserOutlined className="text-white text-xs" />
                          </div>
                              <div className="text-sm font-medium text-gray-900">{member.ho_ten}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <CarOutlined className="text-blue-500 mr-2" />
                              <span className="text-sm text-gray-900">{memberSchedules.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <TransactionOutlined className="text-green-500 mr-2" />
                              <span className="text-sm text-gray-900">{memberTransactions.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveMember(selectedGroup.id_nhom, member.id_nguoi_dung)
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa khỏi nhóm"
                        >
                          <DeleteOutlined className="text-sm" />
                        </button>
                      </td>
                    </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-3">
              {(groupMembers[selectedGroup.id_nhom] || []).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserOutlined className="text-4xl mb-2 text-gray-300 mx-auto block" />
                  <p>Chưa có thành viên nào trong nhóm</p>
                </div>
              ) : (
                (groupMembers[selectedGroup.id_nhom] || []).map(member => {
                  const memberTransactions = (groupTransactions[selectedGroup.id_nhom] || [])
                    .filter(t => t.id_nguoi_gui === member.id_nguoi_dung || t.id_nguoi_nhan === member.id_nguoi_dung)
                  
                  const memberSchedules = (groupSchedules[selectedGroup.id_nhom] || [])
                    .filter(s => s.id_nguoi_tao === member.id_nguoi_dung || s.id_nguoi_nhan === member.id_nguoi_dung)
                  
                  return (
                    <div
                      key={member.id_nguoi_dung}
                      className={`p-4 border border-gray-200 rounded-lg cursor-pointer transition-colors ${
                        selectedMember?.id_nguoi_dung === member.id_nguoi_dung ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleUserDetailClick(member)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                            <UserOutlined className="text-white text-sm" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{member.ho_ten}</div>
                            <div className="text-sm text-gray-500">{member.ten_dang_nhap}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center justify-center p-2 bg-blue-50 rounded-lg">
                          <CarOutlined className="text-blue-500 mr-2" />
                          <span className="font-medium">{memberSchedules.length} lịch xe</span>
                        </div>
                        <div className="flex items-center justify-center p-2 bg-green-50 rounded-lg">
                          <TransactionOutlined className="text-green-500 mr-2" />
                          <span className="font-medium">{memberTransactions.length} giao dịch</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tạo nhóm mới</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhóm</label>
                  <input
                    type="text"
                    value={newGroupData.ten_nhom}
                    onChange={(e) => setNewGroupData(prev => ({ ...prev, ten_nhom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên nhóm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    value={newGroupData.mo_ta}
                    onChange={(e) => setNewGroupData(prev => ({ ...prev, mo_ta: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mô tả (không bắt buộc)"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thêm thành viên (không bắt buộc)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm người dùng..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase()
                        if (searchTerm) {
                                                  const filtered = Array.isArray(availableUsers) ? availableUsers.filter(user =>
                          user.ho_ten.toLowerCase().includes(searchTerm) || 
                          user.ten_dang_nhap.toLowerCase().includes(searchTerm)
                        ) : []
                          setFilteredAvailableUsers(filtered)
                        } else {
                          setFilteredAvailableUsers(availableUsers)
                        }
                      }}
                    />
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg mt-2 bg-white">
                                          {(!Array.isArray(availableUsers) || availableUsers.length === 0) ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">
                          Đang tải danh sách người dùng...
                        </p>
                      </div>
                    ) : (
                      (filteredAvailableUsers || availableUsers).map(user => (
                          <label key={user.id_nguoi_dung} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newGroupData.memberIds.includes(user.id_nguoi_dung)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewGroupData(prev => ({
                                    ...prev,
                                    memberIds: [...prev.memberIds, user.id_nguoi_dung]
                                  }))
                                } else {
                                  setNewGroupData(prev => ({
                                    ...prev,
                                    memberIds: prev.memberIds.filter(id => id !== user.id_nguoi_dung)
                                  }))
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{user.ho_ten} ({user.ten_dang_nhap})</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                  {/* Hiển thị thành viên đã chọn */}
                  {newGroupData.memberIds.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Thành viên đã chọn:</p>
                      <div className="flex flex-wrap gap-2">
                        {newGroupData.memberIds.map(userId => {
                          const user = Array.isArray(availableUsers) ? availableUsers.find(u => u.id_nguoi_dung === userId) : null
                          return user ? (
                            <span key={userId} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user.ho_ten}
                              <button
                                type="button"
                                onClick={() => setNewGroupData(prev => ({
                                  ...prev,
                                  memberIds: prev.memberIds.filter(id => id !== userId)
                                }))}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                    <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                    </button>
                    <button
                  onClick={handleCreateGroup}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoadingOutlined /> : 'Tạo nhóm'}
                    </button>
                  </div>
                </div>
          </div>
        )}

        {/* Edit Group Modal */}
        {showEditModal && editingGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sửa thông tin nhóm</h3>
              <div className="space-y-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhóm</label>
                        <input
                    type="text"
                    value={editingGroup.ten_nhom}
                    onChange={(e) => setEditingGroup(prev => ({ ...prev, ten_nhom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    value={editingGroup.mo_ta || ''}
                    onChange={(e) => setEditingGroup(prev => ({ ...prev, mo_ta: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thành viên hiện tại</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
                    {!groupMembers[editingGroup.id_nhom] ? (
                      <div className="text-center py-4">
                        <LoadingOutlined className="text-blue-500 mr-2" />
                        <span className="text-gray-500 text-sm">Đang tải danh sách thành viên...</span>
                      </div>
                    ) : (groupMembers[editingGroup.id_nhom] || []).length === 0 ? (
                      <p className="text-gray-500 text-sm">Chưa có thành viên nào</p>
                    ) : (
                      (groupMembers[editingGroup.id_nhom] || []).map(member => (
                        <div key={member.id_nguoi_dung} className="flex items-center justify-between p-2 bg-white rounded border mb-2">
                          <span className="text-sm text-gray-700">{member.ho_ten} ({member.ten_dang_nhap})</span>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Đã có trong nhóm</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thêm thành viên mới</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm người dùng để thêm..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase()
                        if (searchTerm) {
                          const filtered = availableUsers
                            .filter(user => !(groupMembers[editingGroup.id_nhom] || [])
                              .some(member => member.id_nguoi_dung === user.id_nguoi_dung))
                            .filter(user => 
                              user.ho_ten.toLowerCase().includes(searchTerm) || 
                              user.ten_dang_nhap.toLowerCase().includes(searchTerm)
                            )
                          setFilteredAvailableUsers(filtered)
                        } else {
                          setFilteredAvailableUsers(availableUsers
                            .filter(user => !(groupMembers[editingGroup.id_nhom] || [])
                              .some(member => member.id_nguoi_dung === user.id_nguoi_dung))
                          )
                        }
                      }}
                    />
                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg mt-2 bg-white">
                                          {(!Array.isArray(availableUsers) || availableUsers.length === 0) ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">
                          Đang tải danh sách người dùng...
                        </p>
                      </div>
                    ) : (
                      (filteredAvailableUsers || availableUsers)
                        .filter(user => !(groupMembers[editingGroup.id_nhom] || [])
                          .some(member => member.id_nguoi_dung === user.id_nguoi_dung))
                        .map(user => (
                            <label key={user.id_nguoi_dung} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    // Thêm thành viên mới vào nhóm
                                    handleAddMemberToExistingGroup(editingGroup.id_nhom, user.id_nguoi_dung)
                                  }
                                }}
                                className="rounded border-gray-500 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{user.ho_ten} ({user.ten_dang_nhap})</span>
                            </label>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleEditGroup}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoadingOutlined /> : 'Cập nhật'}
                </button>
                      </div>
                    </div>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thêm thành viên vào nhóm</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chọn người dùng để thêm</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm người dùng..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase()
                        if (searchTerm) {
                          const filtered = availableUsers
                            .filter(user => !(groupMembers[newMemberData.groupId] || [])
                              .some(member => member.id_nguoi_dung === user.id_nguoi_dung))
                            .filter(user => 
                              user.ho_ten.toLowerCase().includes(searchTerm) || 
                              user.ten_dang_nhap.toLowerCase().includes(searchTerm)
                            )
                          setFilteredAvailableUsers(filtered)
                        } else {
                          setFilteredAvailableUsers(availableUsers
                            .filter(user => !(groupMembers[newMemberData.groupId] || [])
                              .some(member => member.id_nguoi_dung === user.id_nguoi_dung))
                          )
                        }
                      }}
                    />
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg mt-2 bg-white">
                                          {(!Array.isArray(availableUsers) || availableUsers.length === 0) ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">
                          Đang tải danh sách người dùng...
                        </p>
                      </div>
                    ) : (
                      (filteredAvailableUsers || availableUsers)
                        .filter(user => !(groupMembers[newMemberData.groupId] || [])
                          .some(member => member.id_nguoi_dung === user.id_nguoi_dung))
                        .map(user => (
                            <label key={user.id_nguoi_dung} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newMemberData.userId === user.id_nguoi_dung}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewMemberData(prev => ({ ...prev, userId: user.id_nguoi_dung }))
                                  } else {
                                    setNewMemberData(prev => ({ ...prev, userId: '' }))
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{user.ho_ten} ({user.ten_dang_nhap})</span>
                            </label>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={loading || !newMemberData.userId}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoadingOutlined /> : 'Thêm thành viên'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {showUserDetailModal && selectedUserDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Chi tiết thành viên: {selectedUserDetail.ho_ten}
                </h3>
                <button
                  onClick={() => setShowUserDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Filters - Hiển thị theo tab */}
              {activeTab === 'transactions' && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Bộ lọc giao dịch</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                      <input
                        type="text"
                        placeholder="Tìm theo nội dung..."
                        value={transactionFilters.searchText}
                        onChange={(e) => setTransactionFilters(prev => ({ ...prev, searchText: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                      <input
                        type="date"
                        value={transactionFilters.startDate}
                        onChange={(e) => setTransactionFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                      <input
                        type="date"
                        value={transactionFilters.endDate}
                        onChange={(e) => setTransactionFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại giao dịch</label>
                      <select
                        value={transactionFilters.transactionType}
                        onChange={(e) => setTransactionFilters(prev => ({ ...prev, transactionType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">Tất cả loại</option>
                        <option value="1">Giao lịch</option>
                        <option value="2">Nhận lịch</option>
                        <option value="3">Hủy lịch</option>
                        <option value="4">San cho</option>
                        <option value="5">Nhận san</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      <select
                        value={transactionFilters.status}
                        onChange={(e) => setTransactionFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="cho_xac_nhan">Chờ xác nhận</option>
                        <option value="hoan_thanh">Hoàn thành</option>
                        <option value="da_huy">Đã hủy</option>
                      </select>
                    </div>
                    </div>
                  </div>
                )}

                {activeTab === 'schedules' && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Bộ lọc lịch xe</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                      <input
                        type="text"
                        placeholder="Tìm theo ID lịch xe..."
                        value={scheduleFilters.searchText}
                        onChange={(e) => setScheduleFilters(prev => ({ ...prev, searchText: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                        <input
                          type="date"
                        value={scheduleFilters.startDate}
                        onChange={(e) => setScheduleFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                        <input
                          type="date"
                        value={scheduleFilters.endDate}
                        onChange={(e) => setScheduleFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe</label>
                        <select
                        value={scheduleFilters.vehicleType}
                        onChange={(e) => setScheduleFilters(prev => ({ ...prev, vehicleType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">Tất cả loại xe</option>
                        <option value="1">4 chỗ</option>
                        <option value="2">5 chỗ</option>
                        <option value="3">7 chỗ</option>
                        <option value="4">16 chỗ</option>
                        <option value="5">29 chỗ</option>
                        <option value="6">45 chỗ</option>
                        </select>
                      </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại tuyến</label>
                      <select
                        value={scheduleFilters.routeType}
                        onChange={(e) => setScheduleFilters(prev => ({ ...prev, routeType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">Tất cả loại tuyến</option>
                        <option value="1">Đón Sân bay - Hà Nội</option>
                        <option value="2">Tiễn Hà Nội - Sân bay</option>
                        <option value="3">Lịch Phố 1 Chiều</option>
                        <option value="4">Lịch Phố 2 Chiều</option>
                        <option value="5">Lịch Tỉnh/Huyện 1 Chiều</option>
                        <option value="6">Lịch Tỉnh/Huyện 2 Chiều</option>
                        <option value="7">Lịch Hướng Sân Bay</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select
                      value={scheduleFilters.status}
                      onChange={(e) => setScheduleFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="cho_xac_nhan">Chờ xác nhận</option>
                      <option value="da_xac_nhan">Đã xác nhận</option>
                      <option value="hoan_thanh">Hoàn thành</option>
                      <option value="da_huy">Đã hủy</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors text-center sm:text-left ${
                      activeTab === 'transactions'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Giao dịch ({getFilteredTransactions(selectedUserDetail.id_nguoi_dung).length})
                  </button>
                  <button
                    onClick={() => setActiveTab('schedules')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors text-center sm:text-left ${
                      activeTab === 'schedules'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Lịch xe ({getFilteredSchedules(selectedUserDetail.id_nguoi_dung).length})
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'transactions' && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Giao dịch</h4>
                    <div className="space-y-3">
                    {getFilteredTransactions(selectedUserDetail.id_nguoi_dung).length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Không có giao dịch nào</p>
                    ) : (
                      getFilteredTransactions(selectedUserDetail.id_nguoi_dung).map(transaction => (
                                                <div key={transaction.id_giao_dich} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{transaction.noi_dung}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                {new Date(transaction.ngay_tao).toLocaleString('vi-VN')}
                              </p>
                              <p className="text-xs text-gray-500">
                                Loại: {transaction.id_loai_giao_dich === 1 ? 'Giao lịch' : 
                                       transaction.id_loai_giao_dich === 2 ? 'Nhận lịch' :
                                       transaction.id_loai_giao_dich === 3 ? 'Hủy lịch' :
                                       transaction.id_loai_giao_dich === 4 ? 'San cho' : 'Nhận san'}
                              </p>
                              {transaction.is_merged && (
                                <p className="text-xs text-blue-600 mt-1">
                                  ⚡ Giao dịch gộp từ nhiều bên
                                </p>
                              )}
                              </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                                transaction.trang_thai === 'hoan_thanh' 
                                  ? 'bg-green-50 text-green-600 border-green-100'
                                  : transaction.trang_thai === 'cho_xac_nhan'
                                  ? 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                  : 'bg-red-50 text-red-600 border-red-100'
                              }`}>
                                {transaction.trang_thai === 'hoan_thanh' ? 'Hoàn thành' :
                                 transaction.trang_thai === 'cho_xac_nhan' ? 'Chờ xác nhận' : 'Đã hủy'}
                              </span>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">
                                  {parseFloat(transaction.so_tien).toLocaleString('vi-VN')} VNĐ
                                </p>
                                <p className="text-xs text-gray-500">{transaction.diem} điểm</p>
                            </div>
                          </div>
                    </div>
                  </div>
                      ))
                )}
                  </div>
              </div>
            )}

              {activeTab === 'schedules' && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Lịch xe</h4>
                  <div className="space-y-3">
                    {getFilteredSchedules(selectedUserDetail.id_nguoi_dung).length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Không có lịch xe nào</p>
                    ) : (
                      getFilteredSchedules(selectedUserDetail.id_nguoi_dung).map(schedule => (
                        <div key={schedule.id_lich_xe} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                Lịch xe #{schedule.id_lich_xe}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(schedule.thoi_gian_bat_dau_don).toLocaleString('vi-VN')} - {new Date(schedule.thoi_gian_ket_thuc_don).toLocaleString('vi-VN')}
                              </p>
                              <p className="text-xs text-gray-500">
                                Người tạo: {schedule.id_nguoi_tao === selectedUserDetail.id_nguoi_dung ? 'Bạn' : 'Người khác'}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                              schedule.trang_thai === 'hoan_thanh' 
                                ? 'bg-green-50 text-green-600 border-green-100'
                                : schedule.trang_thai === 'da_xac_nhan'
                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                : schedule.trang_thai === 'cho_xac_nhan'
                                ? 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                              {schedule.trang_thai === 'hoan_thanh' ? 'Hoàn thành' :
                               schedule.trang_thai === 'da_xac_nhan' ? 'Đã xác nhận' :
                               schedule.trang_thai === 'cho_xac_nhan' ? 'Chờ xác nhận' : 'Đã hủy'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Export Report Modal */}
        {showExportReportModal && exportingGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Xuất báo cáo nhóm: {exportingGroup.ten_nhom}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                  <input
                    type="date"
                    id="startDate"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                  <input
                    type="date"
                    id="endDate"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <p>Báo cáo sẽ bao gồm:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Tất cả giao dịch trong nhóm</li>
                    <li>Tất cả lịch xe trong nhóm</li>
                    <li>Thống kê chi tiết theo thời gian</li>
                  </ul>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowExportReportModal(false)
                    setExportingGroup(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    const startDate = document.getElementById('startDate').value
                    const endDate = document.getElementById('endDate').value
                    if (startDate && endDate) {
                      handleExportGroupReport(startDate, endDate)
                    } else {
                      alert('Vui lòng chọn khoảng thời gian')
                    }
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang xuất...' : 'Xuất báo cáo'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupsPage
