# MIGRATION: CẬP NHẬT LOẠI TUYẾN CHO TÍNH ĐIỂM

## Mục đích
Cập nhật bảng `loai_tuyen` để hỗ trợ logic tính điểm chi tiết dựa trên:
- Loại xe (4, 5, 7, 16, 29, 45 chỗ)
- Khung giờ (sáng, đêm, ngày)
- Loại tuyến (đón/tiễn sân bay, phố 1 chiều/2 chiều, tỉnh huyện 1 chiều/2 chiều, hướng sân bay 5km)
- Giá tiền (từ 150k đến 2.1M+)

## Thay đổi chính

### Trước đây (4 loại tuyến chung chung):
- Đón Sân Bay - Hà Nội
- Tiễn Hà Nội - Sân Bay  
- Lịch Phố
- Lịch Tỉnh & Huyện

### Bây giờ (7 loại tuyến chi tiết):
1. **Đón Sân Bay - Hà Nội** (id=1)
   - Tính điểm dựa trên khung giờ và loại xe
   - Sáng (5h00-11h59): Xe 5 chỗ ≥320k=1.5đ, ≥270k=1.25đ, ≥250k=1đ
   - Đêm (12h00-4h59): Xe 5 chỗ ≥250k=1đ, Xe 7 chỗ ≥300k=1đ

2. **Tiễn Hà Nội - Sân Bay** (id=2)
   - Đêm (00h-8h59): Xe 4 chỗ ≥200k=0.5đ, Xe 7 chỗ ≥220k=0.5đ
   - Ngày (9h00-23h59): Xe 4 chỗ ≥200k=0.75đ, ≥220k=1đ, Xe 7 chỗ ≥220k=0.75đ, ≥250k=1đ

3. **Lịch Phố 1 Chiều** (id=3)
   - **TÁCH RIÊNG**: Không có thời gian trả khách
   - 180k-300k = 0.5 điểm
   - 300k-600k = 1.0 điểm

4. **Lịch Phố 2 Chiều** (id=4)
   - **TÁCH RIÊNG**: Có thời gian trả khách
   - Xe 5 chỗ: 250k-350k=0.5đ, 350k-450k=1đ, 450k-800k=1.5đ
   - Xe 7 chỗ: 250k-350k=0.5đ, 350k-450k=1đ, 450k-500k=1đ, 500k-800k=1.5đ

5. **Lịch Tỉnh/Huyện 1 Chiều** (id=5)
   - **TÁCH RIÊNG**: Không có thời gian trả khách
   - 180k-300k = 0.5 điểm
   - 300k-600k = 1.0 điểm
   - 700k-900k = 1.5 điểm
   - 900k-1.2M = 2.0 điểm
   - 1.2M-1.5M = 2.5 điểm
   - 1.5M-1.9M = 3.0 điểm
   - 1.9M-2.1M = 3.5 điểm

6. **Lịch Tỉnh/Huyện 2 Chiều** (id=6)
   - **TÁCH RIÊNG**: Có thời gian trả khách
   - 180k-350k = 0.5 điểm
   - 350k-600k = 1.0 điểm
   - 700k-900k = 1.5 điểm
   - 900k-1.2M = 2.0 điểm
   - 1.2M-1.5M = 2.5 điểm
   - 1.5M-1.9M = 3.0 điểm
   - 1.9M-2.1M = 3.5 điểm

7. **Lịch Hướng Sân Bay (Bán kính 5km)** (id=7)
   - **MỚI**: Tính như lịch tiễn sân bay
   - Đêm (00h-8h59): Xe 4 chỗ ≥200k=0.5đ, Xe 7 chỗ ≥220k=0.5đ
   - Ngày (9h00-23h59): Xe 4 chỗ ≥200k=0.75đ, ≥220k=1đ, Xe 7 chỗ ≥220k=0.75đ, ≥250k=1đ

## Cải tiến chính

