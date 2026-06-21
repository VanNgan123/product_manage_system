# Tai Lieu Du An Product Management System

## 1. Gioi thieu du an

Product Management System la he thong quan ly san pham duoc xay dung cho bai tap lon/cuoi khoa Intern Developer. Du an tap trung vao viec quan ly danh muc san pham, san pham, xac thuc nguoi dung va cung cap API cho frontend su dung.

He thong duoc thiet ke theo mo hinh client-server:

- Backend: Django REST Framework.
- Frontend: React Vite.
- Database: MySQL.
- DevOps: Docker va Docker Compose.
- Authentication: JWT.
- API documentation: drf-spectacular va Swagger UI.

## 2. Muc tieu

Muc tieu cua du an la tao ra mot ung dung quan ly san pham co cac chuc nang co ban:

- Dang nhap bang JWT.
- Quan ly danh muc san pham.
- Quan ly san pham.
- Tim kiem san pham.
- Loc san pham theo danh muc, gia, so luong va trang thai.
- Phan trang du lieu.
- Cung cap API ro rang de frontend tich hop.
- Chuan bi moi truong database bang Docker Compose.

## 3. Cong nghe su dung

| Thanh phan | Cong nghe |
|---|---|
| Backend | Django, Django REST Framework |
| Database | MySQL |
| Authentication | djangorestframework-simplejwt |
| API docs | drf-spectacular, Swagger UI |
| Filter | django-filter va custom filter |
| CORS | django-cors-headers |
| Environment | python-dotenv |
| DevOps | Docker, Docker Compose |
| Frontend | React Vite |

## 4. Cau truc thu muc

```text
product_manage_system/
|-- backend/
|   |-- config/
|   |   |-- settings.py
|   |   |-- urls.py
|   |   |-- asgi.py
|   |   `-- wsgi.py
|   |-- products/
|   |   |-- models.py
|   |   |-- serializers.py
|   |   |-- views.py
|   |   |-- urls.py
|   |   |-- filters.py
|   |   |-- pagination.py
|   |   |-- permissions.py
|   |   `-- admin.py
|   |-- manage.py
|   `-- requirements.txt
|-- frontend/
|-- docs/
|-- docker-compose.yml
|-- .env.example
`-- README.md
```

## 5. Mo hinh du lieu

### 5.1. Category

Bang Category dung de luu thong tin danh muc san pham.

| Truong | Kieu du lieu | Mo ta |
|---|---|---|
| id | BigAutoField | Khoa chinh |
| name | CharField | Ten danh muc, khong duoc trung |
| slug | SlugField | Duong dan than thien, tu dong tao tu ten |
| description | TextField | Mo ta danh muc |
| is_active | BooleanField | Trang thai hoat dong |
| created_at | DateTimeField | Thoi gian tao |
| updated_at | DateTimeField | Thoi gian cap nhat |

### 5.2. Product

Bang Product dung de luu thong tin san pham.

| Truong | Kieu du lieu | Mo ta |
|---|---|---|
| id | BigAutoField | Khoa chinh |
| category | ForeignKey | Danh muc cua san pham |
| name | CharField | Ten san pham |
| slug | SlugField | Duong dan than thien, tu dong tao tu ten va SKU |
| sku | CharField | Ma san pham, khong duoc trung |
| description | TextField | Mo ta san pham |
| price | DecimalField | Gia san pham |
| quantity | PositiveIntegerField | So luong ton kho |
| image_url | URLField | Duong dan hinh anh san pham |
| is_active | BooleanField | Trang thai hoat dong |
| created_at | DateTimeField | Thoi gian tao |
| updated_at | DateTimeField | Thoi gian cap nhat |

Product co them thuoc tinh `stock_status` de hien thi tinh trang ton kho:

- `Out of stock`: so luong bang 0.
- `Low stock`: so luong nho hon 10.
- `In stock`: so luong tu 10 tro len.

## 6. Chuc nang backend

### 6.1. Quan ly danh muc

Backend cung cap cac API CRUD cho danh muc:

- Lay danh sach danh muc.
- Lay chi tiet mot danh muc.
- Them danh muc moi.
- Cap nhat danh muc.
- Xoa danh muc.
- Tim kiem danh muc theo ten.
- Loc danh muc theo trang thai `is_active`.
- Sap xep theo id, ten, ngay tao va ngay cap nhat.

Khi xoa danh muc, he thong kiem tra neu danh muc van con san pham thi khong cho xoa.

### 6.2. Quan ly san pham

Backend cung cap cac API CRUD cho san pham:

- Lay danh sach san pham.
- Lay chi tiet mot san pham.
- Them san pham moi.
- Cap nhat san pham.
- Xoa san pham.
- Tim kiem theo ten hoac SKU.
- Loc theo danh muc.
- Loc theo ten danh muc.
- Loc theo khoang gia.
- Loc theo khoang so luong.
- Loc theo trang thai `is_active`.
- Sap xep theo id, ten, gia, so luong, ngay tao va ngay cap nhat.

### 6.3. Xac thuc va phan quyen

Du an su dung JWT de xac thuc nguoi dung.

- Cac request doc du lieu nhu `GET` duoc cho phep truy cap cong khai.
- Cac request ghi du lieu nhu `POST`, `PUT`, `PATCH`, `DELETE` yeu cau nguoi dung da dang nhap.

