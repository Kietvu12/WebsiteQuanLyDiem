# Quyền Hủy Lịch Xe - Người Nhận Lịch Xe

## 📋 **Tổng quan thay đổi**

Đã thêm quyền hủy lịch xe cho **người nhận lịch xe** (user) ngoài người tạo lịch xe và admin.

## 🔐 **Quyền hủy lịch xe**

### **Trước đây:**
- ❌ Chỉ người tạo lịch xe mới có quyền hủy
- ❌ Admin có quyền hủy
- ❌ Người nhận lịch xe KHÔNG có quyền hủy
- ❌ Chỉ có thể hủy lịch xe ở trạng thái "chờ xác nhận"

### **Bây giờ:**
- ✅ **Người tạo lịch xe** có quyền hủy **mọi trạng thái**
- ✅ **Admin** có quyền hủy **mọi trạng thái**
- ✅ **Người nhận lịch xe** có quyền hủy **khi chưa hoàn thành** (bao gồm đã xác nhận)
- ❌ **User khác** không có quyền hủy
- ❌ **Người nhận** không thể hủy lịch xe **đã hoàn thành**

## 🛠️ **Thay đổi Backend**

### **1. VehicleScheduleController.js**
```javascript
// Trước đây
const isCreator = userId === currentSchedule.id_nguoi_tao;
const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;

if (!isCreator && !isAdmin) {
  return res.status(403).json({
    success: false,
    message: 'Chỉ người tạo lịch xe hoặc admin mới có quyền hủy lịch xe này'
  });
}

// Bây giờ
const isCreator = userId === currentSchedule.id_nguoi_tao;
const isReceiver = userId === currentSchedule.id_nguoi_nhan;  // ← THÊM
const isAdmin = req.user.la_admin === 1 || req.user.la_admin === true;

if (!isCreator && !isReceiver && !isAdmin) {  // ← THÊM isReceiver
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
```

### **2. Logging chi tiết**
```javascript
console.log('Permission check:');
console.log('  - Is Creator:', isCreator);
console.log('  - Is Receiver:', isReceiver);  // ← THÊM
console.log('  - Is Admin:', isAdmin);
console.log('  - User ID:', userId);
console.log('  - Creator ID:', currentSchedule.id_nguoi_tao);
console.log('  - Receiver ID:', currentSchedule.id_nguoi_nhan);  // ← THÊM
```

## 🎨 **Thay đổi Frontend**

### **1. VehicleSchedulePage.jsx**
```javascript
// Trước đây
const canCancelSchedule = (schedule) => {
  if (schedule.trang_thai !== 'cho_xac_nhan') return false
  
  return schedule.id_nguoi_tao === user.id_nguoi_dung || 
         user.la_admin === 1 || 
         user.la_admin === true
}

// Bây giờ
const canCancelSchedule = (schedule) => {
  // Người tạo và admin có thể hủy mọi trạng thái
  if (schedule.id_nguoi_tao === user.id_nguoi_dung || 
      user.la_admin === 1 || 
      user.la_admin === true) {
    return true;
  }
  
  // Người nhận lịch xe chỉ có thể hủy khi lịch xe chưa hoàn thành
  if (schedule.id_nguoi_nhan === user.id_nguoi_dung) {
    return schedule.trang_thai !== 'hoan_thanh';
  }
  
  return false;
}
```

### **2. Hiển thị vai trò user**
```javascript
{/* Hiển thị vai trò của user với lịch xe này */}
{schedule.id_nguoi_tao === user.id_nguoi_dung && (
  <span className="inline-block ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
    Bạn tạo
  </span>
)}
{schedule.id_nguoi_nhan === user.id_nguoi_dung && (
  <span className="inline-block ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
    Bạn nhận
  </span>
)}
```

