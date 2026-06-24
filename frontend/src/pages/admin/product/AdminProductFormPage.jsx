import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { categoryApi } from "../../api/categoryApi";
import { productApi } from "../../api/productApi";

function AdminProductFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        category: "",
        name: "",
        sku: "",
        description: "",
        price: "",
        quantity: "",
        image_url: "",
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCategories = async () => {
        const response = await categoryApi.getAll({
            page_size: 100,
        });

        setCategories(response.data.data);
    };

    const fetchProduct = async () => {
        try {
            const response = await productApi.getById(id);
            const product = response.data.data;

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

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };
    const validateForm = () => {
        const newErrors = {};

        if (!formData.category) {
            newErrors.category = "Vui lòng chọn danh mục";
        }

        if (!formData.sku.trim()) {
            newErrors.sku = "SKU không được để trống";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Tên sản phẩm không được để trống";
        }

        if (
            formData.price === "" ||
            formData.price === null
        ) {
            newErrors.price = "Vui lòng nhập giá";
        } else if (
            Number(formData.price) <= 0
        ) {
            newErrors.price = "Giá phải lớn hơn 0";
        }

        if (
            formData.quantity === "" ||
            formData.quantity === null
        ) {
            newErrors.quantity =
                "Vui lòng nhập số lượng";
        } else if (
            Number(formData.quantity) < 0
        ) {
            newErrors.quantity =
                "Số lượng không hợp lệ";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

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

            const apiErrors =
                error.response?.data?.errors;

            if (apiErrors) {

                const newErrors = {};

                Object.keys(apiErrors).forEach(
                    (key) => {
                        newErrors[key] =
                            apiErrors[key][0];
                    }
                );

                setErrors(newErrors);
            } else {
                setError(
                    "Lưu sản phẩm thất bại."
                );
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="form-page">
            <div className="form-card">
                <div className="form-header">
                    <h1>
                        {isEditMode
                            ? "Cập nhật sản phẩm"
                            : "Thêm sản phẩm"}
                    </h1>

                    <p>
                        Quản lý thông tin sản phẩm
                    </p>
                </div>

                {error && (
                    <div className="error-alert">
                        {error}
                    </div>
                )}

                <form
                    className="product-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-grid">

                        <div className="form-group">
                            <label>Danh mục</label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}


                            >
                                <option value="">
                                    Chọn danh mục
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
                            {errors.category && (
                                <p className="field-error">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>SKU</label>

                            <input
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="SP001"
                            />
                            {errors.sku && (
                                <p className="field-error">
                                    {errors.sku}
                                </p>
                            )}
                        </div>

                        <div className="form-group full-width">
                            <label>Tên sản phẩm</label>

                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập tên sản phẩm..."

                            />
                            {errors.name && (
                                <p className="field-error">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Giá bán (VNĐ)</label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="100000"
                            />
                            {errors.price && (
                                <p className="field-error">
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Số lượng</label>

                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                            {errors.quantity && (
                                <p className="field-error">
                                    {errors.quantity}
                                </p>
                            )}
                        </div>

                        <div className="form-group full-width">
                            <label>Ảnh sản phẩm</label>

                            <input
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>

                        {formData.image_url && (
                            <div className="image-preview-container full-width">
                                <img
                                    src={formData.image_url}
                                    alt="preview"
                                    className="image-preview"
                                />
                            </div>
                        )}

                        <div className="form-group full-width">
                            <label>Mô tả</label>

                            <textarea
                                rows="5"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mô tả sản phẩm..."
                            />
                        </div>

                        <div className="checkbox-group full-width">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />

                            <label htmlFor="is_active">
                                Hiển thị sản phẩm
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading
                                ? "Đang lưu..."
                                : isEditMode
                                    ? "Cập nhật"
                                    : "Tạo sản phẩm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminProductFormPage;