## 7. Danh sach API

Base URL mac dinh:

```text
http://localhost:8000/api/
```

### 7.1. Authentication

| Method | Endpoint | Mo ta |
|---|---|---|
| POST | `/api/auth/login/` | Dang nhap va lay access token, refresh token |
| POST | `/api/auth/refresh/` | Lam moi access token |

### 7.2. Category API

| Method | Endpoint | Mo ta |
|---|---|---|
| GET | `/api/categories/` | Lay danh sach danh muc |
| POST | `/api/categories/` | Tao danh muc moi |
| GET | `/api/categories/{id}/` | Lay chi tiet danh muc |
| PUT | `/api/categories/{id}/` | Cap nhat toan bo danh muc |
| PATCH | `/api/categories/{id}/` | Cap nhat mot phan danh muc |
| DELETE | `/api/categories/{id}/` | Xoa danh muc |

Query params ho tro:

| Tham so | Mo ta |
|---|---|
| `name` | Tim kiem danh muc theo ten |
| `is_active` | Loc theo trang thai |
| `ordering` | Sap xep du lieu |
| `page` | Trang hien tai |
| `page_size` | So ban ghi moi trang |

### 7.3. Product API

| Method | Endpoint | Mo ta |
|---|---|---|
| GET | `/api/products/` | Lay danh sach san pham |
| POST | `/api/products/` | Tao san pham moi |
| GET | `/api/products/{id}/` | Lay chi tiet san pham |
| PUT | `/api/products/{id}/` | Cap nhat toan bo san pham |
| PATCH | `/api/products/{id}/` | Cap nhat mot phan san pham |
| DELETE | `/api/products/{id}/` | Xoa san pham |

Query params ho tro:

| Tham so | Mo ta |
|---|---|
| `name` | Tim kiem san pham theo ten |
| `sku` | Tim kiem san pham theo SKU |
| `category` | Loc theo id danh muc |
| `category_name` | Loc theo ten danh muc |
| `min_price` | Loc gia nho nhat |
| `max_price` | Loc gia lon nhat |
| `min_quantity` | Loc so luong nho nhat |
| `max_quantity` | Loc so luong lon nhat |
| `is_active` | Loc theo trang thai |
| `ordering` | Sap xep du lieu |
| `page` | Trang hien tai |
| `page_size` | So ban ghi moi trang |

### 7.4. API documentation

| Endpoint | Mo ta |
|---|---|
| `/api/schema/` | OpenAPI schema |
| `/api/docs/` | Swagger UI |

## 8. Cau hinh moi truong

Du an su dung file `.env` de cau hinh cac bien moi truong.

Vi du cau hinh:

```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

MYSQL_DATABASE=product_management
MYSQL_USER=product_user
MYSQL_PASSWORD=product_password
MYSQL_ROOT_PASSWORD=root_password
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3307

CORS_ALLOWED_ORIGINS=http://localhost:5173
VITE_API_URL=http://localhost:8000/api
```

Luu y khi chay MySQL bang Docker Compose:

- File `.env` cho Docker Compose can nam o thu muc goc du an.
- Backend hien dang doc file `.env` trong thu muc `backend/`.
- Docker Compose map MySQL container tu port `3306` trong container ra port `3307` tren may host.
- Neu backend chay tren may host, nen dung `MYSQL_HOST=127.0.0.1` va `MYSQL_PORT=3307`.
- Neu backend chay trong Docker cung network voi service database, co the dung `MYSQL_HOST=db` va `MYSQL_PORT=3306`.

## 9. Huong dan cai dat va chay backend

### 9.1. Cai dat thu vien

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 9.2. Chay MySQL bang Docker Compose

Tu thu muc goc du an:

```powershell
docker compose up -d
```

### 9.3. Chay migration

```powershell
cd backend
.\venv\Scripts\python.exe manage.py migrate
```

### 9.4. Tao tai khoan admin

```powershell
.\venv\Scripts\python.exe manage.py createsuperuser
```

### 9.5. Chay server backend

```powershell
.\venv\Scripts\python.exe manage.py runserver
```

Backend se chay tai:

```text
http://localhost:8000/
```

## 10. Loi thuong gap

### 10.1. Access denied for user root

Loi:

```text
django.db.utils.OperationalError: (1045, "Access denied for user 'root'@'localhost' (using password: YES)")
```

Nguyen nhan thuong gap:

- Sai username hoac password MySQL trong `.env`.
- Backend dang ket noi nham vao MySQL local port `3306`.
- Database Docker cua project dang map ra port `3307` nhung backend lai cau hinh `MYSQL_PORT=3306`.
- Docker Desktop chua chay hoac container database chua duoc tao.

Cach xu ly:

- Kiem tra lai `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_HOST`, `MYSQL_PORT`.
- Neu dung Docker Compose cua project, chay `docker compose up -d`.
- Cau hinh backend ket noi toi `127.0.0.1:3307` khi backend chay ngoai Docker.

## 11. Ket luan

Product Management System dap ung cac chuc nang chinh cua mot he thong quan ly san pham gom quan ly danh muc, quan ly san pham, tim kiem, loc, phan trang va xac thuc JWT. Du an co cau truc ro rang, de mo rong va phu hop de tich hop voi frontend React Vite.
