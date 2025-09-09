# Logic Hủy Giao Dịch - Cập nhật

## Vấn đề cũ
Khi hủy giao dịch giao lịch, chỉ có giao dịch chính được đổi trạng thái sang `da_huy`, nhưng:
- Giao dịch đối ứng (Nhận lịch) vẫn giữ trạng thái `cho_xac_nhan`
- Lịch xe đi kèm bị xóa thay vì chuyển sang trạng thái `da_huy`

## Giải pháp mới
### Khi hủy giao dịch giao lịch (`id_loai_giao_dich = 1`):

1. **Tìm và hủy giao dịch đối ứng**:
   - Sử dụng `Transaction.findOppositeTransaction()` để tìm giao dịch "Nhận lịch" tương ứng
   - Cập nhật trạng thái giao dịch đối ứng thành `da_huy`

2. **Cập nhật trạng thái lịch xe**:
   - Thay vì xóa lịch xe, cập nhật trạng thái thành `da_huy`
   - Giữ lại lịch xe để có thể theo dõi lịch sử

3. **Hủy giao dịch chính**:
   - Cập nhật trạng thái giao dịch "Giao lịch" thành `da_huy`

### Khi hủy giao dịch khác:
- Chỉ hủy giao dịch được chọn
- Không ảnh hưởng đến giao dịch khác

## Thông báo
### Cho người giao lịch:
```
"Giao dịch giao lịch của bạn đã bị hủy bởi [tên]. Cả giao dịch "Nhận lịch" và lịch xe đã được hủy."
```

### Cho người nhận lịch:
```
"Giao dịch nhận lịch của bạn đã bị hủy bởi [tên]. Lịch xe đã được hủy."
```

### Cho người nhận giao dịch khác:
```
"Giao dịch từ [tên] đã bị hủy"
```

## Response API
```json
{
  "success": true,
  "message": "Hủy giao dịch thành công. Cả giao dịch "Nhận lịch" và lịch xe đã được hủy.",
  "data": {
    "cancelledTransaction": {
      "id": 123,
      "type": "main"
    },
    "cancelledOppositeTransaction": {
      "id": 124,
      "type": "opposite"
    },
    "cancelledSchedule": {
      "id": 85,
      "status": "da_huy"
    }
  }
}
```

## Lợi ích
1. **Tính nhất quán**: Cả 2 giao dịch cùng được hủy
2. **Lịch sử đầy đủ**: Lịch xe không bị xóa, chỉ chuyển trạng thái
3. **Thông báo rõ ràng**: Người dùng biết chính xác những gì đã xảy ra
4. **Dễ debug**: Có thể theo dõi toàn bộ quá trình trong logs

## Files đã thay đổi
- `backend/controllers/transactionController.js` - Logic hủy giao dịch
- `README-TRANSACTION-CANCELLATION-LOGIC.md` - Tài liệu này

## Kiểm tra sau khi deploy
1. Tạo giao dịch giao lịch
2. Hủy giao dịch từ cả 2 phía (người giao và người nhận)
3. Kiểm tra:
   - Giao dịch chính có `trang_thai = 'da_huy'`
   - Giao dịch đối ứng có `trang_thai = 'da_huy'`
   - Lịch xe có `trang_thai = 'da_huy'`
   - Thông báo được gửi đúng cho cả 2 bên
