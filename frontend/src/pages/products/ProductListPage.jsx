import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { categoryApi } from "../../api/categoryApi";
import { productApi } from "../../api/productApi";

import { motion } from "framer-motion";
import {
    FaEdit,
    FaPlus,
    FaSearch,
    FaTrash
} from "react-icons/fa";


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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        > <div className="d-flex justify-content-between align-items-center mb-4"> <div> <h2 className="fw-bold mb-1">📦 Quản lý sản phẩm</h2> <p className="text-muted mb-0">
            Quản lý danh sách sản phẩm trong hệ thống </p> </div>


                <Link
                    to="/products/create"
                    className="btn btn-success"
                >
                    <FaPlus className="me-2" />
                    Thêm sản phẩm
                </Link>
            </div>

            <div className="row g-4 mb-4">

                <div className="col-md-3">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="card border-0 shadow-sm"
                    >
                        <div className="card-body">
                            <h6 className="text-muted">Tổng sản phẩm</h6>
                            <h2>{count}</h2>
                        </div>
                    </motion.div>
                </div>

                <div className="col-md-3">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="card border-0 shadow-sm"
                    >
                        <div className="card-body">
                            <h6 className="text-muted">Danh mục</h6>
                            <h2>{categories.length}</h2>
                        </div>
                    </motion.div>
                </div>

                <div className="col-md-3">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="card border-0 shadow-sm"
                    >
                        <div className="card-body">
                            <h6 className="text-muted">Đang hoạt động</h6>
                            <h2>
                                {products.filter(
                                    (product) => product.is_active
                                ).length}
                            </h2>
                        </div>
                    </motion.div>
                </div>

                <div className="col-md-3">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="card border-0 shadow-sm"
                    >
                        <div className="card-body">
                            <h6 className="text-muted">Tồn kho thấp</h6>
                            <h2>
                                {
                                    products.filter(
                                        (product) => product.quantity < 10
                                    ).length
                                }
                            </h2>
                        </div>
                    </motion.div>
                </div>

            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-2">

                        <div className="col-md-5">
                            <input
                                className="form-control"
                                placeholder=" Tìm sản phẩm..."
                                value={keyword}
                                onChange={(event) =>
                                    setKeyword(event.target.value)
                                }
                            />
                        </div>

                        <div className="col-md-3">
                            <select
                                className="form-select"
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
                        </div>

                        <div className="col-md-2">
                            <button
                                onClick={handleSearch}
                                className="btn btn-primary w-100"
                            >
                                <FaSearch className="me-2" />
                                Tìm kiếm
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {loading && (
                <div className="alert alert-info">
                    Đang tải dữ liệu...
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="card border-0 shadow-sm">
                <div className="card-body">

                    <table className="table table-hover align-middle">

                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Tên sản phẩm</th>
                                <th>SKU</th>
                                <th>Danh mục</th>
                                <th>Giá</th>
                                <th>SL</th>
                                <th>Tồn kho</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {products.map((product) => (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <td>{product.id}</td>

                                    <td>
                                        <strong>{product.name}</strong>
                                    </td>

                                    <td>{product.sku}</td>

                                    <td>
                                        {product.category_detail?.name}
                                    </td>

                                    <td>
                                        {Number(product.price).toLocaleString()}
                                    </td>

                                    <td>{product.quantity}</td>

                                    <td>
                                        <span
                                            className={`badge ${product.quantity < 10
                                                ? "bg-danger"
                                                : "bg-success"
                                                }`}
                                        >
                                            {product.stock_status}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`badge ${product.is_active
                                                ? "bg-success"
                                                : "bg-secondary"
                                                }`}
                                        >
                                            {product.is_active
                                                ? "Hoạt động"
                                                : "Ẩn"}
                                        </span>
                                    </td>

                                    <td>
                                        <Link
                                            className="btn btn-warning btn-sm me-2"
                                            to={`/products/${product.id}/edit`}
                                        >
                                            <FaEdit />
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}

                        </tbody>

                    </table>

                    <div className="d-flex justify-content-center gap-2 mt-4">

                        <button
                            className="btn btn-outline-primary"
                            disabled={!previous}
                            onClick={() =>
                                setPage(
                                    (currentPage) =>
                                        currentPage - 1
                                )
                            }
                        >
                            ← Trước
                        </button>

                        <span className="align-self-center fw-bold">
                            Trang {page}
                        </span>

                        <button
                            className="btn btn-outline-primary"
                            disabled={!next}
                            onClick={() =>
                                setPage(
                                    (currentPage) =>
                                        currentPage + 1
                                )
                            }
                        >
                            Sau →
                        </button>

                    </div>

                </div>
            </div>
        </motion.div>


    );
}

export default ProductListPage;
