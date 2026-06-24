import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// Đảm bảo đường dẫn CSS này trỏ đúng tới file CSS của bạn
import "../styles/product-admin.css";

function Layout() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    return (
        <div className="layout">
            {/* CỘT SIDEBAR BÊN TRÁI */}
            <aside className="sidebar">
                <div className="logo">
                    <h2>PMS</h2>
                    <span>Product Manager System</span>
                </div>

                <nav className="menu">
                    {/* 1. MỤC SẢN PHẨM */}
                    <Link
                        to="/admin"
                        className={
                            location.pathname === "/admin" || location.pathname.includes("/admin/products")
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >
                        📦 Sản phẩm
                    </Link>

                    {/* 2. MỤC DANH MỤC */}
                    <Link
                        to="/admin/categories"
                        className={
                            location.pathname.includes("/admin/categories")
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >
                        📁 Danh mục
                    </Link>

                    {/* 3. MỤC ĐƠN HÀNG (MỚI THÊM) */}
                    <Link
                        to="/admin/orders"
                        className={
                            location.pathname.includes("/admin/orders")
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >
                        🧾 Đơn hàng
                    </Link>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    Đăng xuất
                </button>
            </aside>

            {/* CỘT NỘI DUNG CHÍNH BÊN PHẢI */}
            <div className="main">
                <header className="header">
                    <h1>Product Management Dashboard</h1>
                </header>

                <main className="content">
                    {/* Bất kỳ trang nào (Sản phẩm, Danh mục, Đơn hàng) đều sẽ được render tại đây */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
