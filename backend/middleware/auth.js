const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware xác thực JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token xác thực không được cung cấp'
      });
    }

    // Xác thực token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Lấy thông tin người dùng từ database
    const user = await User.getById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc người dùng không tồn tại'
      });
    }

    // Thêm thông tin người dùng vào request
    req.user = {
      id: user.id_nguoi_dung,
      username: user.ten_dang_nhap,
      isAdmin: user.la_admin,
      email: user.email,
      ho_ten: user.ho_ten
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn'
      });
    } else {
      console.error('Lỗi xác thực token:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi xác thực'
      });
    }
  }
};

// Middleware kiểm tra quyền admin
const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Chỉ admin mới có quyền truy cập'
    });
  }
  next();
};

// Middleware kiểm tra quyền thành viên nhóm
const requireGroupMember = async (req, res, next) => {
  try {
    const { id: groupId } = req.params;
    const { Group } = require('../models');
    
    const isMember = await Group.isMember(groupId, req.user.id);
    if (!isMember && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không phải thành viên của nhóm này'
      });
    }
    
    next();
  } catch (error) {
    console.error('Lỗi kiểm tra thành viên nhóm:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi kiểm tra quyền'
    });
  }
};

// Middleware kiểm tra quyền sở hữu (chỉ người tạo hoặc admin)
const requireOwnership = async (req, res, next) => {
  try {
    const { id: resourceId } = req.params;
    const resourceType = req.resourceType; // Được set từ route

    let resource;
    switch (resourceType) {
      case 'schedule':
        const { VehicleSchedule } = require('../models');
        resource = await VehicleSchedule.getById(resourceId);
        break;
      case 'transaction':
        const { Transaction } = require('../models');
        resource = await Transaction.getById(resourceId);
        break;
      default:
        return res.status(500).json({
          success: false,
          message: 'Loại tài nguyên không được hỗ trợ'
        });
    }

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài nguyên'
      });
    }

    // Kiểm tra quyền: chỉ người tạo hoặc admin mới được truy cập
    if (req.user.id !== resource.id_nguoi_tao && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập tài nguyên này'
      });
    }

    next();
  } catch (error) {
    console.error('Lỗi kiểm tra quyền sở hữu:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi kiểm tra quyền'
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireGroupMember,
  requireOwnership
};
