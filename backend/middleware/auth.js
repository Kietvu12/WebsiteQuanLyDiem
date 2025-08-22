const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
console.log('JWT_SECRET loaded:', JWT_SECRET ? 'Yes' : 'No')
console.log('JWT_SECRET length:', JWT_SECRET ? JWT_SECRET.length : 0)

// Middleware xác thực JWT
const authenticateToken = async (req, res, next) => {
  try {
    console.log('=== Authentication Middleware ===')
    console.log('Request URL:', req.url)
    console.log('Request method:', req.method)
    console.log('Request headers:', req.headers)
    
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader)
    
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('Extracted token:', token)

    if (!token) {
      console.log('No token provided')
      return res.status(401).json({
        success: false,
        message: 'Token xác thực không được cung cấp'
      });
    }

    // Xác thực token
    console.log('Verifying JWT token...')
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('JWT decoded:', decoded); // Debug log
    console.log('🔍 JWT Debug - decoded.la_admin:', decoded.la_admin, 'type:', typeof decoded.la_admin);
    
    // Lấy thông tin người dùng từ database
    console.log('Fetching user from database with ID:', decoded.id_nguoi_dung)
    const user = await User.getById(decoded.id_nguoi_dung);
    console.log('User from database:', user)
    
    if (!user) {
      console.log('User not found in database')
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc người dùng không tồn tại'
      });
    }

    // Thêm thông tin người dùng vào request - sử dụng field names khớp với JWT
    req.user = {
      id_nguoi_dung: user.id_nguoi_dung,
      ten_dang_nhap: user.ten_dang_nhap,
      la_admin: user.la_admin,
      email: user.email,
      ho_ten: user.ho_ten
    };
    
    console.log('Request user set:', req.user)
    console.log('=== Authentication Successful ===')
    console.log('=== MIDDLEWARE: About to call next() ===')
    next();
  } catch (error) {
    console.error('=== Authentication Error ===')
    console.error('Error details:', error)
    
    if (error.name === 'JsonWebTokenError') {
      console.log('JWT verification failed')
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    } else if (error.name === 'TokenExpiredError') {
      console.log('JWT token expired')
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
  if (!req.user.la_admin) {
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
    
    const isMember = await Group.isMember(groupId, req.user.id_nguoi_dung);
    if (!isMember && !req.user.la_admin) {
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
    if (req.user.id_nguoi_dung !== resource.id_nguoi_tao && !req.user.la_admin) {
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
