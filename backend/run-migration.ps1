# Script chạy migration cập nhật loại tuyến
# Xử lý ràng buộc khóa ngoại và map dữ liệu cũ

param(
    [string]$DatabaseName = "quanlydiem",
    [string]$Username = "root",
    [string]$Password = ""
)

Write-Host "=== MIGRATION: CẬP NHẬT LOẠI TUYẾN CHO TÍNH ĐIỂM ===" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra MySQL có sẵn không
try {
    $mysqlVersion = mysql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MySQL đã sẵn sàng: $mysqlVersion" -ForegroundColor Green
    } else {
        throw "MySQL không có sẵn"
    }
} catch {
    Write-Host "❌ Lỗi: MySQL không có sẵn hoặc không thể kết nối" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt MySQL và đảm bảo mysql command có sẵn trong PATH" -ForegroundColor Yellow
    exit 1
}

# Tạo backup trước khi migration
$backupFile = "backup_before_migration_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
Write-Host "📦 Tạo backup database..." -ForegroundColor Yellow

if ($Password) {
    mysqldump -u $Username -p$Password $DatabaseName > $backupFile
} else {
    mysqldump -u $Username $DatabaseName > $backupFile
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backup thành công: $backupFile" -ForegroundColor Green
} else {
    Write-Host "⚠️ Cảnh báo: Không thể tạo backup, nhưng vẫn tiếp tục migration" -ForegroundColor Yellow
}

# Chạy migration
Write-Host ""
Write-Host "🚀 Bắt đầu migration..." -ForegroundColor Cyan
Write-Host "File migration: update-route-types.sql" -ForegroundColor White

try {
    if ($Password) {
        mysql -u $Username -p$Password $DatabaseName < "schema_db/update-route-types.sql"
    } else {
        mysql -u $Username $DatabaseName < "schema_db/update-route-types.sql"
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migration thành công!" -ForegroundColor Green
        Write-Host ""
        
        # Kiểm tra kết quả
        Write-Host "🔍 Kiểm tra kết quả migration..." -ForegroundColor Cyan
        
        $checkQuery = @"
SELECT 
    id_loai_tuyen,
    ten_loai,
    la_khu_hoi,
    CASE 
        WHEN id_loai_tuyen = 1 THEN 'ĐÓN SÂN BAY'
        WHEN id_loai_tuyen = 2 THEN 'TIỄN SÂN BAY'
        WHEN id_loai_tuyen = 3 THEN 'PHỐ 1 CHIỀU'
        WHEN id_loai_tuyen = 4 THEN 'PHỐ 2 CHIỀU'
        WHEN id_loai_tuyen = 5 THEN 'TỈNH/HUYỆN 1 CHIỀU'
        WHEN id_loai_tuyen = 6 THEN 'TỈNH/HUYỆN 2 CHIỀU'
        WHEN id_loai_tuyen = 7 THEN 'HƯỚNG SÂN BAY 5KM'
        ELSE 'Không xác định'
    END as loai_tuyen
FROM loai_tuyen 
ORDER BY id_loai_tuyen;
"@

        if ($Password) {
            echo $checkQuery | mysql -u $Username -p$Password $DatabaseName
        } else {
            echo $checkQuery | mysql -u $Username $DatabaseName
        }

        Write-Host ""
        Write-Host "🎉 MIGRATION HOÀN THÀNH THÀNH CÔNG!" -ForegroundColor Green
        Write-Host "✅ Đã cập nhật 7 loại tuyến mới" -ForegroundColor Green
        Write-Host "✅ Đã tách riêng lịch 1 chiều và 2 chiều" -ForegroundColor Green
        Write-Host "✅ Đã xử lý điều kiện khoảng cách" -ForegroundColor Green
        Write-Host "✅ Đã hỗ trợ điểm float" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Bước tiếp theo:" -ForegroundColor Cyan
        Write-Host "1. Chạy test để kiểm tra logic tính điểm: node test-route-types-integration.js" -ForegroundColor White
        Write-Host "2. Kiểm tra frontend hoạt động bình thường" -ForegroundColor White
        Write-Host "3. Tạo giao dịch mới để test tính điểm tự động" -ForegroundColor White
        
    } else {
        throw "Migration thất bại với exit code: $LASTEXITCODE"
    }

} catch {
    Write-Host "❌ Lỗi migration: $_" -ForegroundColor Red
    Write-Host ""
    
    # Rollback nếu có backup
    if (Test-Path $backupFile) {
        Write-Host "🔄 Thực hiện rollback từ backup..." -ForegroundColor Yellow
        
        try {
            if ($Password) {
                mysql -u $Username -p$Password $DatabaseName < $backupFile
            } else {
                mysql -u $Username $DatabaseName < $backupFile
            }
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Rollback thành công, database đã được khôi phục" -ForegroundColor Green
            } else {
                Write-Host "❌ Rollback thất bại, cần khôi phục thủ công từ: $backupFile" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ Lỗi rollback: $_" -ForegroundColor Red
            Write-Host "Cần khôi phục thủ công từ: $backupFile" -ForegroundColor Yellow
        }
    }
    
    exit 1
}

Write-Host ""
Write-Host "=== HOÀN THÀNH ===" -ForegroundColor Cyan
