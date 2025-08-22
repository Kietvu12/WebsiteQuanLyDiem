const { Transaction, User, VehicleSchedule, Notification } = require('../models');

class TransactionController {
  // Lấy tất cả giao dịch (chỉ admin)
  static async getAllTransactions(req, res) {
    try {
      console.log('🚀 === getAllTransactions CALLED ===');
      console.log('🚀 Request method:', req.method);
      console.log('🚀 Request URL:', req.url);
      console.log('🚀 Request user:', req.user);
      
      // Kiểm tra quyền admin
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      console.log('🚀 Is Admin check:', isAdmin);
      console.log('🚀 req.user.la_admin:', req.user.la_admin, 'type:', typeof req.user.la_admin);
      
      if (!isAdmin) {
        console.log('❌ Access denied - not admin');
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền xem tất cả giao dịch'
        });
      }
      
      console.log('✅ Access granted - is admin');

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
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      const isSender = req.user.id_nguoi_dung === transaction.id_nguoi_gui;
      const isReceiver = req.user.id_nguoi_dung === transaction.id_nguoi_nhan;
      
      if (!isAdmin && !isSender && !isReceiver) {
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
      console.log('=== createTransaction Debug ===')
      console.log('Request user:', req.user)
      console.log('Request body:', req.body)
      console.log('Request headers:', req.headers)
      
      const {
        id_loai_giao_dich,
        id_nguoi_nhan,
        id_nhom,
        id_lich_xe,
        so_tien,
        diem,
        noi_dung
      } = req.body;

      const id_nguoi_gui = req.user.id_nguoi_dung;
      console.log('Extracted data:', {
        id_loai_giao_dich,
        id_nguoi_nhan,
        id_nhom,
        id_lich_xe,
        so_tien,
        diem,
        noi_dung,
        id_nguoi_gui
      })

      // Kiểm tra dữ liệu đầu vào
      if (!id_loai_giao_dich || !id_nhom || !noi_dung) {
        console.log('Validation failed - missing required fields')
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
        });
      }

      // Kiểm tra người dùng có trong nhóm không
      console.log('Checking if user is member of group...')
      console.log('User is admin:', req.user.la_admin)
      
      let isMember = false
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (isAdmin) {
        // Admin có thể tạo giao dịch ở mọi nhóm
        console.log('User is admin, bypassing group membership check')
        isMember = true
      } else {
        // User thường phải kiểm tra thành viên nhóm
        console.log('User is not admin, checking group membership...')
        const { Group } = require('../models');
        isMember = await Group.isMember(id_nhom, id_nguoi_gui);
      }
      
      console.log('Group membership check result:', isMember)
      
      if (!isMember) {
        console.log('User is not a member of the group')
        return res.status(403).json({
          success: false,
          message: 'Bạn không phải thành viên của nhóm này'
        });
      }

      console.log('User is member of group, proceeding with transaction creation...')

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
      
      // Kiểm tra loại giao dịch có cần xác nhận không
      let trang_thai = 'cho_xac_nhan';
      if (id_loai_giao_dich === 4 || id_loai_giao_dich === 5) {
        // "San cho" (id=4) và "Nhận san" (id=5) không cần xác nhận, tự động hoàn thành
        trang_thai = 'hoan_thanh';
        transactionData.trang_thai = trang_thai;
        console.log('Giao dịch San cho/Nhận san - tự động hoàn thành');
      }
      
      console.log('Transaction data prepared:', transactionData)
      console.log('Trạng thái giao dịch:', trang_thai)

      // Tạo giao dịch
      console.log('Creating transaction in database...')
      const transactionId = await Transaction.create(transactionData);
      console.log('Transaction created with ID:', transactionId)

      // Tạo thông báo cho người nhận (nếu có)
      if (id_nguoi_nhan) {
        console.log('=== TẠO THÔNG BÁO CHO NGƯỜI NHẬN ===')
        console.log('ID người nhận:', id_nguoi_nhan)
        console.log('ID giao dịch:', transactionId)
        console.log('Loại giao dịch:', id_loai_giao_dich)
        console.log('Tên người gửi:', req.user.ten_dang_nhap)
        
        let notificationContent = '';
        switch (id_loai_giao_dich) {
          case 1: // Giao lịch
            let tienText = '';
            let diemText = '';
            
            if (so_tien !== null && so_tien !== undefined && so_tien !== 0) {
              tienText = so_tien > 0 ? `nhận ${so_tien.toLocaleString('vi-VN')} VNĐ` : `trả ${Math.abs(so_tien).toLocaleString('vi-VN')} VNĐ`;
            }
            
            if (diem !== null && diem !== undefined && diem !== 0) {
              diemText = diem > 0 ? `nhận ${diem} điểm` : `trả ${Math.abs(diem)} điểm`;
            }
            
            // Thêm thông tin lịch xe nếu có
            let lichXeText = '';
            if (id_lich_xe) {
              lichXeText = ' (có lịch xe đi kèm)';
            }
            
            if (tienText && diemText) {
              notificationContent = `Bạn có lịch xe mới từ ${req.user.ten_dang_nhap} - ${tienText} và ${diemText}${lichXeText}`;
            } else if (tienText) {
              notificationContent = `Bạn có lịch xe mới từ ${req.user.ten_dang_nhap} - ${tienText}${lichXeText}`;
            } else if (diemText) {
              notificationContent = `Bạn có lịch xe mới từ ${req.user.ten_dang_nhap} - ${diemText}${lichXeText}`;
            } else {
              notificationContent = `Bạn có lịch xe mới từ ${req.user.ten_dang_nhap}${lichXeText}`;
            }
            break;
          case 2: // Nhận lịch
            notificationContent = `Lịch xe của bạn đã được xác nhận`;
            break;
          case 4: // San cho
            let sanTienText = '';
            let sanDiemText = '';
            
            if (so_tien !== null && so_tien !== undefined && so_tien !== 0) {
              sanTienText = so_tien > 0 ? `nhận ${so_tien.toLocaleString('vi-VN')} VNĐ` : `trả ${Math.abs(so_tien).toLocaleString('vi-VN')} VNĐ`;
            }
            
            if (diem !== null && diem !== undefined && diem !== 0) {
              sanDiemText = diem > 0 ? `nhận ${diem} điểm` : `trả ${Math.abs(diem)} điểm`;
            }
            
            if (sanTienText && sanDiemText) {
              notificationContent = `Bạn được ${sanTienText} và ${sanDiemText} từ ${req.user.ten_dang_nhap} (giao dịch đã hoàn thành)`;
            } else if (sanTienText) {
              notificationContent = `Bạn được ${sanTienText} từ ${req.user.ten_dang_nhap} (giao dịch đã hoàn thành)`;
            } else if (sanDiemText) {
              notificationContent = `Bạn được ${sanDiemText} từ ${req.user.ten_dang_nhap} (giao dịch đã hoàn thành)`;
            } else {
              notificationContent = `Bạn được san cho từ ${req.user.ten_dang_nhap} (giao dịch đã hoàn thành)`;
            }
            break;
          case 5: // Nhận san
            notificationContent = `Bạn đã nhận điểm từ ${req.user.ten_dang_nhap} (giao dịch đã hoàn thành)`;
            break;
        }

        console.log('Nội dung thông báo:', notificationContent)

        if (notificationContent) {
          console.log('Bắt đầu tạo thông báo...')
          try {
            const notificationData = {
            id_nguoi_dung: id_nguoi_nhan,
            id_giao_dich: transactionId,
            noi_dung: notificationContent
            };
            console.log('Dữ liệu thông báo:', notificationData)
            
            const notificationId = await Notification.create(notificationData);
            console.log('✅ Thông báo được tạo thành công với ID:', notificationId)
            console.log('=== THÔNG BÁO ĐÃ ĐƯỢC GỬI ===')
          } catch (notificationError) {
            console.error('❌ Lỗi khi tạo thông báo cho người nhận:')
            console.error('Error details:', notificationError)
            console.error('Error message:', notificationError.message)
            console.error('Error stack:', notificationError.stack)
            // Không dừng quá trình tạo giao dịch nếu tạo thông báo thất bại
          }
        } else {
          console.log('⚠️ Không có nội dung thông báo cho loại giao dịch này')
        }
      } else {
        console.log('⚠️ Không có người nhận, bỏ qua việc tạo thông báo')
      }

      // Tạo thông báo cho người gửi (để biết giao dịch đã được tạo)
      console.log('=== TẠO THÔNG BÁO CHO NGƯỜI GỬI ===')
      console.log('ID người gửi:', id_nguoi_gui)
      console.log('ID giao dịch:', transactionId)
      console.log('Loại giao dịch:', id_loai_giao_dich)
      
      try {
        let senderNotificationContent = '';
        switch (id_loai_giao_dich) {
          case 1: // Giao lịch
            let tienText = '';
            let diemText = '';
            
            if (so_tien !== null && so_tien !== undefined && so_tien !== 0) {
              tienText = so_tien > 0 ? `nhận ${so_tien.toLocaleString('vi-VN')} VNĐ` : `trả ${Math.abs(so_tien).toLocaleString('vi-VN')} VNĐ`;
            }
            
            if (diem !== null && diem !== undefined && diem !== 0) {
              diemText = diem > 0 ? `nhận ${diem} điểm` : `trả ${Math.abs(diem)} điểm`;
            }
            
            // Thêm thông tin lịch xe nếu có
            let lichXeText = '';
            if (id_lich_xe) {
              lichXeText = ' (có lịch xe đi kèm)';
            }
            
            if (tienText && diemText) {
              senderNotificationContent = `Bạn đã tạo giao dịch giao lịch thành công - ${tienText} và ${diemText}${lichXeText}`;
            } else if (tienText) {
              senderNotificationContent = `Bạn đã tạo giao dịch giao lịch thành công - ${tienText}${lichXeText}`;
            } else if (diemText) {
              senderNotificationContent = `Bạn đã tạo giao dịch giao lịch thành công - ${diemText}${lichXeText}`;
            } else {
              senderNotificationContent = `Bạn đã tạo giao dịch giao lịch thành công${lichXeText}`;
            }
            break;
          case 4: // San cho
            let sanTienText = '';
            let sanDiemText = '';
            
            if (so_tien !== null && so_tien !== undefined && so_tien !== 0) {
              sanTienText = so_tien > 0 ? `nhận ${so_tien.toLocaleString('vi-VN')} VNĐ` : `trả ${Math.abs(so_tien).toLocaleString('vi-VN')} VNĐ`;
            }
            
            if (diem !== null && diem !== undefined && diem !== 0) {
              sanDiemText = diem > 0 ? `nhận ${diem} điểm` : `trả ${Math.abs(diem)} điểm`;
            }
            
            if (sanTienText && sanDiemText) {
              senderNotificationContent = `Bạn đã tạo giao dịch san cho thành công - ${sanTienText} và ${sanDiemText} (giao dịch đã hoàn thành)`;
            } else if (sanTienText) {
              senderNotificationContent = `Bạn đã tạo giao dịch san cho thành công - ${sanTienText} (giao dịch đã hoàn thành)`;
            } else if (sanDiemText) {
              senderNotificationContent = `Bạn đã tạo giao dịch san cho thành công - ${sanDiemText} (giao dịch đã hoàn thành)`;
            } else {
              senderNotificationContent = `Bạn đã tạo giao dịch san cho thành công (giao dịch đã hoàn thành)`;
            }
            break;
          case 5: // Nhận san
            senderNotificationContent = `Bạn đã tạo giao dịch nhận san thành công (giao dịch đã hoàn thành)`;
            break;
        }

        console.log('Nội dung thông báo cho người gửi:', senderNotificationContent)

        if (senderNotificationContent) {
          console.log('Bắt đầu tạo thông báo cho người gửi...')
          const senderNotificationData = {
            id_nguoi_dung: id_nguoi_gui,
            id_giao_dich: transactionId,
            noi_dung: senderNotificationContent
          };
          console.log('Dữ liệu thông báo cho người gửi:', senderNotificationData)
          
          const senderNotificationId = await Notification.create(senderNotificationData);
          console.log('✅ Thông báo cho người gửi được tạo thành công với ID:', senderNotificationId)
          console.log('=== THÔNG BÁO CHO NGƯỜI GỬI ĐÃ ĐƯỢC TẠO ===')
        } else {
          console.log('⚠️ Không có nội dung thông báo cho người gửi loại giao dịch này')
        }
      } catch (senderNotificationError) {
        console.error('❌ Lỗi khi tạo thông báo cho người gửi:')
        console.error('Error details:', senderNotificationError)
        console.error('Error message:', senderNotificationError.message)
        console.error('Error stack:', senderNotificationError.stack)
        // Không dừng quá trình tạo giao dịch nếu tạo thông báo thất bại
      }

      console.log('=== createTransaction Success ===')
      res.status(201).json({
        success: true,
        message: 'Tạo giao dịch thành công',
        data: { id: transactionId }
      });
    } catch (error) {
      console.error('=== createTransaction Error ===')
      console.error('Error details:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo giao dịch'
      });
    }
  }

  // Xác nhận giao dịch (cho giao dịch giao lịch)
  static async confirmTransaction(req, res) {
    try {
      console.log('=== confirmTransaction Debug ===')
      console.log('Request user:', req.user)
      console.log('Transaction ID:', req.params.id)
      
      const { id } = req.params;
      const transaction = await Transaction.getById(id);

      if (!transaction) {
        console.log('Transaction not found')
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy giao dịch'
        });
      }

      console.log('Transaction found:', transaction)

      // Kiểm tra quyền: chỉ người nhận mới được xác nhận
      const isReceiver = req.user.id_nguoi_dung === transaction.id_nguoi_nhan;
      
      if (!isReceiver) {
        console.log('User is not the recipient')
        console.log('User ID:', req.user.id_nguoi_dung)
        console.log('Transaction recipient ID:', transaction.id_nguoi_nhan)
        console.log('Is Receiver:', isReceiver)
        return res.status(403).json({
          success: false,
          message: 'Chỉ người nhận mới được xác nhận giao dịch'
        });
      }

      // Kiểm tra loại giao dịch có cần xác nhận không
      if (transaction.id_loai_giao_dich !== 1) { // Giao lịch
        console.log('Transaction type does not require confirmation:', transaction.id_loai_giao_dich)
        return res.status(400).json({
          success: false,
          message: 'Loại giao dịch này không cần xác nhận'
        });
      }

      // Kiểm tra trạng thái giao dịch
      if (transaction.trang_thai !== 'cho_xac_nhan') {
        console.log('Transaction status is not pending:', transaction.trang_thai)
        return res.status(400).json({
          success: false,
          message: 'Giao dịch này đã được xử lý'
        });
      }

      console.log('Proceeding with transaction confirmation...')

      // Cập nhật trạng thái giao dịch
      await Transaction.updateStatus(id, 'hoan_thanh');
      console.log('Transaction status updated to completed')

            // Xử lý logic cộng trừ tiền và điểm
      console.log('Checking transaction amounts...')
      console.log('Transaction so_tien:', transaction.so_tien, 'type:', typeof transaction.so_tien)
      console.log('Transaction diem:', transaction.diem, 'type:', typeof transaction.diem)
      
      // Kiểm tra có ít nhất một trong hai (tiền hoặc điểm) để xử lý
      const hasMoney = transaction.so_tien !== null && transaction.so_tien !== undefined && transaction.so_tien !== 0;
      const hasPoints = transaction.diem !== null && transaction.diem !== undefined && transaction.diem !== 0;
      
      console.log('Has money to process:', hasMoney)
      console.log('Has points to process:', hasPoints)
      
      if (hasMoney || hasPoints) {
        console.log('Processing balance and points transfer...')
        console.log('Transaction amount:', transaction.so_tien, 'points:', transaction.diem)
        
        // Lấy thông tin người dùng hiện tại
        const sender = await User.getById(transaction.id_nguoi_gui);
        const receiver = await User.getById(transaction.id_nguoi_nhan);
        
        if (sender && receiver) {
          console.log('Sender found:', { id: sender.id_nguoi_dung, balance: sender.so_du, points: sender.diem })
          console.log('Receiver found:', { id: receiver.id_nguoi_dung, balance: receiver.so_du, points: receiver.diem })
          
          // Tính toán số dư và điểm mới
          // Người giao lịch (sender) được cộng tiền và điểm
          const moneyChange = transaction.so_tien || 0;
          const pointsChange = transaction.diem || 0;
          
          const newSenderBalance = parseFloat(sender.so_du) + parseFloat(moneyChange);
          const newSenderPoints = parseInt(sender.diem) + parseInt(pointsChange);
          // Người nhận lịch (receiver) bị trừ tiền và điểm
          const newReceiverBalance = parseFloat(receiver.so_du) - parseFloat(moneyChange);
          const newReceiverPoints = parseInt(receiver.diem) - parseInt(pointsChange);
          
          console.log('Sender (người giao lịch) - Old balance:', sender.so_du, 'Old points:', sender.diem)
          console.log('Sender (người giao lịch) - New balance:', newSenderBalance, 'New points:', newSenderPoints)
          console.log('Receiver (người nhận lịch) - Old balance:', receiver.so_du, 'Old points:', receiver.diem)
          console.log('Receiver (người nhận lịch) - New balance:', newReceiverBalance, 'New points:', newReceiverPoints)
          
          // Cập nhật số dư và điểm cho người giao lịch (người gửi) - ĐƯỢC CỘNG
          const senderUpdateResult = await User.updateBalanceAndPoints(
            transaction.id_nguoi_gui,
            newSenderBalance,
            newSenderPoints
          );
          console.log('Sender update result:', senderUpdateResult)
          console.log('✅ Cập nhật số dư và điểm cho người giao lịch thành công (ĐƯỢC CỘNG)')

          // Cập nhật số dư và điểm cho người nhận lịch (người nhận) - BỊ TRỪ
          const receiverUpdateResult = await User.updateBalanceAndPoints(
            transaction.id_nguoi_nhan,
            newReceiverBalance,
            newReceiverPoints
          );
          console.log('Receiver update result:', receiverUpdateResult)
          console.log('✅ Cập nhật số dư và điểm cho người nhận lịch thành công (BỊ TRỪ)')
        } else {
          console.log('⚠️ Không tìm thấy thông tin người dùng để cập nhật số dư/điểm')
          console.log('Sender:', sender ? 'Found' : 'Not found')
          console.log('Receiver:', receiver ? 'Found' : 'Not found')
        }
      } else {
        console.log('⚠️ Không có thông tin số tiền hoặc điểm để xử lý (cả hai đều bằng 0 hoặc null)')
      }

      // Tạo thông báo cho người giao lịch
      console.log('=== TẠO THÔNG BÁO CHO NGƯỜI GIAO LỊCH ===')
      console.log('ID người giao lịch:', transaction.id_nguoi_gui)
      console.log('ID giao dịch:', id)
      console.log('Tên người xác nhận:', req.user.ten_dang_nhap)
      
      try {
        const notificationData = {
        id_nguoi_dung: transaction.id_nguoi_gui,
        id_giao_dich: id,
          noi_dung: `Lịch xe của bạn đã được xác nhận bởi ${req.user.ten_dang_nhap}. Bạn đã nhận ${transaction.so_tien ? transaction.so_tien.toLocaleString('vi-VN') : 0} VNĐ và ${transaction.diem || 0} điểm.`
        };
        console.log('Dữ liệu thông báo xác nhận:', notificationData)
        
        const notificationId = await Notification.create(notificationData);
        console.log('✅ Thông báo xác nhận được tạo thành công với ID:', notificationId)
        console.log('=== THÔNG BÁO XÁC NHẬN ĐÃ ĐƯỢC GỬI ===')
      } catch (notificationError) {
        console.error('❌ Lỗi khi tạo thông báo xác nhận:')
        console.error('Error details:', notificationError)
        console.error('Error message:', notificationError.message)
        console.error('Error stack:', notificationError.stack)
        // Không dừng quá trình xác nhận nếu tạo thông báo thất bại
      }

      console.log('=== confirmTransaction Success ===')
      res.json({
        success: true,
        message: 'Xác nhận giao dịch thành công'
      });
    } catch (error) {
      console.error('=== confirmTransaction Error ===')
      console.error('Error details:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xác nhận giao dịch'
      });
    }
  }

  // Hủy giao dịch
  static async cancelTransaction(req, res) {
    try {
      console.log('=== cancelTransaction Debug ===')
      console.log('Request user:', req.user)
      console.log('Transaction ID:', req.params.id)
      
      const { id } = req.params;
      const transaction = await Transaction.getById(id);

      if (!transaction) {
        console.log('Transaction not found')
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy giao dịch'
        });
      }

      console.log('Transaction found:', transaction)

      // Kiểm tra quyền: người gửi, người nhận hoặc admin mới được hủy
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      const isSender = req.user.id_nguoi_dung === transaction.id_nguoi_gui;
      const isReceiver = req.user.id_nguoi_dung === transaction.id_nguoi_nhan;
      const canCancel = isSender || isReceiver || isAdmin;
                       
      if (!canCancel) {
        console.log('User is not authorized to cancel this transaction')
        console.log('User ID:', req.user.id_nguoi_dung)
        console.log('Sender ID:', transaction.id_nguoi_gui)
        console.log('Receiver ID:', transaction.id_nguoi_nhan)
        console.log('Is Admin:', req.user.la_admin)
        console.log('Is Sender:', isSender)
        console.log('Is Receiver:', isReceiver)
        console.log('Is Admin:', isAdmin)
        return res.status(403).json({
          success: false,
          message: 'Chỉ người gửi, người nhận hoặc admin mới có quyền hủy giao dịch'
        });
      }

      // Kiểm tra trạng thái giao dịch
      if (transaction.trang_thai !== 'cho_xac_nhan') {
        console.log('Transaction status is not pending:', transaction.trang_thai)
        return res.status(400).json({
          success: false,
          message: 'Giao dịch này đã được xử lý'
        });
      }

      console.log('Proceeding with transaction cancellation...')

      // Nếu là giao dịch giao lịch và có lịch xe, xóa lịch xe
      if (transaction.id_loai_giao_dich === 1 && transaction.id_lich_xe) {
        console.log('Deleting associated vehicle schedule...')
        try {
          const { VehicleSchedule } = require('../models');
          await VehicleSchedule.delete(transaction.id_lich_xe);
          console.log('Vehicle schedule deleted successfully')
        } catch (scheduleError) {
          console.error('Error deleting vehicle schedule:', scheduleError)
          // Không dừng quá trình hủy giao dịch nếu xóa lịch xe thất bại
        }
      }

      // Cập nhật trạng thái giao dịch
      await Transaction.updateStatus(id, 'da_huy');
      console.log('Transaction status updated to cancelled')

      // Tạo thông báo cho người nhận (nếu có)
      if (transaction.id_nguoi_nhan) {
        console.log('=== TẠO THÔNG BÁO HỦY CHO NGƯỜI NHẬN ===')
        console.log('ID người nhận:', transaction.id_nguoi_nhan)
        console.log('ID giao dịch:', id)
        console.log('Tên người hủy:', req.user.ten_dang_nhap)
        
        try {
          const notificationData = {
          id_nguoi_dung: transaction.id_nguoi_nhan,
            id_giao_dich: id,
            noi_dung: `Giao dịch từ ${req.user.ten_dang_nhap} đã bị hủy`
          };
          console.log('Dữ liệu thông báo hủy:', notificationData)
          
          const notificationId = await Notification.create(notificationData);
          console.log('✅ Thông báo hủy được tạo thành công với ID:', notificationId)
          console.log('=== THÔNG BÁO HỦY ĐÃ ĐƯỢC GỬI ===')
        } catch (notificationError) {
          console.error('❌ Lỗi khi tạo thông báo hủy:')
          console.error('Error details:', notificationError)
          console.error('Error message:', notificationError.message)
          console.error('Error stack:', notificationError.stack)
          // Không dừng quá trình hủy nếu tạo thông báo thất bại
        }
      } else {
        console.log('⚠️ Không có người nhận, bỏ qua việc tạo thông báo hủy')
      }

      // Tạo thông báo cho người gửi (người giao lịch) khi giao dịch bị hủy
      console.log('=== TẠO THÔNG BÁO HỦY CHO NGƯỜI GIAO LỊCH ===')
      console.log('ID người giao lịch:', transaction.id_nguoi_gui)
      console.log('ID giao dịch:', id)
      console.log('Tên người hủy:', req.user.ten_dang_nhap)
      
      try {
        const notificationData = {
          id_nguoi_dung: transaction.id_nguoi_gui,
          id_giao_dich: id,
          noi_dung: `Giao dịch giao lịch của bạn đã bị hủy bởi ${req.user.ten_dang_nhap}. Lịch xe đã được xóa.`
        };
        console.log('Dữ liệu thông báo hủy cho người giao lịch:', notificationData)
        
        const notificationId = await Notification.create(notificationData);
        console.log('✅ Thông báo hủy cho người giao lịch được tạo thành công với ID:', notificationId)
        console.log('=== THÔNG BÁO HỦY CHO NGƯỜI GIAO LỊCH ĐÃ ĐƯỢC GỬI ===')
      } catch (notificationError) {
        console.error('❌ Lỗi khi tạo thông báo hủy cho người giao lịch:')
        console.error('Error details:', notificationError)
        console.error('Error message:', notificationError.message)
        console.error('Error stack:', notificationError.stack)
        // Không dừng quá trình hủy nếu tạo thông báo thất bại
      }

      console.log('=== cancelTransaction Success ===')
      res.json({
        success: true,
        message: 'Hủy giao dịch thành công'
      });
    } catch (error) {
      console.error('=== cancelTransaction Error ===')
      console.error('Error details:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
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
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (!isAdmin) {
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
