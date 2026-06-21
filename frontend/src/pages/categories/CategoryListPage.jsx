import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryApi } from "../../api/categoryApi";

function CategoryListPage() {
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);

    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await categoryApi.getAll({
                name: keyword || undefined,
                page,
                page_size: 20,
            });

            setCategories(response.data.data);
            setCount(response.data.count);
            setNext(response.data.next);
            setPrevious(response.data.previous);
        } catch (error) {
            setError("Không thể tải danh sách danh mục.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [page]);

    const handleSearch = () => {
        setPage(1);
        fetchCategories();
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa danh mục này?");

        if (!confirmed) return;

        try {
            await categoryApi.remove(id);
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || "Xóa danh mục thất bại.");
        }
    };

    return (
        <div>
            <h1>Quản lý danh mục</h1>

            <div>
                <input
                    placeholder="Tìm danh mục..."
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
                <button onClick={handleSearch}>Tìm kiếm</button>
                <Link to="/categories/create">Thêm danh mục</Link>
            </div>

            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>Tổng số: {count}</p>

            <table border="1" cellPadding="8" width="100%">
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
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>{category.is_active ? "Hoạt động" : "Ẩn"}</td>
                            <td>
                                <Link to={`/categories/${category.id}/edit`}>Sửa</Link>
                                {" | "}
                                <button onClick={() => handleDelete(category.id)}>Xóa</button>
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

export default CategoryListPage;
