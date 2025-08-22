/**
 * Utility functions để xử lý format ngày giờ
 */

/**
 * Format thời gian - hỗ trợ cả TIME (HH:MM:SS) và DATETIME
 * @param {string} timeString - Chuỗi thời gian từ database
 * @returns {string} - Thời gian đã format hoặc 'N/A'
 */
export const formatTime = (timeString) => {
  if (!timeString) return 'N/A'
  
  // Kiểm tra nếu là format TIME (HH:MM:SS) - chỉ có giờ
  if (typeof timeString === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    // Format TIME: chỉ hiển thị giờ:phút
    return timeString.substring(0, 5) // Cắt bỏ giây
  }
  
  // Kiểm tra nếu là format DATETIME
  try {
    const date = new Date(timeString)
    if (isNaN(date.getTime())) {
      return 'N/A'
    }
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'N/A'
  }
}

/**
 * Format chỉ giờ phút từ TIME hoặc DATETIME
 * @param {string} timeString - Chuỗi thời gian từ database
 * @returns {string} - Giờ phút (HH:MM) hoặc 'N/A'
 */
export const formatTimeOnly = (timeString) => {
  if (!timeString) return 'N/A'
  
  // Kiểm tra nếu là format TIME (HH:MM:SS)
  if (typeof timeString === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    return timeString.substring(0, 5) // Chỉ lấy HH:MM
  }
  
  // Kiểm tra nếu là format DATETIME
  try {
    const date = new Date(timeString)
    if (isNaN(date.getTime())) {
      return 'N/A'
    }
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'N/A'
  }
}

/**
 * Format ngày
 * @param {string} dateString - Chuỗi ngày từ database
 * @returns {string} - Ngày đã format hoặc 'N/A'
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'N/A'
    }
    return date.toLocaleString('vi-VN')
  } catch (error) {
    return 'N/A'
  }
}

/**
 * Format tiền tệ VND
 * @param {number} amount - Số tiền
 * @returns {string} - Số tiền đã format VND
 */
export const formatMoney = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0)
}
