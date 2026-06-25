import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cartApi } from "../api/cartApi";
import { categoryApi } from "../api/categoryApi";
import { productApi } from "../api/productApi";

const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));
};

const categoryIcons = ["🏸", "🎾", "⚽", "🏀", "🏐", "🎯", "🏓", "🎱", "🏊", "🚴"];

function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [prodRes, catRes] = await Promise.all([
                    productApi.getAll({ page: 1, page_size: 8, is_active: true }),
                    categoryApi.getAll({ page_size: 100 }),
                ]);
                setProducts(prodRes.data.data || []);
                setCategories(catRes.data.data || []);
            } catch {
                // silent
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddToCart = async (product) => {
        try {
            setNotice("");
            setError("");
            await cartApi.addItem({ product: product.id, quantity: 1 });
            setNotice(`Đã thêm "${product.name}" vào giỏ hàng!`);
            setTimeout(() => setNotice(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Thêm vào giỏ hàng thất bại.");
            setTimeout(() => setError(""), 3000);
        }
    };

    return (
        <div>
            {/* ===== HERO ===== */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="hero-badge">🔥 Ưu đãi đặc biệt</div>
                        <h1>
                            Mua sắm thể thao<br />
                            <span>chất lượng hàng đầu</span>
                        </h1>
                        <p>
                            Khám phá bộ sưu tập vợt, bóng và phụ kiện Pickleball chính hãng. 
                            Cam kết giá tốt nhất, giao hàng nhanh trên toàn quốc.
                        </p>
                        <div className="hero-actions">
                            <Link to="/products" className="hero-btn-primary">
                                🛍️ Mua sắm ngay
                            </Link>
                            <Link to="/products" className="hero-btn-secondary">
                                Xem bộ sưu tập →
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div>
                                <span className="hero-stat-value">500+</span>
                                <span className="hero-stat-label">Sản phẩm</span>
                            </div>
                            <div>
                                <span className="hero-stat-value">10K+</span>
                                <span className="hero-stat-label">Khách hàng</span>
                            </div>
                            <div>
                                <span className="hero-stat-value">99%</span>
                                <span className="hero-stat-label">Hài lòng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== NOTICE ===== */}
            {notice && (
                <div style={{ maxWidth: "1280px", margin: "16px auto", padding: "0 24px" }}>
                    <div className="success-alert">{notice}</div>
                </div>
            )}
            {error && (
                <div style={{ maxWidth: "1280px", margin: "16px auto", padding: "0 24px" }}>
                    <div className="error-alert">{error}</div>
                </div>
            )}

            {/* ===== CATEGORIES ===== */}
            {categories.length > 0 && (
                <section className="section">
                    <div className="section-header">
                        <h2>Danh mục sản phẩm</h2>
                        <p>Tìm kiếm theo danh mục yêu thích của bạn</p>
                    </div>
                    <div className="category-grid">
                        {categories.map((cat, index) => (
                            <Link
                                to={`/products?category=${cat.id}`}
                                className="category-card"
                                key={cat.id}
                            >
                                <div className="category-card-icon">
                                    {categoryIcons[index % categoryIcons.length]}
                                </div>
                                <h3>{cat.name}</h3>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ===== FEATURED PRODUCTS ===== */}
            <section className="section" style={{ background: "var(--gray-50)" }}>
                <div className="section-header">
                    <h2>Sản phẩm nổi bật</h2>
                    <p>Những sản phẩm được yêu thích nhất</p>
                </div>

                {loading ? (
                    <div className="loading-card">Đang tải sản phẩm...</div>
                ) : (
                    <div className="shop-grid">
                        {products.map((product) => (
                            <div className="shop-card" key={product.id}>
                                <div className="shop-card-img">
                                    <img
                                        src={product.image_url || "https://placehold.co/500x360/e2e8f0/94a3b8?text=Product"}
                                        alt={product.name}
                                    />
                                    <span className={`shop-card-badge ${product.quantity > 0 ? "in-stock" : "out-stock"}`}>
                                        {product.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                                    </span>
                                    <div className="shop-card-overlay">
                                        <Link to={`/products/${product.id}`} className="shop-card-overlay-btn" title="Xem chi tiết">
                                            👁️
                                        </Link>
                                        <button
                                            className="shop-card-overlay-btn"
                                            title="Thêm vào giỏ"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.quantity <= 0}
                                        >
                                            🛒
                                        </button>
                                    </div>
                                </div>
                                <div className="shop-card-body">
                                    <div className="shop-card-category">
                                        {product.category_detail?.name || "Chưa phân loại"}
                                    </div>
                                    <div className="shop-card-name">{product.name}</div>
                                    <div className="shop-card-price">
                                        <strong>{formatPrice(product.price)}</strong>
                                        <button
                                            className="shop-card-add-btn"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.quantity <= 0}
                                        >
                                            + Giỏ hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ textAlign: "center", marginTop: "32px" }}>
                    <Link to="/products" className="hero-btn-primary" style={{ display: "inline-flex" }}>
                        Xem tất cả sản phẩm →
                    </Link>
                </div>
            </section>

            {/* ===== PROMO BANNER ===== */}
            <section className="promo-banner">
                <div className="promo-content">
                    <h2>🎁 Ưu đãi lên đến 30% cho thành viên mới!</h2>
                    <p>Đăng ký tài khoản và nhận ngay mã giảm giá cho đơn hàng đầu tiên.</p>
                    <Link to="/products" className="hero-btn-secondary" style={{ borderColor: "rgba(255,255,255,.3)" }}>
                        Mua sắm ngay →
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
