# Sửa Lỗi Transaction - "Incorrect arguments to mysqld_stmt_execute"

## Mô tả vấn đề
Lỗi "Incorrect arguments to mysqld_stmt_execute" xảy ra khi tạo giao dịch mới. Lỗi này thường do:
1. Dữ liệu `null` hoặc `undefined` không được xử lý đúng cách
2. Số lượng tham số trong câu lệnh SQL không khớp với dữ liệu được truyền vào
3. Các giá trị không hợp lệ được gửi từ frontend

## 🔍 **Vấn đề Logic Giao lịch-Nhận lịch (Đã khắc phục)**

### **Vấn đề được phát hiện:**
Khi tạo giao dịch Giao lịch-Nhận lịch, có một lỗi logic nghiêm trọng:

1. **Frontend tạo lịch xe trước** → nhận được `scheduleId`
2. **Frontend gửi `scheduleId` vào giao dịch chính** → ✅ Đúng
3. **Backend tạo giao dịch chính** với `id_lich_xe = scheduleId` → ✅ Đúng  
4. **Backend tạo giao dịch đối ứng** với `id_lich_xe = id_lich_xe` → ❌ **SAI!**

**Vấn đề:** Giao dịch đối ứng sử dụng biến `id_lich_xe` từ `req.body` thay vì từ giao dịch chính đã tạo.

### **Hậu quả:**
- Giao dịch chính có `id_lich_xe` đúng
- Giao dịch đối ứng có `id_lich_xe` sai (có thể là `null` hoặc `undefined`)
- Hai giao dịch không được liên kết với cùng một lịch xe
- Không thể theo dõi mối quan hệ giữa các giao dịch

### **Cách khắc phục:**
```javascript
// Trước (SAI)
const oppositeTransactionData = {
  // ... các trường khác
  id_lich_xe, // Biến từ req.body, có thể sai
};

// Sau (ĐÚNG)
const oppositeTransactionData = {
  // ... các trường khác
  id_lich_xe: id_lich_xe, // Sử dụng ID lịch xe từ giao dịch chính
};
```

## 🚨 **Vấn đề MỚI: id_lich_xe bị null (Đã khắc phục)**

### **Vấn đề được phát hiện:**
Khi tạo giao dịch Giao lịch, `id_lich_xe` bị `null` mặc dù đây là giao dịch Giao lịch:

```json
{
    "id_loai_giao_dich": 1,  // ✅ Đây là giao dịch Giao lịch
    "id_nguoi_nhan": 3,
    "id_nhom": 1,
    "id_lich_xe": null,      // ❌ Vấn đề: null thay vì ID lịch xe
    "so_tien": 132123131,
    "diem": 1,
    "noi_dung": "21131"
}
```

### **Nguyên nhân có thể:**
1. **Logic so sánh `id_loai_giao_dich === 1` không hoạt động** do kiểu dữ liệu
2. **Lịch xe không được tạo thành công** trước khi tạo giao dịch
3. **`scheduleData` không được điền đầy đủ** (thiếu loại xe, loại tuyến, thời gian)
4. **API tạo lịch xe trả về lỗi** nhưng không được xử lý đúng cách
5. **`scheduleId` không được gán đúng cách** sau khi tạo lịch xe

### **Cách khắc phục:**
```javascript
// 1. Sửa logic so sánh để đảm bảo chính xác
if (parseInt(formData.id_loai_giao_dich) === 1) {
  // Tạo lịch xe bắt buộc
}

// 2. Thêm validation dữ liệu lịch xe bắt buộc
if (!scheduleData.id_loai_xe || !scheduleData.id_loai_tuyen || 
    !scheduleData.thoi_gian_bat_dau_don || !scheduleData.thoi_gian_ket_thuc_don) {
  throw new Error('Vui lòng điền đầy đủ thông tin lịch xe');
}

// 3. Kiểm tra scheduleId sau khi tạo
if (!scheduleId) {
  throw new Error('Lỗi: Lịch xe được tạo nhưng không có ID');
}

// 4. Validation cuối cùng trước khi gửi API
if (transactionData.id_loai_giao_dich === 1 && !transactionData.id_lich_xe) {
  throw new Error('Giao dịch Giao lịch phải có ID lịch xe');
}
```

