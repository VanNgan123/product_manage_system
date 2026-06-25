import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cartApi } from "../api/cartApi";

function CustomerLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [cartCount, setCartCount] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const response = await cartApi.getCart();
                const items = response.data.data?.items || [];
                setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
            } catch {
                setCartCount(0);
            }
        };
        fetchCartCount();
    }, [location.pathname]);

    const userInitial = (user.first_name || user.username || "U").charAt(0).toUpperCase();

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* ===== HEADER ===== */}
            <header className="cust-header">
                <div className="cust-header-top">
                    🚀 Miễn phí vận chuyển cho đơn hàng từ 500.000₫ | Hotline: 0123-456-789
                </div>
                <div className="cust-header-main">
                    <Link to="/" className="cust-logo">
                        <div className="cust-logo-icon">R</div>
                        <div className="cust-logo-text">
                            Rainscales<span>Shop</span>
                        </div>
                    </Link>

                    <nav className="cust-nav">
                        <Link
                            to="/"
                            className={`cust-nav-link ${isActive("/") && location.pathname === "/" ? "active" : ""}`}
                        >
                            Trang chủ
                        </Link>
                        <Link
                            to="/products"
                            className={`cust-nav-link ${isActive("/products") ? "active" : ""}`}
                        >
                            Sản phẩm
                        </Link>
                        <Link
                            to="/my-orders"
                            className={`cust-nav-link ${isActive("/my-orders") ? "active" : ""}`}
                        >
                            Đơn hàng
                        </Link>
                    </nav>

                    <div className="cust-header-actions">
                        <Link to="/cart" className="cust-cart-btn">
                            🛒
                            {cartCount > 0 && (
                                <span className="cust-cart-badge">{cartCount}</span>
                            )}
                        </Link>

                        <div className="cust-user-info">
                            <div className="cust-user-avatar">{userInitial}</div>
                            <span className="cust-user-name">
                                {user.first_name || user.username || "User"}
                            </span>
                        </div>

                        <button className="cust-logout-btn" onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <main className="cust-main">
                <Outlet />
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="cust-footer">
                <div className="cust-footer-main">
                    <div className="cust-footer-brand">
                        <h3>Rainscales<span>Shop</span></h3>
                        <p>
                            Cửa hàng thể thao chuyên cung cấp các sản phẩm Pickleball chính hãng. 
                            Cam kết chất lượng, giá tốt nhất thị trường.
                        </p>
                        <div className="cust-footer-social">
                            <a href="#" aria-label="Facebook">📘</a>
                            <a href="#" aria-label="Instagram">📸</a>
                            <a href="#" aria-label="YouTube">📺</a>
                        </div>
                    </div>

                    <div className="cust-footer-col">
                        <h4>Liên kết</h4>
                        <ul>
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/products">Sản phẩm</Link></li>
                            <li><Link to="/my-orders">Đơn hàng</Link></li>
                            <li><Link to="/cart">Giỏ hàng</Link></li>
                        </ul>
                    </div>

                    <div className="cust-footer-col">
                        <h4>Hỗ trợ</h4>
                        <ul>
                            <li><a href="#">Hướng dẫn mua hàng</a></li>
                            <li><a href="#">Chính sách đổi trả</a></li>
                            <li><a href="#">Chính sách bảo hành</a></li>
                            <li><a href="#">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>

                    <div className="cust-footer-col">
                        <h4>Liên hệ</h4>
                        <ul>
                            <li><a href="#">📍 Đà Nẵng, Việt Nam</a></li>
                            <li><a href="#">📞 0123-456-789</a></li>
                            <li><a href="#">✉️ contact@rainscales.com</a></li>
                            <li><a href="#">🕐 8:00 - 22:00</a></li>
                        </ul>
                    </div>
                </div>

                <div className="cust-footer-bottom">
                    © {new Date().getFullYear()} Rainscales Shop. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default CustomerLayout;