### 1. Tách riêng lịch 1 chiều và 2 chiều
- **Trước**: Chỉ có "Lịch Phố" và "Lịch Tỉnh & Huyện" chung chung
- **Sau**: Tách riêng thành 4 loại:
  - Phố 1 chiều (id=3)
  - Phố 2 chiều (id=4) 
  - Tỉnh huyện 1 chiều (id=5)
  - Tỉnh huyện 2 chiều (id=6)

### 2. Xử lý điều kiện khoảng cách
- **Mới**: "Lịch Hướng Sân Bay (Bán kính 5km)" (id=7)
- Tính điểm giống như lịch tiễn sân bay
- Áp dụng cho các lịch trong bán kính 5km từ sân bay

### 3. Logic phân biệt 1 chiều/2 chiều
- **1 chiều**: `thoi_gian_bat_dau_tra` và `thoi_gian_ket_thuc_tra` = `null`
- **2 chiều**: Có thời gian trả khách cụ thể
- Điểm được tính khác nhau cho mỗi loại

## Files cần cập nhật

### 1. Database Migration
- `schema_db/update-route-types.sql` - Cập nhật 7 loại tuyến mới

### 2. Backend Service
- `services/pointCalculationService.js` - Logic tính điểm mới
- `controllers/transactionController.js` - Tích hợp tính điểm tự động

### 3. Frontend Service  
- `frontend/src/services/pointCalculationService.js` - Logic tính điểm frontend
- `frontend/src/component/AddNewTransaction/AddNewTransaction.jsx` - Hiển thị điểm

### 4. Test Files
- `test-route-types-integration.js` - Test tích hợp loại tuyến mới
- `test-point-calculation-float.js` - Test tính điểm float

## Cách thực hiện

### Bước 1: Backup database
```bash
mysqldump -u username -p database_name > backup_before_migration.sql
```

### Bước 2: Chạy migration
```bash
mysql -u username -p database_name < schema_db/update-route-types.sql
```

### Bước 3: Kiểm tra kết quả
```sql
SELECT * FROM loai_tuyen ORDER BY id;
```

### Bước 4: Test logic tính điểm
```bash
cd backend
node test-route-types-integration.js
```

## Kết quả mong đợi

### Database
- Bảng `loai_tuyen` có 7 records
- ID từ 1-7 tương ứng với các loại tuyến mới
- Cột `is_round_trip` đúng cho lịch 2 chiều

### Logic tính điểm
- Tự động phân biệt 1 chiều/2 chiều
- Tính điểm chính xác theo bảng giá mới
- Hỗ trợ điểm float (0.5, 1.25, 1.5, 2.5, 3.5)
- Xử lý đúng điều kiện khoảng cách

### Frontend
- Hiển thị điểm tự động khi chọn lịch xe
- Hiển thị chi tiết cách tính điểm
- Hỗ trợ tính điểm thủ công khi cần

## Lưu ý quan trọng

### 1. Dữ liệu cũ
- Các lịch xe cũ vẫn giữ nguyên `id_loai_tuyen`
- Cần cập nhật thủ công hoặc tạo migration để map sang loại mới

### 2. Tương thích ngược
- API vẫn hoạt động bình thường
- Logic cũ vẫn được hỗ trợ
- Chỉ cải thiện độ chính xác tính điểm

### 3. Performance
- Logic tính điểm được tối ưu
- Sử dụng `useMemo` ở frontend
- Cache kết quả tính điểm

## Troubleshooting

### Lỗi thường gặp
1. **Migration fail**: Kiểm tra quyền database
2. **Logic sai**: Chạy test để debug
3. **Frontend không hiển thị**: Kiểm tra console log

### Debug
```bash
# Test backend
node test-route-types-integration.js

# Test frontend  
node test-point-calculation-float.js

# Kiểm tra database
mysql -u username -p -e "SELECT * FROM loai_tuyen;"
```

## Kết luận

Migration này cải thiện đáng kể độ chính xác của hệ thống tính điểm bằng cách:
- Tách riêng lịch 1 chiều và 2 chiều
- Xử lý điều kiện khoảng cách
- Hỗ trợ điểm float
- Logic tính điểm chi tiết và chính xác

Sau khi hoàn thành, hệ thống sẽ tính điểm chính xác hơn và dễ bảo trì hơn.
