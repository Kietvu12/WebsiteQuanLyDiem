const { Group, User, Transaction, VehicleSchedule } = require('../models');

class GroupController {
  // Lấy tất cả nhóm
  static async getAllGroups(req, res) {
    try {
      const groups = await Group.getAll();
      res.json({
        success: true,
        message: 'Lấy danh sách nhóm thành công',
        data: groups
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách nhóm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách nhóm'
      });
    }
  }

  // Lấy thông tin nhóm theo ID
  static async getGroupById(req, res) {
    try {
      const { id } = req.params;
      const group = await Group.getById(id);

      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhóm'
        });
      }

      res.json({
        success: true,
        message: 'Lấy thông tin nhóm thành công',
        data: group
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin nhóm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin nhóm'
      });
    }
  }

  // Tạo nhóm mới (chỉ admin)
  static async createGroup(req, res) {
    try {
      const { ten_nhom, mo_ta } = req.body;

      // Kiểm tra quyền admin
      if (!req.user.la_admin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền tạo nhóm'
        });
      }

      // Kiểm tra dữ liệu đầu vào
      if (!ten_nhom) {
        return res.status(400).json({
          success: false,
          message: 'Tên nhóm là bắt buộc'
        });
      }

      // Tạo nhóm mới
      const groupId = await Group.create({
        ten_nhom,
        mo_ta
      });

      res.status(201).json({
        success: true,
        message: 'Tạo nhóm thành công',
        data: { id: groupId }
      });
    } catch (error) {
      console.error('Lỗi tạo nhóm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo nhóm'
      });
    }
  }

  // Cập nhật thông tin nhóm (chỉ admin)
  static async updateGroup(req, res) {
    try {
      const { id } = req.params;
      const { ten_nhom, mo_ta } = req.body;

      // Kiểm tra quyền admin
      if (!req.user.la_admin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền cập nhật nhóm'
        });
      }

      // Cập nhật thông tin nhóm
      const success = await Group.update(id, {
        ten_nhom,
        mo_ta
      });

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhóm để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật nhóm thành công'
      });
    } catch (error) {
      console.error('Lỗi cập nhật nhóm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật nhóm'
      });
    }
  }

  // Xóa nhóm (chỉ admin)
  static async deleteGroup(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra quyền admin
      if (!req.user.la_admin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền xóa nhóm'
        });
      }

      const success = await Group.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhóm để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa nhóm thành công'
      });
    } catch (error) {
      console.error('Lỗi xóa nhóm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa nhóm'
      });
    }
  }

  // Lấy danh sách thành viên trong nhóm
  static async getGroupMembers(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra người dùng có trong nhóm không
      console.log('Checking if user is member of group...')
      console.log('User is admin:', req.user.la_admin)
      
      let isMember = false
      if (req.user.la_admin === 1 || req.user.la_admin === true) {
        // Admin có thể xem thành viên của mọi nhóm
        console.log('User is admin, bypassing group membership check')
        isMember = true
      } else {
        // User thường phải kiểm tra thành viên nhóm
        console.log('User is not admin, checking group membership...')
        const isMemberResult = await Group.isMember(id, req.user.id_nguoi_dung);
        isMember = isMemberResult
      }
      
      console.log('Group membership check result:', isMember)
      
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không phải thành viên của nhóm này'
        });
      }

      const members = await Group.getMembers(id);

      res.json({
        success: true,
        message: 'Lấy danh sách thành viên thành công',
        data: members
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách thành viên:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách thành viên'
      });
    }
  }

  // Thêm người dùng vào nhóm (chỉ admin)
  static async addMemberToGroup(req, res) {
    try {
      const { groupId, userId } = req.body;

      // Kiểm tra quyền admin
      if (!req.user.la_admin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền thêm thành viên vào nhóm'
        });
      }

      // Kiểm tra nhóm tồn tại
      const group = await Group.getById(groupId);
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhóm'
        });
      }

      // Kiểm tra người dùng tồn tại
      const user = await User.getById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      // Kiểm tra người dùng đã trong nhóm chưa
      const isAlreadyMember = await Group.isMember(groupId, userId);
      if (isAlreadyMember) {
        return res.status(400).json({
          success: false,
          message: 'Người dùng đã là thành viên của nhóm này'
        });
      }

      // Thêm thành viên vào nhóm
      await Group.addMember(groupId, userId);

      res.json({
        success: true,
        message: 'Thêm thành viên vào nhóm thành công'
      });
    } catch (error) {
      console.error('Lỗi thêm thành viên vào nhóm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi thêm thành viên vào nhóm'
      });
    }
  }

  // Xóa người dùng khỏi nhóm (chỉ admin)
  static async removeMemberFromGroup(req, res) {
    try {
      const { groupId, userId } = req.body;

      // Kiểm tra quyền admin
      if (!req.user.la_admin) {
        return res.status(400).json({
          success: false,
          message: 'Chỉ admin mới có quyền xóa thành viên khỏi nhóm'
        });
      }

      // Kiểm tra người dùng có trong nhóm không
      const isMember = await Group.isMember(groupId, userId);
      if (!isMember) {
        return res.status(400).json({
          success: false,
          message: 'Người dùng không phải thành viên của nhóm này'
        });
      }

      // Xóa thành viên khỏi nhóm
      const success = await Group.removeMember(groupId, userId);

      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi xóa thành viên khỏi nhóm'
        });
      }

      res.json({
        success: true,
        message: 'Xóa thành viên khỏi nhóm thành công'
      });
    } catch (error) {
      console.error('Lỗi xóa thành viên khỏi nhóm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa thành viên khỏi nhóm'
      });
    }
  }

  // Lấy số lượng thành viên trong nhóm
  static async getGroupMemberCount(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra người dùng có trong nhóm không
      console.log('Checking if user is member of group...')
      console.log('User is admin:', req.user.la_admin)
      
      let isMember = false
      if (req.user.la_admin === 1 || req.user.la_admin === true) {
        // Admin có thể xem số lượng thành viên của mọi nhóm
        console.log('User is admin, bypassing group membership check')
        isMember = true
      } else {
        // User thường phải kiểm tra thành viên nhóm
        console.log('User is not admin, checking group membership...')
        const isMemberResult = await Group.isMember(id, req.user.id_nguoi_dung);
        isMember = isMemberResult
      }
      
      console.log('Group membership check result:', isMember)
      
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không phải thành viên của nhóm này'
        });
      }

      const count = await Group.getMemberCount(id);

      res.json({
        success: true,
        message: 'Lấy số lượng thành viên thành công',
        data: { count }
      });
    } catch (error) {
      console.error('Lỗi lấy số lượng thành viên:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy số lượng thành viên'
      });
    }
  }

  // Lấy giao dịch trong nhóm
  static async getGroupTransactions(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra người dùng có trong nhóm không
      console.log('Checking if user is member of group...')
      console.log('User is admin:', req.user.la_admin)
      
      let isMember = false
      if (req.user.la_admin === 1 || req.user.la_admin === true) {
        // Admin có thể xem giao dịch của mọi nhóm
        console.log('User is admin, bypassing group membership check')
        isMember = true
      } else {
        // User thường phải kiểm tra thành viên nhóm
        console.log('User is not admin, checking group membership...')
        const isMemberResult = await Group.isMember(id, req.user.id_nguoi_dung);
        isMember = isMemberResult
      }
      
      console.log('Group membership check result:', isMember)
      
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không phải thành viên của nhóm này'
        });
      }

      const transactions = await Transaction.getByGroup(id);

      res.json({
        success: true,
        message: 'Lấy giao dịch trong nhóm thành công',
        data: transactions
      });
    } catch (error) {
      console.error('Lỗi lấy giao dịch trong nhóm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy giao dịch trong nhóm'
      });
    }
  }

  // Lấy lịch xe trong nhóm
  static async getGroupSchedules(req, res) {
    try {
      const { id } = req.params;

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
        const isMemberResult = await Group.isMember(id, req.user.id_nguoi_dung);
        isMember = isMemberResult
      }
      
      console.log('Group membership check result:', isMember)
      
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không phải thành viên của nhóm này'
        });
      }

      const schedules = await VehicleSchedule.getByGroup(id);

      res.json({
        success: true,
        message: 'Lấy lịch xe trong nhóm thành công',
        data: schedules
      });
    } catch (error) {
      console.error('Lỗi lấy lịch xe trong nhóm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch xe trong nhóm'
      });
    }
  }
}

module.exports = GroupController;
