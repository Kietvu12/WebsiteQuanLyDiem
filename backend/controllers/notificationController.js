const { Notification, User } = require('../models');

class NotificationController {
  // Lấy tất cả thông báo của người dùng hiện tại
  static async getUserNotifications(req, res) {
    try {
      console.log('=== getUserNotifications Debug ===')
      console.log('Request user:', req.user)
      console.log('User ID:', req.user.id_nguoi_dung)
      
      const userId = req.user.id_nguoi_dung;
      const notifications = await Notification.getByUser(userId);
      
      console.log('Notifications found:', notifications.length)
      console.log('Sample notification:', notifications[0])
      
      res.json({
        success: true,
        message: 'Lấy danh sách thông báo thành công',
        data: notifications
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách thông báo:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách thông báo'
      });
    }
  }

  // Lấy thông báo chưa đọc của người dùng hiện tại
  static async getUnreadNotifications(req, res) {
    try {
      console.log('=== getUnreadNotifications Debug ===')
      console.log('Request user:', req.user)
      
      const userId = req.user.id_nguoi_dung;
      const notifications = await Notification.getUnreadByUser(userId);
      
      console.log('Unread notifications found:', notifications.length)
      
      res.json({
        success: true,
        message: 'Lấy danh sách thông báo chưa đọc thành công',
        data: notifications
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách thông báo chưa đọc:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách thông báo chưa đọc'
      });
    }
  }

  // Đánh dấu thông báo đã đọc
  static async markAsRead(req, res) {
    try {
      console.log('=== markAsRead Debug ===')
      console.log('Request user:', req.user)
      console.log('Notification ID:', req.params.id)
      
      const { id } = req.params;
      const userId = req.user.id_nguoi_dung;
      
      // Kiểm tra thông báo có thuộc về người dùng không
      const notification = await Notification.getById(id);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông báo'
        });
      }
      
      if (notification.id_nguoi_dung !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền đánh dấu thông báo này'
        });
      }
      
      const success = await Notification.markAsRead(id);
      if (success) {
        console.log('✅ Thông báo đã được đánh dấu đã đọc')
        res.json({
          success: true,
          message: 'Đánh dấu thông báo đã đọc thành công'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Lỗi khi đánh dấu thông báo đã đọc'
        });
      }
    } catch (error) {
      console.error('Lỗi đánh dấu thông báo đã đọc:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đánh dấu thông báo đã đọc'
      });
    }
  }

  // Đánh dấu tất cả thông báo đã đọc
  static async markAllAsRead(req, res) {
    try {
      console.log('=== markAllAsRead Debug ===')
      console.log('Request user:', req.user)
      
      const userId = req.user.id_nguoi_dung;
      const success = await Notification.markAllAsRead(userId);
      
      if (success) {
        console.log('✅ Tất cả thông báo đã được đánh dấu đã đọc')
        res.json({
          success: true,
          message: 'Đánh dấu tất cả thông báo đã đọc thành công'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Lỗi khi đánh dấu tất cả thông báo đã đọc'
        });
      }
    } catch (error) {
      console.error('Lỗi đánh dấu tất cả thông báo đã đọc:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đánh dấu tất cả thông báo đã đọc'
      });
    }
  }

  // Lấy số lượng thông báo chưa đọc
  static async getUnreadCount(req, res) {
    try {
      console.log('=== getUnreadCount Debug ===')
      console.log('Request user:', req.user)
      
      const userId = req.user.id_nguoi_dung;
      const count = await Notification.getUnreadCount(userId);
      
      console.log('Unread count:', count)
      
      res.json({
        success: true,
        message: 'Lấy số lượng thông báo chưa đọc thành công',
        data: { count }
      });
    } catch (error) {
      console.error('Lỗi lấy số lượng thông báo chưa đọc:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy số lượng thông báo chưa đọc'
      });
    }
  }

  // Xóa thông báo
  static async deleteNotification(req, res) {
    try {
      console.log('=== deleteNotification Debug ===')
      console.log('Request user:', req.user)
      console.log('Notification ID:', req.params.id)
      
      const { id } = req.params;
      const userId = req.user.id_nguoi_dung;
      
      // Kiểm tra thông báo có thuộc về người dùng không
      const notification = await Notification.getById(id);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông báo'
        });
      }
      
      if (notification.id_nguoi_dung !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xóa thông báo này'
        });
      }
      
      const success = await Notification.delete(id);
      if (success) {
        console.log('✅ Thông báo đã được xóa')
        res.json({
          success: true,
          message: 'Xóa thông báo thành công'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Lỗi khi xóa thông báo'
        });
      }
    } catch (error) {
      console.error('Lỗi xóa thông báo:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa thông báo'
      });
    }
  }
}

module.exports = NotificationController;
