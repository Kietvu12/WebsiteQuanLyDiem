const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Group, Transaction, VehicleSchedule } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

class UserController {
  // Đăng nhập
  static async login(req, res) {
    try {
      const { ten_dang_nhap, mat_khau } = req.body;

      if (!ten_dang_nhap || !mat_khau) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập tên đăng nhập và mật khẩu'
        });
      }

      // Tìm người dùng theo tên đăng nhập
      const user = await User.getByUsername(ten_dang_nhap);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không đúng'
        });
      }

      // Kiểm tra mật khẩu
      const isValidPassword = await bcrypt.compare(mat_khau, user.mat_khau_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không đúng'
        });
      }

      // Tạo JWT token - sử dụng field names khớp với API response
      console.log('🔍 JWT Debug - user.la_admin from DB:', user.la_admin, 'type:', typeof user.la_admin);
      
      const token = jwt.sign(
        {
          id_nguoi_dung: user.id_nguoi_dung,
          ten_dang_nhap: user.ten_dang_nhap,
          la_admin: user.la_admin
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      console.log('🔍 JWT Debug - JWT payload created with la_admin:', user.la_admin);

      // Trả về thông tin người dùng (không bao gồm mật khẩu)
      const { mat_khau_hash, ...userInfo } = user;

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          user: userInfo,
          token
        }
      });
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng nhập'
      });
    }
  }

  // Lấy tất cả người dùng (chỉ admin)
  static async getAllUsers(req, res) {
    try {
      // Kiểm tra quyền admin
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền xem danh sách tất cả người dùng'
        });
      }
      
      const users = await User.getAll();
      res.json({
        success: true,
        message: 'Lấy danh sách người dùng thành công',
        data: users
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách người dùng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách người dùng'
      });
    }
  }

  // Lấy thông tin người dùng theo ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      // Kiểm tra quyền: chỉ admin hoặc chính người dùng đó mới được xem
      const userId = parseInt(id);
      const isOwnUser = req.user.id_nguoi_dung === userId;
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (!isOwnUser && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xem thông tin người dùng khác'
        });
      }
      
      const user = await User.getById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      res.json({
        success: true,
        message: 'Lấy thông tin người dùng thành công',
        data: user
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin người dùng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin người dùng'
      });
    }
  }

  // Lấy thông tin cá nhân của người dùng hiện tại
  static async getProfile(req, res) {
    try {
      const userId = req.user.id_nguoi_dung;
      console.log('getProfile - userId from JWT:', userId);
      console.log('getProfile - req.user:', req.user);
      
      const user = await User.getById(userId);
      console.log('getProfile - user from DB:', user);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      // Thêm headers để tránh cache
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.json({
        success: true,
        message: 'Lấy thông tin cá nhân thành công',
        data: {
          user: user
        }
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin cá nhân:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin cá nhân'
      });
    }
  }

  // Tạo người dùng mới (chỉ admin)
  static async createUser(req, res) {
    try {
      // Kiểm tra quyền admin
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền tạo người dùng mới'
        });
      }
      
      const { ten_dang_nhap, mat_khau, email, ho_ten, so_dien_thoai, dia_chi } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!ten_dang_nhap || !mat_khau || !email || !ho_ten) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
        });
      }

      // Kiểm tra tên đăng nhập đã tồn tại
      const existingUser = await User.getByUsername(ten_dang_nhap);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Tên đăng nhập đã tồn tại'
        });
      }

      // Kiểm tra email đã tồn tại
      const existingEmail = await User.getByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email đã tồn tại'
        });
      }

      // Hash mật khẩu
      const saltRounds = 10;
      const mat_khau_hash = await bcrypt.hash(mat_khau, saltRounds);

      // Tạo người dùng mới
      const userId = await User.create({
        ten_dang_nhap,
        mat_khau_hash,
        email,
        ho_ten,
        so_dien_thoai,
        dia_chi
      });

      res.status(201).json({
        success: true,
        message: 'Tạo người dùng thành công',
        data: { id: userId }
      });
    } catch (error) {
      console.error('Lỗi tạo người dùng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo người dùng'
      });
    }
  }

  // Cập nhật thông tin người dùng
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { ho_ten, so_dien_thoai, dia_chi, so_du, diem } = req.body;

      // Kiểm tra quyền: chỉ admin hoặc chính người dùng đó mới được cập nhật
      const userId = parseInt(id);
      const isOwnUser = req.user.id_nguoi_dung === userId;
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (!isOwnUser && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền cập nhật thông tin người dùng này'
        });
      }

      // Nếu cập nhật số dư hoặc điểm, chỉ admin mới được làm
      if ((so_du !== undefined || diem !== undefined) && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền cập nhật số dư và điểm'
        });
      }

      // Cập nhật thông tin cơ bản
      if (ho_ten || so_dien_thoai || dia_chi) {
        const basicData = {};
        if (ho_ten !== undefined) basicData.ho_ten = ho_ten;
        if (so_dien_thoai !== undefined) basicData.so_dien_thoai = so_dien_thoai;
        if (dia_chi !== undefined) basicData.dia_chi = dia_chi;

        const success = await User.update(id, basicData);
        if (!success) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy người dùng để cập nhật'
          });
        }
      }

      // Cập nhật số dư và điểm (chỉ admin)
      if (req.user.la_admin && (so_du !== undefined || diem !== undefined)) {
        if (so_du !== undefined && diem !== undefined) {
          // Cập nhật cả số dư và điểm
          const success = await User.updateBalanceAndPoints(id, so_du, diem);
          if (!success) {
            return res.status(500).json({
              success: false,
              message: 'Lỗi khi cập nhật số dư và điểm'
            });
          }
        } else if (so_du !== undefined) {
          // Chỉ cập nhật số dư
          const success = await User.updateBalance(id, so_du);
          if (!success) {
            return res.status(500).json({
              success: false,
              message: 'Lỗi khi cập nhật số dư'
            });
          }
        } else if (diem !== undefined) {
          // Chỉ cập nhật điểm
          const success = await User.updatePoints(id, diem);
          if (!success) {
            return res.status(500).json({
              success: false,
              message: 'Lỗi khi cập nhật điểm'
            });
          }
        }
      }

      res.json({
        success: true,
        message: 'Cập nhật thông tin người dùng thành công'
      });
    } catch (error) {
      console.error('Lỗi cập nhật người dùng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật người dùng'
      });
    }
  }

  // Cập nhật mật khẩu
  static async updatePassword(req, res) {
    try {
      const { id } = req.params;
      const { mat_khau_cu, mat_khau_moi } = req.body;

      // Kiểm tra quyền: chỉ chính người dùng đó mới được đổi mật khẩu
      const userId = parseInt(id);
      const isOwnUser = req.user.id_nguoi_dung === userId;
      
      if (!isOwnUser) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền đổi mật khẩu của người dùng khác'
        });
      }

      // Lấy thông tin người dùng hiện tại
      const user = await User.getById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      // Kiểm tra mật khẩu cũ
      const isValidOldPassword = await bcrypt.compare(mat_khau_cu, user.mat_khau_hash);
      if (!isValidOldPassword) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu cũ không đúng'
        });
      }

      // Hash mật khẩu mới
      const saltRounds = 10;
      const mat_khau_hash = await bcrypt.hash(mat_khau_moi, saltRounds);

      // Cập nhật mật khẩu
      const success = await User.updatePassword(id, mat_khau_hash);

      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi cập nhật mật khẩu'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật mật khẩu thành công'
      });
    } catch (error) {
      console.error('Lỗi cập nhật mật khẩu:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật mật khẩu'
      });
    }
  }

  // Xóa người dùng (chỉ admin)
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra quyền admin
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ admin mới có quyền xóa người dùng'
        });
      }

      // Không cho phép xóa chính mình
      if (req.user.id_nguoi_dung === parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa chính mình'
        });
      }

      const success = await User.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa người dùng thành công'
      });
    } catch (error) {
      console.error('Lỗi xóa người dùng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa người dùng'
      });
    }
  }

  // Lấy danh sách nhóm của người dùng
  static async getUserGroups(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra quyền: chỉ admin hoặc chính người dùng đó mới được xem
      const userId = parseInt(id);
      const isOwnUser = req.user.id_nguoi_dung === userId;
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (!isOwnUser && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xem nhóm của người dùng khác'
        });
      }

      const groups = await User.getGroups(id);

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

  // Lấy lịch sử giao dịch của người dùng
  static async getUserTransactions(req, res) {
    try {
      console.log('🚀 === getUserTransactions CALLED ===');
      console.log('🚀 Request method:', req.method);
      console.log('🚀 Request URL:', req.url);
      console.log('🚀 Request params:', req.params);
      console.log('🚀 Request user:', req.user);
      
      const { id } = req.params;
      
      console.log('=== getUserTransactions Debug ===');
      console.log('Request user:', req.user);
      console.log('URL param id:', id);
      console.log('req.user.id_nguoi_dung:', req.user.id_nguoi_dung, 'type:', typeof req.user.id_nguoi_dung);
      console.log('req.user.la_admin:', req.user.la_admin, 'type:', typeof req.user.la_admin);
      console.log('parseInt(id):', parseInt(id), 'type:', typeof parseInt(id));

      // Kiểm tra quyền: chỉ admin hoặc chính người dùng đó mới được xem
      const userId = parseInt(id);
      const isOwnUser = req.user.id_nguoi_dung === userId;
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      console.log('userId:', userId);
      console.log('req.user.id_nguoi_dung:', req.user.id_nguoi_dung);   
      console.log('isOwnUser:', isOwnUser);
      console.log('isAdmin:', isAdmin);
      console.log('Final check:', !isOwnUser && !isAdmin);
      console.log('🔍 Backend Debug - req.user.la_admin:', req.user.la_admin, 'type:', typeof req.user.la_admin);
      console.log('🔍 Backend Debug - req.user.la_admin === 1:', req.user.la_admin === 1);
      console.log('🔍 Backend Debug - req.user.la_admin === true:', req.user.la_admin === true);
      console.log('🔍 Backend Debug - req.user.la_admin == 1:', req.user.la_admin == 1);
      console.log('🔍 Backend Debug - req.user.la_admin == true:', req.user.la_admin == true);
      console.log('🔍 Backend Debug - !!req.user.la_admin:', !!req.user.la_admin);
      
      if (!isOwnUser && !isAdmin) {
        console.log('❌ Access denied - not own user and not admin');
        console.log('❌ Final check result:', !isOwnUser && !isAdmin);
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xem giao dịch của người dùng khác'
        });
      }
      
      console.log('✅ Access granted');
      console.log('✅ Proceeding to fetch transactions...');

      console.log('✅ Fetching transactions for user ID:', id);
      const transactions = await Transaction.getBySender(id);
      console.log('✅ Sender transactions count:', transactions.length);
      
      const receivedTransactions = await Transaction.getByReceiver(id);
      console.log('✅ Receiver transactions count:', receivedTransactions.length);

      // Gộp và sắp xếp theo thời gian
      const allTransactions = [...transactions, ...receivedTransactions]
        .sort((a, b) => new Date(b.ngay_tao) - new Date(a.ngay_tao));
      
      console.log('✅ Total transactions:', allTransactions.length);
      console.log('✅ Sending response...');

      res.json({
        success: true,
        message: 'Lấy lịch sử giao dịch thành công',
        data: allTransactions
      });
    } catch (error) {
      console.error('❌ Lỗi lấy lịch sử giao dịch:', error);
      console.error('❌ Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch sử giao dịch'
      });
    }
  }

  // Lấy lịch xe của người dùng
  static async getUserSchedules(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra quyền: chỉ admin hoặc chính người dùng đó mới được xem
      const userId = parseInt(id);
      const isOwnUser = req.user.id_nguoi_dung === userId;
      const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;
      
      if (!isOwnUser && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xem lịch xe của người dùng khác'
        });
      }

      const schedules = await VehicleSchedule.getByCreator(id);

      res.json({
        success: true,
        message: 'Lấy lịch xe thành công',
        data: schedules
      });
    } catch (error) {
      console.error('Lỗi lấy lịch xe:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch xe'
      });
    }
  }
}

module.exports = UserController;