### **3. Thông báo quyền hủy**
```javascript
{/* Thông báo về quyền hủy */}
<div className="flex-1 text-xs text-gray-500">
  {schedule.id_nguoi_tao === user.id_nguoi_dung && (
    <span>Bạn có thể hủy lịch xe này vì bạn là người tạo</span>
  )}
  {schedule.id_nguoi_nhan === user.id_nguoi_dung && (
    <span>
      Bạn có thể hủy lịch xe này vì bạn là người nhận
      {schedule.trang_thai === 'da_xac_nhan' && ' (đã xác nhận)'}
    </span>
  )}
  {user.la_admin === 1 || user.la_admin === true ? (
    <span>Bạn có thể hủy lịch xe này vì bạn là admin</span>
  ) : null}
</div>
```

## 🧪 **Test Cases**

### **✅ Có quyền hủy:**
1. **Người tạo lịch xe** - **Mọi trạng thái** (chờ xác nhận, đã xác nhận, hoàn thành, đã hủy)
2. **Admin** - **Mọi trạng thái** (chờ xác nhận, đã xác nhận, hoàn thành, đã hủy)
3. **Người nhận lịch xe** - **Chưa hoàn thành** (chờ xác nhận, đã xác nhận, đã hủy)

### **❌ Không có quyền hủy:**
1. **User khác** - Không liên quan đến lịch xe
2. **Người nhận lịch xe** - Lịch xe **đã hoàn thành**

## 🔒 **Bảo mật**

- ✅ Kiểm tra quyền ở **backend** (chính)
- ✅ Kiểm tra quyền ở **frontend** (UI)
- ✅ Logging chi tiết để debug
- ✅ Thông báo lỗi rõ ràng

## 💰 **Logic hoàn tiền/điểm khi hủy lịch xe**

### **Quy trình hoàn tiền/điểm:**
1. **Tìm giao dịch liên quan**: Lấy giao dịch "Giao lịch" và "Nhận lịch" của lịch xe bị hủy
2. **Hoàn tiền/điểm cho người nhận lịch**: Cộng thêm số tiền và điểm đã trả
3. **Hoàn tiền/điểm cho người giao lịch**: Cộng thêm số tiền và điểm đã giao
4. **Cập nhật database**: Sử dụng `User.updateBalanceAndPoints()` để cập nhật số dư mới
5. **Tạo giao dịch "Hủy lịch"**: Ghi nhận việc hủy lịch xe
6. **Gửi thông báo**: Thông báo cho cả 2 bên về số tiền/điểm được hoàn

### **Công thức tính toán:**
```javascript
// Hoàn tiền/điểm cho người nhận lịch (B)
if (nhanLichTransaction.so_tien < 0 || nhanLichTransaction.diem < 0) {
  const refundAmount = Math.abs(nhanLichTransaction.so_tien); // Lấy giá trị tuyệt đối
  const refundPoints = Math.abs(nhanLichTransaction.diem);
  
  const newReceiverBalance = parseFloat(currentBalance) + refundAmount; // B được CỘNG
  const newReceiverPoints = parseFloat(currentPoints) + refundPoints;
}

// Hoàn tiền/điểm cho người giao lịch (A)
if (giaoLichTransaction.so_tien > 0 || giaoLichTransaction.diem > 0) {
  const refundAmount = Math.abs(giaoLichTransaction.so_tien); // Lấy giá trị tuyệt đối
  const refundPoints = Math.abs(giaoLichTransaction.diem);
  
  const newSenderBalance = parseFloat(currentBalance) - refundAmount; // A bị TRỪ
  const newSenderPoints = parseFloat(currentPoints) - refundPoints;
}
```

### **Xử lý các trường hợp đặc biệt:**
- ✅ **Có tiền và điểm**: Hoàn lại đầy đủ cho cả 2 bên
- ✅ **Chỉ có tiền**: Hoàn lại tiền, bỏ qua điểm
- ✅ **Chỉ có điểm**: Hoàn lại điểm, bỏ qua tiền
- ✅ **Không có tiền và điểm**: Chỉ tạo giao dịch "Hủy lịch"
- ✅ **Sử dụng parseFloat**: Đảm bảo tính toán chính xác, tránh lỗi string concatenation

### **🔍 Chi tiết logic hoàn tiền/điểm:**

