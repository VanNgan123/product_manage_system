# Backend notes

1. `.env` lưu cấu hình thật và không được đẩy lên GitHub.
2. `.env.example` chỉ liệt kê các biến môi trường cần thiết và dùng giá trị minh họa.
3. Không công khai `SECRET_KEY`, `DATABASE_URL`, tên người dùng hoặc mật khẩu.
4. Django dùng `SECRET_KEY` cho các tác vụ ký mật mã như session và token.
5. `DEBUG=True` chỉ dùng trong môi trường local/dev; production phải dùng `DEBUG=False`.
6. `ALLOWED_HOSTS` giới hạn domain/IP được phép phục vụ bởi backend.
7. Các môi trường thường dùng gồm dev, test, staging/UAT và production.
8. Logging ghi lại lỗi và thông tin vận hành để hỗ trợ theo dõi, debug.
9. API mới chuẩn hóa response qua `success_response` và `error_response`.
10. Custom exception handler giúp lỗi do Django REST Framework trả về cùng một cấu trúc.

## API mới

- `POST /api/auth/register/`
- `GET /api/auth/me/`
- `GET /api/cart/`
- `GET|POST /api/cart/items/`
- `PATCH|DELETE /api/cart/items/{id}/`
- `POST /api/checkout/`
- `GET /api/orders/`
- `GET /api/orders/{id}/`
- `PATCH /api/orders/{id}/status/` (admin)

Các API ghi product/category chỉ dành cho tài khoản có `is_staff=True`. API đọc vẫn công khai.

## Hiệu năng và phiên đăng nhập

- `DB_CONN_MAX_AGE` quy định số giây Django tái sử dụng kết nối database; mặc định là 60 giây.
- `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` và `JWT_REFRESH_TOKEN_LIFETIME_DAYS` cấu hình tuổi token; mặc định lần lượt là 60 phút và 7 ngày.
- Danh sách sản phẩm dùng phân trang server-side với 20 bản ghi mỗi trang. Search, category, trạng thái, tồn kho và sắp xếp đều được gửi lên backend.
- Frontend chỉ xóa phiên khi refresh token thực sự không hợp lệ (`400/401`). Lỗi mạng và lỗi server tạm thời không tự động đăng xuất.
- Nhiều request cùng gặp `401` dùng chung một request refresh, tránh race condition.
- Để giảm thêm độ trễ vật lý, môi trường dev nên dùng PostgreSQL local hoặc database ở khu vực gần Việt Nam. Việc chuyển vùng cần một database đích và kế hoạch migrate dữ liệu, không thể giải quyết chỉ bằng thay đổi mã nguồn.
