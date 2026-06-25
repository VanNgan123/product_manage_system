import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cartApi } from "../../api/cartApi";
import { categoryApi } from "../../api/categoryApi";
import { productApi } from "../../api/productApi";

const PAGE_SIZE = 20;

const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));
};

function ProductListPage() {
    const [urlSearchParams] = useSearchParams();
    const initialCategory = urlSearchParams.get("category") || "";

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState(initialCategory);
    const [searchParams, setSearchParams] = useState({ name: "", category: initialCategory });
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const fetchCategories = useCallback(async () => {
        try {
            const response = await categoryApi.getAll({ page_size: 100 });
            setCategories(response.data.data || []);
        } catch {
            // silent
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
                is_active: true,
            });
            setProducts(response.data.data || []);
            setCount(response.data.count || 0);
            setNext(response.data.next);
            setPrevious(response.data.previous);
        } catch {
            setError("Không thể tải danh sách sản phẩm.");
        } finally {
            setLoading(false);
        }
    }, [page, searchParams]);

    useEffect(() => {
        const timeoutId = window.setTimeout(fetchCategories, 0);
        return () => window.clearTimeout(timeoutId);
    }, [fetchCategories]);

    useEffect(() => {
        const timeoutId = window.setTimeout(fetchProducts, 0);
        return () => window.clearTimeout(timeoutId);
    }, [fetchProducts]);

    const handleSearch = () => {
        setPage(1);
        setSearchParams({ name: keyword.trim(), category: categoryId });
    };

    const handleCategoryFilter = (catId) => {
        const newCatId = catId === categoryId ? "" : catId;
        setCategoryId(newCatId);
        setPage(1);
        setSearchParams({ name: keyword.trim(), category: newCatId });
    };

    const handleAddToCart = async (product) => {
        try {
            setNotice("");
            await cartApi.addItem({ product: product.id, quantity: 1 });
            setNotice(`Đã thêm "${product.name}" vào giỏ hàng!`);
            setTimeout(() => setNotice(""), 3000);
        } catch (error) {
            setError(error.response?.data?.message || "Thêm vào giỏ hàng thất bại.");
            setTimeout(() => setError(""), 3000);
        }
    };

    const totalPages = Math.ceil(count / PAGE_SIZE);

    return (
        <div>
            {/* Page Banner */}
            <div style={{
                background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
                padding: "40px 24px",
                textAlign: "center",
                color: "#fff",
            }}>
                <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>
                    Cửa hàng
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "16px" }}>
                    Khám phá {count} sản phẩm chất lượng cao
                </p>
            </div>

            {/* Notices */}
            {notice && (
                <div style={{ maxWidth: "1280px", margin: "16px auto 0", padding: "0 24px" }}>
                    <div className="success-alert">{notice}</div>
                </div>
            )}
            {error && (
                <div style={{ maxWidth: "1280px", margin: "16px auto 0", padding: "0 24px" }}>
                    <div className="error-alert">{error}</div>
                </div>
            )}

            <div className="shop-layout">
                {/* Sidebar Filter */}
                <aside className="shop-sidebar">
                    <div className="shop-sidebar-card">
                        <div className="shop-sidebar-title">📂 Danh mục</div>
                        <div className="shop-sidebar-list">
                            <button
                                className={`shop-sidebar-item ${categoryId === "" ? "active" : ""}`}
                                onClick={() => handleCategoryFilter("")}
                            >
                                Tất cả sản phẩm
                            </button>
                            {categories.map((cat) => (
                                <button
                                    className={`shop-sidebar-item ${categoryId === String(cat.id) ? "active" : ""}`}
                                    key={cat.id}
                                    onClick={() => handleCategoryFilter(String(cat.id))}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="shop-content">
                    <div className="shop-toolbar">
                        <div className="shop-search-box">
                            <input
                                placeholder="Tìm kiếm sản phẩm..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <button onClick={handleSearch}>🔍 Tìm kiếm</button>
                        </div>
                        <div className="shop-result-count">
                            Hiển thị <strong>{products.length}</strong> / <strong>{count}</strong> sản phẩm
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-card">Đang tải sản phẩm...</div>
                    ) : products.length === 0 ? (
                        <div className="empty-card">
                            Không tìm thấy sản phẩm nào. Hãy thử tìm kiếm với từ khóa khác.
                        </div>
                    ) : (
                        <>
                            <div className="shop-grid">
                                {products.map((product) => (
                                    <div className="shop-card" key={product.id}>
                                        <div className="shop-card-img">
                                            <img
                                                src={product.image_url || "https://placehold.co/500x360/e2e8f0/94a3b8?text=Product"}
                                                alt={product.name}
                                            />
                                            <span className={`shop-card-badge ${product.quantity > 0 ? "in-stock" : "out-stock"}`}>
                                                {product.quantity > 0 ? `Còn ${product.quantity}` : "Hết hàng"}
                                            </span>
                                            <div className="shop-card-overlay">
                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="shop-card-overlay-btn"
                                                    title="Xem chi tiết"
                                                >
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="page-btn"
                                        disabled={!previous}
                                        onClick={() => setPage((c) => c - 1)}
                                    >
                                        ← Trang trước
                                    </button>
                                    <span className="page-number">
                                        Trang {page} / {totalPages}
                                    </span>
                                    <button
                                        className="page-btn"
                                        disabled={!next}
                                        onClick={() => setPage((c) => c + 1)}
                                    >
                                        Trang sau →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductListPage;