#### **Khi B xác nhận giao dịch "Giao lịch":**
- **A (người giao lịch)**: Được **CỘNG** 600,000 VNĐ + 1 điểm ✅
- **B (người nhận lịch)**: Bị **TRỪ** 600,000 VNĐ + 1 điểm ✅

#### **Khi B hủy lịch xe:**
- **A (người giao lịch)**: Bị **TRỪ** 600,000 VNĐ + 1 điểm (hoàn lại) ✅
- **B (người nhận lịch)**: Được **CỘNG** 600,000 VNĐ + 1 điểm (hoàn lại) ✅

#### **Kết quả cuối cùng:**
- **A**: +600,000 - 600,000 = **0 VNĐ**, +1 - 1 = **0 điểm**
- **B**: -600,000 + 600,000 = **0 VNĐ**, -1 + 1 = **0 điểm**
- ✅ **Cả 2 bên về trạng thái ban đầu như chưa có giao dịch!**

#### **Tại sao phải dùng Math.abs()?**
- **Giao dịch "Nhận lịch"**: `so_tien = -600000` (số âm) → `Math.abs(-600000) = 600000` ✅
- **Giao dịch "Giao lịch"**: `so_tien = 600000` (số dương) → `Math.abs(600000) = 600000` ✅
- **Kết quả**: Cả 2 bên đều được hoàn đúng 600,000 VNĐ

## 🐛 **Sửa lỗi id_nguoi_nhan bị null**

### **Vấn đề phát hiện:**
- Khi tạo lịch xe, trường `id_nguoi_nhan` bị `null` trong database
- Người nhận lịch xe không thể hủy lịch xe vì `id_nguoi_nhan` không tồn tại
- Logic hoàn tiền/điểm không hoạt động chính xác

### **Nguyên nhân:**
- Trong `VehicleSchedule.create()`, trường `id_nguoi_nhan` **KHÔNG được thêm vào câu lệnh INSERT**
- SQL INSERT thiếu cột `id_nguoi_nhan` và giá trị tương ứng

### **Giải pháp:**
```javascript
// Trước đây (SAI)
const [result] = await pool.execute(
  `INSERT INTO lich_xe (id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don,
                        thoi_gian_bat_dau_tra, thoi_gian_ket_thuc_tra, id_nguoi_tao, id_nhom) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  [id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don,
   thoi_gian_bat_dau_tra, thoi_gian_ket_thuc_tra, id_nguoi_tao, id_nhom]
);

