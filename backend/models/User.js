const { pool } = require('../config/database');

class User {
  // Lấy tất cả người dùng
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id_nguoi_dung, ten_dang_nhap, email, ho_ten, so_dien_thoai, dia_chi, so_du, diem, la_admin, ngay_tao FROM nguoi_dung ORDER BY ngay_tao DESC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách người dùng: ${error.message}`);
    }
  }

  // Lấy người dùng theo ID
  static async getById(id) {
    try {
      console.log('User.getById - Called with ID:', id)
      console.log('User.getById - ID type:', typeof id)
      
      const [rows] = await pool.execute(
        'SELECT id_nguoi_dung, ten_dang_nhap, email, ho_ten, so_dien_thoai, dia_chi, so_du, diem, la_admin, ngay_tao FROM nguoi_dung WHERE id_nguoi_dung = ?',
        [id]
      );
      
      console.log('User.getById - Database result:', rows)
      console.log('User.getById - Returning:', rows[0] || null)
      
      return rows[0] || null;
    } catch (error) {
      console.error('User.getById - Database error:', error)
      throw new Error(`Lỗi lấy thông tin người dùng: ${error.message}`);
    }
  }

  // Lấy người dùng theo tên đăng nhập
  static async getByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM nguoi_dung WHERE ten_dang_nhap = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin người dùng: ${error.message}`);
    }
  }

  // Lấy người dùng theo email
  static async getByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM nguoi_dung WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin người dùng: ${error.message}`);
    }
  }

  // Tạo người dùng mới
  static async create(userData) {
    try {
      const { ten_dang_nhap, mat_khau_hash, email, ho_ten, so_dien_thoai, dia_chi } = userData;
      const [result] = await pool.execute(
        'INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, email, ho_ten, so_dien_thoai, dia_chi) VALUES (?, ?, ?, ?, ?, ?)',
        [ten_dang_nhap, mat_khau_hash, email, ho_ten, so_dien_thoai, dia_chi]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Lỗi tạo người dùng: ${error.message}`);
    }
  }

  // Cập nhật thông tin người dùng
  static async update(id, userData) {
    try {
      console.log('User.update - Updating user ID:', id);
      console.log('User.update - User data:', userData);
      
      // Xây dựng câu lệnh UPDATE động dựa trên các field có giá trị
      const updateFields = [];
      const updateValues = [];
      
      if (userData.ho_ten !== undefined) {
        updateFields.push('ho_ten = ?');
        updateValues.push(userData.ho_ten);
      }
      
      if (userData.so_dien_thoai !== undefined) {
        updateFields.push('so_dien_thoai = ?');
        updateValues.push(userData.so_dien_thoai);
      }
      
      if (userData.dia_chi !== undefined) {
        updateFields.push('dia_chi = ?');
        updateValues.push(userData.dia_chi);
      }
      
      // Nếu không có field nào để cập nhật
      if (updateFields.length === 0) {
        console.log('User.update - No fields to update');
        return true; // Không cần cập nhật gì
      }
      
      // Thêm ID vào cuối mảng values
      updateValues.push(id);
      
      const updateQuery = `UPDATE nguoi_dung SET ${updateFields.join(', ')} WHERE id_nguoi_dung = ?`;
      console.log('User.update - Update query:', updateQuery);
      console.log('User.update - Update values:', updateValues);
      
      const [result] = await pool.execute(updateQuery, updateValues);
      
      const success = result.affectedRows > 0;
      console.log('User.update - Update result:', success);
      console.log('User.update - Affected rows:', result.affectedRows);
      
      if (success) {
        console.log('✅ Cập nhật thông tin người dùng thành công cho user ID:', id);
      } else {
        console.log('⚠️ Không có dòng nào được cập nhật cho user ID:', id);
      }
      
      return success;
    } catch (error) {
      console.error('User.update - Error:', error);
      throw new Error(`Lỗi cập nhật người dùng: ${error.message}`);
    }
  }

  // Cập nhật mật khẩu
  static async updatePassword(id, newPasswordHash) {
    try {
      const [result] = await pool.execute(
        'UPDATE nguoi_dung SET mat_khau_hash = ? WHERE id_nguoi_dung = ?',
        [newPasswordHash, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi cập nhật mật khẩu: ${error.message}`);
    }
  }

  // Cập nhật số dư và điểm
  static async updateBalanceAndPoints(id, so_du, diem) {
    try {
      console.log('User.updateBalanceAndPoints - Updating user ID:', id)
      console.log('User.updateBalanceAndPoints - New balance:', so_du, 'Type:', typeof so_du)
      console.log('User.updateBalanceAndPoints - New points:', diem, 'Type:', typeof diem)
      
      // Kiểm tra dữ liệu đầu vào
      if (so_du === null || so_du === undefined) {
        throw new Error('Số dư không được để trống')
      }
      if (diem === null || diem === undefined) {
        throw new Error('Số điểm không được để trống')
      }
      
      // Chuyển đổi sang số nếu cần
      const numericBalance = parseFloat(so_du)
      const numericPoints = parseFloat(diem)
      
      if (isNaN(numericBalance)) {
        throw new Error('Số dư phải là số hợp lệ')
      }
      if (isNaN(numericPoints)) {
        throw new Error('Số điểm phải là số hợp lệ')
      }
      
      console.log('User.updateBalanceAndPoints - Numeric balance:', numericBalance)
      console.log('User.updateBalanceAndPoints - Numeric points:', numericPoints)
      
      // Thực hiện cập nhật
      const [result] = await pool.execute(
        'UPDATE nguoi_dung SET so_du = ?, diem = ? WHERE id_nguoi_dung = ?',
        [numericBalance, numericPoints, id]
      );
      
      const success = result.affectedRows > 0
      console.log('User.updateBalanceAndPoints - Update result:', success)
      console.log('User.updateBalanceAndPoints - Affected rows:', result.affectedRows)
      
      if (success) {
        console.log('✅ Cập nhật số dư và điểm thành công cho user ID:', id)
        console.log('✅ Số dư mới:', numericBalance, 'Số điểm mới:', numericPoints)
      } else {
        console.log('⚠️ Không có dòng nào được cập nhật cho user ID:', id)
      }
      
      return success
    } catch (error) {
      console.error('User.updateBalanceAndPoints - Error:', error)
      throw new Error(`Lỗi cập nhật số dư và điểm: ${error.message}`);
    }
  }

  // Cập nhật chỉ số dư
  static async updateBalance(id, so_du) {
    try {
      console.log('User.updateBalance - Updating balance for user ID:', id)
      console.log('User.updateBalance - New balance:', so_du, 'Type:', typeof so_du)
      
      // Kiểm tra dữ liệu đầu vào
      if (so_du === null || so_du === undefined) {
        throw new Error('Số dư không được để trống')
      }
      
      // Chuyển đổi sang số nếu cần
      const numericBalance = parseFloat(so_du)
      
      if (isNaN(numericBalance)) {
        throw new Error('Số dư phải là số hợp lệ')
      }
      
      console.log('User.updateBalance - Numeric balance:', numericBalance)
      
      // Thực hiện cập nhật
      const [result] = await pool.execute(
        'UPDATE nguoi_dung SET so_du = ? WHERE id_nguoi_dung = ?',
        [numericBalance, id]
      );
      
      const success = result.affectedRows > 0
      console.log('User.updateBalance - Update result:', success)
      console.log('User.updateBalance - Affected rows:', result.affectedRows)
      
      if (success) {
        console.log('✅ Cập nhật số dư thành công cho user ID:', id)
        console.log('✅ Số dư mới:', numericBalance)
      } else {
        console.log('⚠️ Không có dòng nào được cập nhật cho user ID:', id)
      }
      
      return success
    } catch (error) {
      console.error('User.updateBalance - Error:', error)
      throw new Error(`Lỗi cập nhật số dư: ${error.message}`);
    }
  }

  // Cập nhật chỉ số điểm
  static async updatePoints(id, diem) {
    try {
      console.log('User.updatePoints - Updating points for user ID:', id)
      console.log('User.updatePoints - New points:', diem, 'Type:', typeof diem)
      
      // Kiểm tra dữ liệu đầu vào
      if (diem === null || diem === undefined) {
        throw new Error('Số điểm không được để trống')
      }
      
      // Chuyển đổi sang số nếu cần
      const numericPoints = parseFloat(diem)
      
      if (isNaN(numericPoints)) {
        throw new Error('Số điểm phải là số hợp lệ')
      }
      
      console.log('User.updatePoints - Numeric points:', numericPoints)
      
      // Thực hiện cập nhật
      const [result] = await pool.execute(
        'UPDATE nguoi_dung SET diem = ? WHERE id_nguoi_dung = ?',
        [numericPoints, id]
      );
      
      const success = result.affectedRows > 0
      console.log('User.updatePoints - Update result:', success)
      console.log('User.updatePoints - Affected rows:', result.affectedRows)
      
      if (success) {
        console.log('✅ Cập nhật số điểm thành công cho user ID:', id)
        console.log('✅ Số điểm mới:', numericPoints)
      } else {
        console.log('⚠️ Không có dòng nào được cập nhật cho user ID:', id)
      }
      
      return success
    } catch (error) {
      console.error('User.updatePoints - Error:', error)
      throw new Error(`Lỗi cập nhật số điểm: ${error.message}`);
    }
  }

  // Xóa người dùng
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM nguoi_dung WHERE id_nguoi_dung = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Lỗi xóa người dùng: ${error.message}`);
    }
  }

  // Lấy danh sách nhóm của người dùng
  static async getGroups(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT n.* FROM nhom n 
         INNER JOIN thanh_vien_nhom tvn ON n.id_nhom = tvn.id_nhom 
         WHERE tvn.id_nguoi_dung = ?`,
        [id]
      );
      return rows;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách nhóm: ${error.message}`);
    }
  }
}

module.exports = User;
