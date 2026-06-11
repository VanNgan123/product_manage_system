# Product Management System

## 1. Giới thiệu

Product Management System là project nhóm cuối khóa Intern Developer.

Project gồm:

- Backend: Django REST Framework
- Frontend: React Vite
- Database: MySQL
- DevOps: Docker, Docker Compose
- CI: GitHub Actions

## 2. Thành viên nhóm

| Thành viên | Vai trò |
|---|---|
| Nguyễn Văn Ngân | Backend, MySQL, Docker, GitHub Actions CI, Git workflow |
| Hồ Văn Quý | Frontend Product Management |
| Phan Phúc Toàn | Frontend Auth, Category Management, Layout |

## 3. Chức năng chính

- Login bằng JWT
- CRUD Product
- CRUD Category
- Search Product
- Filter Product theo Category
- Pagination
- GitHub Actions CI
- Demo cuối khóa

## 4. Cấu trúc thư mục

```bash
product-management-system/
│
├── backend/
├── frontend/
├── docs/
├── .github/
│   └── workflows/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md