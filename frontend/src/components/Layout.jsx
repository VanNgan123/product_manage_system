import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>PMS</h2>
                    <span>Admin Dashboard</span>
                </div>

                <nav className="admin-menu">
                    <Link
                        to="/admin/products"
                        className={isActive("/admin/products") ? "admin-menu-item active" : "admin-menu-item"}
                    >
                        📦 Quản lý sản phẩm
                    </Link>

                    <Link
                        to="/admin/categories"
                        className={isActive("/admin/categories") ? "admin-menu-item active" : "admin-menu-item"}
                    >
                        📂 Quản lý danh mục
                    </Link>

                    <Link
                        to="/admin/orders"
                        className={isActive("/admin/orders") ? "admin-menu-item active" : "admin-menu-item"}
                    >
                        📋 Quản lý đơn hàng
                    </Link>
                </nav>

                <button className="admin-logout-btn" onClick={handleLogout}>
                    Đăng xuất
                </button>
            </aside>

            <div className="admin-main">
                <header className="admin-header">
                    <h1>Admin Dashboard</h1>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
