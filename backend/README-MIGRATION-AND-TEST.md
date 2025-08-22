# README: MIGRATION VÀ TEST HỆ THỐNG QUẢN LÝ ĐIỂM

## 📋 Tổng quan

Tài liệu này mô tả các migration và test đã thực hiện để cải thiện hệ thống quản lý điểm, bao gồm:
- Cập nhật logic giao dịch hai chiều
- Tích hợp tính điểm tự động
- Hỗ trợ điểm float
- **MIGRATION MỚI: Cập nhật 7 loại tuyến chi tiết**
- **SỬA ĐỒNG BỘ: Logic tính điểm giữa frontend và backend**

## 🔧 SỬA ĐỒNG BỘ LOGIC TÍNH ĐIỂM (MỚI)

### **Vấn đề đã được xác định:**
1. **`getRouteType()` sử dụng logic cũ**: Đang dùng logic phức tạp để xác định 1 chiều/2 chiều thay vì dùng trực tiếp `id_loai_tuyen` từ database
2. **Mapping không nhất quán**: `ROUTE_TYPES` constants không khớp với database thực tế
3. **Logic 1 chiều/2 chiều phức tạp**: Đang dùng `hasReturnTime` thay vì dựa vào `id_loai_tuyen` đã được tách riêng

### **Giải pháp đã áp dụng:**

#### 1. **Đơn giản hóa `getRouteType()`**
```javascript
// TRƯỚC: Logic phức tạp
function getRouteType(scheduleData) {
  const hasReturnTime = !!(scheduleData.thoi_gian_bat_dau_tra && 
                          scheduleData.thoi_gian_bat_dau_tra.trim() !== '')
  
  if (scheduleData.id_loai_tuyen === 3) { // Lịch phố
    return hasReturnTime ? 4 : 3  // 2 chiều : 1 chiều
  }
  // ... logic phức tạp khác
}

// SAU: Logic đơn giản
function getRouteType(scheduleData) {
  return parseInt(scheduleData.id_loai_tuyen)
}
```

#### 2. **Cập nhật `ROUTE_TYPES` constants**
```javascript
// TRƯỚC: 4 loại chung
const ROUTE_TYPES = {
  DON_SAN_BAY: 1,
  TIEN_SAN_BAY: 2, 
  PHO: 3,           // Chung cho phố
  TINH_HUYEN: 4     // Chung cho tỉnh huyện
}

// SAU: 7 loại riêng biệt
const ROUTE_TYPES = {
  DON_SAN_BAY: 1,           // Đón sân bay
  TIEN_SAN_BAY: 2,          // Tiễn sân bay
  PHO_1_CHIEU: 3,           // Lịch phố 1 chiều
  PHO_2_CHIEU: 4,           // Lịch phố 2 chiều
  TINH_HUYEN_1_CHIEU: 5,    // Lịch tỉnh/huyện 1 chiều
  TINH_HUYEN_2_CHIEU: 6,    // Lịch tỉnh/huyện 2 chiều
  HUONG_SAN_BAY_5KM: 7      // Lịch hướng sân bay bán kính 5km
}
```

#### 3. **Tinh chỉnh logic tính điểm**
```javascript
// Thêm tiers điểm mới cho xe 7 chỗ và lớn hơn
if (price >= 250000 && price < 350000) return 0.5
if (price >= 350000 && price < 450000) return 1.0
```

#### 4. **Cải thiện logging**
```javascript
console.log('=== DEBUG TÍNH ĐIỂM ===')
console.log('Input data:', scheduleData)
console.log('Route type determined:', routeType)
console.log('Time range determined:', timeRange)
console.log('Points calculated:', points)
```

### **Files đã được cập nhật:**
- `WebsiteQuanLyDiem/backend/services/pointCalculationService.js`
- `WebsiteQuanLyDiem/frontend/src/services/pointCalculationService.js`
- `WebsiteQuanLyDiem/backend/test-point-calculation-sync.js` (mới)

### **Kết quả mong đợi:**
✅ **Logic tính điểm hoàn toàn đồng bộ** giữa frontend và backend  
✅ **7 loại tuyến mới hoạt động chính xác** với ID từ 1-7  
✅ **Không còn logic phức tạp** để xác định 1 chiều/2 chiều  
✅ **Database đã có 7 loại tuyến riêng biệt**  
✅ **Frontend và backend sử dụng cùng logic** tính điểm  

### **Test đồng bộ:**
```bash
cd backend
node test-point-calculation-sync.js
```

---

## 🚗 SỬA MAPPING LOẠI XE (MỚI NHẤT)

### **Vấn đề đã được xác định:**
Khi chọn loại xe 4 chỗ, hệ thống trả về `vehicleType: 'Không xác định'` thay vì tên chính xác. Nguyên nhân là constants `VEHICLE_TYPES` không khớp với `id_loai_xe` thực tế từ database.

### **Giải pháp đã áp dụng:**

#### 1. **Cập nhật constants `VEHICLE_TYPES`**
```javascript
// TRƯỚC: ID không khớp với database
const VEHICLE_TYPES = {
  XE_4_CHO: 4,      // Sai
  XE_5_CHO: 5,      // Sai
  XE_7_CHO: 7,      // Sai
  XE_16_CHO: 16,    // Sai
  XE_29_CHO: 29,    // Sai
  XE_45_CHO: 45     // Sai
}

// SAU: ID khớp với database thực tế
const VEHICLE_TYPES = {
  XE_4_CHO: 1,      // Database trả về id=1 cho xe 4 chỗ
  XE_5_CHO: 2,      // Database trả về id=2 cho xe 5 chỗ  
  XE_7_CHO: 3,      // Database trả về id=3 cho xe 7 chỗ
  XE_16_CHO: 4,     // Database trả về id=4 cho xe 16 chỗ
  XE_29_CHO: 5,     // Database trả về id=5 cho xe 29 chỗ
  XE_45_CHO: 6      // Database trả về id=6 cho xe 45 chỗ
}
```

