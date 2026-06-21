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
        const { name, value, type, checked } = event.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
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
            setError("Lưu sản phẩm thất bại. Vui lòng kiểm tra dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>{isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Danh mục</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Tên sản phẩm</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>SKU</label>
                    <input
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Mô tả</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Giá</label>
                    <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Số lượng</label>
                    <input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Image URL</label>
                    <input
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                        />
                        Hoạt động
                    </label>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu"}
                </button>
            </form>
        </div>
    );
}

export default ProductFormPage;
