const { VehicleSchedule, Group, User } = require('../models');

class VehicleScheduleController {
  // Lấy tất cả lịch xe
  static async getAllSchedules(req, res) {
    try {
      const schedules = await VehicleSchedule.getAll();
      res.json({
        success: true,
        message: 'Lấy danh sách lịch xe thành công',
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
}

module.exports = VehicleScheduleController;
