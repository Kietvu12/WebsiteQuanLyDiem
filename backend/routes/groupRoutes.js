const express = require('express');
const GroupController = require('../controllers/groupController');
const { authenticateToken, requireAdmin, requireGroupMember } = require('../middleware/auth');

const router = express.Router();

// Tất cả routes đều cần xác thực
router.use(authenticateToken);

// Lấy tất cả nhóm
router.get('/', GroupController.getAllGroups);

// Lấy thông tin nhóm theo ID
router.get('/:id', requireGroupMember, GroupController.getGroupById);

// Lấy danh sách thành viên trong nhóm
router.get('/:id/members', requireGroupMember, GroupController.getGroupMembers);

// Lấy số lượng thành viên trong nhóm
router.get('/:id/member-count', requireGroupMember, GroupController.getGroupMemberCount);

// Lấy giao dịch trong nhóm
router.get('/:id/transactions', requireGroupMember, GroupController.getGroupTransactions);

// Lấy lịch xe trong nhóm
router.get('/:id/schedules', requireGroupMember, GroupController.getGroupSchedules);

// Routes chỉ dành cho admin
router.use(requireAdmin);

// Tạo nhóm mới
router.post('/', GroupController.createGroup);

// Cập nhật thông tin nhóm
router.put('/:id', GroupController.updateGroup);

// Xóa nhóm
router.delete('/:id', GroupController.deleteGroup);

// Thêm người dùng vào nhóm
router.post('/add-member', GroupController.addMemberToGroup);

// Xóa người dùng khỏi nhóm
router.post('/remove-member', GroupController.removeMemberFromGroup);

module.exports = router;
