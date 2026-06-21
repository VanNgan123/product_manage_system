import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { categoryApi } from "../../api/categoryApi";
import { productApi } from "../../api/productApi";

function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [page, setPage] = useState(1);

    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCategories = async () => {
        const response = await categoryApi.getAll({
            page_size: 100,
        });

        setCategories(response.data.data);
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await productApi.getAll({
                name: keyword || undefined,
                category: categoryId || undefined,
                page,
                page_size: 20,
            });

            setProducts(response.data.data);
            setCount(response.data.count);
            setNext(response.data.next);
            setPrevious(response.data.previous);
        } catch (error) {
            setError("Không thể tải danh sách sản phẩm.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const handleSearch = () => {
        setPage(1);
        fetchProducts();
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");

        if (!confirmed) return;

        try {
            await productApi.remove(id);
            fetchProducts();
        } catch (error) {
            alert("Xóa sản phẩm thất bại.");
        }
    };

    return (
        <div>
            <h1>Quản lý sản phẩm</h1>

            <div>
                <input
                    placeholder="Tìm sản phẩm..."
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />

                <select
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <button onClick={handleSearch}>Tìm kiếm</button>

                <Link to="/products/create">Thêm sản phẩm</Link>
            </div>

            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>Tổng số: {count}</p>

            <table border="1" cellPadding="8" width="100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên sản phẩm</th>
                        <th>SKU</th>
                        <th>Danh mục</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tồn kho</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.sku}</td>
                            <td>{product.category_detail?.name}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.stock_status}</td>
                            <td>{product.is_active ? "Hoạt động" : "Ẩn"}</td>
                            <td>
                                <Link to={`/products/${product.id}/edit`}>Sửa</Link>
                                {" | "}
                                <button onClick={() => handleDelete(product.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: "16px" }}>
                <button
                    disabled={!previous}
                    onClick={() => setPage((currentPage) => currentPage - 1)}
                >
                    Trang trước
                </button>

                <span style={{ margin: "0 12px" }}>Trang {page}</span>

                <button
                    disabled={!next}
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
}

export default ProductListPage;
