import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { categoryApi } from "../../api/categoryApi";
import { productApi } from "../../api/productApi";

const PAGE_SIZE = 20;
const ORDERING_BY_SORT = {
    newest: "-id",
    oldest: "id",
    priceAsc: "price",
    priceDesc: "-price",
};

function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [searchParams, setSearchParams] = useState({
        name: "",
        category: "",
    });

    const [filters, setFilters] = useState({
        sort: "newest",
        status: "",
        stock: "",
    });
    const [page, setPage] = useState(1);

    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCategories = useCallback(async () => {
        const response = await categoryApi.getAll({
            page_size: 100,
        });

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
    }, [
        filters.sort,
        filters.status,
        filters.stock,
        page,
        searchParams.category,
        searchParams.name,
    ]);

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
        setSearchParams({
            name: keyword.trim(),
            category: categoryId,
        });
    };

    const updateFilters = (changes) => {
        setPage(1);
        setFilters((currentFilters) => ({
            ...currentFilters,
            ...changes,
        }));
    };

    const resetFilters = () => {
        setKeyword("");
        setCategoryId("");
        setSearchParams({ name: "", category: "" });
        setFilters({
            sort: "newest",
            status: "",
            stock: "",
        });
        setPage(1);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");

        if (!confirmed) return;

        try {
            await productApi.remove(id);
            fetchProducts();
        } catch {
            alert("Xóa sản phẩm thất bại.");
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Quản lý sản phẩm</h1>
                    <p>Quản lý sản phẩm và tồn kho</p>
                </div>

                <Link
                    to="/products/create"
                    className="btn-primary"
                >
                    + Thêm sản phẩm
                </Link>
            </div>

            <div className="search-card">
                <input
                    className="search-input"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={keyword}
                    onChange={(event) =>
                        setKeyword(event.target.value)
                    }
                />

                <select
                    className="search-select"
                    value={categoryId}
                    onChange={(event) =>
                        setCategoryId(event.target.value)
                    }
                >
                    <option value="">
                        Tất cả danh mục
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>

                <button
                    className="btn-search"
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </button>
            </div>

            {loading && (
                <div className="loading-card">
                    Đang tải dữ liệu...
                </div>
            )}

            {error && (
                <div className="error-alert">
                    {error}
                </div>
            )}

            {!loading && (
                <>
                    {/* <div className="summary-card">
                        Tổng số sản phẩm:
                        <strong> {count}</strong>
                    </div> */}
                    <div className="summary-card">

                        <div className="summary-left">
                            Tổng số sản phẩm:
                            <strong>{count}</strong>
                        </div>

                        <div className="filter-group">

                            <button
                                className={
                                    filters.sort === "newest"
                                        ? "filter-btn active"
                                        : "filter-btn"
                                }
                                onClick={() => updateFilters({ sort: "newest" })}
                            >
                                Mới nhất
                            </button>

                            <button
                                className={
                                    filters.sort === "oldest"
                                        ? "filter-btn active"
                                        : "filter-btn"
                                }
                                onClick={() => updateFilters({ sort: "oldest" })}
                            >
                                Cũ nhất
                            </button>

                            <button
                                className={
                                    filters.sort === "priceAsc"
                                        ? "filter-btn active"
                                        : "filter-btn"
                                }
                                onClick={() => updateFilters({ sort: "priceAsc" })}
                            >
                                Giá ↑
                            </button>

                            <button
                                className={
                                    filters.sort === "priceDesc"
                                        ? "filter-btn active"
                                        : "filter-btn"
                                }
                                onClick={() => updateFilters({ sort: "priceDesc" })}
                            >
                                Giá ↓
                            </button>

                            <select
                                className="filter-select"
                                value={filters.status}
                                onChange={(e) => updateFilters({ status: e.target.value })}
                            >
                                <option value="">
                                    Tất cả trạng thái
                                </option>

                                <option value="true">
                                    Hoạt động
                                </option>

                                <option value="false">
                                    Ẩn
                                </option>
                            </select>

                            <select
                                className="filter-select"
                                value={filters.stock}
                                onChange={(e) => updateFilters({ stock: e.target.value })}
                            >
                                <option value="">
                                    Tất cả kho
                                </option>

                                <option value="in_stock">
                                    Còn hàng
                                </option>

                                <option value="low_stock">
                                    Sắp hết
                                </option>

                                <option value="out_of_stock">
                                    Hết hàng
                                </option>
                            </select>
                            <button
                                className="reset-filter-btn"
                                onClick={resetFilters}
                            >
                                Xóa lọc
                            </button>

                        </div>
                    </div>

                    <div className="table-card">
                        <table>
                            <thead>
                                <tr>
                                    <th>Ảnh</th>
                                    <th>Sản phẩm</th>
                                    <th>SKU</th>
                                    <th>Danh mục</th>
                                    <th>Giá</th>
                                    <th>SL</th>
                                    <th>Tồn kho</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <img
                                                    className="product-image"
                                                    src={
                                                        product.image_url &&
                                                            product.image_url.trim() !== ""
                                                            ? product.image_url
                                                            : "https://placehold.co/60x60/png?text=IMG"
                                                    }
                                                    alt={product.name}
                                                />
                                            </td>

                                            <td>
                                                <div className="product-name">
                                                    <strong>
                                                        {product.name}
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="sku-badge">
                                                    {product.sku}
                                                </span>
                                            </td>

                                            <td>
                                                {product.category_detail?.name}
                                            </td>

                                            <td className="price-cell">
                                                {formatPrice(
                                                    product.price
                                                )}
                                            </td>

                                            <td>
                                                {product.quantity}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        product.stock_status === "In stock"
                                                            ? "stock in-stock"
                                                            : product.stock_status === "Low stock"
                                                                ? "stock low-stock"
                                                                : "stock out-stock"
                                                    }
                                                >
                                                    {product.stock_status}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        product.is_active
                                                            ? "status active"
                                                            : "status inactive"
                                                    }
                                                >
                                                    {product.is_active
                                                        ? "Hoạt động"
                                                        : "Ẩn"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="action-buttons">
                                                    <Link
                                                        className="btn-edit"
                                                        to={`/products/${product.id}/edit`}
                                                    >
                                                        Sửa
                                                    </Link>

                                                    <button
                                                        className="btn-delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="empty-row"
                                        >
                                            Không có dữ liệu sản phẩm
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button
                            className="page-btn"
                            disabled={!previous}
                            onClick={() =>
                                setPage(
                                    (currentPage) =>
                                        currentPage - 1
                                )
                            }
                        >
                            ← Trang trước
                        </button>

                        <span className="page-number">
                            Trang {page}
                        </span>

                        <button
                            className="page-btn"
                            disabled={!next}
                            onClick={() =>
                                setPage(
                                    (currentPage) =>
                                        currentPage + 1
                                )
                            }
                        >
                            Trang sau →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ProductListPage;
