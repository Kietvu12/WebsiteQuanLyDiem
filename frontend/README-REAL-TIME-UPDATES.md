# Hệ thống Cập nhật Real-time

## Tổng quan

Hệ thống này cho phép cập nhật giao diện ngay lập tức khi có thay đổi dữ liệu mà không cần reload trang. Sử dụng Context API và Reducer pattern để quản lý state toàn cục.

## Cấu trúc

### 1. GlobalStateContext (`src/contexts/GlobalStateContext.jsx`)

- **Provider**: `GlobalStateProvider` - Bao bọc toàn bộ ứng dụng
- **State**: Quản lý tất cả dữ liệu chính (transactions, groups, users, vehicleSchedules, notifications)
- **Actions**: Các hàm để thay đổi state
- **Refresh Triggers**: Cơ chế để trigger cập nhật các component

### 2. Custom Hooks (`src/hooks/useRealTimeUpdates.js`)

- `useRealTimeUpdates`: Lắng nghe một loại cập nhật cụ thể
- `useMultipleRealTimeUpdates`: Lắng nghe nhiều loại cập nhật
- `useDebouncedCallback`: Tạo callback với debounce
- `useOptimisticUpdate`: Cập nhật optimistic (cập nhật ngay lập tức)

## Cách sử dụng

### 1. Trong Component

```jsx
import { useGlobalState } from '../../contexts/GlobalStateContext'

const MyComponent = () => {
  const { state, actions } = useGlobalState()
  
  // Sử dụng dữ liệu từ global state
  const transactions = state.transactions
  const groups = state.groups
  
  // Thực hiện hành động
  const handleCreateTransaction = async (data) => {
    try {
      const response = await api.createTransaction(data)
      if (response.success) {
        // Cập nhật global state
        actions.addTransaction(response.data)
        
        // Trigger refresh cho các component khác
        actions.triggerRefresh('transactions')
        actions.triggerRefresh('groups')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  return (
    // JSX của component
  )
}
```

### 2. Sử dụng Custom Hooks

```jsx
import { useRealTimeUpdates, useMultipleRealTimeUpdates } from '../../hooks/useRealTimeUpdates'

const MyComponent = () => {
  // Lắng nghe cập nhật transactions
  useRealTimeUpdates('transactions', () => {
    console.log('Transactions updated!')
    // Thực hiện logic cập nhật
  })
  
  // Lắng nghe nhiều loại cập nhật
  useMultipleRealTimeUpdates(['transactions', 'groups'], () => {
    console.log('Transactions or groups updated!')
    // Thực hiện logic cập nhật
  })
  
  return (
    // JSX của component
  )
}
```

### 3. Optimistic Updates

```jsx
import { useOptimisticUpdate } from '../../hooks/useRealTimeUpdates'

const MyComponent = () => {
  const { optimisticUpdate, rollbackUpdate } = useOptimisticUpdate('Transaction')
  
  const handleUpdateStatus = async (transactionId, newStatus) => {
    const originalTransaction = transactions.find(t => t.id === transactionId)
    
    try {
      // Cập nhật ngay lập tức
      optimisticUpdate(originalTransaction, { trang_thai: newStatus })
      
      // Gọi API
      const response = await api.updateTransaction(transactionId, { trang_thai: newStatus })
      
      if (!response.success) {
        // Khôi phục nếu có lỗi
        rollbackUpdate(originalTransaction)
      }
    } catch (error) {
      // Khôi phục nếu có lỗi
      rollbackUpdate(originalTransaction)
    }
  }
  
  return (
    // JSX của component
  )
}
```

## Các loại Actions

### Transactions
- `addTransaction(transaction)`: Thêm giao dịch mới
- `updateTransaction(transaction)`: Cập nhật giao dịch
- `deleteTransaction(transactionId)`: Xóa giao dịch
- `setTransactions(transactions)`: Set danh sách giao dịch

### Groups
- `addGroup(group)`: Thêm nhóm mới
- `updateGroup(group)`: Cập nhật nhóm
- `deleteGroup(groupId)`: Xóa nhóm
- `setGroups(groups)`: Set danh sách nhóm

### Users
- `addUser(user)`: Thêm người dùng mới
- `updateUser(user)`: Cập nhật người dùng
- `deleteUser(userId)`: Xóa người dùng
- `setUsers(users)`: Set danh sách người dùng

### Vehicle Schedules
- `addVehicleSchedule(schedule)`: Thêm lịch xe mới
- `updateVehicleSchedule(schedule)`: Cập nhật lịch xe
- `deleteVehicleSchedule(scheduleId)`: Xóa lịch xe
- `setVehicleSchedules(schedules)`: Set danh sách lịch xe

### Notifications
- `addNotification(notification)`: Thêm thông báo mới
- `updateNotification(notification)`: Cập nhật thông báo
- `markNotificationRead(notificationId)`: Đánh dấu đã đọc
- `setNotifications(notifications)`: Set danh sách thông báo

### Utility
- `triggerRefresh(type)`: Trigger refresh cho loại dữ liệu cụ thể
- `resetState()`: Reset toàn bộ state

## Refresh Triggers

Mỗi loại dữ liệu có một refresh trigger riêng:

```jsx
const { state } = useGlobalState()

// Lắng nghe thay đổi
useEffect(() => {
  if (state.refreshTriggers.transactions > 0) {
    // Cập nhật component khi transactions thay đổi
  }
}, [state.refreshTriggers.transactions])
```

## Lợi ích

1. **Cập nhật ngay lập tức**: Không cần reload trang
2. **Consistency**: Tất cả component đều hiển thị dữ liệu mới nhất
3. **Performance**: Chỉ cập nhật những gì cần thiết
4. **User Experience**: Giao diện mượt mà, responsive
5. **Maintainability**: Code dễ bảo trì và mở rộng

## Lưu ý

1. **Luôn sử dụng actions**: Không thay đổi state trực tiếp
2. **Trigger refresh khi cần**: Để các component khác biết có cập nhật
3. **Xử lý lỗi**: Luôn có rollback mechanism cho optimistic updates
4. **Cleanup**: Reset state khi logout để tránh memory leak

## Ví dụ thực tế

### Tạo giao dịch mới

```jsx
const handleSubmit = async (formData) => {
  try {
    // 1. Tạo lịch xe (nếu cần)
    if (formData.id_loai_giao_dich === 1) {
      const scheduleResponse = await vehicleScheduleService.createSchedule(formData)
      if (scheduleResponse.success) {
        // Cập nhật global state
        actions.addVehicleSchedule(scheduleResponse.data)
      }
    }
    
    // 2. Tạo giao dịch
    const transactionResponse = await transactionService.createTransaction(formData)
    if (transactionResponse.success) {
      // Cập nhật global state
      actions.addTransaction(transactionResponse.data)
      
      // Trigger refresh
      actions.triggerRefresh('transactions')
      actions.triggerRefresh('groups')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Xác nhận giao dịch

```jsx
const handleConfirm = async (transactionId) => {
  try {
    const response = await transactionService.confirmTransaction(transactionId)
    if (response.success) {
      // Cập nhật global state
      actions.updateTransaction(response.data)
      
      // Trigger refresh
      actions.triggerRefresh('transactions')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
```

Hệ thống này đảm bảo rằng tất cả thay đổi dữ liệu đều được phản ánh ngay lập tức trên giao diện mà không cần reload trang.
