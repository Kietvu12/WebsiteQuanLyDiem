const { Transaction, User, VehicleSchedule, Notification } = require('../models');

class TransactionController {
  // Lấy tất cả giao dịch (chỉ admin)
  static async getAllTransactions(req, res) {
    try {
      // Kiểm tra quyền admin
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền xem tất cả giao dịch'
        });
      }

      const transactions = await Transaction.getAll();
      res.json({
        success: true,
        message: 'Lấy danh sách giao dịch thành công',
        data: transactions
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách giao dịch:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách giao dịch'
      });
    }
  }

  // Lấy giao dịch theo ID
  static async getTransactionById(req, res) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.getById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy giao dịch'
        });
      }

      // Kiểm tra quyền: chỉ admin hoặc người liên quan mới được xem
      if (!req.user.isAdmin && 
          req.user.id !== transaction.id_nguoi_gui && 
          req.user.id !== transaction.id_nguoi_nhan) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xem giao dịch này'
        });
      }

      res.json({
        success: true,
        message: 'Lấy thông tin giao dịch thành công',
        data: transaction
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin giao dịch:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin giao dịch'
      });
    }
  }

  // Tạo giao dịch mới
  static async createTransaction(req, res) {
    try {
      const {
        id_loai_giao_dich,
        id_nguoi_nhan,
        id_nhom,
        id_lich_xe,
        so_tien,
        diem,
        noi_dung
      } = req.body;

      const id_nguoi_gui = req.user.id;

      // Kiểm tra dữ liệu đầu vào
      if (!id_loai_giao_dich || !id_nhom || !noi_dung) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
        });
      }

      // Kiểm tra người dùng có trong nhóm không
      const { Group } = require('../models');
      const isMember = await Group.isMember(id_nhom, id_nguoi_gui);
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không phải thành viên của nhóm này'
        });
      }

      // Xử lý theo loại giao dịch
      let transactionData = {
        id_loai_giao_dich,
        id_nguoi_gui,
        id_nguoi_nhan,
        id_nhom,
        id_lich_xe,
        so_tien,
        diem,
        noi_dung
      };

      // Tạo giao dịch
      const transactionId = await Transaction.create(transactionData);

      // Tạo thông báo cho người nhận (nếu có)
      if (id_nguoi_nhan) {
        let notificationContent = '';
        switch (id_loai_giao_dich) {
          case 1: // Giao lịch
            notificationContent = `Bạn có lịch xe mới từ ${req.user.username}`;
            break;
          case 2: // Nhận lịch
            notificationContent = `Lịch xe của bạn đã được xác nhận`;
            break;
          case 4: // San cho
            notificationContent = `Bạn được nhận ${diem} điểm từ ${req.user.username}`;
            break;
          case 5: // Nhận san
            notificationContent = `Bạn đã nhận điểm từ ${req.user.username}`;
            break;
        }

        if (notificationContent) {
          await Notification.create({
            id_nguoi_dung: id_nguoi_nhan,
            id_giao_dich: transactionId,
            noi_dung: notificationContent
          });
        }
      }

      res.status(201).json({
        success: true,
        message: 'Tạo giao dịch thành công',
        data: { id: transactionId }
      });
    } catch (error) {
      console.error('Lỗi tạo giao dịch:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo giao dịch'
      });
    }
  }

  // Xác nhận giao dịch (cho giao dịch giao lịch)
  static async confirmTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.getById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy giao dịch'
        });
      }

      // Kiểm tra quyền: chỉ người nhận mới được xác nhận
      if (req.user.id !== transaction.id_nguoi_nhan) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ người nhận mới được xác nhận giao dịch'
        });
      }

      // Kiểm tra loại giao dịch có cần xác nhận không
      if (transaction.id_loai_giao_dich !== 1) { // Giao lịch
        return res.status(400).json({
          success: false,
          message: 'Loại giao dịch này không cần xác nhận'
        });
      }

      // Kiểm tra trạng thái giao dịch
      if (transaction.trang_thai !== 'cho_xac_nhan') {
        return res.status(400).json({
          success: false,
          message: 'Giao dịch này đã được xử lý'
        });
      }

      // Cập nhật trạng thái giao dịch
      await Transaction.updateStatus(id, 'hoan_thanh');

      // Xử lý logic cộng trừ tiền và điểm
      if (transaction.so_tien && transaction.diem) {
        // Cộng tiền và điểm cho người giao lịch
        const sender = await User.getById(transaction.id_nguoi_gui);
        await User.updateBalanceAndPoints(
          transaction.id_nguoi_gui,
          sender.so_du + transaction.so_tien,
          sender.diem + transaction.diem
        );

        // Trừ tiền và điểm cho người nhận lịch
        const receiver = await User.getById(transaction.id_nguoi_nhan);
        await User.updateBalanceAndPoints(
          transaction.id_nguoi_nhan,
          receiver.so_du - transaction.so_tien,
          receiver.diem - transaction.diem
        );
      }

      // Tạo thông báo cho người giao lịch
      await Notification.create({
        id_nguoi_dung: transaction.id_nguoi_gui,
        id_giao_dich: id,
        noi_dung: `Lịch xe của bạn đã được xác nhận bởi ${req.user.username}`
      });

      res.json({
        success: true,
        message: 'Xác nhận giao dịch thành công'
      });
    } catch (error) {
      console.error('Lỗi xác nhận giao dịch:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xác nhận giao dịch'
      });
    }
  }

  // Hủy giao dịch
  static async cancelTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.getById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy giao dịch'
        });
      }

      // Kiểm tra quyền: chỉ người gửi hoặc admin mới được hủy
      if (req.user.id !== transaction.id_nguoi_gui && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền hủy giao dịch này'
        });
      }

      // Kiểm tra trạng thái giao dịch
      if (transaction.trang_thai !== 'cho_xac_nhan') {
        return res.status(400).json({
          success: false,
          message: 'Giao dịch này đã được xử lý'
        });
      }

      // Cập nhật trạng thái giao dịch
      await Transaction.updateStatus(id, 'da_huy');

      // Tạo thông báo cho người nhận (nếu có)
      if (transaction.id_nguoi_nhan) {
        await Notification.create({
          id_nguoi_dung: transaction.id_nguoi_nhan,
          id_giao_dich: id,
          noi_dung: `Giao dịch từ ${req.user.username} đã bị hủy`
        });
      }

      res.json({
        success: true,
        message: 'Hủy giao dịch thành công'
      });
    } catch (error) {
      console.error('Lỗi hủy giao dịch:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi hủy giao dịch'
      });
    }
  }

  // Lấy giao dịch theo trạng thái
  static async getTransactionsByStatus(req, res) {
    try {
      const { status } = req.params;
      const transactions = await Transaction.getByStatus(status);

      res.json({
        success: true,
        message: 'Lấy giao dịch theo trạng thái thành công',
        data: transactions
      });
    } catch (error) {
      console.error('Lỗi lấy giao dịch theo trạng thái:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy giao dịch theo trạng thái'
      });
    }
  }

  // Lấy giao dịch theo loại
  static async getTransactionsByType(req, res) {
    try {
      const { typeId } = req.params;
      const transactions = await Transaction.getByType(typeId);

      res.json({
        success: true,
        message: 'Lấy giao dịch theo loại thành công',
        data: transactions
      });
    } catch (error) {
      console.error('Lỗi lấy giao dịch theo loại:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy giao dịch theo loại'
      });
    }
  }

  // Lấy giao dịch theo ngày
  static async getTransactionsByDate(req, res) {
    try {
      const { date } = req.params;
      const transactions = await Transaction.getByDate(date);

      res.json({
        success: true,
        message: 'Lấy giao dịch theo ngày thành công',
        data: transactions
      });
    } catch (error) {
      console.error('Lỗi lấy giao dịch theo ngày:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy giao dịch theo ngày'
      });
    }
  }

  // Xóa giao dịch (chỉ admin)
  static async deleteTransaction(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra quyền admin
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền xóa giao dịch'
        });
      }

      const success = await Transaction.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy giao dịch để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa giao dịch thành công'
      });
    } catch (error) {
      console.error('Lỗi xóa giao dịch:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa giao dịch'
      });
    }
  }
}

module.exports = TransactionController;