### **Logging chi tiết để debug:**
```javascript
console.log('=== KIỂM TRA LOẠI GIAO DỊCH ===')
console.log('formData.id_loai_giao_dich:', formData.id_loai_giao_dich)
console.log('formData.id_loai_giao_dich type:', typeof formData.id_loai_giao_dich)
console.log('parseInt(formData.id_loai_giao_dich) === 1:', parseInt(formData.id_loai_giao_dich) === 1)

console.log('=== TẠO LỊCH XE (BẮT BUỘC) ===')
console.log('Schedule data:', scheduleData)
console.log('Creating vehicle schedule with data:', {...})

console.log('=== VALIDATION CUỐI CÙNG ===')
console.log('ID lịch xe trong transaction data:', transactionData.id_lich_xe)
```

## Các thay đổi đã thực hiện

### 1. Frontend (AddNewTransaction.jsx)
- **Cải thiện xử lý dữ liệu**: Thay đổi từ gửi giá trị `0` thành `null` cho các trường không bắt buộc
- **Kiểm tra dữ liệu bắt buộc**: Thêm validation trước khi gửi API
- **Xử lý `scheduleId`**: Đảm bảo `id_lich_xe` được gửi đúng định dạng
- **Validation đặc biệt**: Kiểm tra giao dịch Giao lịch phải có `id_lich_xe`
- **Logging chi tiết**: Thêm console.log để theo dõi việc truyền `scheduleId`

```javascript
// Trước
id_lich_xe: scheduleId,
so_tien: formData.so_tien ? parseFloat(formData.so_tien) : 0,
diem: formData.diem ? parseInt(formData.diem) : 0,

// Sau
id_lich_xe: scheduleId && scheduleId !== '' ? parseInt(scheduleId) : null,
so_tien: formData.so_tien && formData.so_tien !== '' ? parseFloat(formData.so_tien) : null,
diem: formData.diem && formData.diem !== '' ? parseInt(formData.diem) : null,

// Validation đặc biệt cho Giao lịch
if (transactionData.id_loai_giao_dich === 1) {
  if (!transactionData.id_lich_xe) {
    throw new Error('Lỗi: Không thể tạo giao dịch Giao lịch vì thiếu thông tin lịch xe');
  }
}
```

### 2. Backend Model (Transaction.js)
- **Xử lý dữ liệu an toàn**: Thêm logic xử lý các giá trị `null`/`undefined`
- **Validation dữ liệu**: Kiểm tra các trường bắt buộc trước khi thực hiện SQL
- **Logging chi tiết**: Thêm console.log để debug

```javascript
// Xử lý các giá trị null/undefined để tránh lỗi MySQL
const processedData = {
  id_loai_giao_dich: id_loai_giao_dich || null,
  id_nguoi_gui: id_nguoi_gui || null,
  // ... các trường khác
};

// Kiểm tra dữ liệu bắt buộc
if (!processedData.id_loai_giao_dich || !processedData.id_nguoi_gui || !processedData.id_nhom || !processedData.noi_dung) {
  throw new Error('Thiếu thông tin bắt buộc để tạo giao dịch');
}
```

### 3. Backend Controller (transactionController.js)
- **Xử lý lỗi chi tiết**: Cải thiện error handling cho từng bước tạo giao dịch
- **Logging chi tiết**: Thêm console.log cho từng bước xử lý
- **Thông báo lỗi rõ ràng**: Trả về thông báo lỗi cụ thể cho từng loại lỗi
- **Sửa logic Giao lịch-Nhận lịch**: Đảm bảo giao dịch đối ứng sử dụng đúng `id_lich_xe`
- **Logging chi tiết cho lịch xe**: Theo dõi việc truyền `id_lich_xe` từ frontend đến backend

