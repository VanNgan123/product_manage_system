
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { categoryApi } from "../../api/categoryApi";
import { productApi } from "../../api/productApi";

function ProductFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        category: "",
        name: "",
        sku: "",
        description: "",
        price: "",
        quantity: 0,
        image_url: "",
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCategories = async () => {
        try {
            const response = await categoryApi.getAll({
                page_size: 100,
            });

            setCategories(
                response.data.results ||
                response.data.data ||
                []
            );
        } catch (error) {
            console.log(error);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await productApi.getById(id);

            const product =
                response.data.data || response.data;

            setFormData({
                category: product.category || "",
                name: product.name || "",
                sku: product.sku || "",
                description: product.description || "",
                price: product.price || "",
                quantity: product.quantity || 0,
                image_url: product.image_url || "",
                is_active: product.is_active,
            });
        } catch (error) {
            setError("Không thể tải thông tin sản phẩm.");
        }
    };

    useEffect(() => {
        fetchCategories();

        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const handleChange = (event) => {
        const { name, value, type, checked } =
            event.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            const payload = {
                ...formData,
                category: Number(formData.category),
                quantity: Number(formData.quantity),
            };

            if (isEditMode) {
                await productApi.update(id, payload);
            } else {
                await productApi.create(payload);
            }

            navigate("/products");
        } catch (error) {
            setError(
                "Lưu sản phẩm thất bại. Vui lòng kiểm tra dữ liệu."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div
                style={{
                    background:
                        "linear-gradient(135deg,#6366f1,#3b82f6)",
                    color: "#fff",
                    padding: "25px",
                    borderRadius: "24px",
                    marginBottom: "25px",
                }}
            >
                <h2>
                    {isEditMode
                        ? "✏️ Cập nhật sản phẩm"
                        : "📦 Thêm sản phẩm"}
                </h2>

                <p
                    style={{
                        margin: 0,
                        opacity: 0.9,
                    }}
                >
                    Quản lý thông tin sản phẩm
                </p>
            </div>

            <div
                style={{
                    background: "#fff",
                    borderRadius: "24px",
                    padding: "30px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,.08)",
                }}
            >
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Danh mục
                            </label>

                            <select
                                className="form-select"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Chọn danh mục
                                </option>

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Tên sản phẩm
                            </label>

                            <input
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                SKU
                            </label>

                            <input
                                className="form-control"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                            <label className="form-label">
                                Giá
                            </label>

                            <input
                                className="form-control"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                            <label className="form-label">
                                Số lượng
                            </label>

                            <input
                                className="form-control"
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="form-label">
                                Mô tả
                            </label>

                            <textarea
                                rows="4"
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* <div className="col-md-12 mb-3">
                            <label className="form-label">
                                Image URL
                            </label>

                            <input
                                className="form-control"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                            />
                        </div>

                        {formData.image_url && (
                            <div className="col-md-12 mb-4">
                                <img
                                    src={formData.image_url}
                                    alt="preview"
                                    style={{
                                        width: 220,
                                        borderRadius: 16,
                                        border:
                                            "1px solid #ddd",
                                    }}
                                />
                            </div>
                        )} */}

                        <div className="col-md-12 mb-4">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="is_active"
                                    checked={
                                        formData.is_active
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <label className="form-check-label">
                                    Hoạt động
                                </label>
                            </div>
                        </div>

                        <div className="col-md-12 d-flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                {loading
                                    ? "Đang lưu..."
                                    : " Lưu sản phẩm"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    navigate(
                                        "/products"
                                    )
                                }
                            >
                                Quay lại
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default ProductFormPage;
