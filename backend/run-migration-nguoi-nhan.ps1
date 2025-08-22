# PowerShell script để chạy migration thêm cột id_nguoi_nhan vào bảng lich_xe
# Chạy với quyền Administrator

Write-Host "=== Migration: Thêm cột id_nguoi_nhan vào bảng lich_xe ===" -ForegroundColor Green

# Kiểm tra xem có file migration không
$migrationFile = "schema_db\update-lich-xe-add-nguoi-nhan.sql"
if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Không tìm thấy file migration: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Tìm thấy file migration: $migrationFile" -ForegroundColor Green

# Đọc nội dung SQL
$sqlContent = Get-Content $migrationFile -Raw
Write-Host "📄 Nội dung migration:" -ForegroundColor Yellow
Write-Host $sqlContent -ForegroundColor Cyan

# Hỏi người dùng có muốn tiếp tục không
$confirm = Read-Host "Bạn có muốn chạy migration này không? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ Đã hủy migration" -ForegroundColor Red
    exit 0
}

Write-Host "🚀 Bắt đầu chạy migration..." -ForegroundColor Green

try {
    # Chạy MySQL command
    $mysqlCommand = "mysql -u root -p -e `"source $migrationFile`" quanlydiem"
    Write-Host "🔧 Chạy lệnh: $mysqlCommand" -ForegroundColor Yellow
    
    # Thực thi lệnh
    Invoke-Expression $mysqlCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migration thành công!" -ForegroundColor Green
        Write-Host "📊 Bảng lich_xe đã được cập nhật với cột id_nguoi_nhan" -ForegroundColor Green
    } else {
        Write-Host "❌ Migration thất bại với exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Lỗi khi chạy migration: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🏁 Migration hoàn tất!" -ForegroundColor Green
