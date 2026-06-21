 # API Contract - Product Management System

## 1. Base URL

```text
http://localhost:8000/api
```

## 2. Authentication

### 2.1. Login

```http
POST /api/auth/login/
```

Body:

```json
{
  "username": "admin",
  "password": "your_password"
}
```

Response:

```json
{
  "refresh": "refresh_token",
  "access": "access_token"
}
```

Khi gọi các API thêm, sửa, xóa dữ liệu, frontend cần gửi header:

```http
Authorization: Bearer access_token
```

---

## 3. Category API

### 3.1. Lấy danh sách danh mục

```http
GET /api/categories/
```

Response:

```json
{
  "message": "Lấy danh sách danh mục thành công.",
  "count": 1,
  "next": null,
  "previous": null,
  "data": []
}
```

Frontend lấy danh sách category tại:

```js
response.data.data
```

### 3.2. Lấy chi tiết danh mục

```http
GET /api/categories/:id/
```

### 3.3. Thêm danh mục

```http
POST /api/categories/
```

Body:

```json
{
  "name": "Laptop",
  "description": "Danh mục laptop",
  "is_active": true
}
```

### 3.4. Cập nhật danh mục

```http
PUT /api/categories/:id/
```

Body:

```json
{
  "name": "Laptop",
  "description": "Danh mục laptop cao cấp",
  "is_active": true
}
```

### 3.5. Cập nhật một phần danh mục

```http
PATCH /api/categories/:id/
```

Body ví dụ:

```json
{
  "is_active": false
}
```

### 3.6. Xóa danh mục

```http
DELETE /api/categories/:id/
```

Lưu ý: Nếu danh mục đang có sản phẩm, backend sẽ không cho xóa.

---

## 4. Product API

### 4.1. Lấy danh sách sản phẩm

```http
GET /api/products/
```

Response:

```json
{
  "message": "Lấy danh sách sản phẩm thành công.",
  "count": 1,
  "next": null,
  "previous": null,
  "data": []
}
```

Frontend lấy danh sách product tại:

```js
response.data.data
```

### 4.2. Lấy chi tiết sản phẩm

```http
GET /api/products/:id/
```

### 4.3. Thêm sản phẩm

```http
POST /api/products/
```

Body:

```json
{
  "category": 1,
  "name": "MacBook Air M2",
  "sku": "MBA-M2-001",
  "description": "Laptop Apple MacBook Air M2",
  "price": "24990000",
  "quantity": 20,
  "image_url": "https://example.com/macbook.jpg",
  "is_active": true
}
```

### 4.4. Cập nhật sản phẩm

```http
PUT /api/products/:id/
```

Body:

```json
{
  "category": 1,
  "name": "MacBook Air M2",
  "sku": "MBA-M2-001",
  "description": "Laptop Apple MacBook Air M2",
  "price": "24990000",
  "quantity": 30,
  "image_url": "https://example.com/macbook.jpg",
  "is_active": true
}
```

### 4.5. Cập nhật một phần sản phẩm

```http
PATCH /api/products/:id/
```

Body ví dụ:

```json
{
  "quantity": 50
}
```

### 4.6. Xóa sản phẩm

```http
DELETE /api/products/:id/
```

---

## 5. Search, Filter, Pagination

### 5.1. Product

Tìm sản phẩm theo tên:

```http
GET /api/products/?name=macbook
```

Tìm theo mã SKU:

```http
GET /api/products/?sku=MBA
```

Lọc theo category ID:

```http
GET /api/products/?category=1
```

Lọc theo tên category:

```http
GET /api/products/?category_name=laptop
```

Lọc theo khoảng giá:

```http
GET /api/products/?min_price=10000000&max_price=30000000
```

Lọc theo trạng thái hoạt động:

```http
GET /api/products/?is_active=true
```

Sắp xếp theo giá tăng dần:

```http
GET /api/products/?ordering=price
```

Sắp xếp theo giá giảm dần:

```http
GET /api/products/?ordering=-price
```

Sắp xếp theo ngày tạo mới nhất:

```http
GET /api/products/?ordering=-created_at
```

Phân trang:

```http
GET /api/products/?page=1&page_size=20
```

### 5.2. Category

Tìm category theo tên:

```http
GET /api/categories/?name=laptop
```

Lọc theo trạng thái:

```http
GET /api/categories/?is_active=true
```

Sắp xếp theo ngày tạo mới nhất:

```http
GET /api/categories/?ordering=-created_at
```

Phân trang:

```http
GET /api/categories/?page=1&page_size=20
```

---

## 6. Frontend Note

Với API danh sách, backend trả dữ liệu theo cấu trúc:

```json
{
  "message": "Thông báo",
  "count": 10,
  "next": null,
  "previous": null,
  "data": []
}
```

Frontend cần lấy dữ liệu như sau:

```js
const items = response.data.data;
const total = response.data.count;
const next = response.data.next;
const previous = response.data.previous;
```

Không dùng:

```js
response.data.results
```

vì backend đã custom response và dùng key là:

```js
response.data.data
```

---

## 7. Swagger API Docs

Có thể xem tài liệu API tại:

```text
http://localhost:8000/api/docs/
```
