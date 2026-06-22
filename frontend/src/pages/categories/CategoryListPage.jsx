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
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Quản lý danh mục</h1>
                    <p>Quản lý và theo dõi danh mục sản phẩm</p>
                </div>

                <Link
                    to="/categories/create"
                    className="btn-primary"
                >
                    + Thêm danh mục
                </Link>
            </div>

            <div className="search-card">
                <input
                    className="search-input"
                    placeholder="Tìm kiếm danh mục..."
                    value={keyword}
                    onChange={(event) =>
                        setKeyword(event.target.value)
                    }
                />

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
                    <div className="summary-card">
                        Tổng số danh mục:
                        <strong> {count}</strong>
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
                                            <td>
                                                #{category.id}
                                            </td>

                                            <td>
                                                <strong>
                                                    {category.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {category.description ||
                                                    "-"}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        category.is_active
                                                            ? "status active"
                                                            : "status inactive"
                                                    }
                                                >
                                                    {category.is_active
                                                        ? "Hoạt động"
                                                        : "Ẩn"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="action-buttons">
                                                    <Link
                                                        className="btn-edit"
                                                        to={`/categories/${category.id}/edit`}
                                                    >
                                                        Sửa
                                                    </Link>

                                                    <button
                                                        className="btn-delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                category.id
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
                                            colSpan="5"
                                            className="empty-row"
                                        >
                                            Không có dữ liệu
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

    // return (
    //     <div>
    //         <h1>Quản lý danh mục</h1>

    //         <div>
    //             <input
    //                 placeholder="Tìm danh mục..."
    //                 value={keyword}
    //                 onChange={(event) => setKeyword(event.target.value)}
    //             />
    //             <button onClick={handleSearch}>Tìm kiếm</button>
    //             <Link to="/categories/create">Thêm danh mục</Link>
    //         </div>

    //         {loading && <p>Đang tải dữ liệu...</p>}
    //         {error && <p style={{ color: "red" }}>{error}</p>}

    //         <p>Tổng số: {count}</p>

    //         <table border="1" cellPadding="8" width="100%">
    //             <thead>
    //                 <tr>
    //                     <th>ID</th>
    //                     <th>Tên danh mục</th>
    //                     <th>Mô tả</th>
    //                     <th>Trạng thái</th>
    //                     <th>Thao tác</th>
    //                 </tr>
    //             </thead>

    //             <tbody>
    //                 {categories.map((category) => (
    //                     <tr key={category.id}>
    //                         <td>{category.id}</td>
    //                         <td>{category.name}</td>
    //                         <td>{category.description}</td>
    //                         <td>{category.is_active ? "Hoạt động" : "Ẩn"}</td>
    //                         <td>
    //                             <Link to={`/categories/${category.id}/edit`}>Sửa</Link>
    //                             {" | "}
    //                             <button onClick={() => handleDelete(category.id)}>Xóa</button>
    //                         </td>
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>

    //         <div style={{ marginTop: "16px" }}>
    //             <button
    //                 disabled={!previous}
    //                 onClick={() => setPage((currentPage) => currentPage - 1)}
    //             >
    //                 Trang trước
    //             </button>

    //             <span style={{ margin: "0 12px" }}>Trang {page}</span>

    //             <button
    //                 disabled={!next}
    //                 onClick={() => setPage((currentPage) => currentPage + 1)}
    //             >
    //                 Trang sau
    //             </button>
    //         </div>
    //     </div>
    // );
}

export default CategoryListPage;
