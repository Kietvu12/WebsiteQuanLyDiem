const { Transaction, User, VehicleSchedule, Notification } = require('../models');
const { calculatePointsForGiaoLich } = require('../services/pointCalculationService');

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

      // Tự động tính điểm cho giao dịch Giao lịch nếu có lịch xe
      let calculatedPoints = diem; // Sử dụng điểm được gửi lên nếu có
      
      if (id_loai_giao_dich === 1 && id_lich_xe && !diem) { // Giao lịch có lịch xe nhưng chưa có điểm
        console.log('=== TỰ ĐỘNG TÍNH ĐIỂM CHO GIAO DỊCH GIAO LỊCH ===');
        console.log('ID lịch xe:', id_lich_xe);
        
        try {
          const pointCalculationResult = await calculatePointsForGiaoLich(id_lich_xe);
          
          if (pointCalculationResult.success) {
            if (pointCalculationResult.points === 'manual') {
              console.log('⚠️ Cần tính điểm thủ công cho lịch xe này');
              calculatedPoints = null; // Để admin nhập thủ công
            } else {
              calculatedPoints = pointCalculationResult.points;
              console.log(`✅ Tự động tính được ${calculatedPoints} điểm cho lịch xe`);
            }
          } else {
            console.log('❌ Không thể tính điểm tự động:', pointCalculationResult.message);
            calculatedPoints = null; // Để admin nhập thủ công
          }
        } catch (error) {
          console.error('❌ Lỗi khi tính điểm tự động:', error);
          calculatedPoints = null; // Để admin nhập thủ công
        }
      }

      // Xử lý theo loại giao dịch
      let trang_thai = 'cho_xac_nhan';
      if (id_loai_giao_dich === 4 || id_loai_giao_dich === 5) {
        // "San cho" (id=4) và "Nhận san" (id=5) không cần xác nhận, tự động hoàn thành
        trang_thai = 'hoan_thanh';
        console.log('Giao dịch San cho/Nhận san - tự động hoàn thành');
      }
      
      // Tạo giao dịch chính
      console.log('Creating main transaction in database...')
      const mainTransactionData = {
        id_loai_giao_dich,
        id_nguoi_gui,
        id_nguoi_nhan,
        id_nhom,
        id_lich_xe,
        so_tien,
        diem: calculatedPoints, // Sử dụng điểm đã tính được
        noi_dung,
        trang_thai
      };
      
      const mainTransactionId = await Transaction.create(mainTransactionData);
      console.log('Main transaction created with ID:', mainTransactionId)

      // Tạo giao dịch đối ứng nếu cần
      let oppositeTransactionId = null;
      
      if (id_loai_giao_dich === 1) { // Giao lịch
        console.log('=== TẠO GIAO DỊCH ĐỐI ỨNG: NHẬN LỊCH ===')
        
        // Tạo giao dịch "Nhận lịch" đối ứng
        const oppositeTransactionData = {
          id_loai_giao_dich: 2, // Nhận lịch
          id_nguoi_gui: id_nguoi_nhan, // Người nhận lịch trở thành người gửi
          id_nguoi_nhan: id_nguoi_gui, // Người giao lịch trở thành người nhận
          id_nhom,
          id_lich_xe,
          so_tien: so_tien ? -so_tien : null, // Đảo dấu tiền (người nhận lịch sẽ bị trừ tiền)
          diem: calculatedPoints ? -calculatedPoints : null, // Đảo dấu điểm đã tính được
          noi_dung: `Nhận lịch: ${noi_dung}`,
          trang_thai: 'cho_xac_nhan' // Chờ xác nhận
        };
        
        oppositeTransactionId = await Transaction.create(oppositeTransactionData);
        console.log('Opposite transaction (Nhận lịch) created with ID:', oppositeTransactionId)
        
      } else if (id_loai_giao_dich === 4) { // San cho
        console.log('=== TẠO GIAO DỊCH ĐỐI ỨNG: NHẬN SAN ===')
        
        // Tạo giao dịch "Nhận san" đối ứng
        const oppositeTransactionData = {
          id_loai_giao_dich: 5, // Nhận san
          id_nguoi_gui: id_nguoi_nhan, // Người nhận san trở thành người gửi
          id_nguoi_nhan: id_nguoi_gui, // Người san cho trở thành người nhận
          id_nhom,
          id_lich_xe: null, // San cho không có lịch xe
          so_tien: so_tien ? -so_tien : null, // Đảo dấu tiền
          diem: calculatedPoints ? -calculatedPoints : null, // Đảo dấu điểm đã tính được
          noi_dung: `Nhận san: ${noi_dung}`,
          trang_thai: 'hoan_thanh' // Tự động hoàn thành
        };
        
        oppositeTransactionId = await Transaction.create(oppositeTransactionData);
        console.log('Opposite transaction (Nhận san) created with ID:', oppositeTransactionId)
        
        // CẬP NHẬT SỐ DƯ VÀ ĐIỂM NGAY LẬP TỨC CHO GIAO DỊCH SAN CHO - NHẬN SAN
        console.log('=== CẬP NHẬT SỐ DƯ VÀ ĐIỂM NGAY LẬP TỨC ===')
        try {
          // Lấy thông tin người dùng
          const sender = await User.getById(id_nguoi_gui);
          const receiver = await User.getById(id_nguoi_nhan);
          
          if (sender && receiver) {
            console.log('Sender found:', { id: sender.id_nguoi_dung, balance: sender.so_du, points: sender.diem })
            console.log('Receiver found:', { id: receiver.id_nguoi_dung, balance: receiver.so_du, points: receiver.diem })
            
            // Tính toán số dư và điểm mới
            const moneyChange = so_tien || 0;
            const pointsChange = calculatedPoints || 0;
            
            // Người san BỊ TRỪ tiền và điểm
            const newSenderBalance = parseFloat(sender.so_du) - parseFloat(moneyChange);
            const newSenderPoints = parseInt(sender.diem) - parseInt(pointsChange);
            
            // Người nhận san ĐƯỢC CỘNG tiền và điểm
            const newReceiverBalance = parseFloat(receiver.so_du) + parseFloat(moneyChange);
            const newReceiverPoints = parseInt(receiver.diem) + parseInt(pointsChange);
            
            console.log('=== KẾT QUẢ TÍNH TOÁN SAN CHO ===')
            console.log(`Người san (BỊ TRỪ):`)
            console.log('  - Cũ: Balance:', sender.so_du, 'Points:', sender.diem)
            console.log('  - Mới: Balance:', newSenderBalance, 'Points:', newSenderPoints)
            console.log('  - Thay đổi: -', moneyChange, 'VNĐ, -', pointsChange, 'điểm')
            
            console.log(`Người nhận san (ĐƯỢC CỘNG):`)
            console.log('  - Cũ: Balance:', receiver.so_du, 'Points:', receiver.diem)
            console.log('  - Mới: Balance:', newReceiverBalance, 'Points:', newReceiverPoints)
            console.log('  - Thay đổi: +', moneyChange, 'VNĐ, +', pointsChange, 'điểm')
            
            // Cập nhật số dư và điểm cho người san
            const senderUpdateResult = await User.updateBalanceAndPoints(
              id_nguoi_gui,
              newSenderBalance,
              newSenderPoints
            );
            console.log(`✅ Cập nhật số dư và điểm cho người san thành công (BỊ TRỪ)`)

            // Cập nhật số dư và điểm cho người nhận san
            const receiverUpdateResult = await User.updateBalanceAndPoints(
              id_nguoi_nhan,
              newReceiverBalance,
              newReceiverPoints
            );
            console.log(`✅ Cập nhật số dư và điểm cho người nhận san thành công (ĐƯỢC CỘNG)`)
            
            console.log('=== CẬP NHẬT SỐ DƯ VÀ ĐIỂM HOÀN TẤT ===')
          } else {
            console.log('⚠️ Không tìm thấy thông tin người dùng để cập nhật số dư/điểm')
            console.log('Sender:', sender ? 'Found' : 'Not found')
            console.log('Receiver:', receiver ? 'Found' : 'Not found')
          }
        } catch (balanceError) {
          console.error('❌ Lỗi khi cập nhật số dư và điểm cho giao dịch San cho:')
          console.error('Error details:', balanceError)
          console.error('Error message:', balanceError.message)
          console.error('Error stack:', balanceError.stack)
          // Không dừng quá trình tạo giao dịch nếu cập nhật số dư/điểm thất bại
        }
      }

      // Tạo thông báo cho người nhận (nếu có)
      if (id_nguoi_nhan) {
        console.log('=== TẠO THÔNG BÁO CHO NGƯỜI NHẬN ===')
        console.log('ID người nhận:', id_nguoi_nhan)
        console.log('ID giao dịch chính:', mainTransactionId)
        console.log('ID giao dịch đối ứng:', oppositeTransactionId)
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
            
            if (calculatedPoints !== null && calculatedPoints !== undefined && calculatedPoints !== 0) {
              diemText = calculatedPoints > 0 ? `nhận ${calculatedPoints} điểm` : `trả ${Math.abs(calculatedPoints)} điểm`;
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
            
            if (calculatedPoints !== null && calculatedPoints !== undefined && calculatedPoints !== 0) {
              sanDiemText = calculatedPoints > 0 ? `nhận ${calculatedPoints} điểm` : `trả ${Math.abs(calculatedPoints)} điểm`;
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
            id_giao_dich: mainTransactionId,
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
      console.log('ID giao dịch chính:', mainTransactionId)
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
            
            if (calculatedPoints !== null && calculatedPoints !== undefined && calculatedPoints !== 0) {
              diemText = calculatedPoints > 0 ? `nhận ${calculatedPoints} điểm` : `trả ${Math.abs(calculatedPoints)} điểm`;
            }
            
            // Thêm thông tin lịch xe nếu có
            let lichXeText = '';
            if (id_lich_xe) {
              lichXeText = ' (có lịch xe đi kèm)';
            }
            
            if (tienText && diemText) {
              senderNotificationContent = `Bạn đã giao lịch xe cho ${req.body.nguoi_nhan_ten || 'người dùng'} - ${tienText} và ${diemText}${lichXeText}`;
            } else if (tienText) {
              senderNotificationContent = `Bạn đã giao lịch xe cho ${req.body.nguoi_nhan_ten || 'người dùng'} - ${tienText}${lichXeText}`;
            } else if (diemText) {
              senderNotificationContent = `Bạn đã giao lịch xe cho ${req.body.nguoi_nhan_ten || 'người dùng'} - ${diemText}${lichXeText}`;
            } else {
              senderNotificationContent = `Bạn đã giao lịch xe cho ${req.body.nguoi_nhan_ten || 'người dùng'}${lichXeText}`;
            }
            break;
          case 4: // San cho
            let sanTienText = '';
            let sanDiemText = '';
            
            if (so_tien !== null && so_tien !== undefined && so_tien !== 0) {
              sanTienText = so_tien > 0 ? `san cho ${so_tien.toLocaleString('vi-VN')} VNĐ` : `san cho ${Math.abs(so_tien).toLocaleString('vi-VN')} VNĐ`;
            }
            
            if (calculatedPoints !== null && calculatedPoints !== undefined && calculatedPoints !== 0) {
              sanDiemText = calculatedPoints > 0 ? `san cho ${calculatedPoints} điểm` : `san cho ${Math.abs(calculatedPoints)} điểm`;
            }
            
            if (sanTienText && sanDiemText) {
              senderNotificationContent = `Bạn đã ${sanTienText} và ${sanDiemText} cho ${req.body.nguoi_nhan_ten || 'người dùng'} (giao dịch đã hoàn thành)`;
            } else if (sanTienText) {
              senderNotificationContent = `Bạn đã ${sanTienText} cho ${req.body.nguoi_nhan_ten || 'người dùng'} (giao dịch đã hoàn thành)`;
            } else if (sanDiemText) {
              senderNotificationContent = `Bạn đã ${sanDiemText} cho ${req.body.nguoi_nhan_ten || 'người dùng'} (giao dịch đã hoàn thành)`;
            } else {
              senderNotificationContent = `Bạn đã san cho ${req.body.nguoi_nhan_ten || 'người dùng'} (giao dịch đã hoàn thành)`;
            }
            break;
        }

        if (senderNotificationContent) {
          console.log('Nội dung thông báo cho người gửi:', senderNotificationContent)
          
          const senderNotificationData = {
            id_nguoi_dung: id_nguoi_gui,
            id_giao_dich: mainTransactionId,
            noi_dung: senderNotificationContent
          };
          
          const senderNotificationId = await Notification.create(senderNotificationData);
          console.log('✅ Thông báo cho người gửi được tạo thành công với ID:', senderNotificationId)
        }
      } catch (notificationError) {
        console.error('❌ Lỗi khi tạo thông báo cho người gửi:', notificationError)
        // Không dừng quá trình tạo giao dịch nếu tạo thông báo thất bại
      }

      // Trả về kết quả
      const responseData = {
        success: true,
        message: id_loai_giao_dich === 4 ? 'Tạo giao dịch San cho thành công và đã hoàn thành' : 'Tạo giao dịch thành công',
        data: {
          mainTransaction: {
            id: mainTransactionId,
            ...mainTransactionData
          }
        }
      };

      // Thêm thông tin về điểm đã tính được nếu là giao dịch Giao lịch
      if (id_loai_giao_dich === 1 && id_lich_xe) {
        if (calculatedPoints === 'manual') {
          responseData.data.pointCalculation = {
            status: 'manual',
            message: 'Cần tính điểm thủ công cho lịch xe này'
          };
        } else if (calculatedPoints && calculatedPoints > 0) {
          responseData.data.pointCalculation = {
            status: 'auto',
            points: calculatedPoints,
            message: `Đã tự động tính được ${calculatedPoints} điểm`
          };
        }
      }

      // Thêm thông tin về việc cập nhật số dư và điểm cho giao dịch San cho
      if (id_loai_giao_dich === 4) {
        responseData.data.balanceUpdate = {
          status: 'completed',
          message: 'Số dư và điểm đã được cập nhật cho cả người san và người nhận san',
          details: {
            sender: {
              action: 'BỊ TRỪ',
              moneyChange: so_tien || 0,
              pointsChange: calculatedPoints || 0
            },
            receiver: {
              action: 'ĐƯỢC CỘNG',
              moneyChange: so_tien || 0,
              pointsChange: calculatedPoints || 0
            }
          }
        };
      }

      // Thêm thông tin giao dịch đối ứng nếu có
      if (oppositeTransactionId) {
        responseData.data.oppositeTransaction = {
          id: oppositeTransactionId,
          message: id_loai_giao_dich === 1 ? 'Giao dịch "Nhận lịch" đối ứng đã được tạo' : 'Giao dịch "Nhận san" đối ứng đã được tạo'
        };
      }

      console.log('✅ Transaction creation completed successfully')
      console.log('Response data:', responseData)
      
      res.status(201).json(responseData);
      
    } catch (error) {
      console.error('❌ Error in createTransaction:', error)
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo giao dịch: ' + error.message
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
      if (transaction.id_loai_giao_dich !== 1 && transaction.id_loai_giao_dich !== 4) { // Giao lịch hoặc San cho
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

      // Tìm giao dịch đối ứng dựa trên loại giao dịch hiện tại
      console.log('=== TÌM GIAO DỊCH ĐỐI ỨNG ===')
      console.log('Transaction type:', transaction.id_loai_giao_dich)
      
      let oppositeTransaction;
      if (transaction.id_loai_giao_dich === 1) { // Giao lịch
        // Tìm giao dịch "Nhận lịch" tương ứng
        oppositeTransaction = await Transaction.findOppositeTransaction(
          transaction.id_nguoi_gui, // người giao lịch
          transaction.id_nguoi_nhan, // người nhận lịch
          transaction.id_nhom,
          transaction.id_lich_xe,
          1 // loại giao dịch "Giao lịch" để tìm đối ứng "Nhận lịch"
        );
      } else if (transaction.id_loai_giao_dich === 4) { // San cho
        // Tìm giao dịch "Nhận san" tương ứng
        oppositeTransaction = await Transaction.findOppositeTransaction(
          transaction.id_nguoi_gui, // người san
          transaction.id_nguoi_nhan, // người nhận san
          transaction.id_nhom,
          transaction.id_lich_xe,
          4 // loại giao dịch "San cho" để tìm đối ứng "Nhận san"
        );
      } else {
        return res.status(400).json({
          success: false,
          message: 'Loại giao dịch này không hỗ trợ xác nhận'
        });
      }
      
      if (!oppositeTransaction) {
        console.log('⚠️ Không tìm thấy giao dịch đối ứng')
        return res.status(400).json({
          success: false,
          message: 'Không tìm thấy giao dịch đối ứng để xác nhận'
        });
      }
      
      console.log('✅ Tìm thấy giao dịch đối ứng:', oppositeTransaction)

      // Cập nhật trạng thái cả 2 giao dịch
      await Transaction.updateStatus(id, 'hoan_thanh'); // Giao dịch chính
      await Transaction.updateStatus(oppositeTransaction.id_giao_dich, 'hoan_thanh'); // Giao dịch đối ứng
      console.log('✅ Cả 2 giao dịch đã được cập nhật trạng thái hoàn thành')

      // Xử lý logic cộng trừ tiền và điểm
      console.log('=== XỬ LÝ CHUYỂN TIỀN VÀ ĐIỂM ===')
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
          
          // Tính toán số dư và điểm mới dựa trên loại giao dịch
          const moneyChange = transaction.so_tien || 0;
          const pointsChange = transaction.diem || 0;
          
          let newSenderBalance, newSenderPoints, newReceiverBalance, newReceiverPoints;
          let senderAction, receiverAction;
          
          if (transaction.id_loai_giao_dich === 1) { // Giao lịch
            // Người giao lịch ĐƯỢC CỘNG tiền và điểm
            newSenderBalance = parseFloat(sender.so_du) + parseFloat(moneyChange);
            newSenderPoints = parseInt(sender.diem) + parseInt(pointsChange);
            // Người nhận lịch BỊ TRỪ tiền và điểm
            newReceiverBalance = parseFloat(receiver.so_du) - parseFloat(moneyChange);
            newReceiverPoints = parseInt(receiver.diem) - parseInt(pointsChange);
            senderAction = 'ĐƯỢC CỘNG';
            receiverAction = 'BỊ TRỪ';
          } else if (transaction.id_loai_giao_dich === 4) { // San cho
            // Người san BỊ TRỪ tiền và điểm
            newSenderBalance = parseFloat(sender.so_du) - parseFloat(moneyChange);
            newSenderPoints = parseInt(sender.diem) - parseInt(pointsChange);
            // Người nhận san ĐƯỢC CỘNG tiền và điểm
            newReceiverBalance = parseFloat(receiver.so_du) + parseFloat(moneyChange);
            newReceiverPoints = parseInt(receiver.diem) + parseInt(pointsChange);
            senderAction = 'BỊ TRỪ';
            receiverAction = 'ĐƯỢC CỘNG';
          }
          
          console.log('=== KẾT QUẢ TÍNH TOÁN ===')
          console.log(`Người gửi (${senderAction}):`)
          console.log('  - Cũ: Balance:', sender.so_du, 'Points:', sender.diem)
          console.log('  - Mới: Balance:', newSenderBalance, 'Points:', newSenderPoints)
          console.log(`  - Thay đổi: ${senderAction === 'ĐƯỢC CỘNG' ? '+' : '-'}`, moneyChange, 'VNĐ,', senderAction === 'ĐƯỢC CỘNG' ? '+' : '-', pointsChange, 'điểm')
          
          console.log(`Người nhận (${receiverAction}):`)
          console.log('  - Cũ: Balance:', receiver.so_du, 'Points:', receiver.diem)
          console.log('  - Mới: Balance:', newReceiverBalance, 'Points:', newReceiverPoints)
          console.log(`  - Thay đổi: ${receiverAction === 'ĐƯỢC CỘNG' ? '+' : '-'}`, moneyChange, 'VNĐ,', receiverAction === 'ĐƯỢC CỘNG' ? '+' : '-', pointsChange, 'điểm')
          
          // Cập nhật số dư và điểm cho người gửi
          const senderUpdateResult = await User.updateBalanceAndPoints(
            transaction.id_nguoi_gui,
            newSenderBalance,
            newSenderPoints
          );
          console.log(`✅ Cập nhật số dư và điểm cho người gửi thành công (${senderAction})`)

          // Cập nhật số dư và điểm cho người nhận
          const receiverUpdateResult = await User.updateBalanceAndPoints(
            transaction.id_nguoi_nhan,
            newReceiverBalance,
            newReceiverPoints
          );
          console.log(`✅ Cập nhật số dư và điểm cho người nhận thành công (${receiverAction})`)
        } else {
          console.log('⚠️ Không tìm thấy thông tin người dùng để cập nhật số dư/điểm')
          console.log('Sender:', sender ? 'Found' : 'Not found')
          console.log('Receiver:', receiver ? 'Found' : 'Not found')
        }
      } else {
        console.log('⚠️ Không có thông tin số tiền hoặc điểm để xử lý (cả hai đều bằng 0 hoặc null)')
      }

      // Tạo thông báo cho người gửi
      console.log('=== TẠO THÔNG BÁO CHO NGƯỜI GỬI ===')
      console.log('ID người gửi:', transaction.id_nguoi_gui)
      console.log('ID giao dịch:', id)
      console.log('Tên người xác nhận:', req.user.ten_dang_nhap)
      
      try {
        let notificationMessage;
        if (transaction.id_loai_giao_dich === 1) { // Giao lịch
          notificationMessage = `Lịch xe của bạn đã được xác nhận bởi ${req.user.ten_dang_nhap}. Bạn đã nhận ${transaction.so_tien ? transaction.so_tien.toLocaleString('vi-VN') : 0} VNĐ và ${transaction.diem || 0} điểm.`;
        } else if (transaction.id_loai_giao_dich === 4) { // San cho
          notificationMessage = `Giao dịch san cho của bạn đã được xác nhận bởi ${req.user.ten_dang_nhap}. Bạn đã chuyển ${transaction.so_tien ? transaction.so_tien.toLocaleString('vi-VN') : 0} VNĐ và ${transaction.diem || 0} điểm.`;
        }
        
        const notificationData = {
          id_nguoi_dung: transaction.id_nguoi_gui,
          id_giao_dich: id,
          noi_dung: notificationMessage
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

  // Hủy lịch xe và hoàn tiền/điểm
  static async cancelVehicleSchedule(req, res) {
    try {
      console.log('=== cancelVehicleSchedule Debug ===')
      console.log('Request user:', req.user)
      console.log('Schedule ID:', req.params.id)
      
      const { id } = req.params;
      const userId = req.user.id_nguoi_dung;
      
      // Lấy thông tin lịch xe
      const { VehicleSchedule } = require('../models');
      const schedule = await VehicleSchedule.getById(id);
      
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy lịch xe'
        });
      }

      console.log('Schedule found:', schedule)

      // Kiểm tra quyền: chỉ người tạo hoặc admin mới được hủy
      const isCreator = userId === schedule.id_nguoi_tao;
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (!isCreator && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ người tạo lịch xe hoặc admin mới có quyền hủy lịch xe này'
        });
      }

      // Kiểm tra trạng thái lịch xe
      if (schedule.trang_thai !== 'cho_xac_nhan') {
        return res.status(400).json({
          success: false,
          message: 'Lịch xe này không thể hủy (đã hoàn thành hoặc đã hủy)'
        });
      }

      console.log('Proceeding with vehicle schedule cancellation...')

      // Tìm giao dịch liên quan đến lịch xe này
      const relatedTransactions = await Transaction.getByScheduleId(schedule.id_lich_xe);
      
      if (relatedTransactions && relatedTransactions.length > 0) {
        console.log('Found related transactions:', relatedTransactions.length)
        
        // Xử lý hoàn tiền và điểm cho các giao dịch liên quan
        for (const transaction of relatedTransactions) {
          if (transaction.trang_thai === 'hoan_thanh') {
            console.log('Processing refund for transaction:', transaction.id_giao_dich)
            
            // Hoàn tiền và điểm
            const sender = await User.getById(transaction.id_nguoi_gui);
            const receiver = await User.getById(transaction.id_nguoi_nhan);
            
            if (sender && receiver) {
              // Hoàn lại tiền và điểm cho người gửi
              const refundAmount = transaction.so_tien || 0;
              const refundPoints = transaction.diem || 0;
              
              const newSenderBalance = parseFloat(sender.so_du) + parseFloat(refundAmount);
              const newSenderPoints = parseInt(sender.diem) + parseInt(refundPoints);
              
              // Hoàn lại tiền và điểm cho người nhận
              const newReceiverBalance = parseFloat(receiver.so_du) - parseFloat(refundAmount);
              const newReceiverPoints = parseInt(receiver.diem) - parseInt(refundPoints);
              
              console.log('=== HOÀN TIỀN VÀ ĐIỂM ===')
              console.log(`Người gửi (được hoàn): +${refundAmount} VNĐ, +${refundPoints} điểm`)
              console.log(`Người nhận (bị trừ): -${refundAmount} VNĐ, -${refundPoints} điểm`)
              
              // Cập nhật số dư và điểm
              await User.updateBalanceAndPoints(transaction.id_nguoi_gui, newSenderBalance, newSenderPoints);
              await User.updateBalanceAndPoints(transaction.id_nguoi_nhan, newReceiverBalance, newReceiverPoints);
              
              console.log('✅ Hoàn tiền và điểm thành công')
            }
          }
        }
      }

      // Hủy lịch xe
      const cancelSuccess = await VehicleSchedule.cancelSchedule(id, userId);
      
      if (!cancelSuccess) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi hủy lịch xe'
        });
      }

      console.log('Vehicle schedule cancelled successfully')

      // Tạo thông báo cho người nhận lịch (nếu có)
      if (schedule.id_nguoi_nhan) {
        try {
          const { Notification } = require('../models');
          const notificationData = {
            id_nguoi_dung: schedule.id_nguoi_nhan,
            noi_dung: `Lịch xe từ ${req.user.ten_dang_nhap} đã bị hủy. Tiền và điểm đã được hoàn lại.`
          };
          
          await Notification.create(notificationData);
          console.log('✅ Thông báo hủy lịch được tạo thành công')
        } catch (notificationError) {
          console.error('❌ Lỗi khi tạo thông báo hủy lịch:', notificationError)
        }
      }

      // Tạo thông báo cho người tạo lịch
      try {
        const { Notification } = require('../models');
        const notificationData = {
          id_nguoi_dung: schedule.id_nguoi_tao,
          noi_dung: `Lịch xe của bạn đã được hủy bởi ${req.user.ten_dang_nhap}. Tiền và điểm đã được hoàn lại.`
        };
        
        await Notification.create(notificationData);
        console.log('✅ Thông báo hủy lịch cho người tạo được tạo thành công')
      } catch (notificationError) {
        console.error('❌ Lỗi khi tạo thông báo hủy lịch cho người tạo:', notificationError)
      }

      console.log('=== cancelVehicleSchedule Success ===')
      res.json({
        success: true,
        message: 'Hủy lịch xe thành công. Tiền và điểm đã được hoàn lại.',
        data: {
          scheduleId: id,
          refundProcessed: relatedTransactions && relatedTransactions.length > 0
        }
      });
    } catch (error) {
      console.error('=== cancelVehicleSchedule Error ===')
      console.error('Error details:', error)
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi hủy lịch xe'
      });
    }
  }
}

module.exports = TransactionController;
