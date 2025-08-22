@echo off
REM Script chạy migration cập nhật loại tuyến
REM Xử lý ràng buộc khóa ngoại và map dữ liệu cũ

setlocal enabledelayedexpansion

REM Tham số mặc định
set "DatabaseName=quanlydiem"
set "Username=root"
set "Password="

REM Kiểm tra tham số dòng lệnh
if not "%1"=="" set "DatabaseName=%1"
if not "%2"=="" set "Username=%2"
if not "%3"=="" set "Password=%3"

echo === MIGRATION: CẬP NHẬT LOẠI TUYẾN CHO TÍNH ĐIỂM ===
echo.

REM Kiểm tra MySQL có sẵn không
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Lỗi: MySQL không có sẵn hoặc không thể kết nối
    echo Vui lòng cài đặt MySQL và đảm bảo mysql command có sẵn trong PATH
    pause
    exit /b 1
)

echo ✅ MySQL đã sẵn sàng
echo.

REM Tạo backup trước khi migration
set "timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "backupFile=backup_before_migration_!timestamp!.sql"

echo 📦 Tạo backup database...
if not "!Password!"=="" (
    mysqldump -u !Username! -p!Password! !DatabaseName! > "!backupFile!"
) else (
    mysqldump -u !Username! !DatabaseName! > "!backupFile!"
)

if %errorlevel% equ 0 (
    echo ✅ Backup thành công: !backupFile!
) else (
    echo ⚠️ Cảnh báo: Không thể tạo backup, nhưng vẫn tiếp tục migration
)

echo.
echo 🚀 Bắt đầu migration...
echo File migration: update-route-types.sql

REM Chạy migration
if not "!Password!"=="" (
    mysql -u !Username! -p!Password! !DatabaseName! < "schema_db\update-route-types.sql"
) else (
    mysql -u !Username! !DatabaseName! < "schema_db\update-route-types.sql"
)

if %errorlevel% equ 0 (
    echo ✅ Migration thành công!
    echo.
    
    echo 🔍 Kiểm tra kết quả migration...
    
    REM Kiểm tra kết quả
    set "checkQuery=SELECT id_loai_tuyen, ten_loai, la_khu_hoi, CASE WHEN id_loai_tuyen = 1 THEN 'ĐÓN SÂN BAY' WHEN id_loai_tuyen = 2 THEN 'TIỄN SÂN BAY' WHEN id_loai_tuyen = 3 THEN 'PHỐ 1 CHIỀU' WHEN id_loai_tuyen = 4 THEN 'PHỐ 2 CHIỀU' WHEN id_loai_tuyen = 5 THEN 'TỈNH/HUYỆN 1 CHIỀU' WHEN id_loai_tuyen = 6 THEN 'TỈNH/HUYỆN 2 CHIỀU' WHEN id_loai_tuyen = 7 THEN 'HƯỚNG SÂN BAY 5KM' ELSE 'Không xác định' END as loai_tuyen FROM loai_tuyen ORDER BY id_loai_tuyen;"
    
    if not "!Password!"=="" (
        echo !checkQuery! | mysql -u !Username! -p!Password! !DatabaseName!
    ) else (
        echo !checkQuery! | mysql -u !Username! !DatabaseName!
    )
    
    echo.
    echo 🎉 MIGRATION HOÀN THÀNH THÀNH CÔNG!
    echo ✅ Đã cập nhật 7 loại tuyến mới
    echo ✅ Đã tách riêng lịch 1 chiều và 2 chiều
    echo ✅ Đã xử lý điều kiện khoảng cách
    echo ✅ Đã hỗ trợ điểm float
    echo.
    echo 📋 Bước tiếp theo:
    echo 1. Chạy test để kiểm tra logic tính điểm: node test-route-types-integration.js
    echo 2. Kiểm tra frontend hoạt động bình thường
    echo 3. Tạo giao dịch mới để test tính điểm tự động
    
) else (
    echo ❌ Migration thất bại với exit code: %errorlevel%
    echo.
    
    REM Rollback nếu có backup
    if exist "!backupFile!" (
        echo 🔄 Thực hiện rollback từ backup...
        
        if not "!Password!"=="" (
            mysql -u !Username! -p!Password! !DatabaseName! < "!backupFile!"
        ) else (
            mysql -u !Username! !DatabaseName! < "!backupFile!"
        )
        
        if %errorlevel% equ 0 (
            echo ✅ Rollback thành công, database đã được khôi phục
        ) else (
            echo ❌ Rollback thất bại, cần khôi phục thủ công từ: !backupFile!
        )
    )
    
    pause
    exit /b 1
)

echo.
echo === HOÀN THÀNH ===
pause
