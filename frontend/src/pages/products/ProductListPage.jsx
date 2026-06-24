import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { cartApi } from "../../api/cartApi";
import { categoryApi } from "../../api/categoryApi";
import { productApi } from "../../api/productApi";
import "../../styles/product-user.css";
import { flyToCart } from "../../utils/flyToCart";

const PAGE_SIZE = 12;

function ProductListPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [searchParams, setSearchParams] = useState({
        name: "",
        category: "",
    });

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const fetchCategories = useCallback(async () => {
        try {
            const response = await categoryApi.getAll({
                page_size: 100,
            });
            setCategories(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await productApi.getAll({
                name: searchParams.name || undefined,
                category: searchParams.category || undefined,
                page,
                page_size: PAGE_SIZE,
            });

            setProducts(response.data.data);
            setCount(response.data.count);
            setNext(response.data.next);
            setPrevious(response.data.previous);
        } catch {
            setError("Không thể tải danh sách sản phẩm.");
        } finally {
            setLoading(false);
        }
    }, [page, searchParams]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = () => {
        setPage(1);
        setSearchParams({
            name: keyword.trim(),
            category: categoryId,
        });
    };

    const handleAddToCart = async (product, imageElement) => {
        try {
            await cartApi.addItem({
                product: product.id,
                quantity: 1,
            });
            flyToCart(imageElement);
        } catch (error) {
            console.error("ADD CART ERROR:", error);

            console.log("Response:", error.response);
            console.log("Data:", error.response?.data);

            alert(
                error.response?.data?.message ||
                JSON.stringify(error.response?.data) ||
                "Không thể thêm vào giỏ hàng"
            );
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <div className="user-page-container">
            {/* FLOATING BACKGROUND ORBS (Giống trang Login) */}
            <div className="background-orb orb-1"></div>
            <div className="background-orb orb-2"></div>
            <div className="background-orb orb-3"></div>

            {/* HEADER GLASSMORPHISM */}
            <header className="user-header">
                <div className="header-logo">
                    <h2>PMS Store</h2>
                </div>
                <div className="header-actions">
                    <Link to="/cart" className="btn-icon btn-cart-header">
                        🛒 Giỏ hàng
                    </Link>
                    <button onClick={handleLogout} className="btn-icon btn-logout">
                        Đăng xuất 🚪
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="user-main-content">
                <div className="page-title">
                    <h1>Khám phá Sản Phẩm</h1>
                    <p>Những sản phẩm công nghệ mới nhất dành cho bạn</p>
                </div>

                <div className="search-card glassy-card">
                    <input
                        className="glassy-input"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <select
                        className="glassy-input"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id} style={{ color: '#000' }}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button className="btn-primary" onClick={handleSearch}>
                        Tìm kiếm
                    </button>
                </div>

                {loading && <div className="loading-state glassy-card">Đang tải sản phẩm...</div>}
                {error && <div className="error-alert glassy-card">{error}</div>}

                {!loading && (
                    <>
                        <div className="summary-text">
                            Tổng số sản phẩm: <strong>{count}</strong>
                        </div>

                        <div className="product-grid">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div key={product.id} className="product-card glassy-card">
                                        <div className="img-container">
                                            <img
                                                ref={(el) => (product.imageRef = el)}
                                                className="product-card-image"
                                                src={
                                                    product.image_url ||
                                                    "https://placehold.co/300x200/png?text=No+Image"
                                                }
                                                alt={product.name}
                                            />
                                        </div>

                                        <div className="product-card-body">
                                            <span className="product-category">
                                                {product.category_detail?.name || "Khác"}
                                            </span>
                                            <h3>{product.name}</h3>
                                            <div className="product-price">
                                                {formatPrice(product.price)}
                                            </div>

                                            <div className="product-actions">
                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="btn-secondary"
                                                >
                                                    Chi tiết
                                                </Link>
                                                <button
                                                    className="btn-primary"
                                                    onClick={() =>
                                                        handleAddToCart(product, product.imageRef)
                                                    }
                                                >
                                                    + Giỏ hàng
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state glassy-card">Không có sản phẩm nào.</div>
                            )}
                        </div>

                        <div className="pagination glassy-card">
                            <button
                                className="btn-secondary"
                                disabled={!previous}
                                onClick={() => setPage((prev) => prev - 1)}
                            >
                                ← Trước
                            </button>
                            <span className="page-number">Trang {page}</span>
                            <button
                                className="btn-secondary"
                                disabled={!next}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Sau →
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default ProductListPage;
