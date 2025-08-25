# Hướng Dẫn Định Dạng CSV và Excel

## Tại Sao Sử Dụng CSV Thay Vì Excel?

### ✅ **Lý Do Chọn CSV:**
1. **Không cần thư viện ngoài** - Node.js có sẵn `fs` module
2. **Tương thích cao** - Excel, Google Sheets, LibreOffice đều mở được
3. **Nhẹ và nhanh** - Không có overhead của Excel format
4. **Dễ debug** - Có thể mở bằng text editor
5. **Không có vấn đề version** - CSV là standard format

### ❌ **Vấn Đề Với ExcelJS:**
- Thư viện cũ, không còn được maintain
- Có thể gây lỗi compatibility
- Tăng kích thước bundle
- Phức tạp hơn CSV

## Định Dạng CSV Được Tạo

### 1. **Encoding: UTF-8 với BOM**
```javascript
const bom = '\uFEFF' // Byte Order Mark
await fs.writeFile(filePath, bom + csvContent, 'utf8')
```

**Tại sao cần BOM?**
- Excel cần BOM để nhận diện UTF-8
- Không có BOM → Excel hiểu sai encoding → ký tự tiếng Việt bị hỏng

### 2. **Cấu Trúc CSV**
```csv
STT,Ngày tạo giao dịch,Loại giao dịch,Người gửi,Người nhận,Số tiền,Điểm,Trạng thái giao dịch,Nội dung giao dịch,Nhóm tham chiếu
1,2025-08-25 10:00:00,Chuyển tiền,Nguyễn Văn A,Nguyễn Văn B,50000,5,Thành công,Thanh toán dịch vụ xe,Nhóm Xe Sân Bay
2,2025-08-25 11:30:00,Nhận tiền,Nguyễn Văn C,Nguyễn Văn D,75000,7,Thành công,Thu tiền xe,Nhóm Xe Sân Bay
```

**Mỗi cột được phân tách bằng dấu phẩy (,)**
**Mỗi dòng dữ liệu được phân tách bằng xuống dòng (\n)**
**Header (tiêu đề) ở dòng đầu tiên**
**Dữ liệu từ dòng thứ 2 trở đi**

### 3. **Xử Lý Ký Tự Đặc Biệt**
- **Dấu phẩy**: Được escape bằng dấu ngoặc kép
- **Dấu ngoặc kép**: Được escape bằng cách nhân đôi `""`
- **Xuống dòng**: Được thay thế bằng dấu cách
- **Null/Undefined**: Được chuyển thành chuỗi rỗng

## Cách Mở File CSV Trong Excel

### **CSV là gì?**
**CSV = Comma-Separated Values** (Giá trị được phân tách bằng dấu phẩy)

- **Dấu phẩy (,)** = Phân tách cột
- **Xuống dòng (\n)** = Phân tách dòng
- **Excel tự động hiểu** và chia thành các cột riêng biệt

### **Phương Pháp 1: Mở Trực Tiếp (Khuyến Nghị)**
1. **Double-click** vào file CSV
2. Excel sẽ tự động mở với encoding đúng
3. **Lưu ý**: Nếu có BOM, Excel sẽ hiểu đúng UTF-8
4. **Kết quả**: Mỗi cột sẽ nằm trong một ô Excel riêng biệt

### **Phương Pháp 2: Import Vào Excel**
1. Mở Excel
2. **Data** → **From Text/CSV**
3. Chọn file CSV
4. Chọn **UTF-8** encoding
5. Click **Load**

### **Phương Pháp 3: Mở Bằng Text Editor Trước**
1. Mở file CSV bằng **Notepad++** hoặc **VS Code**
2. **File** → **Save As** → Chọn **UTF-8-BOM**
3. Sau đó mở bằng Excel

## Xử Lý Vấn Đề Encoding

### **Vấn Đề 1: Ký Tự Tiếng Việt Bị Hỏng**
```
❌ Sai: NgÃ y táº¡o
✅ Đúng: Ngày tạo
```

### **Vấn Đề 2: Dữ Liệu Bị Dính Liền (Loạn Xạ)**
```
❌ Sai: ID Giao dịchNgày tạoLoại giao dịchVai trò...
✅ Đúng: ID Giao dịch,Ngày tạo,Loại giao dịch,Vai trò,...
```

**Nguyên nhân**: Thiếu dấu phẩy phân tách giữa các cột
**Giải pháp**: Đã sửa hàm `convertToCSV` để đảm bảo mỗi cột được phân tách đúng cách

### **Nguyên Nhân:**
1. **Thiếu BOM** - Excel không nhận diện UTF-8
2. **Encoding mismatch** - File được tạo với encoding khác
3. **Excel mặc định** - Excel dùng ANSI thay vì UTF-8

### **Giải Pháp Đã Áp Dụng:**
1. ✅ **Thêm BOM** (`\uFEFF`) vào đầu file
2. ✅ **Ghi file với UTF-8** encoding
3. ✅ **Xử lý ký tự đặc biệt** trong CSV
4. ✅ **Escape đúng cách** các ký tự có vấn đề

## Test Định Dạng CSV

### **1. Kiểm Tra File Được Tạo**
```bash
# Xem nội dung file (nên có BOM ở đầu)
hexdump -C "Báo cáo nhóm X.csv" | head -5
```

### **2. Kiểm Tra Định Dạng Cột**
```bash
# Đếm số cột trong mỗi dòng
awk -F',' '{print "Line " NR ": " NF " columns"}' "Báo cáo nhóm X.csv"
```

### **3. Kiểm Tra Dấu Phẩy Phân Tách**
```bash
# Xem dòng đầu tiên (header)
head -1 "Báo cáo nhóm X.csv"
# Kết quả mong đợi: ID Giao dịch,Ngày tạo,Loại giao dịch,Vai trò,...
```

### **2. Mở Trong Excel**
- File mở được không?
- Ký tự tiếng Việt hiển thị đúng không?
- Các cột được phân tách đúng không?

### **3. Mở Trong Text Editor**
- Encoding hiển thị là UTF-8?
- Nội dung có dấu BOM ở đầu?

## Lưu Ý Khi Sử Dụng

### **1. Excel Compatibility**
- **Excel 2016+**: Hỗ trợ tốt UTF-8 với BOM
- **Excel cũ hơn**: Có thể cần import thủ công
- **Google Sheets**: Hỗ trợ tốt UTF-8

### **2. Ký Tự Đặc Biệt**
- **Tiếng Việt**: Đã được xử lý với BOM
- **Số thập phân**: Sử dụng dấu chấm (.)
- **Ngày tháng**: Format ISO (YYYY-MM-DD)

### **3. Performance**
- **File nhỏ**: Mở nhanh, không có vấn đề
- **File lớn**: Excel có thể chậm, nhưng CSV vẫn nhanh hơn Excel format

## Kết Luận

**CSV là lựa chọn tốt nhất** cho hệ thống báo cáo vì:

1. ✅ **Đơn giản** - Không cần thư viện phức tạp
2. ✅ **Tương thích cao** - Excel, Google Sheets, LibreOffice
3. ✅ **Encoding đúng** - UTF-8 với BOM cho tiếng Việt
4. ✅ **Dễ maintain** - Code đơn giản, ít lỗi
5. ✅ **Performance tốt** - Tạo file nhanh, nhẹ

**Với BOM và UTF-8, file CSV sẽ mở đúng trong Excel và hiển thị tiếng Việt chính xác.**