#### 2. **Files đã được cập nhật:**
- `WebsiteQuanLyDiem/backend/services/pointCalculationService.js`
- `WebsiteQuanLyDiem/frontend/src/services/pointCalculationService.js`
- `WebsiteQuanLyDiem/frontend/test-vehicle-mapping.js` (mới)

### **Kết quả mong đợi:**
✅ **Xe 4 chỗ (id=1) sẽ hiển thị đúng tên** "Xe 4 chỗ"  
✅ **Tất cả loại xe sẽ hiển thị tên chính xác**  
✅ **Không còn "Không xác định"** trong vehicleType  
✅ **Mapping loại xe hoàn toàn đồng bộ** giữa frontend và backend  

### **Test mapping loại xe:**
```bash
cd frontend
node test-vehicle-mapping.js
```

### **Test logic khung giờ:**
```bash
cd frontend
node test-time-ranges.js
```

### **Kiểm tra trên frontend:**
1. Mở frontend và tạo giao dịch "Giao lịch"
2. Chọn loại xe 4 chỗ (id=1)
3. Kiểm tra xem vehicleType có hiển thị "Xe 4 chỗ" không
4. Nếu vẫn sai, kiểm tra database để xác định `id_loai_xe` thực tế

---

## 🕐 SỬA LOGIC KHUNG GIỜ (MỚI NHẤT)

### **Vấn đề đã được xác định:**
Logic `getTimeRange()` có **conflict** giữa đón sân bay và tiễn sân bay, khiến khung giờ bị xác định sai.

### **Conflict cũ:**
```javascript
// Đón sân bay đêm: 12h00-4h59 (hôm sau)
if (hour >= 0 && hour <= 4) return TIME_RANGES.LATE_NIGHT

// Tiễn sân bay đêm: 00h-8h59  
if (hour >= 0 && hour <= 8) return TIME_RANGES.NIGHT_DEPARTURE
```

**Vấn đề**: Cả hai đều return cho `hour >= 0 && hour <= 4`, gây conflict!

### **Giải pháp đã áp dụng:**

#### 1. **Tách riêng logic khung giờ**
```javascript
// ĐÓN SÂN BAY: 5h00-11h59 (sáng), 12h00-4h59 (đêm)
if (hour >= 5 && hour <= 11) return TIME_RANGES.EARLY_MORNING  // 5h00-11h59
if (hour >= 12 || hour <= 4) return TIME_RANGES.LATE_NIGHT     // 12h00-4h59

// TIỄN SÂN BAY: 00h-8h59 (đêm), 9h00-23h59 (ngày)
if (hour >= 0 && hour <= 8) return TIME_RANGES.NIGHT_DEPARTURE // 00h-8h59
if (hour >= 9 && hour <= 23) return TIME_RANGES.DAY_DEPARTURE  // 9h00-23h59
```

#### 2. **Khung giờ chính xác theo quy tắc:**

**ĐÓN SÂN BAY (id_loai_tuyen = 1):**
- **Sáng (5h00-11h59)**: Điểm cao nhất
  - Xe 5 chỗ: ≥320k=1.5đ, ≥270k=1.25đ, ≥250k=1đ
  - Xe 7 chỗ: ≥380k=1.5đ, ≥330k=1.25đ, ≥300k=1đ
- **Đêm (12h00-4h59)**: Điểm trung bình
  - Xe 5 chỗ: ≥250k=1đ
  - Xe 7 chỗ: ≥300k=1đ

**TIỄN SÂN BAY (id_loai_tuyen = 2):**
- **Đêm (00h-8h59)**: Điểm thấp
  - Xe 4 chỗ: ≥200k=0.5đ
  - Xe 7 chỗ: ≥220k=0.5đ
- **Ngày (9h00-23h59)**: Điểm trung bình
  - Xe 4 chỗ: ≥220k=1đ, ≥200k=0.75đ
  - Xe 7 chỗ: ≥250k=1đ, ≥220k=0.75đ

#### 3. **Files đã được cập nhật:**
- ✅ `WebsiteQuanLyDiem/backend/services/pointCalculationService.js`
- ✅ `WebsiteQuanLyDiem/frontend/src/services/pointCalculationService.js`
- ✅ `WebsiteQuanLyDiem/frontend/test-time-ranges.js` (mới)

### **Kết quả mong đợi:**
✅ **Không còn conflict** giữa đón và tiễn sân bay  
✅ **Khung giờ được xác định chính xác** theo quy tắc  
✅ **Điểm được tính đúng** theo khung giờ và loại xe  
✅ **Logic khung giờ hoàn toàn đồng bộ** giữa frontend và backend  

### **Test logic khung giờ:**
```bash
cd frontend
node test-time-ranges.js
```

### **Kiểm tra trên frontend:**
1. Tạo giao dịch "Giao lịch" với loại tuyến "Đón sân bay"
2. Chọn thời gian 8h00 (sáng) → Điểm cao nhất
3. Chọn thời gian 2h00 (đêm) → Điểm trung bình
4. Tạo giao dịch với loại tuyến "Tiễn sân bay"
5. Chọn thời gian 6h00 (đêm) → Điểm thấp
6. Chọn thời gian 14h00 (ngày) → Điểm trung bình

**Logic khung giờ đã được sửa hoàn toàn! 🎉**

**Chức năng quy đổi điểm đã sẵn sàng hoạt động hoàn hảo và đồng bộ! 🎉**