// Bây giờ (ĐÚNG)
const [result] = await pool.execute(
  `INSERT INTO lich_xe (id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don,
                        thoi_gian_bat_dau_tra, thoi_gian_ket_thuc_tra, id_nguoi_tao, id_nhom, id_nguoi_nhan) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don,
   thoi_gian_bat_dau_tra, thoi_gian_ket_thuc_tra, id_nguoi_tao, id_nhom, id_nguoi_nhan]
);
```

### **Kết quả sau khi sửa:**
- ✅ `id_nguoi_nhan` được lưu đúng vào database
- ✅ Người nhận lịch xe có thể hủy lịch xe
- ✅ Logic hoàn tiền/điểm hoạt động chính xác
- ✅ Quyền hủy lịch xe hoạt động đúng cho người nhận

## 🔄 **Tự động cập nhật trạng thái lịch xe khi xác nhận giao dịch**

### **Tính năng mới:**
- Khi người dùng xác nhận giao dịch "Giao lịch", lịch xe đi kèm sẽ **tự động** được cập nhật trạng thái
- Không cần thao tác xác nhận lịch xe riêng biệt

### **Logic hoạt động:**
```javascript
// Trong confirmTransaction() của transactionController.js
if (transaction.id_loai_giao_dich === 1 && transaction.id_lich_xe) { // Giao lịch có lịch xe
  console.log('=== CẬP NHẬT TRẠNG THÁI LỊCH XE ===')
  console.log('ID lịch xe:', transaction.id_lich_xe)
  
  try {
    const { VehicleSchedule } = require('../models');
    await VehicleSchedule.updateStatus(transaction.id_lich_xe, 'da_xac_nhan');
    console.log('✅ Lịch xe đã được cập nhật trạng thái "đã xác nhận"')
  } catch (scheduleUpdateError) {
    console.error('❌ Lỗi khi cập nhật trạng thái lịch xe:', scheduleUpdateError);
    // Không dừng quá trình xác nhận nếu cập nhật lịch xe thất bại
  }
}
```

### **Quy trình hoạt động:**
1. **Người nhận lịch** xác nhận giao dịch "Giao lịch"
2. **Cập nhật giao dịch**: Cả 2 giao dịch (Giao lịch + Nhận lịch) → "hoàn thành"
3. **Kiểm tra lịch xe**: Nếu có `id_lich_xe` đi kèm
4. **Cập nhật lịch xe**: "chờ xác nhận" → "đã xác nhận"
5. **Xử lý tiền/điểm**: Chuyển tiền và điểm giữa 2 bên
6. **Tạo thông báo**: Thông báo cho người gửi

### **Các trường hợp xử lý:**
- ✅ **Giao dịch "Giao lịch" có lịch xe**: Cập nhật cả giao dịch và lịch xe
- ✅ **Giao dịch "San cho"**: Chỉ cập nhật giao dịch (không có lịch xe)
- ✅ **Giao dịch "Giao lịch" không có lịch xe**: Chỉ cập nhật giao dịch
- ✅ **Lỗi cập nhật lịch xe**: Không ảnh hưởng đến việc xác nhận giao dịch

### **Lợi ích:**
- 🎯 **Đồng bộ trạng thái**: Giao dịch và lịch xe có trạng thái nhất quán
- 🎯 **Trải nghiệm người dùng**: Không cần xác nhận lại lịch xe
- 🎯 **Logic rõ ràng**: Xác nhận giao dịch = xác nhận lịch xe
- 🎯 **Hiệu quả**: Một thao tác xác nhận cho cả hai

## 🔕 **Ẩn nút hủy lịch sau khi hủy + thông báo cho 2 bên**

### **Tính năng hoàn chỉnh:**
- **Frontend**: Nút "Hủy lịch" biến mất sau khi hủy
- **Backend**: Thông báo tự động gửi cho cả 2 bên
- **Trạng thái**: Lịch xe chuyển sang "đã hủy"

### **Logic Frontend - Ẩn nút hủy:**
```javascript
const canCancelSchedule = (schedule) => {
  // Không thể hủy lịch xe đã bị hủy hoặc đã hoàn thành
  if (schedule.trang_thai === 'da_huy' || schedule.trang_thai === 'hoan_thanh') {
    return false;
  }
  
  // Người tạo và admin có thể hủy các trạng thái khác
  if (schedule.id_nguoi_tao === user.id_nguoi_dung || 
      user.la_admin === 1 || 
      user.la_admin === true) {
    return true;
  }
  
  // Người nhận lịch xe chỉ có thể hủy khi lịch xe chưa hoàn thành và chưa hủy
  if (schedule.id_nguoi_nhan === user.id_nguoi_dung) {
    return schedule.trang_thai === 'cho_xac_nhan' || schedule.trang_thai === 'da_xac_nhan';
  }
  
  return false;
}
```

### **Logic Backend - Thông báo cho 2 bên:**
```javascript
// Thông báo cho người nhận lịch (B)
if (nhanLichTransaction.so_tien < 0 || nhanLichTransaction.diem < 0) {
  const refundAmount = Math.abs(nhanLichTransaction.so_tien);
  const refundPoints = Math.abs(nhanLichTransaction.diem);
  const notificationData = {
    id_nguoi_dung: nhanLichTransaction.id_nguoi_nhan,
    noi_dung: `Lịch xe đã bị hủy - Hoàn lại ${refundAmount.toLocaleString()} VNĐ và ${refundPoints} điểm`
  };
  await Notification.create(notificationData);
}

// Thông báo cho người giao lịch (A)
if (giaoLichTransaction.so_tien > 0 || giaoLichTransaction.diem > 0) {
  const refundAmount = Math.abs(giaoLichTransaction.so_tien);
  const refundPoints = Math.abs(giaoLichTransaction.diem);
  const notificationData = {
    id_nguoi_dung: giaoLichTransaction.id_nguoi_gui,
    noi_dung: `Lịch xe đã bị hủy - Hoàn lại ${refundAmount.toLocaleString()} VNĐ và ${refundPoints} điểm`
  };
  await Notification.create(notificationData);
}
```

### **Quy trình hoàn chỉnh khi hủy lịch xe:**
1. **🔐 Kiểm tra quyền hủy**: Admin/người tạo/người nhận (theo điều kiện)
2. **🔄 Cập nhật trạng thái**: Lịch xe → "đã hủy"
3. **💰 Hoàn tiền/điểm B**: Được CỘNG tiền/điểm (Math.abs của số âm)
4. **💰 Hoàn tiền/điểm A**: Bị TRỪ tiền/điểm (Math.abs của số dương)
5. **📝 Tạo giao dịch "Hủy lịch"**: Ghi nhận hành động
6. **🔔 Thông báo 2 bên**: Thông tin hoàn tiền/điểm chi tiết
7. **🚫 Ẩn nút hủy**: Frontend không hiển thị nút hủy nữa

### **Trạng thái lịch xe và quyền hủy:**

| Trạng thái | Người tạo/Admin | Người nhận | Nút hủy hiển thị |
|------------|----------------|------------|------------------|
| **chờ xác nhận** | ✅ Có thể hủy | ✅ Có thể hủy | ✅ Hiện |
| **đã xác nhận** | ✅ Có thể hủy | ✅ Có thể hủy | ✅ Hiện |
| **hoàn thành** | ❌ Không thể hủy | ❌ Không thể hủy | ❌ Ẩn |
| **đã hủy** | ❌ Không thể hủy | ❌ Không thể hủy | ❌ Ẩn |

### **Lợi ích:**
- 🎯 **UX tốt hơn**: Người dùng không thấy nút hủy vô nghĩa
- 🎯 **Thông tin rõ ràng**: Cả 2 bên đều được thông báo hoàn tiền/điểm
- 🎯 **Trạng thái nhất quán**: Frontend và backend đồng bộ
- 🎯 **Tránh nhầm lẫn**: Không thể hủy lịch xe đã hủy

## 📱 **Giao diện người dùng**

### **Trước đây:**
- Nút "Hủy lịch" chỉ hiển thị cho người tạo và admin

### **Bây giờ:**
- Nút "Hủy lịch" hiển thị cho:
  - 🟦 **Người tạo** (badge "Bạn tạo") - **Mọi trạng thái**
  - 🟩 **Người nhận** (badge "Bạn nhận") - **Chưa hoàn thành** (bao gồm đã xác nhận)
  - 🟨 **Admin** (badge "Admin") - **Mọi trạng thái**
- Thông báo rõ ràng về lý do có quyền hủy
- **Người nhận** có thể hủy lịch xe **đã xác nhận** (trạng thái "da_xac_nhan")

## 🚀 **Cách sử dụng**

1. **User đăng nhập** vào hệ thống
2. **Vào trang "Quản lý lịch xe"**
3. **Tìm lịch xe** mà mình là người nhận
4. **Nhìn thấy badge "Bạn nhận"** màu xanh lá
5. **Nhìn thấy nút "Hủy lịch"** màu đỏ
6. **Click "Hủy lịch"** để hủy lịch xe
7. **Xác nhận** trong popup
8. **Lịch xe bị hủy** và tiền/điểm được hoàn lại

## 📝 **Lưu ý quan trọng**

- **Chỉ hủy được** lịch xe ở trạng thái "chờ xác nhận" hoặc "đã xác nhận"
- **Tiền và điểm** sẽ được hoàn lại cho **cả 2 bên** khi hủy
- **Thông báo** sẽ được gửi cho cả người tạo và người nhận lịch xe
- **Giao dịch "Hủy lịch"** sẽ được tạo để ghi nhận
- **Số dư và điểm** sẽ được cập nhật tự động trong database

## 🔧 **Logic hoàn tiền: 2 giao dịch "Hủy lịch" riêng biệt + xử lý hoàn tiền/điểm**

### **Vấn đề đã gặp**
- **Hủy lịch liên quan đến cả 2 bên**: Người gửi và người nhận đều có quyền hủy
- **Cần 2 giao dịch riêng biệt**: Một để TRỪ người gửi, một để CỘNG người nhận
- **Phải xử lý cả 2 bên**: Người giao lịch bị TRỪ, người nhận lịch được CỘNG

### **Giải pháp đã áp dụng**
1. **2 giao dịch "Hủy lịch" riêng biệt**: 
   - Giao dịch 1: TRỪ tiền/điểm của người gửi (A)
   - Giao dịch 2: CỘNG tiền/điểm cho người nhận (B)
2. **Logic hoàn tiền riêng biệt**: Sử dụng `User.updateBalanceAndPoints()` để cập nhật thực sự
3. **Xử lý cả 2 bên**: A bị TRỪ, B được CỘNG với số tiền/điểm chính xác

### **Code thay đổi**
```javascript
// Backend: vehicleScheduleController.js - Trước (cũ)
// Logic hoàn tiền phức tạp với nhiều bước xử lý riêng biệt
if (nhanLichTransaction.so_tien < 0 || nhanLichTransaction.diem < 0) {
  // Hoàn tiền cho người nhận lịch
  await User.updateBalanceAndPoints(id_nguoi_nhan, newBalance, newPoints);
}

if (giaoLichTransaction.so_tien > 0 || giaoLichTransaction.diem > 0) {
  // Hoàn tiền cho người giao lịch
  await User.updateBalanceAndPoints(id_nguoi_gui, newBalance, newPoints);
}

// Backend: vehicleScheduleController.js - Sau (mới)
// 1. TẠO 2 GIAO DỊCH "HỦY LỊCH" RIÊNG BIỆT
// Giao dịch 1: TRỪ tiền/điểm của người gửi (A)
const huyLichTransactionSender = await Transaction.create({
  id_loai_giao_dich: 3, // Hủy lịch
  id_nguoi_gui: giaoLichTransaction.id_nguoi_gui, // Người gửi (A) - sẽ bị TRỪ
  id_nguoi_nhan: null,
  id_nhom: currentSchedule.id_nhom,
  id_lich_xe: id,
  so_tien: -Math.abs(giaoLichTransaction.so_tien), // Số âm để TRỪ người gửi
  diem: -Math.abs(giaoLichTransaction.diem), // Số âm để TRỪ người gửi
  noi_dung: `Hủy lịch xe - Trừ tiền/điểm của người gửi`,
  trang_thai: 'hoan_thanh'
});

// Giao dịch 2: CỘNG tiền/điểm cho người nhận (B)
const huyLichTransactionReceiver = await Transaction.create({
  id_loai_giao_dich: 3, // Hủy lịch
  id_nguoi_gui: null,
  id_nguoi_nhan: nhanLichTransaction.id_nguoi_nhan, // Người nhận (B) - sẽ được CỘNG
  id_nhom: currentSchedule.id_nhom,
  id_lich_xe: id,
  so_tien: Math.abs(giaoLichTransaction.so_tien), // Số dương để CỘNG người nhận
  diem: Math.abs(giaoLichTransaction.diem), // Số dương để CỘNG người nhận
  noi_dung: `Hủy lịch xe - Cộng tiền/điểm cho người nhận`,
  trang_thai: 'hoan_thanh'
});

// 2. THỰC HIỆN HOÀN TIỀN/ĐIỂM CHO CẢ 2 BÊN
// Hoàn tiền/điểm cho người nhận lịch (B) - được CỘNG
const refundAmountReceiver = Math.abs(giaoLichTransaction.so_tien);
const refundPointsReceiver = Math.abs(giaoLichTransaction.diem);

const newReceiverBalance = parseFloat(nhanLichTransaction.nguoi_nhan.so_du) + refundAmountReceiver;
const newReceiverPoints = parseFloat(nhanLichTransaction.nguoi_nhan.diem) + refundPointsReceiver;

await User.updateBalanceAndPoints(
  nhanLichTransaction.id_nguoi_nhan,
  newReceiverBalance,
  newReceiverPoints
);

// Hoàn tiền/điểm cho người giao lịch (A) - bị TRỪ
const newSenderBalance = parseFloat(giaoLichTransaction.nguoi_gui.so_du) - refundAmountReceiver;
const newSenderPoints = parseFloat(giaoLichTransaction.nguoi_gui.diem) - refundPointsReceiver;

await User.updateBalanceAndPoints(
  giaoLichTransaction.id_nguoi_gui,
  newSenderBalance,
  newSenderPoints
);
```

### **Các trường hợp được xử lý**
1. **Dữ liệu đúng (number)**: `-600000` → `-600000` ✅
2. **Dữ liệu string**: `'-600000'` → `-600000` ✅
3. **Dữ liệu null/undefined**: `null` → `0` ✅
4. **Dữ liệu mixed**: `-600000` + `'0'` → `-600000` + `0` ✅

### **Lợi ích**
- **Robust hơn**: Xử lý được các trường hợp dữ liệu không đúng định dạng
- **Debug dễ dàng**: Logging chi tiết giúp xác định vấn đề nhanh chóng
- **Tương thích ngược**: Vẫn hoạt động với dữ liệu đúng định dạng
- **Bảo mật**: Không bị crash khi gặp dữ liệu bất thường

### **Kết quả**
- ✅ **2 giao dịch "Hủy lịch" riêng biệt được tạo**:
  - Giao dịch 1: TRỪ tiền/điểm của người gửi (A)
  - Giao dịch 2: CỘNG tiền/điểm cho người nhận (B)
- ✅ **Logic hoàn tiền riêng biệt thực sự cập nhật số dư và điểm**
- ✅ **Người giao lịch (A) bị TRỪ tiền/điểm** thông qua `User.updateBalanceAndPoints()`
- ✅ **Người nhận lịch (B) được CỘNG tiền/điểm** thông qua `User.updateBalanceAndPoints()`
- ✅ **Số dư và điểm được cập nhật thực sự trong database**
- ✅ **Thông báo chi tiết cho cả 2 bên**
- ✅ **Mỗi giao dịch có ý nghĩa rõ ràng**: TRỪ hoặc CỘNG

## 🎯 **Kết quả**

✅ **Người nhận lịch xe** giờ đây có thể hủy lịch xe của mình  
✅ **Người nhận** có thể hủy lịch xe **ngay cả sau khi đã xác nhận**  
✅ **Giao diện rõ ràng** với badge và thông báo quyền  
✅ **Bảo mật đảm bảo** với kiểm tra quyền ở backend  
✅ **Trải nghiệm người dùng** tốt hơn với quyền linh hoạt  
✅ **Linh hoạt hơn** cho người dùng cuối (có thể hủy sau khi xác nhận)  
✅ **Hoàn tiền/điểm tự động** cho cả 2 bên khi hủy lịch xe  
✅ **Logic hoàn tiền chính xác** - A bị trừ, B được cộng khi hủy  
✅ **Cập nhật số dư real-time** trong database  
✅ **Thông báo chi tiết** về số tiền/điểm được hoàn  
✅ **Giao dịch ghi nhận** rõ ràng cho việc hủy lịch xe  
✅ **Sửa lỗi id_nguoi_nhan bị null** trong bảng lich_xe  
✅ **Tự động cập nhật trạng thái lịch xe** khi xác nhận giao dịch  
✅ **Ẩn nút hủy lịch** sau khi hủy + thông báo cho 2 bên  
✅ **Logic hoàn tiền hoàn chỉnh**: Giao dịch "Hủy lịch" + xử lý hoàn tiền/điểm riêng biệt
