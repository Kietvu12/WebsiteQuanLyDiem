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
      const {
        id_loai_xe,
        id_loai_tuyen,
        thoi_gian_bat_dau_don,
        thoi_gian_ket_thuc_don,
        thoi_gian_bat_dau_tra,
        thoi_gian_ket_thuc_tra,
        id_nhom
      } = req.body;

      const id_nguoi_tao = req.user.id;

      // Kiểm tra dữ liệu đầu vào
      if (!id_loai_xe || !id_loai_tuyen || !thoi_gian_bat_dau_don || !thoi_gian_ket_thuc_don || !id_nhom) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
        });
      }

      // Kiểm tra người dùng có trong nhóm không
      const isMember = await Group.isMember(id_nhom, id_nguoi_tao);
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không phải thành viên của nhóm này'
        });
      }

      // Tạo lịch xe mới
      const scheduleId = await VehicleSchedule.create({
        id_loai_xe,
        id_loai_tuyen,
        thoi_gian_bat_dau_don,
        thoi_gian_ket_thuc_don,
        thoi_gian_bat_dau_tra,
        thoi_gian_ket_thuc_tra,
        id_nguoi_tao,
        id_nhom
      });

      res.status(201).json({
        success: true,
        message: 'Tạo lịch xe thành công',
        data: { id: scheduleId }
      });
    } catch (error) {
      console.error('Lỗi tạo lịch xe:', error);
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
      if (req.user.id !== currentSchedule.id_nguoi_tao && !req.user.isAdmin) {
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
      if (req.user.id !== currentSchedule.id_nguoi_tao && !req.user.isAdmin) {
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
      if (req.user.id !== currentSchedule.id_nguoi_tao && !req.user.isAdmin) {
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
      const isMember = await Group.isMember(groupId, req.user.id);
      if (!isMember && !req.user.isAdmin) {
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
      if (req.user.id !== parseInt(userId) && !req.user.isAdmin) {
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
}

module.exports = VehicleScheduleController;
