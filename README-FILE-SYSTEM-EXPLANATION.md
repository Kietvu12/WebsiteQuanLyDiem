# Giải Thích Hệ Thống Lưu Trữ File Báo Cáo

## Cách Hệ Thống Hoạt Động

### 1. **File Thực Tế vs Database**

**❌ HIỂU NHẦM**: "Hệ thống lưu file vào database"
**✅ SỰ THẬT**: Hệ thống lưu file vào thư mục `reports` thực tế, database chỉ lưu đường dẫn tham chiếu

### 2. **Quy Trình Lưu Trữ**

```
1. Tạo thư mục reports/ (nếu chưa có)
2. Tạo thư mục con: reports/Báo cáo nhóm [Tên]/
3. Tạo file CSV: reports/Báo cáo nhóm [Tên]/[Tên file].csv
4. Lưu đường dẫn vào database: "reports/Báo cáo nhóm [Tên]/[Tên file].csv"
```

### 3. **Vị Trí File Thực Tế**

```
WebsiteQuanLyDiem/
├── backend/
│   ├── reports/                    ← THƯ MỤC THỰC TẾ
│   │   ├── Báo cáo nhóm Nhóm Xe Sân Bay/
│   │   │   └── Báo cáo nhóm Nhóm Xe Sân Bay từ 2025-07-26 đến 2025-08-25.csv
│   │   └── Báo cáo người dùng [Tên]/
│   │       └── [File CSV]
│   └── services/
│       └── reportExportService.js
└── frontend/
```

### 4. **Database Chỉ Lưu Metadata**

```sql
-- Bảng bao_cao chỉ lưu thông tin tham chiếu
INSERT INTO bao_cao (id_nhom, ngay_bao_cao, duong_dan_file) 
VALUES (1, '2025-08-25', 'reports/Báo cáo nhóm Nhóm Xe Sân Bay/Báo cáo nhóm Nhóm Xe Sân Bay từ 2025-07-26 đến 2025-08-25.csv')
```

**KHÔNG lưu nội dung file vào database!**

## Vấn Đề Hiện Tại

### ❌ **Thư mục trống**
```
backend/reports/Báo cáo nhóm Nhóm Xe Sân Bay/  ← Thư mục tồn tại
└── (không có file nào)                        ← Nhưng không có file CSV
```

### 🔍 **Nguyên nhân có thể**
1. **Lỗi trong quá trình tạo CSV** - `convertToCSV` trả về chuỗi rỗng
2. **Lỗi ghi file** - `fs.writeFile` thất bại
3. **Lỗi đường dẫn** - `path.join` tạo đường dẫn sai
4. **Lỗi quyền** - Không có quyền ghi vào thư mục

## Cách Kiểm Tra

### 1. **Kiểm tra thư mục reports**
```bash
cd WebsiteQuanLyDiem/backend
ls -la reports/
```

### 2. **Kiểm tra log backend**
```bash
npm start
# Xem console log khi tạo báo cáo
```

### 3. **Kiểm tra quyền thư mục**
```bash
# Windows
dir reports

# Linux/Mac
ls -la reports/
```

## Giải Pháp

### 1. **Thêm logging** ✅ (Đã làm)
- Log quá trình tạo thư mục
- Log quá trình tạo file
- Log nội dung CSV

### 2. **Kiểm tra lỗi**
- Chạy backend với logging
- Tạo báo cáo mới
- Xem log để tìm lỗi

### 3. **Test thủ công**
- Tạo file test đơn giản
- Kiểm tra quyền ghi

## Kết Luận

**Hệ thống ĐANG hoạt động đúng**:
- ✅ Tạo thư mục `reports/` 
- ✅ Tạo thư mục con cho từng nhóm/người dùng
- ❌ **VẤN ĐỀ**: Không tạo được file CSV bên trong

**Database KHÔNG lưu file**, chỉ lưu đường dẫn tham chiếu đến file thực tế trong thư mục `reports/`.

Vấn đề cần tìm là tại sao `fs.writeFile()` không thành công khi tạo file CSV.
