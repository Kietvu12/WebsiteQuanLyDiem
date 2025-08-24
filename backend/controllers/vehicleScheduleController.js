const { VehicleSchedule, Group, User } = require('../models');

class VehicleScheduleController {
  // Lấy tất cả lịch xe
  static async getAllSchedules(req, res) {
    try {
      console.log('=== getAllSchedules Debug ===')
      console.log('Request user:', req.user)
      console.log('User is admin:', req.user.la_admin)
      
      // Kiểm tra quyền admin
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (!isAdmin) {
        console.log('❌ Access denied - not admin')
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền xem tất cả lịch xe'
        });
      }
      
      console.log('✅ Access granted - is admin')
      const schedules = await VehicleSchedule.getAll();
      
      res.json({
        success: true,
        message: 'Lấy danh sách tất cả lịch xe thành công',
        data: schedules
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách lịch xe:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách lịch xe'
      });
    }
  }

  // Lấy lịch xe sắp tới (trong 1 tiếng tới)
  static async getUpcomingSchedules(req, res) {
    try {
      console.log('=== getUpcomingSchedules Debug ===')
      console.log('Request user:', req.user)
      
      // Kiểm tra quyền admin
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      let schedules;
      if (isAdmin) {
        // Admin: lấy tất cả lịch xe sắp tới
        schedules = await VehicleSchedule.getUpcomingSchedules();
        console.log('✅ Admin - lấy tất cả lịch xe sắp tới:', schedules.length);
      } else {
        // User: chỉ lấy lịch xe sắp tới của họ (những lịch xe mà họ là người nhận)
        schedules = await VehicleSchedule.getUserUpcomingSchedules(req.user.id_nguoi_dung);
        console.log('✅ User - lấy lịch xe sắp tới của họ:', schedules.length);
      }
      
      res.json({
        success: true,
        message: isAdmin ? 'Lấy danh sách lịch xe sắp tới thành công (Admin)' : 'Lấy danh sách lịch xe sắp tới của bạn thành công',
        data: schedules
      });
    } catch (error) {
      console.error('Lỗi lấy lịch xe sắp tới:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch xe sắp tới'
      });
    }
  }

  // Lấy lịch xe đã hoàn thành (sau 2 tiếng)
  static async getCompletedSchedules(req, res) {
    try {
      console.log('=== getCompletedSchedules Debug ===')
      console.log('Request user:', req.user)
      
      // Kiểm tra quyền admin
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      let schedules;
      if (isAdmin) {
        // Admin: lấy tất cả lịch xe đã hoàn thành
        schedules = await VehicleSchedule.getCompletedSchedules();
        console.log('✅ Admin - lấy tất cả lịch xe đã hoàn thành:', schedules.length);
      } else {
        // User: chỉ lấy lịch xe đã hoàn thành của họ (những lịch xe mà họ là người nhận)
        schedules = await VehicleSchedule.getUserCompletedSchedules(req.user.id_nguoi_dung);
        console.log('✅ User - lấy lịch xe đã hoàn thành của họ:', schedules.length);
      }
      
      res.json({
        success: true,
        message: isAdmin ? 'Lấy danh sách lịch xe đã hoàn thành thành công (Admin)' : 'Lấy danh sách lịch xe đã hoàn thành của bạn thành công',
        data: schedules
      });
    } catch (error) {
      console.error('Lỗi lấy lịch xe đã hoàn thành:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch xe đã hoàn thành'
      });
    }
  }

  // Tự động hoàn thành lịch xe (sau 2 tiếng)
  static async autoCompleteSchedules(req, res) {
    try {
      console.log('=== autoCompleteSchedules Debug ===')
      console.log('Request user:', req.user)
      
      // Kiểm tra quyền admin
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (!isAdmin) {
        console.log('❌ Access denied - not admin')
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền thực hiện tự động hoàn thành lịch xe'
        });
      }
      
      console.log('✅ Access granted - is admin')
      const completedCount = await VehicleSchedule.autoCompleteSchedules();
      
      res.json({
        success: true,
        message: `Đã tự động hoàn thành ${completedCount} lịch xe`,
        data: { completedCount }
      });
    } catch (error) {
      console.error('Lỗi tự động hoàn thành lịch xe:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tự động hoàn thành lịch xe'
      });
    }
  }

  // Lấy lịch xe theo ID
  static async getScheduleById(req, res) {
    try {
      const { id } = req.params;
      const schedule = await VehicleSchedule.getById(id);

      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy lịch xe'
        });
      }

      res.json({
        success: true,
        message: 'Lấy thông tin lịch xe thành công',
        data: schedule
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin lịch xe:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin lịch xe'
      });
    }
  }

  // Tạo lịch xe mới
  static async createSchedule(req, res) {
    try {
      console.log('=== createSchedule Debug ===')
      console.log('Request user:', req.user)
      console.log('Request body:', req.body)
      
      const {
        id_loai_xe,
        id_loai_tuyen,
        thoi_gian_bat_dau_don,
        thoi_gian_ket_thuc_don,
        thoi_gian_bat_dau_tra,
        thoi_gian_ket_thuc_tra,
        id_nhom,
        id_nguoi_nhan
      } = req.body;

      const id_nguoi_tao = req.user.id_nguoi_dung;

      console.log('Extracted data:', {
        id_loai_xe,
        id_loai_tuyen,
        thoi_gian_bat_dau_don,
        thoi_gian_ket_thuc_don,
        thoi_gian_bat_dau_tra,
        thoi_gian_ket_thuc_tra,
        id_nhom,
        id_nguoi_nhan,
        id_nguoi_tao
      })

      // Kiểm tra dữ liệu đầu vào
      if (!id_loai_xe || !id_loai_tuyen || !thoi_gian_bat_dau_don || !thoi_gian_ket_thuc_don || !id_nhom) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
        });
      }

      // Kiểm tra người dùng có trong nhóm không
      console.log('Checking if user is member of group...')
      console.log('User is admin:', req.user.la_admin)
      
      let isMember = false
      if (req.user.la_admin === 1 || req.user.la_admin === true) {
        // Admin có thể tạo lịch xe ở mọi nhóm
        console.log('User is admin, bypassing group membership check')
        isMember = true
      } else {
        // User thường phải kiểm tra thành viên nhóm
        console.log('User is not admin, checking group membership...')
        const isMemberResult = await Group.isMember(id_nhom, id_nguoi_tao);
        isMember = isMemberResult
      }
      
      console.log('Group membership check result:', isMember)
      
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không phải thành viên của nhóm này'
        });
      }

      console.log('Proceeding with vehicle schedule creation...')

      // Tạo lịch xe mới
      const scheduleId = await VehicleSchedule.create({
        id_loai_xe,
        id_loai_tuyen,
        thoi_gian_bat_dau_don,
        thoi_gian_ket_thuc_don,
        thoi_gian_bat_dau_tra,
        thoi_gian_ket_thuc_tra,
        id_nguoi_tao,
        id_nhom,
        id_nguoi_nhan
      });

      console.log('Vehicle schedule created with ID:', scheduleId)

      // Tạo thông báo cho người nhận lịch (nếu có)
      if (id_nguoi_nhan) {
        console.log('=== TẠO THÔNG BÁO CHO NGƯỜI NHẬN LỊCH ===')
        console.log('ID người nhận lịch:', id_nguoi_nhan)
        console.log('ID lịch xe:', scheduleId)
        console.log('Tên người tạo:', req.user.ten_dang_nhap)
        
        try {
          const { Notification } = require('../models');
          const notificationData = {
            id_nguoi_dung: id_nguoi_nhan,
            noi_dung: `${req.user.ten_dang_nhap} đã tạo lịch xe mới cho bạn`
          };
          console.log('Dữ liệu thông báo lịch xe:', notificationData)
          
          const notificationId = await Notification.create(notificationData);
          console.log('✅ Thông báo lịch xe được tạo thành công với ID:', notificationId)
          console.log('=== THÔNG BÁO LỊCH XE ĐÃ ĐƯỢC GỬI ===')
        } catch (notificationError) {
          console.error('❌ Lỗi khi tạo thông báo lịch xe:')
          console.error('Error details:', notificationError)
          console.error('Error message:', notificationError.message)
          console.error('Error stack:', notificationError.stack)
          // Không dừng quá trình tạo lịch xe nếu tạo thông báo thất bại
        }
      } else {
        console.log('⚠️ Không có người nhận lịch, bỏ qua việc tạo thông báo')
      }

      console.log('=== createSchedule Success ===')
      res.status(201).json({
        success: true,
        message: 'Tạo lịch xe thành công',
        data: { id: scheduleId }
      });
    } catch (error) {
      console.error('=== createSchedule Error ===')
      console.error('Error details:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo lịch xe'
      });
    }
  }

  // Cập nhật lịch xe
  static async updateSchedule(req, res) {
    try {
      const { id } = req.params;
      const {
        id_loai_xe,
        id_loai_tuyen,
        thoi_gian_bat_dau_don,
        thoi_gian_ket_thuc_don,
        thoi_gian_bat_dau_tra,
        thoi_gian_ket_thuc_tra,
        id_nhom
      } = req.body;

      // Lấy thông tin lịch xe hiện tại
      const currentSchedule = await VehicleSchedule.getById(id);
      if (!currentSchedule) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy lịch xe'
        });
      }

      // Kiểm tra quyền: chỉ người tạo hoặc admin mới được cập nhật
      if (req.user.id_nguoi_dung !== currentSchedule.id_nguoi_tao && !req.user.la_admin) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền cập nhật lịch xe này'
        });
      }

      // Cập nhật lịch xe
      const success = await VehicleSchedule.update(id, {
        id_loai_xe,
        id_loai_tuyen,
        thoi_gian_bat_dau_don,
        thoi_gian_ket_thuc_don,
        thoi_gian_bat_dau_tra,
        thoi_gian_ket_thuc_tra,
        id_nhom
      });

      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi cập nhật lịch xe'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật lịch xe thành công'
      });
    } catch (error) {
      console.error('Lỗi cập nhật lịch xe:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật lịch xe'
      });
    }
  }

  // Cập nhật trạng thái lịch xe
  static async updateScheduleStatus(req, res) {
    try {
      const { id } = req.params;
      const { trang_thai } = req.body;

      // Lấy thông tin lịch xe hiện tại
      const currentSchedule = await VehicleSchedule.getById(id);
      if (!currentSchedule) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy lịch xe'
        });
      }

      // Kiểm tra quyền: chỉ người tạo hoặc admin mới được cập nhật trạng thái
      if (req.user.id_nguoi_dung !== currentSchedule.id_nguoi_tao && !req.user.la_admin) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền cập nhật trạng thái lịch xe này'
        });
      }

      // Cập nhật trạng thái
      const success = await VehicleSchedule.updateStatus(id, trang_thai);

      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi cập nhật trạng thái lịch xe'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật trạng thái lịch xe thành công'
      });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái lịch xe:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật trạng thái lịch xe'
      });
    }
  }

  // Xóa lịch xe
  static async deleteSchedule(req, res) {
    try {
      const { id } = req.params;

      // Lấy thông tin lịch xe hiện tại
      const currentSchedule = await VehicleSchedule.getById(id);
      if (!currentSchedule) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy lịch xe'
        });
      }

      // Kiểm tra quyền: chỉ người tạo hoặc admin mới được xóa
      if (req.user.id_nguoi_dung !== currentSchedule.id_nguoi_tao && !req.user.la_admin) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xóa lịch xe này'
        });
      }

      const success = await VehicleSchedule.delete(id);

      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi xóa lịch xe'
        });
      }

      res.json({
        success: true,
        message: 'Xóa lịch xe thành công'
      });
    } catch (error) {
      console.error('Lỗi xóa lịch xe:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa lịch xe'
      });
    }
  }

  // Lấy lịch xe theo nhóm
  static async getSchedulesByGroup(req, res) {
    try {
      const { groupId } = req.params;

      // Kiểm tra người dùng có trong nhóm không
      console.log('Checking if user is member of group...')
      console.log('User is admin:', req.user.la_admin)
      
      let isMember = false
      if (req.user.la_admin === 1 || req.user.la_admin === true) {
        // Admin có thể xem lịch xe của mọi nhóm
        console.log('User is admin, bypassing group membership check')
        isMember = true
      } else {
        // User thường phải kiểm tra thành viên nhóm
        console.log('User is not admin, checking group membership...')
        const isMemberResult = await Group.isMember(groupId, req.user.id_nguoi_dung);
        isMember = isMemberResult
      }
      
      console.log('Group membership check result:', isMember)
      
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không phải thành viên của nhóm này'
        });
      }

      const schedules = await VehicleSchedule.getByGroup(groupId);

      res.json({
        success: true,
        message: 'Lấy lịch xe theo nhóm thành công',
        data: schedules
      });
    } catch (error) {
      console.error('Lỗi lấy lịch xe theo nhóm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch xe theo nhóm'
      });
    }
  }

  // Lấy lịch xe theo người tạo
  static async getSchedulesByCreator(req, res) {
    try {
      const { userId } = req.params;

      // Kiểm tra quyền: chỉ admin hoặc chính người dùng đó mới được xem
      if (req.user.id_nguoi_dung !== parseInt(userId) && !req.user.la_admin) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xem lịch xe của người dùng khác'
        });
      }

      const schedules = await VehicleSchedule.getByCreator(userId);

      res.json({
        success: true,
        message: 'Lấy lịch xe theo người tạo thành công',
        data: schedules
      });
    } catch (error) {
      console.error('Lỗi lấy lịch xe theo người tạo:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch xe theo người tạo'
      });
    }
  }

  // Lấy lịch xe theo trạng thái
  static async getSchedulesByStatus(req, res) {
    try {
      const { status } = req.params;
      const schedules = await VehicleSchedule.getByStatus(status);

      res.json({
        success: true,
        message: 'Lấy lịch xe theo trạng thái thành công',
        data: schedules
      });
    } catch (error) {
      console.error('Lỗi lấy lịch xe theo trạng thái:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch xe theo trạng thái'
      });
    }
  }

  // Lấy lịch xe theo ngày
  static async getSchedulesByDate(req, res) {
    try {
      const { date } = req.params;
      const schedules = await VehicleSchedule.getByDate(date);

      res.json({
        success: true,
        message: 'Lấy lịch xe theo ngày thành công',
        data: schedules
      });
    } catch (error) {
      console.error('Lỗi lấy lịch xe theo ngày:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch xe theo ngày'
      });
    }
  }

  // Lấy danh sách loại xe
  static async getVehicleTypes(req, res) {
    try {
      console.log('getVehicleTypes - Request received')
      console.log('getVehicleTypes - User:', req.user)
      
      const { VehicleType } = require('../models');
      console.log('getVehicleTypes - VehicleType model loaded')
      
      const vehicleTypes = await VehicleType.getAll();
      console.log('getVehicleTypes - Data from database:', vehicleTypes)

      res.json({
        success: true,
        message: 'Lấy danh sách loại xe thành công',
        data: vehicleTypes
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách loại xe:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách loại xe'
      });
    }
  }

  // Lấy danh sách loại tuyến
  static async getRouteTypes(req, res) {
    try {
      console.log('getRouteTypes - Request received')
      console.log('getRouteTypes - User:', req.user)
      
      const { RouteType } = require('../models');
      console.log('getRouteTypes - RouteType model loaded')
      
      const routeTypes = await RouteType.getAll();
      console.log('getRouteTypes - Data from database:', routeTypes)

      res.json({
        success: true,
        message: 'Lấy danh sách loại tuyến thành công',
        data: routeTypes
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách loại tuyến:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách loại tuyến'
      });
    }
  }

  // Hủy lịch xe
  static async cancelSchedule(req, res) {
    try {
      console.log('=== cancelSchedule Debug ===')
      console.log('Request user:', req.user)
      console.log('Schedule ID:', req.params.id)
      
      const { id } = req.params;
      const userId = req.user.id_nguoi_dung;
      
      // Lấy thông tin lịch xe hiện tại
      const currentSchedule = await VehicleSchedule.getById(id);
      if (!currentSchedule) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy lịch xe'
        });
      }

      console.log('Current schedule:', currentSchedule)

      // Kiểm tra quyền: người tạo, người nhận lịch xe hoặc admin mới được hủy
      const isCreator = userId === currentSchedule.id_nguoi_tao;
      const isReceiver = userId === currentSchedule.id_nguoi_nhan;
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      console.log('Permission check:');
      console.log('  - Is Creator:', isCreator);
      console.log('  - Is Receiver:', isReceiver);
      console.log('  - Is Admin:', isAdmin);
      console.log('  - User ID:', userId);
      console.log('  - Creator ID:', currentSchedule.id_nguoi_tao);
      console.log('  - Receiver ID:', currentSchedule.id_nguoi_nhan);
      
      if (!isCreator && !isReceiver && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ người tạo lịch xe, người nhận lịch xe hoặc admin mới có quyền hủy lịch xe này'
        });
      }

      // Kiểm tra trạng thái lịch xe để xác định quyền hủy
      console.log('Schedule status:', currentSchedule.trang_thai);
      
      // Người tạo và admin có thể hủy mọi trạng thái
      if (isCreator || isAdmin) {
        console.log('✅ Creator/Admin - có thể hủy mọi trạng thái');
      } 
      // Người nhận chỉ có thể hủy khi lịch xe chưa hoàn thành
      else if (isReceiver) {
        if (currentSchedule.trang_thai === 'hoan_thanh') {
          return res.status(400).json({
            success: false,
            message: 'Không thể hủy lịch xe đã hoàn thành'
          });
        }
        console.log('✅ Receiver - có thể hủy lịch xe chưa hoàn thành');
      }

      console.log('Proceeding with schedule cancellation...')

      // Hủy lịch xe
      const cancelResult = await VehicleSchedule.cancelSchedule(id, userId);
      
      if (!cancelResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi hủy lịch xe'
        });
      }

      console.log('Schedule cancelled successfully')

      // Xử lý hoàn tiền/điểm khi hủy lịch xe
      console.log('=== XỬ LÝ HOÀN TIỀN/ĐIỂM KHI HỦY LỊCH XE ===')
      
      // Khai báo biến ở đầu method để có thể sử dụng trong toàn bộ method
      let huyLichTransactionSender = null;
      let huyLichTransactionReceiver = null;
      
      try {
        const { Transaction, User } = require('../models');
        
        // Lấy thông tin giao dịch "Giao lịch" và "Nhận lịch" liên quan
        const giaoLichTransaction = await Transaction.findByScheduleIdAndType(id, 1); // Giao lịch
        const nhanLichTransaction = await Transaction.findByScheduleIdAndType(id, 2); // Nhận lịch
        
        if (giaoLichTransaction && nhanLichTransaction) {
          console.log('=== THÔNG TIN GIAO DỊCH LIÊN QUAN ===');
          console.log('✅ Giao lịch transaction:', JSON.stringify(giaoLichTransaction, null, 2));
          console.log('✅ Nhận lịch transaction:', JSON.stringify(nhanLichTransaction, null, 2));
          
          // Kiểm tra dữ liệu người dùng
          console.log('🔍 Kiểm tra dữ liệu người dùng:');
          console.log('  - Giao lịch - người gửi:', giaoLichTransaction.nguoi_gui);
          console.log('  - Giao lịch - người nhận:', giaoLichTransaction.nguoi_nhan);
          console.log('  - Nhận lịch - người gửi:', nhanLichTransaction.nguoi_gui);
          console.log('  - Nhận lịch - người nhận:', nhanLichTransaction.nguoi_nhan);
          
          console.log('🚀 BẮT ĐẦU XỬ LÝ HOÀN TIỀN/ĐIỂM CHO CẢ 2 BÊN...');
          
          // Giao dịch "Hủy lịch" sẽ được tạo để ghi nhận
          // Và logic hoàn tiền/điểm sẽ được thực hiện riêng biệt
          console.log('=== THỰC HIỆN HOÀN TIỀN/ĐIỂM CHO CẢ 2 BÊN ===');
          console.log('Sẽ thực hiện:');
          console.log('  - TRỪ tiền/điểm của người giao lịch (A)');
          console.log('  - CỘNG tiền/điểm cho người nhận lịch (B)');
          console.log('  - Cập nhật số dư và điểm trong database');
          
          // TẠO 2 GIAO DỊCH "HỦY LỊCH" ĐÚNG LOGIC
          console.log('=== TẠO 2 GIAO DỊCH HỦY LỊCH ĐÚNG LOGIC ===');
          
          try {
            // Giao dịch 1: id_nguoi_gui = B (người hủy), id_nguoi_nhan = null → TRỪ tiền của B
            console.log('🔄 Đang tạo giao dịch 1 (TRỪ người hủy)...');
            const transaction1Data = {
              id_loai_giao_dich: 3,
              id_nguoi_gui: currentSchedule.id_nguoi_nhan, // B (người hủy) - LẤY TỪ LỊCH XE!
              id_nguoi_nhan: null,
              id_nhom: currentSchedule.id_nhom,
              id_lich_xe: id,
              so_tien: -Math.abs(giaoLichTransaction.so_tien),
              diem: -Math.abs(giaoLichTransaction.diem),
              noi_dung: `Hủy lịch xe - Trừ tiền/điểm của người hủy lịch`,
              trang_thai: 'hoan_thanh'
            };
            console.log('📋 Dữ liệu giao dịch 1:', JSON.stringify(transaction1Data, null, 2));
            console.log('🔍 Chi tiết giao dịch 1:');
            console.log('  - id_nguoi_gui:', transaction1Data.id_nguoi_gui, '(type:', typeof transaction1Data.id_nguoi_gui, ')');
            console.log('  - id_nguoi_nhan:', transaction1Data.id_nguoi_nhan, '(type:', typeof transaction1Data.id_nguoi_nhan, ')');
            console.log('  - id_loai_giao_dich:', transaction1Data.id_loai_giao_dich, '(type:', typeof transaction1Data.id_loai_giao_dich, ')');
            
            huyLichTransactionSender = await Transaction.create(transaction1Data);
            console.log('✅ Giao dịch 1 (TRỪ người hủy) đã tạo thành công - ID:', huyLichTransactionSender);
            
            // Giao dịch 2: id_nguoi_gui = null, id_nguoi_nhan = A (người được hoàn) → CỘNG tiền cho A
            console.log('🔄 Đang tạo giao dịch 2 (CỘNG người được hoàn)...');
            const transaction2Data = {
              id_loai_giao_dich: 3,
              id_nguoi_gui: null,
              id_nguoi_nhan: currentSchedule.id_nguoi_tao, // A (người được hoàn) - LẤY TỪ LỊCH XE!
              id_nhom: currentSchedule.id_nhom,
              id_lich_xe: id,
              so_tien: Math.abs(giaoLichTransaction.so_tien),
              diem: Math.abs(giaoLichTransaction.diem),
              noi_dung: `Hủy lịch xe - Cộng tiền/điểm cho người gửi lịch`,
              trang_thai: 'hoan_thanh'
            };
            console.log('📋 Dữ liệu giao dịch 2:', JSON.stringify(transaction2Data, null, 2));
            console.log('🔍 Chi tiết giao dịch 2:');
            console.log('  - id_nguoi_gui:', transaction2Data.id_nguoi_gui, '(type:', typeof transaction2Data.id_nguoi_gui, ')');
            console.log('  - id_nguoi_nhan:', transaction2Data.id_nguoi_nhan, '(type:', typeof transaction2Data.id_nguoi_nhan, ')');
            console.log('  - id_loai_giao_dich:', transaction2Data.id_loai_giao_dich, '(type:', typeof transaction2Data.id_loai_giao_dich, ')');
            
            huyLichTransactionReceiver = await Transaction.create(transaction2Data);
            console.log('✅ Giao dịch 2 (CỘNG Tài xế) đã tạo thành công - ID:', huyLichTransactionReceiver);
            
            console.log('🎉 CẢ 2 GIAO DỊCH ĐÃ ĐƯỢC TẠO THÀNH CÔNG!');
            console.log('  - Giao dịch 1 (TRỪ người hủy):', huyLichTransactionSender);
            console.log('  - Giao dịch 2 (CỘNG người được hoàn):', huyLichTransactionReceiver);
            
            // LOG CHI TIẾT ID NGƯỜI GỬI/NHẬN
            console.log('=== LOG GIAO DỊCH HỦY LỊCH ===');
            console.log('Giao dịch hủy 1 (trừ người hủy):', transaction1Data);
            console.log('Giao dịch hủy 2 (hoàn người được hoàn):', transaction2Data);
            console.log('🔍 CHI TIẾT ID NGƯỜI GỬI/NHẬN:');
            console.log(`  - Giao dịch hủy 1: id_nguoi_gui = ${transaction1Data.id_nguoi_gui}, id_nguoi_nhan = ${transaction2Data.id_nguoi_nhan}`);
            console.log(`  - Giao dịch hủy 2: id_nguoi_gui = ${transaction2Data.id_nguoi_gui}, id_nguoi_nhan = ${transaction2Data.id_nguoi_nhan}`);
            console.log('=== KẾT THÚC LOG ===');
            
          } catch (error) {
            console.error('❌ Lỗi khi tạo giao dịch hủy lịch:', error);
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
            console.error('❌ Lỗi xảy ra ở giao dịch nào?');
            console.error('❌ Giao dịch 1 data:', transaction1Data);
            console.error('❌ Giao dịch 2 data:', transaction2Data);
            
            // Không throw error để tiếp tục xử lý hoàn tiền/điểm
            console.log('⚠️ Tiếp tục xử lý hoàn tiền/điểm mặc dù tạo giao dịch thất bại...');
          }
          
          // THỰC HIỆN HOÀN TIỀN/ĐIỂM CHO CẢ 2 BÊN
          console.log('=== BẮT ĐẦU HOÀN TIỀN/ĐIỂM ===');
          console.log('🎯 MỤC TIÊU:');
          console.log('  - Người hủy lịch (B): ĐƯỢC CỘNG lại tiền/điểm');
          console.log('  - Người giao lịch (A): BỊ TRỪ lại tiền/điểm');
          
          // Hoàn tiền/điểm cho người hủy lịch (B) - được CỘNG lại
          const refundAmountHuyLich = Math.abs(giaoLichTransaction.so_tien);
          const refundPointsHuyLich = Math.abs(giaoLichTransaction.diem);
          
          console.log('=== HOÀN TIỀN/ĐIỂM CHO NGƯỜI HỦY LỊCH (B) ===');
          console.log('  - ID người hủy:', currentSchedule.id_nguoi_nhan);
          console.log('  - Số tiền hoàn:', refundAmountHuyLich, '(type:', typeof refundAmountHuyLich, ')');
          console.log('  - Điểm hoàn:', refundPointsHuyLich, '(type:', typeof refundPointsHuyLich, ')');
          
          try {
            console.log('🔄 Đang cập nhật số dư và điểm cho người hủy lịch...');
            
            // Lấy thông tin người hủy lịch
            const userHuyLich = await User.getById(currentSchedule.id_nguoi_nhan);
            if (!userHuyLich) {
              throw new Error('Không tìm thấy thông tin người hủy lịch');
            }
            
            const currentBalanceHuyLich = parseFloat(userHuyLich.so_du) || 0;
            const currentPointsHuyLich = parseFloat(userHuyLich.diem) || 0;
            
            const newBalanceHuyLich = currentBalanceHuyLich + refundAmountHuyLich;
            const newPointsHuyLich = currentPointsHuyLich + refundPointsHuyLich;
            
            console.log('  - Số dư hiện tại:', currentBalanceHuyLich);
            console.log('  - Số dư mới (tính toán):', newBalanceHuyLich);
            
            const updateResult = await User.updateBalanceAndPoints(
              currentSchedule.id_nguoi_nhan,
              newBalanceHuyLich,
              newPointsHuyLich
            );
            console.log('✅ Đã hoàn tiền/điểm cho người hủy lịch (B) - Result:', updateResult);
            
          } catch (error) {
            console.error('❌ Lỗi khi hoàn tiền cho người hủy lịch:', error);
            throw error;
          }
          
          console.log('🎉 HOÀN TIỀN/ĐIỂM CHO NGƯỜI HỦY LỊCH (B) HOÀN TẤT!');
          
          // Hoàn tiền/điểm cho người giao lịch (A) - bị TRỪ lại
          console.log('=== HOÀN TIỀN/ĐIỂM CHO NGƯỜI GIAO LỊCH (A) ===');
          console.log('  - ID người giao:', currentSchedule.id_nguoi_tao);
          console.log('  - Số tiền hoàn:', refundAmountHuyLich, '(type:', typeof refundAmountHuyLich, ')');
          console.log('  - Điểm hoàn:', refundPointsHuyLich, '(type:', typeof refundPointsHuyLich, ')');
          
          try {
            console.log('🔄 Đang cập nhật số dư và điểm cho người giao lịch...');
            
            // Lấy thông tin người giao lịch
            const userGiaoLich = await User.getById(currentSchedule.id_nguoi_tao);
            if (!userGiaoLich) {
              throw new Error('Không tìm thấy thông tin người giao lịch');
            }
            
            const currentBalanceGiaoLich = parseFloat(userGiaoLich.so_du) || 0;
            const currentPointsGiaoLich = parseFloat(userGiaoLich.diem) || 0;
            
            const newBalanceGiaoLich = currentBalanceGiaoLich - refundAmountHuyLich;
            const newPointsGiaoLich = currentPointsGiaoLich - refundPointsHuyLich;
            
            console.log('  - Số dư hiện tại:', currentBalanceGiaoLich);
            console.log('  - Số dư mới (tính toán):', newBalanceGiaoLich);
            
            const updateResult = await User.updateBalanceAndPoints(
              currentSchedule.id_nguoi_tao,
              newBalanceGiaoLich,
              newPointsGiaoLich
            );
            console.log('✅ Đã hoàn tiền/điểm cho người giao lịch (A) - Result:', updateResult);
            
          } catch (error) {
            console.error('❌ Lỗi khi hoàn tiền cho người giao lịch:', error);
            throw error;
          }
          
          console.log('🎉 HOÀN TIỀN/ĐIỂM CHO NGƯỜI GIAO LỊCH (A) HOÀN TẤT!');
          
          console.log('✅ Đã tạo 2 giao dịch "Hủy lịch":');
          console.log('  - Giao dịch 1 (TRỪ A):', huyLichTransactionSender.id);
          console.log('  - Giao dịch 2 (CỘNG B):', huyLichTransactionReceiver.id);
          
          // Tạo thông báo hoàn tiền/điểm
          console.log('=== TẠO THÔNG BÁO HOÀN TIỀN/ĐIỂM ===');
          try {
            const { Notification } = require('../models');
            
            // Thông báo cho người hủy lịch về việc hoàn tiền/điểm
            const notificationDataHuyLich = {
              id_nguoi_dung: currentSchedule.id_nguoi_nhan,
              id_giao_dich: huyLichTransactionSender || null,
              noi_dung: `Lịch xe đã bị hủy - Hoàn lại ${refundAmountHuyLich.toLocaleString()} VNĐ và ${refundPointsHuyLich} điểm`
            };
            await Notification.create(notificationDataHuyLich);
            console.log('✅ Thông báo hoàn tiền/điểm cho người hủy lịch');
            
            // Thông báo cho người giao lịch về việc hoàn tiền/điểm
            const notificationDataGiaoLich = {
              id_nguoi_dung: currentSchedule.id_nguoi_tao,
              id_giao_dich: huyLichTransactionReceiver || null,
              noi_dung: `Lịch xe đã bị hủy - Hoàn lại ${refundAmountHuyLich.toLocaleString()} VNĐ và ${refundPointsHuyLich} điểm`
            };
            await Notification.create(notificationDataGiaoLich);
            console.log('✅ Thông báo hoàn tiền/điểm cho người giao lịch');
          } catch (notificationError) {
            console.error('❌ Lỗi khi tạo thông báo hoàn tiền/điểm:', notificationError);
          }
        } else {
          console.log('⚠️ Không tìm thấy giao dịch liên quan để hoàn tiền/điểm');
          console.log('Giao lịch transaction:', giaoLichTransaction);
          console.log('Nhận lịch transaction:', nhanLichTransaction);
        }
      } catch (refundError) {
        console.error('❌ Lỗi khi xử lý hoàn tiền/điểm:', refundError);
        console.error('Error details:', refundError.message);
        console.error('Error stack:', refundError.stack);
        // Không dừng quá trình hủy nếu xử lý hoàn tiền/điểm thất bại
      }

      // Tạo thông báo cho người nhận lịch (nếu có)
      if (currentSchedule.id_nguoi_nhan) {
        console.log('=== TẠO THÔNG BÁO HỦY LỊCH CHO NGƯỜI NHẬN ===')
        try {
          const { Notification } = require('../models');
          const notificationData = {
            id_nguoi_dung: currentSchedule.id_nguoi_nhan,
            id_giao_dich: huyLichTransactionReceiver || null, // Sử dụng null thay vì undefined
            noi_dung: `Lịch xe từ ${req.user.ten_dang_nhap} đã bị hủy`
          };
          
          const notificationId = await Notification.create(notificationData);
          console.log('✅ Thông báo hủy lịch được tạo thành công với ID:', notificationId)
        } catch (notificationError) {
          console.error('❌ Lỗi khi tạo thông báo hủy lịch:', notificationError)
          // Không dừng quá trình hủy nếu tạo thông báo thất bại
        }
      }

      // Tạo thông báo cho người tạo lịch
      console.log('=== TẠO THÔNG BÁO HỦY LỊCH CHO NGƯỜI TẠO ===')
      try {
        const { Notification } = require('../models');
        const notificationData = {
          id_nguoi_dung: currentSchedule.id_nguoi_tao,
          id_giao_dich: huyLichTransactionSender || null, // Sử dụng null thay vì undefined
          noi_dung: `Lịch xe của bạn đã được hủy bởi ${req.user.ten_dang_nhap}`
        };
        
        const notificationId = await Notification.create(notificationData);
        console.log('✅ Thông báo hủy lịch cho người tạo được tạo thành công với ID:', notificationId)
      } catch (notificationError) {
        console.error('❌ Lỗi khi tạo thông báo hủy lịch cho người tạo:', notificationError)
        // Không dừng quá trình hủy nếu tạo thông báo thất bại
      }

      console.log('=== cancelSchedule Success ===')
      res.json({
        success: true,
        message: 'Hủy lịch xe thành công'
      });
    } catch (error) {
      console.error('=== cancelSchedule Error ===')
      console.error('Error details:', error)
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi hủy lịch xe'
      });
    }
  }
}

module.exports = VehicleScheduleController;
