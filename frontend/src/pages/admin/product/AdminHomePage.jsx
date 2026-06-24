

// export default AdminHomePage;
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { categoryApi } from "../../../api/categoryApi";
import { productApi } from "../../../api/productApi";

const PAGE_SIZE = 20;
const ORDERING_BY_SORT = {
    newest: "-id",
    oldest: "id",
    priceAsc: "price",
    priceDesc: "-price",
};

function AdminHomePage() {
    // === THÔNG TIN SẢN PHẨM & DANH MỤC ===
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // === TÌM KIẾM & LỌC ===
    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [searchParams, setSearchParams] = useState({ name: "", category: "" });
    const [filters, setFilters] = useState({ sort: "newest", status: "", stock: "" });

    // === PHÂN TRANG ===
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);

    // === TRẠNG THÁI UI ===
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCategories = useCallback(async () => {
        const response = await categoryApi.getAll({ page_size: 100 });
        setCategories(response.data.data);
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await productApi.getAll({
                name: searchParams.name || undefined,
                category: searchParams.category || undefined,
                is_active: filters.status || undefined,
                stock_status: filters.stock || undefined,
                ordering: ORDERING_BY_SORT[filters.sort],
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
    }, [filters.sort, filters.status, filters.stock, page, searchParams.category, searchParams.name]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = () => {
        setPage(1);
        setSearchParams({ name: keyword.trim(), category: categoryId });
    };

    const updateFilters = (changes) => {
        setPage(1);
        setFilters((currentFilters) => ({ ...currentFilters, ...changes }));
    };

    const resetFilters = () => {
        setKeyword("");
        setCategoryId("");
        setSearchParams({ name: "", category: "" });
        setFilters({ sort: "newest", status: "", stock: "" });
        setPage(1);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            await productApi.remove(id);
            fetchProducts();
        } catch {
            alert("Xóa sản phẩm thất bại.");
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <div>
                    <h1>Quản lý sản phẩm</h1>
                    <p className="admin-subtitle">Danh sách tất cả sản phẩm và tồn kho trong hệ thống</p>
                </div>
                <Link to="/admin/products/create" className="btn-add-new">+ Thêm sản phẩm mới</Link>
            </div>

            <div className="admin-filters-card">
                <div className="search-group">
                    <input className="admin-input" placeholder="Nhập tên..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    <select className="admin-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">Tất cả danh mục</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button className="btn-search-admin" onClick={handleSearch}>🔍 Tìm kiếm</button>
                </div>
                <div className="filter-group">
                    {/* ... (Các nút Sort và Dropdown filter giữ nguyên y hệt cũ, mình rút gọn để bạn dễ nhìn cấu trúc) ... */}
                    <div className="sort-buttons">
                        <button className={`filter-btn ${filters.sort === "newest" ? "active" : ""}`} onClick={() => updateFilters({ sort: "newest" })}>Mới nhất</button>
                        <button className={`filter-btn ${filters.sort === "oldest" ? "active" : ""}`} onClick={() => updateFilters({ sort: "oldest" })}>Cũ nhất</button>
                        <button className={`filter-btn ${filters.sort === "priceAsc" ? "active" : ""}`} onClick={() => updateFilters({ sort: "priceAsc" })}>Giá ↑</button>
                        <button className={`filter-btn ${filters.sort === "priceDesc" ? "active" : ""}`} onClick={() => updateFilters({ sort: "priceDesc" })}>Giá ↓</button>
                    </div>
                    <div className="dropdown-filters">
                        <button className="btn-reset" onClick={resetFilters}>Xóa lọc</button>
                    </div>
                </div>
            </div>

            {loading && <div className="admin-message">Đang tải dữ liệu...</div>}
            {error && <div className="admin-message error">{error}</div>}

            {!loading && !error && (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Ảnh</th><th>Sản phẩm</th><th>Danh mục</th><th>Giá bán</th><th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="img-wrapper">
                                            <img src={product.image_url || "https://placehold.co/60"} alt="" />
                                        </div>
                                    </td>
                                    <td><div className="td-product-name">{product.name}</div></td>
                                    <td>{product.category_detail?.name || "Khác"}</td>
                                    <td className="td-price">{formatPrice(product.price)}</td>
                                    <td>
                                        <div className="td-actions">
                                            <Link to={`/admin/products/${product.id}/edit`} className="action-btn edit">✏️ Sửa</Link>
                                            <button onClick={() => handleDelete(product.id)} className="action-btn delete">🗑️ Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="5">Không có sản phẩm.</td></tr>}
                        </tbody>
                    </table>

                    {/* Phân trang */}
                    <div className="admin-pagination">
                        <button className="page-btn" disabled={!previous} onClick={() => setPage(p => p - 1)}>← Trước</button>
                        <span className="page-indicator">Trang {page}</span>
                        <button className="page-btn" disabled={!next} onClick={() => setPage(p => p + 1)}>Sau →</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminHomePage;
