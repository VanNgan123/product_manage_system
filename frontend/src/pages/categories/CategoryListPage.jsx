import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryApi } from "../../api/categoryApi";

const PAGE_SIZE = 20;

function CategoryListPage() {
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await categoryApi.getAll({
                name: searchTerm || undefined,
                page,
                page_size: PAGE_SIZE,
            });

            setCategories(response.data.data || []);
            setCount(response.data.count || 0);
            setNext(response.data.next);
            setPrevious(response.data.previous);
        } catch {
            setError("Không thể tải danh sách danh mục.");
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm]);

    useEffect(() => {
        const timeoutId = window.setTimeout(fetchCategories, 0);
        return () => window.clearTimeout(timeoutId);
    }, [fetchCategories]);

    const handleSearch = () => {
        setPage(1);
        setSearchTerm(keyword.trim());
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

        try {
            await categoryApi.remove(id);
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || "Xóa danh mục thất bại.");
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Quản lý danh mục</h1>
                    <p>Tìm kiếm, thêm, sửa và xóa danh mục sản phẩm</p>
                </div>

                <Link to="/admin/categories/create" className="btn-primary">
                    Thêm danh mục
                </Link>
            </div>

            <div className="search-card">
                <input
                    className="search-input"
                    placeholder="Tìm kiếm danh mục..."
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && handleSearch()}
                />
                <button className="btn-search" onClick={handleSearch}>Tìm kiếm</button>
            </div>

            {loading && <div className="loading-card">Đang tải dữ liệu...</div>}
            {error && <div className="error-alert">{error}</div>}

            {!loading && (
                <>
                    <div className="summary-card">
                        <span>Tổng số danh mục</span>
                        <strong>{count}</strong>
                    </div>

                    <div className="table-card">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên danh mục</th>
                                    <th>Mô tả</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <tr key={category.id}>
                                            <td>#{category.id}</td>
                                            <td><strong>{category.name}</strong></td>
                                            <td>{category.description || "-"}</td>
                                            <td>
                                                <span className={category.is_active ? "status active" : "status inactive"}>
                                                    {category.is_active ? "Hoạt động" : "Ẩn"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Link className="btn-edit" to={`/admin/categories/${category.id}/edit`}>
                                                        Sửa
                                                    </Link>
                                                    <button className="btn-delete" onClick={() => handleDelete(category.id)}>
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="empty-row">Không có dữ liệu</td>
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

export default CategoryListPage;
