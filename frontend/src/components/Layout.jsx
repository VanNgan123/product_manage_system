import { Link, Outlet, useNavigate } from "react-router-dom";

function Layout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <aside style={{ width: "220px", borderRight: "1px solid #ddd", padding: "16px" }}>
                <h2>Product Manager</h2>

                <nav>
                    <p>
                        <Link to="/products">Sản phẩm</Link>
                    </p>
                    <p>
                        <Link to="/categories">Danh mục</Link>
                    </p>
                </nav>

                <button onClick={handleLogout}>Đăng xuất</button>
            </aside>

            <main style={{ flex: 1, padding: "24px" }}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
