import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryApi } from "../../../api/categoryApi";
import { productApi } from "../../../api/productApi";

const PAGE_SIZE = 20;

const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));
};

function AdminProductListPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [searchParams, setSearchParams] = useState({ name: "", category: "" });
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCategories = useCallback(async () => {
        const response = await categoryApi.getAll({ page_size: 100 });
        setCategories(response.data.data || []);
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

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        try {
            await productApi.remove(id);
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || "Xóa sản phẩm thất bại.");
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Quản lý sản phẩm</h1>
                    <p>Thêm, sửa, xóa và theo dõi tồn kho</p>
                </div>
                <Link to="/admin/products/create" className="btn-primary">Thêm sản phẩm</Link>
            </div>

            <div className="search-card">
                <input
                    className="search-input"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && handleSearch()}
                />
                <select className="search-select" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <button className="btn-search" onClick={handleSearch}>Tìm kiếm</button>
            </div>

            {loading && <div className="loading-card">Đang tải dữ liệu...</div>}
            {error && <div className="error-alert">{error}</div>}

            {!loading && (
                <>
                    <div className="summary-card">
                        <span>Tổng số sản phẩm</span>
                        <strong>{count}</strong>
                    </div>

                    <div className="table-card">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên sản phẩm</th>
                                    <th>SKU</th>
                                    <th>Danh mục</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id}>
                                            <td>#{product.id}</td>
                                            <td><strong>{product.name}</strong></td>
                                            <td><span className="sku-badge">{product.sku}</span></td>
                                            <td>{product.category_detail?.name || "-"}</td>
                                            <td className="price-cell">{formatPrice(product.price)}</td>
                                            <td>{product.quantity}</td>
                                            <td>
                                                <span className={product.is_active ? "status active" : "status inactive"}>
                                                    {product.is_active ? "Hoạt động" : "Ẩn"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Link className="btn-edit" to={`/admin/products/${product.id}/edit`}>Sửa</Link>
                                                    <button className="btn-delete" onClick={() => handleDelete(product.id)}>Xóa</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="empty-row">Không có dữ liệu sản phẩm</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button className="page-btn" disabled={!previous} onClick={() => setPage((current) => current - 1)}>
                            Trang trước
                        </button>
                        <span className="page-number">Trang {page}</span>
                        <button className="page-btn" disabled={!next} onClick={() => setPage((current) => current + 1)}>
                            Trang sau
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminProductListPage;