```javascript
// Logging chi tiết cho lịch xe
console.log('=== DỮ LIỆU GIAO DỊCH CHÍNH ===')
console.log('ID lịch xe từ request:', id_lich_xe)
console.log('ID lịch xe type:', typeof id_lich_xe)
console.log('ID lịch xe value:', id_lich_xe)

// Sửa logic giao dịch đối ứng
const oppositeTransactionData = {
  // ... các trường khác
  id_lich_xe: id_lich_xe, // Sử dụng ID lịch xe từ giao dịch chính
};

console.log('✅ ID lịch xe được liên kết đúng:', oppositeTransactionData.id_lich_xe);
```

## Cách kiểm tra

### 1. Chạy test logic Giao lịch-Nhận lịch
```bash
cd WebsiteQuanLyDiem/backend
node test-giao-lich-logic.js
```

### 2. Kiểm tra logs
- Backend: Xem console logs khi tạo giao dịch
- Frontend: Xem console logs trong browser developer tools
- **Đặc biệt chú ý**: Logs về `id_lich_xe` và việc liên kết giao dịch

### 3. Kiểm tra database
- Xem bảng `giao_dich` có được tạo đúng không
- Kiểm tra các giá trị `null` có được lưu đúng không
- **Quan trọng**: Kiểm tra cả 2 giao dịch (Giao lịch và Nhận lịch) có cùng `id_lich_xe` không

## Các trường hợp test

### 1. Giao dịch bình thường
- Điền đầy đủ thông tin
- Có lịch xe
- Có tiền và điểm

### 2. Giao dịch không có lịch xe
- Không chọn lịch xe
- `id_lich_xe` sẽ là `null`

### 3. Giao dịch không có tiền/điểm
- Để trống trường tiền và điểm
- Các giá trị sẽ là `null`

### 4. Giao dịch với dữ liệu không hợp lệ
- Thiếu thông tin bắt buộc
- Sẽ hiển thị thông báo lỗi cụ thể

### 5. **Giao dịch Giao lịch-Nhận lịch (QUAN TRỌNG)**
- Tạo lịch xe trước
- Tạo giao dịch Giao lịch với `id_lich_xe`
- Tự động tạo giao dịch Nhận lịch với cùng `id_lich_xe`
- Kiểm tra cả 2 giao dịch có cùng `id_lich_xe` trong database

## Lưu ý quan trọng

1. **Giá trị `null` vs `0`**: 
   - `null` = không có giá trị
   - `0` = có giá trị là 0

2. **Validation**: Luôn kiểm tra dữ liệu trước khi gửi vào database

3. **Error handling**: Xử lý lỗi ở mọi bước để có thông tin debug chi tiết

4. **Logging**: Ghi log đầy đủ để dễ dàng debug khi có lỗi

5. **Logic Giao lịch-Nhận lịch**: 
   - Luôn đảm bảo cả 2 giao dịch có cùng `id_lich_xe`
   - Kiểm tra `scheduleId` được truyền đúng từ frontend đến backend
   - Validate giao dịch Giao lịch phải có `id_lich_xe`

## Kết quả mong đợi

Sau khi áp dụng các thay đổi:
- ✅ Không còn lỗi "Incorrect arguments to mysqld_stmt_execute"
- ✅ Giao dịch được tạo thành công với các giá trị `null` hợp lệ
- ✅ Thông báo lỗi rõ ràng khi có vấn đề
- ✅ Logs chi tiết để debug
- ✅ Validation dữ liệu chặt chẽ hơn
- ✅ **Logic Giao lịch-Nhận lịch hoạt động đúng**: Cả 2 giao dịch đều được liên kết với cùng 1 lịch xe
- ✅ **Tracking mối quan hệ giao dịch**: Có thể theo dõi mối quan hệ giữa các giao dịch thông qua `id_lich_xe`
